"""IndusInd public voice (L2): shared loader, licence buckets, redaction and deterministic tagging.

Used by scripts/profile_indusind_l2.py (profile, counts only) and scripts/ingest_indusind_l2.py (redacted store).
The raw scrape lives OUTSIDE the repo (it holds handles, phone numbers and post URLs) and is never committed:
  INDUSIND_L2_RAW, default ../indusind_inputs/social_raw/IndusInd-jul1st26-sept30th26 (next to the repo).

Licence buckets (IND-B3 §7 sources table):
  core      Google Play and Apple App Store, INDIE only (IND-B3 names INDIE); consumercomplaints.in public pages
  pending   X (collected with a scraper actor, not a named paid X API tier); Reddit (archive scraper actors, not the
            official API); MouthShut (not in the sources table). Counted, never on screen, until Ranjith decides
  out       TechnoFino, Trustpilot (IND-B3: out, terms)
  peer      the core peers' main retail apps (Federal, Yes, IDFC First), tagged by bank: used only for deposit topics
            and peer voice, never in IndusInd totals. None is in the Jul–Sep pull (every app's developer is IndusInd
            Bank Ltd. or a group insurer)
  excluded  other apps in the pull: group-company insurance apps (not the bank) and IndusInd apps IND-B3 does not list
Only `core` items reach an IndusInd figure.
"""

from __future__ import annotations

import base64
import datetime as dt
import glob
import hashlib
import json
import os
import re
from pathlib import Path

from pii_names import redact_names

ROOT = Path(__file__).resolve().parents[1]
RAW = Path(os.environ.get("INDUSIND_L2_RAW", ROOT.parent / "indusind_inputs" / "social_raw" / "IndusInd-jul1st26-sept30th26"))
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
WINDOW_START = dt.datetime(2026, 7, 1, tzinfo=IST)
FREEZE = dt.datetime(2026, 10, 2, 18, 0, tzinfo=IST)
SALT = "indusind-l2-v1"  # fixed: the same handle always hashes the same way

INDIE_PLAY = "com.indusind.indie"
INDIE_APPSTORE = "1615506534"

SOURCE_LABEL = {
    "play": "Google Play",
    "appstore": "Apple App Store",
    "consumercomplaints": "consumercomplaints.in",
    "x": "X",
    "reddit": "Reddit",
    "mouthshut": "MouthShut",
    "technofino": "TechnoFino",
    "trustpilot": "Trustpilot",
}

# ---------------------------------------------------------------- loading


def _rows(path: Path) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def load_raw() -> list[dict]:
    """Every raw record, with `source` and the licence `bucket` set. Reddit's two files hold the same ids; one is read."""
    if not RAW.exists():
        raise SystemExit(f"indusind L2: raw folder not found: {RAW}")
    out = []
    for r in _rows(RAW / "playstore" / "records.jsonl"):
        r["source"] = "play"
        app = r["app"]["store_id"]
        peer = peer_bank(r["app"]["name"])
        r["bank"] = peer or "indusind"
        r["bucket"] = "core" if app == INDIE_PLAY else "peer" if peer else "excluded"
        r["exclusion"] = None if app == INDIE_PLAY else f"peer app ({peer}): deposit topics and peer voice only" if peer else _app_exclusion(r["app"]["name"])
        out.append(r)
    for r in _rows(RAW / "appstore" / "records.jsonl"):
        r["source"] = "appstore"
        app = str(r["app"]["store_id"])
        peer = peer_bank(r["app"]["name"])
        r["bank"] = peer or "indusind"
        r["bucket"] = "core" if app == INDIE_APPSTORE else "peer" if peer else "excluded"
        r["exclusion"] = None if app == INDIE_APPSTORE else f"peer app ({peer}): deposit topics and peer voice only" if peer else _app_exclusion(r["app"]["name"])
        out.append(r)
    for r in _rows(RAW / "x" / "indusind_x_2026-07-01_2026-09-30.jsonl"):
        r["source"], r["bucket"], r["exclusion"] = "x", "pending", "X: scraper actor, not a named paid X API tier"
        out.append(r)
    for r in _rows(RAW / "reddit" / "indusind_reddit_2026-07-01_2026-09-30.jsonl"):
        r["source"], r["bucket"], r["exclusion"] = "reddit", "pending", "Reddit: archive scraper actors, not the official API"
        out.append(r)
    for f in sorted(glob.glob(str(RAW / "forums" / "*.jsonl"))):
        site = Path(f).name.split("_")[2]
        for r in _rows(Path(f)):
            r["source"] = site
            if site == "consumercomplaints":
                r["bucket"], r["exclusion"] = "core", None
            elif site == "mouthshut":
                r["bucket"], r["exclusion"] = "pending", "MouthShut: not in the IND-B3 sources table"
            else:
                r["bucket"], r["exclusion"] = "out", f"{SOURCE_LABEL[site]}: out under IND-B3 (terms)"
            out.append(r)
    return out


