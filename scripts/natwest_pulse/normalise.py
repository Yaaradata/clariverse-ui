"""Stage 1 · Normalise and redact the NatWest Group public pull (docs/natwest/brief.md Step 3.3 and 3.7).

Reads data/raw/natwest/ (gitignored: handles and URLs never enter the repo) and writes
data/out/natwest_pulse/work/normalised.jsonl: one record per item, UTC timestamps, author handles dropped, text redacted.
Every record carries `brand` (natwest · rbs · ulster · group_other), derived from the app id, the handle, the
subreddit or the text. Relevance is decided here, not by deletion (`relevant` = on_topic | mention_only | off_topic).

Expected layout (one JSON object per line, the collector's own fields):
  appstore/*.jsonl     App Store reviews, United Kingdom storefront (NatWest, Royal Bank of Scotland, Ulster Bank apps)
  playstore/*.jsonl    Google Play reviews, same apps
  x/*.jsonl            X posts
  reddit/*.jsonl       r/UKPersonalFinance, r/NatWest, r/RBS
  trustpilot/*.jsonl   natwest.com, rbs.co.uk
  mse/*.jsonl          MoneySavingExpert forum

A source with no files is "not loaded": it is listed in data/out/natwest_pulse/sources.json and every screen that would
show it reads "Public data not yet loaded" (HL-15). Nothing is invented in its place.
"""

from __future__ import annotations

import collections
import datetime as dt
import glob
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from pii_names import ALLEGATION, redact_names  # noqa: E402  (shared with scripts/check_pii.py)

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "raw" / "natwest"
OUT = ROOT / "data" / "out" / "natwest_pulse"
WORK = OUT / "work"

SOURCES = [
    {"id": "appstore", "label": "App Store (United Kingdom)", "glob": "appstore/*.jsonl"},
    {"id": "playstore", "label": "Google Play", "glob": "playstore/*.jsonl"},
    {"id": "x", "label": "X", "glob": "x/*.jsonl"},
    {"id": "reddit", "label": "Reddit", "glob": "reddit/*.jsonl"},
    {"id": "trustpilot", "label": "Trustpilot", "glob": "trustpilot/*.jsonl"},
    {"id": "mse", "label": "MoneySavingExpert forum", "glob": "mse/*.jsonl"},
]

# Brand from the app name, the handle, the subreddit or the text, in that order (Step 3.3).
BRAND_RX = [
    ("ulster", re.compile(r"ulster\s*bank|\bulsterbank\b", re.I)),
    ("rbs", re.compile(r"royal\s*bank\s*of\s*scotland|\brbs\b", re.I)),
    ("group_other", re.compile(r"\bcoutts\b|\bmettle\b|\blombard\b|natwest\s*(markets|international|boxed)", re.I)),
    ("natwest", re.compile(r"nat\s*west", re.I)),
]
SUBREDDIT_BRAND = {"natwest": "natwest", "rbs": "rbs", "ulsterbank": "ulster"}
FINANCE_SUBS = {"ukpersonalfinance", "natwest", "rbs", "ukbanking", "ukmortgages"}
CARE_HANDLE_RE = re.compile(r"(natwest|rbs|ulster).*(help|care|support|official)|^(natwest|rbs|ulsterbank)(_?business)?$", re.I)
CX_RE = re.compile(r"card|account|app|customer|service|branch|loan|mortgage|charge|complain|refund|payment|fraud|call|cora|transfer", re.I)
STOCK_RE = re.compile(r"share\s*price|\bnwg\b|\bftse\b|dividend|buyback|results|analysts?|stake", re.I)

REDACT = [
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"), "[email]"),
    (re.compile(r"(?<![\d+])(?:\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}(?!\d)"), "[phone]"),
    (re.compile(r"\+44[\s\d()-]{9,14}\d"), "[phone]"),
    (re.compile(r"(?<![\d-])\d{2}-\d{2}-\d{2}(?![\d-])"), "[sort code]"),
    (re.compile(r"\b[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b"), "[ni number]"),
    (re.compile(r"\b(?:\d[ -]?){12,19}\b"), "[card]"),
    (re.compile(r"(?<![\d.,£])\d{8}(?![\d.,])"), "[account]"),
    (re.compile(r"(?<![\d.,£])\d{6,}(?![\d.,])"), "[number]"),
]
PERSON_TAG_RE = re.compile(r"\[(bank executive|public official|public figure|staff member|named third party|named person)\]")


def redact(text: str | None) -> str:
    if not text:
        return ""
    s = text
    for rx, rep in REDACT:
        s = rx.sub(rep, s)
    return redact_names(s).strip()


