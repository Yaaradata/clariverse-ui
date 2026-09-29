# Classification instructions (LisN HDFC Bank demo, public voice, Jul–Sep 2026)

You label public posts about HDFC Bank (X, Reddit, consumer forums). Be accurate and literal: label what the post says,
not what it might imply. Posts are already redacted; never copy personal details into the summary.

## Output: one JSON object per input line, same order, fields exactly:
{"id": "...", "rel": "on_topic|mention_only|off_topic", "entity": "bank|group", "themes": ["theme_id", ...],
 "sentiment": "positive|neutral|negative", "esc": true|false, "esc_target": "rbi|rbi_ombudsman|consumer_court|legal|ministers|grievance|null",
 "missed_timeline": true|false, "request_type": "card_delivery|refund|reversal|dispute|closure|loan_disbursal|credit_report|kyc|other|null",
 "status_seeking": true|false, "closure_intent": true|false, "repeat": true|false, "summary": "..."}

## Field rules
- rel: on_topic = about the author's (or someone's) experience, question or opinion of HDFC Bank or its products/services.
  mention_only = HDFC named in passing (stock market, news, a list of banks, promotions, jokes). off_topic = nothing to do with HDFC Bank.
- entity: group = about HDFC Life, HDFC ERGO, HDFC Securities/Sky/InvestRight, HDFC Mutual Fund/AMC. Otherwise bank.
- themes: 1 to 3 ids from the list below, most important first. Use general_dissatisfaction only for negative posts with no
  specific issue; product_advice for neutral questions and comparisons; other when nothing fits. For group entity use
  insurance_group or trading_securities.
- sentiment: the author's stance towards HDFC Bank in this post. Questions and neutral information are neutral.
- esc: true only if the post names or threatens an escalation: RBI or the RBI Ombudsman/CMS, consumer court/forum/helpline,
  legal action or a lawyer, ministers/PMO/CPGRAMS, or the bank's grievance/nodal officer. esc_target = the highest one named.
  Advice to someone else to complain to the RBI also counts. A passing mention of the RBI in news does not.
- missed_timeline: the customer says a timeline or commitment was missed (e.g. "promised in 7 days, still nothing",
  "waiting 3 weeks", "refund pending since August"). request_type = what was late (null if false).
- status_seeking: asking where something is / for an update. closure_intent: says they will close or have closed an HDFC
  account, card or loan, or are moving to another bank. repeat: says they raised it before / multiple times / no response.
- summary: at most 20 words, your own paraphrase in plain British English, no names, handles, numbers or amounts that
  identify anyone, no exclamation marks. Example: "Customer's refund from a cancelled train booking still not credited after six weeks."

