"""V3 public layer (B7 §2 T2, §4 method fixes).

Outputs, all tagged Public · live:
  data/out/app/products.json      the "pulse by product" rows, allocated from classified theme × business counts
  data/out/app/store_series.json  per-app, per-store weekly share negative and version ratings (one store at a time)
  data/out/app/responses.json     public "responded" and "open too long", from developer replies when the crawl has them

Rules:
  * Every product count is an integer allocation of a theme's own count (largest remainder), so the product rows plus
    the excluded businesses reconcile exactly to the on-topic total in themes.json.
  * Loans are split into personal, home and auto using the loan apps (Home Loans → home, Loan Assist → personal) and
    keyword matches in social and forum posts. The split is approximate and says so on screen.
  * Store series are never mixed across stores, and each series starts at that store's first review in the export.
"""

from __future__ import annotations

import collections
import datetime as dt
import glob
import json
import math
import re

from common import (
    NON_ISSUE_THEMES,
    OUT_APP,
    PRODUCT_LABEL,
    PRODUCTS,
    RAW,
    WINDOW,
    dump,
    load,
)

LOAN_PATTERNS = {
    "home_loans": r"home ?loan|housing loan|home loans app",
    "auto_loans": r"car loan|auto loan|two[- ]wheeler|bike loan|vehicle loan",
    "personal_loans": r"personal loan|\bPL\b|instant loan|xpress|loan assist",
}


def largest_remainder(total: int, weights: dict[str, float]) -> dict[str, int]:
    s = sum(weights.values())
    if total == 0 or s == 0:
        return {k: 0 for k in weights}
    raw = {k: total * w / s for k, w in weights.items()}
    base = {k: math.floor(v) for k, v in raw.items()}
    left = total - sum(base.values())
    for k in sorted(raw, key=lambda k: raw[k] - base[k], reverse=True)[:left]:
        base[k] += 1
    return base


def in_window(iso: str) -> bool:
    return WINDOW[0] <= iso[:10] <= WINDOW[1]


def loan_split() -> tuple[dict[str, float], dict[str, int]]:
    counts: collections.Counter[str] = collections.Counter()
    rows = [json.loads(line) for line in open(RAW / "social" / "hdfc_all.jsonl", encoding="utf-8")]
    rows += [json.loads(line) for line in open(RAW / "forums" / "hdfc_forums.jsonl", encoding="utf-8")]
    for r in rows:
        if not in_window(r["created_at"]):
            continue
        text = f"{r.get('text') or ''} {r.get('title') or ''}"
        for k, p in LOAN_PATTERNS.items():
            if re.search(p, text, re.I):
                counts[k] += 1
    pulse = load(OUT_APP / "app_pulse.json")
    for a in pulse["apps"]:
        n = (a.get("window") or {}).get("n") or 0
        if a["app"] == "Home Loans":
            counts["home_loans"] += n
        elif a["app"] == "Loan Assist":
            counts["personal_loans"] += n
    total = sum(counts.values()) or 1
    return {k: counts[k] / total for k in LOAN_PATTERNS}, dict(counts)


def product_of(theme: dict, business: str) -> str | None:
    if business == "cards":
        return "cards"
    if business == "payments":
        return "payzapp"
    if business == "loans":
        return "loans"
    if business == "retail_banking":
        return "digital" if theme["group"] == "App and digital" else "accounts"
    return None  # wealth, SME and merchant, corporate, group companies: outside the product table


