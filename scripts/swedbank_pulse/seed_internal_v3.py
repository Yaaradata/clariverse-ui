"""Internal layer for the Swedbank pulse (SW-D09). Deterministic (fixed seed).

Writes data/seed/swedbank_pulse/:
  customers.json            5,000 sample customers (masked ids, segment, cohort flags, products, owner, proxy contacts)
  interactions.jsonl        32,000 sample contacts, 22 Oct 00:00 CEST to the freeze 17 Nov 07:45 CET (times in UTC)
  bot_calls.json            500 phone-menu calls after card declines
  escalation_emails.json    20 hand-written complaint emails with ground-truth buckets (A1)
  personas.json             12 hand-written priority customers (E2, E3)
  rm_notifications.json     derived from cohort and signal rules
  aggregates.json           everything the screens read (the UI never loads the record-level files)
  scale.json                bank-scale targets (scale_v3.py)

Every bank-scale figure, its tag (ANCHOR / DERIVED / ASSUMPTION) and its source is in docs/swedbank/volume_validation.md;
tags and provenance words never reach a screen string. Rules: every total reconciles; no value reused across unrelated
metrics; no real names, masked ids only; no person-level high-impact flag (high impact is a property of a complaint).

Cohort ids (the screens key on them): priority_a = customers in a vulnerable situation; priority_b = recent
complainants (90 days); uhni = Premium and Private Banking; multi = account-measure affected (frozen or restricted
under AML rules).
"""

from __future__ import annotations

import collections
import datetime as dt
import hashlib
import json
import math
import random

