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
import hashlib
import json
import re
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
import ombudsman_v3 as omb  # noqa: E402  (Ombudsman watch: snapshots of the complaint register)

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
        detail = f"vs the previous {p['days']} days" if p["days"] > 1 else "vs the day before"
        n = min(8, int((END - START) / dt.timedelta(days=p["days"])))
        series = [(END - dt.timedelta(days=p["days"] * (k + 1)), END - dt.timedelta(days=p["days"] * k)) for k in range(n)][::-1]
    else:
        start = START
        mid = START + (END - START) / 2
        prev = (START, mid)  # full window: trends compare the second half with the first
        detail = "second half vs first half of the window (no earlier data to compare the full window with)"
        series, w = [], END
        while w - dt.timedelta(days=7) >= START:
            series.append((w - dt.timedelta(days=7), w))
            w -= dt.timedelta(days=7)
        series = series[::-1]
    cur_for_trend = (START + (END - START) / 2, END) if not p["days"] else (start, END)
    return {"period_id": p["id"], "start": start, "end": END, "prev": prev, "trend_cur": cur_for_trend,
            # One label on screen for every period, matching the period filter; the detail says exactly what is compared.
            "compare": "vs previous period", "compare_detail": detail, "series": series}


# ------------------------------------------------------------------ internal

def load_internal():
    inter = [json.loads(line) for line in open(SEED_V3 / "interactions.jsonl", encoding="utf-8")]
    inter = [r for r in inter if r["channel"] in CHANNEL_GROUP]  # IVR bot excluded everywhere
    for r in inter:
        r["_c"] = ts(r["created_at"])
        r["_closed"] = ts(r["closed_at"])
        r["_resp"] = ts(r["first_response_at"])
        r["_wait"] = ts(r.get("resolution_sent_at"))
        r["_ch"] = CHANNEL_GROUP[r["channel"]]
    customers = {c["masked_id"]: c for c in load(SEED_V3 / "customers.json")}
    notes = load(SEED_V3 / "rm_notifications.json")
    return inter, customers, notes


def open_at(r, t):
    return r["_c"] <= t and (r["_closed"] is None or r["_closed"] > t)


def waiting_at(r, t):
    """Waiting on customer: still open, and the bank has sent a resolution or proposed one (30 Sep review, K4)."""
    return open_at(r, t) and r["_wait"] is not None and r["_wait"] <= t


def is_open(r, t):
    """Open with the bank: not closed and not waiting on the customer."""
    return open_at(r, t) and not waiting_at(r, t)


def no_resp_48(r, t=END):
    """Waited more than 48 hours for a first reply (answered late, or still waiting after 48 hours), as of t.
    A thread waiting on the customer is never counted."""
    if waiting_at(r, t):
        return False
    if r["_resp"] is not None and r["_resp"] <= t:
        return r["_resp"] - r["_c"] > H48
    return t - r["_c"] > H48


def open_48(r, t=END):
    """Still open more than 48 hours after it came in, as of t."""
    return is_open(r, t) and t - r["_c"] > H48


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
    # Like for like: the comparison window as it stood at its own end.
    cur_rs = [r for r in rs if in_win(r, ta, tb)]
    prev_rs = [r for r in rs if in_win(r, pa, pb)]
    open_delta = sum(1 for r in cur_rs if is_open(r, b)) - sum(1 for r in prev_rs if is_open(r, pb))
    late_delta = sum(1 for r in cur_rs if no_resp_48(r, b)) - sum(1 for r in prev_rs if no_resp_48(r, pb))
    return {
        "volume": len(vol),
        "prev_volume": prev,
        "change_pct": change(cur_t, prev),
        "resolved": sum(1 for r in vol if not open_at(r, b)),
        "open": sum(1 for r in vol if is_open(r, b)),
        "waiting_on_customer": sum(1 for r in vol if waiting_at(r, b)),
        "open_delta": open_delta,
        "not_responded_delta": late_delta if measurable else None,
        "open_too_long": sum(1 for r in vol if open_48(r, b)) if measurable else None,
        "not_responded_48h": sum(1 for r in vol if no_resp_48(r, b)) if measurable else None,
        "negative": sum(1 for r in vol if r["sentiment"] == "negative"),
        "escalations": sum(1 for r in vol if r.get("escalation")),
    }


