"""Synthetic internal layer for the V3 demo (B7 §2). Deterministic (fixed seed). Illustrative until discovery.

Writes data/seed/internal_v3/:
  customers.json            5,000 fictional customers (masked ids, segment, cohort flags, products, RM, proxy contacts)
  interactions.jsonl        20,000 interactions over 8 weeks (1 Aug – 25 Sep 2026, 07:45)
  bot_calls.json            500 IVR bot calls after card declines
  escalation_emails.json    20 hand-written L2 escalation emails with ground-truth buckets (A1)
  personas.json             12 hand-written fictional priority customers (E2, E3)
  rm_notifications.json     derived from cohort and signal rules
  aggregates.json           everything the screens read (the UI never loads the record-level files)

Rules (B7 §2): theme shares per product follow the public mix within ±20%; every total reconciles; no value reused
across unrelated metrics; no real names; no person-level high-impact flag (high impact is a property of a complaint).
"""

from __future__ import annotations

import collections
import datetime as dt
import hashlib
import json
import math
import random

from common import (
    JOURNEY_ORDER,
    JOURNEY_STAGE,
    OWNER_LABEL,
    ROUTING,
    THEME_REQUEST_TYPE,
    DELIVERABLES,
    NOW,
    OUT_APP,
    PRODUCT_IDS,
    PRODUCT_LABEL,
    PRODUCTS,
    SEED,
    SEED_V3,
    THEME_DELIVERABLE,
    dump,
    load,
)
from personas import BUCKETS, ESCALATION_EMAILS, PERSONAS

rng = random.Random(SEED)
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
NOW_DT = dt.datetime.fromisoformat(NOW)
START_DT = dt.datetime(2026, 7, 1, 0, 0, tzinfo=IST)
N_CUSTOMERS = 5000
N_INTERACTIONS = 32000
N_BOT_CALLS = 500

SEGMENTS = [("Classic", 0.55), ("Preferred", 0.27), ("Imperia", 0.14), ("Private", 0.04)]
CHANNELS = [
    "inbound_voice",
    "outbound_voice",
    "chat",
    "email",
    "social_inbox",
    "ivr_bot",
    "branch",
    "whatsapp",
]
CHANNEL_LABEL = {
    "inbound_voice": "Inbound calls",
    "outbound_voice": "Outbound calls",
    "chat": "Chat",
    "email": "Email",
    "social_inbox": "Social inbox",
    "ivr_bot": "IVR bot",
    "branch": "Branch",
    "whatsapp": "WhatsApp",
}
CHANNEL_W = {
    "inbound_voice": 0.36,
    "outbound_voice": 0.06,
    "chat": 0.19,
    "email": 0.14,
    "social_inbox": 0.02,
    "ivr_bot": 0.09,
    "branch": 0.08,
    "whatsapp": 0.06,
}
# Internal volume mix by product (public voice over-represents the app; internal contact is card- and account-heavy).
PRODUCT_W = {
    "cards": 0.31,
    "accounts": 0.24,
    "digital": 0.13,
    "payzapp": 0.09,
    "personal_loans": 0.09,
    "home_loans": 0.07,
    "auto_loans": 0.04,
    "insurance": 0.03,
}
HOLD_P = {
    "cards": 0.7,
    "accounts": 0.97,
    "digital": 0.85,
    "payzapp": 0.35,
    "personal_loans": 0.12,
    "home_loans": 0.09,
    "auto_loans": 0.07,
    "insurance": 0.16,
}
# Hand-set mixes where public voice is too thin to follow (logged in the QA block).
HAND_MIX = {
    "insurance": {
        "mis_selling": 30,
        "fees_charges_bank": 22,
        "complaint_handling": 18,
        "care_unreachable": 12,
        "statements_documents": 10,
        "closure_requests": 8,
    },
}


def largest_remainder(total: int, weights: dict[str, float]) -> dict[str, int]:
    s = sum(weights.values())
    if total == 0 or s == 0:
        return {k: 0 for k in weights}
    raw = {k: total * w / s for k, w in weights.items()}
    base = {k: math.floor(v) for k, v in raw.items()}
    for k in sorted(raw, key=lambda k: raw[k] - base[k], reverse=True)[: total - sum(base.values())]:
        base[k] += 1
    return base


def iso(d: dt.datetime) -> str:
    return d.astimezone(IST).isoformat(timespec="minutes")


def add_working_days(d: dt.datetime, days: int) -> dt.datetime:
    out = d
    left = days
    while left > 0:
        out += dt.timedelta(days=1)
        if out.weekday() != 6:  # Sundays skipped
            left -= 1
    return out


def deadline(created: dt.datetime, deliv: str) -> dt.datetime:
    d = DELIVERABLES[deliv]
    if d.get("calendar"):
        return created + dt.timedelta(days=d["tat_days"])
    if deliv in ("query_response", "failed_reversal"):
        return created + dt.timedelta(days=d["tat_days"])
    return add_working_days(created, d["tat_days"])


def pick(weights: dict):
    keys = list(weights)
    return rng.choices(keys, weights=[weights[k] for k in keys])[0]


def masked(n: int) -> str:
    return f"XXXX{n:04d}"


# ------------------------------------------------------------------ public mix

def public_mix():
    products = load(OUT_APP / "products.json")
    themes = {t["id"]: t for t in load(OUT_APP / "themes.json")["themes"]}
    mix: dict[str, dict[str, int]] = {}
    for r in products["rows"]:
        mix[r["id"]] = {i["id"]: i["count"] for i in r["issues"]}
    # Auto loans: too few public items; use the combined loans mix.
    loans = collections.Counter()
    for lp in ("personal_loans", "home_loans", "auto_loans"):
        loans.update(mix[lp])
    mix["auto_loans"] = dict(loans)
    mix.update(HAND_MIX)
    return mix, themes, products


# ------------------------------------------------------------------ customers

