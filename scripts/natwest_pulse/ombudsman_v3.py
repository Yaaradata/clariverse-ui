"""Ombudsman watch figures (docs/demo-rebuild/ombudsman_watch_design.md). Internal · illustrative.

Every figure is a point-in-time snapshot of data/seed/internal_v3/complaints.jsonl "as of" a moment T: the end of the
selected period, and the end of the previous period for the change. The only rules used are the RBI rules in the design
doc: 30 days to reply; eligibility after day 30 with no reply, or at any point when the customer is unhappy with the
reply; 90 days to file after that; Internal Ombudsman review before a partly or fully rejecting reply. No bank TAT and
no acknowledgement rule are used.
"""

from __future__ import annotations

import datetime as dt
import json

from common import CARDS_CATEGORIES, CARDS_OTHER, SEED_V3, inr
from complaint_rules import deadline

D6M = dt.timedelta(days=183)  # 6 months from the final response (or the deadline) to refer (register REG-FOS-6M)
DAY = dt.timedelta(days=1)
BUCKETS = [("8-10", 8, 10), ("4-7", 4, 7), ("0-3", 0, 3)]  # days left before the final-response deadline
LIST_LABEL = {"priority_a": "Financially vulnerable (Consumer Duty)", "priority_b": "Recent complainants (90 days)", "uhni": "Premier"}
IO_OWNER = "Final-response team"
RULES = (
    "Financial Ombudsman Service rules only (register REG-DISP-8W, REG-PSD-15, REG-FOS-6M). The bank has 8 weeks to "
    "send a final response; 15 business days for payment-services complaints. The customer may refer the complaint to "
    "the Financial Ombudsman Service when there is no final response by then, or when unhappy with the final response, "
    "within 6 months of it. Eligibility and risk only: LisN never predicts that a customer will refer."
)


def ts(s):
    return dt.datetime.fromisoformat(s) if s else None


def load_complaints() -> list[dict]:
    out = []
    for line in open(SEED_V3 / "complaints.jsonl", encoding="utf-8"):
        c = json.loads(line)
        for k in ("received_at", "final_reply_at", "decision_at", "io_reviewed_at", "unhappy_at", "referred_at"):
            c["_" + k] = ts(c[k])
        for x in c["contacts"]:
            x["_at"] = ts(x["at"])
        out.append(c)
    return out


def status(c: dict, T: dt.datetime) -> dict | None:
    """The complaint's state as of T, or None if it had not been received by then."""
    rec = c["_received_at"]
    if rec > T:
        return None
    reply = c["_final_reply_at"]
    replied = reply is not None and reply <= T
    st = {"brink": False, "bucket": None, "days_left": None, "eligible": False, "unhappy": False,
          "unhappy_how": [], "awaiting_io": False, "open": False, "eligible_from": None}
    due = deadline(rec, c["product"])
    if not replied:
        st["open"] = True
        if T >= due:
            st["eligible"] = True  # past the deadline with no final response: may refer
            st["eligible_from"] = due
        else:
            left = int((due - T) / DAY)
            st["days_left"] = left
            if left <= 10:
                st["brink"] = True
                st["bucket"] = next(b for b, lo, hi in BUCKETS if lo <= left <= hi)

    else:
        # Unhappy with the reply comes from the reply's outcome (complaint_rules): the customer reopened the complaint
        # or contacted again on the issue, within the 90 days they have to approach the Ombudsman.
        back = c["_unhappy_at"]
        if back and reply < back <= T and T < reply + D6M:
            st["unhappy"] = True
            st["open"] = True  # contested: open again
            st["unhappy_how"] = [c["unhappy_how"]]
            st["eligible_from"] = back
        if reply > due:  # it was eligible on the no-response route before the late final response
            st["eligible_from"] = min(filter(None, [st["eligible_from"], due]))
    # Referred to the Financial Ombudsman Service (the oct13 "awaiting IO review" tile, relabelled): out of the
    # at-risk states, counted on its own.
    ref = c.get("_referred_at")
    if ref and ref <= T:
        st.update(awaiting_io=True, brink=False, bucket=None, eligible=False, unhappy=False, open=not replied)
    st["at_risk"] = st["brink"] or st["eligible"] or st["unhappy"]
    return st


def score(c: dict, st: dict, T: dt.datetime) -> tuple[int, list[str]]:
    """Order for the save list (design concept 4). Points, never a probability; the reasons are shown instead."""
    pts, why = 0, []
    # 0-3 days left scores highest: a reply today still keeps the complaint from becoming eligible.
    if st["eligible"]:
        days = int((T - c["_received_at"]) / DAY)
        pts += 40
        why.append(f"no final response for {days} days: may refer")
    elif st["brink"]:
        pts += {"0-3": 50, "4-7": 35, "8-10": 20}[st["bucket"]]
        dl = st["days_left"]
        why.append(f"no final response, {dl} day{'' if dl == 1 else 's'} to the deadline")
    if st["unhappy"]:
        pts += 35
        why.append("unhappy with the final response (" + ", ".join(st["unhappy_how"]) + ")")
    seen = [x for x in c["contacts"] if x["_at"] <= T]
    repeats = sum(1 for x in seen if x["same_issue"])
    if repeats:
        pts += 8 * min(3, repeats)
        why.append(f"{repeats} repeat contact{'s' if repeats > 1 else ''}")
    channels = {c["channel"]} | {x["channel"] for x in seen if x["same_issue"]}
    if len(channels) > 1:
        pts += 5 * min(3, len(channels) - 1)
        why.append(f"{len(channels)} channels")
    if c["escalation"] or any(x["escalation"] for x in seen):
        pts += 15
        if "escalation language" not in st["unhappy_how"]:
            why.append("escalation language")
    if c["lists"]:
        pts += 10
        why.append("on a priority list")
    if "social_inbox" in channels:
        pts += 10
        why.append("public post via the social inbox")
    if st["awaiting_io"]:
        why.append("referred to the Ombudsman")
    return pts, why


