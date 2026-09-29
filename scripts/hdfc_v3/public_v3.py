"""V3 public layer (B7 §2 T2, §4 method fixes), built on the classified Jul–Sep data.

Reads data/out/app_jul_sep/work/classified.jsonl (from scripts/hdfc_pipeline/) and writes, tagged Public · live:
  data/out/app_jul_sep/products.json      pulse-by-product rows, one product per item
  data/out/app_jul_sep/store_series.json  per-app, per-store weekly share negative and version ratings (one store at a time)

Product tagging, per item (bank entity, on-topic, in the window):
  cards business → Cards · payments → PayZapp and UPI · loans → Home, Auto and two-wheeler, or Personal loans (by app,
  then keyword; personal by default) · retail banking → Insurance if the item is about a bank-sold policy, Digital if its
  primary theme is an app or NetBanking theme, otherwise Accounts and deposits · wealth, SME and merchant, corporate →
  outside the table (listed separately).
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "hdfc_pipeline"))
from common import PRODUCT_LABEL, PRODUCTS, dump  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "out" / "app_jul_sep"
W_START, W_END, H1_END = "2026-07-01", "2026-09-28", "2026-08-14"
NON_ISSUE = {"app_praise", "service_praise", "product_advice", "offers_deals", "market_news", "other", "general_dissatisfaction"}
DIGITAL_GROUP = {"app_speed_crash", "app_usability", "login_mpin", "device_security_block", "new_app_release", "netbanking", "app_praise"}
HOME = re.compile(r"home ?loan|housing loan|mortgage|property", re.I)
AUTO = re.compile(r"car loan|auto loan|two[- ]wheeler|bike loan|vehicle loan", re.I)
INSURANCE = re.compile(r"insurance|policy|premium|ulip|term plan", re.I)


def load():
    rows = [json.loads(line) for line in open(OUT / "work" / "classified.jsonl", encoding="utf-8")]
    return [r for r in rows if W_START <= r["created_at"][:10] <= W_END and r["relevant"] == "on_topic" and r["entity"] == "hdfc_bank"]


def product_of(r) -> str | None:
    b = r["business"]
    text = f"{r.get('title') or ''} {r.get('text') or ''}"
    if b == "cards":
        return "cards"
    if b == "payments":
        return "payzapp"
    if b == "loans":
        if r.get("app_name") == "Home Loans" or HOME.search(text):
            return "home_loans"
        if AUTO.search(text):
            return "auto_loans"
        return "personal_loans"
    if b == "retail_banking":
        if r["themes"][0] in ("mis_selling", "insurance_group") or (INSURANCE.search(text) and r["themes"][0] in ("mis_selling", "fees_charges_bank", "other", "general_dissatisfaction", "complaint_handling")):
            return "insurance"
        if r["themes"][0] in DIGITAL_GROUP or r.get("app_name") == "HDFC Bank app":
            return "digital"
        return "accounts"
    return None


def build_products(rows, basis) -> dict:
    meta = json.load(open(OUT / "meta.json"))
    labels = {t["id"]: t["label"] for t in json.load(open(OUT / "themes.json"))["themes"]}
    by = collections.defaultdict(list)
    excluded = collections.Counter()
    for r in rows:
        p = product_of(r)
        if p:
            by[p].append(r)
        else:
            excluded[r["business"]] += 1
    basis_all = [r for r in rows if r["_stream"] in basis]
    ft = sum(1 for r in basis_all if r["created_at"][:10] <= H1_END)
    st = len(basis_all) - ft
    out = []
    for p in PRODUCTS:
        rs = by.get(p["id"], [])
        b = [r for r in rs if r["_stream"] in basis]
        f = sum(1 for r in b if r["created_at"][:10] <= H1_END)
        s = len(b) - f
        change = round(100 * ((s / st) - (f / ft)) / (f / ft), 1) if f >= 15 and s >= 15 else None
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
                "share_negative": round(100 * neg / len(rs), 1) if rs else None,
                "trend_change_pct": change,
                "trend_basis": {"first_half": f, "second_half": s},
                "top_issue": {"id": ranked[0][0], "label": labels[ranked[0][0]], "negative": ranked[0][1]["negative"]} if ranked else None,
                "issues": [{"id": k, "label": labels[k], **v} for k, v in ranked],
                "by_source": dict(collections.Counter(r["source"] for r in rs)),
            }
        )
    total_rows = sum(r["count"] for r in out)
    return {
        "provenance": "public",
        "scope": "hdfc_bank · on_topic · window",
        "note": (
            "Each public item is tagged to one product from its business and theme. Loans are split into home, auto "
            "and personal by app and keyword. Row totals count each item once; issue lists count theme tags (an item "
            "can carry up to three). Wealth, SME and merchant, and corporate items are outside the product table."
        ),
        "rows": out,
        "excluded": dict(excluded),
        "total_rows": total_rows,
        "total_items": meta["records"]["bank_on_topic_window"],
        "reconciles": total_rows + sum(excluded.values()) == meta["records"]["bank_on_topic_window"],
        "trend_rule": f"Share of trend-basis items, second half ({'15 Aug'}–28 Sep) vs first half (1 Jul–14 Aug). Shown only when both halves have at least 15 items.",
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
    for app in ("HDFC Bank app", "PayZapp"):
        entry = {"app": app, "stores": []}
        for store, label in (("appstore", "App Store"), ("playstore", "Play Store")):
            rs = [r for r in allrows if r["source"] == store and r["app_name"] == app]
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
                    "starts_mid_window": start > "2026-07-03",
                    "window": summarise(win),
                    "halves": {"first": summarise(first), "second": summarise(second), "comparable": start <= "2026-07-03" and len(first) >= 15 and len(second) >= 15},
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


def stream_of(r) -> str:
    if r["source"] in ("playstore", "appstore"):
        return f"{r['source']}:{r['app_name']}"
    if r["source"] == "forum":
        return f"forum:{r['subreddit']}"
    return r["source"]


def main():
    rows = load()
    for r in rows:
        r["_stream"] = stream_of(r)
    basis = set(json.load(open(OUT / "meta.json"))["trend_basis_streams"])
    products = build_products(rows, basis)
    dump(products, OUT / "products.json")
    dump(build_store_series(), OUT / "store_series.json")
    print("products reconcile:", products["reconciles"], products["total_rows"], products["excluded"])
    for r in products["rows"]:
        print(f"  {r['label']:32} {r['count']:5} neg {r['negative']:5} esc {r['escalation']:3} trend {r['trend_change_pct']} top {r['top_issue'] and r['top_issue']['label']}")


if __name__ == "__main__":
    main()
