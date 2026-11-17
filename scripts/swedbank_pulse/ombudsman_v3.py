"""ARN watch figures (SW-D06; same state machine and payload shape as the copied pipeline).

Every figure is a point-in-time snapshot of data/seed/swedbank_pulse/complaints.jsonl "as of" a moment T: the end of the
selected period, and the end of the previous period for the change. One state per complaint (complaint_rules.py):

  key           tile                                              rule
  brink         First reply overdue                               no reply from the bank 15 business days after the
                                                                  complaint (bank standard, confirm with the bank)
  eligible      Final decision issued, Kundombudsman appeal open  the bank rejected the complaint in whole or in part;
                                                                  from the decision until APPEAL_OPEN after it, while
                                                                  the customer has not come back
  unhappy       Unhappy with the final decision (ARN eligible)    the customer came back after a rejecting decision
                                                                  (reopened, or contacted again on the issue); until one
                                                                  year after the complaint (ARN's time limit)
  awaiting_io   Filed with ARN                                    filed, for 90 days after filing (ARN decides within 90
                                                                  days); clears the other states
  at_risk       brink, eligible or unhappy, each complaint once
  open          no reply from the bank yet (inside or past the 15 business days), not filed
  buckets       days left before the 15-business-day reply deadline, for open complaints not yet overdue (0-3, 4-7,
                8-10): the countdown, not a tile

The key names are the copied pipeline's (the screens read them). ARN filing pace is an assumption (complaint_rules).
Register ids: REG-FIRST-REPLY, REG-PSD-15, REG-FINAL-DECISION, REG-KUNDOMBUDSMAN, REG-ARN.
"""

from __future__ import annotations

import datetime as dt
import json

from common import CARDS_CATEGORIES, CARDS_OTHER, DEEP_DIVE_PRODUCT, SEED_V3, inr
from complaint_rules import APPEAL_OPEN, ARN_WINDOW, deadline, referral_open, steady_register

DAY = dt.timedelta(days=1)
BUCKETS = [("8-10", 8, 10), ("4-7", 4, 7), ("0-3", 0, 3)]  # days left before the 15-business-day reply deadline
LIST_LABEL = {"priority_a": "Customers in a vulnerable situation", "priority_b": "Recent complainants (90 days)",
              "uhni": "Premium and Private Banking", "multi": "Account-measure affected"}
D90 = dt.timedelta(days=90)


def lists_at(c: dict, T: dt.datetime) -> list[str]:
    """The Customer pulse lists the complaint's customer is on as of T. A complaint received in the last 90 days puts its
    customer on Recent complainants by definition."""
    out = list(c["lists"])
    if "priority_b" not in out and T - c["_received_at"] <= D90:
        out.append("priority_b")
    return [k for k in LIST_LABEL if k in out]


IO_OWNER = "Complaints lead"
RULES = (
    "The bank replies to a complaint within 15 business days (bank standard, confirm with the bank). After a decision "
    "that rejects the complaint in whole or in part, the customer can appeal to the Kundombudsman, the bank's Customer "
    "Ombudsman, and can file with ARN (Allmänna reklamationsnämnden) in writing within one year of the complaint. ARN "
    "decides within 90 days. ARN filing pace is assumed, about 10 a week (confirm with the bank). Eligibility and risk "
    "only: LisN never predicts that a customer will file."
)


def ts(s):
    return dt.datetime.fromisoformat(s) if s else None


def load_complaints() -> list[dict]:
    out = []
    raw = [json.loads(line) for line in open(SEED_V3 / "complaints.jsonl", encoding="utf-8")]
    for c in steady_register(raw):  # the ARN watch reads the register as a steady state
        for k in ("received_at", "final_reply_at", "decision_at", "io_reviewed_at", "unhappy_at", "referred_at"):
            c["_" + k] = ts(c[k])
        c["_due"] = deadline(c["_received_at"], c["product"])
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
    due = c.get("_due") or deadline(rec, c["product"])
    if not replied:
        st["open"] = True
        if T >= due:
            st["brink"] = True  # first reply overdue: past 15 business days with no reply
            st["eligible_from"] = due
        else:
            left = int((due - T) / DAY)
            st["days_left"] = left
            if left <= 10:
                st["bucket"] = next(b for b, lo, hi in BUCKETS if lo <= left <= hi)
    elif c["outcome"] in ("rejected", "partly_rejected"):
        back = c["_unhappy_at"]
        if back and reply < back <= T and T < rec + ARN_WINDOW:
            st["unhappy"] = True  # came back after the decision: ARN eligible
            st["unhappy_how"] = [c["unhappy_how"]]
            st["eligible_from"] = back
        elif T < reply + APPEAL_OPEN and not (back and back <= T):
            st["eligible"] = True  # decision issued, the Kundombudsman appeal is open
            st["eligible_from"] = reply
    # Filed with ARN: out of the at-risk states, counted on its own while ARN handles the case (90 days).
    ref = c.get("_referred_at")
    if ref and ref <= T:
        st.update(awaiting_io=referral_open(ref, T), brink=False, bucket=None, eligible=False, unhappy=False, open=False)
    st["at_risk"] = st["brink"] or st["eligible"] or st["unhappy"]
    return st


