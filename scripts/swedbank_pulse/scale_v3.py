"""Bank scale for the internal layer (SW-D09; figures and sources in docs/swedbank/public_anchors.md and
docs/swedbank/volume_validation.md, every one tagged ANCHOR, DERIVED or ASSUMPTION there, never on screen).

The seed keeps a sample of rows (about 32,000 contacts, 5,000 customers). Each kept row carries a weight `w` (how many
bank-scale contacts it stands for) and each customer a weight `cw` (how many contacting customers it stands for). Every
period figure is then a weighted sum, so the numbers sit at Swedbank Swedish Banking's scale (private customers),
reconcile exactly (weights are whole numbers) and still recompute for any period. The rows themselves are what the
drill-down and customer pages show.

Targets are for the full window, 22 Oct 00:00 CEST to the freeze 17 Nov 07:45 CET (WINDOW_DAYS).
Deterministic: weights come from iterative proportional fitting and are rounded with a hash of the row id.
"""

from __future__ import annotations

import collections
import datetime as dt
import hashlib

from common import DATA_START, PERIOD_END

# ---------------------------------------------------------------- anchors and assumptions (yearly)
PRIVATE_CUSTOMERS = 3_800_000  # ANCHOR: Swedbank Annual Report 2025, Swedish Banking private customers
CONTACTS_PER_YEAR = 5_000_000  # ASSUMPTION: 3.6m interactions a year (Nuance, 2016) grown to about 5m with Nina and the app
KO_CASES_2025 = 7_500  # ANCHOR: Konsumenternas Bank- och finansbyrå, about 7,500 cases in 2025 (all banks)
INTERNAL_PER_EXTERNAL = 40  # ASSUMPTION: internal complaints per external guidance case (the tip of the iceberg)
COMPLAINTS_PER_YEAR = KO_CASES_2025 * INTERNAL_PER_EXTERNAL  # DERIVED: 300,000
ARN_FILINGS_PER_WEEK = 10  # ASSUMPTION: ARN filings by Swedbank private customers (about 520 a year); confirm with the bank

# ---------------------------------------------------------------- targets (full window)
WINDOW_DAYS = (dt.datetime.fromisoformat(PERIOD_END) - dt.datetime.fromisoformat(DATA_START)).total_seconds() / 86400
TOTAL_CONTACTS = int(round(CONTACTS_PER_YEAR * WINDOW_DAYS / 365, -3))  # DERIVED: about 361,000
CHANNEL_MIX = {  # Nina 35% ASSUMPTION (brief); the rest ASSUMPTION ("whatsapp" carries Nina, "chat" app and internet-bank messages)
    "calls": 0.38, "whatsapp": 0.35, "chat": 0.15, "emails": 0.02, "branch": 0.09, "social": 0.01,
}
COMPLAINTS = int(round(COMPLAINTS_PER_YEAR * WINDOW_DAYS / 365, -2))  # DERIVED: about 21,700
COMPLAINT_MIX = {  # ASSUMPTION (SW-D16): accounts, the app and account measures lead, then payments and fraud
    "everyday_accounts_app": 0.34, "payments_swish": 0.28, "cards": 0.14, "mortgages": 0.10, "savings_funds": 0.08,
    "consumer_loans": 0.06,
}
# Share of each product's contacts that is negative: about 13% overall, ASSUMPTION. Complaints are mostly negative.
NEGATIVE_SHARE = {
    "everyday_accounts_app": 0.16, "payments_swish": 0.14, "cards": 0.13,
    "mortgages": 0.12, "savings_funds": 0.11, "consumer_loans": 0.13,
}
NEGATIVE_OF_COMPLAINTS = 0.85
# Product mix of all contacts (ASSUMPTION), held fixed so the negative share can be set product by product.
PRODUCT_MIX = {
    "payments_swish": 0.24, "everyday_accounts_app": 0.34, "cards": 0.14,
    "mortgages": 0.12, "savings_funds": 0.09, "consumer_loans": 0.07,
}
# Contact-level escalation tags in the window. "rbi_ombudsman" (field name kept) = filed with ARN; "md_office" = appeal
# to the Kundombudsman. Both ASSUMPTION: ARN at ARN_FILINGS_PER_WEEK; Kundombudsman appeals about 3% of complaints.
ESCALATION = {"rbi_ombudsman": round(ARN_FILINGS_PER_WEEK * WINDOW_DAYS / 7), "md_office": round(0.03 * COMPLAINTS)}
# Cohort lists (ids kept, the screens key on them): priority_a customers in a vulnerable situation (10%, ASSUMPTION);
# priority_b recent complainants, 90 days (DERIVED: a quarter's complaints); uhni Premium and Private Banking (6%,
# ASSUMPTION); multi account-measure affected, frozen or restricted under AML rules (1.5%, ASSUMPTION). in_contact is
# the share of the list that contacts the bank in the window (ASSUMPTION).
LISTS = {
    "priority_a": {"size": round(0.10 * PRIVATE_CUSTOMERS), "in_contact": 0.05},
    "priority_b": {"size": int(round(COMPLAINTS_PER_YEAR * 90 / 365, -3)), "in_contact": 0.25},
    "uhni": {"size": round(0.06 * PRIVATE_CUSTOMERS), "in_contact": 0.05},
    "multi": {"size": round(0.015 * PRIVATE_CUSTOMERS), "in_contact": 0.20},
}
CONTACTS_PER_CONTACTING = 2.5  # ASSUMPTION
CONTACTING_CUSTOMERS = round(TOTAL_CONTACTS / CONTACTS_PER_CONTACTING)  # DERIVED
# A customer on several lists is weighted by the first of these. Account-measure customers are drawn apart from the
# other lists in the sample, so their stratum is their own.
PRIMARY = ("multi", "priority_a", "priority_b", "uhni")

