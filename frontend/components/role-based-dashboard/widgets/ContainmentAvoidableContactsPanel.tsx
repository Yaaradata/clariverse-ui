"use client";

import { AlertCircle, ArrowRightLeft, Bot } from "lucide-react";
import type { ComponentType } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AVOIDABLE_BY_INTENT = [
  { intent: "Card activation", volume: 1240 },
  { intent: "Balance enquiry", volume: 980 },
  { intent: "Statement download", volume: 720 },
  { intent: "PIN reset", volume: 640 },
  { intent: "Transfer status", volume: 510 },
];

export function ContainmentAvoidableContactsPanel() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <h3 className="mb-3 font-outfit text-base text-white/90">Containment & avoidable contacts</h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Stat icon={Bot} label="Self-service containment" value="62%" delta="+2.1pp" toneClass="text-emerald-400" />
        <Stat icon={ArrowRightLeft} label="Bot -> human handoff" value="18%" delta="-0.6pp" toneClass="text-emerald-400" />
        <Stat icon={AlertCircle} label="Avoidable contacts (wk)" value="4,090" delta="+312" toneClass="text-rose-400" />
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs text-white/50">Avoidable by intent (deflection potential)</div>
        <div className="h-44">
          <ResponsiveContainer>
            <BarChart data={AVOIDABLE_BY_INTENT} layout="vertical">
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="intent"
                tick={{ fill: "#cbd5e1", fontSize: 11 }}
                width={140}
              />
              <Tooltip cursor={{ fill: "rgba(20,184,166,0.08)" }} />
              <Bar dataKey="volume" fill="#14b8a6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  delta,
  toneClass,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  toneClass: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/40 p-3">
      <div className="flex items-center gap-2 text-xs text-white/60">
        <Icon className="h-3.5 w-3.5 text-teal-300" />
        {label}
      </div>
      <div className="mt-1 font-jetbrains text-xl font-semibold text-white">{value}</div>
      <div className={`mt-0.5 text-xs ${toneClass}`}>{delta}</div>
    </div>
  );
}
