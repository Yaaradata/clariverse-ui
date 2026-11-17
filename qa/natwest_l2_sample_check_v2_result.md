# NatWest public layer: sentiment and theme check v2, result

> **Checked by a model, not a person.** This is a stand-in until a human reviews `qa/natwest_l2_sample_check_v2.md`. The model labelled each post blind (the pipeline's labels removed) and was compared afterwards. A mixed post counts as correct when the pipeline chose either of its two sentiments. Theme list: the pipeline's 59-theme taxonomy (`scripts/natwest_pulse/taxonomy.py`). Run after the NW-D90 rules.

Sample: `qa/natwest_l2_sample_check_v2.md`, 100 items, seed 20261117, stratified by source in proportion to on-screen volume (X 31 · App Store 25 · Google Play 21 · Reddit 18 · Trustpilot 5), 17 Nov 2026.

| # | Source | Pipeline sentiment | Model sentiment | Match | Pipeline theme | Model theme | Match | Reason where they differ (model) |
|---|---|---|---|---|---|---|---|---|
| 1 | App Store | positive | positive | ✓ | Praise for service | Where customers praise us: quick, easy app journeys | ✗ | Long-time customer praises app reliability |
| 2 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 3 | X | positive | neutral | ✗ | Other | Other | ✓ | Unrelated chatter |
| 4 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 5 | Reddit | positive | neutral | ✗ | Product questions and advice-seeking | Account opening and switching | ✗ | Discussion of switching service anniversary |
| 6 | Trustpilot | negative | negative | ✓ | Branch service | Cora unresolved, had to call | ✗ | Cora waste of time, had to call and visit branch |
| 7 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 8 | Reddit | negative | neutral | ✗ | Refunds not credited | Other | ✗ | Retailer refund question, not about the bank |
| 9 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 10 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 11 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 12 | X | negative | negative | ✓ | Other | Mis-selling and add-on products | ✗ | Swap mis-selling victims excluded from review |
| 13 | X | neutral | neutral | ✓ | Other | Share price, results and corporate news | ✗ | News about former boss and debanking row |
| 14 | Reddit | neutral | neutral | ✓ | Other | Account opening and switching | ✗ | Explains switch offer deposit requirement |
| 15 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 16 | Trustpilot | negative | negative | ✓ | Account opening and switching | Branch service | ✗ | Staff incompetent, gave incorrect information |
| 17 | App Store | negative | negative | ✓ | App features and usability | App features and usability | ✓ |  |
| 18 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Praise for service | ✗ | Customer since 1960, company very good |
| 19 | X | neutral | neutral | ✓ | Branch service | Share price, results and corporate news | ✗ | Industry job cuts commentary |
| 20 | Trustpilot | negative | negative | ✓ | Other | General dissatisfaction | ✗ | Nothing works, avoid this bank |
| 21 | X | neutral | neutral | ✓ | Other | Share price, results and corporate news | ✗ | News about former boss |
| 22 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 23 | X | positive | positive | ✓ | Other | Product questions and advice-seeking | ✗ | Recommends free business account with accounting tool |
| 24 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 25 | Reddit | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 26 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 27 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | App features and usability | ✗ | Praise plus feature request for savings goals |
| 28 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 29 | X | negative | negative | ✓ | Complaints closed without resolution | Fraud block or account freeze | ✗ | Account closed/frozen over a month, no response |
| 30 | Trustpilot | negative | negative | ✓ | Could not get through | General dissatisfaction | ✗ | Rubbish service, avoid bank |
| 31 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 32 | App Store | negative | negative | ✓ | App features and usability | App features and usability | ✓ |  |
| 33 | Reddit | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 34 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 35 | Google Play | negative | negative | ✓ | App features and usability | App features and usability | ✓ |  |
| 36 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 37 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 38 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 39 | Google Play | negative | negative | ✓ | App features and usability | Value and fair treatment | ✗ | No support during hard times |
| 40 | Google Play | negative | negative | ✓ | New app and update experience | New app and update experience | ✓ |  |
| 41 | Google Play | positive | positive | ✓ | Could not get through | Praise for service | ✗ | Recommends bank, great customer service |
| 42 | Google Play | negative | negative | ✓ | App outages, speed and crashes | App features and usability | ✗ | 3D Secure approval in app fails |
| 43 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 44 | X | neutral | neutral | ✓ | Rewards value and caps | Other | ✗ | Crypto promotion |
| 45 | Reddit | neutral | neutral | ✓ | Credit limit | Credit limit | ✓ |  |
| 46 | X | neutral | negative | ✗ | Other | Fraud block or account freeze | ✗ | Banks block cash withdrawals without reason |
| 47 | App Store | positive | mixed (positive/negative) | ✓ | Where customers praise us: quick, easy app journeys | App features and usability | ✗ | Good app but cannot see future payments |
| 48 | X | negative | neutral | ✗ | Fraud and scam contact | Fraud and scam contact | ✓ | Scam victim seeking recovery, bank incidental |
| 49 | Google Play | negative | negative | ✓ | Could not get through | Could not reach a person | ✗ | Huge wait to get from chatbot to person |
| 50 | X | negative | negative | ✓ | General dissatisfaction | App features and usability | ✗ | Confusing merchant logo in fraud form |
| 51 | App Store | negative | negative | ✓ | App features and usability | Push payment scam reimbursement | ✗ | No help getting scam money back |
| 52 | X | negative | neutral | ✗ | Branch service | Fraud and scam contact | ✗ | Link to staff fraud story |
| 53 | Reddit | negative | negative | ✓ | App login and biometrics | App features and usability | ✗ | Cannot approve online purchase in app |
| 54 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 55 | Reddit | negative | neutral | ✗ | Account and card closure | Other | ✗ | Advice about another bank |
| 56 | Reddit | positive | neutral | ✗ | Other | Account opening and switching | ✗ | Asking for next switch offer |
| 57 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 58 | App Store | negative | negative | ✓ | App features and usability | Card interest and charges | ✗ | Unfair credit card charging |
| 59 | X | neutral | neutral | ✓ | Other | Fraud and scam contact | ✗ | Advice to call official number only |
| 60 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Praise for service | ✗ | Excellent bank |
| 61 | Reddit | neutral | neutral | ✓ | Card offers and deals | Other | ✗ | Forum bot about cashback offers |
| 62 | X | neutral | neutral | ✓ | Rewards value and caps | Branch closures and access | ✗ | High street closures remark |
| 63 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 64 | Google Play | neutral | mixed (positive/negative) | ✗ | Other | App features and usability | ✗ | Nice app but privacy screen missing on device |
| 65 | Reddit | neutral | neutral | ✓ | Other | Product questions and advice-seeking | ✗ | Explains Open Banking payment is legitimate |
| 66 | X | negative | neutral | ✗ | General dissatisfaction | Share price, results and corporate news | ✗ | Quarterly results statement |
| 67 | Google Play | negative | negative | ✓ | App features and usability | App login and biometrics | ✗ | Too much face scanning security |
| 68 | App Store | negative | negative | ✓ | New app and update experience | New app and update experience | ✓ |  |
| 69 | Google Play | negative | negative | ✓ | App login and biometrics | App login and biometrics | ✓ |  |
| 70 | Reddit | negative | negative | ✓ | App features and usability | Fraud block or account freeze | ✗ | Card account vanished after fraud flag |
| 71 | X | neutral | neutral | ✓ | Other | App features and usability | ✗ | News about app perk ending |
| 72 | Reddit | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 73 | Google Play | negative | negative | ✓ | Cora unresolved, had to call | App login and biometrics | ✗ | Locked out after losing phone, passkey/face only |
| 74 | X | neutral | negative | ✗ | Other | Account and card closure | ✗ | Account closed after cash deposit |
| 75 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 76 | Google Play | negative | negative | ✓ | Cora unresolved, had to call | Cora gave wrong answer | ✗ | Cora misinterprets requests |
| 77 | App Store | negative | negative | ✓ | App login and biometrics | App login and biometrics | ✓ |  |
| 78 | X | neutral | neutral | ✓ | International payments | Other | ✗ | Crypto conference promotion |
| 79 | X | negative | neutral | ✗ | General dissatisfaction | Share price, results and corporate news | ✗ | Banks agree AI shopping agent standard |
| 80 | Reddit | positive | neutral | ✗ | Card interest and charges | Product questions and advice-seeking | ✗ | Advice on children's card options |
| 81 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 82 | X | neutral | neutral | ✓ | Other | Account opening and switching | ✗ | Switch offer post |
| 83 | X | negative | neutral | ✗ | General dissatisfaction | Other | ✗ | Community event mention |
| 84 | Reddit | neutral | neutral | ✓ | Other | Savings rates and bonus terms | ✗ | Other provider stopped paying interest |
| 85 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Praise for service | ✗ | Simple easy bank |
| 86 | X | negative | negative | ✓ | Fraud and scam contact | Collections and arrears conduct | ✗ | Alleges fake loan documents in debt cases |
| 87 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Loan and mortgage applications | ✗ | Loan paid same day, little paperwork |
| 88 | Reddit | neutral | neutral | ✓ | Other | Loan and mortgage redemption | ✗ | Early exit fee comment |
| 89 | Reddit | neutral | neutral | ✓ | Other | Account opening and switching | ✗ | Forum note on switch offer questions |
| 90 | X | negative | neutral | ✗ | Rewards value and caps | Other | ✗ | Crypto promotion |
| 91 | Trustpilot | negative | negative | ✓ | Statements and documents | Unwanted marketing and use of data | ✗ | Appalling service and GDPR breach |
| 92 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 93 | Google Play | neutral | negative | ✗ | Other | New app and update experience | ✗ | Update defaults to wrong account |
| 94 | Reddit | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 95 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 96 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 97 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 98 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 99 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 100 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |

## Totals

- Sentiment accuracy: **84/100** (v1 before NW-D90: 76/100)
- Theme accuracy: **43/100** (v1: 45/100; reported, not a gate)
- Sentiment by source: App Store 25/25 · Google Play 19/21 · Reddit 13/18 · Trustpilot 5/5 · X 22/31

## Five most common disagreements

1. Sentiment: pipeline **negative**, model **neutral** (8)
2. Sentiment: pipeline **positive**, model **neutral** (4)
3. Theme: pipeline “Other”, model “Account opening and switching” (4)
4. Theme: pipeline “Where customers praise us: quick, easy app journeys”, model “Praise for service” (3)
5. Sentiment: pipeline **neutral**, model **negative** (3)

SENTIMENT CHECK: FAIL 84/100 — top cause: X posts the pipeline marks negative that the model reads as neutral (6 of 16 sentiment misses)
