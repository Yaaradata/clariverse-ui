# Team context — Dev brief for the KGS Commercial Fire demo (build tomorrow in Cursor)

## Outcome
Ranjit BK (developer) will build a LiSN demo **tomorrow** in **Cursor**, starting from an existing Vercel-hosted demo built for a large Indian private bank's Head of Cards. We are writing the briefs he needs to build a KGS version **with the same look and feel**, mock data and screen transitions. The audience is **Kartik Kumar, President – Global Commercial Fire, Kidde Global Solutions (KGS)**. Success = Kartik says "let's try this — and get more people on the next call". Must include the exec screen **plus at least one double-click / deep dive** that feels real.

## The existing demo (reference screenshots — look at them)
PNG renders in `/home/claude/kgs/demo_ref/`: `Head_of_Cards_Exec-1.png` (exec overview), `Cards_Journey-1.png` + `-2.png` (drill-down Q1), `Market_saying-1.png` + `-2.png` (drill-down Q2), `ServicePromise-1.png` + `-2.png` (drill-down Q3). Observed pattern:
- **Dark theme** (near-black page, dark-grey cards, thin borders, rounded corners), accent colours purple/violet (brand), teal, orange, red, amber/yellow, green. Geometric sans (Outfit-like) for text; **monospace for numbers/metrics**. Chips/badges: CRITICAL (red), HIGH (amber), WATCH (yellow), MEDIUM, NEGATIVE/POSITIVE/NEUTRAL.
- **Left icon rail** (logo "V"-like mark top; nav icons for Overview/pulse and each of the 3 questions; back arrow). **Header bar** on drill-downs: page question + breadcrumb ("Credit Cards · Head of Credit Cards · Lifecycle · Journey · Retention").
- **Exec overview**: (1) "✨ EXECUTIVE BRIEF" one-line summary ("All three scores down this week — Satisfaction −4pts, Market −8pts, Service Promise −11pts"); (2) "✨ EXECUTIVE PULSE" three numbered cards: "1. What's critical", "2. Where's your focus", "3. What's stable/on-track"; (3) **three question cards** side by side, each with an icon, question title, sub-caption, big score (68) with delta (−4 pts), two semicircle gauges with %, area-trend chart, two mini KPIs (e.g. TOP PAIN "PIN Reset", HSHF AT-RISK "18 accounts"), and a "CONVERSATION AI" insight box; each card has a coloured border (teal / orange highlighted / red) and a ">" to drill down; (4) "AI Risk Spike Monitor" — horizontally scrolling alert cards (title, severity chip, CHANNEL, TOP INTENT, TIME window, before→after metrics with % rise, and a ✨ recommendation box). Floating ✨ AI button bottom-right.
- **Drill-down pages**: "← Back to Overview" button + large question headline + one-line subtitle; grid of panels: KPI tiles with WoW deltas; segment tables; stacked sentiment bars; line chart (12-week segment monitor); "AI Summary Wall" (live; stacked insight cards with CRITICAL/ALERT chips, metric, trend line, "Click for details →"; footer counts Critical/Warnings/Improving); watchlist; "Strain & Friction" table; stacked bar chart with a **detail side panel** (count, KPI mini-grid, "AI INSIGHT" box, "RECOMMENDATION" box, "DOMINANT TOPICS" chips); journey-stage table; "Brand Promise Gap" table with tabs/filters; "Momentum" tiles; "Rankings & Reviews" table with "AI note"; SLA KPI tiles; "Why Disputes Breach SLA" panel **"card-system enhanced"** (i.e. a join with operational data — this is the LiSN differentiator pattern); aged-case watchlist; "✨ AI Dispute Diagnosis" box with **Main reason / What changed / Fix first**; ranked failures list; funnel.
- Retire from the banking demo: "FCI" terminology (e.g. "Real-time FCI intelligence"), card/banking segments (HSHF etc.), "Conversation AI" label (rename "LiSN signal" or "LiSN insight").

