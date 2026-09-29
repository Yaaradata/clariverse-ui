# KGS Demo — Repository Map

**Created:** 29 Sep 2026 for the LiSN × KGS Global Commercial Fire demo build
**Purpose:** Locate existing components for reuse and identify the real stack

---

## 1. Stack

| Component | Details |
|---|---|
| **Framework** | Next.js 16.0.10 (App Router) |
| **Router** | App Router (`app/` directory structure) |
| **TypeScript** | Yes, strict mode |
| **Package Manager** | npm (package-lock.json present) |
| **Styling** | Tailwind CSS 3.x via `tailwind.config.js`<br>Config: `./frontend/tailwind.config.js`<br>Custom colors: extensive theme in registry.tsx exports `T` object<br>Fonts: Outfit (primary sans-serif), system mono for numbers |
| **Chart Library** | Recharts 3.2.1 (primary)<br>Also available: Highcharts, Chart.js, Plotly, D3 |
| **Icon Library** | lucide-react 0.544.0 |
| **Animation** | framer-motion 12.23.13, GSAP 3.13.0 |
| **UI Primitives** | Radix UI components:<br>- Dialog (@radix-ui/react-dialog)<br>- Label, Progress, Switch, Tabs, Tooltip<br>Located in `components/ui/` |
| **State Management** | Zustand 5.0.8 |
| **Build Scripts** | `npm run dev` (with Turbopack)<br>`npm run build`<br>`npm run lint` (Biome) |
| **Linter** | Biome (`biome.json` config) |
| **Analytics** | None detected in codebase |
| **Font Loading** | Next.js font optimization (check `app/layout.tsx`) |
| **Output Mode** | Standard Next.js build (no static export) |

---

## 2. Routes

### Existing Bank Demo Routes (Reference Only - Will Not Modify)

| Route | Page File | Layout |
|---|---|---|
| `/` | `app/page.tsx` | `app/layout.tsx` |
| Role-based dashboards | Via `components/role-based-dashboard/RoleDashboardView.tsx` component | Dynamically rendered based on registry |

### Key Navigation Pattern
- Registry-based: `lib/role-based-dashboard/registry.tsx` defines industries and roles
- Main entry: Industry picker → Role picker → Dashboard component
- Dashboard components live in `components/role-based-dashboard/`
- Example: HeadOfCreditCardsDashboard, CXVoCHeadDashboard, etc.

---

## 3. Component Map

Components from 03 §3 mapped to existing files:

