# IndusInd · feedback log

Seeded from `docs/indusind/carry_forward_from_hdfc.md` (IDs kept). Each rule has its status on this branch and how it is
checked. Where a rule conflicts with an IndusInd brief, the brief wins and the conflict is logged in
`docs/demo-rebuild/MORNING_DECISIONS.md`.

| ID | Rule (short) | Status | How checked |
|---|---|---|---|
| HL-01 | Slice data on the server, per page | Applied | Pages read their own payload and slice by view, window and business on the server; `check_indusind.py` fails on any public item id in a payload (fixture); rendered-route grep |
| HL-02 | Redact in the pipeline; drop allegations against a named person | Applied | `ingest_indusind_l2.py` redacts before storage and drops named allegations (2 dropped); `check_pii.py` name rule (`test_check_pii.py` fixture) |
| HL-03 | No post URLs or handles in any payload | Applied | `check_pii.py` source-link scan; payload grep in `check_indusind.py` (fixtures); rendered-route grep |
| HL-04 | On-screen privacy claims must be true | Applied | Manual: no screen claims redaction |
| HL-05 | Deployment Protection before the first push; noindex | Applied | Protection confirmed by Usha before the push; `X-Robots-Tag` on `/role-based/indusind_bank/*` (rendered-route check) |
| HL-06 | No internal labels or people's names on screen | Applied | `lint_indusind.py` IND-HL06: internal ids and names seeded from the Owner and Who columns of the briefs (fixtures); payload internal-label check |
| HL-07 | Mask names in QA and review files | Applied | Manual; QA files carry ids and labels, never review text |
| HL-08 | Every check has a fixture that must fail | Applied | `test_checks.py` |
| HL-09 | Checks do not depend on the operating system | Applied | `.gitattributes` `eol=lf`; IndusInd writers write LF; scripts reconfigure stdout, so no `PYTHONIOENCODING` |
| HL-10 | Restart the server after every rebuild | Applied | eng-qa order |
| HL-11 | Independent review in a fresh session | Open | IND-B4 §10.8, not yet run |
| HL-12 | Stratify by source; flag a source over 60% | Applied | `check_indusind.py` L2 source check (fixture) |
| HL-13 | No raw counts across a source's start date | Applied | Windows count from the first Play review (10 Aug); series start at a marker; `check_indusind.py` L2 series check (fixture) |
| HL-14 | One store per rating comparison; per app version where possible | Applied | `check_indusind.py` L2 rating check (fixture); Card G candidate by app version |
| HL-15 | No synthetic public data | Applied | Public figures are real counts or an explicit empty state; lint and review |
| HL-16 | Precompute every window in the pipeline | Applied | `build_indusind.py`; reconcile per window |
| HL-17 | "This week" anchored to the data freeze, shown on screen | Applied | Manual; freeze pill on every screen |
| HL-18 | Size against public anchors; stock versus flow | Partly (blocked on IND-D1) | `qa/indusind_anchors.md`, `qa/indusind_volume_validation.md` |
| HL-19 | Banker sanity ratios | Applied | `check_indusind.py`: reject rate, negative share overall and by product, social inbox share, one IO register, at-risk within pending (fixtures) |
| HL-20 | Weighted values must not be lumpy | Applied | `check_indusind.py` lumpiness check (fixture) |
| HL-21 | Resolved + open + waiting = volume | Applied | `check_indusind.py` (fixture) |
| HL-22 | Numbers first: subtitles ≤6 words, items ≤12, definitions behind an (i) | Applied | `lint_indusind.py` IND-HL22 on tile subtitles and theme paraphrases (fixtures); source notes behind an (i) |
| HL-23 | The business view shows only its own business | Applied | Cards section titles carry "Cards"; Cards row = Cards screen (fixture) |
| HL-24 | Colour: volume neutral; red means a breach | Applied | Manual |
| HL-25 | One trend per card; hover by keyboard and touch | Applied | ui-qa |
| HL-26 | Floating Ask bar never covers content | Applied | Screenshot script asserts the bar clears the footer |
| HL-27 | Regulatory statements from the register; "confirm with the bank" | Applied | Definitions in config; register-bound dates |
| HL-28 | Strip copied HDFC text; use N37, not "16 Jan 2026" | Applied | `lint_indusind.py` rule 20 and IND-HL28 (fixture) |
| HL-29 | Narrative text generated from data | Applied | Quiet item, themes and answers come from the pipeline |
| HL-30 | One branch; commit per step; push, never merge | Applied | Git history |
| HL-31 | Plan before code | Applied | `docs/indusind/build_plan.md` |
| HL-32 | Log every judgement call | Applied | `MORNING_DECISIONS.md` IV-xx |
| HL-33 | Screens one by one at 1440, 390 and 1536×730 at 1.25; both views and the filter; local fonts | Applied | Screenshot script (local fonts, three sizes) |
| HL-34 | Report numbers that look wrong | Applied | Reports to Usha |
