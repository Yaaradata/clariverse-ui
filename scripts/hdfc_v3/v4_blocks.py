"""B11 · HDFC demo V4 (Vidya's 13 Oct review): the figures for the additions, per period, from the same records as
periods_v3.py. Every internal figure is a bank-scale weighted sum of the sample rows, so it reconciles with the existing
cards and CX pulse figures; lists are sample rows (one row each), never weights.

  hierarchy        total interactions → inside the bank (complaints · queries · requests → resolved · open · waiting
                   on customer, with open too long inside open) and public (positive · neutral · negative →
                   responded · not responded)
  open_too_long    open items past their limit: 5 h for Ultra-sensitive customers, 24 h for Ultra-HNI customers, the
                   published RBI timeline where the item has one, else the 48-hour default (LIMITS below; D-11 bank
                   TATs replace the default when supplied)
  priority_slice   Ultra-sensitive, Ultra-HNI and high-impact complaints (a property of the complaint), for Cards
  to_close         today's 15 to close: the open Cards items furthest past their limit
  social           response oversight on public voice: sentiment × responded, response time, unanswered negatives
  top_complaints   the 15 Cards complaint themes with the most complaints, each with its evidence (redacted)
Scripted Ask lists (query_lists) are fixed windows from the data end, not per period.
"""

from __future__ import annotations

import collections
import datetime as dt
import hashlib

from common import DELIVERABLES, PERIOD_END, PRODUCT_LABEL

import ombudsman_v3 as omb

END = dt.datetime.fromisoformat(PERIOD_END)
H = dt.timedelta(hours=1)

# Open-too-long limits (B11 item 2). Hours. Priority limits apply first, then a published RBI timeline, then default.
LIMITS = {
    "default_hours": 48,
    "priority": {"priority_a": 5, "uhni": 24},
    "regulatory_source": "rbi",
}
LIMIT_LABEL = {
    "priority_a": "Ultra-sensitive: 5 hours",
    "uhni": "Ultra-HNI: 24 hours",
    "rbi": "RBI timeline",
    "default": "Default: 48 hours (bank TAT to confirm in discovery)",
}

# Bank words (B11 item 1): every interaction is a complaint, a query or a request.
KIND_OF = {
    "query_response": "query",
    "complaint_resolution": "complaint",
    "dispute": "complaint",
    "failed_reversal": "complaint",
    "unauthorised_reversal": "complaint",
    "refund": "complaint",
}
KINDS = [("complaint", "Complaints"), ("query", "Queries"), ("request", "Requests")]

# Assignable owners (B11 item 4): roles, never names.
OWNER_ROLES = ["Escalations lead", "Upgrades lead", "Premium cards lead", "Service-delivery head", "Cards · CX lead",
               "Social care lead", "Internal Ombudsman office"]

CHANNEL_LABEL = {"emails": "Email", "calls": "Calls", "chat": "Chat", "whatsapp": "WhatsApp", "social": "Social inbox",
                 "branch": "Branch"}
SOURCE_LABEL = {"playstore": "Play Store", "appstore": "App Store", "x": "X", "reddit": "Reddit", "forum": "Forums"}


def kind(r) -> str:
    return KIND_OF.get(r["deliverable"], "request")


def pct(a, b, d=1):
    return round(100 * a / b, d) if b else None


def limit_of(r, customers) -> tuple[dt.timedelta, str]:
    """The item's open-too-long limit and its basis."""
    coh = customers.get(r["masked_id"], {}).get("cohorts", [])
    for lid, hours in LIMITS["priority"].items():
        if lid in coh:
            return hours * H, lid
    d = DELIVERABLES.get(r["deliverable"])
    if d and d["source"] == LIMITS["regulatory_source"] and r.get("deliverable_due"):
        return dt.datetime.fromisoformat(r["deliverable_due"]) - r["_c"], "rbi"
    return LIMITS["default_hours"] * H, "default"


def too_long(r, customers, is_open, t=END) -> bool:
    if not is_open(r, t):
        return False
    lim, _ = limit_of(r, customers)
    return t - r["_c"] > lim


def age_label(td: dt.timedelta) -> str:
    h = td.total_seconds() / 3600
    return f"{h:.0f} h" if h < 48 else f"{h / 24:.0f} days"


