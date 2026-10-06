"""Stage 2 · Classify every normalised item (B3b stage 4), rules only (no API key in this environment).

Multi-label themes from the taxonomy in taxonomy.py (same ids, labels, owners and pillars as the first demo), sentiment,
business, and the lexical flags: escalation intent, missed timeline (promise_break), status-seeking, cure watch,
closure intent, switching, repeat contact, feature request. English and Hinglish.

Writes data/out/indusind_v2/work/classified.jsonl.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from collections import Counter

from normalise import WORK
from pii_names import redact_names  # normalise puts scripts/ on sys.path
from taxonomy import THEMES

T = {t["id"]: t for t in THEMES}


def rx(*parts: str) -> re.Pattern:
    # Proximity, not "anywhere later in a long post": ".*" becomes a 40-character window.
    return re.compile("|".join(p.replace(".*", ".{0,40}") for p in parts), re.I)


# Specific themes first; a match adds the theme (max 3 per item, in this order).
THEME_RULES: list[tuple[str, re.Pattern]] = [
    ("device_security_block", rx(r"threat (is |was )?detected", r"secure operating system", r"untrusted (app|screen|accessibility)", r"screen ?reader", r"screen ?record", r"developer (option|mode)", r"usb debugging", r"\broot(ed)?\b", r"security (violation|risk|threat|alert)", r"risky app", r"device (not|is not) (compatible|supported)", r"potential(ly)? (harmful|security)", r"accessibility (permission|service)", r"screen ?(sharing|reader) app", r"app (is )?disabled")),
    ("new_app_release", rx(r"new (app|version|update|ui|interface)", r"(after|since|with) (the )?(latest |recent |new )?update", r"old app (was|is) (better|good)", r"previous (version|app)", r"bring back (the )?old", r"integrated keyboard", r"custom keyboard", r"forced (to )?(update|migrate)", r"purana app", r"naya app")),
    ("login_mpin", rx(r"\blog ?in\b", r"\blogin\b", r"\bmpin\b", r"\bm-pin\b", r"password", r"\botp\b", r"registration", r"register", r"device binding", r"sim binding", r"verify (my )?(mobile|number)", r"sms verification", r"customer id", r"re-?register")),
    ("app_speed_crash", rx(r"\bslow\b", r"not (opening|loading|working|responding)", r"(doesn'?t|does not|won'?t|will not) (open|load|work)", r"\bcrash", r"\bhang", r"freez", r"something went wrong", r"technical (error|issue|glitch)", r"server (error|down|issue)", r"\blag", r"keeps? loading", r"stuck on", r"\bdown\b.*(app|server|site)", r"(app|server|site).*\bdown\b", r"bahut slow", r"khul(ta)? nahi", r"chal(ta)? nahi", r"timeout", r"time ?out", r"error")),
    ("netbanking", rx(r"net ?banking", r"netbanking", r"internet banking")),
    ("upi_failures", rx(r"\bupi\b.*(fail|pending|declin|not work|block|limit|error|stuck|deducted)", r"(fail|pending|declin|error|stuck).*\bupi\b", r"upi pin", r"upi lite", r"rupay.*upi", r"upi transaction")),
    ("failed_txn_reversal", rx(r"(debited|deducted|cut|kat gay[ae])\b.*(not|nahi|never).*(receiv|credit|revers|refund|return|mila|aaya)", r"not (been )?reversed", r"reversal", r"(atm|cash).*(not dispensed|didn'?t dispense|not received|nahi nikla)", r"money (got )?stuck", r"failed transaction", r"transaction failed.*(amount|money|debited)", r"paisa (kat|nahi aaya|wapas)")),
    ("refund_delay", rx(r"refund.{0,40}(not|yet|still|pending|delay|waiting|nahi|missing|never|since|months|weeks)", r"(not|yet|still|pending|waiting|never|nahi|no).{0,30}refund", r"money back.{0,30}(not|yet|still|pending)", r"paisa wapas nahi")),
    ("dispute_chargeback", rx(r"\bdispute", r"charge ?back")),
    ("unauthorised_txn", rx(r"unauthori[sz]ed", r"(did not|didn'?t|never) (make|do|authori[sz]e)", r"(money|amount|funds) (was |got )?(stolen|debited without)", r"without my (knowledge|consent|permission).*(debit|transaction|withdraw)", r"card (was )?misused", r"fraudulent (transaction|debit|charge)")),
    ("fraud_scam", rx(r"(scam|fraud)(ster)?s? (call|sms|message|link|caller)", r"(got|was|been|i was|i got|we were|he was|she was) (scammed|defrauded|cheated|duped|conned)", r"cyber ?(fraud|crime|cell)", r"(otp|kyc|upi|card|loan|investment|job|task|sim swap) (fraud|scam)", r"fraudulent", r"impersonat", r"fake (call|caller|executive|customer care|officer|agent|bank)", r"(lost|stolen).{0,30}(fraud|scam)", r"(fraud|scam).{0,30}(lost|debited|transferred|stolen)", r"thag(i|a) ho gay")),
    ("phishing", rx(r"phishing", r"fake (link|sms|message|app|website)", r"\bapk\b", r"malicious link", r"suspicious (link|sms|message)")),
    ("unsolicited_calls", rx(r"(sales|marketing|promotional|spam|telemarket|loan offer|insurance) calls?", r"calls? (every ?day|daily|repeatedly|again and again)", r"(where|how) did (you|they) get my (number|data|details)", r"stop calling", r"\bdnd\b", r"do not disturb", r"baar baar call")),
    ("recovery_conduct", rx(r"recovery (agent|call|team)", r"collection (agent|call|team)", r"harass", r"\bthreaten", r"abusive", r"legal notice.*(due|emi|outstanding)", r"(due|emi|outstanding).*legal notice", r"\bagent(s)? (came|visited|called)")),
    ("mis_selling", rx(r"mis-?sell", r"(insurance|policy|ulip).*(forced|pushed|without (my )?consent|bundled|sold)", r"(forced|pushed|without (my )?consent|bundled).*(insurance|policy|ulip)", r"misleading", r"false promise")),
    ("credit_report", rx(r"(cibil|credit (report|score)|experian|equifax|crif).{0,60}(wrong|incorrect|error|mistake|dispute|correct|dropped|drop|fell|hit|impact|damag|reported|not updated|still show|dpd|default|written off|settled|overdue)", r"(wrong|incorrect|error|dispute|correct|reported|not updated|dpd|written off|settled).{0,60}(cibil|credit report|credit score)")),
    ("card_variant_migration", rx(r"(variant|card).*(migrat|convert|discontinu|phased out|replac|downgrad)", r"(migrat|convert|discontinu|phased out|downgrad).*(variant|card)", r"(eazydiner|avios|jio-?bp|legend|pioneer) (card|variant).{0,30}(chang|discontinu|devalu|migrat)", r"forced upgrade", r"auto(matic(ally)?)?[- ]upgrad")),
    ("card_eligibility_upgrade", rx(r"eligib", r"\bupgrade", r"\bltf\b", r"lifetime free", r"life ?time free", r"pre-?approved", r"\b(pioneer|legend)\b.*(invite|get|apply|criteria)", r"\b(celesta|crest)\b.*(get|upgrade|criteria)", r"card to card", r"invite only")),
    ("card_application", rx(r"(card|application).*(reject|declin|denied|pending|stuck|in progress|under process|verification)", r"(reject|declin|denied).*(card|application)", r"video ?kyc", r"\bvkyc\b", r"apply(ing|ied)? for (a |the )?(credit )?card", r"application status")),
    ("reward_redemption", rx(r"redeem", r"redemption", r"voucher", r"milestone (benefit|voucher)", r"gift card")),
    ("rewards_value", rx(r"reward (point|rate|value|cap|structure)", r"reward points?", r"\bdevaluat", r"indus ?moments", r"cash ?point", r"accelerated", r"(5|10)x", r"\bcap(ped|s)?\b", r"spend (criteria|based)", r"lounge access", r"lounge")),
    ("card_fees_charges", rx(r"(annual|joining|renewal|membership) fee", r"late (payment )?(fee|charge)", r"finance charge", r"(credit card|\bcard\b).{0,25}(charges?|fees?)\b", r"(charges?|fees?).{0,15}(on|for) (my |the )?(credit )?card", r"no.?cost emi", r"forex markup", r"markup fee", r"processing fee.{0,20}emi", r"fee waiver")),
    ("card_limit", rx(r"credit limit", r"\blimit (enhancement|increase|decrease|reduc|cut)", r"(increase|enhance|reduce|cut)(d)? (my )?limit", r"low limit", r"\bcl\b")),
    ("card_dispatch", rx(r"(card|kit).*(not (yet )?(received|delivered|dispatched)|dispatch|courier|delivery)", r"(courier|delivery|dispatch).*(card|kit)", r"welcome kit", r"blue ?dart", r"card (not )?activated")),
    ("closure_requests", rx(r"\bclos(e|ing|ure)\b.*(account|card|loan|a/c)", r"(account|card|loan|a/c).*\bclos(e|ing|ure)\b", r"closure")),
    ("account_freeze", rx(r"\bfr(o|ee)ze", r"frozen", r"debit (freeze|block)", r"account (blocked|block|suspended|on hold|restricted)", r"\blien\b", r"\bhold\b.*(account|amount|funds)", r"cyber cell", r"\bncrp\b")),
    ("kyc_updates", rx(r"\bkyc\b", r"re-?kyc", r"(mobile|phone) number (update|change|link)", r"(address|email|nominee) (update|change)", r"(pan|aadha?ar) (link|update|seeding)")),
    ("account_opening", rx(r"(open|opening) (a |an |my |the )?(new )?(savings |salary |current |zero balance )?account", r"account opening", r"convert(ed)? (my )?(account|to salary)", r"salary account", r"minimum balance programme")),
    ("fees_charges_bank", rx(r"minimum balance", r"\bamb\b", r"(hidden|extra|unnecessary|unfair) (charge|fee)", r"(charges?|fee|penalty) (deducted|levied|debited)", r"(deducted|levied|debited).*(charge|fee|penalty)", r"\bgst\b.*charge", r"sms charge", r"penalty")),
    ("statements_documents", rx(r"statement", r"interest certificate", r"\bnoc\b", r"\bndc\b", r"certificate", r"form 16", r"tds")),
    ("loan_closure_documents", rx(r"foreclos", r"pre-?clos", r"(original|property) documents", r"loan (closure|closed).*(document|noc|title)", r"final settlement")),
    ("loan_processing", rx(r"(loan|home loan|personal loan|car loan).*(sanction|disburs|approv|reject|process|pending|valuation|legal verification)", r"(sanction|disburs).*loan", r"disbursal", r"disbursement", r"loan application")),
    ("loan_servicing", rx(r"\bemi\b", r"(loan|home loan).*(interest rate|rate reset|repo|tenure|part ?payment|prepay)", r"(interest rate|rate reset|repo rate|part ?payment|prepay).*(loan|emi)", r"loan (account|details|statement)")),
    ("atm_debit_card", rx(r"debit card", r"\batm\b", r"cash withdrawal")),
    ("merchant_pos", rx(r"\bpos\b", r"sound ?box", r"\bqr\b.*(merchant|settlement|shop)", r"merchant", r"settlement", r"swipe machine", r"edc")),
    ("nri_forex", rx(r"\bnri\b", r"\bnre\b", r"\bnro\b", r"remittance", r"forex card", r"swift", r"inward")),
    ("deposits_rates", rx(r"fixed deposit", r"\bfd\b", r"\brd\b", r"interest rate on (fd|deposit|savings)", r"sweep")),
    ("investments_wealth", rx(r"mutual fund", r"\bsip\b", r"portfolio", r"smart ?wealth", r"\bmf\b", r"demat")),
    ("rm_service", rx(r"\brm\b", r"relationship manager", r"relationship officer", r"wealth manager")),
    ("branch_service", rx(r"\bbranch", r"branch manager", r"\bstaff\b", r"rude", r"home branch", r"executive (was|is) rude")),
    ("care_unreachable", rx(r"customer (care|service|support)", r"phone ?banking", r"call (centre|center)", r"helpline", r"\bivr\b", r"\beva\b", r"chat ?bot", r"no one (picks|answers|responds)", r"(can'?t|cannot|unable to) (reach|contact|connect)", r"on hold", r"waiting (time|on call)", r"koi (call )?nahi uthata", r"not (picking|answering)")),
    ("complaint_handling", rx(r"(ref(erence)?|complaint|ticket|\bsr\b|service request|request) (no\.?|number|id)\b", r"no one (has )?(responded|replied|called|contacted)", r"(still|yet) (no|not).{0,30}(resol|response|reply|call ?back|action)", r"(kindly|please|pls) (look into|resolve|help me|check (my|this)|take action)", r"(dm|dmed|messaged|mailed|emailed|shared).{0,40}(no (response|reply|action|update)|nothing happened)", r"complaint.*(closed|close[ds]?) without", r"(closed|close[ds]?) (my )?complaint", r"generic (reply|response)", r"(ticket|complaint|request|sr)( number| no\.?)?.*(closed|no (action|update|resolution|response))", r"(raised|filed|lodged) (a |multiple |many |several )?complaints?", r"complaint (raised|filed|lodged|registered)", r"no resolution", r"not resolved", r"unresolved", r"dm(ed)? (you|details)", r"please (check|help|resolve).*(dm|inbox)", r"grievance", r"escalat")),
    ("offers_deals", rx(r"\boffer\b.*(discount|cashback|off\b|deal)", r"(discount|cashback|% off|flat \d+).*(indusind|card)", r"\bdeal\b", r"instant discount", r"bank offer")),
    ("market_news", rx(r"share price", r"\bstock\b", r"q[1-4] results", r"quarterly results", r"\bceo\b", r"\bmd\b.*(appoint|resign)", r"merger", r"market cap", r"dividend")),
]

GROUP_THEME_RULES = [
    ("insurance_group", rx(r"policy", r"premium", r"claim", r"insurance", r"surrender", r"nippon", r"inlic")),
    ("trading_securities", rx(r"trad(e|ing)", r"order", r"ipo", r"brokerage", r"demat", r"f&o", r"option", r"indusind securities")),
]

NEG = rx(
    r"worst", r"pathetic", r"useless", r"terrible", r"horrible", r"awful", r"disgust", r"frustrat", r"disappoint", r"annoy",
    r"poor", r"bad (service|app|experience|bank)", r"\bbad\b", r"not working", r"doesn'?t work", r"never work", r"fail", r"error",
    r"issue", r"problem", r"complain", r"scam", r"fraud", r"cheat", r"harass", r"rude", r"slow", r"crash", r"stuck", r"pending",
    r"still (not|waiting|no)", r"no (response|reply|update|resolution)", r"not (received|resolved|credited|refunded)", r"waste",
    r"rubbish", r"irritat", r"hate", r"shame", r"joke", r"ridiculous", r"unacceptable", r"hopeless", r"bekar", r"bakwas",
    r"ghatiya", r"faltu", r"third class", r"nonsense", r"blocked", r"denied", r"reject", r"charged", r"deducted", r"lost",
    r"unable", r"can'?t", r"cannot", r"won'?t", r"didn'?t", r"nahi (ho|mil|aa)", r"please (help|resolve|fix)", r"kindly (help|resolve|look)",
    r"sucks", r"trash", r"garbage", r"nightmare", r"stop", r"disaster", r"\bugly\b", r"\blag", r"hang", r"downgrad", r"devalu",
)
POS = rx(
    r"\bgood\b", r"great", r"excellent", r"awesome", r"amazing", r"\bnice\b", r"\bbest\b", r"love", r"smooth", r"easy",
    r"fast", r"quick", r"helpful", r"thank", r"superb", r"perfect", r"wonderful", r"fantastic", r"satisf", r"happy",
    r"convenient", r"user friendly", r"user-friendly", r"seamless", r"resolved", r"appreciate", r"impressive", r"brilliant",
    r"badhiya", r"accha", r"mast", r"\bosm\b", r"\bgud\b", r"worth it", r"recommend",
)
QUESTION = rx(r"\?", r"\bwhich (card|bank|one)", r"should i", r"is it worth", r"worth it\?", r"suggest", r"recommend(ation)?s?\?", r"how (to|do|can) i", r"any (idea|suggestion)", r"eligible\?")
SERVICE_PRAISE = rx(r"(staff|rm|relationship manager|branch|executive|team|customer care|support).*(helpful|great|excellent|good|thank|resolved|prompt)", r"(thank|thanks).*(indusind|team|rm|branch)", r"resolved (quickly|promptly|within)")

ESC_TARGETS = [
    ("rbi_ombudsman", r"ombuds(man|person)", "RBI Ombudsman"),
    ("rbi", r"(complain|complaint|report|escalat|approach|file|filed|lodge|write|writing|going) (to |with |in )?(the )?\brbi\b|\brbi\b.{0,30}(complain|complaint|ombuds|cms|escalat|portal)|@rbi\b|@rbisays|cms\.rbi", "RBI Ombudsman"),
    ("consumer_court", r"consumer (court|forum|commission)|ncdrc|edaakhil|e-daakhil|consumer helpline|\bnch\b", "RBI Ombudsman"),
    ("legal", r"legal (action|notice)|(take|drag|see) (you|them|indusind|the bank) to court|file a (case|suit)|my lawyer|\bsue (you|them|indusind)", "RBI Ombudsman"),
    ("ministers", r"@nsitharaman|@finminindia|@pmoindia|cpgrams|pg ?portal|finance minist", "Public"),
    ("grievance", r"grievance (cell|redressal|officer|team)|nodal officer|principal nodal|escalation matrix|escalat(e|ed|ing) (this|it|to|the)", "Grievance"),
    ("repeat", r"(third|3rd|fourth|4th|fifth|5th) time|complaint (number|no\.?|id)", "Repeat"),
]
STATUS = rx(r"where is my", r"no update", r"still waiting", r"\bstatus\b", r"kab tak", r"abhi tak", r"any update", r"not yet received", r"when will (i|my|it)", r"how long", r"still not")
CURE = rx(r"declin", r"\bfailed\b", r"blocked", r"limit (reached|exceeded)", r"transaction (failed|declined)", r"card (not working|blocked)")
CLOSURE = rx(r"(close|closing|closed|surrender(ed)?) (my|the|this) (account|card|a/c|credit card|savings)", r"(will|going to|want to|planning to) close", r"account band", r"closing (it|them)", r"port(ing)? (my )?(salary|account)", r"moving (my )?(account|salary|money) to", r"\bshift(ing)? to (hdfc|icici|axis|sbi|kotak|idfc|au|yes|federal)", r"never (use|bank with) indusind again")
REPEAT = rx(r"already (raised|complained|called|mailed|informed|shared|told)", r"multiple times", r"again and again", r"several times", r"many times", r"(third|3rd|fourth|4th|5th) time", r"no response", r"baar baar", r"repeatedly", r"every time")
FEATURE = re.compile(r"(please|pls|kindly|should|need|want|bring back|add|provide|allow|give)\s+(an?\s+)?(option|feature|facility|support|way|ability)\s+(to|for)\s+([\w\s-]{3,40})", re.I)
FEATURE2 = re.compile(r"(please|pls|kindly)\s+(add|bring back|enable|provide|allow|restore|remove)\s+([\w\s-]{3,40})", re.I)
DAYS = re.compile(r"(\d{1,3})\s*(working\s*)?(day|days|week|weeks|month|months|hrs|hours)\b", re.I)
PROMISE = rx(r"was promised", r"promised (to|me|that|within)", r"within \d+ (working )?days", r"\btat\b", r"even after \d+", r"no update (since|for)", r"still (not|no|pending|waiting)", r"it'?s been \d+", r"since \d+ (days|weeks|months)", r"\d+ (days|weeks|months) (and|but|now|still|passed|over)")
REQUEST_TYPES = [
    ("card_delivery", r"(card|kit).*(receiv|deliver|dispatch|courier)|courier|welcome kit"),
    ("reversal", r"revers|not dispensed|debited.*not|deducted.*not|failed transaction|paisa kat"),
    ("refund", r"refund"),
    ("dispute", r"dispute|chargeback"),
    ("closure", r"clos(e|ing|ure)"),
    ("loan_disbursal", r"disburs|sanction|loan (approv|application)"),
    ("credit_report", r"cibil|credit (report|score)"),
    ("kyc", r"kyc|mobile number|address (update|change)|nominee"),
]
BANKS = r"hdfc|icici|axis|sbi|kotak|idfc|au (small|bank)|yes bank|amex|american express|federal bank|onecard|scapia|bob\b|bank of baroda|hsbc|standard chartered|rbl"
SWITCH_TO = re.compile(rf"(moved|moving|switch(ed|ing)?|shift(ed|ing)?|port(ed|ing)?|going|go)\s+(my\s+\w+\s+)?to\s+({BANKS})", re.I)
SWITCH_FROM = re.compile(rf"(from|left|leaving)\s+({BANKS})\s+(to\s+)?indusind", re.I)

BUSINESS_RULES = [
    # Vehicle finance first: IndusInd's largest retail book; posts about it often mention a card in passing.
    ("loans", rx(r"vehicle loan", r"car loan", r"auto loan", r"tractor", r"two[- ]?wheeler loan", r"bike loan", r"truck loan", r"commercial vehicle", r"repossess", r"vehicle (was |got )?seiz", r"seized (my )?(car|vehicle|truck|tractor)")),
    ("cards", rx(r"credit card", r"\bcard\b", r"pioneer", r"legend", r"eazydiner", r"avios", r"jio-?bp", r"tiger", r"pinnacle", r"celesta", r"indus ?moments", r"reward", r"\bcc\b", r"annual fee", r"lounge")),
    ("payments", rx(r"\bupi\b", r"bhim ?induspay", r"induspay", r"payment (failed|gateway)", r"\bneft\b", r"\bimps\b", r"\brtgs\b", r"bill pay", r"fastag")),
    ("loans", rx(r"\bloan", r"\bemi\b", r"mortgage", r"disburs", r"foreclos")),
    ("wealth", rx(r"mutual fund", r"\bsip\b", r"demat", r"portfolio")),
    ("sme_merchant", rx(r"merchant", r"current account", r"\bpos\b", r"sound ?box", r"indie for business", r"business account")),
]
OWNER_BY_RT = {
    "card_delivery": "operations", "reversal": "payments", "refund": "operations", "dispute": "operations", "closure": "cards",
    "loan_disbursal": "loans", "credit_report": "compliance", "kyc": "operations", "other": "cx",
}


def sentiment(rec, text: str) -> tuple[str, int]:
    if rec["rating"] is not None:
        r = rec["rating"]
        return ("negative", 3 if r == 1 else 2) if r <= 2 else (("positive", 2) if r >= 4 else ("neutral", 1))
    n = len(NEG.findall(text))
    p = len(POS.findall(text))
    if n > p:
        return "negative", min(3, 1 + n - p)
    if p > n and p >= 1:
        return "positive", min(3, p - n)
    return "neutral", 1


def classify(rec: dict) -> dict:
    text = f"{rec.get('title') or ''} {rec.get('text') or ''}".strip()
    low = text.lower()
    sent, inten = sentiment(rec, low)
    themes: list[str] = []
    if rec["entity"] in ("indusind_life", "indusind_general", "other_group"):
        for tid, r in GROUP_THEME_RULES:
            if r.search(low):
                themes.append(tid)
                break
        if not themes:
            themes = ["insurance_group"]
    else:
        for tid, r in THEME_RULES:
            if r.search(low):
                if tid == "app_speed_crash" and rec["source"] not in ("playstore", "appstore") and not re.search(r"\bapp\b|website|site|server|net ?banking|portal", low):
                    continue  # "slow" or "error" in a social post is not about the app unless it says so
                themes.append(tid)
            if len(themes) == 3:
                break
        # Store-only: a negative review with no specific issue is about the app's speed only if it says so;
        # otherwise it falls through to the fallbacks.
        if not themes:
            if sent == "positive" and rec["source"] in ("playstore", "appstore"):
                themes = ["app_praise"]
            elif sent == "positive" and SERVICE_PRAISE.search(low):
                themes = ["service_praise"]
            elif QUESTION.search(low) and sent != "negative":
                themes = ["product_advice"]
            elif sent == "negative":
                themes = ["general_dissatisfaction"]
            else:
                themes = ["other"]
        elif sent == "positive" and rec["source"] in ("playstore", "appstore") and themes[0] in ("app_speed_crash", "login_mpin", "new_app_release") and not NEG.search(low):
            themes = ["app_praise"]  # "fast and easy login" is praise, not a login problem
    # Business
    business = rec.get("business_hint")
    if rec["entity"] != "indusind_bank":
        business = "group_company"
    elif business in (None, "retail_banking") or rec["source"] not in ("playstore", "appstore"):
        found = None
        for b, r in BUSINESS_RULES:
            if r.search(low):
                found = b
                break
        if rec["source"] in ("playstore", "appstore") and rec.get("business_hint"):
            business = rec["business_hint"] if not found or rec["business_hint"] != "retail_banking" else (found if found in ("cards", "payments", "loans") else "retail_banking")
        else:
            business = found or T[themes[0]]["business"]
            if business == "group_company":
                business = "retail_banking"
    # Flags
    esc_target = None
    for tgt, pat, _ in ESC_TARGETS:
        if re.search(pat, low, re.I):
            esc_target = tgt
            break
    escalation = esc_target is not None and esc_target != "repeat" and sent != "positive"
    days = None
    m = DAYS.search(low)
    if m:
        n = int(m.group(1))
        unit = m.group(3).lower()
        days = n * (7 if unit.startswith("week") else 30 if unit.startswith("month") else 1 / 24 if unit.startswith("h") else 1)
        days = round(days, 1)
    promise_break = bool(PROMISE.search(low)) or (days is not None and days >= 2 and bool(re.search(r"still|waiting|not|no |nahi|pending|since|ago|yet", low)))
    request_type = None
    if promise_break:
        request_type = next((rt for rt, pat in REQUEST_TYPES if re.search(pat, low, re.I)), "other")
    status_seeking = bool(STATUS.search(low))
    cure = bool(CURE.search(low)) and sent == "negative"
    closure = bool(CLOSURE.search(low))
    sw = None
    mt = SWITCH_TO.search(low)
    mf = SWITCH_FROM.search(low)
    if mt:
        sw = {"direction": "to", "bank": mt.group(6).lower()}
    elif mf:
        sw = {"direction": "from", "bank": mf.group(2).lower()}
    repeat = bool(REPEAT.search(low))
    feat = None
    fm = FEATURE.search(text) or FEATURE2.search(text)
    if fm:
        label = fm.groups()[-1].strip().lower()
        label = re.split(r"[.,;!?\n]| and | but | so ", label)[0].strip()
        feat = " ".join(label.split()[:6])
    owner = T[themes[0]]["owner"]
    return {
        **rec,
        "business": business,
        "pillar": T[themes[0]]["pillar"],
        "themes": themes,
        "sentiment": sent,
        "intensity": inten,
        "escalation_intent": escalation,
        "escalation_target": esc_target,
        "promise_break": promise_break,
        "request_type": request_type,
        "days_elapsed": days,
        "status_seeking": status_seeking,
        "cure_watch": cure,
        "closure_intent": closure,
        "switching": sw,
        "repeat_contact": repeat,
        "feature_request": feat,
        "owner": owner,
        "summary": summarise(rec),
        "classified_by": "rules",
    }


def summarise(rec) -> str:
    """Short excerpt for evidence cards: the review title, or the first sentence, cut to 20 words."""
    src = rec.get("title") if rec["source"] in ("appstore", "reddit", "forum") and rec.get("title") else rec.get("text") or ""
    src = re.sub(r"(\[handle\]\s*)+", "", src)
    src = re.sub(r"@\w+\s*", "", src).strip()
    src = re.sub(r"https?://\S+", "", src).strip()
    # A salutation whose name was redacted ("Dear , ...", "Hi team,") is not part of the point.
    src = re.sub(r"^(?:dear|hi|hello|hey|respected)\b[^,.!?\n]{0,30}[,.!]\s*", "", src, flags=re.I).strip()
    # Abbreviations are not sentence ends; a fragment of under six words takes the next sentence too.
    protected = re.sub(r"\b(i\.e|e\.g|etc|rs|no|vs|mr|mrs|ms|dr|approx|a/c)\.", lambda m: m.group(0).replace(".", "․"), src, flags=re.I)
    parts = re.split(r"(?<=[.!?])\s+", protected)
    first = parts[0]
    for nxt in parts[1:]:
        if len(first.split()) >= 6:
            break
        first = f"{first} {nxt}"
    first = first.replace("․", ".")
    words = first.split()
    s = " ".join(words[:20]) + ("…" if len(words) > 20 else "")
    s = s.replace("!", ".")
    return s[:1].upper() + s[1:] if s else ""


LLM_DIR = WORK / "llm_batches"
VALID_RT = {"card_delivery", "refund", "reversal", "dispute", "closure", "loan_disbursal", "credit_report", "kyc", "other"}
VALID_TGT = {"rbi", "rbi_ombudsman", "consumer_court", "legal", "ministers", "grievance"}


def load_llm() -> dict[str, dict]:
    """Model labels for social items (in-session batches), accepted chunk by chunk through the quality gate."""
    from llm_gate import good_prefix

    labels: dict[str, dict] = {}
    for out in sorted(LLM_DIR.glob("batch_*.out.jsonl")):
        src = Path(str(out).replace(".out", ""))
        rows, keep = good_prefix(src, out)
        total = sum(1 for line in open(out, encoding="utf-8") if line.strip())
        print("llm batch", out.name, "accepted", keep, "of", total)
        for r in rows:
            labels[r["id"]] = r
    return labels


def apply_llm(rec: dict, lab: dict) -> dict:
    themes = [t for t in (lab.get("themes") or []) if t in T][:3]
    rel = lab.get("rel") if lab.get("rel") in ("on_topic", "mention_only", "off_topic") else rec["relevant"]
    entity = rec["entity"]
    if lab.get("entity") == "group":
        entity = "other_group"
        themes = [t for t in themes if t in ("insurance_group", "trading_securities")] or ["insurance_group"]
    elif lab.get("entity") == "bank":
        entity = "indusind_bank"
        themes = [t for t in themes if t not in ("insurance_group", "trading_securities")]
    if not themes:
        themes = ["other"]
    sent = lab.get("sentiment") if lab.get("sentiment") in ("positive", "neutral", "negative") else rec["sentiment"]
    low = f"{rec.get('title') or ''} {rec.get('text') or ''}".lower()
    business = "group_company" if entity != "indusind_bank" else next((b for b, r in BUSINESS_RULES if r.search(low)), T[themes[0]]["business"])
    if business == "group_company" and entity == "indusind_bank":
        business = "retail_banking"
    tgt = lab.get("esc_target") if lab.get("esc_target") in VALID_TGT else None
    esc = bool(lab.get("esc")) and sent != "positive"
    mt = bool(lab.get("missed_timeline"))
    rt = lab.get("request_type") if lab.get("request_type") in VALID_RT else ("other" if mt else None)
    # Model summaries were written from the original post: redact names and handles here as well.
    summary = redact_names((lab.get("summary") or rec["summary"]).replace("!", ".").strip())
    return {
        **rec,
        "relevant": rel,
        "entity": entity,
        "business": business,
        "pillar": T[themes[0]]["pillar"],
        "themes": themes,
        "sentiment": sent,
        "escalation_intent": esc,
        "escalation_target": tgt if esc else None,
        "promise_break": mt,
        "request_type": rt if mt else None,
        "status_seeking": bool(lab.get("status_seeking")),
        "closure_intent": bool(lab.get("closure_intent")),
        "repeat_contact": bool(lab.get("repeat")),
        "cure_watch": rec["cure_watch"] and sent == "negative",
        "owner": T[themes[0]]["owner"],
        "summary": summary,
        "classified_by": "in_session_batch",
    }


# Other banks and their card products, as customers name them in comparisons. Masked after classification, like a
# person's name, so no other bank (or another client of ours) is named on an IndusInd screen. Peers in the IndusInd
# peer set stay (Federal, Yes, IDFC First, Kotak, RBL, AU, Bandhan).
OTHER_BANK = re.compile(
    r"\b(?:hdfc(?:\s*bank)?|icici(?:\s*bank)?|axis(?:\s*bank)?|sbi(?:\s*card)?|state bank of india|standard chartered|stanchart|"
    r"flipkart|amex|american express|hsbc|citi(?:bank)?)\b"
    r"(?:\s+(?:millen+i+a|regalia(?:\s*gold)?|infinia|diners(?:\s*club)?(?:\s*black)?|swiggy|pixel(?:\s*play)?|moneyback\+?|"
    r"marriott|tata\s*neu|amazon\s*pay|emerald|sapphiro|coral|rubyx|atlas|magnus|select|ace|neo|cashback|simply\s*click|elite|prime))?",
    re.I,
)
OTHER_PRODUCT = re.compile(
    r"\b(?:millen+i+a|regalia(?:\s*gold)?|infinia|diners\s*club(?:\s*black)?|swiggy\s*(?:hdfc|card)|pixel\s*play|tata\s*neu|"
    r"amazon\s*pay\s*icici|payzapp|smartbuy|magnus|sapphiro|rubyx|emeralde?)\b",
    re.I,
)


PROFANE = re.compile(r"\b(?:shit+y?|f+u+c*k+\w*|f\*+k|bastards?|bullshit|crap|chutiy\w*|bhen\s*chod|behenchod|madar\s*chod|\bmc\b|\bbc\b|gandu|harami|bsdk|lodu|randi)\b", re.I)


def mask_banks(s):
    if not s:
        return s
    s = re.sub(r"@\w*(?:hdfc|icici|axis|sbi|flipkart|amex|citi|hsbc)\w*", "[handle]", s, flags=re.I)
    return OTHER_PRODUCT.sub("[another bank's card]", OTHER_BANK.sub("[another bank]", s))


def main():
    llm = load_llm()
    out = []
    for line in open(WORK / "normalised.jsonl", encoding="utf-8"):
        rec = classify(json.loads(line))
        if rec["id"] in llm and rec["source"] in ("x", "reddit", "forum"):
            rec = apply_llm(rec, llm[rec["id"]])
        for k in ("summary", "text", "title"):
            rec[k] = mask_banks(rec.get(k))
            if rec[k]:  # no link of any kind in a quote: short links and image previews can lead back to the post
                rec[k] = re.sub(r"\s*https?://\S+", "", rec[k]).strip()
        rec["profane"] = bool(PROFANE.search(f"{rec.get('title') or ''} {rec.get('text') or ''}"))
        out.append(rec)
    with open(WORK / "classified.jsonl", "w", encoding="utf-8") as f:
        for r in out:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    on = [r for r in out if r["relevant"] == "on_topic" and r["entity"] == "indusind_bank"]
    c = Counter(t for r in on for t in r["themes"][:1])
    print("bank on-topic", len(on), Counter(r["classified_by"] for r in out))
    for k, v in c.most_common(60):
        print(f"  {k:28} {v}")
    print("sentiment", Counter(r["sentiment"] for r in on))
    print("flags", {k: sum(1 for r in on if r[k]) for k in ("escalation_intent", "promise_break", "status_seeking", "closure_intent", "repeat_contact", "cure_watch")})


if __name__ == "__main__":
    main()
