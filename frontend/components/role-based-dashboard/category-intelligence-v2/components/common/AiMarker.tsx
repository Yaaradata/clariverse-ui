import React from "react";

import { cssVar } from "../../theme/tokens";

export function AiMarker({ size = 12 }: { size?: number }): React.ReactElement {
  return (
    <span
      aria-hidden
      style={{ color: cssVar("accent"), fontSize: size, fontWeight: 700, lineHeight: 1 }}
    >
      ✦
    </span>
  );
}
