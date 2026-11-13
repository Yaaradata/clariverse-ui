"""NatWest reconcile checks (docs/natwest/brief.md Step 3.10, HL-16, HL-20, HL-21). Exit code 1 on any failure.

On data/out/natwest_pulse/natwest.json (and the public files beside it):
  windows      every window × brand slice is precomputed; every window ends on the freeze date (HL-16, HL-17)
  brands       brand slices sum to the group slice (contacts, complaints, channels, Cora, Ombudsman states, ledger)
  products     product rows sum to the group (contacts, complaints); channel rows sum to the overall contact dial, and
               the overall rates recompute from their parts
  segments     segment rows sum to the group; Consumer Duty outcomes sum to the group's complaints
  ledger       every deliverable row: met + outside = measured
  ombudsman    states sum to the total; pending = within + eligible; at-risk is a subset of pending; product and brand
               rows sum to the total
  cora         back within 7 days <= marked resolved <= conversations, in every journey and in the total
  status       no numerator exceeds its volume; no negative counts (HL-21)
  lumpy        fewer than 30% of the small values shown (under 500) share a common factor above 5 (HL-20)
  public       with no source loaded, no public items, themes or evidence exist (HL-15)

`run(doc, public)` returns the failures; FIXTURES (used by scripts/test_checks.py) each tamper a copy one way and name
the check that must catch it.
"""

from __future__ import annotations

import copy
import json
import math
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "out" / "natwest_pulse"
BRANDS = ("natwest", "rbs", "ulster")


def load():
    doc = json.loads((OUT / "natwest.json").read_text(encoding="utf-8"))
    public = {
        "meta": json.loads((OUT / "meta.json").read_text(encoding="utf-8")),
        "themes": json.loads((OUT / "themes.json").read_text(encoding="utf-8")),
        "evidence": json.loads((OUT / "evidence.json").read_text(encoding="utf-8")),
    }
    return doc, public


def _pct(n, d):
    return round(100 * n / d, 1) if d else None


