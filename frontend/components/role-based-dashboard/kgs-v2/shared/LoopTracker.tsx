"use client";

import type { LoopStatus } from "@kgs2/types";
import { K, withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";

const STEPS: Array<{
  key: LoopStatus["step"];
  label: string;
}> = [
  { key: "open", label: "Open" },
  { key: "approved", label: "Action approved" },
  { key: "watching", label: "Watching" },
  { key: "closed", label: "Closed" },
];

const ORDER: LoopStatus["step"][] = [
  "open",
  "approved",
  "watching",
  "closed",
];

export function LoopTracker({
  status,
  watchingNote = "next check 2 Oct: promise kept North",
}: {
  status: LoopStatus;
  watchingNote?: string;
}) {
  const activeIdx = ORDER.indexOf(status.step);

  return (
    <section
      aria-label="Loop tracker"
      style={{
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: K.textMut,
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        Loop tracker
      </div>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {STEPS.map((s, i) => {
          const done = i <= activeIdx;
          const current = i === activeIdx;
          return (
            <li
              key={s.key}
              style={{
                flex: "1 1 120px",
                minWidth: 100,
                borderRadius: 10,
                border: `1px solid ${
                  current
                    ? withAlpha(K.violet400, 0.55)
                    : done
                      ? withAlpha(K.green, 0.4)
                      : K.borderLight
                }`,
                background: current
                  ? withAlpha(K.violet400, 0.12)
                  : done
                    ? withAlpha(K.green, 0.08)
                    : K.surface,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: K.textMut,
                  marginBottom: 4,
                }}
              >
                Step {i + 1}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: current ? K.violet300 : done ? K.green : K.textSec,
                }}
              >
                {s.label}
              </div>
              {s.key === "watching" && current ? (
                <div
                  style={{
                    fontSize: 11,
                    color: K.textMut,
                    marginTop: 6,
                    lineHeight: 1.4,
                  }}
                >
                  {watchingNote}
                </div>
              ) : null}
              {s.key === "closed" ? (
                <div
                  style={{
                    fontSize: 11,
                    color: K.textMut,
                    marginTop: 6,
                  }}
                >
                  Owner confirms
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {status.approvedAt ? (
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: K.textMut,
          }}
        >
          Approved {status.approvedAt}
          {status.approvedBy ? ` · ${status.approvedBy}` : ""}
        </div>
      ) : null}
    </section>
  );
}
