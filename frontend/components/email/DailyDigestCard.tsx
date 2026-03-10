'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPIData, EisenhowerThread } from '@/lib/api';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  UserCheck,
  CalendarClock,
  Loader2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
  Zap,
  BarChart3,
  ArrowUpRight,
  Ban,
  RefreshCw,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyDigestCardProps {
  kpiData: KPIData | null;
  threads: EisenhowerThread[];
  /** Optional insight explaining what drives priorities (e.g. rate-cycle context). Shown at top of content. */
  contextInsight?: string;
}

type Priority = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

interface DigestTask {
  id: string;
  title: string;
  subtitle: string;
  priority: Priority;
  channel: string;
  timeBlock: string;
  durationMin: number;
  quadrant: 'do' | 'schedule' | 'delegate' | 'delete';
  sentiment: number;
  riskScore: number;
  escalated: boolean;
  owner?: string;
  actionTag: string;
  topic: string;
}

interface DayStats {
  totalP1: number;
  totalEscalated: number;
  avgSentiment: number;
  slaAtRisk: number;
  channelBreakdown: Record<string, number>;
  topTopic: string;
  estimatedWorkload: number; // minutes
}

const CHANNEL_ICON: Record<string, string> = {
  email: '✉️', chat: '💬', ticket: '🎫', social: '📣', voice: '📞',
};
const CHANNEL_COLOR: Record<string, string> = {
  email: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  chat: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  ticket: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  social: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  voice: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};
const PRIORITY_COLOR: Record<string, string> = {
  P1: 'bg-red-500',
  P2: 'bg-orange-400',
  P3: 'bg-yellow-400',
  P4: 'bg-gray-400',
  P5: 'bg-gray-600',
};
const QUADRANT_LABEL: Record<string, string> = {
  do: 'Do Now', schedule: 'Schedule', delegate: 'Delegate', delete: 'Postpone',
};
const QUADRANT_ACCENT: Record<string, string> = {
  do: 'border-l-red-500',
  schedule: 'border-l-yellow-500',
  delegate: 'border-l-[#5332ff]',
  delete: 'border-l-gray-500',
};

const TIME_BLOCKS = [
  { label: '09:00 – 09:30', start: 9, minutes: 30 },
  { label: '09:30 – 10:00', start: 9.5, minutes: 30 },
  { label: '10:00 – 10:45', start: 10, minutes: 45 },
  { label: '10:45 – 11:15', start: 10.75, minutes: 30 },
  { label: '11:15 – 12:00', start: 11.25, minutes: 45 },
  { label: '13:00 – 13:45', start: 13, minutes: 45 },
  { label: '13:45 – 14:30', start: 13.75, minutes: 45 },
  { label: '14:30 – 15:00', start: 14.5, minutes: 30 },
  { label: '15:00 – 15:45', start: 15, minutes: 45 },
  { label: '15:45 – 16:30', start: 15.75, minutes: 45 },
  { label: '16:30 – 17:00', start: 16.5, minutes: 30 },
];

const ACTION_TAGS: Record<string, string[]> = {
  do: ['Reply immediately', 'Escalate to senior', 'Draft response', 'Call customer', 'Approve resolution', 'Expedite fix'],
  schedule: ['Block time this week', 'Assign reviewer', 'Prepare brief', 'Schedule follow-up', 'Batch with similar'],
  delegate: ['Route to specialist', 'Assign to team', 'Forward to billing', 'Hand off to CX', 'Transfer to tech'],
  delete: ['Archive after review', 'No action needed', 'Monitor next cycle', 'Self-service candidate'],
};

