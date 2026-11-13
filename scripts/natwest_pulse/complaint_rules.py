"""How a formal complaint turns out (Internal · illustrative). NatWest: the final response rule (8 weeks; 15 business days
for payment services) and referral to the Financial Ombudsman Service (docs/natwest/brief.md Step 3.9). The ids below
(io_reviewed_at, "rbi_ombudsman") are the oct13 field names, kept so the screens read them unchanged.

Copied from the oct13 pipeline: One place, used by the seed (to mark which contacts went to
the Internal Ombudsman) and by the complaint register (seed_complaints_v3.py), so every IO figure comes from one source:
the escalation ladder's IO rung, the IO queue and "awaiting IO review" cannot disagree.

Deterministic: each complaint draws from its own generator, seeded with SEED and the contact's id.

Rates (MORNING_DECISIONS D31):
  reject rate          about 10% of complaints end partly or fully rejected, in line with peer bank disclosures (6-10%).
                       A reply inside two days is always a resolution: a rejection has to pass the Internal Ombudsman.
  open, decided        of complaints still open after two days, the same share already carry a decision to reject and
                       are waiting for IO review.
  unhappy with reply   30% of partly or fully rejected complaints come back (reopen, or contact again on the issue);
                       2.2% of resolved ones do.
  RBI Ombudsman        a complaint reaches the RBI Ombudsman only from the at-risk states: 40% of those unhappy with
                       the reply, and 12% of those left without a reply for more than 30 days. scale_v3 then holds the
                       total at the anchor (O7/O8).
"""

from __future__ import annotations

import datetime as dt
import hashlib
import random

from common import PERIOD_END, SEED

END = dt.datetime.fromisoformat(PERIOD_END)
REJECT = {"base": 0.80, "negative": 0.86}  # NatWest: about 55% upheld overall (H1 2026 anchor); summary resolutions are upheld  # share of replied complaints partly or fully rejected, before the two-day rule
PARTLY_OF_REJECTED = 0.6
OPEN_DECIDED = {"base": 0.30, "negative": 0.34}
UNHAPPY = {"resolved": 0.02, "partly_rejected": 0.12, "rejected": 0.14}
REOPEN_OF_UNHAPPY = 0.4  # the rest contact the bank again on the same issue


def ts(s):
    return dt.datetime.fromisoformat(s) if s else None


def is_complaint(r: dict) -> bool:
    return r["deliverable"] == "complaint_resolution" and r["channel"] != "ivr_bot"


def final_reply(r: dict):
    if r["status"] == "closed":
        return ts(r["closed_at"])
    if r["status"] == "waiting_on_customer":
        return ts(r["resolution_sent_at"])
    return None


def decide(r: dict) -> dict:
    """outcome, decision_at, io_reviewed_at, unhappy_at and unhappy_how for one complaint contact."""
    rng = random.Random(f"{SEED}:outcome:{r['id']}")
    received, reply = ts(r["created_at"]), final_reply(r)
    neg = "negative" if r["sentiment"] == "negative" else "base"
    out = {"reply": reply, "outcome": None, "decision_at": None, "io_reviewed_at": None, "unhappy_at": None, "unhappy_how": None}
    if reply:
        rejected = rng.random() < REJECT[neg] and reply - received >= dt.timedelta(days=2)
        out["outcome"] = ("partly_rejected" if rng.random() < PARTLY_OF_REJECTED else "rejected") if rejected else "resolved"
        if rejected:
            span = reply - received
            out["decision_at"] = received + span * rng.uniform(0.55, 0.80)
            out["io_reviewed_at"] = out["decision_at"] + (reply - out["decision_at"]) * rng.uniform(0.5, 0.9)
        if rng.random() < UNHAPPY[out["outcome"]]:
            t = reply + dt.timedelta(days=rng.uniform(1, 15))
            if t <= END:
                out["unhappy_at"] = t
                out["unhappy_how"] = "reopened" if rng.random() < REOPEN_OF_UNHAPPY else "contacted again"
    else:
        age = END - received
        if age >= dt.timedelta(days=2) and rng.random() < OPEN_DECIDED[neg]:
            out["outcome"] = "partly_rejected" if rng.random() < PARTLY_OF_REJECTED else "rejected"
            out["decision_at"] = received + age * rng.uniform(0.35, 0.80)  # the review is still pending at the snapshot
    return out


def deadline(received: dt.datetime, product: str) -> dt.datetime:
    """Final response due: 8 weeks; 15 business days for payment-services complaints (register REG-DISP-8W,
    REG-PSD-15). The 35-business-day exception is not modelled."""
    if product == "payments_fraud":
        d, n = received, 0
        while n < 15:
            d += dt.timedelta(days=1)
            if d.weekday() < 5:
                n += 1
        return d
    return received + dt.timedelta(days=56)


def filed_with_ombudsman(r: dict, d: dict) -> bool:
    """Whether this complaint was referred to the Financial Ombudsman Service. Only complaints at risk can be: the
    customer came back unhappy with the final response, or had none by the deadline."""
    return referred_at(r, d) is not None


def referred_at(r: dict, d: dict):
    """When the customer referred the complaint to the Financial Ombudsman Service, or None. ASSUMPTION: 45% of those
    unhappy with the final response, 20% of those past the deadline with no final response; referral 3-30 days later."""
    h = int(hashlib.sha1(f"fos:{r['id']}".encode()).hexdigest(), 16) % 10_000 / 10_000
    lag = dt.timedelta(days=3 + 27 * (int(hashlib.sha1(f"lag:{r['id']}".encode()).hexdigest(), 16) % 1000 / 1000))
    if d["unhappy_at"] and h < 0.45:
        t = d["unhappy_at"] + lag
    elif d["reply"] is None and h < 0.20:
        t = deadline(ts(r["created_at"]), r["product"]) + lag
    else:
        return None
    return t if t <= END else None
