"""Quality gate for model-labelled batches: accept a batch's labels chunk by chunk (40 lines) until the first chunk that
looks script-made: most summaries copied from the post, or the same summary reused for different posts, or ids out of
order. Everything from that chunk on is rejected (and can be re-labelled from there)."""

from __future__ import annotations

import json
import re
from collections import defaultdict
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

CHUNK = 40


def _norm(s: str) -> str:
    from normalise import redact as redact_names  # full redaction, as redact_batches.py applies

    # Redact first so the check reads the same whether or not the batch files have been redacted (redact_batches.py).
    return re.sub(r"\s+", " ", redact_names(s or "")).strip().lower()


def good_prefix(src_path: Path, out_path: Path) -> tuple[list[dict], int]:
    """Labels are matched to posts by id (workers sometimes mistype an id or skip a line; that label alone is dropped).
    Chunks of 40 output lines are accepted until the first chunk that looks script-made."""
    src = {json.loads(line)["id"]: json.loads(line) for line in open(src_path, encoding="utf-8")}
    out = []
    for line in open(out_path, encoding="utf-8"):
        line = line.strip()
        if not line:
            continue
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    accepted: list[dict] = []
    for i in range(0, len(out), CHUNK):
        chunk = [(src[b["id"]], b) for b in out[i : i + CHUNK] if b.get("id") in src]
        if not chunk:
            continue
        copied = 0
        texts_by_summary: dict[str, set] = defaultdict(set)
        for a, b in chunk:
            text = _norm(f"{a.get('title') or ''} {a.get('text') or ''}")
            summ = _norm(b.get("summary")).rstrip(".… ")
            if len(summ) > 25 and summ[:40] in text:
                copied += 1
            texts_by_summary[summ].add(text[:100])  # cross-posts share an opening; they are the same post
        templated = sum(len(t) for t in texts_by_summary.values() if len(t) > 1)
        if copied / len(chunk) > 0.3 or templated / len(chunk) > 0.3:
            break
        accepted.extend(b for _, b in chunk)
    return accepted, len(accepted)
