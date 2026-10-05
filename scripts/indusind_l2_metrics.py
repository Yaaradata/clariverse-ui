"""IndusInd public voice (L2) blocks for the page payloads, from data/processed/indusind_l2/ (written by the ingest).

Only core-licence, on-topic, non-duplicate items count. Every figure is {id, layer: "L2", tag, value, display}; every
id is recorded in data/public/indusind_l2_metrics.json (lint 18). Rules:
  - a claim needs `min_items` items in the window, else the slot says "Not enough public items this window";
  - one source above `source_share_flag` of a product's items in a window is footnoted;
  - a series whose source starts mid-window is plotted as shares, never raw counts;
  - a rating comparison uses one store only (only the INDIE Play listing rating is shown);
  - negative share is left out of every payload until config sets `sentiment_check_passed: true`;
  - trust_governance items count, but never set a top theme, an example or a negative share.
Used by scripts/build_indusind.py and scripts/check_indusind.py.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
PROC = ROOT / "data" / "processed" / "indusind_l2"
REGISTRY = ROOT / "data" / "public" / "indusind_l2_metrics.json"
CONFIG = yaml.safe_load((ROOT / "config" / "indusind.yaml").read_text(encoding="utf-8"))
L2C = CONFIG["l2"]
TAG = "Public · live"
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
FREEZE = dt.datetime.fromisoformat(CONFIG["data_freeze"])
SOURCE_LABEL = {"play": "Google Play", "appstore": "Apple App Store", "consumercomplaints": "consumercomplaints.in",
                "illustrative": "Modelled"}
# Illustrative items (scripts/seed_indusind_l2_illustrative.py, IV-64): labelled wherever they count.
TAG_MIXED = "Public"
PLAY_START = None  # first INDIE Play item: the collector's cap cut the window (qa/indusind_l2_profile.md)

BUSINESS_PRODUCTS = {
    "deposits": {"deposits_savings", "fd_rd", "nri"},
    "vehicle": {"vehicle_loans"},
    "micro": {"micro_loans_rural"},
    "cards": {"cards"},
    "personal": {"personal_loans"},
    "digital": {"app_digital"},
    "wholesale": set(),
    "other": {"home_loans", "other"},
}
ALLEGATION_LABEL = {
    "mis_selling_allegation": "Posts alleging mis-selling or bundling (public, unverified)",
    "recovery_conduct_allegation": "Posts alleging recovery-agent conduct (public, unverified)",
}
REGISTERED: dict[str, dict] = {}


ALL: list[dict] = []


def load() -> list[dict]:
    global PLAY_START, ALL
    items = [json.loads(line) for line in open(PROC / "items.jsonl", encoding="utf-8")]
    items = [i for i in items if i["on_topic"] and not i["duplicate_of"]]
    PLAY_START = min(dt.datetime.fromisoformat(i["created_at"]) for i in items if i["source"] == "play")
    ill = PROC.parents[1] / "seed" / "indusind_v1" / "l2_illustrative.jsonl"
    if L2C.get("illustrative", True) and ill.exists():
        items += [json.loads(line) for line in open(ill, encoding="utf-8")]
    ALL = items
    return items


def listing() -> dict | None:
    return json.loads((PROC / "listing.json").read_text(encoding="utf-8")).get("indie_play")


def window(wid: str) -> tuple[dt.datetime, dt.datetime]:
    n = next(w["weeks"] for w in CONFIG["windows"] if w["id"] == wid)
    return FREEZE - dt.timedelta(days=7 * n), FREEZE


def effective_start(wid: str) -> dt.datetime:
    """A window reaching back before the first Google Play review starts at it instead: no total crosses that date."""
    a, _ = window(wid)
    return max(a, PLAY_START) if PLAY_START else a


def clipped(wid: str) -> bool:
    a, _ = window(wid)
    return bool(PLAY_START and PLAY_START > a)


def in_window(items: list[dict], wid: str) -> list[dict]:
    a, b = effective_start(wid), window(wid)[1]
    return [i for i in items if a <= dt.datetime.fromisoformat(i["created_at"]) <= b and
            (clipped(wid) or a < dt.datetime.fromisoformat(i["created_at"]))]


def period_label(wid: str) -> str:
    """The period a public figure covers, named as the window (reviewer, 5 Oct: no start date on screen). Where the
    window reaches back before Google Play starts, the source note behind (i) says counting starts at the first Play
    review; totals still never cross that date."""
    return next(w["label"] for w in CONFIG["windows"] if w["id"] == wid).lower()


def before_play(items: list[dict], wid: str, products: set[str] | None = None) -> list[dict]:
    """Items in the window but before Google Play starts (App Store and forums only): shown apart, never added in."""
    a, _ = window(wid)
    return [i for i in items if a < dt.datetime.fromisoformat(i["created_at"]) < effective_start(wid)
            and (products is None or i["product"] in products)]


def fmt_int(n: int) -> str:
    s = str(n)
    if len(s) <= 3:
        return s
    head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:])
        head = head[:-2]
    if head:
        parts.insert(0, head)
    return ",".join(parts) + "," + tail


def pct(n: int, d: int) -> float | None:
    return round(100 * n / d, 1) if d else None


def fig(fid: str, value, display: str, label: str, definition: str, **extra) -> dict:
    REGISTERED[re.sub(r":(?:week|w4|w13)$", "", fid)] = {"label": label, "definition": definition}
    return {"id": fid, "layer": "L2", "tag": TAG, "value": value, "display": display, "label": label, **extra}


def thin(what: str) -> dict:
    return {"layer": "L2", "tag": TAG, "loaded": True, "thin": True, "text": L2C["not_enough"], "what": what}


def coverage_note(wid: str, sources: set[str]) -> str | None:
    if clipped(wid):
        return (f"Counted from {PLAY_START.day} {PLAY_START:%b}, when Google Play reviews start (the collector's cap). "
                "App Store items before that date are shown apart and not added in.")
    return None


def appstore_note(items_all: list[dict], xs: list[dict]) -> str | None:
    """The App Store's September drop, footnoted wherever App Store items count (read as a collection gap)."""
    if not any(i["source"] == "appstore" for i in xs):
        return None
    aug = sum(1 for i in items_all if i["source"] == "appstore" and i["created_at"][:7] == "2026-08")
    sep = sum(1 for i in items_all if i["source"] == "appstore" and i["created_at"][:7] == "2026-09")
    return (f"App Store: {sep} INDIE reviews in September against {aug} in August, while Google Play rose; "
            "read as a collection gap until re-pulled.")


