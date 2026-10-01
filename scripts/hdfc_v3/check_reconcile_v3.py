"""Reconcile checks for the V3 layer (B4 §8 check_reconcile, B7 §2). Exit code 1 on any failure.

Public: product rows + excluded businesses = on-topic total (themes.json), and = signals.json by_business.
Internal: every dial, cohort, deliverable and persona figure recomputed from the record-level files. No check reads a
stored pass/fail flag: breach, theme mix, triage buckets and RM alerts are recomputed from records (review step 6).
Each check has a failing fixture in scripts/hdfc_v3/test_checks.py that proves it can fail.

`run(seed_dir, out_dir)` is importable; it returns the list of failed checks.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import sys
from pathlib import Path

from common import BANK_TAT_LABEL, NOW, OUT_APP, SEED_V3, load

NOW_DT = dt.datetime.fromisoformat(NOW)
# Person-level flags are never allowed on a customer: impact belongs to a complaint (B7 §E2).
PERSON_FLAG_KEYS = {"high_impact", "sensitive", "sensitivity", "vip", "official", "regulator", "celebrity", "flag", "flags"}
# Theme-mix rule (B7 §2): internal share within ±20% (relative) of the target share, for themes with ≥ 5% target share.
# Targets are the public mix per product, except where public voice is too thin and the generator uses a disclosed
# substitute (auto loans: the combined loans mix; insurance: a hand-set mix). Those are reported, not hidden.
THIN_PUBLIC = {"auto_loans", "insurance"}
# One store per comparison (B7 §4.1, follow-up fix 2): a store rating or share may only sit inside a per-store scope.
RATING_KEYS = {"avg_rating", "ratings", "share_positive", "new_app_avg", "old_app_avg", "new_app_share_positive", "old_app_share_positive"}
STORE_SCOPES = {"by_store", "versions_by_store"}


def pooled_ratings(obj, path=(), in_store=False) -> list[str]:
    """Paths of rating or share fields that are not inside a single store's scope."""
    out = []
    if isinstance(obj, dict):
        scoped = in_store or "store" in obj
        for k, v in obj.items():
            if k in RATING_KEYS and not scoped:
                out.append("/".join(map(str, path + (k,))))
            out += pooled_ratings(v, path + (k,), scoped or k in STORE_SCOPES)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            out += pooled_ratings(v, path + (i,), in_store)
    return out


def _theme_targets(products: dict) -> tuple[dict, dict]:
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from seed_internal_v3 import HAND_MIX  # the generator's disclosed substitute mixes

    public = {r["id"]: {i["id"]: i["count"] for i in r["issues"]} for r in products["rows"]}
    target = dict(public)
    loans = collections.Counter()
    for lp in ("personal_loans", "home_loans", "auto_loans"):
        loans.update(public.get(lp, {}))
    target["auto_loans"] = dict(loans)
    target.update(HAND_MIX)
    return public, target


def _mix_rows(inter, mix: dict, product: str):
    rows = [r for r in inter if r["product"] == product and not r.get("scripted")]
    cnt = collections.Counter(r["theme"] for r in rows)
    ptot, itot = sum(mix.values()), sum(cnt.values())
    out = []
    for th, n in mix.items():
        ps = n / ptot if ptot else 0
        if ps < 0.05:
            continue
        is_ = cnt.get(th, 0) / itot if itot else 0
        out.append((th, ps, is_, abs(is_ - ps) <= 0.2 * ps))
    return out