def build_customers():
    customers = []
    rm_pool = [f"RM-{i:03d}" for i in range(1, 121)]
    for i in range(N_CUSTOMERS):
        seg = pick(dict(SEGMENTS))
        held = [p for p in PRODUCT_IDS if rng.random() < HOLD_P[p]]
        if "accounts" not in held:
            held.append("accounts")
        cohorts = []
        if seg == "Private":
            cohorts.append("uhni" if rng.random() < 0.75 else "hni")
        elif seg == "Imperia" and rng.random() < 0.85:
            cohorts.append("hni")
        customers.append(
            {
                "masked_id": masked(1000 + i * 1 + (i * 7919) % 8000 if False else 1000 + i),
                "segment": seg,
                "cohorts": cohorts,
                "products": sorted(held, key=PRODUCT_IDS.index),
                "rm_id": rng.choice(rm_pool) if seg in ("Imperia", "Private") else None,
                "proxy_contacts": 0,
                "cohort_added_at": None,
                "cohort_added_by": None,
            }
        )
    # The bank's own priority lists (neutral labels until the bank's term is confirmed). Drawn mostly from UHNI.
    uhni = [c for c in customers if "uhni" in c["cohorts"]]
    hni = [c for c in customers if "hni" in c["cohorts"]]
    rng.shuffle(uhni)
    rng.shuffle(hni)
    for c in uhni[:34] + hni[:6]:
        c["cohorts"].insert(0, "priority_a")
    for c in uhni[34:74] + hni[6:86]:
        c["cohorts"].insert(0, "priority_b")
    for c in customers:
        if "uhni" in c["cohorts"]:
            c["proxy_contacts"] = 1 if rng.random() < 0.45 else 0
        elif "hni" in c["cohorts"]:
            c["proxy_contacts"] = 1 if rng.random() < 0.12 else 0
        if any(k in c["cohorts"] for k in ("priority_a", "priority_b")):
            # Most were on the list before the window; a few added this week, by the bank or on a LisN suggestion.
            r = rng.random()
            if r < 0.05:
                c["cohort_added_at"] = iso(dt.datetime(2026, 9, 23, 11, tzinfo=IST) + dt.timedelta(hours=rng.randint(0, 130)))
                c["cohort_added_by"] = "lisn_suggested_bank_confirmed" if rng.random() < 0.4 else "bank"
            else:
                c["cohort_added_at"] = "2026-04-01T00:00+05:30"
                c["cohort_added_by"] = "bank"
    return customers


# ------------------------------------------------------------------ interactions

def sample_created() -> dt.datetime:
    span = (NOW_DT - START_DT).total_seconds()
    # Mild upward drift and a daytime profile.
    while True:
        u = rng.random() ** 0.93
        d = START_DT + dt.timedelta(seconds=u * span)
        h = d.hour
        if h < 8 and rng.random() < 0.75:
            continue
        if d.weekday() == 6 and rng.random() < 0.4:
            continue
        return d


def resolution_hours(deliv: str, theme: str, cohort: bool, channel: str) -> float:
    d = DELIVERABLES[deliv]
    tat_h = d["tat_days"] * 24 * (1.15 if not d.get("calendar") and deliv not in ("query_response", "failed_reversal") else 1)
    median = 0.5
    sigma = 0.85
    # Themes where public voice says timelines break get a heavier tail.
    if theme in ("complaint_handling", "card_dispatch", "refund_delay", "card_variant_migration", "account_freeze", "care_unreachable"):
        median, sigma = 0.72, 0.95
    if channel in ("chat", "ivr_bot"):
        median *= 0.8
    if cohort:
        median *= 0.75  # a little faster, not reliably so: the gap Vidya described
    return tat_h * math.exp(math.log(median) + sigma * rng.gauss(0, 1))


def high_impact_reasons(theme_row: dict, channel: str, sender: str) -> list[str]:
    reasons = []
    esc = (theme_row.get("share_escalation") or 0) / 100
    if rng.random() < esc * 0.35:
        reasons.append("regulator_named")
    if rng.random() < esc * 0.12:
        reasons.append("legal_language")
    if channel == "social_inbox" and rng.random() < 0.18:
        reasons.append("public_reach")
    if channel == "email" and rng.random() < 0.004:
        reasons.append("official_domain")
    if rng.random() < 0.008:
        reasons.append("third_contact")
    return reasons


def settled_at(rec):
    """When the deliverable was met or missed: the first response for "First response to a query", else the closure."""
    at = rec["first_response_at"] if rec["deliverable"] == "query_response" else rec["closed_at"]
    return dt.datetime.fromisoformat(at) if at else None


def is_breached(rec) -> bool:
    end = settled_at(rec) or NOW_DT
    return end > dt.datetime.fromisoformat(rec["deliverable_due"])


def make_interaction(idx, cust, product, theme, created, channel, sender, themes, forced=None):
    t = themes.get(theme, {})
    deliv = THEME_DELIVERABLE.get(theme, "query_response")
    is_cohort = any(k in cust["cohorts"] for k in ("priority_a", "priority_b", "uhni", "hni"))
    p_neg = min(0.9, 0.62 * (t.get("share_negative") or 50) / 100)
    sentiment = "negative" if rng.random() < p_neg else ("positive" if rng.random() < 0.18 else "neutral")
    res_h = resolution_hours(deliv, theme, is_cohort, channel)
    if channel in ("inbound_voice", "outbound_voice", "branch", "chat", "ivr_bot"):
        first_resp_h = 0.0  # answered in the contact itself
    else:
        first_resp_h = min(res_h, math.exp(math.log(7 if not is_cohort else 4) + 1.1 * rng.gauss(0, 1)))
    closed = created + dt.timedelta(hours=res_h)
    first = created + dt.timedelta(hours=first_resp_h)
    rec = {
        "id": f"INT-{idx:05d}",
        "masked_id": cust["masked_id"],
        "sender": sender,
        "channel": channel,
        "product": product,
        "theme": theme,
        "sentiment": sentiment,
        "high_impact": [],
        "created_at": iso(created),
        "first_response_at": iso(first) if first <= NOW_DT else None,
        "status": "closed" if closed <= NOW_DT else "open",
        "closed_at": iso(closed) if closed <= NOW_DT else None,
        "deliverable": deliv,
        "deliverable_due": iso(deadline(created, deliv)),
    }
    if sentiment == "negative":
        rec["high_impact"] = high_impact_reasons(t, channel, sender)
    if forced:
        rec.update(forced)
        # A scripted status wins over the drawn one: an open item has no closing time, a closed one always has one.
        if rec["status"] == "open":
            rec["closed_at"] = None
        elif not rec["closed_at"]:
            rec["closed_at"] = iso(min(closed, NOW_DT))
    rec["breached"] = is_breached(rec)
    # Waiting on customer (30 Sep review, K4): the bank has sent a resolution or proposed one, and the thread is with
    # the customer. Set from the record id, so it draws nothing from the random stream; scripted trails stay open.
    rec["resolution_sent_at"] = None
    if rec["status"] == "open" and rec["first_response_at"] and not rec.get("scripted"):
        if int(hashlib.sha1(rec["id"].encode()).hexdigest(), 16) % 100 < 40:
            rec["resolution_sent_at"] = rec["first_response_at"]
    return rec


