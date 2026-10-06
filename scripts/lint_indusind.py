"""IndusInd lint: the 26 rules of IND-B3 §8. Called by scripts/lint_terms.py (and by the fixtures in test_checks.py).

Runs on: the IndusInd UI copy (string literals and JSX text in frontend/{components,lib}/indusind-v1 and frontend/app/role-based/indusind_bank), the
register files (data/public/), the internal seed (data/seed/indusind_v1/), the page payloads and the Ask LisN answer
bank (data/out/indusind_v1/) and, when a build exists, the built IndusInd pages. Rule IND-DEC7 (DEC-7): no other client's name in any of these. Every hit starts with its rule
number ("IND-R07 ...") so a fixture can tell which rule fired. Each rule fails the build.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
FE = ROOT / "frontend"
UI_DIRS = [FE / "app" / "role-based" / "indusind_bank", FE / "components" / "indusind-v1", FE / "lib" / "indusind-v1"]
PUBLIC = ROOT / "data" / "public"
SEED = ROOT / "data" / "seed" / "indusind_v1"
OUT = ROOT / "data" / "out" / "indusind_v1"
BUILD = FE / ".next" / "server" / "app" / "role-based" / "indusind_bank"
CONFIG = ROOT / "config" / "indusind.yaml"
# Rule 21: discovery names, filled locally and never committed. IND-B3 names the file lint_local_terms.txt; the repo's
# existing local list is lint_terms_local.txt. Both are read (IndusInd V1, IV-11).
LOCAL_FILES = [ROOT / "scripts" / "lint_local_terms.txt", ROOT / "scripts" / "lint_terms_local.txt"]

# DEC-7: other clients' names (scripts/indusind_other_clients.json). None may be reachable from an IndusInd page.
_OTHER = ROOT / "scripts" / "indusind_other_clients.json"
OTHER_CLIENTS = json.loads(_OTHER.read_text(encoding="utf-8"))["names"] if _OTHER.exists() else []
OTHER_RX = re.compile(r"(?<![A-Za-z])(?:" + "|".join(re.escape(n) for n in OTHER_CLIENTS) + r")(?![A-Za-z])") if OTHER_CLIENTS else None

BANKS = r"(?:IndusInd|Federal|Yes|IDFC|Kotak|RBL|AU|Bandhan|HDFC|ICICI|Axis|SBI)"
MONTH = r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*"
ALLOWED_FRAUD = "Fraud and impersonation (customers targeted)"
FIGURE = re.compile(r"(?:₹\s?\d|\d[\d,]*(?:\.\d+)?\s?(?:%|crore|lakh|bp\b|pts?\b|days?\b))")


def near(text: str, a: str, b: str, n: int, flags=re.I) -> bool:
    """True when a match of a and a match of b sit within n characters of each other."""
    for m in re.finditer(a, text, flags):
        lo, hi = max(0, m.start() - n), m.end() + n
        if re.search(b, text[lo:hi], flags):
            return True
    return False


DOCS = ROOT / "docs" / "indusind"
OWNER_STOP = {"Claude", "Code", "Fresh", "Dev", "CC", "Track", "Owner", "Who", "Bank", "IndusInd", "Head", "Chief", "Officer"}
INTERNAL_ID = re.compile(r"\bIND-[A-Z]\d|\bDEC-\d|\bS-(?:HOME|DEP|PEER|RISK|CARDS|APPR|VF|MICRO|APP)\b|\bV[12]\b|"
                         r"\bCF-\d\d|\bIV-\d\d|\bHL-\d\d|\bT[1-6]\b")


def internal_names() -> list[str]:
    """HL-06: people's names, seeded from the briefs: every capitalised word in an Owner or Who column of a table in
    docs/indusind/*.md, less role and business words (anything the config also uses). Never whitelisted."""
    names = set()
    for f in sorted(DOCS.glob("*.md")) if DOCS.exists() else []:
        col = None
        for line in f.read_text(encoding="utf-8").splitlines():
            if not line.startswith("|"):
                col = None
                continue
            cells = [c.strip() for c in line.strip("|").split("|")]
            if col is None:
                col = next((i for i, c in enumerate(cells) if c.strip("* ") in ("Owner", "Who")), -1)
                continue
            if 0 <= col < len(cells):
                for w in re.findall(r"\b[A-Z][a-z]{2,}\b", cells[col].replace("*", "")):
                    if w not in OWNER_STOP:
                        names.add(w)
    # Role and business words (Banking, Digital, Compliance) also appear in the config; people's names never do.
    vocab = set(re.findall(r"[A-Za-z]+", CONFIG.read_text(encoding="utf-8"))) if CONFIG.exists() else set()
    return sorted(n for n in names if n not in vocab)


INTERNAL_NAMES = internal_names()
# IND-D1 §8 and its "Do not show" item 15: leaders and former holders named in the verification. None may appear on a
# screen (DEC-9: roles only).
PEOPLE = re.compile(r"Rajiv Anand|Viral Damania|Saurav Saha|Sunil Kumar Singh|Balaji Narayanamurthy|Ravi Pangal|"
                    r"Jagdeep Mallareddy|Ganesh Sankaran|Sunit Madan|Niraj Shah|Indrajit Yadav|Sachin Patange|"
                    r"Vivek Bajpeyi|Kunal Shah|Shiv Kumar|Pankaj Sharma|Bhasin|Ejaz Nazeer")
CRAWLED_ROUTES = 0  # routes whose rendered text was linted (set by run())


def local_terms() -> list[str]:
    out = ["champion", "KNOW"]
    for f in LOCAL_FILES:
        if f.exists():
            out += [t.strip() for t in f.read_text(encoding="utf-8").splitlines() if t.strip() and not t.strip().startswith("#")]
    return out


def text_rules(s: str, where: str, flags: dict, local: list[str]) -> list[str]:
    """Rules that read one piece of text."""
    h = []
    add = lambda n, why: h.append(f"IND-R{n:02d} {where}: {why}: {s[:90]!r}")  # noqa: E731
    if near(s, r"microfinance", r"31,417", 40) or "31,417" in s:
        add(1, "Rural Banking figure, or microfinance beside it")
    if re.search(r"\b(HDFC|ICICI|Axis|SBI)\b", s):
        add(2, "a bank outside the peer set")
    if near(s, r"closest peer", BANKS, 80):
        add(3, "closest peer named")
    if re.search(r"6,?200 crore", s):
        add(4, "do-not-show figure")
    if near(s, r"IDFC", r"5\.96%", 80) and "cost of funds" not in s.lower():
        add(5, "IDFC First 5.96% without 'cost of funds'")
    if "RBL" in s and "29.21%" in s:
        add(6, "RBL with 29.21%")
    if re.search(r"1,22,331|122331|25,616|25616", s):
        add(7, "do-not-show figure")
    if not flags.get("manual_read_logged") and "IndusInd" in s and (
            re.search(r"\b(?:2\.50|3\.00|4\.00|5\.00|7\.05)%", s) or re.search(r"\b(?:FD|savings?)\b[^.]{0,60}\d+\.\d{1,2}%", s, re.I)):
        add(8, "an IndusInd rate before the manual read is logged")
    if "IDFC" in s and re.search(r"\b(?:FD|savings?|rate card)\b", s, re.I) and re.search(r"\d+\.\d{1,2}%", s):
        add(9, "IDFC First rate-card value")
    if re.search(r"\bYes\b", s) and "7.00%" in s and re.search(r"saving", s, re.I):
        add(10, "Yes Bank 7.00% on savings")
    if near(s, r"5\.68%", r"cost of funds", 80) or near(s, r"5\.25%", r"Federal", 80):
        add(11, "fact-pack error")
    if near(s, r"\b4\.7\b", r"INDIE", 40) or "8.11 lakh" in s:
        add(12, "wrong rating")
    if near(s, r"24 Dec", r"SFIO", 80):
        add(13, "do-not-show date")
    if re.search(r"14 Nov 2026|14 May 2027", s) or near(s, r"DPDP", rf"\b\d{{1,2}}\s+{MONTH}\b", 80):
        add(14, "a DPDP date with a day")
    if re.search(r"quarterly root-cause", s, re.I):
        add(15, "'quarterly root-cause'")
    if re.search(r"Bhasin|Pankaj Sharma|Ejaz Nazeer", s):
        add(16, "a person's name")
    if re.search(r"\bQ2 FY27\b|\bH1 FY27\b", s):
        add(17, "Q2 guard")
    if re.search(r"\b(?:Imperia|Regalia|Infinia|Millennia|Diners|PayZapp|SmartBuy|MyCards|Vidya|Anjani|Shashi|Neev)\b", s):
        add(20, "HDFC leakage")
    for t in local:
        if re.search(rf"(?<![A-Za-z]){re.escape(t)}(?![A-Za-z])", s, 0 if t == "KNOW" else re.I):
            add(21, f"licensed or discovery term {t!r}")
    if re.search(r"\brun-off\b|\brun on\b|real-time|sentiment score|net sentiment|\bchurn\b", s, re.I):
        add(22, "tone")
    t = s.replace(ALLOWED_FRAUD, "")
    if near(t, r"\bfraud\b", r"IndusInd|the bank", 60):
        add(23, "fraud near the bank")
    if near(s, r"\b(?:replace|replaces|instead of)\b", r"\b(?:MIS|BI|CRM)\b|data team", 40):
        add(24, "product boundary")
    if re.search(r"(?<![A-Za-z])(?:LiSN|Lisn)(?![A-Za-z])", s):
        add(26, "brand spelling")
    # IND-D1 "Do not show" items IND-B3 §8 did not cover (IND-D1 numbering).
    if near(s, r"IRDAI", rf"\d{{1,2}}\s+{MONTH}|grievance|Corporate Agents|Reg(?:ulation)?\.? ?20|policyholder", 120):
        h.append(f"IND-DN10 {where}: the IRDAI penalty with a date or grounds: {s[:90]!r}")
    if near(s, r"(?<![\d.])4\.[67](?![\d%])", r"INDIE|Play|App Store|store rating|stars?\b", 40):
        h.append(f"IND-DN14 {where}: 4.6 or 4.7 presented as a store rating: {s[:90]!r}")
    if re.search(PEOPLE, s):
        h.append(f"IND-DN15 {where}: a named person (IND-D1 §8; DEC-9): {s[:90]!r}")
    if near(s, r"Federal", r"(?:up|rose|rise|higher|increase)[^.]{0,30}\bQoQ\b|\bQoQ\b[^.]{0,20}(?:up|rise|higher)", 80):
        h.append(f"IND-DN16 {where}: Federal CASA up QoQ (only the YoY rise is confirmed): {s[:90]!r}")
    if near(s, r"\bFY27\b", r"guidance|\bNIM\b|credit[- ]cost|deposit growth", 80) and re.search(r"\d+(?:\.\d+)?\s?(?:%|bp)", s) \
            and not re.search(r"exit (?:FY27 )?RoA|in line with (?:the )?market", s, re.I):
        h.append(f"IND-DN17 {where}: numeric FY27 guidance beyond the two stated points: {s[:90]!r}")
    if re.search(r"69,?204|14,?904", s):
        h.append(f"IND-DN06 {where}: the FY25 annual-report complaint figures (BRSR N31 and N32 are the register's): {s[:90]!r}")
    # Carry-forward rules from the HDFC build (docs/indusind/carry_forward_from_hdfc.md).
    if INTERNAL_ID.search(s) or any(re.search(rf"\b{n}\b", s) for n in INTERNAL_NAMES):
        h.append(f"IND-HL06 {where}: an internal label or a team member's name: {s[:90]!r}")
    if OTHER_RX and OTHER_RX.search(s):
        h.append(f"IND-DEC7 {where}: another client's name (DEC-7): {s[:90]!r}")
    if "16 Jan 2026" in s:
        h.append(f"IND-HL28 {where}: the HDFC Internal Ombudsman Directions date (IndusInd uses N37): {s[:90]!r}")
    return h


def length_rules(text: str, where: str) -> list[str]:
    """HL-22: section subtitles at most 6 words (the `sub` of a tile); theme paraphrases at most 12 words."""
    h = []
    for m in re.finditer(r'\bsub="([^"]+)"', text):
        if len(m.group(1).split()) > 6:
            h.append(f"IND-HL22 {where}: subtitle over 6 words: {m.group(1)!r}")
    return h


def paraphrase_rules(themes: dict, where: str) -> list[str]:
    return [f"IND-HL22 {where}: paraphrase over 12 words: {t['paraphrase']!r}"
            for t in themes.values() if len(t["paraphrase"].split()) > 12]


def tile_rules(s: str, where: str) -> list[str]:
    """Rule 25: in sensitivity or penalty tiles only."""
    if re.search(r"\bsaving\b|savings? (?:of|on) ₹", s, re.I):
        return [f"IND-R25 {where}: 'saving' in a sensitivity or penalty tile: {s[:90]!r}"]
    return []


def walk(o, path: str, out: list):
    if isinstance(o, dict):
        for k, v in o.items():
            walk(v, f"{path}.{k}", out)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            walk(v, f"{path}[{i}]", out)
    elif isinstance(o, str):
        out.append((path, o))


TILE_KEYS = re.compile(r"\.(?:sensitivity|chips|how_high|penalties)(?:\[|\.|$)")


def structure_rules(payloads: dict, sensitivities: list, deposits: list, flags: dict) -> list[str]:
    h = []
    # 17: no L3 balance, ratio or share dated after 30 Jun 2026.
    for r in deposits:
        if r.get("balance_cr") is not None and r["week_ending"] > "2026-06-30":
            h.append(f"IND-R17 seed deposits_weekly {r['week_ending']}: a balance after 30 Jun 2026")
            break
    # 18: every figure on a screen is bound to an ID. A display string with a digit sits in an object with an id.
    def bound(o, path):
        if isinstance(o, dict):
            d = o.get("display")
            if isinstance(d, str) and re.search(r"\d", d) and not o.get("id"):
                h.append(f"IND-R18 {path}: a figure with no register, L2 or L3 id: {d!r}")
            for k, v in o.items():
                bound(v, f"{path}.{k}")
        elif isinstance(o, list):
            for i, v in enumerate(o):
                bound(v, f"{path}[{i}]")
    for name, obj in payloads.items():
        bound(obj, name)
    # 19: every sensitivity has its formula and inputs.
    for e in sensitivities:
        if not e.get("formula") or not e.get("inputs"):
            h.append(f"IND-R19 sensitivities {e.get('id')}: no formula or inputs")
    # 25: in sensitivity and penalty tiles.
    for name, obj in payloads.items():
        strings = []
        walk(obj, name, strings)
        for path, s in strings:
            if TILE_KEYS.search(path):
                h += tile_rules(s, path)
    for e in sensitivities:
        for k in ("label", "basis_note", "caveats"):
            h += tile_rules(str(e.get(k) or ""), f"sensitivities {e.get('id')}.{k}")
    return h


STRING = re.compile(r'"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`|\'((?:[^\'\\\n]|\\.)*)\'')
JSX_TEXT = re.compile(r">\s*([^<>{}\n;=()][^<>{}=;]*?)\s*<")


def ui_strings(text: str) -> list[str]:
    text = re.sub(r"/\*[\s\S]*?\*/", "", text)
    text = re.sub(r"(?m)^\s*//.*$", "", text)
    out = [next(g for g in m.groups() if g is not None) for m in STRING.finditer(text)]
    out += [m.group(1) for m in JSX_TEXT.finditer(text)]
    return [s for s in out if re.search(r"[A-Za-z]{3}|\d", s)]


