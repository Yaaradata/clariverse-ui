"use client";

import type { ComponentType } from "react";
import { AlertTriangle, Banknote, Repeat, TrendingUp } from "lucide-react";

type BreakdownItem = {
  label: string;
  amount: number;
  icon: ComponentType<{ className?: string }>;
  toneClass: string;
};

type CostOfBadServiceOverlayProps = {
  weeklyAtRisk?: number;
  weekOverWeek?: number;
  breakdown?: BreakdownItem[];
};

const DEFAULT_BREAKDOWN: BreakdownItem[] = [
  { label: "SLA breach", amount: 112_000, icon: AlertTriangle, toneClass: "text-rose-400" },
  { label: "BPO penalty", amount: 84_000, icon: Banknote, toneClass: "text-amber-400" },
  { label: "Avoidable contacts", amount: 116_400, icon: Repeat, toneClass: "text-teal-300" },
];

export function CostOfBadServiceOverlay({
  weeklyAtRisk = 312_400,
  weekOverWeek = 0.18,
  breakdown = DEFAULT_BREAKDOWN,
}: CostOfBadServiceOverlayProps) {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 to-slate-900/60 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-rose-300/80">
            <TrendingUp className="h-3.5 w-3.5" />
            Weekly $ at risk from bad service
          </div>
          <div className="mt-1 font-jetbrains text-3xl font-semibold text-white">
            ${weeklyAtRisk.toLocaleString()}
          </div>
        </div>
        <div className="text-sm text-rose-300">+{(weekOverWeek * 100).toFixed(0)}% WoW</div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {breakdown.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-white/10 bg-slate-900/50 p-3">
              <div className={`flex items-center gap-2 text-xs ${item.toneClass}`}>
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
              <div className="mt-1 font-jetbrains text-lg font-semibold text-white">
                ${item.amount.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
