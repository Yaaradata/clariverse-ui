"use client";

import React from "react";
import {
  CATEGORY_PNL_ROWS,
  GMV_CONVENTION_TOOLTIP,
} from "../../lib/cxHeadRetailV3MarginBridgeData";
import { cssVar, radius, space, type } from "../../theme/tokens";

/** Category P&L strip — GMV · AOV · ASP · take-rate · CM ladder · GMROI · sell-through. */
export function CategoryPnlStrip(): React.ReactElement {
  return (
    <section
      style={{
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        overflow: "hidden",
      }}
      aria-label="Category P and L strip"
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          padding: `${space["4"]} ${space["4"]} ${space["3"]}`,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: cssVar("text-primary") }}>
            Category P&L strip
          </h3>
          <p style={{ margin: `${space["1"]} 0 0`, fontSize: 12, color: cssVar("text-muted"), lineHeight: 1.4 }}>
            GMV · AOV · ASP · take-rate · CM1–CM3 · GMROI · sell-through
          </p>
        </div>
        <span
          title={GMV_CONVENTION_TOOLTIP}
          style={{
            flexShrink: 0,
            maxWidth: 360,
            fontSize: 11,
            color: cssVar("text-secondary"),
            lineHeight: 1.35,
            padding: "6px 10px",
            borderRadius: radius.md,
            background: cssVar("surface-raised"),
            border: `1px dashed ${cssVar("border")}`,
            cursor: "help",
          }}
        >
          <strong style={{ color: cssVar("text-primary") }}>GMV convention:</strong> GST / discounts / returns
          inclusion varies by feed — hover for detail.
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: type.scale.caption,
            minWidth: 880,
          }}
        >
          <thead>
            <tr style={{ borderTop: `1px solid ${cssVar("border")}`, borderBottom: `1px solid ${cssVar("border")}` }}>
              {(
                [
                  "Category",
                  "GMV",
                  "AOV",
                  "ASP",
                  "Take-rate",
                  "CM1",
                  "CM2",
                  "CM3",
                  "GMROI",
                  "Sell-through",
                  "Returns",
                ] as const
              ).map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: h === "Category" ? "left" : "right",
                    padding: "8px 12px",
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    textTransform: "uppercase",
                    color: cssVar("text-muted"),
                    whiteSpace: "nowrap",
                  }}
                  title={h === "GMV" ? GMV_CONVENTION_TOOLTIP : undefined}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORY_PNL_ROWS.map((row) => (
              <tr key={row.id} style={{ borderBottom: `1px solid ${cssVar("border")}` }}>
                <td style={{ padding: "10px 12px", fontWeight: 700, color: cssVar("text-primary") }}>{row.category}</td>
                <td
                  className="lisn-num"
                  style={{ padding: "10px 12px", textAlign: "right", color: cssVar("text-primary"), fontWeight: 700 }}
                  title={GMV_CONVENTION_TOOLTIP}
                >
                  {row.gmvInr}
                </td>
                <td className="lisn-num" style={{ padding: "10px 12px", textAlign: "right", color: cssVar("text-secondary") }}>
                  {row.aovInr}
                </td>
                <td className="lisn-num" style={{ padding: "10px 12px", textAlign: "right", color: cssVar("text-secondary") }}>
                  {row.aspInr}
                </td>
                <td className="lisn-num" style={{ padding: "10px 12px", textAlign: "right", color: cssVar("text-primary") }}>
                  {row.takeRatePct.toFixed(1)}%
                </td>
                <td className="lisn-num" style={{ padding: "10px 12px", textAlign: "right", color: cssVar("text-primary") }}>
                  {row.cm1Pct.toFixed(1)}%
                </td>
                <td className="lisn-num" style={{ padding: "10px 12px", textAlign: "right", color: cssVar("text-primary") }}>
                  {row.cm2Pct.toFixed(1)}%
                </td>
                <td className="lisn-num" style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: cssVar("accent-2") }}>
                  {row.cm3Pct.toFixed(1)}%
                </td>
                <td className="lisn-num" style={{ padding: "10px 12px", textAlign: "right", color: cssVar("text-primary") }}>
                  {row.gmroi.toFixed(1)}×
                </td>
                <td className="lisn-num" style={{ padding: "10px 12px", textAlign: "right", color: cssVar("text-secondary") }}>
                  {row.sellThroughPct}%
                </td>
                <td
                  className="lisn-num"
                  style={{
                    padding: "10px 12px",
                    textAlign: "right",
                    fontWeight: 700,
                    color: row.returnsRatePct > 20 ? cssVar("severity-high") : cssVar("text-secondary"),
                  }}
                >
                  {row.returnsRatePct.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