def run(seed_dir: Path = SEED_V3, out_dir: Path = OUT_APP, quiet: bool = False) -> list[str]:
    fails: list[str] = []

    def ok(cond: bool, msg: str):
        if not quiet:
            print(("PASS " if cond else "FAIL ") + msg)
        if not cond:
            fails.append(msg)

    themes = load(out_dir / "themes.json")
    signals = load(out_dir / "signals.json")
    products = load(out_dir / "products.json")
    rows_total = sum(r["count"] for r in products["rows"]) + sum(products["excluded"].values())
    ok(rows_total == themes["total_items"], f"public product rows + excluded = on-topic total ({rows_total} = {themes['total_items']})")
    for f in ("count", "negative", "escalation"):
        a = sum(r[f] for r in products["rows"]) + (sum(products["excluded"].values()) if f == "count" else sum(b[f] for b in signals["by_business"] if b["business"] in products["excluded"]))
        e = sum(b[f] for b in signals["by_business"])
        ok(a == e, f"public product {f} reconciles to signals.by_business ({a} = {e})")

    # Store ratings: never pooled across the Play Store and the App Store (follow-up fix 2).
    pulse = load(out_dir / "app_pulse.json")
    release = load(out_dir / "briefing.json").get("release_pulse") or {}
    series = load(out_dir / "store_series.json")
    pooled = pooled_ratings(pulse["apps"], ("app_pulse",)) + pooled_ratings(release, ("release_pulse",)) + pooled_ratings(series["apps"], ("store_series",))
    ok(not pooled, f"store ratings and shares sit within one store ({len(pooled)} pooled: {pooled[:3]})")
    mism = [a["app"] for a in pulse["apps"] if a["window"] and a["window"]["n"] != sum(x["n"] for x in (a.get("by_store") or {}).values())]
    ok(not mism, f"per-store review counts add to each app's total ({mism[:3]})")

    agg = load(seed_dir / "aggregates.json")
    inter = [json.loads(line) for line in open(seed_dir / "interactions.jsonl", encoding="utf-8")]
    customers = {c["masked_id"]: c for c in load(seed_dir / "customers.json")}
    ok(len(inter) == agg["dials"]["total"] == agg["sample"]["interactions"], f"interactions total {len(inter)}")

    # Record integrity: status, closing time and breach agree (breach recomputed, never trusted).
    bad_status = [r["id"] for r in inter if (r["status"] != "closed") != (r["closed_at"] is None)]
    bad_wait = [r["id"] for r in inter if (r["status"] == "waiting_on_customer") != bool(r.get("resolution_sent_at"))]
    ok(not bad_wait, f"waiting on customer = a resolution was sent and the thread is not closed ({len(bad_wait)} bad)")
    ok({r["status"] for r in inter} <= {"open", "closed", "waiting_on_customer"}, "every contact is open, waiting on customer or closed")
    ok(not bad_status, f"open items have no closing time and closed items have one ({len(bad_status)} bad)")
    bad_breach = []
    for r in inter:
        # "First response to a query" is met or missed on the first response; every other deliverable on closure.
        at = r["first_response_at"] if r["deliverable"] == "query_response" else r["closed_at"]
        end = dt.datetime.fromisoformat(at) if at else NOW_DT
        if r["breached"] != (end > dt.datetime.fromisoformat(r["deliverable_due"])):
            bad_breach.append(r["id"])
    ok(not bad_breach, f"breach recomputed from the deliverable due time ({len(bad_breach)} disagree{': ' + ', '.join(bad_breach[:5]) if bad_breach else ''})")

    n_open = sum(1 for r in inter if r["status"] == "open")
    n_otl = sum(1 for r in inter if r["status"] == "open" and r["breached"])
    ok(n_open == agg["dials"]["open"], f"open recomputed {n_open}")
    n_wait = sum(1 for r in inter if r["status"] == "waiting_on_customer")
    ok(n_wait == agg["dials"]["waiting_on_customer"], f"waiting on customer recomputed {n_wait}")
    ok(agg["dials"]["open"] + n_wait + agg["dials"]["closed"] == agg["dials"]["total"], "open + waiting on customer + closed = total")
    ok(n_otl == agg["dials"]["open_too_long"], f"open too long recomputed {n_otl}")
    for f in ("total", "open", "waiting_on_customer", "open_too_long", "closed", "closed_or_responded"):
        ok(sum(p[f] for p in agg["products"]) == agg["dials"][f], f"product dials sum to overall: {f}")
        ok(sum(c[f] for c in agg["channels"]) == agg["dials"][f], f"channel dials sum to overall: {f}")
    ok(sum(d["total"] for d in agg["deliverables"]) == len(inter), "deliverable rows cover every interaction once")
    for d in agg["deliverables"]:
        if d["met"] + d["outside"] != d["measured"]:
            ok(False, f"deliverable {d['id']} met + outside = measured")

    # Cohorts and RM alerts, recomputed from customers and rm_notifications.json.
    notes = {n["masked_id"]: n for n in load(seed_dir / "rm_notifications.json")}
    for c in agg["cohorts"]:
        members = {m for m, x in customers.items() if c["id"] in x["cohorts"]}
        rows = [r for r in inter if r["masked_id"] in members and r["status"] == "open"]
        o24 = sum(1 for r in rows if (NOW_DT - dt.datetime.fromisoformat(r["created_at"])).total_seconds() > 24 * 3600)
        ok(len(members) == c["customers"] and len(rows) == c["open"] and o24 == c["open_over_24h"], f"cohort {c['id']} recomputed (customers, open, over 24 h)")
        ok(c["open_over_24h"] <= c["open_over_5h"] <= c["open"], f"cohort {c['id']} over 24 h <= over 5 h <= open")
        should = {m for m in members if m in notes}
        told = {m for m in should if notes[m]["notified_today"]}
        ok(len(should) == c["rm_should_know"] and len(told) == c["rm_notified_today"],
           f"cohort {c['id']} RM alerts recomputed from rm_notifications ({len(told)} of {len(should)})")
    for p in agg["personas"]:
        n = notes.get(p["masked_id"])
        ok(bool(n and n["notified_today"]) == bool(p["rm_notified"]),
           f"persona {p['masked_id']} RM notified matches rm_notifications")

    hi = sum(1 for r in inter if r["high_impact"])
    ok(hi == agg["high_impact"]["total"], f"high-impact complaints recomputed {hi}")
    contacts = {m: {x["contact_id"] for x in c.get("contacts", [])} for m, c in customers.items()}
    unlinked = [r["id"] for r in inter if r["sender"] == "proxy" and r.get("contact_id") not in contacts[r["masked_id"]]]
    ok(not unlinked, f"every proxy message is linked to a contact record the bank holds ({len(unlinked)} unlinked)")
    flagged = [m for m, c in customers.items() if PERSON_FLAG_KEYS & set(c)]
    ok(not flagged, f"no person-level flag on any customer ({len(flagged)} flagged)")

    emails = load(seed_dir / "escalation_emails.json")
    by_bucket = collections.Counter(e["bucket"] for e in emails)
    ok(len(emails) == agg["triage"]["total"] == 20 and all(by_bucket.get(b["id"], 0) == b["count"] for b in agg["triage"]["buckets"])
       and sum(b["count"] for b in agg["triage"]["buckets"]) == len(emails),
       "20 escalation emails; bucket counts recomputed from the emails")

    public, target = _theme_targets(products)
    mix_fails = []
    for pid in target:
        for th, ps, is_, within in _mix_rows(inter, target[pid], pid):
            if not within:
                mix_fails.append(f"{pid}/{th} {100 * is_:.1f}% vs {100 * ps:.1f}%")
    ok(not mix_fails, f"internal theme shares within ±20% of target mix, recomputed ({len(mix_fails)} outside{': ' + '; '.join(mix_fails[:4]) if mix_fails else ''})")
    if not quiet:
        for pid in sorted(THIN_PUBLIC):
            n = sum(public.get(pid, {}).values())
            off = [th for th, _, _, w in _mix_rows(inter, public.get(pid, {}), pid) if not w]
            print(f"INFO {pid}: public voice is thin (n = {n} theme tags); target mix is the generator's disclosed substitute. "
                  f"Against the raw public mix, {len(off)} theme(s) sit outside ±20%.")

    # One internal dataset (review step 4): the MD mail, satisfaction and deliverables-detail blocks reconcile to the
    # same records and to each other.
    rung = {"grievance": 2, "md_office": 3, "io": 4, "rbi_ombudsman": 5}
    at_least = lambda r, x: bool(r["escalation"]) and rung[r["escalation"]] >= rung[x]  # noqa: E731
    ladder = {x["rung"]: x["count"] for x in agg["deliverables_detail"]["ladder"]}
    md = agg["md_mail"]
    ok(md["total"] == sum(1 for r in inter if at_least(r, "md_office")) == ladder["MD's office"],
       f"MD-marked mail = records at the MD's office rung = ladder rung ({md['total']})")
    ok(sum(r["mails"] for r in md["rows"]) == md["shown"] <= md["total"], "MD mail rows sum to the shown count")
    ok(ladder["Voice"] == len(inter) and ladder["Repeat"] == sum(1 for r in inter if r["repeat"]), "ladder Voice and Repeat recomputed")
    counts = [x["count"] for x in agg["deliverables_detail"]["ladder"][1:]]
    ok(all(a >= b for a, b in zip(counts, counts[1:])), "ladder rungs from Repeat down never increase")
    sat = agg["satisfaction"]
    ok(sat["interactions_total"] == len(inter) == sum(t["interactions"] for t in sat["tiers"]) == sat["journey_stages"]["total"],
       "satisfaction: tiers and journey stages sum to the interaction sample")
    ok(sum(t["negative"] for t in sat["tiers"]) == sum(1 for r in inter if r["sentiment"] == "negative"), "tier negatives recomputed")
    ageing = agg["deliverables_detail"]["ageing"]
    ok(sum(a["open_cases"] for a in ageing) == agg["dials"]["open"], "deliverables ageing: open cases = open dial")
    ok(sum(a["beyond_tat"] for a in ageing) == agg["dials"]["open_too_long"], "deliverables ageing: beyond TAT = open-too-long dial")
    # A bank TAT is shown as a number only once the bank has confirmed it, with the document cited (qa/tat_check.md).
    bad_tat = [
        d["id"]
        for d in agg["deliverables"]
        if d["source"] not in ("rbi", "bank_confirmed") and d["tat_label"] != BANK_TAT_LABEL
        or d["source"] == "bank_confirmed" and (not d.get("source_note") or d["tat_label"] == BANK_TAT_LABEL)
    ]
    ok(not bad_tat, f"bank TATs: unconfirmed read '{BANK_TAT_LABEL}'; confirmed cite a source ({bad_tat[:3]})")
    cl = agg["deliverables_detail"]["closure"]
    ok(cl["closure_requests"] == sum(1 for r in inter if r["theme"] == "closure_requests") and cl["saved"] <= cl["closed"],
       "closure requests recomputed; saved within closed")
    dp = agg["deliverables_detail"]["disputes"]
    disputes = [r for r in inter if r["deliverable"] == "dispute"]
    ledger_row = next(d for d in agg["deliverables"] if d["id"] == "dispute")
    ok(dp["raised"] == len(disputes) == ledger_row["total"], "disputes raised = records = ledger row")
    ok(dp["beyond_sla_total"] == sum(d["cases"] for d in dp["drivers"]) == sum(a["cases"] for a in dp["aged_cases"]),
       "disputes beyond SLA = drivers = age bands")
    f = [x["count"] for x in dp["funnel"]]
    ok(all(a >= b for a, b in zip(f, f[1:])), "dispute funnel: each stage within the one before")
    ok(all(x["status"] == (f"Acknowledged {x['acknowledged_at']}" if x["acknowledged_at"] else "Awaiting owner") for x in agg["routing"]),
       "routing: one acknowledgement status per theme")
    # No value reused across unrelated headline metrics on the exec page.
    head = [agg["dials"]["open"], agg["dials"]["open_too_long"], agg["high_impact"]["total"], agg["customer_memory"]["with_open_issue"], agg["rm"]["should_know"]]
    ok(len(set(head)) == len(head), f"exec headline values are distinct {head}")
    periods_checks(seed_dir, out_dir, inter, customers, ok)
    return fails


