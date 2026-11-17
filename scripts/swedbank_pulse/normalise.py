"""Stage 1 · Normalise, redact and scope the Swedbank public crawl (docs/swedbank/kickoff_prompt.md Step 11, SW-D11).

Reads exactly one window file per source from data/raw/swedbank/<source>/2026-11-17/ (gitignored) and writes
data/out/swedbank_pulse/work/normalised.jsonl plus data/out/swedbank_pulse/sources.json (the per-source inventory the
screens use). Each source folder also holds records.jsonl, records.csv and raw/ actor rows: they duplicate the window
file and are never read (a glob over the folder would count every item twice). Reddit's threads file holds only
comments whose post is already in the window file (38 of 66, all duplicates): it is never counted either.

Scope (SW-D11, NW-D92) comes from the checked-in labels (public_labels.jsonl, one row per raw record, read by a person or
the multilingual model): on_topic · mention_only · mentions_peer · off_topic · investor_corporate (@Aktiellt, results,
forecasts, share price, Fokusportfölj, corporate news) · group_other (Baltic Banking, Sparbankerna, Swedbank Pay,
business customers). A raw record without a label, or a label without a raw record, stops the pipeline.

Times stay UTC (the code compares ISO strings); screens convert to CET. Authors are hashed; text is redacted before it is
written (links, e-mails, personnummer, Swedish and international phone numbers, clearing and account numbers, IBANs,
card numbers, handles, people's names).
"""

from __future__ import annotations

import collections
import datetime as dt
import hashlib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from pii_names import ALLEGATION, redact_names  # noqa: E402  (shared with scripts/check_pii.py)

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "raw" / "swedbank"
OUT = ROOT / "data" / "out" / "swedbank_pulse"
WORK = OUT / "work"
LABELS = Path(__file__).resolve().parent / "public_labels.jsonl"
PULL = "2026-11-17"
RETAIL_ENTITY = "swedbank"  # retail Swedish Banking, private customers (the contract with periods_v3 and the reconcile)

# One window file per source. "start" is each source's first collected day (tiles, HL-13: no trend crosses it).
SOURCES = [
    {"id": "appstore", "label": "App Store", "file": f"appstore/{PULL}/swedbank_appstore_2026-10-22_2026-11-17.jsonl",
     "start": "2026-11-02"},
    {"id": "playstore", "label": "Google Play", "file": f"playstore/{PULL}/swedbank_playstore_2026-10-22_2026-11-17.jsonl",
     "start": "2026-10-23"},
    {"id": "x", "label": "X", "file": f"x/{PULL}/swedbank_x_2026-10-22_2026-11-17.jsonl", "start": "2026-10-22"},
    {"id": "reddit", "label": "Reddit", "file": f"reddit/{PULL}/swedbank_reddit_2026-10-22_2026-11-17.jsonl",
     "start": "2026-10-22"},
    {"id": "trustpilot", "label": "Trustpilot", "file": f"forums/{PULL}/swedbank_forums_trustpilot_2026-10-22_2026-11-17.jsonl",
     "start": "2026-10-27"},
]
REDDIT_THREADS = f"reddit/{PULL}/swedbank_reddit_threads_2026-10-22_2026-11-17.jsonl"  # context only, never counted
FREEZE = "2026-11-17T06:45:00+00:00"  # 17 Nov 07:45 CET (SW-D03): later items are kept out of every window

# Handles of institutions, kept through redaction as the plain name (every other handle becomes [handle]).
KEEP_HANDLES = ["Swedbank", "SwedbankLatvia", "Swedbank_SE", "avanzabank", "Nordea_SE", "NordnetAra"]
# People named in the crawl (staff, executives, public figures) and Swedish given names: the shared detector in
# pii_names.py is built on Indian and English lexicons, so the Swedish layer adds these.
SE_FULL_NAMES = [
    "Helene kjellsdotter", "Göran Persson", "Jens H", "Birgit Bonnesen", "Michael Wolf", "Arturo Arques", "Johanna Fager",
    "Anna Ryott", "Agnes Virf", "Robert Kitt", "Rain Lõhmus", "Elisabeth Thand Ringqvist", "Magdalena Andersson",
    "Mikael Kubu", "Erkki Toivokainen", "Nerijus Mačulis", "Kalviņam", "Kalviņa", "Bokarevi", "Evika Siliņa",
]
SE_GIVEN = set("""
Anders Anna Annika Arne Astrid Axel Birgitta Bo Britt Camilla Carina Carl Caroline Cecilia Charlotte Chris Christer
Christina Daniel Ebba Elin Elisabeth Ellinor Emil Emma Erik Erika Eva Filip Fredrik Gunilla Gustav Hanna Hans Helena
Helene Henrik Ingrid Isak Jan Jenny Johan Johanna Jonas Josefin Jörgen Karin Karl Kerstin Kristina Lars Leif Lena Linda
Lisa Magnus Malin Maria Marie Markus Martin Mats Mattias Mikael Monica Niklas Nils Olof Olle Oscar Per Peter Petra Rasmus
Robert Roger Sara Simon Sofia Stefan Susanne Sven Thomas Tobias Tomas Ulf Ulla Viktor Åsa Åke Märit Ann-Christin Birgit
""".split())
_FULL_RE = re.compile(r"(?<!\w)(" + "|".join(re.escape(n) for n in sorted(SE_FULL_NAMES, key=len, reverse=True)) + r")(?!\w)", re.I)
_GIVEN_PAIR_RE = re.compile(r"\b(" + "|".join(sorted(SE_GIVEN, key=len, reverse=True)) + r")\s+[A-ZÅÄÖ][a-zåäöé]+(?:dotter|son|sson|berg|ström|lund|qvist|gren|man|kvist)\b")
_CALLED_RE = re.compile(r"\b(called|named|heter|hette)\s+([A-ZÅÄÖ][a-zåäö]+)")