def build_products() -> dict:
    themes = load(OUT_APP / "themes.json")
    split, split_counts = loan_split()
    rows = {p["id"]: collections.defaultdict(float) for p in PRODUCTS}
    theme_rows: dict[str, dict[str, dict[str, int]]] = {p["id"]: {} for p in PRODUCTS}
    excluded: collections.Counter[str] = collections.Counter()

    for t in themes["themes"]:
        # Weight of each (product) cell inside this theme, from its business split.
        cell_w: dict[str, float] = collections.defaultdict(float)
        for biz, n in t["by_business"].items():
            prod = product_of(t, biz)
            if prod == "loans":
                for lp, s in split.items():
                    cell_w[lp] += n * s
            elif prod:
                cell_w[prod] += n
            else:
                cell_w[f"x:{biz}"] += n
        count = largest_remainder(t["count"], cell_w)
        neg = largest_remainder(t["sentiment"]["negative"], cell_w)
        esc = largest_remainder(t["escalation_count"], cell_w)
        pb = largest_remainder(t["promise_break_count"], cell_w)
        tot_w = sum(cell_w.values()) or 1
        for cell, n in count.items():
            if cell.startswith("x:"):
                continue
            r = rows[cell]
            r["count"] += n
            r["negative"] += neg[cell]
            r["escalation"] += esc[cell]
            r["promise_break"] += pb[cell]
            share = cell_w[cell] / tot_w
            r["first_half"] += t["trend"]["first_half"] * share
            r["second_half"] += t["trend"]["second_half"] * share
            if t["id"] not in NON_ISSUE_THEMES and n:
                theme_rows[cell][t["id"]] = {"count": n, "negative": neg[cell], "escalation": esc[cell]}

    # Item-level totals (signals.json by_business sums to the on-topic total). Within a business, items are split
    # across products by that business's theme-mention weights, so rows reconcile exactly.
    signals = load(OUT_APP / "signals.json")
    mention_w: dict[str, dict[str, float]] = collections.defaultdict(lambda: collections.defaultdict(float))
    for t in themes["themes"]:
        for biz, n in t["by_business"].items():
            prod = product_of(t, biz)
            if prod == "loans":
                for lp, s in split.items():
                    mention_w[biz][lp] += n * s
            elif prod:
                mention_w[biz][prod] += n
    items = {p["id"]: collections.Counter() for p in PRODUCTS}
    excluded = collections.Counter()
    for b in signals["by_business"]:
        w = mention_w.get(b["business"])
        if not w:
            excluded[b["business"]] += b["count"]
            continue
        for field in ("count", "negative", "escalation", "repeat"):
            for prod, n in largest_remainder(b[field], w).items():
                items[prod][field] += n

    first_total = themes["themes"][0]["trend"]["first_half_total"]
    second_total = themes["themes"][0]["trend"]["second_half_total"]
    label = {t["id"]: t["label"] for t in themes["themes"]}
    out_rows = []
    for p in PRODUCTS:
        r = rows[p["id"]]
        s1 = r["first_half"] / first_total if first_total else 0
        s2 = r["second_half"] / second_total if second_total else 0
        change = round(100 * (s2 - s1) / s1, 1) if s1 and r["first_half"] >= 15 and r["second_half"] >= 15 else None
        issues = sorted(theme_rows[p["id"]].items(), key=lambda kv: -kv[1]["negative"])
        out_rows.append(
            {
                "id": p["id"],
                "label": p["label"],
                "owner": p["owner"],
                "module": p["module"],
                "count": items[p["id"]]["count"],
                "negative": items[p["id"]]["negative"],
                "escalation": items[p["id"]]["escalation"],
                "repeat": items[p["id"]]["repeat"],
                "promise_break_mentions": int(r["promise_break"]),
                "share_negative": (
                    round(100 * items[p["id"]]["negative"] / items[p["id"]]["count"], 1)
                    if items[p["id"]]["count"]
                    else None
                ),
                "trend_change_pct": change,
                "trend_basis": {"first_half": round(r["first_half"]), "second_half": round(r["second_half"])},
                "top_issue": (
                    {"id": issues[0][0], "label": label[issues[0][0]], "negative": issues[0][1]["negative"]}
                    if issues
                    else None
                ),
                "issues": [
                    {"id": k, "label": label[k], **v} for k, v in issues
                ],
            }
        )
    total_rows = sum(r["count"] for r in out_rows)
    return {
        "provenance": "public",
        "scope": "hdfc_bank · on_topic · window",
        "note": (
            "Each theme's items are allocated to products from their business tag. Loans are split into personal, "
            "home and auto by the loan apps and by keyword; the split is approximate. Row totals are item counts (each "
            "item once); issue lists count theme mentions (an item can carry up to three themes). Wealth, SME and "
            "merchant, and corporate items are outside the product table and listed separately."
        ),
        "loan_split": {k: round(100 * v, 1) for k, v in split.items()},
        "loan_split_counts": split_counts,
        "rows": out_rows,
        "excluded": dict(excluded),
        "total_rows": total_rows,
        "total_items": themes["total_items"],
        "reconciles": total_rows + sum(excluded.values()) == themes["total_items"],
        "trend_rule": "Share of trend-basis items, second half vs first half of the window. Shown only when both halves have at least 15 items.",
        "labels": PRODUCT_LABEL,
    }


# ---------------------------------------------------------------- stores

APPS = {
    "HDFC Bank app": {"appstore": "HDFC Bank app - appstore", "playstore": "Playstore- HDFCbankmainapp"},
    "PayZapp": {"appstore": "HDFC PayZapp UPI - appstore", "playstore": "Playstore-payzapp"},
}


def read_store(prefix: str, store: str) -> list[dict]:
    files = glob.glob(str(RAW / "stores" / f"{prefix}*"))
    out = []
    for f in files:
        for r in json.load(open(f, encoding="utf-8")):
            if store == "appstore":
                rv = r["review"]
                out.append(
                    {
                        "date": rv["createdAt"][:10],
                        "rating": int(rv["rating"]),
                        "version": rv.get("appVersion"),
                        "reply": bool(rv.get("developerResponse") or rv.get("response")),
                        "reply_at": (rv.get("developerResponse") or {}).get("modified")
                        if isinstance(rv.get("developerResponse"), dict)
                        else None,
                        "at": rv["createdAt"],
                    }
                )
            else:
                out.append(
                    {
                        "date": r["at"][:10],
                        "rating": int(r["score"]),
                        "version": r.get("appVersion"),
                        "reply": bool(r.get("replyContent")),
                        "reply_at": r.get("repliedAt"),
                        "at": r["at"],
                    }
                )
    return out


