"""Shared constants for the V3 build (B7 brief). Paths, the product list, theme → product mapping and deliverable TATs."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
RAW = DATA / "raw" / "natwest"
OUT_APP = DATA / "out" / "natwest_pulse"
SEED_V3 = DATA / "seed" / "natwest_pulse"

SEED = 20260928
# The brief is written for the 29 September morning review: every age is measured from this moment.
NOW = "2026-11-12T07:45:00+00:00"
WINDOW = ("2026-08-01", "2026-11-11")
# England and Wales bank holidays that fall in or just after the window: business days skip them and weekends.
BANK_HOLIDAYS = {"2026-08-31", "2026-12-25", "2026-12-28"}


def is_business_day(d) -> bool:
    return d.weekday() < 5 and d.date().isoformat() not in BANK_HOLIDAYS

# Rows of the "pulse by product" table (B7 §1 E1.6). Group-company apps stay excluded.
PRODUCTS = [
    {"id": "current_accounts", "label": "Current accounts and app", "owner": "retail", "module": None},
    {"id": "payments_fraud", "label": "Payments and fraud", "owner": "payments", "module": None},
    {"id": "cards", "label": "Credit cards", "owner": "cards", "module": "cards"},
    {"id": "savings", "label": "Savings", "owner": "product", "module": None},
    {"id": "mortgages", "label": "Mortgages", "owner": "loans", "module": None},
    {"id": "personal_loans", "label": "Personal loans", "owner": "loans", "module": None},
]
# Six products only (NW-D33). Overdraft themes sit under Current accounts and app; Cora themes sit under the product
# the query was about. Cora keeps its module (module/cora_digital), built from the Cora themes, never a product card.
PRODUCT_IDS = [p["id"] for p in PRODUCTS]
PRODUCT_LABEL = {p["id"]: p["label"] for p in PRODUCTS}

OWNER_LABEL = {
    "cx": "Complaints lead",
    "digital": "Digital and Cora",
    "cards": "Credit cards product owner",
    "retail": "Current accounts product owner",
    "loans": "Lending product owner",
    "payments": "Payments operations",
    "compliance": "Compliance",
    "fraud_cyber": "Fraud operations",
    "operations": "Operations",
    "rm": "Premier banking managers",
    "product": "Savings product owner",
}

# Deliverables (B7 D1). TATs marked "rbi" are published RBI timelines. "bank_confirmed" rows carry a TAT the bank has
# confirmed: `tat_label` shows it (e.g. "7 working days") and `source_note` names the document and section. "bank" rows
# are unconfirmed and read BANK_TAT_LABEL; their `tat_days` is a parameter of the illustrative sample generator only and
# never reaches a screen (follow-up fix 3). Days are working days (Sundays skipped) unless `calendar` is set.
# D-11 (the TAT reference B7 inherits) is not in the repo (qa/tat_check.md), so no bank row is confirmed yet.
BANK_TAT_LABEL = "Bank standard: confirm with the bank"
# United Kingdom timelines (brief Step 5.12). "fca" and "psr" rows are published rules from the register
# (data/public/natwest_register.json); "bank" rows are unconfirmed and read BANK_TAT_LABEL; their tat_days drive the
# illustrative generator only. Days are business days (weekends skipped) unless `calendar` is set.
DELIVERABLES = {
    "failed_reversal": {
        "label": "Failed payment returned",
        "tat_days": 1,
        "tat_label": "Same day (Faster Payments)",
        "source": "fca",
        "source_note": "Faster Payments same-day (register REG-FPS-SAMEDAY)",
        "compensation": "—",
    },
    "card_closure": {"label": "Credit card closure", "tat_days": 7, "tat_label": BANK_TAT_LABEL, "source": "bank", "compensation": "—"},
    "unauthorised_reversal": {
        "label": "Unauthorised transaction refund", "tat_days": 2, "tat_label": BANK_TAT_LABEL, "source": "bank",
        "compensation": "—",
    },
    "credit_report": {"label": "Credit file correction", "tat_days": 20, "tat_label": BANK_TAT_LABEL, "source": "bank", "compensation": "—"},
    "loan_documents": {
        "label": "Title deeds after mortgage redemption", "tat_days": 20, "tat_label": BANK_TAT_LABEL, "source": "bank",
        "compensation": "—",
    },
    "complaint_resolution": {
        "label": "Final response to a complaint",
        "tat_days": 56,
        "calendar": True,
        "tat_label": "8 weeks (FCA DISP)",
        "source": "fca",
        "source_note": "FCA DISP final response within 8 weeks (register REG-DISP-8W)",
        "compensation": "Financial Ombudsman Service can award up to £445,000 (2025/26)",
    },
    "app_reimbursement": {
        "label": "Push payment scam reimbursement",
        "tat_days": 5,
        "tat_label": "5 business days (PSR)",
        "source": "psr",
        "source_note": "PSR reimbursement for authorised push payment scams (register REG-PSR-APP)",
        "compensation": "—",
    },
    "card_dispatch": {"label": "Card dispatch and delivery", "tat_days": 5, "tat_label": BANK_TAT_LABEL, "source": "bank", "compensation": "—"},
    "dispute": {
        "label": "Card dispute and chargeback", "tat_days": 30, "calendar": True, "tat_label": BANK_TAT_LABEL,
        "source": "bank", "compensation": "—",
    },
    "refund": {"label": "Merchant refund credited", "tat_days": 5, "tat_label": BANK_TAT_LABEL, "source": "bank", "compensation": "—"},
    "service_request": {
        "label": "Service request (identity checks, account changes, card requests)", "tat_days": 3,
        "tat_label": BANK_TAT_LABEL, "source": "bank", "compensation": "—",
    },
    "account_unfreeze": {"label": "Account freeze review", "tat_days": 3, "tat_label": BANK_TAT_LABEL, "source": "bank", "compensation": "—"},
    "loan_disbursal": {"label": "Loan decision and payout", "tat_days": 5, "tat_label": BANK_TAT_LABEL, "source": "bank", "compensation": "—"},
    "query_response": {"label": "First response to a query or complaint", "tat_days": 1, "tat_label": BANK_TAT_LABEL, "source": "bank", "compensation": "—"},
}

# Public theme → deliverable it is measured against. Themes not listed use query_response.
THEME_DELIVERABLE = {
    "failed_txn_reversal": "failed_reversal",
    "faster_payments_failures": "failed_reversal",
    "closure_requests": "card_closure",
    "unauthorised_txn": "unauthorised_reversal",
    "credit_report": "credit_report",
    "loan_closure_documents": "loan_documents",
    "complaint_handling": "complaint_resolution",
    "card_dispatch": "card_dispatch",
    "dispute_chargeback": "dispute",
    "app_reimbursement": "app_reimbursement",
    "refund_delay": "refund",
    "identity_checks": "service_request",
    # Cora failures (Pass 2 section 12): the customer still needs the request done, so a service request, not a query.
    "cora_unresolved": "service_request",
    "cora_wrong_answer": "service_request",
    "cora_handoff_lost": "service_request",
    "cora_no_person": "service_request",
    "card_eligibility_upgrade": "service_request",
    "card_limit": "service_request",
    "card_application": "service_request",
    "reward_redemption": "service_request",
    "account_opening": "service_request",
    "statements_documents": "service_request",
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
            "care_unreachable", "premier_service", "account_freeze", "loan_servicing", "credit_report", "unsolicited_calls",
            "mis_selling", "recovery_conduct", "complaint_handling",
        ],
        "Service requests",
    ),
    **dict.fromkeys(
        ["dispute_chargeback", "failed_txn_reversal", "refund_delay", "unauthorised_txn", "fraud_scam", "phishing",
         "app_reimbursement"],
        "Disputes and fraud",
    ),
    **dict.fromkeys(["closure_requests", "loan_closure_documents"], "Switch or close"),
}
JOURNEY_ORDER = ["Open", "Activate", "Everyday banking", "Service requests", "Disputes and fraud", "Switch or close"]

# Request types used by the public "missed timeline" signal, so the internal ageing joins the public rows.
THEME_REQUEST_TYPE = {
    **dict.fromkeys(["failed_txn_reversal", "faster_payments_failures", "unauthorised_txn"], "reversal"),
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
    {"theme": "card_application", "owner": "cards", "system": "Credit cards service queue", "acknowledged_at": "22:10"},
    {"theme": "refund_delay", "owner": "operations", "system": "Operations work queue", "acknowledged_at": "06:55"},
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
PERIOD_END = "2026-11-12T08:30:00+00:00"
DATA_START = "2026-08-01T00:00:00+00:00"
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
# NatWest rows (brief Step 5.4): Calls · Cora · Secure message · Email · Social · Branch. The ids stay the oct13 ids (the
# screens key on them): "whatsapp" carries Cora, the digital assistant; "chat" carries in-app chat with an agent.
CHANNEL_GROUP_ORDER = ["calls", "whatsapp", "chat", "emails", "social", "branch"]
CHANNEL_GROUP_LABEL = {
    "emails": "Email",
    "calls": "Calls",
    "chat": "Secure message",
    "whatsapp": "Cora",
    "social": "Social",
    "branch": "Branch",
}
PULSE_LISTS = ["priority_a", "priority_b", "uhni", "multi"]

# Businesses on the morning brief cards (3 + 3). Insurance is thin in public voice; auto loans thinner still.
BRIEF_BUSINESSES = ["current_accounts", "payments_fraud", "cards", "savings", "mortgages", "personal_loans"]

# Cards issue categories (C3): each public item and interaction counts once, under its primary theme's category;
# the themes are the subcategories. Owners are roles in the cards team, never names. "tat" marks categories that
# carry a deliverable (the old Deliverables breakdown), shown without TAT compliance.
CARDS_CATEGORIES = [
    {"id": "rewards", "label": "Rewards and redemption", "owner": "Credit cards · Rewards lead", "tat": False,
     "themes": ["rewards_value", "reward_redemption", "offers_deals"]},
    {"id": "upgrades", "label": "Eligibility and card changes", "owner": "Credit cards · Product lead", "tat": True,
     "themes": ["card_eligibility_upgrade"]},
    {"id": "applications", "label": "Applications and verification", "owner": "Credit cards · Acquisition lead", "tat": True,
     "themes": ["card_application", "identity_checks"]},
    {"id": "fees", "label": "Fees and charges", "owner": "Credit cards · Pricing lead", "tat": False,
     "themes": ["card_fees_charges", "fees_charges_bank"]},
    {"id": "limits", "label": "Limits", "owner": "Credit cards · Credit policy lead", "tat": True, "themes": ["card_limit"]},
    {"id": "disputes", "label": "Disputes, refunds and reversals", "owner": "Credit cards · Disputes lead", "tat": True,
     "themes": ["dispute_chargeback", "refund_delay", "failed_txn_reversal", "unauthorised_txn", "merchant_pos"]},
    {"id": "delivery", "label": "Card delivery", "owner": "Credit cards · Card delivery lead", "tat": True, "themes": ["card_dispatch"]},
    {"id": "closure", "label": "Closure", "owner": "Credit cards · Retention lead", "tat": True, "themes": ["closure_requests"]},
    {"id": "service", "label": "Service and complaint handling", "owner": "Credit cards · Service lead", "tat": True,
     "themes": ["complaint_handling", "care_unreachable", "branch_service", "premier_service", "unsolicited_calls"]},
    {"id": "fraud", "label": "Fraud and security", "owner": "Credit cards · Fraud lead", "tat": False,
     "themes": ["fraud_scam", "phishing", "device_security_block", "recovery_conduct"]},
    {"id": "digital", "label": "App and online card servicing", "owner": "Credit cards · Digital lead", "tat": False,
     "themes": ["app_speed_crash", "app_usability", "app_login_biometrics", "new_app_release", "online_banking", "statements_documents"]},
]
CARDS_OTHER = {"id": "other", "label": "Other", "owner": "Credit cards · CX lead", "tat": False, "themes": []}


def inr(n: int) -> str:
    """A count with United Kingdom digit grouping (110,047), for sentences written by the pipeline. The name is kept
    from the copied pipeline so every caller still works."""
    return f"{int(n):,}"
