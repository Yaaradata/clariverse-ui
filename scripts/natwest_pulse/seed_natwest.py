"""NatWest Group · illustrative internal layer (L3) and screen payloads (docs/natwest/brief.md Steps 3.6 and 3.8–3.10).

Deterministic (fixed seed). Every figure written here is "Internal · illustrative until discovery". Nothing is read from
the public pull: public and internal are never added together.

Sizing (docs/natwest/public_anchors.md): a 20-million-customer group; complaints scaled to the H1 2026 complaints
return quoted in the brief (86,498 in the half-year, 2.74 per 1,000 accounts, about 55% upheld, 48% closed within
3 days). Contact volumes, brand, segment and product splits are assumptions until discovery.

Writes:
  data/seed/natwest_pulse/natwest_scale.json   the sizing inputs actually used (anchors, derived, assumptions)
  data/out/natwest_pulse/natwest.json          every screen block, for every window × brand (server-sliced per page)

Model:
  contacts  calls · Cora · branch, daily, per brand × segment × theme; numerators (negative, repeat within 7 days,
            resolved first time, Cora resolved and back within 7 days) are drawn per cell-day, so every rate
            reconciles from its parts.
  complaints one record per complaint from 1 Mar 2026 (so the Financial Ombudsman Service clocks are real at the
            freeze): received, brand, segment, product, theme, closed within 3 days, upheld, final response, referral.
  APP claims and the two AI agents (Fraud Triage Agent, AI complaint letters), weekly, per brand and product.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import math
import random
from pathlib import Path

from taxonomy import CORA_JOURNEYS, OUTCOMES, PRODUCTS, THEME, THEMES

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "out" / "natwest_pulse"
SEED_DIR = ROOT / "data" / "seed" / "natwest_pulse"
SEED = 20261112

FREEZE = dt.date(2026, 11, 12)  # data frozen 12 Nov 2026 23:59 GMT (NW-D05)
FREEZE_ISO = "2026-11-12T23:59:00+00:00"
FREEZE_LABEL = "12 Nov 2026, 23:59 GMT"
WINDOW_START = dt.date(2026, 8, 1)
HISTORY_START = dt.date(2026, 3, 1)  # complaints only: the Ombudsman clocks need six months behind the window
WINDOWS = [
    {"id": "week", "label": "This week", "days": 7},
    {"id": "w4", "label": "Last 4 weeks", "days": 28},
    {"id": "w13", "label": "Last 13 weeks", "days": 91},
]
BRANDS = [
    {"id": "natwest", "label": "NatWest"},
    {"id": "rbs", "label": "Royal Bank of Scotland"},
    {"id": "ulster", "label": "Ulster Bank"},
]
BRAND_FILTER = [{"id": "all", "label": "All brands"}, *BRANDS]
SEGMENTS = [
    {"id": "everyday", "label": "Everyday"},
    {"id": "mortgage", "label": "Mortgage holders"},
    {"id": "multi", "label": "Multi-product"},
    {"id": "vulnerable", "label": "Financially vulnerable"},
]
CHANNELS = [
    {"id": "calls", "label": "Calls"},
    {"id": "cora", "label": "Cora"},
    {"id": "complaints", "label": "Complaints"},
    {"id": "branch", "label": "Branch"},
]
CONTACT_CHANNELS = ["calls", "cora", "branch"]

# ---------------------------------------------------------------- sizing (ANCHOR / DERIVED / ASSUMPTION)
CUSTOMERS = 20_000_000  # brief Step 3.8
H1_COMPLAINTS = 86_498  # ANCHOR, quoted in the brief (H1 2026 complaints return)
PER_1000_ACCOUNTS = 2.74  # ANCHOR, quoted in the brief
UPHELD = 0.55  # ANCHOR, "about 55%"
CLOSED_3D = 0.48  # ANCHOR
H1_WEEKS = 181 / 7  # 1 Jan – 30 Jun 2026
WEEKLY_COMPLAINTS = H1_COMPLAINTS / H1_WEEKS  # DERIVED
ACCOUNTS = round(H1_COMPLAINTS / PER_1000_ACCOUNTS * 1000)  # DERIVED
# ASSUMPTIONS (until discovery): contacts per customer per year, and the splits.
CONTACTS_PER_CUSTOMER_YEAR = {"calls": 1.4, "cora": 1.2, "branch": 0.4}
BRAND_SHARE = {"natwest": 0.775, "rbs": 0.17, "ulster": 0.055}
BRAND_COMPLAINT_FACTOR = {"natwest": 1.0, "rbs": 1.06, "ulster": 0.95}
SEGMENT_SHARE = {"everyday": 0.50, "mortgage": 0.16, "multi": 0.24, "vulnerable": 0.10}  # of customers
SEGMENT_CONTACT = {"everyday": 0.46, "mortgage": 0.17, "multi": 0.27, "vulnerable": 0.10}
SEGMENT_COMPLAINT = {"everyday": 0.40, "mortgage": 0.18, "multi": 0.27, "vulnerable": 0.15}
PRODUCT_COMPLAINT_SHAPE = {
    "current_accounts": 0.34, "payments_fraud": 0.22, "cards": 0.17, "mortgages": 0.10, "loans": 0.08,
    "savings": 0.07, "cora_digital": 0.02,
}
# Contact share of each theme (sums to 1 across themes, before the channel mix).
THEME_CONTACT_W = {
    "app_login_biometrics": 0.085, "app_outage_errors": 0.045, "overdraft_fees": 0.06, "account_opening_identity": 0.045,
    "branch_closure": 0.02, "savings_rates": 0.05, "savings_access": 0.045, "mortgage_rate_switch": 0.06,
    "mortgage_payment_difficulty": 0.025, "card_freeze_replace": 0.075, "card_disputes": 0.055,
    "card_interest_charges": 0.04, "loan_decisions": 0.03, "loan_repayments": 0.03, "faster_payments_failure": 0.06,
    "fraud_block_freeze": 0.06, "app_reimbursement": 0.025, "scam_reports": 0.05, "cora_unresolved": 0.04,
    "consumer_duty_value": 0.02, "care_unreachable": 0.035, "complaint_handling": 0.04,
}
# Negative share of a theme's contacts: about 12% overall, 9-16% by product (HL-19).
THEME_NEG = {
    "app_login_biometrics": 0.13, "app_outage_errors": 0.20, "overdraft_fees": 0.15, "account_opening_identity": 0.11,
    "branch_closure": 0.21, "savings_rates": 0.06, "savings_access": 0.07, "mortgage_rate_switch": 0.10,
    "mortgage_payment_difficulty": 0.14, "card_freeze_replace": 0.06, "card_disputes": 0.15, "card_interest_charges": 0.11,
    "loan_decisions": 0.10, "loan_repayments": 0.08, "faster_payments_failure": 0.17, "fraud_block_freeze": 0.19,
    "app_reimbursement": 0.22, "scam_reports": 0.09, "cora_unresolved": 0.18, "consumer_duty_value": 0.24,
    "care_unreachable": 0.26, "complaint_handling": 0.22,
}
COMPLAINT_PROPENSITY = {"app_reimbursement": 2.2, "fraud_block_freeze": 1.8, "complaint_handling": 1.6, "consumer_duty_value": 1.5,
                        "care_unreachable": 1.4, "overdraft_fees": 1.3, "card_disputes": 1.3, "mortgage_payment_difficulty": 1.2}
APP_CLAIMS_WEEK = 700  # ASSUMPTION
FRAUD_ALERTS_WEEK = 41_000  # ASSUMPTION
AI_LETTER_SHARE = 0.38  # ASSUMPTION
AI_LETTERS_FROM = dt.date(2026, 9, 1)

rng = random.Random(SEED)


def poisson(lam: float) -> int:
    if lam <= 0:
        return 0
    if lam < 30:
        l, k, p = math.exp(-lam), 0, 1.0
        while True:
            p *= rng.random()
            if p <= l:
                return k
            k += 1
    return max(0, round(rng.gauss(lam, math.sqrt(lam))))


def binom(n: int, p: float) -> int:
    p = min(max(p, 0.0), 1.0)
    if n <= 0 or p == 0:
        return 0
    if n < 40:
        return sum(1 for _ in range(n) if rng.random() < p)
    x = round(rng.gauss(n * p, math.sqrt(n * p * (1 - p))))
    return min(max(x, 0), n)


def days(a: dt.date, b: dt.date):
    d = a
    while d <= b:
        yield d
        d += dt.timedelta(days=1)


WEEKDAY = [1.22, 1.10, 1.04, 1.0, 1.0, 0.62, 0.40]  # Mon..Sun, contact channels
WEEKDAY_BRANCH = [1.25, 1.12, 1.08, 1.05, 1.15, 0.55, 0.0]
_wsum, _bsum = sum(WEEKDAY) / 7, sum(WEEKDAY_BRANCH) / 7


def event(theme: str, brand: str, d: dt.date) -> float:
    """Illustrative movements, so the screens have something to find. Logged in natwest_scale.json."""
    f = 1.0
    if theme == "faster_payments_failure" and dt.date(2026, 10, 23) <= d <= dt.date(2026, 10, 25):
        f *= 3.2  # a payments incident
    if theme == "mortgage_rate_switch":
        f *= 1.0 + 0.45 * max(0, (d - dt.date(2026, 9, 28)).days) / 45  # fixed rates ending
    if theme == "app_login_biometrics" and d >= dt.date(2026, 10, 30):
        f *= 1.55 if brand == "rbs" else 1.18  # an app update, felt most in the Royal Bank of Scotland app
    if theme == "cora_unresolved":
        f *= 1.0 + 0.32 * max(0, (d - dt.date(2026, 10, 12)).days) / 31
    if theme == "branch_closure" and d >= dt.date(2026, 10, 1):
        f *= 1.6
    if theme == "fraud_block_freeze":
        f *= 1.0 + 0.15 * max(0, (d - dt.date(2026, 9, 1)).days) / 72
    return f


def cora_leak_factor(theme: str, d: dt.date) -> float:
    f = 1.0
    if theme == "faster_payments_failure" and d >= dt.date(2026, 10, 23):
        f *= 1.35  # Cora marks the incident journeys resolved; customers call anyway
    if theme == "mortgage_rate_switch" and d >= dt.date(2026, 10, 15):
        f *= 1.25
    if theme == "app_login_biometrics" and d >= dt.date(2026, 10, 30):
        f *= 1.3
    return f


# ---------------------------------------------------------------- contacts
def build_contacts():
    """{(brand, segment, theme, channel): {date: [vol, neg, rep7, resolved, cora_resolved, back_call, back_complaint]}}"""
    cells = {}
    for ch in CONTACT_CHANNELS:
        weekly_total = CUSTOMERS * CONTACTS_PER_CUSTOMER_YEAR[ch] / 52
        mix = {t["id"]: THEME_CONTACT_W[t["id"]] * t["mix"][ch] for t in THEMES}
        msum = sum(mix.values())
        for b, bs in BRAND_SHARE.items():
            for s, ss in SEGMENT_CONTACT.items():
                for t in THEMES:
                    tid = t["id"]
                    base_daily = weekly_total / 7 * bs * ss * mix[tid] / msum
                    neg_p = THEME_NEG[tid] * (1.18 if s == "vulnerable" else 1.0) * (0.85 if ch == "cora" else 1.0)
                    series = {}
                    for d in days(WINDOW_START - dt.timedelta(days=28), FREEZE):
                        wd = (WEEKDAY_BRANCH[d.weekday()] / _bsum) if ch == "branch" else (WEEKDAY[d.weekday()] / _wsum)
                        lam = base_daily * wd * event(tid, b, d) * math.exp(rng.gauss(0, 0.05))
                        vol = poisson(lam)
                        neg = binom(vol, neg_p * (1.0 + 0.4 * (event(tid, b, d) - 1)))
                        rep = binom(vol, 0.11 + 0.5 * THEME_NEG[tid])
                        if ch == "cora":
                            j = CORA_JOURNEYS.get(tid, {"resolved": 0.30, "call_7d": 0.30, "complaint_7d": 0.01})
                            cres = binom(vol, j["resolved"])
                            back_c = binom(cres, j["call_7d"] * cora_leak_factor(tid, d) * (1.12 if s == "vulnerable" else 1.0))
                            back_k = binom(cres - back_c, j["complaint_7d"] * cora_leak_factor(tid, d))
                            res = cres - back_c - back_k  # resolved first time = marked resolved and did not come back
                        else:
                            cres = back_c = back_k = 0
                            res = binom(vol, (0.74 if ch == "calls" else 0.81) - 0.6 * THEME_NEG[tid])
                        series[d] = [vol, neg, rep, res, cres, back_c, back_k]
                    cells[(b, s, tid, ch)] = series
    return cells


# ---------------------------------------------------------------- complaints (record level, in memory)
def add_business_days(d: dt.date, n: int) -> dt.date:
    while n > 0:
        d += dt.timedelta(days=1)
        if d.weekday() < 5:
            n -= 1
    return d


def business_days_between(a: dt.date, b: dt.date) -> int:
    n, d = 0, a
    while d < b:
        d += dt.timedelta(days=1)
        if d.weekday() < 5:
            n += 1
    return n


def build_complaints():
    themes_by_product = collections.defaultdict(list)
    for t in THEMES:
        themes_by_product[t["product"]].append(t["id"])
    t_w = {p: {tid: THEME_CONTACT_W[tid] * COMPLAINT_PROPENSITY.get(tid, 1.0) for tid in ids} for p, ids in themes_by_product.items()}
    bw = {b: BRAND_SHARE[b] * BRAND_COMPLAINT_FACTOR[b] for b in BRAND_SHARE}
    bsum = sum(bw.values())
    rows = []
    for d in days(HISTORY_START, FREEZE):
        wd = WEEKDAY[d.weekday()] / _wsum
        for b in BRAND_SHARE:
            for s, ss in SEGMENT_COMPLAINT.items():
                for p, ps in PRODUCT_COMPLAINT_SHAPE.items():
                    tw = t_w[p]
                    tsum = sum(tw.values())
                    for tid, w in tw.items():
                        lam = WEEKLY_COMPLAINTS / 7 * wd * bw[b] / bsum * ss * ps * w / tsum * event(tid, b, d) ** 0.6
                        for _ in range(poisson(lam)):
                            rows.append(complaint(d, b, s, p, tid))
    return rows


def complaint(d: dt.date, b: str, s: str, p: str, tid: str) -> dict:
    psd = p == "payments_fraud"  # payment-services complaints: 15 business days (35 in exceptional cases)
    closed_3d = rng.random() < CLOSED_3D * (0.85 if p == "mortgages" else 1.05 if p == "cards" else 1.0)
    upheld = rng.random() < UPHELD * (1.08 if closed_3d else 0.93)
    if closed_3d:
        fr = add_business_days(d, rng.randint(0, 3))
    elif psd:
        n = rng.randint(4, 15) if rng.random() < 0.965 else rng.randint(16, 35)
        fr = add_business_days(d, n)
    else:
        n = int(min(90, max(4, rng.lognormvariate(math.log(19), 0.55))))
        if rng.random() < 0.035:
            n = rng.randint(57, 95)
        fr = d + dt.timedelta(days=n)
    deadline = add_business_days(d, 15) if psd else d + dt.timedelta(days=56)
    ai = fr >= AI_LETTERS_FROM and not closed_3d and rng.random() < AI_LETTER_SHARE
    refer_p = (0.020 if upheld else 0.092) * (0.88 if ai else 1.0) * (1.25 if s == "vulnerable" else 1.0)
    referred = None
    if rng.random() < refer_p:
        referred = fr + dt.timedelta(days=int(min(180, rng.expovariate(1 / 32)) + 3))
    if fr > deadline and rng.random() < 0.22:
        referred = deadline + dt.timedelta(days=rng.randint(3, 40))  # referred before a late final response
    return {"d": d, "b": b, "s": s, "p": p, "t": tid, "psd": psd, "c3": closed_3d, "up": upheld, "fr": fr,
            "dl": deadline, "ref": referred, "ai": ai, "rep14": rng.random() < (0.11 if ai else 0.13)}


def fos_state(c: dict, at: dt.date) -> str | None:
    """Financial Ombudsman Service state at a date (Step 3.9). None = not yet received, or the 6-month clock has run."""
    if c["d"] > at:
        return None
    if c["ref"] and c["ref"] <= at:
        return "referred"
    if c["fr"] <= at:
        return "clock_running" if (at - c["fr"]).days <= 183 else None
    return "eligible" if at > c["dl"] else "within"


def at_risk(c: dict, at: dt.date) -> bool:
    """Pending, and close to its deadline: 7 days or fewer (3 business days or fewer for payment services)."""
    if fos_state(c, at) != "within":
        return False
    return business_days_between(at, c["dl"]) <= 3 if c["psd"] else (c["dl"] - at).days <= 7


# ---------------------------------------------------------------- APP claims and agents
def build_weekly_other():
    app, triage = {}, {}
    for d in days(WINDOW_START - dt.timedelta(days=28), FREEZE):
        wd = WEEKDAY[d.weekday()] / _wsum
        for b, bs in BRAND_SHARE.items():
            n = poisson(APP_CLAIMS_WEEK / 7 * wd * bs)
            met = binom(n, 0.915)
            full = binom(n, 0.66)
            app[(b, d)] = [n, met, full]
            for lane, share in (("agent", 0.64), ("analyst", 0.36)):
                for p, ps in (("payments_fraud", 0.78), ("cards", 0.22)):
                    k = poisson(FRAUD_ALERTS_WEEK / 7 * wd * bs * share * ps)
                    released = binom(k, 0.71)
                    blocked = binom(k - released, 0.24)
                    held = k - released - blocked
                    rep = binom(released + held, 0.088 if lane == "agent" else 0.121)
                    comp = binom(k, 0.0058 if lane == "agent" else 0.0066)
                    fos = binom(comp, 0.07)
                    triage[(b, p, lane, d)] = [k, released, held, blocked, rep, comp, fos]
    return app, triage


# ---------------------------------------------------------------- helpers
def pct(n, d, nd=1):
    return round(100 * n / d, nd) if d else None


def window_range(w: dict, shift: int = 0):
    end = FREEZE - dt.timedelta(days=w["days"] * shift)
    start = end - dt.timedelta(days=w["days"] - 1)
    return start, end


def in_range(d, r):
    return r[0] <= d <= r[1]


def brands_of(bf: str):
    return list(BRAND_SHARE) if bf == "all" else [bf]


def sumcells(cells, r, pred):
    tot = [0] * 7
    for k, ser in cells.items():
        if not pred(k):
            continue
        for d, v in ser.items():
            if r[0] <= d <= r[1]:
                for i in range(7):
                    tot[i] += v[i]
    return tot


def delta(cur, prev):
    if cur is None or prev is None:
        return None
    return round(cur - prev, 1)


def vol_delta_pct(cur, prev):
    return round(100 * (cur - prev) / prev, 1) if prev else None


def buckets(w: dict):
    """Trend points: daily for This week and Last 4 weeks, weekly for Last 13 weeks (weeks ending on the freeze)."""
    s, e = window_range(w)
    if w["id"] == "w13":
        out = []
        for k in range(12, -1, -1):
            end = e - dt.timedelta(days=7 * k)
            out.append((end - dt.timedelta(days=6), end, f"w/e {end.day} {end.strftime('%b')}"))
        return out
    return [(d, d, f"{d.day} {d.strftime('%b')}") for d in days(s, e)]


# ---------------------------------------------------------------- blocks
class Ctx:
    def __init__(self, cells, comps, app, triage):
        self.cells, self.comps, self.app, self.triage = cells, comps, app, triage
        # Index the complaints once by received date for the flow figures.
        self.by_day = collections.defaultdict(list)
        for c in comps:
            self.by_day[c["d"]].append(c)

    def comps_in(self, r, bset, pred=lambda c: True):
        out = []
        for d in days(*r):
            out += [c for c in self.by_day.get(d, []) if c["b"] in bset and pred(c)]
        return out


def complaint_metrics(cs, customers):
    n = len(cs)
    return {
        "volume": n,
        "upheld": sum(c["up"] for c in cs),
        "closed_3d": sum(c["c3"] for c in cs),
        "upheld_pct": pct(sum(c["up"] for c in cs), n),
        "closed_3d_pct": pct(sum(c["c3"] for c in cs), n),
        "per_100k": round(n / customers * 100_000, 1) if customers else None,
    }


def contact_metrics(t):
    vol, neg, rep, res, cres, bc, bk = t
    return {"volume": vol, "negative": neg, "repeat": rep, "resolved": res,
            "negative_pct": pct(neg, vol), "repeat_pct": pct(rep, vol), "resolved_pct": pct(res, vol)}


def customers_of(bset, seg=None):
    return CUSTOMERS * sum(BRAND_SHARE[b] for b in bset) * (SEGMENT_SHARE[seg] if seg else 1.0)


def channel_block(ctx, w, bset):
    r, rp = window_range(w), window_range(w, 1)
    rows = []
    for ch in CHANNELS:
        if ch["id"] == "complaints":
            cur, prev = ctx.comps_in(r, bset), ctx.comps_in(rp, bset)
            # Complaints are negative by definition; "resolved first time" = closed within 3 days; repeat = came back
            # within 14 days of the final response.
            m = {"volume": len(cur), "negative": len(cur), "repeat": sum(c["rep14"] for c in cur),
                 "resolved": sum(c["c3"] for c in cur)}
            m.update(negative_pct=pct(m["negative"], m["volume"]), repeat_pct=pct(m["repeat"], m["volume"]),
                     resolved_pct=pct(m["resolved"], m["volume"]))
            pm = {"volume": len(prev), "repeat_pct": pct(sum(c["rep14"] for c in prev), len(prev)),
                  "resolved_pct": pct(sum(c["c3"] for c in prev), len(prev)), "negative_pct": 100.0 if prev else None}
            trend = [{"x": lab, "v": sum(1 for c in ctx.comps_in((a, b), bset))} for a, b, lab in buckets(w)]
        else:
            pred = lambda k, ch=ch["id"]: k[3] == ch and k[0] in bset  # noqa: E731
            m = contact_metrics(sumcells(ctx.cells, r, pred))
            pm = contact_metrics(sumcells(ctx.cells, rp, pred))
            trend = [{"x": lab, "v": sumcells(ctx.cells, (a, b), pred)[0]} for a, b, lab in buckets(w)]
        rows.append({
            "id": ch["id"], "label": ch["label"], **m,
            "volume_change_pct": vol_delta_pct(m["volume"], pm["volume"]) if w["id"] != "w13" else None,
            "negative_delta": delta(m["negative_pct"], pm["negative_pct"]) if w["id"] != "w13" else None,
            "repeat_delta": delta(m["repeat_pct"], pm["repeat_pct"]) if w["id"] != "w13" else None,
            "resolved_delta": delta(m["resolved_pct"], pm["resolved_pct"]) if w["id"] != "w13" else None,
            "trend": trend,
        })
    # Overall dial: contacts only (complaints are counted in their own row, never added to contacts).
    pred_all = lambda k: k[0] in bset  # noqa: E731
    overall = contact_metrics(sumcells(ctx.cells, r, pred_all))
    # Top themes per contact channel by negative contacts.
    themes = {}
    for ch in CONTACT_CHANNELS:
        tl = []
        for t in THEMES:
            v = sumcells(ctx.cells, r, lambda k, ch=ch, tid=t["id"]: k[3] == ch and k[2] == tid and k[0] in bset)
            tl.append({"id": t["id"], "label": t["label"], "negative": v[1], "volume": v[0]})
        themes[ch] = sorted(tl, key=lambda x: -x["negative"])[:5]
    cs = ctx.comps_in(r, bset)
    tc = collections.Counter(c["t"] for c in cs)
    themes["complaints"] = [{"id": k, "label": THEME[k]["label"], "negative": v, "volume": v} for k, v in tc.most_common(5)]
    return {"rows": rows, "overall_contacts": overall, "top_themes": themes}


def cora_block(ctx, w, bset):
    r, rp = window_range(w), window_range(w, 1)

    def agg(rr, pred):
        t = sumcells(ctx.cells, rr, lambda k: k[3] == "cora" and k[0] in bset and pred(k))
        vol, _, _, _, cres, bc, bk = t
        return {"conversations": vol, "resolved": cres, "back_call": bc, "back_complaint": bk,
                "resolved_pct": pct(cres, vol), "leakage_pct": pct(bc + bk, cres)}

    k = agg(r, lambda k: True)
    kp = agg(rp, lambda k: True)
    journeys = []
    for tid in CORA_JOURNEYS:
        a, ap = agg(r, lambda k, tid=tid: k[2] == tid), agg(rp, lambda k, tid=tid: k[2] == tid)
        journeys.append({"id": tid, "label": THEME[tid]["label"], "product": THEME[tid]["product"],
                         "owner": THEME[tid]["owner"], **a,
                         "leakage_delta": delta(a["leakage_pct"], ap["leakage_pct"]) if w["id"] != "w13" else None})
    journeys.sort(key=lambda j: -(j["back_call"] + j["back_complaint"]))
    by_product = []
    for p in PRODUCTS:
        if p["id"] == "cora_digital":
            continue
        a = agg(r, lambda k, pid=p["id"]: THEME[k[2]]["product"] == pid)
        if a["conversations"]:
            by_product.append({"id": p["id"], "label": p["label"], **a})
    by_product.sort(key=lambda x: -(x["back_call"] + x["back_complaint"]))
    trend = []
    for a, b, lab in buckets(w):
        t = agg((a, b), lambda k: True)
        trend.append({"x": lab, "v": t["leakage_pct"]})
    by_segment = [{"id": s["id"], "label": s["label"], **agg(r, lambda k, sid=s["id"]: k[1] == sid)} for s in SEGMENTS]
    return {**k, "leakage_delta": delta(k["leakage_pct"], kp["leakage_pct"]) if w["id"] != "w13" else None,
            "journeys": journeys, "by_product": by_product, "by_segment": by_segment, "trend": trend}


FOS_STATES = [
    {"id": "within", "label": "Within 8 weeks", "sub": "No final response yet; inside the time limit"},
    {"id": "clock_running", "label": "Final response issued, 6-month clock running", "sub": "Customer may still refer"},
    {"id": "eligible", "label": "Eligible to refer", "sub": "Time limit passed without a final response"},
    {"id": "referred", "label": "Referred", "sub": "Referred to the Financial Ombudsman Service"},
]


def fos_block(ctx, w, bset):
    """Stock as at the freeze (the same for every window), flows in the window. At-risk is a subset of pending."""
    at = FREEZE
    stock = [c for c in ctx.comps if c["b"] in bset and fos_state(c, at)]

    def states(cs):
        cnt = collections.Counter(fos_state(c, at) for c in cs)
        return {s["id"]: cnt.get(s["id"], 0) for s in FOS_STATES}

    st = states(stock)
    risk = sum(1 for c in stock if at_risk(c, at))
    r = window_range(w)
    received = ctx.comps_in(r, bset)
    fr_in = [c for c in ctx.comps if c["b"] in bset and r[0] <= c["fr"] <= r[1]]
    ref_in = [c for c in ctx.comps if c["b"] in bset and c["ref"] and r[0] <= c["ref"] <= r[1]]
    on_time = sum(1 for c in fr_in if c["fr"] <= c["dl"])

    def rows(key, labels, ids):
        out = []
        for i in ids:
            cs = [c for c in stock if c[key] == i]
            s = states(cs)
            out.append({"id": i, "label": labels[i], **s, "pending": s["within"] + s["eligible"],
                        "at_risk": sum(1 for c in cs if at_risk(c, at)), "total": sum(s.values())})
        return sorted(out, key=lambda x: -(x["eligible"] + x["at_risk"]))

    plabel = {p["id"]: p["label"] for p in PRODUCTS}
    blabel = {b["id"]: b["label"] for b in BRANDS}
    tlabel = {t["id"]: t["label"] for t in THEMES}
    by_theme = rows("t", tlabel, [t["id"] for t in THEMES])[:8]
    return {
        "as_at": FREEZE_LABEL,
        "states": [{**s, "count": st[s["id"]]} for s in FOS_STATES],
        "total": sum(st.values()),
        "pending": st["within"] + st["eligible"],
        "at_risk": risk,
        "by_product": rows("p", plabel, [p["id"] for p in PRODUCTS]),
        "by_brand": rows("b", blabel, [b for b in BRAND_SHARE if b in bset]),
        "by_theme": by_theme,
        "flows": {"received": len(received), "final_responses": len(fr_in), "on_time": on_time,
                  "on_time_pct": pct(on_time, len(fr_in)), "referred": len(ref_in)},
        "psd_pending": sum(1 for c in stock if c["psd"] and fos_state(c, at) == "within"),
    }


def segment_block(ctx, w, bset):
    r, rp = window_range(w), window_range(w, 1)
    out = []
    for s in SEGMENTS:
        cur = sumcells(ctx.cells, r, lambda k, sid=s["id"]: k[0] in bset and k[1] == sid)
        prev = sumcells(ctx.cells, rp, lambda k, sid=s["id"]: k[0] in bset and k[1] == sid)
        cm, pm = contact_metrics(cur), contact_metrics(prev)
        cs = ctx.comps_in(r, bset, lambda c, sid=s["id"]: c["s"] == sid)
        cps = ctx.comps_in(rp, bset, lambda c, sid=s["id"]: c["s"] == sid)
        cust = customers_of(bset, s["id"])
        k = complaint_metrics(cs, cust)
        kp = complaint_metrics(cps, cust)
        cora = sumcells(ctx.cells, r, lambda kk, sid=s["id"]: kk[0] in bset and kk[1] == sid and kk[3] == "cora")
        out.append({
            "id": s["id"], "label": s["label"], "customers": round(cust),
            "contacts": cm["volume"], "negative_pct": cm["negative_pct"], "repeat_pct": cm["repeat_pct"],
            "negative_delta": delta(cm["negative_pct"], pm["negative_pct"]) if w["id"] != "w13" else None,
            "complaints": k["volume"], "complaints_per_100k": k["per_100k"],
            "complaints_delta_pct": vol_delta_pct(k["volume"], kp["volume"]) if w["id"] != "w13" else None,
            "upheld_pct": k["upheld_pct"], "cora_leakage_pct": pct(cora[5] + cora[6], cora[4]),
        })
    return out


def group_block(ctx, w, bset):
    r, rp = window_range(w), window_range(w, 1)
    cur, prev = sumcells(ctx.cells, r, lambda k: k[0] in bset), sumcells(ctx.cells, rp, lambda k: k[0] in bset)
    cm, pm = contact_metrics(cur), contact_metrics(prev)
    cs, cps = ctx.comps_in(r, bset), ctx.comps_in(rp, bset)
    cust = customers_of(bset)
    k, kp = complaint_metrics(cs, cust), complaint_metrics(cps, cust)
    trend = [{"x": lab, "v": contact_metrics(sumcells(ctx.cells, (a, b), lambda kk: kk[0] in bset))["negative_pct"]} for a, b, lab in buckets(w)]
    nw = w["id"] != "w13"
    return {
        "customers": round(cust),
        "contacts": cm["volume"], "contacts_change_pct": vol_delta_pct(cm["volume"], pm["volume"]) if nw else None,
        "negative_pct": cm["negative_pct"], "negative_delta": delta(cm["negative_pct"], pm["negative_pct"]) if nw else None,
        "repeat_pct": cm["repeat_pct"], "repeat_delta": delta(cm["repeat_pct"], pm["repeat_pct"]) if nw else None,
        "complaints": k["volume"], "complaints_change_pct": vol_delta_pct(k["volume"], kp["volume"]) if nw else None,
        "complaints_per_100k": k["per_100k"], "upheld_pct": k["upheld_pct"], "closed_3d_pct": k["closed_3d_pct"],
        "upheld_delta": delta(k["upheld_pct"], kp["upheld_pct"]) if nw else None,
        "closed_3d_delta": delta(k["closed_3d_pct"], kp["closed_3d_pct"]) if nw else None,
        "trend": trend,
    }


def duty_block(ctx, w, bset):
    """The four Consumer Duty outcomes by segment: negative share of the outcome's contacts, and complaints per 100,000
    customers on the outcome's themes. Evidence links point at register entries (the rule, the definitions)."""
    r = window_range(w)
    out = []
    for o in OUTCOMES:
        tids = {t["id"] for t in THEMES if t["outcome"] == o["id"]}
        cells = []
        for s in SEGMENTS:
            c = sumcells(ctx.cells, r, lambda k, sid=s["id"]: k[0] in bset and k[1] == sid and k[2] in tids)
            cs = ctx.comps_in(r, bset, lambda x, sid=s["id"]: x["s"] == sid and x["t"] in tids)
            cust = customers_of(bset, s["id"])
            cells.append({"segment": s["id"], "label": s["label"], "contacts": c[0], "negative_pct": pct(c[1], c[0]),
                          "complaints": len(cs), "complaints_per_100k": round(len(cs) / cust * 100_000, 1)})
        allc = sumcells(ctx.cells, r, lambda k: k[0] in bset and k[2] in tids)
        top = collections.Counter(x["t"] for x in ctx.comps_in(r, bset, lambda x: x["t"] in tids)).most_common(3)
        out.append({"id": o["id"], "label": o["label"], "negative_pct": pct(allc[1], allc[0]),
                     "complaints": sum(c["complaints"] for c in cells), "segments": cells,
                     "top_themes": [{"id": t, "label": THEME[t]["label"], "complaints": n} for t, n in top],
                     "evidence": ["REG-CD-OUTCOMES", "REG-CD-VULNERABLE"] if o["id"] == "support" else ["REG-CD-OUTCOMES"]})
    return out


