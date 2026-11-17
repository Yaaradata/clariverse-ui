"""How a formal complaint turns out (internal layer). Swedbank (SW-D06): the bank's complaints process is Kundcenter or
kontor → the bank's decision → appeal to the Kundombudsman (the bank's Customer Ombudsman) → ARN (Allmänna
reklamationsnämnden, the National Board for Consumer Disputes). The field names below (io_reviewed_at, "rbi_ombudsman",
"awaiting_io") are the copied pipeline's, kept so the screens and the reconcile read them unchanged:
  final_reply_at / reply   the bank's decision on the complaint (the first written reply that settles it)
  decision_at              when the bank decided to reject in part or in full
  io_reviewed_at           when that rejection was reviewed before the decision letter went out
  unhappy_at               the customer came back unhappy with the decision (appealed to the Kundombudsman, or contacted
                           again on the issue): ARN eligible from then
  referred_at              the customer filed with ARN

Parameters (all on the record in docs/swedbank/volume_validation.md; tags never reach a screen):
  FIRST_REPLY_DAYS   15 business days to the bank's reply, for every product (bank standard, confirm with the bank;
                     the same figure as the Payment Services Act's 15 business days for payment services)
  ARN_WINDOW         ARN takes a case filed within one year of the complaint to the bank
  ARN_OPEN           a filed case stays on the "Filed with ARN" tile for 90 days (the ADR rule: ARN decides within
                     90 days of a complete file)
  ARN pace           about 10 filings a week (ASSUMPTION, scale_v3.ARN_FILINGS_PER_WEEK): choose_filers picks that many
                     of the customers unhappy with a rejecting decision
ARN takes a case only after the bank has said no in whole or in part, so a filing always comes from a rejected or
partly rejected complaint whose customer came back unhappy: "Filed with ARN" stays within tiles 2 and 3.

Deterministic: each complaint draws from its own generator, seeded with SEED and the contact's id.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import random

from common import DATA_START, PERIOD_END, SEED, is_business_day

END = dt.datetime.fromisoformat(PERIOD_END)
REJECT = {"base": 0.62, "negative": 0.68}  # share of replied complaints partly or fully rejected, before the two-day rule (ASSUMPTION)
PARTLY_OF_REJECTED = 0.6
OPEN_DECIDED = {"base": 0.30, "negative": 0.34}
UNHAPPY = {"resolved": 0.0, "partly_rejected": 0.035, "rejected": 0.045}  # ASSUMPTION; an upheld complaint has nothing to take to ARN
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


FIRST_REPLY_DAYS = 15  # business days, every product (bank standard, confirm with the bank)
ARN_WINDOW = dt.timedelta(days=365)  # ARN: file within one year of the complaint to the bank
ARN_OPEN = dt.timedelta(days=90)  # a filed case is open at ARN for 90 days (ADR rule: decision within 90 days)
APPEAL_OPEN = dt.timedelta(days=21)  # watch horizon for a Kundombudsman appeal after a rejecting decision (ASSUMPTION, confirm)


def deadline(received: dt.datetime, product: str) -> dt.datetime:
    """The bank's reply due: 15 business days from the complaint, every product (bank standard, confirm with the bank)."""
    d, n = received, 0
    while n < FIRST_REPLY_DAYS:
        d += dt.timedelta(days=1)
        if is_business_day(d):
            n += 1
    return d


def choose_filers(rows: list[dict], n: int) -> set[str]:
    """The sample complaints whose customers file with ARN: n of those unhappy with a rejecting decision, in a fixed
    order (a hash of the contact id). n is set from the ARN pace (ASSUMPTION, about 10 a week) and the sample's mean
    complaint weight, so the pace is held exactly instead of swinging with a few heavy rows. seed_internal_v3 marks
    them ("arn_filer") on the contact, so the register reads the same choice."""
    cands = []
    for r in rows:
        if not is_complaint(r):
            continue
        d = decide(r)
        if d["unhappy_at"] and d["outcome"] in ("rejected", "partly_rejected"):
            cands.append(r["id"])
    cands.sort(key=lambda i: hashlib.sha1(f"arn:{i}".encode()).hexdigest())
    return set(cands[:n])


