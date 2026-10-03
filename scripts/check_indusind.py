"""IndusInd reconcile and privacy checks (IND-B4 §10, items 1, 3 and 5; the banker sanity ratios). Exit 1 on any failure.

  register    every L1 figure on a page matches its register entry (label, period, display; "pending verification"
              while the value is null)
  reconcile   business row = its module (Cards row = Cards screen; each business row = the home pulse for that
              business); resolved + open + waiting = 100% of received; Ombudsman at-risk states are shares of pending
              and at-risk covers each of them; L3 period-end balances = the register at 31 Mar and 30 Jun 2026
  sanity      reject rate 6-10%; negative share of contacts about 12%; all Internal Ombudsman figures from one register
  home        exactly four tiles; one quiet item from a check that passed; Improving strip from register entries only
  privacy     no URL, handle, email, phone or PAN pattern in any page payload
Run by scripts/hdfc_pipeline/run_all.sh. FIXTURES is used by scripts/test_checks.py: each must trip its check.
"""

from __future__ import annotations

import datetime as dt
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "out" / "indusind_v1"
SEED = ROOT / "data" / "seed" / "indusind_v1"
REG = {e["id"]: e for e in json.loads((ROOT / "data" / "public" / "indusind_register.json").read_text(encoding="utf-8"))["entries"]}
PENDING = "pending verification"
L2_ITEMS = ROOT / "data" / "processed" / "indusind_l2" / "items.jsonl"
INTERNAL = re.compile(r"\bIND-[A-Z]\d|\bDEC-\d|\bS-(?:HOME|DEP|PEER|RISK|CARDS|APPR|VF|MICRO|APP)\b|\bV1\b|\bT[1-6] |"
                      r"\b[NDPHS]\d{2}\b|\bCF-\d|\bIV-\d")
PRIVATE = {
    "url": re.compile(r"https?://|www\.[a-z]"),
    "handle": re.compile(r"(?<![\w.])@[A-Za-z0-9_]{3,}"),
    "email": re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+"),
    "phone": re.compile(r"(?<!\d)[6-9]\d{9}(?!\d)"),
    "pan": re.compile(r"\b[A-Z]{5}\d{4}[A-Z]\b"),
    "long number": re.compile(r"(?<!\d)\d{12,19}(?!\d)"),
}


def load() -> dict:
    return {f.stem: json.loads(f.read_text(encoding="utf-8")) for f in sorted(OUT.glob("*.json"))}


