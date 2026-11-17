"""NatWest lint (docs/natwest/brief.md Step 1.4). Called by scripts/lint_terms.py and by the fixtures in test_checks.py.

Runs on the NatWest UI copy (string literals and JSX text in frontend/{components,lib}/natwest-pulse and
frontend/app/natwest-pulse), the register (data/public/natwest_*.json), the synthetic seed aggregates and the
page payloads including the Ask LisN answer bank (data/out/natwest_pulse/), and, when a build exists, the built NatWest
pages. Every hit starts with its rule id so a fixture can tell which rule fired:

- NW-INDIA  an India register term from the swap table (RBI, Internal Ombudsman, UPI, ₹, crore, TAT, ...).
- NW-HL06   an internal label on screen: version tags, decision, carry-forward, step and screen ids.
- NW-NAME   a person's name (our team, the bank's people named in the docs).
- NW-BANK   another demo bank's name (HDFC, IndusInd, Sterling, Starling, Openbank).
- NW-P3     "NatWest Group" as the subject, or another brand (Royal Bank of Scotland, RBS, Ulster) on screen.
- NW-P2     a word the Pass 2 fit review bans (business head, deliverable, timeline, backend, Private as a tier, bare
            "Cards" as a product name, ...).

Customer quotes (evidence text) are exempt: they are the customer's words. The register's peer list may name Starling
as an upper benchmark (NW-D10); that list, and the brand-lens route that renders it, are the only exemptions.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FE = ROOT / "frontend"
UI_DIRS = [FE / "app" / "natwest-pulse", FE / "components" / "natwest-pulse", FE / "lib" / "natwest-pulse"]
PUBLIC = ROOT / "data" / "public"
SEED = ROOT / "data" / "seed" / "natwest_pulse"
OUT = ROOT / "data" / "out" / "natwest_pulse"
BUILD = FE / ".next" / "server" / "app" / "natwest-pulse"

# The swap table (brief Step 4). Each entry: (label, regex). Whole words; "Ombudsman" alone is allowed (the Financial
# Ombudsman Service), only the Indian schemes are banned.
INDIA_TERMS: list[tuple[str, str]] = [
    ("RBI", r"\bRBI\b"),
    ("Banking Ombudsman", r"\bBanking Ombudsman\b"),
    ("Internal Ombudsman", r"\bInternal Ombudsman\b"),
    ("IO", r"\bIO\b"),
    ("RB-IOS", r"\bRB-IOS\b"),
    ("CEPD", r"\bCEPD\b"),
    ("NPCI", r"\bNPCI\b"),
    ("UPI", r"\bUPI\b"),
    ("IMPS", r"\bIMPS\b"),
    ("NEFT", r"\bNEFT\b"),
    ("RTGS", r"\bRTGS\b"),
    ("PayZapp", r"\bPayZapp\b"),
    ("INDIE", r"\bINDIE\b"),
    ("net banking", r"\b[Nn]et ?[Bb]anking\b"),
    ("Play Store leads", r"\bPlay Store leads?\b"),
    ("₹", r"₹"),
    ("crore", r"\bcrores?\b"),
    ("lakh", r"\blakhs?\b"),
    ("TAT", r"\bTATs?\b"),
    ("KYC", r"\bKYC\b"),
    ("PAN", r"\bPAN\b"),
    ("Aadhaar", r"\bAadhaar\b"),
    ("EMI", r"\bEMIs?\b"),
    ("Cards Business Head", r"\bCards Business Head\b"),
    ("RM", r"\bRMs?\b"),
    ("RBI & Government", r"RBI\s*&\s*Government"),
    ("India", r"\bIndia(?:n)?\b"),
]
INDIA_RX = [(t, re.compile(p)) for t, p in INDIA_TERMS]

# Pass 2 fit review, section 15: words that read as HDFC, internal or non-NatWest on a NatWest screen.
P2_TERMS: list[tuple[str, str]] = [
    ("business head", r"\b[Bb]usiness [Hh]eads?\b"),
    ("MD's office", r"\bMD(?:'|&apos;|’)?s office\b"),
    ("relationship tier", r"\b[Rr]elationship tiers?\b"),
    ("deliverable", r"\b[Dd]eliverables?\b"),
    ("timeline", r"\b[Tt]imelines?\b"),
    ("compensation", r"\b[Cc]ompensation\b"),
    ("closure intent", r"\b[Cc]losure intent\b"),
    ("backend", r"\b[Bb]ack-?end\b"),
    ("revert", r"\b[Rr]evert(?:s|ed|ing)?\b"),
    ("listed customer", r"\b[Ll]isted customers?\b"),
    ("data intimacy", r"\b[Dd]ata intimacy\b"),
    ("household", r"\b[Hh]ouseholds?\b"),
    ("Private (tier)", r"\bPrivate\b"),
    ("Cards (bare product name)", r"(?<![Cc]redit )(?<![Dd]ebit )\bCards\b"),
    # Independent review, round 1 (NW-D59): HDFC and India leftovers and slips the first lint missed.
    ("grievance", r"\b[Gg]rievances?\b"),
    ("list A / list B", r"\blists? [AB]\b"),
    ("relationship-manager id", r"\bRELM-\d+"),
    ("escalation id", r"\bL2-\d+"),
    ("spends", r"\bspends\b"),
    ("skip Sundays", r"\bskips? Sundays\b"),
    ("temporary credit", r"\b[Tt]emporary credit\b"),
    ("stage payment", r"\b[Ss]tage (?:payment|release)s?\b"),
    ("title deeds", r"\b[Tt]itle deeds\b"),
    ("visa application", r"\b[Vv]isa application\b"),
    ("car finance dealer", r"\b[Cc]ar finance\b|\bdealer\b"),
    ("card variant", r"\b[Vv]ariants?\b"),
    ("card card", r"\bcredit card card\b"),
    # Independent review, round 3 (fix C): Indian or US English, HDFC collection history, removed stories.
    ("under process", r"\b[Uu]nder process\b"),
    ("attorney (not power of attorney)", r"(?<!power of )\b[Aa]ttorneys?\b"),
    ("collector history", r"\bcollector changed\b|\bcapped (?:late-September )?X run\b|\bcapped collection run\b"),
    ("reply-collection claim", r"Google Play replies are collected|exports carry no reply field|bank replies were not collected|exports hold no history"),
    ("eligibility and upgrades", r"\b[Ee]ligibility and upgrades?\b"),
    ("cards (bare, lower case)", r"(?<![Cc]redit )(?<![Dd]ebit )\bcards (?:items?|team|themes?|view|business)\b"),
]
P2_RX = [(t, re.compile(p)) for t, p in P2_TERMS]
# Screen-only words (NW-D59): checked on rendered pages and crawled text, where ids, routes and code are not visible.
SCREEN_TERMS: list[tuple[str, str]] = [
    ("business (not business days)", r"\b[Bb]usiness\b(?![\s-]+days?\b)"),
    ("MD's", r"\bMD(?:'|&apos;|’)?s\b"),
    ("undefined", r"\bundefined\b"),
    ("raw standard code", r"(?:^|·\s*)(?:fca|psr)\s*$"),
    # Review round 3 (fix C): "Ombudsman" alone is ambiguous in the UK (Pass 2 section 4); say Financial Ombudsman.
    ("Ombudsman (bare)", r"(?i)(?<!financial )\bombudsman\b"),
]
SCREEN_RX = [(t, re.compile(p, re.M)) for t, p in SCREEN_TERMS]


def screen_rules(s: str, where: str) -> list[str]:
    return [f"NW-P2 {where}: banned word on screen '{t}' in: {s.strip()[:90]}" for t, rx in SCREEN_RX if rx.search(s)]

# Pass 3 (NW-D50): NatWest Retail only. The dashboard's subject is "NatWest"; other brands are never on screen, except
# the footer's excluded-brands sentence and the App pulse toggle's excluded-brands line. The register (data/public)
# keeps the legal names and is not checked by this rule.
P3_TERMS: list[tuple[str, str]] = [
    ("NatWest Group", r"\bNatWest Group\b"),
    ("Royal Bank of Scotland", r"\bRoyal Bank of Scotland\b"),
    ("RBS", r"\bRBS\b"),
    ("Ulster", r"\bUlster\b"),
]
P3_RX = [(t, re.compile(p)) for t, p in P3_TERMS]
P3_EXEMPT = [
    "Royal Bank of Scotland, Ulster Bank and group companies are excluded.",
    "Excluded brands, not loaded:",
]
P3_EXEMPT_LIST = re.compile(r"Royal Bank of Scotland\s*·?\s*Ulster Bank\s*·?\s*Coutts\s*·?\s*Mettle")


def p3_rules(s: str, where: str) -> list[str]:
    for e in P3_EXEMPT:
        s = s.replace(e, " ")
    s = P3_EXEMPT_LIST.sub(" ", s)
    return [f"NW-P3 {where}: other brand or group name '{t}' in: {s.strip()[:90]}" for t, rx in P3_RX if rx.search(s)]

# HL-06: internal labels. Version tags, our decision and rule ids, brief steps and screen ids.
INTERNAL_ID = re.compile(
    r"\bV[1-4]\b|\bNW-D\d*|\bHL-\d*|\bIND-[A-Z]\d|\bDEC-\d|\bIV-\d\d|\bFB-\d\d\d|\bD\d\d\b|\bB1[01]\b|"
    r"\bS-(?:HOME|CHANNEL|CORA|FOS|DUTY|BRAND|AGENTS)\b|\bStep [0-5](?:\.\d+)?\b|\bMORNING_DECISIONS\b"
)
# People's names: our team and anyone the internal docs name. Never whitelisted.
PEOPLE = ["Vidya", "Ranjith", "Soumya", "Somya", "Anjani", "Pradeep", "Kartik", "Usha", "Kannan"]
PEOPLE_RX = re.compile(r"(?<![A-Za-z])(?:" + "|".join(PEOPLE) + r")(?![A-Za-z])")
# Other demo banks (brief Step 1.4).
OTHER_BANKS = ["HDFC", "IndusInd", "Sterling", "Starling", "Openbank"]
BANK_RX = re.compile(r"(?<![A-Za-z])(?:" + "|".join(OTHER_BANKS) + r")(?![A-Za-z])", re.I)

# Customer voice is the customer's words; search keywords are never shown; build notes are for the team.
SKIP_KEYS = {"redacted_text", "summary_raw", "text", "keywords", "build_note", "about", "url"}
# NW-D10: the register's peer list (key `peers`) may name the upper benchmarks. Nothing else may.
PEER_KEY = "peers"


def text_rules(s: str, where: str, allow_peer_names: bool = False) -> list[str]:
    hits = []
    for t, rx in INDIA_RX:
        if rx.search(s):
            hits.append(f"NW-INDIA {where}: India term '{t}' in: {s[:90]}")
    for t, rx in P2_RX:
        if rx.search(s):
            hits.append(f"NW-P2 {where}: banned word '{t}' in: {s[:90]}")
    m = INTERNAL_ID.search(s)
    if m:
        hits.append(f"NW-HL06 {where}: internal label '{m.group(0)}' in: {s[:90]}")
    m = PEOPLE_RX.search(s)
    if m:
        hits.append(f"NW-NAME {where}: person's name '{m.group(0)}' in: {s[:90]}")
    m = BANK_RX.search(s)
    if m and not (allow_peer_names and m.group(0).lower() == "starling"):
        hits.append(f"NW-BANK {where}: other demo bank '{m.group(0)}' in: {s[:90]}")
    return hits


STRING = re.compile(r'"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`|\'((?:[^\'\\\n]|\\.)*)\'')
JSX_TEXT = re.compile(r">\s*([^<>{}\n;=()][^<>{}=;]*?)\s*<")
# Code, not copy: identifiers, import paths, hrefs, CSS.
IDENTIFIER = re.compile(r"\b\w+_\w+\b|\b[a-z]+[A-Z]\w*\b|\b[A-Z][a-z]+[A-Z]\w*\b|(?<![\w ])/[\w/\[\]-]+|@/[\w/.-]+")


def ui_strings(text: str):
    text = re.sub(r"/\*[\s\S]*?\*/", "", text)
    text = re.sub(r"(?m)^\s*//.*$", "", text)
    text = re.sub(r"(?m)\s//\s.*$", "", text)
    for m in STRING.finditer(text):
        s = next((g for g in m.groups() if g is not None), "")
        if s and re.search(r"[A-Za-z]{2}", s):
            yield s
    for m in JSX_TEXT.finditer(text):
        s = m.group(1)
        if s and re.search(r"[A-Za-z]{2}", s):
            yield s


def _ui_hits(text: str, rel: str) -> list[str]:
    hits = []
    for s in ui_strings(text):
        if s.startswith(("@/", "./", "../", "/", "http", "node:")):
            continue
        s = re.sub(r"\$\{[^}]*\}", "", s)
        hits += text_rules(IDENTIFIER.sub("", s), rel)
        hits += p3_rules(s, rel)
    return hits


def walk(o, path: str, out: list[tuple[str, str, bool]], peer: bool = False):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in SKIP_KEYS:
                continue
            walk(v, f"{path}.{k}", out, peer or k == PEER_KEY)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            walk(v, f"{path}[{i}]", out, peer)
    elif isinstance(o, str) and re.search(r"[A-Za-z]{2}", o) and not o.startswith(("http", "/")):
        out.append((path, o, peer))


def data_files() -> list[Path]:
    files = sorted(PUBLIC.glob("natwest_*.json"))
    files += [SEED / "aggregates.json"] if (SEED / "aggregates.json").exists() else []
    # evidence.json holds customer quotes and the audit-only URLs; its copy keys are walked like any payload.
    files += sorted(OUT.glob("*.json")) if OUT.exists() else []
    return files


CRAWLED_ROUTES = 0


def run() -> tuple[list[str], int]:
    hits: list[str] = []
    scanned = 0
    for d in UI_DIRS:
        if not d.exists():
            continue
        for f in sorted(d.rglob("*.ts*")):
            hits += _ui_hits(f.read_text(encoding="utf-8"), str(f.relative_to(ROOT)))
            scanned += 1
    for f in data_files():
        strings: list[tuple[str, str, bool]] = []
        walk(json.loads(f.read_text(encoding="utf-8")), str(f.relative_to(ROOT)), strings)
        for path, s, peer in strings:
            hits += text_rules(IDENTIFIER.sub("", s), path, allow_peer_names=peer)
            if PUBLIC not in f.parents:
                hits += p3_rules(s, path)
        scanned += 1
    if BUILD.exists():
        for f in sorted(BUILD.rglob("*.html")):
            text = f.read_text(encoding="utf-8", errors="replace")
            visible = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>|<[^>]+>", " ", text)
            hits += text_rules(visible, str(f.relative_to(ROOT)))
            hits += p3_rules(visible, str(f.relative_to(ROOT)))
            hits += screen_rules(visible, str(f.relative_to(ROOT)))
            scanned += 1
    global CRAWLED_ROUTES
    crawl = ROOT / "qa" / "_crawl" / "natwest_pages.json"
    if crawl.exists():
        pages = json.loads(crawl.read_text(encoding="utf-8"))
        CRAWLED_ROUTES = len(pages)
        for page in pages:
            for line in page["text"].splitlines():
                if line.strip():
                    hits += text_rules(line, f"route {page['route']}", allow_peer_names=page["route"].split("?")[0].endswith("/market"))
                    hits += p3_rules(line, f"route {page['route']}")
                    hits += screen_rules(line, f"route {page['route']}")
            scanned += 1
    seen, out = set(), []
    for x in hits:
        if x[:140] not in seen:
            seen.add(x[:140])
            out.append(x)
    return out, scanned