def by_channel(rs, w, keys=("volume", "open", "waiting_on_customer", "not_responded_48h", "open_too_long", "resolved")) -> dict:
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
            "waiting_on_customer": blk["waiting_on_customer"],
            "not_responded_48h": blk["not_responded_48h"],
            "open_delta": blk["open_delta"],
            "not_responded_delta": blk["not_responded_delta"],
            "rm": {
                "alerted": len({n["masked_id"] for n in notes if n["masked_id"] in members and n["notified_today"]}),
                "of": len({n["masked_id"] for n in notes if n["masked_id"] in members}),
            },
            # Trend line: the same measure for each earlier window of the period's length, all as of 29 Sep 08:30.
            "not_responded_series": [
                {"end": e.isoformat(), "count": sum(1 for r in rs if in_win(r, s, e) and no_resp_48(r))} for s, e in w["series"]
            ],
            "volume_series": [{"end": e.isoformat(), "count": sum(1 for r in rs if in_win(r, s, e))} for s, e in w["series"]],
            "by_channel": by_channel(rs, w, ("volume", "open", "waiting_on_customer", "not_responded_48h")),
        })
    # High-priority mentions: posts where a listed customer tagged the bank, linked only through the bank's verified
    # handles or contact records (the social inbox). Synthetic, internal · illustrative.
    listed = {m for m, c in customers.items() if any(k in c["cohorts"] for k in PULSE_LISTS)}
    a, b = w["start"], w["end"]
    ment = [r for r in inter if r["_ch"] == "social" and r["masked_id"] in listed and in_win(r, a, b)]
    replied = lambda r: bool(r.get("mention_replied"))  # noqa: E731  (a public reply on the post, from the seed)
    responded = sum(1 for r in ment if replied(r))
    by_list = {}
    for lid in PULSE_LISTS:
        ms = [r for r in ment if lid in customers[r["masked_id"]]["cohorts"]]
        by_list[lid] = {"total": len(ms), "responded": sum(1 for r in ms if replied(r))}
    all_ment = [r for r in inter if r["_ch"] == "social" and r["masked_id"] in listed]
    due = {n["masked_id"] for n in notes if any(k in customers[n["masked_id"]]["cohorts"] for k in PULSE_LISTS)}
    told = {n["masked_id"] for n in notes if n["notified_today"] and n["masked_id"] in due}
    return {
        "lists": lists,
        "mentions": {
            "provenance": "internal",
            "total": len(ment),
            "responded": responded,
            "not_responded": len(ment) - responded,
            "series": [{"end": e.isoformat(), "count": sum(1 for r in all_ment if in_win(r, s, e))} for s, e in w["series"]],
            "unanswered_series": [{"end": e.isoformat(), "count": sum(1 for r in all_ment if in_win(r, s, e) and not replied(r))}
                                  for s, e in w["series"]],
            "response_pct": pct(responded, len(ment), 0),
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


# Bank replies on public posts. Play Store replies are collected (live). For the other sources the collection holds no
# replies, so a reply is simulated per post from its id (fixed, no random stream), at rates typical of an Indian bank's
# care handle: most active on X, present on the App Store, rare on Reddit and consumer forums. Negative posts are
# answered more often than the rest. Illustrative, and tagged so on screen. (MORNING_DECISIONS.md D24.)
SYNTHETIC_RESPONSE = {"x": (0.68, 0.40), "appstore": (0.45, 0.30), "reddit": (0.14, 0.06), "forum": (0.08, 0.03)}


def responded(r) -> bool:
    if r["source"] == "playstore":
        return bool(r.get("reply"))
    neg, other = SYNTHETIC_RESPONSE[r["source"]]
    h = int(hashlib.sha1(f"reply:{r['id']}".encode()).hexdigest(), 16) % 10000
    return h < 10000 * (neg if r["sentiment"] == "negative" else other)


def response_by_source(rs) -> list[dict]:
    out = []
    for src in ("playstore", "appstore", "x", "reddit", "forum"):
        xs = [r for r in rs if r["source"] == src]
        if xs:
            n = sum(1 for r in xs if responded(r))
            out.append({"source": src, "label": SOURCE_LABEL[src], "mentions": len(xs), "responded": n,
                        "pct": pct(n, len(xs), 0), "illustrative": src != "playstore"})
    return out


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
            "escalation": sum(1 for r in hi if r["escalation_intent"]),
            "positive_share": weighted_share(hi, lambda r: r["sentiment"] == "positive", W, 1),
            "negative_share": weighted_share(hi, lambda r: r["sentiment"] == "negative", W, 1),
            "share_method": "source_weighted",
            "responded": replies(hi),
        },
        "source_mix": {s: pct(v, len(rs)) for s, v in collections.Counter(r["source"] for r in rs).most_common()},
    }


