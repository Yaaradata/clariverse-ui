"""Period figures for the two V2 views of the 30 Sep review (docs/demo-rebuild/changes_30sep.md).

Writes data/out/app_jul_sep/periods.json: for each period (Morning brief, 7 days, 30 days, full window) every figure the
MD's office / Head of CX view and the Cards business-head view show, recomputed from dated records:
  internal · illustrative   data/seed/internal_v3/interactions.jsonl, customers.json, rm_notifications.json
  public · live             data/out/app_jul_sep/work/classified.jsonl (bank, on-topic)
Nothing is hard-coded per period. Every period ends at the last moment in the data (29 Sep 08:30), not the real clock.

Definitions (stated on screen):
  Volume               items created in the period. IVR bot calls are not counted (not a customer contact channel).
  Open                 of the period's volume, still open at the period end (29 Sep 08:30).
  Not responded, 48 h  of the period's volume, contacts that waited more than 48 hours for a first reply, or are still
                       waiting after 48 hours, as of 29 Sep 08:30.
  Open too long        of the period's volume, contacts still open more than 48 hours after they came in.
  Neither 48-hour figure can be measured for the 24-hour Morning brief: the screen shows "—" and says why.
  Responded (public)   a bank reply on a Play Store review (the only source with reply data).
  High impact (public) a post with reach: X from an account with 10,000+ followers, or with 50+ likes or 20+ reposts;
                       Reddit with 50+ upvotes; a store review 20+ people found helpful.
Shares on public voice are source-weighted (each source by its share of the whole window), so a burst in one source,
such as the capped late-September X run, cannot move them. Public volume trends use store reviews and forums only:
X is collected in capped weekly runs and Reddit changed collector on 1 Sep.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import sys
from pathlib import Path

from common import (
    CARDS_CATEGORIES,
    CARDS_OTHER,
    CHANNEL_GROUP,
    CHANNEL_GROUP_LABEL,
    CHANNEL_GROUP_ORDER,
    DATA_START,
    DEFAULT_PERIOD,
    JOURNEY_ORDER,
    JOURNEY_STAGE,
    OUT_APP,
    PERIOD_END,
    PERIODS,
    PRODUCT_LABEL,
    PULSE_LISTS,
    BRIEF_BUSINESSES,
    SEED_V3,
    SOURCE_DOMINANCE_LIMIT,
    dump,
    load,
)

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "hdfc_pipeline"))
from aggregate import quotable  # noqa: E402  (a quote naming a person is never used)
from pii_names import ALLEGATION  # noqa: E402  (nor, as an anecdote, one that makes an allegation)
from public_v3 import PRODUCTS as PUB_PRODUCTS  # noqa: E402
from public_v3 import product_of  # noqa: E402

END = dt.datetime.fromisoformat(PERIOD_END)
START = dt.datetime.fromisoformat(DATA_START)
H48 = dt.timedelta(hours=48)
PUBLIC_END = dt.datetime(2026, 9, 28, 23, 59, 59, tzinfo=END.tzinfo)
SOURCE_LABEL = {"playstore": "Play Store", "appstore": "App Store", "x": "X", "reddit": "Reddit", "forum": "Forums"}
TREND_SOURCES = {"playstore", "appstore", "forum"}  # continuous collection across any two windows
LIST_LABEL = {
    "priority_a": "Ultra sensitive",
    "priority_b": "RBI & Government",
    "uhni": "Ultra HNI",
    "multi": "Customers with multiple relationships",
}
PRODUCT_ORDER = [p["id"] for p in PUB_PRODUCTS]


def ts(s: str | None) -> dt.datetime | None:
    return dt.datetime.fromisoformat(s) if s else None


def pct(a, b, d=1):
    return round(100 * a / b, d) if b else None


def change(now, prev):
    return round(100 * (now - prev) / prev, 1) if prev else None


# ------------------------------------------------------------------ windows

def windows(p: dict) -> dict:
    if p["days"]:
        start = END - dt.timedelta(days=p["days"])
        prev = (start - dt.timedelta(days=p["days"]), start)
        compare = f"vs the previous {p['days']} days" if p["days"] > 1 else "vs the day before"
        n = min(8, int((END - START) / dt.timedelta(days=p["days"])))
        series = [(END - dt.timedelta(days=p["days"] * (k + 1)), END - dt.timedelta(days=p["days"] * k)) for k in range(n)][::-1]
    else:
        start = START
        mid = START + (END - START) / 2
        prev = (START, mid)  # full window: trends compare the second half with the first
        compare = "second half vs first half of the window"
        series, w = [], END
        while w - dt.timedelta(days=7) >= START:
            series.append((w - dt.timedelta(days=7), w))
            w -= dt.timedelta(days=7)
        series = series[::-1]
    cur_for_trend = (START + (END - START) / 2, END) if not p["days"] else (start, END)
    return {"start": start, "end": END, "prev": prev, "trend_cur": cur_for_trend, "compare": compare, "series": series}


# ------------------------------------------------------------------ internal

def load_internal():
    inter = [json.loads(line) for line in open(SEED_V3 / "interactions.jsonl", encoding="utf-8")]
    inter = [r for r in inter if r["channel"] in CHANNEL_GROUP]  # IVR bot excluded everywhere
    for r in inter:
        r["_c"] = ts(r["created_at"])
        r["_closed"] = ts(r["closed_at"])
        r["_resp"] = ts(r["first_response_at"])
        r["_ch"] = CHANNEL_GROUP[r["channel"]]
    customers = {c["masked_id"]: c for c in load(SEED_V3 / "customers.json")}
    notes = load(SEED_V3 / "rm_notifications.json")
    return inter, customers, notes


def open_at(r, t):
    return r["_c"] <= t and (r["_closed"] is None or r["_closed"] > t)


def no_resp_48(r, t=END):
    """Waited more than 48 hours for a first reply (answered late, or still waiting after 48 hours), as of t."""
    if r["_resp"] is not None and r["_resp"] <= t:
        return r["_resp"] - r["_c"] > H48
    return t - r["_c"] > H48


def open_48(r, t=END):
    """Still open more than 48 hours after it came in, as of t."""
    return open_at(r, t) and t - r["_c"] > H48


def in_win(r, a, b):
    return a <= r["_c"] < b


def internal_block(rs, w) -> dict:
    a, b = w["start"], w["end"]
    vol = [r for r in rs if in_win(r, a, b)]
    pa, pb = w["prev"]
    prev = sum(1 for r in rs if in_win(r, pa, pb))
    ta, tb = w["trend_cur"]
    cur_t = sum(1 for r in rs if in_win(r, ta, tb))
    measurable = (b - a) > H48  # a 24-hour window cannot hold anything 48 hours old
    return {
        "volume": len(vol),
        "prev_volume": prev,
        "change_pct": change(cur_t, prev),
        "resolved": sum(1 for r in vol if not open_at(r, b)),
        "open": sum(1 for r in vol if open_at(r, b)),
        "open_too_long": sum(1 for r in vol if open_48(r, b)) if measurable else None,
        "not_responded_48h": sum(1 for r in vol if no_resp_48(r, b)) if measurable else None,
        "negative": sum(1 for r in vol if r["sentiment"] == "negative"),
        "escalations": sum(1 for r in vol if r.get("escalation")),
    }


def by_channel(rs, w, keys=("volume", "open", "not_responded_48h", "open_too_long", "resolved")) -> dict:
    out = {}
    for ch in CHANNEL_GROUP_ORDER:
        blk = internal_block([r for r in rs if r["_ch"] == ch], w)
        out[ch] = {k: blk[k] for k in keys}
    return out


def customer_pulse(inter, customers, notes, w) -> dict:
    lists = []
    for lid in PULSE_LISTS:
        members = {m for m, c in customers.items() if lid in c["cohorts"]}
        rs = [r for r in inter if r["masked_id"] in members]
        blk = internal_block(rs, w)
        lists.append({
            "id": lid,
            "label": LIST_LABEL[lid],
            "members": len(members),
            "volume": blk["volume"],
            "prev_volume": blk["prev_volume"],
            "change_pct": blk["change_pct"],
            "open": blk["open"],
            "not_responded_48h": blk["not_responded_48h"],
            # Trend line: the same measure for each earlier window of the period's length, all as of 29 Sep 08:30.
            "not_responded_series": [
                {"end": e.isoformat(), "count": sum(1 for r in rs if in_win(r, s, e) and no_resp_48(r))} for s, e in w["series"]
            ],
            "volume_series": [{"end": e.isoformat(), "count": sum(1 for r in rs if in_win(r, s, e))} for s, e in w["series"]],
            "by_channel": by_channel(rs, w, ("volume", "open", "not_responded_48h")),
        })
    # High-priority mentions: posts where a listed customer tagged the bank, linked only through the bank's verified
    # handles or contact records (the social inbox). Synthetic, internal · illustrative.
    listed = {m for m, c in customers.items() if any(k in c["cohorts"] for k in PULSE_LISTS)}
    a, b = w["start"], w["end"]
    ment = [r for r in inter if r["_ch"] == "social" and r["masked_id"] in listed and in_win(r, a, b)]
    responded = sum(1 for r in ment if r["_resp"] and r["_resp"] <= b)
    by_list = {}
    for lid in PULSE_LISTS:
        ms = [r for r in ment if lid in customers[r["masked_id"]]["cohorts"]]
        by_list[lid] = {"total": len(ms), "responded": sum(1 for r in ms if r["_resp"] and r["_resp"] <= b)}
    due = {n["masked_id"] for n in notes if any(k in customers[n["masked_id"]]["cohorts"] for k in PULSE_LISTS)}
    told = {n["masked_id"] for n in notes if n["notified_today"] and n["masked_id"] in due}
    return {
        "lists": lists,
        "mentions": {
            "provenance": "internal",
            "total": len(ment),
            "responded": responded,
            "not_responded": len(ment) - responded,
            "by_list": by_list,
            "rule": "A post counts only when the bank's own verified handles or contact records link it to a listed customer; LisN never matches people from public data.",
        },
        "rm": {"alerted": len(told), "of": len(due), "as_of": PERIOD_END},
    }


# ------------------------------------------------------------------ public

def load_public():
    rows = [json.loads(line) for line in open(OUT_APP / "work" / "classified.jsonl", encoding="utf-8")]
    out = []
    for r in rows:
        if r["relevant"] != "on_topic" or r["entity"] != "hdfc_bank":
            continue
        c = ts(r["created_at"])
        if not (START <= c <= PUBLIC_END):
            continue
        r["_c"] = c
        r["_product"] = product_of(r)
        out.append(r)
    return out


def reach(r) -> bool:
    e = r.get("engagement") or {}
    if r["source"] == "x":
        return (r.get("author_followers") or 0) >= 10000 or (e.get("likes") or 0) >= 50 or (e.get("reposts") or 0) >= 20
    if r["source"] == "reddit":
        return (e.get("upvotes") or 0) >= 50
    if r["source"] in ("playstore", "appstore"):
        return (e.get("helpful") or 0) >= 20
    return False


def source_weights(pub) -> dict:
    c = collections.Counter(r["source"] for r in pub)
    n = sum(c.values())
    return {s: v / n for s, v in c.items()}


def weighted_share(rs, pred, W, min_items: int = 3):
    """Source-weighted share (%) of rs where pred holds: each source's own share, weighted by its window share."""
    by = collections.defaultdict(list)
    for r in rs:
        by[r["source"]].append(r)
    num = den = 0.0
    for s, xs in by.items():
        if len(xs) >= min_items and s in W:
            num += W[s] * sum(1 for r in xs if pred(r)) / len(xs)
            den += W[s]
    if not den:
        return pct(sum(1 for r in rs if pred(r)), len(rs))
    return round(100 * num / den, 1)


