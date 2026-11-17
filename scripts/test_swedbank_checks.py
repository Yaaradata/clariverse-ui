"""Swedbank fixtures (docs/swedbank/kickoff_prompt.md Step 7, SW-D15): every check must FAIL on planted bad input and
PASS on clean input. Called by scripts/test_checks.py; runnable alone. Exit 1 on any fixture that did not behave.

- lint scope `swedbank`: each UK term, each UK/other bank, each internal label and each India term fires; clean
  Swedish-register copy passes; a customer quote is exempt.
- PII: a planted personnummer (both forms), a Swedish mobile, a clearing + account number and an IBAN trip
  check_pii; clean figures do not.
- gate: a tampered payload (filed above tile 2 + tile 3, a window that does not nest, a NaN figure, an "undefined"
  string) fails check_gate.
- provenance: a fabricated public row fails public_provenance (when the public layer has built).
"""

from __future__ import annotations

import copy
import json
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "scripts" / "swedbank_pulse"))

UK_SEEDED = {
    "Financial Ombudsman": "Refer to the Financial Ombudsman", "FOS": "FOS referrals up", "FCA": "FCA rules apply",
    "Consumer Duty": "Consumer Duty outcomes", "PSR": "PSR reimbursement due", "DISP": "DISP clock", "CASS": "CASS switch",
    "Faster Payments": "Faster Payments failed", "Open Banking": "Open Banking link down", "£": "A fee of £5",
    "Premier": "Premier customers", "NPS": "NPS fell", "Cora": "Cora handed off", "Secure message": "Secure message reply",
    "final response": "The final response is late", "8 weeks": "within 8 weeks", "financially vulnerable": "financially vulnerable customers",
    "sort code": "Your sort code", "England and Wales": "Customers in England and Wales", "GMT": "07:45 GMT",
    "Ombudsman (not Kundombudsman)": "Ombudsman watch",
}
BANK_SEEDED = {"NatWest": "NatWest app", "RBS": "RBS customers", "Ulster": "Ulster Bank", "Coutts": "Coutts clients",
               "Mettle": "Mettle accounts", "HDFC": "HDFC cards"}
LABEL_SEEDED = {"illustrative": "Internal figures illustrative", "synthetic": "synthetic data", "seed": "From the seed",
                "mock": "Mock reply", "dummy": "dummy row", "TODO": "TODO fix", "lorem": "lorem ipsum",
                "ANCHOR": "ANCHOR figure", "DERIVED": "DERIVED from", "ASSUMPTION": "ASSUMPTION: 35%"}
NODATA_SEEDED = {"no reply data": "Google Play · no reply data", "no data": "X · no data", "not available": "Reddit not available",
                 "n/a": "Trustpilot n/a", "unavailable": "App Store unavailable", "not fetched": "Replies not fetched",
                 "no replies found": "no replies found"}
INDIA_SEEDED = {"RBI": "Escalate to the RBI", "UPI": "UPI failed", "NEFT": "NEFT late", "IMPS": "IMPS stuck", "₹": "₹500",
                "lakh": "Two lakh", "crore": "40 crore"}
CLEAN = [
    "ARN watch · Filed with ARN · Unhappy with the final decision (ARN eligible)",
    "Final decision issued, Kundombudsman appeal open",
    "Payments and Swish · Everyday accounts and app · Cards · Mortgages (bolån) · Savings and funds · Consumer loans",
    "Calls · Nina · App and internet-bank messages · Email · Social · Branch (kontor)",
    "Customers in a vulnerable situation · Account-measure affected · Premium and Private Banking · Recent complainants",
    "12,500 kr · 17 Nov 2026 07:45 CET · Finansinspektionen (FI) · Payment Services Act (betaltjänstlagen)",
    "Handled 12 of 18 · Internal", "NKI (Nöjd Kund Index) · SKI (Svenskt Kvalitetsindex) · Bank switch (byta bank)",
]

PII_SEEDED = {
    "personnummer": "Mitt personnummer är 850709-1234",
    "personnummer ": "Personnummer 198507091234 i ärendet",
    "se_mobile": "Ring mig på 070-123 45 67",
    "se_mobile ": "Nås på +46 70 123 45 67",
    "clearing_account": "Konto 8327-9, 123 456 789-0 spärrat",
    "iban": "IBAN SE45 5000 0000 0583 9825 7466",
}
PII_CLEAN = {"items": ["3.8 million private customers", "7,500 cases in 2025", "Data frozen 2026-11-17T06:45:00+00:00",
                       "Handled 120 of 180", "60.3 of 100", "12,500 kr", "15 business days"]}


def lint_fixtures(fails: list[str]) -> int:
    import lint_swedbank as ls  # noqa: PLC0415

    n = 0
    for rule, seeded in (("SW-UK", UK_SEEDED), ("NW-BANK", BANK_SEEDED), ("SW-LABEL", LABEL_SEEDED), ("SW-NODATA", NODATA_SEEDED),
                         ("NW-INDIA", INDIA_SEEDED)):
        for term, text in seeded.items():
            h = ls.text_rules(text, "fixture") + ls.p3_rules(text, "fixture")
            n += 1
            if not any(x.startswith(rule) for x in h):
                fails.append(f"Swedbank lint missed {rule} {term!r} in {text!r}")
    for text in CLEAN:
        h = ls.text_rules(text, "fixture") + ls.p3_rules(text, "fixture")
        n += 1
        if h:
            fails.append(f"Swedbank lint false positive on clean copy {text!r}: {h}")
    # Quoted public text is exempt: a customer quote naming another bank is removed before the page is checked.
    q = "Jag bytte från NatWest och Swish fungerar aldrig"
    n += 1
    if ls.without_quotes(f"Payments and Swish {q} Owner", [q]).count("NatWest"):
        fails.append("Swedbank lint did not exempt a customer quote")
    # The source rule fires on JSX copy.
    n += 1
    if not any(x.startswith("SW-UK") for x in ls._ui_hits("<p>Financial Ombudsman watch</p>", "f.tsx")):
        fails.append("Swedbank lint missed a UK term in JSX text")
    return n