def build_interactions(customers, mix, themes):
    by_id = {c["masked_id"]: c for c in customers}
    weights = []
    for c in customers:
        w = 1.0
        if "uhni" in c["cohorts"]:
            w = 1.8
        elif "hni" in c["cohorts"]:
            w = 1.4
        if "priority_a" in c["cohorts"] or "priority_b" in c["cohorts"]:
            w *= 1.2
        weights.append(w)
    persona_ids = {p["masked_id"] for p in PERSONAS}
    out = []
    idx = 1
    # Scripted persona trails first (E3), so they are part of every total.
    for p in PERSONAS:
        cust = by_id[p["masked_id"]]
        for si, step in enumerate(p["trail"]):
            if step.get("event"):
                continue
            created = dt.datetime.fromisoformat(step["at"])
            forced = {
                k: step[k]
                for k in ("status", "closed_at", "first_response_at", "sentiment", "high_impact", "sender")
                if k in step
            }
            forced["scripted"] = True
            forced["step"] = si
            forced["summary"] = step["summary"]
            rec = make_interaction(
                idx, cust, step["product"], step["theme"], created, step["channel"], step.get("sender", "customer"), themes, forced
            )
            out.append(rec)
            idx += 1
    # Draw customer, product, time and channel first; then give each product its themes by exact quota
    # (largest remainder on the public mix), so theme shares follow public voice without sampling noise.
    slots = []
    while len(out) + len(slots) < N_INTERACTIONS:
        cust = rng.choices(customers, weights=weights)[0]
        if cust["masked_id"] in persona_ids:
            continue
        pw = {p: PRODUCT_W[p] / HOLD_P[p] for p in cust["products"]}
        product = pick(pw)
        channel = pick(CHANNEL_W)
        if product == "digital" and channel == "branch":
            channel = "chat"
        slots.append((cust, product, sample_created(), channel))
    by_product = collections.defaultdict(list)
    for sl in slots:
        by_product[sl[1]].append(sl)
    for product, sls in by_product.items():
        quota = largest_remainder(len(sls), mix[product])
        themes_list = [th for th, n in quota.items() for _ in range(n)]
        rng.shuffle(themes_list)
        for (cust, _, created, channel), theme in zip(sls, themes_list):
            sender = "customer"
            if cust["proxy_contacts"] and channel in ("email", "whatsapp") and rng.random() < 0.35:
                sender = "proxy"
            out.append(make_interaction(idx, cust, product, theme, created, channel, sender, themes))
            idx += 1
    return out


# ------------------------------------------------------------------ bot calls

DECLINE_REASONS = {
    "Insufficient funds or limit": 0.31,
    "International usage switched off": 0.17,
    "Suspected fraud hold": 0.16,
    "Incorrect expiry or CVV": 0.14,
    "Card blocked or replaced": 0.12,
    "Merchant or network error": 0.10,
}


def build_bot_calls(customers):
    calls = []
    for i in range(N_BOT_CALLS):
        c = rng.choice(customers)
        reason = pick(DECLINE_REASONS)
        p_res = {"Insufficient funds or limit": 0.72, "Incorrect expiry or CVV": 0.8, "Merchant or network error": 0.35}.get(reason, 0.5)
        resolved = rng.random() < p_res
        calls.append(
            {
                "id": f"BOT-{i + 1:04d}",
                "masked_id": c["masked_id"],
                "priority_cohort": any(k in c["cohorts"] for k in ("priority_a", "priority_b", "uhni")),
                "decline_reason": reason,
                "resolved": resolved,
                "follow_up_contact": (not resolved and rng.random() < 0.68) or (resolved and rng.random() < 0.08),
                "created_at": iso(sample_created()),
            }
        )
    return calls


# ------------------------------------------------------------------ aggregates

def hours_between(a: str, b: dt.datetime) -> float:
    return (b - dt.datetime.fromisoformat(a)).total_seconds() / 3600


def dial(rows):
    total = len(rows)
    closed_or_resp = sum(1 for r in rows if r["status"] == "closed" or r["first_response_at"])
    open_ = sum(1 for r in rows if r["status"] == "open")
    otl = sum(1 for r in rows if r["status"] == "open" and r["breached"])
    closed = sum(1 for r in rows if r["status"] == "closed")
    return {
        "total": total,
        "closed": closed,
        "closed_or_responded": closed_or_resp,
        "open": open_,
        "open_too_long": otl,
        "closed_or_responded_pct": round(100 * closed_or_resp / total, 1) if total else None,
        "open_pct": round(100 * open_ / total, 1) if total else None,
        "open_too_long_pct_of_open": round(100 * otl / open_, 1) if open_ else None,
    }


def deliverable_stats(rows):
    # Measured: settled (answered, for a first-response deliverable; closed, for the rest) or already past due.
    measured = [r for r in rows if settled_at(r) or r["breached"]]
    met = sum(1 for r in measured if not r["breached"])
    outside = sum(1 for r in measured if r["breached"])
    return {
        "measured": len(measured),
        "met": met,
        "outside": outside,
        "met_pct": round(100 * met / len(measured), 1) if measured else None,
        "open_within": sum(1 for r in rows if r["status"] == "open" and not r["breached"]),
    }


# Names as set in the 30 Sep review (changes_30sep.md; overrides B7 §E2's neutral labels). Membership always comes from
# the bank's own lists and tiers (synthetic here), never from public data.
COHORTS = [
    ("priority_a", "Ultra sensitive", "The bank's own list"),
    ("priority_b", "RBI & Government", "The bank's own list"),
    ("uhni", "Ultra HNI", "Relationship tier from core banking"),
    ("hni", "HNI", "Relationship tier from core banking"),
    ("multi", "Customers with multiple relationships", "Listed or HNI customers holding two or more products, from the bank's records"),
]
LISTED = ("priority_a", "priority_b", "uhni", "hni")
HI_LABEL = {
    "regulator_named": "Regulator or ombudsman named",
    "legal_language": "Legal or consumer-court language",
    "public_reach": "Public post with reach",
    "official_domain": "Sent from an official or regulator domain",
    "third_contact": "Third contact on the same issue",
}