def replies(rs) -> dict:
    ps = [r for r in rs if r["source"] == "playstore"]
    pos = [r for r in ps if r["sentiment"] == "positive"]
    neg = [r for r in ps if r["sentiment"] == "negative"]
    rep = lambda xs: sum(1 for r in xs if r.get("reply"))  # noqa: E731
    return {
        "reviews": len(ps),
        "responded": rep(ps),
        "positive_reviews": len(pos),
        "positive_responded": rep(pos),
        "negative_reviews": len(neg),
        "negative_responded": rep(neg),
    }


def public_block(rs_all, w, W, keep=lambda r: True) -> dict:
    a, b = w["start"], w["end"]
    rs = [r for r in rs_all if keep(r) and a <= r["_c"] < b]
    pa, pb = w["prev"]
    ta, tb = w["trend_cur"]
    basis = lambda r: r["source"] in TREND_SOURCES and not (w["prev"][0] == START and r.get("app_name") == "HDFC Bank app" and r["source"] == "playstore")  # noqa: E731
    cur_t = sum(1 for r in rs_all if keep(r) and basis(r) and ta <= r["_c"] < tb)
    prev_t = sum(1 for r in rs_all if keep(r) and basis(r) and pa <= r["_c"] < pb)
    hi = [r for r in rs if reach(r)]
    return {
        "volume": len(rs),
        "positive": sum(1 for r in rs if r["sentiment"] == "positive"),
        "negative": sum(1 for r in rs if r["sentiment"] == "negative"),
        "neutral": sum(1 for r in rs if r["sentiment"] == "neutral"),
        "positive_share": weighted_share(rs, lambda r: r["sentiment"] == "positive", W),
        "negative_share": weighted_share(rs, lambda r: r["sentiment"] == "negative", W),
        "share_method": "source_weighted",
        "change_pct": change(cur_t, prev_t),
        "trend_basis": {"current": cur_t, "previous": prev_t, "sources": sorted(TREND_SOURCES)},
        "escalation": sum(1 for r in rs if r["escalation_intent"]),
        "repeat_contact": sum(1 for r in rs if r["repeat_contact"]),
        "responded": replies(rs),
        "high_impact": {
            "volume": len(hi),
            "positive": sum(1 for r in hi if r["sentiment"] == "positive"),
            "negative": sum(1 for r in hi if r["sentiment"] == "negative"),
            "positive_share": weighted_share(hi, lambda r: r["sentiment"] == "positive", W, 1),
            "negative_share": weighted_share(hi, lambda r: r["sentiment"] == "negative", W, 1),
            "share_method": "source_weighted",
            "responded": replies(hi),
        },
        "source_mix": {s: pct(v, len(rs)) for s, v in collections.Counter(r["source"] for r in rs).most_common()},
    }


