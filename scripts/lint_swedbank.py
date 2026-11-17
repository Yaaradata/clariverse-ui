"""Swedbank lint, scope `swedbank` (docs/swedbank/kickoff_prompt.md Step 7 and SW-D15 points 5 and 6). Called by
scripts/lint_terms.py and by the fixtures in scripts/test_checks.py.

Runs on the Swedbank UI copy (string literals and JSX text in frontend/{components,lib}/swedbank-pulse and
frontend/app/swedbank-pulse), the register (data/public/swedbank_*.json), the seed aggregates and the page payloads
including the Ask LisN answer bank (data/out/swedbank_pulse/), the built pages (.next) and the crawled text of every
route. Every hit starts with its rule id so a fixture can tell which rule fired:

- NW-INDIA  an India term (RBI, UPI, NEFT, IMPS, ₹, lakh, crore, TAT, ...).
- SW-UK     a United Kingdom term from the swap table (FOS, Financial Ombudsman, FCA, Consumer Duty, PSR, DISP, CASS,
            Faster Payments, Open Banking, £, Premier/Select/Reward as tiers, NPS, Cora, Secure message, sort code, ...).
- SW-LABEL  an internal label on screen: illustrative, synthetic, seed, mock, dummy, TODO, lorem, ANCHOR, DERIVED,
            ASSUMPTION ("Internal" on the social-inbox row is the one allowed tag).
- NW-HL06   an internal id: version tags, decision ids (NW-D, SW-D, HL-), step and screen ids.
- NW-NAME   a person's name (our team, people named in the docs).
- NW-BANK   another demo bank (HDFC, IndusInd, NatWest, RBS, Ulster, Coutts, Mettle, Sterling, Starling, Openbank).
- NW-P2     a word the NatWest fit review banned that still applies (business head, deliverable, timeline, ...).

Customer quotes (evidence text) are exempt: they are the customer's words.
"""

from __future__ import annotations

import html
import os
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FE = ROOT / "frontend"
UI_DIRS = [FE / "app" / "swedbank-pulse", FE / "components" / "swedbank-pulse", FE / "lib" / "swedbank-pulse"]
PUBLIC = ROOT / "data" / "public"
SEED = ROOT / "data" / "seed" / "swedbank_pulse"
OUT = ROOT / "data" / "out" / "swedbank_pulse"
BUILD = FE / ".next" / "server" / "app" / "swedbank-pulse"

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
    ("Banking Ombudsman Scheme", r"\bOmbudsman Scheme\b"),
    ("RBI & Government", r"RBI\s*&\s*Government"),
    ("India", r"\bIndia(?:n)?\b"),
]
INDIA_RX = [(t, re.compile(p)) for t, p in INDIA_TERMS]

# The United Kingdom register (Step 7 swap table, SW-D15 point 5). Whole words.
UK_TERMS: list[tuple[str, str]] = [
    ("Financial Ombudsman", r"\bFinancial Ombudsman\b"),
    ("FOS", r"\bFOS\b"),
    ("FCA", r"\bFCA\b"),
    ("Consumer Duty", r"\bConsumer Duty\b"),
    ("four outcomes", r"\bfour outcomes\b"),
    ("PSR", r"\bPSRs?\b"),
    ("APP reimbursement", r"\bAPP (?:scam|reimbursement)\b"),
    ("DISP", r"\bDISP\b"),
    ("CASS", r"\bCASS\b"),
    ("Faster Payments", r"\bFaster Payments?\b"),
    ("Open Banking", r"\bOpen Banking\b"),
    ("£", r"£"),
    ("pounds", r"\bpounds?\b|\bGBP\b"),
    ("Premier", r"\bPremier\b"),
    ("Select (tier)", r"\bSelect (?:account|customers?|tier)\b"),
    ("Reward (account)", r"\bReward (?:account|customers?|tier)s?\b"),
    ("NPS", r"\bNPS\b"),
    ("CMA survey", r"\bCMA\b"),
    ("Cora", r"\bCora\b"),
    ("Secure message", r"\b[Ss]ecure messag"),
    ("final response", r"\b[Ff]inal response\b"),
    ("8 weeks", r"\b8 weeks\b|\beight weeks\b"),
    ("financially vulnerable", r"\b[Ff]inancially vulnerable\b"),
    ("sort code", r"\b[Ss]ort codes?\b"),
    ("England and Wales", r"\bEngland and Wales\b|\bUnited Kingdom\b|\bUK\b"),
    ("GMT", r"\bGMT\b|\bBST\b"),
    ("Ombudsman (not Kundombudsman)", r"(?<![Kk]und)(?<![Kk]und-)\b[Oo]mbudsman\b"),
    ("PSRs 2017", r"Payment Services Regulations"),
    ("MoneySavingExpert", r"MoneySavingExpert|MSE"),
]
UK_RX = [(t, re.compile(p)) for t, p in UK_TERMS]

