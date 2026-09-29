"""Source-stratified method for trends, weekly series and mood (review step 5, B7 §1 method fixes, §4.4).

Collection, not customers, moved the old figures:
  - Reddit changed collector on 1 Sep (a new actor run, about four times the comments per post). It is split into two
    streams at that date; neither covers the whole window, so neither is trend basis (the same start-marker rule as the
    Play Store HDFC Bank app export that starts on 25 July).
  - X was collected in weekly capped runs; the 20–27 Sep run hit its 1,000-item cap and has no items on 20–22 Sep, so X
    is 43% of the last seven days against about 15% of the window.
So every trend, weekly series and mood figure is source-weighted: a share (or net sentiment) is computed inside each
stream, then streams are combined with fixed weights equal to their share of trend-basis items over the whole window.
A burst or a gap in one source changes that source's own share, not its weight.
"""

from __future__ import annotations

import collections
import datetime as dt

W_START, W_END = "2026-07-01", "2026-09-28"
H1_END = "2026-08-14"
CAPPED_X_RUN = "WhOLVGQsnVo9H7jHb"
REDDIT_SWITCH = "2026-09-01"


# Streams whose collection does not span the window by design, whatever their first and last dates say.
PARTIAL_BY_DESIGN = {
    "reddit:jul_aug_collector": "Reddit collector replaced on 1 Sep (a few late items trickle in)",
    "reddit:sep_collector": "Reddit's new collector starts on 1 Sep",
}


def stream_of(r) -> str:
    if r["source"] in ("playstore", "appstore"):
        return f"{r['source']}:{r['app_name']}"
    if r["source"] == "forum":
        return f"forum:{r['subreddit']}"
    if r["source"] == "reddit":
        # The September collector is a different instrument; its items never share a series with the earlier ones.
        return "reddit:sep_collector" if r.get("collector") else "reddit:jul_aug_collector"
    return r["source"]


def full_weeks() -> list[str]:
    """Mondays of the weeks that lie wholly inside the window (a one-day last week reads as a collapse)."""
    out = []
    d = dt.date.fromisoformat(W_START)
    d -= dt.timedelta(days=d.weekday())
    end = dt.date.fromisoformat(W_END)
    while d + dt.timedelta(days=6) <= end:
        if d >= dt.date.fromisoformat(W_START) - dt.timedelta(days=6):
            out.append(d.isoformat())
        d += dt.timedelta(days=7)
    return out


def monday(d: str) -> str:
    x = dt.date.fromisoformat(d[:10])
    return (x - dt.timedelta(days=x.weekday())).isoformat()


def weights(basis_rows) -> dict[str, float]:
    c = collections.Counter(stream_of(r) for r in basis_rows)
    n = sum(c.values())
    return {s: v / n for s, v in c.items()} if n else {}


def _by_stream(rows):
    out = collections.defaultdict(list)
    for r in rows:
        out[stream_of(r)].append(r)
    return out


def strat_share(subset_ids: set, basis_rows, w, keep=lambda r: True):
    """Source-weighted share (%) of basis items that are in subset_ids, among basis items where keep(r)."""
    num = den = 0.0
    for s, rs in _by_stream(r for r in basis_rows if keep(r)).items():
        if not rs or s not in w:
            continue
        hit = sum(1 for r in rs if r["id"] in subset_ids)
        num += w[s] * hit / len(rs)
        den += w[s]
    return 100 * num / den if den else None


def halves(rows, basis_rows, w, min_per_half: int = 0) -> dict:
    """Second half vs first half, as source-weighted shares. Raw counts are kept for the ≥15-per-half rule."""
    ids = {r["id"] for r in rows}
    b = [r for r in basis_rows if r["id"] in ids]
    f = sum(1 for r in b if r["created_at"][:10] <= H1_END)
    s = len(b) - f
    sh1 = strat_share(ids, basis_rows, w, lambda r: r["created_at"][:10] <= H1_END)
    sh2 = strat_share(ids, basis_rows, w, lambda r: r["created_at"][:10] > H1_END)
    change = None
    if sh1 and sh2 is not None and f >= max(1, min_per_half) and s >= min_per_half:
        change = round(100 * (sh2 - sh1) / sh1, 1)
    return {
        "mode": "trend_within_window",
        "method": "source_weighted",
        "first_half": f,
        "second_half": s,
        "first_share": round(sh1, 2) if sh1 is not None else None,
        "second_share": round(sh2, 2) if sh2 is not None else None,
        "change_pct": change,
        "first_half_dates": f"{W_START} to {H1_END}",
        "second_half_dates": f"2026-08-15 to {W_END}",
    }


