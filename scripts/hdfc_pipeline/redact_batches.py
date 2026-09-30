"""Redact people's names and handles in the committed model-labelling batches (work/llm_batches/*.jsonl).

The batch inputs carry post text and the outputs carry model summaries; both were written before name redaction
existed. This rewrites them in place with the same redaction as normalise.py (its REDACT patterns plus scripts/pii_names.py). It is idempotent:
running it again changes nothing. llm_gate.py redacts both sides before its copied-summary check, so the gate accepts
the same labels before and after.
"""

from __future__ import annotations

import json

from normalise import WORK
from normalise import redact as redact_names  # the full redaction: numbers, emails, names and handles

FIELDS = ("title", "text", "summary")


def main():
    changed = 0
    for path in sorted((WORK / "llm_batches").glob("batch_*.jsonl")):
        lines = open(path, encoding="utf-8").read().splitlines()
        out = []
        for line in lines:
            if not line.strip():
                out.append(line)
                continue
            try:
                r = json.loads(line)
            except json.JSONDecodeError:
                out.append(line)  # the gate skips malformed lines; keep them as they are
                continue
            for k in FIELDS:
                if isinstance(r.get(k), str):
                    red = redact_names(r[k])
                    if red != r[k]:
                        r[k] = red
                        changed += 1
            out.append(json.dumps(r, ensure_ascii=False))
        path.write_text("\n".join(out) + "\n", encoding="utf-8")
    print("redact_batches: fields changed", changed)


if __name__ == "__main__":
    main()
