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

from common import PERIOD_END, SEED, is_business_day

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
            if is_business_day(d):
                n += 1
        return d
    return received + dt.timedelta(days=56)


def filed_with_ombudsman(r: dict, d: dict) -> bool:
    """Whether this complaint was referred to the Financial Ombudsman Service. Only complaints at risk can be: the
    customer came back unhappy with the final response, or had none by the deadline."""
    return referred_at(r, d) is not None


def referred_at(r: dict, d: dict):
    """When the customer referred the complaint to the Financial Ombudsman Service, or None. ASSUMPTION (Pass 2 section 4, about 150 referrals a week; NW-D56): 35% of those
    unhappy with the final response, 17% of those past the deadline with no final response; referral 3-30 days later."""
    t = referral_due(r, d)
    return t if t and t <= END else None


def referral_due(r: dict, d: dict):
    """The same referral without the freeze cap: when it falls after the freeze it has not happened yet. The steady
    register's earlier copies use it (NW-D56), since for them that moment is in the past."""
    h = int(hashlib.sha1(f"fos:{r['id']}".encode()).hexdigest(), 16) % 10_000 / 10_000
    lag = dt.timedelta(days=3 + 27 * (int(hashlib.sha1(f"lag:{r['id']}".encode()).hexdigest(), 16) % 1000 / 1000))
    if d["unhappy_at"] and h < 0.35:
        t = d["unhappy_at"] + lag
    elif d["reply"] is None and h < 0.17:
        t = deadline(ts(r["created_at"]), r["product"]) + lag
    else:
        return None
    return t


# ---------------------------------------------------------------- steady-state register (review round 1, NW-D56)
# The sample holds about 2,200 complaints with bank-scale weights from 1 to about 400, and none before 1 August, so the
# Financial Ombudsman stocks (on the brink, past 8 weeks, unhappy, referred) were lumpy and still filling up in the
# window. For the Ombudsman watch only, the register is read as a steady state:
#   - each complaint stands for an equal share of its product's complaints (same product totals);
#   - each is spread over CLONE_OFFSETS days (eleven copies a few days apart, same course and outcome);
#   - two earlier copies of the whole window (PRIOR_SHIFT and twice that before) stand for the complaints received
#     before 1 August, so stocks that last up to 6 months are full from the start. They count in stocks, never as
#     received in the window.
# A referral stays on the "referred" tile for REFERRAL_OPEN (8 weeks) after the referral.
CLONE_OFFSETS = (-20, -16, -12, -8, -4, 0, 4, 8, 12, 16, 20)
PRIOR_SHIFT = 105
REFERRAL_OPEN = dt.timedelta(weeks=8)
_TIME_KEYS = ("received_at", "final_reply_at", "decision_at", "io_reviewed_at", "unhappy_at", "referred_at")


def _shift(c: dict, days: int) -> dict:
    out = dict(c)
    d = dt.timedelta(days=days)
    for k in _TIME_KEYS:
        if c.get(k):
            out[k] = (dt.datetime.fromisoformat(c[k]) + d).isoformat(timespec="minutes")
    out["contacts"] = [{**x, "at": (dt.datetime.fromisoformat(x["at"]) + d).isoformat(timespec="minutes")} for x in c["contacts"]]
    return out


def steady_register(raw: list[dict]) -> list[dict]:
    """The Ombudsman watch's reading of the register (see above). Integer weights; product totals kept."""
    by_p: dict[str, list[dict]] = {}
    for c in sorted(raw, key=lambda c: c["id"]):
        by_p.setdefault(c["product"], []).append(c)
    out = []
    for p, cs in by_p.items():
        total = sum(c["w"] for c in cs)
        copies = [(c, k) for c in cs for k in range(len(CLONE_OFFSETS))]
        base, rem = divmod(total, len(copies))
        for i, (c, k) in enumerate(copies):
            w = base + (1 if i < rem else 0)
            for prior in (0, 1, 2):
                src = c
                if prior and c.get("referral_due_at"):
                    src = {**src, "referred_at": c["referral_due_at"]}
                shift = CLONE_OFFSETS[k] - prior * PRIOR_SHIFT
                if shift < 0 and not c.get("final_reply_at"):
                    # Still open at the freeze: a copy received earlier has run on past the point the original has
                    # reached, so it gets its final response 0-40 days after that point (deterministic per copy).
                    extra = int(hashlib.sha1(f"reply:{c['id']}:{k}:{prior}".encode()).hexdigest(), 16) % 40
                    src = {**src, "final_reply_at": (END + dt.timedelta(days=extra)).isoformat(timespec="minutes")}
                x = _shift(src, shift)
                mid = CLONE_OFFSETS.index(0)
                x["id"] = c["id"] if (k == mid and prior == 0) else f"{c['id']}~{k}{prior}"
                x["original"] = k == mid and prior == 0
                x["prior"] = prior > 0 or dt.datetime.fromisoformat(x["received_at"]) < START_OF_WINDOW
                x["w"] = w
                out.append(x)
    return out


def referral_open(ref: dt.datetime | None, T: dt.datetime) -> bool:
    return ref is not None and ref <= T < ref + REFERRAL_OPEN


START_OF_WINDOW = dt.datetime(2026, 8, 1, tzinfo=dt.timezone.utc)
