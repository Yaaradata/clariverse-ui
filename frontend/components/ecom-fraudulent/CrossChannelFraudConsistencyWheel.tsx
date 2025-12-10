'use client';

import { useState, useEffect } from 'react';
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    window.addEventListener('storage', checkTheme);
    
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);

  const containerBg = isDarkMode ? 'rgb(13, 13, 13)' : 'rgb(255, 255, 255)';
  const containerBorder = isDarkMode ? 'rgb(31, 31, 31)' : 'rgb(229, 231, 235)';
  const textColor = isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(17, 24, 39)';
  const subtextColor = isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(75, 85, 99)';
  const labelColor = isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(75, 85, 99)';
  const summaryBg = isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgb(243, 244, 246)';
  const summaryBorder = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgb(209, 213, 219)';
  const summaryTextColor = isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)';

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
    <div 
      className="rounded-xl p-5 md:p-6 h-[670px] shadow-sm flex flex-col"
      style={{ backgroundColor: containerBg, border: `1px solid ${containerBorder}` }}
    >
      {/* Header */}
      <div 
        className="flex flex-col gap-3 mb-4 flex-shrink-0 pb-2"
        style={{ backgroundColor: containerBg }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="p-1.5 rounded-lg border"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.125)' : 'rgba(59, 130, 246, 0.12)',
              borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'
            }}
          >
            <Layers className="w-4 h-4" style={{ color: 'rgb(59, 130, 246)' }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: textColor }}>Cross-Channel Fraud Consistency Index</h3>
            <p className="text-[10px]" style={{ color: subtextColor }}>Pattern recurrence across communication channels</p>
          </div>
        </div>
        
        {/* Channel Indicator Legend - Single Line */}
        <div 
          className="flex items-center gap-2 flex-nowrap overflow-x-auto hide-scrollbar"
        >
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
                <Icon className="w-2.5 h-2.5" style={{ color: subtextColor }} />
                <span className="text-[8px] whitespace-nowrap" style={{ color: subtextColor }}>{channelLabels[channel]}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            <span className="text-sm leading-none" style={{ color: subtextColor }}>○</span>
            <span className="text-[8px] whitespace-nowrap" style={{ color: subtextColor }}>= Absent</span>
          </div>
        </div>
      </div>

      {/* Main Content: Wheel + Details - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-visible">
        {fraudPatternsData.map((pattern) => {
          const channelCount = getChannelCount(pattern.channels);
          const isExpanded = selectedPattern === pattern.id;
          const consistencyColor = getConsistencyColor(pattern.consistency);

          return (
            <div
              key={pattern.id}
              className={`rounded-xl border cursor-pointer ${
                isExpanded ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: isExpanded 
                  ? (isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(239, 246, 255, 0.9)')
                  : (isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.9)'),
                borderColor: isExpanded
                  ? (isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)')
                  : containerBorder
              }}
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
                      <h4 className="text-sm font-semibold truncate" style={{ color: textColor }}>{pattern.title}</h4>
                      <span className="text-[10px] whitespace-nowrap" style={{ color: subtextColor }}>({channelCount} channels)</span>
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
                    <span className="text-[9px] uppercase whitespace-nowrap" style={{ color: labelColor }}>Pattern Strength:</span>
                    <div 
                      className="flex-1 rounded-full h-1.5 overflow-hidden"
                      style={{ backgroundColor: summaryBg }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pattern.consistency}%`,
                          backgroundColor: consistencyColor,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-medium whitespace-nowrap flex-shrink-0" style={{ color: textColor }}>{pattern.consistency}%</span>
                  </div>

                  {/* Row 3: Channel Indicators */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {channelOrder.map((channel) => {
                      const Icon = channelIcons[channel];
                      const isPresent = pattern.channels[channel];
                      return (
                        <div
                          key={channel}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: isPresent
                              ? (isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 246, 255, 0.9)')
                              : summaryBg,
                            borderColor: isPresent
                              ? (isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)')
                              : summaryBorder,
                            color: isPresent
                              ? (isDarkMode ? 'rgb(147, 197, 253)' : 'rgb(37, 99, 235)')
                              : summaryTextColor
                          }}
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
                <div className="px-4 pb-4 pt-3.5 space-y-3" style={{ borderTop: `1px solid ${containerBorder}` }}>
                  {/* Pattern Signatures */}
                  <div 
                    className="rounded-lg p-3 border"
                    style={{ 
                      backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(239, 246, 255, 0.9)',
                      borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'
                    }}
                  >
                    <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: labelColor }}>Pattern Signature</div>
                    <div className="space-y-1">
                      {pattern.signature.phrases.map((phrase, idx) => (
                        <div key={idx} className="text-[11px] leading-relaxed" style={{ color: summaryTextColor }}>
                          • {phrase}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pattern Snippet Triangulation */}
                  <div>
                    <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: labelColor }}>Cross-Channel Evidence</div>
                    <div className="space-y-2">
                      {pattern.snippets.map((snippet, idx) => {
                        const channelKey = channelLabelToKey[snippet.channel];
                        const Icon = channelKey ? channelIcons[channelKey] : MessageSquare;
                        return (
                          <div
                            key={idx}
                            className="rounded-lg p-2.5 flex items-start gap-2 border"
                            style={{ 
                              backgroundColor: summaryBg,
                              borderColor: summaryBorder
                            }}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <div 
                                className="p-1 rounded border"
                                style={{ 
                                  backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 246, 255, 0.9)',
                                  borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)'
                                }}
                              >
                                <Icon className="w-3 h-3" style={{ color: 'rgb(59, 130, 246)' }} />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[9px] uppercase mb-0.5" style={{ color: labelColor }}>{snippet.channel}</div>
                              <div className="text-[11px] leading-relaxed italic" style={{ color: summaryTextColor }}>"{snippet.text}"</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div 
                    className="rounded-lg p-2.5 border"
                    style={{ 
                      backgroundColor: summaryBg,
                      borderColor: summaryBorder
                    }}
                  >
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: labelColor }}>Operational Insight</div>
                    <div className="text-[11px] leading-relaxed" style={{ color: summaryTextColor }}>
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

      {/* Scrollbar styles */}
      <style jsx>{`
        .scrollbar-visible::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-visible::-webkit-scrollbar-track {
          background: ${isDarkMode ? 'rgb(39, 39, 42)' : 'rgb(243, 244, 246)'};
          border-radius: 4px;
        }
        .scrollbar-visible::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgb(107, 114, 128)' : 'rgb(156, 163, 175)'};
          border-radius: 4px;
        }
        .scrollbar-visible::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)'};
        }
        .scrollbar-visible {
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: ${isDarkMode ? 'rgb(107, 114, 128) rgb(39, 39, 42)' : 'rgb(156, 163, 175) rgb(243, 244, 246)'}; /* Firefox */
        }
      `}</style>
    </div>
  );
}
