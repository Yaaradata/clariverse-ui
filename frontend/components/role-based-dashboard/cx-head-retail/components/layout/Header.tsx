// components/layout/Header.tsx
// Pass 1 — minimal top bar: active screen label + light/dark toggle only (CL-013).

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { CxRetailVersionToggle } from '@/components/role-based-dashboard/CxRetailVersionToggle';
import { useTheme } from '../../theme/DashboardThemeProvider';
import { useNavigation } from '../../lib/NavigationContext';
import { useDashboardShell } from '../../lib/DashboardShellContext';
import { screenById } from '../../lib/routes';
import { cssVar, layout, radius, type } from '../../theme/tokens';

export function Header(): React.ReactElement {
  const { mode, toggle } = useTheme();
  const { activeScreen } = useNavigation();
  const { industryId, retailVersion } = useDashboardShell();
  const screen = screenById(activeScreen);

  return (
    <header
      style={{
        height: layout.headerHeight,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: cssVar('surface'),
        borderBottom: `1px solid ${cssVar('border')}`,
      }}
    >
      <div>
        <div
          style={{
            fontSize: type.scale.h3,
            fontWeight: type.weight.bold,
            color: cssVar('text-primary'),
          }}
        >
          {screen.label}
        </div>
        <div style={{ fontSize: type.scale.small, color: cssVar('text-muted'), marginTop: 2 }}>
          LiSN · Fluid CX
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <CxRetailVersionToggle
          industryId={industryId}
          activeVersion={retailVersion}
          isDarkMode={mode === 'dark'}
        />
        <button
        type="button"
        onClick={toggle}
        aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: radius.md,
          cursor: 'pointer',
          color: cssVar('text-secondary'),
          background: cssVar('surface-raised'),
          border: `1px solid ${cssVar('border')}`,
        }}
      >
        {mode === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      </div>
    </header>
  );
}