def weekly_share(rows, basis_rows, w) -> list[dict]:
    """Per full week: raw basis count and source-weighted share (%) of basis items."""
    ids = {r["id"] for r in rows}
    out = []
    for wk in full_weeks():
        count = sum(1 for r in basis_rows if r["id"] in ids and monday(r["created_at"]) == wk)
        share = strat_share(ids, basis_rows, w, lambda r, wk=wk: monday(r["created_at"]) == wk)
        out.append({"week": wk, "count": count, "share": round(share, 2) if share is not None else None})
    return out


def _net(rs) -> float | None:
    if not rs:
        return None
    return 100 * (sum(1 for r in rs if r["sentiment"] == "positive") - sum(1 for r in rs if r["sentiment"] == "negative")) / len(rs)


def strat_net(rows, w, min_items: int = 10) -> float | None:
    """Source-weighted net sentiment: each stream's net, weighted by its window share (streams with ≥ min_items)."""
    num = den = 0.0
    for s, rs in _by_stream(rows).items():
        if s in w and len(rs) >= min_items:
            num += w[s] * _net(rs)
            den += w[s]
    return num / den if den else None


def mood(basis_rows, w) -> dict:
    """Mood: source-weighted net sentiment over the last seven days vs the source-weighted window average, plus the
    unweighted figures and a per-source breakdown, so the effect of the method is visible."""
    days = sorted({r["created_at"][:10] for r in basis_rows if W_START <= r["created_at"][:10] <= W_END})
    by_day = collections.defaultdict(list)
    for r in basis_rows:
        by_day[r["created_at"][:10]].append(r)
    daily = []
    for i, d in enumerate(days):
        last7 = [r for dd in days[max(0, i - 6) : i + 1] for r in by_day[dd]]
        rs = by_day[d]
        p = sum(1 for r in rs if r["sentiment"] == "positive")
        n = sum(1 for r in rs if r["sentiment"] == "negative")
        daily.append({
            "date": d, "n": len(rs), "positive": p, "negative": n, "net": round(_net(rs), 1),
            "net_7d": round(strat_net(last7, w), 1), "net_7d_unweighted": round(_net(last7), 1),
        })
    last7 = [r for dd in days[-7:] for r in by_day[dd]]
    value, avg = strat_net(last7, w), strat_net(basis_rows, w)
    raw_value, raw_avg = _net(last7), _net(basis_rows)
    sources = collections.defaultdict(list)
    for r in basis_rows:
        sources[r["source"]].append(r)
    by_source = []
    for src, rs in sorted(sources.items(), key=lambda kv: -len(kv[1])):
        l7 = [r for r in rs if r["created_at"][:10] in set(days[-7:])]
        wn, ln = _net(rs), _net(l7) if len(l7) >= 10 else None
        by_source.append({
            "source": src,
            "weight_pct": round(100 * len(rs) / len(basis_rows), 1),
            "window_net": round(wn, 1),
            "last7_net": round(ln, 1) if ln is not None else None,
            "last7_items": len(l7),
            "last7_share_pct": round(100 * len(l7) / len(last7), 1) if last7 else 0,
            "change_pts": round(ln - wn, 1) if ln is not None else None,
        })
    weekly = []
    for wk in full_weeks():
        rs = [r for r in basis_rows if monday(r["created_at"]) == wk]
        v = strat_net(rs, w)
        weekly.append({"week": wk, "n": len(rs), "net": round(v, 1) if v is not None else None,
                       "net_unweighted": round(_net(rs), 1) if rs else None})
    return {
        "method": "source_weighted",
        "weekly": weekly,
        "value": round(value, 1),
        "window_average": round(avg, 1),
        "delta_pts": round(value - avg, 1),
        "unweighted": {"value": round(raw_value, 1), "window_average": round(raw_avg, 1), "delta_pts": round(raw_value - raw_avg, 1)},
        "by_source": by_source,
        "n_items": len(basis_rows),
        "daily": daily,
    }
