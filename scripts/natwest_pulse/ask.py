"""Ask LisN answer bank for the NatWest Group pulse (docs/natwest/brief.md Step 4): five questions for the persona
(cross-channel leak, Cora leakage, Ombudsman risk, brand gap, Consumer Duty evidence). Every answer is filled from
data/out/natwest_pulse/periods.json (last 7 days) and the register, and lists the ids it is bound to. No model calls.

Writes data/out/natwest_pulse/ask.json in the oct13 schema (prompts: id, prompt, keywords, answer, evidence, links).
Runs after periods_v3.py.
"""

from __future__ import annotations

import json

from common import CHANNEL_GROUP_LABEL, CHANNEL_GROUP_ORDER, OUT_APP, ROOT, dump

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
            "id": "brand_gap",
            "prompt": "Where is the gap between our brands?",
            "keywords": ["brand", "rbs", "royal", "scotland", "ulster", "natwest", "gap"],
            "answer": (
                f"Royal Bank of Scotland: app {reg['REG-CMA-RBS-APP']['value'].split(' vs ')[0]} against "
                f"{reg['REG-CMA-RBS-APP']['value'].split(' vs ')[1]} for overall service (CMA, August 2026). "
                + ("Brand voice in public is on the market view." if public_loaded else "Brand voice in public: not yet loaded.")
            ),
            "evidence": [],
            "bound": ["REG-CMA-RBS-APP"] + ([] if public_loaded else ["L2:sources"]),
            "links": [{"label": "Open the market view", "href": f"{BASE}/market"}],
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