def run(doc: dict, public: dict) -> list[str]:
    f: list[str] = []
    S = doc["slices"]
    wids = [w["id"] for w in doc["windows"]]
    bids = [b["id"] for b in doc["brands"]]
    # windows
    for w in doc["windows"]:
        if w["end"] != doc["window"]["end"]:
            f.append(f"windows: {w['id']} ends {w['end']}, not on the freeze {doc['window']['end']}")
    for wid in wids:
        for bid in bids:
            if f"{wid}|{bid}" not in S:
                f.append(f"windows: slice {wid}|{bid} not precomputed")
    if f:
        return f
    for wid in wids:
        g = S[f"{wid}|all"]
        parts = [S[f"{wid}|{b}"] for b in BRANDS]
        # brands
        for key in ("contacts", "complaints"):
            tot = sum(p["group"][key] for p in parts)
            if tot != g["group"][key]:
                f.append(f"brands: {wid} {key} brand rows {tot} != group {g['group'][key]}")
        for i, row in enumerate(g["channel"]["rows"]):
            tot = sum(p["channel"]["rows"][i]["volume"] for p in parts)
            if tot != row["volume"]:
                f.append(f"brands: {wid} channel {row['id']} brand rows {tot} != group {row['volume']}")
        for key in ("conversations", "resolved", "back_call", "back_complaint"):
            tot = sum(p["cora"][key] for p in parts)
            if tot != g["cora"][key]:
                f.append(f"brands: {wid} cora {key} brand rows {tot} != group {g['cora'][key]}")
        for i, st in enumerate(g["fos"]["states"]):
            tot = sum(p["fos"]["states"][i]["count"] for p in parts)
            if tot != st["count"]:
                f.append(f"brands: {wid} ombudsman {st['id']} brand rows {tot} != group {st['count']}")
        for i, row in enumerate(g["ledger"]):
            tot = sum(p["ledger"][i]["measured"] for p in parts)
            if tot != row["measured"]:
                f.append(f"brands: {wid} ledger {row['id']} brand rows {tot} != group {row['measured']}")
        if "brand" in g:
            tot = sum(b["complaints"] for b in g["brand"]["brands"])
            if tot != g["group"]["complaints"]:
                f.append(f"brands: {wid} brand lens complaints {tot} != group {g['group']['complaints']}")
        for bid in bids:
            s = S[f"{wid}|{bid}"]
            gr = s["group"]
            # products
            pc = sum(p["complaints"] for p in s["products"].values())
            if pc != gr["complaints"]:
                f.append(f"products: {wid}|{bid} product complaints {pc} != group {gr['complaints']}")
            pt = sum(p["contacts"] for p in s["products"].values())
            if pt != gr["contacts"]:
                f.append(f"products: {wid}|{bid} product contacts {pt} != group {gr['contacts']}")
            rows = {r["id"]: r for r in s["channel"]["rows"]}
            ov = s["channel"]["overall_contacts"]
            cv = sum(rows[c]["volume"] for c in ("calls", "cora", "branch"))
            if cv != ov["volume"] or ov["volume"] != gr["contacts"]:
                f.append(f"products: {wid}|{bid} channel dials {cv} != overall {ov['volume']} / group {gr['contacts']}")
            neg = sum(rows[c]["negative"] for c in ("calls", "cora", "branch"))
            if _pct(neg, cv) != ov["negative_pct"] or ov["negative_pct"] != gr["negative_pct"]:
                f.append(f"products: {wid}|{bid} overall negative {ov['negative_pct']} does not recompute ({_pct(neg, cv)})")
            if rows["complaints"]["volume"] != gr["complaints"]:
                f.append(f"products: {wid}|{bid} complaints channel {rows['complaints']['volume']} != group {gr['complaints']}")
            # segments and duty
            sc = sum(x["contacts"] for x in s["segments"])
            sk = sum(x["complaints"] for x in s["segments"])
            if sc != gr["contacts"] or sk != gr["complaints"]:
                f.append(f"segments: {wid}|{bid} segment rows {sc}/{sk} != group {gr['contacts']}/{gr['complaints']}")
            dk = sum(o["complaints"] for o in s["duty"])
            if dk != gr["complaints"]:
                f.append(f"segments: {wid}|{bid} Consumer Duty outcomes {dk} != group complaints {gr['complaints']}")
            # ledger
            for row in s["ledger"]:
                if row["met"] + row["outside"] != row["measured"]:
                    f.append(f"ledger: {wid}|{bid} {row['id']} met {row['met']} + outside {row['outside']} != measured {row['measured']}")
            # ombudsman
            o = s["fos"]
            st = {x["id"]: x["count"] for x in o["states"]}
            if sum(st.values()) != o["total"]:
                f.append(f"ombudsman: {wid}|{bid} states {sum(st.values())} != total {o['total']}")
            if o["pending"] != st["within"] + st["eligible"]:
                f.append(f"ombudsman: {wid}|{bid} pending {o['pending']} != within + eligible")
            if o["at_risk"] > st["within"]:
                f.append(f"ombudsman: {wid}|{bid} at-risk {o['at_risk']} is not a subset of pending ({st['within']} within time)")
            for key in ("by_product", "by_brand"):
                if sum(x["total"] for x in o[key]) != o["total"]:
                    f.append(f"ombudsman: {wid}|{bid} {key} rows {sum(x['total'] for x in o[key])} != total {o['total']}")
                for x in o[key]:
                    if x["at_risk"] > x["within"]:
                        f.append(f"ombudsman: {wid}|{bid} {key} {x['id']} at-risk exceeds pending")
            # cora
            for j in [s["cora"], *s["cora"]["journeys"]]:
                if not (j["back_call"] + j["back_complaint"] <= j["resolved"] <= j["conversations"]):
                    f.append(f"cora: {wid}|{bid} {j.get('id', 'total')} back {j['back_call'] + j['back_complaint']} / resolved {j['resolved']} / conversations {j['conversations']}")
            # status arithmetic
            for r in s["channel"]["rows"]:
                for k in ("negative", "repeat", "resolved"):
                    if r[k] < 0 or r[k] > r["volume"]:
                        f.append(f"status: {wid}|{bid} channel {r['id']} {k} {r[k]} outside 0..{r['volume']}")
            for lane in s["agents"]["triage"]:
                if lane["released"] + lane["held"] + lane["blocked"] != lane["triaged"]:
                    f.append(f"status: {wid}|{bid} triage {lane['id']} released + held + blocked != triaged")
    f += lumpy(S)
    # public
    m = public["meta"]
    if not m.get("public_loaded"):
        if public["themes"].get("total_items") or public["themes"].get("themes") or public["evidence"]:
            f.append("public: no source is loaded, yet public items, themes or evidence exist (HL-15)")
    return f


