"""Ombudsman watch figures (docs/demo-rebuild/ombudsman_watch_design.md). Internal · illustrative.

Every figure is a point-in-time snapshot of data/seed/indusind_v2/complaints.jsonl "as of" a moment T: the end of the
selected period, and the end of the previous period for the change. The only rules used are the RBI rules in the design
doc: 30 days to reply; eligibility after day 30 with no reply, or at any point when the customer is unhappy with the
reply; 90 days to file after that; Internal Ombudsman review before a partly or fully rejecting reply. No bank TAT and
no acknowledgement rule are used.
"""

from __future__ import annotations

import datetime as dt
import json

from common import CARDS_CATEGORIES, CARDS_OTHER, SEED_V3, inr

D30 = dt.timedelta(days=30)
D90 = dt.timedelta(days=90)
DAY = dt.timedelta(days=1)
BUCKETS = [("8-10", 8, 10), ("4-7", 4, 7), ("0-3", 0, 3)]  # days left before day 30, furthest first
LIST_LABEL = {"priority_a": "Ultra sensitive", "priority_b": "RBI & Government", "uhni": "Pioneer (Ultra HNI)"}
IO_OWNER = "Internal Ombudsman office"
RULES = (
    "RBI rules only. The bank has 30 days to reply to a complaint. The customer is eligible to approach the RBI "
    "Ombudsman when there is no reply within 30 days, or at any point when unhappy with the reply, and then has 90 days "
    "to file (Reserve Bank – Integrated Ombudsman Scheme 2026, from 1 July 2026). The Ombudsman can award up to ₹30 "
    "lakh for financial loss plus up to ₹3 lakh for harassment and time lost, per complaint. A complaint the bank partly "
    "or fully rejects is reviewed by its Internal Ombudsman before the final reply; IO timeline: confirm with the bank. "
    "Eligibility and risk only: LisN never predicts that a customer will file."
)


def ts(s):
    return dt.datetime.fromisoformat(s) if s else None


def load_complaints() -> list[dict]:
    out = []
    for line in open(SEED_V3 / "complaints.jsonl", encoding="utf-8"):
        c = json.loads(line)
        for k in ("received_at", "final_reply_at", "decision_at", "io_reviewed_at", "unhappy_at"):
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
    if not replied:
        st["open"] = True
        elapsed = T - rec
        if elapsed >= D30:
            st["eligible"] = elapsed < D30 + D90  # the 90 days to file run from day 30
            st["eligible_from"] = rec + D30
        else:
            left = int((rec + D30 - T) / DAY)
            st["days_left"] = left
            if left <= 10:
                st["brink"] = True
                st["bucket"] = next(b for b, lo, hi in BUCKETS if lo <= left <= hi)
        d, io = c["_decision_at"], c["_io_reviewed_at"]
        st["awaiting_io"] = bool(d and d <= T and (io is None or io > T))
    else:
        # Unhappy with the reply comes from the reply's outcome (complaint_rules): the customer reopened the complaint
        # or contacted again on the issue, within the 90 days they have to approach the Ombudsman.
        back = c["_unhappy_at"]
        if back and reply < back <= T and T < reply + D90:
            st["unhappy"] = True
            st["open"] = True  # contested: open again
            st["unhappy_how"] = [c["unhappy_how"]]
            st["eligible_from"] = back
        if reply > rec + D30:  # it was eligible on the no-reply route before the late reply
            st["eligible_from"] = min(filter(None, [st["eligible_from"], rec + D30]))
    st["at_risk"] = st["brink"] or st["eligible"] or st["unhappy"]
    return st


def score(c: dict, st: dict, T: dt.datetime) -> tuple[int, list[str]]:
    """Order for the save list (design concept 4). Points, never a probability; the reasons are shown instead."""
    pts, why = 0, []
    # 0-3 days left scores highest: a reply today still keeps the complaint from becoming eligible.
    if st["eligible"]:
        days = int((T - c["_received_at"]) / DAY)
        pts += 40
        why.append(f"no reply for {days} days: eligible")
    elif st["brink"]:
        pts += {"0-3": 50, "4-7": 35, "8-10": 20}[st["bucket"]]
        dl = st["days_left"]
        why.append(f"no reply, {dl} day{'' if dl == 1 else 's'} to day 30")
    if st["unhappy"]:
        pts += 35
        why.append("unhappy with the reply (" + ", ".join(st["unhappy_how"]) + ")")
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
        why.append("on the bank's list")
    if "social_inbox" in channels:
        pts += 10
        why.append("public post via the social inbox")
    if st["awaiting_io"]:
        why.append("awaiting IO review")
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
        # Internal Ombudsman: every complaint the bank decided to partly or fully reject is reviewed before the reply.
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
        "business": "bank", "business_label": "All businesses", "issue": "Ombudsman watch", "kind": "ombudsman",
        "text": (f"{inr(n03)} complaints have 3 days or fewer to the 30-day reply limit; {inr(el)} are already eligible to "
                 f"approach the RBI Ombudsman ({'up' if d > 0 else 'down' if d < 0 else 'no change'}"
                 f"{f' {inr(abs(d))}' if d else ''} on the previous period end)."),
    }
