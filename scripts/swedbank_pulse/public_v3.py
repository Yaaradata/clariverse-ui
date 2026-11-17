"""Public layer for the screens (SW-D11): pulse-by-product rows and per-store series, tagged Public · live.

Reads data/out/swedbank_pulse/work/classified.jsonl and writes:
  data/out/swedbank_pulse/products.json      pulse-by-product rows, one product per item
  data/out/swedbank_pulse/store_series.json  per-store weekly ratings for the Swedbank privat app (one store at a time)

Product routing is total (SW-D15 point 9): each retail on-topic item carries exactly one product from the checked-in
labels (classify.py): the six products of common.PRODUCTS or nina_digital (the Nina module, a channel row, never a card).
product_of() returns that product; for an item without one it applies the same Swedish routing table as classify.py
(brief Step 4). An item that routes nowhere is an error, never a silent drop.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PRODUCT_LABEL, PRODUCTS, dump  # noqa: E402
import aggregate as A  # noqa: E402  (reply statistics, one definition)
import method as M  # noqa: E402  (source-weighted trends)
from classify import ROUTED, product_by_rule  # noqa: E402
from normalise import RETAIL_ENTITY  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "out" / "swedbank_pulse"
W_START, W_END, H1_END = "2026-10-22", "2026-11-17", "2026-11-03"
NON_ISSUE = {"app_praise", "service_praise", "product_advice", "offers_deals", "market_news", "other", "general_dissatisfaction"}
REVIEW_SOURCES = ("appstore", "playstore", "trustpilot")
BANK_APP = "Swedbank privat"


def load():
    rows = [json.loads(line) for line in open(OUT / "work" / "classified.jsonl", encoding="utf-8")]
    return [r for r in rows if W_START <= r["created_at"][:10] <= W_END and r["relevant"] == "on_topic" and r["entity"] == RETAIL_ENTITY]


def product_of(r) -> str | None:
    """One of the six products or "nina_digital" for a retail item; None for an item outside retail scope."""
    if r.get("entity") != RETAIL_ENTITY or r.get("business") == "group_company":
        return None
    p = r.get("product")
    if p in ROUTED:
        return p
    p = product_by_rule(f"{r.get('title') or ''} {r.get('text') or ''}".lower())
    if p not in ROUTED:
        raise ValueError(f"unrouted public item {r.get('id')}")
    return p


def build_products(rows, basis) -> dict:
    meta = json.load(open(OUT / "meta.json", encoding="utf-8"))
    labels = {t["id"]: t["label"] for t in json.load(open(OUT / "themes.json", encoding="utf-8"))["themes"]}
    by = collections.defaultdict(list)
    excluded = collections.Counter()
    for r in rows:
        p = product_of(r)
        if p is None:
            raise SystemExit(f"public_v3: unrouted on-topic item {r['id']}")
        by[p].append(r)
        if p not in PRODUCT_LABEL:
            excluded[p] += 1  # nina_digital: the Nina module, not a product card
    basis_all = [r for r in rows if r["_stream"] in basis]
    weights = M.weights(basis_all)
    out = []
    for p in PRODUCTS:
        rs = by.get(p["id"], [])
        tr = M.halves(rs, basis_all, weights, min_per_half=15)
        f, s, change = tr["first_half"], tr["second_half"], tr["change_pct"]
        issues = collections.defaultdict(lambda: {"count": 0, "negative": 0, "escalation": 0})
        for r in rs:
            for t in r["themes"]:
                if t in NON_ISSUE:
                    continue
                issues[t]["count"] += 1
                issues[t]["negative"] += r["sentiment"] == "negative"
                issues[t]["escalation"] += bool(r["escalation_intent"])
        ranked = sorted(issues.items(), key=lambda kv: (-kv[1]["negative"], -kv[1]["count"]))
        neg = sum(1 for r in rs if r["sentiment"] == "negative")
        out.append(
            {
                "id": p["id"],
                "label": p["label"],
                "owner": p["owner"],
                "module": p["module"],
                "count": len(rs),
                "negative": neg,
                "escalation": sum(1 for r in rs if r["escalation_intent"]),
                "repeat": sum(1 for r in rs if r["repeat_contact"]),
                "promise_break_mentions": sum(1 for r in rs if r["promise_break"]),
                # NW-D91: reviews only, pooled across the stores; n-rule (SW-D11): >= 20 a share, 3-19 indicative, < 3 none.
                "reviews": (nrev := sum(1 for r in rs if r["source"] in REVIEW_SOURCES)),
                "share_negative": (round(100 * sum(1 for r in rs if r["source"] in REVIEW_SOURCES and r["sentiment"] == "negative")
                                         / nrev, 1) if nrev >= M.MIN_INDICATIVE_N else None),
                "share_rule": M.n_rule(nrev),
                "social": sum(1 for r in rs if r["source"] in ("x", "reddit")),
                "quotable": sum(1 for r in rs if A.quotable(r)),
                "trend_change_pct": change,
                "trend_basis": {"first_half": f, "second_half": s, "first_share": tr["first_share"], "second_share": tr["second_share"]},
                "top_issue": {"id": ranked[0][0], "label": labels[ranked[0][0]], "negative": ranked[0][1]["negative"]} if ranked else None,
                "issues": [{"id": k, "label": labels[k], **v} for k, v in ranked],
                "by_source": dict(collections.Counter(r["source"] for r in rs)),
                # Bank replies on this product's Play Store reviews (review finding #16); None when it has none.
                "replies": A.resp_stats(ps) if (ps := [r for r in rs if r["source"] == "playstore"]) else None,
            }
        )
    total_rows = sum(r["count"] for r in out)
    return {
        "provenance": "public",
        "scope": "swedbank · on_topic · window",
        "note": (
            "Each retail on-topic public item is routed to exactly one product (or to the Nina module) from what it is "
            "about. Row totals count each item once; issue lists count theme tags (an item can carry up to three). "
            "Baltic Banking, Sparbankerna, Swedbank Pay, business customers and investor or corporate news are outside "
            "the table and outside every count."
        ),
        "rows": out,
        "excluded": dict(excluded),
        "total_rows": total_rows,
        "total_items": meta["records"]["bank_on_topic_window"],
        "nina_digital": len(by.get("nina_digital", [])),
        "routing": {p: len(by.get(p, [])) for p in ROUTED},
        "reconciles": total_rows + sum(excluded.values()) == meta["records"]["bank_on_topic_window"] == len(rows),
        "trend_rule": (
            "Source-weighted share of trend-basis items, second half (4–17 Nov) vs first half (22 Oct–3 Nov): each "
            "source's share counts in proportion to its share of the window. Shown only when both halves have at "
            "least 15 items."
        ),
        "labels": PRODUCT_LABEL,
    }


def monday(d: str) -> str:
    x = dt.date.fromisoformat(d[:10])
    return (x - dt.timedelta(days=x.weekday())).isoformat()


def summarise(rs):
    n = len(rs)
    return {
        "n": n,
        "avg_rating": round(sum(r["rating"] for r in rs) / n, 2) if n else None,
        "share_negative": round(100 * sum(1 for r in rs if r["rating"] <= 2) / n, 1) if n else None,
        "share_positive": round(100 * sum(1 for r in rs if r["rating"] >= 4) / n, 1) if n else None,
    }


def vkey(v: str):
    return [int(p) if p.isdigit() else 0 for p in v.split(".")]


def build_store_series() -> dict:
    allrows = [json.loads(line) for line in open(OUT / "work" / "classified.jsonl", encoding="utf-8")]
    apps = []
    for app in (BANK_APP,):
        entry = {"app": app, "stores": []}
        for store, label in (("appstore", "App Store"), ("playstore", "Google Play")):
            rs = [r for r in allrows if r["source"] == store and r["app_name"] == app and r["entity"] == RETAIL_ENTITY and r["relevant"] == "on_topic"]
            if not rs:
                continue
            start = min(r["created_at"][:10] for r in rs)
            win = [r for r in rs if W_START <= r["created_at"][:10] <= W_END]
            weeks = collections.defaultdict(list)
            for r in win:
                weeks[monday(r["created_at"])].append(r)
            versions = collections.defaultdict(list)
            major = collections.defaultdict(list)
            for r in win:
                if r["app_version"]:
                    versions[r["app_version"]].append(r)
                    major[r["app_version"].split(".")[0]].append(r)
            first = [r for r in win if r["created_at"][:10] <= H1_END]
            second = [r for r in win if r["created_at"][:10] > H1_END]
            entry["stores"].append(
                {
                    "store": store,
                    "store_label": label,
                    "records": len(rs),
                    "export_start": start,
                    "export_end": max(r["created_at"][:10] for r in rs),
                    "starts_mid_window": start > "2026-10-24",
                    "window": summarise(win),
                    "halves": {"first": summarise(first), "second": summarise(second), "comparable": start <= "2026-10-24" and len(first) >= 15 and len(second) >= 15},
                    "weekly": [{"week": w, **summarise(v)} for w, v in sorted(weeks.items())],
                    "versions": sorted([{"version": v, **summarise(x)} for v, x in versions.items() if len(x) >= 10], key=lambda v: vkey(v["version"]), reverse=True),
                    "by_major": {k: summarise(v) for k, v in sorted(major.items(), key=lambda kv: -int(kv[0]) if kv[0].isdigit() else 0) if len(v) >= 10},
                    "replies": sum(1 for r in win if r.get("reply")),
                }
            )
        apps.append(entry)
    return {
        "provenance": "public",
        "rule": "Ratings are compared within one store only. Each weekly series starts at that store's first exported review; weeks before it are not plotted. Negative = 1–2★, positive = 4–5★.",
        "apps": apps,
    }


stream_of = M.stream_of


def main():
    rows = load()
    for r in rows:
        r["_stream"] = stream_of(r)
    basis = set(json.load(open(OUT / "meta.json", encoding="utf-8"))["trend_basis_streams"])
    products = build_products(rows, basis)
    dump(products, OUT / "products.json")
    dump(build_store_series(), OUT / "store_series.json")
    print("products reconcile:", products["reconciles"], products["total_rows"], products["routing"])
    if not products["reconciles"]:
        raise SystemExit("public_v3: product rows do not reconcile with the on-topic total")
    for r in products["rows"]:
        print(f"  {r['label']:32} {r['count']:5} neg {r['negative']:5} esc {r['escalation']:3} trend {r['trend_change_pct']} top {r['top_issue'] and r['top_issue']['label']}")


if __name__ == "__main__":
    main()
