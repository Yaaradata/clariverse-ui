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
    inr,
)

sys.path.insert(0, str(Path(__file__).resolve().parent))
from aggregate import quotable  # noqa: E402  (a quote naming a person is never used)
from pii_names import ALLEGATION  # noqa: E402  (nor, as an anecdote, one that makes an allegation)
from public_v3 import PRODUCTS as PUB_PRODUCTS  # noqa: E402
from public_v3 import product_of  # noqa: E402
import complaint_rules  # noqa: E402
import ombudsman_v3 as omb  # noqa: E402  (Ombudsman watch: snapshots of the complaint register)
import v4_blocks as v4  # noqa: E402  (B11: V4 additions, from the same records)
from taxonomy import OUTCOMES  # noqa: E402  (Consumer Duty outcomes, Pass 2)
CORA_THEMES = ["cora_unresolved", "cora_wrong_answer", "cora_handoff_lost", "cora_no_person"]

END = dt.datetime.fromisoformat(PERIOD_END)
START = dt.datetime.fromisoformat(DATA_START)
H48 = dt.timedelta(hours=48)
PUBLIC_END = END  # NW-D94: public items run to the freeze (13 Nov 07:45); later ones are kept out in normalise.py
SOURCE_LABEL = {"appstore": "App Store", "playstore": "Google Play", "x": "X", "reddit": "Reddit", "trustpilot": "Trustpilot", "forum": "Forums"}
TREND_SOURCES = {"playstore", "appstore", "trustpilot", "x", "reddit"}  # one continuous collector each (NW-D82)
# HL-13: a source counts in a trend only when it was collecting before the comparison window began.
SOURCE_START = {s["id"]: dt.datetime.fromisoformat(s["start"] + "T00:00:00+00:00")
                for s in json.load(open(OUT_APP / "sources.json", encoding="utf-8"))["sources"] if s.get("start")}
