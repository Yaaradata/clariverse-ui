"""Complaint register for the Ombudsman watch (docs/demo-rebuild/ombudsman_watch_design.md). Internal · illustrative.

Writes data/seed/internal_v3/complaints.jsonl: one record per formal complaint. It is deterministic: every random draw
comes from a per-complaint generator seeded with SEED and the complaint's id.

What is taken from the existing sample (interactions.jsonl), unchanged:
  the complaint     every contact the bank measured against the 30-day complaint-resolution rule
                    (deliverable "complaint_resolution"), except IVR bot calls
  received_at       the contact's created_at
  final_reply_at    the date the thread was closed, or the date a resolution was sent (waiting on the customer);
                    none while the thread is open
  issue             the customer's most recent earlier contact on the same product (the issue being escalated), or,
                    when there is none, a draw from that product's own issue mix
  contacts          the customer's later contacts: on the same product, or with escalation language on any product;
                    "same_issue" marks a negative contact on the same issue (the complaint's issue, or complaint handling)
What is synthetic (assumptions in MORNING_DECISIONS D26):
  outcome           resolved / partly rejected / rejected, for complaints with a final reply (about 10% rejected)
  decision_at       when the bank decided to partly or fully reject, which must be reviewed by the Internal Ombudsman
                    before the final reply (RBI directions, 16 Jan 2026)
  io_reviewed_at    when that review finished; for an open complaint with a decision it may still be pending
  unhappy_at / how  the customer coming back after the reply: reopening the complaint, or contacting again on the issue
                    (30% of rejected or partly rejected complaints, 2.2% of resolved ones)
All four come from complaint_rules.decide, which the seed also uses to mark the IO rung on the contact.
"""

from __future__ import annotations

import collections
import datetime as dt
import json
import random

from common import PERIOD_END, SEED, SEED_V3, load
from complaint_rules import decide

END = dt.datetime.fromisoformat(PERIOD_END)
LISTS = ("priority_a", "priority_b", "uhni")  # the bank's own lists (the derived "multi" cohort is not a list)
# Escalation language on a contact: an RBI or Ombudsman named, or legal / consumer-court language.
ESC_IMPACT = {"regulator_named": "RBI or Ombudsman named", "legal_language": "Consumer court or legal notice"}
ESC_RUNG = {"rbi_ombudsman": "RBI or Ombudsman named", "io": "RBI or Ombudsman named"}


def ts(s):
    return dt.datetime.fromisoformat(s) if s else None


def iso(t):
    return t.isoformat(timespec="minutes") if t else None


def escalation_terms(r) -> list[str]:
    terms = {ESC_IMPACT[h] for h in r["high_impact"] if h in ESC_IMPACT}
    if r.get("escalation") in ESC_RUNG:
        terms.add(ESC_RUNG[r["escalation"]])
    return sorted(terms)


def main():
    inter = [json.loads(line) for line in open(SEED_V3 / "interactions.jsonl", encoding="utf-8")]
    inter.sort(key=lambda r: (r["created_at"], r["id"]))
    customers = {c["masked_id"]: c for c in load(SEED_V3 / "customers.json")}
    by_cust = collections.defaultdict(list)
    for r in inter:
        by_cust[r["masked_id"]].append(r)
    # Each product's own issue mix, from negative contacts that are not the complaint itself.
    mix = collections.defaultdict(collections.Counter)
    for r in inter:
        if r["theme"] != "complaint_handling" and r["sentiment"] == "negative":
            mix[r["product"]][r["theme"]] += 1

    out = []
    for r in inter:
        if r["deliverable"] != "complaint_resolution" or r["channel"] == "ivr_bot":
            continue
        rng = random.Random(f"{SEED}:complaint:{r['id']}")
        received = ts(r["created_at"])
        earlier = [x for x in by_cust[r["masked_id"]]
                   if x["product"] == r["product"] and x["created_at"] < r["created_at"] and x["theme"] != "complaint_handling"]
        if earlier:
            issue = earlier[-1]["theme"]
        else:
            themes, weights = zip(*sorted(mix[r["product"]].items()))
            issue = rng.choices(themes, weights=weights)[0]

        d = decide(r)  # outcome, IO review and whether the customer came back: one set of rules (complaint_rules.py)
        reply, outcome, decision, io_done = d["reply"], d["outcome"], d["decision_at"], d["io_reviewed_at"]
        unhappy_at, unhappy_how = d["unhappy_at"], d["unhappy_how"]
        contacts = []
        for x in by_cust[r["masked_id"]]:
            if x["id"] == r["id"] or x["created_at"] <= r["created_at"]:
                continue
            terms = escalation_terms(x)
            same_product = x["product"] == r["product"]
            if not same_product and not terms:
                continue
            contacts.append({
                "at": x["created_at"],
                "channel": x["channel"],
                # A later contact on the same issue counts as a sign the customer is unhappy only when it is negative.
                "same_issue": same_product and x["theme"] in (issue, "complaint_handling") and x["sentiment"] == "negative",
                "escalation": terms,
            })
        cust = customers.get(r["masked_id"], {})
        out.append({
            "id": "CMP-" + r["id"].split("-", 1)[1],
            "source_id": r["id"],
            "w": r["w"],  # the bank-scale complaints this sample complaint stands for (scale_v3.py)
            "masked_id": r["masked_id"],
            "product": r["product"],
            "theme": issue,
            "channel": r["channel"],
            "received_at": r["created_at"],
            "final_reply_at": iso(reply),
            "outcome": outcome,
            "decision_at": iso(decision),
            "io_reviewed_at": iso(io_done),
            # Unhappy with the reply: the customer reopened the complaint or contacted the bank again on the issue.
            "unhappy_at": iso(unhappy_at),
            "unhappy_how": unhappy_how,
            "reopened_at": iso(unhappy_at) if unhappy_how == "reopened" else None,
            "escalation": escalation_terms(r),
            "lists": [c for c in cust.get("cohorts", []) if c in LISTS],
            "contacts": contacts,
        })
    with open(SEED_V3 / "complaints.jsonl", "w", encoding="utf-8") as f:
        for c in out:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
    replied = [c for c in out if c["final_reply_at"]]
    print("complaints", len(out), "replied", len(replied),
          "outcomes", dict(collections.Counter(c["outcome"] for c in replied)),
          "open with a decision", sum(1 for c in out if not c["final_reply_at"] and c["decision_at"]),
          "unhappy", sum(1 for c in out if c["unhappy_at"]))


if __name__ == "__main__":
    main()
