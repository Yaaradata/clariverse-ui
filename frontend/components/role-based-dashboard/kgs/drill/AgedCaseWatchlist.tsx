"use client";

import type { WatchlistCard } from "@kgs/types";
import { MoneyText } from "../shared/MoneyText";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { DrillChip } from "./Chips";
import { PanelLabel } from "./Panel";

/**
 * AgedCaseWatchlist (03 §3C): one card per item on watch — severity (with its word, 06 §2 #2:
 * the word appears nowhere else on the card), age on the right, stage and blocker, tags.
 */
export function AgedCaseWatchlist({
  title,
  items,
}: {
  title: string;
  items: WatchlistCard[];
}) {
  const L = useLabel();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <PanelLabel>{L(title)}</PanelLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        {items.map((w) => (
          <article
            key={w.title}
            style={{
              background: K.surface,
              border: `1px solid ${K.border}`,
              borderRadius: K.radius.tile,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <DrillChip text={w.chip} />
              <span
                style={{
                  fontSize: 12,
                  fontFamily: K.mono,
                  color: K.textMut,
                  flexShrink: 0,
                }}
              >
                {w.age}
              </span>
            </div>
            <h4
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 800,
                color: K.text,
              }}
            >
              {L(w.title)}
            </h4>
            <div style={{ fontSize: 13, color: K.body }}>
              <MoneyText text={w.stage} />
            </div>
            <div style={{ fontSize: 13, color: K.amber2 }}>
              <MoneyText text={w.blocker} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {w.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    padding: "2px 7px",
                    borderRadius: 6,
                    border: `1px solid ${K.chipBorder}`,
                    background: K.bg,
                    color: K.body,
                  }}
                >
                  <MoneyText text={t} />
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