def pii_fixtures(fails: list[str]) -> int:
    import check_pii as cp  # noqa: PLC0415

    n = 0
    with tempfile.TemporaryDirectory() as d:
        for rule, text in PII_SEEDED.items():
            p = Path(d) / f"se_{n}.json"
            p.write_text(json.dumps({"label": text}, ensure_ascii=False), encoding="utf-8")
            n += 1
            if not any(f": {rule.strip()}:" in h for h in cp.scan_se([p])):
                fails.append(f"check_pii missed Swedish {rule.strip()} in {text!r}")
            page = Path(d) / f"se_{n}.html"
            page.write_text(f"<p>{text}</p>", encoding="utf-8")
            n += 1
            if not cp.scan_se_text([page]):
                fails.append(f"check_pii missed Swedish {rule.strip()} on a built page: {text!r}")
        p = Path(d) / "se_clean.json"
        p.write_text(json.dumps(PII_CLEAN), encoding="utf-8")
        n += 1
        if cp.scan_se([p]):
            fails.append(f"check_pii false positive on clean Swedbank figures: {cp.scan_se([p])}")
    return n


def gate_fixtures(fails: list[str]) -> int:
    import check_gate as g  # noqa: PLC0415

    out = ROOT / "data" / "out" / "swedbank_pulse"
    per_f = out / "periods.json"
    if not per_f.exists():
        fails.append("gate fixtures: no periods.json to tamper")
        return 0
    base = json.loads(per_f.read_text(encoding="utf-8"))
    if set(base.get("periods", {})) != set(g.ORDER):
        print("SKIP gate fixtures: the Swedbank periods are not built yet")
        return 0

    def tampered(fn):
        x = copy.deepcopy(base)
        fn(x["periods"])
        return x

    def filed_above(ps):
        now = ps["7d"]["ombudsman"]["now"]
        now["awaiting_io"] = now.get("eligible", 0) + now.get("unhappy", 0) + 1

    def no_nest(ps):
        ps["brief"]["cx_pulse"]["internal"]["volume"] = ps["all"]["cx_pulse"]["internal"]["volume"] + 1

    def nan(ps):
        ps["14d"]["cx_pulse"]["internal"]["volume"] = float("nan")

    def undefined(ps):
        ps["all"]["businesses"][0]["label"] = "undefined"

    def zero_of_zero(ps):
        ps["7d"]["businesses"][0]["label"] = "Handled 0 of 0"

    cases = {"G1": filed_above, "G2": no_nest, "G3": nan, "G3 ": undefined, "G3  ": zero_of_zero}
    n = 0
    with tempfile.TemporaryDirectory() as d:
        dd = Path(d)
        if (out / "ask.json").exists():
            shutil.copy(out / "ask.json", dd / "ask.json")
        clean = g.run(out, ROOT / "data" / "seed" / "swedbank_pulse")
        for want, fn in cases.items():
            (dd / "periods.json").write_text(json.dumps(tampered(fn)), encoding="utf-8")
            got = g.run(dd, ROOT / "data" / "seed" / "swedbank_pulse")
            n += 1
            new = [x for x in got if x not in clean]
            if not any(x.startswith(want.strip()) for x in new):
                fails.append(f"check_gate did not fail on tampered {fn.__name__} ({want.strip()}): {new[:2]}")
    return n


def provenance_fixtures(fails: list[str]) -> int:
    try:
        import public_provenance as pp  # noqa: PLC0415
    except ImportError:
        print("SKIP provenance fixture: scripts/swedbank_pulse/public_provenance.py not built yet")
        return 0
    out = ROOT / "data" / "out" / "swedbank_pulse"
    ev = out / "evidence.json"
    if not ev.exists():
        return 0
    with tempfile.TemporaryDirectory() as d:
        dd = Path(d)
        for f in out.glob("*.json"):
            shutil.copy(f, dd / f.name)
        if (out / "work").exists():
            shutil.copytree(out / "work", dd / "work", ignore=shutil.ignore_patterns("llm_batches"))
        e = json.loads(ev.read_text(encoding="utf-8"))
        e["x:999999999999999999999"] = {**next(iter(e.values()), {}), "id": "x:999999999999999999999",
                                         "text": "Fabricated post", "summary": "Fabricated post"}
        (dd / "evidence.json").write_text(json.dumps(e, ensure_ascii=False), encoding="utf-8")
        errs = pp.check(dd)
        if not errs:
            fails.append("public_provenance accepted a fabricated public row")
    return 1


def run(fails: list[str]) -> dict:
    return {"lint": lint_fixtures(fails), "pii": pii_fixtures(fails), "gate": gate_fixtures(fails),
            "provenance": provenance_fixtures(fails)}


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    fails: list[str] = []
    counts = run(fails)
    for f in fails:
        print("FAIL", f)
    print(f"test_swedbank_checks: {counts}; {len(fails)} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
