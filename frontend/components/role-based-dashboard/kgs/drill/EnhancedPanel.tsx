"use client";

import type { EnhancedPanel as EnhancedPanelData } from "@kgs/types";
import type { ReactNode } from "react";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { JoinTagRow } from "../shared/JoinTagRow";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { AgedCaseWatchlist } from "./AgedCaseWatchlist";
import { Panel } from "./Panel";
import { StuckDriverBars } from "./StuckDriverBars";

const BADGE_BG = "#2b2412";

/**
 * EnhancedPanel (03 §3C fork of the bank "card-system enhanced" panel): interactions joined to
 * operational data — badge, join tags, violet source line, right meta, stat strip, driver bars
 * and the watchlist. `children` renders under it (the DiagnosisBox).
 */
export function EnhancedPanel({
  data,
  id,
  children,
}: {
  data: EnhancedPanelData;
  id?: string;
  children?: ReactNode;
}) {
  const L = useLabel();
  return (
    <Panel
      id={id}
      title={
        <span
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 10,
          }}
        >
          {L(data.title)}
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: K.radius.pill,
              background: BADGE_BG,
              color: K.amber2,
            }}
          >
            {L(data.badge)}
          </span>
        </span>
      }
      sub={
        <span style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.joinTags?.length ? <JoinTagRow tags={data.joinTags} /> : null}
          <span style={{ color: K.violet300 }}>{L(data.violetLine)}</span>
        </span>
      }
      right={
        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {data.right.map((r) => (
            <span key={r}>{L(r)}</span>
          ))}
        </span>
      }
    >
      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${data.stats.length}, minmax(0, 1fr))`,
          gap: 8,
        }}
      >
        {data.stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: K.surface,
              border: `1px solid ${K.border}`,
              borderRadius: K.radius.tile,
              padding: "10px 12px",
            }}
          >
            <dt style={{ fontSize: 12, color: K.textMut }}>{L(s.label)}</dt>
            <dd
              style={{
                margin: "4px 0 0",
                fontSize: 18,
                fontWeight: 800,
                color: K.text,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {L(s.value)}
              {s.money ? <IllustrativeChip /> : null}
            </dd>
          </div>
        ))}
      </dl>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
          gap: 20,
          alignItems: "start",
        }}
      >
        <StuckDriverBars title={data.driversTitle} drivers={data.drivers} />
        <AgedCaseWatchlist title={data.watchlistTitle} items={data.watchlist} />
      </div>
      {children}
    </Panel>
  );
}