# Internal labels that belong in the validation file only (SW-D15 point 6). "Internal" is the one allowed tag.
LABEL_TERMS: list[tuple[str, str]] = [
    ("illustrative", r"\b[Ii]llustrative\b"),
    ("synthetic", r"\b[Ss]ynthetic\b"),
    ("seed", r"\b[Ss]eed(?:ed|s)?\b"),
    ("mock", r"\b[Mm]ock\b"),
    ("dummy", r"\b[Dd]ummy\b"),
    ("TODO", r"\bTODO\b"),
    ("lorem", r"\b[Ll]orem\b"),
    ("ANCHOR", r"\bANCHOR\b"),
    ("DERIVED", r"\bDERIVED\b"),
    ("ASSUMPTION", r"\bASSUMPTION\b"),
]
LABEL_RX = [(t, re.compile(p)) for t, p in LABEL_TERMS]
# SW-D17: no screen may say a figure is missing; reply figures come from the internal seed, every other gap is "—".
NODATA_TERMS: list[tuple[str, str]] = [
    ("no reply data", r"(?i)\bno reply data\b"),
    ("no data", r"(?i)\bno data\b"),
    ("not available", r"(?i)\bnot available\b"),
    ("n/a", r"(?i)(?<![\w/])n/a(?![\w/])"),
    ("unavailable", r"(?i)\bunavailable\b"),
    ("not fetched", r"(?i)\bnot fetched\b"),
    ("no replies found", r"(?i)\bno replies found\b"),
    # SW-D18 (Usha): every window has a comparison; provenance words belong in the validation file only.
    ("no earlier period", r"(?i)\bno earlier period\b"),
    ("assumption", r"(?i)\bassum(?:ption|ed)s?\b"),
    ("estimate", r"(?i)\bestimate[ds]?\b"),
]
NODATA_RX = [(t, re.compile(p)) for t, p in NODATA_TERMS]

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
]
P2_RX = [(t, re.compile(p)) for t, p in P2_TERMS]
# Screen-only words (NW-D59): checked on rendered pages and crawled text, where ids, routes and code are not visible.
SCREEN_TERMS: list[tuple[str, str]] = [
    ("business (not business days)", r"\b[Bb]usiness\b(?![\s-]+days?\b)"),
    ("MD's", r"\bMD(?:'|&apos;|’)?s\b"),
    ("undefined", r"\bundefined\b"),
]
SCREEN_RX = [(t, re.compile(p, re.M)) for t, p in SCREEN_TERMS]


def screen_rules(s: str, where: str) -> list[str]:
    return [f"NW-P2 {where}: banned word on screen '{t}' in: {s.strip()[:90]}" for t, rx in SCREEN_RX if rx.search(s)]

# Pass 3 (NW-D50): NatWest Retail only. The dashboard's subject is "NatWest"; other brands are never on screen, except
# the footer's excluded-brands sentence and the App pulse toggle's excluded-brands line. The register (data/public)
# keeps the legal names and is not checked by this rule.
P3_TERMS: list[tuple[str, str]] = [
    ("NatWest", r"\bNat ?West\b"),
    ("Royal Bank of Scotland", r"\bRoyal Bank of Scotland\b"),
    ("RBS", r"\bRBS\b"),
    ("Ulster", r"\bUlster\b"),
    ("Coutts", r"\bCoutts\b"),
    ("Mettle", r"\bMettle\b"),
]
P3_RX = [(t, re.compile(p)) for t, p in P3_TERMS]
P3_EXEMPT: list[str] = []
P3_EXEMPT_LIST = re.compile(r"(?!x)x")


def p3_rules(s: str, where: str) -> list[str]:
    for e in P3_EXEMPT:
        s = s.replace(e, " ")
    s = P3_EXEMPT_LIST.sub(" ", s)
    return [f"NW-BANK {where}: UK bank or brand '{t}' in: {s.strip()[:90]}" for t, rx in P3_RX if rx.search(s)]

# HL-06: internal labels. Version tags, our decision and rule ids, brief steps and screen ids.
INTERNAL_ID = re.compile(
    r"\bV[1-4]\b|\bNW-D\d*|\bSW-D\d*|\bHL-\d*|\bIND-[A-Z]\d|\bDEC-\d|\bIV-\d\d|\bFB-\d\d\d|\bD\d\d\b|\bB1[01]\b|"
    r"\bS-(?:HOME|CHANNEL|CORA|FOS|DUTY|BRAND|AGENTS)\b|\bStep [0-5](?:\.\d+)?\b|\bMORNING_DECISIONS\b"
)
# People's names: our team and anyone the internal docs name. Never whitelisted.
PEOPLE = ["Vidya", "Ranjith", "Soumya", "Somya", "Anjani", "Pradeep", "Kartik", "Usha", "Kannan"]
PEOPLE_RX = re.compile(r"(?<![A-Za-z])(?:" + "|".join(PEOPLE) + r")(?![A-Za-z])")
# Other demo banks (brief Step 1.4).
OTHER_BANKS = ["HDFC", "IndusInd", "Sterling", "Starling", "Openbank", "NatWest", "Nat West", "Coutts", "Mettle"]
BANK_RX = re.compile(r"(?<![A-Za-z])(?:" + "|".join(OTHER_BANKS) + r")(?![A-Za-z])", re.I)