function buildDayPlan(threads: EisenhowerThread[]): { tasks: DigestTask[]; stats: DayStats } {
  const seeded = (n: number, max: number) => Math.floor(((Math.sin(n * 9301 + 49297) * 233) % 1 + 1) % 1 * max);

  // Pick representative threads per quadrant
  const doThreads = threads.filter(t => t.quadrant === 'do').slice(0, 5);
  const scheduleThreads = threads.filter(t => t.quadrant === 'schedule').slice(0, 6);
  const delegateThreads = threads.filter(t => t.quadrant === 'delegate').slice(0, 4);
  const deleteThreads = threads.filter(t => t.quadrant === 'delete' && t.risk_score > 40).slice(0, 2);

  const allSelected = [...doThreads, ...scheduleThreads, ...delegateThreads, ...deleteThreads];

  const tasks: DigestTask[] = allSelected.map((t, i) => {
    const timeBlock = TIME_BLOCKS[i % TIME_BLOCKS.length];
    const tags = ACTION_TAGS[t.quadrant] ?? ACTION_TAGS.do;
    return {
      id: t.thread_id,
      title: t.subject_norm,
      subtitle: t.next_action_suggestion || 'Review and action',
      priority: t.priority,
      channel: t.channel,
      timeBlock: timeBlock.label,
      durationMin: timeBlock.minutes,
      quadrant: t.quadrant,
      sentiment: t.overall_sentiment,
      riskScore: Math.round(t.risk_score),
      escalated: t.escalation_count > 0,
      owner: t.owner,
      actionTag: tags[seeded(i, tags.length)],
      topic: t.topic || t.dominant_cluster_name || 'General',
    };
  });

  // Stats
  const totalP1 = threads.filter(t => t.priority === 'P1').length;
  const totalEscalated = threads.filter(t => t.escalation_count > 0).length;
  const avgSentiment = threads.length ? threads.reduce((s, t) => s + t.overall_sentiment, 0) / threads.length : 0;
  const slaAtRisk = threads.filter(t => t.risk_score >= 70).length;
  const channelBreakdown = threads.reduce((acc, t) => {
    acc[t.channel] = (acc[t.channel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topicCounts = threads.reduce((acc, t) => {
    const k = t.topic || t.dominant_cluster_name || 'General';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTopic = Object.entries(topicCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—';
  const estimatedWorkload = tasks.reduce((s, t) => s + t.durationMin, 0);

  return { tasks, stats: { totalP1, totalEscalated, avgSentiment, slaAtRisk, channelBreakdown, topTopic, estimatedWorkload } };
}

function SentimentDot({ value }: { value: number }) {
  const color = value <= 2 ? 'bg-emerald-400' : value <= 3 ? 'bg-yellow-400' : value <= 4 ? 'bg-orange-400' : 'bg-red-400';
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

function RiskBadge({ score }: { score: number }) {
  if (score >= 75) return <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5">HIGH RISK</span>;
  if (score >= 50) return <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">MED RISK</span>;
  return <span className="text-[10px] font-semibold text-gray-500 bg-gray-500/10 border border-gray-500/20 rounded px-1.5 py-0.5">LOW</span>;
}

export function DailyDigestCard({ kpiData, threads, contextInsight }: DailyDigestCardProps) {
  const [generated, setGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<'all' | 'do' | 'schedule' | 'delegate'>('all');

  const { tasks, stats } = useMemo(() => buildDayPlan(threads), [threads]);

  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1600));
    setIsGenerating(false);
    setGenerated(true);
  };

  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredTasks = activeSection === 'all' ? tasks : tasks.filter(t => t.quadrant === activeSection);
  const completedCount = tasks.filter(t => completed.has(t.id)).length;
  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  const workloadHrs = Math.floor(stats.estimatedWorkload / 60);
  const workloadMins = stats.estimatedWorkload % 60;

  return (
    <Card className="border border-[color:var(--border)] bg-[color:var(--card)] shadow-xl overflow-hidden">
      {/* ── Header ── */}
      <CardHeader className="pb-0 px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b90abd]/15 border border-[#b90abd]/30">
              <Sparkles className="h-4 w-4 text-[#b90abd]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white leading-tight">Daily Digest</h2>
              <p className="text-xs text-gray-500 mt-0.5">{todayStr}</p>
            </div>
          </div>
          <Button
            onClick={generated ? () => { setGenerated(false); setCompleted(new Set()); } : handleGenerate}
            disabled={isGenerating}
            size="sm"
            className={`text-xs h-8 px-3 ${generated
              ? 'bg-transparent border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              : 'bg-gradient-to-r from-[#b90abd] to-[#5332ff] hover:from-[#a009b3] hover:to-[#4a2ae6] text-white border-0'
            }`}
            variant={generated ? 'ghost' : 'default'}
          >
            {isGenerating ? (
              <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" />Generating…</>
            ) : generated ? (
              <><RefreshCw className="h-3 w-3 mr-1.5" />Regenerate</>
            ) : (
              <><Sparkles className="h-3 w-3 mr-1.5" />Generate My Day</>
            )}
          </Button>
        </div>

        {/* ── KPI ribbon (always visible if threads exist) ── */}
        {threads.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { icon: <AlertTriangle className="h-3.5 w-3.5 text-red-400" />, label: 'Critical P1', value: stats.totalP1, accent: 'text-red-400' },
              { icon: <Zap className="h-3.5 w-3.5 text-orange-400" />, label: 'Escalated', value: stats.totalEscalated, accent: 'text-orange-400' },
              { icon: <BarChart3 className="h-3.5 w-3.5 text-amber-400" />, label: 'SLA at Risk', value: stats.slaAtRisk, accent: 'text-amber-400' },
              { icon: <Clock className="h-3.5 w-3.5 text-[#b90abd]" />, label: 'Est. Workload', value: `${workloadHrs}h ${workloadMins}m`, accent: 'text-[#b90abd]' },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-lg bg-white/[0.03] border border-white/[0.07] px-3 py-2">
                <div className="flex items-center gap-1.5 mb-1">{kpi.icon}<span className="text-[10px] text-gray-500 uppercase tracking-wide">{kpi.label}</span></div>
                <div className={`text-lg font-bold leading-none ${kpi.accent}`}>{kpi.value}</div>
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="px-5 pt-4 pb-5">
        {contextInsight ? (
          <p className="text-xs text-gray-500 mb-4 pb-3 border-b border-white/10">
            {contextInsight}
          </p>
        ) : null}
        <AnimatePresence mode="wait">
          {!generated && !isGenerating && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center gap-3 text-center"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#b90abd]/10 border border-[#b90abd]/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-[#b90abd] opacity-60" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">No plan generated yet</p>
                <p className="text-xs text-gray-500 mt-1 max-w-[260px]">
                  Click "Generate My Day" to get a time-blocked action plan built from your live queue — P1 first, then delegate and schedule.
                </p>
              </div>
              {threads.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  {Object.entries(stats.channelBreakdown).slice(0, 5).map(([ch, cnt]) => (
                    <span key={ch} className={`text-[11px] px-2 py-0.5 rounded-full border ${CHANNEL_COLOR[ch] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/20'}`}>
                      {CHANNEL_ICON[ch]} {ch} · {cnt}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-10 flex flex-col items-center gap-4"
            >
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-2 border-[#b90abd]/20 animate-ping" />
                <div className="h-14 w-14 rounded-full bg-[#b90abd]/10 border border-[#b90abd]/30 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[#b90abd] animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-white font-medium">Analysing {threads.length.toLocaleString()} contacts…</p>
                <p className="text-xs text-gray-500 mt-1">Ranking by SLA risk · escalation history · sentiment decay</p>
              </div>
              <div className="w-48 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#b90abd] to-[#5332ff]"
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}

          {generated && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{completedCount} of {tasks.length} tasks completed</span>
                  <span className={`font-semibold ${progressPct === 100 ? 'text-emerald-400' : 'text-[#b90abd]'}`}>{progressPct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#b90abd] to-[#5332ff]"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Insight bar */}
              <div className="rounded-xl border border-[#b90abd]/20 bg-[#b90abd]/5 px-4 py-3 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-[#b90abd] mt-0.5 shrink-0" />
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="text-white font-medium">Today's focus:</span> {stats.totalP1} P1 contacts require same-session resolution.
                  Top driver: <span className="text-[#b90abd] font-medium">"{stats.topTopic}"</span>.
                  {stats.slaAtRisk > 0 && <> <span className="text-amber-400">{stats.slaAtRisk} contacts</span> are within SLA breach window — prioritise these first.</>}
                </p>
              </div>

              {/* Section filter tabs */}
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'do', 'schedule', 'delegate'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setActiveSection(s)}
                    className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                      activeSection === s
                        ? 'bg-[#b90abd]/20 border-[#b90abd]/50 text-white'
                        : 'bg-transparent border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {s === 'all' ? `All (${tasks.length})` : `${QUADRANT_LABEL[s]} (${tasks.filter(t => t.quadrant === s).length})`}
                  </button>
                ))}
              </div>

              {/* ── Scrollable task list ── */}
              <div className="h-[480px] overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {filteredTasks.map((task, i) => {
                  const done = completed.has(task.id);
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: done ? 0.45 : 1, x: 0 }}
                      transition={{ delay: i * 0.025 }}
                      className={`group relative rounded-xl border-l-2 border border-white/[0.07] ${QUADRANT_ACCENT[task.quadrant]} bg-white/[0.025] hover:bg-white/[0.05] transition-all duration-150 cursor-pointer`}
                      onClick={() => toggleComplete(task.id)}
                    >
                      <div className="flex items-start gap-3 px-4 py-3">
                        {/* Checkbox */}
                        <div className="mt-0.5 shrink-0">
                          {done
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            : <Circle className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                          }
                        </div>

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Priority dot */}
                              <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${PRIORITY_COLOR[task.priority]}`} />
                              {/* Channel badge */}
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${CHANNEL_COLOR[task.channel] ?? ''}`}>
                                {CHANNEL_ICON[task.channel]} {task.channel}
                              </span>
                              {/* Escalated badge */}
                              {task.escalated && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded border font-semibold text-rose-400 bg-rose-500/10 border-rose-500/20">
                                  ESCALATED
                                </span>
                              )}
                            </div>
                            <RiskBadge score={task.riskScore} />
                          </div>

                          {/* Title */}
                          <p className={`text-sm font-medium mt-1.5 leading-snug ${done ? 'line-through text-gray-500' : 'text-white'}`}>
                            {task.title}
                          </p>

                          {/* Subtitle / action hint */}
                          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{task.subtitle}</p>

                          {/* Meta row */}
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            {/* Time block */}
                            <span className="flex items-center gap-1 text-[10px] text-gray-500">
                              <Clock className="h-3 w-3" />
                              {task.timeBlock}
                              <span className="text-gray-600">·</span>
                              {task.durationMin}m
                            </span>
                            {/* Topic */}
                            <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                              {task.topic}
                            </span>
                            {/* Sentiment */}
                            <span className="flex items-center gap-1 text-[10px] text-gray-500">
                              <SentimentDot value={task.sentiment} />
                              Sentiment {task.sentiment}/5
                            </span>
                            {/* Owner (delegate) */}
                            {task.owner && task.quadrant === 'delegate' && (
                              <span className="flex items-center gap-1 text-[10px] text-[#5332ff]">
                                <UserCheck className="h-3 w-3" />
                                {task.owner}
                              </span>
                            )}
                          </div>

                          {/* CTA action tag */}
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#b90abd] bg-[#b90abd]/10 border border-[#b90abd]/20 px-2 py-0.5 rounded-full">
                              <ChevronRight className="h-3 w-3" />
                              {task.actionTag}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredTasks.length === 0 && (
                  <div className="py-8 text-center text-sm text-gray-500">No tasks in this category.</div>
                )}
              </div>

              {/* Footer summary */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 grid grid-cols-3 gap-3 mt-1">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{tasks.filter(t => t.quadrant === 'do').length}</div>
                  <div className="text-[10px] text-red-400 uppercase tracking-wide mt-0.5">Do Now</div>
                </div>
                <div className="text-center border-x border-white/[0.07]">
                  <div className="text-lg font-bold text-white">{tasks.filter(t => t.quadrant === 'schedule').length}</div>
                  <div className="text-[10px] text-yellow-400 uppercase tracking-wide mt-0.5">Schedule</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{tasks.filter(t => t.quadrant === 'delegate').length}</div>
                  <div className="text-[10px] text-[#5332ff] uppercase tracking-wide mt-0.5">Delegate</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}