PEER_APPS = {"federal": re.compile(r"federal bank|fedmobile|fedbook", re.I),
             "yes": re.compile(r"yes bank|iris by yes|yes mobile", re.I),
             "idfc_first": re.compile(r"idfc first", re.I)}


def peer_bank(app_name: str) -> str | None:
    for bank, rx in PEER_APPS.items():
        if rx.search(app_name or ""):
            return bank
    return None


def _app_exclusion(name: str) -> str:
    if re.search(r"insurance|inlic|nippon", name, re.I):
        return "group-company insurance app, not the bank"
    return "IndusInd app outside the IND-B3 list (INDIE only)"


def created(r: dict) -> dt.datetime:
    return dt.datetime.fromisoformat(r["created_at"].replace("Z", "+00:00")).astimezone(IST)


# ---------------------------------------------------------------- redaction

MOBILE = re.compile(r"(?<!\d)(?:\+?91[\s-]?)?[6-9]\d{9}(?!\d)")
LONGNUM = re.compile(r"(?<!\d)(?:\d[\s-]?){12,19}(?!\d)")
EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")
PAN = re.compile(r"\b[A-Z]{5}\d{4}[A-Z]\b")
URL = re.compile(r"https?://\S+|www\.\S+")
# A customer naming themself: "my name is A B", "myself A B", "mera naam A", "मैं A B C इस ..." (Hindi self-introduction).
SELF_NAME = re.compile(r"(?i)(my name is|myself|mera naam(?: hai)?|मेरा नाम)\s+[^\s,.;:!?]+(?:\s+[A-Z][^\s,.;:!?]*)?")
HINDI_SELF = re.compile(r"मैं\s+((?:[ऀ-ॿ]+\s+){2,3})(?=इस|का|की|ने\b)")
HANDLE = re.compile(r"(?<![\w.])@[A-Za-z0-9_]{2,}")


def redact(text: str | None) -> str:
    """Redact before anything is stored: mobiles, 12–19-digit numbers, emails, PAN, URLs, @handles and a customer's own name."""
    t = text or ""
    t = URL.sub("[link]", t)
    t = EMAIL.sub("[email]", t)
    t = LONGNUM.sub("[number]", t)
    t = MOBILE.sub("[phone]", t)
    t = PAN.sub("[id]", t)
    t = HANDLE.sub("@[user]", t)
    t = SELF_NAME.sub(lambda m: f"{m.group(1)} [name]", t)
    t = HINDI_SELF.sub("मैं [name] ", t)
    t = redact_names(t)  # the repo's name detector (scripts/pii_names.py): staff and family named in a review
    return re.sub(r"\s+", " ", t).strip()


def _h(key: str) -> str:
    """A short, stable hash in lower-case base32: no long digit runs, so it never reads as a phone or card number."""
    return base64.b32encode(hashlib.sha256(key.encode()).digest()).decode().lower()[:16]