| 03 Component | File Path | Exported Name | Props Pattern | Current Data Source |
|---|---|---|---|---|
| **Shell & Navigation** |
| LeftRail | `components/role-based-dashboard/RoleBasedChrome.tsx` | Part of RoleBasedChrome | Industry, role, nav items | Props from parent |
| DrillHeader | `components/role-based-dashboard/CreditCardsV3DrillDownScreens.tsx` | Inline in drill components | title, subtitle | Inline constants |
| BackToOverviewHeader | `components/role-based-dashboard/HeadOfCreditCardsDashboard.tsx` | Inline button + h1 | label, onClick | Inline |
| FloatingAIButton | `components/role-based-dashboard/HeadOfCreditCardsDashboard.tsx` | Inline (Sparkles icon button) | onClick | Inline |
| Tabs | Used via Radix UI | @radix-ui/react-tabs | Standard Radix props | N/A |
| **Exec Overview** |
| ExecBriefBar | `components/role-based-dashboard/HeadOfCreditCardsDashboard.tsx` | Inline amber bar | text | creditCardsV3Data |
| PulseStrip/PulseCard | `components/role-based-dashboard/HeadOfCreditCardsDashboard.tsx` | Inline 3-card grid | cards array | creditCardsV3Data |
| QuestionCard | `components/role-based-dashboard/HeadOfCreditCardsDashboard.tsx` | Tile component | Various metrics | creditCardsV3Data V3_TILES |
| ScoreDelta | Inline in QuestionCard | N/A | score, delta | Tile data |
| SemiGauge | Uses RadialBarChart (Recharts) | N/A | value, max | Inline calc |
| AreaTrend | Uses AreaChart (Recharts) | N/A | data points | Inline data |
| MiniKPI | Inline text blocks | N/A | label, value | Inline |
| InsightBox | Teal-bordered card | N/A | title, body | Inline |
| **Monitor & Risk** |
| SectionHeader | Inline h2 + subtitle | N/A | title, subtitle | Inline |
| RiskSpikeCard | `components/role-based-dashboard/CardsRiskSpikeMonitor.tsx` | RiskMonitorCard | spike data object | V3_RISK_SPIKES |
| MetricBeforeAfter | Inline in RiskSpikeCard | N/A | before, after, change | Spike data |
| RecommendationBox | Inline in RiskSpikeCard | N/A | text | Spike data |
| **Drill-Down Panels** |
| Panel | Generic card wrapper | N/A | children, className | N/A |
| KpiTile | Multiple variants in drill screens | N/A | label, value, sub, trend | Drill data |
| SegmentTable | Table in drill screens | N/A | rows, columns | Drill data |
| StackedSentimentBar | Horizontal stacked bars | N/A | segments, values | Drill data |
| TopIntent | Intent cards grid | N/A | intents array | Drill data |
| LineMonitor | LineChart (Recharts) | N/A | series, markers | Drill data |
| AISummaryWall/WallCard | `components/role-based-dashboard/HeadOfCreditCardsDashboard.tsx` | AI summary cards | items array | V3_AI_DAY_PROMPTS |
| Watchlist | Card with rows | N/A | items array | Drill data |
| FrictionTable | Table component | N/A | rows, columns | Drill data |
| StackedBarWithDetailPanel | `components/role-based-dashboard/CreditCardsV3DrillDownScreens.tsx` | Stacked bar + side panel | chart data, details | Drill data |
| DetailPanel | Side panel in drill | N/A | content | Drill data |
| JourneyStageTable | Table in CustomerCardJourneyV3Drill | N/A | stages, metrics | Drill data |
| PromiseGapTable | Table in service screens | N/A | rows, columns | Service data |
| MomentumTile | Tile in market screens | N/A | hashtag, metrics | Market data |
| EngagementCard | Card in market screens | N/A | engagement data | Market data |
| RankingsTable | Table component | N/A | rows, columns | Inline |
| AINote | Violet-bordered note card | N/A | text | Inline |
| EnhancedPanel | `components/role-based-dashboard/ServicePromiseIndiaDrill.tsx` | Enhanced panel | metrics, drivers | Service data |
| StuckDriverBars | Progress bars in EnhancedPanel | N/A | drivers array | Service data |
| ChipGroups | Chip arrays | N/A | chips array | Inline |
| AgedCaseWatchlist | `components/role-based-dashboard/ServicePromiseIndiaDrill.tsx` | Watchlist cards | cases array | Service data |
| DiagnosisBox | `components/role-based-dashboard/ServicePromiseIndiaDrill.tsx` | Purple-bordered diagnosis | main, changed, fix | Service data |
| RankedFailureList | List component | N/A | failures array | Service data |
| Funnel | Funnel chart | N/A | stages array | Service data |

---

## 4. Bank-Specific Strings & Assets

### Files Containing Banking Terms (Must Be Cleaned in KGS Copies)

**High-priority cleanup targets:**
- `lib/role-based-dashboard/creditCardsV3Data.ts` - Contains "cardholder", "credit card", "FCI", etc.
- `lib/role-based-dashboard/creditCardsData.ts` - Similar banking terms
- `components/role-based-dashboard/HeadOfCreditCardsDashboard.tsx` - Title, labels
- `components/role-based-dashboard/CreditCardsV3DrillDownScreens.tsx` - Drill content
- `components/role-based-dashboard/CardsRiskSpikeMonitor.tsx` - Risk spike content