def anecdote(rs, theme):
    # A card's anecdote is the business's voice in one line: never a quote naming a person, and never an allegation
    # (fraud, corruption, lying…) even against an unnamed role, which on an exec screen reads as the bank's view.
    cands = [
        r for r in rs
        if quotable(r) and r["summary"] and r["sentiment"] == "negative"
        and not ALLEGATION.search(f"{r['summary']} {r.get('text') or ''}")
    ]
    pick = [r for r in cands if theme in r["themes"]] or cands
    if not pick:
        return None

    def eng(r):
        e = r.get("engagement") or {}
        return sum(v for v in e.values() if isinstance(v, (int, float)))

    r = sorted(pick, key=lambda r: (eng(r), r["created_at"]), reverse=True)[0]
    return {"summary": r["summary"], "source_label": SOURCE_LABEL[r["source"]], "date": r["created_at"][:10]}


def theme_labels():
    return {t["id"]: t["label"] for t in load(OUT_APP / "themes.json")["themes"]}


# ------------------------------------------------------------------ businesses, brief

def businesses(inter, pub, w, W, labels) -> list[dict]:
    out = []
    a, b = w["start"], w["end"]
    for pid in PRODUCT_ORDER:
        irs = [r for r in inter if r["product"] == pid]
        ib = internal_block(irs, w)
        pb = public_block(pub, w, W, keep=lambda r, pid=pid: r["_product"] == pid)
        prs = [r for r in pub if r["_product"] == pid and a <= r["_c"] < b]
        neg_t = collections.Counter(r["themes"][0] for r in prs if r["sentiment"] == "negative")
        top = neg_t.most_common(1)[0] if neg_t else None
        if not top:  # thin public voice: fall back to the internal top issue, and say so
            it = collections.Counter(r["theme"] for r in irs if in_win(r, a, b) and r["sentiment"] == "negative").most_common(1)
            top_issue = {"id": it[0][0], "label": labels.get(it[0][0], it[0][0]), "count": it[0][1], "source": "internal"} if it else None
        else:
            top_issue = {"id": top[0], "label": labels.get(top[0], top[0]), "count": top[1], "source": "public"}
        out.append({
            "id": pid,
            "label": PRODUCT_LABEL[pid],
            "overall_volume": ib["volume"] + pb["volume"],
            "internal": ib,
            "external": pb,
            "top_issue": top_issue,
            "anecdote": anecdote(prs, top_issue["id"]) if top_issue else None,
        })
    return out


