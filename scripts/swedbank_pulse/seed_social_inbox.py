"""NW-D100: the internal social-inbox handling layer (synthetic, internal · illustrative).

One record for every on-topic X and Reddit post with reach (the high-impact set) and for every high-priority mention
(a listed customer's post in the internal social inbox). Each record carries how the social team handled the post:
acknowledged · replied in thread · moved to secure message · no action, with the handling time in hours.

Proportions: about 65% handled within 24 hours, spread evenly through time (like the mention replies in
seed_internal_v3), so the rate stays steady whichever period is chosen. A high-priority mention the bank replied to in
public (mention_replied) is always "replied in thread", so the mentions' existing reply figure and this layer agree.
Draws come from the record id (no random stream), so re-running never moves another figure.

Writes data/seed/swedbank_pulse/social_inbox.json. Run after seed_internal_v3 (needs interactions and customers) and
classify (needs the public items).
"""
from __future__ import annotations

import collections
import datetime as dt
import hashlib
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import periods_v3 as P  # noqa: E402

WITHIN_24H = 0.65  # target share handled within 24 hours (60-70% band, checked in check_reconcile_v3)
LATER_SHARE = 0.55  # of the rest: handled after 24 hours; the remainder is no action
STATUSES = ("acknowledged", "replied_in_thread", "moved_to_secure_message", "no_action")
OUT = P.SEED_V3 / "social_inbox.json"


def u(key: str) -> float:
    return int(hashlib.sha1(key.encode()).hexdigest()[:12], 16) / 16**12


def spread(items):
    """items: (key, created, weight, forced_status|None) in time order -> records."""
    out = []
    rest = later = 0.0
    recent = collections.deque()  # (created, w, fast) over the last 7 days: the target holds in any week, not only overall
    for key, created, w, forced, kind, ref, source in items:
        while recent and created - recent[0][0] > dt.timedelta(days=7):
            recent.popleft()
        tot = sum(x[1] for x in recent) + w
        fast = sum(x[1] for x in recent if x[2])
        is_fast = bool(forced) or fast + w <= WITHIN_24H * tot + (0.5 * w if kind == "high_impact" else 0)  # sparse posts round half up
        recent.append((created, w, is_fast))
        if is_fast:
            pick = u(f"st:{key}")
            status = forced or ("acknowledged" if pick < 0.35 else "replied_in_thread" if pick < 0.7 and kind == "high_impact"
                                else "moved_to_secure_message")
            hours = round(0.5 + 22.5 * u(f"h:{key}") ** 1.6, 1)
        else:
            rest += w
            if later + w <= LATER_SHARE * rest + 0.5 * w:
                later += w
                status = "moved_to_secure_message" if u(f"st:{key}") < 0.6 else "acknowledged"
                hours = round(24.5 + 71.5 * u(f"h:{key}"), 1)
            else:
                status, hours = "no_action", None
        handled_at = None if hours is None else (created + dt.timedelta(hours=hours)).isoformat()
        out.append({"id": "SI-" + hashlib.sha1(key.encode()).hexdigest()[:10], "kind": kind, "ref": ref, "source": source,
                    "created_at": created.isoformat(), "w": w, "status": status, "handled_at": handled_at,
                    "handling_hours": hours})
    return out


def main():
    pub = P.load_public()
    reach = sorted((r for r in pub if r["source"] in ("x", "reddit") and P.reach(r)), key=lambda r: (r["_c"], r["id"]))
    inter, customers, _notes = P.load_internal()
    listed = {m for m, c in customers.items() if any(k in c["cohorts"] for k in P.PULSE_LISTS)}
    ment = sorted((r for r in inter if r["_ch"] == "social" and r["masked_id"] in listed), key=lambda r: (r["_c"], r["id"]))
    recs = spread([(f"pub:{r['id']}", r["_c"], 1, None, "high_impact", r["id"], r["source"]) for r in reach])
    # A mention the bank already replied to in public is "replied in thread"; the rest are spread to the 65% target.
    recs += spread([(f"ment:{r['id']}", r["_c"], r["w"], "replied_in_thread" if r.get("mention_replied") else None,
                     "mention", r["id"], "social_inbox") for r in ment])
    P.dump({"provenance": "internal", "note": "Synthetic social-inbox handling (NW-D100), internal · illustrative.",
            "statuses": list(STATUSES), "within_24h_target": WITHIN_24H, "records": recs}, OUT, indent=None)
    for kind in ("high_impact", "mention"):
        rs = [r for r in recs if r["kind"] == kind]
        W = sum(r["w"] for r in rs) or 1
        f = sum(r["w"] for r in rs if r["handling_hours"] is not None and r["handling_hours"] <= 24)
        h = sum(r["w"] for r in rs if r["status"] != "no_action")
        print(f"social inbox {kind}: {len(rs)} records, handled {100 * h / W:.0f}%, within 24h {100 * f / W:.0f}%")


if __name__ == "__main__":
    main()
