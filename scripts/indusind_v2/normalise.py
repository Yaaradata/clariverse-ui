"""Stage 1 · Normalise and redact the Jul–Sep 2026 IndusInd public data (pulse V2; same schema as the HDFC V2).

Reads the IndusInd raw pull outside the repo (Play Store, App Store, X, Reddit, forums) and writes
data/out/indusind_v2/work/normalised.jsonl: one record per item, IST timestamps, author names hashed, text redacted.

Relevance is decided here, not by deletion: every item is kept with `relevant` = on_topic | mention_only | off_topic.
"""

from __future__ import annotations

import datetime as dt
import glob
import hashlib
import json
import os
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from pii_names import ALLEGATION, redact_names  # noqa: E402  (shared with scripts/check_pii.py)

ROOT = Path(__file__).resolve().parents[2]
# The IndusInd raw pull stays outside the repo (handles, URLs): INDUSIND_L2_RAW or the default sibling folder.
RAW = Path(os.environ.get("INDUSIND_L2_RAW", str(ROOT.parent / "indusind_inputs" / "social_raw" / "IndusInd-jul1st26-sept30th26")))
OUT = ROOT / "data" / "out" / "indusind_v2"
WORK = OUT / "work"
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))

# Store apps: name fragment → (display name, entity, business). Group insurers are kept and excluded from bank figures.
APPS = [
    ("INDIE by IndusInd", "INDIE app", "indusind_bank", "retail_banking"),
    ("INDIE For Business", "INDIE for Business", "indusind_bank", "sme_merchant"),
    ("BHIM IndusPay", "BHIM IndusPay", "indusind_bank", "payments"),
    ("IndusDIRECT", "IndusDIRECT Corporate", "indusind_bank", "corporate"),
    ("Video Branch", "Video Branch", "indusind_bank", "retail_banking"),
    ("Gift City", "IndusInd GIFT City", "indusind_bank", "retail_banking"),
    ("PayWear", "Indus PayWear", "indusind_bank", "payments"),
    ("IndusFX", "IndusFX Card", "indusind_bank", "payments"),
    ("IndusInd Insurance", "IndusInd Insurance", "indusind_general", "group_company"),
    ("INLIC", "IndusInd Nippon Life", "indusind_life", "group_company"),
]