CH = {"email": "emails", "inbound_voice": "calls", "outbound_voice": "calls", "chat": "chat", "whatsapp": "whatsapp",
      "social_inbox": "social", "branch": "branch"}


def periods_checks(seed_dir, out_dir, inter, customers, ok):
    """30 Sep views (periods.json): recomputed from dated records for every period; channels sum to their strips;
    short periods never show a public share unweighted when one source dominates."""
    path = out_dir / "periods.json"
    if not path.exists():
        ok(False, "periods.json exists")
        return
    per = load(path)
    end = dt.datetime.fromisoformat(per["end"])
    h48 = dt.timedelta(hours=48)
    rs_all = [r for r in inter if r["channel"] in CH]  # IVR bot is not counted on these views
    # Bank scale (scale_v3.py): every internal figure is a weighted sum of the kept sample rows.
    W = lambda rs: sum(r["w"] for r in rs)  # noqa: E731
    CW = lambda ids: sum(customers[m]["cw"] for m in ids)  # noqa: E731
    scale = load(seed_dir / "scale.json")
    ok(all(isinstance(r.get("w"), int) and r["w"] >= 1 for r in inter) and all(isinstance(c.get("cw"), int) and c["cw"] >= 1 for c in customers.values()),
       "bank scale: every kept row and customer carries a whole-number weight")
    notes = {x["masked_id"]: x for x in load(seed_dir / "rm_notifications.json")}
    for pid, p in per["periods"].items():
        a, b = dt.datetime.fromisoformat(p["start"]), dt.datetime.fromisoformat(p["end"])
        measurable = b - a > h48

        def figs(rs):
            vol = [r for r in rs if a <= dt.datetime.fromisoformat(r["created_at"]) < b]
            still = [r for r in vol if r["status"] != "closed" or (r["closed_at"] and dt.datetime.fromisoformat(r["closed_at"]) > b)]
            wait = [r for r in still if r.get("resolution_sent_at") and dt.datetime.fromisoformat(r["resolution_sent_at"]) <= b]
            op = [r for r in still if r not in wait]  # waiting on the customer is not open with the bank
            figs.waiting = W(wait)
            wait_ids = {r["id"] for r in wait}

            def waited(r):
                if r["id"] in wait_ids:
                    return False
                c = dt.datetime.fromisoformat(r["created_at"])
                fr = dt.datetime.fromisoformat(r["first_response_at"]) if r["first_response_at"] else None
                return (fr - c > h48) if fr and fr <= b else (b - c > h48)
            figs.customers = CW({r["masked_id"] for r in vol})
            return W(vol), W(op), (sum(r["w"] for r in vol if waited(r)) if measurable else None)

        for lst in p["customer_pulse"]["lists"]:
            members = {m for m, c in customers.items() if lst["id"] in c["cohorts"]}
            v, o, n = figs([r for r in rs_all if r["masked_id"] in members])
            ok((v, o, n) == (lst["volume"], lst["open"], lst["not_responded_48h"]),
               f"[{pid}] {lst['label']}: volume, open and 48-hour wait recomputed ({v}, {o}, {n})")
            ok(figs.waiting == lst["waiting_on_customer"], f"[{pid}] {lst['label']}: waiting on customer recomputed ({figs.waiting})")
            ok(0 <= lst["rm"]["alerted"] <= lst["rm"]["of"] <= lst["members"], f"[{pid}] {lst['label']}: RMs alerted within customers due an alert")
            ok(lst["members"] == scale["list_sizes"][lst["id"]] and figs.customers == lst["in_contact"] <= lst["members"],
               f"[{pid}] {lst['label']}: list size from scale.json; customers in contact recomputed ({figs.customers}) and within the list")
            due = {m for m in members if m in notes}
            ok((CW({m for m in due if notes[m]["notified_today"]}), CW(due)) == (lst["rm"]["alerted"], lst["rm"]["of"]),
               f"[{pid}] {lst['label']}: RMs alerted recomputed")
            for k in ("volume", "open", "waiting_on_customer", "not_responded_48h"):
                chans = [c[k] for c in lst["by_channel"].values()]
                total = None if any(c is None for c in chans) else sum(chans)
                ok(total == lst[k], f"[{pid}] {lst['label']}: channels sum to the strip ({k})")
        internal = p["cx_pulse"]["internal"]
        v, o, _ = figs(rs_all)
        ok(v == internal["volume"] and o == internal["open"], f"[{pid}] CX pulse internal volume and open recomputed ({v}, {o})")
        ok(figs.waiting == internal["waiting_on_customer"], f"[{pid}] CX pulse waiting on customer recomputed ({figs.waiting})")
        for k in ("volume", "open", "waiting_on_customer", "resolved"):
            ok(sum(c[k] for c in internal["by_channel"].values()) == internal[k], f"[{pid}] CX pulse internal channels sum ({k})")
        ok(internal["resolved"] + internal["open"] + internal["waiting_on_customer"] == internal["volume"],
           f"[{pid}] resolved + open + waiting on customer = volume")
        sp = p["social_pulse"]
        ext_blk = p["cx_pulse"]["external"]
        play = next((x for x in sp["by_source"] if x["source"] == "playstore"), {"mentions": 0, "responded": 0})
        ok(sp["mentions"] == ext_blk["volume"] and sp["high_impact"] == ext_blk["high_impact"]["volume"],
           f"[{pid}] External block = CX pulse external (mentions, high impact)")
        ok(play["responded"] == ext_blk["responded"]["responded"] and play["mentions"] == ext_blk["responded"]["reviews"],
           f"[{pid}] External block: Play Store responses = CX pulse responded (the live figure)")
        ok(sum(x["mentions"] for x in sp["by_source"]) == sp["mentions"] and sum(x["responded"] for x in sp["by_source"]) == sp["responded"],
           f"[{pid}] External block: sources sum to the combined response figure")
        ok(sp["high_impact_responded"] <= sp["high_impact"] and all(x["illustrative"] == (x["source"] != "playstore") for x in sp["by_source"]),
           f"[{pid}] External block: every simulated source is marked illustrative")
        pk = sp["high_impact_peak"]
        ok((pk is None) == (sp["high_impact"] == 0) and (pk is None or (0 < pk["count"] <= sp["high_impact"] and len(pk["posts"]) <= min(5, pk["count"])
                                                                and all(x["date"] == pk["date"] for x in pk["posts"]))),
           f"[{pid}] High-impact peak day: within the period's high-impact posts, and its posts are from that day")
        men = p["customer_pulse"]["mentions"]
        listed = {m for m, c in customers.items() if any(lst["id"] in c["cohorts"] for lst in p["customer_pulse"]["lists"])}
        ment = [r for r in rs_all if r["channel"] == "social_inbox" and r["masked_id"] in listed
                and a <= dt.datetime.fromisoformat(r["created_at"]) < b]
        ok(men["total"] == W(ment) and men["responded"] == sum(r["w"] for r in ment if r.get("mention_replied")),
           f"[{pid}] High-priority mentions recomputed from the seed ({W(ment)}, replied {men['responded']})")
        if pid == "all":
            ok(55 <= 100 * men["responded"] / max(men["total"], 1) <= 70, "High-priority mentions: full-window response rate within 55-70%")
        ok(men["responded"] + men["not_responded"] == men["total"], f"[{pid}] High-priority mentions: responded + not responded = total")
        ok(len(sp["posts"]) <= 5 and all(x["score"] >= y["score"] for x, y in zip(sp["posts"], sp["posts"][1:])),
           f"[{pid}] Social pulse: at most five posts, ranked by engagement")
        ok("http" not in json.dumps(sp), f"[{pid}] Social pulse carries no links")
        ov = p["cx_pulse"]["overall"]
        ok(ov["total"] == ov["internal"] + ov["external"] == internal["volume"] + p["cx_pulse"]["external"]["volume"],
           f"[{pid}] overall contact volume = internal + external")
        biz = p["businesses"]
        ok(sum(x["internal"]["volume"] for x in biz) == internal["volume"], f"[{pid}] business rows sum to internal volume")
        cards_row = next(x for x in biz if x["id"] == "cards")
        cv = p["cards"]
        ok(cards_row["internal"]["volume"] == cv["internal"]["volume"] and cards_row["external"]["volume"] == cv["external"]["volume"],
           f"[{pid}] Cards: business card = Cards view")
        for side, keys in (("internal", ("volume", "open", "waiting_on_customer", "resolved")), ("external", ("volume", "negative", "positive"))):
            for k in keys:
                ok(sum(c[side][k] for c in cv["categories"]) == cv[side][k], f"[{pid}] Cards categories sum to the Cards {side} {k}")
        for c in cv["categories"]:
            if c["subcategories"]:
                for side, k in (("internal", "volume"), ("internal", "open"), ("internal", "waiting_on_customer"), ("external", "volume"), ("external", "negative")):
                    ok(sum(x[side][k] for x in c["subcategories"]) == c[side][k], f"[{pid}] Cards {c['label']}: subcategories sum ({side} {k})")
        ext = p["cx_pulse"]["external"]
        ok(sum(x["external"]["volume"] for x in biz) <= ext["volume"], f"[{pid}] product rows never exceed public voice (the rest is wealth, SME, corporate)")
        ids = {x["id"] for x in biz}
        items = p["brief"]["needs_you"] + p["brief"]["building"] + p["brief"]["improving"]
        # The one exception is the bank-wide Ombudsman watch item, which names no single business.
        ok(all(it["business"] in ids or (it["business"] == "bank" and it.get("kind") == "ombudsman") for it in items),
           f"[{pid}] every brief item names a business on the cards")
        ok(sum(r["mails"] for r in p["md_mail"]["rows"]) <= p["md_mail"]["total"], f"[{pid}] MD-marked mail rows within the total")
        # Short periods: when one source is more than the limit of public items, every public share must be weighted.
        if p["short"]:
            blocks = [p["cx_pulse"]["external"], p["cx_pulse"]["external"]["high_impact"], cv["external"]]
            blocks += [x["external"] for x in biz]
            dominant = max(p["cx_pulse"]["external"]["source_mix"].values(), default=0) > 100 * per["dominance_limit"]
            unweighted = [blk for blk in blocks if blk.get("share_method") != "source_weighted"]
            ok(not (dominant and unweighted), f"[{pid}] a dominant source (> {int(100 * per['dominance_limit'])}%) never leaves a share unweighted ({len(unweighted)} unweighted)")
    # Across views (follow-up 5): the same status on every V2 screen. The older screens' dials count every channel; the
    # 30 Sep views leave the IVR bot out, so compare on the contacts both count.
    allp = per["periods"]["all"]["cx_pulse"]["internal"]
    ok(allp["open"] == sum(r["w"] for r in rs_all if r["status"] == "open")
       and allp["waiting_on_customer"] == sum(r["w"] for r in rs_all if r["status"] == "waiting_on_customer"),
       "across views: full-window open and waiting on customer = the weighted seed status")
    # The drill-down and customer pages (aggregates.json) count the kept sample rows themselves, and say "sample rows".
    # Same rows, same status: their dials equal the unweighted count of the rows the bank-scale views weight.
    agg = load(seed_dir / "aggregates.json") if (seed_dir / "aggregates.json").exists() else None
    if agg:
        ok(agg["dials"]["open"] == sum(1 for r in inter if r["status"] == "open")
           and agg["dials"]["waiting_on_customer"] == sum(1 for r in inter if r["status"] == "waiting_on_customer"),
           "across views: sample pages count the same rows, by the same status, that the bank-scale views weight")
    ok(per["scale"]["sample_rows"] == len(inter) and per["scale"]["list_sizes"] == scale["list_sizes"],
       "bank scale: periods.json names the sample it is weighted from")
    ordered = [per["periods"][k]["cx_pulse"]["internal"]["volume"] for k in ("brief", "7d", "30d", "all")]
    ok(ordered == sorted(ordered), f"periods nest: Morning brief <= 7 days <= 30 days <= full window {ordered}")
    ombudsman_checks(seed_dir, per, inter, ok)


