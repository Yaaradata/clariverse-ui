import React from "react";

import { DETAIL_GAP, PROFITABILITY_ROW_BOTTOM, PROFITABILITY_ROW_MID, PROFITABILITY_ROW_TOP } from "./detailLayout";

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

export function ProfitabilityLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const items = React.Children.toArray(children);
  const cell = (index: number) => items[index] ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: DETAIL_GAP }}>
      <DetailGrid columns={PROFITABILITY_ROW_TOP} align="stretch">
        {cell(0)}
        {cell(1)}
      </DetailGrid>
      <DetailGrid columns={PROFITABILITY_ROW_MID} align="stretch">
        {cell(2)}
        {cell(3)}
      </DetailGrid>
      <DetailGrid columns={PROFITABILITY_ROW_BOTTOM} align="stretch">
        {cell(4)}
        {cell(5)}
      </DetailGrid>
    </div>
  );
}