def source_note(xs: list[dict]) -> tuple[str | None, list[dict]]:
    c = collections.Counter(i["source"] for i in xs)
    n = len(xs)
    if not n:
        return None, []
    top, k = c.most_common(1)[0]
    share = k / n
    if top == "illustrative":
        note = None  # the illustrative note below says it
    else:
        note = (f"{pct(k, n)}% of these items are {SOURCE_LABEL[top]} reviews of the INDIE app."
                if share > L2C["source_share_flag"] else None)
    return note, [{"source": s, "label": SOURCE_LABEL[s], "count": v, "share": pct(v, n)} for s, v in c.most_common()]


def ill_note(xs: list[dict]) -> str | None:
    k = sum(i["source"] == "illustrative" for i in xs)
    return f"{pct(k, len(xs))}% of these items are modelled." if k else None


def mark(block: dict, xs: list[dict]) -> dict:
    """A block that counts illustrative items says so: the count, the mixed tag on every figure, the note first."""
    k = sum(i["source"] == "illustrative" for i in xs)
    block["illustrative"] = k
    if not k:
        return block

    def walk(o):
        if isinstance(o, dict):
            if o.get("tag") == TAG:
                o["tag"] = TAG_MIXED
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(block)
    block["footnotes"] = [ill_note(xs), *[f for f in block.get("footnotes", []) if f]]
    return block


