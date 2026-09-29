#!/usr/bin/env python3
"""
check_mock.py — verifies data/*.json against 05a_Data_Contract.md §6 (checks 1–10) plus:
  E1 JSON matches the TypeScript interfaces (required keys, no unknown keys; tsc --strict when available)
  E2 house-style strings (LiSN spelling, "resolve", "!", "FCI", other retired words)
  E3 every money value has a currency
  E4 no USD + GBP sums
  E5 synthetic IDs only
  E6 tokens resolve and Anonymise ON leaves no real name
  E7 GEN constraints (daily volumes, cutover baselines, date-code units, bands, markers, ranks)
  E8 exec / value copy is verbatim from 02
  E9 arithmetic behind copy (derived 4.0 rates, P-F share, ratios printed in copy, no reused "212")
Writes check_report.txt next to this file. Exit code 0 = all pass.
Python 3 stdlib only (tsc is used if found on PATH).
"""
import datetime as dt
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
DOC02 = os.path.join(HERE, "..", "02_Requirements_Pain_Value.md")
TYPES = os.path.join(HERE, "types.ts")

FILES = ["meta.json", "exec.json", "monitor.json", "signal_fw41.json", "installedBase.json", "channel.json",
         "separation.json", "anonymise.json", "askLisn.json"]
D = {f: json.load(open(os.path.join(DATA, f), encoding="utf-8")) for f in FILES}
ANON = D["anonymise.json"]
meta, ex, mon, hero, ib, ch, sep, ask = (D["meta.json"], D["exec.json"], D["monitor.json"], D["signal_fw41.json"],
                                         D["installedBase.json"], D["channel.json"], D["separation.json"], D["askLisn.json"])
TOKEN_RE = re.compile(r"\{\{([a-z]+):([^{}]+)\}\}")

# ---------------------------------------------------------------------------
results = []   # (id, title, ok, details[])


def check(cid, title):
    def deco(fn):
        details = []
        try:
            ok = fn(details)
        except AssertionError as e:
            ok = False
            details.append(f"assertion failed: {e}")
        except Exception as e:  # noqa
            ok = False
            details.append(f"error: {type(e).__name__}: {e}")
        results.append((cid, title, bool(ok), details))
        return fn
    return deco


def expect(cond, msg, details):
    details.append(("ok   " if cond else "FAIL ") + msg)
    return bool(cond)


def render(s, anon=False):
    def rep(m):
        kind, key = m.group(1), m.group(2)
        e = ANON.get(kind, {}).get(key)
        return (e["anon"] if anon else e["named"]) if e else key
    return TOKEN_RE.sub(rep, s)