# ---------------------------------------------------------------- Ombudsman watch (ombudsman_watch_design.md)
# Recomputed here from the complaint register with its own code (not ombudsman_v3), so the two must agree.

def _omb_state(c, T):
    t = lambda k: dt.datetime.fromisoformat(c[k]) if c[k] else None  # noqa: E731
    rec, reply = t("received_at"), t("final_reply_at")
    if rec > T:
        return None
    d30, d90 = dt.timedelta(days=30), dt.timedelta(days=90)
    if reply is None or reply > T:
        age = T - rec
        left = None if age >= d30 else int((rec + d30 - T) / dt.timedelta(days=1))
        dec, io = t("decision_at"), t("io_reviewed_at")
        st = {"open": True, "eligible": d30 <= age < d30 + d90, "brink": left is not None and left <= 10, "unhappy": False,
              "awaiting_io": bool(dec and dec <= T and (io is None or io > T)), "left": left}
    else:
        after = [x for x in c["contacts"] if reply < dt.datetime.fromisoformat(x["at"]) <= T and (x["same_issue"] or x["escalation"])]
        re_ = t("reopened_at")
        unhappy = T < reply + d90 and (bool(after) or bool(re_ and reply < re_ <= T))
        st = {"open": unhappy, "eligible": False, "brink": False, "unhappy": unhappy, "awaiting_io": False, "left": None}
    st["at_risk"] = st["brink"] or st["eligible"] or st["unhappy"]
    return st


