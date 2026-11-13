"""Proves the PII check can fail: seeded names and handles must be caught, redaction must remove them, and a clean file
must pass. Run: python scripts/test_check_pii.py (exit code 1 on any failure)."""

from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_pii import scan, scan_links, scan_uk  # noqa: E402
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
# NatWest UK rules (docs/natwest/brief.md Step 1.5): each must trip; the clean UK text must not.
UK_SEEDED = {
    "uk_mobile": "Call me on 07700 900123 about the refund",
    "uk_phone_intl": "Reached them on +44 20 7946 0958 eventually",
    "sort_code": "Paid into sort code 60-16-13 last week",
    "account_number_8": "Account 31926819 was frozen",
    "card_number": "Card 4929 1234 5678 9012 declined",
    "ni_number": "My NI number is JG 10 37 59 A",
    "email": "write to someone.name@example.co.uk",
    "author_handle_field": {"author": "someone_123"},
    "hashed_handle": {"place": "Reddit", "who": "9f86d081884c7d659a2feaa0c55ad015"},
}
UK_CLEAN = {"items": ["86,498 complaints in H1 2026; 2.74 per 1,000 accounts", "Data frozen 2026-11-12T23:59:00Z",
                      "48% closed within 3 days", "Royal Bank of Scotland app 66% vs 48%", "£1.2 million",
                      "20,000,000 customers"]}
UK_LINKS = [
    "https://uk.trustpilot.com/reviews/www.natwest.com",
    "https://forums.moneysavingexpert.com/discussion/6500000/natwest-app",
    "https://apps.apple.com/gb/app/natwest/id334855322",
    "https://play.google.com/store/apps/details?id=com.rbs.mobile.android.natwest",
    "https://www.reddit.com/r/UKPersonalFinance/comments/abc123/natwest/",
    "https://x.com/someone/status/1834567890123456789",
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
        for rule, payload in UK_SEEDED.items():
            p = Path(d) / f"uk_{rule}.json"
            p.write_text(json.dumps(payload if isinstance(payload, dict) else {"t": payload}), encoding="utf-8")
            got = scan_uk([p]) + (scan([p]) if rule == "email" else [])
            if not any(f": {rule}:" in g for g in got):
                fails.append(f"UK rule {rule} missed {payload!r} ({got})")
            else:
                print(f"PASS UK rule {rule} fires")
        p = Path(d) / "uk_clean.json"
        p.write_text(json.dumps(UK_CLEAN), encoding="utf-8")
        if scan_uk([p]):
            fails.append(f"UK rules false positive: {scan_uk([p])}")
        for i, u in enumerate(UK_LINKS):
            p = Path(d) / f"uk_page_{i}.rsc"
            p.write_text(f'1:["$","a",null,{{"href":"{u}"}}]', encoding="utf-8")
            if not scan_links([p]):
                fails.append(f"source-link rule missed {u}")
    for f in fails:
        print("FAIL", f)
    print(f"test_check_pii: {len(SEEDED)} seeded names, {len(LINKS) + len(UK_LINKS)} seeded links, "
          f"{len(UK_SEEDED)} UK rules, {len(fails)} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
