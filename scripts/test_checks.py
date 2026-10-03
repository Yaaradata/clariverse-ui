"""Failing fixtures for the demo's checks (review step 6): every check must be able to fail.

For each reconcile check, a copy of the data is tampered in one way and check_reconcile_v3.run() must report that check
as failed (and the untouched copy must pass). lint_terms.check() must flag banned wording, people's names and internal
references, and must not flag a clean string. Run: python scripts/test_checks.py (exit code 1 on any failure).
PII has its own fixtures in scripts/test_check_pii.py.
"""

from __future__ import annotations

import json
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts" / "hdfc_v3"))
sys.path.insert(0, str(ROOT / "scripts"))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import check_reconcile_v3 as rec  # noqa: E402
import lint_terms  # noqa: E402

SEED = ROOT / "data" / "seed" / "internal_v3"
OUT = ROOT / "data" / "out" / "app_jul_sep"


def _rw_json(path: Path, fn):
    obj = json.loads(path.read_text(encoding="utf-8"))
    fn(obj)
    path.write_text(json.dumps(obj, ensure_ascii=False), encoding="utf-8")


def _rw_jsonl(path: Path, fn):
    rows = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    fn(rows)
    path.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")


def _first(rows, pred):
    return next(r for r in rows if pred(r))


def _retheme_cards(rows):
    cards = [r for r in rows if r["product"] == "cards"]
    for r in cards[: len(cards) // 3]:
        r["theme"] = "app_speed_crash"


def _flip_rm(seed: Path):
    agg = json.loads((seed / "aggregates.json").read_text(encoding="utf-8"))
    custs = json.loads((seed / "customers.json").read_text(encoding="utf-8"))
    members = {c["masked_id"] for c in custs if "hni" in c["cohorts"]}
    personas = {p["masked_id"] for p in agg["personas"]}

    def fn(notes):
        n = _first(notes, lambda n: n["masked_id"] in members and n["masked_id"] not in personas)
        n["notified_today"] = not n["notified_today"]

    _rw_json(seed / "rm_notifications.json", fn)


# (name, the check message it must trip, tamper(seed_dir, out_dir))
FIXTURES = [
    ("breach flag trusted", "breach recomputed",
     lambda s, o: _rw_jsonl(s / "interactions.jsonl", lambda rows: _first(rows, lambda r: r["status"] == "closed").update(breached=not _first(rows, lambda r: r["status"] == "closed")["breached"]))),
    ("open item with a closing time", "open items have no closing time",
     lambda s, o: _rw_jsonl(s / "interactions.jsonl", lambda rows: _first(rows, lambda r: r["status"] == "open").update(closed_at="2026-09-01T10:00+05:30"))),
    ("theme mix", "theme shares within",
     lambda s, o: _rw_jsonl(s / "interactions.jsonl", _retheme_cards)),
    ("triage buckets", "bucket counts recomputed",
     lambda s, o: _rw_json(s / "escalation_emails.json", lambda e: e[0].update(bucket="call_today" if e[0]["bucket"] != "call_today" else "escalate"))),
    ("cohort RM alerts", "RM alerts recomputed",
     lambda s, o: _flip_rm(s)),
    ("persona RM status", "RM notified matches",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["personas"][0].update(rm_notified=not a["personas"][0]["rm_notified"]))),
    ("person-level flag", "no person-level flag",
     lambda s, o: _rw_json(s / "customers.json", lambda c: c[0].update(sensitive=True))),
    ("high impact total", "high-impact complaints recomputed",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["high_impact"].update(total=a["high_impact"]["total"] + 1))),
    ("MD mail vs ladder", "MD-marked mail",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["md_mail"].update(total=a["md_mail"]["total"] + 1))),
    ("ladder order", "ladder rungs",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["deliverables_detail"]["ladder"][-1].update(count=10**6))),
    ("dispute funnel", "dispute funnel",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["deliverables_detail"]["disputes"]["funnel"][-1].update(count=10**6))),
    ("routing status", "one acknowledgement status",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["routing"][0].update(status="Awaiting owner" if a["routing"][0]["acknowledged_at"] else "Acknowledged 01:00"))),
    ("reused headline value", "headline values are distinct",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["rm"].update(should_know=a["dials"]["open"]))),
    ("product dials", "product dials sum to overall: open",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["products"][0].update(open=a["products"][0]["open"] + 1))),
    ("cohort counts", "recomputed (customers, open, over 24 h)",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["cohorts"][0].update(customers=a["cohorts"][0]["customers"] + 1))),
    ("deliverables ageing", "ageing: open cases",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["deliverables_detail"]["ageing"][0].update(open_cases=a["deliverables_detail"]["ageing"][0]["open_cases"] + 1))),
    ("satisfaction tiers", "satisfaction: tiers",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: a["satisfaction"]["tiers"][0].update(interactions=a["satisfaction"]["tiers"][0]["interactions"] + 1))),
    ("pooled store rating", "store ratings and shares sit within one store",
     lambda s, o: _rw_json(o / "app_pulse.json", lambda p: p["apps"][0]["window"].update(avg_rating=3.2, share_positive=50.0))),
    ("pooled release share", "store ratings and shares sit within one store",
     lambda s, o: _rw_json(o / "briefing.json", lambda b: b["release_pulse"].update(new_app_share_positive=30.0))),
    ("per-store counts", "per-store review counts add",
     lambda s, o: _rw_json(o / "app_pulse.json", lambda p: p["apps"][0]["window"].update(n=p["apps"][0]["window"]["n"] + 1))),
    ("bank TAT as a number", "bank TATs: unconfirmed read 'Bank TAT: confirm in discovery'",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: next(d for d in a["deliverables"] if d["source"] == "bank").update(tat_label="7 working days"))),
    ("confirmed bank TAT without a source", "bank TATs: unconfirmed read 'Bank TAT: confirm in discovery'",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: next(d for d in a["deliverables"] if d["source"] == "bank").update(
         tat_label="7 working days", source="bank_confirmed", source_note=None))),
    ("confirmed bank TAT still a placeholder", "bank TATs: unconfirmed read 'Bank TAT: confirm in discovery'",
     lambda s, o: _rw_json(s / "aggregates.json", lambda a: next(d for d in a["deliverables"] if d["source"] == "bank").update(
         source="bank_confirmed", source_note="Bank SLA document, section 1"))),
    ("public product rows", "public product rows + excluded",
     lambda s, o: _rw_json(o / "products.json", lambda p: p["rows"][0].update(count=p["rows"][0]["count"] + 1))),
    # 30 Sep views (periods.json)
    ("list channel does not add up", "channels sum to the strip (volume)",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["7d"]["customer_pulse"]["lists"][0]["by_channel"]["emails"].update(
         volume=d["periods"]["7d"]["customer_pulse"]["lists"][0]["by_channel"]["emails"]["volume"] + 1))),
    ("list figure not recomputable", "volume, open and 48-hour wait recomputed",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["30d"]["customer_pulse"]["lists"][1].update(
         open=d["periods"]["30d"]["customer_pulse"]["lists"][1]["open"] + 1))),
    ("48-hour figure shown for the morning brief", "volume, open and 48-hour wait recomputed",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["brief"]["customer_pulse"]["lists"][0].update(not_responded_48h=0))),
    ("unweighted share with a dominant source", "never leaves a share unweighted",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["brief"]["cx_pulse"]["external"].update(share_method="raw"))),
    ("overall volume split", "overall contact volume = internal + external",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["7d"]["cx_pulse"]["overall"].update(total=d["periods"]["7d"]["cx_pulse"]["overall"]["total"] + 1))),
    ("cards card vs cards view", "Cards: business card = Cards view",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["30d"]["cards"]["internal"].update(volume=d["periods"]["30d"]["cards"]["internal"]["volume"] + 1))),
    ("cards subcategories", "subcategories sum (internal volume)",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["30d"]["cards"]["categories"][0]["subcategories"][0]["internal"].update(
         volume=d["periods"]["30d"]["cards"]["categories"][0]["subcategories"][0]["internal"]["volume"] + 1))),
    ("brief item without a business", "every brief item names a business",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["7d"]["brief"]["needs_you"].append({"business": "wealth", "business_label": "Wealth", "text": "x"}))),
    # Ombudsman watch (ombudsman_watch_design.md)
    ("ombudsman dial", "Ombudsman bank now recomputed",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["7d"]["ombudsman"]["now"].update(
         brink=d["periods"]["7d"]["ombudsman"]["now"]["brink"] + 1))),
    ("ombudsman business split", "Ombudsman: businesses sum to the bank total",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["30d"]["ombudsman"]["by_business"][0].update(
         at_risk=d["periods"]["30d"]["ombudsman"]["by_business"][0]["at_risk"] + 1))),
    ("ombudsman cards category", "Ombudsman: Cards categories and subcategories sum",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["all"]["cards"]["ombudsman"]["categories"][0].update(
         at_risk=d["periods"]["all"]["cards"]["ombudsman"]["categories"][0]["at_risk"] + 1))),
    ("ombudsman save list", "Ombudsman: save list is at most 10",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["7d"]["cards"]["ombudsman"]["save_list"].append(
         {"id": "CMP-NOT-AT-RISK", "score": 0}))),
    ("ombudsman brief item", "the brief item leads What needs you exactly when",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["7d"]["brief"].update(
         needs_you=[x for x in d["periods"]["7d"]["brief"]["needs_you"] if x.get("kind") != "ombudsman"]))),
    ("ombudsman IO order", "Ombudsman: register matches the contacts and the IO order holds",
     lambda s, o: _rw_jsonl(s / "complaints.jsonl", lambda rows: _first(
         rows, lambda r: r["outcome"] == "rejected" and r["final_reply_at"]).update(io_reviewed_at=None))),
    ("cards categories", "Cards categories sum to the Cards external volume",
     lambda s, o: _rw_json(o / "periods.json", lambda d: d["periods"]["all"]["cards"]["categories"][0]["external"].update(
         volume=d["periods"]["all"]["cards"]["categories"][0]["external"]["volume"] + 1))),
]

