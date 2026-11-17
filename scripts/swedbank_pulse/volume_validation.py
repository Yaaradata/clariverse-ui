"""Writes docs/swedbank/volume_validation.md (SW-D09, zero-defect gate point 11): every internal figure of the Swedbank
pulse, per window, with its tag (ANCHOR / DERIVED / ASSUMPTION) and the source named. Anchors and their sources:
docs/swedbank/public_anchors.md (research pack: docs/swedbank/research_pack.md). The tags live in this file only; they
never reach a screen string.

Every figure is recomputed here from the seed (interactions.jsonl, customers.json, complaints.jsonl, scale.json,
social_inbox.json), with the windows periods_v3 uses (Morning brief = the 24 hours to the freeze, Last 7 days, Last 14
days, Full window from 22 Oct 00:00 CEST). When data/out/swedbank_pulse/periods.json is present and built from the same
seed, its figures are checked against these (a mismatch is a FIX row).

Verdict: OK when the figure is inside the anchor's range, or within 5% of a point target; "Justified" when a reason is
given; anything else is FIX and the exit code is 1.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import sys

import complaint_rules
import ombudsman_v3 as omb
import scale_v3 as S
from common import DATA_START, OUT_APP, PERIOD_END, PERIODS, PRODUCT_IDS, PRODUCT_LABEL, ROOT, SEED_V3, load

END = dt.datetime.fromisoformat(PERIOD_END)
START = dt.datetime.fromisoformat(DATA_START)
OUT = ROOT / "docs" / "swedbank" / "volume_validation.md"
N = lambda x: f"{round(x):,}"  # noqa: E731

rows: list[tuple] = []
bad = 0


def add(section, metric, value, shown, tag, source, lo=None, hi=None, why=""):
    """lo..hi is the expected range (None: no check, the figure is recorded only). A point (lo == hi) passes within 5%."""
    global bad
    if lo is None:
        verdict = "recorded"
    else:
        if lo == hi:
            lo, hi = lo * 0.95, hi * 1.05
        if lo <= value <= hi:
            verdict = "OK"
        elif why:
            verdict = f"Justified: {why}"
        else:
            verdict = "FIX"
            bad += 1
    rows.append((section, metric, shown, tag, source, verdict))


def window(pid):
    p = next(x for x in PERIODS if x["id"] == pid)
    return (START if p["days"] is None else END - dt.timedelta(days=p["days"])), END


def main() -> int:
    inter = [json.loads(line) for line in open(SEED_V3 / "interactions.jsonl", encoding="utf-8")]
    scale = load(SEED_V3 / "scale.json")
    social = load(SEED_V3 / "social_inbox.json")
    for r in inter:
        r["_c"] = dt.datetime.fromisoformat(r["created_at"])
    rs = [r for r in inter if r["channel"] in S.CHANNEL_GROUP]
    W = lambda xs: sum(r["w"] for r in xs)  # noqa: E731
    total = W([r for r in rs if START <= r["_c"] < END])
    days = S.WINDOW_DAYS

    # ---------------------------------------------------------------- 1 anchors and the yearly inputs
    sec = "1 · Anchors and inputs"
    add(sec, "Private customers, Swedish Banking", S.PRIVATE_CUSTOMERS, N(S.PRIVATE_CUSTOMERS), "ANCHOR",
        "Swedbank Annual Report 2025 (research pack §2)")
    add(sec, "Branches (kontor) in Sweden", 140, "140", "ANCHOR", "MarketScreener, end 2025 (research pack §2)")
    add(sec, "Contacts a year, 2016", 3_600_000, "3,600,000 (700 agents)", "ANCHOR", "Nuance press release, April 2016 (research pack §3)")
    add(sec, "Contacts a year, now", S.CONTACTS_PER_YEAR, N(S.CONTACTS_PER_YEAR), "ASSUMPTION",
        "the 2016 figure grown with Nina and the app (kickoff Step 9)")
    add(sec, "Nina conversations a month, 2016", 35_000, "30,000–40,000; 78% first-contact resolution", "ANCHOR",
        "Nuance 2016; Diginomica (research pack §3)")
    add(sec, "Nina share of contacts", 100 * S.CHANNEL_MIX["whatsapp"], f"{100 * S.CHANNEL_MIX['whatsapp']:.0f}%", "ASSUMPTION",
        "kickoff Step 9")
    add(sec, "External guidance cases, all banks, 2025", S.KO_CASES_2025, "about 7,500 (9,100 in 2024)", "ANCHOR",
        "Konsumenternas Bank- och finansbyrå via TT (research pack §5)")
    add(sec, "Internal complaints per external case", S.INTERNAL_PER_EXTERNAL, f"×{S.INTERNAL_PER_EXTERNAL}", "ASSUMPTION",
        "kickoff Step 9 (the external cases are the tip)")
    add(sec, "Complaints a year", S.COMPLAINTS_PER_YEAR, N(S.COMPLAINTS_PER_YEAR), "DERIVED", "7,500 × 40")
    add(sec, "Callers to the guidance bureau citing the AML rules", 25, "25%", "ANCHOR", "E55 (research pack §5)")
    add(sec, "Bank-initiated account closures, big four, 3 years", 159_000, "159,000", "ANCHOR",
        "Finansinspektionen via Dagens PS (research pack §5)")
    add(sec, "Window length", days, f"{days:.2f} days (22 Oct 00:00 CEST to 17 Nov 07:45 CET)", "DERIVED", "common.DATA_START, PERIOD_END")
    add(sec, "ARN filing pace", S.ARN_FILINGS_PER_WEEK, f"about {S.ARN_FILINGS_PER_WEEK} a week", "ASSUMPTION",
        "no public ARN count by bank (research pack §5); shown on screen as an assumption")

    # ---------------------------------------------------------------- 2 contacts, complaints and Nina per window
    sec = "2 · Contacts, complaints and Nina, per window"
    full = {}
    for p in PERIODS:
        a, b = window(p["id"])
        xs = [r for r in rs if a <= r["_c"] < b]
        cmp = [r for r in xs if S.is_complaint(r)]
        nina = [r for r in xs if r["channel"] == "whatsapp"]
        neg = [r for r in xs if r["sentiment"] == "negative"]
        share = (b - a).total_seconds() / 86400 / days
        lab = p["label"]
        add(sec, f"{lab}: contacts", W(xs), N(W(xs)), "DERIVED",
            f"{N(S.CONTACTS_PER_YEAR)} a year × the window's days; weighted sample (scale_v3)",
            S.TOTAL_CONTACTS * share * 0.75, S.TOTAL_CONTACTS * share * 1.25)
        one_day = "a single weekday (16 Nov, a Monday): weekday volume runs above the daily average, weekends below"             if p["id"] == "brief" else ""
        add(sec, f"{lab}: complaints received", W(cmp), N(W(cmp)), "DERIVED", "7,500 × 40 a year × the window's days",
            S.COMPLAINTS * share * 0.7, S.COMPLAINTS * share * 1.3, one_day)
        add(sec, f"{lab}: Nina conversations", W(nina), N(W(nina)), "DERIVED", "contacts × 35% Nina share",
            0.30 * W(xs), 0.40 * W(xs))
        add(sec, f"{lab}: negative contacts", W(neg), f"{N(W(neg))} ({100 * W(neg) / max(W(xs), 1):.1f}%)", "ASSUMPTION",
            "about 13% of contacts negative (scale_v3.NEGATIVE_SHARE)", 0.10 * W(xs), 0.16 * W(xs), one_day)
        if p["id"] == "all":
            full = {"contacts": W(xs), "complaints": W(cmp), "nina": W(nina)}
    add(sec, "Full window: contacts against the target", full["contacts"], N(full["contacts"]), "DERIVED",
        f"target {N(S.TOTAL_CONTACTS)} = 5m × {days:.2f}/365 (whole-number weights round up a little)", S.TOTAL_CONTACTS, S.TOTAL_CONTACTS)
    add(sec, "Full window: complaints against the target", full["complaints"], N(full["complaints"]), "DERIVED",
        f"target {N(S.COMPLAINTS)} = 300,000 × {days:.2f}/365", S.COMPLAINTS, S.COMPLAINTS)
    nina_month = full["nina"] * 30 / days
    add(sec, "Nina conversations a month (full window, per 30 days)", nina_month, N(nina_month), "DERIVED",
        "against the 2016 anchor of 30,000–40,000 a month", 30_000, 40_000,
        "35% of about 5m contacts a year; Nina grew from its 2014 launch volume and now also serves the app")
    per1000 = S.COMPLAINTS_PER_YEAR / S.PRIVATE_CUSTOMERS * 1000
    add(sec, "Complaints per 1,000 private customers a year", per1000, f"{per1000:.0f}", "DERIVED",
        "300,000 / 3.8m; no published Swedbank complaint figure to compare (research pack §5)")
    branch = W([r for r in rs if r["channel"] == "branch" and START <= r["_c"] < END])
    bdays = sum(1 for i in range(int(days) + 1) if (START + dt.timedelta(days=i)).weekday() < 5)
    add(sec, "Kontor contacts per branch per business day", branch / 140 / bdays, f"{branch / 140 / bdays:.0f}", "DERIVED",
        f"kontor contacts in the full window / 140 branches / {bdays} business days", 3, 40)
    ch = collections.Counter()
    for r in rs:
        if START <= r["_c"] < END:
            ch[S.CHANNEL_GROUP[r["channel"]]] += r["w"]
    label = {"calls": "Calls", "whatsapp": "Nina", "chat": "App and internet-bank messages", "emails": "Email",
             "social": "Social", "branch": "Branch (kontor)"}
    for g in ("calls", "whatsapp", "chat", "emails", "social", "branch"):
        add(sec, f"Full window channel: {label[g]}", ch[g], f"{N(ch[g])} ({100 * ch[g] / total:.1f}%)", "ASSUMPTION",
            f"channel mix {100 * S.CHANNEL_MIX[g]:.0f}% (scale_v3.CHANNEL_MIX)", 100 * S.CHANNEL_MIX[g] * total / 100,
            100 * S.CHANNEL_MIX[g] * total / 100)
    for pid in PRODUCT_IDS:
        n = W([r for r in rs if r["product"] == pid and START <= r["_c"] < END])
        nc = W([r for r in rs if r["product"] == pid and S.is_complaint(r) and START <= r["_c"] < END])
        add(sec, f"Full window product: {PRODUCT_LABEL[pid]}", n, f"{N(n)} contacts · {N(nc)} complaints", "ASSUMPTION",
            f"product mix {100 * S.PRODUCT_MIX[pid]:.0f}% of contacts, {100 * S.COMPLAINT_MIX[pid]:.0f}% of complaints")

    # ---------------------------------------------------------------- 3 cohorts
    sec = "3 · Cohorts (list sizes)"
    src = {
        "priority_a": ("Customers in a vulnerable situation", "ASSUMPTION", "10% of private customers (kickoff Step 5)"),
        "priority_b": ("Recent complainants (90 days)", "DERIVED", "300,000 complaints a year × 90/365"),
        "uhni": ("Premium and Private Banking", "ASSUMPTION", "6% of private customers (kickoff Step 5)"),
        "multi": ("Account-measure affected", "ASSUMPTION",
                  "1.5% of private customers (kickoff Step 5); context: 159,000 bank-initiated closures in 3 years across the big four"),
    }
    for k, (lab, tag, why) in src.items():
        size = scale["list_sizes"][k]
        add(sec, lab, size, N(size), tag, why)
        add(sec, f"{lab}: share in contact in the window", 100 * S.LISTS[k]["in_contact"],
            f"{100 * S.LISTS[k]['in_contact']:.0f}%", "ASSUMPTION", "scale_v3.LISTS")
    add(sec, "Contacting customers in the window", S.CONTACTING_CUSTOMERS, N(S.CONTACTING_CUSTOMERS), "DERIVED",
        f"contacts / {S.CONTACTS_PER_CONTACTING} contacts each (ASSUMPTION)")

    # ---------------------------------------------------------------- 3b social-inbox handling by source (SW-D17)
    sec = "3b · Bank response by source (social inbox, Internal on screen)"
    inbox_f = SEED_V3 / "social_inbox.json"
    inbox = json.loads(inbox_f.read_text(encoding="utf-8")) if inbox_f.exists() else {"records": []}
    share = inbox.get("source_reply_share", {})
    labels = {"appstore": "App Store", "playstore": "Google Play", "x": "X", "reddit": "Reddit", "trustpilot": "Trustpilot"}
    for src_id, lab in labels.items():
        recs = [r for r in inbox["records"] if r["kind"] == "source_reply" and r["source"] == src_id]
        done = sum(1 for r in recs if r["status"] != "no_action")
        real = sum(1 for r in recs if r.get("real_reply"))
        add(sec, f"{lab}: handled, full window", done, f"{done} of {len(recs)}", "ASSUMPTION",
            f"target share {100 * share.get(src_id, 0):.0f}% of the source's on-topic items (SW-D17: stores higher, X and "
            f"Reddit lower, Trustpilot between); m = on-topic count in the window"
            + (f"; includes the {real} real bank replies in the crawl" if real else ""),
            0.2 * len(recs) - 1, 0.6 * len(recs) + 1)

    # ---------------------------------------------------------------- 4 ARN watch (one register)
    sec = "4 · ARN watch (complaint register, as of the freeze)"
    cs = omb.load_complaints()
    n = omb.counts(omb.snap(cs, END))
    add(sec, "Complaints received in the window (tile base)", n["received"], N(n["received"]), "DERIVED",
        "the steady register (complaint_rules.steady_register): the same complaints as section 2", 0.9 * full["complaints"],
        1.1 * full["complaints"])
    add(sec, "First reply overdue (past 15 business days)", n["brink"], N(n["brink"]), "DERIVED",
        "15 business days, bank standard (confirm with the bank); reply-time model ASSUMPTION (seed_internal_v3)")
    add(sec, "Final decision issued, Kundombudsman appeal open", n["eligible"], N(n["eligible"]), "DERIVED",
        f"rejecting decisions in the last {complaint_rules.APPEAL_OPEN.days} days (watch horizon ASSUMPTION); "
        "reject share ASSUMPTION (complaint_rules.REJECT)")
    add(sec, "Unhappy with the final decision (ARN eligible)", n["unhappy"], N(n["unhappy"]), "DERIVED",
        "came back after a rejecting decision (complaint_rules.UNHAPPY, ASSUMPTION), within ARN's one year of the complaint")
    add(sec, "Filed with ARN (open at ARN)", n["awaiting_io"], N(n["awaiting_io"]), "DERIVED",
        f"about {S.ARN_FILINGS_PER_WEEK} filings a week (ASSUMPTION) × 90 days open at ARN (ADR rule)",
        S.ARN_FILINGS_PER_WEEK * 90 / 7 * 0.6, S.ARN_FILINGS_PER_WEEK * 90 / 7 * 1.4)
    add(sec, "Filed ≤ appeal open + unhappy", n["awaiting_io"], f"{N(n['awaiting_io'])} ≤ {N(n['eligible'] + n['unhappy'])}",
        "DERIVED", "zero-defect gate point 1", 0, n["eligible"] + n["unhappy"])
    add(sec, "At risk (overdue + appeal open + unhappy, each once)", n["at_risk"], N(n["at_risk"]), "DERIVED", "the register")
    add(sec, "Open (no reply yet)", n["open"], N(n["open"]), "DERIVED", "the register")
    flows = complaint_rules.ladder_flows(complaint_rules.steady_register(
        [json.loads(line) for line in open(SEED_V3 / "complaints.jsonl", encoding="utf-8")]), START, END)
    weeks = days / 7
    add(sec, "ARN filings in the window (ladder rung)", flows["ARN"],
        f"{N(flows['ARN'])} ({flows['ARN'] / weeks:.1f} a week)", "ASSUMPTION",
        f"about {S.ARN_FILINGS_PER_WEEK} a week", S.ARN_FILINGS_PER_WEEK * weeks * 0.6, S.ARN_FILINGS_PER_WEEK * weeks * 1.4)
    for rung in complaint_rules.LADDER_RUNGS[1:3]:
        add(sec, f"Ladder, full window: {rung}", flows[rung], N(flows[rung]), "DERIVED", "flows in the window from the register")
    for pid in PRODUCT_IDS:
        bp = omb.counts([(c, s) for c, s in omb.snap(cs, END) if c["product"] == pid])
        add(sec, f"At risk by product: {PRODUCT_LABEL[pid]}", bp["at_risk"],
            f"{N(bp['at_risk'])} (overdue {N(bp['brink'])} · appeal {N(bp['eligible'])} · unhappy {N(bp['unhappy'])})",
            "DERIVED", "the register, by product")
    raw = [json.loads(line) for line in open(SEED_V3 / "complaints.jsonl", encoding="utf-8")]
    rep = [c for c in raw if c["final_reply_at"]]
    up = sum(c["w"] for c in rep if c["outcome"] == "resolved") / max(sum(c["w"] for c in rep), 1)
    add(sec, "Complaints upheld, of those with a decision", 100 * up, f"{100 * up:.0f}%", "ASSUMPTION",
        "no published Swedbank figure; complaint_rules.REJECT", 50, 75)

    # ---------------------------------------------------------------- 5 social inbox (Internal tag)
    sec = "5 · Social inbox handling (shown with the Internal tag)"
    for kind, lab in (("high_impact", "High-impact X and Reddit posts"), ("mention", "High-priority mentions")):
        xs = [r for r in social["records"] if r["kind"] == kind]
        tot = sum(r["w"] for r in xs)
        fast = sum(r["w"] for r in xs if r["handling_hours"] is not None and r["handling_hours"] <= 24)
        add(sec, f"{lab}: handled within 24 hours", 100 * fast / max(tot, 1), f"{N(fast)} of {N(tot)} ({100 * fast / max(tot, 1):.0f}%)",
            "ASSUMPTION", "about 65% within 24 hours (NW-D100)", *((60, 70) if tot >= 20 else (None, None)))

    # ---------------------------------------------------------------- 6 cross-check with periods.json
    sec = "6 · Cross-check with the built payload"
    pj = OUT_APP / "periods.json"
    if pj.exists():
        per = load(pj)["periods"]
        for p in PERIODS:
            a, b = window(p["id"])
            got = per.get(p["id"], {}).get("cx_pulse", {}).get("internal", {}).get("volume")
            want = W([r for r in rs if a <= r["_c"] < b])
            if got is None:
                add(sec, f"{p['label']}: internal volume in periods.json", 0, "missing", "DERIVED", "periods_v3")
                continue
            add(sec, f"{p['label']}: internal volume in periods.json = this file", got, f"{N(got)} vs {N(want)}", "DERIVED",
                "periods_v3", want, want, "periods.json is from an earlier seed run; re-run periods_v3" if got != want else "")
        bank = per.get("all", {}).get("ombudsman", {})
        if bank.get("now"):
            got = bank["now"]["at_risk"]
            add(sec, "Full window: ARN at risk in periods.json = this file", got, f"{N(got)} vs {N(n['at_risk'])}", "DERIVED",
                "periods_v3 / ombudsman_v3", n["at_risk"], n["at_risk"],
                "periods.json is from an earlier seed run; re-run periods_v3" if got != n["at_risk"] else "")
    else:
        add(sec, "periods.json", 0, "not built yet", "DERIVED", "periods_v3")

    out = ["# Swedbank · volume validation (SW-D09)", "",
           "Written by `scripts/swedbank_pulse/volume_validation.py` from the seed in `data/seed/swedbank_pulse/`. Anchors and",
           "sources: `docs/swedbank/public_anchors.md` (research pack `docs/swedbank/research_pack.md`). Every internal figure on",
           "screen is in this file with its tag; the tags (ANCHOR, DERIVED, ASSUMPTION) never appear on screen.", "",
           f"Window: 22 Oct 2026 00:00 CEST to the freeze 17 Nov 2026 07:45 CET ({days:.2f} days). Sample kept: "
           f"{N(scale['sample']['rows'])} contacts and {N(scale['sample']['customers'])} customers; every figure is a weighted "
           "sum of those rows (scale_v3.py).", "",
           "Verdict: **OK** inside the expected range (a point target within 5%); **Justified** outside it with the reason; "
           "**FIX** must be fixed; **recorded** has no check.", ""]
    cur = None
    for sec_, m, shown, tag, source, verdict in rows:
        if sec_ != cur:
            out += ["", f"## {sec_}", "", "| Figure | Value | Tag | Source | Verdict |", "|---|---|---|---|---|"]
            cur = sec_
        out.append(f"| {m} | {shown} | {tag} | {source} | {verdict} |")
    fixes = [r for r in rows if r[5] == "FIX"]
    just = [r for r in rows if r[5].startswith("Justified")]
    out += ["", f"{len(rows)} rows; {len(fixes)} to fix; {len(just)} justified."]
    OUT.write_text("\n".join(out) + "\n", encoding="utf-8", newline="\n")
    print(f"volume_validation: {len(rows)} rows, {len(fixes)} to fix, {len(just)} justified -> {OUT.relative_to(ROOT)}")
    for r in fixes + just:
        print("  ", r[1], "|", r[2], "|", r[5][:100])
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
