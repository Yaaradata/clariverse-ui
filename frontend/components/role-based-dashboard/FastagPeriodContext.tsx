"use client";

import { ArrowLeft } from "lucide-react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  clampMonthToQuarter,
  DEFAULT_FASTAG_PERIOD,
  FASTAG_MONTH_LABELS,
  FASTAG_PERIOD_YEARS,
  FASTAG_QUARTERS,
  isSamePeriod,
  monthsInQuarter,
  periodLabel,
  type FastagPeriod,
  type FastagQuarter,
} from "@/lib/fastag-period/types";

type FastagPeriodContextValue = {
  period: FastagPeriod;
  setPeriod: (period: FastagPeriod) => void;
  setYear: (year: number) => void;
  setQuarter: (quarter: FastagQuarter) => void;
  setMonth: (month: number) => void;
  label: string;
};

const FastagPeriodContext = createContext<FastagPeriodContextValue | null>(null);

export function FastagPeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<FastagPeriod>(DEFAULT_FASTAG_PERIOD);
  const value = useMemo<FastagPeriodContextValue>(
    () => ({
      period,
      setPeriod: (next) =>
        setPeriod({
          ...next,
          month: clampMonthToQuarter(next.month, next.quarter),
        }),
      setYear: (year) => setPeriod((p) => ({ ...p, year })),
      setQuarter: (quarter) =>
        setPeriod((p) => ({
          ...p,
          quarter,
          month: clampMonthToQuarter(p.month, quarter),
        })),
      setMonth: (month) => setPeriod((p) => ({ ...p, month: clampMonthToQuarter(month, p.quarter) })),
      label: periodLabel(period),
    }),
    [period],
  );
  return <FastagPeriodContext.Provider value={value}>{children}</FastagPeriodContext.Provider>;
}

export function useFastagPeriod(): FastagPeriodContextValue {
  const ctx = useContext(FastagPeriodContext);
  if (!ctx) throw new Error("useFastagPeriod must be used within FastagPeriodProvider");
  return ctx;
}

export type FastagPeriodFilterProps = {
  border: string;
  elevated: string;
  text: string;
  textSec: string;
  accent: string;
  accentOnFill: string;
  backButtonBg?: string;
  backButtonBorder?: string;
  drillTitle?: string;
  onBack?: () => void;
  /** HoB overview hides period pickers; drills keep them. */
  showPeriodControls?: boolean;
};

function PeriodPillGroup({
  label,
  border,
  elevated,
  accent,
  accentOnFill,
  textSec,
  children,
}: {
  label: string;
  border: string;
  elevated: string;
  accent: string;
  accentOnFill: string;
  textSec: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: textSec, fontFamily: "var(--font-mono)" }}>{label}</span>
      <div style={{ display: "flex", background: elevated, border: `1px solid ${border}`, borderRadius: 10, padding: 4 }}>
        {children}
      </div>
    </div>
  );
}

function PeriodPill({
  active,
  onClick,
  accent,
  accentOnFill,
  textSec,
  children,
}: {
  active: boolean;
  onClick: () => void;
  accent: string;
  accentOnFill: string;
  textSec: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: active ? accent : "transparent",
        color: active ? accentOnFill : textSec,
        border: "none",
        borderRadius: 7,
        padding: "6px 12px",
        fontSize: 11,
        fontWeight: 800,
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
      }}
    >
      {children}
    </button>
  );
}

/** Period + drill nav row (no outer card — embed in HoB unified header). */
export function FastagPeriodFilterRow({
  border,
  elevated,
  text,
  textSec,
  accent,
  accentOnFill,
  backButtonBg = "transparent",
  backButtonBorder,
  drillTitle,
  onBack,
  showPeriodControls = true,
}: FastagPeriodFilterProps) {
  const { period, setYear, setQuarter, setMonth } = useFastagPeriod();
  const showDrillNav = Boolean(drillTitle && onBack);

  if (!showDrillNav && !showPeriodControls) return null;

  const quarterMonths = monthsInQuarter(period.quarter);

  const periodControls = showPeriodControls ? (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 10,
        flexShrink: 0,
        marginLeft: "auto",
      }}
    >
      <PeriodPillGroup label="Year" border={border} elevated={elevated} accent={accent} accentOnFill={accentOnFill} textSec={textSec}>
        {FASTAG_PERIOD_YEARS.map((y) => (
          <PeriodPill
            key={y}
            active={period.year === y}
            onClick={() => setYear(y)}
            accent={accent}
            accentOnFill={accentOnFill}
            textSec={textSec}
          >
            {y}
          </PeriodPill>
        ))}
      </PeriodPillGroup>

      <PeriodPillGroup label="Quarter" border={border} elevated={elevated} accent={accent} accentOnFill={accentOnFill} textSec={textSec}>
        {FASTAG_QUARTERS.map((q) => (
          <PeriodPill
            key={q}
            active={period.quarter === q}
            onClick={() => setQuarter(q)}
            accent={accent}
            accentOnFill={accentOnFill}
            textSec={textSec}
          >
            Q{q}
          </PeriodPill>
        ))}
      </PeriodPillGroup>

      <PeriodPillGroup label="Month" border={border} elevated={elevated} accent={accent} accentOnFill={accentOnFill} textSec={textSec}>
        {quarterMonths.map((m) => (
          <PeriodPill
            key={m}
            active={period.month === m}
            onClick={() => setMonth(m)}
            accent={accent}
            accentOnFill={accentOnFill}
            textSec={textSec}
          >
            {FASTAG_MONTH_LABELS[m - 1]}
          </PeriodPill>
        ))}
      </PeriodPillGroup>
    </div>
  ) : null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 14,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 14,
          flex: "1 1 280px",
          minWidth: 0,
        }}
      >
        {showDrillNav ? (
          <button
            type="button"
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
              background: backButtonBg,
              border: `1px solid ${backButtonBorder ?? border}`,
              borderRadius: 10,
              padding: "8px 12px",
              cursor: "pointer",
              color: textSec,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} />
            Back to Overview
          </button>
        ) : null}

        {showDrillNav ? (
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(15px, 1.8vw, 18px)",
              fontWeight: 700,
              lineHeight: 1.25,
              color: text,
              flexShrink: 1,
              minWidth: 0,
            }}
          >
            {drillTitle}
          </h1>
        ) : null}
      </div>

      {periodControls}
    </div>
  );
}

export { isSamePeriod, FASTAG_MONTH_LABELS, FASTAG_PERIOD_YEARS, FASTAG_QUARTERS, monthsInQuarter };
