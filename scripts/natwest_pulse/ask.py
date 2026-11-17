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


def as_of(iso: str) -> str:
    """12 Nov, 07:45: the date form every other screen uses."""
    t = dt.datetime.fromisoformat(iso)
    return f"{t.day} {t.strftime('%b')}, {t.strftime('%H:%M')}"


def pct(a, b) -> str:
    return "—" if not b else f"{100 * a / b:.0f}%"


def main():
    pers = json.loads((OUT_APP / "periods.json").read_text(encoding="utf-8"))["periods"]
    per, full = pers["7d"], pers["all"]
    reg = {e["id"]: e for e in json.loads((ROOT / "data" / "public" / "natwest_register.json").read_text(encoding="utf-8"))["entries"]}
    meta = json.loads((OUT_APP / "meta.json").read_text(encoding="utf-8"))
    public_loaded = bool(meta.get("public_loaded"))
    cx = per["cx_pulse"]["internal"]
    ch = cx["by_channel"]
    leak = max(CHANNEL_GROUP_ORDER, key=lambda g: (ch.get(g, {}).get("open_too_long", 0)) / max(ch.get(g, {}).get("volume", 1), 1))
    cora = ch.get("whatsapp", {})
    calls = ch.get("calls", {})
    om = per["ombudsman"]
    ret = full["cora"].get("returns", {})
    now = om["now"]
    lists = {x["id"]: x for x in per["customer_pulse"]["lists"]}
    vul = lists["priority_a"]
    # Journey leak (Pass 3; review round 3, NW-D67): the answer reads the /satisfaction journey-stages table (the demo
    # sample since 1 August), so the answer and the table it links to always agree.
    agg = json.loads((SEED_V3 / "aggregates.json").read_text(encoding="utf-8"))
    jt = agg["satisfaction"]["journey_stages"]
    leak_by = collections.Counter({x["stage"]: x["closure_intent"] for x in jt["rows"]})
    leak_total = sum(leak_by.values())
    leak_rank = sorted(JOURNEY_ORDER, key=lambda st: -leak_by[st])
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
            "links": [{"label": "Open the CX pulse", "href": f"{BASE}/mds-office?period=7d#cx-pulse"}],
        },
        {
            "id": "cora_leakage",
            "prompt": "How much comes back after Cora, as a call or a complaint?",
            "keywords": ["cora", "chatbot", "assistant", "leakage", "back", "resolved"],
            "answer": (
                f"Last 7 days: Cora took {fmt(cora.get('volume'))} contacts and resolved {fmt(cora.get('resolved'))}; "
                f"{fmt(cora.get('open'))} are still open. Calls: {fmt(calls.get('volume'))}. "
                + (f"Since 1 August, {fmt(ret['back_7d'])} of {fmt(ret['resolved'])} Cora conversations resolved by "
                   f"{as_of(ret['until'])[:-7]} ({pct(ret['back_7d'], ret['resolved'])}) came back as a call or a complaint within 7 "
                   "days. Internal, illustrative." if ret.get("resolved") else "")
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
                f"As of {as_of(om['as_of'])}: {fmt(now['brink'])} complaints are within 10 days of the final-response "
                f"deadline, {fmt(now['eligible'])} are past it with no final response, {fmt(now['unhappy'])} are unhappy "
                f"with the final response, and {fmt(now['awaiting_io'])} have been referred. Rules: "
                f"{reg['REG-DISP-8W']['value']}; payment services {reg['REG-PSD-15']['value']}. "
                "Eligibility and risk only; LisN does not predict who will refer."
            ),
            "evidence": [],
            "bound": ["L3:ombudsman.now", "REG-DISP-8W", "REG-PSD-15", "REG-FOS-6M"],
            "links": [{"label": "Open the Financial Ombudsman watch", "href": f"{BASE}/mds-office#ombudsman-watch"}],
        },
        {
            "id": "journey_leak",
            "prompt": "Which journey is leaking most customers this week?",
            "keywords": ["journey", "leak", "leaking", "switch", "close", "stage", "customers", "week"],
            "answer": (
                f"{leak_rank[0]}: {fmt(leak_by[leak_rank[0]])} of the {fmt(leak_total)} switching-intent contacts in "
                f"the journey-stages table (sample of {fmt(jt['total'])} contacts since 1 August) followed a contact at "
                f"that stage. Next: {leak_rank[1]} ({fmt(leak_by[leak_rank[1]])}) and {leak_rank[2]} "
                f"({fmt(leak_by[leak_rank[2]])}). One week of the sample is too thin to rank stages. Internal, illustrative."
            ),
            "evidence": [],
            "bound": ["L3:satisfaction.journey_stages"],
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
            "links": [{"label": "Open priority customers", "href": f"{BASE}/priority"}],
        },
    ]
    dump({"prompts": prompts, "fallback": "I'd need your data for that. Here is what I'd look at: the CX pulse, the "
          "Cora module and the Ombudsman watch."}, OUT_APP / "ask.json")
    print("ask.json:", len(prompts), "prompts")


if __name__ == "__main__":
    main()