def to_utc(s: str) -> str:
    d = dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return d.astimezone(dt.timezone.utc).isoformat(timespec="seconds")


def brand_of(*parts: str | None, subreddit: str | None = None) -> str | None:
    for p in parts:
        if not p:
            continue
        for b, rx in BRAND_RX:
            if rx.search(p):
                return b
    if subreddit and subreddit.lower() in SUBREDDIT_BRAND:
        return SUBREDDIT_BRAND[subreddit.lower()]
    return None


def base(**kw):
    rec = {
        "id": None, "bank": "natwest_group", "brand": None, "source": None, "url": None, "created_at": None, "text": "",
        "title": None, "parent_id": None, "thread_id": None, "lang": None, "author_followers": None,
        "author_verified": None, "engagement": {}, "rating": None, "app_name": None, "app_id": None,
        "app_version": None, "entity": "natwest_group", "business_hint": None, "subreddit": None, "record_type": None,
        "reply": None, "relevant": "on_topic", "collected_at": None, "collector": None,
    }
    rec.update(kw)
    return rec


def _iter(pattern: str):
    for f in sorted(glob.glob(str(RAW / pattern))):
        for line in open(f, encoding="utf-8"):
            if line.strip():
                yield json.loads(line)


def record(src: str, r: dict) -> dict:
    """One raw item, whatever the source, to the common schema. The author handle is used once, to tell the bank's
    care voice from a customer's, and is never stored (HL-03)."""
    app = r.get("app") or {}
    author = (r.get("author") or {}).get("username") or ""
    sub = r.get("subreddit")
    if not sub and src == "reddit":
        m = re.search(r"reddit\.com/r/([^/]+)/", r.get("url") or "")
        sub = m.group(1) if m else None
    text = f"{r.get('title') or ''} {r.get('text') or ''}"
    brand = brand_of(app.get("name"), app.get("store_id"), author if not CARE_HANDLE_RE.search(author) else None, text, subreddit=sub)
    if CARE_HANDLE_RE.search(author):
        rel = "off_topic"  # the bank's own care voice
    elif brand is None:
        rel = "off_topic"
    elif src == "reddit" and (sub or "").lower() not in FINANCE_SUBS:
        rel = "mention_only"
    elif STOCK_RE.search(text) and not CX_RE.search(text):
        rel = "mention_only"
    else:
        rel = "on_topic"
    # group_other (Coutts, Mettle and the rest) is kept, with entity group_other, and excluded from retail figures.
    return base(
        id=r.get("id"), source=src, url=r.get("url"), created_at=to_utc(r["created_at"]), text=redact(r.get("text")),
        title=redact(r.get("title")) or None, lang=r.get("lang"), brand=brand or "natwest",
        entity="group_other" if brand == "group_other" else "natwest_group",
        rating=int(r["rating"]) if r.get("rating") else None, app_name=app.get("name"), app_id=app.get("store_id"),
        app_version=app.get("version"), subreddit=sub, record_type=r.get("record_type") or ("review" if src in ("appstore", "playstore", "trustpilot") else "post"),
        relevant=rel, collected_at=r.get("collected_at"), engagement=r.get("engagement") or {},
        parent_id=r.get("parent_id"), thread_id=r.get("thread_id"),
    )


def main():
    WORK.mkdir(parents=True, exist_ok=True)
    out, seen, inventory = [], set(), []
    for s in SOURCES:
        files = sorted(glob.glob(str(RAW / s["glob"])))
        n = 0
        for r in _iter(s["glob"]):
            rec = record(s["id"], r)
            if rec["id"] in seen:
                continue
            seen.add(rec["id"])
            full = f"{rec.get('title') or ''} {rec['text']}"
            rec["names_person"] = bool(PERSON_TAG_RE.search(full))
            rec["alleges_named"] = rec["names_person"] and bool(ALLEGATION.search(full))
            out.append(rec)
            n += 1
        inventory.append({"id": s["id"], "label": s["label"], "loaded": bool(files), "files": len(files), "items": n})
    with open(WORK / "normalised.jsonl", "w", encoding="utf-8", newline="\n") as f:
        for r in out:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    with open(OUT / "sources.json", "w", encoding="utf-8", newline="\n") as f:
        json.dump({"provenance": "public", "raw_dir": "data/raw/natwest", "sources": inventory}, f, ensure_ascii=False, indent=1)
        f.write("\n")
    c = collections.Counter((r["source"], r["brand"], r["relevant"]) for r in out)
    for s in inventory:
        print(f"source {s['id']:<10} {'loaded' if s['loaded'] else 'NOT LOADED':<10} items={s['items']}")
    for k, v in sorted(c.items()):
        print(k, v)
    print("total", len(out))


if __name__ == "__main__":
    main()
