"use client";

type Domain = "Quality" | "Channel" | "Separation" | "Supply" | "Safety/Cyber";

type DomainChipProps = {
  domain: Domain;
};

const DOMAIN_CONFIG = {
  Quality: { color: "#f97316", label: "Quality" },
  Channel: { color: "#14b8a6", label: "Channel" },
  Separation: { color: "#0ea5e9", label: "Separation" },
  Supply: { color: "#a78bfa", label: "Supply" },
  "Safety/Cyber": { color: "#f87171", label: "Safety/Cyber" },
};

export function DomainChip({ domain }: DomainChipProps) {
  const config = DOMAIN_CONFIG[domain];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        background: "transparent",
        border: "1px solid #3f3f46",
        fontSize: 13,
        fontWeight: 600,
        color: "#d4d4d8",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: config.color,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}