def top_theme(xs: list[dict], scope: str, wid: str, evidence: bool = False) -> dict:
    """The most frequent theme among the scope's non-positive items (trust_governance and very short items out)."""
    # Themes describe what customers complain about, so praise is left out of the pool (it would sit under a complaint
    # paraphrase); trust_governance and very short items are out too.
    pool = [i for i in xs if i["theme"] and "trust_governance" not in i["topic_tags"] and not i["short"]
            and i["sentiment"] != "positive"]
    if len(xs) < L2C["min_items"] or not pool:
        return thin("Top theme")
    theme, k = collections.Counter(i["theme"] for i in pool).most_common(1)[0]
    if k < L2C["min_items"]:
        return thin("Top theme")
    t = L2C["themes"][theme]
    return {"layer": "L2", "tag": TAG, "loaded": True, "thin": False, "theme": theme, "label": t["label"],
            "paraphrase": t["paraphrase"],
            "count": fig(f"L2:theme_items:{scope}:{theme}:{wid}", k, fmt_int(k), f"{t['label']}: items",
                         "On-topic public items in the window carrying this theme"),
            "share": fig(f"L2:theme_share:{scope}:{theme}:{wid}", pct(k, len(xs)), f"{pct(k, len(xs))}%",
                         f"{t['label']}: share of items", "Theme items as a share of the scope's public items"),
            # Source items are for the hand check only (qa/indusind_l2_sample_check.md); a page never receives them.
            **({"evidence": sorted(i["id"] for i in pool if i["theme"] == theme)} if evidence else {})}


def voice_block(xs: list[dict], scope: str, wid: str) -> dict:
    """Public items, by source, escalation language, responded, top theme; negative share only once checked."""
    n = len(xs)
    note, by_src = source_note(xs)
    esc = sum("escalation_language" in i["topic_tags"] for i in xs)
    play = [i for i in xs if i["source"] == "play"]
    resp = sum(1 for i in play if i["responded"])
    a_note = appstore_note(ALL, xs)
    out = {
        "layer": "L2", "tag": TAG, "loaded": True, "thin": n < L2C["min_items"], "text": L2C["not_enough"],
        "items": fig(f"L2:items:{scope}:{wid}", n, fmt_int(n), "Public items", "On-topic public items in the window, core sources"),
        "by_source": [fig(f"L2:items_by_source:{scope}:{s['source']}:{wid}", s["count"], fmt_int(s["count"]), s["label"],
                          "Public items from one source", share=s["share"]) for s in by_src],
        "escalation": fig(f"L2:escalation:{scope}:{wid}", esc, fmt_int(esc), "Escalation language",
                          "Items naming the RBI, the Ombudsman or a court", thin=esc < L2C["min_items"]),
        # Play only (the only store that returns replies); never blended across stores.
        "responded": (fig(f"L2:responded_share:{scope}:{wid}", pct(resp, len(play)), f"{pct(resp, len(play))}%",
                          "Play Store · bank replied", "Share of Google Play reviews with a reply from the bank",
                          n=len(play), n_display=fmt_int(len(play)))
                      if len(play) >= L2C["min_items"] else None),
        "theme": top_theme(xs, scope, wid),
        "footnotes": [x for x in (note, coverage_note(wid, {i["source"] for i in xs}), a_note) if x],
        "clipped_from": PLAY_START.date().isoformat() if clipped(wid) else None,
        "period": period_label(wid),
    }
    if CONFIG["flags"].get("sentiment_check_passed"):
        neg = sum(i["sentiment"] == "negative" for i in xs if "trust_governance" not in i["topic_tags"])
        out["negative"] = fig(f"L2:negative_share:{scope}:{wid}", pct(neg, n), f"{pct(neg, n)}%", "Negative share",
                              "Share of items with negative sentiment")
    return mark(out, xs)