**Specific terms to remove from KGS copies:**
- "FCI" / "Conversation AI"
- "cardholder", "Credit Card", "Head of Cards"  
- "chargeback", "MCC", "Merchant", "EMI"
- "CSAT", "NPS", "sentiment", "churn"
- "Real-time", "Live" (as status)
- "HSHF", "HSLF", "LSHF", "LSLF" (segment codes)
- Bank name references

### Assets
- Logo mark: Currently uses a custom mark in registry
- Favicon: `public/favicon.ico`
- OG images: Check `app/layout.tsx` metadata
- Title/metadata: In app layout files

---

## 5. Risks for KGS Build

### Component Hard-Coding Risks
1. **Data Hard-Coded in Components** ⚠️ HIGH RISK
   - Most dashboard components have data inline or imported from lib files
   - Will need complete prop typing from @kgs/types and data binding

2. **Text Truncation** ⚠️ MEDIUM RISK
   - Some card titles may use `truncate` class
   - KGS requires 2-line wrapping with `line-clamp-2`

3. **CSS Uppercase on Labels** ⚠️ MEDIUM RISK
   - Some components may have `uppercase` class on elements
   - Must be removed where "LiSN" is rendered (write literal caps)

4. **Small Text Sizes** ⚠️ LOW RISK
   - Micro labels may be 9-10px
   - KGS requires minimum 11px

5. **Categorical Chart X-Axes** ⚠️ LOW RISK
   - Charts with text labels may have rotation issues
   - Need to verify responsiveness

### Breaking Changes from Bank → KGS
1. **Moving Bank Pages** ⚠️ HIGH RISK
   - Moving existing pages to `_bank_ref` may break relative imports
   - Need to carefully update import paths

2. **Shared Theme Changes** ⚠️ MEDIUM RISK
   - KGS uses different colors/branding
   - Need isolated theme context

3. **Registry Modification** ⚠️ HIGH RISK
   - Adding KGS industry/roles could affect existing entries
   - Must test that bank demos still work if kept

---

## 6. KGS-Specific Implementation Notes

### Component Directory Structure (To Be Created)
```
components/role-based-dashboard/kgs/
├── shell/
│   ├── LeftRail.tsx (fork with LiSN monogram)
│   ├── DrillHeader.tsx
│   ├── ContextBar.tsx (NEW - sticky filters/badge)
│   ├── SyntheticBadge.tsx (NEW)
│   ├── AnonymiseToggle.tsx (NEW)
│   ├── Watermark.tsx (NEW)
│   ├── FixedFooter.tsx (NEW)
│   ├── DemoMenu.tsx (NEW)
│   └── BackToOverviewHeader.tsx (fork)
├── shared/
│   ├── SeverityChip.tsx (NEW)
│   ├── DomainChip.tsx (NEW)
│   ├── SeverityStrip.tsx (NEW)
│   ├── ConfidenceMarker.tsx (NEW - K/I split)
│   ├── JoinTagRow.tsx (NEW)
│   ├── PnLDestinationTag.tsx (NEW)
│   ├── IllustrativeChip.tsx (NEW)
│   ├── RoutedOwner.tsx (NEW)
│   ├── GateChip.tsx (NEW)
│   └── EmptyScope.tsx (NEW)
├── exec/
│   ├── FunnelStrip.tsx (NEW)
│   ├── ExecBriefBar.tsx (fork)
│   ├── PulseStrip.tsx (fork)
│   ├── QuestionCard.tsx (fork + restyle)
│   ├── WhatsCountedPopover.tsx (NEW)
│   ├── FieldSignalMonitor.tsx (NEW wrapper)
│   ├── SignalMonitorCard.tsx (fork RiskSpikeCard)
│   ├── SuppressedEndCard.tsx (NEW)
│   ├── AppliedValueStrip.tsx (NEW)
│   ├── GovernedWatchTile.tsx (NEW)
│   └── EvidenceReadinessTile.tsx (NEW)
├── signal/
│   ├── FirmwareLineageChart.tsx (NEW)
│   ├── SignalChips.tsx (NEW)
│   ├── CounterEvidence.tsx (NEW)
│   ├── EvidenceDrawer.tsx (NEW)
│   ├── DraftPreviewModal.tsx (NEW)
│   └── HumanGateStatus.tsx (NEW)
└── drill/
    ├── SignalWall.tsx (fork AISummaryWall)
    ├── StackedRatioBar.tsx (fork StackedSentimentBar)
    ├── EnhancedPanel.tsx (fork)
    ├── DiagnosisBox.tsx (fork)
    ├── DateCodeHeatStrip.tsx (NEW)
    └── LifecycleStageTable.tsx (fork JourneyStageTable)
```

