"use client";

type SeverityClass = "S1" | "S2" | "S3" | "S4";

type SeverityChipProps = {
  cls: SeverityClass;
  word?: string;
  compact?: boolean;
};

const SEVERITY_CONFIG = {
  S1: {
    word: "Life-safety / regulatory",
    glyph: "◆",
    bg: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.6)",
    text: "#f87171",
  },
  S2: {
    word: "Material impact",
    glyph: "▲",
    bg: "rgba(245, 158, 11, 0.15)",
    border: "rgba(245, 158, 11, 0.5)",
    text: "#fbbf24",
  },
  S3: {
    word: "Operational",
    glyph: "●",
    bg: "rgba(148, 163, 184, 0.15)",
    border: "rgba(148, 163, 184, 0.4)",
    text: "#cbd5e1",
  },
  S4: {
    word: "Efficiency",
    glyph: "―",
    bg: "rgba(115, 115, 115, 0.15)",
    border: "rgba(115, 115, 115, 0.4)",
    text: "#d4d4d8",
  },
};

export function SeverityChip({ cls, word, compact }: SeverityChipProps) {
  const config = SEVERITY_CONFIG[cls];
  const displayWord = word || config.word;

  if (compact) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 8px",
          borderRadius: 999,
          background: config.bg,
          border: `1px solid ${config.border}`,
          fontSize: 13,
          fontWeight: 700,
          color: config.text,
        }}
        title={displayWord}
      >
        {cls} {config.glyph}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        background: config.bg,
        border: `1px solid ${config.border}`,
        fontSize: 13,
        fontWeight: 700,
        color: config.text,
      }}
    >
      {config.glyph} {cls} · {displayWord}
    </span>
  );
}
