# LiSN · Fluid CX — Head of Customer Experience dashboard

**Pass 1 — Foundation (shell + theme only).** No cards, data, KPIs or business
logic yet. This is the plumbing every later pass builds on.

## Drop-in

Copy the `frontend/` folders into your Cursor project (alongside the existing
LiSN family shell). Peer deps already in a Vite + React + TS app:

```
react  react-dom  lucide-react   # recharts is added in Pass 3
```

Mount the entry component:

```tsx
import CXHeadRetailDashboard from './components/role-based-dashboard/CXHeadRetailDashboard';
// <CXHeadRetailDashboard />
```

## What is in this pass

```
theme/
  tokens.ts                 single source of truth: colour ramps (dark+light),
                            spacing, radii, type scale, layout constants, CSS-var map
  DashboardThemeProvider.tsx dark/light toggle (dark default), in-memory only,
                            themeKey for live-widget timer resets, AA-targeted contrast
  globalStyles.tsx          ONE global @keyframes block (drill-in/fade/scale) +
                            focus-visible + reduced-motion, injected once
lib/
  routes.ts                 the five locked screens (metadata only)
  NavigationContext.tsx     in-memory router: active screen + drill stack routed
                            by the item's OWN id (never a shared constant)
  useUniqueGradientId.ts    unique SVG gradient id per chart instance
  useManagedInterval.ts     timers cleared on unmount + re-keyed on theme toggle
components/
  layout/   Header · Sidebar (collapsible) · AppShell (id → screen map)
  screens/  five empty screen stubs (Command Centre is default landing)
  common/   ScreenScaffold (intentional empty state) · Sparkle (AI marker primitive)
  role-based-dashboard/CXHeadRetailDashboard.tsx   entry: providers + shell
```

## Pass 1 definition of done — verified

- [x] Shell renders; collapsible sidebar routes to five empty screens; default = CX Command Centre
- [x] Dark/light toggle works; both ramps target WCAG AA (primary text ~14–17:1)
- [x] Clean header: "LiSN · Fluid CX" mark + "Head of Customer Experience" pill + toggle; no internal codes / vendor names / domain-wrong terms
- [x] Routing in app memory only — no `localStorage` / `sessionStorage` anywhere
- [x] Single global `@keyframes` block for the drill-down slide-in
- [x] Unique-gradient-id helper present
- [x] Timer convention present (cleared on unmount and on theme toggle)
- [x] No leftover credit-card widgets, placeholder charts or lorem
- [x] `tsc --strict --noUnusedLocals --noUnusedParameters` passes with zero errors

## Accent / theme

Persona accent **indigo / violet**, severity **coral / amber** — distinct from
Head of Retail (gold-navy), Head of Credit Cards (cyan), Head of Contact Centre
(teal-emerald). Density medium-high, calmer than an ops control room.