# Words a CSS value in a style prop can carry (functions, units, keywords, and the JS names interpolated into it).
CSS_WORDS = {"calc", "translate", "translatex", "translatey", "repeat", "minmax", "min", "max", "auto", "fit", "fill",
             "px", "fr", "em", "rem", "vh", "vw", "deg", "ms", "var", "inset", "x", "y", "n", "gap", "share"}


def css_only(s: str) -> bool:
    """True for a layout value such as 'translateX(-50%)' or 'calc(100% + 6px)': every word is CSS, so a % in it is
    geometry, not a figure."""
    t = re.sub(r"\$\{[^{}]*\}", " ", s)
    words = re.findall(r"[A-Za-z]+", t)
    return all(w.lower() in CSS_WORDS for w in words) and not re.search(r"₹|crore|lakh|\bbp\b|\bpts\b|\bdays?\b", t)


def ui_figures(s: str, where: str) -> list[str]:
    """Rule 18 for the source: no figure typed into a component (₹, %, crore, lakh, bp, days next to a number). CSS
    layout values are not figures."""
    if FIGURE.search(s) and not css_only(s) and not re.fullmatch(r"[\w\s.:%()/-]*\d+(?:px|ms|s|fr|em|rem|vw|vh|deg)\b.*", s):
        return [f"IND-R18 {where}: a figure typed into a component: {s[:90]!r}"]
    return []