def brief(biz: list[dict], pub, w, W, labels, p) -> dict:
    """Bank-wide morning brief, derived from the business cards. Each item names its business."""
    a, b = w["start"], w["end"]
    ta, tb = w["trend_cur"]
    pa, pb = w["prev"]
    by = {x["id"]: x for x in biz}
    cards = [by[i] for i in BRIEF_BUSINESSES]
    min_n = {"brief": 3, "7d": 8, "30d": 20, "all": 30}[p["id"]]
    needs = []
    for x in cards:
        otl = x["internal"]["open_too_long"]
        # In a 24-hour brief nothing can be 48 hours old: the open count stands in, and the text says which.
        backlog, what = (otl, "internal cases open over 48 hours") if otl is not None else (x["internal"]["open"], "internal cases still open")
        sev = backlog + x["external"]["escalation"]
        if sev and x["top_issue"]:
            needs.append((sev, {
                "business": x["id"], "business_label": x["label"], "issue": x["top_issue"]["label"],
                "text": f"{x['external']['escalation']} posts with escalation language; {backlog} {what}.",
            }))
    needs = [v for _, v in sorted(needs, key=lambda z: -z[0])][:3]
    taken = {(n["business"], n["issue"]) for n in needs}
    building = []
    for x in cards:
        pid = x["id"]
        cur = [r for r in pub if ta <= r["_c"] < tb]
        prv = [r for r in pub if pa <= r["_c"] < pb]
        ids_by_theme = collections.defaultdict(set)
        for r in cur + prv:
            if r["_product"] == pid:
                ids_by_theme[r["themes"][0]].add(r["id"])
        for th, ids in ids_by_theme.items():
            n_now = sum(1 for r in cur if r["id"] in ids)
            if n_now < min_n or (pid, labels.get(th, th)) in taken:
                continue
            s_now = weighted_share(cur, lambda r, ids=ids: r["id"] in ids, W, 1)
            s_prev = weighted_share(prv, lambda r, ids=ids: r["id"] in ids, W, 1)
            if s_prev and s_now and s_now >= 1.3 * s_prev:
                building.append((s_now / s_prev, {
                    "business": pid, "business_label": x["label"], "issue": labels.get(th, th),
                    "text": f"{n_now} public items; share of voice up {round(100 * (s_now - s_prev) / s_prev)}% {w['compare']}, source-weighted.",
                }))
    building = [v for _, v in sorted(building, key=lambda z: -z[0])][:3]
    improving = []
    for x in cards:
        cur = [r for r in pub if r["_product"] == x["id"] and ta <= r["_c"] < tb]
        prv = [r for r in pub if r["_product"] == x["id"] and pa <= r["_c"] < pb]
        if len(cur) < min_n or len(prv) < min_n:
            continue
        n_now = weighted_share(cur, lambda r: r["sentiment"] == "negative", W, 1)
        n_prev = weighted_share(prv, lambda r: r["sentiment"] == "negative", W, 1)
        if n_now is None or n_prev is None or not n_prev:
            continue
        d = (n_now - n_prev) / n_prev
        if d <= -0.15:
            improving.append((0, d, {"business": x["id"], "business_label": x["label"], "status": "improving",
                                     "text": f"Negative share down from {n_prev:.0f}% to {n_now:.0f}% {w['compare']}."}))
        elif abs(d) < 0.10:
            improving.append((1, d, {"business": x["id"], "business_label": x["label"], "status": "stable",
                                     "text": f"Negative share steady at {n_now:.0f}% ({n_prev:.0f}% before)."}))
    improving = [v for *_, v in sorted(improving, key=lambda z: (z[0], z[1]))][:3]
    return {
        "needs_you": needs,
        "building": building,
        "improving": improving,
        "rules": (
            "What needs you: the businesses with the most internal cases open over 48 hours (still open, in the "
            "Morning brief) plus public posts with escalation language. Signals that are building: issues whose source-weighted share of public voice rose "
            f"by 30% or more {w['compare']} (at least {min_n} items). Improving or stable: businesses whose negative "
            "share fell 15% or more, or held within 10%."
        ),
    }


