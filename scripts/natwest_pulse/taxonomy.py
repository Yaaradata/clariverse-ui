"""Theme taxonomy for the NatWest Group pulse (docs/natwest/brief.md Step 3.5), in United Kingdom vocabulary.

Every theme names its product (Step 3.4), its Consumer Duty outcome (products_services · price_value · understanding ·
support), an owner role (never a person), the channels it reaches and, for the public classifier, keyword patterns.
The UPI, IMPS, KYC-video, PAN and Aadhaar themes of the copied taxonomy are removed.
"""

PRODUCTS = [
    {"id": "current_accounts", "label": "Current accounts and app", "owner": "Current accounts product owner"},
    {"id": "savings", "label": "Savings", "owner": "Savings product owner"},
    {"id": "mortgages", "label": "Mortgages", "owner": "Mortgages product owner"},
    {"id": "cards", "label": "Credit cards", "owner": "Credit cards product owner"},
    {"id": "loans", "label": "Personal loans", "owner": "Personal loans product owner"},
    {"id": "payments_fraud", "label": "Payments and fraud", "owner": "Payments and fraud owner"},
    {"id": "cora_digital", "label": "Cora and digital assistant", "owner": "Digital assistant owner", "module": True},
]
PRODUCT_IDS = [p["id"] for p in PRODUCTS]

OUTCOMES = [
    {"id": "products_services", "label": "Products and services"},
    {"id": "price_value", "label": "Price and value"},
    {"id": "understanding", "label": "Consumer understanding"},
    {"id": "support", "label": "Consumer support"},
]

# Channel weights per theme: the share of the theme's contacts on each channel (calls, cora, branch). Complaints are
# drawn separately from the complaint shape, so they are not in this mix.
THEMES = [
    {"id": "app_login_biometrics", "label": "App login and biometrics", "product": "current_accounts",
     "outcome": "support", "owner": "Digital banking lead", "mix": {"calls": 0.42, "cora": 0.50, "branch": 0.08},
     "keywords": [r"log ?in", r"biometric", r"face ?id", r"fingerprint", r"passcode", r"locked out"]},
    {"id": "app_outage_errors", "label": "App outages and errors", "product": "current_accounts",
     "outcome": "products_services", "owner": "Digital banking lead", "mix": {"calls": 0.48, "cora": 0.46, "branch": 0.06},
     "keywords": [r"app (is )?(down|not working|crash)", r"outage", r"error", r"won'?t load"]},
    {"id": "overdraft_fees", "label": "Overdraft and account charges", "product": "current_accounts",
     "outcome": "price_value", "owner": "Current accounts product owner", "mix": {"calls": 0.55, "cora": 0.33, "branch": 0.12},
     "keywords": [r"overdraft", r"charge", r"fee"]},
    {"id": "account_opening_identity", "label": "Account opening and identity checks", "product": "current_accounts",
     "outcome": "products_services", "owner": "Onboarding lead", "mix": {"calls": 0.40, "cora": 0.30, "branch": 0.30},
     "keywords": [r"open(ing)? an account", r"identity check", r"verify (my )?identity", r"onboarding", r"proof of address"]},
    {"id": "branch_closure", "label": "Branch closures and access", "product": "current_accounts",
     "outcome": "support", "owner": "Branch network lead", "mix": {"calls": 0.45, "cora": 0.10, "branch": 0.45},
     "keywords": [r"branch (is )?clos", r"closing (the |our )?branch", r"nearest branch", r"banking hub"]},
    {"id": "savings_rates", "label": "Savings rates and bonus terms", "product": "savings",
     "outcome": "understanding", "owner": "Savings product owner", "mix": {"calls": 0.40, "cora": 0.48, "branch": 0.12},
     "keywords": [r"savings rate", r"interest rate", r"bonus", r"isa"]},
    {"id": "savings_access", "label": "Moving money and savings access", "product": "savings",
     "outcome": "products_services", "owner": "Savings product owner", "mix": {"calls": 0.38, "cora": 0.52, "branch": 0.10},
     "keywords": [r"withdraw", r"transfer to savings", r"notice account"]},
    {"id": "mortgage_rate_switch", "label": "Mortgage rate switch", "product": "mortgages",
     "outcome": "support", "owner": "Mortgages product owner", "mix": {"calls": 0.62, "cora": 0.28, "branch": 0.10},
     "keywords": [r"rate switch", r"remortgage", r"product transfer", r"fixed rate (ends|ending|expir)"]},
    {"id": "mortgage_payment_difficulty", "label": "Mortgage payment difficulty", "product": "mortgages",
     "outcome": "support", "owner": "Financial support lead", "mix": {"calls": 0.78, "cora": 0.12, "branch": 0.10},
     "keywords": [r"arrears", r"struggling to pay", r"payment holiday", r"financial difficulty"]},
    {"id": "card_freeze_replace", "label": "Card frozen, lost or replaced", "product": "cards",
     "outcome": "products_services", "owner": "Credit cards product owner", "mix": {"calls": 0.36, "cora": 0.58, "branch": 0.06},
     "keywords": [r"card (frozen|blocked|lost|stolen)", r"replacement card", r"new card"]},
    {"id": "card_disputes", "label": "Card disputes and refunds", "product": "cards",
     "outcome": "support", "owner": "Disputes lead", "mix": {"calls": 0.58, "cora": 0.36, "branch": 0.06},
     "keywords": [r"dispute", r"chargeback", r"refund"]},
    {"id": "card_interest_charges", "label": "Card interest and charges", "product": "cards",
     "outcome": "price_value", "owner": "Credit cards product owner", "mix": {"calls": 0.56, "cora": 0.38, "branch": 0.06},
     "keywords": [r"interest", r"late fee", r"credit limit"]},
    {"id": "loan_decisions", "label": "Loan applications and decisions", "product": "loans",
     "outcome": "understanding", "owner": "Personal loans product owner", "mix": {"calls": 0.52, "cora": 0.36, "branch": 0.12},
     "keywords": [r"loan (application|declined|rejected)", r"credit check"]},
    {"id": "loan_repayments", "label": "Loan repayments and instalments", "product": "loans",
     "outcome": "support", "owner": "Personal loans product owner", "mix": {"calls": 0.60, "cora": 0.32, "branch": 0.08},
     "keywords": [r"repayment", r"instalment", r"settle (my )?loan"]},
    {"id": "faster_payments_failure", "label": "Faster Payments or Open Banking failure", "product": "payments_fraud",
     "outcome": "products_services", "owner": "Payments operations lead", "mix": {"calls": 0.50, "cora": 0.44, "branch": 0.06},
     "keywords": [r"faster payment", r"open banking", r"payment (failed|pending|stuck)", r"transfer (failed|not arrived)"]},
    {"id": "fraud_block_freeze", "label": "Fraud block or account freeze", "product": "payments_fraud",
     "outcome": "support", "owner": "Fraud operations lead", "mix": {"calls": 0.70, "cora": 0.20, "branch": 0.10},
     "keywords": [r"account (frozen|blocked|suspended)", r"fraud (block|check|team)", r"payment (blocked|held)"]},
    {"id": "app_reimbursement", "label": "Authorised push payment reimbursement", "product": "payments_fraud",
     "outcome": "support", "owner": "Fraud operations lead", "mix": {"calls": 0.74, "cora": 0.18, "branch": 0.08},
     "keywords": [r"scam", r"reimburs", r"push payment", r"\bapp fraud\b"]},
    {"id": "scam_reports", "label": "Scam and fraud reports", "product": "payments_fraud",
     "outcome": "understanding", "owner": "Fraud operations lead", "mix": {"calls": 0.64, "cora": 0.30, "branch": 0.06},
     "keywords": [r"phishing", r"scam (text|call|email)", r"fake (text|call)"]},
    {"id": "cora_unresolved", "label": "Cora unresolved, had to call", "product": "cora_digital",
     "outcome": "support", "owner": "Digital assistant owner", "mix": {"calls": 0.70, "cora": 0.28, "branch": 0.02},
     "keywords": [r"\bcora\b", r"chat ?bot", r"virtual assistant", r"had to call"]},
    {"id": "consumer_duty_value", "label": "Value and fair treatment", "product": "current_accounts",
     "outcome": "price_value", "owner": "Consumer Duty lead", "mix": {"calls": 0.60, "cora": 0.25, "branch": 0.15},
     "keywords": [r"unfair", r"poor value", r"rip ?off", r"treated (badly|unfairly)"]},
    {"id": "care_unreachable", "label": "Could not get through", "product": "current_accounts",
     "outcome": "support", "owner": "Contact centre lead", "mix": {"calls": 0.80, "cora": 0.15, "branch": 0.05},
     "keywords": [r"on hold", r"can'?t get through", r"no answer", r"wait(ed|ing) (an|for) hour"]},
    {"id": "complaint_handling", "label": "Complaint handling", "product": "current_accounts",
     "outcome": "support", "owner": "Complaints lead", "mix": {"calls": 0.72, "cora": 0.16, "branch": 0.12},
     "keywords": [r"complain", r"final response", r"ombudsman"]},
]
THEME = {t["id"]: t for t in THEMES}

