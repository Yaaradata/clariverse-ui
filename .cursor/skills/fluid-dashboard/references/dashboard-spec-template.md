# A. Dashboard spec (before any code)
Industry · Persona · Main business question · Key decisions this persona makes · Inputs used.
Per screen: name · main question · top insight/score (top-left) · KPI strip (5-9) · charts (each justifying trend/comparison/distribution/hotspot) · tables (only if action-driving) · evidence panel · action queue · what to avoid.
Data entities · metrics · dimensions · AI-insight requirements (top-right) · evidence requirements · action-queue requirements · acceptance checklist.
Rules: never research → UI; never copy another persona's layout; useful in 2 minutes; headline in 5 seconds.

# B. Build prompt (after spec approved)
State: industry, persona, exact screens (nothing extra), per-screen question + required components, visual hierarchy (headline top-left, AI insight top-right, drivers/trends middle, evidence+actions bottom), mock-data schema, style rules (reuse components; 12-col grid; KPI card = value+comparison+variance+trend), an explicit DO-NOT list (no research, no extra tabs, no decorative charts, no duplicated persona layout), acceptance checklist.