def brand_block(ctx, w):
    r = window_range(w)
    cols = []
    for b in BRANDS:
        bset = [b["id"]]
        g = group_block(ctx, w, bset)
        c = cora_block(ctx, w, bset)
        f = fos_block(ctx, w, bset)
        cols.append({"id": b["id"], "label": b["label"], "customers": g["customers"], "complaints": g["complaints"],
                     "complaints_per_100k": g["complaints_per_100k"], "upheld_pct": g["upheld_pct"],
                     "closed_3d_pct": g["closed_3d_pct"], "negative_pct": g["negative_pct"], "repeat_pct": g["repeat_pct"],
                     "cora_leakage_pct": c["leakage_pct"], "fos_eligible": f["states"][2]["count"],
                     "fos_at_risk": f["at_risk"],
                     "login_contacts": sumcells(ctx.cells, r, lambda k, bid=b["id"]: k[0] == bid and k[2] == "app_login_biometrics")[0]})
    return {"brands": cols}


def ledger_block(ctx, w, bset):
    """Timelines measured in the window (final responses issued, claims decided): met + outside = measured."""
    r = window_range(w)
    rows = []
    fr = [c for c in ctx.comps if c["b"] in bset and r[0] <= c["fr"] <= r[1]]
    defs = [
        ("final_8w", "Final response within 8 weeks", "REG-DISP-8W",
         [c for c in fr if not c["psd"] and not c["c3"]], lambda c: c["fr"] <= c["dl"]),
        ("psd_15bd", "Payment-services final response within 15 business days", "REG-PSD-15",
         [c for c in fr if c["psd"] and not c["c3"]], lambda c: c["fr"] <= c["dl"]),
    ]
    for rid, label, reg, cs, ok in defs:
        met = sum(1 for c in cs if ok(c))
        rows.append({"id": rid, "label": label, "register": reg, "measured": len(cs), "met": met,
                     "outside": len(cs) - met, "met_pct": pct(met, len(cs))})
    app = [ctx.app[(b, d)] for b in bset for d in days(*r)]
    n, met = sum(a[0] for a in app), sum(a[1] for a in app)
    rows.append({"id": "app_5bd", "label": "Push payment scam reimbursement within 5 business days", "register": "REG-PSR-APP",
                 "measured": n, "met": met, "outside": n - met, "met_pct": pct(met, n)})
    return rows


