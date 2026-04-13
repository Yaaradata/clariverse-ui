'use client';

import type { LucideIcon } from 'lucide-react';
import { AIAction } from '@/lib/fci-lib/fciData';
import { Settings, Users, Bell, TrendingDown, Clock, Target } from 'lucide-react';

interface AIActionCenterProps {
  actions: AIAction[];
  isDarkMode?: boolean;
}

function getActionIcon(type: string): LucideIcon {
  if (type === 'Process Fix') return Settings;
  if (type === 'Agent Skills Enhancement') return Users;
  return Bell;
}

function getPriorityColor(priority: string) {
  if (priority === 'High') return '#B90ABD';
  if (priority === 'Medium') return '#5332FF';
  return '#939394';
}

function SectionHeading({
  icon: Icon,
  title,
  isDarkMode,
}: {
  icon: LucideIcon;
  title: string;
  isDarkMode: boolean;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: 'rgba(83, 50, 255, 0.18)' }}
        aria-hidden
      >
        <Icon className="h-5 w-5" style={{ color: '#5332FF' }} strokeWidth={2} />
      </span>
      <h4 className="text-sm font-bold leading-tight" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
        {title}
      </h4>
    </div>
  );
}

function ActionCard({ action, isDarkMode }: { action: AIAction; isDarkMode: boolean }) {
  const Icon = getActionIcon(action.type);
  return (
    <div
      className="rounded-lg border p-3 transition-all hover:shadow-md"
      style={{
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF',
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: 'rgba(83, 50, 255, 0.12)' }}
          >
            <Icon className="h-4 w-4" style={{ color: '#5332FF' }} strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <h5 className="mb-1 text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              {action.title}
            </h5>
            <p className="text-xs leading-relaxed" style={{ color: '#b9b9ba' }}>
              {action.description}
            </p>
          </div>
        </div>
        <span
          className="shrink-0 rounded px-2 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: getPriorityColor(action.priority) }}
        >
          {action.priority}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1">
          <TrendingDown className="h-3 w-3 shrink-0" style={{ color: '#10b981' }} />
          <span className="text-xs" style={{ color: '#939394' }}>
            <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{action.estimatedFCIReduction}%</strong> FCI reduction
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Target className="h-3 w-3 shrink-0" style={{ color: '#5332FF' }} />
          <span className="text-xs" style={{ color: '#939394' }}>
            <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>+{action.impactOnTrustScore}</strong> trust score
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 shrink-0" style={{ color: '#939394' }} />
          <span className="text-xs" style={{ color: '#939394' }}>
            {action.timeToImplement}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActionGroup({
  title,
  sectionIcon,
  list,
  isDarkMode,
}: {
  title: string;
  sectionIcon: LucideIcon;
  list: AIAction[];
  isDarkMode: boolean;
}) {
  return (
    <div>
      <SectionHeading icon={sectionIcon} title={title} isDarkMode={isDarkMode} />
      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-4 text-sm" style={{ borderColor: '#393939', color: '#b9b9ba' }}>
            No actions in this category for the current view. Adjust filters or refresh the action feed.
          </p>
        ) : (
          list.map((action) => <ActionCard key={action.id} action={action} isDarkMode={isDarkMode} />)
        )}
      </div>
    </div>
  );
}

export function AIActionCenter({ actions, isDarkMode = false }: AIActionCenterProps) {
  const grouped = {
    'Process Fixes': actions.filter((a) => a.type === 'Process Fix'),
    'Agent Skills Enhancements': actions.filter((a) => a.type === 'Agent Skills Enhancement'),
    'Proactive Alerts': actions.filter((a) => a.type === 'Proactive Alert'),
  };

  return (
    <div
      className="flex h-full flex-col rounded-lg border p-4 shadow-sm"
      style={{
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
      }}
    >
      <h3 className="mb-4 text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
        What To Do Next (AI Action Center)
      </h3>
      <p className="mb-6 text-xs leading-relaxed" style={{ color: '#b9b9ba' }}>
        Grouped by work type: process or tooling changes, people development, and alerts that need monitoring or routing.
      </p>

      <div className="space-y-8">
        <ActionGroup title="Process Fixes" sectionIcon={Settings} list={grouped['Process Fixes']} isDarkMode={isDarkMode} />
        <ActionGroup title="Agent Skills Enhancements" sectionIcon={Users} list={grouped['Agent Skills Enhancements']} isDarkMode={isDarkMode} />
        <ActionGroup title="Proactive Alerts" sectionIcon={Bell} list={grouped['Proactive Alerts']} isDarkMode={isDarkMode} />
      </div>

      <p className="mt-6 text-xs italic" style={{ color: '#939394' }}>
        Executive takeaway: prioritize high-impact process fixes first, then close skills gaps tied to recurring failure modes.
      </p>
    </div>
  );
}
