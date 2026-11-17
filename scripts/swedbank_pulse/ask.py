"""Ask LisN answer bank for the Swedbank pulse (docs/swedbank/kickoff_prompt.md Step 12, SW-D12): the five persona
questions of the Head of Customer Experience, Swedish Banking. Every answer is filled from
data/out/swedbank_pulse/periods.json, the public items (work/classified.jsonl) and the register, and lists the payload
paths it is bound to. Complaint figures are read from the ARN watch block of the same window, so an answer and the tile
it links to always agree (SW-D15 point 1). No model calls.

Writes data/out/swedbank_pulse/ask.json in the oct13 schema (prompts: id, prompt, keywords, answer, evidence, links,
figures). Runs after periods_v3.py.
"""

from __future__ import annotations

import collections
import datetime as dt
import json

from common import (CHANNEL_GROUP_LABEL, DEEP_DIVE_PRODUCT, JOURNEY_ORDER, OUT_APP, PRODUCT_LABEL, ROOT, SEED_V3,
                    dump)

BASE = "/swedbank-pulse/v1"
# SW-D16: the store reviews about the app update, crashes and BankID sign-in (Q2).
APP_THEMES = {"new_app_release", "app_speed_crash", "app_login_biometrics", "app_usability", "online_banking"}
NINA_THEMES = ("nina_unresolved", "nina_wrong_answer", "nina_handoff_lost", "nina_no_person")


def fmt(n) -> str:
    return "—" if n is None else f"{round(n):,}"


def pct(a, b) -> str:
    return "—" if not b else f"{100 * a / b:.0f}%"


def day(iso: str) -> str:
    t = dt.date.fromisoformat(iso[:10])
    return f"{t.day} {t.strftime('%b')}"


def cohort(lists: list[dict], words: tuple[str, ...], fallback: str) -> dict:
    for x in lists:
        if any(w in (x.get("label") or "").lower() for w in words):
            return x
    return next((x for x in lists if x["id"] == fallback), lists[0])


def public_rows() -> list[dict]:
    f = OUT_APP / "work" / "classified.jsonl"
    if not f.exists():
        return []
    rows = [json.loads(x) for x in open(f, encoding="utf-8") if x.strip()]
    return [r for r in rows if r.get("relevant") == "on_topic" and r.get("entity") == "swedbank"]