def hash_handle(r: dict) -> str | None:
    a = r.get("author") or {}
    h = a.get("id") or a.get("username") or a.get("display_name")
    return _h(f"{SALT}:{r['source']}:{h}") if h else None


def item_id(r: dict) -> str:
    return _h(f"{SALT}:{r['source']}:{r.get('native_id') or r.get('id')}")


def text_hash(text: str) -> str:
    return _h(re.sub(r"[^a-z0-9ऀ-ॿ]+", " ", text.lower()).strip())


# ---------------------------------------------------------------- tagging (deterministic rules)

DEVANAGARI = re.compile("[ऀ-ॿ]")


def kw(*words: str) -> re.Pattern:
    return re.compile(r"(?:" + "|".join(words) + r")", re.I)


# Product rules, in priority order: the first match wins. English and Hindi or Hinglish spellings.
PRODUCT_RULES: list[tuple[str, re.Pattern]] = [
    ("micro_loans_rural", kw(r"bharat financial", r"\bbfil\b", r"micro ?financ", r"group loan", r"\bjlg\b", r"माइक्रो")),
    ("vehicle_loans", kw(r"vehicle loan", r"car loan", r"two[- ]wheeler", r"bike loan", r"tractor", r"recovery agent",
                         r"गाड़ी", r"ट्रैक्टर", r"वाहन")),
    ("home_loans", kw(r"home loan", r"housing loan", r"होम लोन")),
    ("personal_loans", kw(r"personal loan", r"pre-?approved loan", r"instant loan", r"पर्सनल लोन")),
    ("cards", kw(r"credit card", r"\bcc\b", r"card limit", r"credit limit", r"reward point", r"\blounge", r"legend card",
                 r"pinnacle", r"tiger card", r"celesta", r"\baura\b", r"eazydiner", r"annual fee", r"card statement",
                 r"क्रेडिट कार्ड")),
    ("nri", kw(r"\bnri\b", r"\bnre\b", r"\bnro\b")),
    ("fd_rd", kw(r"fixed deposit", r"\bfds?\b", r"\brds?\b", r"recurring deposit", r"term deposit", r"एफडी")),
    ("deposits_savings", kw(r"savings? account", r"saving a/?c", r"account open", r"open(?:ing)? (?:an |my |the )?account",
                            r"minimum balance", r"\bmab\b", r"debit card", r"cheque", r"passbook", r"salary account",
                            r"account (?:is )?(?:closed|freez|frozen|block)", r"zero balance", r"खाता", r"बचत")),
    ("app_digital", kw(r"\bapp\b", r"application", r"login", r"log in", r"\botp\b", r"\bupi\b", r"mobile banking",
                       r"net ?banking", r"update", r"crash", r"server", r"\bmpin\b", r"biometric", r"face ?id",
                       r"device", r"ऐप", r"एप")),
]