def score(c: dict, st: dict, T: dt.datetime) -> tuple[int, list[str]]:
    """Order for the save list. Points, never a probability; the reasons are shown instead."""
    pts, why = 0, []
    if st["brink"]:
        days = int((T - c["_received_at"]) / DAY)
        pts += 50
        why.append(f"no reply for {days} days, past the 15 business days")
    elif st["eligible"]:
        pts += 30
        why.append("final decision issued, Kundombudsman appeal open")
    if st["unhappy"]:
        pts += 40
        why.append("unhappy with the final decision (" + ", ".join(st["unhappy_how"]) + "): ARN eligible")
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
        why.append("escalation language")
    if c["lists"]:
        pts += 10
        why.append("on a priority list")
    if "social_inbox" in channels:
        pts += 10
        why.append("public post via the social inbox")
    if st["awaiting_io"]:
        why.append("filed with ARN")
    return pts, why


COUNT_KEYS = ["brink", "eligible", "unhappy", "awaiting_io", "at_risk", "open"]


def counts(pairs) -> dict:
    """Bank-scale counts: each sample complaint stands for c["w"] complaints (scale_v3.py)."""
    out = {k: sum(c["w"] for c, s in pairs if s[k]) for k in COUNT_KEYS}
    out["buckets"] = {b: sum(c["w"] for c, s in pairs if s["bucket"] == b) for b, *_ in BUCKETS}
    out["received"] = sum(c["w"] for c, _ in pairs if not c["prior"])
    return out


def snap(cs, T):
    return [(c, s) for c in cs if (s := status(c, T)) is not None]


def block(cs: list[dict], w: dict, products: list[tuple[str, str]]) -> dict:
    """The ARN watch for one scope and period: dials now and at the previous period end, countdown, flow,
    list overlap and the split by business."""
    T, P, start = w["end"], w["prev"][1], w["start"]
    if w["period_id"] == "all":  # the full window's baseline is its first morning: "since 22 Oct, 07:45" (05:45 UTC)
        P = start + dt.timedelta(hours=7, minutes=45)
    now, prev = snap(cs, T), snap(cs, P)
    cn, cp = counts(now), counts(prev)
    risky = [(c, s) for c, s in now if s["at_risk"]]
    by_list = {k: sum(c["w"] for c, _ in risky if k in lists_at(c, T)) for k in LIST_LABEL}
    return {
        "provenance": "internal",
        "as_of": T.isoformat(),
        "prev_as_of": P.isoformat(),
        "now": cn,
        "prev": cp,
        "delta": {k: cn[k] - cp[k] for k in COUNT_KEYS},
        # Pending: received, no reply from the bank yet. "First reply overdue" is inside it.
        "pending": sum(c["w"] for c, s in now if s["open"]),
        # Decisions rejecting the complaint in whole or in part (the copied "io" block, kept for its fields).
        "io": {
            "decided": sum(c["w"] for c, _ in now if c["_decision_at"] and c["_decision_at"] <= T),
            "reviewed": sum(c["w"] for c, _ in now if c["_io_reviewed_at"] and c["_io_reviewed_at"] <= T),
        },
        "became_eligible": sum(c["w"] for c, s in now if s["eligible_from"] and start < s["eligible_from"] <= T),
        "on_lists": {"at_risk": sum(c["w"] for c, _ in risky if lists_at(c, T)), "by_list": by_list,
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
    """The deep-dive product only (Payments and Swish): risk by category and subcategory (theme), and the save list of
    the top 10 to call today."""
    T = w["end"]
    now = [(c, s) for c, s in snap(cs, T) if c["product"] == DEEP_DIVE_PRODUCT]
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
        if not s["at_risk"] or not c["original"]:  # the save list names real sample complaints only
            continue
        pts, why = score(c, s, T)
        k = category_of(c["theme"])
        ranked.append((-pts, c["received_at"], {
            "id": c["id"], "customer": c["masked_id"], "category": k["label"], "issue": labels.get(c["theme"], c["theme"]),
            "state": "brink" if s["brink"] else "eligible",
            "days_left": s["days_left"], "score": pts, "reason": (lambda t: t[:1].upper() + t[1:])("; ".join(why)) + ".",
            "owner": IO_OWNER if s["awaiting_io"] else k["owner"], "lists": [LIST_LABEL[x] for x in lists_at(c, T)],
            "premium": "uhni" in c["lists"],
        }))
    # Premium and Private Banking in proportion: their rows on the save list follow their share of at-risk complaints.
    risk_w = sum(c["w"] for c, s in now if s["at_risk"])
    prem_w = sum(c["w"] for c, s in now if s["at_risk"] and "uhni" in c["lists"])
    quota = max(1, round(10 * prem_w / max(risk_w, 1)))
    save, n_prem = [], 0
    for *_, r in sorted(ranked, key=lambda z: (z[0], z[1])):
        if r["premium"] and n_prem >= quota:
            continue
        n_prem += r["premium"]
        save.append(r)
        if len(save) == 10:
            break
    return {"categories": cats, "save_list": save}


def brief_item(bank: dict) -> dict | None:
    """A bank-wide "What needs you" item when the risk is material: any complaint with 3 days or fewer left to the
    reply deadline, or more complaints past it than at the previous snapshot."""
    n03 = bank["now"]["buckets"]["0-3"]
    od, d = bank["now"]["brink"], bank["delta"]["brink"]
    if not (n03 or d > 0):
        return None
    return {
        "business": "bank", "business_label": "All products", "issue": "ARN watch", "kind": "ombudsman",
        "text": (f"{inr(n03)} complaints have 3 days or fewer to the 15-business-day reply deadline; {inr(od)} are past "
                 f"it with no reply ({'up' if d > 0 else 'down' if d < 0 else 'no change'}"
                 f"{f' {inr(abs(d))}' if d else ''} on the previous period end)."),
    }