COUNT_KEYS = ["brink", "eligible", "unhappy", "awaiting_io", "at_risk", "open"]


def counts(pairs) -> dict:
    """Bank-scale counts: each sample complaint stands for c["w"] complaints (scale_v3.py)."""
    out = {k: sum(c["w"] for c, s in pairs if s[k]) for k in COUNT_KEYS}
    out["buckets"] = {b: sum(c["w"] for c, s in pairs if s["bucket"] == b) for b, *_ in BUCKETS}
    out["received"] = sum(c["w"] for c, _ in pairs)
    return out


def snap(cs, T):
    return [(c, s) for c in cs if (s := status(c, T)) is not None]


def block(cs: list[dict], w: dict, products: list[tuple[str, str]]) -> dict:
    """The Ombudsman watch for one scope and period: dials now and at the previous period end, countdown, flow,
    list overlap and the split by business."""
    T, P, start = w["end"], w["prev"][1], w["start"]
    now, prev = snap(cs, T), snap(cs, P)
    cn, cp = counts(now), counts(prev)
    risky = [(c, s) for c, s in now if s["at_risk"]]
    by_list = {k: sum(c["w"] for c, _ in risky if k in c["lists"]) for k in LIST_LABEL}
    return {
        "provenance": "internal",
        "as_of": T.isoformat(),
        "prev_as_of": P.isoformat(),
        "now": cn,
        "prev": cp,
        "delta": {k: cn[k] - cp[k] for k in COUNT_KEYS},
        # Pending: received, no final reply yet. "On the brink" and "already eligible" are both pending complaints.
        "pending": sum(c["w"] for c, s in now if s["open"] and not s["unhappy"]),
        # Final responses not upholding the complaint (the oct13 "io" block, kept for its fields).
        "io": {
            "decided": sum(c["w"] for c, _ in now if c["_decision_at"] and c["_decision_at"] <= T),
            "reviewed": sum(c["w"] for c, _ in now if c["_io_reviewed_at"] and c["_io_reviewed_at"] <= T),
        },
        "became_eligible": sum(c["w"] for c, s in now if s["eligible_from"] and start < s["eligible_from"] <= T),
        "on_lists": {"at_risk": sum(c["w"] for c, _ in risky if c["lists"]), "by_list": by_list,
                     "labels": LIST_LABEL},
        "by_business": [
            {"id": pid, "label": label, **{k: v for k, v in counts([(c, s) for c, s in now if c["product"] == pid]).items()
                                            if k != "buckets"}}
            for pid, label in products
        ],
        "rules": RULES,
    }


def category_of(theme: str) -> dict:
    return next((k for k in CARDS_CATEGORIES if theme in k["themes"]), CARDS_OTHER)


def cards_extra(cs: list[dict], w: dict, labels: dict) -> dict:
    """Cards only: risk by category and subcategory (theme), and the save list of the top 10 to call today."""
    T = w["end"]
    now = [(c, s) for c, s in snap(cs, T) if c["product"] == "cards"]
    cats = []
    for k in [*CARDS_CATEGORIES, CARDS_OTHER]:
        xs = [(c, s) for c, s in now if category_of(c["theme"])["id"] == k["id"]]
        subs = {}
        for c, s in xs:
            subs.setdefault(c["theme"], []).append((c, s))
        cats.append({
            "id": k["id"], "label": k["label"],
            **{x: v for x, v in counts(xs).items() if x in ("at_risk", "brink", "eligible", "unhappy", "awaiting_io")},
            "subcategories": [
                {"id": th, "label": labels.get(th, th),
                 **{x: v for x, v in counts(v).items() if x in ("at_risk", "brink", "eligible", "unhappy", "awaiting_io")}}
                for th, v in sorted(subs.items(), key=lambda z: -sum(c["w"] for c, s in z[1] if s["at_risk"]))
            ],
        })
    ranked = []
    for c, s in now:
        if not s["at_risk"]:
            continue
        pts, why = score(c, s, T)
        k = category_of(c["theme"])
        ranked.append((-pts, c["received_at"], {
            "id": c["id"], "customer": c["masked_id"], "category": k["label"], "issue": labels.get(c["theme"], c["theme"]),
            "state": "eligible" if s["eligible"] or s["unhappy"] else "brink",
            "days_left": s["days_left"], "score": pts, "reason": (lambda t: t[:1].upper() + t[1:])("; ".join(why)) + ".",
            "owner": IO_OWNER if s["awaiting_io"] else k["owner"], "lists": [LIST_LABEL[x] for x in c["lists"]],
        }))
    save = [r for *_, r in sorted(ranked, key=lambda z: (z[0], z[1]))[:10]]
    return {"categories": cats, "save_list": save}


def brief_item(bank: dict) -> dict | None:
    """A bank-wide "What needs you" item when the risk is material: any complaint with 3 days or fewer left, or more
    complaints already eligible than at the previous snapshot."""
    n03 = bank["now"]["buckets"]["0-3"]
    el, d = bank["now"]["eligible"], bank["delta"]["eligible"]
    if not (n03 or d > 0):
        return None
    return {
        "business": "bank", "business_label": "All products", "issue": "Financial Ombudsman watch", "kind": "ombudsman",
        "text": (f"{inr(n03)} complaints have 3 days or fewer to the final-response deadline; {inr(el)} are past it and "
                 f"may go to the Financial Ombudsman Service ({'up' if d > 0 else 'down' if d < 0 else 'no change'}"
                 f"{f' {inr(abs(d))}' if d else ''} on the previous period end)."),
    }