def agents_block(ctx, w, bset):
    r = window_range(w)
    lanes = []
    for lane, label in (("agent", "Triaged by the Fraud Triage Agent"), ("analyst", "Triaged by an analyst")):
        t = [0] * 7
        for (b, p, ln, d), v in ctx.triage.items():
            if b in bset and ln == lane and in_range(d, r):
                for i in range(7):
                    t[i] += v[i]
        k, rel, held, blk, rep, comp, fos = t
        lanes.append({"id": lane, "label": label, "triaged": k, "released": rel, "held": held, "blocked": blk,
                      "repeat": rep, "repeat_pct": pct(rep, rel + held), "complaints": comp,
                      "complaints_per_10k": round(10_000 * comp / k, 1) if k else None, "fos": fos})
    fr = [c for c in ctx.comps if c["b"] in bset and r[0] <= c["fr"] <= r[1] and not c["c3"] and c["fr"] >= AI_LETTERS_FROM]
    letters = []
    for flag, label in ((True, "AI-drafted, approved by a handler"), (False, "Written by a handler")):
        cs = [c for c in fr if c["ai"] == flag]
        ref = sum(1 for c in cs if c["ref"])
        rep = sum(c["rep14"] for c in cs)
        letters.append({"id": "ai" if flag else "handler", "label": label, "letters": len(cs), "repeat": rep,
                        "repeat_pct": pct(rep, len(cs)), "referred": ref, "referred_pct": pct(ref, len(cs), 2)})
    return {"triage": lanes, "letters": letters}