## Theme ids
- app_praise: Where customers praise us: quick, easy app journeys. Positive app reviews: easy, fast, useful, smooth.
- app_speed_crash: App speed, loading and crashes. App is slow, will not open, freezes, crashes or shows 'something went wrong'.
- general_dissatisfaction: General dissatisfaction. Negative without a specific issue: 'worst bank', 'pathetic service'.
- app_usability: App features and usability. Missing features, confusing design, keyboard, statement download in app, IPO ASBA, card-only login, dark mode, language.
- card_eligibility_upgrade: Card eligibility, upgrade and LTF requests. Eligibility criteria (Infinia, DCB), upgrade paths, lifetime-free requests, pre-approved offers.
- card_variant_migration: Card variant migration and forced upgrade. Card variants phased out or converted (Swiggy HDFC, Tata Neu, co-brand changes); forced upgrade or downgrade.
- complaint_handling: Complaints closed without resolution. Complaints or tickets closed without a fix, generic replies, having to repeat the complaint, DMs with no outcome.
- login_mpin: Login, MPIN and registration. Cannot log in, register or verify; MPIN, password, OTP or SMS verification, device binding, forced re-registration.
- rewards_value: Rewards value, devaluation and caps. Reward-point value, devaluation, SmartBuy caps, milestone and accelerated-reward changes, spend criteria.
- care_unreachable: Customer care unreachable or unhelpful. Cannot reach phone banking or chat, long waits, IVR loops, unhelpful bot (EVA) or agents.
- card_application: Card application, rejection and verification. Applications rejected, stuck in verification, video KYC, document checks.
- product_advice: Product questions and advice-seeking. Neutral questions and comparisons: which card, is this worth it, how to apply.
- device_security_block: Device security blocks and false alerts. App refuses to run or disables itself because of device checks: developer options, USB debugging, root, 'security violation', 'device not compatible', risky-app warnings.
- new_app_release: New app and update experience. Reactions to the new HDFC Bank app or a recent update: migration, old app better, features lost after update.
- account_freeze: Account debit freezes and blocks. Accounts frozen or debit-blocked (KYC, undelivered letters, law-enforcement holds, suspicious activity), liens and holds.
- card_fees_charges: Card fees and charges. Annual and renewal fees, late fees, finance charges, no-cost EMI charges on cards.
- reward_redemption: Reward redemption and vouchers. Redeeming points, vouchers not available or not received, milestone vouchers pending.
- loan_processing: Loan processing and disbursal. Loan applications, sanction, disbursal delays, valuation and verification, documentation.
- upi_failures: UPI payments failing or pending. UPI payments failing, pending, declined or blocked; UPI PIN; UPI limits.
- card_limit: Credit limit. Credit limit too low, limit enhancement, limit cut.
- account_opening: Account opening and product conversion. Opening savings or current accounts, pending opening, account variant conversion, minimum balance programmes.
- closure_requests: Account and card closure requests. Difficulty closing a card, account or loan; closure pending; charges after closure.
- failed_txn_reversal: Failed transaction reversal. Money debited but not received or not reversed; ATM cash not dispensed; failed transaction refund.
- unsolicited_calls: Unsolicited sales calls and use of data. Repeated sales calls, spam, 'where did you get my number', marketing without consent.
- offers_deals: Card offers and deals. Merchant deals and discounts that mention HDFC cards (mostly promotional).
- kyc_updates: KYC, re-KYC and profile updates. KYC and re-KYC, mobile number or address updates, nominee, PAN or Aadhaar linking.
- branch_service: Branch service and staff behaviour. Branch visits, staff behaviour, rudeness, being sent to the home branch.
- fees_charges_bank: Bank charges and hidden fees. Account charges, penalties, deductions without intimation, minimum balance penalties.
- loan_servicing: EMI and loan account servicing. EMI schedule, EMI debit issues, loan details missing in app, interest-rate resets, part-payments.
- fraud_scam: Fraud and scam calls. Scam calls and messages, impersonation, frauds reported by customers.
- mis_selling: Mis-selling and bundled products. Insurance or investments pushed with loans or accounts, misleading promises, ULIPs.
- recovery_conduct: Recovery and collection conduct. Recovery agents, collection calls, harassment, legal notices on dues.
- rm_service: Relationship manager service. RM unreachable, RM changes, RM advice and conduct.
- atm_debit_card: Debit card and ATM. Debit card issues, ATM limits and failures, debit card variants.
- service_praise: Praise for service. Customers praising staff, RMs, resolution or the bank overall.
- phishing: Phishing messages and fake links. Phishing SMS, fake links, fake apps, APK files.
- card_dispatch: Card dispatch and delivery. Card or welcome kit not delivered, courier issues, activation after delivery.
- dispute_chargeback: Disputes and chargebacks. Disputed transactions, chargebacks, dispute outcomes and delays.
- refund_delay: Refunds not credited. Merchant or excess-payment refunds not credited in time.
- unauthorised_txn: Unauthorised transactions. Transactions the customer did not make, card misuse, money stolen from account.
- investments_wealth: Investments, mutual funds and SmartWealth. Mutual funds, SIPs, portfolio tracking, SmartWealth.
- loan_closure_documents: Loan closure, foreclosure and documents. Foreclosure, final settlement, NOC, release of original property documents.
- other: Other. Anything that fits no theme above.
- netbanking: NetBanking. NetBanking access, errors and downtime.
- credit_report: CIBIL and credit-report correction. Wrong entries on credit reports, CIBIL score impact, correction delays.
- statements_documents: Statements, certificates and documents. Statements, interest certificates, NOC or NDC, physical copies.
- nri_forex: NRI and forex services. NRI accounts, remittances, forex cards.
- merchant_pos: Merchant QR, POS and sound box. Merchant apps and devices: QR, POS machine, sound box, settlements (SmartHub Vyapar).
- deposits_rates: Deposits and interest rates. Fixed deposits, interest rates, sweep-in.
- market_news: Share price, results and corporate news. Stock-market, results and leadership news; not customer experience.
- trading_securities: Trading and IPO (HDFC Securities). InvestRight trading app, orders, IPO, brokerage (group company).
- insurance_group: Insurance policies and claims (HDFC Life, ERGO). Policy servicing, claims, premiums, surrender (group companies).
