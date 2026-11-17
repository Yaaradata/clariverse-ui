"""Source-stratified method for trends, weekly series and mood (copied pipeline, Swedbank window).

Collection, not customers, can move a figure: a burst or a gap in one source changes that source's own share, not its
weight. So every trend and weekly series is source-weighted: a share is computed inside each stream, then streams are
combined with fixed weights equal to their share of trend-basis items over the whole window. A stream is trend basis
only when it covers the whole window (X, Reddit and Google Play here; the App Store starts on 2 Nov and Trustpilot on
27 Oct).

Mood (SW-D11): review sources only (NW-D91), pooled across the three stores, because there are about forty reviews in
the window. n-rules: 20 or more reviews give a figure; 3 to 19 give a figure marked indicative; fewer than 3 give none.
"""

from __future__ import annotations

import collections
import datetime as dt

W_START, W_END = "2026-10-22", "2026-11-17"
H1_END = "2026-11-03"
MIN_SHARE_N = 20  # reviews for a share
MIN_INDICATIVE_N = 3  # items for an indicative figure; below this "—"

# Streams whose collection does not span the window by design, whatever their first and last dates say.
PARTIAL_BY_DESIGN: dict[str, str] = {}


def stream_of(r) -> str:
    if r["source"] in ("playstore", "appstore"):
        return f"{r['source']}:{r['app_name']}"
    return r["source"]


def n_rule(n: int) -> str:
    """"share" (n >= 20), "indicative" (3..19) or "none" (< 3)."""
    return "share" if n >= MIN_SHARE_N else "indicative" if n >= MIN_INDICATIVE_N else "none"


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


def _by_stream(rows, key=None):
    key = key or stream_of
    out = collections.defaultdict(list)
    for r in rows:
        out[key(r)].append(r)
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
        "second_half_dates": f"2026-11-04 to {W_END}",
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


def strat_net(rows, w, min_items: int = 10, key=None) -> float | None:
    """Source-weighted net sentiment: each stream's net, weighted by its window share (streams with ≥ min_items)."""
    num = den = 0.0
    for s, rs in _by_stream(rows, key).items():
        if s in w and len(rs) >= min_items:
            num += w[s] * _net(rs)
            den += w[s]
    return num / den if den else None


def mood(basis_rows, w, pooled: bool = False) -> dict:
    """Mood: net sentiment over the last seven days vs the window average, plus the unweighted figures and a per-source
    breakdown. pooled=True (SW-D11) treats the review sources as one stream and applies the n-rules (MIN_INDICATIVE_N)."""
    key = (lambda r: "reviews") if pooled else None
    if pooled:
        w = {"reviews": 1.0}
    mn = MIN_INDICATIVE_N if pooled else 10
    sn = lambda rows: strat_net(rows, w, mn, key)  # noqa: E731
    r1 = lambda x: round(x, 1) if x is not None else None  # noqa: E731
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
            "net_7d": r1(sn(last7)), "net_7d_unweighted": r1(_net(last7)),
        })
    last7 = [r for dd in days[-7:] for r in by_day[dd]]
    value, avg = sn(last7), sn(basis_rows)
    raw_value, raw_avg = _net(last7), _net(basis_rows)
    sources = collections.defaultdict(list)
    for r in basis_rows:
        sources[r["source"]].append(r)
    by_source = []
    for src, rs in sorted(sources.items(), key=lambda kv: -len(kv[1])):
        l7 = [r for r in rs if r["created_at"][:10] in set(days[-7:])]
        wn, ln = _net(rs), _net(l7) if len(l7) >= mn else None
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
        v = sn(rs)
        weekly.append({"week": wk, "n": len(rs), "net": round(v, 1) if v is not None else None,
                       "net_unweighted": round(_net(rs), 1) if rs else None})
    d1 = lambda a, b: round(a - b, 1) if a is not None and b is not None else None  # noqa: E731
    return {
        "method": "source_weighted",
        "weekly": weekly,
        "value": r1(value),
        "window_average": r1(avg),
        "delta_pts": d1(value, avg),
        "unweighted": {"value": r1(raw_value), "window_average": r1(raw_avg), "delta_pts": d1(raw_value, raw_avg)},
        "by_source": by_source,
        "n_items": len(basis_rows),
        "n_last7": len(last7),
        "n_rule": n_rule(len(last7)),
        "n_rule_window": n_rule(len(basis_rows)),
        "pooled": pooled,
        "daily": daily,
    }