def product_block(ctx, w, bset, pid):
    r, rp = window_range(w), window_range(w, 1)
    tids = [t["id"] for t in THEMES if t["product"] == pid]
    themes = []
    for tid in tids:
        c = sumcells(ctx.cells, r, lambda k, tid=tid: k[0] in bset and k[2] == tid)
        cp = sumcells(ctx.cells, rp, lambda k, tid=tid: k[0] in bset and k[2] == tid)
        cs = ctx.comps_in(r, bset, lambda x, tid=tid: x["t"] == tid)
        cps = ctx.comps_in(rp, bset, lambda x, tid=tid: x["t"] == tid)
        themes.append({"id": tid, "label": THEME[tid]["label"], "owner": THEME[tid]["owner"], "outcome": THEME[tid]["outcome"],
                       "contacts": c[0], "negative_pct": pct(c[1], c[0]), "complaints": len(cs),
                       "complaints_change_pct": vol_delta_pct(len(cs), len(cps)) if w["id"] != "w13" else None,
                       "contacts_change_pct": vol_delta_pct(c[0], cp[0]) if w["id"] != "w13" else None})
    themes.sort(key=lambda t: -t["complaints"])
    c = sumcells(ctx.cells, r, lambda k: k[0] in bset and k[2] in tids)
    cp = sumcells(ctx.cells, rp, lambda k: k[0] in bset and k[2] in tids)
    cs = ctx.comps_in(r, bset, lambda x: x["p"] == pid)
    cps = ctx.comps_in(rp, bset, lambda x: x["p"] == pid)
    cm, pm = contact_metrics(c), contact_metrics(cp)
    km = complaint_metrics(cs, customers_of(bset))
    mover = max(themes, key=lambda t: (t["complaints_change_pct"] or -999) if t["complaints"] >= 20 else -999) if themes else None
    p = next(x for x in PRODUCTS if x["id"] == pid)
    return {"id": pid, "label": p["label"], "owner": p["owner"], "contacts": cm["volume"], "negative_pct": cm["negative_pct"],
            "negative_delta": delta(cm["negative_pct"], pm["negative_pct"]) if w["id"] != "w13" else None,
            "complaints": km["volume"], "upheld_pct": km["upheld_pct"], "closed_3d_pct": km["closed_3d_pct"],
            "complaints_change_pct": vol_delta_pct(len(cs), len(cps)) if w["id"] != "w13" else None,
            "themes": themes, "mover": mover}


