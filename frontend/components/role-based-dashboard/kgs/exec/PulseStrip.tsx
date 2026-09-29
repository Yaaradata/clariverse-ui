"use client";

import Link from "next/link";
import { useLabel } from "../shell/DemoProvider";

type PulseCard = {
  n: number;
  title: string;
  text: string;
  chips: string[];
  chipAfterApprove?: string;
  linkTo: string;
};

type PulseStripProps = {
  cards: PulseCard[];
  isApproved?: boolean;
};

export function PulseStrip({ cards, isApproved }: PulseStripProps) {
  const L = useLabel();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 32,
      }}
    >
      {cards.map((card) => {
        // For card 1, show chipAfterApprove if approved
        const displayChips = card.n === 1 && isApproved && card.chipAfterApprove
          ? [card.chips[0], card.chips[1], card.chipAfterApprove]
          : card.chips;

        return (
          <Link
            key={card.n}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "#3f3f46";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#1f1f1f";
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>
              {card.n}. {card.title}
            </div>
            <div style={{ fontSize: 13, color: "#e8e9e9", lineHeight: 1.5, flex: 1 }}>
              {L(card.text)}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {displayChips.map((chip, chipIdx) => {
                // Determine chip styling
                const isGreen = chip.includes("approved") || chip.includes("Investigation approved");
                const isAmber = chip.includes("Awaiting") || chip.includes("triage");
                const isNeutral = chip === "—" || chip.includes("No action");

                return (
                  <span
                    key={chipIdx}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: 6,
                      background: isGreen
                        ? "rgba(34, 197, 94, 0.15)"
                        : isAmber
                          ? "rgba(245, 158, 11, 0.15)"
                          : "#2a2a2a",
                      color: isGreen ? "#4ade80" : isAmber ? "#fbbf24" : "#a3a3a3",
                      border: `1px solid ${
                        isGreen
                          ? "rgba(34, 197, 94, 0.5)"
                          : isAmber
                            ? "rgba(245, 158, 11, 0.5)"
                            : "#2a2a2a"
                      }`,
                    }}
                  >
                    {L(chip)}
                  </span>
                );
              })}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
