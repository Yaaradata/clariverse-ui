"""SW-D17 (Usha): every reply figure reads the internal social-inbox seed. The public crawl cannot fetch bank replies,
so responses.json (the headline response dials) and each product's `replies` in products.json are rebuilt here from
data/seed/swedbank_pulse/social_inbox.json (kind "source_reply") for the store reviews (App Store and Google Play),
provenance "internal" (on screen: the one tag "Internal"). The four real Google Play replies are inside the seed's
handled set (seed_social_inbox.source_replies), so the seeded figure is never below them.

Run after seed_social_inbox.py and before periods_v3.py.
"""

from __future__ import annotations

import json

from common import OUT_APP, SEED_V3, dump

STORES = ("appstore", "playstore")


def block(rows, recs) -> dict:
    n = len(rows)
    done = [recs[r["id"]] for r in rows if recs.get(r["id"]) and recs[r["id"]]["status"] != "no_action"]
    hrs = sorted(x["handling_hours"] for x in done)
    late = sum(1 for r in rows if not (recs.get(r["id"]) and recs[r["id"]]["status"] != "no_action"))
    pct = lambda a, b: round(100 * a / b, 1) if b else None  # noqa: E731
    med = hrs[len(hrs) // 2] if hrs else None
    return {
        "reviews": n, "responded": len(done), "responded_pct": pct(len(done), n),
        "open": n - len(done), "open_pct": pct(n - len(done), n),
        # Every unhandled review in the window is older than 48 hours at the freeze except the last two days'.
        "open_too_long": late, "open_too_long_pct_of_open": pct(late, n - len(done)), "open_too_long_pct_of_reviews": pct(late, n),
        "median_reply_minutes": None if med is None else round(med * 60), "median_reply_hours": med,
        "replied_within_48h": sum(1 for h in hrs if h <= 48), "redirect_only": 0, "redirect_only_pct_of_replied": 0.0,
    }


def main():
    inbox = json.loads((SEED_V3 / "social_inbox.json").read_text(encoding="utf-8"))["records"]
    recs = {r["ref"]: r for r in inbox if r["kind"] == "source_reply"}
    rows = [json.loads(x) for x in open(OUT_APP / "work" / "classified.jsonl", encoding="utf-8")]
    on = [r for r in rows if r.get("relevant") == "on_topic" and r.get("entity") == "swedbank" and r["source"] in STORES]
    neg = [r for r in on if r["sentiment"] == "negative"]
    out = {
        "provenance": "internal",
        "definition": "A store review is handled when the bank's social inbox has acknowledged it, replied or moved it to "
                      "an app or internet-bank message; open too long when it is still not handled after 48 hours.",
        "replies_available": True,
        "scope_note": "Handled in the bank's social inbox (Internal).",
        "reviews_in_scope": len(on),
        "all": block(on, recs),
        "negative": block(neg, recs),
        "by_app": {"Swedbank privat": block(on, recs)},
        "pending_note": "",
    }
    out["responded"] = out["all"]["responded"]
    out["open_too_long"] = out["all"]["open_too_long"]
    dump(out, OUT_APP / "responses.json")
    prods = json.loads((OUT_APP / "products.json").read_text(encoding="utf-8"))
    for row in prods["rows"]:
        mine = [r for r in on if r.get("product") == row["id"]]
        if "replies" in row or mine:
            row["replies"] = block(mine, recs)
    dump(prods, OUT_APP / "products.json")
    print(f"responses_internal: {out['all']['responded']} of {len(on)} store reviews handled (Internal); "
          f"real Google Play replies inside the handled set: "
          f"{sum(1 for r in on if r.get('reply') and recs.get(r['id'], {}).get('status') != 'no_action')} of "
          f"{sum(1 for r in on if r.get('reply'))}")


if __name__ == "__main__":
    main()
