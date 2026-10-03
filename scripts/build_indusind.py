"""IndusInd · page payloads. Reads config/indusind.yaml, the L1 register (data/public/) and the L3 seed
(data/seed/indusind_v1/), and writes one JSON file per page to data/out/indusind_v1/. Every window is precomputed here;
nothing is computed in the browser. Every figure is a dict with an id, a layer and a display string:

  L1  register or sensitivity ID (N08, S01, P04, ...). value null while IND-D1 is missing: display "pending verification".
  L2  public live. Not loaded: blocks carry {"loaded": false} and the screens say "Public data not yet loaded".
  L3  "L3:<dataset>:<measure>:<scope>:<window>". Shares and indices only until N31 sets the complaint scale (IV-05).

Pages carry only what they render (privacy: slice per page on the server).
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import re
from pathlib import Path

import yaml

import seed_indusind as SEED

ROOT = Path(__file__).resolve().parents[1]
CONFIG = yaml.safe_load((ROOT / "config" / "indusind.yaml").read_text(encoding="utf-8"))
REG = {e["id"]: e for e in json.loads((ROOT / "data" / "public" / "indusind_register.json").read_text(encoding="utf-8"))["entries"]}
SENS = {e["id"]: e for e in json.loads((ROOT / "data" / "public" / "indusind_sensitivities.json").read_text(encoding="utf-8"))["entries"]}
SEED_DIR = ROOT / "data" / "seed" / "indusind_v1"
OUT = ROOT / "data" / "out" / "indusind_v1"
FREEZE = dt.datetime.fromisoformat(CONFIG["data_freeze"])
PENDING = CONFIG["copy"]["pending"]
NOT_LOADED = CONFIG["copy"]["not_loaded"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def fdate(d: dt.date | dt.datetime) -> str:
    return f"{d.day} {MONTHS[d.month - 1]} {d.year}"


def ftime(t: dt.datetime) -> str:
    return f"{fdate(t)}, {t.strftime('%H:%M')} IST"


# ---------------------------------------------------------------- L1 figures

def l1(rid: str) -> dict:
    e = REG[rid]
    pending = e["value"] is None
    return {
        "id": rid, "layer": "L1", "tag": "Public · verified", "label": e["label_short"], "period": e["period"],
        "basis": e["measure_basis"], "note": e["label_on_screen"], "status": e["status"],
        "value": e["value"], "display": PENDING if pending else e["display"], "pending": pending,
        "source": e["source_title"], "source_date": e["source_date"],
    }


def formula_text(formula: str) -> str:
    """The arithmetic in words: each register or sensitivity ID replaced by its label and period, so no ID reaches the
    screen. "x" becomes the multiplication sign."""
    def name(m):
        i = m.group(0)
        if i in REG:
            return f"{REG[i]['label_short']} ({REG[i]['period']})"
        return SENS[i]["label"] if i in SENS else i
    return re.sub(r"\b[NDPS]\d{2}\b", name, formula).replace(" x ", " × ")


def sens(sid: str) -> dict:
    e = SENS[sid]
    return {
        "id": sid, "layer": "L1", "tag": "Public · verified (derived)", "label": e["label"], "derived": True,
        "formula_text": formula_text(e["formula"]),
        "inputs": [l1(i) if i in REG else {"id": i, "layer": "L1", "label": SENS[i]["label"], "value": SENS[i]["value"], "display": PENDING, "pending": True}
                   for i in e["inputs"]],
        "value": e["value"], "display": PENDING if e["value"] is None else e["value"], "pending": e["value"] is None,
        "basis_note": e["basis_note"], "caveat": e["caveats"],
    }


def not_loaded(what: str) -> dict:
    return {"layer": "L2", "tag": "Public · live", "loaded": False, "text": NOT_LOADED, "what": what}


# ---------------------------------------------------------------- L3 helpers

def l3(dataset: str, measure: str, scope: str, window: str, value, display: str, **extra) -> dict:
    return {"id": f"L3:{dataset}:{measure}:{scope}:{window}", "layer": "L3", "tag": "Internal · illustrative until discovery",
            "value": value, "display": display, **extra}


def pct(a: float, b: float, d: int = 1):
    return None if not b else round(100 * a / b, d)


def show_pct(v, d=1) -> str:
    return "—" if v is None else f"{v:.{d}f}%"


def show_index(v) -> str:
    return "—" if v is None else f"{v:.0f}"


def show_change(v) -> str:
    if v is None:
        return "no earlier period"
    sign = "+" if v > 0 else "−" if v < 0 else ""
    return f"{sign}{abs(v):.0f}% vs previous period"


class Data:
    def __init__(self):
        self.meta = json.loads((SEED_DIR / "meta.json").read_text(encoding="utf-8"))
        self.weeks = [dt.date.fromisoformat(w) for w in self.meta["weeks"]]
        self.q1 = [dt.date.fromisoformat(w) for w in self.meta["q1_weeks"]]
        self.cs = [json.loads(line) for line in open(SEED_DIR / "complaints.jsonl", encoding="utf-8")]
        for c in self.cs:
            c["_rec"] = dt.datetime.fromisoformat(c["received_at"])
        self.contacts = json.loads((SEED_DIR / "contacts_weekly.json").read_text(encoding="utf-8"))
        self.cards = json.loads((SEED_DIR / "cards_internal.json").read_text(encoding="utf-8"))
        self.deposits = json.loads((SEED_DIR / "deposits_weekly.json").read_text(encoding="utf-8"))
        self.period_end = json.loads((SEED_DIR / "deposits_period_end.json").read_text(encoding="utf-8"))
        self.actions = json.loads((SEED_DIR / "actions.json").read_text(encoding="utf-8"))

    def window(self, wid: str) -> dict:
        n = next(w["weeks"] for w in CONFIG["windows"] if w["id"] == wid)
        weeks = self.weeks[-n:]
        prev = self.weeks[-2 * n:-n]
        end = FREEZE
        start = FREEZE - dt.timedelta(days=7 * n)
        return {"id": wid, "n": n, "weeks": weeks, "prev": prev, "start": start, "end": end,
                "prev_start": start - dt.timedelta(days=7 * n), "label": next(w["label"] for w in CONFIG["windows"] if w["id"] == wid)}


D: Data


def products_of(business: str) -> set[str]:
    return set(D_PRODUCTS[business]) if business != "all" else set(SEED.PRODUCTS)


D_PRODUCTS = {"deposits": ["deposits"], "vehicle": ["vehicle"], "micro": ["micro"], "cards": ["cards"],
              "personal": ["personal"], "digital": ["digital"], "wholesale": []}


def weekly_avg(rows, key, weeks) -> float:
    ws = {w.isoformat() for w in weeks}
    return sum(r[key] for r in rows if r["week_ending"] in ws) / max(len(weeks), 1)


def complaint_block(scope: str, products: set[str], w: dict) -> dict:
    """Inside the bank, complaints, for one scope and window: cohort received in the window, state at the window end."""
    T = w["end"]
    q1 = [c for c in D.cs if c["product"] in products and dt.date.fromisoformat(c["received_at"][:10]) <= max(D.q1)
          and c["_rec"] >= dt.datetime(2026, 4, 3, tzinfo=FREEZE.tzinfo) - dt.timedelta(days=7)]
    q1_weekly = len(q1) / len(D.q1)
    cur = [c for c in D.cs if c["product"] in products and w["start"] < c["_rec"] <= T]
    prev = [c for c in D.cs if c["product"] in products and w["prev_start"] < c["_rec"] <= w["start"]]
    st = [SEED.complaint_state(c, T) for c in cur]
    n = len(cur)
    stock = [s for c in D.cs if c["product"] in products and (s := SEED.complaint_state(c, T)) and s["pending"]]
    over30 = pct(sum(s["over_30"] for s in stock), len(stock))
    idx = round(100 * (n / w["n"]) / q1_weekly) if q1_weekly else None
    change = round(100 * (len(cur) - len(prev)) / len(prev)) if prev else None
    resolved = sum(s["resolved"] for s in st)
    opn = sum(s["open"] for s in st)
    wait = sum(s["waiting"] for s in st)
    assert resolved + opn + wait == n, (scope, w["id"])
    W = w["id"]
    out = {
        "received_index": l3("complaints_weekly", "received_index", scope, W, idx, show_index(idx), basis="Q1 weekly average = 100"),
        "change": l3("complaints_weekly", "received_change", scope, W, change, show_change(change)),
        "resolved": l3("complaints_weekly", "resolved_share", scope, W, pct(resolved, n), show_pct(pct(resolved, n))),
        "open": l3("complaints_weekly", "open_share", scope, W, pct(opn, n), show_pct(pct(opn, n))),
        "waiting": l3("complaints_weekly", "waiting_share", scope, W, pct(wait, n), show_pct(pct(wait, n))),
        # Open too long: of the complaints pending at the window end (any age), the share more than 30 days old.
        "over_30": l3("complaints_weekly", "over_30_share_of_pending", scope, W, over30, show_pct(over30)),
        "escalated": l3("complaints_weekly", "grievance_share", scope, W, pct(sum(c["escalated_grievance"] for c in cur), n),
                        show_pct(pct(sum(c["escalated_grievance"] for c in cur), n))),
        "io": l3("complaints_weekly", "referred_to_io_share", scope, W, pct(sum(1 for c in cur if c["decision_at"]), n),
                 show_pct(pct(sum(1 for c in cur if c["decision_at"]), n))),
        "escalation_language": l3("complaints_weekly", "escalation_language_share", scope, W,
                                  pct(sum(c["escalation_language"] for c in cur), n), show_pct(pct(sum(c["escalation_language"] for c in cur), n))),
        "_n": n, "_resolved": resolved, "_open": opn, "_waiting": wait,
    }
    # Weekly trend of the received index over the last 13 weeks (hover values), whatever the window.
    series = []
    for wk in D.weeks[-13:]:
        e = dt.datetime.combine(wk, FREEZE.timetz())
        k = sum(1 for c in D.cs if c["product"] in products and e - dt.timedelta(days=7) < c["_rec"] <= e)
        series.append({"end": wk.isoformat(), "value": round(100 * k / q1_weekly) if q1_weekly else None})
    out["trend"] = {"id": f"L3:complaints_weekly:received_index_weekly:{scope}", "layer": "L3", "unit": "index", "points": series}
    return out


def channels_block(products: set[str], w: dict) -> list[dict]:
    T = w["end"]
    cur = [c for c in D.cs if c["product"] in products and w["start"] < c["_rec"] <= T]
    stock = [s | {"_ch": c["channel"]} for c in D.cs if c["product"] in products and (s := SEED.complaint_state(c, T)) and s["pending"]]
    rows = []
    for ch in CONFIG["channels"]:
        xs = [c for c in cur if c["channel"] == ch["id"]]
        st = [SEED.complaint_state(c, T) for c in xs]
        n = len(xs)
        rows.append({
            "id": ch["id"], "label": ch["label"],
            "share": l3("complaints_weekly", "channel_share", ch["id"], w["id"], pct(n, len(cur)), show_pct(pct(n, len(cur)))),
            "resolved": l3("complaints_weekly", "resolved_share", ch["id"], w["id"], pct(sum(s["resolved"] for s in st), n), show_pct(pct(sum(s["resolved"] for s in st), n))),
            "open": l3("complaints_weekly", "open_share", ch["id"], w["id"], pct(sum(s["open"] for s in st), n), show_pct(pct(sum(s["open"] for s in st), n))),
            "waiting": l3("complaints_weekly", "waiting_share", ch["id"], w["id"], pct(sum(s["waiting"] for s in st), n), show_pct(pct(sum(s["waiting"] for s in st), n))),
            "over_30": l3("complaints_weekly", "over_30_share_of_pending", ch["id"], w["id"], *(lambda v: (v, show_pct(v)))(
                pct(sum(s["over_30"] for s in stock if s["_ch"] == ch["id"]), sum(1 for s in stock if s["_ch"] == ch["id"])))),
        })
    return rows


def contacts_block(products: set[str], w: dict, scope: str) -> dict:
    ws = {x.isoformat() for x in w["weeks"]}
    rs = [r for r in D.contacts if r["product"] in products and r["week_ending"] in ws]
    n, neg = sum(r["contacts"] for r in rs), sum(r["negative"] for r in rs)
    q1 = weekly_avg([r for r in D.contacts if r["product"] in products], "contacts", D.q1)
    idx = round(100 * (n / w["n"]) / q1) if q1 else None
    return {
        "index": l3("contacts_weekly", "contacts_index", scope, w["id"], idx, show_index(idx), basis="Q1 weekly average = 100"),
        "negative": l3("contacts_weekly", "negative_share", scope, w["id"], pct(neg, n), show_pct(pct(neg, n))),
    }


def ombudsman_block(products: set[str], scope: str, w: dict) -> dict:
    """Ombudsman watch at the window end, as shares of pending complaints, with the change since the window start."""
    def snap(T):
        st = [s for c in D.cs if c["product"] in products and (s := SEED.complaint_state(c, T))]
        pend = sum(s["pending"] for s in st)
        dec = sum(1 for c in D.cs if c["product"] in products and c["decision_at"] and dt.datetime.fromisoformat(c["decision_at"]) <= T)
        return st, pend, dec
    st, pend, decided = snap(w["end"])
    st0, pend0, _ = snap(w["start"])
    out = {}
    for k, label in (("brink", "On the brink"), ("eligible", "Already eligible"), ("unhappy", "Unhappy with the reply"), ("awaiting_io", "Awaiting IO review")):
        now, before = pct(sum(s[k] for s in st), pend), pct(sum(s[k] for s in st0), pend0)
        delta = None if now is None or before is None else round(now - before, 1)
        out[k] = l3("complaints", f"{k}_share_of_pending", scope, w["id"], now, show_pct(now), label=label,
                    delta=delta, delta_display=("—" if delta is None else f"{'+' if delta > 0 else '−' if delta < 0 else ''}{abs(delta):.1f} pts since {fdate(w['start'])}"))
    risk = [s for s in st if s["brink"] or s["eligible"] or s["unhappy"]]
    out["at_risk"] = l3("complaints", "at_risk_share_of_pending", scope, w["id"], pct(len(risk), pend), show_pct(pct(len(risk), pend)), label="At risk")
    out["_pending"], out["_at_risk"], out["_decided"] = pend, len(risk), decided
    out["_counts"] = {k: sum(s[k] for s in st) for k in ("brink", "eligible", "unhappy", "awaiting_io", "pending")}
    return out


def by_business_risk(w: dict) -> list[dict]:
    rows = []
    allp = [c for c in D.cs if (s := SEED.complaint_state(c, w["end"])) and (s["brink"] or s["eligible"] or s["unhappy"])]
    for b in CONFIG["businesses"]:
        if b["id"] == "wholesale":
            continue
        ps = products_of(b["id"])
        xs = [c for c in allp if c["product"] in ps]
        rows.append({"id": b["id"], "label": b["label"],
                     "share": l3("complaints", "at_risk_share_by_business", b["id"], w["id"], pct(len(xs), len(allp)), show_pct(pct(len(xs), len(allp))))})
    return rows


# ---------------------------------------------------------------- pages

def common() -> dict:
    c = CONFIG["copy"]
    return {
        "bank": CONFIG["bank"],
        "freeze": ftime(FREEZE), "freeze_provisional": CONFIG["data_freeze_provisional"],
        "windows": [{"id": w["id"], "label": w["label"]} for w in CONFIG["windows"]], "default_window": CONFIG["default_window"],
        "views": CONFIG["views"],
        "businesses": [{"id": "all", "label": "All"}] + [{"id": b["id"], "label": b["label"]} for b in CONFIG["businesses"] if b["id"] in CONFIG["business_filter"]],
        "watermark": c["watermark"],
        # IND-D1 carries the disclosure date; until then the clause reads "as of a date pending verification".
        "footer": c["footer"].format(public_as_of=f"a date {PENDING}", freeze=ftime(FREEZE)),
        "pulse_caption": c["pulse_caption"],
        "pending": PENDING, "not_loaded": NOT_LOADED, "sensitivity_footer": c["sensitivity_footer"],
        "defs": c["defs"],
    }


def card_payload(card: dict, w: dict) -> dict:
    act = next(a for a in D.actions if a["card_id"] == card["id"])
    title = card["title"]
    days = None
    fill = {rid: l1(rid)["display"] for rid in REG}
    fill["N36_days"] = PENDING if REG["N36"]["value"] is None else f"{days} days"
    inside = {"text": card["inside"]}
    if card["id"] == "A":
        inside["figures"] = top_clusters(w)
    elif card["id"] == "C":
        inside["figures"] = region_split("vehicle", w)
    elif card["id"] == "D":
        inside["figures"] = distribution_by_product(w)
    return {
        "id": card["id"],
        "title": title.format(**fill),
        # The title as parts, so a pending value renders as a small chip, not as words in the sentence.
        "title_parts": title_parts(title),
        "what": [l1(r) for r in card["figures"]],
        "peers": [l1(r) for r in card["peers"]],
        "peers_held": not card["peers"],
        "voice": not_loaded("Customer and market voice: " + ", ".join(t.replace("_", " ") for t in card["voice_tags"])),
        "inside": inside,
        "sensitivity": [sens(s) for s in card["sensitivity"]],
        "exposure": card.get("exposure"),
        "owner": card["owner"], "with": card["with"],
        "action": act,
        "module": card["module"],
    }


def title_parts(title: str) -> list[dict]:
    import re
    parts, pos = [], 0
    for m in re.finditer(r"\{(\w+)\}", title):
        if m.start() > pos:
            parts.append({"text": title[pos:m.start()]})
        rid = m.group(1)
        if rid.endswith("_days"):
            base = rid[: -len("_days")]
            parts.append({"fig": {"id": base, "layer": "L1", "display": PENDING, "pending": REG[base]["value"] is None, "label": "days to go"}})
        else:
            parts.append({"fig": l1(rid)})
        pos = m.end()
    if pos < len(title):
        parts.append({"text": title[pos:]})
    return parts


def top_clusters(w: dict) -> list[dict]:
    ws = {x.isoformat() for x in w["weeks"]}
    sa = [r for r in D.deposits if r["product"] == "SA" and r["week_ending"] in ws]
    tot = sum(r["outflow_raw"] for r in sa)
    by = collections.Counter()
    for r in sa:
        by[(r["sa_slab"], r["region"], r["branch_type"])] += r["outflow_raw"]
    lab = {**{s["id"]: s["label"] for s in CONFIG["sa_slabs"]}, **{r["id"]: r["label"] for r in CONFIG["regions"]}, **{b["id"]: b["label"] for b in CONFIG["branch_types"]}}
    out = []
    for (slab, rg, bt), v in by.most_common(3):
        out.append(l3("deposits_weekly", "outflow_share", f"{slab}.{rg}.{bt}", w["id"], pct(v, tot), show_pct(pct(v, tot)),
                      label=f"{lab[slab]} · {lab[rg]} · {lab[bt]}"))
    return out


def region_split(product: str, w: dict) -> list[dict]:
    cur = [c for c in D.cs if c["product"] == product and w["start"] < c["_rec"] <= w["end"]]
    out = []
    for r in CONFIG["regions"]:
        xs = [c for c in cur if c["region"] == r["id"]]
        conduct = sum(1 for c in xs if c["ground"] == "recovery_conduct")
        out.append(l3("complaints_weekly", "conduct_share", f"{product}.{r['id']}", w["id"], pct(conduct, len(xs)), show_pct(pct(conduct, len(xs))),
                      label=f"{r['label']}: conduct complaints, share of the region's"))
    return out


def distribution_by_product(w: dict) -> list[dict]:
    dist = {g["id"] for g in CONFIG["complaint_grounds"] if g.get("distribution")}
    cur = [c for c in D.cs if w["start"] < c["_rec"] <= w["end"]]
    out = []
    for b in CONFIG["businesses"]:
        ps = products_of(b["id"])
        if not ps:
            continue
        xs = [c for c in cur if c["product"] in ps]
        k = sum(1 for c in xs if c["ground"] in dist)
        out.append(l3("complaints_weekly", "distribution_ground_share", b["id"], w["id"], pct(k, len(xs)), show_pct(pct(k, len(xs))),
                      label=f"{b['label']}: share of complaints in distribution grounds"))
    return out


def quiet_item(w: dict) -> dict | None:
    """One item, only from a computed check that passed: this week's complaints received sit within the range of the
    previous 12 weeks (L3). If the check fails, no quiet item is shown."""
    counts = []
    for wk in D.weeks[-13:]:
        e = dt.datetime.combine(wk, FREEZE.timetz())
        counts.append(sum(1 for c in D.cs if e - dt.timedelta(days=7) < c["_rec"] <= e))
    last, prior = counts[-1], counts[:-1]
    passed = min(prior) <= last <= max(prior)
    return {"id": "L3:complaints_weekly:received_within_12_week_range:all:week", "layer": "L3",
            "tag": "Internal · illustrative until discovery", "passed": passed,
            "text": "Complaints received this week: within the range of the previous 12 weeks"} if passed else None


def home() -> dict:
    out = {"quarter": {"items": [l1("N27"), l1("N28"), l1("N29")], "chips": [sens("S01"), sens("S07")]},
           "windows": {}}
    for wd in CONFIG["windows"]:
        w = D.window(wd["id"])
        per = {}
        for b in CONFIG["business_filter"]:
            ps = products_of(b)
            per[b] = {
                "inside": {k: v for k, v in complaint_block(b, ps, w).items() if not k.startswith("_")},
                "contacts": contacts_block(set(SEED.CONTACT_PRODUCTS) if b == "all" else ps, w, b),
                "channels": channels_block(ps, w),
                "ombudsman": {k: v for k, v in ombudsman_block(ps, b, w).items() if not k.startswith("_")},
            }
        rows = []
        for b in CONFIG["businesses"]:
            ps = products_of(b["id"])
            inside = {k: v for k, v in complaint_block(b["id"], ps, w).items() if k in ("received_index", "open", "over_30")} if ps else None
            rows.append({"id": b["id"], "label": b["label"], "next": bool(b.get("next")), "inside": inside,
                         "outside": not_loaded("Public items, negative share, escalation language"),
                         "theme": not_loaded("Top theme, hand-verified"),
                         "money": [l1(r) for r in b["money"]], "module": b["module"]})
        sa_out = deposit_flow_index("SA", "outflow", w)
        per_w = {
            "pulse": per,
            "outside": not_loaded("Public items by source, share of negative voice, escalation language, responded"),
            "doing": {
                "savings": [l1("N04"), l1("N06"), l1("N07"), l1("D08")],
                "outflow_index": sa_out,
                "closures_index": deposit_count_index("SA", "closures", w),
                "app_deposits": l1("N42"),
            },
            "risk_by_business": by_business_risk(w),
            "rows": rows,
            "cards": [card_payload(c, w) for c in CONFIG["cards"]],
            "quiet": quiet_item(w),
        }
        out["windows"][wd["id"]] = per_w
    out["improving"] = [l1(r) for r in CONFIG["improving"][:3]]
    out["horizon"] = [{"id": h["id"], "label": h["label"], "date": l1(h["id"]), "countdown": PENDING if REG[h["id"]]["value"] is None else None}
                      for h in CONFIG["horizon"]]
    out["peer_moves"] = not_loaded("Peer rate-card dates and changes, ad captures, press")
    out["owners"] = [{"card": a["card_id"], "owner": a["owner_role"], "action": a["scope"], "status": a["status"],
                      "age_days": (FREEZE.date() - FREEZE.date()).days, "approver": a["approver_role"]} for a in D.actions]
    return out


def deposit_flow_index(product: str, key: str, w: dict) -> dict:
    """Index (Q1 weekly average = 100) of a deposit flow, for the window, plus the weekly series of the last 13 weeks."""
    raw = f"{key}_raw"
    rows = [r for r in D.deposits if r["product"] == product]
    q1 = weekly_avg(rows, raw, D.q1)
    cur = weekly_avg(rows, raw, w["weeks"])
    idx = round(100 * cur / q1) if q1 else None
    series = [{"end": wk.isoformat(), "value": round(100 * weekly_avg(rows, raw, [wk]) / q1)} for wk in D.weeks[-13:]]
    return {**l3("deposits_weekly", f"{key}_index", product, w["id"], idx, show_index(idx), basis="Q1 weekly average = 100"),
            "trend": {"id": f"L3:deposits_weekly:{key}_index_weekly:{product}", "layer": "L3", "unit": "index", "points": series}}


def deposit_count_index(product: str, key: str, w: dict) -> dict:
    rows = [r for r in D.deposits if r["product"] == product]
    q1 = weekly_avg(rows, key, D.q1)
    cur = weekly_avg(rows, key, w["weeks"])
    idx = round(100 * cur / q1) if q1 else None
    return l3("deposits_weekly", f"{key}_index", product, w["id"], idx, show_index(idx), basis="Q1 weekly average = 100")


def deposits_page() -> dict:
    out = {"balances": {d: {p: l1(v["register"]) for p, v in x.items()} for d, x in D.period_end.items()},
           "casa": [l1("D06"), l1("D05")], "how_high": [sens("S03"), sens("S04"), sens("S01")],
           "cost": {"own": [l1("N10"), l1("N09"), l1("N08")], "peers": [l1("P01"), l1("P02")], "funds": l1("P03"),
                    "decomposition": [l3("deposits_weekly", "gap_part_share", k, "q1", None, PENDING, label=lab)
                                      for k, lab in (("mix", "Mix (CASA, retail share)"), ("term", "Term pricing by bucket"), ("bulk", "Bulk reliance"))],
                    "rate_table": {"loaded": CONFIG["flags"]["manual_read_logged"], "text": "IndusInd rate table: shown once the manual read is logged"}},
           "franchise": [l1("N13"), l1("N14")],
           "why": not_loaded("Peer card dates and changes, ad captures, deposit-voice themes, switching talk"),
           "action": next(a for a in D.actions if a["card_id"] == "A"),
           "windows": {}}
    for wd in CONFIG["windows"]:
        w = D.window(wd["id"])
        ws = {x.isoformat() for x in w["weeks"]}
        sa = [r for r in D.deposits if r["product"] == "SA" and r["week_ending"] in ws]
        tot = sum(r["outflow_raw"] for r in sa)
        heat = collections.Counter()
        for r in sa:
            heat[(r["sa_slab"], r["region"], r["branch_type"])] += r["outflow_raw"]
        cells = [l3("deposits_weekly", "outflow_share", f"{s}.{rg}.{bt}", w["id"], pct(v, tot, 2), show_pct(pct(v, tot, 2), 2),
                    slab=s, region=rg, branch_type=bt) for (s, rg, bt), v in sorted(heat.items())]
        flows = {}
        for prod in ("CA", "SA", "TD"):
            flows[prod] = {"inflow": deposit_flow_index(prod, "inflow", w), "outflow": deposit_flow_index(prod, "outflow", w)}
        td = [r for r in D.deposits if r["product"] == "TD"]
        q1p = weekly_avg(td, "premature_td_withdrawals_index", D.q1)
        cur = weekly_avg(td, "premature_td_withdrawals_index", w["weeks"])
        out["windows"][wd["id"]] = {
            "flows": flows,
            "heatmap": cells,
            "top": top_clusters(w),
            "premature": l3("deposits_weekly", "premature_td_withdrawals_index", "TD", w["id"], round(100 * cur / q1p), show_index(round(100 * cur / q1p))),
            "new_money": deposit_count_index("SA", "new_accounts", w),
        }
    out["slabs"], out["regions"], out["branch_types"] = CONFIG["sa_slabs"], CONFIG["regions"], CONFIG["branch_types"]
    return out


def peers_page() -> dict:
    names = CONFIG["peers"]["names"]
    tiers = [("Core", CONFIG["peers"]["core"]), ("Upper benchmark", CONFIG["peers"]["upper_benchmark"]), ("Specialist", CONFIG["peers"]["specialist"])]
    rows = []
    for tier, banks in tiers:
        for b in banks:
            figs = [l1(e["id"]) for e in REG.values() if e.get("bank") == b and e["measure_basis"] != "rate_card" and not e.get("footnote_only")]
            rows.append({"bank": names[b], "tier": tier, "figures": figs, "held": [l1("H01")] if not figs else []})
    rates = [l1(f"P{i}") for i in range(10, 18)]
    return {
        "table": rows, "footnote": l1("P09"),
        "cards": not_loaded("Card effective dates and changes, read from the rate captures"),
        "rates": {"peers": rates, "indusind": {"loaded": CONFIG["flags"]["manual_read_logged"], "text": "IndusInd's own rate for the same band: shown once the manual read is logged"}},
        "ads": not_loaded("Ten captured creatives: advertiser, date, product, offer"),
        "press": {"ratings": [l1("N40")], "press": not_loaded("Dated press list")},
    }


def risk_page() -> dict:
    grounds = {g["id"]: g["label"] for g in CONFIG["complaint_grounds"]}
    groups = {g["id"]: g["label"] for g in CONFIG["customer_groups"]}
    out = {"calendar": [{"id": h["id"], "label": h["label"], "date": l1(h["id"]), "countdown": PENDING if REG[h["id"]]["value"] is None else None}
                        for h in CONFIG["horizon"]],
           "register": [l1("N31"), l1("N32")],
           "penalties": [l1("N33"), l1("N34")],
           "card_d": None, "windows": {},
           "checklist": [
               {"item": "12 months of complaints about insurance or investment sales reviewed", "status": "Not started"},
               {"item": "App and web journeys with pre-ticked or bundled consent listed", "status": "In progress"},
               {"item": "Incentive lines tied to third-party products mapped", "status": "Not started"},
               {"item": "Refund and compensation process for established mis-selling drafted", "status": "Not started"},
               {"item": "Explicit-consent capture checked on every distribution journey", "status": "In progress"},
           ],
           "escalation": not_loaded("Items naming the RBI, the Ombudsman or a court, by product")}
    for wd in CONFIG["windows"]:
        w = D.window(wd["id"])
        cur = [c for c in D.cs if w["start"] < c["_rec"] <= w["end"]]
        n = len(cur)
        weekly = []
        for wk in D.weeks[-13:]:
            e = dt.datetime.combine(wk, FREEZE.timetz())
            xs = [c for c in D.cs if e - dt.timedelta(days=7) < c["_rec"] <= e]
            st = [SEED.complaint_state(c, e) for c in xs]
            k = len(xs)
            q1w = len([c for c in D.cs if dt.date.fromisoformat(c["received_at"][:10]) <= max(D.q1)]) / len(D.q1)
            weekly.append({"end": wk.isoformat(), "received_index": round(100 * k / q1w),
                           **{f: pct(sum(s[g] for s in st), k) for f, g in (("closed", "resolved"), ("pending", "pending"), ("over_30", "over_30"), ("rejected", "rejected"))},
                           "reopened": pct(sum(s["unhappy"] for s in st), k), "referred_to_io": pct(sum(1 for c in xs if c["decision_at"]), k)})

        def split(key, labels):
            c = collections.Counter(x[key] for x in cur)
            return [l3("complaints", f"{key}_share", k, w["id"], pct(v, n), show_pct(pct(v, n)), label=labels.get(k, k)) for k, v in c.most_common(6)]
        prod_labels = {"deposits": "Deposits", "vehicle": "Vehicle finance", "micro": "Micro loans and rural", "cards": "Cards",
                       "personal": "Personal loans", "digital": "Digital", "home": "Home loans", "other": "Other"}
        region_labels = {r["id"]: r["label"] for r in CONFIG["regions"]}
        out["windows"][wd["id"]] = {
            "weekly": {"id": "L3:complaints_weekly:register_weekly:all", "layer": "L3", "rows": weekly},
            "pattern": {"product": split("product", prod_labels), "category": split("ground", grounds),
                        "group": split("customer_group", groups), "geography": split("region", region_labels)},
            "ombudsman": {k: v for k, v in ombudsman_block(set(SEED.PRODUCTS), "all", w).items() if not k.startswith("_")},
            "distribution": distribution_by_product(w),
        }
    out["card_d"] = card_payload(next(c for c in CONFIG["cards"] if c["id"] == "D"), D.window(CONFIG["default_window"]))
    return out


def cards_page() -> dict:
    out = {"money": l1("N18"), "voice": not_loaded("Cards voice, timelines heard in public, where customers praise us"),
           "outside": not_loaded("Public items about Cards, negative share, escalation language"), "windows": {}}
    cats = {c["id"]: c for c in CONFIG["cards_categories"]}
    for wd in CONFIG["windows"]:
        w = D.window(wd["id"])
        ws = {x.isoformat() for x in w["weeks"]}
        pws = {x.isoformat() for x in w["prev"]}
        rows = [r for r in D.cards if r["week_ending"] in ws]
        prev = [r for r in D.cards if r["week_ending"] in pws]
        tot = sum(r["contacts"] for r in rows)
        q1 = weekly_avg(D.cards, "contacts", D.q1)
        idx = round(100 * (tot / w["n"]) / q1)
        W = w["id"]
        S = lambda k: sum(r[k] for r in rows)  # noqa: E731
        issue = {
            "index": l3("cards_internal", "contacts_index", "cards", W, idx, show_index(idx), basis="Q1 weekly average = 100"),
            "resolved": l3("cards_internal", "resolved_share", "cards", W, pct(S("resolved"), tot), show_pct(pct(S("resolved"), tot))),
            "open": l3("cards_internal", "open_share", "cards", W, pct(S("open"), tot), show_pct(pct(S("open"), tot))),
            "waiting": l3("cards_internal", "waiting_share", "cards", W, pct(S("waiting_on_customer"), tot), show_pct(pct(S("waiting_on_customer"), tot))),
            "negative": l3("cards_internal", "negative_share", "cards", W, pct(S("negative"), tot), show_pct(pct(S("negative"), tot))),
        }
        assert S("resolved") + S("open") + S("waiting_on_customer") == tot
        risk_tot = S("closure_risk")
        categories, at_risk = [], []
        for cid, c in cats.items():
            xs = [r for r in rows if r["category"] == cid]
            ps = [r for r in prev if r["category"] == cid]
            n = sum(r["contacts"] for r in xs)
            pn = sum(r["contacts"] for r in ps)
            ch = round(100 * (n - pn) / pn) if pn else None
            categories.append({
                "id": cid, "label": c["label"], "owner": c["owner"],
                "share": l3("cards_internal", "category_share", cid, W, pct(n, tot), show_pct(pct(n, tot))),
                "open": l3("cards_internal", "open_share", cid, W, pct(sum(r["open"] for r in xs), n), show_pct(pct(sum(r["open"] for r in xs), n))),
                "waiting": l3("cards_internal", "waiting_share", cid, W, pct(sum(r["waiting_on_customer"] for r in xs), n), show_pct(pct(sum(r["waiting_on_customer"] for r in xs), n))),
                "negative": l3("cards_internal", "negative_share", cid, W, pct(sum(r["negative"] for r in xs), n), show_pct(pct(sum(r["negative"] for r in xs), n))),
                "change": l3("cards_internal", "contacts_change", cid, W, ch, show_change(ch)),
            })
            k = sum(r["closure_risk"] for r in xs)
            at_risk.append(l3("cards_internal", "closure_risk_share", cid, W, pct(k, risk_tot), show_pct(pct(k, risk_tot)), label=c["label"]))
        categories.sort(key=lambda r: -(r["share"]["value"] or 0))
        at_risk.sort(key=lambda r: -(r["value"] or 0))
        complaints = {k: v for k, v in complaint_block("cards", {"cards"}, w).items() if k in ("received_index", "open", "over_30", "change", "trend")}
        out["windows"][wd["id"]] = {
            "issue": issue, "complaints": complaints,
            "ombudsman": {k: v for k, v in ombudsman_block({"cards"}, "cards", w).items() if not k.startswith("_")},
            "categories": categories,
            "closure_risk": {"index": l3("cards_internal", "closure_risk_index", "cards", W,
                                         round(100 * (risk_tot / w["n"]) / weekly_avg(D.cards, "closure_risk", D.q1)),
                                         show_index(round(100 * (risk_tot / w["n"]) / weekly_avg(D.cards, "closure_risk", D.q1))), basis="Q1 weekly average = 100"),
                             "by_category": at_risk[:6]},
        }
    return out


def approvals_page() -> dict:
    cards = {c["id"]: c for c in CONFIG["cards"]}
    w4 = D.window("w4")
    # The card's title as parts, so a pending register value renders as a chip and no template reaches the page.
    return {"actions": [{**a, "card_title_parts": card_payload(cards[a["card_id"]], w4)["title_parts"],
                         "evidence": [l1(r) for r in cards[a["card_id"]]["figures"][:3]]} for a in D.actions],
            "banner": "LisN recommends; people approve. Nothing is sent or executed."}


def ask_bank(h: dict) -> dict:
    """Ask LisN, demo mode: answers only from this bank (IND-B4 §9.7). No model-generated numbers."""
    w4 = h["windows"]["w4"]
    qs = [
        {"id": "savings", "q": "Where did savings go this quarter?", "page": "deposits",
         "answer": "Savings balances at 30 Jun 2026 and the change on March and on a year ago are pending verification. Inside the bank (illustrative), the largest outflow clusters by slab, region and branch type over the last 4 weeks are below.",
         "figures": w4["cards"][0]["inside"]["figures"] + [w4["doing"]["outflow_index"] | {"label": "Savings outflow index, last 4 weeks (Q1 weekly average = 100)"}]},
        {"id": "conduct", "q": "Which products carry conduct-rule exposure?", "page": "risk",
         "answer": "The conduct rules' effective date is pending verification. Inside the bank (illustrative), the share of complaints in distribution-related grounds, by product, over the last 4 weeks:",
         "figures": w4["cards"][3]["inside"]["figures"]},
        {"id": "vehicle", "q": "Vehicle finance by region", "page": "home",
         "answer": "Disbursements and the book are pending verification. Inside the bank (illustrative), conduct complaints as a share of each region's vehicle-finance complaints, last 4 weeks:",
         "figures": w4["cards"][2]["inside"]["figures"]},
        {"id": "since_monday", "q": "What changed since Monday?", "page": "home",
         "answer": "Inside the bank (illustrative), this week against the previous one: complaints received and the open share. Public data is not yet loaded, so peer and voice changes are not shown.",
         "figures": [h["windows"]["week"]["pulse"]["all"]["inside"]["change"] | {"label": "Complaints received, this week"},
                     h["windows"]["week"]["pulse"]["all"]["inside"]["open"] | {"label": "Open, share of this week's complaints"}]},
    ]
    if CONFIG["flags"]["l2_loaded"]:
        qs.insert(1, {"id": "peer_rates", "q": "What changed in peer rate cards this week?", "page": "peers", "answer": "", "figures": []})
    return {"questions": qs, "fallback": "I'd need your data for that. Here is what I'd look at.",
            "fallback_look": ["Weekly deposit balances and flows by segment", "Complaint and case counts by product", "Your rate book against peer rate cards"]}


def main():
    global D
    D = Data()
    OUT.mkdir(parents=True, exist_ok=True)
    h = home()
    pages = {"common": common(), "home": h, "deposits": deposits_page(), "peers": peers_page(), "risk": risk_page(),
             "cards": cards_page(), "approvals": approvals_page(), "ask": ask_bank(h)}
    for name, obj in pages.items():
        (OUT / f"{name}.json").write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print("indusind payloads:", {k: (OUT / f"{k}.json").stat().st_size // 1024 for k in pages}, "KB")


if __name__ == "__main__":
    main()