TOPIC_RULES: dict[str, re.Pattern] = {
    "rate_offer": kw(r"interest rate", r"rate of interest", r"(?:fd|savings?|deposit) rates?", r"higher interest",
                     r"cashback offer", r"special offer", r"ब्याज दर"),
    "fee_change": kw(r"\bcharges?\b", r"charged", r"\bfees?\b", r"deduct", r"penalt", r"\bgst\b", r"hidden cost", r"शुल्क", r"चार्ज"),
    "insurance_investment_sales": kw(r"insurance", r"\bpolic(?:y|ies)\b", r"mutual fund", r"\bulip\b", r"बीमा"),
    "escalation_language": kw(r"\brbi\b", r"ombudsman", r"consumer (?:court|forum)", r"legal notice", r"\bcourt\b",
                              r"cyber ?crime"),
    "closure_intent": kw(r"clos(?:e|ing) (?:my|the|this|our)? ?(?:account|a/c|card)", r"account closure",
                         r"switch(?:ing)? (?:to|my account)", r"moving (?:my account )?to (?:another|other|a different)",
                         r"खाता बंद"),
    "trust_governance": kw(r"\bsebi\b", r"\bsfio\b", r"derivative", r"accounting (?:lapse|discrepanc)", r"governance",
                           r"(?:top|senior) management", r"\bceo\b", r"resign"),
    "mis_selling_allegation": kw(r"mis-?sold", r"mis-?sell", r"forced to (?:buy|take|open)", r"without (?:my )?consent",
                                 r"bundl", r"(?:insurance|policy) (?:was )?added without"),
    "fraud_impersonation": kw(r"scam (?:call|sms|message|link)", r"scammers?\b", r"got scammed", r"fraud (?:call|sms|message|link)", r"fake (?:call|sms|message|app|link|customer care)",
                              r"phishing", r"impersonat", r"unauthori[sz]ed (?:transaction|debit|withdrawal)",
                              r"money (?:was )?(?:stolen|debited without)", r"ठगी"),
    "service_delay": kw(r"not (?:yet )?resolved", r"no (?:response|reply|resolution)", r"waiting", r"\bdelay",
                        r"still (?:not|no)", r"pending", r"for (?:the last |last )?(?:\d+|many|several|few) (?:days|weeks|months)"),
    "app_failure": kw(r"not working", r"doesn'?t work", r"crash", r"\berror", r"unable to (?:log ?in|login|open|access)",
                      r"can'?t (?:log ?in|login|open)", r"otp (?:not|is not)", r"server", r"\bbug", r"stuck", r"\bslow",
                      r"\bhang", r"failed", r"failure", r"glitch", r"threat (?:is )?detected", r"logs? (?:me )?out", r"नहीं चल",
                      r"not able to (?:use|log ?in|open|access|login)", r"(?:would|will|does) not (?:log ?in|open|work)",
                      r"not open", r"closes (?:unexpectedly|automatically|with)", r"can'?t (?:use|access)",
                      r"unable to (?:use|download)", r"sim binding (?:fail|not|issue)", r"stops at"),
}

# Allegations need both halves: who (recovery or collection staff) and what (harassment, threats, abuse).
RECOVERY_WHO = kw(r"recovery", r"collection (?:agent|team|call)", r"\bagents?\b", r"loan (?:call|agent)", r"वसूली")
RECOVERY_WHAT = kw(r"harass", r"threaten", r"abus", r"misbehav", r"rude", r"insult", r"धमकी", r"परेशान")

OFF_TOPIC = {
    "jobs": kw(r"\bhiring\b", r"vacanc", r"recruit", r"walk-?in interview", r"job opening", r"\bjobs?\b at"),
    "investor": kw(r"share price", r"\bstock\b", r"\bnifty\b", r"target price", r"\bbuy (?:call|rating)", r"q[1-4] results",
                   r"\bshareholders?\b", r"market cap", r"52[- ]week"),
    "homonym": kw(r"indus towers", r"indus valley", r"indus appstore", r"indusind nippon", r"\binlic\b", r"hinduja"),
}

PEERS = {
    "federal": kw(r"federal bank"),
    "yes": kw(r"\byes bank"),
    "idfc_first": kw(r"\bidfc"),
    "kotak": kw(r"\bkotak"),
    "rbl": kw(r"\brbl\b"),
    "au": kw(r"\bau (?:small finance|bank)", r"\bau sfb"),
    "bandhan": kw(r"\bbandhan"),
}

PRAISE = kw(r"\bgood\b", r"great", r"excellent", r"\bnice\b", r"smooth", r"easy", r"\bbest\b", r"helpful", r"thank",
            r"awesome", r"user friendly", r"\blove\b", r"superb", r"बढ़िया", r"अच्छा")
NEGATIVE = kw(r"worst", r"\bbad\b", r"pathetic", r"useless", r"horrible", r"terrible", r"not working", r"fraud",
              r"cheat", r"harass", r"poor", r"waste", r"disappoint", r"frustrat", r"never", r"bekar", r"बेकार")

