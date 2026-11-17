"""Public provenance check (SW-D15 point 7, HL-15: no synthetic public data).

Every public item, count, quote and evidence row in data/out/swedbank_pulse must trace to a record in data/raw/swedbank
(the five window files normalise.py reads), by record id (native_id kept alongside):
  1. work/classified.jsonl: every row's id is a raw record; its redacted text is exactly what normalise.redact() makes
     of that raw record's text (a real id with invented text fails); one row per raw record, no extras.
  2. sources.json: per-source item counts equal the raw counts.
  3. Counts: themes.json total_items, meta.json records.bank_on_topic_window and the products.json rows all equal the
     number of retail on-topic rows that passed step 1.
  4. Every public record id anywhere in the public payloads (evidence keys, exemplars, example ids, voices) is a raw
     record, and evidence rows carry the raw record's source, date and native id.
  5. Every quote (an evidence summary, or a periods.json quote with a public platform) is a substring of a verified
     redacted raw text (after the "!" → "." normalisation the pipeline applies, ellipsis removed).

check(out_dir) returns the list of errors; main() exits 1 on any. `--self-test` plants a fabricated evidence row and a
fabricated classified row in a temporary copy and confirms both fail.
"""

from __future__ import annotations

import json
import re
import shutil
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from normalise import RAW, RETAIL_ENTITY, SOURCES, redact  # noqa: E402

OUT_DEFAULT = Path(__file__).resolve().parents[2] / "data" / "out" / "swedbank_pulse"
RECORD_ID_RX = re.compile(r"^(?:appstore|playstore|x|reddit|trustpilot):[0-9A-Za-z_:-]+$")
PUBLIC_PLATFORMS = {"App Store", "Google Play", "X", "Reddit", "Trustpilot"}
PUBLIC_FILES = ("themes.json", "signals.json", "app_pulse.json", "mood.json", "briefing.json", "meta.json", "evidence.json",
                "responses.json", "products.json", "store_series.json", "sources.json", "periods.json")


