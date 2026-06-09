---
name: fluid-dashboard
description: Design, refine, audit, or generate build prompts for Fluid CX-intelligence dashboards. Fluid turns customer interactions (calls, chat, email, complaints, tickets) into role-specific business insight and action for banking executives. Use whenever building or reviewing a Fluid dashboard, a banking/BFSI executive dashboard, turning research/transcripts/Excel/screenshots into a dashboard spec, or writing a build prompt — even if the user doesn't say "Fluid" but is clearly building an executive operating dashboard for retail banking, credit cards, contact centre, CX, product/digital, or RBI conduct.
---

# Fluid Dashboard Skill

Fluid turns customer interactions into role-specific business insight and action. A Fluid dashboard is an operating screen for ONE executive, not a report. Test every choice by time-to-decision.

Spine: Customer Interaction → Signal → Business Issue → Persona Owner → Evidence → Recommended Action.
Conduct: Obligation → Customer Contacts → Channel Signals → Met % → Evidence → Owner Action.

## Four modes
1. Spec — inputs → specification (no code). 2. Build prompt — approved spec → tight build instruction. 3. Audit — built dashboard → score + fix prompt. 4. Refine — apply audit findings.

### Step 1 — pin context (always first)
Industry → Persona → Main business question → Inputs available → Output needed. Don't assume RBI/compliance. Load the matching persona from references/industry-persona-checklists.md.

### Step 2 — spec mode
Use references/dashboard-spec-template.md. Produce industry, persona, main question, key decisions, screen list, per-screen (question, components, metrics, dimensions, evidence, action queue), and a "what to avoid" list. Never jump research → UI. Never copy another persona's layout.

### Step 3 — build-prompt mode (only after spec approved)
Name exact screens, persona, per-screen question, required components, mock-data schema, visual hierarchy (headline top-left; AI insight top-right; drivers/trends middle; evidence + actions bottom), style rules, what NOT to add, acceptance checklist. The build step implements; it does not research.

### Step 4 — audit mode
Use references/dashboard-quality-checklist.md. Score /100, apply persona weighting, apply hard fails, return a fix prompt. Ask "is this good FOR THIS persona and question," not "is this good."

## Layout (every dashboard)
5-second headline top-left; AI insight top-right; drivers/trends/hotspots middle; evidence + action queue bottom. 5-9 KPIs (reject >12). KPI cards show value + comparison + variance + trend.

## References
references/industry-persona-checklists.md (load before any spec/audit) · references/dashboard-quality-checklist.md · references/dashboard-spec-template.md · references/fluid-spine.md.