def ombudsman_checks(seed_dir, per, inter, ok):
    path = seed_dir / "complaints.jsonl"
    if not path.exists():
        ok(False, "complaints.jsonl exists")
        return
    cs = [json.loads(line) for line in open(path, encoding="utf-8")]
    src = {r["id"]: r for r in inter if r["deliverable"] == "complaint_resolution" and r["channel"] != "ivr_bot"}
    ok(len(cs) == len(src) and {c["source_id"] for c in cs} == set(src),
       f"Ombudsman: one complaint per formal complaint contact (IVR bot excluded) ({len(cs)} = {len(src)})")
    ok(all(c.get("w") == src[c["source_id"]]["w"] for c in cs if c["source_id"] in src), "Ombudsman: each complaint carries its contact's bank-scale weight")
    bad = []
    for c in cs:
        r = src.get(c["source_id"])
        if not r:
            continue
        want = r["closed_at"] if r["status"] == "closed" else r["resolution_sent_at"] if r["status"] == "waiting_on_customer" else None
        if c["received_at"] != r["created_at"] or (c["final_reply_at"] or None) != (want and dt.datetime.fromisoformat(want).isoformat(timespec="minutes")):
            bad.append(c["id"])
        # IO before a rejecting reply: decision < IO review <= final reply; a resolved complaint has no decision.
        if c["final_reply_at"] and c["outcome"] in ("partly_rejected", "rejected"):
            if not (c["decision_at"] and c["io_reviewed_at"] and c["decision_at"] < c["io_reviewed_at"] <= c["final_reply_at"]):
                bad.append(c["id"])
        if c["outcome"] == "resolved" and c["decision_at"]:
            bad.append(c["id"])
    ok(not bad, f"Ombudsman: register matches the contacts and the IO order holds ({bad[:3]})")
    keys = ("brink", "eligible", "unhappy", "awaiting_io", "at_risk", "open")
    for pid, p in per["periods"].items():
        o = p.get("ombudsman")
        co = (p.get("cards") or {}).get("ombudsman")
        if not o or not co:
            ok(False, f"[{pid}] Ombudsman blocks present")
            continue
        for label, blk, scope in (("bank", o, cs), ("Cards", co, [c for c in cs if c["product"] == "cards"])):
            for when, at in (("now", blk["as_of"]), ("prev", blk["prev_as_of"])):
                T = dt.datetime.fromisoformat(at)
                pairs = [(c, s) for c in scope if (s := _omb_state(c, T))]
                sts = [s for _, s in pairs]
                got = {k: sum(c["w"] for c, s in pairs if s[k]) for k in keys}
                ok(all(got[k] == blk[when][k] for k in keys), f"[{pid}] Ombudsman {label} {when} recomputed {got}")
                ok(all(s["open"] for s in sts if s["at_risk"]) and got["at_risk"] <= got["open"],
                   f"[{pid}] Ombudsman {label} {when}: at risk is a subset of open complaints")
                ok(all(s["open"] for s in sts if s["awaiting_io"]), f"[{pid}] Ombudsman {label} {when}: awaiting IO review are open")
            ok(sum(blk["now"]["buckets"].values()) == blk["now"]["brink"], f"[{pid}] Ombudsman {label}: countdown buckets = on the brink")
            ok(all(blk["delta"][k] == blk["now"][k] - blk["prev"][k] for k in keys), f"[{pid}] Ombudsman {label}: changes = now - previous")
        ok(all(sum(x[k] for x in o["by_business"]) == o["now"][k] for k in keys), f"[{pid}] Ombudsman: businesses sum to the bank total")
        cards_row = next(x for x in o["by_business"] if x["id"] == "cards")
        ok(all(cards_row[k] == co["now"][k] for k in keys), f"[{pid}] Ombudsman: Cards view = the Cards row of the bank split")
        ok(all(sum(x[k] for x in co["categories"]) == co["now"][k] for k in ("at_risk", "brink", "eligible", "unhappy", "awaiting_io"))
           and all(sum(y["at_risk"] for y in x["subcategories"]) == x["at_risk"] for x in co["categories"]),
           f"[{pid}] Ombudsman: Cards categories and subcategories sum to the Cards totals")
        T = dt.datetime.fromisoformat(co["as_of"])
        risky = {c["id"] for c in cs if c["product"] == "cards" and (s := _omb_state(c, T)) and s["at_risk"]}
        sl = co["save_list"]
        ok(len(sl) <= 10 and {x["id"] for x in sl} <= risky and [x["score"] for x in sl] == sorted((x["score"] for x in sl), reverse=True),
           f"[{pid}] Ombudsman: save list is at most 10 at-risk Cards complaints, highest score first")
        material = o["now"]["buckets"]["0-3"] > 0 or o["delta"]["eligible"] > 0
        first = p["brief"]["needs_you"][0] if p["brief"]["needs_you"] else {}
        ok(material == (first.get("kind") == "ombudsman") and len(p["brief"]["needs_you"]) <= 3,
           f"[{pid}] Ombudsman: the brief item leads What needs you exactly when the risk is material")


def main() -> int:
    # Windows consoles default to a legacy code page; the report uses "±" and "≤".
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    fails = run()
    print(f"check_reconcile_v3: {len(fails)} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
