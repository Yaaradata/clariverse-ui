"""Hand-check sample for the public layer (NW-D84): 100 random on-topic NatWest items with the pipeline's proposed theme
and sentiment, for a person to mark right or wrong. Writes qa/natwest_l2_sample_check.md. Deterministic (fixed seed).

The public negative share stays hidden (public_gate.py) until data/public/natwest_config.json records this check as
passed, with the accuracy found.
"""

from __future__ import annotations

import json
import random
import re

from common import OUT_APP, ROOT
from taxonomy import THEMES

LABEL = {t["id"]: t["label"] for t in THEMES}
# This file is committed: a run of two or three capitalised words that is not a bank, product or place we know reads
# as a person's name and is masked here, even where the pipeline's name redaction did not catch it.
NAME_RX = re.compile(r"\b[A-Z][a-z]+(?: [A-Z][a-z]+){1,2}\b")
KEEP = {"Nat West", "Royal Bank", "Royal Bank Of", "Google Play", "App Store", "Faster Payments", "Financial Ombudsman",
        "Financial Ombudsman Service", "Customer Service", "Premier Reward", "Premier Select", "Credit Card", "Bank Of",
        "Bank Of England", "Open Banking", "Apple Pay", "Google Pay", "Direct Debit", "Standing Order", "Mobile Banking",
        "Online Banking", "Trust Pilot", "United Kingdom", "Great Britain", "Northern Ireland", "Monzo Bank",
        "Santander Uk", "Barclays Bank", "Lloyds Bank", "Nationwide Building Society", "Rooster Money", "Black Friday"}
SOURCE = {"appstore": "App Store", "playstore": "Google Play", "x": "X", "reddit": "Reddit", "trustpilot": "Trustpilot"}


def main():
    rows = [json.loads(x) for x in open(OUT_APP / "work" / "classified.jsonl", encoding="utf-8")]
    pool = [r for r in rows if r["relevant"] == "on_topic" and r["entity"] == "natwest_group" and (r.get("text") or r.get("title"))]
    pool.sort(key=lambda r: r["id"])
    sample = random.Random(20261116).sample(pool, 100)
    by_src: dict[str, int] = {}
    for r in sample:
        by_src[r["source"]] = by_src.get(r["source"], 0) + 1
    out = [
        "# NatWest public layer: sentiment and theme hand check",
        "",
        f"100 items drawn at random (seed 20261116) from the {len(pool):,} on-topic NatWest items of the 16 Nov pull "
        "(1 Aug to 13 Nov 2026). Text is as redacted in the pipeline; no handles or links.",
        "",
        "Mark each row: theme right (Y/N) and sentiment right (Y/N). When done, record the accuracy in "
        "`data/public/natwest_config.json` (`sentiment_accuracy_check`: passed, checked_by, checked_on, accuracy_pct). "
        "Until then the public negative share stays hidden on screen.",
        "",
        "By source: " + " · ".join(f"{SOURCE.get(k, k)} {v}" for k, v in sorted(by_src.items())),
        "",
        "| # | Source | Date | Text | Proposed theme | Proposed sentiment | Theme right? | Sentiment right? |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for i, r in enumerate(sample, 1):
        text = f"{r.get('title') or ''} {r.get('text') or ''}".strip().replace("|", "/").replace("\n", " ")
        text = NAME_RX.sub(lambda m: m.group(0) if m.group(0) in KEEP else "[name]", text)
        if len(text) > 220:
            text = text[:219].rstrip() + "…"
        theme = LABEL.get(r["themes"][0], r["themes"][0]) if r.get("themes") else "—"
        out.append(f"| {i} | {SOURCE.get(r['source'], r['source'])} | {r['created_at'][:10]} | {text} | {theme} | "
                   f"{r['sentiment']} |  |  |")
    out += ["", "Accuracy: theme __ / 100 · sentiment __ / 100 · checked by ____ on ____", ""]
    (ROOT / "qa" / "natwest_l2_sample_check.md").write_text("\n".join(out), encoding="utf-8", newline="\n")
    print("l2_sample: 100 items ->", ROOT / "qa" / "natwest_l2_sample_check.md", by_src)


if __name__ == "__main__":
    main()