def security_trend(items: list[dict], wid: str = "w13") -> dict:
    """Weekly share of items flagging the app as unsafe. Shares, not counts: Play starts mid-window."""
    a, b = window(wid)
    pts = []
    k = 0
    while True:
        end = b - dt.timedelta(days=7 * k)
        start = end - dt.timedelta(days=7)
        if start < a:
            break
        if PLAY_START and end - PLAY_START < dt.timedelta(days=3):
            break  # weeks mostly before the first Play review are not plotted: the series starts at the marker
        xs = [i for i in items if start < dt.datetime.fromisoformat(i["created_at"]) <= end and i["product"] == "app_digital"]
        v = pct(sum(i["theme"] == "security_block" for i in xs), len(xs)) if len(xs) >= L2C["min_items"] else None
        pts.insert(0, {"end": end.date().isoformat(), "value": v})
        k += 1
    REGISTERED["L2:security_block_share_weekly"] = {"label": "App flagged as unsafe, share of the week's app items",
                                                    "definition": "Weekly share; weeks under the minimum item count are left blank"}
    return {"id": "L2:security_block_share_weekly:digital", "layer": "L2", "unit": "%", "points": pts,
            "starts": PLAY_START.date().isoformat() if PLAY_START else None}


def rating_fig() -> dict | None:
    """LIVE-01, as IND-D1 read it: the India Play listing, dated. The bank's own 4.6 is never shown as a store rating."""
    m = L2C.get("live01")
    if not m:
        return None
    return fig("L2:LIVE-01:indie_play_rating", m["score"], f"{m['score']}", "INDIE listing rating, all-time",
               "Google Play listing rating, India listing, all-time, one store, dated; not a window figure",
               store=m["store"], ratings=None, ratings_display=m["reviews"], as_of=m["as_of"], listing=m["listing"])


def write_registry() -> None:
    REGISTRY.write_text(json.dumps({"about": "Every public (L2) figure shown on the IndusInd pages, by id pattern "
                                    "(the window suffix is dropped). Written by scripts/build_indusind.py.",
                                    "metrics": dict(sorted(REGISTERED.items()))}, ensure_ascii=False, indent=1) + "\n",
                        encoding="utf-8", newline="\n")


TOPIC_LABEL = {
    "rate_offer": "Rate offers",
    "fee_change": "Fees and charges",
    "closure_intent": "Talk of closing the account",
    "app_failure": "App failures",
    "service_delay": "Service delays",
    "escalation_language": "Escalation language",
    "insurance_investment_sales": "Insurance or investment sales",
    "fraud_impersonation": "Fraud and impersonation (customers targeted)",
    **ALLEGATION_LABEL,
}
CARD_SCOPE = {"A": ("deposits", BUSINESS_PRODUCTS["deposits"]), "B": ("all", None),
              "C": ("vehicle", BUSINESS_PRODUCTS["vehicle"]), "D": ("all", None)}


def tag_lines(xs: list[dict], tags: list[str], scope: str, wid: str) -> list[dict]:
    """One line per topic: its count, or the not-enough state when the claim rests on fewer than min_items items."""
    out = []
    for t in tags:
        k = sum(t in i["topic_tags"] for i in xs)
        f = fig(f"L2:topic_items:{scope}:{t}:{wid}", k, fmt_int(k), TOPIC_LABEL[t], "On-topic public items with this topic")
        out.append({"topic": t, "label": TOPIC_LABEL[t], "fig": f, "thin": k < L2C["min_items"]})
    return out


