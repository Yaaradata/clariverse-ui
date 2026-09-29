"use client";

import type { TableRow } from "@kgs/types";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { DrillChip, TONE_COLOR } from "./Chips";

/**
 * SegmentTable (03 §3C): #151515 container, caps header, 40px rows, #1f1f1f dividers. Cell
 * colour comes from the row's `tone`; `chipColumn` renders that column as a status chip.
 * Rows with `linkTo` (or all rows when `onSelect` is set) are buttons; `selectedId` is outlined.
 */
export function SegmentTable({
  columns,
  rows,
  chipColumn,
  monoFrom = 1,
  figures,
  onRow,
  selectedId,
  caption,
}: {
  columns: string[];
  rows: TableRow[];
  chipColumn?: number;
  /** Columns from this index on are figures (mono, tabular). */
  monoFrom?: number;
  /** Explicit figure columns; overrides `monoFrom`. */
  figures?: number[];
  onRow?: (row: TableRow) => void;
  selectedId?: string;
  caption?: string;
}) {
  const L = useLabel();
  const isFigure = (i: number) =>
    i !== chipColumn && (figures ? figures.includes(i) : i >= monoFrom);
  return (
    <div
      style={{
        background: K.surface,
        borderRadius: K.radius.tile,
        border: `1px solid ${K.border}`,
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          color: K.body,
        }}
      >
        {caption ? (
          <caption
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={c}
                scope="col"
                style={{
                  textAlign: i > 0 && isFigure(i) ? "right" : "left",
                  padding: "10px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: K.textMut,
                  borderBottom: `1px solid ${K.border}`,
                  verticalAlign: "bottom",
                }}
              >
                {L(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const clickable = Boolean(onRow && row.linkTo);
            const selected = selectedId !== undefined && row.id === selectedId;
            return (
              <tr
                key={row.id ?? ri}
                tabIndex={clickable ? 0 : undefined}
                onClick={clickable ? () => onRow?.(row) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRow?.(row);
                        }
                      }
                    : undefined
                }
                className={clickable ? "kgs-focus kgs-row" : undefined}
                style={{
                  cursor: clickable ? "pointer" : undefined,
                  background: selected
                    ? withAlpha(K.violet400, 0.08)
                    : undefined,
                  outline: selected
                    ? `1px solid ${withAlpha(K.violet400, 0.5)}`
                    : undefined,
                  outlineOffset: -1,
                }}
              >
                {row.cells.map((cell, ci) => {
                  const tone = row.tone?.[ci] ?? null;
                  const figure = ci > 0 && isFigure(ci);
                  return (
                    <td
                      key={columns[ci] ?? ci}
                      style={{
                        padding: "10px 12px",
                        borderBottom:
                          ri < rows.length - 1
                            ? `1px solid ${K.border}`
                            : undefined,
                        textAlign: figure ? "right" : "left",
                        fontFamily: figure ? K.mono : undefined,
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: ci === 0 ? 700 : 400,
                        color:
                          ci === 0
                            ? K.text
                            : tone && ci !== chipColumn
                              ? TONE_COLOR[tone]
                              : K.body,
                        lineHeight: 1.4,
                        minHeight: 40,
                      }}
                    >
                      {ci === chipColumn ? (
                        <DrillChip text={L(cell)} tone={tone} wrap />
                      ) : (
                        L(cell)
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
