'use client';

import { useState } from 'react';
import { Calendar, MessageSquare, Phone, Mail, Ticket, Globe, AlertTriangle } from 'lucide-react';

type TimeRange = '24h' | '7d' | '30d';
type Channel = 'all' | 'chat' | 'voice' | 'email' | 'tickets' | 'social';
type Severity = 'all' | 'critical' | 'high' | 'medium' | 'low';

interface FraudFiltersStripProps {
  onTimeRangeChange?: (range: TimeRange) => void;
  onChannelChange?: (channel: Channel) => void;
  onSeverityChange?: (severity: Severity) => void;
}

export default function FraudFiltersStrip({ 
  onTimeRangeChange, 
  onChannelChange, 
  onSeverityChange 
}: FraudFiltersStripProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [channel, setChannel] = useState<Channel>('all');
  const [severity, setSeverity] = useState<Severity>('all');

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const handleChannelChange = (ch: Channel) => {
    setChannel(ch);
    onChannelChange?.(ch);
  };

  const handleSeverityChange = (sev: Severity) => {
    setSeverity(sev);
    onSeverityChange?.(sev);
  };

  const timeRanges = [
    { key: '24h' as TimeRange, label: 'Last 24 Hours' },
    { key: '7d' as TimeRange, label: '7 Days' },
    { key: '30d' as TimeRange, label: '30 Days' },
  ];

  const channels = [
    { key: 'all' as Channel, label: 'All', icon: null },
    { key: 'chat' as Channel, label: 'Chat', icon: <MessageSquare className="w-3 h-3" /> },
    { key: 'voice' as Channel, label: 'Voice', icon: <Phone className="w-3 h-3" /> },
    { key: 'email' as Channel, label: 'Email', icon: <Mail className="w-3 h-3" /> },
    { key: 'tickets' as Channel, label: 'Tickets', icon: <Ticket className="w-3 h-3" /> },
    { key: 'social' as Channel, label: 'Social', icon: <Globe className="w-3 h-3" /> },
  ];

  const severities = [
    { key: 'all' as Severity, label: 'All', color: 'bg-white/10 text-gray-300' },
    { key: 'critical' as Severity, label: 'Critical', color: 'bg-red-500/20 text-red-400' },
    { key: 'high' as Severity, label: 'High', color: 'bg-orange-500/20 text-orange-400' },
    { key: 'medium' as Severity, label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400' },
    { key: 'low' as Severity, label: 'Low', color: 'bg-blue-500/20 text-blue-400' },
  ];

  return (
    <div className="bg-[#0a0a0f]/95 backdrop-blur-lg border-b border-white/10 py-3 px-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Time Range */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div className="flex gap-1">
            {timeRanges.map(t => (
              <button
                key={t.key}
                onClick={() => handleTimeRangeChange(t.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  timeRange === t.key
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Channel Filter */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs">Channel:</span>
          <div className="flex gap-1">
            {channels.map(ch => (
              <button
                key={ch.key}
                onClick={() => handleChannelChange(ch.key)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                  channel === ch.key
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-gray-400 border border-white/10 hover:bg-white/5'
                }`}
              >
                {ch.icon}
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-gray-500" />
          <div className="flex gap-1">
            {severities.map(sev => (
              <button
                key={sev.key}
                onClick={() => handleSeverityChange(sev.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all border ${
                  severity === sev.key
                    ? `${sev.color} border-current`
                    : 'text-gray-400 border-white/10 hover:bg-white/5'
                }`}
              >
                {sev.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