def aggregates(customers, inter, bot_calls, emails, themes, products_pub):
    cust = {c["masked_id"]: c for c in customers}
    theme_label = {k: v["label"] for k, v in themes.items()}
    theme_label.setdefault("general_query", "General query")
    issue = [r for r in inter]

    # Dials: overall and by product.
    by_prod = collections.defaultdict(list)
    for r in issue:
        by_prod[r["product"]].append(r)
    product_rows = []
    for p in PRODUCTS:
        rows = by_prod[p["id"]]
        neg = [r for r in rows if r["sentiment"] == "negative"]
        weeks = collections.Counter()
        for r in neg:
            d = dt.date.fromisoformat(r["created_at"][:10])
            weeks[(d - dt.timedelta(days=d.weekday())).isoformat()] += 1
        # Full weeks only (Mon 6 Jul to Sun 27 Sep): partial first and last weeks would read as false dips.
        wk = sorted((w, v) for w, v in weeks.items() if "2026-07-06" <= w <= "2026-09-21")
        prev3 = sum(v for w, v in wk if "2026-08-17" <= w <= "2026-08-31")
        last3 = sum(v for w, v in wk if "2026-09-07" <= w <= "2026-09-21")
        tcount = collections.Counter(r["theme"] for r in neg)
        product_rows.append(
            {
                "id": p["id"],
                "label": p["label"],
                **dial(rows),
                "negative": len(neg),
                "high_impact": sum(1 for r in rows if r["high_impact"]),
                "deliverables": deliverable_stats(rows),
                "negative_weekly": [{"week": w, "count": v} for w, v in wk],
                "negative_change_pct": round(100 * (last3 - prev3) / prev3, 1) if prev3 else None,
                "top_issue": {"id": tcount.most_common(1)[0][0], "label": theme_label[tcount.most_common(1)[0][0]], "negative": tcount.most_common(1)[0][1]} if tcount else None,
                "by_channel": dict(collections.Counter(r["channel"] for r in rows)),
            }
        )

    # Cohorts (E1 strip, E2).
    def in_cohort(r, k):
        return k in cust[r["masked_id"]]["cohorts"]

    notified = rm_rules(customers, inter, bot_calls)
    cohort_rows = []
    for k, label, source in COHORTS:
        members = [c for c in customers if k in c["cohorts"]]
        rows = [r for r in inter if in_cohort(r, k)]
        open_rows = [r for r in rows if r["status"] == "open"]
        o5 = [r for r in open_rows if hours_between(r["created_at"], NOW_DT) > 5]
        o24 = [r for r in open_rows if hours_between(r["created_at"], NOW_DT) > 24]
        neg = [r for r in rows if r["sentiment"] == "negative"]
        affected = {r["masked_id"] for r in open_rows}
        # Every member with an RM alert due (open issue, high impact, over 5 h, or an unresolved bot call), not only those
        # with an open item: the same set rm_notifications.json lists.
        rm_should = {c["masked_id"] for c in members if c["masked_id"] in notified["should"]}
        rm_did = {m for m in rm_should if m in notified["today"]}
        cohort_rows.append(
            {
                "id": k,
                "label": label,
                "source": source,
                "customers": len(members),
                "interactions": len(rows),
                "customers_with_open_issue": len(affected),
                "open": len(open_rows),
                "open_over_5h": len(o5),
                "open_over_24h": len(o24),
                "open_too_long": sum(1 for r in open_rows if r["breached"]),
                "negative": len(neg),
                "negative_by_channel": {ch: sum(1 for r in neg if r["channel"] == ch) for ch in CHANNELS},
                "products_affected": dict(collections.Counter(r["product"] for r in open_rows)),
                "rm_should_know": len(rm_should),
                "rm_notified_today": len(rm_did),
                "added_this_week": sum(1 for m in members if m["cohort_added_at"] and m["cohort_added_at"] >= "2026-09-23"),
                "added_this_week_by_lisn": sum(
                    1
                    for m in members
                    if m["cohort_added_at"] and m["cohort_added_at"] >= "2026-09-23" and m["cohort_added_by"] == "lisn_suggested_bank_confirmed"
                ),
            }
        )

    # High-impact complaints: a property of the complaint, never of the person.
    hi = [r for r in inter if r["high_impact"]]
    hi_reason = collections.Counter(x for r in hi for x in r["high_impact"])
    high_impact = {
        "total": len(hi),
        "open": sum(1 for r in hi if r["status"] == "open"),
        "open_too_long": sum(1 for r in hi if r["status"] == "open" and r["breached"]),
        "reasons": [{"id": k, "label": HI_LABEL[k], "count": v} for k, v in hi_reason.most_common()],
        "by_product": dict(collections.Counter(r["product"] for r in hi)),
    }

    # Customer memory: customers with signals in two or more products.
    per_c = collections.defaultdict(list)
    for r in inter:
        per_c[r["masked_id"]].append(r)
    multi = {m: rs for m, rs in per_c.items() if len({r["product"] for r in rs}) >= 2}
    multi_neg = {m: rs for m, rs in multi.items() if sum(1 for r in rs if r["sentiment"] == "negative") >= 2 and len({r["product"] for r in rs if r["sentiment"] == "negative"}) >= 2}
    open_multi = {m for m, rs in multi_neg.items() if any(r["status"] == "open" for r in rs)}
    otl_multi = {m for m, rs in multi_neg.items() if any(r["status"] == "open" and r["breached"] for r in rs)}
    multi_block = {
        "customers_with_signals": len(per_c),
        "multi_product": len(multi),
        "negative_in_two_or_more_products": len(multi_neg),
        "with_open_issue": len(open_multi),
        "with_open_too_long": len(otl_multi),
        "priority_among_them": sum(1 for m in multi_neg if any(k in cust[m]["cohorts"] for k in ("priority_a", "priority_b", "uhni", "hni"))),
        "pairs": [
            {"pair": f"{PRODUCT_LABEL[a]} + {PRODUCT_LABEL[b]}", "customers": n}
            for (a, b), n in collections.Counter(
                tuple(sorted({r["product"] for r in rs if r["sentiment"] == "negative"}, key=PRODUCT_IDS.index)[:2])
                for rs in multi_neg.values()
            ).most_common(5)
        ],
    }

    # Deliverables ledger: deliverable × product.
    ledger = []
    by_d = collections.defaultdict(list)
    for r in inter:
        by_d[r["deliverable"]].append(r)
    for d_id, d in DELIVERABLES.items():
        rows = by_d.get(d_id, [])
        if not rows:
            continue
        per_product = []
        for p in PRODUCTS:
            pr = [r for r in rows if r["product"] == p["id"]]
            if len(pr) < 5:
                continue
            per_product.append({"product": p["id"], "label": p["label"], "total": len(pr), **deliverable_stats(pr), "open_too_long": sum(1 for r in pr if r["status"] == "open" and r["breached"])})
        ledger.append(
            {
                "id": d_id,
                "label": d["label"],
                "tat_label": d["tat_label"],
                "source": d["source"],
                "source_note": d.get("source_note"),
                "compensation": d["compensation"],
                "total": len(rows),
                **deliverable_stats(rows),
                "open_too_long": sum(1 for r in rows if r["status"] == "open" and r["breached"]),
                "themes": [k for k, v in THEME_DELIVERABLE.items() if v == d_id],
                "products": per_product,
            }
        )

    # Cards module (M2): issue list with internal counts beside the public ones.
    cards_rows = []
    cards_inter = by_prod["cards"]
    pub_cards = next(r for r in products_pub["rows"] if r["id"] == "cards")
    pub_by_theme = {i["id"]: i for i in pub_cards["issues"]}
    for th, n in collections.Counter(r["theme"] for r in cards_inter).most_common():
        rs = [r for r in cards_inter if r["theme"] == th]
        cards_rows.append(
            {
                "theme": th,
                "label": theme_label.get(th, th),
                "interactions": n,
                "negative": sum(1 for r in rs if r["sentiment"] == "negative"),
                "open": sum(1 for r in rs if r["status"] == "open"),
                "open_too_long": sum(1 for r in rs if r["status"] == "open" and r["breached"]),
                "deliverable": THEME_DELIVERABLE.get(th, "query_response"),
                **{f"deliv_{k}": v for k, v in deliverable_stats(rs).items() if k in ("met_pct",)},
                "public_mentions": pub_by_theme.get(th, {}).get("count", 0),
                "public_negative": pub_by_theme.get(th, {}).get("negative", 0),
            }
        )

    # Personas (E2 list, E3 trails).
    persona_out = []
    for p in PERSONAS:
        c = cust[p["masked_id"]]
        rs = sorted(per_c[p["masked_id"]], key=lambda r: r["created_at"])
        latest = rs[-1]
        open_rs = [r for r in rs if r["status"] == "open"]
        oldest_open = min(open_rs, key=lambda r: r["created_at"]) if open_rs else None
        persona_out.append(
            {
                **{k: v for k, v in p.items() if k != "trail"},
                "segment": c["segment"],
                "cohorts": c["cohorts"],
                "products": c["products"],
                "rm_id": c["rm_id"],
                "latest": {"at": latest["created_at"], "channel": latest["channel"], "product": latest["product"], "summary": latest.get("summary") or theme_label.get(latest["theme"])},
                "open": len(open_rs),
                "oldest_open_hours": round(hours_between(oldest_open["created_at"], NOW_DT), 1) if oldest_open else None,
                # From the RM rule, like every other customer (review finding #19); the persona's script decides only
                # whether its due alert was sent.
                "rm_alert_due": c["masked_id"] in notified["should"],
                "rm_notified": c["masked_id"] in notified["today"],
                "trail": persona_trail(p, rs, theme_label),
            }
        )

    # Bot calls.
    unresolved = [b for b in bot_calls if not b["resolved"]]
    bot = {
        "total": len(bot_calls),
        "resolved": sum(1 for b in bot_calls if b["resolved"]),
        "unresolved": len(unresolved),
        "follow_up_after_unresolved": sum(1 for b in unresolved if b["follow_up_contact"]),
        "priority_unresolved": sum(1 for b in unresolved if b["priority_cohort"]),
        "by_reason": [
            {"reason": k, "calls": sum(1 for b in bot_calls if b["decline_reason"] == k), "resolved": sum(1 for b in bot_calls if b["decline_reason"] == k and b["resolved"])}
            for k in DECLINE_REASONS
        ],
    }

    # A1 email triage.
    emails = [{**e, "bucket_label": BUCKETS[e["bucket"]], "product_label": PRODUCT_LABEL[e["product"]], "theme_label": theme_label.get(e["theme"], e["theme"])} for e in emails]
    buckets = collections.Counter(e["bucket"] for e in emails)
    triage = {
        "total": len(emails),
        "buckets": [{"id": b, "label": BUCKETS[b], "count": buckets.get(b, 0)} for b in ("reply_status", "call_today", "escalate", "proactive_status", "close_confirm", "route_owner")],
        "manual_minutes_per_email": 14,
        "assisted_minutes_per_email": 5,
        "baseline_days_to_resolve": 6.5,
        "projected_days_to_resolve": 3.0,
    }

    # Channel mix and inside dials.
    overall = dial(inter)
    channel_rows = []
    for ch in CHANNELS:
        rs = [r for r in inter if r["channel"] == ch]
        channel_rows.append({"channel": ch, "label": CHANNEL_LABEL[ch], **dial(rs), "negative": sum(1 for r in rs if r["sentiment"] == "negative")})

    return {
        "provenance": "internal",
        "label": "Internal · illustrative until discovery",
        "note": (
            f"Synthetic sample generated by scripts/hdfc_v3/seed_internal_v3.py (seed {SEED}): {len(customers):,} fictional "
            f"customers and {len(inter):,} interactions over 13 weeks. Priority cohorts are over-sampled for the demo. These are "
            "not HDFC Bank figures."
        ),
        "now": NOW,
        "window": {"start": "2026-07-01", "end": "2026-09-29"},
        "sample": {"customers": len(customers), "interactions": len(inter), "bot_calls": len(bot_calls)},
        "dials": overall,
        "products": product_rows,
        "channels": channel_rows,
        "cohorts": cohort_rows,
        "high_impact": high_impact,
        "customer_memory": multi_block,
        "deliverables": ledger,
        "cards_issues": cards_rows,
        "personas": persona_out,
        "bot_calls": bot,
        "rm": {
            "should_know": len(notified["should"]),
            "notified_today": len(notified["today"] & notified["should"]),
            "rule": "An RM alert is due when a customer on a priority list or in the ultra-HNI or HNI tier has a negative signal, a high-impact complaint, an issue open over 5 hours, or an unresolved bot call.",
        },
        "triage": triage,
        "emails": emails,
        "channel_labels": CHANNEL_LABEL,
        "high_impact_labels": HI_LABEL,
    }