def monday(d: str) -> str:
    x = dt.date.fromisoformat(d)
    return (x - dt.timedelta(days=x.weekday())).isoformat()


def summarise(rs: list[dict]) -> dict:
    n = len(rs)
    neg = sum(1 for r in rs if r["rating"] <= 2)
    pos = sum(1 for r in rs if r["rating"] >= 4)
    return {
        "n": n,
        "avg_rating": round(sum(r["rating"] for r in rs) / n, 2) if n else None,
        "share_negative": round(100 * neg / n, 1) if n else None,
        "share_positive": round(100 * pos / n, 1) if n else None,
    }


def build_store_series() -> dict:
    apps = []
    for app, stores in APPS.items():
        entry = {"app": app, "stores": []}
        for store, prefix in stores.items():
            rs = read_store(prefix, store)
            start = min(r["date"] for r in rs)
            weeks = collections.defaultdict(list)
            for r in rs:
                if r["date"] >= "2026-06-08" and r["date"] <= WINDOW[1]:
                    weeks[monday(r["date"])].append(r)
            versions = collections.defaultdict(list)
            for r in rs:
                if in_window(r["date"]) and r["version"]:
                    versions[r["version"]].append(r)
            # Before the window (App Store history): the previous-app comparison, same store only.
            major = collections.defaultdict(list)
            for r in rs:
                if r["version"]:
                    major[r["version"].split(".")[0]].append(r)
            in_win = [r for r in rs if in_window(r["date"])]
            first = [r for r in in_win if r["date"] <= "2026-08-27"]
            second = [r for r in in_win if r["date"] > "2026-08-27"]
            entry["stores"].append(
                {
                    "store": store,
                    "store_label": "App Store" if store == "appstore" else "Play Store",
                    "records": len(rs),
                    "export_start": start,
                    "export_end": max(r["date"] for r in rs),
                    "starts_mid_window": start > WINDOW[0],
                    "window": summarise(in_win),
                    "halves": {
                        "first": summarise(first),
                        "second": summarise(second),
                        "comparable": start <= WINDOW[0] and len(first) >= 15 and len(second) >= 15,
                    },
                    "weekly": [
                        {"week": w, **summarise(v)} for w, v in sorted(weeks.items()) if w >= monday(start)
                    ],
                    "versions": sorted(
                        [{"version": v, **summarise(x)} for v, x in versions.items() if len(x) >= 10],
                        key=lambda v: [int(p) if p.isdigit() else 0 for p in v["version"].split(".")],
                        reverse=True,
                    ),
                    "by_major": {
                        k: summarise(v) for k, v in sorted(major.items()) if len(v) >= 10
                    },
                    "replies": sum(1 for r in rs if r["reply"]),
                }
            )
        apps.append(entry)
    return {
        "provenance": "public",
        "rule": (
            "Ratings are compared within one store only. Each weekly series starts at that store's first exported "
            "review; weeks before it are not plotted. Negative = 1–2★, positive = 4–5★."
        ),
        "apps": apps,
    }


def build_responses(series: dict) -> dict:
    """Public responded / open too long. Needs developer replies (S1 crawl); X replies need a permitted route (S2)."""
    total_reviews = 0
    replied = 0
    for a in series["apps"]:
        for s in a["stores"]:
            total_reviews += s["window"]["n"]
            replied += s["replies"]
    available = replied > 0
    return {
        "provenance": "public",
        "definition": "A public review or post is open too long when it has no bank reply within 48 hours.",
        "replies_available": available,
        "reviews_in_scope": total_reviews,
        "responded": replied if available else None,
        "open_too_long": None,
        "pending_note": (
            "Needs the store re-crawl with developer replies (source S1). The current exports carry no reply field, "
            "and bank-authored X posts were excluded at collection."
        ),
    }


def main():
    products = build_products()
    dump(products, OUT_APP / "products.json")
    series = build_store_series()
    dump(series, OUT_APP / "store_series.json")
    dump(build_responses(series), OUT_APP / "responses.json")
    print("products reconcile:", products["reconciles"], products["total_rows"], products["excluded"])
    for r in products["rows"]:
        print(f"  {r['label']:32} {r['count']:5} neg {r['negative']:5} esc {r['escalation']:3} trend {r['trend_change_pct']}")
    for a in series["apps"]:
        for s in a["stores"]:
            print(a["app"], s["store"], s["export_start"], s["window"], s["halves"]["comparable"], s["by_major"])


if __name__ == "__main__":
    main()
