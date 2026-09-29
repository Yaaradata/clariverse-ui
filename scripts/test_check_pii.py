"""Proves the PII check can fail: seeded names and handles must be caught, redaction must remove them, and a clean file
must pass. Run: python scripts/test_check_pii.py (exit code 1 on any failure)."""

from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_pii import scan  # noqa: E402
from pii_names import redact_names  # noqa: E402

SEEDED = [
    "So sweet of you Sashi Jagdishan. cc @RBI",  # bank executive (denylist)
    "ex-Chairman Atanu Chakraborty resigned",  # bank executive (denylist)
    "Meet Jose Garcia CEO of Carlisle Fund",  # named third party (lexicon)
    "Mr. Rajiv Kumar please ensure your bank resolves this",  # honorific
    "[handle] @HDFC_Bank Shreyas, can you be more stupid?",  # address position
    "Manager Suyash Asthana clearly confirmed",  # role word
    "cc @nsitharamanoffc @CardsHdfc60342 /u/Jatins31",  # personal handles
    "#HDFCBank #SashidharJagdishan",  # hashtag of a public figure
]
CLEAN = [
    "Regalia Gold card from Tata Neu Infinia. Parag Parikh Flexi Cap. Dear Sir, thank you. @HDFC_Bank @RBI",
    "Complaint closed without resolution after 30 days; the RM did not call back.",
]


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    fails = []
    with tempfile.TemporaryDirectory() as d:
        for i, s in enumerate(SEEDED):
            p = Path(d) / f"seeded_{i}.json"
            p.write_text(json.dumps({"redacted_text": s}), encoding="utf-8")
            if not scan([p]):
                fails.append(f"check_pii missed a seeded name: {s!r}")
            red = redact_names(s)
            q = Path(d) / f"redacted_{i}.json"
            q.write_text(json.dumps({"redacted_text": red}), encoding="utf-8")
            left = scan([q])
            if left:
                fails.append(f"redaction left {left} in {red!r}")
        p = Path(d) / "clean.json"
        p.write_text(json.dumps({"items": CLEAN}), encoding="utf-8")
        hits = scan([p])
        if hits:
            fails.append(f"false positives on clean text: {hits}")
    for f in fails:
        print("FAIL", f)
    print(f"test_check_pii: {len(SEEDED)} seeded, {len(fails)} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
