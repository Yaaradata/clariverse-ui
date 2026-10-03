"""Profile the raw IndusInd public-voice scrape before any use: writes qa/indusind_l2_profile.md.

Counts, dates, artefacts and the licence check only. No text, no handle, no URL is written (the raw scrape lives
outside the repo; see scripts/indusind_l2_common.py).
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import sys

import indusind_l2_common as L

OUT = L.ROOT / "qa" / "indusind_l2_profile.md"


def week_end(t: dt.datetime) -> dt.date:
    """Weeks end on the freeze weekday (Friday) at 18:00 IST, counting back from the freeze."""
    k = -((L.FREEZE - t) // dt.timedelta(days=7))
    return (L.FREEZE + dt.timedelta(days=7 * k)).date() if t <= L.FREEZE else L.FREEZE.date()


def table(head: list[str], rows: list[list]) -> str:
    out = ["| " + " | ".join(head) + " |", "|" + "|".join("---" for _ in head) + "|"]
    out += ["| " + " | ".join(str(c) for c in r) + " |" for r in rows]
    return "\n".join(out)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    rows = L.load_raw()
    for r in rows:
        r["_t"] = L.created(r)
        r["_text"] = " ".join(x for x in (r.get("title"), r.get("text")) if x)
        r["_product"], _ = L.product_of(r, r["_text"])
        r["_off"] = L.off_topic(r["_text"])
        r["_hash"] = L.text_hash(r["_text"])
        r["_author"] = L.hash_handle(r)
    md = ["# IndusInd · public voice (L2) profile", "",
          f"Raw scrape: outside the repo (`INDUSIND_L2_RAW`, default `../indusind_inputs/social_raw/{L.RAW.name}`), "
          "never committed. Window: 1 Jul 2026 to the data freeze (2 Oct 2026, 18:00 IST). This file holds counts and "
          "dates only: no text, handle or URL.", ""]

    # ---- inventory
    md += ["## 1. Inventory", ""]
    inv = collections.defaultdict(list)
    for r in rows:
        key = (r["source"], r["app"]["name"] if isinstance(r.get("app"), dict) else "")
        inv[key].append(r)
    fields = {}
    for r in rows:
        fields.setdefault(r["source"], set()).update(
            f"{k}.{k2}" if isinstance(v, dict) else k for k, v in r.items() if not k.startswith("_") and k not in ("source", "bucket", "exclusion")
            for k2 in (v.keys() if isinstance(v, dict) else [None]))
    md.append(table(["Source", "App or site", "Bank", "Bucket", "Rows", "Earliest (IST)", "Latest (IST)", "Collector"],
                    [[L.SOURCE_LABEL[s], a or "—", "indusind", xs[0]["bucket"], len(xs),
                      min(x["_t"] for x in xs).date(), max(x["_t"] for x in xs).date(),
                      ", ".join(sorted({x.get("actor_id", "") for x in xs}))]
                     for (s, a), xs in sorted(inv.items(), key=lambda kv: (kv[1][0]["bucket"], -len(kv[1])))]))
    md += ["", "**Peer apps:** IND-B3 asks for the core peers' main retail apps on Play and the App Store. The pull has "
           "none: the developer of every app in it is IndusInd Bank Ltd. (INDIE, INDIE For Business, BHIM IndusPay, "
           "IndusDIRECT Corporate, Video Branch, Gift City, PayWear, IndusFX Card) or a group insurer (IndusInd General "
           "Insurance, IndusInd Nippon Life). Peer rows: 0. IndusInd apps outside the B3 list: 892 rows; group "
           "insurers: 372 rows; both stay excluded. Peer voice stays not loaded until peer apps are pulled.", "",
           "Fields present, per source:", ""]
    for s, fs in sorted(fields.items()):
        md.append(f"- **{L.SOURCE_LABEL[s]}:** {', '.join(sorted(x.replace('.None', '') for x in fs))}")

    # ---- licence
    md += ["", "## 2. Licence check (IND-B3 §7 sources table)", ""]
    lic = collections.Counter((r["source"], r["bucket"], r.get("exclusion") or "") for r in rows)
    md.append(table(["Source", "Bucket", "Reason", "Rows"],
                    [[L.SOURCE_LABEL[s], b, e or "allowed in core", n] for (s, b, e), n in sorted(lic.items(), key=lambda x: (x[0][1], -x[1]))]))
    pend = [r for r in rows if r["bucket"] == "pending"]
    md += ["", f"**Pending licence decision: {len(pend):,} rows** "
           f"({', '.join(f'{L.SOURCE_LABEL[s]} {n:,}' for s, n in collections.Counter(r['source'] for r in pend).most_common())}). "
           "Not on any screen. Collection method recorded in the scrape: X via an Apify tweet-scraper actor; Reddit via two "
           "Apify archive-scraper actors; MouthShut via a local forum scraper. Ranjith decides; if X moves to a named paid "
           "API tier and Reddit to the official API, re-pull rather than reuse these rows.",
           "", "**Out:** TechnoFino and Trustpilot rows are dropped at ingest and never stored.", ""]

    # ---- weekly counts
    md += ["## 3. Counts per source × week (week to Friday 18:00 IST)", ""]
    weeks = sorted({week_end(r["_t"]) for r in rows})
    srcs = sorted({(r["source"], r["bucket"]) for r in rows}, key=lambda x: (x[1], x[0]))
    wk = collections.Counter((r["source"], week_end(r["_t"])) for r in rows if r["bucket"] in ("core", "pending"))
    md.append(table(["Week to"] + [f"{L.SOURCE_LABEL[s]} ({b})" for s, b in srcs if b in ("core", "pending")],
                    [[w.strftime("%-d %b").lstrip("0") if False else f"{w.day} {w:%b}"] + [wk.get((s, w), 0) for s, b in srcs if b in ("core", "pending")]
                     for w in weeks]))
    md += ["", "Core counts above are INDIE only for Play and the App Store.", ""]

    # ---- product
    md += ["## 4. Counts per source × product (rule tagging, before review)", ""]
    pc = collections.Counter((r["source"], r["_product"]) for r in rows if r["bucket"] in ("core", "pending") and not r["_off"])
    prods = [p for p, _ in L.PRODUCT_RULES] + ["other"]
    md.append(table(["Product"] + [L.SOURCE_LABEL[s] for s, b in srcs if b in ("core", "pending")],
                    [[p] + [pc.get((s, p), 0) for s, b in srcs if b in ("core", "pending")] for p in prods]))

    # ---- gaps and artefacts
    md += ["", "## 5. Gaps and artefacts", ""]
    for s, b in srcs:
        if b not in ("core", "pending"):
            continue
        xs = [r for r in rows if r["source"] == s and r["bucket"] == b]
        days = collections.Counter(r["_t"].date() for r in xs)
        d0, d1 = dt.date(2026, 7, 1), dt.date(2026, 9, 30)
        zero = [d0 + dt.timedelta(days=i) for i in range((d1 - d0).days + 1) if days.get(d0 + dt.timedelta(days=i), 0) == 0]
        first = min(days)
        runs = []
        for d in zero:
            if runs and (d - runs[-1][1]).days == 1:
                runs[-1][1] = d
            else:
                runs.append([d, d])
        long_runs = [f"{a.day} {a:%b}–{z.day} {z:%b}" for a, z in runs if (z - a).days >= 6]
        md.append(f"- **{L.SOURCE_LABEL[s]} ({b}):** {len(xs):,} rows; first item {first.day} {first:%b}; "
                  f"{len(zero)} zero days in 1 Jul–30 Sep" + (f"; empty runs of a week or more: {', '.join(long_runs)}" if long_runs else ""))
    md += ["- **Google Play, INDIE: capped run.** The collector stopped at its 5,000-review cap (newest first), so INDIE Play "
           "covers 10 Aug–30 Sep only. 1 Jul–9 Aug is missing: a mid-window start. Play series are plotted as shares, "
           "and every Play count for a window that starts before 10 Aug is footnoted.",
           "- **Apple App Store: thin September.** 210 INDIE reviews in August, 16 in September (two collector slices). "
           "Read as a collection artefact until re-pulled.",
           "- **Sudden jumps.** X: 660 items in the week to 2 Oct and 322 in the week to 24 Jul, against about 100 in a "
           "typical week (event or campaign spikes; pending anyway). App Store: 136 in the week to 7 Aug against 0–35 "
           "in the other weeks (a collector slice boundary).",
           "- **Data ends 30 Sep.** The freeze is 2 Oct, 18:00 IST; \"this week\" (26 Sep–2 Oct) holds five days of data.",
           "- **Play reply dates.** Some bank replies are dated before the review (Play keeps the first reply date when a "
           "review is edited). `responded` uses the reply flag only, not the gap.",
           "- **No reply data** for the App Store, X, Reddit or the forums: `responded` is not available there."]
    oow = [r for r in rows if not (L.WINDOW_START <= r["_t"] <= L.FREEZE)]
    md.append(f"- **Out-of-window dates:** {len(oow)} rows" + (f" ({', '.join(f'{L.SOURCE_LABEL[s]} {n}' for s, n in collections.Counter(r['source'] for r in oow).items())})" if oow else "") + ".")
    # duplicates
    long_ = [r for r in rows if r["bucket"] in ("core", "pending") and len(r["_text"]) >= 30]
    by_hash = collections.defaultdict(list)
    for r in long_:
        by_hash[r["_hash"]].append(r)
    within = sum(len(v) - 1 for v in by_hash.values() if len(v) > 1 and len({x["source"] for x in v}) == 1)
    across = sum(1 for v in by_hash.values() if len({x["source"] for x in v}) > 1)
    multi_author = sum(1 for v in by_hash.values() if len({x["_author"] for x in v}) >= 3)
    md.append(f"- **Duplicates (text hash, items of 30+ characters):** {within} repeat rows within a source; {across} texts "
              f"appear on more than one platform; {multi_author} texts posted by three or more authors (copy-paste or bot pattern).")
    auth = collections.Counter((r["source"], r["_author"]) for r in rows if r["bucket"] in ("core", "pending"))
    heavy = collections.Counter(s for (s, _), n in auth.items() if n >= 15)
    md.append(f"- **Heavy posters (15+ items from one author):** {', '.join(f'{L.SOURCE_LABEL[s]} {n} authors' for s, n in heavy.items()) or 'none'}. "
              "None is the bank's own handle (it has no posts in the pull). X and Reddit are pending, so no heavy poster reaches a screen.")
    offc = collections.Counter((r["source"], r["_off"]) for r in rows if r["bucket"] in ("core", "pending") and r["_off"])
    md.append(f"- **Off-topic (rules):** {', '.join(f'{L.SOURCE_LABEL[s]} {k} {n}' for (s, k), n in sorted(offc.items())) or 'none'}.")
    short = sum(1 for r in rows if r["bucket"] == "core" and len(r["_text"].strip()) < 15)
    md.append(f"- **Very short core items (<15 characters, e.g. \"good\"):** {short:,}. Kept for counts and ratings; never "
              "used as an example or theme evidence.")

    # ---- schema map
    md += ["", "## 6. Schema map (IND-B3 §7 field → raw field)", ""]
    md.append(table(["IND-B3 field", "Play", "App Store", "consumercomplaints.in", "X / Reddit (pending)"], [
        ["bank", "derive (query set: IndusInd only)", "derive", "derive", "derive"],
        ["language", "derive from script (raw `lang` is the request language)", "derive", "`lang`", "`lang` (X); derive (Reddit)"],
        ["product", "derive (rules)", "derive (rules)", "derive (rules)", "derive (rules)"],
        ["topic_tags", "derive (rules)", "derive (rules)", "derive (rules)", "derive (rules)"],
        ["peer_mentioned", "derive", "derive", "derive", "derive"],
        ["reach", "not available", "not available", "not available", "`engagement.views` (X only); followers never used"],
        ["responded", "`org_reply.replied`", "not available", "not available", "not available"],
        ["on_topic", "derive (rules)", "derive", "derive", "derive"],
        ["english_gloss", "written for Hindi items", "—", "—", "—"],
        ["appVersion", "`app.version`", "`app.version`", "—", "—"],
        ["rating", "`rating`", "`rating`", "—", "—"],
        ["author handle", "hashed (`author.id`)", "hashed", "hashed", "hashed"],
        ["post URL", "audit file only, gitignored", "audit only", "audit only", "audit only"],
    ]))
    md += ["", "## 7. Listing metadata (LIVE-01)", "",
           "The Play run returned dated INDIE listing metadata (score, ratings count, review count, last update) with "
           "the scrape time (1 Oct 2026). It is used for the INDIE Play rating, dated to the scrape. The App Store run "
           "returned no listing metadata.", ""]
    OUT.write_text("\n".join(md) + "\n", encoding="utf-8", newline="\n")
    print(f"profile_indusind_l2: {len(rows):,} raw rows; core {sum(r['bucket'] == 'core' for r in rows):,}; "
          f"pending {len(pend):,}; written {OUT.relative_to(L.ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
