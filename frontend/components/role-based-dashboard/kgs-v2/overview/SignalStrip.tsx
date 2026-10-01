"use client";

import overview from "@kgs2/data/overview.json";
import { Activity } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";
import { type OverviewSignal, SignalCard } from "./SignalCard";

type FilterId = "all" | "action" | "improving";

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "action", label: "Needs action" },
  { id: "improving", label: "Improving" },
];

function matches(s: OverviewSignal, filter: FilterId): boolean {
  switch (filter) {
    case "all":
      return true;
    case "action":
      return s.severity === "S2" || s.severity === "S3";
    case "improving":
      return s.severity === "improving";
    default: {
      const _exhaustive: never = filter;
      return _exhaustive;
    }
  }
}

/**
 * This week's signals — header summary, filters, compact grid (no Sources card).
 */
export function SignalStrip() {
  const [filter, setFilter] = useState<FilterId>("all");
  const all = overview.signals as unknown as OverviewSignal[];
  const visible = useMemo(
    () => all.filter((s) => matches(s, filter)),
    [all, filter],
  );

  const counts = useMemo(() => {
    let s2 = 0;
    let s3 = 0;
    let s4 = 0;
    let improving = 0;
    for (const s of all) {
      if (s.severity === "S2") s2 += 1;
      else if (s.severity === "S3") s3 += 1;
      else if (s.severity === "S4") s4 += 1;
      else if (s.severity === "improving") improving += 1;
    }
    return { total: all.length, s2, s3, s4, improving };
  }, [all]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <style>{`
        .kgs2-signal-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          align-items: stretch;
          width: 100%;
          min-width: 0;
        }
        @media (max-width: 1439px) {
          .kgs2-signal-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        @media (max-width: 1279px) {
          .kgs2-signal-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .kgs2-signal-card .kgs2-signal-pop {
          display: none;
          position: absolute;
          left: 8px;
          right: 8px;
          bottom: calc(100% + 8px);
          z-index: 20;
          background: rgba(18, 18, 18, 0.98);
          border: 1px solid ${K.borderLight};
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 11px;
          line-height: 1.4;
          color: ${K.textSec};
          box-shadow: 0 10px 28px rgba(0,0,0,0.45);
          pointer-events: none;
          text-align: left;
        }
        .kgs2-signal-card .kgs2-signal-pop strong {
          color: ${K.textMut};
          font-weight: 600;
        }
        .kgs2-signal-card .kgs2-signal-pop > div + div {
          margin-top: 4px;
        }
        .kgs2-signal-card:hover .kgs2-signal-pop,
        .kgs2-signal-card:focus-visible .kgs2-signal-pop,
        .kgs2-signal-card:focus-within .kgs2-signal-pop {
          display: block;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: K.text,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Activity size={16} color={K.amber2} aria-hidden />
            This week&apos;s signals
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              fontSize: 11,
              color: K.textMut,
            }}
          >
            <SummaryChip>{counts.total} signals</SummaryChip>
            <SummaryChip>{counts.s2} S2</SummaryChip>
            <SummaryChip>{counts.s3} S3</SummaryChip>
            <SummaryChip>{counts.s4} S4</SummaryChip>
            <SummaryChip>{counts.improving} improving</SummaryChip>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Filter signals"
          style={{
            display: "inline-flex",
            gap: 4,
            padding: 3,
            background: K.surface,
            border: `1px solid ${K.borderLight}`,
            borderRadius: 10,
          }}
        >
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={on}
                className="kgs2-focus"
                onClick={() => setFilter(f.id)}
                style={{
                  padding: "5px 10px",
                  borderRadius: 7,
                  border: "none",
                  background: on ? K.brandTint : "transparent",
                  color: on ? K.violet300 : K.textSec,
                  fontSize: 12,
                  fontWeight: on ? 700 : 500,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="kgs2-signal-grid">
        {visible.map((s) => (
          <SignalCard key={s.id} signal={s} />
        ))}
      </div>
    </section>
  );
}

function SummaryChip({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 999,
        border: `1px solid ${K.borderLight}`,
        background: withAlpha(K.surface, 0.8),
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