# Cora journeys: the themes Cora takes as a journey, with the share Cora marks resolved and the share of those that come
# back as a call (or a complaint) within 7 days. Illustrative until discovery.
CORA_JOURNEYS = {
    "app_login_biometrics": {"resolved": 0.62, "call_7d": 0.17, "complaint_7d": 0.004},
    "app_outage_errors": {"resolved": 0.44, "call_7d": 0.21, "complaint_7d": 0.006},
    "overdraft_fees": {"resolved": 0.58, "call_7d": 0.12, "complaint_7d": 0.007},
    "account_opening_identity": {"resolved": 0.40, "call_7d": 0.19, "complaint_7d": 0.004},
    "savings_rates": {"resolved": 0.71, "call_7d": 0.07, "complaint_7d": 0.002},
    "savings_access": {"resolved": 0.66, "call_7d": 0.09, "complaint_7d": 0.002},
    "mortgage_rate_switch": {"resolved": 0.38, "call_7d": 0.26, "complaint_7d": 0.006},
    "card_freeze_replace": {"resolved": 0.74, "call_7d": 0.08, "complaint_7d": 0.002},
    "card_disputes": {"resolved": 0.46, "call_7d": 0.22, "complaint_7d": 0.011},
    "card_interest_charges": {"resolved": 0.55, "call_7d": 0.13, "complaint_7d": 0.005},
    "loan_decisions": {"resolved": 0.52, "call_7d": 0.15, "complaint_7d": 0.004},
    "loan_repayments": {"resolved": 0.60, "call_7d": 0.12, "complaint_7d": 0.003},
    "faster_payments_failure": {"resolved": 0.48, "call_7d": 0.24, "complaint_7d": 0.009},
    "fraud_block_freeze": {"resolved": 0.30, "call_7d": 0.33, "complaint_7d": 0.014},
    "scam_reports": {"resolved": 0.42, "call_7d": 0.27, "complaint_7d": 0.008},
}
