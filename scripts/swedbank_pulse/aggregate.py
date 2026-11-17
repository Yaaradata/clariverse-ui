"""Stage 3 · Aggregate classified Swedbank items into the files the screens read (SW-D11).

Writes to data/out/swedbank_pulse/: themes.json, signals.json, app_pulse.json, mood.json, briefing.json, meta.json,
evidence.json, responses.json. Every count is reproducible from work/classified.jsonl (retail Swedish Banking,
on-topic, in the window).

Window: 22 Oct – 17 Nov 2026, freeze 17 Nov 07:45 CET. Trend: source-weighted share of trend-basis items, second half
(4–17 Nov) vs first half (22 Oct–3 Nov); see method.py. A stream is trend basis only if it covers the whole window: the
App Store starts on 2 Nov and Trustpilot on 27 Oct, so they count in totals but not in trends. No earlier baseline.

Quotes (evidence): on topic, first person, product-matched, never another bank as subject, from the checked-in labels
(quote_ok), each with the Swedish original, "lang" and an English "gloss" (null when the original is English).
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import re
import statistics

import method as M
from classify import OWNER_BY_RT
from common import OWNER_LABEL
from normalise import RETAIL_ENTITY
from method import stream_of
from normalise import OUT, WORK
from taxonomy import OUTCOMES, THEMES

T = {t["id"]: t for t in THEMES}
W_START, W_END = "2026-10-22", "2026-11-17"
H1_END = "2026-11-03"  # SW-D03: halves of the 27-day window
AS_OF = "2026-11-17"
BRIEF = {"date": "2026-11-17", "label": "17 Nov 2026", "time": "07:45 CET"}
SINCE_830 = "2026-11-16T06:45:00+00:00"  # 16 Nov 07:45 CET
UTC = dt.timezone.utc
NON_ISSUE = {"app_praise", "service_praise", "product_advice", "offers_deals", "market_news", "other", "general_dissatisfaction", "trading_securities", "insurance_group"}
SOURCE_LABEL = {"appstore": "App Store", "playstore": "Google Play", "x": "X", "reddit": "Reddit", "trustpilot": "Trustpilot"}
# Plain place labels for evidence. Screens never link to the original post (the URL stays in evidence.json, server-side,
# for audit only), so each quote says where it came from in words.



def _product_of(r):
    from public_v3 import product_of  # noqa: PLC0415  (public_v3 imports this module's outputs; import late)

    return product_of(r)

def place_label(r) -> str:
    src = r["source"]
    if src == "playstore":
        return "Google Play review"
    if src == "trustpilot":
        return "Trustpilot review"
    if src == "appstore":
        return "App Store review"
    if src == "x":
        return "X post"
    if src == "reddit":
        return f"Reddit · r/{r['subreddit']}" if r.get("subreddit") else "Reddit"
    return SOURCE_LABEL.get(src, src)


RUNG_OF_TARGET = {
    "arn": "ARN", "fi": "ARN", "consumer_body": "ARN", "legal": "ARN",
    "kundombudsman": "Complaint", "complaints_team": "Complaint", "public": "Public", "repeat": "Repeat",
}
REDIRECT_RE = re.compile(
    r"(e-?mail|write to|call|reach|connect|contact|dm|share|visit|chat|raise|mention the ref|reference id|ref id|register a complaint|nearest branch)",
    re.I,
)


monday = M.monday
BANK_APP = "Swedbank privat"  # the retail app on both stores (Swedbank företag is business banking, out of scope)
NEW_VERSION = "8.4"  # the latest Google Play release in the window (App Store reviews carry no version)
WEEKS = M.full_weeks()  # full weeks only: a one-day last week reads as a collapse


def in_window(r) -> bool:
    return W_START <= r["created_at"][:10] <= W_END


def weekly(rows) -> list[dict]:
    c = collections.Counter(monday(r["created_at"]) for r in rows)
    return [{"week": w, "count": c.get(w, 0)} for w in WEEKS]


def pct(a, b, d=1):
    return round(100 * a / b, d) if b else None


def load():
    rows = [json.loads(line) for line in open(WORK / "classified.jsonl", encoding="utf-8")]
    return rows


def streams_info(rows):
    by = collections.defaultdict(list)
    for r in rows:
        by[stream_of(r)].append(r["created_at"][:10])
    info = []
    for s, ds in sorted(by.items()):
        earliest, latest = min(ds), max(ds)
        win = [d for d in ds if W_START <= d <= W_END]
        info.append(
            {
                "stream": s,
                "records": len(ds),
                "earliest": earliest,
                "latest": latest,
                "window_first": min(win) if win else None,
                "full_window": earliest <= "2026-10-24" and latest >= "2026-11-12" and s not in M.PARTIAL_BY_DESIGN,
                "partial_reason": M.PARTIAL_BY_DESIGN.get(s),
                "mode": "trend_within_window",
                "baseline_items": 0,
                "baseline_weeks": 0.0,
            }
        )
    return info


_WEIGHTS: dict[int, tuple] = {}


def halves(rows, basis_rows_all, basis, min_per_half: int = 0):
    """Second half vs first half, as source-weighted shares of basis_rows_all (method.py)."""
    key = id(basis_rows_all)
    if key not in _WEIGHTS:
        _WEIGHTS[key] = (basis_rows_all, M.weights(basis_rows_all))  # keep the list alive so its id is not reused
    return M.halves(rows, basis_rows_all, _WEIGHTS[key][1], min_per_half)


def sent_counts(rows):
    c = collections.Counter(r["sentiment"] for r in rows)
    return {"positive": c.get("positive", 0), "neutral": c.get("neutral", 0), "negative": c.get("negative", 0)}


REPLY_NOW = dt.datetime(2026, 11, 17, 6, 45, tzinfo=dt.timezone.utc)  # the freeze, 17 Nov 07:45 CET


def resp_stats(rs, now=REPLY_NOW):
    """Bank replies on Play Store reviews: responded, open, open over 48 hours, median reply time, redirect-only."""
    replied = [r for r in rs if r["reply"]]
    mins = []
    for r in replied:
        if r["reply"]["at"]:
            d = (dt.datetime.fromisoformat(r["reply"]["at"]) - dt.datetime.fromisoformat(r["created_at"])).total_seconds() / 60
            if d >= 0:  # reviews edited after the reply have a later timestamp; they count as responded, not in the median
                mins.append(d)
    open_ = [r for r in rs if not r["reply"]]
    otl = [r for r in open_ if (now - dt.datetime.fromisoformat(r["created_at"])).total_seconds() > 48 * 3600]
    redirect = [r for r in replied if REDIRECT_RE.search(r["reply"]["text"] or "")]
    return {
        "reviews": len(rs),
        "responded": len(replied),
        "responded_pct": pct(len(replied), len(rs)),
        "open": len(open_),
        "open_pct": pct(len(open_), len(rs)),
        "open_too_long": len(otl),
        "open_too_long_pct_of_open": pct(len(otl), len(open_)),
        "open_too_long_pct_of_reviews": pct(len(otl), len(rs)),
        "median_reply_minutes": round(statistics.median(mins)) if mins else None,
        "median_reply_hours": round(statistics.median(mins) / 60, 2) if mins else None,
        "replied_within_48h": sum(1 for x in mins if x <= 48 * 60),
        "redirect_only": len(redirect),
        "redirect_only_pct_of_replied": pct(len(redirect), len(replied)),
    }


def clip(text: str, n: int) -> str:
    """Cut at a word boundary, so a handle or tag is never left half-cut."""
    if len(text) <= n:
        return text
    cut = text[:n]
    return (cut[: cut.rfind(" ")] if " " in cut else cut).rstrip() + "…"


# A quote naming a group company outside retail scope (Baltic Banking, Sparbankerna, Swedbank Pay) is counted, never shown.
NOT_QUOTED_RX = re.compile(r"sparbank|swedbank\s*pay|latvi|lithuan|eston|lettland|litauen|estland|baltic|baltikum", re.I)


# NW-D91: positive and negative shares, net sentiment and the mood dial come from review sources only (App Store, Google
# Play, Trustpilot; model check 96%). X and Reddit count in volumes, themes, high impact, replies and quotes, never in a
# sentiment share (model check 71%: indicative only).
REVIEW_SOURCES = {"appstore", "playstore", "trustpilot"}
SOCIAL_SOURCES = {"x", "reddit"}


def review_only(rs):  # noqa: D103
    return [r for r in rs if r["source"] in REVIEW_SOURCES]


def quotable(r) -> bool:
    """SW-D11 quote rule: on topic, first person, product-matched, never another bank as subject (the label's quote_ok,
    set after reading the item), and never an item that alleges something against a named person or complains about
    one (names are already redacted to role tags in normalise.py; the person may still be identifiable by role)."""
    if not r.get("quote_ok") or r.get("relevant") != "on_topic" or r.get("entity") != RETAIL_ENTITY:
        return False
    if NOT_QUOTED_RX.search(f"{r.get('title') or ''} {r.get('summary') or ''} {r.get('text') or ''}"):
        return False  # a quote naming a group company outside retail scope is counted, never shown
    return not (r.get("alleges_named") or (r.get("names_person") and r["sentiment"] == "negative"))


def pick_exemplars(rows, n=5, prefer_negative=True):
    """Exemplars: substantive, negative first, spread across sources, most engaged first."""
    rows = [r for r in rows if quotable(r)]
    def score(r):
        eng = r.get("engagement") or {}
        e = sum(v for v in (eng.get("likes"), eng.get("upvotes"), eng.get("helpful"), eng.get("replies")) if isinstance(v, (int, float)))
        length = len((r.get("text") or "").split())
        return (
            (1 if (r["sentiment"] == "negative") == prefer_negative else 0),
            1 if 12 <= length <= 120 else 0,
            e,
            r["created_at"],
        )

    ranked = sorted(rows, key=score, reverse=True)
    out, seen_src = [], collections.Counter()
    for r in ranked:
        if len(out) >= n:
            break
        if seen_src[r["source"]] >= 2 and len(ranked) > n * 2:
            continue
        if not r["summary"]:
            continue
        out.append(r["id"])
        seen_src[r["source"]] += 1
    return out


def main():
    rows = load()
    OUT.mkdir(parents=True, exist_ok=True)
    win = [r for r in rows if in_window(r)]
    on = [r for r in win if r["relevant"] == "on_topic"]
    bank = [r for r in on if r["entity"] == RETAIL_ENTITY]
    group = [r for r in win if r["entity"] in ("investor_corporate", "group_other")]
    sinfo = streams_info(rows)  # collection coverage: every collected record, not only on-topic ones
    basis = {s["stream"] for s in sinfo if s["full_window"]}
    basis_bank = [r for r in bank if stream_of(r) in basis]
    W = M.weights(basis_bank)
    basis_reviews = review_only(basis_bank)
    W_REV = {"reviews": 1.0}  # NW-D91, SW-D11: review sources only, pooled across the three stores
    evidence_ids: set[str] = set()

    # ------------------------------------------------------------ themes
    by_theme = collections.defaultdict(list)
    for r in bank:
        for t in r["themes"]:
            by_theme[t].append(r)
    last_day = max((r["created_at"][:10] for r in bank), default=W_END)
    theme_rows = []
    for t in THEMES:
        rs = by_theme.get(t["id"], [])
        grp_rs = [r for r in group if t["id"] in r["themes"]]
        if not rs and not grp_rs:
            continue
        sc = sent_counts(rs)
        esc = sum(1 for r in rs if r["escalation_intent"])
        tr = halves(rs, basis_bank, basis)
        basis_n = sum(1 for r in rs if stream_of(r) in basis)
        basis_share = pct(basis_n, len(rs)) or 0
        mode = "trend_within_window" if basis_share >= 50 and basis_n >= 10 else "insufficient"
        rise = tr["change_pct"] if mode == "trend_within_window" and tr["first_half"] >= 5 else None
        share_esc = pct(esc, len(rs))
        # Only issue themes compete for "rising": catch-all buckets (other, advice, praise) never headline.
        score = round((rise or 0) * len(rs) * (1 + (share_esc or 0) / 100) / 100, 2) if (rise or 0) > 0 and t["id"] not in NON_ISSUE else 0
        exemplars = pick_exemplars(rs, 5, prefer_negative=t["id"] not in ("app_praise", "service_praise"))
        evidence_ids.update(exemplars)
        theme_rows.append(
            {
                **{k: t[k] for k in ("id", "label", "group", "pillar", "owner", "owner_label", "business", "definition")},
                "count": len(rs),
                "count_group_companies": len(grp_rs),
                "primary_count": sum(1 for r in rs if r["themes"][0] == t["id"]),
                "by_source": dict(collections.Counter(r["source"] for r in rs)),
                "by_business": dict(collections.Counter(r["business"] for r in rs)),
                "by_product": dict(collections.Counter(p for r in rs if (p := _product_of(r)))),
                "sentiment": sc,
                "share_negative": pct(sum(1 for r in review_only(rs) if r["sentiment"] == "negative"), len(review_only(rs))),
                "escalation_count": esc,
                "share_escalation": share_esc,
                "repeat_count": sum(1 for r in rs if r["repeat_contact"]),
                "status_seeking_count": sum(1 for r in rs if r["status_seeking"]),
                "promise_break_count": sum(1 for r in rs if r["promise_break"]),
                "closure_intent_count": sum(1 for r in rs if r["closure_intent"]),
                "weekly": M.weekly_share(rs, basis_bank, W),
                "weekly_all": weekly(rs),
                "trend": tr,
                "vs_baseline": None,
                "trend_mode": mode,
                "basis_share": basis_share,
                "rise_pct": rise,
                "first_seen": min((r["created_at"] for r in rs), default=None),
                "latest": max((r["created_at"] for r in rs), default=None),
                "rung": t["rung"],
                "exemplars": exemplars,
                "last_day_count": sum(1 for r in rs if r["created_at"][:10] == last_day),
                "score": score,
                "status": "watching",
                "action": t["action"],
            }
        )
    # Status (B4 §6): needs you = top by score among issue themes with at least 8 items; this week = next six.
    ranked = sorted(
        [t for t in theme_rows if t["id"] not in NON_ISSUE and t["count"] >= 8 and t["score"] > 0 and (t["share_negative"] or 0) >= 40],
        key=lambda t: -t["score"],
    )
    for t in ranked[:2]:
        t["status"] = "needs_you"
    for t in ranked[2:8]:
        t["status"] = "this_week"
    for t in theme_rows:
        if t["id"] in ("app_praise", "service_praise"):
            t["status"] = "improving"
    theme_rows.sort(key=lambda t: -t["count"])

    pillars = []
    for pid, plabel in OUTCOMES:
        rs = [r for r in bank if T[r["themes"][0]]["pillar"] == pid]
        sc = sent_counts(rs)

        def net(x):
            return round(100 * (sum(1 for r in x if r["sentiment"] == "positive") - sum(1 for r in x if r["sentiment"] == "negative")) / len(x), 1) if x else None

        # Level and halves on the same basis (trend-basis streams, source-weighted), so the level sits between them.
        b = review_only(rs)  # NW-D91: review sources only (pooled, SW-D11)
        lvl = M.strat_net(b, W_REV, M.MIN_INDICATIVE_N, lambda r: "reviews")
        n1 = M.strat_net([r for r in b if r["created_at"][:10] <= H1_END], W_REV, M.MIN_INDICATIVE_N, lambda r: "reviews")
        n2 = M.strat_net([r for r in b if r["created_at"][:10] > H1_END], W_REV, M.MIN_INDICATIVE_N, lambda r: "reviews")
        n1 = round(n1, 1) if n1 is not None else None
        n2 = round(n2, 1) if n2 is not None else None
        tops = collections.Counter(r["themes"][0] for r in rs).most_common(3)
        pillars.append(
            {
                "id": pid, "label": plabel, "count": len(rs), "sentiment": sc, "net_sentiment": round(lvl, 1) if lvl is not None else None,
                "net_first_half": n1, "net_second_half": n2,
                "net_change_pts": round(n2 - n1, 1) if n1 is not None and n2 is not None else None,
                "top_themes": [{"id": k, "label": T[k]["label"], "count": v} for k, v in tops],
            }
        )
    themes_file = {
        "scope": "swedbank · on_topic · window",
        "total_items": len(bank),
        "basis_items": len(basis_bank),
        "weeks": WEEKS,
        "themes": theme_rows,
        "pillars": pillars,
    }
    tmap = {t["id"]: t for t in theme_rows}

    # ------------------------------------------------------------ signals
    def flag_stat(key):
        rs = [r for r in bank if r[key]]
        tops = collections.Counter(r["themes"][0] for r in rs).most_common(5)
        ex = pick_exemplars(rs, 4)
        evidence_ids.update(ex)
        return {
            "count": len(rs),
            "share": pct(len(rs), len(bank)),
            "weekly": M.weekly_share(rs, basis_bank, W),
            "trend": halves(rs, basis_bank, basis),
            "top_themes": [{"id": k, "label": T[k]["label"], "count": v} for k, v in tops],
            "exemplars": ex,
        }

    flags = {k: flag_stat(k) for k in ("escalation_intent", "promise_break", "status_seeking", "cure_watch", "closure_intent", "repeat_contact", "feature_request")}
    sw = [r for r in bank if r["switching"]]
    flags["switching"] = {
        "count": len(sw),
        "to_other_bank": sum(1 for r in sw if r["switching"]["direction"] == "to"),
        "from_other_bank": sum(1 for r in sw if r["switching"]["direction"] == "from"),
        "note": "Posts naming a move between Swedbank and another bank. Counted as mentions, never as confirmed moves.",
    }
    pb = [r for r in bank if r["promise_break"]]
    pb_rows = []
    for rt, n in collections.Counter(r["request_type"] for r in pb).most_common():
        rs = [r for r in pb if r["request_type"] == rt]
        days = [r["days_elapsed"] for r in rs if r["days_elapsed"]]
        ex = pick_exemplars(rs, 3)
        evidence_ids.update(ex)
        pb_rows.append(
            {
                "request_type": rt, "count": n, "status_seeking": sum(1 for r in rs if r["status_seeking"]),
                "repeat_share": pct(sum(1 for r in rs if r["repeat_contact"]), n),
                "median_days_elapsed": round(statistics.median(days)) if days else None,
                "owner": OWNER_BY_RT.get(rt, "cx"),
                "top_theme": collections.Counter(r["themes"][0] for r in rs).most_common(1)[0][0],
                "exemplars": ex,
            }
        )
    st = [r for r in bank if r["status_seeking"]]
    tg_ex = pick_exemplars(st, 3)
    evidence_ids.update(tg_ex)
    esc = [r for r in bank if r["escalation_intent"]]
    public_src = ("x", "reddit", "trustpilot")
    reach = sorted(
        [r for r in bank if r["source"] == "x" and (r["author_followers"] or 0) >= 10000 and r["sentiment"] == "negative" and quotable(r)],
        key=lambda r: -(r["author_followers"] or 0),
    )[:8]
    voices = []
    for r in reach:
        f = r["author_followers"]
        who = f"X account, about {f / 1e6:.1f} million followers" if f >= 1e6 else f"X account, about {round(f / 1000)}k followers"
        voices.append(
            {"id": r["id"], "who": who, "reach": f, "theme": r["themes"][0], "theme_label": T[r["themes"][0]]["label"],
             "owner": r["owner"], "escalation": r["escalation_intent"], "created_at": r["created_at"]}
        )
        evidence_ids.add(r["id"])
    cl = [r for r in bank if r["closure_intent"]]
    cw = [r for r in bank if r["cure_watch"]]
    cl_ex, cw_ex = pick_exemplars(cl, 4), pick_exemplars(cw, 4)
    evidence_ids.update(cl_ex + cw_ex)
    signals = {
        "scope": "swedbank · on_topic · window",
        "total_items": len(bank),
        "flags": flags,
        "promise_by_request_type": pb_rows,
        "transparency_gap": {
            "count": len(st),
            "share": pct(len(st), len(bank)),
            "by_request_type": [
                {"request_type": k or "other", "count": v}
                for k, v in collections.Counter(r["request_type"] or "other" for r in st).most_common()
            ],
            "exemplars": tg_ex,
        },
        "escalation_by_target": [
            {"target": k, "rung": RUNG_OF_TARGET.get(k, "Complaint"), "count": v}
            for k, v in collections.Counter(r["escalation_target"] for r in esc).most_common()
        ],
        "ladder_public": {
            "voice_negative": sum(1 for r in bank if r["sentiment"] == "negative"),
            "repeat": sum(1 for r in bank if r["repeat_contact"]),
            "escalation_language": len(esc),
            "public_posts_with_escalation": sum(1 for r in esc if r["source"] in public_src),
            "arn_mentions": sum(1 for r in esc if r["escalation_target"] == "arn"),
            "climb_themes": [
                {"id": k, "label": T[k]["label"], "count": v}
                for k, v in collections.Counter(r["themes"][0] for r in esc if r["themes"][0] not in NON_ISSUE).most_common(6)
            ],
        },
        "voices_with_reach": voices,
        "closure_intent": {
            "count": len(cl),
            "drivers": [{"id": k, "label": T[k]["label"], "count": v} for k, v in collections.Counter(r["themes"][0] for r in cl).most_common(5)],
            "exemplars": cl_ex,
        },
        "cure_watch": {
            "count": len(cw),
            "by_theme": [{"id": k, "label": T[k]["label"], "count": v} for k, v in collections.Counter(r["themes"][0] for r in cw).most_common(5)],
            "exemplars": cw_ex,
        },
        "by_business": [
            {
                "business": b,
                "count": sum(1 for r in bank if r["business"] == b),
                "repeat": sum(1 for r in bank if r["business"] == b and r["repeat_contact"]),
                "escalation": sum(1 for r in bank if r["business"] == b and r["escalation_intent"]),
                "negative": sum(1 for r in bank if r["business"] == b and r["sentiment"] == "negative"),
                # NW-D91: the negative share reads reviews only
                "reviews": sum(1 for r in review_only(bank) if r["business"] == b),
                "review_negative": sum(1 for r in review_only(bank) if r["business"] == b and r["sentiment"] == "negative"),
            }
            for b, _ in collections.Counter(r["business"] for r in bank).most_common()
        ],
    }

    # ------------------------------------------------------------ app pulse
    def rsum(rs):
        n = len(rs)
        c = collections.Counter(str(r["rating"]) for r in rs)
        return {
            "n": n,
            "ratings": {k: c.get(k, 0) for k in "12345"},
            "avg_rating": round(sum(r["rating"] for r in rs) / n, 2) if n else None,
            "share_positive": pct(sum(1 for r in rs if r["rating"] >= 4), n),
            "share_negative": pct(sum(1 for r in rs if r["rating"] <= 2), n),
        }

    reviews = [r for r in bank if r["source"] in ("playstore", "appstore")]
    apps = []
    app_names = sorted({r["app_name"] for r in reviews})
    for app in app_names:
        rs = [r for r in reviews if r["app_name"] == app]
        entity = rs[0]["entity"]
        neg = [r for r in rs if r["rating"] <= 2]
        issues = collections.Counter(t for r in neg for t in r["themes"][:1] if t not in NON_ISSUE)
        top_issues = []
        for tid, n in issues.most_common(5):
            ex = pick_exemplars([r for r in neg if r["themes"][0] == tid], 3)
            evidence_ids.update(ex)
            top_issues.append({"id": tid, "label": T[tid]["label"], "count": n, "exemplars": ex})
        vers = collections.defaultdict(list)
        for r in rs:
            if r["app_version"]:
                vers[r["app_version"]].append(r)
        fix = []
        for tid, n in issues.most_common(8):
            trs = [r for r in neg if r["themes"][0] == tid]
            vs = sorted({r["app_version"] for r in trs if r["app_version"]}, key=lambda v: [int(p) if p.isdigit() else 0 for p in v.split(".")])
            asks = [a for a, _ in collections.Counter(r["feature_request"] for r in rs if r["feature_request"] and tid in r["themes"]).most_common(4)]
            ex = pick_exemplars(trs, 3)
            evidence_ids.update(ex)
            fix.append(
                {"issue": T[tid]["label"], "theme": tid, "count": n, "owner": T[tid]["owner"],
                 "first_seen_version": vs[0] if vs else None, "latest_version_seen": vs[-1] if vs else None,
                 "example_ids": ex, "feature_asks": asks}
            )
        praise = pick_exemplars([r for r in rs if r["rating"] >= 4 and len((r["text"] or "").split()) >= 6], 3, prefer_negative=False)
        evidence_ids.update(praise)
        wk = collections.defaultdict(list)
        for r in rs:
            wk[monday(r["created_at"])].append(r["rating"])
        app_streams = [s for s in sinfo if s["stream"].endswith(f":{app}")]
        apps.append(
            {
                "app": app,
                "entity": entity,
                "group_company": entity != RETAIL_ENTITY,
                "business": rs[0]["business_hint"],
                "streams": app_streams,
                "mode": "trend_within_window",
                # Count only: ratings and shares are never pooled across stores (B7 §4.1, follow-up fix 2).
                "window": {"n": len(rs)},
                # One store at a time (B7 §4.1): screens compare apps within a store, never across stores.
                "by_store": {st: rsum([r for r in rs if r["source"] == st]) for st in ("playstore", "appstore") if any(r["source"] == st for r in rs)},
                "baseline": None,
                "trend": halves(rs, [r for r in reviews if stream_of(r) in basis], basis),
                "top_issues": top_issues,
                "versions_by_store": {
                    st: sorted(
                        [
                            {"version": v, **rsum(y)}
                            for v, x in vers.items()
                            if len(y := [r for r in x if r["source"] == st]) >= 10
                        ],
                        key=lambda v: [int(p) if p.isdigit() else 0 for p in v["version"].split(".")],
                        reverse=True,
                    )
                    for st in ("playstore", "appstore")
                    if any(r["source"] == st for r in rs)
                },
                "praise_exemplars": praise,
                "fix_list": fix,
            }
        )
    pulse = {"apps": apps, "note": "Ratings are counted in the window (22 October to 17 November)."}

    # ------------------------------------------------------------ mood
    mood = {
        "definition": (
            "Mood index, from app-store and Trustpilot reviews: net sentiment, (positive − negative) ÷ reviews × 100, over "
            "the last 7 days, compared with the window average (22 October to 17 November 2026). X and Reddit are not in it "
            "(their sentiment is indicative only). The three review sources are pooled (about forty reviews in the window): "
            "20 or more reviews give a figure, 3 to 19 a figure marked indicative, fewer than 3 none. Range −100 to +100."
        ),
        # SW-D11: App Store (from 2 Nov), Google Play (from 23 Oct) and Trustpilot (from 27 Oct), pooled.
        **M.mood(review_only(bank), {}, pooled=True),
        "sources_label": "from app-store and Trustpilot reviews",
        "baseline_label": "vs window average (22 Oct–17 Nov); no earlier baseline",
    }

    # ------------------------------------------------------------ release pulse (Swedbank privat app)
    app_rs = [r for r in reviews if r["app_name"] == BANK_APP]
    app_neg = [r for r in app_rs if r["rating"] <= 2]
    bank_app = next((a for a in apps if a["app"] == BANK_APP), None)
    new_v = [r for r in app_rs if (r["app_version"] or "").startswith(NEW_VERSION)]

    def release_store(st):
        """Release figures within one store (follow-up fix 2): version 11 against earlier versions."""
        x = [r for r in app_rs if r["source"] == st]
        nv = [r for r in x if (r["app_version"] or "").startswith(NEW_VERSION)]
        ov = [r for r in x if r["app_version"] and not r["app_version"].startswith(NEW_VERSION)]
        avg = lambda v: round(sum(r["rating"] for r in v) / len(v), 2) if v else None  # noqa: E731
        pos = lambda v: pct(sum(1 for r in v if r["rating"] >= 4), len(v))  # noqa: E731
        return {
            "store": st, "store_label": SOURCE_LABEL[st], "n_reviews": len(x),
            "share_positive": pos(x), "avg_rating": avg(x),
            "new_app_n": len(nv), "new_app_avg": avg(nv), "new_app_share_positive": pos(nv),
            "new_app_negative": sum(1 for r in nv if r["rating"] <= 2),
            "old_app_n": len(ov), "old_app_avg": avg(ov), "old_app_share_positive": pos(ov),
        }

    largest_other = max((t["count"] for t in theme_rows if t["id"] not in NON_ISSUE), default=0)
    rp_ex = pick_exemplars(app_neg, 5)
    evidence_ids.update(rp_ex)
    # No release pulse without a United Kingdom store series to support it (brief Step 5, removed list).
    release = None if bank_app is None else {
        "id": "release-pulse",
        "label": "Release pulse: the fix list customers have written",
        "app": BANK_APP, "owner": "digital", "owner_label": OWNER_LABEL["digital"], "pillar": "products_services", "rung": "Voice",
        "action": "Route with evidence", "status": "needs_you",
        "count": len(app_neg), "n_reviews": len(app_rs),
        "ranks_top": len(app_neg) >= largest_other,
        "largest_other_theme": largest_other,
        # The latest version (8.4) on its own, so "the new app" is never an all-version figure (review #12).
        # Counts add across stores; ratings and shares are per store only (follow-up fix 2).
        "new_app_n": len(new_v),
        "new_app_negative": sum(1 for r in new_v if r["rating"] <= 2),
        "by_store": {st: release_store(st) for st in ("playstore", "appstore")},
        "fix_list": bank_app["fix_list"],
        "versions_by_store": bank_app["versions_by_store"],
        "exemplars": rp_ex,
        "praise_exemplars": bank_app["praise_exemplars"],
        "daily_negative": [{"date": d, "count": c} for d, c in sorted(collections.Counter(r["created_at"][:10] for r in app_neg).items())],
        "coverage": [f"{s['stream'].split(':')[0].replace('playstore', 'Google Play').replace('appstore', 'App Store')} {s['earliest']} to {s['latest']}" for s in bank_app["streams"]],
        "trend_label": "trend within window",
    }

    # ------------------------------------------------------------ briefing
    since = [r for r in bank if r["created_at"] >= SINCE_830]
    since_c = collections.Counter(r["themes"][0] for r in since if r["themes"][0] not in NON_ISSUE)
    since_830 = []
    for tid, n in since_c.most_common(3):
        ex = pick_exemplars([r for r in since if r["themes"][0] == tid], 2)
        evidence_ids.update(ex)
        since_830.append({"theme": tid, "label": T[tid]["label"], "count": n, "owner": T[tid]["owner"], "owner_label": T[tid]["owner_label"], "exemplars": ex})
    routing = []
    for owner in ("digital", "cards", "cx", "operations", "payments", "loans", "retail", "compliance", "fraud_cyber", "rm", "product"):
        ts = sorted([t for t in theme_rows if t["owner"] == owner and t["id"] not in NON_ISSUE], key=lambda t: -t["count"])
        if ts:
            routing.append(
                {"owner": owner, "owner_label": OWNER_LABEL[owner],
                 "themes": [{"id": t["id"], "label": t["label"], "count": t["count"], "status": t["status"]} for t in ts[:3]],
                 "total": sum(t["count"] for t in ts)}
            )
    needs = [t["id"] for t in theme_rows if t["status"] == "needs_you"]
    briefing = {
        "needs_you": (["release-pulse"] if release and release["ranks_top"] else []) + needs,
        "this_week": [t["id"] for t in sorted(theme_rows, key=lambda t: -t["score"]) if t["status"] == "this_week"],
        "improving": [t["id"] for t in theme_rows if t["status"] == "improving"],
        "since_830": since_830,
        "since_830_total": len(since),
        "since_830_from": SINCE_830,
        "top_riser": ranked[0]["id"] if ranked else None,
        "routing": routing,
        "release_pulse": release,
        "ranking_rule": "score = rise in share (second half vs first half) × volume × (1 + escalation share); issue themes with at least 8 items and at least 40% negative.",
    }

    # ------------------------------------------------------------ responses (Play Store replies)
    ps = [r for r in reviews if r["source"] == "playstore" and r["entity"] == RETAIL_ENTITY]

    by_app = {}
    for app in sorted({r["app_name"] for r in ps}):
        by_app[app] = resp_stats([r for r in ps if r["app_name"] == app])
    neg_ps = [r for r in ps if r["rating"] <= 2]
    responses = {
        "provenance": "public",
        "definition": "A store review is responded when the bank has posted a reply on it; open too long when there is still no reply 48 hours after it was posted. A redirect-only reply sends the customer elsewhere (email, call, DM, branch) rather than answering.",
        "replies_available": True,
        "scope_note": "Bank replies are counted where the source carries them.",
        "reviews_in_scope": len(ps),
        "all": resp_stats(ps),
        "negative": resp_stats(neg_ps),
        "by_app": by_app,
        "responded": len([r for r in ps if r["reply"]]),
        "open_too_long": resp_stats(ps)["open_too_long"],
        "pending_note": "",
    }

    # ------------------------------------------------------------ meta
    meta = {
        "generated_by": "scripts/swedbank_pulse/aggregate.py",
        "as_of": AS_OF,
        "brief_date": BRIEF["date"],
        "brief_label": BRIEF["label"],
        "brief_time": BRIEF["time"],
        "window": {"start": W_START, "end": W_END},
        "provenance": {"public": "Public · live", "internal": "Internal", "joined": "Joined · needs bank systems"},
        "scope_note": "Retail figures: Swedbank Swedish Banking, private customers, on-topic items in the window. Baltic Banking, Sparbankerna, Swedbank Pay and other group companies are excluded.",
        "data_freeze": "2026-11-17T06:45:00+00:00",
        "freeze_label": "17 Nov 2026 07:45 CET",
        "sources": json.loads((OUT / "sources.json").read_text(encoding="utf-8"))["sources"],
        "public_loaded": len(bank) > 0,
        # Theme names for the signal pages while no public theme exists yet (NW-D29).
        "theme_labels": {t["id"]: t["label"] for t in THEMES},
        "records": {
            "total": len(rows),
            "by_source": dict(collections.Counter(r["source"] for r in rows)),
            "window": len(win),
            "bank_on_topic_window": len(bank),
            "group_on_topic_window": len(group),
            "classified_by": dict(collections.Counter(r["classified_by"] for r in rows)),
        },
        "bank_by_source": dict(collections.Counter(r["source"] for r in bank)),
        "streams": sinfo,
        "trend_basis_streams": sorted(basis),
        "baseline_streams": [],
        "coverage_notes": [
            f"{x['label']}: not loaded" for x in json.loads((OUT / "sources.json").read_text(encoding="utf-8"))["sources"] if not x["loaded"]
        ] or ["Trends and mood are source-weighted; one store per rating comparison."],
        "competitor_available": False,  # no competitor data in the public layer
    }

    # ------------------------------------------------------------ evidence
    for t in theme_rows:
        evidence_ids.update(t["exemplars"])
    idx = {r["id"]: r for r in rows}
    evidence = {}
    for eid in sorted(evidence_ids):
        r = idx.get(eid)
        if not r:
            continue
        evidence[eid] = {
            "id": eid, "source": r["source"], "source_label": SOURCE_LABEL[r["source"]],
            "place": place_label(r), "created_at": r["created_at"],
            # No source url in any page payload (HL-03); it stays in work/ (gitignored) for audit.
            "summary": r["summary"], "redacted_text": clip(r["text"] or "", 700), "title": r.get("title"),
            "app_name": r.get("app_name"), "app_version": r.get("app_version"), "rating": r.get("rating"),
            "themes": r["themes"], "sentiment": r["sentiment"], "owner": r["owner"], "entity": r["entity"],
            "product": r.get("product"),
            # SW-D11 contract with the screens: the Swedish original (summary) with its language and an English gloss
            # (null when the original is English).
            "lang": r.get("lang") or "sv", "gloss": r.get("gloss") if (r.get("lang") or "sv") != "en" else None,
        }
        if evidence[eid]["lang"] != "en" and not evidence[eid]["gloss"]:
            raise SystemExit(f"aggregate: evidence {eid} has no English gloss")

    for name, obj in (
        ("themes.json", themes_file), ("signals.json", signals), ("app_pulse.json", pulse), ("mood.json", mood),
        ("briefing.json", briefing), ("meta.json", meta), ("evidence.json", evidence), ("responses.json", responses),
    ):
        with open(OUT / name, "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=1)
            f.write("\n")
    print("bank on-topic", len(bank), "basis", len(basis_bank), "evidence", len(evidence))
    print("needs_you", briefing["needs_you"], "this_week", briefing["this_week"])
    print("mood", mood["value"], mood["window_average"], mood["delta_pts"])
    print("responses", json.dumps(responses["all"]), json.dumps(responses["negative"]))
    if release:
        print("release", release["count"], release["n_reviews"], release["ranks_top"], release["by_store"]["playstore"]["new_app_avg"], release["by_store"]["playstore"]["old_app_avg"])


if __name__ == "__main__":
    main()