def persona_trail(p, rs, theme_label):
    by_step = {r["step"]: r for r in rs if "step" in r}
    out = []
    for si, step in enumerate(p["trail"]):
        r = by_step.get(si)
        base = {
            "at": step["at"],
            "product": step["product"],
            "product_label": PRODUCT_LABEL[step["product"]],
            # The social inbox is worked by social care (CX), whatever the product.
            "team": "Social care (CX)" if step.get("channel") == "social_inbox" else OWNER_LABEL_TEAM[next(x["owner"] for x in PRODUCTS if x["id"] == step["product"])],
            "outcome": step.get("outcome"),
            "theme": step["theme"],
            "theme_label": theme_label.get(step["theme"], step["theme"]),
            "summary": step["summary"],
            "flag_set": step.get("flag_set", False),
            "flag_follows": step.get("flag_follows", False),
        }
        if step.get("event"):
            out.append({**base, "event": True, "id": None, "channel": "system", "channel_label": "Card system", "sender": None, "sentiment": None, "status": None, "high_impact": []})
            continue
        out.append(
            {
                **base,
                "event": False,
                "id": r["id"],
                "channel": r["channel"],
                "channel_label": CHANNEL_LABEL[r["channel"]],
                "sender": r["sender"],
                "contact_id": r.get("contact_id"),
                "sentiment": r["sentiment"],
                "status": r["status"],
                "first_response_at": r["first_response_at"],
                "deliverable_due": r["deliverable_due"],
                "breached": r["breached"],
                "high_impact": [HI_LABEL[h] for h in r["high_impact"]],
            }
        )
    return out