def filed_with_ombudsman(r: dict, d: dict) -> bool:
    """Whether this complaint was filed with ARN by the freeze (name kept from the copied pipeline)."""
    return referred_at(r, d) is not None


def referred_at(r: dict, d: dict):
    """When the customer filed with ARN, or None. Only a customer unhappy with a rejecting decision files, 3-30 days
    after coming back, and only within ARN's one year from the complaint."""
    t = referral_due(r, d)
    return t if t and t <= END else None


def referral_due(r: dict, d: dict):
    """The same filing without the freeze cap: when it falls after the freeze it has not happened yet. The steady
    register's earlier copies use it, since for them that moment is in the past."""
    lag = dt.timedelta(days=3 + 27 * (int(hashlib.sha1(f"lag:{r['id']}".encode()).hexdigest(), 16) % 1000 / 1000))
    if not (r.get("arn_filer") and d["unhappy_at"] and d["outcome"] in ("rejected", "partly_rejected")):
        return None
    t = d["unhappy_at"] + lag
    return t if t <= ts(r["created_at"]) + ARN_WINDOW else None


# ---------------------------------------------------------------- steady-state register
# The sample holds about 2,300 complaints, all received inside the 27-day window, so the ARN-watch stocks (reply
# overdue, appeal open, unhappy and ARN eligible for up to a year, filed with ARN for 90 days) would be empty at the
# start and still filling up. For the ARN watch the register is read as a steady state:
#   - each complaint stands for an equal share of its product's complaints (same product totals);
#   - each is spread over CLONE_OFFSETS days (seven copies a few days apart, same course and outcome);
#   - copies of the whole window shifted back by whole window lengths (PRIOR_SHIFT, N_PRIOR of them, a little over a
#     year) stand for the complaints received before 22 October, so stocks that last up to ARN's one year are full from
#     the start. They count in stocks, never as received in the window;
#   - one copy shifted forward by a window length fills the last days before the freeze, which the spread would
#     otherwise leave thin. Shifting by exactly one window length makes the copies tile time evenly.
CLONE_OFFSETS = (-9, -6, -3, 0, 3, 6, 9)
UPPER_TIER_SHARE = 0.06  # Premium and Private Banking customers' share of the 3.8 million private customers (ASSUMPTION)
START_OF_WINDOW = dt.datetime.fromisoformat(DATA_START)
PRIOR_SHIFT = (END - START_OF_WINDOW).total_seconds() / 86400  # one window length, in days
N_PRIOR = 14  # 14 windows back: about 369 days, past ARN's one year
REFERRAL_OPEN = ARN_OPEN
_TIME_KEYS = ("received_at", "final_reply_at", "decision_at", "io_reviewed_at", "unhappy_at", "referred_at")


def _shift(c: dict, days: float) -> dict:
    out = dict(c)
    d = dt.timedelta(days=days)
    for k in _TIME_KEYS:
        if c.get(k):
            out[k] = (dt.datetime.fromisoformat(c[k]) + d).isoformat(timespec="minutes")
    out["contacts"] = [{**x, "at": (dt.datetime.fromisoformat(x["at"]) + d).isoformat(timespec="minutes")} for x in c["contacts"]]
    return out