# Cards categories (S-CARDS), English keywords.
CARD_CATEGORY_RULES: list[tuple[str, re.Pattern]] = [
    ("fraud", kw(r"fraud", r"scam", r"unauthori[sz]ed", r"phishing", r"fake call")),
    ("rewards", kw(r"reward", r"points", r"redeem", r"redemption", r"cashback", r"vouchers?")),
    ("lounge", kw(r"lounge", r"golf", r"movie", r"benefit")),
    ("fees", kw(r"annual fee", r"joining fee", r"\bfees?\b", r"charge", r"interest charged", r"\bgst\b", r"late fee")),
    ("limits", kw(r"limit")),
    ("disputes", kw(r"dispute", r"refund", r"chargeback", r"reversal")),
    ("applications", kw(r"appl(?:y|ied|ication)", r"approv", r"rejected", r"verification", r"\bkyc\b")),
    ("activation", kw(r"activat", r"\bpin\b", r"deliver")),
    ("closure", kw(r"clos(?:e|ure|ing)", r"cancel")),
    ("emi", kw(r"\bemi\b", r"payment", r"\bbill", r"autopay", r"due")),
    ("cobrand", kw(r"co-?brand", r"eazydiner", r"indigo", r"club vistara", r"\bola\b", r"bpcl")),
    ("app_servicing", kw(r"\bapp\b", r"statement", r"customer care", r"service")),
]


def language(r: dict, text: str) -> str:
    if DEVANAGARI.search(text):
        return "hi"
    lang = (r.get("lang") or "en").lower()
    return "hi" if lang == "hi" else "en"


def product_of(r: dict, text: str) -> tuple[str, str]:
    """(product, method). Store reviews of the INDIE app with no product word are app_digital: the review is about
    the app itself."""
    for prod, rx in PRODUCT_RULES:
        if rx.search(text):
            return prod, "rule:keyword"
    if r["source"] in ("play", "appstore"):
        return "app_digital", "rule:default_app_review"
    return "other", "rule:none"


def topics_of(text: str) -> list[str]:
    tags = [t for t, rx in TOPIC_RULES.items() if rx.search(text)]
    if RECOVERY_WHO.search(text) and RECOVERY_WHAT.search(text):
        tags.append("recovery_conduct_allegation")
    return tags


def off_topic(text: str) -> str | None:
    for k, rx in OFF_TOPIC.items():
        if rx.search(text):
            return k
    return None


def sentiment_of(r: dict, text: str) -> tuple[str, str]:
    """Store reviews: from the star rating (1–2 negative, 3 neutral, 4–5 positive). Others: a small lexicon."""
    rating = r.get("rating")
    if r["source"] in ("play", "appstore") and isinstance(rating, (int, float)):
        return ("negative" if rating <= 2 else "neutral" if rating == 3 else "positive"), "rule:star_rating"
    neg, pos = bool(NEGATIVE.search(text)), bool(PRAISE.search(text))
    return ("negative" if neg and not pos else "positive" if pos and not neg else "neutral"), "rule:lexicon"


def card_category(text: str) -> str | None:
    for cat, rx in CARD_CATEGORY_RULES:
        if rx.search(text):
            return cat
    return None


def peers_in(text: str) -> list[str]:
    return [p for p, rx in PEERS.items() if rx.search(text)]


# ---------------------------------------------------------------- themes (for the top theme per business)
# Business → ordered (theme, pattern). An item takes the first theme of its business that matches. The on-screen
# label and paraphrase of each theme live in config/indusind.yaml (l2.themes), written by hand from the items.
BUSINESS_OF = {"deposits_savings": "deposits", "fd_rd": "deposits", "nri": "deposits", "cards": "cards",
               "vehicle_loans": "vehicle", "micro_loans_rural": "micro", "personal_loans": "personal",
               "app_digital": "digital"}