def brief_block(products):
    """Morning brief by product: one line each, generated from the figures (HL-29), never written by hand."""
    out = []
    for p in products:
        m = p["mover"]
        if p["id"] == "cora_digital" or not m:
            continue
        ch = m["complaints_change_pct"]
        if ch is None:
            head = f"{m['label']}: {m['complaints']:,} complaints"
        else:
            head = f"{m['label']}: complaints {'+' if ch >= 0 else ''}{ch:.0f}%"
        out.append({"id": p["id"], "label": p["label"], "headline": head, "theme": m["id"], "owner": m["owner"],
                    "outcome": m["outcome"], "complaints": p["complaints"], "complaints_change_pct": p["complaints_change_pct"],
                    "negative_pct": p["negative_pct"], "action": action_for(m)})
    return out


def action_for(m):
    if (m["complaints_change_pct"] or 0) >= 15:
        return "Route to owner with the journey evidence"
    if (m["negative_pct"] or 0) >= 18:
        return "Review the journey with the owner"
    return "Monitor this week"


def journey_block(ctx, w, bset, tid):
    """Drill for one Cora journey (signal page): leakage trend, by product is fixed (one), by brand and segment."""
    r = window_range(w)

    def agg(rr, pred):
        t = sumcells(ctx.cells, rr, lambda k: k[3] == "cora" and k[2] == tid and pred(k))
        return {"conversations": t[0], "resolved": t[4], "back_call": t[5], "back_complaint": t[6], "leakage_pct": pct(t[5] + t[6], t[4])}

    k = agg(r, lambda k: k[0] in bset)
    trend = [{"x": lab, "v": agg((a, b), lambda k: k[0] in bset)["leakage_pct"]} for a, b, lab in buckets(w)]
    by_brand = [{"id": b["id"], "label": b["label"], **agg(r, lambda k, bid=b["id"]: k[0] == bid)} for b in BRANDS if b["id"] in bset]
    by_segment = [{"id": s["id"], "label": s["label"], **agg(r, lambda k, sid=s["id"]: k[0] in bset and k[1] == sid)} for s in SEGMENTS]
    calls = sumcells(ctx.cells, r, lambda kk: kk[3] == "calls" and kk[2] == tid and kk[0] in bset)
    cs = ctx.comps_in(r, bset, lambda x: x["t"] == tid)
    t = THEME[tid]
    return {"id": tid, "label": t["label"], "product": t["product"], "owner": t["owner"], "outcome": t["outcome"], **k,
            "trend": trend, "by_brand": by_brand, "by_segment": by_segment, "calls": calls[0], "complaints": len(cs),
            "complaints_upheld_pct": pct(sum(c["up"] for c in cs), len(cs))}