### Data Layer Structure (Already in Place)
```
lib/role-based-dashboard/kgs/
├── types.ts (complete type definitions)
├── data/
│   ├── meta.json
│   ├── exec.json
│   ├── monitor.json
│   ├── signal_fw41.json
│   ├── installedBase.json
│   ├── channel.json
│   ├── separation.json
│   ├── anonymise.json
│   └── askLisn.json
└── lib/
    ├── data.ts (typed barrel exports)
    ├── label.ts (fmt, label, roleLabel, fmtDemoTime)
    ├── demoState.ts (DemoProvider, useDemo, useLabel)
    └── values.ts (VALUES, methodFor, money, unitCosts)
```

### Registration Pattern
1. Update `lib/role-based-dashboard/kiddeGlobalIndustry.ts`:
   - Add `KIDDE_GLOBAL_PRESIDENT_ROLE_ID = "president_commercial_fire"`
   
2. Update `lib/role-based-dashboard/registry.tsx`:
   - Find Kidde Global industry entry
   - Add second role: President (Flame/Shield icon)
   - Update industry description
   
3. Update `components/role-based-dashboard/RoleDashboardView.tsx`:
   - Add conditional for KIDDE_GLOBAL_PRESIDENT_ROLE_ID
   - Return KgsCommercialFireDashboard component

### Entry Component
- `components/role-based-dashboard/kgs/KgsCommercialFireDashboard.tsx`
- Props: `{ onExit?: () => void }`
- Mounts DemoProvider internally
- Implements view-state routing (not Next.js routes)
- Views: "overview", "installedBase", "hero", "channel", "separation"

---

## 7. Build Strategy

### Phase 1: Foundation (Steps 0-2)
- ✅ Mock data copied to `lib/role-based-dashboard/kgs/`
- Add tsconfig alias `@kgs/*`
- Create DemoProvider re-export
- Register President role
- Create view-state skeleton

### Phase 2: Shell & Primitives (Steps 3-5)
- Fork and clean bank components
- Build new signal primitives
- Implement shell chrome

### Phase 3: Exec Overview (Steps 6-8)
- Build three sections (A/B/C)
- Wire to exec.json data
- Implement approval flow

### Phase 4: Deep-Dive (Steps 9-14)
- Hero signal page
- Evidence drawer
- Q1 drill-down
- Detail panels

### Phase 5: Polish (Steps 15-20)
- Motion pass
- Q2/Q3 drill-downs
- QA and verification

---

## 8. Success Criteria

### Must Work
- ✅ Mock data imported via @kgs alias
- President role appears in Kidde Global industry
- Dashboard loads without errors
- Anonymise toggle works globally
- All text via useLabel() resolves tokens
- No banking terms in KGS UI strings
- Typography meets 11px minimum
- SyntheticBadge visible on all routes

### Must Not Happen
- Bank demo routes/components modified directly
- USD + GBP summed anywhere
- "LiSN" rendered via CSS uppercase
- Enabled Send/Notify/Export buttons
- Severity without word + glyph
- Real partner/platform names when anonymised

---

**Last Updated:** 29 Sep 2026
**Build Lead:** Ranjit BK
**Review Status:** Initial recon complete
