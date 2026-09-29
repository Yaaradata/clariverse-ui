"use client";

import Link from "next/link";

type PulseCard = {
  title: string;
  body: string;
  chips: Array<{ type: string; text: string; color?: string }>;
  linkTo: string;
};

type PulseStripProps = {
  cards: PulseCard[];
};

export function PulseStrip({ cards }: PulseStripProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 32,
      }}
    >
      {cards.map((card, idx) => (
        <Link
          key={idx}
          href={card.linkTo}
          style={{
            textDecoration: "none",
            background: "#151515",
            border: "1px solid #1f1f1f",
            borderRadius: 12,
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            transition: "transform 0.15s, border-color 0.15s",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>
            {card.title}
          </div>
          <div style={{ fontSize: 13, color: "#e8e9e9", lineHeight: 1.5, flex: 1 }}>
            {card.body}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {card.chips.map((chip, chipIdx) => (
              <span
                key={chipIdx}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: chip.color ? `${chip.color}20` : "#2a2a2a",
                  color: chip.color || "#a3a3a3",
                  border: `1px solid ${chip.color ? `${chip.color}50` : "#2a2a2a"}`,
                }}
              >
                {chip.text}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