# ------------------------------------------------------------------ cards view

def cat_of(theme: str) -> dict:
    return next((c for c in CARDS_CATEGORIES if theme in c["themes"]), CARDS_OTHER)


def cards_view(inter, customers, pub, w, W, labels) -> dict:
    a, b = w["start"], w["end"]
    irs = [r for r in inter if r["product"] == "cards"]
    keep = lambda r: r["_product"] == "cards"  # noqa: E731
    prs_all = [r for r in pub if keep(r)]
    prs = [r for r in prs_all if a <= r["_c"] < b]
    ivol = [r for r in irs if in_win(r, a, b)]

    def cat_row(c, sub_themes=None):
        themes = sub_themes or c["themes"]
        if c["id"] == "other" and sub_themes is None:
            known = {t for x in CARDS_CATEGORIES for t in x["themes"]}
            ir = [r for r in irs if r["theme"] not in known]
            pk = lambda r: keep(r) and r["themes"][0] not in known  # noqa: E731
        else:
            ir = [r for r in irs if r["theme"] in themes]
            pk = lambda r, themes=themes: keep(r) and r["themes"][0] in themes  # noqa: E731
        ib = internal_block(ir, w)
        pbk = public_block(pub, w, W, keep=pk)
        return {
            "internal": {k: ib[k] for k in ("volume", "resolved", "open", "open_too_long", "escalations", "change_pct")},
            "external": {k: pbk[k] for k in ("volume", "positive", "negative", "negative_share", "escalation", "responded", "high_impact", "change_pct")},
            "trend": [{"end": e.isoformat(), "internal": sum(1 for r in ir if in_win(r, s, e)),
                       "external": sum(1 for r in prs_all if pk(r) and s <= r["_c"] < e)} for s, e in w["series"]],
        }

    cats = []
    for c in [*CARDS_CATEGORIES, CARDS_OTHER]:
        row = cat_row(c)
        if not (row["internal"]["volume"] or row["external"]["volume"]):
            continue
        subs = []
        if c["id"] != "other":
            for th in c["themes"]:
                sr = cat_row(c, [th])
                if sr["internal"]["volume"] or sr["external"]["volume"]:
                    subs.append({"id": th, "label": labels.get(th, th), **sr})
            subs.sort(key=lambda s: -(s["internal"]["volume"] + s["external"]["volume"]))
        cats.append({"id": c["id"], "label": c["label"], "owner": c["owner"], "tat_related": c["tat"], **row, "subcategories": subs})
    cats.sort(key=lambda c: -(c["internal"]["volume"] + c["external"]["volume"]))

    ib = internal_block(irs, w)
    pbk = public_block(pub, w, W, keep=keep)
    # Mood: source-weighted net sentiment of Cards public voice, this period vs the comparison window.
    ta, tb = w["trend_cur"]
    pa, pbb = w["prev"]
    net = lambda xs: (weighted_share(xs, lambda r: r["sentiment"] == "positive", W) or 0) - (weighted_share(xs, lambda r: r["sentiment"] == "negative", W) or 0) if xs else None  # noqa: E731
    cur_m = [r for r in prs_all if ta <= r["_c"] < tb]
    prv_m = [r for r in prs_all if pa <= r["_c"] < pbb]
    mood = {"net": round(net(prs), 1) if prs else None, "net_trend_current": round(net(cur_m), 1) if cur_m else None,
            "net_trend_previous": round(net(prv_m), 1) if prv_m else None, "items": len(prs)}
    # Market: top themes in the period, with source-weighted share change.
    top = collections.Counter(r["themes"][0] for r in prs).most_common(6)
    market = []
    for th, n in top:
        s_now = weighted_share(cur_m, lambda r, th=th: r["themes"][0] == th, W, 1) if cur_m else None
        s_prev = weighted_share(prv_m, lambda r, th=th: r["themes"][0] == th, W, 1) if prv_m else None
        market.append({"id": th, "label": labels.get(th, th), "count": n,
                       "negative": sum(1 for r in prs if r["themes"][0] == th and r["sentiment"] == "negative"),
                       "share_change_pct": change(s_now, s_prev) if s_now is not None and s_prev else None})
    # Service: how the bank's own cards contacts are handled in the period.
    async_resp = sorted((r["_resp"] - r["_c"]).total_seconds() / 3600 for r in ivol if r["_resp"] and r["_ch"] in ("emails", "social", "whatsapp"))
    service = {"resolved": ib["resolved"], "volume": ib["volume"], "open_too_long": ib["open_too_long"],
               "median_first_response_hours_written": round(async_resp[len(async_resp) // 2], 1) if async_resp else None,
               "public_service_negative": sum(1 for r in prs if cat_of(r["themes"][0])["id"] == "service" and r["sentiment"] == "negative")}
    # Friction drivers per category.
    friction = []
    for c in cats:
        cid = c["id"]
        ir = [r for r in ivol if (cat_of(r["theme"])["id"]) == cid]
        pr = [r for r in prs if (cat_of(r["themes"][0])["id"]) == cid]
        friction.append({
            "id": cid, "label": c["label"],
            "repeat_contact_internal": pct(sum(1 for r in ir if r.get("repeat")), len(ir)),
            "escalation_internal": sum(1 for r in ir if r.get("escalation")),
            "escalation_external": sum(1 for r in pr if r["escalation_intent"]),
            "negative_share": weighted_share(pr, lambda r: r["sentiment"] == "negative", W) if pr else None,
        })
    # Themes by trust pillar (public).
    pillars = []
    for pid_, plabel in (("availability", "Availability"), ("experience", "Experience"), ("data_intimacy", "Data intimacy"), ("security", "Security")):
        xs = [r for r in prs if r.get("pillar") == pid_]
        tops = collections.Counter(r["themes"][0] for r in xs).most_common(3)
        pillars.append({"id": pid_, "label": plabel, "count": len(xs), "net": round(net(xs), 1) if xs else None,
                        "top": [{"id": k, "label": labels.get(k, k), "count": v} for k, v in tops]})
    # Where contacts come from: journey stage (internal).
    journey = []
    for st in JOURNEY_ORDER:
        xs = [r for r in ivol if JOURNEY_STAGE.get(r["theme"], "Everyday use") == st]
        journey.append({"stage": st, "volume": len(xs), "negative_share": pct(sum(1 for r in xs if r["sentiment"] == "negative"), len(xs)),
                        "repeat_share": pct(sum(1 for r in xs if r.get("repeat")), len(xs))})
    # Stores, one at a time: top complaints, feature requests, feedback on existing features.
    stores = []
    for st in ("playstore", "appstore"):
        xs = [r for r in prs if r["source"] == st]
        neg = collections.Counter(r["themes"][0] for r in xs if r["sentiment"] == "negative").most_common(3)
        posf = collections.Counter(r["themes"][0] for r in xs if r["sentiment"] == "positive").most_common(3)
        feats = collections.Counter((r.get("feature_request") or "").strip() for r in xs if r.get("feature_request")).most_common(3)
        stores.append({"store": st, "label": SOURCE_LABEL[st], "reviews": len(xs),
                       "avg_rating": round(sum(r["rating"] for r in xs) / len(xs), 2) if xs else None,
                       "complaints": [{"label": labels.get(k, k), "count": v} for k, v in neg],
                       "feature_requests": [{"label": k, "count": v} for k, v in feats if k],
                       "praised": [{"label": labels.get(k, k), "count": v} for k, v in posf]})
    # Volume by channel (internal) and by source (public), and by customer list.
    channels = {"internal": {ch: internal_block([r for r in irs if r["_ch"] == ch], w)["volume"] for ch in CHANNEL_GROUP_ORDER},
                "external": dict(collections.Counter(SOURCE_LABEL[r["source"]] for r in prs).most_common())}
    tiers = []
    for lid in PULSE_LISTS:
        xs = [r for r in ivol if lid in customers[r["masked_id"]]["cohorts"]]
        tiers.append({"id": lid, "label": LIST_LABEL[lid], "volume": len(xs), "open": sum(1 for r in xs if open_at(r, b)),
                      "negative": sum(1 for r in xs if r["sentiment"] == "negative")})
    unlisted = [r for r in ivol if not any(k in customers[r["masked_id"]]["cohorts"] for k in PULSE_LISTS)]
    tiers.append({"id": "none", "label": "Not on a list", "volume": len(unlisted), "open": sum(1 for r in unlisted if open_at(r, b)),
                  "negative": sum(1 for r in unlisted if r["sentiment"] == "negative")})
    return {
        "internal": ib, "external": pbk, "categories": cats, "mood": mood, "market": market, "service": service,
        "friction": friction, "pillars": pillars, "journey": journey, "stores": stores, "channels": channels, "tiers": tiers,
    }


def md_mail(inter, w, labels) -> dict:
    a, b = w["start"], w["end"]
    rs = [r for r in inter if r.get("escalation") in ("md_office", "io", "rbi_ombudsman") and in_win(r, a, b)]
    by = collections.Counter(r["theme"] for r in rs).most_common(5)
    rows = []
    for th, n in by:
        xs = [r for r in rs if r["theme"] == th]
        rows.append({"theme": th, "label": labels.get(th, th), "mails": n, "resolved": sum(1 for r in xs if not open_at(r, b))})
    return {"total": len(rs), "rows": rows}


def main():
    inter, customers, notes = load_internal()
    pub = load_public()
    W = source_weights(pub)
    labels = theme_labels()
    out = {"end": PERIOD_END, "public_end": PUBLIC_END.isoformat(), "default": DEFAULT_PERIOD,
           "dominance_limit": SOURCE_DOMINANCE_LIMIT, "source_weights": {s: round(v, 4) for s, v in W.items()}, "periods": {}}
    for p in PERIODS:
        w = windows(p)
        biz = businesses(inter, pub, w, W, labels)
        external = public_block(pub, w, W)
        internal = internal_block(inter, w)
        internal["by_channel"] = by_channel(inter, w)
        total = internal["volume"] + external["volume"]
        out["periods"][p["id"]] = {
            "id": p["id"], "label": p["label"], "short": p["short"],
            "start": w["start"].isoformat(), "end": w["end"].isoformat(),
            "public_start": w["start"].isoformat(), "public_end": min(w["end"], PUBLIC_END).isoformat(),
            "compare": w["compare"],
            "customer_pulse": customer_pulse(inter, customers, notes, w),
            "cx_pulse": {
                "overall": {"total": total, "internal": internal["volume"], "external": external["volume"],
                            "internal_pct": pct(internal["volume"], total), "external_pct": pct(external["volume"], total)},
                "internal": internal,
                "external": external,
            },
            "businesses": biz,
            "brief": brief(biz, pub, w, W, labels, p),
            "md_mail": md_mail(inter, w, labels),
            "cards": cards_view(inter, customers, pub, w, W, labels),
        }
        cp = out["periods"][p["id"]]
        print(p["id"], "internal", internal["volume"], "external", external["volume"], "lists",
              [(x["id"], x["volume"], x["open"], x["not_responded_48h"]) for x in cp["customer_pulse"]["lists"]],
              "mix", external["source_mix"])
    dump(out, OUT_APP / "periods.json")


if __name__ == "__main__":
    main()
