"use client";

/**
 * NatWest Group · channel blocks (re-bound from the V3 blocks): one card per channel, the same metric set on each,
 * a one-series trend and the channel's top themes.
 */

import type { ReactNode } from "react";

import {
  type ChannelRow,
  fmtBig,
  fmtN,
  fmtP,
  type ThemeCount,
} from "@/lib/natwest-pulse/nw";
import { AreaTrend, Delta } from "./Pulse";
import { BarRow, C, MONO, Tile } from "./primitives";

export function ChannelCard({
  row,
  themes,
  showDelta,
}: {
  row: ChannelRow;
  themes: ThemeCount[];
  showDelta: boolean;
}) {
  const complaints = row.id === "complaints";
  const max = Math.max(1, ...themes.map((t) => t.negative));
  const per = row.trend.length === 13 ? "week" : "day";
  const cells: [string, string, ReactNode][] = [
    [
      "Volume",
      fmtBig(row.volume),
      showDelta ? (
        <Delta
          key="d"
          value={row.volume_change_pct}
          kind="pct"
          worseWhen="neutral"
        />
      ) : null,
    ],
    [
      complaints ? "Negative" : "Negative",
      complaints ? "All" : fmtP(row.negative_pct),
      showDelta && !complaints ? (
        <Delta key="d" value={row.negative_delta} kind="pts" />
      ) : null,
    ],
    [
      complaints ? "Back within 14 days" : "Repeat within 7 days",
      fmtP(row.repeat_pct),
      showDelta ? <Delta key="d" value={row.repeat_delta} kind="pts" /> : null,
    ],
    [
      complaints ? "Closed within 3 days" : "Resolved first time",
      fmtP(row.resolved_pct),
      showDelta ? (
        <Delta key="d" value={row.resolved_delta} kind="pts" worseWhen="down" />
      ) : null,
    ],
  ];
  return (
    <Tile
      title={row.label}
      sub={
        complaints ? "Each complaint counted once" : "Contacts in the window"
      }
      prov="internal"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {cells.map(([label, value, delta]) => (
          <div
            key={label}
            style={{
              background: C.cardAlt,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "8px 10px",
              minWidth: 0,
            }}
          >
            <div style={{ fontSize: 12, color: C.textMut }}>{label}</div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 19,
                fontWeight: 750,
                color: C.text,
              }}
            >
              {value}
            </div>
            {delta}
          </div>
        ))}
      </div>
      <AreaTrend
        data={row.trend}
        unit=""
        height={140}
        label={`${row.label} per ${per}`}
      />
      <div style={{ fontSize: 12.5, color: C.textMut }}>
        {complaints
          ? "Top themes by complaints"
          : "Top themes by negative contacts"}
      </div>
      {themes.map((t) => (
        <BarRow
          key={t.id}
          label={t.label}
          value={t.negative}
          max={max}
          right={<span style={{ fontFamily: MONO }}>{fmtN(t.negative)}</span>}
          color={C.cyan}
        />
      ))}
    </Tile>
  );
}