# Customer voice is the customer's words; search keywords are never shown; build notes are for the team.
SKIP_KEYS = {"redacted_text", "summary_raw", "text", "gloss", "keywords", "build_note", "about", "url", "source_note_internal"}
# NW-D10: the register's peer list (key `peers`) may name the upper benchmarks. Nothing else may.
PEER_KEY = "peers"


# Ids, anchors and keys (md-ombudsman, cards-ombudsman-save, ombudsman-watch): code, never shown as words.
CODE_ID = re.compile(r"^[a-z0-9]+(?:[-_][a-z0-9]+)*$")


def text_rules(s: str, where: str, allow_peer_names: bool = False) -> list[str]:
    hits = []
    if CODE_ID.match(s.strip()):
        return hits
    for t, rx in INDIA_RX:
        if rx.search(s):
            hits.append(f"NW-INDIA {where}: India term '{t}' in: {s[:90]}")
    for t, rx in UK_RX:
        if rx.search(s):
            hits.append(f"SW-UK {where}: UK term '{t}' in: {s[:90]}")
    for t, rx in LABEL_RX:
        if rx.search(s):
            hits.append(f"SW-LABEL {where}: internal label '{t}' in: {s[:90]}")
    for t, rx in NODATA_RX:
        if rx.search(s):
            hits.append(f"SW-NODATA {where}: missing-data wording '{t}' in: {s[:90]}")
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


PUBLIC_SOURCES = {"appstore", "playstore", "x", "reddit", "trustpilot", "forum"}


def walk(o, path: str, out: list[tuple[str, str, bool]], peer: bool = False):
    if isinstance(o, dict):
        # A public item's summary and title are the customer's own words, like its text (NW-D84).
        customer = o.get("source") in PUBLIC_SOURCES or o.get("platform") in {"App Store", "Google Play", "X", "Reddit", "Trustpilot"}
        for k, v in o.items():
            if k in SKIP_KEYS or (customer and k in ("summary", "title")):
                continue
            walk(v, f"{path}.{k}", out, peer or k == PEER_KEY)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            walk(v, f"{path}[{i}]", out, peer)
    elif isinstance(o, str) and re.search(r"[A-Za-z]{2}", o) and not o.startswith(("http", "/")):
        out.append((path, o, peer))


def data_files() -> list[Path]:
    files = sorted(PUBLIC.glob("swedbank_*.json"))
    files += [SEED / "aggregates.json"] if (SEED / "aggregates.json").exists() else []
    # evidence.json holds customer quotes and the audit-only URLs; its copy keys are walked like any payload.
    files += sorted(OUT.glob("*.json")) if OUT.exists() else []
    return files


CRAWLED_ROUTES = 0


def customer_quotes() -> list[str]:
    """Customer quotes as the pages show them (evidence summary, title and text). They are the customer's own words and
    exempt from every rule here (NW-D85); the rules apply to what is left of a page once they are taken out."""
    ev = OUT / "evidence.json"
    if not ev.exists():
        return []
    out = set()
    for e in json.loads(ev.read_text(encoding="utf-8")).values():
        for k in ("summary", "title", "redacted_text", "text", "gloss"):
            v = (e.get(k) or "").strip()
            if len(v) >= 15:
                out.add(v)
                out.add(v[:120])  # pages often show the opening of a long quote
    return sorted(out, key=len, reverse=True)


def without_quotes(text: str, quotes: list[str]) -> str:
    if not quotes or not any(rx.search(text) for _t, rx in INDIA_RX + UK_RX + LABEL_RX + NODATA_RX + P2_RX + P3_RX) and not BANK_RX.search(text)             and not any(rx.search(text) for _t, rx in SCREEN_RX):
        return text
    for q in quotes:
        if q in text:
            text = text.replace(q, " ")
    return text


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
    quotes = customer_quotes()
    if BUILD.exists():
        for f in sorted(BUILD.rglob("*.html")):
            text = f.read_text(encoding="utf-8", errors="replace")
            visible = html.unescape(re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>|<[^>]+>", " ", text))
            visible = without_quotes(visible, quotes)
            hits += text_rules(visible, str(f.relative_to(ROOT)))
            hits += p3_rules(visible, str(f.relative_to(ROOT)))
            hits += screen_rules(visible, str(f.relative_to(ROOT)))
            scanned += 1
    global CRAWLED_ROUTES
    crawl = ROOT / "qa" / "_crawl" / os.environ.get("SW_CRAWL", "swedbank_pages.json")  # SW_CRAWL=swedbank_pages_fast.json in FAST mode
    if crawl.exists():
        pages = json.loads(crawl.read_text(encoding="utf-8"))
        CRAWLED_ROUTES = len(pages)
        for page in pages:
            for line in page["text"].splitlines():
                line = without_quotes(line, quotes)
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
