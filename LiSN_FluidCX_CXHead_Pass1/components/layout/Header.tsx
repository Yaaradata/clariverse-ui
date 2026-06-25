// components/layout/Header.tsx
// -----------------------------------------------------------------------------
// The clean top bar. Product mark "LiSN · Fluid CX", a persona pill naming the
// single persona for the whole room, and the light/dark toggle. Nothing else —
// no internal codes, no vendor names, no domain-wrong terms (engineering
// guardrail). The persona pill enforces "one persona per screen" at a glance.
// -----------------------------------------------------------------------------

import React from 'react';
import { Sun, Moon, UserRound } from 'lucide-react';
import { useTheme } from '../../theme/DashboardThemeProvider';
import { cssVar, layout, radius, type } from '../../theme/tokens';

export function Header(): React.ReactElement {
  const { mode, toggle } = useTheme();

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
      {/* Product mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <LisnMark />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              fontSize: 17,
              fontWeight: type.weight.bold,
              letterSpacing: 0.2,
              color: cssVar('text-primary'),
            }}
          >
            LiSN
          </span>
          <span style={{ color: cssVar('text-muted'), fontSize: 14 }}>·</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: type.weight.medium,
              color: cssVar('text-secondary'),
            }}
          >
            Fluid CX
          </span>
        </div>
      </div>

      {/* Persona pill + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          title="One persona per screen"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: radius.pill,
            fontSize: 12.5,
            fontWeight: type.weight.medium,
            color: cssVar('text-secondary'),
            background: cssVar('surface-raised'),
            border: `1px solid ${cssVar('border')}`,
          }}
        >
          <UserRound size={14} style={{ color: cssVar('accent') }} />
          Head of Customer Experience
        </span>

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

/** Small wordless mark — a soft listening/sound-wave glyph in the accent. */
function LisnMark(): React.ReactElement {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 9,
        background: `linear-gradient(135deg, ${cssVar('accent')}, ${cssVar('accent-2')})`,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {[2, 6, 10, 14].map((x, i) => {
          const h = [6, 12, 9, 4][i];
          return (
            <rect
              key={x}
              x={x - 1}
              y={(16 - h) / 2}
              width="2"
              height={h}
              rx="1"
              fill="#fff"
              opacity={0.95}
            />
          );
        })}
      </svg>
    </span>
  );
}