OWNER_LABEL_TEAM = {
    "cards": "Cards",
    "payments": "Payments",
    "retail": "Retail",
    "loans": "Loans",
    "product": "Insurance",
    "digital": "Digital",
}


def rm_rules(customers, inter, bot_calls):
    cust = {c["masked_id"]: c for c in customers}
    should = set()
    for r in inter:
        c = cust[r["masked_id"]]
        if not c["rm_id"] or not any(k in c["cohorts"] for k in ("priority_a", "priority_b", "uhni", "hni")):
            continue
        age = hours_between(r["created_at"], NOW_DT)
        if r["status"] == "open" and (r["sentiment"] == "negative" or r["high_impact"] or age > 5):
            should.add(r["masked_id"])
    for b in bot_calls:
        c = cust[b["masked_id"]]
        if c["rm_id"] and not b["resolved"] and any(k in c["cohorts"] for k in ("priority_a", "priority_b", "uhni", "hni")):
            if hours_between(b["created_at"], NOW_DT) < 72:
                should.add(b["masked_id"])
    # Today, RMs hear about roughly one in five of these (manual, illustrative). A hand-written persona's story decides
    # its own case, so its trail and its RM status always agree.
    ordered = sorted(should)
    today = {m for i, m in enumerate(ordered) if (i * 37) % 100 < 21}
    scripted = {p["masked_id"]: p.get("rm_notified", False) for p in PERSONAS}
    today = {m for m in today if m not in scripted} | {m for m, told in scripted.items() if told and m in should}
    return {"should": should, "today": today}


def qa(inter, mix, products_pub):
    """Theme shares per product vs the public mix (±20% relative on themes with ≥ 5% share) and reconcile checks."""
    report = []
    for p in PRODUCT_IDS:
        rows = [r for r in inter if r["product"] == p and not r.get("scripted")]
        cnt = collections.Counter(r["theme"] for r in rows)
        pub = mix[p]
        ptot = sum(pub.values())
        itot = sum(cnt.values())
        for th, n in pub.items():
            ps = n / ptot
            if ps < 0.05:
                continue
            is_ = cnt.get(th, 0) / itot if itot else 0
            report.append({"product": p, "theme": th, "public_share": round(100 * ps, 1), "internal_share": round(100 * is_, 1), "within_20pct": abs(is_ - ps) <= 0.2 * ps})
    return {
        "theme_mix": report,
        "theme_mix_pass": all(r["within_20pct"] for r in report),
        "hand_set_mix": list(HAND_MIX) + ["auto_loans (combined loans mix)"],
    }


# ------------------------------------------------------------------ screen blocks (review step 4: one internal dataset)
# Everything the deliverables, satisfaction and MD-mail blocks show comes from these same records. The extra fields are
# drawn from a second random stream so every existing field keeps its value.
rng2 = random.Random(SEED + 7)
ESCALATION_RUNG = {"grievance": 2, "md_office": 3, "io": 4, "rbi_ombudsman": 5}
DISPUTE_DRIVERS = [
    ("Merchant response pending", 0.30),
    ("Chargeback evidence incomplete", 0.24),
    ("Network timeline", 0.18),
    ("Manual re-work after reopen", 0.16),
    ("Customer not updated", 0.12),
]
SEGMENT_LABEL = {"Private": "Private Banking", "Imperia": "Imperia", "Preferred": "Preferred", "Classic": "Classic"}
AGE_BANDS = [(30, "Up to 30 days"), (45, "31–45 days"), (60, "46–60 days"), (90, "61–90 days"), (10**6, "Over 90 days")]


def age_days(r) -> float:
    end = dt.datetime.fromisoformat(r["closed_at"]) if r.get("closed_at") and r["status"] == "closed" else NOW_DT
    return (end - dt.datetime.fromisoformat(r["created_at"])).total_seconds() / 86400


def enrich(inter):
    """Record-level fields for the screen blocks. Rules, in order:
    repeat: the same customer raised the same theme in the previous 30 days.
    escalation: a negative issue contact that is breached, repeated or high-impact may go to the grievance desk (30%);
      written complaints (email) can climb further: MD's office (35% of those), internal ombudsman (35% of those),
      RBI Ombudsman (30% of those). Each rung counts every contact that reached at least that rung.
    retained: a closed card-closure request where the customer stayed (27%).
    credited / dispute_driver: a closed dispute credited to the customer (60%); a breached dispute's main driver."""
    last: dict[tuple, dt.datetime] = {}
    for r in inter:
        created = dt.datetime.fromisoformat(r["created_at"])
        key = (r["masked_id"], r["theme"])
        prev = last.get(key)
        r["repeat"] = bool(prev and (created - prev).days < 30)
        last[key] = created
    for r in inter:
        esc = None
        if r["sentiment"] == "negative" and r["deliverable"] and (r["breached"] or r["repeat"] or r["high_impact"]):
            if rng2.random() < 0.30:
                esc = "grievance"
                if r["channel"] == "email" and rng2.random() < 0.35:
                    esc = "md_office"
                    if rng2.random() < 0.35:
                        esc = "io"
                        if rng2.random() < 0.30:
                            esc = "rbi_ombudsman"
        r["escalation"] = esc
        r["retained"] = r["theme"] == "closure_requests" and r["status"] == "closed" and rng2.random() < 0.27
        r["credited"] = r["deliverable"] == "dispute" and r["status"] == "closed" and rng2.random() < 0.60
        r["dispute_driver"] = None
        if r["deliverable"] == "dispute" and r["breached"]:
            x, acc = rng2.random(), 0.0
            r["dispute_driver"] = DISPUTE_DRIVERS[-1][0]
            for name, w in DISPUTE_DRIVERS:
                acc += w
                if x < acc:
                    r["dispute_driver"] = name
                    break


rng3 = random.Random(SEED + 11)
WRITTEN = ("email", "whatsapp", "social_inbox")