def steady_register(raw: list[dict]) -> list[dict]:
    """The ARN watch's reading of the register (see above). Integer weights; product totals kept."""
    by_p: dict[str, list[dict]] = {}
    for c in sorted(raw, key=lambda c: c["id"]):
        by_p.setdefault(c["product"], []).append(c)
    out = []
    for p, cs in by_p.items():
        total = sum(c["w"] for c in cs)
        # Premium and Private Banking in proportion: the sample over-represents these customers (a large share of its
        # complaints), so their complaints carry UPPER_TIER_SHARE of the product's complaints, the rest the remainder.
        prem = [c for c in cs if "uhni" in c.get("lists", [])]
        rest = [c for c in cs if "uhni" not in c.get("lists", [])]
        groups = [(prem, round(total * UPPER_TIER_SHARE)), (rest, total - round(total * UPPER_TIER_SHARE))] if prem and rest else [(cs, total)]
        weighted = []
        for grp, gtotal in groups:
            copies = [(c, k) for c in grp for k in range(len(CLONE_OFFSETS))]
            # Weights vary per copy, 0.5 to 1.5 of the mean, deterministic (NW-D84): equal weights made every small
            # count a multiple of one weight. Largest remainder keeps the group total exact.
            raw_w = [0.5 + int(hashlib.sha1(f"w:{c['id']}:{k}".encode()).hexdigest(), 16) % 1000 / 1000 for c, k in copies]
            scale = gtotal / sum(raw_w)
            exact = [x * scale for x in raw_w]
            ws = [int(x) for x in exact]
            for i in sorted(range(len(ws)), key=lambda i: exact[i] - ws[i], reverse=True)[: gtotal - sum(ws)]:
                ws[i] += 1
            weighted += [(c, k, w) for (c, k), w in zip(copies, ws)]
        mid = CLONE_OFFSETS.index(0)
        for c, k, w in weighted:
            for prior in range(-1, N_PRIOR + 1):
                src = c
                if prior > 0 and c.get("referral_due_at"):
                    src = {**src, "referred_at": c["referral_due_at"]}
                shift = CLONE_OFFSETS[k] - prior * PRIOR_SHIFT
                if shift < 0 and not c.get("final_reply_at"):
                    # Still open at the freeze: a copy received earlier has run on past the point the original has
                    # reached, so it gets its decision 0-40 days after that point (deterministic per copy).
                    extra = int(hashlib.sha1(f"reply:{c['id']}:{k}:{prior}".encode()).hexdigest(), 16) % 40
                    src = {**src, "final_reply_at": (END + dt.timedelta(days=extra)).isoformat(timespec="minutes")}
                x = _shift(src, shift)
                x["id"] = c["id"] if (k == mid and prior == 0) else f"{c['id']}~{k}{prior}"
                x["original"] = k == mid and prior == 0
                x["prior"] = dt.datetime.fromisoformat(x["received_at"]) < START_OF_WINDOW
                x["w"] = w
                out.append(x)
    return out


def referral_open(ref: dt.datetime | None, T: dt.datetime) -> bool:
    return ref is not None and ref <= T < ref + REFERRAL_OPEN


# ---------------------------------------------------------------- one register for the ladders
# The escalation ladders (bank-wide on the service standards view, per product on the deep-dive view) read the
# complaint rungs from the same steady register the ARN watch reads, as flows in the period:
#   Complaint         complaints received in the period
#   Complaints team   complaints passed to the complaints team in the period: not settled by the close of the third
#                     business day at the Kundcenter or kontor
#   Bank's final decision  the bank's decisions issued in the period to complaints that reached the complaints team
#   ARN               filings with ARN made in the period
# Rung names in screen order; periods_v3 and check_reconcile_v3 match on these strings.
LADDER_RUNGS = ("Complaint", "Complaints team", "Bank's final decision", "ARN")
SUMMARY_DAYS = 3


def summary_close(received: dt.datetime) -> dt.datetime:
    """Close of the third business day after the complaint was received (settled at first contact, before the
    complaints team)."""
    d, n = received, 0
    while n < SUMMARY_DAYS:
        d += dt.timedelta(days=1)
        if is_business_day(d):
            n += 1
    return d.replace(hour=23, minute=59)


def ladder_flows(steady: list[dict], a: dt.datetime, b: dt.datetime) -> dict:
    """Complaint rungs for one scope (pass a product's slice) and one period [a, b)."""
    t = lambda c, k: dt.datetime.fromisoformat(c[k]) if c.get(k) else None  # noqa: E731
    out = dict.fromkeys(LADDER_RUNGS, 0)
    for c in steady:
        rec, reply, ref = t(c, "received_at"), t(c, "final_reply_at"), t(c, "referred_at")
        past_summary = reply is None or reply > summary_close(rec)
        if a <= rec < b and not c.get("prior"):
            out["Complaint"] += c["w"]
        sc = summary_close(rec)
        if past_summary and a <= sc < b and sc <= END:
            out["Complaints team"] += c["w"]
        if reply and a <= reply < b and reply <= END and past_summary:
            out["Bank's final decision"] += c["w"]
        if ref and a <= ref < b and ref <= END:
            out["ARN"] += c["w"]
    return out
