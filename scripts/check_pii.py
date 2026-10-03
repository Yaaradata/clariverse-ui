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
PATTERNS = {
    "email": r"[\w.+-]+@[\w-]+\.[\w.-]+",
    "phone": r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)",
    "long_number": r"(?<![\d.])\d{10,}(?![\d.])",
    "upi": r"\b[\w.-]{2,}@(?:ok\w+|ybl|paytm|upi|ibl|axl|hdfcbank|icici|sbi)\b",
    "pan": r"\b[A-Z]{5}\d{4}[A-Z]\b",
    "aadhaar": r"(?<!\d)\d{4}\s\d{4}\s\d{4}(?!\d)",
}
# Record ids and source links identify public posts; they are not personal data.
ID_RE = re.compile(r'"(?:appstore|playstore|x|reddit|technofino|trustpilot|mouthshut|consumercomplaints|complaintsboard)[:_][^"]*"')
URL_RE = re.compile(r"https?://[^\s\"]+")

SOURCE_LINK_PATTERNS = {
    "store_review_link": r"play\.google\.com/store/apps|apps\.apple\.com/",
    "x_status_link": r"(?:x|twitter)\.com/(?:i|[A-Za-z0-9_]+)/status",
    "reddit_thread_link": r"reddit\.com/r/[^/\s\"']+/comments",
    "forum_link": r"technofino\.in|trustpilot\.com|consumercomplaints\.in|mouthshut\.com|complaintsboard\.com",
}
FE = ROOT / "frontend"
LINK_SOURCES = [FE / "components" / "hdfc-v3", FE / "lib" / "hdfc-v3", FE / "app" / "hdfc-pulse" / "v2",
                FE / "components" / "indusind-v1", FE / "lib" / "indusind-v1", FE / "app" / "indusind-v1"]
# Built V2 pages (HTML and RSC payloads) and the client chunks every page loads. V1 is kept as first shown and is out
# of scope for this rule.
LINK_BUILD = [FE / ".next" / "server" / "app" / "hdfc-pulse" / "v2", FE / ".next" / "server" / "app" / "indusind-v1",
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


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    hits = scan(FILES)
    built = (FE / ".next" / "server" / "app" / "hdfc-pulse" / "v2").is_dir()
    link_hits = scan_links(LINK_SOURCES + (LINK_BUILD if built else []))
    hits += link_hits
    for h in hits[:50]:
        print(h)
    if not built:
        print("check_pii: NOTE no V2 build in frontend/.next; source links checked in the UI code only")
    print(f"check_pii: {len(hits)} hit(s) in {len(FILES)} files ({len(link_hits)} source links)")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
