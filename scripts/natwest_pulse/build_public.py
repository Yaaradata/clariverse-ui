"""NatWest Group · register (L1), public layer (L2) and the Ask LisN answer bank (docs/natwest/brief.md Steps 3.7, 4).

Run after normalise.py and seed_natwest.py.

L1  data/public/natwest_register.json: one entry per regulatory rule or public figure (id, label, value, basis, source
    title, URL, date). The research pack, the only allowed source, was not supplied (NW-D01): rules and the five
    figures the brief quotes carry status "quoted in brief; source pending research pack" and no URL. Nothing is filled
    from memory. Peers are names only.
L2  data/out/natwest_pulse/{themes,signals,app_pulse,mood,briefing,evidence,products,store_series,responses,periods}.json:
    the public files the copied loader reads. While data/raw/natwest/ is empty they hold no posts, counts, ratings or
    reply rates (HL-15), only the source inventory, so every public tile reads "Public data not yet loaded".
    meta.json carries the freeze, the windows and the scope note.
Ask data/out/natwest_pulse/ask.json: five questions per window × brand, each answer generated from the slice and bound to
    the register, L2 or L3 ids it uses. No model calls.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "out" / "natwest_pulse"
SEED = ROOT / "data" / "seed" / "natwest_pulse"
PUBLIC = ROOT / "data" / "public"
BASE = "/natwest-pulse/v1"
PENDING = "Quoted in brief; source pending research pack"

SCOPE_NOTE = (
    "Retail figures: NatWest, Royal Bank of Scotland and Ulster Bank, on-topic items in the window. Coutts, Mettle and "
    "other group companies are kept in the data and excluded from retail figures."
)

REGISTER = [
    {"id": "REG-DISP-8W", "label": "Final response within 8 weeks", "value": "8 weeks",
     "basis": "FCA complaint-handling rules (DISP): final response, or a holding reply, within 8 weeks of receipt"},
    {"id": "REG-PSD-15", "label": "Payment-services final response", "value": "15 business days (35 in exceptional cases)",
     "basis": "FCA DISP for payment-services complaints"},
    {"id": "REG-FOS-6M", "label": "Time to refer after a final response", "value": "6 months",
     "basis": "Customer may refer to the Financial Ombudsman Service within 6 months of the final response"},
    {"id": "REG-PSR-APP", "label": "Push payment scam reimbursement", "value": "5 business days",
     "basis": "PSR reimbursement requirement for authorised push payment scams"},
    {"id": "REG-CD-OUTCOMES", "label": "Consumer Duty outcomes",
     "value": "Products and services · price and value · consumer understanding · consumer support",
     "basis": "FCA Consumer Duty: the four outcomes"},
    {"id": "REG-H1-COMPLAINTS", "label": "Complaints, H1 2026", "value": "86,498",
     "basis": "NatWest Group complaints return, H1 2026"},
    {"id": "REG-H1-PER1000", "label": "Complaints per 1,000 accounts, H1 2026", "value": "2.74",
     "basis": "NatWest Group complaints return, H1 2026"},
    {"id": "REG-H1-UPHELD", "label": "Complaints upheld, H1 2026", "value": "About 55%",
     "basis": "NatWest Group complaints return, H1 2026"},
    {"id": "REG-H1-3D", "label": "Complaints closed within 3 days, H1 2026", "value": "48%",
     "basis": "NatWest Group complaints return, H1 2026"},
    {"id": "REG-CMA-RBS-APP", "label": "Royal Bank of Scotland: app vs overall service", "value": "66% vs 48%",
     "basis": "CMA service quality survey, August 2026 (measure definition pending research pack)"},
]
PEERS = [
    {"id": "lloyds", "label": "Lloyds", "benchmark": False},
    {"id": "barclays", "label": "Barclays", "benchmark": False},
    {"id": "hsbc_uk", "label": "HSBC UK", "benchmark": False},
    {"id": "santander_uk", "label": "Santander UK", "benchmark": False},
    {"id": "monzo", "label": "Monzo", "benchmark": True},
    {"id": "starling", "label": "Starling", "benchmark": True},
]


def dump(obj, path: Path, indent=1):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(obj, f, ensure_ascii=False, indent=indent)
        f.write("\n")


def register():
    entries = [{**e, "source_title": None, "url": None, "date": None, "status": PENDING} for e in REGISTER]
    dump({"about": "NatWest register (L1). Rules and public figures only; see scripts/natwest_pulse/build_public.py.",
          "entries": entries,
          "peers": [{**p, "figures": None, "status": "Pending research pack (CMA August 2026 survey, FCA H1 2026 returns)"} for p in PEERS]},
         PUBLIC / "natwest_register.json")
    return {e["id"]: e for e in entries}


def public_layer(nw: dict):
    sources = json.loads((OUT / "sources.json").read_text(encoding="utf-8"))["sources"]
    loaded = any(s["loaded"] for s in sources)
    n_items = 0
    work = OUT / "work" / "normalised.jsonl"
    if work.exists():
        n_items = sum(1 for line in open(work, encoding="utf-8") if line.strip())
    empty_note = "Public data not yet loaded"
    dump({"scope": "natwest_group · on_topic · window", "total_items": 0, "basis_items": 0, "weeks": [], "themes": [],
          "pillars": [], "loaded": loaded, "note": empty_note}, OUT / "themes.json")
    for name in ("signals", "app_pulse", "mood", "briefing", "products", "store_series", "responses"):
        dump({"provenance": "public", "loaded": loaded, "note": empty_note}, OUT / f"{name}.json")
    dump({}, OUT / "evidence.json")
    dump({"provenance": "internal", "note": "NatWest windows live in natwest.json"}, OUT / "periods.json")
    dump({"provenance": "internal", "note": "NatWest internal layer lives in data/out/natwest_pulse/natwest.json"}, SEED / "aggregates.json")
    if loaded and n_items:
        # A loaded pull must be aggregated (stratified by source, one store per rating comparison) before it is shown.
        print(f"build_public: {n_items} public items normalised; aggregation is not built yet, so they are not shown")
    w = {x["id"]: x for x in nw["windows"]}
    dump({
        "generated_by": "scripts/natwest_pulse/build_public.py",
        "as_of": nw["freeze"],
        "brief_date": nw["window"]["end"],
        "brief_label": "Data frozen 12 Nov 2026",
        "brief_time": "23:59 GMT",
        "window": nw["window"],
        "windows": nw["windows"],
        "data_freeze": nw["freeze"],
        "freeze_label": nw["freeze_label"],
        "provenance": {"public": "Public · live", "internal": "Internal · illustrative until discovery",
                       "joined": "Joined · needs bank systems"},
        "scope_note": SCOPE_NOTE,
        "records": {"total": n_items, "by_source": {s["id"]: s["items"] for s in sources}, "window": 0,
                    "bank_on_topic_window": 0, "group_on_topic_window": 0, "classified_by": {}},
        "sources": sources,
        "public_loaded": loaded and n_items > 0,
        "bank_by_source": {},
        "streams": [],
        "trend_basis_streams": [],
        "baseline_streams": [],
        "coverage_notes": [f"{s['label']}: not loaded" for s in sources if not s["loaded"]],
        "icici_available": False,
        "default_window": nw["default_window"],
        "this_week": f"{w['week']['start']} to {w['week']['end']}",
    }, OUT / "meta.json")
    return loaded and n_items > 0


def f0(n):
    return f"{n:,}" if n is not None else "—"


def p1(n):
    return f"{n:.1f}%" if n is not None else "—"


def ask(nw: dict, reg: dict, public_loaded: bool):
    out = {"about": "Ask LisN answer bank: five questions per window and brand, generated from natwest.json. No model calls.",
           "fallback": "I'd need your data for that. Here is what I'd look at: the cross-channel pulse, Cora leakage and the Ombudsman watch.",
           "slices": {}}
    wl = {w["id"]: w["label"].lower() for w in nw["windows"]}
    for key, s in nw["slices"].items():
        wid, bid = key.split("|")
        span = wl[wid]
        ch = {r["id"]: r for r in s["channel"]["rows"]}
        cora, fos, duty = s["cora"], s["fos"], s["duty"]
        j = cora["journeys"][0]
        worst_outcome = max(duty, key=lambda o: o["negative_pct"] or 0)
        seg = max(worst_outcome["segments"], key=lambda x: x["complaints_per_100k"])
        qs = [
            {"id": "cross_channel", "q": "Where is the customer experience leaking across channels?",
             "answer": (f"In the {span}, {f0(ch['calls']['volume'])} calls, {f0(ch['cora']['volume'])} Cora conversations, "
                        f"{f0(ch['branch']['volume'])} branch contacts and {f0(ch['complaints']['volume'])} complaints. "
                        f"Repeat within 7 days is highest on {max(('calls', 'cora', 'branch'), key=lambda c: ch[c]['repeat_pct'] or 0).replace('cora', 'Cora')}. "
                        + ("Public voice is shown separately." if public_loaded else "Public data not yet loaded.")),
             "table": {"head": ["Channel", "Volume", "Negative", "Repeat 7d", "Resolved first time"],
                       "rows": [[r["label"], f0(r["volume"]), p1(r["negative_pct"]), p1(r["repeat_pct"]), p1(r["resolved_pct"])] for r in s["channel"]["rows"]]},
             "link": {"label": "Open the cross-channel pulse", "href": f"{BASE}/satisfaction?w={wid}&b={bid}"},
             "bound": ["L3:channel.rows"] + (["L2:sources"] if not public_loaded else [])},
            {"id": "cora_leakage", "q": "Which Cora journeys come back as a call or complaint?",
             "answer": (f"{p1(cora['leakage_pct'])} of journeys Cora marked resolved came back within 7 days "
                        f"({f0(cora['back_call'])} calls, {f0(cora['back_complaint'])} complaints). Largest: {j['label']}, "
                        f"{p1(j['leakage_pct'])}."),
             "table": {"head": ["Journey", "Resolved by Cora", "Back in 7 days", "Leakage"],
                       "rows": [[x["label"], f0(x["resolved"]), f0(x["back_call"] + x["back_complaint"]), p1(x["leakage_pct"])] for x in cora["journeys"][:5]]},
             "link": {"label": "Open Cora leakage", "href": f"{BASE}/module/cora_digital?w={wid}&b={bid}"},
             "bound": ["L3:cora.journeys"]},
            {"id": "fos_risk", "q": "How many complaints could reach the Financial Ombudsman Service?",
             "answer": (f"As at {fos['as_at']}: {f0(fos['pending'])} complaints await a final response, {f0(fos['at_risk'])} of "
                        f"them within a week of the time limit; {f0(fos['states'][2]['count'])} are past it and eligible to refer. "
                        f"Eligibility and risk only; LisN does not predict who will refer."),
             "table": {"head": ["State", "Complaints"], "rows": [[x["label"], f0(x["count"])] for x in fos["states"]]},
             "link": {"label": "Open the Ombudsman watch", "href": f"{BASE}/service-promise?w={wid}&b={bid}"},
             "bound": ["L3:fos.states", "REG-DISP-8W", "REG-PSD-15", "REG-FOS-6M"]},
            {"id": "consumer_duty", "q": "What is the Consumer Duty evidence by segment?",
             "answer": (f"{worst_outcome['label']} has the highest negative share ({p1(worst_outcome['negative_pct'])}); "
                        f"{seg['label']} customers raise {seg['complaints_per_100k']:.1f} complaints per 100,000 on it."),
             "table": {"head": ["Outcome", "Negative", "Complaints"],
                       "rows": [[o["label"], p1(o["negative_pct"]), f0(o["complaints"])] for o in duty]},
             "link": {"label": "Open Consumer Duty outcomes", "href": f"{BASE}/priority?w={wid}&b={bid}"},
             "bound": ["L3:duty", "REG-CD-OUTCOMES"]},
        ]
        if "brand" in s:
            bs = s["brand"]["brands"]
            hi = max(bs, key=lambda x: x["complaints_per_100k"])
            qs.append({"id": "brand_gap", "q": "Where is the gap between our brands?",
                       "answer": (f"{hi['label']} has the most complaints per 100,000 customers ({hi['complaints_per_100k']:.1f}). "
                                  f"Royal Bank of Scotland app {reg['REG-CMA-RBS-APP']['value']} overall (CMA, August 2026)."),
                       "table": {"head": ["Brand", "Complaints per 100k", "Upheld", "Cora leakage"],
                                 "rows": [[x["label"], f"{x['complaints_per_100k']:.1f}", p1(x["upheld_pct"]), p1(x["cora_leakage_pct"])] for x in bs]},
                       "link": {"label": "Open the brand lens", "href": f"{BASE}/market?w={wid}"},
                       "bound": ["L3:brand.brands", "REG-CMA-RBS-APP"]})
        else:
            qs.append({"id": "brand_gap", "q": "Where is the gap between our brands?",
                       "answer": "The brand lens compares all three brands; switch the brand filter to All brands.",
                       "link": {"label": "Open the brand lens", "href": f"{BASE}/market?w={wid}"},
                       "bound": ["REG-CMA-RBS-APP"]})
        out["slices"][key] = qs
    dump(out, OUT / "ask.json")


def main():
    nw = json.loads((OUT / "natwest.json").read_text(encoding="utf-8"))
    reg = register()
    public_loaded = public_layer(nw)
    ask(nw, reg, public_loaded)
    print(f"build_public: register {len(reg)} entries, {len(PEERS)} peers; public loaded = {public_loaded}; ask.json written")


if __name__ == "__main__":
    main()
