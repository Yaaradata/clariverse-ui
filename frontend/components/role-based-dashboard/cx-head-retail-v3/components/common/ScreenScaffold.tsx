// components/common/ScreenScaffold.tsx
// -----------------------------------------------------------------------------
// Pass 1 screens are intentionally empty. This scaffold makes "empty" read as
// foundation-in-place rather than broken: the screen's icon, title and one-line
// purpose, plus a quiet note that the content lands in a later pass. Later passes
// replace each screen body; this scaffold stays as the page header region.
// -----------------------------------------------------------------------------

import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cssVar, radius, type, layout } from '../../theme/tokens';

interface ScreenScaffoldProps {
  icon: LucideIcon;
  title: string;
  purpose: string;
  /** When true, shows the foundation placeholder body (Pass 1 default). */
  placeholder?: boolean;
  children?: React.ReactNode;
}

export function ScreenScaffold({
  icon: Icon,
  title,
  purpose,
  placeholder = true,
  children,
}: ScreenScaffoldProps): React.ReactElement {
  return (
    <div
      className="lisn-anim-fade"
      style={{
        maxWidth: layout.contentMaxWidth,
        margin: '0 auto',
        padding: '28px 32px 48px',
      }}
    >
      {/* page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: radius.md,
            background: cssVar('accent-soft'),
            border: `1px solid ${cssVar('border')}`,
          }}
        >
          <Icon size={20} style={{ color: cssVar('accent') }} />
        </span>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: type.scale.h1,
              fontWeight: type.weight.bold,
              letterSpacing: -0.2,
              color: cssVar('text-primary'),
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: '3px 0 0',
              fontSize: type.scale.body,
              color: cssVar('text-secondary'),
            }}
          >
            {purpose}
          </p>
        </div>
      </div>

      {children}

      {placeholder && (
        <div
          style={{
            marginTop: 28,
            padding: '40px 32px',
            borderRadius: radius.lg,
            background: cssVar('surface'),
            border: `1px dashed ${cssVar('border-strong')}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: type.scale.small,
              fontWeight: type.weight.semibold,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              color: cssVar('text-muted'),
            }}
          >
            Foundation in place
          </span>
          <span
            style={{
              fontSize: type.scale.body,
              color: cssVar('text-secondary'),
              maxWidth: 460,
              lineHeight: type.leading.normal,
            }}
          >
            Theme, navigation and shell are wired. The cards, signals and drill-downs
            for this screen arrive in a later build pass.
          </span>
        </div>
      )}
    </div>
  );
}
