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
TOTAL_CONTACTS = 2_400_000  # K3: 16-33 lakh; mid-range. IVR bot calls are outside this, as on the views.
CHANNEL_MIX = {  # K4, on the views' channel groups
    "calls": 0.56, "chat": 0.13, "whatsapp": 0.07, "emails": 0.13, "branch": 0.09, "social": 0.02,
}
COMPLAINTS = 110_000  # C5: about 1,210 a day (C3) x 91 days
COMPLAINT_MIX = {  # K5: loans and cards lead (O4: loans 29.25%, credit cards second), then accounts, UPI, insurance
    "personal_loans": 0.14, "home_loans": 0.11, "auto_loans": 0.06,  # loans 31%
    "cards": 0.26, "accounts": 0.20, "payzapp": 0.11, "digital": 0.06, "insurance": 0.06,
}
# O7/O8: 7,000-12,000 maintainable Ombudsman complaints a year = 135-230 a week = 1,755-2,990 in 13 weeks.
ESCALATION = {"rbi_ombudsman": 2_400, "io": 3_900, "md_office": 7_000}  # io and md_office: our assumption
# Priority lists. Sizes: P1 (Ultra HNI, sponsor anchor), P3 (low thousands). Share in contact: P2 for Ultra HNI
# (15-30%); our assumption for the two small lists. Contacts per contacting customer: our assumption.
LISTS = {
    "priority_a": {"size": 1_800, "in_contact": 0.40},
    "priority_b": {"size": 3_200, "in_contact": 0.35},
    "uhni": {"size": 200_000, "in_contact": 0.225},
}
CONTACTS_PER_CONTACTING = 2.5
CONTACTING_CUSTOMERS = 1_050_000  # everyone with a contact in the window: 24 lakh contacts at about 2.3 each
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

    dims = {
        "stratum": (lambda r: strat[r["id"]], t_strat),
        "channel": (lambda r: CHANNEL_GROUP[r["channel"]], {k: v * TOTAL_CONTACTS for k, v in CHANNEL_MIX.items()}),
        "complaint": (lambda r: r["product"] if is_complaint(r) else "none",
                      {**{k: v * COMPLAINTS for k, v in COMPLAINT_MIX.items()}, "none": TOTAL_CONTACTS - COMPLAINTS}),
        "escalation": (lambda r: r["escalation"] if r.get("escalation") in ESCALATION else "none",
                       {**ESCALATION, "none": TOTAL_CONTACTS - sum(ESCALATION.values())}),
    }
    keyed = [([key(r) for r in rows], targets) for key, targets in dims.values()]
    xs = [TOTAL_CONTACTS / len(rows)] * len(rows)
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
    for c in customers:
        c["cw"] = _whole(cw[stratum(c)], "cw:" + c["masked_id"])

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
            "complaint_mix": COMPLAINT_MIX, "escalation": ESCALATION, "lists": LISTS,
            "contacts_per_contacting_customer": CONTACTS_PER_CONTACTING, "contacting_customers": CONTACTING_CUSTOMERS,
        },
        "list_sizes": sizes,
    }