def figures(o, path=""):
    if isinstance(o, dict):
        if "id" in o and "layer" in o:
            yield path, o
        for k, v in o.items():
            yield from figures(v, f"{path}.{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from figures(v, f"{path}[{i}]")


def strings(o, path=""):
    if isinstance(o, dict):
        for k, v in o.items():
            yield from strings(v, f"{path}.{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from strings(v, f"{path}[{i}]")
    elif isinstance(o, str):
        yield path, o


FREEZE_DATE = dt.datetime.fromisoformat(
    json.loads((SEED / "meta.json").read_text(encoding="utf-8"))["freeze"]).date()


def trace_view(f: dict, e: dict) -> str:
    """Recompute a computed view of a register entry: days to go from the freeze, a year-on-year change in words, or a
    from → to pair."""
    if e["value"] is None:
        return PENDING
    if f["view"] == "days":
        n = (dt.date.fromisoformat(e["value"]) - FREEZE_DATE).days
        return f"{n} days" if n > 0 else "in force"
    if f["view"] == "yoy":
        return f"{abs(round(e['value']))}% {'below' if e['value'] < 0 else 'above'}"
    if f["view"] == "pair":
        return f"{REG[f['from_id']]['display']} → {e['display']}"
    return "unknown view"


def run(p: dict) -> list[str]:
    fails: list[str] = []
    ok = lambda cond, msg: None if cond else fails.append(msg)  # noqa: E731

    # ---- register: every L1 figure matches its entry
    for name, obj in p.items():
        for path, f in figures(obj, name):
            if f["layer"] != "L1" or f["id"] not in REG:
                continue
            e = REG[f["id"]]
            want = PENDING if e["value"] is None else e["display"]
            if f.get("view"):
                # A computed view of a register entry: recompute it from the register (the number trace).
                ok(f.get("display") == trace_view(f, e), f"trace: {path} shows {f.get('display')!r}, the register recomputes "
                                                           f"{trace_view(f, e)!r} for {f['id']} ({f['view']})")
                continue
            if "label" in f and "period" in f:
                ok(f["label"] == e["label_short"] and f["period"] == e["period"], f"register: {path} label or period differs from {f['id']}")
            if "derived" not in f:
                ok(f.get("display") == want, f"register: {path} shows {f.get('display')!r}, the register says {want!r} for {f['id']}")

    home, cards = p["home"], p["cards"]
    for wid, w in home["windows"].items():
        rows = {r["id"]: r for r in w["rows"]}
        # ---- business row = module, and = the home pulse filtered to that business
        for k in ("received_index", "open", "over_30"):
            ok(rows["cards"]["inside"][k]["display"] == cards["windows"][wid]["complaints"][k]["display"],
               f"reconcile [{wid}]: Cards row {k} differs from the Cards screen")
            for b in ("deposits", "vehicle", "micro", "cards", "digital"):
                ok(rows[b]["inside"][k]["display"] == w["pulse"][b]["inside"][k]["display"],
                   f"reconcile [{wid}]: {b} row {k} differs from the home pulse for {b}")
        # ---- resolved + open + waiting = received (shares sum to 100)
        for b, blk in w["pulse"].items():
            i = blk["inside"]
            tot = sum(i[k]["value"] or 0 for k in ("resolved", "open", "waiting"))
            ok(abs(tot - 100) <= 0.15, f"reconcile [{wid}/{b}]: resolved + open + waiting = {tot:.1f}%, not 100%")
            o = blk["ombudsman"]
            parts = [o[k]["value"] or 0 for k in ("brink", "eligible", "unhappy")]
            ok((o["at_risk"]["value"] or 0) <= 100.05 and all(x <= (o["at_risk"]["value"] or 0) + 0.05 for x in parts)
               and (o["at_risk"]["value"] or 0) <= sum(parts) + 0.25,  # the states are disjoint; allow rounding
               f"reconcile [{wid}/{b}]: Ombudsman at-risk is not the union of its states within pending")
        # ---- home rules
        ok(len(w["cards"]) == 4, f"home [{wid}]: {len(w['cards'])} tiles, not exactly four")
        q = w["quiet"]
        ok(q is None or q.get("passed") is True, f"home [{wid}]: the quiet item is not from a passed check")
    ok(all(f["id"] in REG for f in home["improving"]), "home: an Improving item is not a register entry")
    ok(home["windows"]["week"]["quiet"] is not None, "home: no quiet item (the computed check did not pass)")
    ci = cards["windows"]["w4"]["issue"]
    ok(abs(sum(ci[k]["value"] for k in ("resolved", "open", "waiting")) - 100) <= 0.15, "reconcile: Cards resolved + open + waiting is not 100%")

    # ---- L3 period-end balances = register at 31 Mar and 30 Jun (pending while the register is)
    dep = p["deposits"]["balances"]
    for date, ids in (("2026-03-31", {"CA": "N05", "SA": "N06", "TD": "D04"}), ("2026-06-30", {"CA": "N03", "SA": "N04", "TD": "D03"})):
        for prod, rid in ids.items():
            ok(dep[date][prod]["id"] == rid, f"reconcile: {prod} at {date} is not bound to {rid}")

    # ---- sanity ratios from the seed (one register for every Internal Ombudsman figure)
    cs = [json.loads(line) for line in open(SEED / "complaints.jsonl", encoding="utf-8")]
    replied = [c for c in cs if c["final_reply_at"]]
    rej = sum(c["outcome"] == "rejected" for c in replied) / max(len(replied), 1)
    ok(0.06 <= rej <= 0.10, f"sanity: reject rate {100 * rej:.1f}% outside 6-10%")
    ok(all(c["decision_at"] for c in cs if c["outcome"] == "rejected"), "sanity: a rejected complaint skipped Internal Ombudsman review")
    weekly = json.loads((SEED / "complaints_weekly.json").read_text(encoding="utf-8"))
    io_weekly = sum(r["referred_to_io"] for r in weekly)
    freeze = dt.datetime.fromisoformat(json.loads((SEED / "meta.json").read_text(encoding="utf-8"))["freeze"])
    io_reg = sum(1 for c in cs if c["decision_at"] and dt.datetime.fromisoformat(c["decision_at"]) <= freeze
                 and dt.datetime.fromisoformat(c["decision_at"]) > freeze - dt.timedelta(days=7 * 27))
    ok(io_weekly == io_reg, f"sanity: Internal Ombudsman referrals in the weekly data ({io_weekly}) differ from the case register ({io_reg})")
    contacts = json.loads((SEED / "contacts_weekly.json").read_text(encoding="utf-8"))
    neg = sum(r["negative"] for r in contacts) / sum(r["contacts"] for r in contacts)
    ok(0.10 <= neg <= 0.14, f"sanity: negative share of contacts {100 * neg:.1f}%, not about 12%")
    ok(all(r["complaints"] <= r["negative"] <= r["contacts"] for r in contacts), "sanity: complaints exceed negative contacts in a row")

    # ---- no internal labels on screen: brief, decision, track or screen IDs, "V1", register IDs in text
    skip = (".id", ".from_id", ".build_note", ".about", ".module", ".card_id", ".action_id", ".evidence_version", ".card")
    for name, obj in p.items():
        for path, s in strings(obj, name):
            if not path.endswith(skip) and INTERNAL.search(s):
                fails.append(f"internal label in {path}: {s[:70]!r}")

    # ---- HL-01: no public item id reaches a page (a page renders paraphrases and counts, never item lists)
    item_ids = {json.loads(line)["id"] for line in open(L2_ITEMS, encoding="utf-8")} if L2_ITEMS.exists() else set()
    for name, obj in p.items():
        for path, s in strings(obj, name):
            if s in item_ids or path.endswith(".evidence") and isinstance(s, str):
                fails.append(f"HL-01: public item id in {path}")

    # ---- HL-19: negative share of internal contacts 9-16% by product; social inbox about 1% of contacts
    by = {}
    inbox = tot_c = 0
    for r in contacts:
        b = by.setdefault(r["product"], [0, 0])
        b[0] += r["negative"]
        b[1] += r["contacts"]
        tot_c += r["contacts"]
        inbox += r["contacts"] if r["channel"] == "social_inbox" else 0
    for prod, (ng, ct) in by.items():
        ok(0.09 <= ng / ct <= 0.16, f"sanity: negative share of {prod} contacts {100 * ng / ct:.1f}%, outside 9-16%")
    ok(0.005 <= inbox / tot_c <= 0.015, f"sanity: social inbox {100 * inbox / tot_c:.1f}% of contacts, not about 1%")
    shares = [ng / ct for ng, ct in by.values()]
    ok(max(shares) - min(shares) >= 0.02, "sanity: negative share is the same for every product (a seed artefact)")

    # ---- HL-20: weighted values must not be lumpy (under 30% of small integers shown share a factor above 5)
    small = [f["value"] for obj in p.values() for _, f in figures(obj)
             if isinstance(f.get("value"), int) and not isinstance(f.get("value"), bool) and 6 <= f["value"] < 500]
    if len(small) >= 20:
        worst = max(range(6, 51), key=lambda k: sum(v % k == 0 for v in small))
        frac = sum(v % worst == 0 for v in small) / len(small)
        ok(frac < 0.30, f"lumpy: {100 * frac:.0f}% of the {len(small)} small values shown are multiples of {worst}")

    # ---- Cards categories must not all move one way (a seed artefact a banker would spot)
    for wid, w in p["cards"]["windows"].items():
        ch = [c["change"]["value"] for c in w["categories"] if c["change"]["value"]]
        up = sum(x > 0 for x in ch)
        ok(not ch or max(up, len(ch) - up) / len(ch) <= 0.8,
           f"cards [{wid}]: {max(up, len(ch) - up)} of {len(ch)} categories move the same way (over 80%)")

    fails += run_l2(p)

    # ---- privacy: no URL, handle or personal-data pattern in any page payload
    for name, obj in p.items():
        for path, s in strings(obj, name):
            for kind, rx in PRIVATE.items():
                if rx.search(s) and not (kind == "url" and path.endswith(".module")):
                    fails.append(f"privacy: {kind} pattern in {path}: {s[:60]!r}")
    return fails


def blocks(o, path=""):
    """Every public-voice block (a dict with by_source) in a payload."""
    if isinstance(o, dict):
        if "by_source" in o:
            yield path, o
        for k, v in o.items():
            yield from blocks(v, f"{path}.{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from blocks(v, f"{path}[{i}]")


def run_l2(p: dict) -> list[str]:
    """Public voice (L2): source dominance footnoted, mid-window series as shares, one store per rating, counts
    reconcile (rows = home total, Deposits row = Deposits screen, Cards row = Cards screen), negative share hidden
    until the sentiment check passes, no claim on fewer than min_items items, every figure registered."""
    import indusind_l2_metrics as M  # noqa: PLC0415

    fails: list[str] = []
    ok = lambda cond, msg: None if cond else fails.append(msg)  # noqa: E731
    lim, flag = M.L2C["min_items"], M.L2C["source_share_flag"]
    registry = json.loads(M.REGISTRY.read_text(encoding="utf-8"))["metrics"] if M.REGISTRY.exists() else {}
    for name, obj in p.items():
        for path, b in blocks(obj, name):
            top = max((x.get("share") or 0 for x in b["by_source"]), default=0)
            ok(top <= 100 * flag or any("%" in f and "of these items" in f for f in b.get("footnotes", [])),
               f"L2 source: {path} has one source at {top}% with no footnote")
            th = b.get("theme") or {}
            ok(th.get("thin", True) or (th["count"]["value"] >= lim and b["items"]["value"] >= lim),
               f"L2 thin: {path} names a top theme on fewer than {lim} items")
        for path, f in figures(obj, name):
            if f["layer"] != "L2":
                continue
            if "negative_share" in f["id"]:
                ok(M.CONFIG["flags"].get("sentiment_check_passed") is True,
                   f"L2 negative: {path} shows a negative share before the sentiment check passed")
            ok(re.sub(r":(?:week|w4|w13)$", "", f["id"]) in registry or "points" in f,
               f"L2 registry: {path} id {f['id']} is not in data/public/indusind_l2_metrics.json")
    stores = {f.get("store") for obj in p.values() for _, f in figures(obj) if f.get("layer") == "L2" and f.get("store")}
    ok(len(stores) <= 1, f"L2 rating: ratings from more than one store compared ({sorted(stores)})")
    for wid, w in p["home"]["windows"].items():
        t = w["outside"].get("trend")
        if t and t.get("starts"):
            a, _ = M.window("w13")
            ok(t["unit"] == "%" or dt.date.fromisoformat(t["starts"]) <= a.date(),
               f"L2 series [{wid}]: the trend starts mid-window ({t['starts']}) but is plotted as {t['unit']}, not shares")
        rows = {r["id"]: r for r in w["rows"]}
        tot = sum(r["outside"]["items"]["value"] for r in w["rows"])
        ok(tot == w["outside"]["items"]["value"], f"L2 reconcile [{wid}]: rows sum to {tot}, home total is {w['outside']['items']['value']}")
        ok(rows["deposits"]["outside"]["items"]["value"] == p["deposits"]["windows"][wid]["why"]["items"]["value"],
           f"L2 reconcile [{wid}]: Deposits row differs from the Deposits screen")
        ok(rows["cards"]["outside"]["items"]["value"] == p["cards"]["windows"][wid]["external"]["items"]["value"],
           f"L2 reconcile [{wid}]: Cards row differs from the Cards screen")
    return fails


def _set(d, path, value):
    *head, last = path
    for k in head:
        d = d[k]
    d[last] = value


FIXTURES = [
    ("register display edited", "register:", lambda p: _set(p["home"]["quarter"]["items"][0], ["display"], "0.87%")),
    ("Cards row out of step", "Cards row", lambda p: _set(p["home"]["windows"]["w4"]["rows"][3]["inside"]["open"], ["display"], "99.9%")),
    ("business row out of step", "row open differs from the home pulse", lambda p: _set(p["home"]["windows"]["w13"]["pulse"]["deposits"]["inside"]["open"], ["display"], "1.0%")),
    ("states do not sum", "resolved + open + waiting", lambda p: _set(p["home"]["windows"]["week"]["pulse"]["all"]["inside"]["waiting"], ["value"], 30.0)),
    ("at-risk below a state", "Ombudsman at-risk", lambda p: _set(p["home"]["windows"]["w4"]["pulse"]["all"]["ombudsman"]["at_risk"], ["value"], 1.0)),
    ("five tiles", "not exactly four", lambda p: p["home"]["windows"]["w4"]["cards"].append(p["home"]["windows"]["w4"]["cards"][0])),
    ("quiet item from a failed check", "quiet item", lambda p: _set(p["home"]["windows"]["w4"]["quiet"], ["passed"], False)),
    ("Improving item not in the register", "Improving", lambda p: p["home"]["improving"].append({"id": "X99"})),
    ("balance bound to the wrong entry", "not bound to", lambda p: _set(p["deposits"]["balances"]["2026-06-30"]["SA"], ["id"], "N06")),
    ("post URL in a payload", "privacy: url", lambda p: _set(p["cards"], ["voice"], {"text": "see https://x.com/a/status/1"})),
    ("author handle in a payload", "privacy: handle", lambda p: _set(p["cards"], ["voice"], {"text": "posted by @someone_here"})),
    ("internal label in a payload", "internal label", lambda p: _set(p["home"]["quarter"]["items"][0], ["period"], "date per IND-D1")),
    ("L2 source over 60% unflagged", "L2 source", lambda p: _set(p["home"]["windows"]["w4"]["outside"], ["footnotes"], [])),
    ("L2 theme on thin data", "L2 thin", lambda p: _set(p["home"]["windows"]["week"]["rows"][0]["outside"], ["theme"],
                                                        {"thin": False, "count": {"value": 3}})),
    ("L2 negative share shown early", "L2 negative", lambda p: p["home"]["windows"]["w4"]["outside"]["by_source"].append(
        {"id": "L2:negative_share:all:w4", "layer": "L2", "value": 60.0, "display": "60.0%"})),
    ("L2 figure not registered", "L2 registry", lambda p: _set(p["home"]["windows"]["w4"]["outside"], ["escalation"],
                                                             {"id": "L2:made_up:all:w4", "layer": "L2", "value": 1, "display": "1"})),
    ("L2 two stores in a rating", "L2 rating", lambda p: _set(p["home"]["windows"]["w13"]["outside"], ["rating2"],
                                                            {"id": "L2:LIVE-02", "layer": "L2", "store": "Apple App Store", "value": 4.1, "display": "4.1"})),
    ("L2 mid-window series as counts", "L2 series", lambda p: _set(p["home"]["windows"]["w13"]["outside"]["trend"], ["unit"], "items")),
    ("L2 rows do not sum", "rows sum to", lambda p: _set(p["home"]["windows"]["w4"]["rows"][5]["outside"]["items"], ["value"], 1)),
    ("L2 Deposits row out of step", "Deposits row differs", lambda p: _set(p["deposits"]["windows"]["w13"]["why"]["items"], ["value"], 7)),
    ("L2 Cards row out of step", "Cards row differs from the Cards screen", lambda p: _set(p["cards"]["windows"]["week"]["external"]["items"], ["value"], 7)),
    ("Cards categories all rising", "categories move the same way", lambda p: [
        _set(c["change"], ["value"], 2.0) for c in p["cards"]["windows"]["w4"]["categories"]]),
    ("public item id in a payload", "HL-01", lambda p: _set(p["home"]["windows"]["w4"]["outside"]["theme"], ["evidence"],
        [json.loads(open(L2_ITEMS, encoding="utf-8").readline())["id"]])),
    ("lumpy values", "lumpy", lambda p: [
        _set(f, ["value"], 75 * (1 + i % 6)) for i, (_, f) in enumerate(x for obj in p.values() for x in figures(obj))
        if isinstance(f.get("value"), int) and not isinstance(f.get("value"), bool) and 6 <= f["value"] < 500]),
    ("computed view out of step", "trace:", lambda p: _set(p["home"]["improving"][0], ["display"], "6.40% → 5.95%")),
    ("phone number in a payload", "privacy: phone", lambda p: _set(p["cards"], ["voice"], {"text": "call 9876543210"})),
]


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    p = load()
    fails = run(p)
    n_fig = sum(1 for obj in p.values() for _ in figures(obj))
    for f in fails:
        print("FAIL", f)
    pending = sum(1 for e in REG.values() if e["value"] is None)
    print(f"check_indusind: {n_fig} bound figures across {len(p)} payloads; {pending} of {len(REG)} register values pending IND-D1; "
          f"{len(fails)} failure(s)")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