CHANNEL_GROUP = {"email": "emails", "inbound_voice": "calls", "outbound_voice": "calls", "chat": "chat",
                 "whatsapp": "whatsapp", "social_inbox": "social", "branch": "branch"}


def _frac(key: str) -> float:
    return int(hashlib.sha1(key.encode()).hexdigest(), 16) % 10_000 / 10_000


def _whole(x: float, key: str) -> int:
    """x rounded up or down by a hash of the key, so the totals keep their expected value. At least 1."""
    base = int(x)
    return max(1, base + (1 if _frac(key) < x - base else 0))


def stratum(c: dict) -> str:
    return next((k for k in PRIMARY if k in c["cohorts"]), "other")


def is_complaint(r: dict) -> bool:
    return r["deliverable"] == "complaint_resolution" and r["channel"] != "ivr_bot"


def _kind_targets() -> dict:
    out = {}
    for p, share in PRODUCT_MIX.items():
        total = share * TOTAL_CONTACTS / sum(PRODUCT_MIX.values())
        cmp = COMPLAINT_MIX[p] * COMPLAINTS
        neg = NEGATIVE_SHARE[p] * total
        cmp_neg = NEGATIVE_OF_COMPLAINTS * cmp
        out[(p, True, True)] = cmp_neg
        out[(p, True, False)] = cmp - cmp_neg
        out[(p, False, True)] = neg - cmp_neg
        out[(p, False, False)] = total - cmp - (neg - cmp_neg)
    assert all(v > 0 for v in out.values()), out
    return out


