# 07 · Research prompts for ChatGPT / Claude — optional accelerators

**For:** Ranjit BK (developer; not a fire-industry expert) · **From:** Demo Director · **v1 · 28 Sep 2026**
**Read with:** `01_Persona_Exec_Brief.md` (glossary §3, tone rules §5), `04_UX_Screens_Copy_Transitions.md` (exact copy), `05a_Data_Contract.md` (data, tokens). Cursor-specific build prompts are in `06`; they are not repeated here.

---

## 0. Read this first

**The core research is already done and captured in this pack.** Persona, glossary, pain points, value maths, exact screen copy, the 23 evidence items and the anonymise map are all in 01–05a. You can build the whole demo without running any prompt in this file.

These prompts are **optional accelerators** for three situations:
1. You want to understand what you are building (a 20-minute primer).
2. You need more synthetic content than the pack gives you (extra verbatims, extra partner IDs).
3. You want a second pair of eyes on a built screen (screenshot critique, copy polish, red-team).

**Rules that apply to every prompt**

| Rule | Why |
|---|---|
| **The pack wins.** If a model's answer conflicts with 01–05a, use the pack and ignore the model. | Models invent product specifics (loop counts, device families, firmware behaviour) with confidence. |
| **Never paste** private figures (the President's P&L size or anything derived from it), people's names, or anything about how YaaraLabs knows the audience. Use roles only ("President", "VP Engineering"). | These are private and must not leave the team. |
| **Screenshots to external tools: anonymised mode only** (`?anon=1`), unless you are checking a named-only string, and then only in a workspace account with training turned off. | Real platform names beside a hypothetical fault must not travel. |
| **Never change the FIXED data** (the 23 hero evidence items, their invariants, the V-register figures in 02 §2). Generated content is additive, for other signals or "All 23"-style lists only. | Numbers must match across exec, drill-down and hero. |
| **Nothing generated goes on screen unreviewed.** Run the copy-polish prompt (§6) and the QA checklist (08 §5) on anything new. | House style and claims discipline. |

### 0.1 Standard context header (paste at the top of any prompt below)

```
CONTEXT (read before answering)
- Product: LiSN, an early-warning layer that reads what installers, partners and
  distributors say (tech-support calls, cases, email, RMA narratives, portal tickets)
  and joins it to firmware, batch/date code, RMA and order data. It measures each
  platform, firmware release, date code and partner against its own baseline, ranks
  the few signals that matter and routes each to one owner. LiSN drafts; people
  approve. It "aids resolution"; it never resolves, decides root cause or decides
  reportability.
- Demo: a synthetic scenario for a commercial fire-alarm OEM (Global Commercial Fire
  business; brands include Edwards, Kidde Commercial, GST, Aritech, EMS, AirSense).
  Audience: the President of that business (P&L owner; ex-Six Sigma Black Belt;
  thinks in special cause vs control limits). All data is synthetic. Firmware
  versions, serials, date codes and partner IDs are invented and marked "(synthetic)".
- Screens: (1) exec overview "Global Commercial Fire — Signals this week";
  (2) Q1 "Is our installed base healthy?"; (3) hero deep-dive: EST4 firmware 4.1
  (synthetic) — "devices not found after upgrade" contacts 3.1× panels still on 4.0;
  9 partners, 3 regions; 1,240 panels on version; routed to VP Engineering;
  (4) Q2 "Are we holding our channel?"; (5) Q3 "Is the separation costing us?"
  (year-2 carve-out: entity, portal, ERP, EDI cutovers).
- House style: "LiSN" exactly (never Lisn, LisN, LISN); British spelling
  (organisation, prioritise, programme, colour, centre, behaviour, anonymise);
  no exclamation marks; no hype; never "cheap"; numbers before adjectives.
```

---

## 1. Twenty-minute domain primer

**Purpose:** understand commercial fire-alarm systems well enough that the demo screens make sense to you, and you can spot a wrong word.
**When to use:** before you start the Q1 and hero screens, or the evening before. Once.

**Prompt**
```
[Paste the standard context header]

I am a software developer building the demo above. I am not from the fire industry.
Give me a 20-minute primer on commercial fire-alarm systems, tuned to understanding
the demo screens. Structure it exactly like this:

1. The system in one picture: control panel, signalling line circuits ("loops"),
   addressable devices (detectors, modules), notification appliances, how the panel
   discovers and maps devices on a loop, and what "devices not found" means.
   Draw it as a simple text diagram.
2. Firmware: how panel firmware is released, downloaded and installed per panel,
   what a staged rollout is, why a rollback happens, and why a new release can
   affect loop mapping on some configurations and not others (general patterns only).
3. The lifecycle: design and specification, install, programming, commissioning,
   acceptance test with the AHJ, inspection/testing/maintenance (ITM), upgrade,
   RMA and warranty. For each, one line on who is involved and what can go wrong.
4. The route to market in North America: engineered systems distributors (ESDs),
   dealers, installers, specifiers, AHJs. Who buys, who installs, who calls tech
   support, who approves.
5. Quality vocabulary: RMA, RMA narrative, DOA, NFF (no fault found), date code
   (YYWW), batch/component lot, p-chart, control limit, special cause, cohort,
   8D (D1–D3 only).
6. Separation vocabulary: carve-out, TSA, cutover, remit-to, legal entity, EDI,
   DSO — one line each, in the context of distributors paying invoices.
7. "Read the demo like an insider": for each of the five screens listed in the
   context, three things a fire-industry service or engineering VP would look at
   first, and one thing that would make them doubt it.
8. Ten words or phrases a newcomer typically gets wrong in this industry, with the
   correct usage.

Rules: general industry patterns only. Do not state facts about any specific
manufacturer's products, firmware versions, defects or recalls. Where practice
differs between the US and UK/EU, say so in one line. British spelling. Keep the
whole answer readable in 20 minutes (about 2,500 words).
```

**What good output looks like:** a sectioned primer with a text diagram of panel → loops → devices; a clear explanation of loop mapping; the lifecycle as a table; a North America channel paragraph that matches 01 §1 (ESDs, dealers, installers, AHJs); section 7 mentions denominators (panels on version), aggregate vs cohort, and "no root-cause claim".

**Caution:** the model's product detail (loop counts per panel, device families, how any named platform behaves) is **not** a source. Do not copy any of it into UI copy. On conflict, 01 §3 glossary wins.

---

## 2. Glossary check: "explain this screen as a fire-industry service VP would read it"

**Purpose:** check that the words on a built screen are used correctly and read the way an industry executive would read them.
**When to use:** after each P0 screen renders (overview, Q1, hero, evidence drawer). Run it once per screen.

**Prompt**
```
[Paste the standard context header]

Below is the visible text of one demo screen (or an anonymised screenshot).
[Paste the screen text, or attach the screenshot]

Act as a VP of Service & Technical Support at a commercial fire-alarm OEM with
20 years in the industry. Do three things:

A. Read-out: in 8–10 sentences, explain what this screen is telling you, in the
   order your eye would move across it. Say what you would conclude and what you
   would do next, as that VP.

B. Term check: a table with columns
   | Term or phrase on screen | Used correctly? (Yes / Doubtful / No) |
   | How an industry reader understands it | Suggested fix, if any |
   Cover every industry term (e.g. loop, mapping, panel-weeks, NFF, RMA, date code,
   ESD, Strategic Partner, AHJ, commissioning, cohort, control limit, remit-to,
   cutover, DSO). Flag anything that sounds like banking, retail or generic
   "customer experience" language (e.g. customers, tickets, sentiment, CSAT, NPS,
   churn, customer journey, disputes as a queue, cards).

C. Credibility: list up to five things on this screen that would make you, as that
   VP, doubt the demo — wrong units, implausible rates, a claim of root cause,
   anything that implies a real product defect, anything that implies the tool acts
   without approval.

Rules: do not rewrite exact figures. Do not propose new numbers. British spelling.
```

**What good output looks like:** the read-out lands on "one firmware cohort is drifting under a green aggregate, routed to Engineering, waiting for a decision"; the term table is mostly "Yes"; any "Doubtful" rows come with a concrete replacement word; section C names specific strings, not general advice.

**Caution:** a "Doubtful" is a prompt to check 01 §3 and 04, not an instruction to change locked copy. Strings in "double quotes" in 02 and 04 are exact; raise conflicts with Ranjith rather than editing them.

---

## 3. Additional installer verbatims (synthetic)

**Purpose:** generate extra realistic snippets for **other** signals or panels (D-2 date-code window, ESD-SE-07 partner drift, N-3 backorder, UK-EU cutover, Q1 phrasing table, Ask-LiSN canned answers) in the style of the 23 hero evidence items.
**When to use:** only if a panel needs more evidence cards than 05a supplies. **Never** to replace or add to the 23 hero records (05a §4.4.1 is FIXED).

**Prompt**
```
[Paste the standard context header]

Generate [N] synthetic evidence snippets for the signal: [pick one]
  - "Detector family D-2 (synthetic), date codes 2611–2614: early-life
    'device not responding' in the first 90 days"
  - "ESD-SE-07 (synthetic) Strategic Partner drift: open technical escalations,
    recontacts, backorder frustration, lapsed certifications, a competitor quote
    mentioned"
  - "Notification family N-3 (synthetic) backorder consequence: cancel / substitute
    language, project delays, inspection dates at risk"
  - "UK-EU entity cutover on 1 Sep: invoice entity doesn't match the PO entity,
    remit-to bank details not recognised, portal login failures, credit notes,
    re-issued invoices"

Match the style of these existing items (tokens in {{ }} must be kept as written):
  1. Call · ESD-SE-07 · Florida · 9 Sep · K — "After we pushed {{fw:EST4@4.1}} the
     loop comes back with half the devices missing. Rolled one panel back to
     {{fw:EST4@4.0}} and it mapped fine."
  2. Case note · ESD-SW-03 · Texas · 11 Sep · K — "Devices not found after upgrade on
     loops 2 and 3; mapping stops around 60%. Power-cycled; no change."
  3. Email · ESD-CA-04 · Ontario · 15 Sep · I — "Third site this month with the same
     thing after the firmware update — is there a known issue?"
  4. RMA narrative · ESD-SE-11 · Georgia · 16 Sep · K — "Module returned as suspected
     failure following panel upgrade. Bench: no fault found."
  5. After-hours line · ESD-SE-02 · Florida · 18 Sep · I — "Acceptance test with the
     AHJ tomorrow and the loop won't map since the update."

Style: short (8–30 words), practical, the way a technician or distributor's
accounts clerk actually writes — site context, what they tried, what they need.
Mix channels: call, case note, email, RMA narrative, after-hours line, portal ticket.
Vary phrasing so the same problem is described several different ways.

Output as a table with columns:
| id (EV-XX-nnnn) | UTC timestamp (ISO) | local label (e.g. "11 Sep") | channel |
| partner token | region | place | K or I (with reason if I: "ship date",
"download log", "photo of label", "text only") | text |

GUARDRAILS (mandatory):
- Everything is synthetic. Use only synthetic IDs in this form: ESD-SE-nn,
  ESD-SW-nn, ESD-CA-nn, ESD-MW-nn, DLR-XX-nnn, DIST-UK-nnn, DIST-DE-nnn,
  DIST-NL-nnn. No real company, distributor, installer, site, building or
  person names. No competitor names: write "[competitor]".
- No claim that any real product has a defect. Only the synthetic cohorts named
  above may show a fault. Do not mention recalls, "defect confirmed", "field
  action" or residential products (home smoke or CO alarms).
- No fire event, injury, death, dispatch or "system failed during an alarm". The
  incident flag on these signals is Off; such language would make it an S1 item.
- No cyber-vulnerability language (that belongs to the restricted watch).
- UK-EU items use British spelling and GBP. North America items should avoid
  words that are spelt differently in US and British English; if unavoidable, use
  British spelling (UI rule).
- Timestamps inside the window 30 Mar – 25 Sep 2026, none after
  25 Sep 2026 18:00 UTC. For US/Canada items, make the UTC time consistent with a
  plausible local business hour (after-hours items excepted).
- No exclamation marks. No named people.

After the table, add a self-check list: count by channel, count by partner, K vs I
split, and confirm each guardrail line by line.
```

**What good output looks like:** snippets that read like the five examples (site context, action taken, ask); several phrasings of one fault; a K/I split with honest reasons; a self-check that actually counts.

**Caution:** check every row against the guardrails yourself before it goes in a JSON file. If a panel's counts are fixed in 02 or 05a (e.g. "22 in window, 14 sharing a lot" for D-2; "40 interactions vs baseline 13" for ESD-SE-07), the number of snippets you **show** must not contradict them. Show a subset and label it ("Showing 6 of 40").

---

## 4. Synthetic partner IDs, regions and site types for anonymised mode

**Purpose:** extend `anonymise.json` (05a §3.2) when you add a partner, distributor, place or site type that is not yet mapped.
**When to use:** any time an unknown-token console warning appears, or a new panel needs rows.

**Prompt**
```
[Paste the standard context header]

I need additional synthetic entries for an anonymisation map. Existing pattern:
- Partners (named → anon): "ESD-SE-07" → "Partner P-07"; "ESD-SW-03" → "Partner
  P-23"; "ESD-CA-04" → "Partner P-44"; "DLR-NE-118" → "Partner P-118";
  "DIST-UK-004" → "Distributor D-04"; "DIST-DE-012" → "Distributor D-12".
- Regions: "US-SE" → "Region NA-1"; "US-SW" → "Region NA-2"; "Canada" → "Region
  NA-3"; "UK-EU" → "Region EU-1"; "UK" → "Country EU-a"; "DE" → "Country EU-b".
- Places: "Florida" → "State 1".
- Site types used: commercial office, education, healthcare, hospitality,
  industrial, data centre, retail.

Generate:
1. [N] new NA partner IDs across US-SE, US-SW, US-NE, US-MW, US-W, Canada, split
   between ESDs and dealers, each with a unique anon label that does not collide
   with the existing ones.
2. [N] new UK-EU distributor IDs across UK, DE, NL, FR, ES, IT, PL, with anon labels.
3. Anon labels for these places: [list states/provinces/countries you need].
4. For each partner: territory, tier (Strategic Partner / dealer / distributor),
   typical site types (2–3 from the list above) and an approximate count of
   certified technicians (small integers).

Output as a JSON fragment in exactly this shape, ready to merge:
{ "partner": { "<ID>": { "named": "<ID>", "anon": "<label>" } },
  "place":   { "<name>": { "named": "<name>", "anon": "<label>" } } }
followed by a separate table of partner attributes.

Rules: IDs and codes only. Do NOT invent company-style names (e.g. "Southeast
Fire Systems Ltd") — an invented name can match a real business. No people's names.
Keep anon numbering monotonic within each region block.
```

**What good output looks like:** a clean JSON fragment that merges without key collisions; codes only; anon labels that follow the existing numbering blocks (SE 0x, SW 2x, CA 4x, MW 5x).

**Caution:** run a quick collision check after merging (no two named keys map to the same anon label). Then switch Anonymise on and search the rendered page for every new named value (08 §5.4).

---

## 5. Screenshot critique against the brief

**Purpose:** get a punch list of mismatches between a built screen and the brief.
**When to use:** after each P0 screen is feature-complete, and once more on the full run-through the evening before the demo.

**Prompt**
```
[Paste the standard context header]

Attached: a screenshot of one built demo screen at 1920×1080 (anonymised mode).
Below: the brief section for this screen, with exact copy in "double quotes".
[Paste the relevant section of 04_UX_Screens_Copy_Transitions.md, e.g. §2 for the
overview, §3 for Q1, §4 for the hero]

Compare the screenshot with the brief. Return ONE table, most severe first:
| # | Element / location on screen | Expected (quote the brief) | What I see |
| Severity: Blocker / Major / Minor | Fix (one line) |

Check, in this order:
1. Missing or wrong exact copy (any character difference in a quoted string).
2. Numbers that differ from the brief, or that disagree with each other on the
   same screen.
3. Non-negotiables on every signal: severity class shown as text ("S2 · …"),
   type (cliff/slope), blast radius, incident flag, confidence with K/I split,
   join tags, P&L destination, routed owner (a role), human-gate state.
4. The persistent badge "SYNTHETIC SCENARIO — illustrative data, not KGS data" and
   the fixed footer are visible; "(synthetic)" appears after every firmware
   version, serial, date code, SKU family and partner ID; money carries an
   "ILLUSTRATIVE" chip.
5. Banking leftovers: FCI, Conversation AI, AI Risk Spike Monitor, AI Summary Wall,
   HSHF, cards, cardholders, chargeback, merchant, MCC, EMI, CSAT, NPS, sentiment,
   churn, customer journey, hashtags, "Head of Cards".
6. Jargon errors or US spelling (organization, prioritize, color, center, behavior).
7. Claims: resolve(s), root cause, predicts, real-time, auto-, "sent", "notified",
   "has contacted", any enabled Send / Notify button, any savings or ROI figure,
   any $ and £ added together.
8. Legibility on a screen share: text under ~12px, low-contrast grey on dark grey,
   meaning carried by colour alone, truncated labels, overlapping chart markers.

Do not invent issues you cannot see. If text is too small to read, say "unreadable
in screenshot" rather than guessing.
```

**What good output looks like:** a table of concrete, located findings with quoted expected strings; blockers first; "unreadable in screenshot" where honest.

**Caution:** models misread small text in screenshots and sometimes "find" strings that are not there. Verify each finding in the browser (DOM text) before fixing. The brief is the source of truth, not the critique.

---

## 6. Copy polish (house style)

**Purpose:** tidy **new** copy (tooltips, empty states, Ask-LiSN canned answers, generated snippets, anything not already fixed in 02/04) to house style.
**When to use:** before any new string goes into a JSON/TS data file.

**Prompt**
```
[Paste the standard context header]

Polish the strings below to LiSN house style. Return a table:
| # | Original | Polished | What changed and why (one line) |

House style rules (apply all):
1. Brand: "LiSN" exactly. Never Lisn, LisN, LISN. Do not put "LiSN" inside text
   that will be CSS-uppercased; write caps labels literally, e.g. "LiSN INSIGHT".
2. British spelling: organisation, prioritise, programme, colour, centre,
   behaviour, licence (noun), anonymise, analyse, catalogue, distil.
3. No exclamation marks. No hype words (massive, crisis, game-changing, powerful,
   revolutionary, seamless, instantly). Never "cheap" (use "cost-efficient at
   scale" if cost must be mentioned).
4. LiSN "aids resolution". Never "resolves", "fixes", "auto-", "predicts",
   "determines", "decides". LiSN drafts; owners approve. Use "Owner to decide: …".
5. Candidate, not verdict: "Candidate: … — not a cause". Never "root cause".
6. Numbers before adjectives. Round money with unit ("≈ $0.15m", "£1.1m").
   Never add $ and £. No savings, ROI or payback.
7. Vocabulary: installers, partners, distributors, installed base, cohort, own
   baseline, special cause, RMA, NFF, cost-to-serve. Not: customers (as the only
   word), tickets, sentiment, CSAT, NPS, churn, customer journey.
8. Roles only, never people's names. "President", "VP Engineering", etc.
9. Questions rather than assertions about the audience's organisation. Never
   "your data is fragmented" or "you can't see this today".
10. "above threshold this week", never "crossed a threshold this week".
11. No "sent", "notified" or "has contacted" — use "not sent", "awaiting …
    approval".

DO NOT CHANGE: any number, ID, date, time, currency, "(synthetic)" tag, or token
in {{double braces}}. If a rule cannot be met without changing one of those,
flag it instead of changing it.

Strings:
[Paste strings, one per line]
```

**What good output looks like:** minimal edits; every change explained; tokens and figures untouched; flags where a number itself looks wrong.

**Caution:** **do not run this on locked copy.** Strings quoted in 02 and 04 are exact and already reviewed; "improving" them breaks the QA string match. Polish only what is new.

---

## 7. Red-team as the President

**Purpose:** stress-test the built demo from the audience's seat before Ranjith presents it.
**When to use:** once, on the full run-through the evening before. Share the output with Ranjith.

**Prompt**
```
[Paste the standard context header]

Act as the President of a ~year-2 private-equity-owned commercial fire OEM,
recently carved out of a large US conglomerate. Your background: ran an industrial
P&L, recovered key accounts before, Six Sigma Black Belt, strategy and M&A roles.
You say publicly that quality and reliability matter as much as new capability,
and that connected and lifecycle services are a growth priority. Your company
already has a cloud platform for remote panel monitoring and diagnostics. You are
sceptical of small AI vendors, allergic to fake precision, and protective of your
company's reputation and your team's time during the separation.

You are being shown the attached screens [anonymised screenshots] and this talk
track [paste 08 §1 lines, or a summary].

1. List the 10 things most likely to make you distrust this demo, ranked. For each:
   | # | What triggers it (quote the screen or line) | What you would think |
   | What you would say out loud | Fix before the meeting (one line) |
   Consider: overclaiming, fake precision, numbers that don't reconcile, anything
   that implies a real defect in your products, banking or retail leftovers,
   any sign the tool acts without approval, legal exposure on safety or cyber,
   data your team does not have, bandwidth during separation, vendor risk.
2. The five hardest questions you would ask in the meeting, and the answer that
   would satisfy you.
3. What would make you say "let's try this — and get more people on the next
   call"? Name the roles you would invite and why.
4. One thing you would want to see in version 2.

Be blunt. Do not be polite on the vendor's behalf.
```

**What good output looks like:** specific triggers tied to quoted screen elements (e.g. an unrounded number, a missing "(synthetic)", "Approve" clickable as President); hard questions close to the objection list in 08 §4; an invitee list close to 08 §3.

**Caution:** this is a simulation, not a view held by the real person. Do not put any of its "opinions" into a document, note or message as if the President said them. Do not paste private information into it (P&L size, the relationship, anything he shared privately).

---

## 8. Quick index

| # | Prompt | Who runs it | When |
|---|---|---|---|
| 1 | 20-minute domain primer | Ranjit BK | Before Q1/hero build |
| 2 | Glossary check / service-VP read-out | Ranjit BK | After each P0 screen |
| 3 | Additional verbatims (synthetic) | Ranjit BK | Only if a panel needs more cards |
| 4 | Synthetic IDs, regions, site types | Ranjit BK | On an unknown-token warning |
| 5 | Screenshot critique | Ranjit BK | Per screen; full run-through |
| 6 | Copy polish | Ranjit BK | Before new strings enter data files |
| 7 | Red-team as the President | Ranjit BK → Ranjith | Evening before |
| — | Cursor build prompts | see `06` | — |