THEMES: dict[str, list[tuple[str, re.Pattern]]] = {
    "digital": [
        ("security_block", kw(r"threat (?:is )?detected", r"thread detected", r"threat found", r"caution", r"malware",
                              r"secure(?:d)? (?:operating system|os)\b", r"operating (?:system|software) is not secure",
                              r"another operating system", r"screen reader", r"screen record",
                              r"rooted", r"developer option", r"android 16", r"hyperos")),
        ("login_otp", kw(r"log ?in", r"\botp\b", r"register(?:ing)? (?:my )?(?:mobile|number)", r"\bsim\b", r"device bind",
                         r"verif", r"\bmpin\b", r"\bpin\b", r"logged out", r"log ?out", r"लॉग ?इन", r"ओटी ?पी")),
        ("update", kw(r"\bupdate", r"new version", r"old app", r"new app")),
        ("customer_care", kw(r"customer care", r"call cent", r"no response", r"support")),
    ],
    "cards": [
        # Concrete findings first; a broad "the app" theme is not a finding.
        ("card_not_visible", kw(r"(?:not|n't|no) (?:showing|visible|loading|available|reflect)[^.]{0,40}(?:credit )?card",
                                r"(?:credit )?card[^.]{0,40}(?:not|n't) (?:showing|visible|loading|available|reflect)",
                                r"(?:card|cc) (?:section|details?)[^.]{0,30}(?:not|n't|no)", r"no cards? available",
                                r"(?:can'?t|cannot|unable to|not able to) (?:see|find|view|check|access)[^.]{0,30}(?:card|cc)",
                                r"choose savings|select a product|get your first product|open bank ac", r"showing old cc",
                                r"shows no (?:any )?card", r"cc not showing", r"card details are not")),
        ("card_registration", kw(r"regist", r"\bpin (?:setup|creation|set)", r"set (?:the |my )?pin", r"\bmpin",
                                 r"only (?:a |use )?(?:indusind )?credit card", r"credit card only", r"only credit card",
                                 r"(?:no|without) (?:a |any )?(?:bank |savings? )?account", r"don'?t have (?:an? )?(?:indusind )?(?:saving|bank)",
                                 r"customer id", r"link (?:my )?credit card", r"activat", r"sim binding", r"verif")),
        ("card_bill", kw(r"\bbill", r"pay(?:ment)?s? (?:towards|of|for|to) (?:my )?(?:credit )?card", r"card payments?",
                         r"\bdues?\b", r"outstanding", r"payment[^.]{0,20}pending")),
    ],
    "deposits": [
        ("debit_card", kw(r"debit card", r"virtual debit", r"atm card")),
        ("fd_service", kw(r"\bfds?\b", r"fixed deposit", r"maturity", r"interest amount")),
        ("account_blocked", kw(r"freez", r"frozen", r"account (?:is )?block", r"\bblock(?:ed)? (?:my )?account", r"inactive",
                               r"hold your money")),
        ("account_opening", kw(r"video ?kyc", r"\bv?kyc\b", r"pre[- ]?deposit", r"10,?000", r"zero balance",
                               r"(?:unable|not able|can'?t|cannot) (?:to )?open (?:an |a |my |new )?(?:saving |savings )?account",
                               r"error[^.]{0,30}open(?:ing)? (?:an |my )?account", r"open(?:ing)? (?:an |my )?account[^.]{0,40}(?:error|fail|reject)",
                               r"account open nahi", r"खाते नहीं खुलते", r"खोल नहीं पा")),
        ("savings_not_visible", kw(r"(?:saving|savings|sb) (?:account|a/c)[^.]{0,40}(?:not (?:show|reflect|visible)|unable to add)",
                                   r"(?:not|n't) (?:show|showing|reflect)[^.]{0,20}(?:saving|savings) (?:account|a/c)",
                                   r"unable to add my savings", r"saving account show nhi")),
        ("charges", kw(r"charge", r"\bfees?\b", r"minimum balance", r"\bmab\b", r"deduct")),
    ],
}


def theme_of(product: str, text: str) -> str | None:
    for theme, rx in THEMES.get(BUSINESS_OF.get(product, ""), []):
        if rx.search(text):
            return theme
    return None