def main():
    pers = json.loads((OUT_APP / "periods.json").read_text(encoding="utf-8"))["periods"]
    week, full = pers["7d"], pers["all"]
    reg = {e["id"]: e for e in json.loads((ROOT / "data" / "public" / "swedbank_register.json").read_text(encoding="utf-8"))["entries"]}

    # 1 · NKI: where satisfaction is being lost this month (the full window is the month). The journey-stages table
    # and the product cards are the two reads the satisfaction page shows.
    agg = json.loads((SEED_V3 / "aggregates.json").read_text(encoding="utf-8"))
    jt = agg["satisfaction"]["journey_stages"]
    leak_by = collections.Counter({x["stage"]: x["closure_intent"] for x in jt["rows"]})
    leak_rank = sorted(JOURNEY_ORDER, key=lambda st: -leak_by[st])
    biz = sorted(full["businesses"], key=lambda x: -(x["internal"].get("negative") or 0))
    top = biz[0]
    top_issue = (top.get("top_issue") or {}).get("label")

    # 2 · SW-D16: what the app update cost in the stores this month (the full window is the month).
    pub = public_rows()
    store = [r for r in pub if r["source"] in ("appstore", "playstore")]
    store_neg = sum(1 for r in store if r["sentiment"] == "negative")
    upd_rows = [r for r in store if r["sentiment"] == "negative" and r["themes"][0] in APP_THEMES]
    upd_neg = len(upd_rows)
    store_rows = []
    for src, label in (("playstore", "Google Play"), ("appstore", "App Store")):
        xs = [r["rating"] for r in store if r["source"] == src and r.get("rating")]
        store_rows.append({"label": label, "n": len(xs), "avg": sum(xs) / len(xs) if xs else 0})
    cats = {c["id"]: c for c in full["cards"]["categories"]}
    app_contacts = sum(cats[k]["internal"]["volume"] for k in ("app_update", "app_reliability") if k in cats)

    # 3 · ARN-eligible this week: the ARN watch of the last 7 days.
    om = week["ombudsman"]
    now = om["now"]
    at_risk = sorted(om["by_business"], key=lambda x: -(x.get("at_risk") or 0))

    # 4 · Account-measure customers with no owner: the cohort's owners-alerted figure (n of m).
    lists = week["customer_pulse"]["lists"]
    am = cohort(lists, ("account-measure", "account measure", "frozen"), "priority_b")
    rm = am.get("rm") or {}
    no_owner = (rm.get("of") or 0) - (rm.get("alerted") or 0)

    # 5 · Nina: where it hands off and loses the customer.
    nina = full.get("cora") or {}
    rows = [x for x in nina.get("rows", []) if x["id"] in NINA_THEMES]
    rows.sort(key=lambda x: -(x["internal"].get("volume") or 0))
    ret = nina.get("returns") or {}
    ch = week["cx_pulse"]["internal"]["by_channel"]
    nina_ch = ch.get("whatsapp", {})

    prompts = [
        {
            "id": "nki_lost",
            "prompt": "Where is NKI being lost this month?",
            "keywords": ["nki", "ski", "satisfaction", "lost", "losing", "month", "journey", "score"],
            "answer": (
                f"Since 22 Oct: the most negative contacts are in {top['label']} ({fmt(top['internal'].get('negative'))} of "
                f"{fmt(top['internal'].get('volume'))} contacts"
                + (f"; top issue {top_issue}" if top_issue else "")
                + f"). By journey, {leak_rank[0]} leads switching intent ({fmt(leak_by[leak_rank[0]])} contacts), then "
                f"{leak_rank[1]} ({fmt(leak_by[leak_rank[1]])}). NKI target: {reg['REG-NKI-TARGET']['value']}; "
                f"SKI 2026: {reg['REG-SKI-2026']['value']}."
            ),
            "evidence": [],
            "figures": {"negative": top["internal"].get("negative"), "volume": top["internal"].get("volume")},
            "period": "all",
            "bound": ["L3:businesses.internal", "L3:satisfaction.journey_stages", "REG-NKI-TARGET", "REG-SKI-2026"],
            "links": [{"label": "Open satisfaction", "href": f"{BASE}/satisfaction?period=all"}],
        },
        {
            "id": "app_update",
            "prompt": "What did the app update cost us in the stores this month?",
            "keywords": ["app", "update", "release", "version", "stores", "reviews", "rating", "cost", "google play", "app store"],
            "answer": (
                f"Since 22 Oct the stores hold {fmt(len(store))} reviews of the app, {fmt(store_neg)} negative "
                f"({pct(store_neg, len(store))}); {fmt(upd_neg)} of the negative ones are about the update, crashes or BankID "
                f"sign-in. "
                + "; ".join(f"{s_['label']}: {fmt(s_['n'])} reviews, average {s_['avg']:.1f} stars" for s_ in store_rows if s_["n"])
                + f". Inside the bank, the app update and crash categories carry {fmt(app_contacts)} contacts in the window."
            ),
            "evidence": [r["id"] for r in sorted(upd_rows, key=lambda r: r["created_at"], reverse=True)[:3]],
            "figures": {"store_reviews": len(store), "store_negative": store_neg, "update_negative": upd_neg,
                        "app_contacts": app_contacts},
            "period": "all",
            "bound": ["L2:store reviews", "L3:cards.categories app_update app_reliability", "L3:cards.stores"],
            "links": [{"label": "Open Everyday accounts and app", "href": f"{BASE}/business/{DEEP_DIVE_PRODUCT}?period=all"}],
        },
        {
            "id": "arn_eligible",
            "prompt": "Which complaints are ARN-eligible this week?",
            "keywords": ["arn", "eligible", "complaints", "kundombudsman", "final", "decision", "week", "risk"],
            "answer": (
                f"As of {day(om['as_of'])}: {fmt(now.get('unhappy'))} complaints are unhappy with the bank's final decision "
                f"(ARN eligible), {fmt(now.get('eligible'))} have a first reply overdue, and {fmt(now.get('awaiting_io'))} "
                f"have been filed with ARN. Most at risk: {at_risk[0]['label']} ({fmt(at_risk[0].get('at_risk'))}), then "
                f"{at_risk[1]['label']} ({fmt(at_risk[1].get('at_risk'))}). ARN: {reg['REG-ARN']['value']}. "
                "Eligibility and risk only; LisN does not predict who will file."
            ),
            "evidence": [],
            "figures": {k: now.get(k) for k in ("brink", "eligible", "unhappy", "awaiting_io", "at_risk")},
            "period": "7d",
            "bound": ["L3:ombudsman.now", "L3:ombudsman.by_business", "REG-ARN", "REG-FIRST-REPLY"],
            "links": [{"label": "Open the ARN watch", "href": f"{BASE}/head-of-cx?period=7d#ombudsman-watch"}],
        },
        {
            "id": "account_measure_owner",
            "prompt": "How many account-measure customers have no owner?",
            "keywords": ["account", "measure", "frozen", "freeze", "restricted", "owner", "aml", "blocked"],
            "answer": (
                f"Last 7 days: {fmt(no_owner)} of the {fmt(rm.get('of'))} account-measure customers due an owner have no "
                f"owner alerted yet ({fmt(rm.get('alerted'))} alerted). The cohort raised {fmt(am.get('volume'))} contacts; "
                f"{fmt(am.get('open'))} are open. Account-measure review: bank standard, confirm with the bank. FI focus "
                f"areas: {reg['REG-FI-FOCUS']['value']}."
            ),
            "evidence": [],
            "figures": {"no_owner": no_owner, "of": rm.get("of"), "alerted": rm.get("alerted")},
            "period": "7d",
            "bound": [f"L3:customer_pulse.lists.{am['id']}.rm", "REG-FI-FOCUS"],
            "links": [{"label": "Open priority customers", "href": f"{BASE}/priority?period=7d"}],
        },
        {
            "id": "nina_handoff",
            "prompt": "Where does Nina hand off and lose the customer?",
            "keywords": ["nina", "copilot", "chatbot", "assistant", "hand", "handoff", "lose", "leakage"],
            "answer": (
                (f"Since 22 Oct the largest Nina failure is {rows[0]['label']} ({fmt(rows[0]['internal'].get('volume'))} "
                 f"contacts)" + (f", then {rows[1]['label']} ({fmt(rows[1]['internal'].get('volume'))})" if len(rows) > 1 else "")
                 + ". " if rows else "")
                + (f"{fmt(ret.get('back_7d'))} of {fmt(ret.get('resolved'))} Nina conversations closed by {day(ret['until'])} "
                   f"({pct(ret.get('back_7d'), ret.get('resolved'))}) came back as a call or a complaint within 7 days. "
                   if ret.get("resolved") else "")
                + f"This week Nina took {fmt(nina_ch.get('volume'))} contacts; {fmt(nina_ch.get('open'))} are open."
            ),
            "evidence": [],
            "figures": {"nina_week": nina_ch.get("volume"), "back_7d": ret.get("back_7d"), "resolved": ret.get("resolved")},
            "period": "all",
            "bound": ["L3:cora.rows", "L3:cora.returns", "L3:cx_pulse.internal.by_channel.whatsapp"],
            "links": [{"label": "Open the Nina module", "href": f"{BASE}/module/nina_digital?period=all"}],
        },
    ]
    dump({"prompts": prompts, "fallback": "I'd need your data for that. Here is what I'd look at: the CX pulse, the "
          f"{CHANNEL_GROUP_LABEL['whatsapp']} module and the ARN watch."}, OUT_APP / "ask.json")
    print("ask.json:", len(prompts), "prompts;", PRODUCT_LABEL[DEEP_DIVE_PRODUCT], "is the deep dive")


if __name__ == "__main__":
    main()
