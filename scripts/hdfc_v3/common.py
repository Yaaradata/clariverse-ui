"""Shared constants for the V3 build (B7 brief). Paths, the product list, theme → product mapping and deliverable TATs."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
RAW = DATA / "raw" / "hdfc"
OUT_APP = DATA / "out" / "app_jul_sep"
SEED_V3 = DATA / "seed" / "internal_v3"

SEED = 20260928
# The brief is written for the 29 September morning review: every age is measured from this moment.
NOW = "2026-09-29T07:45:00+05:30"
WINDOW = ("2026-07-01", "2026-09-28")

# Rows of the "pulse by product" table (B7 §1 E1.6). Group-company apps stay excluded.
PRODUCTS = [
    {"id": "cards", "label": "Cards", "owner": "cards", "module": "cards"},
    {"id": "payzapp", "label": "PayZapp and UPI", "owner": "payments", "module": None},
    {"id": "accounts", "label": "Accounts and deposits", "owner": "retail", "module": None},
    {"id": "personal_loans", "label": "Personal loans", "owner": "loans", "module": None},
    {"id": "home_loans", "label": "Home loans", "owner": "loans", "module": None},
    {"id": "auto_loans", "label": "Auto and two-wheeler loans", "owner": "loans", "module": None},
    {"id": "insurance", "label": "Insurance (bank-sold)", "owner": "product", "module": None},
    {"id": "digital", "label": "Digital (app and NetBanking)", "owner": "digital", "module": "digital"},
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

# Deliverables (B7 D1). TATs marked "rbi" are published RBI timelines; everything else is a bank TAT to confirm in
# discovery. Days are working days (Sundays skipped) unless `calendar` is set. Hours are used for sub-day items.
# D-11 (the TAT reference B7 inherits) is not in the repo (qa/tat_check.md), so no bank TAT is shown as a number: bank rows
# read "Bank TAT: confirm in discovery". Their `tat_days` is a parameter of the illustrative sample generator only and
# never reaches a screen (follow-up fix 3).
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
