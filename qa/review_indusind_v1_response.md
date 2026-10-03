# IndusInd V1 · response to the independent review

Review: `qa/independent_review_indusind_v1.md` (34 findings). Branch `feat/indusind-v1`. Status per finding: **Fixed**,
**Deferred** (with the person or input it waits on) or **Disagree** (with the reason). Commits are listed in the git log
as "IndusInd review fix N".

| # | Finding (short) | Status | Reason |
|---|---|---|---|
| 1 | Old cards demo live at `/role-based/indusind_bank/head_cards` | Planned: Fixed | Item 1 |
| 2 | IND-D1 missing; 80/80 register values pending | Deferred | Blocked on IND-D1 (decision owner and chat track); nothing is filled from memory |
| 3 | "Indus Ind Bank" misspelt | Planned: Fixed | Item 3 |
| 4 | "Back to industries" and multi-client chrome (DEC-7) | Planned: Fixed | Item 3 |
| 5 | Yes Bank peer row empty (YAML `yes` → True) | Planned: Fixed | Item 4 |
| 6 | Improving binds N10 alone | Planned: Fixed | Item 4 |
| 7 | "Outside" is INDIE app reviews; Play share behind (i) | Planned: Fixed | Item 5 |
| 8 | No card shows what customers said; join not visible | Deferred | Needs deposit, vehicle-finance and peer sources (dev pull) or Card G (decision owner); X and Reddit stay out |
| 9 | Peer rates listed without IndusInd's rate | Planned: Fixed | Item 4 |
| 10 | No rate captures, ads or press | Deferred | Daily captures and the manual read are dev and people tasks (IND-B3 §4, §5) |
| 11 | Ask LisN answers an unrelated question | Planned: Fixed | Item 6 |
| 12 | "Public · verified" on pending figures | Planned: Fixed | Item 4 |
| 13 | IO referrals below rejections in some weeks | Planned: Fixed | Item 7 |
| 14 | Rule-21 list empty; IND-B3 file name not gitignored | Planned: Fixed (ignore) | Item 9; the list stays empty for the decision owner to fill |
| 15 | Head of Cards lands in the CEO title | Planned: Fixed | Item 8 |
| 16 | Cards categories near-identical | Planned: Fixed | Item 7 |
| 17 | Card C inside label does not match its figures | Planned: Fixed | Item 8 |
| 18 | "At risk of closure: n" shown as an index | Planned: Fixed (label) | Titled as an index; the count waits on N31 (IV-05) |
| 19 | Closure risk list leads with "Closure" | Planned: Fixed | Item 8 |
| 20 | Ask bar covers content on the first screen | Planned: Fixed | Item 8 |
| 21 | Escalation counts: two rules | Planned: Fixed | Item 5 |
| 22 | Public escalation definition adds "cyber crime" | Planned: Fixed | Item 5 |
| 23 | Extra "Not tied to one business" row; Digital money line is a user count | Planned: Fixed | Item 8 |
| 24 | Quiet item computed on synthetic data | Deferred | B4's examples need rate captures or a passing public check; none passes yet. Kept, labelled internal and illustrative |
| 25 | Owners approve their own actions | Deferred | Approver roles are the decision owner's call (DEC-9) |
| 26 | Card C peer column names the wrong peers | Planned: Fixed | Item 8 |
| 27 | Kotak not greyed | Planned: Fixed | Item 5 |
| 28 | Penalties line missing | Planned: Fixed | Item 8 |
| 29 | No footer on the role page | Planned: Fixed | Item 3 |
| 30 | Card D label too long | Planned: Fixed | Item 8 |
| 31 | `npm run lint` fails repo-wide | Planned: Fixed (recorded) | Item 9 |
| 32 | Phone first screen is all controls | Deferred | Layout polish after the D1 figures land |
| 33 | Re-identifiable timestamps; salt in the repo | Planned: Fixed | Item 8 |
| 34 | Volume note says 1,180 a week | Planned: Fixed | Item 9 |

## Round 2 (3 Oct 2026, after IND-D1)

Fixed in "IndusInd review fix 4–9": 5 (Yes Bank `"yes"` quoted, with a check that every core peer has figures), 6
(Improving pair 6.44% → 5.95%), 7 (Outside named as INDIE app reviews, source share inline), 9 (peer rate rows hidden
until the manual read), 11 (Ask LisN needs two shared words, else the fallback), 13 (IO referrals cover every rejection,
with a check), 15 (Cards page titled "Cards — business view"), 16 (distinct category profiles), 17 (Card C inside label),
18 (closure risk titled as an index), 19 (Closure dropped from that list), 20 (Ask LisN in the title bar), 21 and 22 (one
15-item threshold for escalation; RBI, Ombudsman or court only), 23 (no extra row; Digital line labelled "Scale"), 26
(Card C names the AU vehicle book), 27 (Kotak greyed), 28 (penalties line), 30 (short N36 label), 31 (scoped Biome gate in
AGENTS.md), 33 (day-only timestamps in the committed store; the hash salt stays, since changing it re-keys the glosses), 34
(volume note). Finding 2 is closed by IND-D1. Still deferred: 8, 10, 24, 25, 32.
