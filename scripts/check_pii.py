"""PII scan of the data the screens render (B4 §8): phones, emails, 10+ digit numbers, UPI IDs, PAN, Aadhaar.

Scans the V3 outputs and the synthetic internal layer. Exit code 1 on any hit.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    *sorted((ROOT / "data" / "seed" / "internal_v3").glob("*.json")),
    ROOT / "data" / "seed" / "internal_v3" / "interactions.jsonl",
    *sorted((ROOT / "data" / "out" / "app_jul_sep").glob("*.json")),
]
PATTERNS = {
    "email": r"[\w.+-]+@[\w-]+\.[\w.-]+",
    "phone": r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)",
    "long_number": r"(?<![\d.])\d{10,}(?![\d.])",
    "upi": r"\b[\w.-]{2,}@(?:ok\w+|ybl|paytm|upi|ibl|axl|hdfcbank|icici|sbi)\b",
    "pan": r"\b[A-Z]{5}\d{4}[A-Z]\b",
    "aadhaar": r"(?<!\d)\d{4}\s\d{4}\s\d{4}(?!\d)",
}


def main() -> int:
    hits = []
    for f in FILES:
        text = f.read_text(encoding="utf-8")
        # Record ids and source links are identifiers of public posts, not personal data.
        text = re.sub(r'"(?:appstore|playstore|x|reddit|technofino|trustpilot|mouthshut|consumercomplaints|complaintsboard)[:_][^"]*"', '""', text)
        text = re.sub(r"https?://[^\s\"]+", "", text)
        for name, p in PATTERNS.items():
            for m in re.finditer(p, text):
                hits.append(f"{f.relative_to(ROOT)}: {name}: {m.group(0)}")
    for h in hits[:50]:
        print(h)
    print(f"check_pii: {len(hits)} hit(s) in {len(FILES)} files")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
