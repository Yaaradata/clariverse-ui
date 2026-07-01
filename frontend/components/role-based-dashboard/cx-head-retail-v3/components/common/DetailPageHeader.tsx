"use client";

import React from "react";

import { space } from "../../theme/tokens";

export function DetailPageHeader({
  headline,
  headerEnd,
}: {
  headline: React.ReactNode;
  /** Optional badge or meta aligned top-right (e.g. time compare, phase tag). */
  headerEnd?: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: space["4"],
        width: "100%",
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>{headline}</div>
      {headerEnd ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: space["2"],
            flexShrink: 0,
          }}
        >
          {headerEnd}
        </div>
      ) : null}
    </div>
  );
}
