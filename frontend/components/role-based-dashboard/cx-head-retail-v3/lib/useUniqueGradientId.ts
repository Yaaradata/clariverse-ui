// lib/useUniqueGradientId.ts
// -----------------------------------------------------------------------------
// Every recharts/SVG gradient needs a DOM-unique id. When a chart component is
// repeated (three exec tiles, a rail of cards), reusing one literal id makes the
// browser bind every fill to the first <defs> it finds — sparklines and gauges
// then render with the wrong (or no) fill. This hook hands each instance its own
// stable id for the life of the component.
//
// Usage:
//   const gid = useUniqueGradientId('spark');   // -> "lisn-spark-7"
//   <linearGradient id={gid} .../>  ...  fill={`url(#${gid})`}
// -----------------------------------------------------------------------------

import { useId } from 'react';

export function useUniqueGradientId(prefix = 'grad'): string {
  // React.useId() is globally unique and SSR-stable; we sanitise the ':' chars
  // React adds so the result is a valid SVG/CSS id and url(#...) reference.
  const raw = useId().replace(/:/g, '');
  return `lisn-${prefix}-${raw}`;
}