LINT_MUST_FLAG = [
    "Re-promise",
    "resolution promised within two working days",
    "V2 · after Vidya call",
    "instrument and the bank's own commitments (B2 §7)",
    "LisN V1 (first demo)",
    "Save $1.2M",
    "Great news!",
    # Internal names from scripts/lint_terms_candidates.txt (follow-up fix 4); none is caught by an older rule.
    "See screen E2 for the list",
    "Owner: T5",
    "V3 build",
    "Kannan asked for this view",
    "IndusInd comparison",
    "Confidential: do not share",
]
LINT_MUST_PASS = [
    "Set a new date",
    "Deliverables met within the TAT",
    "Customers asking where something is",
    "Priority list A: 45 customers",
    "Version 11 of the HDFC Bank app",
    "Internal · illustrative until discovery",
    "PayZapp v2.61 on the Play Store",
]


# ---------------------------------------------------------------- IndusInd (IND-B3 §8): one failing input per rule
IND_TEXT_FIXTURES = {
    1: "Micro loans and rural ₹31,417 crore",
    2: "Peer CASA: HDFC Bank 38%",
    3: "The closest peer is Federal",
    4: "₹6,200 crore of deposits",
    5: "IDFC First 5.96% cost of deposits",
    6: "RBL CASA 29.21%",
    7: "CASA ₹1,22,331 crore",
    8: "IndusInd savings 4.00% on balances below ₹1 lakh",
    9: "IDFC First FD rate 7.25% for 1 year",
    10: "Yes Bank savings 7.00%",
    11: "Federal cost of deposits 5.25%",
    12: "INDIE rated 4.7 on Play",
    13: "SFIO filing of 24 Dec",
    14: "DPDP main obligations from 14 May 2027",
    15: "The quarterly root-cause analysis",
    16: "Approved by Bhasin",
    17: "Savings at the end of Q2 FY27",
    20: "Earn on your Regalia card",
    21: "Our champion in the bank",
    22: "Deposit run-off this week",
    23: "fraud at IndusInd",
    24: "LisN replaces your MIS",
    26: "Built on LiSN",
}


