"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FollowUpCalendar } from "./FollowUpCalendar";

interface ActionItem {
  id: string;
  intentId: string;
  title: string;
  impact: string;
  dueAt: string;
  owner: string;
  status: "pending" | "in-progress" | "completed";
}

interface RootCauseInsight {
  id: string;
  intentId: string;
  summary: string;
  evidence: string;
}

interface FollowUpRecord {
  id: string;
  title: string;
  dueDate: string;
  severity: string;
}

interface HeatmapData {
  critical: { negative: number; neutral: number; positive: number };
  high: { negative: number; neutral: number; positive: number };
  medium: { negative: number; neutral: number; positive: number };
  low: { negative: number; neutral: number; positive: number };
}

interface ActionabilitySectionProps {
  actions: ActionItem[];
  rootCauses: RootCauseInsight[];
  rootCauseExplanations?: Record<string, string>;
  followUps: FollowUpRecord[];
  heatmapData: HeatmapData;
  onUpdateAction: (id: string, status: ActionItem["status"]) => void;
  onSelectFollowUp: (id: string) => void;
  onSelectHeatCell: (urgency: string, sentiment: string) => void;
}

const statusLabels: Record<ActionItem["status"], string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

export function ActionabilitySection({
  actions,
  rootCauses,
  rootCauseExplanations = {},
  followUps,
  heatmapData,
  onUpdateAction,
  onSelectFollowUp,
  onSelectHeatCell,
}: ActionabilitySectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:items-stretch">
        <Card className="border border-[color:var(--border)] bg-[color:var(--card)] p-6 flex h-full min-h-0 flex-col gap-4 transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-[color:var(--background)]">
          <div className="flex shrink-0 items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Next-Best-Action Queue</h3>
              <p className="text-sm text-muted-foreground">
                Actions prioritized by severity, customer impact, and SLA exposure.
              </p>
            </div>
            <Badge variant="outline" className="shrink-0 border-purple-400/40 text-purple-200">
              {actions.length} items
            </Badge>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {actions.map((action) => (
              <div
                key={action.id}
                className="rounded-lg border border-[color:var(--border)] bg-[rgba(26,26,26,0.65)] p-4 transition-all hover:border-[#b90abd]/40 hover:bg-[color:var(--background)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-100">{action.title}</h4>
                    <p className="text-xs text-gray-500">Due {action.dueAt} • Owner {action.owner}</p>
                  </div>
                  <Badge variant="outline" className="border-gray-600 text-gray-300 capitalize">
                    {action.impact}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={action.status === "completed" ? "default" : "secondary"}
                    className={`text-[10px] uppercase tracking-wide ${
                      action.status === "completed" ? "bg-green-500/20 text-green-300" : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {statusLabels[action.status]}
                  </Badge>
                  {action.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-purple-200 hover:text-white"
                      onClick={() => onUpdateAction(action.id, "completed")}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {action.status === "pending" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-blue-200 hover:text-white"
                      onClick={() => onUpdateAction(action.id, "in-progress")}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {actions.length === 0 && (
              <p className="text-sm text-muted-foreground">No actions available. Connect data sources to populate.</p>
            )}
          </div>
        </Card>

        <Card className="border border-[color:var(--border)] bg-[color:var(--card)] p-6 flex h-full min-h-0 flex-col gap-4 transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-[color:var(--background)]">
          <div className="shrink-0">
            <h3 className="text-lg font-semibold text-white">Root Cause Insights</h3>
            <p className="text-sm text-muted-foreground">
              Narrative links between conversation themes, volume spikes, and operational signals (tooling, staffing, policy).
            </p>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {rootCauses.map((insight) => {
              const narrative =
                rootCauseExplanations[insight.id] ??
                `Driver: ${insight.summary} Operational evidence: ${insight.evidence} Next step: confirm root cause in the cited time window, then assign an owner to remediate the failure mode before the next peak interval.`;
              return (
                <div key={insight.id} className="space-y-2 rounded-lg border border-[color:var(--border)] bg-[rgba(26,26,26,0.65)] p-4">
                  <p className="text-sm font-semibold text-gray-100">{insight.summary}</p>
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-500">Evidence — </span>
                    {insight.evidence}
                  </p>
                  <p className="text-xs leading-relaxed text-purple-100/95">{narrative}</p>
                </div>
              );
            })}
            {rootCauses.length === 0 && (
              <p className="text-sm text-muted-foreground">No root-cause narratives yet. Add conversation and ops telemetry to populate this panel.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:items-stretch">
        <FollowUpCalendar followUps={followUps} onSelect={onSelectFollowUp} />

        <Card className="border border-[color:var(--border)] bg-[color:var(--card)] p-6 flex h-full min-h-0 flex-col gap-4 transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-[color:var(--background)]">
          <div className="shrink-0">
            <h3 className="text-lg font-semibold text-white">Urgency vs Sentiment Heat Grid</h3>
            <p className="text-sm text-muted-foreground">
              Each cell is a conversation count for that urgency tier and sentiment band. Click a cell to drill into matching threads.
            </p>
          </div>
          <div className="grid min-h-[220px] flex-1 grid-cols-4 gap-2 text-xs text-center text-gray-300">
            <span />
            <span className="uppercase tracking-wide text-gray-400">Negative</span>
            <span className="uppercase tracking-wide text-gray-400">Neutral</span>
            <span className="uppercase tracking-wide text-gray-400">Positive</span>

            {Object.entries(heatmapData).map(([urgency, sentimentBuckets]) => (
              <div key={urgency} className="contents">
                <span className="font-medium text-gray-400 capitalize">
                  {urgency}
                </span>
                {Object.entries(sentimentBuckets).map(([sentiment, value]) => {
                  const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                  return (
                    <HeatCell
                      key={`${urgency}-${sentiment}`}
                      urgency={urgency}
                      label={sentiment}
                      value={numericValue}
                      onClick={() => onSelectHeatCell(urgency, sentiment)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

interface HeatCellProps {
  urgency: string;
  label: string;
  value: number;
  onClick: () => void;
}

function HeatCell({ urgency, label, value, onClick }: HeatCellProps) {
  const intensity = Math.min(1, value / 50);
  const background = `rgba(168, 85, 247, ${0.1 + intensity * 0.4})`;
  const tier = urgency.charAt(0).toUpperCase() + urgency.slice(1);
  const sent = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${tier} urgency · ${sent} sentiment — ${value} conversations`}
      className="rounded-md border border-[color:var(--border)] bg-[rgba(26,26,26,0.65)] px-2 py-3 flex flex-col items-center justify-center gap-1 transition-all hover:border-[#b90abd]/40 hover:bg-[color:var(--background)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b90abd]"
      style={{ background }}
    >
      <span className="text-[10px] font-medium leading-tight text-gray-400">
        {tier} · {sent}
      </span>
      <span className="text-base font-semibold text-gray-100">{value}</span>
      <span className="text-[9px] uppercase tracking-wide text-gray-500">conversations</span>
    </button>
  );
}