def apply(customers: list[dict], inter: list[dict]) -> dict:
    """Sets r["w"] on every contact and c["cw"] on every customer; returns the scale block (targets and what was hit)."""
    cust = {c["masked_id"]: c for c in customers}
    rows = [r for r in inter if r["channel"] in CHANNEL_GROUP]
    strat = {r["id"]: stratum(cust[r["masked_id"]]) for r in rows}

    # --- contact targets by stratum. A list's contacts are every row of its members, so the Premium and Private
    # Banking stratum's own target is the list target less what members on the smaller lists already bring.
    n_rows = collections.Counter(strat.values())
    t_list = {k: v["size"] * v["in_contact"] * CONTACTS_PER_CONTACTING for k, v in LISTS.items()}
    t_strat = {k: t_list[k] for k in ("multi", "priority_a", "priority_b")}
    overlap = 0.0
    for k in ("multi", "priority_a", "priority_b"):
        on_uhni = sum(1 for r in rows if strat[r["id"]] == k and "uhni" in cust[r["masked_id"]]["cohorts"])
        overlap += on_uhni * t_strat[k] / max(n_rows[k], 1)
    t_strat["uhni"] = t_list["uhni"] - overlap
    t_strat["other"] = TOTAL_CONTACTS - sum(t_strat.values())

    # Escalation margin. ARN filings follow the complaint mix by product, over the products that have such a row in
    # the sample.
    group = lambda r: "loans" if r["product"] in ("consumer_loans", "mortgages") else r["product"]  # noqa: E731
    esc_key = lambda r: (("rbi", group(r)) if r.get("escalation") == "rbi_ombudsman"  # noqa: E731
                         else r["escalation"] if r.get("escalation") in ESCALATION else "none")
    mix = collections.Counter()
    for k, v in COMPLAINT_MIX.items():
        mix["loans" if k in ("consumer_loans", "mortgages") else k] += v
    present = {group(r) for r in rows if r.get("escalation") == "rbi_ombudsman"}
    share = sum(mix[g] for g in present) or 1
    esc_targets = {("rbi", g): ESCALATION["rbi_ombudsman"] * mix[g] / share for g in present}
    esc_targets["md_office"] = ESCALATION["md_office"]
    esc_targets["none"] = TOTAL_CONTACTS - sum(esc_targets.values())
    dims = {
        "stratum": (lambda r: strat[r["id"]], t_strat),
        "channel": (lambda r: CHANNEL_GROUP[r["channel"]], {k: v * TOTAL_CONTACTS for k, v in CHANNEL_MIX.items()}),
        # One margin for product x complaint x negative, so each product keeps its share of contacts, its complaints
        # and its negative share at once.
        "kind": (lambda r: (r["product"], is_complaint(r), r["sentiment"] == "negative"), _kind_targets()),
        "escalation": (esc_key, esc_targets),
    }
    keyed = [([key(r) for r in rows], targets) for key, targets in dims.values()]
    # Start each row between 0.6 and 1.4 times the average (by a hash of its id). The fitting below keeps that spread
    # inside every cell, so rows of the same kind do not all carry one weight and small figures do not move in steps.
    xs = [TOTAL_CONTACTS / len(rows) * (0.6 + 0.8 * _frac("spread:" + r["id"])) for r in rows]
    for _ in range(80):  # iterative proportional fitting over the four margins
        for keys, targets in keyed:
            tot = collections.defaultdict(float)
            for k, v in zip(keys, xs):
                tot[k] += v
            xs = [v * targets[k] / tot[k] for k, v in zip(keys, xs)]
    x = {r["id"]: v for r, v in zip(rows, xs)}
    for r in inter:
        if r["channel"] in CHANNEL_GROUP:
            r["w"] = _whole(x[r["id"]], "w:" + r["id"])
        else:  # IVR bot calls: outside the views; weighted like an average contact so the older totals stay coherent
            r["w"] = round(TOTAL_CONTACTS / len(rows))

    # --- customer weights: how many contacting customers each sample customer stands for
    in_sample = {r["masked_id"] for r in rows}
    members = collections.defaultdict(list)
    for c in customers:
        if c["masked_id"] in in_sample:
            members[stratum(c)].append(c)
    cw = {}
    for k in ("multi", "priority_a", "priority_b"):
        cw[k] = LISTS[k]["size"] * LISTS[k]["in_contact"] / max(len(members[k]), 1)
    on_small = sum(cw[stratum(c)] for k in ("multi", "priority_a", "priority_b") for c in members[k] if "uhni" in c["cohorts"])
    cw["uhni"] = (LISTS["uhni"]["size"] * LISTS["uhni"]["in_contact"] - on_small) / max(len(members["uhni"]), 1)
    listed = sum(cw[k] * len(members[k]) for k in PRIMARY)
    cw["other"] = (CONTACTING_CUSTOMERS - listed) / max(len(members["other"]), 1)
    # Sample customers do not all stand for the same number of customers: each gets between half and one and a half
    # times its stratum's average (by a hash of its id), rescaled so the stratum still adds up. Customer counts then
    # vary naturally instead of moving in steps of one weight.
    for k, cs in members.items():
        raw = {c["masked_id"]: cw[k] * (0.5 + _frac("spread:" + c["masked_id"])) for c in cs}
        fix = cw[k] * len(cs) / max(sum(raw.values()), 1e-9)
        for c in cs:
            c["cw"] = _whole(raw[c["masked_id"]] * fix, "cw:" + c["masked_id"])
    for c in customers:
        c.setdefault("cw", 1)  # no contact in the sample: stands for no contacting customer beyond itself

    # --- list sizes: the four lists are declared (LISTS).
    sizes = {k: v["size"] for k, v in LISTS.items()}
    return {
        "note": "Each kept row stands for w bank-scale contacts; each customer for cw contacting customers.",
        "sample": {"rows": len(inter), "customers": len(customers)},
        "targets": {
            "total_contacts": TOTAL_CONTACTS, "channel_mix": CHANNEL_MIX, "complaints": COMPLAINTS,
            "product_mix": PRODUCT_MIX, "negative_share": NEGATIVE_SHARE, "negative_of_complaints": NEGATIVE_OF_COMPLAINTS,
            "complaint_mix": COMPLAINT_MIX, "escalation": ESCALATION, "lists": LISTS,
            "contacts_per_contacting_customer": CONTACTS_PER_CONTACTING, "contacting_customers": CONTACTING_CUSTOMERS,
            "private_customers": PRIVATE_CUSTOMERS, "window_days": round(WINDOW_DAYS, 2),
            "complaints_per_year": COMPLAINTS_PER_YEAR, "contacts_per_year": CONTACTS_PER_YEAR,
            "arn_filings_per_week": ARN_FILINGS_PER_WEEK,
        },
        "list_sizes": sizes,
    }
