"""Shared constants for the V3 build (B7 brief). Paths, the product list, theme → product mapping and deliverable TATs."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
RAW = DATA / "raw" / "indusind"
OUT_APP = DATA / "out" / "indusind_v2"
SEED_V3 = DATA / "seed" / "indusind_v2"

SEED = 20261004  # IndusInd V2: its own fixed seed
# The brief is written for the 29 September morning review: every age is measured from this moment.
NOW = "2026-09-29T07:45:00+05:30"
WINDOW = ("2026-07-01", "2026-09-28")

# Rows of the "pulse by product" table (B7 §1 E1.6). Group-company apps stay excluded.
PRODUCTS = [
    {"id": "cards", "label": "Cards", "owner": "cards", "module": "cards"},
    {"id": "upi", "label": "UPI and BHIM IndusPay", "owner": "payments", "module": None},
    {"id": "accounts", "label": "Accounts and deposits", "owner": "retail", "module": None},
    {"id": "personal_loans", "label": "Personal loans", "owner": "loans", "module": None},
    {"id": "home_loans", "label": "Home loans", "owner": "loans", "module": None},
    {"id": "auto_loans", "label": "Vehicle finance", "owner": "loans", "module": None},
    {"id": "insurance", "label": "Insurance (bank-sold)", "owner": "product", "module": None},
    {"id": "digital", "label": "Digital (INDIE app and net banking)", "owner": "digital", "module": "digital"},
]
PRODUCT_IDS = [p["id"] for p in PRODUCTS]
PRODUCT_LABEL = {p["id"]: p["label"] for p in PRODUCTS}

OWNER_LABEL = {
    "cx": "CX",
    "digital": "Digital",
    "cards": "Cards",
    "retail": "Retail",
    "loans": "Loans",
    "payments": "Payments",
    "compliance": "Compliance",
    "fraud_cyber": "Fraud and Cyber",
    "operations": "Operations",
    "rm": "Relationship managers",
    "product": "Product",
}

# Deliverables (B7 D1). TATs marked "rbi" are published RBI timelines. "bank_confirmed" rows carry a TAT the bank has
# confirmed: `tat_label` shows it (e.g. "7 working days") and `source_note` names the document and section. "bank" rows
# are unconfirmed and read BANK_TAT_LABEL; their `tat_days` is a parameter of the illustrative sample generator only and
# never reaches a screen (follow-up fix 3). Days are working days (Sundays skipped) unless `calendar` is set.
# D-11 (the TAT reference B7 inherits) is not in the repo (qa/tat_check.md), so no bank row is confirmed yet.
BANK_TAT_LABEL = "Bank TAT: confirm in discovery"
DELIVERABLES = {
    "failed_reversal": {
        "label": "Failed transaction reversal",
        "tat_days": 1,
        "tat_label": "T+1 (UPI, card-to-card); T+5 (ATM)",
        "source": "rbi",
        "source_note": "RBI, harmonised TAT for failed transactions (20 Sep 2019)",
        "compensation": "₹100 per day of delay",
    },
    "card_closure": {
        "label": "Credit card closure",
        "tat_days": 7,
        "tat_label": "7 working days",
        "source": "rbi",
        "source_note": "RBI Master Direction on credit and debit cards (2022)",
        "compensation": "₹500 per day of delay",
    },
    "unauthorised_reversal": {
        "label": "Unauthorised transaction: shadow credit",
        "tat_days": 10,
        "tat_label": "10 working days",
        "source": "rbi",
        "source_note": "RBI, limiting customer liability in unauthorised electronic transactions (2017)",
        "compensation": "Full shadow credit within the TAT",
    },
    "credit_report": {
        "label": "Credit information correction",
        "tat_days": 30,
        "calendar": True,
        "tat_label": "30 calendar days (21 bank + 9 bureau)",
        "source": "rbi",
        "source_note": "RBI, compensation for delayed credit-information correction (2023)",
        "compensation": "₹100 per day of delay",
    },
    "loan_documents": {
        "label": "Property documents after loan closure",
        "tat_days": 30,
        "calendar": True,
        "tat_label": "30 calendar days",
        "source": "rbi",
        "source_note": "RBI, release of property documents on repayment (2023)",
        "compensation": "₹5,000 per day of delay",
    },
    "complaint_resolution": {
        "label": "Complaint resolution before ombudsman eligibility",
        "tat_days": 30,
        "calendar": True,
        "tat_label": "30 calendar days",
        "source": "rbi",
        "source_note": "RBI Integrated Ombudsman Scheme (2021)",
        "compensation": "Customer may escalate to the RBI Ombudsman",
    },
    "card_dispatch": {
        "label": "Card dispatch and delivery",
        "tat_days": 7,
        "tat_label": BANK_TAT_LABEL,
        "source": "bank",
        "compensation": "—",
    },
    "dispute": {
        "label": "Card dispute and chargeback",
        "tat_days": 30,
        "calendar": True,
        "tat_label": BANK_TAT_LABEL,
        "source": "bank",
        "compensation": "—",
    },
    "refund": {
        "label": "Merchant refund credited",
        "tat_days": 7,
        "tat_label": BANK_TAT_LABEL,
        "source": "bank",
        "compensation": "—",
    },
    "service_request": {
        "label": "Service request (KYC, account changes, card requests)",
        "tat_days": 3,
        "tat_label": BANK_TAT_LABEL,
        "source": "bank",
        "compensation": "—",
    },
    "account_unfreeze": {
        "label": "Debit freeze review",
        "tat_days": 3,
        "tat_label": BANK_TAT_LABEL,
        "source": "bank",
        "compensation": "—",
    },
    "loan_disbursal": {
        "label": "Loan sanction and disbursal",
        "tat_days": 5,
        "tat_label": BANK_TAT_LABEL,
        "source": "bank",
        "compensation": "—",
    },
    "query_response": {
        "label": "First response to a query or complaint",
        "tat_days": 1,
        "tat_label": BANK_TAT_LABEL,
        "source": "bank",
        "compensation": "—",
    },
}

# Public theme → deliverable it is measured against. Themes not listed use query_response.
THEME_DELIVERABLE = {
    "failed_txn_reversal": "failed_reversal",
    "upi_failures": "failed_reversal",
    "closure_requests": "card_closure",
    "unauthorised_txn": "unauthorised_reversal",
    "credit_report": "credit_report",
    "loan_closure_documents": "loan_documents",
    "complaint_handling": "complaint_resolution",
    "card_dispatch": "card_dispatch",
    "dispute_chargeback": "dispute",
    "refund_delay": "refund",
    "kyc_updates": "service_request",
    "card_variant_migration": "service_request",
    "card_eligibility_upgrade": "service_request",
    "card_limit": "service_request",
    "card_application": "service_request",
    "reward_redemption": "service_request",
    "account_opening": "service_request",
    "statements_documents": "service_request",
    "account_freeze": "account_unfreeze",
    "loan_processing": "loan_disbursal",
}

# Customer journey stage of each theme (satisfaction page, "Where in the journey"). Themes not listed are "Everyday use".
JOURNEY_STAGE = {
    **dict.fromkeys(["account_opening", "card_application", "kyc_updates", "loan_processing"], "Open"),
    **dict.fromkeys(["card_dispatch", "login_mpin", "device_security_block"], "Activate"),
    **dict.fromkeys(
        [
            "card_variant_migration", "card_eligibility_upgrade", "statements_documents", "branch_service",
            "care_unreachable", "rm_service", "account_freeze", "loan_servicing", "credit_report", "unsolicited_calls",
            "mis_selling", "recovery_conduct", "complaint_handling",
        ],
        "Service requests",
    ),
    **dict.fromkeys(
        ["dispute_chargeback", "failed_txn_reversal", "refund_delay", "unauthorised_txn", "fraud_scam", "phishing"],
        "Disputes and fraud",
    ),
    **dict.fromkeys(["closure_requests", "loan_closure_documents"], "Close"),
}
JOURNEY_ORDER = ["Open", "Activate", "Everyday use", "Service requests", "Disputes and fraud", "Close"]

# Request types used by the public "missed timeline" signal, so the internal ageing joins the public rows.
THEME_REQUEST_TYPE = {
    **dict.fromkeys(["failed_txn_reversal", "upi_failures", "unauthorised_txn"], "reversal"),
    "closure_requests": "closure",
    "credit_report": "credit_report",
    "card_dispatch": "card_delivery",
    "dispute_chargeback": "dispute",
    "refund_delay": "refund",
    "kyc_updates": "kyc",
    "loan_processing": "loan_disbursal",
}

# Overnight routing scenario (illustrative): what LisN routed to an owner's system and when the owner acknowledged it.
# One list feeds every acknowledgement on screen, so a theme never reads "Acknowledged" in one place and "Awaiting
# owner" in another. acknowledged_at None = routed, not yet acknowledged.
ROUTING = [
    {"theme": "complaint_handling", "owner": "cx", "system": "CRM case queue", "acknowledged_at": "23:45"},
    {"theme": "card_application", "owner": "cards", "system": "Cards service queue", "acknowledged_at": "22:10"},
    {"theme": "refund_delay", "owner": "operations", "system": "Operations work queue", "acknowledged_at": "06:55"},
    {"theme": "card_variant_migration", "owner": "cards", "system": "Cards service queue", "acknowledged_at": "22:10"},
    {"theme": "care_unreachable", "owner": "cx", "system": "CRM case queue", "acknowledged_at": "06:55"},
    {"theme": "failed_txn_reversal", "owner": "payments", "system": "Payments work queue", "acknowledged_at": None},
]

# Themes that are not customer issues (no deliverable, never "open"): used only for public mood.
NON_ISSUE_THEMES = {
    "app_praise",
    "service_praise",
    "product_advice",
    "offers_deals",
    "market_news",
    "other",
    "trading_securities",
    "insurance_group",
}


def load(path: Path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def dump(obj, path: Path, indent: int | None = 1):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=indent)
        f.write("\n")


# ------------------------------------------------------------------ periods (30 Sep review, changes_30sep.md A1)
# Every period ends at the last moment in the data (29 Sep 08:30), never at the real clock. The morning brief is
# yesterday 08:30 to today 08:30 in data time.
PERIOD_END = "2026-09-29T08:30:00+05:30"
DATA_START = "2026-07-01T00:00:00+05:30"
PERIODS = [
    {"id": "brief", "label": "Morning brief", "days": 1, "short": True},
    {"id": "7d", "label": "Last 7 days", "days": 7, "short": True},
    {"id": "30d", "label": "Last 30 days", "days": 30, "short": False},
    {"id": "all", "label": "Full window", "days": None, "short": False},
]
DEFAULT_PERIOD = "7d"
# Share of a short period's public items one source may hold before shares and trends must be source-weighted.
SOURCE_DOMINANCE_LIMIT = 0.60

# Channels on the Customer pulse and CX pulse. IVR bot is not a customer contact channel here (30 Sep review);
# inbound and outbound calls are one "Calls" channel.
CHANNEL_GROUP = {
    "email": "emails",
    "inbound_voice": "calls",
    "outbound_voice": "calls",
    "chat": "chat",
    "whatsapp": "whatsapp",
    "social_inbox": "social",
    "branch": "branch",
}
CHANNEL_GROUP_ORDER = ["emails", "calls", "chat", "whatsapp", "social", "branch"]
CHANNEL_GROUP_LABEL = {
    "emails": "Emails",
    "calls": "Calls",
    "chat": "Chat",
    "whatsapp": "WhatsApp",
    "social": "Social",
    "branch": "Branch",
}
PULSE_LISTS = ["priority_a", "priority_b", "uhni", "multi"]

# Businesses on the morning brief cards (3 + 3). Insurance is thin in public voice; auto loans thinner still.
BRIEF_BUSINESSES = ["cards", "upi", "accounts", "personal_loans", "home_loans", "insurance"]

# Cards issue categories (C3): each public item and interaction counts once, under its primary theme's category;
# the themes are the subcategories. Owners are roles in the cards team, never names. "tat" marks categories that
# carry a deliverable (the old Deliverables breakdown), shown without TAT compliance.
CARDS_CATEGORIES = [
    {"id": "rewards", "label": "Rewards and redemption", "owner": "Cards · Rewards lead", "tat": False,
     "themes": ["rewards_value", "reward_redemption", "offers_deals"]},
    {"id": "upgrades", "label": "Upgrades, variants and eligibility", "owner": "Cards · Product lead", "tat": True,
     "themes": ["card_variant_migration", "card_eligibility_upgrade"]},
    {"id": "applications", "label": "Applications and verification", "owner": "Cards · Acquisition lead", "tat": True,
     "themes": ["card_application", "kyc_updates"]},
    {"id": "fees", "label": "Fees and charges", "owner": "Cards · Pricing lead", "tat": False,
     "themes": ["card_fees_charges", "fees_charges_bank"]},
    {"id": "limits", "label": "Limits", "owner": "Cards · Credit policy lead", "tat": True, "themes": ["card_limit"]},
    {"id": "disputes", "label": "Disputes, refunds and reversals", "owner": "Cards · Disputes lead", "tat": True,
     "themes": ["dispute_chargeback", "refund_delay", "failed_txn_reversal", "unauthorised_txn", "merchant_pos"]},
    {"id": "delivery", "label": "Card delivery", "owner": "Cards · Fulfilment lead", "tat": True, "themes": ["card_dispatch"]},
    {"id": "closure", "label": "Closure", "owner": "Cards · Retention lead", "tat": True, "themes": ["closure_requests"]},
    {"id": "service", "label": "Service and complaint handling", "owner": "Cards · Service lead", "tat": True,
     "themes": ["complaint_handling", "care_unreachable", "branch_service", "rm_service", "unsolicited_calls"]},
    {"id": "fraud", "label": "Fraud and security", "owner": "Cards · Fraud lead", "tat": False,
     "themes": ["fraud_scam", "phishing", "device_security_block", "recovery_conduct"]},
    {"id": "digital", "label": "App and online card servicing", "owner": "Cards · Digital lead", "tat": False,
     "themes": ["app_speed_crash", "app_usability", "login_mpin", "new_app_release", "netbanking", "statements_documents"]},
]
CARDS_OTHER = {"id": "other", "label": "Other", "owner": "Cards · CX lead", "tat": False, "themes": []}


def inr(n: int) -> str:
    """A count with Indian digit grouping (1,10,047), for sentences written by the pipeline."""
    s = str(abs(int(n)))
    if len(s) > 3:
        head, tail = s[:-3], s[-3:]
        parts = []
        while len(head) > 2:
            parts.insert(0, head[-2:])
            head = head[:-2]
        s = ",".join([p for p in [head, *parts, tail] if p])
    return ("-" if n < 0 else "") + s
