// components/role-based-dashboard/CXHeadRetailDashboard.tsx
// -----------------------------------------------------------------------------
// LiSN · Fluid CX — Head of Customer Experience dashboard (Retail + Quick-
// Commerce). This is the family-shell entry, matching the HeadOfCreditCards
// pattern: a theme provider wrapping a global style block, in-memory navigation,
// and the app shell (sidebar + header + active screen).
//
// PASS 1 SCOPE: shell + theme only. No cards, KPIs, data or business logic yet.
// Everything below is plumbing the later passes build on.
//
// Default export so it can be mounted directly:
//   import CXHeadRetailDashboard from '.../CXHeadRetailDashboard';
//   <CXHeadRetailDashboard />
// -----------------------------------------------------------------------------

import React from 'react';
import { DashboardThemeProvider } from '../../theme/DashboardThemeProvider';
import { GlobalStyles } from '../../theme/globalStyles';
import { NavigationProvider } from '../../lib/NavigationContext';
import { AppShell } from '../layout/AppShell';

export default function CXHeadRetailDashboard(): React.ReactElement {
  return (
    <DashboardThemeProvider defaultMode="dark">
      <GlobalStyles />
      <NavigationProvider>
        <AppShell />
      </NavigationProvider>
    </DashboardThemeProvider>
  );
}

// Named export too, for codebases that import by name.
export { CXHeadRetailDashboard };
