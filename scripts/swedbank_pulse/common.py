"""Shared constants for the Swedbank pulse (docs/swedbank/DECISIONS.md), copied from the NatWest build. Paths, the product list, theme → product mapping and deliverable TATs."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
RAW = DATA / "raw" / "swedbank"
OUT_APP = DATA / "out" / "swedbank_pulse"
SEED_V3 = DATA / "seed" / "swedbank_pulse"

SEED = 20260928
# The brief is written for the 29 September morning review: every age is measured from this moment.
NOW = "2026-11-17T06:45:00+00:00"  # SW-D03: 17 Nov 2026 07:45 CET, held in UTC (the code compares ISO strings)
WINDOW = ("2026-10-22", "2026-11-17")
# Swedish public holidays in or just after the window (SW-D03): business days skip them and weekends. All Saints' Day
# (31 Oct 2026) is a Saturday.
BANK_HOLIDAYS = {"2026-12-24", "2026-12-25", "2026-12-26", "2026-12-31", "2027-01-01", "2027-01-06"}


def is_business_day(d) -> bool:
    return d.weekday() < 5 and d.date().isoformat() not in BANK_HOLIDAYS

# Rows of the "pulse by product" table (SW-D16, Usha): six products in this order. Everyday accounts and app leads and
# carries the worked deep dive (module "everyday_accounts_app", the save list): the app update and account measures
# both sit in it. Nina keeps its module (module/nina_digital), never a card.
PRODUCTS = [
    {"id": "everyday_accounts_app", "label": "Everyday accounts and app", "owner": "retail", "module": "everyday_accounts_app"},
    {"id": "payments_swish", "label": "Payments and Swish", "owner": "payments", "module": None},
    {"id": "cards", "label": "Cards", "owner": "cards", "module": None},
    {"id": "mortgages", "label": "Mortgages (bolån)", "owner": "loans", "module": None},
    {"id": "savings_funds", "label": "Savings and funds", "owner": "product", "module": None},
    {"id": "consumer_loans", "label": "Consumer loans", "owner": "loans", "module": None},
]
# The product whose deep dive is the worked example.
DEEP_DIVE_PRODUCT = "everyday_accounts_app"
PRODUCT_IDS = [p["id"] for p in PRODUCTS]
PRODUCT_LABEL = {p["id"]: p["label"] for p in PRODUCTS}

OWNER_LABEL = {
    "cx": "Complaints lead",
    "digital": "Digital and Nina",
    "cards": "Cards product owner",
    "retail": "Everyday banking product owner",
    "loans": "Lending product owner",
    "payments": "Payments and Swish operations",
    "compliance": "Compliance",
    "fraud_cyber": "Fraud operations",
    "operations": "Operations",
    "rm": "Premium and Private Banking advisers",
    "product": "Savings and funds product owner",
}

# Service standards ledger (SW-D08). Sources: "law" = the Payment Services Act (betaltjänstlagen); "scheme" = the Swish
# rule; "bank_indicative" = a bank figure the brief gives, still to confirm; "bank" = unconfirmed, reads BANK_TAT_LABEL.
# Every row not backed by law carries "confirm with the bank". tat_days of a "bank" row drives the sample generator only
# and never reaches a screen. Days are business days (weekends and Swedish public holidays skipped) unless `calendar`.
# "compensation" is the Redress column: what ARN can recommend.
BANK_TAT_LABEL = "Bank standard: confirm with the bank"
ARN_REDRESS = "ARN recommendation (confirm with the bank)"
DELIVERABLES = {
    "failed_reversal": {
        "label": "Swish payment delivered",
        "tat_days": 1,
        "tat_label": "Within seconds (Swish rule)",
        "source": "scheme",
        "source_note": "Swish rule: a payment reaches the payee within seconds; a failed one is not debited",
        "compensation": "—",
    },
    "query_response": {
        "label": "First reply to a complaint", "tat_days": 15,
        "tat_label": "15 business days (bank standard, confirm with the bank)",
        "source": "bank_indicative", "compensation": "—",
    },
    "complaint_resolution": {
        "label": "Final decision on a complaint", "tat_days": 15, "tat_label": BANK_TAT_LABEL, "source": "bank",
        "compensation": ARN_REDRESS,
    },
    "unauthorised_reversal": {
        "label": "Unauthorised transaction refund", "tat_days": 1,
        "tat_label": "Next business day (Payment Services Act)",
        "source": "law",
        "source_note": "Payment Services Act (betaltjänstlagen): refund an unauthorised transaction by the next business "
                       "day; manipulated transfers are investigated",
        "compensation": ARN_REDRESS,
    },
    "manipulated_transfer": {
        "label": "Manipulated transfer investigated", "tat_days": 15,
        "tat_label": "Investigated within 15 business days (bank standard, confirm with the bank)",
        "source": "bank_indicative", "compensation": ARN_REDRESS,
    },
    "account_unfreeze": {"label": "Account-measure review", "tat_days": 5, "tat_label": BANK_TAT_LABEL, "source": "bank",
                         "compensation": ARN_REDRESS},
    "dispute": {"label": "Card dispute", "tat_days": 30, "calendar": True, "tat_label": BANK_TAT_LABEL, "source": "bank",
                "compensation": ARN_REDRESS},
    "loan_documents": {"label": "Mortgage offer", "tat_days": 5, "tat_label": BANK_TAT_LABEL, "source": "bank",
                       "compensation": "—"},
    "service_request": {"label": "BankID re-issue", "tat_days": 2, "tat_label": BANK_TAT_LABEL, "source": "bank",
                        "compensation": "—"},
    "loan_disbursal": {"label": "Loan decision", "tat_days": 3, "tat_label": BANK_TAT_LABEL, "source": "bank",
                       "compensation": "—"},
}

# Public theme → deliverable it is measured against. Themes not listed use query_response.
THEME_DELIVERABLE = {
    "failed_txn_reversal": "failed_reversal",
    "swish_payment_failures": "failed_reversal",
    "unauthorised_txn": "unauthorised_reversal",
    "manipulated_transfer": "manipulated_transfer",
    "fraud_scam": "manipulated_transfer",
    "loan_closure_documents": "loan_documents",
    "mortgage_rate": "loan_documents",
    "complaint_handling": "complaint_resolution",
    "dispute_chargeback": "dispute",
    "refund_delay": "dispute",
    "identity_checks": "service_request",
    "app_login_biometrics": "service_request",
    # Nina failures: the customer still needs the request done, so a service request, not a query.
    "nina_unresolved": "service_request",
    "nina_wrong_answer": "service_request",
    "nina_handoff_lost": "service_request",
    "nina_no_person": "service_request",
    "account_freeze": "account_unfreeze",
    "loan_processing": "loan_disbursal",
}

# Customer journey stage of each theme (satisfaction page, "Where in the journey"). Themes not listed are "Everyday banking".
JOURNEY_STAGE = {
    **dict.fromkeys(["account_opening", "card_application", "identity_checks", "loan_processing"], "Open"),
    **dict.fromkeys(["card_dispatch", "app_login_biometrics", "device_security_block"], "Activate"),
    **dict.fromkeys(
        [
            "card_eligibility_upgrade", "statements_documents", "branch_service",
            "care_unreachable", "premium_service", "account_freeze", "loan_servicing", "credit_report", "unsolicited_calls",
            "mis_selling", "recovery_conduct", "card_limit", "reward_redemption",
        ],
        "Service requests",
    ),
    **dict.fromkeys(
        ["dispute_chargeback", "failed_txn_reversal", "refund_delay", "unauthorised_txn", "fraud_scam", "phishing",
         "manipulated_transfer"],
        "Disputes and fraud",
    ),
    **dict.fromkeys(["closure_requests", "loan_closure_documents"], "Switch or close"),
}
JOURNEY_ORDER = ["Open", "Activate", "Everyday banking", "Service requests", "Disputes and fraud", "Switch or close"]

# Request types used by the public "missed timeline" signal, so the internal ageing joins the public rows.
THEME_REQUEST_TYPE = {
    **dict.fromkeys(["failed_txn_reversal", "swish_payment_failures", "unauthorised_txn"], "reversal"),
    "closure_requests": "closure",
    "credit_report": "credit_report",
    "card_dispatch": "card_delivery",
    "dispute_chargeback": "dispute",
    "refund_delay": "refund",
    "identity_checks": "kyc",
    "loan_processing": "loan_disbursal",
}

# Overnight routing scenario (illustrative): what LisN routed to an owner's system and when the owner acknowledged it.
# One list feeds every acknowledgement on screen, so a theme never reads "Acknowledged" in one place and "Awaiting
# owner" in another. acknowledged_at None = routed, not yet acknowledged.
ROUTING = [
    {"theme": "complaint_handling", "owner": "cx", "system": "CRM case queue", "acknowledged_at": "23:45"},
    {"theme": "account_freeze", "owner": "operations", "system": "Account-measure review queue", "acknowledged_at": "22:10"},
    {"theme": "manipulated_transfer", "owner": "fraud_cyber", "system": "Fraud investigation queue", "acknowledged_at": "06:55"},
    {"theme": "care_unreachable", "owner": "cx", "system": "CRM case queue", "acknowledged_at": "06:55"},
    {"theme": "swish_payment_failures", "owner": "payments", "system": "Payments and Swish work queue", "acknowledged_at": None},
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
PERIOD_END = "2026-11-17T06:45:00+00:00"  # the data freeze: 17 Nov 07:45 CET (SW-D03), held in UTC
DATA_START = "2026-10-21T22:00:00+00:00"  # 22 Oct 00:00 CEST
PERIODS = [
    {"id": "brief", "label": "Morning brief", "days": 1, "short": True},
    {"id": "7d", "label": "Last 7 days", "days": 7, "short": True},
    {"id": "14d", "label": "Last 14 days", "days": 14, "short": False},
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
# Swedbank rows (SW-D04): Calls · Nina · App and internet-bank messages · Email · Social · Branch (kontor). The ids stay
# the oct13 ids (the screens key on them): "whatsapp" carries Nina and the Copilot assistant; "chat" carries messages in
# the app and internet bank.
CHANNEL_GROUP_ORDER = ["calls", "whatsapp", "chat", "emails", "social", "branch"]
CHANNEL_GROUP_LABEL = {
    "emails": "Email",
    "calls": "Calls",
    "chat": "App and internet-bank messages",
    "whatsapp": "Nina",
    "social": "Social",
    "branch": "Branch (kontor)",
}
PULSE_LISTS = ["priority_a", "priority_b", "uhni", "multi"]

# Businesses on the morning brief cards (3 + 3). Insurance is thin in public voice; auto loans thinner still.
BRIEF_BUSINESSES = ["everyday_accounts_app", "payments_swish", "cards", "mortgages", "savings_funds", "consumer_loans"]

# Deep-dive issue categories (SW-D16): the worked example is Everyday accounts and app (the names CARDS_* are kept from
# the copied pipeline so every caller still works). Each public item and interaction counts once, under its primary
# theme's category; the themes are the subcategories. Owners are roles, never names. "tat" marks categories with a
# service standard.
CARDS_CATEGORIES = [
    {"id": "app_update", "label": "App update and new release", "owner": "Everyday banking · App release lead", "tat": True,
     "themes": ["new_app_release"]},
    {"id": "app_reliability", "label": "App crashes, speed and outages", "owner": "Everyday banking · App reliability lead", "tat": True,
     "themes": ["app_speed_crash", "online_banking"]},
    {"id": "bankid", "label": "BankID and sign-in", "owner": "Everyday banking · Digital identity lead", "tat": True,
     "themes": ["app_login_biometrics", "identity_checks", "device_security_block"]},
    {"id": "measures", "label": "Account measures: frozen or restricted accounts", "owner": "Everyday banking · Account-measure lead", "tat": True,
     "themes": ["account_freeze", "closure_requests"]},
    {"id": "usability", "label": "App features and usability", "owner": "Everyday banking · Digital lead", "tat": False,
     "themes": ["app_usability", "statements_documents"]},
    {"id": "fees", "label": "Account fees and opening", "owner": "Everyday banking · Pricing lead", "tat": False,
     "themes": ["fees_charges_bank", "account_opening"]},
    {"id": "service", "label": "Service, branch (kontor) and complaint handling", "owner": "Everyday banking · Service lead", "tat": True,
     "themes": ["complaint_handling", "care_unreachable", "branch_service", "branch_closure", "premium_service", "unsolicited_calls"]},
]
CARDS_OTHER = {"id": "other", "label": "Other", "owner": "Everyday banking · CX lead", "tat": False, "themes": []}


def inr(n: int) -> str:
    """A count with digit grouping (110,047), for sentences written by the pipeline. The name is kept
    from the copied pipeline so every caller still works."""
    return f"{int(n):,}"