REDACT = [
    # Links (HL-02, NW-D84): a markdown link keeps its words; any bare link becomes "[link]".
    (re.compile(r"\[([^\]]{1,80})\]\((?:https?://|www\.)[^)\s]*\)"), r"\1"),
    (re.compile(r"(?:https?://|www\.)\S+", re.I), "[link]"),
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"), "[email]"),
    # IBANs (an Estonian IBAN is in the X crawl) and card numbers before the shorter number rules.
    (re.compile(r"\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){2,7}(?:\s?[A-Z0-9]{1,4})?\b"), "[iban]"),
    (re.compile(r"(?<!\d)\d{4}(?:[ -]\d{4}){2,3}(?:[ -]?\d{1,3})?(?!\d)"), "[card]"),
    # personnummer: YYMMDD-NNNN, YYYYMMDD[-]NNNN.
    (re.compile(r"(?<![\d-])(?:\d{6}[-+]\d{4}|(?:19|20)\d{6}[-+]?\d{4})(?![\d-])"), "[personnummer]"),
    # Swedish mobiles (07x, +46 7x) and any other international number.
    (re.compile(r"(?<![\d+])07\d[- ]?\d{3}[- ]?\d{2}[- ]?\d{2}(?!\d)"), "[phone]"),
    (re.compile(r"\+\d{2,3}[\s-]?\d(?:[\s-]?\d){6,11}(?!\d)"), "[phone]"),
    # Clearing number + account number (4–5 digit clearing, a separator, 7–10 digits).
    (re.compile(r"(?<![\d-])[3-9]\d{3}(?:-\d)?[\s,-]+\d{1,3}[\s ]?\d{3}[\s ]?\d{3}[- ]?\d(?!\d)"), "[account]"),
    (re.compile(r"\b((?:ärende|ärendenummer|referens|ref|case|reference)\s*(?:nr\.?|no\.?|number)?\s*[:#.]?\s*)\d{5,}", re.I), r"\1[reference]"),
    (re.compile(r"(?<![\d.,])\d{8,}(?![\d.,])"), "[number]"),
]
PERSON_TAG_RE = re.compile(r"\[(bank executive|public official|public figure|staff member|named third party|named person)\]")
BANK_HANDLE_RE = re.compile(r"@swedbank\w*", re.I)


def redact(text: str | None, author: str | None = None) -> str:
    if not text:
        return ""
    s = text
    for rx, rep in REDACT:
        s = rx.sub(rep, s)
    s = _FULL_RE.sub("[named person]", s)
    s = _GIVEN_PAIR_RE.sub("[named person]", s)
    s = _CALLED_RE.sub(lambda m: f"{m.group(1)} [staff member]", s)
    # The author's own first name, signed at the end of a review ("Tack berry").
    first = (author or "").split()[0] if (author or "").split() else ""
    if len(first) >= 3 and first.isalpha():
        s = re.sub(rf"(?<!\w){re.escape(first)}(?!\w)", "[named person]", s, flags=re.I)
    keep = {}
    for i, hnd in enumerate(KEEP_HANDLES):
        tok = f"KEEPHANDLE{i}X"
        s, n = re.subn(rf"(?<![\w.])@{hnd}(?!\w)", tok, s, flags=re.I)
        if n:
            keep[tok] = hnd  # the institution's name without the "@" (check_pii treats every @handle as personal)
    s = redact_names(s)
    for tok, hnd in keep.items():
        s = s.replace(tok, hnd)
    return s.strip()


def h(name: str | None) -> str | None:
    return hashlib.sha256(name.encode("utf-8")).hexdigest() if name else None


def to_utc(s: str) -> str:
    d = dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return d.astimezone(dt.timezone.utc).isoformat(timespec="seconds")


def read_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in open(path, encoding="utf-8") if line.strip()]


