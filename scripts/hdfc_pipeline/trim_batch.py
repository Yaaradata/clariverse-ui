"""Trim a model-labelled batch to its honestly labelled prefix (see llm_gate). Usage: trim_batch.py batch_08"""

import json
import sys
from pathlib import Path

from llm_gate import good_prefix

D = Path(__file__).resolve().parents[2] / "data" / "out" / "app_jul_sep" / "work" / "llm_batches"
name = sys.argv[1]
rows, keep = good_prefix(D / f"{name}.jsonl", D / f"{name}.out.jsonl")
total = sum(1 for line in open(D / f"{name}.out.jsonl") if line.strip())
with open(D / f"{name}.out.jsonl", "w") as f:
    for r in rows:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")
print(name, "kept", keep, "of", total)
