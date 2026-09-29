"use client";

type SuppressedEndCardProps = {
  title: string;
  rows: Array<{ label: string; count: number }>;
  footer: string;
};

export function SuppressedEndCard({ title, rows, footer }: SuppressedEndCardProps) {
  return (
    <div
      style={{
        minWidth: 240,
        flex: "1 1 0",
        background: "#0d0d0d",
        border: "1px solid #2a2a2a",
        borderRadius: 16,
        padding: "18px 16px 16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#a3a3a3",
          lineHeight: 1.2,
          marginBottom: 16,
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, flex: 1 }}>
        {rows.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <span style={{ color: "#d4d4d8", flex: 1 }}>{row.label}</span>
            <span
              style={{
                fontFamily: "var(--mono, monospace)",
                fontWeight: 700,
                color: "#a3a3a3",
                fontSize: 14,
              }}
            >
              {row.count}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 13,
          color: "#737373",
          fontStyle: "italic",
          lineHeight: 1.5,
        }}
      >
        {footer}
      </div>
    </div>
  );
}
