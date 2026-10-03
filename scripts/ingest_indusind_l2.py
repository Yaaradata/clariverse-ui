"""Ingest IndusInd public voice (L2): redact before storage, tag deterministically, write processed data.

Writes to data/processed/indusind_l2/:
  items.jsonl     core items only (INDIE on Play and the App Store; consumercomplaints.in): labels, hashes and glosses,
                  no free text. Fields per IND-B3 §7 plus the method of every tag.
  counts.json     rows per source × bucket × week for every bucket (pending and out included), counts only
  listing.json    INDIE Play listing metadata, dated to the scrape (LIVE-01)
  run_log.json    source counts for this run (eng-qa)
  _audit/urls.jsonl   id → post URL, server-side audit only; gitignored, never in a page payload (HL-03)
  _audit/text.jsonl   id → redacted text, for tagging review and the hand check; gitignored. Reviews name people
                      (staff, family) in ways no pattern catches, so free text is never committed or sent to a page

Pending (X, Reddit, MouthShut) and out (TechnoFino, Trustpilot) text is not stored at all. Deterministic: the same raw
input gives byte-identical output. Fails loudly on zero rows or an out-of-window date.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import sys

import indusind_l2_common as L
from pii_names import alleges_against_named_person

OUT = L.ROOT / "data" / "processed" / "indusind_l2"
GLOSSES = L.ROOT / "scripts" / "indusind_l2_glosses.json"
MANUAL = L.ROOT / "scripts" / "indusind_l2_manual.json"


def week_end(t: dt.datetime) -> str:
    k = (L.FREEZE - t) // dt.timedelta(days=7)
    return (L.FREEZE - dt.timedelta(days=7 * k)).date().isoformat()


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    rows = L.load_raw()
    if not rows:
        raise SystemExit("ingest_indusind_l2: zero rows read")
    glosses = json.loads(GLOSSES.read_text(encoding="utf-8")) if GLOSSES.exists() else {}
    manual = json.loads(MANUAL.read_text(encoding="utf-8")) if MANUAL.exists() else {}

    counts = collections.Counter()
    items, audit = [], []
    dropped_named = 0
    bad_dates = []
    for r in rows:
        t = L.created(r)
        if not (L.WINDOW_START <= t <= L.FREEZE):
            bad_dates.append((r["source"], t.isoformat()))
            continue
        counts[(r["source"], r["bucket"], r.get("exclusion") or "", week_end(t))] += 1
        if r["bucket"] != "core":
            continue
        raw_text = " ".join(x for x in (r.get("title"), r.get("text")) if x)
        if alleges_against_named_person(raw_text):
            dropped_named += 1  # HL-02: an allegation against a named person is dropped, not redacted
            continue
        text = L.redact(raw_text)
        iid = L.item_id(r)
        prod, pmethod = L.product_of(r, text)
        topics = L.topics_of(text)
        tmethod = "rule:keyword" if topics else "rule:none"
        off = L.off_topic(text)
        if iid in manual:  # items the rules could not place, read by hand
            m = manual[iid]
            prod, pmethod = m.get("product", prod), "read" if "product" in m else pmethod
            if "topics" in m:
                topics, tmethod = m["topics"], "read"
            if "off_topic" in m:
                off = m["off_topic"]
        sent, smethod = L.sentiment_of(r, text)
        lang = manual.get(iid, {}).get("language") or L.language(r, text)
        reply = r.get("org_reply") if isinstance(r.get("org_reply"), dict) else None
        items.append({
            "id": iid,
            "source": r["source"],
            "bank": "indusind",
            "language": lang,
            # Day only in the committed store (noon IST), so an item cannot be matched back to its post by the second.
            "created_at": t.replace(hour=12, minute=0, second=0, microsecond=0).isoformat(),
            "week_end": week_end(t),
            "product": prod,
            "product_method": pmethod,
            "topic_tags": topics,
            "topic_method": tmethod,
            "card_category": L.card_category(text) if prod == "cards" else None,
            "theme": L.theme_of(prod, text),
            "peer_mentioned": L.peers_in(text),
            "reach": None,  # neither store returns reach; followers are never reach
            "responded": bool(reply.get("replied")) if reply is not None and r["source"] == "play" else None,
            "on_topic": off is None,
            "off_topic_reason": off,
            "sentiment": sent,
            "sentiment_method": smethod,
            "rating": r.get("rating") if r["source"] in ("play", "appstore") else None,
            "app_version": (r.get("app") or {}).get("version") if isinstance(r.get("app"), dict) else None,
            "author_hash": L.hash_handle(r),
            "text": text,
            "english_gloss": glosses.get(iid) if lang != "en" else None,
            "text_hash": L.text_hash(text),
            "short": len(text.strip()) < 15,
        })
        if r.get("url"):
            audit.append({"id": iid, "url": r["url"]})
    if bad_dates:
        raise SystemExit(f"ingest_indusind_l2: {len(bad_dates)} out-of-window dates, e.g. {bad_dates[:3]}")
    if not items:
        raise SystemExit("ingest_indusind_l2: zero core items")

    # Duplicates within a source (same text, 30+ characters): the first by date stays the canonical item.
    items.sort(key=lambda x: (x["created_at"], x["id"]))
    first = {}
    for it in items:
        key = (it["source"], it["text_hash"])
        it["duplicate_of"] = first.get(key) if len(it["text"]) >= 30 else None
        first.setdefault(key, it["id"])

    missing_gloss = [it["id"] for it in items if it["language"] != "en" and not it["english_gloss"]]

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "_audit").mkdir(exist_ok=True)
    with open(OUT / "items.jsonl", "w", encoding="utf-8", newline="\n") as f:
        for it in items:
            f.write(json.dumps({k: v for k, v in it.items() if k != "text"}, ensure_ascii=False, sort_keys=True) + "\n")
    with open(OUT / "_audit" / "text.jsonl", "w", encoding="utf-8", newline="\n") as f:
        for it in items:
            f.write(json.dumps({"id": it["id"], "text": it["text"]}, ensure_ascii=False) + "\n")
    with open(OUT / "_audit" / "urls.jsonl", "w", encoding="utf-8", newline="\n") as f:
        for a in sorted(audit, key=lambda x: x["id"]):
            f.write(json.dumps(a) + "\n")
    cj = [{"source": s, "bucket": b, "reason": e, "week_end": w, "rows": n} for (s, b, e, w), n in sorted(counts.items())]
    (OUT / "counts.json").write_text(json.dumps(cj, indent=1) + "\n", encoding="utf-8", newline="\n")

    # LIVE-01: INDIE Play listing metadata, dated to the scrape.
    meta = None
    raw_dir = L.RAW / "playstore" / "raw"
    for f in sorted(raw_dir.glob("*.jsonl")):
        with open(f, encoding="utf-8") as fh:
            first_row = json.loads(fh.readline() or "{}")
        if first_row.get("appId") == L.INDIE_PLAY and first_row.get("appScore") is not None:
            scraped = next((r["collected_at"] for r in rows if r["source"] == "play" and r["app"]["store_id"] == L.INDIE_PLAY), None)
            meta = {"store": "Google Play", "app": "INDIE by IndusInd Bank", "score": round(first_row["appScore"], 1),
                    "ratings": first_row.get("appRatings"), "reviews": first_row.get("appReviewCount"),
                    "listing_updated": (first_row.get("appUpdated") or "")[:10], "as_of": (scraped or "")[:10]}
            break
    (OUT / "listing.json").write_text(json.dumps({"indie_play": meta}, indent=1) + "\n", encoding="utf-8", newline="\n")

    by_src = collections.Counter(it["source"] for it in items)
    log = {
        "raw_rows": len(rows),
        "by_bucket": dict(sorted(collections.Counter(r["bucket"] for r in rows).items())),
        "core_items_by_source": dict(sorted(by_src.items())),
        "on_topic": sum(it["on_topic"] for it in items),
        "duplicates": sum(1 for it in items if it["duplicate_of"]),
        "hindi_items": sum(it["language"] != "en" for it in items),
        "hindi_without_gloss": len(missing_gloss),
        "dropped_named_allegation": dropped_named,
        "earliest": min(it["created_at"] for it in items)[:10],
        "latest": max(it["created_at"] for it in items)[:10],
    }
    (OUT / "run_log.json").write_text(json.dumps(log, indent=1) + "\n", encoding="utf-8", newline="\n")
    for s, n in sorted(by_src.items()):
        if n == 0:
            raise SystemExit(f"ingest_indusind_l2: zero rows for {s}")
    print(f"ingest_indusind_l2: {len(rows):,} raw rows -> {len(items):,} core items "
          f"({', '.join(f'{L.SOURCE_LABEL[s]} {n:,}' for s, n in sorted(by_src.items()))}); "
          f"{log['on_topic']:,} on topic; {log['duplicates']} duplicates; {log['hindi_items']} Hindi "
          f"({len(missing_gloss)} without a gloss); {dropped_named} dropped as allegations against a named person; "
          f"{log['earliest']} to {log['latest']}")
    if missing_gloss:
        print(f"ingest_indusind_l2: WARN Hindi items without a gloss: {missing_gloss[:5]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