def _small_values(o, out):
    if isinstance(o, dict):
        for k, v in o.items():
            if isinstance(v, int) and not isinstance(v, bool) and 0 < v < 500 and k not in ("days",):
                out.append(v)
            else:
                _small_values(v, out)
    elif isinstance(o, list):
        for v in o:
            if isinstance(v, int) and not isinstance(v, bool) and 0 < v < 500:
                out.append(v)
            else:
                _small_values(v, out)


def lumpy(S) -> list[str]:
    vals: list[int] = []
    for s in S.values():
        _small_values(s, vals)
    if len(vals) < 20:
        return []
    for fct in range(6, 51):
        share = sum(1 for v in vals if v % fct == 0) / len(vals)
        # A factor f divides about 1/f of random values; flag a share well above chance and above 30%.
        if share > 0.30 and share > 3 / fct:
            return [f"lumpy: {share:.0%} of {len(vals)} small values share the factor {fct} (HL-20)"]
    return []


def _set(doc, path, fn):
    o = doc
    for p in path[:-1]:
        o = o[p]
    o[path[-1]] = fn(o[path[-1]])


FIXTURES = [
    ("missing slice", "windows:", lambda d, p: d["slices"].pop("week|ulster")),
    ("window not on freeze", "windows:", lambda d, p: d["windows"][0].__setitem__("end", "2026-11-11")),
    ("brand row off", "brands:", lambda d, p: _set(d, ["slices", "w4|rbs", "group", "complaints"], lambda v: v + 7)),
    ("product row off", "products:", lambda d, p: _set(d, ["slices", "w4|all", "products", "mortgages", "complaints"], lambda v: v + 3)),
    ("channel dial off", "products:", lambda d, p: _set(d, ["slices", "week|natwest", "channel", "overall_contacts", "negative_pct"], lambda v: v + 0.4)),
    ("segment row off", "segments:", lambda d, p: _set(d, ["slices", "w13|all", "segments"], lambda v: [{**v[0], "complaints": v[0]["complaints"] + 2}, *v[1:]])),
    ("ledger off", "ledger:", lambda d, p: _set(d, ["slices", "w4|all", "ledger"], lambda v: [{**v[0], "outside": v[0]["outside"] + 1}, *v[1:]])),
    ("at-risk not a subset", "ombudsman:", lambda d, p: _set(d, ["slices", "week|all", "fos", "at_risk"], lambda v: 10**7)),
    ("ombudsman total off", "ombudsman:", lambda d, p: _set(d, ["slices", "w4|ulster", "fos", "total"], lambda v: v + 1)),
    ("cora back exceeds resolved", "cora:", lambda d, p: _set(d, ["slices", "w4|all", "cora", "back_call"], lambda v: 10**8)),
    ("status over volume", "status:", lambda d, p: _set(d, ["slices", "w4|rbs", "channel", "rows"], lambda v: [{**v[0], "repeat": v[0]["volume"] + 1}, *v[1:]])),
    ("lumpy values", "lumpy:", lambda d, p: _set(d, ["slices", "w4|all"], lambda v: {**v, "_fixture": [25 * (i % 19 + 1) for i in range(60000)]})),
    ("synthetic public", "public:", lambda d, p: p["themes"].__setitem__("total_items", 12)),
]


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    doc, public = load()
    fails = run(doc, public)
    for x in fails:
        print("FAIL", x)
    n_slices = len(doc["slices"])
    print(f"check_reconcile (natwest): {n_slices} slices, {len(fails)} failure(s)")
    return 1 if fails else 0


def fixtures() -> tuple[int, list[str]]:
    """Each fixture must trip its check; the untouched data must pass."""
    doc, public = load()
    bad = []
    base = run(doc, public)
    if base:
        bad.append(f"natwest: untouched data must pass, but {len(base)} check(s) failed: {base[:2]}")
    for name, expect, tamper in FIXTURES:
        d, p = copy.deepcopy(doc), copy.deepcopy(public)
        tamper(d, p)
        got = run(d, p)
        ok = any(g.startswith(expect) for g in got)
        print(("PASS " if ok else "FAIL ") + f"NatWest fixture '{name}' trips '{expect}'")
        if not ok:
            bad.append(f"NatWest fixture '{name}' did not trip '{expect}' ({got[:2]})")
    return len(FIXTURES), bad


if __name__ == "__main__":
    sys.exit(main())
