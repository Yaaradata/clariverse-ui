// components/common/Sparkle.tsx
// -----------------------------------------------------------------------------
// The AI marker. Governance: every AI-generated element (insight, verdict,
// drafted action, composite score) MUST carry this. It is a primitive only —
// Pass 1 renders no AI elements, so nothing imports it yet; later passes attach
// it to each AI surface. Two forms:
//   <Sparkle />            inline glyph next to AI text
//   <Sparkle label="AI" /> a small pill for card corners
// -----------------------------------------------------------------------------

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cssVar, radius } from '../../theme/tokens';

interface SparkleProps {
  /** When set, renders as a labelled pill instead of a bare glyph. */
  label?: string;
  size?: number;
  title?: string;
  style?: React.CSSProperties;
}

export function Sparkle({
  label,
  size = 14,
  title = 'AI-generated',
  style,
}: SparkleProps): React.ReactElement {
  if (label) {
    return (
      <span
        title={title}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          borderRadius: radius.pill,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.2,
          color: cssVar('accent-2'),
          background: cssVar('accent-soft'),
          border: `1px solid ${cssVar('accent-soft')}`,
          ...style,
        }}
      >
        <Sparkles size={size} aria-hidden />
        {label}
      </span>
    );
  }
  return (
    <span
      title={title}
      style={{ display: 'inline-flex', flexShrink: 0 }}
    >
      <Sparkles
        size={size}
        aria-label={title}
        style={{ color: cssVar('accent-2'), ...style }}
      />
    </span>
  );
}