def walk(obj, path=""):
    """yield (path, key, value) for every scalar."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk(v, f"{path}.{k}" if path else k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk(v, f"{path}[{i}]")
    else:
        yield path, path.split(".")[-1].split("[")[0], obj


def walk_keys(obj, path=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            p = f"{path}.{k}" if path else k
            yield p, k
            yield from walk_keys(v, p)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_keys(v, f"{path}[{i}]")


def strings(files=None):
    for f in (files or FILES):
        for p, k, v in walk(D[f]):
            if isinstance(v, str):
                yield f, p, v


def num(s):
    return float(s.replace(",", ""))


def week_of(iso):
    d = dt.date.fromisoformat(iso[:10])
    return (d - dt.date(2026, 3, 30)).days // 7 + 1


SIG = {s["id"]: s for s in mon["signals"]}
ABOVE = [s for s in mon["signals"] if s["aboveThreshold"]]
VR = {v["id"]: v for v in ex["valueRegister"]}


# ===========================================================================
# 05a §6 checks
# ===========================================================================
@check("C1", "Volumes")
def c1(d):
    ok = expect(sum(meta["weeklyInteractions"]) == 233900, f"Σ weeklyInteractions = {sum(meta['weeklyInteractions']):,} (233,900)", d)
    ok &= expect(meta["weeklyInteractions"][-1] == 9020, "W26 = 9,020", d)
    ok &= expect(len(meta["weeklyInteractions"]) == 26, "26 weekly points", d)
    t = sum(num(r["cells"][1]) for r in ib["interactionsTable"]["rows"])
    ok &= expect(t == 5480 == ib["interactionsTable"]["total"], f"Q1 interactions table Σ = {t:,.0f} = total 5,480", d)
    l = sum(num(r["cells"][1]) for r in ib["lifecycle"])
    ok &= expect(l == 5480, f"lifecycle Σ = {l:,.0f} (5,480)", d)
    s = sum(sum(b["values"]) for b in ib["symptomStack"]["bars"])
    ok &= expect(s == 1610, f"symptom stack Σ = {s:,} (1,610)", d)
    exp = {"loop-mapping": 412, "node-offline": 268, "ground-fault": 231, "audio-nca": 198, "upload-download": 176,
           "not-responding": 142, "network-redundancy": 104, "battery-power": 79}
    rows_ok = all(sum(b["values"]) == exp[b["key"]] for b in ib["symptomStack"]["bars"])
    ok &= expect(rows_ok, "each symptom row sums to its 05a total", d)
    return ok


@check("C2", "Funnel and value")
def c2(d):
    f = ex["funnel"]
    ok = expect((f["interactions"], f["candidateClusters"], f["suppressed"], f["aboveThreshold"], f["governed"]) ==
                (233900, 1640, 212, 5, 2), "funnel = 233,900 / 1,640 / 212 / 5 / 2", d)
    counts = [r["count"] for r in f["suppressedReasons"]]
    ok &= expect(counts == [74, 58, 41, 27, 12] and sum(counts) == 212, f"suppressed reasons {counts} Σ 212", d)
    ok &= expect([r["count"] for r in mon["suppressedCard"]["rows"]] == counts, "suppressedCard rows = funnel reasons", d)
    ok &= expect(f"{sum(meta['weeklyInteractions']):,}" in meta["demo"]["introLine"], "intro line quotes 233,900", d)
    ok &= expect([v["id"] for v in ex["valueRegister"]] == [f"V-{i:02d}" for i in range(1, 15)], "valueRegister V-01…V-14 in order", d)
    uc = ex["unitCosts"]
    ok &= expect(uc["excessFaultContactUsd"] == 750 == sum(b["usd"] for b in uc["breakdown"]), "unitCosts 750 = 450 + 150 + 150", d)

    MONEY_TOK = re.compile(r"[$£]\s?\d[\d,.]*\s?[km]?(?:\s?[–-]\s?\d[\d,.]*[km]?)?")
    OTHER_TOK = re.compile(r"(?:~|≈ |≤ )?\d[\d,]*(?= days| / week| excess| contacts avoidable| units)|~\d[\d,]*")

    def vtext(ids, include_method=False):
        t = []
        for i in ids:
            t.append(render(VR[i]["figure"]))
            if include_method:
                t.append(render(VR[i]["method"]))
        return " ".join(t).replace(" ", "")

    def cmp(label, text, ids):
        text = render(text)
        good = True
        fig = vtext(ids)
        allv = vtext(ids, True)
        for m in MONEY_TOK.findall(text):
            if m.replace(" ", "") not in fig:
                good = False
                d.append(f"FAIL {label}: money '{m}' not in {ids} figure")
        for m in re.findall(r"(\d[\d,]*) days", text):
            if m not in allv:
                good = False
                d.append(f"FAIL {label}: '{m} days' not in {ids}")
        for m in re.findall(r"~\d[\d,]*", text):
            if m.replace(" ", "") not in fig:
                good = False
                d.append(f"FAIL {label}: '{m}' not in {ids} figure")
        if good:
            d.append(f"ok   {label} ↔ {','.join(ids)}")
        return good

    tiles = {t["id"]: t for t in ex["appliedValue"]["tiles"]}
    ok &= cmp("AV-1", tiles["AV-1"]["value"], ["V-11"])
    ok &= cmp("AV-4 line 2", tiles["AV-4"]["lines"][1], ["V-07"])
    ok &= cmp("AV-4 line 3", tiles["AV-4"]["lines"][2], ["V-08"])
    # AV-4 line 1 is V-02 + V-05, both USD: 0.15 + 0.35 = 0.5
    m02 = float(re.search(r"\$(\d+\.\d+)m", VR["V-02"]["figure"]).group(1))
    m05 = float(re.search(r"\$(\d+\.\d+)m", VR["V-05"]["figure"]).group(1))
    ok &= expect(abs(m02 + m05 - 0.5) < 1e-9 and "$0.5m" in tiles["AV-4"]["lines"][0],
                 f"AV-4 line 1 '$0.5m' = V-02 ${m02}m + V-05 ${m05}m (both USD)", d)
    ok &= cmp("AV-5", tiles["AV-5"]["value"] + " " + tiles["AV-5"]["sub"], ["V-10"])
    ok &= cmp("AV-6", tiles["AV-6"]["value"] + " look-alikes", ["V-12"]) and expect("212" in VR["V-12"]["figure"], "AV-6 212 = V-12", d)
    e = hero["signal"]["pnl"]["exposure"]
    ok &= cmp("hero P&L to date/projected", e["lines"][1]["text"], ["V-01", "V-02"])
    ok &= cmp("hero sub-tile 1", e["subTiles"][0]["text"], ["V-03"])
    ok &= cmp("hero sub-tile 2", e["subTiles"][1]["text"], ["V-04"])
    for i, st in enumerate(ib["dateCode"]["stats"][:2]):
        ok &= cmp(f"date-code stat {i + 1}", st["value"], ["V-05"])
    ok &= expect("1,900" in VR["V-05"]["figure"], "date-code 1,900 containable = V-05", d)
    ok &= cmp("channel value line", ch["partnerTimeline"]["valueLine"], ["V-06", "V-11"])
    k = {t["label"]: t for t in sep["kpis"]}
    ok &= cmp("separation KPI invoices", k["INVOICES IN DISPUTE"]["value"], ["V-08"])
    ok &= expect(k["INVOICES IN DISPUTE"]["value"] in VR["V-08"]["figure"], "'£1.1m / 212' verbatim in V-08", d)
    ok &= cmp("separation KPI DSO", k["DSO TOP-10 {{region:UK-EU}}"]["sub"], ["V-08"])
    ok &= cmp("separation KPI excess", k["EXCESS CONTACTS"]["value"], ["V-09"])
    # other money surfaces
    ok &= cmp("Q2 mini KPI", ex["questionCards"][1]["miniKpis"][1]["value"], ["V-07"])
    ok &= cmp("Q3 mini KPI", ex["questionCards"][2]["miniKpis"][0]["value"], ["V-08"])
    ok &= cmp("Pulse 2", ex["pulse"][1]["text"], ["V-08"])
    ok &= cmp("FSM card 3 blast radius", mon["cards"][2]["blastRadius"], ["V-06"])
    ok &= cmp("FSM card 4 blast radius", mon["cards"][3]["blastRadius"], ["V-07"])
    ok &= cmp("FSM card 5 blast radius", mon["cards"][4]["blastRadius"], ["V-08"])
    ck = {t["label"]: t for t in ch["kpis"]}
    ok &= cmp("channel KPI backlog", ck["BACKLOG AT RISK"]["value"] + " " + ck["BACKLOG AT RISK"]["sub"], ["V-07"])
    for s in ABOVE:
        for line in (s["pnl"].get("exposure") or {}).get("lines", []):
            if line.get("valueId"):
                ok &= cmp(f"{s['id']} exposure", line["text"], line["valueId"].split(","))
    for key, m in ex["money"].items():
        ok &= cmp(f"money.{key}", m["display"], m["valueId"].split(",")) if key != "warrantyAndField" else True
    return ok


@check("C3", "Hero evidence")
def c3(d):
    ev = hero["evidence"]
    ok = expect(len(ev) == 23 == hero["signal"]["evidenceCount"], "23 records = evidenceCount", d)
    ids = [e["id"] for e in ev]
    ok &= expect(ids == [f"EV-2609-{i:04d}" for i in range(1, 24)], "ids EV-2609-0001…0023", d)
    partners = {e["partnerId"] for e in ev}
    ok &= expect(len(partners) == 9, f"9 partners ({len(partners)})", d)
    reg = {}
    for e in ev:
        reg[render(e["region"])] = reg.get(render(e["region"]), 0) + 1
    ok &= expect((reg.get("US-SE"), reg.get("US-SW"), reg.get("Canada")) == (11, 8, 4), f"regional split {reg}", d)
    k = sum(e["firmwareSource"] == "record" for e in ev)
    ship = sum(e.get("imputedFrom") == "ship date" for e in ev)
    dl = sum(e.get("imputedFrom") == "download log" for e in ev)
    ok &= expect((k, 23 - k, ship, dl) == (15, 8, 5, 3), f"K {k} / I {23 - k} ({ship} ship date / {dl} download log)", d)
    conf = hero["signal"]["confidence"]
    ok &= expect(conf["known"]["count"] == k and conf["inferred"]["count"] == 23 - k, "confidence K/I counts match evidence", d)
    rb = [e for e in ev if e["mentionsRollback"]]
    ok &= expect(len(rb) == 5 and len({e["partnerId"] for e in rb}) == 4, f"rollback in {len(rb)} records across {len({e['partnerId'] for e in rb})} partners", d)
    loops = sum(bool(re.search(r"loops? [23]", render(e["text"]))) for e in ev)
    ok &= expect(loops == 6, f"'loop 2/3' named in {loops} records (6)", d)
    before = {render(e["partnerId"]) for e in ev if e["timestampUtc"] < "2026-09-16T00:00:00Z"}
    ok &= expect(before == {"ESD-SE-07", "ESD-SW-03"}, f"before 16 Sep UTC only {sorted(before)}", d)
    first16 = sorted([e for e in ev if e["timestampUtc"] >= "2026-09-16T00:00:00Z"], key=lambda e: e["timestampUtc"])[0]
    ok &= expect(render(first16["partnerId"]) == "ESD-CA-04" and first16["id"] == "EV-2609-0007",
                 "EV-2609-0007 (ESD-CA-04) is the third independent partner on 16 Sep UTC", d)
    wk = [sum(week_of(e["timestampUtc"]) == w for e in ev) for w in (23, 24, 25, 26)]
    ok &= expect(wk == [1, 5, 9, 8], f"weekly counts W23–W26 {wk}", d)
    chans = {c: sum(e["channel"] == c for e in ev) for c in ("call", "case", "email", "rma", "afterHours")}
    ok &= expect(chans == {"call": 7, "case": 8, "email": 4, "rma": 2, "afterHours": 2}, f"channels {chans}", d)
    feat = sorted(e["featuredOrder"] for e in ev if e["featured"])
    ok &= expect(feat == [1, 2, 3, 4, 5], "featuredOrder 1–5", d)
    ok &= expect(all(e["signalId"] == "fw-4-1" for e in ev), "all signalId = fw-4-1", d)
    rmas = {r["id"]: r for r in hero["rmas"]}
    links = {e["linkedRmaId"]: e["id"] for e in ev if e.get("linkedRmaId")}
    ok &= expect(all(rmas[r]["linkedEvidenceId"] == eid for r, eid in links.items()) and len(links) == 2, "RMA ↔ evidence links agree (2 NFF)", d)
    for e in ev:
        for anon in (False, True):
            if e.get("highlight") and e["highlight"] not in render(e["text"], anon):
                ok = False
                d.append(f"FAIL highlight of {e['id']} not in text (anon={anon})")
    d.append("ok   highlights are substrings of the rendered text in both modes")
    c = hero["cohort"]
    ok &= expect((c["panels"], c["sites"], c["partners"]) == (1240, 610, 9), "cohort 1,240 panels / 610 sites / 9 partners", d)
    ok &= expect(sum(r["panels"] for r in c["regions"]) == 1240 and sum(r["sites"] for r in c["regions"]) == 610
                 and sum(r["contacts"] for r in c["regions"]) == 23, "cohort region rows sum to 1,240 / 610 / 23", d)
    ok &= expect(6800 - 1240 == c["eligibleNotUpgraded"] == 5560, "6,800 − 1,240 = 5,560 eligible", d)
    per_region_partners = {render(r["region"]): r["partners"] for r in c["regions"]}
    got = {}
    for e in ev:
        got.setdefault(render(e["region"]), set()).add(e["partnerId"])
    ok &= expect(all(len(got[k2]) == v for k2, v in per_region_partners.items()), "partners per region match evidence (4 / 3 / 2)", d)
    s41 = hero["lineage"]["series"][1]["points"]
    ok &= expect(sum(p["contacts"] for p in s41) == 23 and [p["contacts"] for p in s41] == wk, "4.1 series contacts = evidence weekly counts", d)
    rate = round(23 / 1240 / 3 * 1000, 1)
    ok &= expect(rate == hero["signal"]["metric"]["value"] == 6.2, f"headline 23 ÷ 1,240 ÷ 3 × 1,000 = {rate}", d)
    return ok


@check("C4", "Question-card counts")
def c4(d):
    ok = True
    digest = meta["lastWeekDigest"]
    total = 0
    for q in ex["questionCards"]:
        sigs = [s for s in ABOVE if s["question"] == q["id"]]
        last = [s for s in sigs if s["aboveSince"] <= digest]
        delta = len(sigs) - len(last)
        dl = f"{'+' if delta > 0 else ''}{delta} vs last week"
        total += q["count"]
        ok &= expect(q["count"] == len(sigs), f"{q['id']}: count {q['count']} = {len(sigs)} signals", d)
        ok &= expect(q["lastWeekCount"] == len(last), f"{q['id']}: lastWeekCount {q['lastWeekCount']} (aboveSince ≤ digest)", d)
        ok &= expect(q["deltaLabel"] == dl, f"{q['id']}: deltaLabel '{q['deltaLabel']}'", d)
        ok &= expect(q["countLabel"] == ("signal above threshold" if q["count"] == 1 else "signals above threshold"), f"{q['id']}: countLabel", d)
        ok &= expect(sorted(r["signalId"] for r in q["counted"]) == sorted(s["id"] for s in sigs), f"{q['id']}: counted[] = its signals", d)
        mix = " · ".join(f"{s['severity']['class']} {s['severity']['type']}" for s in sorted(sigs, key=lambda s: s["rank"]))
        ok &= expect(q["severityMix"] == mix, f"{q['id']}: severityMix '{q['severityMix']}'", d)
    ok &= expect(total == 5 == ex["funnel"]["aboveThreshold"] == len(ABOVE), "Σ counts = 5 = funnel above-threshold", d)
    bad = []
    allowed = re.compile(r"(rankFactors\[\d+\]\.score|sourceIndependence\.score)$")
    for f in FILES:
        for p, k in walk_keys(D[f]):
            if k.lower() == "index" or (k == "score" and not allowed.search(p)):
                bad.append(f"{f}:{p}")
    ok &= expect(not bad, "no field named 'index'; 'score' only where 05a §2 defines it (RankFactor, sourceIndependence)" + (f" — {bad}" if bad else ""), d)
    for q in ex["questionCards"]:
        ok &= expect(not any(k in q for k in ("score", "index")), f"{q['id']}: no score/index on the card", d)
    return ok


@check("C5", "Gauges")
def c5(d):
    g = {q["id"]: q["gauges"] for q in ex["questionCards"]}
    ok = expect(g["installed-base"][0]["pct"] == round(45 / 46 * 100), "Q1 98 = 45/46", d)
    ok &= expect(g["installed-base"][1]["pct"] == round(0.28 / 0.35 * 100), "Q1 80 = 0.28/0.35", d)
    ok &= expect(g["channel"][0]["pct"] == round(419 / 420 * 100, 1), "Q2 99.8 = 419/420", d)
    ok &= expect(g["separation"][0]["pct"] == round(3 / 4 * 100), "Q3 75 = 3/4", d)
    ok &= expect(g["separation"][1]["pct"] == round(14 / 180 * 100), "Q3 8 ≈ 14/180", d)
    rr = hero["lineage"]["aggregate"]["values"]
    ok &= expect(rr[-1] == 0.28 and max(rr) < 0.35, f"EST4 RMA rate W26 {rr[-1]}, max {max(rr)} < 0.35", d)
    ok &= expect(ib["contactsVsRma"]["rmaRate"] == rr, "contactsVsRma.rmaRate = hero aggregate", d)
    ok &= expect(ib["dateCode"]["current"] == ib["dateCode"]["pChart"][-1] < ib["dateCode"]["limit"], "SKU p-chart current 0.21 < 0.30 limit", d)
    tones = [(x["tone"], y["tone"]) for x, y in g.values()]
    ok &= expect(tones == [("green", "green"), ("green", "amber"), ("amber", "amber")], f"gauge tones {tones}", d)
    return ok


@check("C6", "Channel")
def c6(d):
    t = ch["partnerTimeline"]
    fr, bl = sum(t["friction"][20:]), sum(t["baseline"][20:])
    ok = expect((fr, bl) == (40, 13) and round(fr / bl, 1) == 3.1, f"ESD-SE-07 friction W21–W26 {fr} vs baseline {bl} ({fr / bl:.2f} → 3.1×)", d)
    w1620 = sum(t["friction"][15:20]) / 5
    ok &= expect(abs(w1620 - 3.2) < 1e-9, f"W16–W20 friction mean {w1620} (3.2, 1.6× own baseline)", d)
    s, ly = sum(t["sellIn"][18:]), sum(t["sellInLY"][18:])
    pct = round((s / ly - 1) * 100)
    ok &= expect((s, ly, pct) == (1638, 2100, -22), f"sell-in Σ W19–W26 {s:,} / {ly:,} − 1 = {pct}%", d)
    outside = [r for r in ch["league"] if r["cells"][2] == "ESD / Strategic Partner" and not r["cells"][8].startswith("Within band")]
    ok &= expect(len(outside) == 1 and render(outside[0]["cells"][0]) == "ESD-SE-07", "exactly 1 ESD / Strategic Partner row outside band", d)
    seats = sum(int(r["cells"][4]) for r in ch["certification"]["rows"])
    ok &= expect(seats == 18, f"certification seats Σ {seats} (18)", d)
    ok &= expect(round(2.3 / 95 * 100, 1) == 2.4, "backlog $2.3m = 2.4% of $95m", d)
    exp = {"N-3": 2.3, "D-5": 0.8, "P-2": 0.6, "M-4": 0.5, "A-1": 0.4, "C-2": 0.3}
    ok &= expect(all(abs(sum(b["values"]) - exp[b["key"]]) < 1e-9 for b in ch["backorder"]["bars"]), "backorder bars sum to 05a totals", d)
    ok &= expect(ch["backorder"]["bars"][0]["overlay"] == ch["backorder"]["consequenceRatio"][-1] == 3.2, "N-3 overlay 3.2 = consequenceRatio W26", d)
    ok &= expect(len(ch["backorder"]["consequenceRatio"]) == 12, "consequenceRatio W15–W26 (12 points)", d)
    ok &= expect(sum(x["value"] for x in ch["enhanced"]["drivers"]) == 100, "channel drivers 34+26+17+13+10 = 100", d)
    ok &= expect(len(t["pins"]) == 6 and [p["week"] for p in t["pins"]] == list(range(21, 27)), "evidence pins W21–W26", d)
    ok &= expect(all("[competitor]" in p["text"] or "competitor" not in p["text"].lower() for p in t["pins"]), "competitor never named in pins", d)
    return ok


@check("C7", "Separation")
def c7(d):
    ok = expect(sum(x["value"] for x in sep["enhanced"]["drivers"]) == 212, "dispute drivers Σ 212", d)
    shares = [round(x["value"] / 212 * 100) for x in sep["enhanced"]["drivers"]]
    ok &= expect(shares == [41, 24, 15, 11, 9], f"driver shares {shares}", d)
    series = {render(s["name"]): s["values"] for s in sep["cutoverTimeline"]["series"]}
    remit = series["UK-EU remit-to & entity contacts"]
    portal = series["UK-EU portal login"]
    control = series["Control regions — remit-to & entity"]
    base = sum(remit[:22]) / 22
    ok &= expect(remit[-1] == 81 and base == 30 and round(81 / 30, 1) == 2.7, f"remit-to W26 {remit[-1]} vs baseline {base} (2.7×)", d)
    cb = sum(control[:22]) / 22
    ok &= expect(control[-1] == 45 and cb == 40 and round(45 / 40, 1) == 1.1, f"control W26 {control[-1]} vs {cb} (1.1×)", d)
    pb = sum(portal[:22]) / 22
    ok &= expect(pb == 22 and round(portal[-1] / pb, 1) == 3.4, f"portal login W26 {portal[-1]} vs {pb} (3.4×)", d)
    tt = {t["key"]: t for t in sep["topicTotals"]}
    first3 = tt["entity-mismatch"]["total"] + tt["remit-to"]["total"] + tt["vat"]["total"]
    ok &= expect(first3 == 298 == sum(remit[22:]), f"first three topics {first3} = Σ W23–W26 remit-to {sum(remit[22:])}", d)
    ok &= expect(tt["portal-login"]["total"] == sum(portal[22:]), "portal-login total 276 = Σ W23–W26 portal series", d)
    w26 = sum(tt[k]["perWeekW26"] for k in ("entity-mismatch", "remit-to", "vat"))
    pre = sum(tt[k]["preCutoverPerWeek"] for k in ("entity-mismatch", "remit-to", "vat"))
    ok &= expect((w26, pre) == (81, 30), f"remit-to & entity topics W26 {w26}/wk vs {pre}/wk", d)
    clean = sum(r["cells"][5] == "Clean vs control" for r in sep["scorecard"])
    ok &= expect(clean == 3 and len(sep["scorecard"]) == 4, f"scorecard: {clean} 'Clean vs control' of 4", d)
    ds = sep["defectSplit"]
    ok &= expect(ds["faqable"] + ds["defect"] == 298, "defect split 118 + 180 = 298", d)
    ok &= expect(round(30 * (2.7 - 1.1)) == 48, "excess 30 × (2.7 − 1.1) = 48 / week (V-09)", d)
    bars_ok = all(sum(b["values"]) == tt[b["key"]]["total"] for b in sep["topicStack"]["bars"])
    ok &= expect(bars_ok, "topic stack bars sum to topic totals", d)
    dt_ = sep["disputeTrend"]
    ok &= expect(dt_["cumulativeGbpK"][-1] == 1100 and dt_["dsoDeltaDays"][-1] == 6, "dispute trend ends £1,100k / +6 days", d)
    return ok


# names that must only appear inside tokens
RAW_NAMES = set()
for kind in ("brand", "platform", "partner", "region", "place", "term"):
    for key, v in ANON[kind].items():
        RAW_NAMES.add(key)
        RAW_NAMES.add(v["named"])
RAW_NAMES |= {"EST3"}
RAW_RE = re.compile(r"(?<![\w\-/])(" + "|".join(re.escape(n) for n in sorted(RAW_NAMES, key=len, reverse=True)) + r")(?![\w/]|-[A-Z0-9])")
ROLE_PATH = re.compile(r"(routing\.(owner|cc\[\d+\]|informed\[\d+\])|gates\[\d+\]\.(owner|approveEnabledFor\[\d+\]))$")
PREFIX_RE = re.compile(r"(EST4|Edwards|ESD-|DIST-|DLR-|Florida|UK-EU)")


@check("C8", "Tokens")
def c8(d):
    hits, roles = [], set()
    for f, p, s in strings([x for x in FILES if x != "anonymise.json"]):
        if f == "meta.json" and p.startswith("filters.region"):
            continue
        if ROLE_PATH.search(p):                        # Role literals, e.g. 'Regional GM UK-EU' (render via roleLabel)
            roles.add(s)
            continue
        bare = TOKEN_RE.sub("", s)
        for m in PREFIX_RE.findall(bare) + RAW_RE.findall(bare):
            hits.append(f"{f}:{p} → '{m}'")
    ok = expect(not hits, f"raw brand/platform/partner/region/place names outside tokens: {len(hits)}", d)
    d.extend("     " + h for h in hits[:20])
    d.append("note meta.filters.region keeps 'NA'/'UK-EU' as option values (05a check 8 exception)")
    d.append(f"note Role-typed fields hold Role literals ({', '.join(sorted(r for r in roles if RAW_RE.search(r)))}); UI renders them with roleLabel()")
    return ok


BANNED = [(r"resolv", "resolve"), (r"root cause", "root cause"), (r"sentiment", "sentiment"), (r"churn", "churn"),
          (r"predict", "predict"), (r"real-time", "real-time"), (r"LisN|Lisn|LISN", "LiSN misspelt"),
          (r"(?i)index", "index"), (r"crossed a threshold this week", "crossed a threshold this week"), (r"!", "!"),
          (r"FCI", "FCI"), (r"Conversation AI", "Conversation AI"), (r"\bCSAT\b", "CSAT"), (r"\bNPS\b", "NPS"),
          (r"(?i)\bcheap", "cheap"), (r"HSHF", "HSHF"), (r"(?i)\bcards?holders?\b|\bchargeback|\bMCC\b", "banking leftover"),
          (r"(?i)\bcards\b", "cards"), (r"Carrier", "Carrier"), (r"(?i)your data is fragmented", "fragmented"),
          (r"300K", "300K"), (r"(?i)agentic", "agentic"), (r"(?i)auto-report", "auto-report"), (r"(?i)\bROI\b(?!.*payback)", None)]


@check("C9", "Banned strings and $ + £")
def c9(d):
    hits = []
    for f, p, s in strings():
        r = render(s)
        for pat, name in BANNED:
            if name is None:
                continue
            if re.search(pat, r):
                hits.append(f"{f}:{p} [{name}] {r[:80]}")
    for f in FILES:                                   # keys too (e.g. a field called index)
        for p, k in walk_keys(D[f]):
            if re.search(r"(?i)index|lisn(?<!LiSN)", k) and k != "askLisn":
                hits.append(f"{f}:{p} [key] {k}")
    ok = expect(not hits, f"banned strings: {len(hits)} hits", d)
    d.extend("     " + h for h in hits[:20])
    roi = [f"{f}:{p}" for f, p, s in strings() if re.search(r"\bROI\b", s) and "Never on screen" not in s]
    ok &= expect(not roi, "ROI / savings only inside the 'Never on screen' line", d)
    both = [f"{f}:{p}" for f, p, s in strings() if "$" in render(s) and "£" in render(s)]
    ok &= expect(not both, f"no string mixes $ and £ ({len(both)})", d)
    return ok


@check("C10", "Governed watch and runtime")
def c10(d):
    gw = ex["governedWatch"]
    w = {i["id"]: i for i in gw["items"]}
    ok = expect(w["W-1"]["routedAt"] == "2026-09-06T14:38:00Z" and w["W-1"]["chronologyUpdatedAt"] == "2026-09-23T10:02:00Z",
                "W-1 routed 6 Sep 14:38 UTC; chronology updated 23 Sep 10:02 UTC", d)
    t0 = dt.datetime.fromisoformat(w["W-2"]["firstMentionAt"].replace("Z", "+00:00"))
    t1 = dt.datetime.fromisoformat(w["W-2"]["routedAt"].replace("Z", "+00:00"))
    ok &= expect((t1 - t0).total_seconds() == 7 * 60, "W-2 routed 7 minutes after first mention", d)
    asof = dt.datetime.fromisoformat(meta["dataAsOf"]["iso"].replace("Z", "+00:00"))
    el = asof - dt.datetime.fromisoformat(w["W-2"]["clock"]["startUtc"].replace("Z", "+00:00"))
    lab = f"{int(el.total_seconds() // 3600)}h {int(el.total_seconds() % 3600 // 60)}m"
    ok &= expect(lab == w["W-2"]["clock"]["elapsedLabel"], f"W-2 clock {lab} to data-as-of", d)
    banned_w = re.compile(r"\{\{|EST\d|Edge|fw |firmware|\b4\.[01]\b|\bUK\b|\bUS\b|Canada|UK-EU|\bDE\b|\bNL\b|\bFR\b|Florida|Texas|Ontario")
    txt = [p + ": " + s for p, k, s in walk(gw) if isinstance(s, str)]
    bad = [x for x in txt if banned_w.search(x.split(": ", 1)[1])]
    ok &= expect(not bad, "watch items carry no tokens, platform, firmware or country", d)
    d.extend("     " + b for b in bad)
    # runtime timestamps
    stamp = re.compile(r"\b\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{2}:\d{2} UTC\b")
    runtime_paths = []
    for f in FILES:
        for p, k, s in walk(D[f]):
            if isinstance(s, str) and re.search(r"onApprove|decisionRequest|chipApproved|auditRuntime", p) and stamp.search(s):
                runtime_paths.append(f"{f}:{p}")
    ok &= expect(not runtime_paths, "no approval / decision timestamp stored (runtime only)", d)
    ok &= expect(not any("28 Sep" in s for _, _, s in strings()), "no string carries the demo-day date (28 Sep)", d)
    need_ts = []
    for s in mon["signals"]:
        for g in s["gates"]:
            oa = g.get("onApprove")
            if oa:
                need_ts += [oa["auditLine"], oa["toast"]["body"], oa["auditEntry"]]
            if g.get("decisionRequest"):
                need_ts.append(g["decisionRequest"]["auditEntry"])
    need_ts.append(hero["draftBrief"]["chipApproved"])
    ok &= expect(need_ts and all("{ts}" in x for x in need_ts), f"{len(need_ts)} runtime strings carry the {{ts}} placeholder", d)
    hg = hero["signal"]["gates"][0]
    ok &= expect(hg["approveEnabledFor"] == ["VP Engineering"] and "President" not in hg["approveEnabledFor"],
                 "President cannot approve the hero gate", d)
    return ok


# ===========================================================================
# Extra checks
# ===========================================================================
def parse_interfaces(src):
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    src = re.sub(r"//[^\n]*", "", src)
    out = {}
    for m in re.finditer(r"export interface (\w+)(?:\s+extends\s+([\w\s,]+))?\s*\{", src):
        name, ext = m.group(1), m.group(2)
        i, depth = m.end(), 1
        while depth:
            c = src[i]
            depth += (c == "{") - (c == "}")
            i += 1
        body = src[m.end(): i - 1]
        members, cur, dep = [], "", 0
        for c in body:
            if c in "{[(<":
                dep += 1
            elif c in "}])>":
                dep -= 1
            if dep == 0 and c in ";\n":
                members.append(cur)
                cur = ""
            else:
                cur += c
        members.append(cur)
        req, opt = set(), set()
        for mem in members:
            mm = re.match(r"\s*(\w+)(\?)?\s*:", mem)
            if mm:
                (opt if mm.group(2) else req).add(mm.group(1))
        out[name] = {"req": req, "opt": opt, "ext": [e.strip() for e in ext.split(",")] if ext else []}
    return out


IFACES = parse_interfaces(open(TYPES, encoding="utf-8").read())


def members(name):
    i = IFACES[name]
    req, opt = set(i["req"]), set(i["opt"])
    for e in i["ext"]:
        r2, o2 = members(e)
        req |= r2
        opt |= o2
    return req, opt


def at(obj, path):
    """expand 'a.b[].c' to the list of matching nodes."""
    nodes = [obj]
    if not path:
        return nodes
    for part in path.split("."):
        arr = part.endswith("[]")
        key = part[:-2] if arr else part
        nxt = []
        for n in nodes:
            v = n.get(key) if isinstance(n, dict) else None
            if v is None:
                continue
            if arr:
                nxt.extend(v)
            else:
                nxt.append(v)
        nodes = nxt
    return nodes


SCHEMA = [
    ("meta.json", "", "MetaFile"), ("meta.json", "dailyInteractions[]", "DailyInteractions"), ("meta.json", "labels", "UiLabels"),
    ("exec.json", "", "ExecFile"), ("exec.json", "funnel", "FunnelData"), ("exec.json", "pulse[]", "PulseItem"),
    ("exec.json", "questionCards[]", "QuestionCardData"), ("exec.json", "questionCards[].gauges[]", "Gauge"),
    ("exec.json", "questionCards[].miniKpis[]", "MiniKpi"), ("exec.json", "questionCards[].counted[]", "CountedRow"),
    ("exec.json", "appliedValue", "AppliedValue"), ("exec.json", "appliedValue.tiles[]", "AppliedValueTile"),
    ("exec.json", "appliedValue.leadList[]", "LeadListItem"), ("exec.json", "valueRegister[]", "ValueItem"),
    ("exec.json", "unitCosts", "UnitCosts"), ("exec.json", "governedWatch", "GovernedWatch"),
    ("exec.json", "governedWatch.items[]", "WatchItem"), ("exec.json", "evidenceReadiness", "EvidenceReadiness"),
    ("exec.json", "howWeCount", "HowWeCount"),
    ("monitor.json", "", "MonitorFile"), ("monitor.json", "signals[]", "Signal"), ("monitor.json", "signals[].severity", "Severity"),
    ("monitor.json", "signals[].confidence", "Confidence"), ("monitor.json", "signals[].joinTags[]", "JoinTag"),
    ("monitor.json", "signals[].pnl", "PnLDestination"), ("monitor.json", "signals[].rankFactors[]", "RankFactor"),
    ("monitor.json", "signals[].gates[]", "HumanGate"), ("monitor.json", "cards[]", "MonitorCard"),
    ("monitor.json", "suppressedCard", "SuppressedCard"),
    ("signal_fw41.json", "", "SignalFw41File"), ("signal_fw41.json", "signal", "HeroSignal"),
    ("signal_fw41.json", "signal.severity", "Severity"), ("signal_fw41.json", "signal.confidence", "Confidence"),
    ("signal_fw41.json", "signal.gates[]", "HumanGate"), ("signal_fw41.json", "lineage", "HeroLineage"),
    ("signal_fw41.json", "lineage.series[]", "FirmwareSeries"), ("signal_fw41.json", "lineage.series[].points[]", "FirmwareSeriesPoint"),
    ("signal_fw41.json", "lineage.markers[]", "ChartMarker"), ("signal_fw41.json", "lineage.aggregate", "AggregateLine"),
    ("signal_fw41.json", "cohort", "Cohort"), ("signal_fw41.json", "cohort.regions[]", "CohortRegionRow"),
    ("signal_fw41.json", "evidence[]", "EvidenceSnippet"), ("signal_fw41.json", "rmas[]", "RMA"),
    ("signal_fw41.json", "audit[]", "AuditEntry"), ("signal_fw41.json", "method[]", "MethodRow"),
    ("signal_fw41.json", "draftBrief", "DraftBrief"), ("signal_fw41.json", "draftBrief.sections[]", "DraftBriefSection"),
    ("installedBase.json", "", "InstalledBaseFile"), ("installedBase.json", "kpis[]", "KpiTile"),
    ("installedBase.json", "interactionsTable.rows[]", "TableRow"), ("installedBase.json", "dateCode.cells[]", "DateCodeCell"),
    ("installedBase.json", "dateCode.confidence", "Confidence"), ("installedBase.json", "dateCode.stats[]", "KpiTile"),
    ("installedBase.json", "emergingPhrasing[]", "TableRow"), ("installedBase.json", "lineageMonitor.markers[]", "ChartMarker"),
    ("installedBase.json", "contactsVsRma.markers[]", "ChartMarker"), ("installedBase.json", "signalWall", "SignalWall"),
    ("installedBase.json", "signalWall.cards[]", "WallCard"), ("installedBase.json", "enhanced", "EnhancedPanel"),
    ("installedBase.json", "enhanced.drivers[]", "DriverBar"), ("installedBase.json", "enhanced.watchlist[]", "WatchlistCard"),
    ("installedBase.json", "enhanced.stats[]", "KpiTile"), ("installedBase.json", "diagnosis", "Diagnosis"),
    ("installedBase.json", "symptomStack", "StackedBar"), ("installedBase.json", "symptomStack.details[]", "StackedBarDetail"),
    ("installedBase.json", "stable.rows[]", "StableRow"), ("installedBase.json", "lifecycle[]", "TableRow"),
    ("channel.json", "", "ChannelFile"), ("channel.json", "kpis[]", "KpiTile"), ("channel.json", "league[]", "TableRow"),
    ("channel.json", "partnerTimeline.markers[]", "ChartMarker"), ("channel.json", "backorder.details[]", "StackedBarDetail"),
    ("channel.json", "certification.rows[]", "TableRow"), ("channel.json", "switching[]", "TableRow"),
    ("channel.json", "enhanced", "EnhancedPanel"), ("channel.json", "enhanced.watchlist[]", "WatchlistCard"),
    ("channel.json", "enhanced.drivers[]", "DriverBar"), ("channel.json", "signalWall", "SignalWall"),
    ("channel.json", "signalWall.cards[]", "WallCard"), ("channel.json", "diagnosis", "Diagnosis"),
    ("separation.json", "", "SeparationFile"), ("separation.json", "kpis[]", "KpiTile"),
    ("separation.json", "cutoverTimeline.markers[]", "ChartMarker"), ("separation.json", "scorecard[]", "TableRow"),
    ("separation.json", "topicStack", "StackedBar"), ("separation.json", "topicStack.details[]", "StackedBarDetail"),
    ("separation.json", "topicTotals[]", "TopicTotal"), ("separation.json", "gates[]", "HumanGate"),
    ("separation.json", "enhanced", "EnhancedPanel"), ("separation.json", "enhanced.watchlist[]", "WatchlistCard"),
    ("separation.json", "signalWall", "SignalWall"), ("separation.json", "diagnosis", "Diagnosis"),
    ("askLisn.json", "", None), ("askLisn.json", "[]", "AskLisnItem"),
]
TS_ROOT = {"meta.json": "MetaFile", "exec.json": "ExecFile", "monitor.json": "MonitorFile", "signal_fw41.json": "SignalFw41File",
           "installedBase.json": "InstalledBaseFile", "channel.json": "ChannelFile", "separation.json": "SeparationFile",
           "anonymise.json": "AnonymiseMap", "askLisn.json": "AskLisnItem[]"}


@check("E1", "JSON matches the TypeScript interfaces")
def e1(d):
    ok = True
    n_nodes = 0
    for f, path, iface in SCHEMA:
        if iface is None:
            continue
        nodes = D[f] if (path == "[]") else at(D[f], path)
        if not nodes:
            ok = False
            d.append(f"FAIL {f}:{path} not found")
            continue
        req, opt = members(iface)
        for n in nodes:
            n_nodes += 1
            missing = req - set(n)
            extra = set(n) - req - opt
            if missing or extra:
                ok = False
                d.append(f"FAIL {f}:{path or '<root>'} as {iface}: missing {sorted(missing)} unknown {sorted(extra)}")
    d.append(f"{'ok  ' if ok else 'FAIL'} required keys present / no unknown keys on {n_nodes} objects across {len(SCHEMA)} paths")
    # anonymise shape
    kinds = {"brand", "platform", "fw", "partner", "region", "place", "term"}
    ok &= expect(set(ANON) == kinds and all(set(v) == {"named", "anon"} for k in ANON.values() for v in k.values()),
                 "anonymise.json matches AnonymiseMap", d)
    anon_partners = [v["anon"] for v in ANON["partner"].values()]
    ok &= expect(len(anon_partners) == len(set(anon_partners)), "partner anon labels unique", d)
    # tsc --strict: the strongest structural check (literal unions, tuples, excess properties)
    tsc = shutil.which("tsc")
    if not tsc:
        d.append("note tsc not found on PATH — skipped the TypeScript compile check")
        return ok
    tmp = tempfile.mkdtemp(prefix="kgs-mock-tsc-")
    try:
        lines = []
        for f, t in TS_ROOT.items():
            base = os.path.splitext(f)[0]
            imp = t.replace("[]", "")
            with open(os.path.join(tmp, f"{base}.check.ts"), "w", encoding="utf-8") as fh:
                fh.write(f"import type {{ {imp} }} from '{TYPES[:-3]}';\n")
                fh.write(f"export const data: {t} = {json.dumps(D[f], ensure_ascii=False, indent=1)};\n")
            lines.append(f"{base}.check.ts")
        # lib files compile too (react is shimmed: the check needs no node_modules)
        with open(os.path.join(tmp, "react-shim.d.ts"), "w", encoding="utf-8") as fh:
            fh.write("""declare module 'react' {
  export type ReactNode = unknown;
  export interface Context<T> { Provider: unknown; _t?: T }
  export function createContext<T>(v: T): Context<T>;
  export function useContext<T>(c: Context<T>): T;
  export function useReducer<S, A>(r: (s: S, a: A) => S, init: S): [S, (a: A) => void];
  export function useCallback<T extends (...args: never[]) => unknown>(f: T, deps: unknown[]): T;
  export function useMemo<T>(f: () => T, deps: unknown[]): T;
  export function createElement(type: unknown, props: unknown, ...children: unknown[]): unknown;
}
""")
        libs = [os.path.join(HERE, "lib", x) for x in ("label.ts", "values.ts", "demoState.ts", "data.ts")]
        cfg = {"compilerOptions": {"strict": True, "noEmit": True, "target": "ES2020", "module": "ESNext",
                                   "moduleResolution": "Bundler", "resolveJsonModule": True, "esModuleInterop": True,
                                   "skipLibCheck": True, "lib": ["ES2020", "DOM"], "types": []},
               "files": [os.path.join(tmp, x) for x in lines] + [os.path.join(tmp, "react-shim.d.ts")] + libs}
        with open(os.path.join(tmp, "tsconfig.json"), "w") as fh:
            json.dump(cfg, fh)
        r = subprocess.run([tsc, "-p", os.path.join(tmp, "tsconfig.json")], capture_output=True, text=True, timeout=300)
        out = (r.stdout + r.stderr).strip()
        ok &= expect(r.returncode == 0, f"tsc --strict: {len(TS_ROOT)} JSON files assigned to their interfaces + lib/*.ts compile"
                     + ("" if r.returncode == 0 else f" — {out.count('error TS')} errors"), d)
        if r.returncode:
            d.extend("     " + x for x in out.splitlines()[:25])
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return ok


MONEY_AMT = re.compile(r"(?<![\w$£.,])(\d+(?:[.,]\d+)?)(k|m)\b")


@check("E3", "Every money value has a currency")
def e3(d):
    ok = True
    bad = []
    for f, p, s in strings():
        r = render(s)
        for m in MONEY_AMT.finditer(r):
            before = r[max(0, m.start() - 12): m.start()]
            after = r[m.end(): m.end() + 8]
            if re.search(r"\d+h $", before):          # "8h 46m" is a duration
                continue
            if re.search(r"[$£][\d.,]+[km]?\s?[–-]\s?$", before):   # "$11k–26k", "$1.2k–2.9k"
                continue
            if after.startswith(" panels"):           # "1.24k panels" (V-01 method)
                continue
            bad.append(f"{f}:{p} '{m.group(0)}' in: {r[:70]}")
    ok &= expect(not bad, f"amounts with k/m magnitude carry $ or £ ({len(bad)} without)", d)
    d.extend("     " + b for b in bad[:15])
    flagged = []
    for f in FILES:
        for p, k, v in walk(D[f]):
            if k == "money" and v is True:
                parent = p.rsplit(".", 1)[0]
                node = D[f]
                for part in re.findall(r"[^.\[\]]+|\[\d+\]", parent):
                    node = node[int(part[1:-1])] if part.startswith("[") else node[part]
                blob = render(json.dumps({x: node.get(x) for x in ("value", "lines", "sub", "big", "caption", "figure")}, ensure_ascii=False))
                if "$" not in blob and "£" not in blob:
                    flagged.append(f"{f}:{parent}")
    ok &= expect(not flagged, f"every object flagged money:true shows $ or £ ({len(flagged)} without)", d)
    d.extend("     " + x for x in flagged)
    for key, m in ex["money"].items():
        sym = "$" if m["currency"] == "USD" else "£"
        good = m["currency"] in ("USD", "GBP") and sym in m["display"] and m["illustrative"] is True
        amt = re.search(r"[$£]([\d.,]+)([km]?)", m["display"])
        val = float(amt.group(1).replace(",", "")) * {"k": 1e3, "m": 1e6, "": 1}[amt.group(2)]
        good &= abs(val - m["amount"]) < 1e-6
        ok &= expect(good, f"money.{key}: {m['display']} = {m['currency']} {m['amount']:,}", d)
    units = [ch["panelCopy"]["C-D"]["unit"], ch["panelCopy"]["C-C"]["unit"], sep["panelCopy"]["S-G"]["unit"]]
    ok &= expect("USD" in units[0] and "USD" in units[1] and "GBP" in units[2] and sep["disputeTrend"]["currency"] == "GBP",
                 "numeric money arrays declare their currency (backorder $m, sell-in $k, disputes £k)", d)
    return ok


@check("E4", "No USD + GBP sums")
def e4(d):
    ok = expect("value" not in [t for t in ex["appliedValue"]["tiles"] if t["id"] == "AV-4"][0],
                "AV-4 has three lines and no total value", d)
    for key, m in ex["money"].items():
        ids = m["valueId"].split(",")
        if len(ids) > 1:
            curs = {x["currency"] for x in ex["money"].values() if x["valueId"] in ids}
            ok &= expect(curs == {m["currency"]}, f"money.{key} combines {ids} in one currency only ({curs})", d)
    both = [f"{f}:{p}" for f, p, s in strings() if "$" in render(s) and "£" in render(s)]
    ok &= expect(not both, "no single string mixes $ and £", d)
    usd_v = {v["id"] for v in ex["valueRegister"] if "$" in v["figure"]}
    gbp_v = {v["id"] for v in ex["valueRegister"] if "£" in v["figure"]}
    ok &= expect(not (usd_v & gbp_v), f"no V-figure mixes currencies (USD {sorted(usd_v)} · GBP {sorted(gbp_v)})", d)
    return ok


ID_RULES = [
    (re.compile(r"\bRMA-[A-Z0-9][\w-]*"), re.compile(r"^RMA-S-\d{4}-\d{4}$")),
    (re.compile(r"\bE4-[\w-]+"), re.compile(r"^E4-S-(\d{8}|\d{4}xxxx)$")),
    (re.compile(r"\bEV-[\w-]+"), re.compile(r"^EV-2609-00(0[1-9]|1\d|2[0-3])$")),
    (re.compile(r"\bSIG-[\w-]+"), re.compile(r"^SIG-2609-(00[1-5]|E01)$")),
    (re.compile(r"\bIB-[\w-]+"), re.compile(r"^IB-2609-\d{3}$")),
    (re.compile(r"\bINV-[\w-]+"), re.compile(r"^(INV-2609-\d{3}|INV-[A-Z]{2}-26-\d{5})$")),
    (re.compile(r"\bAUD-[\w-]+"), re.compile(r"^AUD-2609-\d{4}$")),
]


@check("E5", "Synthetic IDs only")
def e5(d):
    bad, seen = [], {}
    for f, p, s in strings():
        for find, rule in ID_RULES:
            for m in find.findall(s):
                seen[m] = seen.get(m, 0) + 1
                if not rule.match(m):
                    bad.append(f"{f}:{p} '{m}'")
    ok = expect(not bad, f"{len(seen)} distinct IDs, all in the synthetic patterns of 05a §1.1", d)
    d.extend("     " + b for b in bad)
    partner_ids = set()
    for _, _, s in strings():
        for kind, key in TOKEN_RE.findall(s):
            if kind == "partner":
                partner_ids.add(key)
    ok &= expect(all(re.match(r"^(ESD-[A-Z]{2}-\d{2}|DIST-[A-Z]{2}-\d{3}|DLR-[A-Z]{1,2}-\d{3})$", p) for p in partner_ids),
                 f"{len(partner_ids)} partner IDs follow ESD-/DIST-/DLR- synthetic patterns", d)
    ok &= expect(all(re.match(r"^E4-S-\d{8}$", r["serial"]) for r in hero["rmas"]), "RMA serials E4-S-YYWWNNNN", d)
    ok &= expect(all(re.match(r"^26\d{2}$", c["dateCode"]) for c in ib["dateCode"]["cells"]), "date codes YYWW (2601–2626)", d)
    ok &= expect(all(re.match(r"^SIG-2609-(00\d|E01)$", s["displayId"]) for s in mon["signals"]), "signal display IDs SIG-2609-NNN", d)
    syn = [s for s in ("title", "headline") for x in [hero["signal"]] if "(synthetic)" in render(x[s])]
    ok &= expect("headline" in syn, "hero headline marks firmware '(synthetic)'", d)
    return ok


@check("E6", "Tokens resolve; Anonymise ON leaves no real name")
def e6(d):
    unknown, count = [], 0
    for f, p, s in strings([x for x in FILES if x != "anonymise.json"]):
        for kind, key in TOKEN_RE.findall(s):
            count += 1
            if key not in ANON.get(kind, {}):
                unknown.append(f"{f}:{p} {{{{{kind}:{key}}}}}")
    ok = expect(not unknown, f"{count} tokens, all resolvable by anonymise.json", d)
    d.extend("     " + u for u in unknown)
    leaks = []
    named = set()
    for kind in ANON:
        for key, v in ANON[kind].items():
            if kind != "fw":
                named.add(v["named"])
                named.add(key)
    named_re = re.compile(r"(?<![\w\-/])(" + "|".join(re.escape(n) for n in sorted(named, key=len, reverse=True)) + r")(?![\w/]|-[A-Z0-9])")
    fw_re = re.compile(r"(?<![\w.])(4\.0|4\.1)(?![\d×%])|\bfw \d")
    for f, p, s in strings([x for x in FILES if x != "anonymise.json"]):
        if f == "meta.json" and p.startswith("filters.region"):
            continue
        if p.endswith("versionRaw") or ROLE_PATH.search(p):
            continue
        r = render(s, anon=True)
        for m in named_re.findall(r):
            leaks.append(f"{f}:{p} name '{m}'")
        for m in (x.group(0) for x in fw_re.finditer(r)):
            leaks.append(f"{f}:{p} firmware '{m}' in: {r[:60]}")
    ok &= expect(not leaks, f"anonymised render leaks: {len(leaks)}", d)
    d.extend("     " + x for x in leaks[:20])
    d.append("note meta.filters.region option values stay raw by contract; render them with label('region', v, anon) when a key exists")
    sample = render(hero["signal"]["headline"], anon=True)
    ok &= expect(sample.startswith("Panel platform A · firmware A.4.1 (synthetic)"), f"sample: {sample[:60]}…", d)
    ok &= expect(render(hero["signal"]["headline"]) == "EST4 · firmware 4.1 (synthetic) — 'devices not found after upgrade' contacts 3.1× panels still on 4.0; 9 partners, 3 regions; 1,240 panels on version",
                 "named render reproduces 02 HS-3 headline exactly", d)
    return ok


@check("E7", "GEN constraints and series consistency")
def e7(d):
    ok = True
    wk = meta["weeks"]
    ok &= expect(len(wk) == 26 and wk[0]["weekStart"] == "2026-03-30" and wk[-1]["weekStart"] == "2026-09-21"
                 and all((dt.date.fromisoformat(b["weekStart"]) - dt.date.fromisoformat(a["weekStart"])).days == 7 for a, b in zip(wk, wk[1:])),
                 "weeks W1 30 Mar … W26 21 Sep, Mondays 7 days apart", d)
    ok &= expect(all(dt.date.fromisoformat(w["weekStart"]).weekday() == 0 for w in wk), "every weekStart is a Monday", d)
    di = meta["dailyInteractions"]
    sums = [sum(x["count"] for x in di if x["week"] == w) for w in range(1, 27)]
    ok &= expect(len(di) == 130 and sums == meta["weeklyInteractions"], "130 working days; each week sums to weeklyInteractions", d)
    cmin, cmax = min(x["count"] for x in di), max(x["count"] for x in di)
    ok &= expect(1100 <= cmin and cmax <= 2900, f"per-day range {cmin:,}–{cmax:,} (1,100–2,900)", d)
    ok &= expect(round(233900 / 130) in range(1790, 1810), f"mean {233900 / 130:,.1f} per working day (~1,800)", d)
    ok &= expect(max(range(26), key=lambda i: meta["weeklyInteractions"][i]) == 12, "quarter-end peak in W13", d)
    ok &= expect(all(dt.date.fromisoformat(x["date"]).weekday() < 5 for x in di), "working days only", d)
    ok &= expect(abs(sum(meta["channelMix"].values()) - 1) < 1e-9, "channel mix sums to 100%", d)
    series = {render(s["name"]): s["values"] for s in sep["cutoverTimeline"]["series"]}
    for name, lo, hi, mean, tail in (("UK-EU remit-to & entity contacts", 26, 34, 30, [55, 80, 82, 81]),
                                     ("UK-EU portal login", 19, 25, 22, [51, 74, 76, 75]),
                                     ("Control regions — remit-to & entity", 36, 44, 40, [42, 43, 44, 45])):
        v = series[name]
        ok &= expect(len(v) == 26 and all(lo <= x <= hi for x in v[:22]) and sum(v[:22]) == mean * 22 and v[22:] == tail,
                     f"{name}: W1–W22 in {lo}–{hi}, mean {sum(v[:22]) / 22:g}; W23–W26 {v[22:]}", d)
        ok &= expect(all(abs(x - mean) <= 4 for x in v[15:22]), f"{name}: no bump after W16 / W19 / W20 (clean cutovers)", d)
    cells = ib["dateCode"]["cells"]
    win = [c for c in cells if c["inWindow"]]
    ok &= expect([c["dateCode"] for c in win] == ["2611", "2612", "2613", "2614"] and sum(c["units"] for c in win) == 4800,
                 f"date-code window 2611–2614, units Σ {sum(c['units'] for c in win):,} (4,800)", d)
    ok &= expect(all(1100 <= c["units"] <= 1300 for c in cells), "date-code units ~1,200 per week (1,100–1,300)", d)
    ok &= expect(all(c["relativeRisk"] == round(c["ratePer10k"] / 1.1 + 1e-9, 1) for c in cells), "relativeRisk = rate ÷ 1.1", d)
    wmean = sum(c["ratePer10k"] for c in win) / 4
    ok &= expect(round(wmean / 1.1, 1) == 4.2, f"window mean {wmean} ÷ 1.1 = {wmean / 1.1:.2f} → 4.2×", d)
    bands_bad = []
    for s in hero["lineage"]["series"]:
        for pt in s["points"]:
            c, n = pt["contacts"], pt["panels"]
            lo = round(max(0.0, c - 1.645 * math.sqrt(c)) * 1000 / n + 1e-9, 1)
            hi = round((c + 1 + 1.645 * math.sqrt(c)) * 1000 / n + 1e-9, 1)
            if (pt["rateLow"], pt["rateHigh"]) != (lo, hi) or not (pt["rateLow"] <= pt["rate"] <= pt["rateHigh"]):
                bands_bad.append(f"{s['versionRaw']} W{pt['week']}")
            if dt.date.fromisoformat(pt["weekStart"]) != dt.date(2026, 3, 30) + dt.timedelta(days=7 * (pt["week"] - 1)):
                bands_bad.append(f"weekStart W{pt['week']}")
    ok &= expect(not bands_bad, "lineage bands follow the 05a formula and contain the rate", d)
    d.extend("     " + b for b in bands_bad)
    s40 = hero["lineage"]["series"][0]["points"]
    s41 = hero["lineage"]["series"][1]["points"]
    ok &= expect(len(s40) == 26 and len(s41) == 4 and s41[0]["week"] == 23, "4.0 series W1–W26, 4.1 series W23–W26", d)
    ok &= expect(all(a["panels"] + (s41[i - 22]["panels"] if i >= 22 else 0) <= 6800 for i, a in enumerate(s40)), "panels on 4.0 + 4.1 ≤ 6,800 eligible", d)
    lm = {render(s["label"]): s["values"] for s in ib["lineageMonitor"]["series"]}
    ok &= expect(lm["EST4 4.0 (syn.)"] == [p["rate"] for p in s40[14:]], "Q1 lineage monitor 4.0 = hero W15–W26", d)
    ok &= expect(lm["EST4 4.1 (syn.)"][8:] == [p["rate"] for p in s41] and lm["EST4 4.1 (syn.)"][:8] == [None] * 8, "Q1 lineage monitor 4.1 = hero W23–W26", d)
    ok &= expect(ib["contactsVsRma"]["fw41"][22:] == [p["contacts"] for p in s41] and all(a <= b for a, b in zip(ib["contactsVsRma"]["fw41"], ib["contactsVsRma"]["trouble"])),
                 "contactsVsRma fw41 = hero contacts and ≤ trouble", d)
    mk_bad = []
    for f, path in (("signal_fw41.json", "lineage.markers[]"), ("installedBase.json", "lineageMonitor.markers[]"),
                    ("installedBase.json", "contactsVsRma.markers[]"), ("channel.json", "partnerTimeline.markers[]"),
                    ("separation.json", "cutoverTimeline.markers[]")):
        for m in at(D[f], path):
            if int(m["week"]) != week_of(m["date"]):
                mk_bad.append(f"{f} {m['label']}")
    ok &= expect(not mk_bad, "every chart marker's week matches its date", d)
    d.extend("     " + x for x in mk_bad)
    for s in mon["signals"]:
        if s.get("rankFactors"):
            tot = round(sum(f["weight"] * f["score"] for f in s["rankFactors"]), 2)
            ws = round(sum(f["weight"] for f in s["rankFactors"]), 6)
            ok &= expect(tot == s["rankScore"] and ws == 1.0 and all(0 <= f["score"] <= 1 for f in s["rankFactors"]),
                         f"{s['id']}: Σ weight × score = {tot} (rankScore {s['rankScore']})", d)
    ranks = [s["id"] for s in sorted(ABOVE, key=lambda s: s["rank"])]
    ok &= expect(ranks == ["fw-4-1", "dc-d2-2611", "esd-se-07", "n3-backorder", "ukeu-entity-cutover"], "rank order fw 4.1 · D-2 · ESD-SE-07 · N-3 · UK-EU", d)
    ok &= expect([c["signalId"] for c in mon["cards"]] == ranks and [c["rank"] for c in mon["cards"]] == [1, 2, 3, 4, 5], "monitor cards follow rank order", d)
    ok &= expect(sorted(s["rankScore"] for s in ABOVE) == sorted([0.84, 0.71, 0.66, 0.58, 0.52], ), "rank scores 0.84 / 0.71 / 0.66 / 0.58 / 0.52", d)
    leads = []
    for s in ABOVE:
        lead = (dt.date.fromisoformat(s["nextReview"]["date"]) - dt.date.fromisoformat(s["aboveSince"][:10])).days
        leads.append(lead)
        ok &= expect(lead == s["nextReview"]["leadDays"], f"{s['id']}: lead {lead} days = review − aboveSince", d)
    ll = {x["signalId"]: x["lead"] for x in ex["appliedValue"]["leadList"]}
    ok &= expect(all(ll[s["id"]] == s["nextReview"]["leadDays"] for s in ABOVE), "AV-1 lead list = signal leads", d)
    ok &= expect(sorted(leads)[2] == 21, f"median lead {sorted(leads)[2]} days (V-11: 21)", d)
    awaiting = sum(1 for s in ABOVE if s["gates"][0]["status"] == "awaiting")
    drafts = sum(1 for s in ABOVE for g in s["gates"] if g["artefactType"] != "dunning-pause")
    ok &= expect((awaiting, drafts) == (5, 7), f"AV-3: {awaiting} awaiting owners · {drafts} drafts (dunning pause is a decision, not a draft)", d)
    ok &= expect(all(s["routing"]["owner"] for s in mon["signals"]) and len({s["id"] for s in ABOVE}) == 5, "every signal has exactly one owner", d)
    hs = hero["signal"]
    same = all(hs[k] == SIG["fw-4-1"][k] for k in SIG["fw-4-1"])
    ok &= expect(same, "monitor.signals[fw-4-1] = signal_fw41.signal (same record)", d)
    for s in ABOVE:
        sev = s["severity"]
        ok &= expect(all([sev["class"], sev["type"], sev["blastRadius"]["headline"], sev["incident"]["note"], s["confidence"]["short"],
                          s["routing"]["owner"], s["gates"], s["pnl"]["compact"], s["joinTags"]]),
                     f"{s['id']}: severity + type + blast radius + incident, K/I, owner, gate, P&L, join tags present", d)
    return ok


def parse_02():
    txt = open(DOC02, encoding="utf-8").read()
    reg = {}
    for m in re.finditer(r"^\| (V-\d\d) \| (.+?) \| (.+?) \|$", txt, flags=re.M):
        reg[m.group(1)] = (m.group(2).replace("**", "").strip(), m.group(3).replace("**", "").strip())
    return txt.replace("**", ""), reg


@check("E8", "Exec and value copy verbatim from 02")
def e8(d):
    if not os.path.exists(DOC02):
        d.append("note 02_Requirements_Pain_Value.md not found next to mock/ — skipped")
        return True
    txt, reg = parse_02()
    ok = expect(len(reg) == 14, f"parsed {len(reg)} V-rows from 02 §2", d)
    diffs = [i for i, (fig, meth) in reg.items() if render(VR[i]["figure"]) != fig or render(VR[i]["method"]) != meth]
    ok &= expect(not diffs, "valueRegister figure + method = 02 §2 verbatim" + (f" — differs: {diffs}" if diffs else ""), d)
    must = [("brief", ex["brief"])]
    must += [(f"pulse {p['n']}", p["text"]) for p in ex["pulse"]]
    for q in ex["questionCards"]:
        must += [(f"{q['id']} title", q["title"]), (f"{q['id']} caption", q["caption"]), (f"{q['id']} insight", q["insight"])]
        must += [(f"{q['id']} gauge", g["label"]) for g in q["gauges"]]
    for c in mon["cards"]:
        must += [(f"card {c['rank']} title", c["title"]), (f"card {c['rank']} suggestion", c["suggestion"]),
                 (f"card {c['rank']} blast", c["blastRadius"]), (f"card {c['rank']} owner·gate", c["ownerGate"]),
                 (f"card {c['rank']} confidence", c["confidenceShort"])]
    for t in ex["appliedValue"]["tiles"]:
        must += [(f"{t['id']} label", t["label"]), (f"{t['id']} sub", t["sub"])] + [(f"{t['id']} line", x) for x in t.get("lines", [])]
    must += [("AV footnote", ex["appliedValue"]["footnote"])]
    must += [(f"{w['id']} row", w["row"]) for w in ex["governedWatch"]["items"]]
    must += [("W-1 second line", ex["governedWatch"]["items"][0]["secondLine"])]
    must += [(f"value statement {i + 1}", s) for i, s in enumerate(ex["valueStatements"])]
    h = hero["signal"]
    must += [("hero headline", h["headline"]), ("hero metric line", h["metric"]["line"]), ("hero counter-evidence", h["counterEvidence"]),
             ("hero recommended action", h["recommendedAction"]), ("hero gate title", h["gates"][0]["title"]),
             ("hero approved title", h["gates"][0]["onApprove"]["title"]), ("hero caption", h["pnl"]["exposure"]["caption"])]
    must += [(f"hero chip {i + 1}", c["text"]) for i, c in enumerate(h["chips"])]
    must += [(f"hero sub-tile {i + 1}", s["text"]) for i, s in enumerate(h["pnl"]["exposure"]["subTiles"])]
    must += [(f"marker {i + 1}", m["label"]) for i, m in enumerate(hero["lineage"]["markers"])]
    must += [("meta badge", meta["badge"]), ("meta footer", meta["footer"]), ("meta promise", meta["promise"]),
             ("meta descriptor", meta["descriptor"]), ("evidence readiness", ex["evidenceReadiness"]["body"])]
    miss = [lab for lab, s in must if render(s) not in txt]
    ok &= expect(not miss, f"{len(must) - len(miss)} of {len(must)} exec / hero strings found verbatim in 02", d)
    d.extend("     missing: " + m for m in miss)
    return ok


@check("E9", "Arithmetic behind copy")
def e9(d):
    s40 = hero["lineage"]["series"][0]["points"]
    bad = [p["week"] for p in s40 if p["rate"] != float(f"{p['contacts'] * 1000 / p['panels']:.1f}")]
    ok = expect(not bad, "every 4.0 weekly rate = contacts ÷ panels × 1,000 (1 dp)" + (f" — differs W{bad}" if bad else ""), d)
    same3 = sum(p["contacts"] for p in s40[23:]) * 1000 / sum(p["panels"] for p in s40[23:])
    ok &= expect(round(same3, 1) == 2.0 == hero["signal"]["metric"]["baseline"], f"headline 2.0 on 4.0, W24–W26 = {same3:.2f}", d)
    cvr = ib["contactsVsRma"]
    share = sum(cvr["fw41"][22:]) / sum(cvr["trouble"][22:]) * 100
    ok &= expect(f"about {round(share)}%" in cvr["caption"], f"P-F caption share 23 ÷ {sum(cvr['trouble'][22:]):,} = {share:.1f}% → 'about {round(share)}%'", d)
    ratio_bad = []
    for f, p, s in strings(["channel.json", "monitor.json", "separation.json", "installedBase.json", "exec.json"]):
        for a, b, r in re.findall(r"\b(\d+) vs (\d+) \((\d+\.\d)×\)", s):
            if round(int(a) / int(b), 1) != float(r):
                ratio_bad.append(f"{f}:{p} {a} vs {b} ({r}×)")
    ok &= expect(not ratio_bad, "every 'a vs b (r×)' in copy rounds correctly (e.g. Houston 11 vs 3 = 3.7×)", d)
    d.extend("     " + x for x in ratio_bad)
    card3 = next(c for c in mon["cards"] if c["signalId"] == "esd-se-07")
    ok &= expect(card3["metrics"][0]["value"] == "13 → 40" and SIG["esd-se-07"]["metric"]["value"] == 40, "ESD-SE-07 card and signal read 13 → 40 (3.1×)", d)
    k = {x["label"]: x["value"] for x in ch["kpis"]}
    ok &= expect(k.get("CERTIFICATIONS LAPSING ≤30 DAYS") == "186", "certifications lapsing ≤30 days = 186 (212 kept only for look-alikes and invoices)", d)
    return ok


@check("E2", "House style")
def e2(d):
    ok = True
    us = re.compile(r"(?i)\b(color|behavior|favor|analyz\w*|organiz\w*|optimiz\w*|prioritiz\w*|recogniz\w*|minimiz\w*|summariz\w*|catalog|signaling)\b")
    hits = [f"{f}:{p} {m}" for f, p, s in strings() for m in us.findall(render(s))]
    ok &= expect(not hits, "British spelling spot-check (colour, signalling, recognised …)", d)
    d.extend("     " + x for x in hits)
    ok &= expect(all("LiSN" not in k for f in FILES for _, k in walk_keys(D[f])), "no 'LiSN' casing in keys", d)
    upper = [f"{f}:{p}" for f, p, s in strings() if re.search(r"LISN", s)]
    ok &= expect(not upper, "caps labels write 'LiSN INSIGHT' literally (no LISN)", d)
    wall = [s for f, p, s in strings() if "Click for details" in s]
    ok &= expect(not wall, "wall link label is 'Open signal →'", d)
    sent = [f"{f}:{p}" for f, p, s in strings() if re.search(r"(?i)\b(was sent|has been sent|notified)\b", s) and "Nothing has been sent" not in s and "No outreach has been sent" not in s]
    ok &= expect(not sent, "no 'sent' / 'notified' wording for LiSN actions", d)
    return ok


# ---------------------------------------------------------------------------
def main():
    order = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"]
    res = {r[0]: r for r in results}
    lines = ["LiSN × KGS demo — mock-data check report",
             f"generated {dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC')} · data/ from generate_mock.py (seed 20260925)",
             "C1–C10 = 05a §6 generator checks · E1–E9 = extra checks requested for this build", ""]
    for cid in order:
        _, title, ok, details = res[cid]
        lines.append(f"[{'PASS' if ok else 'FAIL'}] {cid:<4} {title}")
        for x in details:
            lines.append(f"         {x}")
        lines.append("")
    n_pass = sum(res[c][2] for c in order)
    lines.append(f"SUMMARY: {n_pass} / {len(order)} checks passed")
    report = "\n".join(lines) + "\n"
    with open(os.path.join(HERE, "check_report.txt"), "w", encoding="utf-8") as fh:
        fh.write(report)
    for cid in order:
        print(f"[{'PASS' if res[cid][2] else 'FAIL'}] {cid:<4} {res[cid][1]}")
    print(f"SUMMARY: {n_pass} / {len(order)} checks passed · details in check_report.txt")
    return 0 if n_pass == len(order) else 1


if __name__ == "__main__":
    sys.exit(main())
