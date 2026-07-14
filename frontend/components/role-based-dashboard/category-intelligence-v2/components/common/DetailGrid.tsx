import React from "react";

import { cssVar, type } from "../../theme/tokens";
import { DETAIL_GAP, PROFITABILITY_ROW_BOTTOM, PROFITABILITY_ROW_MID } from "./detailLayout";

export function DetailGrid({
  columns,
  children,
  align = "stretch",
}: {
  columns: string;
  children: React.ReactNode;
  align?: "stretch" | "start";
}): React.ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        gap: DETAIL_GAP,
        alignItems: align,
      }}
    >
      {children}
    </div>
  );
}

export function DetailStack({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: DETAIL_GAP,
        minHeight: 0,
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

/** CX-retail style numbered section — narrative spine for drill screens. */
export function DashboardSection({
  n,
  title,
  sub,
  first = false,
  trailing,
  children,
}: {
  n: string;
  title: string;
  sub?: string;
  first?: boolean;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        paddingTop: first ? 0 : 8,
        borderTop: first ? undefined : `1px solid ${cssVar("border")}`,
        marginTop: first ? 0 : 8,
      }}
    >
      <div style={{ minWidth: 0, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <span
            className="lisn-num"
            style={{
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              fontSize: 15,
              fontWeight: 800,
              color: cssVar("accent-2"),
              borderRadius: 10,
              border: `2px solid ${cssVar("accent")}`,
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            {n}
          </span>
          <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: cssVar("text-primary"),
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h2>
            {trailing ? <div style={{ marginLeft: "auto", flexShrink: 0 }}>{trailing}</div> : null}
          </div>
        </div>
        {sub ? (
          <p
            style={{
              margin: "6px 0 0 52px",
              fontSize: type.scale.body,
              color: cssVar("text-secondary"),
              lineHeight: 1.45,
            }}
          >
            {sub}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function ProfitabilityLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const items = React.Children.toArray(children);
  const cell = (index: number) => items[index] ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: DETAIL_GAP }}>
      <div style={{ minWidth: 0 }}>{cell(0)}</div>
      <DetailGrid columns={PROFITABILITY_ROW_MID} align="stretch">
        {cell(1)}
        {cell(2)}
      </DetailGrid>
      <DetailGrid columns={PROFITABILITY_ROW_BOTTOM} align="stretch">
        {cell(3)}
        {cell(4)}
      </DetailGrid>
      <div style={{ minWidth: 0 }}>{cell(5)}</div>
    </div>
  );
}
