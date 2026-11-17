"""Stage 2 · Classify every normalised Swedbank item (SW-D11): themes, sentiment, product, flags, quote eligibility.

Two layers, both deterministic and re-runnable:
  1. Swedish (and English) keyword rules: themes, sentiment, the product routing table (brief Step 4) and the lexical
     flags (escalation and ARN intent, repeat contact, bank-switch intent, status-seeking, missed timeline).
  2. The checked-in labels (public_labels.jsonl): every raw record was read in full, in Swedish, by the multilingual model
     and labelled for relevance, entity, product, themes, sentiment, first person, escalation target, repeat, bank-switch
     intent and, for quote-eligible items, the Swedish excerpt and its English gloss. The labels win; the rules are
     kept for the agreement figure and as the fallback a new record would get (a new record with no label stops
     normalise.py, so the fallback never silently decides an on-screen figure).

Product routing is total (SW-D15 point 9): every on-topic item lands in exactly one of the six products or nina_digital;
an unrouted on-topic item makes this script exit 1. A quote's Swedish excerpt must be a substring of the item's redacted
text, so a quote can never be invented or carry unredacted personal data.

Writes data/out/swedbank_pulse/work/classified.jsonl.
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter

from normalise import LABELS, RETAIL_ENTITY, WORK
from taxonomy import THEMES

T = {t["id"]: t for t in THEMES}
ROUTED = ["payments_swish", "everyday_accounts_app", "cards", "mortgages", "savings_funds", "consumer_loans", "nina_digital"]
BUSINESS_OF_PRODUCT = {"payments_swish": "payments", "everyday_accounts_app": "retail_banking", "cards": "cards",
                       "mortgages": "loans", "savings_funds": "wealth", "consumer_loans": "loans",
                       "nina_digital": "retail_banking"}
REVIEW_SOURCES = {"appstore", "playstore", "trustpilot"}


def rx(*parts: str) -> re.Pattern:
    # Proximity, not "anywhere later in a long post": ".*" becomes a 40-character window.
    return re.compile("|".join(p.replace(".*", ".{0,40}") for p in parts), re.I)


# Specific themes first; a match adds the theme (max 3 per item, in this order). Swedish first, English after.
THEME_RULES: list[tuple[str, re.Pattern]] = [
    ("nina_no_person", rx(r"\bnina\b.*(människa|person|handläggare|riktig)", r"(chatbot|chattbot).*(människa|person)")),
    ("nina_unresolved", rx(r"\bnina\b", r"chatt?bot", r"digital assistent", r"copilot")),
    ("manipulated_transfer", rx(r"lurad.*(swish|överför|betal)", r"(swish|överföring).*bedrag", r"manipulerad", r"vishing",
                                r"falsk.*(polis|bank|banktjänsteman)", r"tricked into")),
    ("swish_payment_failures", rx(r"\bswish\w*.*(fungerar inte|funkar inte|gick inte|nere|fel|misslyck|strul)",
                                  r"misslyckade? (överföring|betalning)", r"bankgiro.*(fel|gick inte|saknas)",
                                  r"(överföring|betalning).*(gick inte|misslyck|fastnat|försenad)")),
    ("account_freeze", rx(r"(låst|spärrat|fryst|stängt|blockerat)e?.*\bkont", r"\bkont\w*.*(låst|spärra|fryst|stäng|blocker)",
                          r"spärrade mina", r"nekade köp", r"frozen", r"account (blocked|restricted|closed)")),
    ("identity_checks", rx(r"kundkännedom", r"(frågor|frågar).*(lön|insättning|pengar|transaktion|gåva|ursprung)",
                           r"penningtvätt", r"ska ha reda på", r"\bkyc\b", r"(id-?handling|pass)\b.*(gått ut|förnya)")),
    ("fraud_scam", rx(r"bedrä\w+", r"bedrag\w+", r"\bscam", r"\bfraud", r"\bkapad")),
    ("phishing", rx(r"nätfiske", r"phishing", r"falskt? (sms|mejl|länk)", r"fejk(sms|länk)")),
    ("unauthorised_txn", rx(r"(köp|dragning|transaktion).*(inte gjort|okänd)", r"obehörig", r"unauthori[sz]ed")),
    ("app_login_biometrics", rx(r"logga in", r"inloggning", r"bankid", r"bank-?id", r"utloggad", r"kommer inte in",
                                r"\blog ?in\b", r"bankdosa")),
    ("new_app_release", rx(r"uppdatering", r"uppdaterat", r"ny (design|version|app)", r"nya (appen|designen|gränssnittet)",
                           r"grafiska gränssnittet", r"gamla (appen|var)", r"\bupdate\b")),
    ("app_speed_crash", rx(r"krasch", r"hänger sig", r"laddar inte", r"oväntat fel", r"fungerar inte", r"funkar inte",
                           r"går inte att (öppna|logga)", r"\bcrash", r"\bslow\b")),
    ("online_banking", rx(r"internetbank", r"webbank", r"meddelandefunktion")),
    ("care_unreachable", rx(r"kundtjänst", r"kundservice", r"kundsupport", r"telefonkö", r"telefonbank", r"på telefon",
                            r"(svårt|omöjligt) att (nå|få tag|komma fram)", r"customer service")),
    ("branch_closure", rx(r"(stäng|lägg)\w* (ner )?(kontor|filial)", r"öppet kontor", r"\d+ ?mil\b.*kontor", r"kontanter")),
    ("branch_service", rx(r"\bkontor\b", r"kontoret", r"personalen", r"bemötande", r"handläggare", r"kassör", r"\brude\b")),
    ("fees_charges_bank", rx(r"avgift", r"nyckelkund", r"\d+ ?kr (varje|i) (månad|år)", r"kostar \d+")),
    ("mis_selling", rx(r"försöka sälja", r"pracka", r"utan (mitt|att jag ger mitt) medgivande", r"telefonförsäljare")),
    ("mortgage_rate", rx(r"bolåne?ränta", r"ränterabatt", r"bolånerabatt", r"\brabatt\b", r"binda", r"bindningstid",
                         r"amorter", r"rörligt", r"höjer räntan", r"höjt", r"\d,\d+ ?%? (hos|på) swedbank")),
    ("loan_processing", rx(r"lånelöfte", r"lånegaranti", r"låneansökan", r"handpenningslån", r"kreditupplysning",
                           r"godkänt.*lån")),
    ("loan_servicing", rx(r"skriva om (sina|mina|lånen)", r"omförhandl")),
    ("investments_wealth", rx(r"\bfond", r"\bisk\b", r"robur", r"sparande", r"fondkonto", r"aktie(r|n)?\b", r"courtage")),
    ("deposits_rates", rx(r"sparkonto", r"ränta på (spar|konto)", r"insättningsgaranti")),
    ("rewards_value", rx(r"lounge", r"cashback", r"bonus", r"försäkring.*kort")),
    ("card_fees_charges", rx(r"(års)?avgift.*kort", r"kort.*\d+ ?kr (per|om) år", r"\d+ kr per year")),
    ("card_application", rx(r"(ansöka|ansökan|få).*kort", r"have to be .* customer")),
    ("international_payments", rx(r"utlandsbetalning", r"utlandsöverföring", r"spansk bank", r"valuta", r"€")),
    ("account_opening", rx(r"öppna (nytt |ett )?konto", r"byta (till )?bank", r"bytte till", r"have your account")),
    ("complaint_handling", rx(r"klagomål", r"reklamation", r"anmälan", r"kundombudsman", r"\barn\b")),
    ("fair_treatment", rx(r"orättvis", r"misstänkliggör", r"äldre person", r"respektlös", r"(nekat|nej) .*konto")),
    ("app_usability", rx(r"\bappen?\b", r"navigera", r"överblick", r"funktion", r"design", r"\bapp\b")),
]

NEG = rx(
    r"dålig", r"sämst", r"sämsta", r"värsta", r"usel", r"urusel", r"skräp", r"katastrof", r"irriterande", r"irriterad",
    r"stressad", r"kraschar", r"fungerar inte", r"funkar inte", r"kommer inte in", r"oväntat fel", r"misslyck", r"under all kritik",
    r"respektlös", r"oprofessionell", r"otrevlig", r"inte (jätte)?imponerad", r"skit", r"shit", r"förbannad", r"elände",
    r"galet", r"slö", r"försvann", r"låst", r"spärrade", r"nekade", r"tyvärr", r"problem", r"krångl", r"komplicerat",
    r"terrible", r"worst", r"rude", r"bad", r"wtf", r"👎",
)
POS = rx(
    r"\bbra\b", r"jättebra", r"superbra", r"super bra", r"utmärkt", r"fantastisk", r"hjälpsam", r"kunnig", r"nöjd",
    r"snabb", r"lättanvänd", r"smidig", r"tack", r"perfekt", r"toppen", r"\bbrå\b", r"works fine", r"lowest", r"funkade",
    r"great", r"good", r"🎉",
)
FIRST_PERSON = re.compile(r"\b(jag|mig|min|mitt|mina|vi|oss|vår|vårt|våra|i|i'm|my|me|we|our)\b", re.I)
QUESTION = rx(r"\?", r"\bvilken\b", r"hur (gör|ska)", r"borde jag", r"tips")
STAFF_PRAISE = rx(r"(personal|handläggare|kundtjänst|rådgivare|kontor|hjälpsam|kunnig|bemötande)")

# Escalation and ARN intent (SW-D06): the rung the customer says they will climb to.
ESC_TARGETS = [
    ("arn", r"\barn\b|allmänna reklamationsnämnden|reklamationsnämnd", "ARN"),
    ("kundombudsman", r"kundombudsman", "Complaint"),
    ("fi", r"finansinspektionen|\bfi\b.{0,20}(anmäl|klag)", "ARN"),
    ("consumer_body", r"konsumentverket|konsumenternas|hallå konsument", "ARN"),
    ("legal", r"stämt|stämma (er|banken)|tingsrätt|advokat|jurist|polisanmäl", "ARN"),
    ("public", r"\bmedia\b|tidningen|aftonbladet|expressen|kvällspress", "Public"),
    ("complaints_team", r"klagomål|reklamation|hotade med anmälan|anmälan|regionschef", "Complaint"),
]
VALID_TGT = {t for t, _p, _r in ESC_TARGETS}
STATUS = rx(r"väntar (fortfarande|på svar)", r"inget svar", r"när (får|kommer) jag", r"hur länge", r"fortfarande inte")
PROMISE = rx(r"lovade", r"har pågått i", r"\d+ (dagar|veckor|månader) (och|men|nu|sedan)", r"sedan \d+ (dagar|veckor|månader)")
CLOSURE = rx(r"byta bank", r"byter bank", r"blir till att byta", r"funderar (seriöst|allvarligt) på att byta", r"välj något annat",
             r"flytta (allt|vidare|över)", r"switch(ed|ing)? bank")
REPEAT = rx(r"andra gången", r"tredje gången", r"återigen", r"varje gång", r"igen och igen", r"flera gånger", r"sjunde ansökan")
DAYS = re.compile(r"(\d{1,3})\s*(dagar|dag|veckor|vecka|månader|månad|timmar|timme)\b", re.I)
REQUEST_TYPES = [
    ("reversal", r"misslyckad|tillbaka|återbetal"),
    ("kyc", r"kundkännedom|frågor om|id-?handling|pass"),
    ("closure", r"stäng|avsluta"),
    ("loan_disbursal", r"lånelöfte|låneansökan|lånegaranti"),
    ("dispute", r"reklamera|bestrid"),
]
OWNER_BY_RT = {
    "card_delivery": "operations", "reversal": "payments", "refund": "operations", "dispute": "operations", "closure": "retail",
    "loan_disbursal": "loans", "credit_report": "compliance", "kyc": "operations", "other": "cx",
}
SWEDISH_BANKS = (r"handelsbanken|\bseb\b|nordea|danske bank|länsförsäkringar|\blf\b|ica banken|skandiabanken|skandia|sbab|"
                 r"avanza|nordnet|northmill|revolut|lunar|montrose|lysa|borgo")
SWITCH_TO = re.compile(rf"(flytta\w*|byt\w*|gå)\s+(\w+\s+)?(till|hos)\s+({SWEDISH_BANKS})", re.I)
SWITCH_FROM = re.compile(rf"(från|lämna\w*)\s+({SWEDISH_BANKS})\s+(till\s+)?swedbank", re.I)

# Product routing table (brief Step 4, NW-D92/D97 pattern), checked in this order. Account measures ("frysta", "spärr",
# "stängt konto") go to Everyday accounts and app, as the brief's table says, although the deep-dive "Account measures"
# category sits under Payments and Swish (common.CARDS_CATEGORIES): see docs/swedbank/notes_public.md.
PRODUCT_RULES = [
    ("nina_digital", rx(r"\bnina\b", r"chatt?bot", r"copilot", r"digital assistent")),
    ("consumer_loans", rx(r"privatlån", r"blancolån", r"konsumtionslån", r"personal loan")),
    ("mortgages", rx(r"bolån", r"amorter", r"bindningstid", r"binda \d", r"ränterabatt", r"lånelöfte", r"lånegaranti",
                     r"handpenningslån", r"mortgage", r"skriva om sina lån")),
    ("savings_funds", rx(r"\bfond", r"\bisk\b", r"sparkonto", r"robur", r"sparande", r"aktie", r"courtage", r"\bamc\b")),
    ("payments_swish", rx(r"\bswish", r"bankgiro", r"\bbetalning", r"överföring", r"överföra", r"bedrägeri", r"bedrag",
                          r"spärrat kort", r"nekade köp", r"ge bort .* pengar", r"utlandsbetal")),
    ("cards", rx(r"kreditkort", r"mastercard", r"\bkort\b", r"platinum", r"entercard", r"credit card", r"\bcard\b")),
    ("mortgages", rx(r"\bränta\b", r"räntan", r"\d,\d+ ?%")),
    ("everyday_accounts_app", rx(r"\bkont", r"\bapp", r"bankid", r"inloggning", r"logga in", r"spärr", r"frys", r"stängt konto",
                             r"kundtjänst", r"kontor", r"internetbank", r"account")),
]


def product_by_rule(text: str) -> str:
    for pid, r in PRODUCT_RULES:
        if r.search(text):
            return pid
    return "everyday_accounts_app"  # the bank in general, the app and everyday banking


def sentiment_by_rule(rec, text: str) -> tuple[str, int]:
    if rec["rating"] is not None:
        r = rec["rating"]
        return ("negative", 3 if r == 1 else 2) if r <= 2 else (("positive", 2) if r >= 4 else ("neutral", 1))
    n, p = len(NEG.findall(text)), len(POS.findall(text))
    if n > p:
        return "negative", min(3, 1 + n - p)
    if p > n:
        return "positive", min(3, p - n)
    return "neutral", 1


def themes_by_rule(rec, low: str, sent: str) -> list[str]:
    themes = [tid for tid, r in THEME_RULES if r.search(low)][:3]
    if themes:
        return themes
    store = rec["source"] in ("playstore", "appstore")
    if sent == "positive" and STAFF_PRAISE.search(low):
        return ["service_praise"]
    if sent == "positive" and store:
        return ["app_praise"]
    if sent == "negative" and store:
        return ["app_usability"]
    if sent == "negative" and "swedbank" in low:
        return ["general_dissatisfaction"]
    if QUESTION.search(low):
        return ["product_advice"]
    return ["other"]


def summarise(rec) -> str:
    """Short excerpt for evidence cards: the review title, or the first sentence, cut to 20 words."""
    src = rec.get("title") if rec["source"] in ("appstore", "reddit", "trustpilot") and rec.get("title") else rec.get("text") or ""
    src = re.sub(r"(\[handle\]\s*)+", "", src)
    src = re.sub(r"@\w+\s*", "", src).strip()
    first = re.split(r"(?<=[.!?])\s+", src)[0]
    words = first.split()
    s = " ".join(words[:20]) + ("…" if len(words) > 20 else "")
    s = s.replace("!", ".")
    return s[:1].upper() + s[1:] if s else ""


def classify(rec: dict) -> dict:
    text = f"{rec.get('title') or ''} {rec.get('text') or ''}".strip()
    low = text.lower()
    sent, inten = sentiment_by_rule(rec, low)
    themes = themes_by_rule(rec, low, sent)
    esc_target = next((tgt for tgt, pat, _ in ESC_TARGETS if re.search(pat, low, re.I)), None)
    days = None
    m = DAYS.search(low)
    if m:
        n = int(m.group(1))
        unit = m.group(2).lower()
        days = round(n * (7 if unit.startswith("veck") else 30 if unit.startswith("mån") else 1 / 24 if unit.startswith("tim") else 1), 1)
    promise_break = bool(PROMISE.search(low))
    sw = None
    mt, mf = SWITCH_TO.search(low), SWITCH_FROM.search(low)
    if mt:
        sw = {"direction": "to", "bank": mt.group(4).lower()}
    elif mf:
        sw = {"direction": "from", "bank": mf.group(2).lower()}
    return {
        **rec,
        "product_rule": product_by_rule(low),
        "themes_rule": themes,
        "sentiment_rule": sent,
        "themes": themes,
        "sentiment": sent,
        "intensity": inten,
        "escalation_target": esc_target,
        "escalation_intent": esc_target is not None and sent != "positive",
        "promise_break": promise_break,
        "request_type": next((rt for rt, pat in REQUEST_TYPES if re.search(pat, low)), "other") if promise_break else None,
        "days_elapsed": days,
        "status_seeking": bool(STATUS.search(low)),
        "cure_watch": False,
        "closure_intent": bool(CLOSURE.search(low)),
        "switching": sw,
        "repeat_contact": bool(REPEAT.search(low)),
        "feature_request": None,
        "first_person": bool(FIRST_PERSON.search(low)),
        "summary": summarise(rec),
        "quote_ok": False,
        "gloss": None,
        "classified_by": "rules",
    }


def apply_label(rec: dict, lab: dict, errors: list[str]) -> dict:
    """The checked-in label decides; flags the label does not carry keep the rule value."""
    if lab["rel"] != "on_topic":
        rec.update(themes=["trading_securities" if lab["entity"] == "group_other" else "market_news" if lab["entity"] == "investor_corporate" else "other"],
                   sentiment="neutral", product=None, business="group_company" if lab["entity"] != RETAIL_ENTITY else "retail_banking",
                   escalation_intent=False, escalation_target=None, closure_intent=False, repeat_contact=False,
                   promise_break=False, request_type=None, status_seeking=False, switching=None, classified_by="labels")
        return rec
    themes = [t for t in lab["themes"] if t in T][:3]
    if len(themes) != len(lab["themes"]):
        errors.append(f"{rec['id']}: unknown theme in {lab['themes']}")
    product = lab.get("product")
    if product not in ROUTED:
        errors.append(f"{rec['id']}: on-topic item not routed to a product ({product!r})")
    sent = lab["sentiment"]
    tgt = lab.get("esc_target") if lab.get("esc_target") in VALID_TGT else None
    if lab.get("esc_target") and not tgt:
        errors.append(f"{rec['id']}: unknown escalation target {lab['esc_target']!r}")
    summary, gloss = rec["summary"], None
    if lab.get("quote"):
        haystack = f"{rec.get('title') or ''} {rec.get('text') or ''}"
        if lab["quote"] not in haystack:
            errors.append(f"{rec['id']}: quote is not a substring of the redacted text")
        summary = lab["quote"].replace("!", ".")
        gloss = lab.get("gloss")
        if lab.get("lang", "sv") != "en" and not gloss:
            errors.append(f"{rec['id']}: Swedish quote without an English gloss")
    rec.update(
        themes=themes or ["other"],
        sentiment=sent,
        intensity=rec["intensity"] if sent == rec["sentiment_rule"] else (2 if sent != "neutral" else 1),
        product=product,
        business=BUSINESS_OF_PRODUCT.get(product, "retail_banking"),
        escalation_target=tgt,
        escalation_intent=bool(tgt) and sent != "positive",
        repeat_contact=bool(lab.get("repeat")),
        closure_intent=bool(lab.get("switch_intent")),
        first_person=bool(lab.get("first_person")),
        quote_ok=bool(lab.get("quote_ok")) and bool(lab.get("quote")),
        summary=summary,
        gloss=gloss,
        lang=lab.get("lang") or rec.get("lang"),
        cure_watch=False,
        classified_by="labels",
    )
    return rec


def main():
    labels = {json.loads(line)["id"]: json.loads(line) for line in open(LABELS, encoding="utf-8") if line.strip()}
    out, errors = [], []
    for line in open(WORK / "normalised.jsonl", encoding="utf-8"):
        rec = classify(json.loads(line))
        lab = labels.get(rec["id"])
        if lab is None:
            errors.append(f"{rec['id']}: no label")
            continue
        rec = apply_label(rec, lab, errors)
        if rec["relevant"] == "on_topic" and rec["entity"] == RETAIL_ENTITY and rec.get("product") not in ROUTED:
            errors.append(f"{rec['id']}: unrouted on-topic item")
        # The page-payload PII check scans this file: no author hash and no bare native ids (the record id carries them).
        for k in ("author_hash", "native_id", "app_id", "url"):  # the url stays in normalised.jsonl for audit
            rec.pop(k, None)
        t0 = T[rec["themes"][0]]
        rec["pillar"], rec["owner"] = t0["pillar"], t0["owner"]
        out.append(rec)
    if errors:
        for e in errors[:30]:
            print("classify ERROR:", e)
        sys.exit(1)
    with open(WORK / "classified.jsonl", "w", encoding="utf-8", newline="\n") as f:
        for r in out:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    on = [r for r in out if r["relevant"] == "on_topic" and r["entity"] == RETAIL_ENTITY]
    print("retail on-topic", len(on), "of", len(out), Counter(r["source"] for r in on))
    print("routing", Counter(r["product"] for r in on))
    agree_p = sum(1 for r in on if r["product"] == r["product_rule"])
    agree_s = sum(1 for r in on if r["sentiment"] == r["sentiment_rule"])
    agree_t = sum(1 for r in on if r["themes"][0] in r["themes_rule"])
    print(f"rules vs labels: product {agree_p}/{len(on)} · sentiment {agree_s}/{len(on)} · primary theme {agree_t}/{len(on)}")
    for k, v in Counter(r["themes"][0] for r in on).most_common(12):
        print(f"  {k:28} {v}")
    print("sentiment", Counter(r["sentiment"] for r in on))
    print("flags", {k: sum(1 for r in on if r[k]) for k in ("escalation_intent", "repeat_contact", "closure_intent", "quote_ok", "first_person")})


if __name__ == "__main__":
    main()
