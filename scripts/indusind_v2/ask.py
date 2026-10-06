"""Stage 3b · Ask LisN answers (B4 §7): eight prompts answered from the Jul–Sep aggregates, each citing 2–4 evidence ids.

Writes data/out/indusind_v2/ask.json. Deterministic: templates filled from the aggregates, no live model.
"""

from __future__ import annotations

import json

from normalise import OUT

BASE = "/role-based/indusind_bank/pulse-v2"
RT = {
    "card_delivery": "card delivery", "refund": "refunds", "reversal": "failed-transaction reversal", "dispute": "disputes",
    "closure": "closure", "loan_disbursal": "loan disbursal", "credit_report": "credit-report correction",
    "kyc": "KYC and profile updates", "other": "other requests",
}


def fmt(n) -> str:
    s = str(int(round(n)))
    if len(s) <= 3:
        return s
    head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:])
        head = head[:-2]
    if head:
        parts.insert(0, head)
    return ",".join(parts + [tail])


def trend(t) -> str:
    r = t.get("rise_pct")
    if r is None:
        return "no trend claimed"
    return f"{'up' if r >= 0 else 'down'} {abs(round(r))}% in the second half of the window vs the first"


def main():
    th = json.load(open(OUT / "themes.json", encoding="utf-8"))
    sig = json.load(open(OUT / "signals.json", encoding="utf-8"))
    br = json.load(open(OUT / "briefing.json", encoding="utf-8"))
    resp = json.load(open(OUT / "responses.json", encoding="utf-8"))
    ev = json.load(open(OUT / "evidence.json", encoding="utf-8"))
    tm = {t["id"]: t for t in th["themes"]}
    rp = br["release_pulse"]

    def cite(ids, n=3):
        return [i for i in ids if i in ev][:n]

    prompts = []
    # 1 MD's desk
    needs = [tm[i] for i in br["needs_you"] if i in tm]
    lines = [f"• {t['label']}: {fmt(t['count'])} items, {trend(t)}; {fmt(t['escalation_count'])} name a regulator, court or ombudsman. Owner: {t['owner_label']}." for t in needs]
    prompts.append({
        "id": "md_desk",
        "prompt": "What would reach the MD's desk this week if we did nothing?",
        "keywords": ["md", "desk", "nothing", "reach", "escalate", "managing", "director", "mds"],
        "answer": "\n".join(
            [f"Complaints closed without resolution: {fmt(tm['complaint_handling']['count'])} public items, {fmt(tm['complaint_handling']['escalation_count'])} with escalation language. Owner: CX."]
            + ([f"The INDIE app (all versions): {fmt(rp['count'])} negative reviews in the window. Owner: Digital."] if rp else [])
            + ["Themes rising fastest:"] + lines
        ),
        "evidence": cite(tm["complaint_handling"]["exemplars"][:2] + [e for t in needs for e in t["exemplars"][:1]], 4),
        "links": [{"label": "Open the release pulse", "href": f"{BASE}/signal/release-pulse"}, {"label": "Open the deliverables view", "href": f"{BASE}/deliverables"}],
    })
    # 2 IO
    climb = sorted([t for t in th["themes"] if t["count"] >= 15 and t["share_escalation"]], key=lambda t: -(t["share_escalation"] or 0))[:3]
    prompts.append({
        "id": "io",
        "prompt": "Which complaints are most likely to go to the Internal Ombudsman?",
        "keywords": ["internal", "ombudsman", "io", "complaints", "likely", "climb", "rbi", "escalation"],
        "answer": "Climb risk is highest where customers already use escalation language and repeat themselves:\n" + "\n".join(
            f"• {t['label']}: {t['share_escalation']}% of {fmt(t['count'])} items carry escalation language; {fmt(t['repeat_count'])} say they have raised it before." for t in climb
        ),
        "evidence": cite([e for t in climb for e in t["exemplars"][:1]]),
        "links": [{"label": "See the escalation ladder", "href": f"{BASE}/deliverables#ladder"}],
    })
    # 3 seasonal
    riser = tm.get(br["top_riser"]) if br["top_riser"] else None
    if riser:
        prompts.append({
            "id": "seasonal",
            "prompt": f"Is the {riser['label'].lower()} spike seasonal or new?",
            "keywords": ["seasonal", "spike", "new", "trend", "baseline"] + riser["label"].lower().split()[:3],
            "answer": f"{riser['label']}: {fmt(riser['count'])} items in the window, {trend(riser)}. First heard in this window on {riser['first_seen'][:10]}. The exports hold no history before July, so LisN shows the trend within the window and makes no baseline claim. Seasonal check: in discovery, using your history.",
            "evidence": cite(riser["exemplars"]),
            "links": [{"label": f"Open {riser['label']}", "href": f"{BASE}/signal/{riser['id']}"}],
        })
    # 4 TAT
    pb = sig["promise_by_request_type"]
    prompts.append({
        "id": "tat",
        "prompt": "Where did we miss a TAT this week?",
        "keywords": ["tat", "promise", "break", "yesterday", "broke", "turnaround", "timeline", "delay", "week"],
        "answer": f"{fmt(sig['flags']['promise_break']['count'])} public items in the window describe a missed timeline. Most frequent: "
        + ", ".join(f"{RT.get(p['request_type'], p['request_type'])} ({fmt(p['count'])})" for p in pb[:4])
        + ". Stated TATs are checked against the bank's own commitments in discovery.",
        "evidence": cite([e for p in pb[:3] for e in p["exemplars"][:1]]),
        "links": [{"label": "Open the deliverables ledger", "href": f"{BASE}/deliverables#ledger"}],
    })
    # 5 cure
    cw = sig["cure_watch"]
    prompts.append({
        "id": "cure",
        "prompt": "Where did a proactive cure not land?",
        "keywords": ["cure", "proactive", "land", "declined", "failed", "decline", "blocked"],
        "answer": f"{fmt(cw['count'])} items follow a decline, failed payment or block that a proactive message, auto-reversal or unblock could have handled, and the customer still had to chase it. Leading areas: "
        + ", ".join(f"{d['label']} ({fmt(d['count'])})" for d in cw["by_theme"][:3]) + ".",
        "evidence": cite(cw["exemplars"]),
        "links": [{"label": "See cure watch", "href": f"{BASE}/deliverables#cure"}],
    })
    # 6 product
    dig = [r for r in br["routing"] if r["owner"] in ("digital", "product")]
    asks = [a for f in (rp["fix_list"] if rp else []) for a in f["feature_asks"]][:4]
    prompts.append({
        "id": "product",
        "prompt": "What should Product hear this week?",
        "keywords": ["product", "hear", "week", "digital", "feature", "app", "should"],
        "answer": "Product and Digital should hear:\n" + "\n".join(f"• {t['label']}: {fmt(t['count'])} items" for r in dig for t in r["themes"])
        + (f"\nTop feature asks from app reviews: {', '.join(asks)}." if asks else ""),
        "evidence": cite([e for r in dig for t in r["themes"] for e in tm[t["id"]]["exemplars"][:1]]),
        "links": [{"label": "Who should hear what", "href": f"{BASE}/head-cx#routing"}],
    })
    # 7 release
    if rp:
        prompts.append({
            "id": "release",
            "prompt": "What are customers saying about the latest app release?",
            "keywords": ["app", "release", "latest", "version", "update", "new", "mobile", "banking"],
            "answer": f"Release pulse for the INDIE app, one store at a time: on the Play Store {rp['by_store']['playstore']['share_positive']}% of {fmt(rp['by_store']['playstore']['n_reviews'])} window reviews are positive (4–5★); on the App Store {rp['by_store']['appstore']['share_positive']}% of {fmt(rp['by_store']['appstore']['n_reviews'])}. The fix list customers have written:\n"
            + "\n".join(f"• {f['issue']}: {fmt(f['count'])} negative reviews" for f in rp["fix_list"][:4]),
            "evidence": cite(rp["exemplars"]),
            "links": [{"label": "Open the app module", "href": f"{BASE}/module/digital"}],
        })
    # 8 replies (new: the bank's public replies)
    a, n = resp["all"], resp["negative"]
    prompts.append({
        "id": "replies",
        "prompt": "Are we answering customers in public?",
        "keywords": ["reply", "replies", "respond", "responded", "answer", "public", "review", "store"],
        "answer": f"On the Play Store the bank replied to {a['responded_pct']}% of {fmt(a['reviews'])} reviews in the window, with a median reply time of {a['median_reply_minutes']} minutes. But {n['redirect_only_pct_of_replied']}% of replies to negative reviews only redirect the customer to email, phone or chat rather than answering. {fmt(a['open_too_long'])} reviews still have no reply after 48 hours. X and App Store replies are not in this data.",
        "evidence": cite(rp["exemplars"] if rp else [], 2),
        "links": [{"label": "See the numbers", "href": f"{BASE}/mds-office#dials"}],
    })
    json.dump({"prompts": prompts, "fallback": "That needs your internal data. It's part of discovery."}, open(OUT / "ask.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(prompts), "prompts")


if __name__ == "__main__":
    main()