def main():
    cells = build_contacts()
    comps = build_complaints()
    app, triage = build_weekly_other()
    ctx = Ctx(cells, comps, app, triage)
    windows = []
    for w in WINDOWS:
        s, e = window_range(w)
        windows.append({**w, "start": s.isoformat(), "end": e.isoformat()})
    slices = {}
    for w in WINDOWS:
        for bf in BRAND_FILTER:
            bset = brands_of(bf["id"])
            products = [product_block(ctx, w, bset, p["id"]) for p in PRODUCTS]
            slices[f"{w['id']}|{bf['id']}"] = {
                "group": group_block(ctx, w, bset),
                "segments": segment_block(ctx, w, bset),
                "channel": channel_block(ctx, w, bset),
                "cora": cora_block(ctx, w, bset),
                "fos": fos_block(ctx, w, bset),
                "duty": duty_block(ctx, w, bset),
                "ledger": ledger_block(ctx, w, bset),
                "agents": agents_block(ctx, w, bset),
                "products": {p["id"]: p for p in products},
                "brief": brief_block(products),
                "journeys": {tid: journey_block(ctx, w, bset, tid) for tid in CORA_JOURNEYS},
            }
            if bf["id"] == "all":
                slices[f"{w['id']}|all"]["brand"] = brand_block(ctx, w)
            print(f"seed_natwest: slice {w['id']}|{bf['id']}")
    doc = {
        "provenance": "internal",
        "label": "Internal · illustrative until discovery",
        "freeze": FREEZE_ISO,
        "freeze_label": FREEZE_LABEL,
        "window": {"start": WINDOW_START.isoformat(), "end": FREEZE.isoformat()},
        "windows": windows,
        "default_window": "w4",
        "brands": BRAND_FILTER,
        "segments": SEGMENTS,
        "channels": CHANNELS,
        "products": [{k: p[k] for k in ("id", "label", "owner")} for p in PRODUCTS],
        "outcomes": OUTCOMES,
        "fos_states": FOS_STATES,
        "journeys": [{"id": t, "label": THEME[t]["label"], "product": THEME[t]["product"]} for t in CORA_JOURNEYS],
        "slices": slices,
    }
    OUT.mkdir(parents=True, exist_ok=True)
    with open(OUT / "natwest.json", "w", encoding="utf-8", newline="\n") as f:
        json.dump(doc, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    # Half-year equivalents for the volume validation (the anchor is a half-year figure).
    h1_like = [c for c in comps if dt.date(2026, 5, 15) <= c["d"] <= FREEZE]
    span_weeks = ((FREEZE - dt.date(2026, 5, 15)).days + 1) / 7
    scale = {
        "seed": SEED,
        "anchors": {"h1_complaints": H1_COMPLAINTS, "per_1000_accounts": PER_1000_ACCOUNTS, "upheld": UPHELD, "closed_3d": CLOSED_3D},
        "derived": {"weekly_complaints": round(WEEKLY_COMPLAINTS, 1), "accounts": ACCOUNTS},
        "assumptions": {"customers": CUSTOMERS, "contacts_per_customer_year": CONTACTS_PER_CUSTOMER_YEAR,
                        "brand_share": BRAND_SHARE, "segment_share": SEGMENT_SHARE, "product_complaint_shape": PRODUCT_COMPLAINT_SHAPE,
                        "app_claims_week": APP_CLAIMS_WEEK, "fraud_alerts_week": FRAUD_ALERTS_WEEK, "ai_letter_share": AI_LETTER_SHARE},
        "ours": {
            "complaints_per_half_year": round(len(h1_like) / span_weeks * H1_WEEKS),
            "per_1000_accounts_half_year": round(len(h1_like) / span_weeks * H1_WEEKS / ACCOUNTS * 1000, 2),
            "upheld": round(sum(c["up"] for c in h1_like) / len(h1_like), 3),
            "closed_3d": round(sum(c["c3"] for c in h1_like) / len(h1_like), 3),
            "contacts_week": round(sum(v[0] for ser in cells.values() for d, v in ser.items() if window_range(WINDOWS[0])[0] <= d <= FREEZE)),
            "negative_share": round(sum(v[1] for ser in cells.values() for v in ser.values()) / max(1, sum(v[0] for ser in cells.values() for v in ser.values())), 3),
            "complaint_records": len(comps),
        },
        "events": [
            "Faster Payments incident 23-25 Oct (contacts x3.2; Cora leakage x1.35 after)",
            "Mortgage rate switch contacts rising from 28 Sep (fixed rates ending)",
            "App login contacts up from 30 Oct after an app update (Royal Bank of Scotland x1.55)",
            "Cora unresolved rising from 12 Oct; branch closure contacts x1.6 from 1 Oct",
        ],
    }
    SEED_DIR.mkdir(parents=True, exist_ok=True)
    with open(SEED_DIR / "natwest_scale.json", "w", encoding="utf-8", newline="\n") as f:
        json.dump(scale, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("seed_natwest:", json.dumps(scale["ours"]))


if __name__ == "__main__":
    main()