def case_ref(r) -> str:
    """A case reference for the list: the sample row's id (synthetic), never the customer's id."""
    return r["id"].replace("INT-", "CASE-")


# ------------------------------------------------------------------ 1 · hierarchy

def internal_split(vol, customers, b, is_open, open_at, waiting_at) -> dict:
    out = {}
    for k, label in KINDS:
        xs = [r for r in vol if kind(r) == k]
        out[k] = {
            "label": label,
            "volume": sum(r["w"] for r in xs),
            "resolved": sum(r["w"] for r in xs if not open_at(r, b)),
            "open": sum(r["w"] for r in xs if is_open(r, b)),
            "waiting_on_customer": sum(r["w"] for r in xs if waiting_at(r, b)),
            "open_too_long": sum(r["w"] for r in xs if too_long(r, customers, is_open, b)),
        }
    return out


def public_split(prs, responded) -> dict:
    out = {}
    for s in ("positive", "neutral", "negative"):
        xs = [r for r in prs if r["sentiment"] == s]
        n = sum(1 for r in xs if responded(r))
        out[s] = {"volume": len(xs), "responded": n, "not_responded": len(xs) - n}
    return out


def hierarchy(vol, prs, customers, b, is_open, open_at, waiting_at, responded) -> dict:
    inside = internal_split(vol, customers, b, is_open, open_at, waiting_at)
    public = public_split(prs, responded)
    i_tot = sum(x["volume"] for x in inside.values())
    p_tot = sum(x["volume"] for x in public.values())
    return {
        "total": i_tot + p_tot,
        "inside": {"volume": i_tot, "kinds": inside,
                   "resolved": sum(x["resolved"] for x in inside.values()),
                   "open": sum(x["open"] for x in inside.values()),
                   "waiting_on_customer": sum(x["waiting_on_customer"] for x in inside.values()),
                   "open_too_long": sum(x["open_too_long"] for x in inside.values())},
        "public": {"volume": p_tot, "sentiments": public,
                   "responded": sum(x["responded"] for x in public.values()),
                   "not_responded": sum(x["not_responded"] for x in public.values()),
                   "responded_live_only": "Play Store replies are collected; replies on other sources are simulated (D24)."},
    }


# ------------------------------------------------------------------ 2 · open too long

def otl_rows(rs, customers, is_open, labels, n=40) -> list[dict]:
    """Open items past their limit, furthest past first: the list behind the dial."""
    rows = []
    for r in rs:
        if not too_long(r, customers, is_open):
            continue
        lim, basis = limit_of(r, customers)
        over = END - r["_c"] - lim
        rows.append((over, r, basis))
    rows.sort(key=lambda x: -x[0])
    return [{"id": case_ref(r), "product": PRODUCT_LABEL.get(r["product"], r["product"]),
             "theme": labels.get(r["theme"], r["theme"]), "kind": kind(r), "channel": CHANNEL_LABEL[r["_ch"]],
             "age": age_label(END - r["_c"]), "over_by": age_label(over), "limit": LIMIT_LABEL[basis]}
            for over, r, basis in rows[:n]]


def open_too_long(vol, customers, is_open, labels) -> dict:
    open_w = sum(r["w"] for r in vol if is_open(r, END))
    late = [r for r in vol if too_long(r, customers, is_open)]
    by_basis = collections.Counter()
    for r in late:
        by_basis[limit_of(r, customers)[1]] += r["w"]
    return {"count": sum(r["w"] for r in late), "open": open_w, "share_of_open": pct(sum(r["w"] for r in late), open_w),
            "by_limit": [{"id": k, "label": LIMIT_LABEL[k], "count": by_basis[k]} for k in ("priority_a", "uhni", "rbi", "default")],
            "list": otl_rows(vol, customers, is_open, labels)}


# ------------------------------------------------------------------ 3 · priority slice

