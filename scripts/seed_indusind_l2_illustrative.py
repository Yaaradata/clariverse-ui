"""Illustrative public items (synthetic), for businesses with too few real public reviews to read a theme.

Reviewer decision, 5 Oct 2026 (MORNING_DECISIONS IV-64): rows that read "Not enough public items" are filled with
labelled synthetic items. They are never mixed in silently:
  - source "illustrative", shown as "Illustrative (synthetic)" in every by-source split;
  - every block that includes them carries an inline note with the count and the "Illustrative · synthetic" tag;
  - service themes only. No synthetic allegation, escalation, mis-selling, recovery-conduct, insurance-sales or
    trust item is generated: those stay real-only;
  - from the first Google Play review (10 Aug) to the data freeze, like the real items; fixed seed.

Writes data/seed/indusind_v1/l2_illustrative.jsonl in the same schema as data/processed/indusind_l2/items.jsonl
(no text, hashes only).
"""

import datetime as dt
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "data" / "processed" / "indusind_l2" / "items.jsonl"
OUT = ROOT / "data" / "seed" / "indusind_v1" / "l2_illustrative.jsonl"
SEED = 20261005
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
FREEZE = dt.datetime(2026, 10, 2, 18, 0, tzinfo=IST)

# theme -> (product, topic tags, card category)
THEMES = {
    "vf_emi": ("vehicle_loans", ["fee_change"], None),
    "vf_noc": ("vehicle_loans", ["service_delay"], None),
    "vf_disbursal": ("vehicle_loans", ["service_delay"], None),
    "ml_repayment": ("micro_loans_rural", ["service_delay"], None),
    "ml_app_access": ("micro_loans_rural", ["app_failure"], None),
    "pl_preapproved": ("personal_loans", ["app_failure"], None),
    "pl_foreclosure": ("personal_loans", ["fee_change"], None),
    "fd_service": ("fd_rd", ["service_delay"], None),
    "charges": ("deposits_savings", ["fee_change"], None),
    "debit_card": ("deposits_savings", ["service_delay"], None),
    "account_opening": ("deposits_savings", ["service_delay"], None),
    "card_not_visible": ("cards", ["app_failure"], "app_servicing"),
    "card_bill": ("cards", ["app_failure"], "emi"),
    "card_registration": ("cards", ["app_failure"], "applications"),
}
# business -> (weekly items, theme mix, top theme floor per week; None = top up the real items to the floor)
PLAN = {
    "vehicle": (26, {"vf_emi": 0.62, "vf_noc": 0.24, "vf_disbursal": 0.14}, 16),
    "micro": (24, {"ml_repayment": 0.66, "ml_app_access": 0.34}, 16),
    "personal": (24, {"pl_preapproved": 0.64, "pl_foreclosure": 0.36}, 16),
    "deposits": (None, {"fd_service": 0.45, "charges": 0.33, "debit_card": 0.12, "account_opening": 0.1}, 16),
    "cards": (None, {"card_not_visible": 0.55, "card_bill": 0.3, "card_registration": 0.15}, 16),
}
B32 = "abcdefghijklmnopqrstuvwxyz234567"


def h(rng: random.Random) -> str:
    return "".join(rng.choice(B32) for _ in range(16))


def item(rng: random.Random, theme: str | None, product: str, when: dt.datetime, week_end: dt.date) -> dict:
    tags, cat = (THEMES[theme][1], THEMES[theme][2]) if theme else ([], None)
    if theme == "charges" and rng.random() < 0.6:
        tags = [*tags, "closure_intent"]
    if theme == "fd_service" and rng.random() < 0.45:
        tags = [*tags, "rate_offer"]
    if theme in ("debit_card", "account_opening", "fd_service") and rng.random() < 0.4:
        tags = [*tags, "app_failure"]
    negative = theme is not None
    return {
        "app_version": None, "author_hash": h(rng), "bank": "indusind", "card_category": cat, "created_at": when.isoformat(),
        "duplicate_of": None, "english_gloss": None, "id": h(rng), "language": "en", "off_topic_reason": None, "on_topic": True,
        "peer_mentioned": [], "product": product, "product_method": "illustrative", "rating": rng.choice([1, 1, 2]) if negative else rng.choice([4, 5]),
        "reach": None, "responded": None, "sentiment": "negative" if negative else "positive", "sentiment_method": "illustrative",
        "short": False, "source": "illustrative", "text_hash": h(rng), "theme": theme, "topic_method": "illustrative",
        "topic_tags": tags, "week_end": week_end.isoformat(),
    }


def main() -> None:
    rng = random.Random(SEED)
    real = [json.loads(line) for line in open(REAL, encoding="utf-8")]
    real = [i for i in real if i["on_topic"] and not i["duplicate_of"]]
    start = min(dt.datetime.fromisoformat(i["created_at"]) for i in real if i["source"] == "play")
    weeks = []
    end = FREEZE
    while end > start:
        weeks.append(end)
        end -= dt.timedelta(days=7)
    out = []
    for wk_end in weeks:
        a = max(wk_end - dt.timedelta(days=7), start)
        days = max(1, (wk_end - a).days)
        scale = days / 7
        for biz, (base, mix, floor) in PLAN.items():
            products = {THEMES[t][0] for t in mix}
            top = max(mix, key=mix.get)
            real_top = sum(1 for i in real if i["theme"] == top and a < dt.datetime.fromisoformat(i["created_at"]) <= wk_end)
            if base is None:
                # top up: the top theme reaches the floor; the other themes get a few items in proportion
                n_top = max(0, round((floor + rng.randint(0, 4)) * scale) - real_top)
                counts = {t: (n_top if t == top else round(n_top * mix[t] / mix[top] * rng.uniform(0.6, 1.0))) for t in mix}
                positives = 0
            else:
                total = round((base + rng.randint(-3, 3)) * scale)
                counts = {t: round(total * p) for t, p in mix.items()}
                counts[top] = max(counts[top], round(floor * scale) + rng.randint(0, 2))
                positives = round(total * rng.uniform(0.08, 0.15))
            for t, k in counts.items():
                for _ in range(k):
                    when = (a + dt.timedelta(days=rng.uniform(0, days))).astimezone(IST)
                    when = when.replace(hour=12, minute=0, second=0, microsecond=0)
                    when = min(max(when, start), FREEZE.replace(hour=12))
                    out.append(item(rng, t, THEMES[t][0], when, wk_end.date()))
            for _ in range(positives):
                when = (a + dt.timedelta(days=rng.uniform(0, days))).astimezone(IST).replace(hour=12, minute=0, second=0, microsecond=0)
                when = min(max(when, start), FREEZE.replace(hour=12))
                out.append(item(rng, None, sorted(products)[0], when, wk_end.date()))
    out.sort(key=lambda i: (i["created_at"], i["id"]))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        for i in out:
            f.write(json.dumps(i, ensure_ascii=False, sort_keys=True) + "\n")
    by = {}
    for i in out:
        by[i["product"]] = by.get(i["product"], 0) + 1
    print(f"indusind L2 illustrative: {len(out)} items over {len(weeks)} weeks from {start.date()}; by product {by}")


if __name__ == "__main__":
    main()
