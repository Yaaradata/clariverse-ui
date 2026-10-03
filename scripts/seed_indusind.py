"""IndusInd · internal layer (L3, "Internal · illustrative until discovery"), IND-B3 §6. Deterministic: SEED below.

Writes data/seed/indusind_v1/:
  deposits_weekly.json   week x product (CA, SA, TD) x customer type x SA slab x region x branch type: indexed inflow,
                         outflow and premature-withdrawal flows (Q1 weekly average = 100), new accounts and closures.
                         balance_cr only to 30 Jun 2026, and only when the register holds the period-end balances
                         (N03-N06, D03-D04): IND-D1 is missing, so every balance is null today.
  deposits_period_end.json   CA, SA and TD at 31 Mar and 30 Jun 2026, from the register (null while pending).
  complaints.jsonl       one row per complaint, no customer identifier: product, RBI ground, channel, region, dates,
                         outcome, Internal Ombudsman review, came back unhappy. The register the weekly figures and the
                         Ombudsman watch are built from.
  complaints_weekly.json week x product x ground x channel x region: received, closed, pending, waiting_on_customer,
                         over_30_days, rejected, reopened, referred_to_io, escalated_grievance, escalation_language.
  contacts_weekly.json   week x product x channel: contacts, negative, complaints (a subset of negative contacts).
  cards_internal.json    week x category x channel: Cards contacts, open, waiting, resolved, at risk of closure.
  actions.json           one drafted action per home card (IND-B3 §6).

Rules (IND-B3 §6): totals reconcile; no round numbers everywhere (weekly rhythm, month-end effects); no causal story
(slab, region and branch-type flows from a neutral distribution); no personal data of any kind; no HDFC strings.
Rates are logged in MORNING_DECISIONS (IndusInd V1, IV-06 to IV-10).
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import math
import random
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
CONFIG = yaml.safe_load((ROOT / "config" / "indusind.yaml").read_text(encoding="utf-8"))
REGISTER = {e["id"]: e for e in json.loads((ROOT / "data" / "public" / "indusind_register.json").read_text(encoding="utf-8"))["entries"]}
OUT = ROOT / "data" / "seed" / "indusind_v1"
SEED = 20261002
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
FREEZE = dt.datetime.fromisoformat(CONFIG["data_freeze"])
Q1_START = dt.datetime(2026, 4, 1, tzinfo=IST)
Q1_END = dt.datetime(2026, 6, 30, 23, 59, tzinfo=IST)
BALANCE_CUTOFF = dt.date(2026, 6, 30)  # no balance, ratio or share after this date (IND-B3 §1)
N_WEEKS = 27  # weeks ending on the freeze, back to early April

# ---------------------------------------------------------------- working scale and rates (IV-06 to IV-10)
COMPLAINTS_PER_WEEK = 1180  # internal working scale only: counts never reach a screen until N31 sets the scale
CONTACTS_PER_COMPLAINT = 21  # 15-30x is the planning range used on the HDFC build; counts stay in the seed
NEGATIVE_SHARE = 0.12  # of contacts, overall
# By product, inside the 9-16% band a banker expects (HL-19); weighted by contact volume they come to about 12%.
NEGATIVE_BY_PRODUCT = {"deposits": 0.11, "vehicle": 0.14, "micro": 0.15, "cards": 0.13, "personal": 0.125, "digital": 0.105,
                       "home": 0.095, "other": 0.10}
REJECT_RATE = 0.08  # of replied complaints, partly or fully rejected (peer disclosures 6-10%)
UNHAPPY = {"resolved": 0.02, "rejected": 0.30}
GRIEVANCE = 0.085  # escalated to a grievance desk
ESCALATION_LANGUAGE = 0.06  # names the RBI, the Ombudsman or a court
REPLY_MEDIAN_DAYS = 8.5
REPLY_SIGMA = 0.95
WAITING_SHARE = 0.35  # of open complaints whose first reply is out: a resolution sent, waiting on the customer

PRODUCTS = {  # complaint mix by product (L3, illustrative): loans and cards lead, as at the Ombudsman industry-wide
    "deposits": 0.24, "vehicle": 0.17, "micro": 0.09, "cards": 0.19, "personal": 0.11, "digital": 0.12, "home": 0.03, "other": 0.05,
}
CONTACT_PRODUCTS = {"deposits": 0.36, "vehicle": 0.14, "micro": 0.07, "cards": 0.18, "personal": 0.07, "digital": 0.13, "home": 0.02, "other": 0.03}
GROUNDS = {
    "deposits": {"account_ops": 0.38, "levy_charges": 0.18, "internet_mobile": 0.12, "atm_debit": 0.16, "para_banking": 0.07, "pension": 0.05, "others": 0.04},
    "vehicle": {"loans": 0.58, "recovery_conduct": 0.22, "levy_charges": 0.08, "para_banking": 0.08, "others": 0.04},
    "micro": {"loans": 0.55, "recovery_conduct": 0.27, "para_banking": 0.12, "others": 0.06},
    "cards": {"credit_cards": 0.78, "levy_charges": 0.09, "para_banking": 0.06, "internet_mobile": 0.04, "others": 0.03},
    "personal": {"loans": 0.66, "recovery_conduct": 0.12, "para_banking": 0.12, "levy_charges": 0.06, "others": 0.04},
    "digital": {"internet_mobile": 0.74, "account_ops": 0.14, "others": 0.12},
    "home": {"loans": 0.74, "para_banking": 0.16, "others": 0.10},
    "other": {"others": 0.6, "pension": 0.2, "account_ops": 0.2},
}
CHANNELS = {"branch": 0.24, "contact_centre": 0.40, "email": 0.15, "web": 0.10, "app": 0.10, "social_inbox": 0.01}
# Social inbox about 1% of internal contacts (HL-19: on HDFC the inbox came out 26x the public posts collected).
CONTACT_CHANNELS = {"branch": 0.20, "contact_centre": 0.51, "email": 0.10, "web": 0.08, "app": 0.10, "social_inbox": 0.01}
REGIONS = {"N": 0.26, "S": 0.19, "E": 0.14, "W": 0.29, "C": 0.12}
CUSTOMER_GROUPS = {"retail": 0.71, "senior": 0.12, "nri": 0.07, "small_business": 0.10}  # for the IO pattern analysis
CARD_CATEGORIES = {
    "rewards": 0.16, "lounge": 0.06, "fees": 0.12, "limits": 0.08, "disputes": 0.09, "fraud": 0.07, "applications": 0.08,
    "activation": 0.05, "closure": 0.06, "servicing": 0.11, "emi": 0.08, "cobrand": 0.04,
}
CLOSURE_RISK = {"fees": 0.045, "rewards": 0.03, "lounge": 0.035, "closure": 0.30, "limits": 0.02, "disputes": 0.02,
                "cobrand": 0.025, "fraud": 0.012, "applications": 0.004, "activation": 0.006, "servicing": 0.008, "emi": 0.015}


def week_ends() -> list[dt.datetime]:
    return [FREEZE - dt.timedelta(days=7 * k) for k in range(N_WEEKS)][::-1]


def month_end_lift(end: dt.datetime) -> float:
    """Salary and month-end rhythm: the week holding the last days of a month runs a little higher."""
    start = end - dt.timedelta(days=7)
    last = (start.replace(day=28) + dt.timedelta(days=4)).replace(day=1) - dt.timedelta(days=1)
    return 1.11 if start <= last <= end else 1.0


def pick(rng: random.Random, weights: dict) -> str:
    keys = list(weights)
    return rng.choices(keys, weights=[weights[k] for k in keys])[0]


def iso(t: dt.datetime | None) -> str | None:
    return t.isoformat(timespec="minutes") if t else None


# ---------------------------------------------------------------- complaints (case level, no customer identifier)

def complaints(weeks) -> list[dict]:
    rng = random.Random(f"{SEED}:complaints")
    out, n = [], 0
    for end in weeks:
        start = end - dt.timedelta(days=7)
        base = COMPLAINTS_PER_WEEK * month_end_lift(end) * (1 + 0.06 * math.sin(n / 3.1)) * rng.uniform(0.93, 1.07)
        for _ in range(int(round(base))):
            n += 1
            product = pick(rng, PRODUCTS)
            received = start + dt.timedelta(seconds=rng.uniform(0, 7 * 86400))
            days = math.exp(math.log(REPLY_MEDIAN_DAYS) + REPLY_SIGMA * rng.gauss(0, 1))
            reply = received + dt.timedelta(days=days)
            replied = reply <= FREEZE
            rejected = replied and days >= 2 and rng.random() < REJECT_RATE / 0.93  # a rejection needs IO review first
            decision = io_done = None
            if rejected:
                decision = received + (reply - received) * rng.uniform(0.55, 0.8)
                io_done = decision + (reply - decision) * rng.uniform(0.5, 0.9)
            elif not replied and rng.random() < REJECT_RATE / 0.93:
                # IO review still pending: the decision falls where it would for a replied case (55-80% of the way to
                # the reply), so pending reviews do not bunch up in the week before the freeze.
                t = received + (reply - received) * rng.uniform(0.55, 0.8)
                decision = t if t <= FREEZE else None
            unhappy_at = None
            if replied and rng.random() < UNHAPPY["rejected" if rejected else "resolved"]:
                t = reply + dt.timedelta(days=rng.uniform(1, 15))
                unhappy_at = t if t <= FREEZE else None
            first_reply = received + dt.timedelta(days=days * rng.uniform(0.25, 0.7))
            waiting_from = first_reply if (rng.random() < WAITING_SHARE) else None
            out.append({
                "id": f"C{n:06d}",
                "product": product,
                "ground": pick(rng, GROUNDS[product]),
                "channel": pick(rng, CHANNELS),
                "region": pick(rng, REGIONS),
                "customer_group": pick(random.Random(f"{SEED}:group:{n}"), CUSTOMER_GROUPS),
                "received_at": iso(received),
                "final_reply_at": iso(reply) if replied else None,
                "resolution_sent_at": iso(waiting_from) if waiting_from and (not replied or waiting_from < reply) else None,
                "outcome": "rejected" if rejected else ("resolved" if replied else None),
                "decision_at": iso(decision),
                "io_reviewed_at": iso(io_done),
                "unhappy_at": iso(unhappy_at),
                "escalated_grievance": rng.random() < GRIEVANCE,
                "escalation_language": rng.random() < ESCALATION_LANGUAGE,
            })
    return out


def ts(s):
    return dt.datetime.fromisoformat(s) if s else None


def complaint_state(c: dict, T: dt.datetime) -> dict | None:
    """State of one complaint as of T. Pending: no final reply yet, or replied and the customer came back unhappy within
    90 days (contested, open again). Waiting on customer: pending, a resolution has been sent. Every at-risk state is a
    subset of pending."""
    rec = ts(c["received_at"])
    if rec > T:
        return None
    reply, back = ts(c["final_reply_at"]), ts(c["unhappy_at"])
    replied = reply is not None and reply <= T
    unhappy = replied and back is not None and reply < back <= T and T < reply + dt.timedelta(days=90)
    pending = (not replied) or unhappy
    sent = ts(c["resolution_sent_at"])
    waiting = (not replied) and sent is not None and sent <= T
    age = T - rec
    dec, io = ts(c["decision_at"]), ts(c["io_reviewed_at"])
    return {
        "pending": pending,
        "waiting": waiting,
        "open": pending and not waiting,
        "resolved": replied and not unhappy,
        "over_30": (not replied) and age > dt.timedelta(days=30),
        "brink": (not replied) and dt.timedelta(days=20) <= age <= dt.timedelta(days=30),
        "eligible": (not replied) and dt.timedelta(days=30) < age < dt.timedelta(days=120),
        "unhappy": unhappy,
        "awaiting_io": bool(dec and dec <= T and (io is None or io > T)),
        "rejected": replied and c["outcome"] == "rejected",
    }


def complaints_weekly(cs, weeks) -> list[dict]:
    rows = collections.defaultdict(lambda: collections.Counter())
    for end in weeks:
        start = end - dt.timedelta(days=7)
        for c in cs:
            rec = ts(c["received_at"])
            if rec > end:
                continue
            key = (end.date().isoformat(), c["product"], c["ground"], c["channel"], c["region"])
            st = complaint_state(c, end)
            r = rows[key]
            if start < rec <= end:
                r["received"] += 1
                r["escalated_grievance"] += c["escalated_grievance"]
                r["escalation_language"] += c["escalation_language"]
            reply, back, dec = ts(c["final_reply_at"]), ts(c["unhappy_at"]), ts(c["decision_at"])
            if reply and start < reply <= end:
                r["closed"] += 1
                r["rejected"] += c["outcome"] == "rejected"
            if back and start < back <= end:
                r["reopened"] += 1
            if dec and start < dec <= end:
                r["referred_to_io"] += 1
            r["pending"] += st["pending"]
            r["waiting_on_customer"] += st["waiting"]
            r["over_30_days"] += st["over_30"]
    out = []
    for (week, product, ground, channel, region), r in sorted(rows.items()):
        if any(r.values()):
            out.append({"week_ending": week, "product": product, "category": ground, "channel": channel, "region": region,
                        **{k: r[k] for k in ("received", "closed", "pending", "waiting_on_customer", "over_30_days", "rejected",
                                             "reopened", "referred_to_io", "escalated_grievance", "escalation_language")}})
    return out


# ---------------------------------------------------------------- contacts and Cards (aggregate only)

def contacts_weekly(cs, weeks) -> list[dict]:
    rng = random.Random(f"{SEED}:contacts")
    by = collections.Counter((c["received_at"][:10], c["product"], c["channel"]) for c in cs)
    cmp = collections.Counter()
    for c in cs:
        rec = ts(c["received_at"])
        end = next(e for e in weeks if rec <= e)
        cmp[(end.date().isoformat(), c["product"], c["channel"])] += 1
    out = []
    for i, end in enumerate(weeks):
        total = COMPLAINTS_PER_WEEK * CONTACTS_PER_COMPLAINT * month_end_lift(end) * (1 + 0.05 * math.sin(i / 2.7))
        for p, ps in CONTACT_PRODUCTS.items():
            for ch, chs in CONTACT_CHANNELS.items():
                k = (end.date().isoformat(), p, ch)
                n = max(int(round(total * ps * chs * rng.uniform(0.9, 1.1))), cmp[k])
                neg = max(cmp[k], int(round(n * NEGATIVE_BY_PRODUCT.get(p, NEGATIVE_SHARE) * rng.uniform(0.85, 1.15))))
                out.append({"week_ending": end.date().isoformat(), "product": p, "channel": ch, "contacts": n,
                            "negative": neg, "complaints": cmp[k]})
    del by
    return out


def card_category_trend(cat: str, i: int, n_weeks: int) -> float:
    """Each category's own deterministic course: a seeded slope (-25% to +25% across the period) and a seeded wave,
    so categories do not all rise or fall together. Neutral: no category is made to lead."""
    r = random.Random(f"{SEED}:card-trend:{cat}")
    # Slope sizes are seeded; signs alternate over the sorted categories, so half rise and half fall over the period.
    sign = 1 if sorted(CARD_CATEGORIES).index(cat) % 2 == 0 else -1
    slope, amp, phase, period = sign * r.uniform(0.10, 0.30), r.uniform(0.04, 0.12), r.uniform(0, 6.3), r.uniform(3.0, 7.0)
    x = i / max(n_weeks - 1, 1) - 0.5
    return max(0.3, 1 + slope * x + amp * math.sin(i / period + phase))


def cards_internal(weeks) -> list[dict]:
    rng = random.Random(f"{SEED}:cards")
    out = []
    for i, end in enumerate(weeks):
        total = COMPLAINTS_PER_WEEK * CONTACTS_PER_COMPLAINT * CONTACT_PRODUCTS["cards"] * month_end_lift(end) * (1 + 0.05 * math.cos(i / 3.3))
        for cat, cs in CARD_CATEGORIES.items():
            for ch, chs in CONTACT_CHANNELS.items():
                n = int(round(total * cs * card_category_trend(cat, i, len(weeks)) * chs * rng.uniform(0.88, 1.12)))
                opn = int(round(n * rng.uniform(0.05, 0.11)))
                wait = int(round(n * rng.uniform(0.03, 0.07)))
                out.append({"week_ending": end.date().isoformat(), "category": cat, "channel": ch, "contacts": n,
                            "resolved": n - opn - wait, "open": opn, "waiting_on_customer": wait,
                            "negative": int(round(n * NEGATIVE_SHARE * rng.uniform(0.8, 1.3))),
                            "closure_risk": int(round(n * CLOSURE_RISK[cat] * rng.uniform(0.85, 1.15)))})
    return out


# ---------------------------------------------------------------- deposits (flows indexed; balances from the register)

def reg_value(rid: str):
    return REGISTER[rid]["value"]


def deposits(weeks) -> tuple[list[dict], dict]:
    rng = random.Random(f"{SEED}:deposits")
    q1 = [w for w in weeks if Q1_START <= w <= Q1_END]
    cells = []
    for prod in ("CA", "SA", "TD"):
        for ct, ctw in (("resident_retail", 0.72), ("nri", 0.12), ("bulk", 0.16)):
            slabs = [(s, w) for s, w in (("lt1l", 0.20), ("1to25l", 0.42), ("25lto5cr", 0.28), ("gt5cr", 0.10))] if prod == "SA" else [(None, 1.0)]
            for slab, sw in slabs:
                for rg, rw in REGIONS.items():
                    for bt, bw in (("metro", 0.38), ("urban", 0.30), ("semi_urban", 0.20), ("rural", 0.12)):
                        cells.append((prod, ct, slab, rg, bt, ctw * sw * rw * bw))
    raw = []
    for prod, ct, slab, rg, bt, w in cells:
        # Neutral: every cell follows the same rhythm and its own noise. No slab, region or branch type is made to lead.
        noise = random.Random(f"{SEED}:{prod}:{ct}:{slab}:{rg}:{bt}")
        level = 1000 * w
        accounts = 100_000 * w  # an account base per cell, so weekly opens and closures stay whole numbers above zero
        series = []
        for i, end in enumerate(weeks):
            lift = month_end_lift(end)
            series.append({
                "inflow": level * lift * (1 + 0.04 * math.sin(i / 2.2)) * noise.uniform(0.9, 1.1),
                "outflow": level * (1 + 0.03 * math.cos(i / 2.6)) * noise.uniform(0.9, 1.1) * (1.04 if lift > 1 else 1.0),
                "premature": level * 0.08 * noise.uniform(0.7, 1.3) if prod == "TD" else 0.0,
                "new": max(0, int(round(accounts * 0.012 * lift * noise.uniform(0.8, 1.2)))),
                "closed": max(0, int(round(accounts * 0.010 * noise.uniform(0.8, 1.2)))),
            })
        raw.append(((prod, ct, slab, rg, bt), series))
    rows = []
    q1_idx = [i for i, w in enumerate(weeks) if w in q1]
    for (prod, ct, slab, rg, bt), series in raw:
        avg = {k: sum(series[i][k] for i in q1_idx) / len(q1_idx) for k in ("inflow", "outflow", "premature")}
        for end, s in zip(weeks, series):
            rows.append({
                "week_ending": end.date().isoformat(), "product": prod, "customer_type": ct, "sa_slab": slab,
                "region": rg, "branch_type": bt,
                # A balance only to 30 Jun 2026, and only once the register carries the period-end figures (IND-D1).
                "balance_cr": None,
                "inflow_raw": round(s["inflow"], 3), "outflow_raw": round(s["outflow"], 3),
                "inflow_index": round(100 * s["inflow"] / avg["inflow"], 1),
                "outflow_index": round(100 * s["outflow"] / avg["outflow"], 1),
                "premature_td_withdrawals_index": round(100 * s["premature"] / avg["premature"], 1) if avg["premature"] else None,
                "new_accounts": s["new"], "closures": s["closed"],
            })
    period_end = {}
    for date, ids in (("2026-03-31", {"CA": "N05", "SA": "N06", "TD": "D04"}), ("2026-06-30", {"CA": "N03", "SA": "N04", "TD": "D03"})):
        period_end[date] = {p: {"register": rid, "balance_cr": reg_value(rid)} for p, rid in ids.items()}
    return rows, period_end


def actions() -> list[dict]:
    out = []
    for i, card in enumerate(CONFIG["cards"]):
        a = card["action"]
        out.append({
            "action_id": f"A-{card['id']}",
            "card_id": card["id"],
            "owner_role": card["owner"],
            "scope": a["scope"],
            "ask": a["ask"],
            "cost_cap_cr": None,
            "cost_cap_note": a.get("cost_cap"),
            "success_measure": a["success"],
            "review_date": (FREEZE + dt.timedelta(days=(14, 21, 14, 60)[i])).date().isoformat(),
            "status": "awaiting approval",
            "approver_role": card["approver"],
            "approved_at": None,
            "evidence_version": FREEZE.strftime("%Y-%m-%d %H:%M"),
        })
    return out


def main():
    weeks = week_ends()
    OUT.mkdir(parents=True, exist_ok=True)
    cs = complaints(weeks)
    with open(OUT / "complaints.jsonl", "w", encoding="utf-8", newline="\n") as f:
        for c in cs:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    dump = lambda name, obj: (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=None, separators=(",", ":")) + "\n", encoding="utf-8", newline="\n")  # noqa: E731
    dump("complaints_weekly.json", complaints_weekly(cs, weeks))
    dump("contacts_weekly.json", contacts_weekly(cs, weeks))
    dump("cards_internal.json", cards_internal(weeks))
    dep, pe = deposits(weeks)
    dump("deposits_weekly.json", dep)
    dump("deposits_period_end.json", pe)
    dump("actions.json", actions())
    meta = {"seed": SEED, "freeze": CONFIG["data_freeze"], "weeks": [w.date().isoformat() for w in weeks],
            "q1_weeks": [w.date().isoformat() for w in weeks if Q1_START <= w <= Q1_END], "complaints": len(cs),
            "working_scale_note": "Counts here are at an internal working scale. Screens show shares and indices until N31 sets the scale."}
    (OUT / "meta.json").write_text(json.dumps(meta, indent=1) + "\n", encoding="utf-8", newline="\n")
    print("indusind seed:", len(cs), "complaints;", len(dep), "deposit rows;", len(weeks), "weeks")


if __name__ == "__main__":
    main()
