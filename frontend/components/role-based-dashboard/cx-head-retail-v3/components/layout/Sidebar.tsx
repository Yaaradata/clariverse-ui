// components/layout/Sidebar.tsx
// Pass 1 — collapsible rail (hover-expand, HeadOfCreditCards pattern).
// Five locked routes; change-role exit.

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SCREENS } from '../../lib/routes';
import { useNavigation } from '../../lib/NavigationContext';
import { useDashboardShell } from '../../lib/DashboardShellContext';
import { cssVar, layout, radius, type } from '../../theme/tokens';

interface SidebarProps {
  expanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function Sidebar({
  expanded,
  onMouseEnter,
  onMouseLeave,
}: SidebarProps): React.ReactElement {
  const { activeScreen, navigate } = useNavigation();
  const { onExit } = useDashboardShell();

  const width = expanded ? layout.sidebarWidth : layout.sidebarCollapsedWidth;

  return (
    <nav
      aria-label="Screens"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width,
        minWidth: width,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: cssVar('surface-raised'),
        borderRight: `1px solid ${cssVar('border')}`,
        transition: 'width 0.22s ease, min-width 0.22s ease',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: expanded ? '18px 16px' : '14px 10px',
          borderBottom: `1px solid ${cssVar('border')}`,
          textAlign: expanded ? 'left' : 'center',
        }}
      >
        {expanded ? (
          <>
            <div
              style={{
                fontSize: 12,
                fontWeight: type.weight.bold,
                color: cssVar('accent'),
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              LiSN
            </div>
            <div style={{ fontSize: 13, color: cssVar('text-secondary'), marginTop: 2 }}>Fluid CX</div>
          </>
        ) : (
          <div
            style={{
              width: 36,
              height: 36,
              margin: '0 auto',
              borderRadius: 10,
              background: cssVar('accent-soft'),
              border: `1px solid ${cssVar('accent')}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: type.weight.bold,
              color: cssVar('accent'),
            }}
            title="LiSN · Fluid CX"
          >
            L
          </div>
        )}
      </div>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: expanded ? '10px 12px' : '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {SCREENS.map((screen) => {
          const Icon = screen.icon;
          const active = screen.id === activeScreen;
          return (
            <li key={screen.id}>
              <button
                type="button"
                onClick={() => navigate(screen.id)}
                title={expanded ? undefined : screen.label}
                aria-current={active ? 'page' : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: expanded ? 10 : 0,
                  justifyContent: expanded ? 'flex-start' : 'center',
                  padding: expanded ? '8px 10px' : '10px 8px',
                  borderRadius: radius.md,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: type.scale.body,
                  fontWeight: active ? type.weight.semibold : type.weight.medium,
                  color: active ? cssVar('text-primary') : cssVar('text-secondary'),
                  background: active ? cssVar('accent-soft') : 'transparent',
                  border: 'none',
                  borderLeft: active ? `3px solid ${cssVar('accent')}` : '3px solid transparent',
                }}
              >
                <Icon
                  size={16}
                  style={{
                    color: active ? cssVar('accent') : cssVar('text-muted'),
                    flexShrink: 0,
                  }}
                />
                {expanded && <span style={{ whiteSpace: 'nowrap' }}>{screen.label}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div style={{ padding: expanded ? '10px 12px' : '10px 8px', borderTop: `1px solid ${cssVar('border')}` }}>
        <button
          type="button"
          onClick={onExit}
          style={{
            width: '100%',
            border: `1px solid ${cssVar('border')}`,
            borderRadius: radius.sm,
            background: cssVar('surface'),
            color: cssVar('text-secondary'),
            padding: expanded ? '8px 14px' : '10px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: expanded ? 6 : 0,
            cursor: 'pointer',
            fontSize: type.scale.small,
          }}
        >
          <ArrowLeft size={14} />
          {expanded && 'Change role'}
        </button>
      </div>
    </nav>
  );
}
