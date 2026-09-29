"""Proves the PII check can fail: seeded names and handles must be caught, redaction must remove them, and a clean file
must pass. Run: python scripts/test_check_pii.py (exit code 1 on any failure)."""

from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_pii import scan, scan_links  # noqa: E402
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
    "HDFC BANK Baghajatin Branch clerk Suman De non co-operate",  # role word "clerk" (found on the market page)
]
CLEAN = [
    "Regalia Gold card from Tata Neu Infinia. Parag Parikh Flexi Cap. Dear Sir, thank you. @HDFC_Bank @RBI",
    "Complaint closed without resolution after 30 days; the RM did not call back.",
]

# Follow-up fix 1: each must trip the source-link rule; the clean payload must not.
LINKS = [
    "https://play.google.com/store/apps/details?id=com.snapwork.hdfc&reviewId=abc",
    "https://apps.apple.com/in/app/hdfc-bank/id1190804856?see-all=reviews",
    "https://x.com/i/status/1834567890123456789",
    "https://twitter.com/someone/status/1834567890123456789",
    "https://www.reddit.com/r/CreditCardsIndia/comments/1ukmidd/hdfc_smartbuy_101/",
    "https://www.technofino.in/community/threads/hdfc.1234/",
    "https://www.trustpilot.com/review/hdfcbank.com",
    "https://www.consumercomplaints.in/hdfc-bank-c1",
    "https://www.mouthshut.com/product-reviews/hdfc",
    "https://www.complaintsboard.com/hdfc-bank-b1",
]
CLEAN_LINKS = '{"place":"Reddit · r/CreditCardsIndia","created_at":"2026-09-03","href":"/hdfc-pulse/v2/signal/fees"}'


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
        for i, u in enumerate(LINKS):
            p = Path(d) / f"page_{i}.rsc"
            p.write_text(f'1:["$","a",null,{{"href":"{u}"}}]', encoding="utf-8")
            if not scan_links([p]):
                fails.append(f"source-link rule missed {u}")
        p = Path(d) / "clean_page.rsc"
        p.write_text(CLEAN_LINKS, encoding="utf-8")
        if scan_links([p]):
            fails.append(f"source-link false positive: {scan_links([p])}")
    for f in fails:
        print("FAIL", f)
    print(f"test_check_pii: {len(SEEDED)} seeded names, {len(LINKS)} seeded links, {len(fails)} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
