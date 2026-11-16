"""Ask LisN answer bank for the NatWest pulse (docs/natwest/brief.md Step 4): five questions for the persona
(cross-channel leak, Cora leakage, Ombudsman risk, journey leak, Consumer Duty evidence). Every answer is filled from
data/out/natwest_pulse/periods.json (last 7 days) and the register, and lists the ids it is bound to. No model calls.

Writes data/out/natwest_pulse/ask.json in the oct13 schema (prompts: id, prompt, keywords, answer, evidence, links).
Runs after periods_v3.py.
"""

from __future__ import annotations

import json

import collections
import datetime as dt

from common import CHANNEL_GROUP_LABEL, CHANNEL_GROUP_ORDER, JOURNEY_ORDER, JOURNEY_STAGE, OUT_APP, ROOT, SEED_V3, dump

BASE = "/natwest-pulse/v1"


def fmt(n) -> str:
    return "—" if n is None else f"{round(n):,}"


def pct(a, b) -> str:
    return "—" if not b else f"{100 * a / b:.0f}%"


def main():
    per = json.loads((OUT_APP / "periods.json").read_text(encoding="utf-8"))["periods"]["7d"]
    reg = {e["id"]: e for e in json.loads((ROOT / "data" / "public" / "natwest_register.json").read_text(encoding="utf-8"))["entries"]}
    meta = json.loads((OUT_APP / "meta.json").read_text(encoding="utf-8"))
    public_loaded = bool(meta.get("public_loaded"))
    cx = per["cx_pulse"]["internal"]
    ch = cx["by_channel"]
    leak = max(CHANNEL_GROUP_ORDER, key=lambda g: (ch.get(g, {}).get("open_too_long", 0)) / max(ch.get(g, {}).get("volume", 1), 1))
    cora = ch.get("whatsapp", {})
    calls = ch.get("calls", {})
    om = per["ombudsman"]
    now = om["now"]
    lists = {x["id"]: x for x in per["customer_pulse"]["lists"]}
    vul = lists["priority_a"]
    # Journey leak (Pass 3): switching-intent contacts in the last 7 days, at bank scale, placed at the journey stage of
    # the customer's last negative contact before them (the satisfaction view's rule).
    a, b = dt.datetime.fromisoformat(per["start"]), dt.datetime.fromisoformat(per["end"])
    inter = [json.loads(x) for x in open(SEED_V3 / "interactions.jsonl", encoding="utf-8")]
    inter.sort(key=lambda r: r["created_at"])
    last_neg: dict[str, str] = {}
    leak_by = collections.Counter()
    for r in inter:
        t = dt.datetime.fromisoformat(r["created_at"])
        if r["theme"] == "closure_requests":
            if a <= t < b:
                leak_by[last_neg.get(r["masked_id"], "none")] += r["w"]
        elif r["sentiment"] == "negative":
            last_neg[r["masked_id"]] = JOURNEY_STAGE.get(r["theme"], "Everyday banking")
    leak_total = sum(leak_by.values())
    leak_rank = sorted(JOURNEY_ORDER, key=lambda st: -leak_by[st])
    no_prior = leak_by["none"]
    prompts = [
        {
            "id": "cross_channel",
            "prompt": "Where is the customer experience leaking across channels?",
            "keywords": ["channel", "leak", "leaking", "calls", "cora", "branch", "cross"],
            "answer": (
                f"Last 7 days: {fmt(cx['volume'])} contacts; {fmt(cx['open_too_long'])} open more than 48 hours. "
                f"The highest share open too long is {CHANNEL_GROUP_LABEL[leak]} "
                f"({pct(ch[leak]['open_too_long'], ch[leak]['volume'])}). "
                + ("Public voice is shown separately." if public_loaded else "Public data not yet loaded.")
            ),
            "evidence": [],
            "bound": ["L3:cx_pulse.internal.by_channel"] + ([] if public_loaded else ["L2:sources"]),
            "links": [{"label": "Open the CX pulse", "href": f"{BASE}/mds-office?period=7d"}],
        },
        {
            "id": "cora_leakage",
            "prompt": "How much comes back after Cora, as a call or a complaint?",
            "keywords": ["cora", "chatbot", "assistant", "leakage", "back", "resolved"],
            "answer": (
                f"Last 7 days: Cora took {fmt(cora.get('volume'))} contacts and resolved {fmt(cora.get('resolved'))}; "
                f"{fmt(cora.get('open'))} are still open. Calls: {fmt(calls.get('volume'))}. "
                "The 7-day return to a call or complaint needs Cora logs joined to call records inside the bank."
            ),
            "evidence": [],
            "bound": ["L3:cx_pulse.internal.by_channel.whatsapp", "L3:cx_pulse.internal.by_channel.calls"],
            "links": [{"label": "Open the Cora module", "href": f"{BASE}/module/cora_digital"}],
        },
        {
            "id": "ombudsman_risk",
            "prompt": "How many complaints could go to the Financial Ombudsman Service?",
            "keywords": ["ombudsman", "fos", "final", "response", "eligible", "risk", "refer"],
            "answer": (
                f"As at {om['as_of'][:10]}: {fmt(now['brink'])} complaints are within 10 days of the final-response "
                f"deadline, {fmt(now['eligible'])} are past it with no final response, {fmt(now['unhappy'])} are unhappy "
                f"with the final response, and {fmt(now['awaiting_io'])} have been referred. Rules: "
                f"{reg['REG-DISP-8W']['value']}; payment services {reg['REG-PSD-15']['value']}. "
                "Eligibility and risk only; LisN does not predict who will refer."
            ),
            "evidence": [],
            "bound": ["L3:ombudsman.now", "REG-DISP-8W", "REG-PSD-15", "REG-FOS-6M"],
            "links": [{"label": "Open the Ombudsman watch", "href": f"{BASE}/mds-office#ombudsman"}],
        },
        {
            "id": "journey_leak",
            "prompt": "Which journey is leaking most customers this week?",
            "keywords": ["journey", "leak", "leaking", "switch", "close", "stage", "customers", "week"],
            "answer": (
                f"{leak_rank[0]}: {fmt(leak_by[leak_rank[0]])} of the {fmt(leak_total)} switching-intent contacts in "
                f"the last 7 days came after a negative contact at that stage. Next: {leak_rank[1]} "
                f"({fmt(leak_by[leak_rank[1]])}) and {leak_rank[2]} ({fmt(leak_by[leak_rank[2]])}); {fmt(no_prior)} had no "
                "earlier negative contact. Internal, illustrative."
            ),
            "evidence": [],
            "bound": ["L3:interactions.closure_requests", "L3:satisfaction.journey_stages"],
            "links": [{"label": "Open the journey stages", "href": f"{BASE}/satisfaction#journey"}],
        },
        {
            "id": "consumer_duty",
            "prompt": "What is the Consumer Duty evidence for financially vulnerable customers?",
            "keywords": ["consumer", "duty", "vulnerable", "outcomes", "fair", "value", "evidence"],
            "answer": (
                f"Last 7 days: {fmt(vul['volume'])} contacts from customers flagged financially vulnerable; "
                f"{fmt(vul['open'])} open, {fmt(vul['not_responded_48h'])} with no reply after 48 hours. "
                f"Consumer Duty outcomes: {reg['REG-CD-OUTCOMES']['value']}."
            ),
            "evidence": [],
            "bound": ["L3:customer_pulse.lists.priority_a", "REG-CD-OUTCOMES"],
            "links": [{"label": "Open priority relationships", "href": f"{BASE}/priority"}],
        },
    ]
    dump({"prompts": prompts, "fallback": "I'd need your data for that. Here is what I'd look at: the CX pulse, the "
          "Cora module and the Ombudsman watch."}, OUT_APP / "ask.json")
    print("ask.json:", len(prompts), "prompts")


if __name__ == "__main__":
    main()