def card_voice(card_id: str, tags: list[str], items: list[dict], wid: str) -> dict:
    scope, products = CARD_SCOPE[card_id]
    xs = [i for i in in_window(items, wid) if products is None or i["product"] in products]
    out = {"layer": "L2", "tag": TAG, "loaded": True, "scope": scope, "text": L2C["not_enough"], "period": period_label(wid),
           "items": fig(f"L2:items:{scope}:{wid}", len(xs), fmt_int(len(xs)), "Public items",
                        "On-topic public items in the window, core sources"),
           "lines": tag_lines(xs, tags, f"card{card_id}", wid),
           "thin": all(line["thin"] for line in tag_lines(xs, tags, f"card{card_id}", wid))}
    if card_id == "A":
        out["theme"] = top_theme(xs, "deposits", wid)
        sw = [i for i in xs if i["peer_mentioned"]]
        out["switching"] = fig(f"L2:peer_mentioned:deposits:{wid}", len(sw), fmt_int(len(sw)), "Items naming a peer bank",
                               "Deposit items that name a peer bank (switching talk)")
        out["switching_thin"] = len(sw) < L2C["min_items"]
    note, _ = source_note(xs)
    out["footnotes"] = [x for x in (note, coverage_note(wid, {i["source"] for i in xs}), appstore_note(ALL, xs)) if x]
    return mark(out, xs)


def business_items(items: list[dict], business: str, wid: str) -> list[dict]:
    ps = BUSINESS_PRODUCTS[business]
    return [i for i in in_window(items, wid) if i["product"] in ps]


def allegations_by_product(items: list[dict], wid: str) -> list[dict]:
    """Allegation-labelled posts and escalation language, by business. Counts only; thin under min_items."""
    out = []
    for b in ("deposits", "vehicle", "micro", "cards", "personal", "digital"):
        xs = business_items(items, b, wid)
        row = {"business": b}
        for t in ("mis_selling_allegation", "recovery_conduct_allegation", "escalation_language"):
            k = sum(t in i["topic_tags"] for i in xs)
            row[t] = fig(f"L2:topic_items:{b}:{t}:{wid}", k, fmt_int(k), TOPIC_LABEL[t], "On-topic public items with this topic")
            row[t]["thin"] = k < L2C["min_items"]
        out.append(row)
    return out


CARD_CATEGORY_LABEL = {"rewards": "Rewards and redemption", "lounge": "Lounge and benefits", "fees": "Fees and charges",
                       "limits": "Limits", "disputes": "Disputes and refunds",
                       "fraud": "Fraud and impersonation (customers targeted)", "applications": "Applications and verification",
                       "activation": "Activation", "closure": "Closure", "app_servicing": "App and card servicing",
                       "emi": "EMI and payments", "cobrand": "Co-brand partners"}


def cards_external(items: list[dict], wid: str) -> dict:
    xs = business_items(items, "cards", wid)
    block = voice_block(xs, "cards", wid)
    cats = collections.Counter(i["card_category"] for i in xs if i["card_category"])
    block["categories"] = [fig(f"L2:card_category_items:{c}:{wid}", k, fmt_int(k), CARD_CATEGORY_LABEL[c],
                               "Public card items in this category", category=c, thin=k < L2C["min_items"])
                           for c, k in cats.most_common()]
    praise = [i for i in xs if i["sentiment"] == "positive" and not i["short"]]
    block["praise"] = {"show": len(praise) >= L2C["min_items"], "count": len(praise)}
    return mark(block, xs)


def before_block(items: list[dict], wid: str, scope: str, products: set[str] | None = None) -> dict | None:
    """The App Store-only items before Google Play starts, for a window that reaches back past it. Not in any total."""
    if not clipped(wid):
        return None
    xs = before_play(items, wid, products)
    return {"from": window(wid)[0].date().isoformat(), "to": PLAY_START.date().isoformat(),
            "items": fig(f"L2:items_before_play:{scope}:{wid}", len(xs), fmt_int(len(xs)),
                         "App Store only, before Google Play starts",
                         "Public items before the first Google Play review; shown apart, never added to a total")}