def priority_slice(vol, customers, is_open) -> list[dict]:
    blocks = [
        ("ultra_sensitive", "Ultra-sensitive", lambda r: "priority_a" in customers.get(r["masked_id"], {}).get("cohorts", [])),
        ("uhni", "Ultra-HNI", lambda r: "uhni" in customers.get(r["masked_id"], {}).get("cohorts", [])),
        # A property of the complaint (regulator or legal language, a third contact, public reach), never of the person.
        ("high_impact", "High-impact complaints", lambda r: bool(r["high_impact"])),
    ]
    out = []
    for bid, label, pred in blocks:
        xs = [r for r in vol if pred(r)]
        out.append({
            "id": bid, "label": label, "volume": sum(r["w"] for r in xs),
            "open": sum(r["w"] for r in xs if is_open(r, END)),
            "open_too_long": sum(r["w"] for r in xs if too_long(r, customers, is_open)),
            # Negative mentions: social-inbox contacts with negative sentiment, linked by the bank's own records.
            "negative_mentions": sum(r["w"] for r in xs if r["_ch"] == "social" and r["sentiment"] == "negative"),
            "channels": sorted({CHANNEL_LABEL[r["_ch"]] for r in xs}),
        })
    return out


# ------------------------------------------------------------------ 4 · today's 15 to close

def to_close(vol, customers, is_open, labels) -> list[dict]:
    rows = []
    for r in vol:
        if not is_open(r, END):
            continue
        lim, basis = limit_of(r, customers)
        age = END - r["_c"]
        rows.append((age - lim, r, basis, age))
    rows.sort(key=lambda x: -x[0])
    return [{"id": case_ref(r), "theme": labels.get(r["theme"], r["theme"]), "kind": kind(r),
             "channel": CHANNEL_LABEL[r["_ch"]], "age": age_label(age), "overdue": over > dt.timedelta(0),
             "limit": LIMIT_LABEL[basis], "suggested_owner": "Upgrades lead" if r["theme"] in ("card_variant_migration", "card_eligibility_upgrade")
             else "Premium cards lead" if basis in ("priority_a", "uhni") else "Escalations lead" if r["high_impact"] else "Cards · CX lead"}
            for over, r, basis, age in rows[:15]]


# ------------------------------------------------------------------ 5 · social response oversight

def reply_hours(r):
    rep = r.get("reply") or {}
    if r["source"] != "playstore" or not rep.get("at"):
        return None
    return (dt.datetime.fromisoformat(rep["at"]) - r["_c"]).total_seconds() / 3600


def post_ref(r) -> str:
    return "POST-" + hashlib.sha1(str(r["id"]).encode()).hexdigest()[:8].upper()