from common import (
    CHANNEL_GROUP,
    DATA_START,
    DEEP_DIVE_PRODUCT,
    PERIOD_END,
    is_business_day,
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
import complaint_rules
import scale_v3
from personas import BUCKETS, ESCALATION_EMAILS, PERSONAS

rng = random.Random(SEED)
IST = dt.timezone(dt.timedelta(0))  # name kept from the copied pipeline: every time is held in UTC (SW-D03)
CET = dt.timedelta(hours=1)  # Europe/Stockholm in November, for the daytime profile only
NOW_DT = dt.datetime.fromisoformat(NOW)
START_DT = dt.datetime.fromisoformat(DATA_START)
N_CUSTOMERS = 5000
N_INTERACTIONS = 32000
N_BOT_CALLS = 500
# How much more often a listed customer is drawn for a kept row than their share of contacts would give.
LIST_OVERSAMPLE = {"multi": 6.0, "priority_a": 4.2, "priority_b": 2.6, "uhni": 1.0, "other": 1.0}
LIST_ORDER = ("multi", "priority_a", "priority_b", "uhni")  # a customer on several lists is weighted by the first

# Segments (SW-D07): Bas (standard), Premium, Private Banking. The sample over-represents the two upper tiers; scale_v3
# weights them back to about 6% of private customers.
SEGMENTS = [("Bas", 0.80), ("Premium", 0.13), ("Private Banking", 0.07)]
UPPER = ("Premium", "Private Banking")
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
# The copied channel ids are kept (the screens key on them): "whatsapp" carries Nina (and the Copilot assistant), and
# "chat" carries messages in the app and internet bank (SW-D04).
CHANNEL_LABEL = {
    "inbound_voice": "Inbound calls",
    "outbound_voice": "Outbound calls",
    "chat": "App and internet-bank messages",
    "email": "Email",
    "social_inbox": "Social inbox",
    "ivr_bot": "Phone menu",
    "branch": "Branch (kontor)",
    "whatsapp": "Nina",
}
CHANNEL_W = {
    "inbound_voice": 0.30,
    "outbound_voice": 0.04,
    "chat": 0.14,
    "email": 0.03,
    "social_inbox": 0.02,
    "ivr_bot": 0.06,
    "branch": 0.08,
    "whatsapp": 0.33,
}
# Internal volume mix by product (ASSUMPTION; scale_v3.PRODUCT_MIX fits the weights to the same shape). Payments and
# Swish and the account measures carry the most weight: they are the headline (SW-D09).
PRODUCT_W = {
    "payments_swish": 0.24,
    "everyday_accounts_app": 0.34,
    "cards": 0.14,
    "mortgages": 0.12,
    "savings_funds": 0.09,
    "consumer_loans": 0.07,
}
HOLD_P = {
    "payments_swish": 0.95,
    "everyday_accounts_app": 0.97,
    "cards": 0.6,
    "mortgages": 0.3,
    "savings_funds": 0.6,
    "consumer_loans": 0.12,
}
# The order the generator draws products in (NW-D97): fixed, the order of common.PRODUCTS, so moving a card on screen
# never redraws the contacts.
SEED_ORDER = list(PRODUCT_IDS)
# Hand-set theme mixes per product (ASSUMPTION): the internal contact mix is the bank's, so it does not follow public
# voice (NW-D83). Nina themes ride on every product.
NINA = {"nina_unresolved": 2, "nina_wrong_answer": 1, "nina_handoff_lost": 1.5, "nina_no_person": 1}
HAND_MIX = {
    "payments_swish": {"swish_payment_failures": 22, "account_freeze": 8, "manipulated_transfer": 14, "fraud_scam": 10,
                       "failed_txn_reversal": 8, "unauthorised_txn": 6, "phishing": 6, "international_payments": 4,
                       "complaint_handling": 9, **NINA, "nina_wrong_answer": 2},
    # SW-D16: the deep dive; the app update and account measures lead (the public headline).
    "everyday_accounts_app": {"account_freeze": 16, "identity_checks": 8, "app_login_biometrics": 10, "fees_charges_bank": 6,
                          "care_unreachable": 7, "complaint_handling": 8, "app_speed_crash": 9, "account_opening": 4,
                          "closure_requests": 3, "fair_treatment": 4, "branch_service": 4, "branch_closure": 3,
                          "statements_documents": 4, "app_usability": 4, "online_banking": 3, "new_app_release": 12,
                          "device_security_block": 3, "atm_debit_card": 2, "premium_service": 2, **NINA},
    "cards": {"unauthorised_txn": 16, "dispute_chargeback": 16, "card_fees_charges": 12, "card_limit": 10,
              "card_application": 10, "atm_debit_card": 8, "refund_delay": 8, "merchant_pos": 4, "card_eligibility_upgrade": 3,
              "complaint_handling": 9, "closure_requests": 0.3, **NINA},
    "mortgages": {"mortgage_rate": 28, "loan_processing": 18, "loan_servicing": 18, "loan_closure_documents": 10,
                  "complaint_handling": 10, "recovery_conduct": 6, "care_unreachable": 8, **NINA},
    "savings_funds": {"deposits_rates": 26, "investments_wealth": 18, "statements_documents": 10, "identity_checks": 8,
                      "fair_treatment": 8, "mis_selling": 6, "complaint_handling": 10, "care_unreachable": 8,
                      "closure_requests": 0.8, **NINA},
    "consumer_loans": {"loan_processing": 28, "loan_servicing": 24, "recovery_conduct": 12, "loan_closure_documents": 8,
                       "fees_charges_bank": 6, "complaint_handling": 10, "mis_selling": 6, **NINA},
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
        if is_business_day(out):  # weekends and Swedish public holidays skipped
            left -= 1
    return out


def deadline(created: dt.datetime, deliv: str) -> dt.datetime:
    d = DELIVERABLES[deliv]
    if d.get("calendar"):
        return created + dt.timedelta(days=d["tat_days"])
    if deliv == "failed_reversal":
        return created + dt.timedelta(days=d["tat_days"])
    return add_working_days(created, d["tat_days"])


def pick(weights: dict):
    keys = list(weights)
    return rng.choices(keys, weights=[weights[k] for k in keys])[0]


def masked(n: int) -> str:
    return f"XXXX{n:04d}"


# ------------------------------------------------------------------ public mix

def public_mix():
    """Theme mix per product: HAND_MIX. Theme labels come from the taxonomy, so every theme the seed uses has a label."""
    from taxonomy import THEMES

    products = load(OUT_APP / "products.json")
    # NW-D83: the internal layer reads the taxonomy only. Public theme figures never feed the internal contacts, so
    # loading the public pull does not change a single internal figure.
    themes = {t["id"]: t for t in THEMES}
    mix: dict[str, dict[str, int]] = {}
    for k, v in HAND_MIX.items():
        mix.setdefault(k, v)
    return mix, themes, products


# ------------------------------------------------------------------ customers

def build_customers():
    customers = []
    for i in range(N_CUSTOMERS):
        seg = pick(dict(SEGMENTS))
        held = [p for p in SEED_ORDER if rng.random() < HOLD_P[p]]
        if "everyday_accounts_app" not in held:
            held.append("everyday_accounts_app")
        cohorts = ["uhni"] if seg in UPPER else []
        customers.append(
            {
                "masked_id": masked(1000 + i),
                "segment": seg,
                "cohorts": cohorts,
                "products": sorted(held, key=SEED_ORDER.index),
                "rm_id": "Premium and Private Banking adviser" if seg in UPPER else None,  # a role, never an id
                "proxy_contacts": 0,
                "cohort_added_at": None,
                "cohort_added_by": None,
            }
        )
    # Lists (SW-D05): priority_a = customers in a vulnerable situation (the bank's flag), priority_b = recent
    # complainants (90 days), both drawn from every tier; multi = account-measure affected (frozen or restricted under
    # AML rules), drawn apart from the other lists so its weight is its own.
    pool = list(customers)
    rng.shuffle(pool)
    for c in pool[:500]:
        c["cohorts"].insert(0, "priority_a")
    for c in pool[500:620]:
        c["cohorts"].insert(0, "priority_b")
        # A recent complainant always has an owner: the complaints lead, unless an adviser already holds the relationship.
        c["rm_id"] = c["rm_id"] or "Complaints lead"
    measures = [c for c in pool[620:] if "uhni" not in c["cohorts"]][:220]
    for c in measures:
        c["cohorts"].insert(0, "multi")
        # About seven in ten have a named owner in the account-measure review team; the rest have none (Ask LisN:
        # "How many account-measure customers have no owner?"). From the masked id, so no random draw.
        if int(hashlib.sha1(f"owner:{c['masked_id']}".encode()).hexdigest(), 16) % 100 < 70:
            c["rm_id"] = c["rm_id"] or "Account-measure review team"
    for c in customers:
        if "uhni" in c["cohorts"]:
            c["proxy_contacts"] = 1 if rng.random() < 0.30 else 0
        elif "priority_a" in c["cohorts"]:
            c["proxy_contacts"] = 1 if rng.random() < 0.12 else 0  # a legal guardian (god man) or a family member
        if any(k in c["cohorts"] for k in ("priority_a", "priority_b", "multi")):
            # Most were on the list before the window; a few added this week, by the bank or on a LisN suggestion.
            r = rng.random()
            if r < 0.05:
                c["cohort_added_at"] = iso(dt.datetime(2026, 11, 10, 8, tzinfo=IST) + dt.timedelta(hours=rng.randint(0, 140)))
                c["cohort_added_by"] = "lisn_suggested_bank_confirmed" if rng.random() < 0.4 else "bank"
            else:
                c["cohort_added_at"] = "2026-04-01T00:00+00:00"
                c["cohort_added_by"] = "bank"
    return customers


# ------------------------------------------------------------------ interactions

def sample_created() -> dt.datetime:
    span = (NOW_DT - START_DT).total_seconds()
    # Mild upward drift and a daytime profile.
    while True:
        u = rng.random() ** 0.97
        d = START_DT + dt.timedelta(seconds=u * span)
        h = (d + CET).hour
        if h < 8 and rng.random() < 0.75:
            continue
        if (d + CET).weekday() == 6 and rng.random() < 0.4:
            continue
        return d


def resolution_hours(deliv: str, theme: str, cohort: bool, channel: str) -> float:
    d = DELIVERABLES[deliv]
    if deliv == "complaint_resolution":
        # Half are settled at the first contact within 3 days; the rest follow the 15-business-day reply standard (about
        # 21 calendar days) with a median of about 9 days and a thin tail past it (ASSUMPTION).
        if rng.random() < 0.50:
            return rng.uniform(2, 70)
        return 21 * 24 * math.exp(math.log(0.45) + 0.75 * rng.gauss(0, 1))
    tat_h = d["tat_days"] * 24 * (1.4 if not d.get("calendar") and deliv != "failed_reversal" else 1)
    median = 0.5
    sigma = 0.85
    # Themes where public voice says timelines break get a heavier tail.
    if theme in ("complaint_handling", "manipulated_transfer", "refund_delay", "account_freeze", "care_unreachable",
                 "nina_unresolved", "nina_wrong_answer", "nina_handoff_lost", "nina_no_person"):
        median, sigma = 0.72, 0.95
    if channel in ("chat", "ivr_bot"):
        median *= 0.8
    if channel == "whatsapp":  # Nina: a conversation is closed or handed on quickly
        median *= 0.45
    if cohort:
        median *= 0.75  # a little faster, not reliably so
    hours = tat_h * math.exp(math.log(median) + sigma * rng.gauss(0, 1))
    if channel == "whatsapp":
        # Nina: a conversation is closed or handed to a person within 40 hours, so open too long on Nina comes from
        # what follows the hand-off, not from Nina itself.
        hours = min(hours, 40.0)
    return hours


def high_impact_reasons(theme_row: dict, channel: str, sender: str) -> list[str]:
    reasons = []
    esc = (theme_row.get("share_escalation") or 0) / 100
    if rng.random() < esc * 0.35:
        reasons.append("regulator_named")
    if rng.random() < esc * 0.12:
        reasons.append("legal_language")
    if channel == "social_inbox" and rng.random() < 0.18:
        # "Public post with reach" is a public-data fact; no public source is loaded (HL-15), so it is never set (review
        # round 3, NW-D67). The draw stays so the seed's random sequence does not change.
        pass
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
    # The mortgage-offer standard is a mortgage standard; a consumer-loan redemption or settlement request is an
    # ordinary service request.
    if deliv == "loan_documents" and product != "mortgages":
        deliv = "service_request"
    is_cohort = any(k in cust["cohorts"] for k in LIST_ORDER)
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
            rec["status"] = "waiting_on_customer"  # not open with the bank, on every screen
    # High-priority mentions: whether the bank replied to the customer's public post. Its own fact, apart
    # from how the case was handled inside the bank, so no other figure moves. Set from the record id (no random
    # stream), at 62%: listed customers who go public are answered a little under two times in three.
    rec["mention_replied"] = None
    if rec["channel"] == "social_inbox":
        rec["mention_replied"] = int(hashlib.sha1(f"mention:{rec['id']}".encode()).hexdigest(), 16) % 100 < 62
    return rec


def build_interactions(customers, mix, themes):
    by_id = {c["masked_id"]: c for c in customers}
    weights = []
    for c in customers:
        w = 1.0
        if "uhni" in c["cohorts"]:
            w = 1.8
        if "priority_a" in c["cohorts"] or "priority_b" in c["cohorts"]:
            w *= 1.2
        if "multi" in c["cohorts"]:
            w *= 1.5  # account-measure customers contact the bank often
        # Bank scale (1 Oct, granularity): the kept sample holds more rows for listed customers, so each of their rows
        # stands for few bank-scale contacts (about 1 on the two small lists) and their small figures vary naturally
        # instead of moving in steps of one large weight. scale_v3 then fits the weights to the same anchors.
        w *= LIST_OVERSAMPLE[next((k for k in LIST_ORDER if k in c["cohorts"]), "other")]
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
        slots.append((cust, product, sample_created(), channel))
    by_product = collections.defaultdict(list)
    for sl in slots:
        by_product[sl[1]].append(sl)
    for product in SEED_ORDER:
        sls = by_product.get(product, [])
        quota = largest_remainder(len(sls), mix[product])
        themes_list = [th for th, n in quota.items() for _ in range(n)]
        rng.shuffle(themes_list)
        if "account_freeze" in mix[product]:
            # Account-measure customers hold most of the account-measure contacts: swap themes inside the product (the
            # quota stays exact). Deterministic, from the slot order.
            mine = [i for i, sl in enumerate(sls) if "multi" in sl[0]["cohorts"] and themes_list[i] != "account_freeze"]
            theirs = [i for i, sl in enumerate(sls) if "multi" not in sl[0]["cohorts"] and themes_list[i] == "account_freeze"]
            for i, j in zip(mine[: int(0.6 * len(mine))], theirs):
                themes_list[i], themes_list[j] = themes_list[j], themes_list[i]
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
    "Card blocked (fraud or account measure)": 0.12,
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
                "priority_cohort": any(k in c["cohorts"] for k in LIST_ORDER),
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
        "waiting_on_customer": sum(1 for r in rows if r["status"] == "waiting_on_customer"),
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


# Cohorts (SW-D05). Membership always comes from the bank's own lists and segments, never from public data. The ids stay
# (the screens key on them).
COHORTS = [
    ("priority_a", "Customers in a vulnerable situation", "Vulnerability flag in the bank's records"),
    ("priority_b", "Recent complainants (90 days)", "The bank's complaints register, last 90 days"),
    ("uhni", "Premium and Private Banking", "Premium and Private Banking relationship, from core banking"),
    ("multi", "Account-measure affected", "Accounts frozen or restricted under the AML rules, from the bank's records"),
]
LISTED = ("priority_a", "priority_b", "uhni", "multi")
CORA_THEMES = ["nina_unresolved", "nina_wrong_answer", "nina_handoff_lost", "nina_no_person"]  # name kept: Nina themes
HI_LABEL = {
    "regulator_named": "ARN or Finansinspektionen named",
    "legal_language": "Legal language or a lawyer named",
    "public_reach": "Public post with reach",
    "official_domain": "Sent from an authority domain",
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
        # Full weeks only (Mon 26 Oct to Sun 15 Nov): partial first and last weeks would read as false dips. The change
        # is the last full week against the one before; no week-on-week trend before 29 Oct (SW-D03).
        wk = sorted((w, v) for w, v in weeks.items() if "2026-10-26" <= w <= "2026-11-09")
        prev3 = sum(v for w, v in wk if w == "2026-11-02")
        last3 = sum(v for w, v in wk if w == "2026-11-09")
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
                # Members with no named owner (Ask LisN: "How many account-measure customers have no owner?").
                "without_owner": sum(1 for m in members if not m["rm_id"]),
                "interactions": len(rows),
                "customers_with_open_issue": len(affected),
                "open": len(open_rows),
                "waiting_on_customer": sum(1 for r in rows if r["status"] == "waiting_on_customer"),
                "open_over_5h": len(o5),
                "open_over_24h": len(o24),
                "open_too_long": sum(1 for r in open_rows if r["breached"]),
                "negative": len(neg),
                "negative_by_channel": {ch: sum(1 for r in neg if r["channel"] == ch) for ch in CHANNELS},
                "products_affected": dict(collections.Counter(r["product"] for r in open_rows)),
                "rm_should_know": len(rm_should),
                "rm_notified_today": len(rm_did),
                "added_this_week": sum(1 for m in members if m["cohort_added_at"] and m["cohort_added_at"] >= "2026-11-10"),
                "added_this_week_by_lisn": sum(
                    1
                    for m in members
                    if m["cohort_added_at"] and m["cohort_added_at"] >= "2026-11-10" and m["cohort_added_by"] == "lisn_suggested_bank_confirmed"
                ),
            }
        )

    # High-impact complaints: a property of the complaint, never of the person.
    hi = [r for r in inter if r["high_impact"]]
    hi_reason = collections.Counter(x for r in hi for x in r["high_impact"])
    high_impact = {
        "total": len(hi),
        "open": sum(1 for r in hi if r["status"] == "open"),
        "waiting_on_customer": sum(1 for r in hi if r["status"] == "waiting_on_customer"),
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
        "priority_among_them": sum(1 for m in multi_neg if any(k in cust[m]["cohorts"] for k in LIST_ORDER)),
        "pairs": [
            {"pair": f"{PRODUCT_LABEL[a]} + {PRODUCT_LABEL[b]}", "customers": n}
            for (a, b), n in collections.Counter(
                tuple(sorted({r["product"] for r in rs if r["sentiment"] == "negative"}, key=SEED_ORDER.index)[:2])
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
                "redress": d["compensation"],
                "total": len(rows),
                **deliverable_stats(rows),
                "open_too_long": sum(1 for r in rows if r["status"] == "open" and r["breached"]),
                "themes": [k for k, v in THEME_DELIVERABLE.items() if v == d_id],
                "products": per_product,
            }
        )

    # Deep-dive module (Payments and Swish; key "cards_issues" kept): issue list with internal counts beside the public ones.
    cards_rows = []
    cards_inter = by_prod[DEEP_DIVE_PRODUCT]
    pub_cards = next((r for r in products_pub.get("rows", []) if r["id"] == DEEP_DIVE_PRODUCT), {"issues": []})
    pub_by_theme = {i["id"]: i for i in pub_cards.get("issues", [])}
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

    # Nina module (key "cora" kept): the Nina themes inside the bank, from the same sample.
    cora_rs = [r for r in inter if r["theme"] in CORA_THEMES]
    cora = {
        "dials": dial(cora_rs),
        "rows": [
            {"id": t, "label": theme_label.get(t, t), **dial([r for r in cora_rs if r["theme"] == t])}
            for t in CORA_THEMES
        ],
        "via_cora": sum(1 for r in cora_rs if r["channel"] == "whatsapp"),
        "rule": "Contacts tagged to a Nina theme, on any channel and for any product.",
    }

    # Channel mix and inside dials.
    overall = dial(inter)
    channel_rows = []
    for ch in CHANNELS:
        rs = [r for r in inter if r["channel"] == ch]
        channel_rows.append({"channel": ch, "label": CHANNEL_LABEL[ch], **dial(rs), "negative": sum(1 for r in rs if r["sentiment"] == "negative")})

    return {
        "provenance": "internal",
        "label": "Internal",
        "note": (
            f"Sample of {len(customers):,} customers and {len(inter):,} contacts, 22 October to 17 November. Priority lists "
            "are over-sampled and weighted back to bank scale."
        ),
        "now": NOW,
        "window": {"start": "2026-10-22", "end": "2026-11-17"},
        "sample": {"customers": len(customers), "interactions": len(inter), "bot_calls": len(bot_calls)},
        "dials": overall,
        "products": product_rows,
        "channels": channel_rows,
        "cora": cora,
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
            "rule": "An owner alert is due when a customer on a priority list or in Premium and Private Banking has a negative signal, a high-impact complaint, an issue open over 5 hours, or an unresolved phone-menu call.",
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
            "team": "Social media team (CX)" if step.get("channel") == "social_inbox" else PRODUCT_LABEL[step["product"]],
            "outcome": step.get("outcome"),
            "theme": step["theme"],
            "theme_label": theme_label.get(step["theme"], step["theme"]),
            "summary": step["summary"],
            "flag_set": step.get("flag_set", False),
            "flag_follows": step.get("flag_follows", False),
        }
        if step.get("event"):
            out.append({**base, "event": True, "id": None, "channel": "system", "channel_label": "Bank system", "sender": None, "sentiment": None, "status": None, "high_impact": []})
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
    "payments": "Payments and Swish",
    "retail": "Everyday banking",
    "loans": "Lending",
    "product": "Savings and funds",
}


def rm_rules(customers, inter, bot_calls):
    cust = {c["masked_id"]: c for c in customers}
    should = set()
    for r in inter:
        c = cust[r["masked_id"]]
        if not c["rm_id"] or not any(k in c["cohorts"] for k in LIST_ORDER):
            continue
        age = hours_between(r["created_at"], NOW_DT)
        if r["status"] == "open" and (r["sentiment"] == "negative" or r["high_impact"] or age > 5):
            should.add(r["masked_id"])
    for b in bot_calls:
        c = cust[b["masked_id"]]
        if c["rm_id"] and not b["resolved"] and any(k in c["cohorts"] for k in LIST_ORDER):
            if hours_between(b["created_at"], NOW_DT) < 72:
                should.add(b["masked_id"])
    # Today, owners hear about roughly one in five of these (manual, ASSUMPTION). A hand-written persona's story decides
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
        "hand_set_mix": list(HAND_MIX),
    }


