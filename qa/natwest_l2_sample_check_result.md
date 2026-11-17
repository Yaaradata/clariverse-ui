# NatWest public layer: sentiment and theme check, result

> **Checked by a model, not a person.** This is a stand-in until a human reviews `qa/natwest_l2_sample_check.md`. The model labelled each post blind (the pipeline's labels removed) and was compared afterwards. A mixed post counts as correct when the pipeline chose either of its two sentiments. Theme list: the pipeline's 59-theme taxonomy (`scripts/natwest_pulse/taxonomy.py`); `data/out/natwest_pulse/taxonomy.json` does not exist.

Sample: the 100 items of `qa/natwest_l2_sample_check.md` (seed 20261116), 17 Nov 2026.

| # | Source | Pipeline sentiment | Model sentiment | Match | Pipeline theme | Model theme | Match | Reason where they differ (model) |
|---|---|---|---|---|---|---|---|---|
| 1 | Google Play | negative | negative | ✓ | General dissatisfaction | App features and usability | ✗ | Making a payment is hard; considering HSBC |
| 2 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 3 | X | positive | neutral | ✗ | Other | Other | ✓ | Business award post, not customer experience |
| 4 | Reddit | neutral | neutral | ✓ | Product questions and advice-seeking | Other | ✗ | Subreddit welcome boilerplate |
| 5 | X | positive | neutral | ✗ | Product questions and advice-seeking | Savings rates and bonus terms | ✗ | Comments on savings account conditions and interest |
| 6 | Reddit | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 7 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Praise for service | ✗ | New customer, no issues so far |
| 8 | X | neutral | neutral | ✓ | App login and biometrics | Other | ✗ | Industry AI newsletter |
| 9 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 10 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Praise for service | ✗ | Happy loyal customer of 15 years |
| 11 | X | neutral | negative | ✗ | Other | Branch service | ✗ | Bank refused a £5k cash withdrawal |
| 12 | X | positive | neutral | ✗ | Other | Other | ✓ | Cricket chatter |
| 13 | Trustpilot | negative | negative | ✓ | Could not get through | Could not get through | ✓ |  |
| 14 | X | neutral | neutral | ✓ | Product questions and advice-seeking | Other | ✗ | Joke reply |
| 15 | Reddit | negative | negative | ✓ | Debit card and cash machines | Debit card and cash machines | ✓ |  |
| 16 | X | positive | neutral | ✗ | Other | Other | ✓ | Cricket chatter |
| 17 | X | neutral | neutral | ✓ | Other | Share price, results and corporate news | ✗ | Industry news on tokenised deposits |
| 18 | Trustpilot | negative | negative | ✓ | General dissatisfaction | App features and usability | ✗ | App payment option unclear, poor design |
| 19 | Reddit | negative | neutral | ✗ | General dissatisfaction | Other | ✗ | Debt repayment question, not about NatWest |
| 20 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Praise for service | ✗ | Staff member helped set up account |
| 21 | Google Play | negative | negative | ✓ | App login and biometrics | App login and biometrics | ✓ |  |
| 22 | X | positive | neutral | ✗ | Other | Share price, results and corporate news | ✗ | Industry news on tokenised deposits |
| 23 | X | neutral | neutral | ✓ | App login and biometrics | Other | ✗ | Business bootcamp promotion |
| 24 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 25 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 26 | X | negative | neutral | ✗ | General dissatisfaction | Other | ✗ | General cash debate |
| 27 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 28 | Google Play | negative | negative | ✓ | General dissatisfaction | App login and biometrics | ✗ | App too hard to set up |
| 29 | Google Play | positive | mixed (negative/positive) | ✓ | Where customers praise us: quick, easy app journeys | App outages, speed and crashes | ✗ | App failed, worked after restart |
| 30 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 31 | App Store | positive | positive | ✓ | Branch service | Praise for service | ✗ | Long-standing customer praising service |
| 32 | Google Play | negative | negative | ✓ | App outages, speed and crashes | App features and usability | ✗ | Card freeze option hard to find |
| 33 | X | positive | neutral | ✗ | Account charges and fees | Other | ✗ | Unrelated civil penalty story |
| 34 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 35 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 36 | Google Play | negative | negative | ✓ | General dissatisfaction | General dissatisfaction | ✓ |  |
| 37 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Praise for service | ✗ | No complaints |
| 38 | Reddit | neutral | neutral | ✓ | Product questions and advice-seeking | Product questions and advice-seeking | ✓ |  |
| 39 | X | negative | neutral | ✗ | General dissatisfaction | Other | ✗ | Careers site comparison |
| 40 | X | negative | neutral | ✗ | Branch service | Fraud and scam contact | ✗ | Shares news link about staff fraud |
| 41 | Google Play | negative | negative | ✓ | General dissatisfaction | Account charges and fees | ✗ | Money taken out, can't see where |
| 42 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 43 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 44 | Google Play | negative | negative | ✓ | General dissatisfaction | Account opening and switching | ✗ | Account setup slow, too much info required |
| 45 | App Store | negative | neutral | ✗ | General dissatisfaction | App features and usability | ✗ | Wants payment-date reminders, worried about fee |
| 46 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 47 | X | negative | negative | ✓ | Fraud block or account freeze | Fraud block or account freeze | ✓ |  |
| 48 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Praise for service | ✗ | Great bank |
| 49 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 50 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 51 | X | positive | neutral | ✗ | Other | Other | ✓ | Accelerator business event recap |
| 52 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Praise for service | ✗ | Short service praise |
| 53 | Google Play | neutral | negative | ✗ | App login and biometrics | App login and biometrics | ✓ | Forced to re-login every month |
| 54 | Reddit | negative | neutral | ✗ | General dissatisfaction | Other | ✗ | Moderator removal notice |
| 55 | Reddit | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 56 | X | neutral | neutral | ✓ | Other | Debit card and cash machines | ✗ | Notes cash deposit machines exist |
| 57 | Reddit | neutral | neutral | ✓ | Product questions and advice-seeking | Product questions and advice-seeking | ✓ |  |
| 58 | X | positive | neutral | ✗ | Share price, results and corporate news | Share price, results and corporate news | ✓ | CEO meets Chancellor |
| 59 | X | neutral | neutral | ✓ | Product questions and advice-seeking | Other | ✗ | Industry tokenisation thread |
| 60 | App Store | positive | mixed (positive/negative) | ✓ | Branch service | Branch closures and access | ✗ | Easy transactions but no branch for queries |
| 61 | X | neutral | neutral | ✓ | Other | Fraud and scam contact | ✗ | Bank never calls, scam awareness |
| 62 | App Store | negative | negative | ✓ | General dissatisfaction | App features and usability | ✗ | Easy to pay from wrong account |
| 63 | Reddit | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 64 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 65 | X | positive | negative | ✗ | Other | Value and fair treatment | ✗ | Banks question cash withdrawals, patronising |
| 66 | X | negative | negative | ✓ | Could not get through | Could not get through | ✓ |  |
| 67 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 68 | X | negative | negative | ✓ | General dissatisfaction | Faster Payments or Open Banking failure | ✗ | Transfer from Revolut failed, direct debits hit |
| 69 | App Store | negative | negative | ✓ | App outages, speed and crashes | App features and usability | ✗ | Cannot add external mortgage to view |
| 70 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 71 | App Store | negative | negative | ✓ | General dissatisfaction | App features and usability | ✗ | Annoyed by repeated feedback prompts |
| 72 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 73 | Google Play | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 74 | App Store | negative | negative | ✓ | General dissatisfaction | App features and usability | ✗ | Annoyed by repeated rating prompts |
| 75 | Google Play | negative | negative | ✓ | General dissatisfaction | App features and usability | ✗ | Annoying pop-up in app |
| 76 | App Store | positive | neutral | ✗ | Where customers praise us: quick, easy app journeys | Other | ✗ | No content |
| 77 | Google Play | negative | negative | ✓ | General dissatisfaction | Unwanted marketing and use of data | ✗ | Objects to data sharing with social media |
| 78 | Reddit | neutral | neutral | ✓ | Product questions and advice-seeking | Other | ✗ | Subreddit moderation note |
| 79 | Reddit | negative | neutral | ✗ | General dissatisfaction | Other | ✗ | Generic debt advice |
| 80 | Google Play | negative | negative | ✓ | General dissatisfaction | App features and usability | ✗ | Missing features like pots |
| 81 | Trustpilot | negative | negative | ✓ | Could not get through | Savings rates and bonus terms | ✗ | Unfair treatment of regular saver |
| 82 | App Store | positive | neutral | ✗ | Where customers praise us: quick, easy app journeys | App features and usability | ✗ | Requests notifications for all incoming payments |
| 83 | X | negative | neutral | ✗ | Share price, results and corporate news | Fraud and scam contact | ✗ | Warns of AI scam using CEO |
| 84 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 85 | X | negative | neutral | ✗ | General dissatisfaction | Share price, results and corporate news | ✗ | Industry warning on AI shopping agents |
| 86 | App Store | positive | mixed (positive/negative) | ✓ | Could not get through | App features and usability | ✗ | Payments easy but worryingly instant |
| 87 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 88 | Reddit | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 89 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 90 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 91 | App Store | negative | negative | ✓ | General dissatisfaction | Card applications and identity checks | ✗ | Credit card application unsuccessful |
| 92 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 93 | App Store | positive | positive | ✓ | Where customers praise us: quick, easy app journeys | Where customers praise us: quick, easy app journeys | ✓ |  |
| 94 | X | neutral | neutral | ✓ | Product questions and advice-seeking | Other | ✗ | Speculative political finance chatter |
| 95 | X | negative | neutral | ✗ | General dissatisfaction | Other | ✗ | Cricket chatter |
| 96 | App Store | neutral | negative | ✗ | Other | App login and biometrics | ✗ | App rejected correct PIN, lost work |
| 97 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |
| 98 | App Store | negative | negative | ✓ | App login and biometrics | App login and biometrics | ✓ |  |
| 99 | App Store | negative | negative | ✓ | General dissatisfaction | App features and usability | ✗ | Transfer amount entry error |
| 100 | X | neutral | neutral | ✓ | Other | Other | ✓ |  |

## Totals

- Sentiment accuracy: **76/100**
- Theme accuracy: **45/100**
- Sentiment by source: App Store 23/27 · Google Play 20/21 · Reddit 9/12 · Trustpilot 3/3 · X 21/37

## Five most common disagreements

1. Sentiment: pipeline **positive**, model **neutral** (10)
2. Sentiment: pipeline **negative**, model **neutral** (10)
3. Theme: pipeline “General dissatisfaction”, model “App features and usability” (9)
4. Theme: pipeline “Where customers praise us: quick, easy app journeys”, model “Praise for service” (6)
5. Theme: pipeline “General dissatisfaction”, model “Other” (6)

SENTIMENT CHECK: FAIL 76/100 — top cause: the pipeline gives a positive or negative label to posts that carry no sentiment about NatWest (news, ads, advice threads, chatter): 20 of the 24 sentiment misses are posts the model reads as neutral