ENGAGEMENT_KEYS = ("likes", "replies", "reposts", "upvotes", "helpful")
ROUTED = re.compile(r"reference|raise a ticket|help ?cent(er|re)", re.I)


def engagement_of(r) -> dict:
    e = r.get("engagement") or {}
    return {k: int(e[k]) for k in ENGAGEMENT_KEYS if e.get(k)}


def redact_reply(text: str) -> str:
    """The bank's reply with the customer's name and any link taken out."""
    t = " ".join(text.split())
    t = re.sub(r"^(Hi|Hello|Dear)\s+[^,]{1,40},", "Hi [customer],", t)
    t = re.sub(r"https?://\S+", "[official help centre link]", t)
    t = t.replace("!", ".")  # screen copy carries no exclamation marks (lint_terms), quoted or not
    return t[:420]


def social_pulse(pub, w, W) -> dict:
    """External block of the Customer pulse (30 Sep review, K2 and follow-ups 1-2): public mentions, the ones with
    reach, how many got a bank reply (by source), and the five posts with the most engagement. Text is the anonymised
    summary; no names, handles or links."""
    a, b = w["start"], w["end"]
    rs = [r for r in pub if a <= r["_c"] < b]
    hi = [r for r in rs if reach(r)]
    by_source = response_by_source(rs)
    n_resp = sum(x["responded"] for x in by_source)
    hi_resp = sum(1 for r in hi if responded(r))
    score = lambda r: sum(engagement_of(r).values())  # noqa: E731
    safe = lambda r: quotable(r) and r["summary"] and not ALLEGATION.search(f"{r['summary']} {r.get('text') or ''}")  # noqa: E731
    top = sorted([r for r in rs if safe(r) and score(r) > 0], key=lambda r: (score(r), r["created_at"]), reverse=True)[:5]
    posts = [{
        "text": r["summary"], "platform": SOURCE_LABEL[r["source"]], "date": r["created_at"][:10],
        "sentiment": r["sentiment"], "engagement": engagement_of(r), "score": score(r),
        "responded": responded(r), "illustrative": r["source"] != "playstore",
    } for r in top]
    good_pool = lambda xs: [r for r in xs if r["source"] == "playstore" and r.get("reply") and r["sentiment"] == "negative"  # noqa: E731
                            and safe(r) and ROUTED.search(r["reply"]["text"])]
    pool, in_period = good_pool(rs), True
    if not pool:  # nothing in a short period: the most recent earlier one, dated
        pool, in_period = good_pool([r for r in pub if r["_c"] < b]), False
    good = None
    if pool:
        g = sorted(pool, key=lambda r: (score(r), r["created_at"]) if in_period else (r["created_at"], score(r)), reverse=True)[0]
        good = {"text": g["summary"], "platform": SOURCE_LABEL[g["source"]], "date": g["created_at"][:10],
                "engagement": engagement_of(g), "reply": redact_reply(g["reply"]["text"]), "in_period": in_period}
    return {
        "mentions": len(rs),
        # Trend shapes for the cards: the same measure for each earlier window of the period's length.
        "mentions_series": [{"end": e.isoformat(), "count": sum(1 for r in pub if s <= r["_c"] < e)} for s, e in w["series"]],
        "high_impact_series": [{"end": e.isoformat(), "count": sum(1 for r in pub if s <= r["_c"] < e and reach(r))} for s, e in w["series"]],
        "negative_share_series": [
            {"end": e.isoformat(), "pct": weighted_share(xs, lambda r: r["sentiment"] == "negative", W) if xs else None}
            for s, e in w["series"] for xs in [[r for r in pub if s <= r["_c"] < e]]
        ],
        "response_series": [
            {"end": e.isoformat(), "pct": pct(sum(1 for r in xs if responded(r)), len(xs), 0)}
            for s, e in w["series"] for xs in [[r for r in pub if s <= r["_c"] < e]]
        ],
        "by_source": by_source,
        "responded": n_resp,
        "response_pct": pct(n_resp, len(rs), 0),
        "high_impact": len(hi),
        "high_impact_responded": hi_resp,
        "high_impact_response_pct": pct(hi_resp, len(hi), 0),
        "posts": posts,
        "good_response": good,
        "rule": "High impact (virality rule): an X account with 10,000+ followers, or 50+ likes or 20+ reposts; a Reddit post with 50+ upvotes; a store review 20+ people found helpful. Trending posts are ranked by likes, replies and reposts (upvotes and helpful votes on Reddit and the stores).",
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
    # Pad each column to three with the next-closest businesses, labelled for what they are.
    used_b = {(v["business"], v.get("issue")) for v in building}
    if len(building) < 3:
        extra = []
        for x in cards:
            pid = x["id"]
            cur = [r for r in pub if ta <= r["_c"] < tb and r["_product"] == pid]
            prv = [r for r in pub if pa <= r["_c"] < pb and r["_product"] == pid]
            s_now = weighted_share([r for r in pub if ta <= r["_c"] < tb], lambda r, pid=pid: r["_product"] == pid, W, 1)
            s_prev = weighted_share([r for r in pub if pa <= r["_c"] < pb], lambda r, pid=pid: r["_product"] == pid, W, 1)
            if not cur or not s_prev or s_now is None or (pid, None) in used_b:
                continue
            extra.append((s_now / s_prev, {
                "business": pid, "business_label": x["label"], "issue": None, "status": "watch",
                "text": f"{len(cur)} public items; share of voice {'up' if s_now >= s_prev else 'down'} {abs(round(100 * (s_now - s_prev) / s_prev))}% {w['compare']}, below the 30% rule.",
            }))
        for _, v in sorted(extra, key=lambda z: -z[0]):
            if len(building) >= 3:
                break
            building.append(v)
    used_i = {v["business"] for v in improving}
    if len(improving) < 3:
        extra = []
        for x in cards:
            if x["id"] in used_i:
                continue
            cur = [r for r in pub if r["_product"] == x["id"] and ta <= r["_c"] < tb]
            prv = [r for r in pub if r["_product"] == x["id"] and pa <= r["_c"] < pb]
            n_now = weighted_share(cur, lambda r: r["sentiment"] == "negative", W, 1) if cur else None
            n_prev = weighted_share(prv, lambda r: r["sentiment"] == "negative", W, 1) if prv else None
            if n_now is None or not n_prev:
                extra.append((9, {"business": x["id"], "business_label": x["label"], "status": "watch",
                                  "text": f"Too few public items to compare ({len(cur)} now, {len(prv)} before); negative share {n_now:.0f}%." if n_now is not None else f"Too few public items to compare ({len(cur)} now, {len(prv)} before)."}))
                continue
            d = (n_now - n_prev) / n_prev
            extra.append((abs(d), {"business": x["id"], "business_label": x["label"], "status": "watch",
                                   "text": f"Negative share {'up' if d > 0 else 'down'} from {n_prev:.0f}% to {n_now:.0f}% {w['compare']}; outside the improving and stable bands."}))
        for _, v in sorted(extra, key=lambda z: z[0]):
            if len(improving) >= 3:
                break
            improving.append(v)
    return {
        "needs_you": needs,
        "building": building,
        "improving": improving,
        "rules": (
            "What needs you: the businesses with the most internal cases open over 48 hours (still open, in the "
            "Morning brief) plus public posts with escalation language. Signals that are building: issues whose source-weighted share of public voice rose "
            f"by 30% or more {w['compare']} (at least {min_n} items). Improving or stable: businesses whose negative "
            "share fell 15% or more, or held within 10%. Each column shows three: where fewer meet its rule, the "
            "next-closest businesses fill it, marked \"watch\"."
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
            "internal": {k: ib[k] for k in ("volume", "resolved", "open", "waiting_on_customer", "open_too_long", "not_responded_48h", "escalations", "change_pct")},
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
                       "share_positive": pct(sum(1 for r in xs if r["rating"] >= 4), len(xs)),
                       "share_negative": pct(sum(1 for r in xs if r["rating"] <= 2), len(xs)),
                       "complaints": [{"label": labels.get(k, k), "count": v} for k, v in neg],
                       "feature_requests": [{"label": k, "count": v} for k, v in feats if k],
                       "praised": [{"label": labels.get(k, k), "count": v} for k, v in posf]})
    # Volume by channel (internal) and by source (public), and by customer list.
    channels = {"internal": {ch: internal_block([r for r in irs if r["_ch"] == ch], w)["volume"] for ch in CHANNEL_GROUP_ORDER},
                "external": dict(collections.Counter(SOURCE_LABEL[r["source"]] for r in prs).most_common())}
    tiers = []
    for lid in PULSE_LISTS:
        xs = [r for r in ivol if lid in customers[r["masked_id"]]["cohorts"]]
        tiers.append({"id": lid, "label": LIST_LABEL[lid], "volume": len(xs), "open": sum(1 for r in xs if is_open(r, b)),
                      "negative": sum(1 for r in xs if r["sentiment"] == "negative")})
    unlisted = [r for r in ivol if not any(k in customers[r["masked_id"]]["cohorts"] for k in PULSE_LISTS)]
    tiers.append({"id": "none", "label": "Not on a list", "volume": len(unlisted), "open": sum(1 for r in unlisted if is_open(r, b)),
                  "negative": sum(1 for r in unlisted if r["sentiment"] == "negative")})
    return {
        "internal": ib, "external": pbk, "categories": cats, "mood": mood, "market": market, "service": service,
        "friction": friction, "pillars": pillars, "journey": journey, "stores": stores, "channels": channels, "tiers": tiers,
        **cards_drilldowns(inter, customers, pub, w, W, labels, ivol, prs, prs_all, irs),
    }


# ------------------------------------------------------------------ Cards drill-downs (30 Sep review, changes_30sep.md C4)
# The three MD drill-downs (satisfaction, market, service), rebuilt for Cards only and for the selected period.
TARGET_LABEL = {
    "rbi": "RBI (named or tagged)",
    "rbi_ombudsman": "RBI Ombudsman",
    "consumer_court": "Consumer court or helpline",
    "legal": "Legal action",
    "ministers": "Ministers tagged",
    "grievance": "Grievance or nodal officer",
}
REQUEST_LABEL = {
    "card_delivery": "Card delivery",
    "refund": "Merchant refund",
    "reversal": "Failed-transaction reversal",
    "dispute": "Dispute or chargeback",
    "closure": "Card closure",
    "loan_disbursal": "Loan disbursal",
    "credit_report": "Credit report correction",
    "kyc": "KYC and profile updates",
    "other": "Other request",
}
RUNG_LABEL = [("grievance", "Grievance"), ("md_office", "MD's office"), ("io", "Internal Ombudsman"), ("rbi_ombudsman", "RBI Ombudsman")]


def quote_of(rs):
    """One anonymised, non-alleging quote summary from rs, the most engaged first; None when there is none."""
    cands = [
        r for r in rs
        if quotable(r) and r["summary"] and not ALLEGATION.search(f"{r['summary']} {r.get('text') or ''}")
    ]
    if not cands:
        return None

    def eng(r):
        e = r.get("engagement") or {}
        return sum(v for v in e.values() if isinstance(v, (int, float)))

    r = sorted(cands, key=lambda r: (eng(r), r["created_at"]), reverse=True)[0]
    return {"summary": r["summary"], "source_label": SOURCE_LABEL[r["source"]], "date": r["created_at"][:10]}


def cards_drilldowns(inter, customers, pub, w, W, labels, ivol, prs, prs_all, irs) -> dict:
    a, b = w["start"], w["end"]
    ta, tb = w["trend_cur"]
    pa, pbb = w["prev"]
    rung = {"grievance": 1, "md_office": 2, "io": 3, "rbi_ombudsman": 4}

    def net(xs):
        if not xs:
            return None
        p = weighted_share(xs, lambda r: r["sentiment"] == "positive", W, 1) or 0
        n = weighted_share(xs, lambda r: r["sentiment"] == "negative", W, 1) or 0
        return round(p - n, 1)

    def raw_net(xs):
        return round(100 * (sum(1 for r in xs if r["sentiment"] == "positive") - sum(1 for r in xs if r["sentiment"] == "negative")) / len(xs), 1) if xs else None

    # --- 1. Are my customers happy?
    by_source = []
    for src in ("playstore", "appstore", "x", "reddit", "forum"):
        xs = [r for r in prs if r["source"] == src]
        if not xs:
            continue
        by_source.append({
            "source": src, "label": SOURCE_LABEL[src], "items": len(xs),
            "positive": sum(1 for r in xs if r["sentiment"] == "positive"),
            "neutral": sum(1 for r in xs if r["sentiment"] == "neutral"),
            "negative": sum(1 for r in xs if r["sentiment"] == "negative"),
            "net": raw_net(xs),
            "weight_pct": round(100 * W.get(src, 0), 1),
        })
    weekly_net = []
    for s, e in w["series"]:
        xs = [r for r in prs_all if s <= r["_c"] < e]
        weekly_net.append({"end": e.isoformat(), "items": len(xs), "net": net(xs)})
    top_themes = [t for t, _ in collections.Counter(r["themes"][0] for r in prs if r["sentiment"] == "negative").most_common(4)]
    seen = set()
    saying = []
    for th in top_themes:
        xs = [r for r in prs if r["themes"][0] == th and r["sentiment"] == "negative" and r["id"] not in seen]
        q = quote_of(xs)
        if q:
            seen.add(next(r["id"] for r in xs if r["summary"] == q["summary"]))
            saying.append({"id": th, "label": labels.get(th, th), "count": len([r for r in prs if r["themes"][0] == th]), **q})
    repeat_by_cat = []
    for c in [*CARDS_CATEGORIES, CARDS_OTHER]:
        ir = [r for r in ivol if cat_of(r["theme"])["id"] == c["id"]]
        pr = [r for r in prs if cat_of(r["themes"][0])["id"] == c["id"]]
        if ir or pr:
            repeat_by_cat.append({"id": c["id"], "label": c["label"], "internal_repeat": sum(1 for r in ir if r.get("repeat")),
                                  "public_repeat": sum(1 for r in pr if r["repeat_contact"]), "contacts": len(ir)})
    repeat_by_cat.sort(key=lambda x: -(x["internal_repeat"] + x["public_repeat"]))
    tiers_sent = []
    for lid in PULSE_LISTS + ["none"]:
        xs = [r for r in ivol if (lid == "none" and not any(k in customers[r["masked_id"]]["cohorts"] for k in PULSE_LISTS))
              or (lid != "none" and lid in customers[r["masked_id"]]["cohorts"])]
        tiers_sent.append({"id": lid, "label": LIST_LABEL.get(lid, "Not on a list"), "volume": len(xs),
                           "positive": sum(1 for r in xs if r["sentiment"] == "positive"),
                           "neutral": sum(1 for r in xs if r["sentiment"] == "neutral"),
                           "negative": sum(1 for r in xs if r["sentiment"] == "negative"),
                           "open": sum(1 for r in xs if is_open(r, b))})
    happy = {"by_source": by_source, "weekly_net": weekly_net, "saying": saying, "repeat_by_category": repeat_by_cat, "tiers": tiers_sent}

    # --- 2. What is the market saying about us?
    cur_m = [r for r in prs_all if ta <= r["_c"] < tb]
    prv_m = [r for r in prs_all if pa <= r["_c"] < pbb]
    themes_all = []
    for th, n in collections.Counter(r["themes"][0] for r in prs).most_common():
        s_now = weighted_share(cur_m, lambda r, th=th: r["themes"][0] == th, W, 1) if cur_m else None
        s_prev = weighted_share(prv_m, lambda r, th=th: r["themes"][0] == th, W, 1) if prv_m else None
        xs = [r for r in prs if r["themes"][0] == th]
        themes_all.append({
            "id": th, "label": labels.get(th, th), "count": n,
            "negative": sum(1 for r in xs if r["sentiment"] == "negative"),
            "negative_share": weighted_share(xs, lambda r: r["sentiment"] == "negative", W, 1),
            "escalation": sum(1 for r in xs if r["escalation_intent"]),
            "share_change_pct": change(s_now, s_prev) if s_now is not None and s_prev else None,
            "weekly": [{"end": e.isoformat(), "count": sum(1 for r in prs_all if r["themes"][0] == th and s <= r["_c"] < e),
                        "share": weighted_share([r for r in prs_all if s <= r["_c"] < e], lambda r, th=th: r["themes"][0] == th, W, 1)}
                       for s, e in w["series"]],
        })
    # Only the six themes the screen charts carry a series; the rest keep the payload small.
    for t in themes_all[6:]:
        t["weekly"] = []
    min_n = {"brief": 3, "7d": 8, "30d": 20, "all": 30}[w["period_id"]]
    rising = sorted([t for t in themes_all if t["share_change_pct"] is not None and t["count"] >= min_n and t["share_change_pct"] > 0],
                    key=lambda t: -t["share_change_pct"])[:5]
    hi = [r for r in prs if reach(r)]
    reach_block = {
        "volume": len(hi), "positive": sum(1 for r in hi if r["sentiment"] == "positive"),
        "negative": sum(1 for r in hi if r["sentiment"] == "negative"),
        "by_source": dict(collections.Counter(SOURCE_LABEL[r["source"]] for r in hi).most_common()),
        "escalation": sum(1 for r in hi if r["escalation_intent"]),
        "top_themes": [{"id": k, "label": labels.get(k, k), "count": v} for k, v in collections.Counter(r["themes"][0] for r in hi).most_common(3)],
        "responded": replies(hi),
    }
    fraud_pub = [r for r in prs if cat_of(r["themes"][0])["id"] == "fraud"]
    fraud_int = [r for r in ivol if cat_of(r["theme"])["id"] == "fraud"]
    safety = {
        "public": len(fraud_pub), "public_negative": sum(1 for r in fraud_pub if r["sentiment"] == "negative"),
        "public_escalation": sum(1 for r in fraud_pub if r["escalation_intent"]), "high_impact": sum(1 for r in fraud_pub if reach(r)),
        "internal": len(fraud_int), "internal_open": sum(1 for r in fraud_int if is_open(r, b)),
        "internal_high_impact": sum(1 for r in fraud_int if r["high_impact"]),
        "top": [{"id": k, "label": labels.get(k, k), "count": v} for k, v in collections.Counter(r["themes"][0] for r in fraud_pub).most_common(3)],
    }
    market_full = {"themes": themes_all, "rising": rising, "reach": reach_block, "safety": safety}

    # --- 3. Service
    ladder = [{"rung": "Contacts", "count": len(ivol)}, {"rung": "Repeat", "count": sum(1 for r in ivol if r.get("repeat"))}]
    for rid, rl in RUNG_LABEL:
        ladder.append({"rung": rl, "count": sum(1 for r in ivol if r.get("escalation") and rung[r["escalation"]] >= rung[rid])})
    pub_esc = [r for r in prs if r["escalation_intent"]]
    by_target = collections.Counter(r.get("escalation_target") or "unnamed" for r in pub_esc)
    targets = [{"id": k, "label": TARGET_LABEL.get(k, "Target not named"), "count": v} for k, v in by_target.most_common()]
    closure_int = [r for r in ivol if r["theme"] == "closure_requests"]
    closure_pub = [r for r in prs if r["closure_intent"]]
    cure = [r for r in prs if r["cure_watch"]]
    status = [r for r in prs if r["status_seeking"]]
    disp = [r for r in ivol if r["deliverable"] == "dispute"]
    funnel = [
        {"stage": "Disputes raised", "count": len(disp)},
        {"stage": "First response given", "count": sum(1 for r in disp if r["_resp"] and r["_resp"] <= b)},
        {"stage": "Closed", "count": sum(1 for r in disp if not open_at(r, b))},
        {"stage": "Customer credited", "count": sum(1 for r in disp if r.get("credited") and not open_at(r, b))},
    ]
    missed = collections.Counter(r.get("request_type") or "other" for r in prs if r["promise_break"])
    missed_rows = [{"id": k, "label": REQUEST_LABEL.get(k, k), "count": v} for k, v in missed.most_common()]
    tat_int = [r for r in ivol if cat_of(r["theme"])["tat"]]
    failures = sorted(themes_all, key=lambda t: -t["negative"])[:5]
    service_full = {
        "ladder": ladder, "public_escalation": len(pub_esc), "targets": targets,
        "closure": {"internal_requests": len(closure_int), "internal_open": sum(1 for r in closure_int if is_open(r, b)),
                    "public_intent": len(closure_pub), "quote": quote_of(closure_pub)},
        "cure": {"count": len(cure), "top": [{"id": k, "label": labels.get(k, k), "count": v} for k, v in collections.Counter(r["themes"][0] for r in cure).most_common(3)],
                 "quote": quote_of(cure)},
        "transparency": {"count": len(status), "share": weighted_share(prs, lambda r: r["status_seeking"], W) if prs else None,
                         "quote": quote_of(status)},
        "disputes": funnel,
        "missed_timelines": {"total": sum(missed.values()), "rows": missed_rows},
        "tat_related": {"contacts": len(tat_int), "share": pct(len(tat_int), len(ivol)), "open": sum(1 for r in tat_int if is_open(r, b))},
        "failures": [{"id": t["id"], "label": t["label"], "negative": t["negative"], "count": t["count"], "escalation": t["escalation"]} for t in failures],
    }
    return {"happy": happy, "market_full": market_full, "service_full": service_full}


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
    complaints = omb.load_complaints()
    cards_complaints = [c for c in complaints if c["product"] == "cards"]
    products = [(pid, PRODUCT_LABEL[pid]) for pid in PRODUCT_ORDER]
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
            "compare_detail": w["compare_detail"],
            "customer_pulse": customer_pulse(inter, customers, notes, w),
            "social_pulse": social_pulse(pub, w, W),
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
            "ombudsman": omb.block(complaints, w, products),
        }
        cp = out["periods"][p["id"]]
        # Ombudsman watch (design: ombudsman_watch_design.md). Cards: the same block scoped to Cards, plus the risk by
        # category and the save list. A material risk leads the brief's "What needs you" (at most three items).
        cp["cards"]["ombudsman"] = {**omb.block(cards_complaints, w, [("cards", PRODUCT_LABEL["cards"])]),
                                    **omb.cards_extra(complaints, w, labels)}
        item = omb.brief_item(cp["ombudsman"])
        if item:
            cp["brief"]["needs_you"] = [item, *cp["brief"]["needs_you"]][:3]
        cp["brief"]["rules"] += (
            " An Ombudsman watch item leads What needs you when any complaint has 3 days or fewer to the 30-day reply "
            "limit, or more complaints are already eligible than at the previous period end.")
        print(p["id"], "internal", internal["volume"], "external", external["volume"], "lists",
              [(x["id"], x["volume"], x["open"], x["not_responded_48h"]) for x in cp["customer_pulse"]["lists"]],
              "mix", external["source_mix"])
    dump(out, OUT_APP / "periods.json")


if __name__ == "__main__":
    main()
