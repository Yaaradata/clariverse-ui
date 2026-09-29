"""PII scan of the data the screens render (B4 §8): phones, emails, 10+ digit numbers, UPI IDs, PAN, Aadhaar, and
people's names and social handles (B7 §E2: never name a real person).

Names use the same rule-based detector as the pipeline's redaction (scripts/pii_names.py): a denylist of known public
figures, honorifics, name lexicons, role words and address position, plus handles outside the institutional allowlist.
It scans every data file the V2 screens load (frontend/lib/hdfc-v3/load.ts) and the committed labelling batches.
Exit code 1 on any hit. `scan(paths)` is importable for tests (scripts/test_check_pii.py).
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
    *sorted((ROOT / "data" / "out" / "app_jul_sep").glob("*.json")),
    *sorted((ROOT / "data" / "out" / "app_jul_sep" / "work" / "llm_batches").glob("batch_*.jsonl")),
    # V1 (first demo) is still served at /hdfc-pulse/v1.
    *sorted((ROOT / "data" / "out" / "app").glob("*.json")),
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
    for h in hits[:50]:
        print(h)
    print(f"check_pii: {len(hits)} hit(s) in {len(FILES)} files")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
