'use client';

import { useState } from 'react';
import { Layers, MessageSquare, Mail, Ticket, Phone, Share2 } from 'lucide-react';

interface ChannelPresence {
  chat: boolean;
  email: boolean;
  ticket: boolean;
  voice: boolean;
  social: boolean;
}

interface PatternSignature {
  phrases: string[];
}

interface PatternSnippet {
  channel: 'Chat' | 'Email' | 'Ticket' | 'Voice' | 'Social';
  text: string;
}

interface FraudPatternData {
  id: string;
  title: string;
  channels: ChannelPresence;
  consistency: number; // 0-100, pattern similarity across channels
  signature: PatternSignature;
  snippets: PatternSnippet[];
}

const channelOrder: Array<keyof ChannelPresence> = ['chat', 'email', 'ticket', 'voice', 'social'];
const channelLabels: Record<keyof ChannelPresence, string> = {
  chat: 'Chat',
  email: 'Email',
  ticket: 'Ticket',
  voice: 'Voice',
  social: 'Social',
};

const channelIcons: Record<keyof ChannelPresence, typeof MessageSquare> = {
  chat: MessageSquare,
  email: Mail,
  ticket: Ticket,
  voice: Phone,
  social: Share2,
};

const channelColors: Record<keyof ChannelPresence, string> = {
  chat: '#3B82F6',      // Blue
  email: '#10B981',     // Green
  ticket: '#F59E0B',   // Amber
  voice: '#EC4899',    // Pink
  social: '#8B5CF6',   // Purple
};

const channelLabelToKey: Record<string, keyof ChannelPresence> = {
  'Chat': 'chat',
  'Email': 'email',
  'Ticket': 'ticket',
  'Voice': 'voice',
  'Social': 'social',
};

