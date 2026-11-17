"""PII scan of the data the screens render (B4 §8): phones, emails, 10+ digit numbers, UPI IDs, PAN, Aadhaar, and
people's names and social handles (B7 §E2: never name a real person).

Names use the same rule-based detector as the pipeline's redaction (scripts/pii_names.py): a denylist of known public
figures, honorifics, name lexicons, role words and address position, plus handles outside the institutional allowlist.
It scans every data file the V2 screens load (frontend/lib/hdfc-v3/load.ts) and the committed labelling batches.
Source links (follow-up fix 1): V2 never links to the original post. Store review links, X/Twitter status URLs,
Reddit comment threads and forum domains must not appear in the V2 UI code or in the built V2 page payloads
(`frontend/.next`, when a build exists). evidence.json keeps the URLs server-side for audit and is not scanned for them.

Exit code 1 on any hit. `scan(paths)` and `scan_links(paths)` are importable for tests (scripts/test_check_pii.py).
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pii_names import names_in

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    *sorted((ROOT / "data" / "seed" / "internal_v3").glob("*.json")),
    ROOT / "data" / "seed" / "internal_v3" / "interactions.jsonl",
    ROOT / "data" / "seed" / "internal_v3" / "complaints.jsonl",
    *sorted((ROOT / "data" / "out" / "app_jul_sep").glob("*.json")),
    *sorted((ROOT / "data" / "out" / "app_jul_sep" / "work" / "llm_batches").glob("batch_*.jsonl")),
    # V1 (first demo) is still served at /hdfc-pulse/v1.
    *sorted((ROOT / "data" / "out" / "app").glob("*.json")),
    # IndusInd: register files, internal seed and page payloads.
    *sorted((ROOT / "data" / "public").glob("indusind_*.json")),
    *sorted((ROOT / "data" / "seed" / "indusind_v1").glob("*.json")),
    ROOT / "data" / "seed" / "indusind_v1" / "complaints.jsonl",
    *sorted((ROOT / "data" / "out" / "indusind_v1").glob("*.json")),
    # IndusInd public voice: the processed store, the hand-written glosses and overrides, and the gitignored redacted
    # text (scanned when present, to prove the redaction held).
    *sorted((ROOT / "data" / "processed" / "indusind_l2").glob("*.json*")),
    *[f for f in [ROOT / "data" / "processed" / "indusind_l2" / "_audit" / "text.jsonl"] if f.exists()],
    ROOT / "scripts" / "indusind_l2_glosses.json",
    ROOT / "scripts" / "indusind_l2_manual.json",
]
# NatWest (docs/natwest/brief.md Step 1.5): register, synthetic seed and page payloads. The UK patterns below run on
# these files only (an 8-digit run or a dd-dd-dd group means something else in the Indian data).
NATWEST_FILES = [
    *sorted((ROOT / "data" / "public").glob("natwest_*.json")),
    *sorted((ROOT / "data" / "seed" / "natwest_pulse").glob("*.json")),
    *sorted((ROOT / "data" / "seed" / "natwest_pulse").glob("*.jsonl")),
    *sorted((ROOT / "data" / "out" / "natwest_pulse").glob("*.json")),
]
FILES += NATWEST_FILES
# Swedbank (docs/swedbank/kickoff_prompt.md SW-D15 point 10): register, internal data, page payloads, the gitignored
# redacted public text when present, and the built pages. The Swedish rules below run on these files and pages only.
SWEDBANK_FILES = [
    *sorted((ROOT / "data" / "public").glob("swedbank_*.json")),
    *sorted((ROOT / "data" / "seed" / "swedbank_pulse").glob("*.json")),
    *sorted((ROOT / "data" / "seed" / "swedbank_pulse").glob("*.jsonl")),
    *sorted((ROOT / "data" / "out" / "swedbank_pulse").glob("*.json")),
    *[f for f in [ROOT / "data" / "out" / "swedbank_pulse" / "work" / "classified.jsonl"] if f.exists()],
]
FILES += SWEDBANK_FILES
PATTERNS = {
    "email": r"[\w.+-]+@[\w-]+\.[\w.-]+",
    "phone": r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)",
    "long_number": r"(?<![\d.])\d{10,}(?![\d.])",
    "upi": r"\b[\w.-]{2,}@(?:ok\w+|ybl|paytm|upi|ibl|axl|hdfcbank|icici|sbi)\b",
    "pan": r"\b[A-Z]{5}\d{4}[A-Z]\b",
    "aadhaar": r"(?<!\d)\d{4}\s\d{4}\s\d{4}(?!\d)",
}
UK_PATTERNS = {
    "uk_mobile": r"(?<![\d+])(?:\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}(?!\d)",
    "uk_phone_intl": r"\+44[\s\d()-]{9,14}\d",
    "sort_code": r"(?<![\d-])\d{2}-\d{2}-\d{2}(?![\d-])",
    "account_number_8": r"(?<![\d.,£-])\d{8}(?![\d.,%])",
    "card_number": r"(?<!\d)\d{4}(?:[ -]\d{4}){2,3}(?:[ -]?\d{1,3})?(?!\d)|(?<![\d.])\d{12,19}(?![\d.])",
    "ni_number": r"\b[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b",
}
# Swedish personal data: personnummer (YYMMDD-NNNN, YYYYMMDD[-]NNNN), mobiles (07x and +46 7x), clearing + account
# numbers (4–5 digit clearing, a dash or comma, then 7–10 digits), Swedish IBANs, bankgiro-style 7–8 digit runs with a
# dash are left to the account rule. ISO dates and record ids are stripped before these run.
SE_PATTERNS = {
    "personnummer": r"(?<![\d-])(?:\d{6}[-+]\d{4}|(?:19|20)\d{6}[-+]?\d{4})(?![\d-])",
    "se_mobile": r"(?<![\d+])07\d[- ]?\d{3}[- ]?\d{2}[- ]?\d{2}(?!\d)|\+46[\s-]?7\d(?:[\s-]?\d){7}(?!\d)",
    "clearing_account": r"(?<![\d-])[3-9]\d{3}(?:-\d)?[\s,-]+\d{1,3}[\s ]?\d{3}[\s ]?\d{3}[- ]?\d(?!\d)",
    "iban": r"\b[A-Z]{2}\d{2}(?:\s?\d{4}){3,7}\b|\b(?:SE|EE|LV|LT)\d{2}[A-Z0-9]{10,30}\b",
    "card_number": r"(?<!\d)\d{4}(?:[ -]\d{4}){2,3}(?:[ -]?\d{1,3})?(?!\d)|(?<![\d.])\d{12,19}(?![\d.])",
}
# Hashed author handles: a key that names an author or handle, or a hex digest standing in for one.
HANDLE_KEYS = {"author", "author_hash", "author_id", "handle", "user", "username", "user_id", "screen_name"}
HASH_RX = re.compile(r"\b[0-9a-f]{16,64}\b")
# A public record id ("trustpilot:6af3…", the source's own review id) is not a hashed handle (NW-D84).
RECORD_ID_RX = re.compile(r"^(?:appstore|playstore|x|reddit|trustpilot|forum):[0-9a-zA-Z_-]+$")

# Record ids and source links identify public posts; they are not personal data.
ID_RE = re.compile(r'"(?:appstore|playstore|x|reddit|technofino|trustpilot|mouthshut|consumercomplaints|complaintsboard)[:_][^"]*"')
URL_RE = re.compile(r"https?://[^\s\"]+")

SOURCE_LINK_PATTERNS = {
    "store_review_link": r"play\.google\.com/store/apps|apps\.apple\.com/",
    "x_status_link": r"(?:x|twitter)\.com/(?:i|[A-Za-z0-9_]+)/status",
    "reddit_thread_link": r"reddit\.com/r/[^/\s\"']+/comments",
    "forum_link": r"technofino\.in|trustpilot\.com|consumercomplaints\.in|mouthshut\.com|complaintsboard\.com",
    "uk_forum_link": r"trustpilot\.com/reviews?|moneysavingexpert\.com/(?:forum|discussion)|forums\.moneysavingexpert\.com",
}
FE = ROOT / "frontend"
LINK_SOURCES = [FE / "components" / "hdfc-v3", FE / "lib" / "hdfc-v3", FE / "app" / "hdfc-pulse" / "v2",
                FE / "components" / "indusind-v1", FE / "lib" / "indusind-v1", FE / "app" / "role-based" / "indusind_bank",
                FE / "components" / "natwest-pulse", FE / "lib" / "natwest-pulse", FE / "app" / "natwest-pulse",
                FE / "components" / "swedbank-pulse", FE / "lib" / "swedbank-pulse", FE / "app" / "swedbank-pulse"]
# Built V2 pages (HTML and RSC payloads) and the client chunks every page loads. V1 is kept as first shown and is out
# of scope for this rule.
LINK_BUILD = [FE / ".next" / "server" / "app" / "hdfc-pulse" / "v2", FE / ".next" / "server" / "app" / "role-based" / "indusind_bank",
              FE / ".next" / "server" / "app" / "natwest-pulse",
              FE / ".next" / "server" / "app" / "swedbank-pulse",
              FE / ".next" / "static" / "chunks"]


def _files(roots):
    for r in roots:
        if r.is_file():
            yield r
        elif r.is_dir():
            for f in sorted(r.rglob("*")):
                if f.is_file() and f.suffix in {".ts", ".tsx", ".js", ".html", ".rsc", ".json", ".txt", ".body", ".meta"}:
                    yield f


def scan_links(paths) -> list[str]:
    """Links to original public posts anywhere in the given files."""
    hits = []
    for f in _files([Path(p) for p in paths]):
        rel = f.relative_to(ROOT) if f.is_relative_to(ROOT) else f
        text = f.read_text(encoding="utf-8", errors="replace")
        for name, p in SOURCE_LINK_PATTERNS.items():
            for m in re.finditer(p, text):
                hits.append(f"{rel}: {name}: {m.group(0)}")
    return hits


def _strings(obj):
    """Every string value in a JSON document (keys are code, not copy)."""
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from _strings(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from _strings(v)


def _load_strings(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    if path.suffix == ".jsonl":
        out = []
        for line in text.splitlines():
            if line.strip():
                try:
                    out.extend(_strings(json.loads(line)))
                except json.JSONDecodeError:
                    out.append(line)
        return out
    try:
        return list(_strings(json.loads(text)))
    except json.JSONDecodeError:
        return [text]


def scan(paths) -> list[str]:
    hits = []
    for f in paths:
        f = Path(f)
        rel = f.relative_to(ROOT) if f.is_relative_to(ROOT) else f
        text = ID_RE.sub('""', f.read_text(encoding="utf-8"))
        text = URL_RE.sub("", text)
        for name, p in PATTERNS.items():
            for m in re.finditer(p, text):
                hits.append(f"{rel}: {name}: {m.group(0)}")
        for s in _load_strings(f):
            if s.startswith("http"):
                continue
            for n in names_in(URL_RE.sub("", s)):
                hits.append(f"{rel}: person_name_or_handle: {n}")
    return hits


def _handles(obj, path="") -> list[str]:
    out = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in HANDLE_KEYS and v not in (None, "", [], {}):
                out.append(f"{path}.{k}")
            out += _handles(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            out += _handles(v, f"{path}[{i}]")
    return out


def scan_uk(paths) -> list[str]:
    """UK personal data (mobile and +44 numbers, sort codes, 8-digit accounts, card numbers, NI numbers) and author
    handles, hashed or not. Record ids, URLs and ISO dates are stripped first."""
    hits = []
    for f in paths:
        f = Path(f)
        rel = f.relative_to(ROOT) if f.is_relative_to(ROOT) else f
        raw = f.read_text(encoding="utf-8")
        text = URL_RE.sub("", ID_RE.sub('""', raw))
        text = re.sub(r"\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:[+-]\d{2}:\d{2}|Z)?)?", "", text)
        for name, p in UK_PATTERNS.items():
            for m in re.finditer(p, text):
                hits.append(f"{rel}: {name}: {m.group(0)}")
        docs = []
        lines = raw.splitlines() if f.suffix == ".jsonl" else [raw]
        for line in lines:
            try:
                docs.append(json.loads(line))
            except json.JSONDecodeError:
                pass
        for d in docs:
            for k in _handles(d):
                hits.append(f"{rel}: author_handle_field: {k}")
            for s in _strings(d):
                if RECORD_ID_RX.match(s):
                    continue
                for m in HASH_RX.finditer(s):
                    if re.search(r"[a-f]", m.group(0)) and re.search(r"\d", m.group(0)):
                        hits.append(f"{rel}: hashed_handle: {m.group(0)}")
    return hits



def scan_se(paths) -> list[str]:
    """Swedish personal data (personnummer, mobiles, clearing and account numbers, IBANs, card numbers) and author
    handles, hashed or not. Record ids, URLs and ISO dates are stripped first."""
    hits = []
    for f in paths:
        f = Path(f)
        rel = f.relative_to(ROOT) if f.is_relative_to(ROOT) else f
        raw = f.read_text(encoding="utf-8")
        text = URL_RE.sub("", ID_RE.sub('""', raw))
        text = re.sub(r"\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:[+-]\d{2}:\d{2}|Z)?)?", "", text)
        for name, p in SE_PATTERNS.items():
            for m in re.finditer(p, text):
                hits.append(f"{rel}: {name}: {m.group(0)}")
        docs = []
        lines = raw.splitlines() if f.suffix == ".jsonl" else [raw]
        for line in lines:
            try:
                docs.append(json.loads(line))
            except json.JSONDecodeError:
                pass
        for d in docs:
            for k in _handles(d):
                hits.append(f"{rel}: author_handle_field: {k}")
            for s in _strings(d):
                if RECORD_ID_RX.match(s):
                    continue
                for m in HASH_RX.finditer(s):
                    if re.search(r"[a-f]", m.group(0)) and re.search(r"\d", m.group(0)):
                        hits.append(f"{rel}: hashed_handle: {m.group(0)}")
    return hits

def scan_se_text(paths) -> list[str]:
    """The Swedish patterns on built pages (no JSON walk): visible text and payload together."""
    hits = []
    for f in paths:
        f = Path(f)
        rel = f.relative_to(ROOT) if f.is_relative_to(ROOT) else f
        text = URL_RE.sub("", ID_RE.sub('""', f.read_text(encoding="utf-8", errors="replace")))
        text = re.sub(r"\d{4}-\d{2}-\d{2}(?:T[\d:.]+(?:[+-]\d{2}:\d{2}|Z)?)?", "", text)
        for name, p in SE_PATTERNS.items():
            if name == "card_number":
                continue  # built pages carry hashes and numeric ids; card numbers are checked in the data
            for m in re.finditer(p, text):
                hits.append(f"{rel}: {name}: {m.group(0)}")
    return hits


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    hits = scan(FILES)
    built = (FE / ".next" / "server" / "app" / "hdfc-pulse" / "v2").is_dir()
    uk_hits = scan_uk(NATWEST_FILES)
    hits += uk_hits
    print(f"check_pii: NatWest UK rules on {len(NATWEST_FILES)} files: {len(uk_hits)} hit(s)")
    # Swedbank: the stored payloads and the built pages (the payload the screens ship), SW-D15 point 10.
    se_build = sorted((FE / ".next" / "server" / "app" / "swedbank-pulse").rglob("*.html")) if built or (FE / ".next" / "server" / "app" / "swedbank-pulse").is_dir() else []
    se_hits = scan_se(SWEDBANK_FILES) + scan_se_text(se_build)
    hits += se_hits
    print(f"check_pii: Swedbank rules on {len(SWEDBANK_FILES)} files and {len(se_build)} built pages: {len(se_hits)} hit(s)")
    link_hits = scan_links(LINK_SOURCES + (LINK_BUILD if built else []))
    hits += link_hits
    # Rendered text of every route reachable from /role-based/indusind_bank (scripts/qa_indusind_routes.mjs): the
    # personal-data patterns only. UI labels on their own line ("Status", "Approve") are not names, so the name rule
    # stays on the stored data, where items are sentences.
    crawl = ROOT / "qa" / "_crawl" / "pages.json"
    routes = 0
    if crawl.exists():
        for page in json.loads(crawl.read_text(encoding="utf-8")):
            routes += 1
            for name, pat in PATTERNS.items():
                for m in re.finditer(pat, page["text"]):
                    hits.append(f"route {page['route']}: {name}: {m.group(0)}")
        print(f"check_pii: {routes} rendered routes under /role-based/indusind_bank scanned")
    for h in hits[:50]:
        print(h)
    if not built:
        print("check_pii: NOTE no V2 build in frontend/.next; source links checked in the UI code only")
    print(f"check_pii: {len(hits)} hit(s) in {len(FILES)} files ({len(link_hits)} source links)")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
