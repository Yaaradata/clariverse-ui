"use client";

/**
 * Ask LisN answer matching and the answer body (re-bound from oct13). Answers come only from the answer bank
 * (data/out/natwest_pulse/ask.json), precomputed for the selected window and brand. No model call.
 */

import type { AskQA } from "@/lib/natwest-pulse/nw";
import { C, MONO } from "./primitives";

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);

/** The suggested question closest to what was typed, if any shares two or more words with it. */
export function closest(q: string, qs: AskQA[]): AskQA | null {
  const t = new Set(words(q));
  let best: AskQA | null = null;
  let score = 1;
  for (const x of qs) {
    const n = words(x.q).filter((w) => t.has(w)).length;
    if (n > score) {
      score = n;
      best = x;
    }
  }
  return best;
}

export function AnswerBody({ a }: { a: AskQA }) {
  return (
    <>
      <div
        style={{
          fontSize: 14.5,
          lineHeight: 1.55,
          color: C.text,
          whiteSpace: "pre-line",
        }}
      >
        {a.answer}
      </div>
      {a.table?.rows.length ? (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                {a.table.head.map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i ? "right" : "left",
                      color: C.textMut,
                      fontWeight: 700,
                      fontSize: 12,
                      padding: "4px 8px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.table.rows.map((r) => (
                <tr key={r.join("|")}>
                  {r.map((cell, i) => (
                    <td
                      key={`${a.table?.head[i]}`}
                      style={{
                        textAlign: i ? "right" : "left",
                        fontFamily:
                          i && /^[\d−+—]/.test(cell) ? MONO : undefined,
                        padding: "5px 8px",
                        borderBottom: `1px solid ${C.border}`,
                        color: C.textSec,
                        verticalAlign: "top",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
