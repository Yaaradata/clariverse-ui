// components/layout/Sidebar.tsx
// -----------------------------------------------------------------------------
// Collapsible left rail. Renders the five locked screens straight from SCREENS
// so there is one source of truth for navigation. Collapsed state is in-memory
// (no storage). Active item uses the accent wash; collapsed mode shows icon +
// tooltip via native title.
// -----------------------------------------------------------------------------

import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { SCREENS } from '../../lib/routes';
import { useNavigation } from '../../lib/NavigationContext';
import { cssVar, layout, radius, type } from '../../theme/tokens';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
}: SidebarProps): React.ReactElement {
  const { activeScreen, navigate } = useNavigation();

  return (
    <nav
      aria-label="Screens"
      style={{
        width: collapsed ? layout.sidebarCollapsedWidth : layout.sidebarWidth,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: cssVar('surface'),
        borderRight: `1px solid ${cssVar('border')}`,
        transition: 'width 180ms ease',
        overflow: 'hidden',
      }}
    >
      {/* collapse control */}
      <div
        style={{
          height: layout.headerHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-end',
          padding: collapsed ? 0 : '0 12px',
          borderBottom: `1px solid ${cssVar('border')}`,
        }}
      >
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: radius.sm,
            cursor: 'pointer',
            color: cssVar('text-muted'),
            background: 'transparent',
            border: 'none',
          }}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* screen list */}
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: collapsed ? '10px 8px' : '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
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
                title={collapsed ? screen.label : undefined}
                aria-current={active ? 'page' : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '10px 0' : '9px 11px',
                  borderRadius: radius.md,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: type.scale.body,
                  fontWeight: active ? type.weight.semibold : type.weight.medium,
                  color: active ? cssVar('text-primary') : cssVar('text-secondary'),
                  background: active ? cssVar('accent-soft') : 'transparent',
                  border: `1px solid ${active ? cssVar('accent-soft') : 'transparent'}`,
                  position: 'relative',
                }}
              >
                {/* active accent bar */}
                {active && !collapsed && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: -1,
                      top: 8,
                      bottom: 8,
                      width: 3,
                      borderRadius: 3,
                      background: cssVar('accent'),
                    }}
                  />
                )}
                <Icon
                  size={18}
                  style={{
                    color: active ? cssVar('accent') : cssVar('text-muted'),
                    flexShrink: 0,
                  }}
                />
                {!collapsed && (
                  <span style={{ whiteSpace: 'nowrap' }}>{screen.label}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div style={{ flex: 1 }} />

      {/* footer wedge note (kept quiet) */}
      {!collapsed && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px solid ${cssVar('border')}`,
            fontSize: type.scale.caption,
            lineHeight: type.leading.snug,
            color: cssVar('text-muted'),
          }}
        >
          Runs on the interaction corpus today. The transaction join lights up the
          rupee figures.
        </div>
      )}
    </nav>
  );
}
