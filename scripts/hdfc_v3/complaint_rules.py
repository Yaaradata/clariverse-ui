"""How a formal complaint turns out (Internal · illustrative). One place, used by the seed (to mark which contacts went to
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
REJECT = {"base": 0.105, "negative": 0.123}  # share of replied complaints partly or fully rejected, before the two-day rule
PARTLY_OF_REJECTED = 0.6
OPEN_DECIDED = {"base": 0.105, "negative": 0.123}
UNHAPPY = {"resolved": 0.022, "partly_rejected": 0.30, "rejected": 0.30}
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


def filed_with_ombudsman(r: dict, d: dict) -> bool:
    """Whether this complaint went on to the RBI Ombudsman. Only complaints that are at risk can: the customer came
    back unhappy with the reply, or had no reply for more than 30 days."""
    h = int(hashlib.sha1(f"rbi:{r['id']}".encode()).hexdigest(), 16) % 10_000 / 10_000
    # Loan complaints are few in the kept sample but lead at the Ombudsman (O4), so more of the at-risk ones are kept
    # at this rung; scale_v3 then sets each product's share of the total.
    loans = r["product"].endswith("_loans")
    if d["unhappy_at"]:
        return h < (0.8 if loans else 0.4)
    if d["reply"] is None and END - ts(r["created_at"]) > dt.timedelta(days=30):
        return h < (0.5 if loans else 0.12)
    return False