BANK_RE = re.compile(
    r"indusind|indus\s*ind|indusland|\bindie\b|indus\s*moments|indusmoments|pioneer\s*(heritage|legacy|private)|"
    r"\blegend\s*(card|credit)|eazydiner|avios|jio-?bp|tiger\s*card|pinnacle\s*card|celesta|indulge\s*card|"
    r"bhim\s*induspay|indusdirect|bharat\s*financial|\bbfil\b",
    re.I,
)
GROUP_RE = re.compile(r"indusind\s*(nippon|general|insurance|life)|reliance\s*general|\binlic\b", re.I)
BANK_PRODUCT_RE = re.compile(r"credit\s*card|debit\s*card|savings|account|loan|upi|netbanking|net\s*banking|branch|\bemi\b|\bfd\b|deposit", re.I)
STOCK_RE = re.compile(r"\bcmp\b|\bnse\b|\bbse\b|q[1-4]\s*fy\d\d|snapshot|irdai|nbfcs?\b|brokerage|analysts?\b|downgrade|upgrade(d)? to (buy|sell|hold)|share\s*price|stock|nifty|sensex|q[1-4]\s*results?|quarter(ly)?\s*results|\bnii\b|\bnim\b|target\s*price|market\s*cap|shares?\b|dividend|ipo\b|fii|dii|buy\s*call|intraday", re.I)
CX_RE = re.compile(r"card|account|app|customer|service|branch|loan|charge|complain|refund|emi|limit|reward|upi|kyc|fraud|call", re.I)
FINANCE_SUBS = {
    s.lower()
    for s in [
        "CreditCardsIndia", "IndianCreditCards", "CreditCardIndia", "personalfinanceindia", "IndiaFinance", "indusindbank",
        "CardMaximiser", "UPI", "IndiaInvestments", "IndianbankHomeLoans", "LegalAdviceIndia", "CreditCardsIndia_",
        "SmartPaisaSpender", "Creditkeeda", "amexindia", "indianawardtravel", "awardtravelindia", "NRI_Finance", "nri",
        "Banking", "Airportloungeaccess", "IndiaDealsExchange", "InsuranceTroubleIndia", "InsuranceAdviceIndia",
        "mutualfunds", "MutualfundsIndia", "IndianMutualFunds", "DebtAdvice", "IndianCreditCardz", "creditcardreviewers",
        "swipeyield", "PriorityPass", "AirTravelIndia", "BangaloreRealEstates", "indianrealestate", "CarsIndia",
        "IndianStockMarket", "StockMarketIndia", "IndiaStocks", "IndianStocks", "IndianStreetBets", "IPO_India",
        "Mutual_Funds_Insights", "MutualFundSpendInvest", "StartInvestIN", "Raw_n_real_finance", "IndiaGlobalInvesting",
    ]
}
STOCK_SUBS = {s.lower() for s in ["IndianStockMarket", "StockMarketIndia", "IndiaStocks", "IndianStocks", "IndianStreetBets", "IPO_India"]}
# Brand and care handles are not customer voice.
# Bank care replies quoted or reposted by other accounts read as the bank's voice, not the customer's.
CARE_VOICE_RE = re.compile(
    r"^(dear|hi|hello|hey)\b.{0,80}?(please (let us know|share|dm|connect|reach)|we (are|'re|would|'d) (truly |really )?(sorry|like|here|glad)|our team|kindly (connect|share|dm))",
    re.I,
)
LEADING_HANDLES_RE = re.compile(r"^(?:\s*(?:\[[a-z ]+\]|@\w+))+\s*")
BRAND_HANDLE_RE = re.compile(r"(bank|care|cares|support|official|help|npci|rbi|_in$)", re.I)