// Mock data - in production, this would come from props or API
const fraudPatternsData: FraudPatternData[] = [
  {
    id: 'FI-001',
    title: 'Delivery Liability Risk',
    channels: { chat: true, email: true, ticket: true, voice: true, social: true },
    consistency: 82,
    signature: {
      phrases: [
        '"delivery agent said…"',
        'claim sequence reversal',
        'repeated INR complaints',
        'contradictory delivery timelines',
        'GPS mismatch evidence',
      ],
    },
    snippets: [
      { channel: 'Chat', text: '"delivery agent said package delivered but I was home all day"' },
      { channel: 'Email', text: '"GPS shows delivery but no one came to my address"' },
      { channel: 'Ticket', text: '"driver marked delivered without OTP verification"' },
      { channel: 'Voice', text: '"I spoke to delivery person who admitted he marked it delivered from warehouse"' },
      { channel: 'Social', text: '"Posted Ring doorbell footage - no delivery attempt at claimed time"' },
    ],
  },
  {
    id: 'FI-002',
    title: 'Internal Policy Violations',
    channels: { chat: true, email: true, ticket: true, voice: true, social: false },
    consistency: 76,
    signature: {
      phrases: [
        '"other agent promised…"',
        'exception-demand wording',
        '"do it as one-time favour"',
        'manager approval bypass',
      ],
    },
    snippets: [
      { channel: 'Chat', text: '"previous agent said refund approved without return"' },
      { channel: 'Email', text: '"other agent promised full refund as exception"' },
      { channel: 'Voice', text: '"do it as one-time favour, I know you can"' },
      { channel: 'Ticket', text: '"agent on call yesterday said no documentation needed"' },
    ],
  },
  {
    id: 'FI-003',
    title: 'Non-Resalable Returns',
    channels: { chat: true, email: true, ticket: false, voice: false, social: false },
    consistency: 45,
    signature: {
      phrases: [
        '"wrong item but I threw packaging"',
        'used/damaged descriptions changing',
        'mismatched photo evidence',
      ],
    },
    snippets: [
      { channel: 'Chat', text: '"received wrong item but destroyed packing"' },
      { channel: 'Email', text: '"item was already torn when opened"' },
    ],
  },
  {
    id: 'FI-004',
    title: 'Marketing Budget Waste',
    channels: { chat: true, email: true, ticket: true, voice: false, social: false },
    consistency: 58,
    signature: {
      phrases: [
        'promo re-use attempts',
        '"cashback didn\'t credit, please apply again"',
        'referral bonus exploitation',
      ],
    },
    snippets: [
      { channel: 'Chat', text: '"cashback didn\'t credit, please apply again"' },
      { channel: 'Email', text: '"promo code not working, need refund of discount"' },
      { channel: 'Ticket', text: '"referral bonus missing, system error"' },
    ],
  },
  {
    id: 'FI-005',
    title: 'Organized Fraud Rings',
    channels: { chat: true, email: true, ticket: true, voice: true, social: true },
    consistency: 91,
    signature: {
      phrases: [
        'repeated script phrases across users',
        'same opening line',
        'synchronized complaint timestamps',
        'identical photo evidence',
        'coordinated review attacks',
      ],
    },
    snippets: [
      { channel: 'Chat', text: '"received empty box, weight mismatch detected"' },
      { channel: 'Email', text: '"package arrived empty, clearly tampered"' },
      { channel: 'Voice', text: '"box was empty when delivered, need immediate refund"' },
      { channel: 'Ticket', text: '"opened box on video, nothing inside except packing material"' },
      { channel: 'Social', text: '"Posting unboxing video showing empty package - refund now or go viral"' },
    ],
  },
  {
    id: 'FI-006',
    title: 'Reputation Ransom Attacks',
    channels: { chat: true, email: true, ticket: true, voice: false, social: true },
    consistency: 67,
    signature: {
      phrases: [
        '"I\'ll post this everywhere"',
        'social virality threats',
        'review extortion language',
        'negative rating warnings',
      ],
    },
    snippets: [
      { channel: 'Social', text: '"I\'ll make this viral if no refund"' },
      { channel: 'Chat', text: '"refund or I tweet this now"' },
      { channel: 'Email', text: '"post goes live if no response today"' },
      { channel: 'Ticket', text: '"Filing consumer complaint and 1-star review unless resolved in 24h"' },
    ],
  },
  {
    id: 'FI-007',
    title: 'Refund-as-a-Service (RaaS)',
    channels: { chat: true, email: true, ticket: true, voice: true, social: true },
    consistency: 88,
    signature: {
      phrases: [
        'refund templates',
        'identical refund justification lines',
        '"agent earlier confirmed refund" (copy-pasted)',
        'professional fraud terminology',
        'scripted escalation paths',
      ],
    },
    snippets: [
      { channel: 'Chat', text: '"agent earlier confirmed refund, processing delay?"' },
      { channel: 'Email', text: '"refund was approved but not credited to account"' },
      { channel: 'Ticket', text: '"previous agent said refund initiated, status?"' },
      { channel: 'Voice', text: '"I was told refund is approved, need ticket number for bank"' },
      { channel: 'Social', text: '"DM me immediately, your agent promised refund but not received"' },
    ],
  },
  {
    id: 'FI-008',
    title: 'Cross-Channel Arbitration',
    channels: { chat: true, email: true, ticket: true, voice: false, social: false },
    consistency: 52,
    signature: {
      phrases: [
        'different stories in chat vs email',
        'repeated mentions of "other agent"',
        'hopping channels to bypass rejections',
      ],
    },
    snippets: [
      { channel: 'Chat', text: '"chatbot denied, calling support now"' },
      { channel: 'Email', text: '"different story in email vs chat, need resolution"' },
      { channel: 'Ticket', text: '"other agent said this would be approved"' },
    ],
  },
];