# ------------------------------------------------------------------ screen blocks (review step 4: one internal dataset)
# Everything the deliverables, satisfaction and MD-mail blocks show comes from these same records. The extra fields are
# drawn from a second random stream so every existing field keeps its value.
rng2 = random.Random(SEED + 7)
ESCALATION_RUNG = {"grievance": 2, "md_office": 3, "io": 4, "rbi_ombudsman": 5}
DISPUTE_DRIVERS = [
    ("Merchant response pending", 0.30),
    ("Chargeback evidence incomplete", 0.24),
    ("Network time limit", 0.18),
    ("Manual re-work after reopen", 0.16),
    ("Customer not updated", 0.12),
]
SEGMENT_LABEL = {"Bas": "Bas", "Premium": "Premium", "Private Banking": "Private Banking"}
TIERS = ("Bas", "Premium", "Private Banking")
AGE_BANDS = [(30, "Up to 30 days"), (45, "31–45 days"), (60, "46–60 days"), (90, "61–90 days"), (10**6, "Over 90 days")]


def age_days(r) -> float:
    end = dt.datetime.fromisoformat(r["closed_at"]) if r.get("closed_at") and r["status"] == "closed" else NOW_DT
    return (end - dt.datetime.fromisoformat(r["created_at"])).total_seconds() / 86400