## The KGS story (already decided — use these; refine wording only)
Persona: **President, Global Commercial Fire** (P&L owner, ~$1bn+; brands Edwards, Kidde Commercial, GST, Aritech, EMS, AirSense; year-2 PE carve-out from Carrier to Lone Star; ex-Six Sigma/strategy; cares about quality & reliability, "ambitious growth", connected/lifecycle services, channel).
Three executive questions (mirror the three cards):
1. **"Is our installed base healthy?"** — firmware releases, date-code/batch windows, field failures, RMA, nuisance alarms. **Hero + double-click lives here.**
2. **"Are we holding our channel?"** — Strategic Partner / ESD drift, backorder consequence, certification gaps, competitor mentions.
3. **"Is the separation costing us?"** — carve-out friction after entity/portal/ERP/EDI cutovers: invoicing, remit-to, part numbers, logins; DSO.
Plus a **"Field Signal Monitor"** strip (the analogue of the AI Risk Spike Monitor) and a **governed Safety & Cyber watch** (restricted; "LiSN does not determine reportability").
**Hero signal (double-click):** EST4 firmware 4.1 (synthetic) — "devices not found after upgrade" contacts 3.1× panels still on 4.0; 9 partners, 3 regions; 1,240 panels on version; caught at week 3 while the aggregate RMA line is green; routed to VP Engineering; "Draft investigation brief — awaiting VP Engineering approval". Full spec in `/home/claude/kgs/out/Messaging_Positioning_Demo_Inputs.md` §10 (read it).

## Sources to read
- `/home/claude/kgs/out/Messaging_Positioning_Demo_Inputs.md` — positioning, message house, objections, one-page brief, **demo spec §10** (hero, tiles, dataset, talk track). Primary source.
- `/home/claude/kgs/out/Personas_Stakeholders_Risks.md` — persona cards (P1 President etc.), message matrix.
- `/home/claude/kgs/out/UC_Q_quality_safety_cyber.md`, `/home/claude/kgs/out/UC_C_channel_commercial_carveout.md`, `/home/claude/kgs/out/Review_Log_and_Index.md` — use cases and index.
- `/home/claude/kgs/team/BRIEF.md` — LiSN principles and house style (apply).

## Non-negotiables in the demo
- Every signal shows **severity (rendered: class S1–S4 with text label, type cliff/slope, blast radius, incident flag)**, a **confidence marker** (Known vs Inferred split), **join tags**, a **P&L destination metric**, the **routed owner**, and a **human-gate state**. LiSN "aids resolution"; never "resolves"; drafts, people approve.
- Persistent badge **"SYNTHETIC SCENARIO — illustrative data, not KGS data"**; synthetic firmware versions/serials/partner IDs; an **Anonymise** toggle (real platform names → "Platform A" etc.) for anything screenshotted or forwarded. Real platform names (EST4, Edwards) allowed in the live narrated session only with the badge.
- No implication of a current KGS defect; no residential recall content; no external-signal claims (weather etc.); no "your data is fragmented" assertion; no "300K daily" scale claim — volumes sized to KGS (~1,800 interactions/working day; ~234k over 26 weeks).
- House style: "LiSN" (never LisN/Lisn); British spelling; no exclamation marks; never "cheap".
- Volumes/figures are illustrative; label as such in the UI where they appear in money terms.

## Build constraints
- One day of build in Cursor. Prioritise: **P0** = Exec overview + Q1 drill-down + Signal deep-dive (double-click) with evidence drawer and approval transition. **P1** = Q2 and Q3 drill-downs (reuse components). **P2** = Ask-LiSN canned panel, role switcher, extra polish.
- Stack: unknown — assume the existing repo is React/Next.js + Tailwind (likely Recharts for charts, possibly framer-motion). Instruct Ranjit BK to follow the existing repo's stack and components; never rewrite the design system.
- All data is mock, static JSON/TS modules in the repo; no backend.

## Output location
Write your file(s) into `/home/claude/kgs/devbrief/` using the filename given in your task. Markdown, crisp, dev-ready (tables, exact copy strings in quotes, IDs). Final message: a 6–10 line summary of what you produced and any open question.