def written_delays(inter):
    """Written contacts (email, WhatsApp, social) wait longer for a first reply than calls or chat, which are answered in
    the contact: 8% of them wait 48 to 144 hours (never later than closure). Drawn from a third random stream, after
    every other field, so nothing else changes; breach is recomputed for the records touched. Hand-written personas
    keep their scripted times."""
    for r in inter:
        if r["channel"] not in WRITTEN or r.get("scripted"):
            continue
        if rng3.random() >= 0.08:
            continue
        created = dt.datetime.fromisoformat(r["created_at"])
        first = created + dt.timedelta(hours=48 + 96 * rng3.random())
        if r["closed_at"]:
            first = min(first, dt.datetime.fromisoformat(r["closed_at"]))
        r["first_response_at"] = iso(first) if first <= NOW_DT else None
        r["breached"] = is_breached(r)


def link_proxies(customers, inter):
    """Proxy senders are linked through the bank's own contact records (B7 §E3): each customer with a proxy has a masked
    contact record, and every message a proxy sends carries that record's id. No randomness: ids come from masked ids."""
    for c in customers:
        c["contacts"] = (
            [{"contact_id": f"PC-{c['masked_id'][-4:]}-1", "relation": "assistant", "linked_via": "bank contact record"}]
            if c["proxy_contacts"]
            else []
        )
    by = {c["masked_id"]: c for c in customers}
    for r in inter:
        r["contact_id"] = by[r["masked_id"]]["contacts"][0]["contact_id"] if r["sender"] == "proxy" else None


def reached(r, rung: str) -> bool:
    return bool(r["escalation"]) and ESCALATION_RUNG[r["escalation"]] >= ESCALATION_RUNG[rung]


def theme_label(themes, t):
    return themes[t]["label"] if t in themes else t.replace("_", " ").capitalize()


