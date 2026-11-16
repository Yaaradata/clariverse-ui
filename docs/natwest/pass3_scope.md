NatWest Pulse v1 — Pass 3: scope to NatWest Retail only
Ranjith's decision, 14 Nov 2026: the buyer runs NatWest Retail; the Business Owner view must be tight. The dashboard shows NatWest alone. Royal Bank of Scotland data may be loaded later but is not shown. Ulster Bank is out. Same `oct13` layout, nothing added or removed. Log as NW-D40 onward; commit once; still no push until Deployment Protection is confirmed.

1. Header and title. "NatWest Group · Customer Pulse" → "NatWest · Customer Pulse". Page `<title>` "LisN · NatWest". Role-based card and everywhere else "NatWest Group" appears as the subject of the dashboard → "NatWest". (Legal entity remains National Westminster Bank plc in the register.)
2. Footer scope note. Replace the three-brand sentence with: "Retail figures: NatWest (England and Wales), on-topic items in the window. Royal Bank of Scotland, Ulster Bank and group companies are excluded."
3. Watermark. "…not NatWest Group MIS" → "…not NatWest MIS".
4. Pipeline. `brand` field stays. Retail figures filter to `brand == natwest` only; `rbs` rows, if ever loaded, are kept in data and excluded from every screen figure (same treatment as `group_other`). Update `meta.json` scope note and the reconcile check that sums brands to group so it expects one brand.
5. `/market` App pulse. Apps shown: NatWest app only. The "Show group-company apps" toggle stays in the layout but lists RBS and Ulster as excluded brands alongside Coutts and Mettle (greyed, not loaded).
6. Internal seed sizing. Re-base from 19m group retail to NatWest brand alone: about 13 million customers; complaints anchor from National Westminster Bank plc only (86,498 H1 2026 → about 49,200 in window, unchanged, because that return is already NatWest-only; RBS's 17,394 was never in it). Cohort sizes scale down proportionally; re-run volume validation.
7. Lint. Add "NatWest Group" (as dashboard subject), "Royal Bank of Scotland", "RBS", "Ulster" to the banned-on-screen list for NatWest paths, with the one exemption of the excluded-brands line in the footer and the App pulse toggle.
8. Ask LisN. Remove the "brand gap" persona question; replace with "Which journey is leaking most customers this week?"
9. Checks. Pipeline, reconcile, volume validation, lint, PII, all routes 200, crawl, screenshots of home, market and deliverables. Report in under 10 lines.

Build note: NW-D40 to NW-D44 were already used by Pass 2, so Pass 3 is logged as NW-D45 to NW-D51 (docs/demo-rebuild/MORNING_DECISIONS.md).