# ------------------------------------------------------------------ redaction (B3b stage 2)
REDACT = [
    (re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"), "[email]"),
    (re.compile(r"\b[\w.-]{2,}@(?:ok\w+|ybl|paytm|upi|ibl|axl|indus|hdfcbank|icici|sbi|apl|yapl|axisbank|kotak)\b", re.I), "[upi]"),
    (re.compile(r"\b[A-Z]{5}\d{4}[A-Z]\b"), "[pan]"),
    (re.compile(r"(?<!\d)\d{4}\s\d{4}\s\d{4}(?!\d)"), "[aadhaar]"),
    (re.compile(r"(?<!\d)(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?!\d)"), "[phone]"),
    (re.compile(r"(?:ending|last\s*4|xx+|\*{2,})\s*(\d{4})\b", re.I), r"ending \1"),
    (re.compile(r"\b(?:\d[ -]?){12,19}\b"), "[account]"),
    (re.compile(r"\b[A-Z]{1,4}\d{6,}\b"), "[reference]"),
    # Ticket, case and complaint numbers, whatever punctuation follows them.
    (re.compile(r"\b((?:ticket|case|complaint|reference|ref|sr|srn|request)\s*(?:no\.?|number|id)?\s*[:#.]?\s*)\d{6,}", re.I), r"\1[reference]"),
    (re.compile(r"(?<![\d.,₹])\d{6,}(?![\d.,])"), "[number]"),
]
# Role tags that pii_names puts where a person was named (handles become [handle]).
PERSON_TAG_RE = re.compile(r"\[(bank executive|public official|public figure|staff member|named third party|named person)\]")


def redact(text: str | None) -> str:
    if not text:
        return ""
    s = text
    for rx, rep in REDACT:
        s = rx.sub(rep, s)
    # People's names and handles become role tags; only institutional handles on an exact allowlist survive.
    s = redact_names(s)
    return s.strip()


def h(name: str | None) -> str | None:
    return hashlib.sha256(name.encode("utf-8")).hexdigest() if name else None


def to_ist(s: str) -> str:
    s = s.replace("Z", "+00:00")
    d = dt.datetime.fromisoformat(s)
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return d.astimezone(IST).isoformat(timespec="seconds")


def app_meta(title: str):
    for frag, name, entity, biz in APPS:
        if frag.lower() in title.lower():
            return name, entity, biz
    raise ValueError(title)


def base(**kw):
    rec = {
        "id": None, "bank": "indusind", "source": None, "url": None, "created_at": None, "text": "", "title": None,
        "parent_id": None, "thread_id": None, "lang": None, "author_hash": None, "author_followers": None,
        "author_verified": None, "engagement": {}, "rating": None, "app_name": None, "app_id": None,
        "app_version": None, "entity": "indusind_bank", "business_hint": None, "subreddit": None, "record_type": None,
        "reply": None, "relevant": "on_topic", "collected_at": None, "collector": None,
    }
    rec.update(kw)
    return rec


def _iter(rel: str):
    for f in sorted(glob.glob(str(RAW / rel))):
        for line in open(f, encoding="utf-8"):
            if line.strip():
                yield json.loads(line)


def _reply(r):
    rep = r.get("org_reply") or {}
    if not rep.get("replied") or not rep.get("text"):
        return None
    return {"text": redact(rep["text"]), "at": to_ist(rep["replied_at"]) if rep.get("replied_at") else None}


def stores(channel: str):
    """Play Store and App Store reviews of the bank's apps (and the group insurers, kept apart)."""
    out = []
    for r in _iter(f"{channel}/records.jsonl"):
        app = r.get("app") or {}
        name, entity, biz = app_meta(app.get("name") or "")
        out.append(
            base(
                id=r["id"], source=channel, url=r.get("url"), created_at=to_ist(r["created_at"]),
                text=redact(r.get("text")), title=redact(r.get("title")) or None, lang=r.get("lang"),
                author_hash=h((r.get("author") or {}).get("username")),
                engagement={"helpful": (r.get("engagement") or {}).get("helpful")},
                rating=int(r["rating"]) if r.get("rating") else None,
                app_name=name, app_id=app.get("store_id"), app_version=app.get("version"), entity=entity,
                business_hint=biz, record_type="review", reply=_reply(r), collected_at=r.get("collected_at"),
                collector=r.get("actor_run_id"),
            )
        )
    return out


def x_posts():
    out = []
    for r in _iter("x/*.jsonl"):
        a = r.get("author") or {}
        text = r.get("text") or ""
        uname = a.get("username") or ""
        if BRAND_HANDLE_RE.search(uname) or CARE_VOICE_RE.search(LEADING_HANDLES_RE.sub("", redact(text))):
            rel = "off_topic"  # brand or care voice, not the customer's
        elif BANK_RE.search(text):
            rel = "on_topic"
        else:
            rel = "off_topic"
        if rel == "on_topic" and STOCK_RE.search(text) and not CX_RE.search(text):
            rel = "mention_only"  # market and news chatter, not customer experience
        eng = r.get("engagement") or {}
        out.append(
            base(
                id=r["id"], source="x", url=r.get("url"), created_at=to_ist(r["created_at"]),
                text=redact(text), lang=r.get("lang"), author_hash=h(uname), author_followers=a.get("followers"),
                author_verified=a.get("verified"), parent_id=r.get("parent_id"), thread_id=r.get("thread_id"),
                engagement={k: eng.get(k) for k in ("likes", "replies", "reposts", "views")},
                record_type=r.get("record_type"), relevant=rel, collected_at=r.get("collected_at"),
                collector=r.get("actor_run_id"),
            )
        )
    return out


def reddit():
    rows = list(_iter("reddit/indusind_reddit_2*.jsonl"))
    posts = {r["id"]: r for r in rows if r["record_type"] == "post"}
    out = []
    for r in rows:
        m = re.search(r"reddit\.com/r/([^/]+)/", r.get("url") or "")
        sub = m.group(1) if m else None
        text = f"{r.get('title') or ''} {r.get('text') or ''}"
        root = posts.get(r.get("thread_id")) if r["record_type"] == "comment" else None
        root_on = bool(root and BANK_RE.search(f"{root.get('title') or ''} {root.get('text') or ''}"))
        in_fin = (sub or "").lower() in FINANCE_SUBS
        in_stock = (sub or "").lower() in STOCK_SUBS
        if BANK_RE.search(text) and (in_fin or r["record_type"] == "post"):
            rel = "on_topic"
        elif (
            r["record_type"] == "comment" and root_on and in_fin and not in_stock
            and len((r.get("text") or "").split()) >= 8
        ):
            rel = "on_topic"  # a substantive reply in an IndusInd thread on a finance forum
        elif BANK_RE.search(text):
            rel = "mention_only"
        else:
            rel = "off_topic"
        if rel == "on_topic" and (sub or "").lower() in STOCK_SUBS and STOCK_RE.search(text) and not CX_RE.search(text):
            rel = "mention_only"  # stock-market chatter, not customer experience
        eng = r.get("engagement") or {}
        out.append(
            base(
                id=r["id"], source="reddit", url=r.get("url"), created_at=to_ist(r["created_at"]),
                text=redact(r.get("text")), title=redact(r.get("title")) or None,
                author_hash=h((r.get("author") or {}).get("username")), parent_id=r.get("parent_id"),
                thread_id=r.get("thread_id"),
                engagement={"upvotes": eng.get("score") or eng.get("upvotes"), "replies": eng.get("replies")},
                subreddit=sub, record_type=r["record_type"], relevant=rel, collected_at=r.get("collected_at"),
                collector=r.get("actor_run_id"),
            )
        )
    return out


def forums():
    out = []
    for r in _iter("forums/*.jsonl"):
        site = (r.get("native_id") or "forum_").split("_", 1)[0]
        text = f"{r.get('title') or ''} {r.get('text') or ''}"
        out.append(
            base(
                id=r["id"], source="forum", url=r.get("url"), created_at=to_ist(r["created_at"]),
                text=redact(r.get("text")), title=redact(r.get("title")) or None,
                author_hash=h((r.get("author") or {}).get("username")), parent_id=r.get("parent_id"),
                engagement=r.get("engagement") or {}, record_type="post", subreddit=site,
                relevant="on_topic" if BANK_RE.search(text) and not (STOCK_RE.search(text) and not CX_RE.search(text)) else "mention_only",
                collected_at=r.get("collected_at"),
            )
        )
    return out


def main():
    WORK.mkdir(parents=True, exist_ok=True)
    recs = stores("playstore") + stores("appstore") + x_posts() + reddit() + forums()
    seen = set()
    out = []
    for r in recs:
        if r["id"] in seen:
            continue
        seen.add(r["id"])
        full = f"{r.get('title') or ''} {r['text']}"
        if r["entity"] == "indusind_bank" and r["source"] not in ("playstore", "appstore") and GROUP_RE.search(full) and not BANK_PRODUCT_RE.search(full):
            r["entity"] = "other_group"
        if not r["text"] and not r.get("title"):
            r["relevant"] = "off_topic"
        # A quote that named a person is never used as evidence when it alleges something against them.
        r["names_person"] = bool(PERSON_TAG_RE.search(full))
        r["alleges_named"] = r["names_person"] and bool(ALLEGATION.search(full))
        out.append(r)
    with open(WORK / "normalised.jsonl", "w", encoding="utf-8") as f:
        for r in out:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    import collections
    c = collections.Counter((r["source"], r["relevant"]) for r in out)
    for k, v in sorted(c.items()):
        print(k, v)
    print("total", len(out))


if __name__ == "__main__":
    main()
