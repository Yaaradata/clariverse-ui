'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Insight {
  id: number;
  headline: string;
  topic: string;
  description: string;
  action: string;
}

const insights: Insight[] = [
  {
    id: 1,
    headline: '🔥 HIGHEST CUSTOMER FRICTION CLUSTER',
    topic: 'Damaged Deliveries',
    description:
      'Voice + Chat report surge of "broken / crushed box" narratives; high repetition across customers within 24 hrs. AI detects dense clustering of damage-trigger phrases across multi-channel conversations.',
    action: '✨ Action: Surface damage-validation prompts earlier; unify replacement scripts across agents.',
  },
  {
    id: 2,
    headline: '⚡ MOST REPEATED FAILURE PATTERN',
    topic: 'Missing Items in Multi-SKU Orders',
    description:
      'Narratives show "combo incomplete / only 2 items received" across email + chat threads; multiple restatements before resolution. AI flags strong recurrence of missing-item claims tied to bundle purchases.',
    action: '✨ Action: Introduce bundle-specific triage steps; require agent recap confirmation before closure.',
  },
  {
    id: 3,
    headline: '🔀 MULTI-CHANNEL CONTRADICTION',
    topic: 'Delivered-but-Not-Received Disputes',
    description:
      'Chat says "not received," Voice transcript references "delivery attempt," while social posts show public complaints. AI highlights conflicting post-order narratives across channels.',
    action: '✨ Action: Require timeline acknowledgment before agents close any case with delivery disputes.',
  },
  {
    id: 4,
    headline: '📊 VOLATILE CUSTOMER EXPECTATION GAP',
    topic: 'Quality & Description Mismatch',
    description:
      'Sentiment swings sharply when customers mention "colour different," "quality not as shown," "size mismatch." AI detects unstable lexical patterns around expectation vs reality.',
    action: '✨ Action: Standardize listing-expectation scripts; prefill agent guidance for mismatch complaints.',
  },
  {
    id: 5,
    headline: '📈 PEAK ESCALATION TRIGGER CATEGORY',
    topic: 'Wrong Item Delivered',
    description:
      'High escalation density: customers escalate from Chat → Email → Social when wrong item persists across replacement. AI identifies multi-step narrative escalation unique to wrong-item complaints.',
    action: '✨ Action: Auto-suggest variant verification checklist during replacement conversations.',
  },
  {
    id: 6,
    headline: '📸 EVIDENCE-HEAVY CASE CLUSTER',
    topic: 'Tampered / Open Package',
    description:
      '80% of conversations include "attached photo/video" mentions; customers proactively provide proof. AI detects high evidence-attachment frequency as a unique signal.',
    action: '✨ Action: Prioritize fast-lane resolution for photo-validated tampering complaints.',
  },
  {
    id: 7,
    headline: '⏱️ MOST TIME-INTENSIVE RESOLUTION TYPE',
    topic: 'Refund vs Replacement Confusion',
    description:
      'Customers repeatedly ask "refund or replacement?"; threads contain 3–6 clarifications. AI identifies high friction due to unclear policy communication.',
    action: '✨ Action: Enable auto-response templates with clear policy boundaries for imperfect orders.',
  },
  {
    id: 8,
    headline: '📝 AGENT SCRIPT DEVIATION HOTSPOT',
    topic: 'Partial Delivery Follow-ups',
    description:
      'AI detects missing mandatory steps: no confirmation of delivered SKUs, inconsistent explanations across agents. Conversation-based pattern shows script-shortening during rush hours.',
    action: '✨ Action: Enforce mandatory prompt steps before ticket closure.',
  },
  {
    id: 9,
    headline: '📢 SOCIAL NOISE CLUSTER',
    topic: 'Delivery Delay Complaints',
    description:
      'AI finds spike of "delay / late delivery / promised time missed" narratives concentrated in public posts. These conversations carry pressure words: "waiting," "wasting time," "urgent."',
    action: '✨ Action: Trigger proactive updates or apology tokens for delay-associated imperfect orders.',
  },
  {
    id: 10,
    headline: '🔄 REOPEN-PRONE CATEGORY',
    topic: 'Payment Captured / Order Cancelled',
    description:
      'Tickets frequently reopen because customers say "still not refunded," "no update," or "charged twice." AI finds looping conversation patterns due to unclear fund-settlement communication.',
    action: '✨ Action: Add auto-summary recap at closing to avoid reopen loops.',
  },
];

export function AIImperfectOrderInsightWall() {
  return (
    <Card className="bg-[#0d0d0d] border border-[#2a2a2a] h-full flex flex-col">
      <CardHeader className="pb-4 pt-6">
        <CardTitle className="text-lg font-bold text-white mb-1">
          🔥 AI Imperfect Order Insight Wall
        </CardTitle>
        <p className="text-xs text-gray-400">
          Critical insights and AI-driven recommendations
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div className="relative overflow-hidden h-[600px]">
          <ScrollArea
            className="h-full w-full"
            viewportClassName="scrollbar-thin overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#3a3a3a #1a1a1a',
            }}
          >
            <div className="space-y-3 pr-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="rounded-xl border border-white/10 bg-[rgba(26,26,26,0.45)] p-4 text-sm text-gray-200 shadow-inner hover:border-amber-400/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-200/80 mb-2">
                  <span className="text-base">{insight.headline.match(/^[🔥⚡🔀📊📈📸⏱️📝📢🔄]/)?.[0] || ''}</span>
                  <span>{insight.headline.replace(/^[🔥⚡🔀📊📈📸⏱️📝📢🔄]\s*/, '')}</span>
                </div>
                <div className="text-base font-semibold text-white mb-1">{insight.topic}</div>
                <p className="text-xs text-gray-400 mb-2">{insight.description}</p>
                <p className="text-xs text-purple-300">{insight.action}</p>
              </div>
            ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
