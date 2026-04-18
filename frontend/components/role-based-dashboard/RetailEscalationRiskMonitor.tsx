"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

const RISK_SCORE = 23.5;
const RISK_PREV = 28.0;

const TOP_CAUSES: Array<{ label: string; pct: number }> = [
  { label: "Compliance miss", pct: 45 },
  { label: "Tone issues", pct: 30 },
  { label: "Long silence", pct: 25 },
];

const AGENTS_AT_RISK = ["Michael Chen", "Jessica Martinez", "Robert Taylor"];

export function RetailEscalationRiskMonitor() {
  const riskColor = RISK_SCORE >= 50 ? "#ef4444" : RISK_SCORE >= 30 ? "#f97316" : "#10b981";
  const riskLabel =
    RISK_SCORE >= 50 ? "🔴 Critical Risk" : RISK_SCORE >= 30 ? "🟡 High Risk" : "🟢 Low Risk";

  const radialData = [{ value: RISK_SCORE, fill: riskColor }];

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-white/10 bg-black/30 text-gray-100">
      <div className="flex flex-col space-y-1.5 px-5 py-5">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-white md:text-2xl">
          Escalation Risk Monitor
        </h3>
        <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
          AI predicts how likely calls will escalate to supervisors. Lower % = better. Monitor daily to prevent issues.
        </p>
      </div>

      <div className="flex flex-col px-5 pb-5 pt-0">
        <div>
          <div className="text-center">
            <div className="relative flex h-44 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="72%"
                  outerRadius="100%"
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={8}
                    background={{ fill: "rgba(31, 41, 55, 0.85)" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">{RISK_SCORE.toFixed(1)}%</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: riskColor }}>
                    {riskLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-white/5 p-3">
              <div className="mb-1 flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4 rotate-180 text-green-400" aria-hidden />
                <span className="text-sm font-semibold text-green-400">Risk is Decreasing</span>
              </div>
              <p className="text-[13px] leading-snug text-muted-foreground">
                Changed from <span className="font-semibold text-white">{RISK_PREV.toFixed(1)}%</span> to{" "}
                <span className="font-semibold text-white">{RISK_SCORE.toFixed(1)}%</span> over 7 days
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
                ✓ Good news: Risk is going down. Keep monitoring.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-5 border-t border-white/10 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded bg-white/5 p-3">
              <p className="mb-1 text-xs text-muted-foreground">Calls at Risk</p>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground">Calls likely to escalate</p>
              <p className="mt-0.5 text-xs text-orange-400">⚠️ Review these calls</p>
            </div>
            <div className="rounded bg-white/5 p-3">
              <p className="mb-1 text-xs text-muted-foreground">Agents Involved</p>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground">Agents with risky calls</p>
              <p className="mt-0.5 text-xs text-orange-400">👤 Need coaching</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-2">
            <div className="space-y-2">
              {TOP_CAUSES.map((c) => (
                <div key={c.label} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                      <span className="text-[13px] text-white">{c.label}</span>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-orange-400">{c.pct}% of escalations</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-2">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Agents at Risk:</p>
            <div className="space-y-1">
              {AGENTS_AT_RISK.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between gap-2 rounded bg-white/5 px-2 py-1 text-[13px]"
                >
                  <span className="text-white">{name}</span>
                  <span className="shrink-0 text-orange-400">Review needed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
