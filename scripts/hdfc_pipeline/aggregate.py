"""Stage 3 · Aggregate classified items into the files the V2 screens read (B3b stage 5, B4 §6).

Writes to data/out/app_jul_sep/: themes.json, signals.json, app_pulse.json, mood.json, briefing.json, meta.json,
evidence.json, responses.json. Every count is reproducible from work/classified.jsonl.

Window: 1 July – 28 September 2026 (as of 28 September). Trend: share of trend-basis items, second half
(15 Aug – 28 Sep) vs first half (1 Jul – 14 Aug). A stream is trend basis only if it covers the whole window; the
Play Store HDFC Bank app export starts on 25 July, so it counts in totals but not in trends. No baseline: the exports
hold no history before July.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import re
import statistics

from classify import OWNER_BY_RT
from normalise import OUT, WORK
from taxonomy import THEMES

T = {t["id"]: t for t in THEMES}
W_START, W_END = "2026-07-01", "2026-09-28"
H1_END = "2026-08-14"
AS_OF = "2026-09-28"
BRIEF = {"date": "2026-09-29", "label": "Tuesday 29 September 2026", "time": "07:45"}
SINCE_830 = "2026-09-28T08:30:00+05:30"
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
NON_ISSUE = {"app_praise", "service_praise", "product_advice", "offers_deals", "market_news", "other", "general_dissatisfaction", "trading_securities", "insurance_group"}
SOURCE_LABEL = {"playstore": "Play Store", "appstore": "App Store", "x": "X", "reddit": "Reddit", "forum": "Forums"}
OWNER_LABEL = {
    "cx": "CX", "digital": "Digital", "cards": "Cards", "retail": "Retail", "loans": "Loans", "payments": "Payments",
    "compliance": "Compliance", "fraud_cyber": "Fraud and Cyber", "operations": "Operations", "rm": "RM", "product": "Product",
}
RUNG_OF_TARGET = {
    "rbi": "RBI Ombudsman", "rbi_ombudsman": "RBI Ombudsman", "consumer_court": "RBI Ombudsman", "legal": "RBI Ombudsman",
    "ministers": "Public", "grievance": "Grievance", "repeat": "Repeat",
}
REDIRECT_RE = re.compile(
    r"(e-?mail|write to|call|reach|connect|contact|dm|share|visit|chat|raise|mention the ref|reference id|ref id|register a complaint|nearest branch)",
    re.I,
)


def monday(d: str) -> str:
    x = dt.date.fromisoformat(d[:10])
    return (x - dt.timedelta(days=x.weekday())).isoformat()


WEEKS = []
_w = dt.date.fromisoformat(monday(W_START))
while _w.isoformat() <= W_END:
    WEEKS.append(_w.isoformat())
    _w += dt.timedelta(days=7)


def in_window(r) -> bool:
    return W_START <= r["created_at"][:10] <= W_END


def stream_of(r) -> str:
    if r["source"] in ("playstore", "appstore"):
        return f"{r['source']}:{r['app_name']}"
    if r["source"] == "forum":
        return f"forum:{r['subreddit']}"
    return r["source"]


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
                "full_window": earliest <= "2026-07-03" and latest >= "2026-09-24",
                "mode": "trend_within_window",
                "baseline_items": 0,
                "baseline_weeks": 0.0,
            }
        )
    return info


def halves(rows, basis_rows_all, basis):
    """Share of trend-basis items in each half of the window."""
    b = [r for r in rows if stream_of(r) in basis]
    f = sum(1 for r in b if r["created_at"][:10] <= H1_END)
    s = len(b) - f
    ft = sum(1 for r in basis_rows_all if r["created_at"][:10] <= H1_END)
    st = len(basis_rows_all) - ft
    change = None
    if f and ft and st:
        change = round(100 * ((s / st) - (f / ft)) / (f / ft), 1)
    return {
        "mode": "trend_within_window",
        "first_half": f,
        "second_half": s,
        "first_half_total": ft,
        "second_half_total": st,
        "change_pct": change,
        "first_half_dates": f"{W_START} to {H1_END}",
        "second_half_dates": f"2026-08-15 to {W_END}",
    }


def sent_counts(rows):
    c = collections.Counter(r["sentiment"] for r in rows)
    return {"positive": c.get("positive", 0), "neutral": c.get("neutral", 0), "negative": c.get("negative", 0)}


def pick_exemplars(rows, n=5, prefer_negative=True):
    """Exemplars: substantive, negative first, spread across sources, most engaged first."""
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
    bank = [r for r in on if r["entity"] == "hdfc_bank"]
    group = [r for r in on if r["entity"] != "hdfc_bank"]
    sinfo = streams_info([r for r in rows if r["relevant"] == "on_topic"])
    basis = {s["stream"] for s in sinfo if s["full_window"]}
    basis_bank = [r for r in bank if stream_of(r) in basis]
    evidence_ids: set[str] = set()

    # ------------------------------------------------------------ themes
    by_theme = collections.defaultdict(list)
    for r in bank:
        for t in r["themes"]:
            by_theme[t].append(r)
    last_day = max(r["created_at"][:10] for r in bank)
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
                "sentiment": sc,
                "share_negative": pct(sc["negative"], len(rs)),
                "escalation_count": esc,
                "share_escalation": share_esc,
                "repeat_count": sum(1 for r in rs if r["repeat_contact"]),
                "status_seeking_count": sum(1 for r in rs if r["status_seeking"]),
                "promise_break_count": sum(1 for r in rs if r["promise_break"]),
                "closure_intent_count": sum(1 for r in rs if r["closure_intent"]),
                "weekly": weekly([r for r in rs if stream_of(r) in basis]),
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
    for pid, plabel in (("availability", "Availability"), ("experience", "Experience"), ("data_intimacy", "Data intimacy"), ("security", "Security")):
        rs = [r for r in bank if T[r["themes"][0]]["pillar"] == pid]
        sc = sent_counts(rs)

        def net(x):
            return round(100 * (sum(1 for r in x if r["sentiment"] == "positive") - sum(1 for r in x if r["sentiment"] == "negative")) / len(x), 1) if x else None

        b = [r for r in rs if stream_of(r) in basis]
        n1 = net([r for r in b if r["created_at"][:10] <= H1_END])
        n2 = net([r for r in b if r["created_at"][:10] > H1_END])
        tops = collections.Counter(r["themes"][0] for r in rs).most_common(3)
        pillars.append(
            {
                "id": pid, "label": plabel, "count": len(rs), "sentiment": sc, "net_sentiment": net(rs),
                "net_first_half": n1, "net_second_half": n2,
                "net_change_pts": round(n2 - n1, 1) if n1 is not None and n2 is not None else None,
                "top_themes": [{"id": k, "label": T[k]["label"], "count": v} for k, v in tops],
            }
        )
    themes_file = {
        "scope": "hdfc_bank · on_topic · window",
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
            "weekly": weekly(rs),
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
        "note": "Posts naming a move between HDFC Bank and another bank. Counted as mentions, never as confirmed moves.",
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
    public_src = ("x", "reddit", "forum")
    reach = sorted(
        [r for r in bank if r["source"] == "x" and (r["author_followers"] or 0) >= 10000 and r["sentiment"] == "negative"],
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
        "scope": "hdfc_bank · on_topic · window",
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
            {"target": k, "rung": RUNG_OF_TARGET.get(k, "Grievance"), "count": v}
            for k, v in collections.Counter(r["escalation_target"] for r in esc).most_common()
        ],
        "ladder_public": {
            "voice_negative": sum(1 for r in bank if r["sentiment"] == "negative"),
            "repeat": sum(1 for r in bank if r["repeat_contact"]),
            "escalation_language": len(esc),
            "public_posts_with_escalation": sum(1 for r in esc if r["source"] in public_src),
            "rbi_or_ombudsman_mentions": sum(1 for r in esc if r["escalation_target"] in ("rbi", "rbi_ombudsman")),
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

    reviews = [r for r in win if r["source"] in ("playstore", "appstore")]
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
                "group_company": entity != "hdfc_bank",
                "business": rs[0]["business_hint"],
                "streams": app_streams,
                "mode": "trend_within_window",
                "window": rsum(rs),
                "baseline": None,
                "trend": halves(rs, [r for r in reviews if stream_of(r) in basis], basis),
                "weekly_avg_rating": [{"week": w, "n": len(v), "avg_rating": round(sum(v) / len(v), 2)} for w, v in sorted(wk.items())],
                "top_issues": top_issues,
                "versions": sorted(
                    [{"version": v, **rsum(x)} for v, x in vers.items() if len(x) >= 10],
                    key=lambda v: [int(p) if p.isdigit() else 0 for p in v["version"].split(".")],
                    reverse=True,
                ),
                "praise_exemplars": praise,
                "fix_list": fix,
            }
        )
    pulse = {"apps": apps, "note": "Ratings are counted in the window (1 July – 28 September). No baseline: the exports hold no history before July."}

    # ------------------------------------------------------------ mood
    mood_rows = [r for r in basis_bank]
    daily = []
    by_day = collections.defaultdict(list)
    for r in mood_rows:
        by_day[r["created_at"][:10]].append(r)
    days_sorted = sorted(d for d in by_day if W_START <= d <= W_END)
    for i, d in enumerate(days_sorted):
        rs = by_day[d]
        p = sum(1 for r in rs if r["sentiment"] == "positive")
        n = sum(1 for r in rs if r["sentiment"] == "negative")
        last7 = [r for dd in days_sorted[max(0, i - 6): i + 1] for r in by_day[dd]]
        n7 = round(100 * (sum(1 for r in last7 if r["sentiment"] == "positive") - sum(1 for r in last7 if r["sentiment"] == "negative")) / len(last7), 1)
        daily.append({"date": d, "n": len(rs), "positive": p, "negative": n, "net": round(100 * (p - n) / len(rs), 1), "net_7d": n7})
    avg = round(100 * (sum(1 for r in mood_rows if r["sentiment"] == "positive") - sum(1 for r in mood_rows if r["sentiment"] == "negative")) / len(mood_rows), 1)
    mood = {
        "definition": "Mood index: net sentiment, (positive − negative) ÷ on-topic items, × 100, over the last 7 days of public HDFC Bank voice from sources that cover the whole window. Compared with the average across the window (1 July to 28 September 2026). Range −100 to +100.",
        "value": daily[-1]["net_7d"],
        "window_average": avg,
        "delta_pts": round(daily[-1]["net_7d"] - avg, 1),
        "baseline_label": "vs window average (1 Jul–28 Sep); no earlier baseline",
        "n_items": len(mood_rows),
        "daily": daily,
    }

    # ------------------------------------------------------------ release pulse (HDFC Bank app)
    app_rs = [r for r in reviews if r["app_name"] == "HDFC Bank app"]
    app_neg = [r for r in app_rs if r["rating"] <= 2]
    bank_app = next(a for a in apps if a["app"] == "HDFC Bank app")
    new_v = [r for r in app_rs if (r["app_version"] or "").startswith("11")]
    old_v = [r for r in app_rs if r["app_version"] and not r["app_version"].startswith("11")]
    largest_other = max((t["count"] for t in theme_rows if t["id"] not in NON_ISSUE), default=0)
    rp_ex = pick_exemplars(app_neg, 5)
    evidence_ids.update(rp_ex)
    release = {
        "id": "release-pulse",
        "label": "Release pulse: the fix list customers have written",
        "app": "HDFC Bank app", "owner": "digital", "owner_label": "Digital", "pillar": "availability", "rung": "Voice",
        "action": "Route with evidence", "status": "needs_you",
        "count": len(app_neg), "n_reviews": len(app_rs),
        "share_positive": pct(sum(1 for r in app_rs if r["rating"] >= 4), len(app_rs)),
        "avg_rating": round(sum(r["rating"] for r in app_rs) / len(app_rs), 2),
        "ranks_top": len(app_neg) >= largest_other,
        "largest_other_theme": largest_other,
        "old_app_avg": round(sum(r["rating"] for r in old_v) / len(old_v), 2) if old_v else None,
        "old_app_n": len(old_v),
        "new_app_avg": round(sum(r["rating"] for r in new_v) / len(new_v), 2) if new_v else None,
        "new_app_n": len(new_v),
        "fix_list": bank_app["fix_list"],
        "versions": bank_app["versions"],
        "exemplars": rp_ex,
        "praise_exemplars": bank_app["praise_exemplars"],
        "daily_negative": [{"date": d, "count": c} for d, c in sorted(collections.Counter(r["created_at"][:10] for r in app_neg).items())],
        "coverage": [f"{s['stream'].split(':')[0].replace('playstore', 'Play Store').replace('appstore', 'App Store')} {s['earliest']} to {s['latest']}" for s in bank_app["streams"]],
        "trend_label": "trend within window (Play Store export starts 25 July)",
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
        "needs_you": (["release-pulse"] if release["ranks_top"] else []) + needs,
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
    now = dt.datetime(2026, 9, 28, 23, 59, tzinfo=IST)
    ps = [r for r in reviews if r["source"] == "playstore" and r["entity"] == "hdfc_bank"]

    def resp_stats(rs):
        replied = [r for r in rs if r["reply"]]
        hrs = []
        for r in replied:
            if r["reply"]["at"]:
                d = (dt.datetime.fromisoformat(r["reply"]["at"]) - dt.datetime.fromisoformat(r["created_at"])).total_seconds() / 3600
                if d >= 0:
                    hrs.append(d)
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
            "median_reply_hours": round(statistics.median(hrs), 1) if hrs else None,
            "replied_within_48h": sum(1 for x in hrs if x <= 48),
            "redirect_only": len(redirect),
            "redirect_only_pct_of_replied": pct(len(redirect), len(replied)),
        }

    by_app = {}
    for app in sorted({r["app_name"] for r in ps}):
        by_app[app] = resp_stats([r for r in ps if r["app_name"] == app])
    neg_ps = [r for r in ps if r["rating"] <= 2]
    responses = {
        "provenance": "public",
        "definition": "A Play Store review is responded when the bank has posted a reply on it; open too long when there is still no reply 48 hours after it was posted. A redirect-only reply sends the customer elsewhere (email, call, DM, branch) rather than answering.",
        "replies_available": True,
        "scope_note": "Bank replies are visible on Play Store reviews only. App Store exports carry no reply field; bank-authored X posts were not collected.",
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
        "generated_by": "scripts/hdfc_pipeline/aggregate.py",
        "as_of": AS_OF,
        "brief_date": BRIEF["date"],
        "brief_label": BRIEF["label"],
        "brief_time": BRIEF["time"],
        "window": {"start": W_START, "end": W_END},
        "provenance": {"public": "Public · live", "internal": "Internal · illustrative until discovery", "joined": "Joined · needs bank systems"},
        "scope_note": "Bank-wide figures: HDFC Bank only, on-topic items in the window. HDFC Life, HDFC Securities and other group companies are kept in the data and excluded from bank-wide figures.",
        "records": {
            "total": len(rows),
            "by_source": dict(collections.Counter(r["source"] if r["source"] != "forum" else f"forum:{r['subreddit']}" for r in rows)),
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
            "All sources cover 1 July to 28 September 2026; trends compare the two halves of the window (no earlier baseline).",
            "Play Store HDFC Bank app reviews start on 25 July (the export holds the latest 5,000): counted in totals, left out of trends.",
            "X and Reddit are filtered to posts that mention HDFC Bank or its products; bank and brand handles are excluded.",
            "Bank replies are visible on Play Store reviews only.",
            "No competitor data delivered: the competitor strip is hidden.",
        ],
        "icici_available": False,
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
            "id": eid, "source": r["source"], "source_label": SOURCE_LABEL[r["source"]], "created_at": r["created_at"],
            "url": r["url"], "summary": r["summary"], "redacted_text": (r["text"] or "")[:700], "title": r.get("title"),
            "app_name": r.get("app_name"), "app_version": r.get("app_version"), "rating": r.get("rating"),
            "themes": r["themes"], "sentiment": r["sentiment"], "owner": r["owner"], "entity": r["entity"],
        }

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
    print("release", release["count"], release["n_reviews"], release["ranks_top"], release["new_app_avg"], release["old_app_avg"])


if __name__ == "__main__":
    main()
