"""Blind sentiment-check sample for the public layer (SW-D11, SW-D15 point 8; NW-D84 and NW-D91 method).

Writes two files in data/out/swedbank_pulse/work/ (gitignored):
  blind_sample.jsonl          up to 100 on-topic retail items, review sources first (App Store, Google Play,
                              Trustpilot), then social (Reddit, X), each in id order: id, source, text (redacted,
                              Swedish as written). NO labels, so an independent labeller can label it blind.
  blind_labels_builder.jsonl  the pipeline's labels for the same ids: sentiment, primary theme, product.

The lead has the sample labelled blind and writes scripts/swedbank_pulse/blind_check_result.json; public_gate.py
shows review sentiment shares only when review-source agreement is at least 90%. Deterministic: no random draw (the
on-topic set is smaller than 100, so the sample is the whole on-topic set).
"""

from __future__ import annotations

import json

from common import OUT_APP
from normalise import RETAIL_ENTITY

ORDER = ["appstore", "playstore", "trustpilot", "reddit", "x"]
N = 100


def main():
    rows = [json.loads(x) for x in open(OUT_APP / "work" / "classified.jsonl", encoding="utf-8")]
    pool = [r for r in rows if r["relevant"] == "on_topic" and r["entity"] == RETAIL_ENTITY]
    pool.sort(key=lambda r: (ORDER.index(r["source"]), r["id"]))
    sample = pool[:N]
    work = OUT_APP / "work"
    with open(work / "blind_sample.jsonl", "w", encoding="utf-8", newline="\n") as f:
        for r in sample:
            text = " ".join(x for x in (r.get("title"), r.get("text")) if x).strip()
            f.write(json.dumps({"id": r["id"], "source": r["source"], "text": text}, ensure_ascii=False) + "\n")
    with open(work / "blind_labels_builder.jsonl", "w", encoding="utf-8", newline="\n") as f:
        for r in sample:
            f.write(json.dumps({"id": r["id"], "source": r["source"], "sentiment": r["sentiment"], "theme": r["themes"][0],
                                "product": r.get("product")}, ensure_ascii=False) + "\n")
    by = {}
    for r in sample:
        by[r["source"]] = by.get(r["source"], 0) + 1
    print(f"l2_sample: {len(sample)} items (on-topic pool {len(pool)}) ->", work / "blind_sample.jsonl", by)


if __name__ == "__main__":
    main()