export default function CrossChannelFraudConsistencyWheel() {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const getChannelCount = (channels: ChannelPresence): number => {
    return Object.values(channels).filter(Boolean).length;
  };

  const getConsistencyColor = (consistency: number): string => {
    if (consistency >= 80) return '#EF4444'; // Red - High consistency (syndicated)
    if (consistency >= 60) return '#F97316'; // Orange - Moderate consistency
    if (consistency >= 40) return '#F59E0B'; // Amber - Low consistency
    return '#10B981'; // Green - Very low consistency (random)
  };

  return (
    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-5 h-[600px] shadow-lg shadow-black/30 flex flex-col">
      {/* Header - Sticky */}
      <div className="flex flex-col gap-3 mb-4 flex-shrink-0 sticky top-0 bg-[#0a0a0f] z-10 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Cross-Channel Fraud Consistency Index</h3>
            <p className="text-gray-500 text-[10px]">Pattern recurrence across communication channels</p>
          </div>
        </div>
        
        {/* Channel Indicator Legend - Single Line */}
        <div className="flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-thin">
          {channelOrder.map((channel) => {
            const Icon = channelIcons[channel];
            return (
              <div key={channel} className="flex items-center gap-1 flex-shrink-0">
                <span
                  className="text-sm leading-none"
                  style={{ color: channelColors[channel] }}
                >
                  ⬤
                </span>
                <Icon className="w-2.5 h-2.5 text-gray-400" />
                <span className="text-gray-400 text-[8px] whitespace-nowrap">{channelLabels[channel]}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            <span className="text-sm leading-none text-gray-600">○</span>
            <span className="text-gray-400 text-[8px] whitespace-nowrap">= Absent</span>
          </div>
        </div>
      </div>

      {/* Main Content: Wheel + Details - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {fraudPatternsData.map((pattern) => {
          const channelCount = getChannelCount(pattern.channels);
          const isExpanded = selectedPattern === pattern.id;
          const consistencyColor = getConsistencyColor(pattern.consistency);

          return (
            <div
              key={pattern.id}
              className={`rounded-xl transition-all border ${
                isExpanded
                  ? 'bg-blue-500/10 border-blue-500/30 shadow-md shadow-blue-900/30'
                  : 'bg-[#0d0d14] border-white/5 hover:border-white/10'
              }`}
            >
              {/* Pattern Row Header */}
              <div
                onClick={() => setSelectedPattern(isExpanded ? null : pattern.id)}
                className="p-3.5 cursor-pointer"
              >
                <div className="space-y-2">
                  {/* Row 1: [Pattern Title] [Channel Dots] */}
                  <div className="flex items-center justify-between gap-2">
                    {/* Left: Pattern Title and Channel Count */}
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <h4 className="text-white text-sm font-semibold truncate">{pattern.title}</h4>
                      <span className="text-gray-500 text-[10px] whitespace-nowrap">({channelCount} channels)</span>
                    </div>
                    
                    {/* Right: Channel Consistency Indicators */}
                    <div className="flex-shrink-0 flex items-center gap-0.5">
                      {channelOrder.map((channel) => {
                        const isPresent = pattern.channels[channel];
                        return (
                          <span
                            key={channel}
                            className="text-base leading-none"
                            style={{
                              color: isPresent ? channelColors[channel] : '#6B7280',
                            }}
                            title={`${channelLabels[channel]}: ${isPresent ? 'Present' : 'Absent'}`}
                          >
                            {isPresent ? '⬤' : '○'}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 2: Pattern Strength */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-[9px] uppercase whitespace-nowrap">Pattern Strength:</span>
                    <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pattern.consistency}%`,
                          backgroundColor: consistencyColor,
                        }}
                      />
                    </div>
                    <span className="text-white text-[10px] font-medium whitespace-nowrap flex-shrink-0">{pattern.consistency}%</span>
                  </div>

                  {/* Row 3: Channel Indicators */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {channelOrder.map((channel) => {
                      const Icon = channelIcons[channel];
                      const isPresent = pattern.channels[channel];
                      return (
                        <div
                          key={channel}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                            isPresent
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-white/5 text-gray-600 border border-white/5'
                          }`}
                        >
                          <Icon className="w-2.5 h-2.5" />
                          <span className="text-[9px]">{channelLabels[channel]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-3.5 border-t border-white/5 space-y-3">
                  {/* Pattern Signatures */}
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Pattern Signature</div>
                    <div className="space-y-1">
                      {pattern.signature.phrases.map((phrase, idx) => (
                        <div key={idx} className="text-gray-300 text-[11px] leading-relaxed">
                          • {phrase}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pattern Snippet Triangulation */}
                  <div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">Cross-Channel Evidence</div>
                    <div className="space-y-2">
                      {pattern.snippets.map((snippet, idx) => {
                        const channelKey = channelLabelToKey[snippet.channel];
                        const Icon = channelKey ? channelIcons[channelKey] : MessageSquare;
                        return (
                          <div
                            key={idx}
                            className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-start gap-2"
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="p-1 bg-blue-500/20 rounded">
                                <Icon className="w-3 h-3 text-blue-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-gray-400 text-[9px] uppercase mb-0.5">{snippet.channel}</div>
                              <div className="text-gray-300 text-[11px] leading-relaxed italic">"{snippet.text}"</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Operational Insight</div>
                    <div className="text-gray-300 text-[11px] leading-relaxed">
                      {pattern.consistency >= 80
                        ? `High pattern consistency (${pattern.consistency}%) indicates coordinated or syndicated fraud across ${channelCount} channels.`
                        : pattern.consistency >= 60
                        ? `Moderate consistency (${pattern.consistency}%) suggests some coordination, but behavior varies across channels.`
                        : `Low consistency (${pattern.consistency}%) indicates channel-specific fraud patterns rather than cross-channel coordination.`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
