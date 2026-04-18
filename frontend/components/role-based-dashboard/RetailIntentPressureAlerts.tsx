"use client";

import {
  Flame,
  Zap,
  CircleX,
  BarChart3,
  Building2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

type Accent = "amber" | "rose" | "indigo" | "emerald" | "cyan" | "violet";

const CARDS: Array<{
  id: string;
  accent: Accent;
  title: string;
  icon: typeof Flame;
  cluster: string;
  body: string;
  action: string;
}> = [
  {
    id: "pressure",
    accent: "amber",
    title: "Highest Pressure Cluster",
    icon: Flame,
    cluster: "Card & payment failures",
    body: "Retail book: failed card authorisations and standing-order retries drive 27% of same-day Voice volume; stress index 0.71 vs. peer median 0.52.",
    action: "Mandate Strong Customer Auth step-up in App before Voice queue; publish exec SLA for payment-repair acknowledgement within 2h.",
  },
  {
    id: "volatile",
    accent: "rose",
    title: "Most Volatile Intent",
    icon: Zap,
    cluster: "Mortgage servicing & rate moves",
    body: "Post–base-rate communications: NPS on mortgage servicing swung +18 → −22 in 10 days; three branch-led escalation spikes tied to redemption quotes.",
    action: "Brief RM and branch managers with a single rate-change narrative; trigger proactive outbound on top 5% LTV bands before inbound peaks.",
  },
  {
    id: "conflict",
    accent: "indigo",
    title: "Multi-Channel Conflict",
    icon: CircleX,
    cluster: "Fee disputes · omnichannel",
    body: "App shows fee reversed; branch diary still shows charge; contact centre script conflicts — FCA DISP exposure on 41 cases where timelines disagree.",
    action: "Freeze single-threaded case ID across App, branch CRM, and telephony; no channel closure without Ops controller sign-off.",
  },
  {
    id: "backlog",
    accent: "emerald",
    title: "Backlog Concentration",
    icon: BarChart3,
    cluster: "KYC / onboarding queue",
    body: "3-day SLA: 612 retail accounts past target; 38% linked to source-of-wealth refresh; complaints correlation +0.4 to overall retail NPS drag.",
    action: "Reallocate BPO surge capacity from cards to KYC; approve risk-based tiering for low-risk salary accounts to clear the tail in 14 days.",
  },
  {
    id: "accountability",
    accent: "cyan",
    title: "Accountability Mismatch",
    icon: Building2,
    cluster: "Vulnerable customer pathways",
    body: "68% of open items are bank-owned (not customer delay); Power of Attorney and bereavement queues skew to branch intake while digital status is stale.",
    action: "Assign named branch–digital ownership per case class; weekly HoRB dashboard on vulnerable-customer ageing until green.",
  },
  {
    id: "loop",
    accent: "violet",
    title: "Cross-Channel Escalation Loop",
    icon: RefreshCw,
    cluster: "Wealth / RM handoffs",
    body: "Premier clients ping-pong App → RM email → service centre; average 4.2 touches before resolution; revenue-at-risk flag on 120 relationships.",
    action: "Institute warm transfer protocol with RM presence on first escalation; cap loops at two touches with executive inbox for breaches.",
  },
];

const accentRing: Record<Accent, string> = {
  amber: "border-amber-500/40 bg-amber-500/5",
  rose: "border-rose-500/40 bg-rose-500/5",
  indigo: "border-indigo-500/40 bg-indigo-500/5",
  emerald: "border-emerald-500/40 bg-emerald-500/5",
  cyan: "border-cyan-500/40 bg-cyan-500/5",
  violet: "border-violet-500/40 bg-violet-500/5",
};

const accentIcon: Record<Accent, string> = {
  amber: "text-amber-400",
  rose: "text-rose-400",
  indigo: "text-indigo-400",
  emerald: "text-emerald-400",
  cyan: "text-cyan-400",
  violet: "text-violet-400",
};

const accentCallout: Record<Accent, string> = {
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  rose: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  indigo: "border-indigo-500/40 bg-indigo-500/10 text-indigo-100",
  emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-100",
  violet: "border-violet-500/40 bg-violet-500/10 text-violet-100",
};

const accentSparkle: Record<Accent, string> = {
  amber: "text-amber-300",
  rose: "text-rose-300",
  indigo: "text-indigo-300",
  emerald: "text-emerald-300",
  cyan: "text-cyan-300",
  violet: "text-violet-300",
};

export function RetailIntentPressureAlerts() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <span aria-hidden>✨</span>
          Intent Pressure Alerts
        </h2>
      </div>
      <p className="text-xs text-gray-400">
        Service Fulfilment view for the <span className="font-semibold text-gray-300">Head of Retail Banking</span> —
        where demand, regulatory risk, and channel execution collide. AI surfaces the clusters that need your capacity,
        policy, or partner decisions this week.
      </p>
      <div className="flex min-w-0 w-full items-stretch gap-4 overflow-x-auto pb-6">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className={`flex min-h-[15.5rem] min-w-[15rem] flex-1 basis-0 flex-col rounded-2xl border px-5 py-5 text-sm text-gray-200 shadow-lg sm:min-w-[16rem] bg-black/30 ${accentRing[c.accent]}`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Icon className={`h-4 w-4 shrink-0 ${accentIcon[c.accent]}`} aria-hidden />
                <span>{c.title}</span>
              </div>
              <div className="mt-3 text-[11px]">
                <div className="mb-1 uppercase tracking-wide text-gray-500">Cluster</div>
                <div className="font-semibold text-white">{c.cluster}</div>
              </div>
              <div className="mt-5 flex min-h-[7.75rem] flex-1 flex-col justify-center rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs leading-snug text-gray-300">
                {c.body}
              </div>
              <div
                className={`mt-4 flex items-start gap-2 rounded-xl border p-3.5 text-xs leading-snug ${accentCallout[c.accent]}`}
              >
                <Sparkles className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accentSparkle[c.accent]}`} aria-hidden />
                <span>{c.action}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
