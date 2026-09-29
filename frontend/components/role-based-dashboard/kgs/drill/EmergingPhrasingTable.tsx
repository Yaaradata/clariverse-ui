"use client";

import { installedBase } from "@kgs/lib/data";
import type { EmergingPhrasingRow, VerdictTone } from "@kgs/types";
import { useKgsNav } from "../nav";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { Panel } from "./Panel";

const P = installedBase.panelCopy["P-E"];
const FIGURE_COLS = new Set([2, 3]);
/** First five cells only — legacy status in cells[5] is kept in data, not shown. */
const DATA_COLS = 5;

const VERDICT_COLOUR: Record<VerdictTone, string> = {
  red: K.red,
  orange: K.orange,
  amber: K.amber,
  grey: K.textMut,
};

/**
 * P-E (04 §3.7): one fault phrased many ways, counted once. LiSN verdict = signal name +
 * plain-English status pill (never SIGNAL # / WATCH · codes).
 */
export function EmergingPhrasingTable() {
  const L = useLabel();
  const { go } = useKgsNav();
  const columns = P.columns ?? [];
  const rows = installedBase.emergingPhrasing;

  return (
    <Panel title={L(P.title)} sub={L(P.sub ?? "")} right={L(P.right ?? "")}>
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
          <caption
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            {L(P.title)}
          </caption>
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  style={{
                    textAlign: FIGURE_COLS.has(i) ? "right" : "left",
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
            {rows.map((row, ri) => (
              <VerdictRow
                key={row.id ?? ri}
                row={row}
                columns={columns}
                last={ri === rows.length - 1}
                onOpen={row.linkTo ? () => go(row.linkTo as string) : undefined}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function VerdictRow({
  row,
  columns,
  last,
  onOpen,
}: {
  row: EmergingPhrasingRow;
  columns: string[];
  last: boolean;
  onOpen?: () => void;
}) {
  const L = useLabel();
  const pill = VERDICT_COLOUR[row.verdictTone];
  const ignored = row.verdictTone === "grey";
  const active = row.verdictTone === "red";
  const dim = ignored ? 0.6 : 1;
  const border = last ? undefined : `1px solid ${K.border}`;

  return (
    <tr
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={
        onOpen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen();
              }
            }
          : undefined
      }
      className={onOpen ? "kgs-focus kgs-row" : undefined}
      style={{
        cursor: onOpen ? "pointer" : undefined,
        opacity: dim,
        boxShadow: active ? `inset 3px 0 0 ${K.red}` : undefined,
      }}
    >
      {row.cells.slice(0, DATA_COLS).map((cell, ci) => {
        const figure = FIGURE_COLS.has(ci);
        const col = columns[ci] ?? `c${ci}`;
        return (
          <td
            key={col}
            style={{
              padding: "10px 12px",
              borderBottom: border,
              textAlign: figure ? "right" : "left",
              fontFamily: figure ? K.mono : undefined,
              fontVariantNumeric: "tabular-nums",
              fontWeight: ci === 0 ? 700 : 400,
              color: ci === 0 ? K.text : K.body,
              lineHeight: 1.4,
            }}
          >
            {L(cell)}
          </td>
        );
      })}
      <td
        style={{
          padding: "10px 12px",
          borderBottom: border,
          verticalAlign: "middle",
          minWidth: 180,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: K.text,
              lineHeight: 1.3,
            }}
          >
            {L(row.verdictName)}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: K.radius.pill,
              border: `1px solid ${withAlpha(pill, 0.5)}`,
              background: withAlpha(pill, 0.12),
              color: pill,
              lineHeight: 1.3,
              whiteSpace: "normal",
            }}
          >
            {L(row.verdictStatus)}
          </span>
        </div>
      </td>
    </tr>
  );
}