def indusind_lint_fixtures(fails: list[str]) -> int:
    import lint_indusind as li  # noqa: PLC0415

    n = 0
    for rule, text in IND_TEXT_FIXTURES.items():
        h = li.text_rules(text, "fixture", {"manual_read_logged": False}, li.local_terms())
        ok = any(x.startswith(f"IND-R{rule:02d}") for x in h)
        n += 1
        print(("PASS " if ok else "FAIL ") + f"IndusInd lint rule {rule} flags {text!r}")
        if not ok:
            fails.append(f"IndusInd lint rule {rule} missed {text!r} ({h})")
    # Clean copy passes every text rule.
    # CSS layout values in a style prop are geometry, not figures.
    for css in ("translateX(-50%)", "calc(100% + 6px)", "repeat(auto-fit, minmax(min(100%, 280px), 1fr))"):
        n += 1
        if li.ui_figures(css, "fixture.tsx"):
            fails.append(f"IndusInd lint rule 18 flagged a CSS value {css!r}")
    for text in ("Fraud and impersonation (customers targeted)", "Cost of deposits pending verification",
                 "IDFC First Bank cost of funds", "Designed to run inside the bank, on the bank's approved models"):
        h = li.text_rules(text, "fixture", {"manual_read_logged": False}, li.local_terms())
        n += 1
        if h:
            fails.append(f"IndusInd lint flagged clean copy {text!r}: {h}")
    # Structural rules: 17 (a balance after 30 Jun), 18 (a figure without an id, in a payload and in a component),
    # 19 (a sensitivity without inputs), 25 ('saving' in a sensitivity tile).
    cases = [
        (17, li.structure_rules({}, [], [{"week_ending": "2026-07-03", "balance_cr": 1.0}], {})),
        (18, li.structure_rules({"home": {"x": {"display": "12.5%"}}}, [], [], {})),
        (18, li.ui_figures("Savings fell 2.7% in the quarter", "fixture.tsx")),
        (18, li.ui_figures("calc(100% + 6px) 1 bp = ₹41.5 crore", "fixture.tsx")),
        (19, li.structure_rules({}, [{"id": "S09", "formula": "", "inputs": []}], [], {})),
        (25, li.structure_rules({"home": {"sensitivity": [{"label": "A saving of ₹40 crore"}]}}, [], [], {})),
    ]
    for rule, h in cases:
        ok = any(x.startswith(f"IND-R{rule:02d}") for x in h)
        n += 1
        print(("PASS " if ok else "FAIL ") + f"IndusInd lint rule {rule} (structure) fires")
        if not ok:
            fails.append(f"IndusInd lint rule {rule} (structure) did not fire ({h})")
    return n