def load_labels() -> dict[str, dict]:
    return {r["id"]: r for r in read_jsonl(LABELS)}


def record(src: dict, r: dict, lab: dict) -> dict:
    app = r.get("app") or {}
    author = (r.get("author") or {}).get("username") or (r.get("author") or {}).get("display_name") or ""
    display = (r.get("author") or {}).get("display_name") or author
    m = re.search(r"reddit\.com/r/([^/]+)/", r.get("url") or "")
    sub = m.group(1) if (m and src["id"] == "reddit") else None
    rel = "after_freeze" if to_utc(r["created_at"]) > FREEZE else lab["rel"]
    rep = r.get("org_reply") or {}
    raw_text = f"{r.get('title') or ''} {r.get('text') or ''}"
    return {
        "id": r["id"], "native_id": r.get("native_id"), "raw_file": src["file"], "bank": "swedbank", "brand": "swedbank",
        "source": src["id"], "url": r.get("url"), "created_at": to_utc(r["created_at"]),
        "text": redact(r.get("text"), display), "title": redact(r.get("title"), display) or None,
        "parent_id": r.get("parent_id"), "thread_id": r.get("thread_id"),
        "lang": lab.get("lang") or r.get("lang"), "author_hash": h(author or None),
        "author_followers": (r.get("author") or {}).get("followers"), "author_verified": (r.get("author") or {}).get("verified"),
        "engagement": r.get("engagement") or {}, "rating": int(r["rating"]) if r.get("rating") else None,
        "app_name": app.get("name"), "app_id": app.get("store_id"), "app_version": app.get("version"),
        "entity": lab["entity"], "business_hint": None, "subreddit": sub, "source_sub": sub,
        "record_type": r.get("record_type") or ("review" if src["id"] in ("appstore", "playstore", "trustpilot") else "post"),
        "relevant": rel, "scope_reason": lab.get("why"), "collected_at": r.get("collected_at"), "collector": r.get("actor_id"),
        "tag": rel if rel in ("investor_corporate", "group_other") else None,
        "reply": {"text": redact(rep["text"], display), "at": to_utc(rep["replied_at"]) if rep.get("replied_at") else None}
        if rep.get("replied") and rep.get("text") else None,
        # NW-D90: a post addressed to the bank's own handles (read before redaction).
        "addresses_bank": bool(BANK_HANDLE_RE.search(raw_text)),
    }


def main():
    WORK.mkdir(parents=True, exist_ok=True)
    labels = load_labels()
    out, seen, inventory, errors = [], set(), [], []
    for s in SOURCES:
        path = RAW / s["file"]
        rows = read_jsonl(path) if path.exists() else []
        n = 0
        for r in rows:
            if r["id"] in seen:
                errors.append(f"duplicate raw id {r['id']}")
                continue
            seen.add(r["id"])
            lab = labels.get(r["id"])
            if lab is None:
                errors.append(f"raw record without a label: {r['id']}")
                continue
            rec = record(s, r, lab)
            full = f"{rec.get('title') or ''} {rec['text']}"
            rec["names_person"] = bool(PERSON_TAG_RE.search(full))
            rec["alleges_named"] = rec["names_person"] and bool(ALLEGATION.search(full))
            out.append(rec)
            n += 1
        inventory.append({"id": s["id"], "label": s["label"], "loaded": path.exists(), "files": int(path.exists()),
                          "items": n, "start": s["start"], "pulled": len(rows),
                          "on_topic": sum(1 for x in out if x["source"] == s["id"] and x["relevant"] == "on_topic")})
    threads = RAW / REDDIT_THREADS
    if threads.exists():
        extra = [r["id"] for r in read_jsonl(threads) if r["id"] not in seen]
        if extra:
            errors.append(f"reddit threads file holds {len(extra)} records not in the window file (would be lost)")
    stale = sorted(set(labels) - seen)
    if stale:
        errors.append(f"{len(stale)} labels without a raw record, e.g. {stale[:3]}")
    if errors:
        for e in errors[:20]:
            print("normalise ERROR:", e)
        sys.exit(1)
    with open(WORK / "normalised.jsonl", "w", encoding="utf-8", newline="\n") as f:
        for r in out:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    with open(OUT / "sources.json", "w", encoding="utf-8", newline="\n") as f:
        json.dump({"provenance": "public", "raw_dir": "data/raw/swedbank", "sources": inventory}, f, ensure_ascii=False, indent=1)
        f.write("\n")
    for s in inventory:
        print(f"source {s['id']:<10} {'loaded' if s['loaded'] else 'NOT LOADED':<10} pulled={s['pulled']} on_topic={s['on_topic']}")
    c = collections.Counter((r["source"], r["relevant"]) for r in out)
    for k, v in sorted(c.items()):
        print(" ", k, v)
    print("total", len(out), "on topic", sum(1 for r in out if r["relevant"] == "on_topic"))


if __name__ == "__main__":
    main()