def load_payloads() -> dict:
    return {f.stem: json.loads(f.read_text(encoding="utf-8")) for f in sorted(OUT.glob("*.json"))} if OUT.exists() else {}


def run() -> tuple[list[str], int]:
    flags = (yaml.safe_load(CONFIG.read_text(encoding="utf-8")) or {}).get("flags", {}) if CONFIG.exists() else {}
    local = local_terms()
    hits: list[str] = []
    scanned = 0
    # UI copy
    for d in UI_DIRS:
        if not d.exists():
            continue
        for f in sorted(d.rglob("*.ts*")):
            rel = str(f.relative_to(ROOT))
            hits += length_rules(f.read_text(encoding="utf-8"), rel)
            for s in ui_strings(f.read_text(encoding="utf-8")):
                if s.startswith(("@/", "./", "../", "/role-based/indusind_bank", "http")) or re.fullmatch(r"[\w\s./:#?&=,%()-]+", s) and not re.search(r"[A-Za-z]{3,}\s+[A-Za-z]{3,}", s):
                    hits += [x for x in ui_figures(s, rel)]
                    continue
                hits += text_rules(s, rel, flags, local)
                hits += ui_figures(s, rel)
            scanned += 1
    # Register files, seed and payloads (the payloads are what the routes render, including the Ask LisN answer bank)
    files = sorted(PUBLIC.glob("indusind_*.json")) + sorted(SEED.glob("*.json")) + sorted(OUT.glob("*.json"))
    for f in files:
        strings = []
        doc = json.loads(f.read_text(encoding="utf-8"))
        if isinstance(doc, dict) and isinstance(doc.get("entries"), list):
            # Register entries kept for the record but never shown (N15, N17) are not copy; payloads are still linted.
            doc = {**doc, "entries": [e for e in doc["entries"] if not e.get("not_in_copy")]}
        walk(doc, str(f.relative_to(ROOT)), strings)
        for path, s in strings:
            if ("owners_reference" in path and ".names" not in path) or path.endswith((".build_note", ".about")):
                continue  # build notes and file descriptions are for the team, never rendered
            hits += text_rules(s, path, flags, local)
        scanned += 1
    cfg = yaml.safe_load(CONFIG.read_text(encoding="utf-8")) if CONFIG.exists() else {}
    hits += paraphrase_rules((cfg.get("l2") or {}).get("themes", {}), "config/indusind.yaml l2.themes")
    sens = json.loads((PUBLIC / "indusind_sensitivities.json").read_text(encoding="utf-8"))["entries"] if (PUBLIC / "indusind_sensitivities.json").exists() else []
    deposits = json.loads((SEED / "deposits_weekly.json").read_text(encoding="utf-8")) if (SEED / "deposits_weekly.json").exists() else []
    hits += structure_rules(load_payloads(), sens, deposits, flags)
    # Built pages (text only)
    if BUILD.exists():
        for f in sorted(BUILD.rglob("*")):
            if f.suffix in (".html", ".rsc", ".txt") or (f.is_file() and f.suffix == "" and f.stat().st_size < 5_000_000):
                try:
                    text = f.read_text(encoding="utf-8")
                except (UnicodeDecodeError, IsADirectoryError):
                    continue
                visible = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>|<[^>]+>", " ", text) if f.suffix == ".html" else text
                hits += text_rules(visible, str(f.relative_to(ROOT)), flags, local)
                scanned += 1
    # Rendered text of every route reachable from /role-based/indusind_bank (scripts/qa_indusind_routes.mjs).
    global CRAWLED_ROUTES
    crawl = ROOT / "qa" / "_crawl" / "pages.json"
    if crawl.exists():
        CRAWLED_ROUTES = len(json.loads(crawl.read_text(encoding="utf-8")))
        for page in json.loads(crawl.read_text(encoding="utf-8")):
            for line in page["text"].splitlines():
                # The role page's "V1" and "V2" version tags are shown by request (IV-66, IV-68); it is the only place it is allowed.
                if page["route"].split("?")[0] == "/role-based/indusind_bank":
                    line = re.sub(r"\bV[12]\b", "", line)
                if line.strip():
                    hits += text_rules(line, f"route {page['route']}", flags, local)
            scanned += 1
    # One hit per rule and place is enough to fail; keep the list readable.
    seen, out = set(), []
    for x in hits:
        key = x[:120]
        if key not in seen:
            seen.add(key)
            out.append(x)
    return out, scanned