def screen_blocks(customers, inter, themes):
    seg = {c["masked_id"]: c["segment"] for c in customers}
    neg = [r for r in inter if r["sentiment"] == "negative"]

    # Routing and acknowledgements (one list).
    routing = [
        {
            **x,
            "owner_label": OWNER_LABEL.get(x["owner"], x["owner"]),
            "label": theme_label(themes, x["theme"]),
            "status": f"Acknowledged {x['acknowledged_at']}" if x["acknowledged_at"] else "Awaiting owner",
        }
        for x in ROUTING
    ]

    # MD-marked mail: written complaints that reached the MD's office.
    md = [r for r in inter if reached(r, "md_office")]
    by_theme = collections.defaultdict(list)
    for r in md:
        by_theme[r["theme"]].append(r)
    md_rows = []
    for t, rs in sorted(by_theme.items(), key=lambda kv: (-len(kv[1]), kv[0]))[:5]:
        resolved = sum(1 for r in rs if r["status"] == "closed")
        ages = sorted(age_days(r) for r in rs)
        md_rows.append({
            "theme": t,
            "label": theme_label(themes, t),
            "owner": themes.get(t, {}).get("owner", "cx"),
            "mails": len(rs),
            "median_age_days": round(ages[len(ages) // 2], 1),
            "resolved": resolved,
            "resolved_share": round(100 * resolved / len(rs), 1),
        })
    md_mail = {
        "total": len(md),
        "shown": sum(r["mails"] for r in md_rows),
        "rows": md_rows,
        "rule": "Written complaints (email) escalated to the MD's office, from the same interaction sample.",
    }

    # Satisfaction: tiers, journey stages, retention watchlist.
    tiers = []
    for sg in ("Private", "Imperia", "Preferred", "Classic"):
        rs = [r for r in inter if seg[r["masked_id"]] == sg]
        c = collections.Counter(r["sentiment"] for r in rs)
        n = len(rs)
        tiers.append({
            "tier": SEGMENT_LABEL[sg],
            "interactions": n,
            "positive": c["positive"],
            "neutral": c["neutral"],
            "negative": c["negative"],
            "share_positive": round(100 * c["positive"] / n, 1) if n else 0,
            "share_negative": round(100 * c["negative"] / n, 1) if n else 0,
            "customers_affected": len({r["masked_id"] for r in rs if r["sentiment"] == "negative"}),
        })
    closure_reqs = [r for r in inter if r["theme"] == "closure_requests"]
    # Closure intent by stage: the stage of the customer's last negative contact before the closure request.
    history: dict[str, list] = collections.defaultdict(list)
    for r in inter:
        history[r["masked_id"]].append(r)
    closure_stage = collections.Counter()
    for c in closure_reqs:
        before = [
            r for r in history[c["masked_id"]]
            if r["created_at"] < c["created_at"] and r["sentiment"] == "negative"
            and JOURNEY_STAGE.get(r["theme"], "Everyday use") != "Close"
        ]
        closure_stage[JOURNEY_STAGE.get(before[-1]["theme"], "Everyday use") if before else "Close"] += 1
    stages = []
    for st in JOURNEY_ORDER:
        rs = [r for r in inter if JOURNEY_STAGE.get(r["theme"], "Everyday use") == st]
        n = len(rs)
        stages.append({
            "stage": st,
            "interactions": n,
            "negative_share": round(100 * sum(1 for r in rs if r["sentiment"] == "negative") / n, 1) if n else 0,
            "repeat_contact_share": round(100 * sum(1 for r in rs if r["repeat"]) / n, 1) if n else 0,
            "closure_intent": closure_stage[st],
        })
    watch = []
    for sg in ("Private", "Imperia", "Preferred"):
        ids = {r["masked_id"] for r in closure_reqs if seg[r["masked_id"]] == sg}
        drivers = collections.Counter(
            r["theme"] for r in neg if r["masked_id"] in ids and r["theme"] != "closure_requests"
        )
        top = sorted(drivers.items(), key=lambda kv: (-kv[1], kv[0]))[0][0] if drivers else None
        watch.append({
            "tier": SEGMENT_LABEL[sg],
            "customers_with_closure_intent": len(ids),
            "top_driver": theme_label(themes, top) if top else "—",
            "owner": "rm",
            "action": "Route with evidence",
        })
    satisfaction = {
        "interactions_total": len(inter),
        "tiers": tiers,
        "journey_stages": {
            "total": sum(x["interactions"] for x in stages),
            "rows": stages,
            "rule": "Closure intent: closure requests, placed at the stage of the customer's last negative contact before the request.",
        },
        "retention_watchlist": {"total": sum(x["customers_with_closure_intent"] for x in watch), "rows": watch},
    }

    # Deliverables detail: ageing by request type, escalation ladder, closure saves, disputes.
    ageing = collections.defaultdict(lambda: {"open_cases": 0, "beyond_tat": 0})
    for r in inter:
        if r["status"] == "open":
            a = ageing[THEME_REQUEST_TYPE.get(r["theme"], "other")]
            a["open_cases"] += 1
            a["beyond_tat"] += 1 if r["breached"] else 0
    ageing_rows = [
        {
            "request_type": k,
            **v,
            "beyond_tat_share": round(100 * v["beyond_tat"] / v["open_cases"], 1) if v["open_cases"] else 0,
        }
        for k, v in sorted(ageing.items(), key=lambda kv: (-kv[1]["open_cases"], kv[0]))
    ]
    ladder = [
        {"rung": "Voice", "count": len(inter)},
        {"rung": "Repeat", "count": sum(1 for r in inter if r["repeat"])},
    ]
    for rung_id, rung in (("grievance", "Grievance"), ("md_office", "MD's office"), ("io", "IO"), ("rbi_ombudsman", "RBI Ombudsman")):
        ladder.append({"rung": rung, "count": sum(1 for r in inter if reached(r, rung_id))})
    closed_closure = [r for r in closure_reqs if r["status"] == "closed"]
    saved = sum(1 for r in closure_reqs if r["retained"])
    closure = {
        "closure_requests": len(closure_reqs),
        "closed": len(closed_closure),
        "saved": saved,
        "save_rate": round(100 * saved / len(closed_closure), 1) if closed_closure else 0,
    }
    disputes = [r for r in inter if r["deliverable"] == "dispute"]
    beyond = [r for r in disputes if r["breached"]]
    drivers = collections.Counter(r["dispute_driver"] for r in beyond)
    bands = collections.Counter()
    for r in beyond:
        d = age_days(r)
        bands[next(b for lim, b in AGE_BANDS if d <= lim)] += 1
    dispute_block = {
        "raised": len(disputes),
        "beyond_sla_total": len(beyond),
        "drivers": [{"driver": d, "cases": drivers[d]} for d, _ in DISPUTE_DRIVERS if drivers[d]],
        "aged_cases": [{"band": b, "cases": bands[b]} for _, b in AGE_BANDS if bands[b]],
        "funnel": [
            {"stage": "Disputes raised", "count": len(disputes)},
            {"stage": "First response given", "count": sum(1 for r in disputes if r["first_response_at"])},
            {"stage": "Closed", "count": sum(1 for r in disputes if r["status"] == "closed")},
            {"stage": "Customer credited", "count": sum(1 for r in disputes if r["credited"])},
            {"stage": "Credited within TAT", "count": sum(1 for r in disputes if r["credited"] and not r["breached"])},
        ],
    }
    return {
        "routing": routing,
        "md_mail": md_mail,
        "satisfaction": satisfaction,
        "deliverables_detail": {
            "ageing": ageing_rows,
            "ladder": ladder,
            "ladder_rule": "Each rung counts every contact that reached at least that rung. Repeat: the same customer on the same theme within 30 days.",
            "closure": closure,
            "disputes": dispute_block,
        },
    }


def main():
    mix, themes, products_pub = public_mix()
    customers = build_customers()
    # Personas are hand-written; place them on customers with matching cohorts.
    by_id = {c["masked_id"]: c for c in customers}
    for p in PERSONAS:
        c = by_id[p["masked_id"]]
        c["segment"] = p["segment"]
        c["cohorts"] = list(p["cohorts"])
        c["products"] = list(p["products"])
        c["rm_id"] = p["rm_id"]
        c["proxy_contacts"] = p.get("proxy_contacts", 0)
        c["cohort_added_at"] = p.get("cohort_added_at", "2026-04-01T00:00+05:30")
        c["cohort_added_by"] = p.get("cohort_added_by", "bank")
    # Customers with multiple relationships: a bank-supplied list (synthetic), derived from the bank's own records only.
    for c in customers:
        if len(c["products"]) >= 2 and any(k in c["cohorts"] for k in LISTED) and "multi" not in c["cohorts"]:
            c["cohorts"].append("multi")
    inter = build_interactions(customers, mix, themes)
    inter.sort(key=lambda r: r["created_at"])
    written_delays(inter)
    enrich(inter)
    link_proxies(customers, inter)
    bot_calls = build_bot_calls(customers)
    agg = aggregates(customers, inter, bot_calls, ESCALATION_EMAILS, themes, products_pub)
    agg.update(screen_blocks(customers, inter, themes))
    agg["qa"] = qa(inter, mix, products_pub)
    # Reconcile: product dials sum to the overall dial; cohort and channel counts come from the same records.
    for f in ("total", "open", "open_too_long", "closed_or_responded"):
        assert sum(p[f] for p in agg["products"]) == agg["dials"][f], f
        assert sum(c[f] for c in agg["channels"]) == agg["dials"][f], f
    for d in agg["deliverables"]:
        assert d["met"] + d["outside"] == d["measured"]
    assert sum(d["total"] for d in agg["deliverables"]) == agg["dials"]["total"]
    agg["qa"]["reconcile_pass"] = True

    SEED_V3.mkdir(parents=True, exist_ok=True)
    dump(customers, SEED_V3 / "customers.json", indent=None)
    with open(SEED_V3 / "interactions.jsonl", "w", encoding="utf-8") as f:
        for r in inter:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    dump(bot_calls, SEED_V3 / "bot_calls.json", indent=None)
    dump(ESCALATION_EMAILS, SEED_V3 / "escalation_emails.json")
    dump(PERSONAS, SEED_V3 / "personas.json")
    notified = rm_rules(customers, inter, bot_calls)
    dump(
        [{"masked_id": m, "rm_id": by_id[m]["rm_id"], "notified_today": m in notified["today"]} for m in sorted(notified["should"])],
        SEED_V3 / "rm_notifications.json",
        indent=None,
    )
    dump(agg, SEED_V3 / "aggregates.json")
    print("dials", agg["dials"])
    for p in agg["products"]:
        print(f"  {p['label']:30} {p['total']:5} open {p['open']:4} otl {p['open_too_long']:4} met {p['deliverables']['met_pct']}")
    for c in agg["cohorts"]:
        print(" ", c["label"], c["customers"], c["open"], c["open_over_5h"], c["open_over_24h"], c["rm_should_know"], c["rm_notified_today"], c["added_this_week"])
    print("high impact", agg["high_impact"]["total"], agg["high_impact"]["reasons"])
    print("memory", agg["customer_memory"])
    print("theme mix pass", agg["qa"]["theme_mix_pass"], [r for r in agg["qa"]["theme_mix"] if not r["within_20pct"]])


if __name__ == "__main__":
    main()