def enrich(inter):
    """Record-level fields for the screen blocks. Rules, in order:
    repeat: the same customer raised the same theme in the previous 30 days.
    escalation: a negative issue contact that is breached, repeated or high-impact may become a complaint (30%); written
      complaints (email) can climb further: the complaints team (35% of those), a rejecting decision (35% of those),
      ARN (30% of those). Each rung counts every contact that reached at least that rung. main() then resets the top two
      rungs from the complaint rules, so they come from the one register.
    retained: a closed closure request where the customer stayed (27%).
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
        "rule": "Written complaints (email) escalated to the complaints team, from the same contacts.",
    }

    # Satisfaction: tiers, journey stages, retention watchlist.
    tiers = []
    for sg in TIERS:
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
    # Switching intent by stage: the stage of the customer's last negative contact before the closure request.
    history: dict[str, list] = collections.defaultdict(list)
    for r in inter:
        history[r["masked_id"]].append(r)
    closure_stage = collections.Counter()
    for c in closure_reqs:
        before = [
            r for r in history[c["masked_id"]]
            if r["created_at"] < c["created_at"] and r["sentiment"] == "negative"
            and JOURNEY_STAGE.get(r["theme"], "Everyday banking") != "Switch or close"
        ]
        closure_stage[JOURNEY_STAGE.get(before[-1]["theme"], "Everyday banking") if before else "Switch or close"] += 1
    stages = []
    for st in JOURNEY_ORDER:
        rs = [r for r in inter if JOURNEY_STAGE.get(r["theme"], "Everyday banking") == st]
        n = len(rs)
        stages.append({
            "stage": st,
            "interactions": n,
            "negative_share": round(100 * sum(1 for r in rs if r["sentiment"] == "negative") / n, 1) if n else 0,
            "repeat_contact_share": round(100 * sum(1 for r in rs if r["repeat"]) / n, 1) if n else 0,
            "closure_intent": closure_stage[st],
        })
    watch = []
    for sg in TIERS:
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
            "rule": "Switching intent: closure requests, placed at the stage of the customer's last negative contact before the request.",
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
    for rung_id, rung in zip(("grievance", "md_office", "io", "rbi_ombudsman"), complaint_rules.LADDER_RUNGS):
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
            {"stage": "Credited within the standard", "count": sum(1 for r in disputes if r["credited"] and not r["breached"])},
        ],
    }
    return {
        "routing": routing,
        "md_mail": md_mail,
        "satisfaction": satisfaction,
        "deliverables_detail": {
            "ageing": ageing_rows,
            "ladder": ladder,
            "ladder_rule": "Voice and Repeat count the bank's own contacts in the window (Repeat: the same customer on the same theme within 30 days). Complaint and the rungs above are flows in the window from the complaint register the ARN watch reads: complaints received, passed to the complaints team when not settled within 3 business days, final decisions issued, filings with ARN.",
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
        c["cohort_added_at"] = p.get("cohort_added_at", "2026-04-01T00:00+00:00")
        c["cohort_added_by"] = p.get("cohort_added_by", "bank")
    inter = build_interactions(customers, mix, themes)
    inter.sort(key=lambda r: r["created_at"])
    written_delays(inter)
    enrich(inter)
    # One register: a contact is at the "io" rung exactly when it is a complaint the bank decided to reject in part or
    # in full (complaint_rules.decide), and at the "rbi_ombudsman" rung exactly when the customer filed with ARN. No
    # other contact sits at those rungs, so the ladder and the ARN watch come from the one register.
    # ARN filers (complaint_rules.choose_filers): as many as the ARN pace needs at the sample's mean complaint weight.
    n_cmp = sum(1 for r in inter if complaint_rules.is_complaint(r))
    n_filers = max(1, round(scale_v3.ESCALATION["rbi_ombudsman"] / (scale_v3.COMPLAINTS / max(n_cmp, 1))))
    filers = complaint_rules.choose_filers(inter, n_filers)
    for r in inter:
        r["arn_filer"] = r["id"] in filers
    for r in inter:
        d = complaint_rules.decide(r) if complaint_rules.is_complaint(r) else None
        if d and complaint_rules.filed_with_ombudsman(r, d):
            r["escalation"] = "rbi_ombudsman"  # filed with ARN (field value kept)
        elif d and d["decision_at"] is not None:
            r["escalation"] = "io"
        elif r["escalation"] in ("io", "rbi_ombudsman"):
            r["escalation"] = "md_office"
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

    # Bank scale: a weight on every kept row and customer (scale_v3.py). The aggregates above stay sample counts: they
    # feed the drill-down and customer pages.
    scale = scale_v3.apply(customers, inter)
    # High-priority mentions: the public reply is spread evenly through time at bank scale (about 62% answered), so the
    # response rate is steady whichever period is chosen, instead of swinging with a few heavy rows.
    listed_ids = {c["masked_id"] for c in customers if any(k in c["cohorts"] for k in LIST_ORDER)}
    done = total = 0
    for r in inter:  # in time order
        if r["channel"] == "social_inbox" and r["masked_id"] in listed_ids:
            total += r["w"]
            r["mention_replied"] = done + r["w"] <= 0.62 * total + 0.5 * r["w"]
            done += r["w"] if r["mention_replied"] else 0

    SEED_V3.mkdir(parents=True, exist_ok=True)
    dump(scale, SEED_V3 / "scale.json")
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
    # The escalation ladder at bank scale. The ladder and the tier table read the contacts the full-window period reads
    # (the six channel groups, phone menu excluded, received from 22 October to the freeze), so every view shows one
    # window volume. The complaint rungs are written by seed_complaints_v3.py from the register.
    win_a, win_b = dt.datetime.fromisoformat(DATA_START), dt.datetime.fromisoformat(PERIOD_END)
    win = [r for r in inter if r["channel"] in CHANNEL_GROUP and win_a <= dt.datetime.fromisoformat(r["created_at"]) < win_b]
    lb = [{"rung": "Voice", "count": sum(r["w"] for r in win)},
          {"rung": "Repeat", "count": sum(r["w"] for r in win if r["repeat"])}]
    for rung_id, rung in zip(("grievance", "md_office", "io", "rbi_ombudsman"), complaint_rules.LADDER_RUNGS):
        lb.append({"rung": rung, "count": sum(r["w"] for r in win if reached(r, rung_id))})
    agg["deliverables_detail"]["ladder_bank"] = lb
    # Segments at bank scale: the sample over-represents Premium and Private Banking, so the table reads the weighted
    # contacts, in the bank's segment mix.
    seg_of = {c["masked_id"]: c["segment"] for c in customers}
    cw_of = {c["masked_id"]: c.get("cw", 1) for c in customers}
    tb = []
    for sg in TIERS:
        rs = [r for r in win if seg_of[r["masked_id"]] == sg]
        n = sum(r["w"] for r in rs)
        pos = sum(r["w"] for r in rs if r["sentiment"] == "positive")
        neg_ = sum(r["w"] for r in rs if r["sentiment"] == "negative")
        tb.append({"tier": SEGMENT_LABEL[sg], "interactions": n, "positive": pos, "neutral": n - pos - neg_, "negative": neg_,
                   "share_positive": round(100 * pos / n, 1) if n else 0, "share_negative": round(100 * neg_ / n, 1) if n else 0,
                   "customers_affected": round(sum(cw_of[m] for m in {r["masked_id"] for r in rs if r["sentiment"] == "negative"}))})
    agg["satisfaction"]["tiers_bank"] = tb
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