def indusind_reconcile_fixtures(fails: list[str]) -> int:
    """Each IndusInd reconcile check gets a tampered copy of the payloads that must fail it."""
    import check_indusind as ci  # noqa: PLC0415

    payloads = ci.load()
    base = ci.run(payloads)
    if base:
        fails.append(f"IndusInd: untouched payloads must pass, but {len(base)} check(s) failed: {base[:3]}")
    n = 0
    for name, expect, tamper in ci.FIXTURES:
        p = json.loads(json.dumps(payloads))
        tamper(p)
        got = ci.run(p)
        ok = any(expect in g for g in got)
        n += 1
        print(("PASS " if ok else "FAIL ") + f"IndusInd fixture '{name}' trips '{expect}'")
        if not ok:
            fails.append(f"IndusInd fixture '{name}' did not trip '{expect}' ({got[:3]})")
    return n


def main() -> int:
    fails: list[str] = []
    with tempfile.TemporaryDirectory() as d:
        base = Path(d)
        clean_seed, clean_out = base / "seed", base / "out"
        shutil.copytree(SEED, clean_seed)
        clean_out.mkdir()
        for f in ("themes.json", "signals.json", "products.json", "app_pulse.json", "briefing.json", "store_series.json", "periods.json"):
            shutil.copy(OUT / f, clean_out / f)
        baseline = rec.run(clean_seed, clean_out, quiet=True)
        if baseline:
            fails.append(f"untouched data must pass, but {len(baseline)} check(s) failed: {baseline[:3]}")
        for name, expect, tamper in FIXTURES:
            s, o = base / f"s_{len(name)}_{abs(hash(name))}", base / f"o_{abs(hash(name))}"
            shutil.copytree(clean_seed, s)
            shutil.copytree(clean_out, o)
            tamper(s, o)
            got = rec.run(s, o, quiet=True)
            hit = [g for g in got if expect in g]
            print(("PASS " if hit else "FAIL ") + f"fixture '{name}' trips '{expect}'")
            if not hit:
                fails.append(f"fixture '{name}' did not trip '{expect}' (failures: {got[:3]})")
            shutil.rmtree(s)
            shutil.rmtree(o)
    for s in LINT_MUST_FLAG:
        h: list[str] = []
        lint_terms.check(s, "fixture", h)
        print(("PASS " if h else "FAIL ") + f"lint flags {s!r}")
        if not h:
            fails.append(f"lint did not flag {s!r}")
    for s in LINT_MUST_PASS:
        h = []
        lint_terms.check(s, "fixture", h)
        if h:
            fails.append(f"lint flagged clean copy {s!r}: {h}")
    # The local programme-name list is honoured: a term added to it is caught.
    lint_terms.BANNED.append("Project Placeholder")
    h = []
    lint_terms.check("Runs on Project Placeholder", "fixture", h)
    lint_terms.BANNED.pop()
    print(("PASS " if h else "FAIL ") + "lint honours the local programme-name list")
    if not h:
        fails.append("lint ignored a term from the local programme-name list")
    # The built-page scan flags an internal name in an RSC payload and in a page's client chunk, and passes clean copy.
    build_checks = 0
    with tempfile.TemporaryDirectory() as d:
        nx = Path(d) / ".next"
        pages = nx / "server" / "app" / "hdfc-pulse" / "v2"
        pages.mkdir(parents=True)
        (nx / "static" / "chunks").mkdir(parents=True)
        (pages / "clean.rsc").write_text('1:["$","div",null,{"children":"Priority list A: 45 customers"}]\n', encoding="utf-8")
        h = []
        lint_terms.scan_build(h, pages, nx)
        build_checks += 1
        print(("FAIL " if h else "PASS ") + "build scan passes a clean payload")
        if h:
            fails.append(f"build scan flagged a clean payload: {h[:2]}")
        (pages / "bad.rsc").write_text('1:["$","div",null,{"children":"V2 · priority view"}]\n', encoding="utf-8")
        (pages / "bad.html").write_text('<script src="/_next/static/chunks/abc.js"></script>', encoding="utf-8")
        (nx / "static" / "chunks" / "abc.js").write_text('x={children:"Screen E3 for Kannan"}', encoding="utf-8")
        h = []
        lint_terms.scan_build(h, pages, nx)
        for want in ("V2", "E3", "Kannan"):
            build_checks += 1
            hit = any(f"'{want}'" in x for x in h)
            print(("PASS " if hit else "FAIL ") + f"build scan flags {want!r}")
            if not hit:
                fails.append(f"build scan missed {want!r}")
        # The candidate and local lists may never name the product or the bank.
        bad = Path(d) / "cands.txt"
        bad.write_text("E2\nHDFC Bank\n", encoding="utf-8")
        build_checks += 1
        try:
            lint_terms._terms(bad)
            print("FAIL lint refuses a list that names the bank")
            fails.append("candidate list naming the bank was accepted")
        except SystemExit:
            print("PASS lint refuses a list that names the bank")
    ind_lint = indusind_lint_fixtures(fails)
    ind_rec = indusind_reconcile_fixtures(fails)
    for f in fails:
        print("FAIL", f)
    print(f"test_checks: IndusInd {ind_lint} lint fixtures (26 rules), {ind_rec} reconcile fixtures")
    print(
        f"test_checks: {len(FIXTURES)} reconcile fixtures, {len(LINT_MUST_FLAG) + len(LINT_MUST_PASS) + 1 + build_checks} "
        f"lint fixtures, {len(fails)} failure(s)"
    )
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
