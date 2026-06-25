// components/layout/Sidebar.tsx
// Pass 1 — collapsible rail (hover-expand, HeadOfCreditCards pattern).
// Five locked routes; industry + role context; change-role exit.

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
  const { onExit, industryColor } = useDashboardShell();

  const width = expanded ? layout.sidebarWidth : layout.sidebarCollapsedWidth;
  const roleLabel = 'Head of CX';

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
          padding: expanded ? '14px 16px' : '12px 8px',
          borderBottom: `1px solid ${cssVar('border')}`,
        }}
      >
        <ContextRow expanded={expanded} color={industryColor} label={roleLabel} accent />
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

function ContextRow({
  expanded,
  color,
  label,
  accent,
}: {
  expanded: boolean;
  color: string;
  label: string;
  accent?: boolean;
}): React.ReactElement {
  return (
    <div
      title={expanded ? undefined : label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: expanded ? 'flex-start' : 'center',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: `${color}25`,
          border: `1px solid ${color}60`,
          flexShrink: 0,
        }}
      />
      {expanded && (
        <span
          style={{
            fontSize: 14,
            fontWeight: type.weight.bold,
            color: accent ? cssVar('accent') : cssVar('text-primary'),
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