def _norm(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").replace("!", ".").replace("…", "")).strip().lower()


def load_raw(raw_dir: Path = RAW) -> dict[str, dict]:
    out = {}
    for s in SOURCES:
        p = raw_dir / s["file"]
        if not p.exists():
            continue
        for line in open(p, encoding="utf-8"):
            if line.strip():
                r = json.loads(line)
                r["_source"] = s["id"]
                out[r["id"]] = r
    return out


def _walk_ids(o, path=""):
    if isinstance(o, dict):
        for k, v in o.items():
            if isinstance(k, str) and RECORD_ID_RX.match(k):
                yield k, f"{path}/{k}"
            yield from _walk_ids(v, f"{path}/{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from _walk_ids(v, f"{path}[{i}]")
    elif isinstance(o, str) and RECORD_ID_RX.match(o):
        yield o, path


def _walk_quotes(o):
    if isinstance(o, dict):
        plat = o.get("platform") or o.get("source_label")
        if plat in PUBLIC_PLATFORMS:
            q = o.get("summary") if "summary" in o else o.get("text")
            if isinstance(q, str) and q:
                yield q
        for v in o.values():
            yield from _walk_quotes(v)
    elif isinstance(o, list):
        for v in o:
            yield from _walk_quotes(v)


def check(out_dir, raw_dir: Path = RAW) -> list[str]:
    out_dir = Path(out_dir)
    errors: list[str] = []
    raw = load_raw(raw_dir)
    if not raw:
        return [f"no raw records under {raw_dir}"]
    cpath = out_dir / "work" / "classified.jsonl"
    if not cpath.exists():
        return [f"missing {cpath}"]
    rows = [json.loads(line) for line in open(cpath, encoding="utf-8") if line.strip()]
    seen, verified_text, on_topic = set(), [], 0
    for r in rows:
        rid = r.get("id")
        src = raw.get(rid)
        if src is None:
            errors.append(f"classified row {rid!r} has no raw record")
            continue
        if rid in seen:
            errors.append(f"classified row {rid} appears twice")
        seen.add(rid)
        display = (src.get("author") or {}).get("display_name") or (src.get("author") or {}).get("username") or ""
        for fld in ("text", "title"):
            expect = redact(src.get(fld), display) or ("" if fld == "text" else None)
            if (r.get(fld) or None) != (expect or None):
                errors.append(f"classified row {rid}: {fld} differs from the redacted raw record")
        if r.get("native_id") not in (None, src.get("native_id")):
            errors.append(f"classified row {rid}: native_id differs from the raw record")
        verified_text.append(_norm(f"{r.get('title') or ''} {r.get('text') or ''}"))
        if r.get("relevant") == "on_topic" and r.get("entity") == RETAIL_ENTITY:
            on_topic += 1
    missing = set(raw) - seen
    if missing:
        errors.append(f"{len(missing)} raw records missing from classified.jsonl")
    corpus = "\n".join(verified_text)

    def load(name):
        p = out_dir / name
        return json.loads(p.read_text(encoding="utf-8")) if p.exists() else None

    sources = load("sources.json")
    if sources:
        raw_by = {}
        for r in raw.values():
            raw_by[r["_source"]] = raw_by.get(r["_source"], 0) + 1
        for s in sources["sources"]:
            if s["items"] != raw_by.get(s["id"], 0):
                errors.append(f"sources.json {s['id']}: {s['items']} items, raw has {raw_by.get(s['id'], 0)}")
    themes, meta, products = load("themes.json"), load("meta.json"), load("products.json")
    if themes and themes.get("total_items") != on_topic:
        errors.append(f"themes.json total_items {themes.get('total_items')} != {on_topic} traced on-topic rows")
    if meta and meta.get("records", {}).get("bank_on_topic_window") != on_topic:
        errors.append(f"meta.json bank_on_topic_window {meta.get('records', {}).get('bank_on_topic_window')} != {on_topic}")
    if products:
        tot = sum(p["count"] for p in products["rows"]) + products.get("nina_digital", 0)
        if tot != on_topic:
            errors.append(f"products.json rows + Nina = {tot} != {on_topic} traced on-topic rows")
    for name in PUBLIC_FILES:
        obj = load(name)
        if obj is None:
            continue
        for rid, where in _walk_ids(obj):
            if rid not in raw:
                errors.append(f"{name}{where}: public id {rid} has no raw record")
        for q in _walk_quotes(obj):
            if _norm(q) not in corpus:
                errors.append(f"{name}: quote not found in any raw record: {q[:60]!r}")
    evidence = load("evidence.json") or {}
    for eid, e in evidence.items():
        src = raw.get(eid)
        if src is None:
            continue  # reported above
        if e.get("source") != src["_source"]:
            errors.append(f"evidence {eid}: source {e.get('source')} != raw {src['_source']}")
        if (e.get("created_at") or "")[:10] != src["created_at"][:10]:
            errors.append(f"evidence {eid}: date differs from the raw record")
        if e.get("native_id") not in (None, src.get("native_id")):
            errors.append(f"evidence {eid}: native_id differs from the raw record")
        if _norm(e.get("summary") or "") not in corpus:
            errors.append(f"evidence {eid}: summary not found in the raw record")
    return errors


def self_test() -> int:
    """A fabricated public row must fail: one invented evidence row, one invented classified row, one altered quote."""
    fails = 0
    baseline = len(check(OUT_DEFAULT))
    with tempfile.TemporaryDirectory() as tmp:
        for case in ("evidence", "classified", "quote"):
            d = Path(tmp) / case
            shutil.copytree(OUT_DEFAULT, d, ignore=shutil.ignore_patterns("llm_batches"))
            if case == "evidence":
                ev = json.loads((d / "evidence.json").read_text(encoding="utf-8"))
                ev["x:9999999999999999999"] = {"id": "x:9999999999999999999", "source": "x", "source_label": "X",
                                                "created_at": "2026-11-16T08:00:00+00:00", "summary": "Swish ligger nere igen."}
                (d / "evidence.json").write_text(json.dumps(ev, ensure_ascii=False), encoding="utf-8")
            elif case == "classified":
                p = d / "work" / "classified.jsonl"
                rec = json.loads(p.read_text(encoding="utf-8").splitlines()[0])
                rec.update(id="trustpilot:fabricated0001", text="Swish fungerar inte sedan i går.")
                with open(p, "a", encoding="utf-8") as f:
                    f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            else:
                ev = json.loads((d / "evidence.json").read_text(encoding="utf-8"))
                k = next(iter(ev))
                ev[k]["summary"] = "Banken svarade aldrig på mitt ärende om Swish."
                (d / "evidence.json").write_text(json.dumps(ev, ensure_ascii=False), encoding="utf-8")
            errs = check(d)
            ok = len(errs) > baseline
            print(f"self-test {case:<10} {'fails as it should' if ok else 'DID NOT FAIL'} ({len(errs)} errors)")
            fails += not ok
    return fails


def main():
    if "--self-test" in sys.argv:
        sys.exit(1 if self_test() else 0)
    errors = check(sys.argv[1] if len(sys.argv) > 1 else OUT_DEFAULT)
    if errors:
        for e in errors[:40]:
            print("provenance ERROR:", e)
        print(f"public_provenance: {len(errors)} errors")
        sys.exit(1)
    print("public_provenance: every public item, count, quote and evidence row traces to data/raw/swedbank")


if __name__ == "__main__":
    main()