LIST_LABEL = {  # NatWest cohorts (brief Step 5.2); the ids are the oct13 list ids
    "priority_a": "Financially vulnerable (Consumer Duty)",
    "priority_b": "Recent complainants (90 days)",
    "uhni": "Premier",
    "multi": "Multi-product customers (four or more products)",
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
        detail = "no earlier period: the data starts on 1 August"
        series, w = [], END
        while w - dt.timedelta(days=7) >= START:
            series.append((w - dt.timedelta(days=7), w))
            w -= dt.timedelta(days=7)
        series = series[::-1]
    cur_for_trend = (START + (END - START) / 2, END) if not p["days"] else (start, END)
    return {"period_id": p["id"], "start": start, "end": END, "prev": prev, "trend_cur": cur_for_trend,
            # One label on screen for every period, matching the period filter; the detail says exactly what is compared.
            "compare": "vs previous period" if p["days"] else "no earlier period", "compare_detail": detail, "series": series}


# ------------------------------------------------------------------ internal

def earlier_wait(r):
    """Waiting on the customer before the thread closed (review round 3, NW-D67). The seed marks a thread as waiting
    only when it is still waiting at the freeze, so at earlier period ends every thread later closed counted as open,
    and the open backlog seemed to halve each week. A closed thread waited from its first response by the same rule
    the seed uses for open threads (40% of threads, drawn from the record id); scripted trails never wait."""
    if r["status"] != "closed" or not r.get("first_response_at") or r.get("scripted"):
        return None
    if int(hashlib.sha1(r["id"].encode()).hexdigest(), 16) % 100 < 40:
        return ts(r["first_response_at"])
    return None


def load_internal():
    inter = [json.loads(line) for line in open(SEED_V3 / "interactions.jsonl", encoding="utf-8")]
    inter = [r for r in inter if r["channel"] in CHANNEL_GROUP]  # IVR bot excluded everywhere
    for r in inter:
        r["_c"] = ts(r["created_at"])
        r["_closed"] = ts(r["closed_at"])
        r["_resp"] = ts(r["first_response_at"])
        r["_wait"] = ts(r.get("resolution_sent_at")) or earlier_wait(r)
        r["_ch"] = CHANNEL_GROUP[r["channel"]]
    customers = {c["masked_id"]: c for c in load(SEED_V3 / "customers.json")}
    SCALE.update(load(SEED_V3 / "scale.json"))
    notes = load(SEED_V3 / "rm_notifications.json")
    return inter, customers, notes


# Bank scale (scale_v3.py): each kept row stands for r["w"] contacts and each customer for c["cw"] contacting customers.
# Every internal figure below is a weighted sum, so it sits at bank scale and still reconciles exactly.
SCALE: dict = {}


def wn(rs) -> int:
    """Bank-scale count of internal rows."""
    return sum(r["w"] for r in rs)


def ncust(ids, customers) -> int:
    """Bank-scale count of customers."""
    return sum(customers[m]["cw"] for m in ids)


def wcounter(rs, key) -> collections.Counter:
    c = collections.Counter()
    for r in rs:
        c[key(r)] += r["w"]
    return c


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


def backlog(rs, t, w) -> float:
    """Average open backlog over the period ending at t: one snapshot a day (at most 30), each counting every contact
    received before it and still open with the bank then."""
    days = max(1, min(30, round((w["end"] - w["start"]) / dt.timedelta(days=1))))
    pts = [t - dt.timedelta(days=d) for d in range(days)]
    return sum(sum(r["w"] for r in rs if r["_c"] < x and is_open(r, x)) for x in pts) / len(pts)


def internal_block(rs, w, with_backlog: bool = False) -> dict:
    a, b = w["start"], w["end"]
    vol = [r for r in rs if in_win(r, a, b)]
    pa, pb = w["prev"]
    prev = sum(r["w"] for r in rs if in_win(r, pa, pb))
    ta, tb = w["trend_cur"]
    cur_t = sum(r["w"] for r in rs if in_win(r, ta, tb))
    measurable = (b - a) > H48  # a 24-hour window cannot hold anything 48 hours old
    # Like for like: the comparison window as it stood at its own end.
    cur_rs = [r for r in rs if in_win(r, ta, tb)]
    prev_rs = [r for r in rs if in_win(r, pa, pb)]
    # Open: the change in the average open backlog (every contact open with the bank, one snapshot a day at the freeze
    # time) over the period against the previous period, in per cent (review round 3, NW-D67). Counting only each
    # period's own contacts at one moment made the backlog seem to halve in a week: a few heavy sample rows move in and
    # out of a 7-day slice.
    open_change = change(backlog(rs, b, w), backlog(rs, pb, w)) if with_backlog else None
    open_delta = None
    late_delta = sum(r["w"] for r in cur_rs if no_resp_48(r, b)) - sum(r["w"] for r in prev_rs if no_resp_48(r, pb))
    if w["period_id"] == "all":  # no data before 1 August: the full window has no previous period (NW-D67)
        open_change = late_delta = None
    return {
        "volume": wn(vol),
        "prev_volume": prev if w["period_id"] != "all" else None,
        "change_pct": change(cur_t, prev) if w["period_id"] != "all" else None,
        "resolved": sum(r["w"] for r in vol if not open_at(r, b)),
        "open": sum(r["w"] for r in vol if is_open(r, b)),
        "waiting_on_customer": sum(r["w"] for r in vol if waiting_at(r, b)),
        "open_delta": open_delta,
        "open_change_pct": open_change,
        "not_responded_delta": late_delta if measurable else None,
        "open_too_long": sum(r["w"] for r in vol if open_48(r, b)) if measurable else None,
        "not_responded_48h": sum(r["w"] for r in vol if no_resp_48(r, b)) if measurable else None,
        "negative": sum(r["w"] for r in vol if r["sentiment"] == "negative"),
        "escalations": sum(r["w"] for r in vol if r.get("escalation")),
    }


def by_channel(rs, w, keys=("volume", "open", "waiting_on_customer", "not_responded_48h", "open_too_long", "resolved")) -> dict:
    out = {}
    for ch in CHANNEL_GROUP_ORDER:
        blk = internal_block([r for r in rs if r["_ch"] == ch], w)
        out[ch] = {k: blk[k] for k in keys}
    return out


H5 = dt.timedelta(hours=5)


def in_contact(rs, customers, w) -> int:
    """Customers with a contact in the period, at bank scale: a sample customer stands for cw customers, but never for
    more customers than the contacts it carries in the period."""
    seen = collections.Counter()
    for r in rs:
        if in_win(r, w["start"], w["end"]):
            seen[r["masked_id"]] += r["w"]
    return sum(min(customers[m]["cw"], v) for m, v in seen.items())


def rm_alerts(rs, customers, told, w) -> dict:
    """RMs alerted X of Y for the period, at bank scale. Y: listed customers with an alert due, that is with a contact
    from the period still open with the bank that is negative, high impact or more than 5 hours old (the RM rule).
    A sample customer stands for cw customers, but never for more customers than the due contacts it carries, so Y
    can never exceed the open contacts beside it. X: those of them whose RM has been alerted."""
    a, b = w["start"], w["end"]
    due = collections.Counter()
    for r in rs:
        if in_win(r, a, b) and is_open(r, b) and customers[r["masked_id"]]["rm_id"] and (
                r["sentiment"] == "negative" or r["high_impact"] or b - r["_c"] > H5):
            due[r["masked_id"]] += r["w"]
    each = {m: min(customers[m]["cw"], n) for m, n in due.items()}
    return {"alerted": sum(v for m, v in each.items() if alerted_in(m, told, w)), "of": sum(each.values())}


EARLIER_ALERT_PCT = 10  # ASSUMPTION (review round 3, NW-D67): owners alerted earlier in a longer period, per customer


def alerted_in(m: str, told_today: set, w: dict) -> bool:
    """Owner alerted for this customer in the period. Today's alerts come from rm_notifications.json; a period longer
    than the morning also holds alerts sent on earlier days (a fixed share of customers, drawn from the masked id), so
    "owners alerted" grows with the period instead of repeating today's figure (review round 3, NW-D67)."""
    if m in told_today:
        return True
    return w["period_id"] != "brief" and int(hashlib.sha1(f"alert:{m}".encode()).hexdigest(), 16) % 100 < EARLIER_ALERT_PCT


def customer_pulse(inter, customers, notes, w) -> dict:
    told_all = {x["masked_id"] for x in notes if x["notified_today"]}
    lists = []
    for lid in PULSE_LISTS:
        members = {m for m, c in customers.items() if lid in c["cohorts"]}
        rs = [r for r in inter if r["masked_id"] in members]
        blk = internal_block(rs, w, with_backlog=True)
        lists.append({
            "id": lid,
            "label": LIST_LABEL[lid],
            # The list's size at the bank (declared; scale.json), and how many of its customers made a contact.
            "members": SCALE["list_sizes"][lid],
            "in_contact": in_contact(rs, customers, w),
            "volume": blk["volume"],
            "prev_volume": blk["prev_volume"],
            "change_pct": blk["change_pct"],
            "open": blk["open"],
            "waiting_on_customer": blk["waiting_on_customer"],
            "not_responded_48h": blk["not_responded_48h"],
            "open_delta": blk["open_delta"],
            "open_change_pct": blk["open_change_pct"],
            "not_responded_delta": blk["not_responded_delta"],
            "rm": rm_alerts(rs, customers, told_all, w),
            # Trend line: the same measure for each earlier window of the period's length, all as of 29 Sep 08:30.
            "not_responded_series": [
                {"end": e.isoformat(), "count": sum(r["w"] for r in rs if in_win(r, s, e) and no_resp_48(r))} for s, e in w["series"]
            ],
            "volume_series": [{"end": e.isoformat(), "count": sum(r["w"] for r in rs if in_win(r, s, e))} for s, e in w["series"]],
            "by_channel": by_channel(rs, w, ("volume", "open", "waiting_on_customer", "not_responded_48h")),
        })
    # High-priority mentions: posts where a listed customer tagged the bank, linked only through the bank's verified
    # handles or contact records (the social inbox). Synthetic, internal · illustrative.
    listed = {m for m, c in customers.items() if any(k in c["cohorts"] for k in PULSE_LISTS)}
    a, b = w["start"], w["end"]
    ment = [r for r in inter if r["_ch"] == "social" and r["masked_id"] in listed and in_win(r, a, b)]
    replied = lambda r: bool(r.get("mention_replied"))  # noqa: E731  (a public reply on the post, from the seed)
    responded = sum(r["w"] for r in ment if replied(r))
    by_list = {}
    for lid in PULSE_LISTS:
        ms = [r for r in ment if lid in customers[r["masked_id"]]["cohorts"]]
        by_list[lid] = {"total": wn(ms), "responded": sum(r["w"] for r in ms if replied(r))}
    all_ment = [r for r in inter if r["_ch"] == "social" and r["masked_id"] in listed]
    return {
        "lists": lists,
        "mentions": {
            "provenance": "internal",
            "total": wn(ment),
            "responded": responded,
            "not_responded": wn(ment) - responded,
            "series": [{"end": e.isoformat(), "count": sum(r["w"] for r in all_ment if in_win(r, s, e))} for s, e in w["series"]],
            "unanswered_series": [{"end": e.isoformat(), "count": sum(r["w"] for r in all_ment if in_win(r, s, e) and not replied(r))}
                                  for s, e in w["series"]],
            "response_pct": pct(responded, wn(ment), 0),
            "handled": handled_block([inbox()[("mention", inbox_ref(r["id"]))] for r in ment
                                       if ("mention", inbox_ref(r["id"])) in inbox()]),
            "by_list": by_list,
            "rule": "A post counts only when the bank's own verified handles or contact records link it to a customer on the bank's lists; LisN never matches people from public data.",
        },
        "rm": {**rm_alerts([r for r in inter if r["masked_id"] in listed], customers, told_all, w), "as_of": PERIOD_END},
    }


# ------------------------------------------------------------------ public

def load_public():
    rows = [json.loads(line) for line in open(OUT_APP / "work" / "classified.jsonl", encoding="utf-8")]
    out = []
    for r in rows:
        if r["relevant"] != "on_topic" or r["entity"] != "natwest_group":
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


# NW-D91: positive and negative shares, net sentiment and the mood dial come from review sources only (App Store, Google
# Play, Trustpilot; model check 96%). X and Reddit count in volumes, themes, high impact, replies and quotes, never in a
# sentiment share (model check 71%: indicative only).
REVIEW_SOURCES = {"appstore", "playstore", "trustpilot"}
SOCIAL_SOURCES = {"x", "reddit"}


def reviews(rs):
    return [r for r in rs if r["source"] in REVIEW_SOURCES]


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


# Bank replies on public posts (NatWest, HL-15): a reply counts only where the source itself carries it (store and
# Trustpilot reply fields). Nothing is simulated: the oct13 simulated replies (an HDFC exception) are not carried over.
REPLY_SOURCES = {"playstore"}  # sources whose export carries the bank's reply (NW-D82)


def responded(r) -> bool:
    return bool(r.get("reply"))


def response_by_source(rs) -> list[dict]:
    out = []
    for src in ("appstore", "playstore", "x", "reddit", "trustpilot", "forum"):
        xs = [r for r in rs if r["source"] == src]
        if xs:
            # Only Google Play carries the bank's replies in this pull; elsewhere there is no reply data (not 0%).
            has = src in REPLY_SOURCES
            n = sum(1 for r in xs if responded(r)) if has else None
            out.append({"source": src, "label": SOURCE_LABEL[src], "mentions": len(xs), "responded": n,
                        "pct": pct(n, len(xs), 0) if has else None, "reply_data": has, "illustrative": False})
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


def pub_span(w):
    """NW-D94: the public window. The Morning brief is the calendar day before the freeze (12 Nov) against the day
    before it (11 Nov); store reviews carry a date only. Every other period is the period's own window, so the brief's
    day sits inside the last 7 days, 30 days and the full window (NW-D95)."""
    if w.get("period_id") != "brief":
        return w["start"], w["end"], w["prev"], w["trend_cur"]
    day = dt.datetime.combine(w["end"].date() - dt.timedelta(days=1), dt.time(0), tzinfo=w["end"].tzinfo)
    nxt = day + dt.timedelta(days=1)
    return day, nxt, (day - dt.timedelta(days=1), day), (day, nxt)


def public_block(rs_all, w, W, keep=lambda r: True) -> dict:
    a, b, (pa, pb), (ta, tb) = pub_span(w)
    rs = [r for r in rs_all if keep(r) and a <= r["_c"] < b]
    basis = lambda r: r["source"] in TREND_SOURCES and SOURCE_START.get(r["source"], START) <= pa  # noqa: E731  (HL-13)
    cur_t = sum(1 for r in rs_all if keep(r) and basis(r) and ta <= r["_c"] < tb)
    prev_t = sum(1 for r in rs_all if keep(r) and basis(r) and pa <= r["_c"] < pb)
    hi = [r for r in rs if reach(r)]
    return {
        "volume": len(rs),
        "positive": sum(1 for r in rs if r["sentiment"] == "positive"),
        "negative": sum(1 for r in rs if r["sentiment"] == "negative"),
        "neutral": sum(1 for r in rs if r["sentiment"] == "neutral"),
        "positive_share": weighted_share(reviews(rs), lambda r: r["sentiment"] == "positive", W),
        "negative_share": weighted_share(reviews(rs), lambda r: r["sentiment"] == "negative", W),
        "share_method": "source_weighted",
        "change_pct": change(cur_t, prev_t),
        "trend_basis": {"current": cur_t, "previous": prev_t,
                        "sources": sorted(x for x in TREND_SOURCES if SOURCE_START.get(x, START) <= pa)},
        "escalation": sum(1 for r in rs if r["escalation_intent"]),
        "repeat_contact": sum(1 for r in rs if r["repeat_contact"]),
        "responded": replies(rs),
        "high_impact": {
            "volume": len(hi),
            "positive": sum(1 for r in hi if r["sentiment"] == "positive"),
            "negative": sum(1 for r in hi if r["sentiment"] == "negative"),
            "escalation": sum(1 for r in hi if r["escalation_intent"]),
            "positive_share": weighted_share(reviews(hi), lambda r: r["sentiment"] == "positive", W, 1),
            "negative_share": weighted_share(reviews(hi), lambda r: r["sentiment"] == "negative", W, 1),
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
    t = re.sub(r"https?://\S+", "[official help page link]", t)
    t = t.replace("!", ".")  # screen copy carries no exclamation marks (lint_terms), quoted or not
    return t[:420]


# NW-D100: the internal social-inbox handling layer (seed_social_inbox.py), internal · illustrative.
_INBOX: dict = {}


def inbox_ref(record_id: str) -> str:
    """The inbox record points at its post by a short hash, never the raw post or contact id (a long number)."""
    # Letters only, so no run of digits in it reads as a phone or account number (check_pii).
    return hashlib.sha1(f"inbox:{record_id}".encode()).hexdigest()[:12].translate(_LETTERS)


_LETTERS = str.maketrans("0123456789", "ghijklmnop")


def inbox() -> dict:
    if not _INBOX:
        path = SEED_V3 / "social_inbox.json"
        for r in (load(path)["records"] if path.exists() else []):
            _INBOX[(r["kind"], r["ref"])] = r
    return _INBOX


def handled_block(recs) -> dict:
    """Handled n of m: an action on the post (acknowledged, replied in thread, moved to secure message), and how many
    within 24 hours. Weights carry bank scale for mentions; a public post counts once."""
    tot = sum(r["w"] for r in recs)
    hd = sum(r["w"] for r in recs if r["status"] != "no_action")
    fast = sum(r["w"] for r in recs if r["handling_hours"] is not None and r["handling_hours"] <= 24)
    by = collections.Counter()
    for r in recs:
        by[r["status"]] += r["w"]
    return {"provenance": "internal", "total": tot, "handled": hd, "within_24h": fast,
            "within_24h_pct": pct(fast, tot, 0), "by_status": dict(by)}


def social_pulse(pub, w, W) -> dict:
    """External block of the Customer pulse (30 Sep review, K2 and follow-ups 1-2): public mentions, the ones with
    reach, how many got a bank reply (by source), and the five posts with the most engagement. Text is the anonymised
    summary; no names, handles or links."""
    a, b, _prev, _cur = pub_span(w)
    rs = [r for r in pub if a <= r["_c"] < b]
    hi = [r for r in rs if reach(r)]
    by_source = response_by_source(rs)
    n_resp = sum(x["responded"] or 0 for x in by_source)
    hi_resp = sum(1 for r in hi if responded(r))
    score = lambda r: sum(engagement_of(r).values())  # noqa: E731
    safe = lambda r: quotable(r) and r["summary"] and not ALLEGATION.search(f"{r['summary']} {r.get('text') or ''}")  # noqa: E731
    top = sorted([r for r in rs if safe(r) and score(r) > 0], key=lambda r: (score(r), r["created_at"]), reverse=True)[:5]
    as_post = lambda r: {  # noqa: E731
        "text": r["summary"], "platform": SOURCE_LABEL[r["source"]], "date": r["created_at"][:10],
        "sentiment": r["sentiment"], "engagement": engagement_of(r), "score": score(r),
        "responded": responded(r) if r["source"] in REPLY_SOURCES else None, "illustrative": False,
    }
    posts = [as_post(r) for r in top]
    # High impact: the busiest day in the period, the posts of that day, and the change against the comparison window.
    by_day = collections.Counter(r["created_at"][:10] for r in hi)
    peak = None
    if by_day:
        day, n_day = max(by_day.items(), key=lambda kv: (kv[1], kv[0]))
        day_posts = sorted([r for r in hi if r["created_at"][:10] == day and safe(r)], key=score, reverse=True)[:5]
        peak = {"date": day, "count": n_day, "posts": [as_post(r) for r in day_posts]}
    (ta, tb), (pa, pb) = w["trend_cur"], w["prev"]
    hi_cur = sum(1 for r in pub if ta <= r["_c"] < tb and reach(r))
    hi_prev = sum(1 for r in pub if pa <= r["_c"] < pb and reach(r))
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
            {"end": e.isoformat(), "pct": weighted_share(reviews(xs), lambda r: r["sentiment"] == "negative", W) if xs else None}
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
        "high_impact_change_pct": change(hi_cur, hi_prev),
        "high_impact_peak": peak,
        "high_impact_response_pct": pct(hi_resp, len(hi), 0),
        # NW-D100: X and Reddit posts with reach, handled in the internal social inbox (internal · illustrative).
        "high_impact_handled": handled_block([inbox()[("high_impact", inbox_ref(r["id"]))] for r in hi
                                              if ("high_impact", inbox_ref(r["id"])) in inbox()]),
        "posts": posts,
        "good_response": good,
        "rule": "High impact (virality rule): an X account with 10,000+ followers, or 50+ likes or 20+ reposts; a Reddit post with 50+ upvotes; a store review 20+ people found helpful. Trending posts are ranked by likes, replies and reposts (upvotes and helpful votes on Reddit and the stores).",
    }


QUOTE_FIRST_PERSON = re.compile(r"\b(i|i'm|im|i've|ive|i'd|my|me|we|our|us)\b", re.I)
QUOTE_PRODUCT = {  # NW-D92: a card's quote must name the product the card is about
    "current_accounts": re.compile(r"current account|\baccount\b|overdraft|debit card|\bapp\b|branch", re.I),
    "payments_fraud": re.compile(r"payment|transfer|\bfraud|\bscam|refund|chargeback|direct debit|payee", re.I),
    "cards": re.compile(r"credit card|\bcard\b|credit limit|reward|cashback", re.I),
    "savings": re.compile(r"\bsavings?\b|\bisas?\b|interest|saver", re.I),
    "mortgages": re.compile(r"mortgage|remortgag|rate switch|redemption", re.I),
    "personal_loans": re.compile(r"\bloan", re.I),
}


def anecdote(rs, theme, pid=None):
    # A card's anecdote is the business's voice in one line: never a quote naming a person, and never an allegation
    # (fraud, corruption, lying…) even against an unnamed role, which on an exec screen reads as the bank's view.
    # NW-D92: on-topic, first-person, naming the card's product; never an item whose subject is another bank.
    prod = QUOTE_PRODUCT.get(pid)
    cands = [
        r for r in rs
        if quotable(r) and r["summary"] and r["sentiment"] == "negative"
        and r.get("relevant", "on_topic") == "on_topic"
        and QUOTE_FIRST_PERSON.search(f"{r.get('title') or ''} {r.get('text') or ''}")
        and (prod is None or prod.search(f"{r.get('title') or ''} {r.get('text') or ''}"))
        and not ALLEGATION.search(f"{r['summary']} {r.get('text') or ''}")
    ]
    # NW-D93: the top-issue theme first; then the product's most-engaged eligible on-topic item, any sentiment.
    others = [
        r for r in rs
        if quotable(r) and r["summary"] and r.get("relevant", "on_topic") == "on_topic"
        and QUOTE_FIRST_PERSON.search(f"{r.get('title') or ''} {r.get('text') or ''}")
        and (prod is None or prod.search(f"{r.get('title') or ''} {r.get('text') or ''}"))
        and not ALLEGATION.search(f"{r['summary']} {r.get('text') or ''}")
    ]
    pick = [r for r in cands if theme in r["themes"]] or others
    if not pick:
        return None

    def eng(r):
        e = r.get("engagement") or {}
        return sum(v for v in e.values() if isinstance(v, (int, float)))

    r = sorted(pick, key=lambda r: (eng(r), r["created_at"]), reverse=True)[0]
    return {"summary": r["summary"], "source_label": SOURCE_LABEL[r["source"]], "date": r["created_at"][:10]}


def theme_labels():
    from taxonomy import THEMES

    out = {t["id"]: t["label"] for t in THEMES}
    out.update({t["id"]: t["label"] for t in load(OUT_APP / "themes.json")["themes"]})
    return out


# ------------------------------------------------------------------ businesses, brief

THIN_ROWS = 30
MIN_REVIEWS = 20  # NW-D93
MIN_PUBLIC = 3  # NW-D95, lowered in NW-D98


# NW-D98: a product's top issue. App themes (outages, login, biometrics, features, Cora) lead only Current accounts and
# app; Personal loans takes its top issue from loan themes (decision, payout, repayment, early settlement, affordability).
APP_THEMES = {"app_speed_crash", "app_login_biometrics", "app_usability", "new_app_release", "device_security_block",
              "online_banking", "app_praise", "cora_unresolved", "cora_wrong_answer", "cora_handoff_lost", "cora_no_person"}
LOAN_THEMES = {"loan_processing", "loan_servicing", "loan_closure_documents", "recovery_conduct", "credit_report"}


def fits_product(theme: str, pid: str) -> bool:
    if pid == "personal_loans":
        return theme in LOAN_THEMES
    return pid == "current_accounts" or theme not in APP_THEMES


def businesses(inter, pub, w, W, labels) -> list[dict]:
    out = []
    a, b = w["start"], w["end"]
    for pid in PRODUCT_ORDER:
        irs = [r for r in inter if r["product"] == pid]
        ib = internal_block(irs, w)
        # Negative share on the product card (review round 3, NW-D67): with fewer than THIN_ROWS sample contacts in the
        # period (the morning brief), one heavy sample row can carry the share (Personal loans read 94%), so the card
        # shows the last 7 days instead and says so.
        rows = [r for r in irs if in_win(r, a, b)]
        basis = rows
        if len(rows) < THIN_ROWS:
            basis = [r for r in irs if in_win(r, b - dt.timedelta(days=7), b)]
        ib["negative_share"] = pct(sum(r["w"] for r in basis if r["sentiment"] == "negative"), wn(basis))
        ib["negative_share_basis"] = "last 7 days" if basis is not rows else None
        pb = public_block(pub, w, W, keep=lambda r, pid=pid: r["_product"] == pid)
        # NW-D93: the card's negative-public figure needs at least MIN_REVIEWS review items in the period.
        pa_, pb_, _p, _c = pub_span(w)
        prs = [r for r in pub if r["_product"] == pid and pa_ <= r["_c"] < pb_]
        n_rev = sum(1 for r in prs if r["source"] in REVIEW_SOURCES)
        pb["review_items"] = n_rev
        if n_rev < MIN_REVIEWS:
            # NW-D95: fewer than 20 reviews -> all on-topic public items for the product, labelled indicative; fewer than
            # 5 public items of any kind -> no figure.
            n_all = len(prs)
            if n_all >= MIN_PUBLIC:
                pb["negative_share"] = pct(sum(1 for r in prs if r["sentiment"] == "negative"), n_all)
                pb["negative_share_note"] = "indicative"
            else:
                pb["negative_share"] = None
                pb["negative_share_note"] = None  # fewer than 5 public items: "—" (no count shown, Usha 17 Nov)
        neg_t = collections.Counter(r["themes"][0] for r in prs if r["sentiment"] == "negative" and fits_product(r["themes"][0], pid))
        top = neg_t.most_common(1)[0] if neg_t else None
        if not top:  # thin public voice: fall back to the internal top issue, and say so
            it = wcounter([r for r in irs if in_win(r, a, b) and r["sentiment"] == "negative" and fits_product(r["theme"], pid)],
                          lambda r: r["theme"]).most_common(1)
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
            "anecdote": anecdote(prs, top_issue["id"], pid) if top_issue else None,
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
                "text": f"{inr(x['external']['escalation'])} posts with escalation language; {inr(backlog)} {what}.",
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
        n_now = weighted_share(reviews(cur), lambda r: r["sentiment"] == "negative", W, 1)
        n_prev = weighted_share(reviews(prv), lambda r: r["sentiment"] == "negative", W, 1)
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
            n_now = weighted_share(reviews(cur), lambda r: r["sentiment"] == "negative", W, 1) if cur else None
            n_prev = weighted_share(reviews(prv), lambda r: r["sentiment"] == "negative", W, 1) if prv else None
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
    pa_, pb_, _p, _c = pub_span(w)
    prs = [r for r in prs_all if pa_ <= r["_c"] < pb_]
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
            "trend": [{"end": e.isoformat(), "internal": sum(r["w"] for r in ir if in_win(r, s, e)),
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
    net = lambda xs: (weighted_share(reviews(xs), lambda r: r["sentiment"] == "positive", W) or 0) - (weighted_share(reviews(xs), lambda r: r["sentiment"] == "negative", W) or 0) if xs else None  # noqa: E731
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
            "repeat_contact_internal": pct(sum(r["w"] for r in ir if r.get("repeat")), wn(ir)),
            "escalation_internal": sum(r["w"] for r in ir if r.get("escalation")),
            "escalation_external": sum(1 for r in pr if r["escalation_intent"]),
            "negative_share": weighted_share(reviews(pr), lambda r: r["sentiment"] == "negative", W) if pr else None,
        })
    # Themes by Consumer Duty outcome (public).
    pillars = []
    for pid_, plabel in OUTCOMES:
        xs = [r for r in prs if r.get("pillar") == pid_]
        tops = collections.Counter(r["themes"][0] for r in xs).most_common(3)
        pillars.append({"id": pid_, "label": plabel, "count": len(xs), "net": round(net(xs), 1) if xs else None,
                        "top": [{"id": k, "label": labels.get(k, k), "count": v} for k, v in tops]})
    # Where contacts come from: journey stage (internal).
    journey = []
    for st in JOURNEY_ORDER:
        xs = [r for r in ivol if JOURNEY_STAGE.get(r["theme"], "Everyday banking") == st]
        journey.append({"stage": st, "volume": wn(xs), "negative_share": pct(sum(r["w"] for r in xs if r["sentiment"] == "negative"), wn(xs)),
                        "repeat_share": pct(sum(r["w"] for r in xs if r.get("repeat")), wn(xs))})
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
        tiers.append({"id": lid, "label": LIST_LABEL[lid], "volume": wn(xs), "open": sum(r["w"] for r in xs if is_open(r, b)),
                      "negative": sum(r["w"] for r in xs if r["sentiment"] == "negative")})
    unlisted = [r for r in ivol if not any(k in customers[r["masked_id"]]["cohorts"] for k in PULSE_LISTS)]
    tiers.append({"id": "none", "label": "Not on a list", "volume": wn(unlisted), "open": sum(r["w"] for r in unlisted if is_open(r, b)),
                  "negative": sum(r["w"] for r in unlisted if r["sentiment"] == "negative")})
    return {
        "internal": ib, "external": pbk, "categories": cats, "mood": mood, "market": market, "service": service,
        "friction": friction, "pillars": pillars, "journey": journey, "stores": stores, "channels": channels, "tiers": tiers,
        **cards_drilldowns(inter, customers, pub, w, W, labels, ivol, prs, prs_all, irs),
    }


# ------------------------------------------------------------------ Cards drill-downs (30 Sep review, changes_30sep.md C4)
# The three MD drill-downs (satisfaction, market, service), rebuilt for Cards only and for the selected period.
TARGET_LABEL = {
    "rbi": "Regulator named or tagged (FCA)",
    "rbi_ombudsman": "Financial Ombudsman Service",
    "consumer_court": "Small claims court or consumer body",
    "legal": "Legal action",
    "ministers": "MP tagged",
    "grievance": "Complaints team",
}
REQUEST_LABEL = {
    "card_delivery": "Card delivery",
    "refund": "Merchant refund",
    "reversal": "Failed payment return",
    "dispute": "Dispute or chargeback",
    "closure": "Card closure",
    "loan_disbursal": "Loan payout",
    "credit_report": "Credit file correction",
    "kyc": "Identity checks and profile updates",
    "other": "Other request",
}
RUNG_LABEL = [("grievance", "Complaint"), ("md_office", "Complaints team"), ("io", "Final response"), ("rbi_ombudsman", "Financial Ombudsman Service")]


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
        p = weighted_share(reviews(xs), lambda r: r["sentiment"] == "positive", W, 1) or 0
        n = weighted_share(reviews(xs), lambda r: r["sentiment"] == "negative", W, 1) or 0
        return round(p - n, 1)

    def raw_net(xs):
        return round(100 * (sum(1 for r in xs if r["sentiment"] == "positive") - sum(1 for r in xs if r["sentiment"] == "negative")) / len(xs), 1) if xs else None

    # --- 1. Are my customers happy?
    by_source = []
    for src in ("appstore", "playstore", "x", "reddit", "trustpilot", "forum"):
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
            "indicative": src in SOCIAL_SOURCES,  # NW-D91: shown on its own, labelled indicative
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
            repeat_by_cat.append({"id": c["id"], "label": c["label"], "internal_repeat": sum(r["w"] for r in ir if r.get("repeat")),
                                  "public_repeat": sum(1 for r in pr if r["repeat_contact"]), "contacts": wn(ir)})
    repeat_by_cat.sort(key=lambda x: -(x["internal_repeat"] + x["public_repeat"]))
    tiers_sent = []
    for lid in PULSE_LISTS + ["none"]:
        xs = [r for r in ivol if (lid == "none" and not any(k in customers[r["masked_id"]]["cohorts"] for k in PULSE_LISTS))
              or (lid != "none" and lid in customers[r["masked_id"]]["cohorts"])]
        tiers_sent.append({"id": lid, "label": LIST_LABEL.get(lid, "Not on a list"), "volume": wn(xs),
                           "positive": sum(r["w"] for r in xs if r["sentiment"] == "positive"),
                           "neutral": sum(r["w"] for r in xs if r["sentiment"] == "neutral"),
                           "negative": sum(r["w"] for r in xs if r["sentiment"] == "negative"),
                           "open": sum(r["w"] for r in xs if is_open(r, b))})
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
            "negative_share": weighted_share(reviews(xs), lambda r: r["sentiment"] == "negative", W, 1),
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
        "internal": wn(fraud_int), "internal_open": sum(r["w"] for r in fraud_int if is_open(r, b)),
        "internal_high_impact": sum(r["w"] for r in fraud_int if r["high_impact"]),
        "top": [{"id": k, "label": labels.get(k, k), "count": v} for k, v in collections.Counter(r["themes"][0] for r in fraud_pub).most_common(3)],
    }
    market_full = {"themes": themes_all, "rising": rising, "reach": reach_block, "safety": safety}

    # --- 3. Service
    ladder = [{"rung": "Contacts", "count": wn(ivol)}, {"rung": "Repeat", "count": sum(r["w"] for r in ivol if r.get("repeat"))}]
    for rid, rl in RUNG_LABEL:
        ladder.append({"rung": rl, "count": sum(r["w"] for r in ivol if r.get("escalation") and rung[r["escalation"]] >= rung[rid])})
    pub_esc = [r for r in prs if r["escalation_intent"]]
    by_target = collections.Counter(r.get("escalation_target") or "unnamed" for r in pub_esc)
    targets = [{"id": k, "label": TARGET_LABEL.get(k, "Target not named"), "count": v} for k, v in by_target.most_common()]
    closure_int = [r for r in ivol if r["theme"] == "closure_requests"]
    closure_pub = [r for r in prs if r["closure_intent"]]
    cure = [r for r in prs if r["cure_watch"]]
    status = [r for r in prs if r["status_seeking"]]
    disp = [r for r in ivol if r["deliverable"] == "dispute"]
    funnel = [
        {"stage": "Disputes raised", "count": wn(disp)},
        {"stage": "First response given", "count": sum(r["w"] for r in disp if r["_resp"] and r["_resp"] <= b)},
        {"stage": "Closed", "count": sum(r["w"] for r in disp if not open_at(r, b))},
        {"stage": "Customer credited", "count": sum(r["w"] for r in disp if r.get("credited") and not open_at(r, b))},
    ]
    missed = collections.Counter(r.get("request_type") or "other" for r in prs if r["promise_break"])
    missed_rows = [{"id": k, "label": REQUEST_LABEL.get(k, k), "count": v} for k, v in missed.most_common()]
    tat_int = [r for r in ivol if cat_of(r["theme"])["tat"]]
    failures = sorted(themes_all, key=lambda t: -t["negative"])[:5]
    service_full = {
        "ladder": ladder, "public_escalation": len(pub_esc), "targets": targets,
        "closure": {"internal_requests": wn(closure_int), "internal_open": sum(r["w"] for r in closure_int if is_open(r, b)),
                    "public_intent": len(closure_pub), "quote": quote_of(closure_pub)},
        "cure": {"count": len(cure), "top": [{"id": k, "label": labels.get(k, k), "count": v} for k, v in collections.Counter(r["themes"][0] for r in cure).most_common(3)],
                 "quote": quote_of(cure)},
        "transparency": {"count": len(status), "share": weighted_share(prs, lambda r: r["status_seeking"], W) if prs else None,
                         "quote": quote_of(status)},
        "disputes": funnel,
        "missed_timelines": {"total": sum(missed.values()), "rows": missed_rows},
        "tat_related": {"contacts": wn(tat_int), "share": pct(wn(tat_int), wn(ivol)), "open": sum(r["w"] for r in tat_int if is_open(r, b))},
        "failures": [{"id": t["id"], "label": t["label"], "negative": t["negative"], "count": t["count"], "escalation": t["escalation"]} for t in failures],
    }
    return {"happy": happy, "market_full": market_full, "service_full": service_full}


def md_mail(inter, w, labels) -> dict:
    a, b = w["start"], w["end"]
    rs = [r for r in inter if r.get("escalation") in ("md_office", "io", "rbi_ombudsman") and in_win(r, a, b)]
    by = wcounter(rs, lambda r: r["theme"]).most_common(5)
    rows = []
    for th, n in by:
        xs = [r for r in rs if r["theme"] == th]
        rows.append({"theme": th, "label": labels.get(th, th), "mails": n, "resolved": sum(r["w"] for r in xs if not open_at(r, b))})
    return {"total": wn(rs), "rows": rows}


def v4_period(inter, customers, pub, cards_complaints, w, labels) -> dict:
    """B11 additions for one period (v4_blocks.py): Cards first, then open too long for the bank and each business."""
    a, b = w["start"], w["end"]
    vol = [r for r in inter if in_win(r, a, b)]
    cvol = [r for r in vol if r["product"] == "cards"]
    pend = min(b, PUBLIC_END)
    pa_, pb_, _p, _c = pub_span(w)
    cprs = [r for r in pub if r["_product"] == "cards" and pa_ <= r["_c"] < pb_]
    bprs = [r for r in pub if pa_ <= r["_c"] < pb_]
    for r in cprs + bprs:
        r["_reach"] = reach(r)
    biz_otl = []
    for pid in PRODUCT_ORDER:
        xs = [r for r in vol if r["product"] == pid]
        if xs:
            o = v4.open_too_long(xs, customers, is_open, labels)
            biz_otl.append({"id": pid, "label": PRODUCT_LABEL[pid], **{k: o[k] for k in ("count", "open", "share_of_open")},
                            "list": o["list"][:15],
                            "service": v4.service_metrics(xs, open_at, b)})
    return {
        "cards": {
            "hierarchy": v4.hierarchy(cvol, cprs, customers, b, is_open, open_at, waiting_at, responded),
            "open_too_long": v4.open_too_long(cvol, customers, is_open, labels),
            "priority_slice": v4.priority_slice(cvol, customers, is_open),
            "to_close": v4.to_close(cvol, customers, is_open, labels),
            "social": v4.social(cprs, responded, pend, labels),
            "top_complaints": v4.top_complaints(cards_complaints, labels, w),
            "service": v4.service_metrics(cvol, open_at, b),
        },
        "bank": {
            "hierarchy": v4.hierarchy(vol, bprs, customers, b, is_open, open_at, waiting_at, responded),
            "open_too_long": {**v4.open_too_long(vol, customers, is_open, labels), "by_business": biz_otl},
            "social": v4.social(bprs, responded, pend, labels),
            "service": v4.service_metrics(vol, open_at, b),
        },
    }


def cora_returns(inter, by_cust, w) -> dict:
    """Brief Step 5.11 (review round 3, NW-D68): Cora conversations resolved in the period, and how many came back as a
    call or a complaint within 7 days. Only conversations resolved at least 7 days before the freeze count, so every
    one has its full 7 days of follow-up."""
    until = min(w["end"], END - dt.timedelta(days=7))
    done = [r for r in inter if r["channel"] == "whatsapp" and r["status"] == "closed" and r["_closed"]
            and w["start"] <= r["_closed"] < until]
    week = dt.timedelta(days=7)
    back = [r for r in done if any(x is not r and r["_closed"] < x["_c"] <= r["_closed"] + week
                                   and (x["channel"] == "inbound_voice" or x["deliverable"] == "complaint_resolution")
                                   for x in by_cust[r["masked_id"]])]
    return {"resolved": wn(done), "back_7d": wn(back), "from": w["start"].isoformat(), "until": until.isoformat()}


def main():
    inter, customers, notes = load_internal()
    by_cust = collections.defaultdict(list)
    for r in inter:
        by_cust[r["masked_id"]].append(r)
    pub = load_public()
    W = source_weights(pub)
    labels = theme_labels()
    complaints = omb.load_complaints()
    cards_complaints = [c for c in complaints if c["product"] == "cards"]
    products = [(pid, PRODUCT_LABEL[pid]) for pid in PRODUCT_ORDER]
    out = {"end": PERIOD_END, "public_end": PUBLIC_END.isoformat(), "default": DEFAULT_PERIOD,
           # Internal figures are bank-scale weighted sums of the kept sample rows (scale_v3.py).
           "scale": {"sample_rows": SCALE["sample"]["rows"], "sample_customers": SCALE["sample"]["customers"],
                     "list_sizes": SCALE["list_sizes"], "note": SCALE["note"]},
           "dominance_limit": SOURCE_DOMINANCE_LIMIT, "source_weights": {s: round(v, 4) for s, v in W.items()}, "periods": {}}
    for p in PERIODS:
        w = windows(p)
        biz = businesses(inter, pub, w, W, labels)
        external = public_block(pub, w, W)
        internal = internal_block(inter, w, with_backlog=True)
        internal["by_channel"] = by_channel(inter, w)
        total = internal["volume"] + external["volume"]
        out["periods"][p["id"]] = {
            "id": p["id"], "label": p["label"], "short": p["short"],
            "start": w["start"].isoformat(), "end": w["end"].isoformat(),
            "public_start": pub_span(w)[0].isoformat(), "public_end": min(pub_span(w)[1], PUBLIC_END).isoformat(),
            # NatWest (HL-15): false while data/raw/natwest/ holds nothing; the external blocks then read "Public data
            # not yet loaded" instead of zeros.
            "public_loaded": bool(pub),
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
        # One register (review round 3, NW-D66): the credit-card ladder's complaint rungs are the credit-card slice of
        # the steady register the credit-card Financial Ombudsman tile reads, as flows in the period.
        flows = complaint_rules.ladder_flows(cards_complaints, w["start"], w["end"])
        for rung in cp["cards"]["service_full"]["ladder"]:
            if rung["rung"] in flows:
                rung["count"] = flows[rung["rung"]]
        cp["v4"] = v4_period(inter, customers, pub, cards_complaints, w, labels)
        # Cora module (Pass 2 section 12): Cora themes inside the bank at bank scale, any channel, any product.
        cora_rs = [r for r in inter if r["theme"] in CORA_THEMES]
        cp["cora"] = {
            "internal": internal_block(cora_rs, w),
            "rows": [{"id": t, "label": labels.get(t, t), "internal": internal_block([r for r in cora_rs if r["theme"] == t], w)}
                     for t in CORA_THEMES],
            "returns": cora_returns(inter, by_cust, w),
        }
        item = omb.brief_item(cp["ombudsman"])
        if item:
            cp["brief"]["needs_you"] = [item, *cp["brief"]["needs_you"]][:3]
        cp["brief"]["rules"] += (
            " A Financial Ombudsman watch item leads What needs you when any complaint has 3 days or fewer to the final-response deadline "
            "limit, or more complaints are already eligible than at the previous period end.")
        print(p["id"], "internal", internal["volume"], "external", external["volume"], "lists",
              [(x["id"], x["volume"], x["open"], x["not_responded_48h"]) for x in cp["customer_pulse"]["lists"]],
              "mix", external["source_mix"])
    out["v4"] = {
        "limits": v4.LIMITS, "limit_labels": v4.LIMIT_LABEL, "owner_roles": v4.OWNER_ROLES,
        "queries": v4.query_lists(inter, cards_complaints, pub, customers, is_open, responded, PUBLIC_END, labels),
    }
    dump(out, OUT_APP / "periods.json")


if __name__ == "__main__":
    main()