def social(prs, responded, public_end, labels, days=None) -> dict:
    mat = {s: {"responded": 0, "not_responded": 0} for s in ("positive", "neutral", "negative")}
    for r in prs:
        mat[r["sentiment"]]["responded" if responded(r) else "not_responded"] += 1
    hrs = [h for r in prs if (h := reply_hours(r)) is not None and h >= 0]
    buckets = [("Under 4 h", 0, 4), ("4–24 h", 4, 24), ("1–3 days", 24, 72), ("Over 3 days", 72, 10 ** 9)]
    dist = [{"label": lb, "count": sum(1 for h in hrs if lo <= h < hi)} for lb, lo, hi in buckets]
    late = [r for r in prs if r["sentiment"] == "negative" and not responded(r) and public_end - r["_c"] > 24 * H]
    late.sort(key=lambda r: r["_c"])
    daily = collections.OrderedDict()
    if prs:
        d0 = min(r["_c"] for r in prs).date()
        d1 = max(r["_c"] for r in prs).date()
        d = d0
        while d <= d1:
            daily[d] = {"negative": 0, "responded": 0}
            d += dt.timedelta(days=1)
        for r in prs:
            x = daily[r["_c"].date()]
            if r["sentiment"] == "negative":
                x["negative"] += 1
                if responded(r):
                    x["responded"] += 1
    return {
        "matrix": mat,
        "response_time": {"basis": "Play Store replies (live)", "n": len(hrs), "buckets": dist,
                          "median_hours": round(sorted(hrs)[len(hrs) // 2], 1) if hrs else None},
        "unanswered_negatives": {"count": len(late), "list": [
            {"id": post_ref(r), "source": SOURCE_LABEL.get(r["source"], r["source"]),
             "theme": labels.get(r["themes"][0], r["themes"][0]) if r.get("themes") else "—",
             "age": age_label(public_end - r["_c"]), "reach": bool(r.get("_reach"))} for r in late[:40]]},
        "daily": [{"date": d.isoformat(), **v} for d, v in daily.items()],
        "note": "Responded: the bank's handle or the store developer replied. Play Store replies are collected; on other "
                "sources replies are simulated (D24). The bank's agency report is monthly; this is daily.",
    }


# ------------------------------------------------------------------ 6 · top 15 complaints

def top_complaints(cs, labels, w) -> list[dict]:
    a, b = w["start"], w["end"]
    got = [(c, omb.status(c, END)) for c in cs if a <= c["_received_at"] < b]
    by = collections.defaultdict(list)
    for c, st in got:
        by[c["theme"]].append((c, st))
    rows = []
    for th, xs in by.items():
        open_xs = [(c, st) for c, st in xs if st and st["open"]]
        oldest = max((END - c["_received_at"] for c, _ in open_xs), default=None)
        esc = any(c["escalation"] or any(x["escalation"] for x in c["contacts"]) for c, _ in xs)
        risk = sum(c["w"] for c, st in xs if st and st["at_risk"])
        sample = sorted(xs, key=lambda p: p[0]["_received_at"])[:3]
        rows.append({
            "id": f"THEME-{th}", "theme": labels.get(th, th), "product": PRODUCT_LABEL.get(xs[0][0]["product"], ""),
            "count": sum(c["w"] for c, _ in xs), "open": sum(c["w"] for c, st in open_xs),
            "oldest_open": age_label(oldest) if oldest else "none open", "escalation_language": esc,
            "ombudsman_risk": risk, "ombudsman_flag": risk > 0,
            # Evidence (redacted): case timelines only; no customer text or identifier reaches the page.
            "evidence": [{"case": c["id"], "received": c["received_at"][:10], "channel": c["channel"].replace("_", " "),
                          "contacts": len(c["contacts"]), "channels_touched": len({c["channel"], *(x["channel"] for x in c["contacts"])}),
                          "escalation": ", ".join(c["escalation"]) or "none",
                          "status": "open" if st and st["open"] else "replied",
                          "ombudsman": ("eligible" if st and st["eligible"] else f"{st['days_left']} days to day 30" if st and st["brink"] else "—")}
                         for c, st in sample],
        })
    rows.sort(key=lambda x: -x["count"])
    return rows[:15]


# ------------------------------------------------------------------ 8 · scripted Ask lists (fixed windows)

def query_lists(inter, cards_complaints, pub, customers, is_open, responded, public_end, labels) -> dict:
    week = END - dt.timedelta(days=7)
    risk = []
    for c in cards_complaints:
        st = omb.status(c, END)
        if st and st["at_risk"]:
            pts, why = omb.score(c, st, END)
            risk.append((pts, c, why))
    risk.sort(key=lambda x: -x[0])
    neg = [r for r in pub if r["sentiment"] == "negative" and not responded(r) and public_end - r["_c"] <= 48 * H]
    pri = [r for r in inter if is_open(r, END) and END - r["_c"] > 24 * H
           and any(k in customers.get(r["masked_id"], {}).get("cohorts", []) for k in ("priority_a", "priority_b", "uhni"))]
    pri.sort(key=lambda r: r["_c"])
    return {
        "ombudsman_cards_week": {
            "q": "Complaints at risk of reaching the ombudsman in cards this week",
            "count": sum(c["w"] for _, c, _ in risk), "as_of": END.isoformat(), "since": week.isoformat(),
            "list": [{"id": c["id"], "theme": labels.get(c["theme"], c["theme"]), "why": "; ".join(why)} for _, c, why in risk[:25]]},
        "unanswered_negatives_48h": {
            "q": "Negatives the bank hasn't responded to in the last 48 hours",
            "count": len(neg),
            "list": [{"id": post_ref(r), "theme": labels.get(r["themes"][0], r["themes"][0]) if r.get("themes") else "—",
                      "why": f"{SOURCE_LABEL.get(r['source'], r['source'])}, {age_label(public_end - r['_c'])} old"} for r in neg[:25]]},
        "priority_open_24h": {
            "q": "Open priority-customer issues older than 24 hours",
            "count": sum(r["w"] for r in pri),
            "list": [{"id": case_ref(r), "theme": labels.get(r["theme"], r["theme"]),
                      "why": f"{PRODUCT_LABEL.get(r['product'], r['product'])}, {CHANNEL_LABEL[r['_ch']]}, open {age_label(END - r['_c'])}"}
                     for r in pri[:25]]},
    }
