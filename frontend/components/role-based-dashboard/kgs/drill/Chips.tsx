"use client";

import { meta } from "@kgs/lib/data";
import type { Domain, SeverityClass } from "@kgs/types";
import { DomainChip, SeverityChip } from "../shared/SeverityChip";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";

const DOMAINS: readonly Domain[] = [
  "Quality",
  "Channel",
  "Separation",
  "Supply",
  "Safety/Cyber",
  "Enabler",
];

/** Table `tone` values (types.ts TableRow) → chip colour. */
export const TONE_COLOR: Record<string, string> = {
  amber: K.amber,
  orange: K.orange,
  green: K.green,
  yellow: K.yellow300,
  slate: K.slate,
  neutral: K.textMut,
  red: K.red400,
};

const SEVERITY = /^(S[1-4])\b\s*(?:·\s*)?(.*)$/;
const RANK = /^#\d+ of \d+$/;

function Pill({
  text,
  color,
  wrap = false,
}: {
  text: string;
  color: string;
  wrap?: boolean;
}) {
  const L = useLabel();
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 12,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: K.radius.pill,
        border: `1px solid ${withAlpha(color, 0.5)}`,
        background: withAlpha(color, 0.12),
        color,
        whiteSpace: wrap ? "normal" : "nowrap",
        lineHeight: 1.3,
      }}
    >
      {L(text)}
    </span>
  );
}

/**
 * One chip string from data, rendered by shape: "#1 of 5" → rank pill; "S2 · Quality" → severity
 * (with its word, 06 §2 #2) + domain; "S3 WATCH" → severity + status; anything else → status
 * pill in `tone` (green for Stable / Within band / Clean vs control).
 */
export function DrillChip({
  text,
  tone,
  wrap = false,
}: {
  text: string;
  tone?: string | null;
  /** Let a long status wrap (table cells). */
  wrap?: boolean;
}) {
  if (RANK.test(text)) {
    return <Pill text={text} color={K.violet400} />;
  }
  const m = SEVERITY.exec(text);
  if (m) {
    const cls = m[1] as SeverityClass;
    const rest = m[2].trim();
    const word = meta.ui.drill.severityWords[cls];
    return (
      <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 6 }}>
        <SeverityChip cls={cls} word={word} />
        {rest && rest !== word ? (
          (DOMAINS as readonly string[]).includes(rest) ? (
            <DomainChip domain={rest as Domain} />
          ) : (
            <Pill
              text={rest}
              color={TONE_COLOR[tone ?? ""] ?? K.textSec}
              wrap={wrap}
            />
          )
        ) : null}
      </span>
    );
  }
  return (
    <Pill
      text={text}
      color={TONE_COLOR[tone ?? ""] ?? (isStable(text) ? K.green : K.textSec)}
      wrap={wrap}
    />
  );
}

/** Status words that read as "nothing to escalate" (04 §3.13, §5). */
export function isStable(text: string): boolean {
  return /^(Stable|Within band|Clean vs control|Easing)/.test(text);
}
