"""Bank scale for the internal layer (docs/demo-rebuild/public_anchors_volumes.md, section 6, option 1).

The seed keeps a sample of rows (about 32,000 contacts, 5,000 customers). Storing millions of rows is not needed: each
kept row carries a weight `w` (how many bank-scale contacts it stands for) and each customer a weight `cw` (how many
contacting customers it stands for). Every period figure is then a weighted sum, so the numbers sit at HDFC Bank's
scale, reconcile exactly (weights are whole numbers) and still recompute for any period. The rows themselves are what
the drill-down and customer pages show, labelled "sample rows".

Targets are for the 13-week full window. Each is tagged in the anchors file: ANCHOR, DERIVED or ASSUMPTION.
Deterministic: weights come from iterative proportional fitting and are rounded with a hash of the row id.
"""

from __future__ import annotations

import collections
import hashlib

# ---------------------------------------------------------------- targets (full window)
TOTAL_CONTACTS = 9_000_000  # ASSUMPTION: 20m customers x 1.6 contacts a year x 103/365 (docs/natwest/public_anchors.md)
CHANNEL_MIX = {  # ASSUMPTION, on the views' channel groups ("whatsapp" carries Cora, "chat" carries app chat)
    "calls": 0.44, "whatsapp": 0.30, "chat": 0.09, "emails": 0.06, "branch": 0.10, "social": 0.01,
}
COMPLAINTS = 49_200  # DERIVED: 86,498 complaints in H1 2026 (181 days) x 103 days of the window
COMPLAINT_MIX = {  # ASSUMPTION until the research pack gives the return's per-product shape
    "current_accounts": 0.30, "payments_fraud": 0.20, "cards": 0.17, "mortgages": 0.10, "savings": 0.07,
    "personal_loans": 0.06, "overdrafts": 0.05, "digital": 0.05,
}
# Share of each product's contacts that is negative: about 12% overall (HL-19), ASSUMPTION.
# Complaints are mostly negative; queries and requests mostly are not.
NEGATIVE_SHARE = {
    "cards": 0.15, "personal_loans": 0.16, "mortgages": 0.15, "overdrafts": 0.15,
    "payments_fraud": 0.11, "savings": 0.11, "current_accounts": 0.095, "digital": 0.09,
}
NEGATIVE_OF_COMPLAINTS = 0.85
# Product mix of all contacts: the sample's own mix, held fixed so the negative share can be set product by product.
PRODUCT_MIX = {
    "current_accounts": 0.28, "cards": 0.18, "digital": 0.14, "payments_fraud": 0.14,
    "mortgages": 0.10, "savings": 0.06, "personal_loans": 0.06, "overdrafts": 0.04,
}
# Referrals to the Financial Ombudsman Service and escalations to the Head of CX in the window. ASSUMPTION: about 5%
# of complaints referred; no anchor until the research pack.
ESCALATION = {"rbi_ombudsman": 2_500, "md_office": 3_000}
# NatWest lists (ids kept): priority_a financially vulnerable, priority_b recent complainants (90 days), uhni Premier
# and Private. Sizes: priority_b DERIVED from the H1 return (about 43,000 complaints a quarter); the others ASSUMPTION.
LISTS = {
    "priority_a": {"size": 1_200_000, "in_contact": 0.30},
    "priority_b": {"size": 43_000, "in_contact": 0.60},
    "uhni": {"size": 800_000, "in_contact": 0.25},
}
CONTACTS_PER_CONTACTING = 2.5
CONTACTING_CUSTOMERS = 3_600_000  # ASSUMPTION: 9m contacts at 2.5 each
PRIMARY = ("priority_a", "priority_b", "uhni")  # a customer on several lists is weighted by the first of these

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

    # --- contact targets by stratum. A list's contacts are every row of its members, so the Ultra HNI stratum's own
    # target is the list target less what members on the two small lists already bring.
    n_rows = collections.Counter(strat.values())
    t_list = {k: v["size"] * v["in_contact"] * CONTACTS_PER_CONTACTING for k, v in LISTS.items()}
    t_strat = {"priority_a": t_list["priority_a"], "priority_b": t_list["priority_b"]}
    overlap = 0.0
    for k in ("priority_a", "priority_b"):
        on_uhni = sum(1 for r in rows if strat[r["id"]] == k and "uhni" in cust[r["masked_id"]]["cohorts"])
        overlap += on_uhni * t_strat[k] / n_rows[k]
    t_strat["uhni"] = t_list["uhni"] - overlap
    t_strat["other"] = TOTAL_CONTACTS - sum(t_strat.values())

    # Escalation margin. RBI Ombudsman complaints follow the complaint mix by product (loans lead, then cards: O4),
    # over the products that have such a row in the sample.
    group = lambda r: "loans" if r["product"] in ("personal_loans", "mortgages") else r["product"]  # noqa: E731
    esc_key = lambda r: (("rbi", group(r)) if r.get("escalation") == "rbi_ombudsman"  # noqa: E731
                         else r["escalation"] if r.get("escalation") in ESCALATION else "none")
    mix = collections.Counter()
    for k, v in COMPLAINT_MIX.items():
        mix["loans" if k in ("personal_loans", "mortgages") else k] += v
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
    for k in ("priority_a", "priority_b"):
        cw[k] = LISTS[k]["size"] * LISTS[k]["in_contact"] / max(len(members[k]), 1)
    on_small = sum(cw[stratum(c)] for k in ("priority_a", "priority_b") for c in members[k] if "uhni" in c["cohorts"])
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

    # --- list sizes. The three lists are declared. "Multiple relationships" is sized from its own members: each
    # contacting member stands for 1 / (share in contact) customers on the list.
    share = {k: v["in_contact"] for k, v in LISTS.items()}
    multi = [c for c in customers if "multi" in c["cohorts"]]
    multi_size = round(sum(c["cw"] / share[stratum(c)] for c in multi if stratum(c) in share), -2)
    sizes = {**{k: v["size"] for k, v in LISTS.items()}, "multi": int(multi_size)}
    return {
        "note": "Internal · illustrative. Each kept row stands for w bank-scale contacts; each customer for cw contacting customers.",
        "sample": {"rows": len(inter), "customers": len(customers)},
        "targets": {
            "total_contacts": TOTAL_CONTACTS, "channel_mix": CHANNEL_MIX, "complaints": COMPLAINTS,
            "product_mix": PRODUCT_MIX, "negative_share": NEGATIVE_SHARE, "negative_of_complaints": NEGATIVE_OF_COMPLAINTS,
            "complaint_mix": COMPLAINT_MIX, "escalation": ESCALATION, "lists": LISTS,
            "contacts_per_contacting_customer": CONTACTS_PER_CONTACTING, "contacting_customers": CONTACTING_CUSTOMERS,
        },
        "list_sizes": sizes,
    }
