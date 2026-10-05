"""Write qa/indusind_l2_sample_check.md: the 100-item hand check and every top theme with its source items.

No free text goes in the file (reviews name people). To read an item, run locally:
  python scripts/sample_check_indusind_l2.py show <item id> [<item id> ...]
which prints the redacted text from the gitignored data/processed/indusind_l2/_audit/text.jsonl.
"""

from __future__ import annotations

import collections
import json
import sys

import indusind_l2_metrics as M

ROOT = M.ROOT
SAMPLE = ROOT / "scripts" / "indusind_l2_sample.json"
TEXT = ROOT / "data" / "processed" / "indusind_l2" / "_audit" / "text.jsonl"
OUT = ROOT / "qa" / "indusind_l2_sample_check.md"
BUSINESS = {"deposits": "Deposits", "vehicle": "Vehicle finance", "micro": "Micro loans and rural", "cards": "Cards",
            "personal": "Personal loans", "digital": "Digital"}


def show(ids: list[str]) -> None:
    items = {json.loads(line)["id"]: json.loads(line) for line in open(M.PROC / "items.jsonl", encoding="utf-8")}
    text = {json.loads(line)["id"]: json.loads(line)["text"] for line in open(TEXT, encoding="utf-8")}
    for i in ids:
        it = items[i]
        print(f"{i} · {it['source']} · {it['product']} · {','.join(it['topic_tags']) or '-'} · {it['theme'] or '-'} · {it['sentiment']}")
        print("   ", it.get("english_gloss") or text.get(i, "(text not found: run the ingest)"))


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if len(sys.argv) > 2 and sys.argv[1] == "show":
        show(sys.argv[2:])
        return 0
    s = json.loads(SAMPLE.read_text(encoding="utf-8"))
    items = {json.loads(line)["id"]: json.loads(line) for line in open(M.PROC / "items.jsonl", encoding="utf-8")}
    ill = M.ROOT / "data" / "seed" / "indusind_v1" / "l2_illustrative.jsonl"
    if ill.exists():  # illustrative items (IV-64) carry no text; they are listed by id and source only
        items.update({json.loads(line)["id"]: json.loads(line) for line in open(ill, encoding="utf-8")})
    pre = s["prescore"]
    acc = {k: sum(pre[i][k] == "ok" for i in s["sample"]) for k in ("product", "topics", "sentiment")}
    md = ["# IndusInd · public voice: hand check", "",
          "**Status: not yet verified by a person.** Nothing here is approved for demo use until someone confirms it. "
          "Negative share stays hidden on every screen until `flags.sentiment_check_passed` is set to `true` in "
          "`config/indusind.yaml`, by that person, not by a script.", "",
          "The file carries labels only, never review text (reviews name staff and family members). To read an item, "
          "run `python scripts/sample_check_indusind_l2.py show <id>` on a machine that has run the ingest.", "",
          "## Claude's pre-score (to be confirmed)", "",
          f"- Product: {acc['product']} of 100 correct.",
          f"- Topics (all tags on the item right, none missing): {acc['topics']} of 100.",
          f"- Sentiment (from the star rating on store reviews): {acc['sentiment']} of 100. The misses are store "
          "reviews whose stars contradict the text (five stars on \"not working\").",
          "- Typical product misses: account, branch or loan comments posted as app reviews are labelled Digital by "
          "the default rule.", "",
          "## 1. 100 random on-topic items", "",
          "| # | Item | Source | Product | Topics | Theme | Sentiment | Product check | Topics check | Sentiment check | Person: agree? |",
          "|---|---|---|---|---|---|---|---|---|---|---|"]
    for n, i in enumerate(s["sample"], 1):
        it = items[i]
        md.append(f"| {n} | `{i}` | {M.SOURCE_LABEL[it['source']]} | {it['product']} | {', '.join(it['topic_tags']) or '—'} | "
                  f"{it['theme'] or '—'} | {it['sentiment']} | {pre[i]['product']} | {pre[i]['topics']} | {pre[i]['sentiment']} | |")
    md += ["", "## 2. Top themes on screen, with their source items", "",
           "Each theme's paraphrase is written by hand (`config/indusind.yaml`, `l2.themes`). Check that it is fair to "
           "the items listed. Only themes resting on at least 15 items reach a screen.", ""]
    L2 = M.load()
    for wd in M.CONFIG["windows"]:
        wid = wd["id"]
        md += [f"### {wd['label']}", ""]
        for b, label in BUSINESS.items():
            xs = M.business_items(L2, b, wid)
            th = M.top_theme(xs, b, wid, evidence=True)
            if th.get("thin"):
                md.append(f"- **{label}:** {len(xs)} items. {M.L2C['not_enough']}.")
                continue
            ev = th["evidence"]
            md.append(f"- **{label}:** {th['label']}: \"{th['paraphrase']}\". {th['count']['display']} of {len(xs)} items. "
                      f"Source items ({len(ev)}): " + ", ".join(f"`{e}`" for e in ev[:20]) + (" …" if len(ev) > 20 else ""))
        md.append("")
    md += ["## 3. Not shown", "",
           "- Negative share: hidden until the sentiment check above is confirmed.",
           "- \"Where customers praise us\" (Cards): shown only with 15 or more positive card items in the window; "
           f"the last 13 weeks hold {sum(1 for i in L2 if i['product'] == 'cards' and i['sentiment'] == 'positive' and not i['short'])}.",
           "- Allegation-labelled posts: no window reaches 15 items for any business, so every slot reads "
           f"\"{M.L2C['not_enough']}\".", ""]
    tags = collections.Counter(t for i in L2 for t in i["topic_tags"])
    md += ["## 4. Topic counts, all core on-topic items (Jul–Sep)", "",
           "| Topic | Items |", "|---|---|"] + [f"| {t} | {n:,} |" for t, n in tags.most_common()]
    OUT.write_text("\n".join(md) + "\n", encoding="utf-8", newline="\n")
    print(f"sample_check_indusind_l2: written {OUT.relative_to(ROOT)}; pre-score product {acc['product']}, "
          f"topics {acc['topics']}, sentiment {acc['sentiment']} of 100")
    return 0


if __name__ == "__main__":
    sys.exit(main())
