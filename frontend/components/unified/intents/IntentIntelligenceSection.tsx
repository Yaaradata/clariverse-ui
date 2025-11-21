import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getEmotionShockboardData, type EmotionShockboardEntry } from "@/lib/unified/emotionShockboardData";
import {
  getEntityBubbleData,
  type EntityBubbleData,
  type EntityBubble,
} from "@/lib/unified/patternRecognitionData";

interface IntentIntelligenceSectionProps {
  clusters: unknown[];
  severityMatrix: unknown[];
  selectedIntentId: string | null;
  onIntentSelect: (intentId: string | null) => void;
}

type ShockBar = EmotionShockboardEntry;

type ShockEvent = {
  id: string;
  tone: "critical" | "warning" | "positive";
  channel: string;
  spike: number;
  shiftType: string;
  intent: string;
  cause: string;
  suggestion: string;
};

type ResolutionIssueTone = "danger" | "warning" | "info";

type ResolutionIssue = {
  id: string;
  title: string;
  intent: string;
  summary: string;
  recommendation: string;
  tone: ResolutionIssueTone;
};

const tooltipStyles = {
  backgroundColor: "#0f172a",
  borderRadius: "12px",
  border: "1px solid #334155",
  maxWidth: "280px",
};

const EmotionTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload as EmotionShockboardEntry & {
    positiveValue: number;
    negativeValue: number;
  };
  if (!entry) return null;

  const renderList = (title: string, topics: string[], colorClass: string) => (
    <div>
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${colorClass}`}>{title}</p>
      {topics.length === 0 ? (
        <p className="text-[11px] text-gray-400">No standout clusters</p>
      ) : (
        <ul className="list-disc list-inside text-[11px] text-gray-100 space-y-0.5">
          {topics.map((topic) => (
            <li key={`${title}-${topic}`}>{topic}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-3 text-xs text-gray-200 space-y-2" style={tooltipStyles}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{entry.label}</p>
        <div className="text-[11px] text-gray-400">
          Total:{" "}
          <span className="text-white font-semibold">
            {(entry.positive + entry.negative).toLocaleString()} threads
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold text-emerald-300">Positive</p>
          <p className="text-sm font-semibold text-white">{entry.positive.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-rose-300">Negative</p>
          <p className="text-sm font-semibold text-white">{entry.negative.toLocaleString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderList("Top positive clusters", entry.topPositive, "text-emerald-300")}
        {renderList("Top negative clusters", entry.topNegative, "text-rose-300")}
      </div>
    </div>
  );
};

export function EmotionShockboard({
  bars = emotionShockBars,
  events = emotionShockEvents,
}: {
  bars?: ShockBar[];
  events?: ShockEvent[];
} = {}) {
  const chartData = useMemo(
    () =>
      bars.map((entry) => ({
        ...entry,
        positiveValue: entry.positive,
        negativeValue: entry.negative * -1,
      })),
    [bars],
  );

  const maxMagnitude = Math.max(
    10,
    ...chartData.map((entry) => Math.max(entry.positiveValue, entry.negativeValue * -1))
  );
  const domain = [-Math.ceil(maxMagnitude * 1.2), Math.ceil(maxMagnitude * 1.2)];

  return (
    <Card className="border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-lg shadow-indigo-500/10 transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-[color:var(--background)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">⚡ Cross-Channel Emotion Shockboard</h2>
        </div>
        <Badge className="border-rose-400/40 bg-rose-500/10 text-rose-100">Emotion Alerts</Badge>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-white/15 bg-[rgba(26,26,26,0.6)] p-6 pb-8">
          <div className="flex items-start justify-between text-xs uppercase tracking-wide text-gray-400">
            <span>Channel Emotion Shock Score</span>
            <span>Higher = larger sentiment spike with urgency</span>
          </div>
          <div className="mt-2 h-90">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 16, left: 16, bottom: 32 }}
                barCategoryGap={24}
              >
                <defs>
                  <linearGradient id="emotionPositiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="emotionNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                    <stop offset="100%" stopColor="#9f1239" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#cbd5f5", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${Math.abs(Number(value)).toLocaleString()}`}
                  domain={domain as [number, number]}
                />
                <ReferenceLine y={0} stroke="#475569" />
                <Tooltip content={<EmotionTooltip />} cursor={{ fill: "#1e293b55" }} />
                <Bar
                  dataKey="positiveValue"
                  name="Positive volume"
                  radius={[6, 6, 0, 0]}
                  fill="url(#emotionPositiveGradient)"
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="negativeValue"
                  name="Negative volume"
                  radius={[0, 0, 6, 6]}
                  fill="url(#emotionNegativeGradient)"
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
            Channel-Specific Emotion Alerts
          </div>
          {events.map((event, index) => {
            const alertLabel = event.tone === "critical" ? "SHOCK" : event.tone === "warning" ? "SURGE" : "COOLING";
            const alertIcon = event.tone === "critical" ? "🔴" : event.tone === "warning" ? "🟠" : "🟢";
            return (
              <div
                key={event.id}
                className="rounded-2xl border border-white/10 bg-[rgba(26,26,26,0.55)] px-4 py-4 text-sm text-gray-200 shadow-inner transition hover:border-[#b90abd]/40 hover:bg-[color:var(--background)]"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-wide mb-2">
                  <span className="font-semibold text-gray-300">
                    {alertIcon} {alertLabel} #{index + 1}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-white">
                    {event.channel} → {event.spike > 0 ? "+" : ""}
                    {event.spike.toFixed(1)} shift <span className="text-gray-400 font-normal">({event.shiftType})</span>
                  </p>
                  <p className="text-xs text-gray-300">
                    Triggered Intent: <span className="font-semibold text-indigo-200">{event.intent}</span>
                  </p>
                  <p className="text-xs text-gray-400">{event.cause}</p>
                  <p className="text-xs text-purple-300">⚡ {event.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export function ResolutionIntegrityMonitor({
  score = resolutionIntegrityScore.score,
  delta = resolutionIntegrityScore.delta,
  issues = resolutionIntegrityIssues,
}: {
  score?: number;
  delta?: number;
  issues?: ResolutionIssue[];
} = {}) {
  const scoreRotation = (Math.max(0, Math.min(score, 100)) / 100) * 360;
  const deltaColor = delta >= 0 ? "text-emerald-300" : "text-rose-300";
  const deltaLabel = delta >= 0 ? `▲ ${delta}` : `▼ ${Math.abs(delta)}`;
  const issueToneClasses: Record<ResolutionIssueTone, string> = {
    danger: "border-rose-400/30 bg-rose-500/10 text-rose-100",
    warning: "border-amber-400/30 bg-amber-500/10 text-amber-100",
    info: "border-indigo-400/30 bg-indigo-500/10 text-indigo-100",
  };

  return (
    <Card className="border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:border-[#b90abd]/40 hover:bg-[color:var(--background)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">🛡️ Cross-Channel Resolution Integrity Monitor</h2>
          <p className="text-sm text-gray-300">Flags contradictory resolutions, loops, and accountability mismatches across channels.</p>
        </div>
        <Badge className="border-emerald-400/40 bg-emerald-500/10 text-emerald-100">Resolution QA</Badge>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,1.55fr)]">
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-[rgba(26,26,26,0.6)] p-6">
          <div className="relative h-36 w-36">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#34d399 ${scoreRotation}deg, rgba(148,163,184,0.15) ${scoreRotation}deg)`,
              }}
            />
            <div className="absolute inset-3 rounded-full bg-[rgba(12,12,12,0.85)] backdrop-blur-sm" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center text-sm text-gray-300">
              <span className="text-[11px] uppercase tracking-wide text-gray-400">Integrity Score</span>
              <span className="text-3xl font-semibold text-white">{score}</span>
              <span className={`text-[11px] font-medium uppercase tracking-wide ${deltaColor}`}>{deltaLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-2xl border border-white/10 bg-[rgba(26,26,26,0.55)] p-5 text-sm text-gray-200 shadow-inner"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
                <span className={`rounded-full px-2 py-0.5 ${issueToneClasses[issue.tone]}`}>{issue.title}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-gray-300">
                  Intent: {issue.intent}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-200">{issue.summary}</p>
              <p className="mt-2 text-xs text-purple-300">✨ {issue.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

type ChannelKey = "email" | "chat" | "ticket" | "social" | "voice" | "all";

export function PatternRecognitionEngine() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelKey>("email");
  const [hoveredEntity, setHoveredEntity] = useState<EntityBubble | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const allData = useMemo(() => getEntityBubbleData(), []);

  const channelIcons = {
    email: "📧",
    voice: "🎧",
    chat: "💬",
    social: "🌐",
    ticket: "🎟",
  };

  const channelLabels: Record<ChannelKey, string> = {
    email: "Email",
    chat: "Chat",
    ticket: "Ticket",
    social: "Social Media",
    voice: "Voice",
    all: "All Channels",
  };

  // Filter entities based on selected channel
  const filteredEntities = useMemo(() => {
    return allData.entities.filter((entity) => entity.channels[selectedChannel]);
  }, [allData.entities, selectedChannel]);

  const svgWidth = 800;
  const svgHeight = 600;

  // Recalculate positions for filtered entities using X/Y axes (Frequency vs Severity)
  const dataWithPositions = useMemo(() => {
    if (filteredEntities.length === 0) {
      const marginLeft = 80;
      const marginRight = 40;
      const marginTop = 40;
      const marginBottom = 80;
      const plotWidth = svgWidth - marginLeft - marginRight;
      const plotHeight = svgHeight - marginTop - marginBottom;
      const maxBubbleRadius = 100;
      const safePlotWidth = plotWidth - maxBubbleRadius * 2;
      const safePlotHeight = plotHeight - maxBubbleRadius * 2;
      const safeMarginLeft = marginLeft + maxBubbleRadius;
      const safeMarginTop = marginTop + maxBubbleRadius;
      
      return {
        entities: [],
        aiInsight: allData.aiInsight,
        aiRecommendedAction: allData.aiRecommendedAction,
        minFreq: 0,
        maxFreq: 1000,
        minSev: 0,
        maxSev: 10,
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        plotWidth,
        plotHeight,
        safeMarginLeft,
        safeMarginTop,
        safePlotWidth,
        safePlotHeight,
      };
    }

    const entities = filteredEntities.map((e) => ({ ...e }));
    
    // Calculate min/max for scaling
    const frequencies = entities.map((e) => e.frequency);
    const severities = entities.map((e) => e.severity);
    const minFreq = Math.min(...frequencies);
    const maxFreq = Math.max(...frequencies);
    const minSev = Math.min(...severities);
    const maxSev = Math.max(...severities);
    
    // Add padding to ranges
    const freqRange = maxFreq - minFreq || 100;
    const sevRange = maxSev - minSev || 2;
    const paddedMinFreq = Math.max(0, minFreq - freqRange * 0.1);
    const paddedMaxFreq = maxFreq + freqRange * 0.1;
    const paddedMinSev = Math.max(0, minSev - sevRange * 0.1);
    const paddedMaxSev = Math.min(10, maxSev + sevRange * 0.1);
    
    // SVG plot area (with margins for axes)
    const marginLeft = 80;
    const marginRight = 40;
    const marginTop = 40;
    const marginBottom = 80;
    const plotWidth = svgWidth - marginLeft - marginRight;
    const plotHeight = svgHeight - marginTop - marginBottom;
    
    // Map frequency to X-axis, severity to Y-axis (inverted Y so high severity is at top)
    // Constrain positions to keep bubbles within plot area (account for max bubble radius of 100)
    const maxBubbleRadius = 100;
    const safePlotWidth = plotWidth - maxBubbleRadius * 2;
    const safePlotHeight = plotHeight - maxBubbleRadius * 2;
    const safeMarginLeft = marginLeft + maxBubbleRadius;
    const safeMarginTop = marginTop + maxBubbleRadius;
    
    entities.forEach((entity) => {
      const normalizedFreq = (entity.frequency - paddedMinFreq) / (paddedMaxFreq - paddedMinFreq);
      const normalizedSev = (entity.severity - paddedMinSev) / (paddedMaxSev - paddedMinSev);
      
      // Clamp normalized values to [0, 1] to ensure bubbles stay within bounds
      const clampedFreq = Math.max(0, Math.min(1, normalizedFreq));
      const clampedSev = Math.max(0, Math.min(1, normalizedSev));
      
      entity.x = safeMarginLeft + clampedFreq * safePlotWidth;
      entity.y = safeMarginTop + (1 - clampedSev) * safePlotHeight; // Inverted Y
    });

    return {
      entities,
      aiInsight: allData.aiInsight,
      aiRecommendedAction: allData.aiRecommendedAction,
      minFreq: paddedMinFreq,
      maxFreq: paddedMaxFreq,
      minSev: paddedMinSev,
      maxSev: paddedMaxSev,
      marginLeft,
      marginRight,
      marginTop,
      marginBottom,
      plotWidth,
      plotHeight,
      safeMarginLeft,
      safeMarginTop,
      safePlotWidth,
      safePlotHeight,
    };
  }, [filteredEntities, allData.aiInsight, allData.aiRecommendedAction, svgWidth, svgHeight]);

  const getSeverityColor = (severity: number) => {
    // Severity 0-10, map to color gradient: green → yellow → orange → red
    if (severity >= 8) return "#ef4444"; // Red - critical
    if (severity >= 6) return "#f97316"; // Orange - high
    if (severity >= 4) return "#eab308"; // Yellow - medium
    return "#22c55e"; // Green - low
  };

  const getBubbleSize = (frequency: number) => {
    // Frequency determines bubble radius (min 40, max 100)
    if (dataWithPositions.entities.length === 0) return 40;
    const minFreq = Math.min(...dataWithPositions.entities.map((e) => e.frequency));
    const maxFreq = Math.max(...dataWithPositions.entities.map((e) => e.frequency));
    if (maxFreq === minFreq) return 50;
    const normalized = (frequency - minFreq) / (maxFreq - minFreq);
    return 40 + normalized * 60;
  };

  const getSeverityLabel = (entity: EntityBubble) => {
    if (entity.severity >= 8) return "Critical Severity";
    if (entity.severity >= 6) return "High Severity";
    if (entity.severity >= 4) return "Medium Severity";
    return "Low Severity";
  };

  return (
    <Card className="border border-[color:var(--border)] bg-[color:var(--card)] p-8 shadow-lg shadow-purple-500/10 rounded-xl">
      {/* Title Section */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Entity Bubble Cluster</h2>
        <p className="text-base text-gray-300">Real-Time Painpoints Across Channels (Email • Voice • Chat • Social • Ticket)</p>
      </div>

      {/* Channel Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {(["email", "chat", "ticket", "social", "voice"] as ChannelKey[]).map((channel) => (
            <button
              key={channel}
              onClick={() => setSelectedChannel(channel)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
                selectedChannel === channel
                  ? "border-[#b90abd]/70 bg-gradient-to-r from-[#b90abd]/20 to-[#5332ff]/10 text-white shadow-lg"
                  : "border-white/10 bg-black/20 text-gray-300 hover:border-[#b90abd]/40 hover:text-white"
              }`}
            >
              {channelIcons[channel]} {channelLabels[channel]}
            </button>
          ))}
        </div>
      </div>

      {/* Bubble Cluster Visualization with Channel Insights Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 mb-6">
        {/* Bubble Plot */}
        <div className="rounded-lg border border-white/10 bg-[rgba(26,26,26,0.4)] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Bubble Cluster Visualization
            <span className="ml-2 text-sm text-gray-400">({channelLabels[selectedChannel]})</span>
          </h3>
          <div className="relative">
            {dataWithPositions.entities.length === 0 ? (
              <div className="flex items-center justify-center h-[600px] text-gray-400">
                <p>No entities found for {channelLabels[selectedChannel]}</p>
              </div>
            ) : (
              <svg width={svgWidth} height={svgHeight} className="w-full h-auto">
              <defs>
                <filter id="bubbleGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="bubblePulse">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </filter>
              </defs>

              {/* Grid lines */}
              <g id="grid" stroke="#374151" strokeWidth="1" strokeDasharray="2,2" opacity="0.5">
                {/* Vertical grid lines (Frequency) */}
                {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                  const x = dataWithPositions.marginLeft + tick * dataWithPositions.plotWidth;
                  return (
                    <line
                      key={`v-${tick}`}
                      x1={x}
                      y1={dataWithPositions.marginTop}
                      x2={x}
                      y2={dataWithPositions.marginTop + dataWithPositions.plotHeight}
                    />
                  );
                })}
                {/* Horizontal grid lines (Severity) */}
                {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                  const y = dataWithPositions.marginTop + tick * dataWithPositions.plotHeight;
                  return (
                    <line
                      key={`h-${tick}`}
                      x1={dataWithPositions.marginLeft}
                      y1={y}
                      x2={dataWithPositions.marginLeft + dataWithPositions.plotWidth}
                      y2={y}
                    />
                  );
                })}
              </g>

              {/* X-axis (Frequency) */}
              <line
                x1={dataWithPositions.marginLeft}
                y1={dataWithPositions.marginTop + dataWithPositions.plotHeight}
                x2={dataWithPositions.marginLeft + dataWithPositions.plotWidth}
                y2={dataWithPositions.marginTop + dataWithPositions.plotHeight}
                stroke="#9ca3af"
                strokeWidth="2"
              />
              {/* X-axis label */}
              <text
                x={dataWithPositions.marginLeft + dataWithPositions.plotWidth / 2}
                y={svgHeight - 10}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="14"
                fontWeight="600"
              >
                Frequency (Issue Count)
              </text>
              {/* X-axis ticks and labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                const x = dataWithPositions.marginLeft + tick * dataWithPositions.plotWidth;
                const value = dataWithPositions.minFreq + tick * (dataWithPositions.maxFreq - dataWithPositions.minFreq);
                return (
                  <g key={`x-tick-${tick}`}>
                    <line
                      x1={x}
                      y1={dataWithPositions.marginTop + dataWithPositions.plotHeight}
                      x2={x}
                      y2={dataWithPositions.marginTop + dataWithPositions.plotHeight + 5}
                      stroke="#9ca3af"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={dataWithPositions.marginTop + dataWithPositions.plotHeight + 20}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize="11"
                    >
                      {Math.round(value)}
                    </text>
                  </g>
                );
              })}

              {/* Y-axis (Severity) */}
              <line
                x1={dataWithPositions.marginLeft}
                y1={dataWithPositions.marginTop}
                x2={dataWithPositions.marginLeft}
                y2={dataWithPositions.marginTop + dataWithPositions.plotHeight}
                stroke="#9ca3af"
                strokeWidth="2"
              />
              {/* Y-axis label */}
              <text
                x={20}
                y={dataWithPositions.marginTop + dataWithPositions.plotHeight / 2}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="14"
                fontWeight="600"
                transform={`rotate(-90, 20, ${dataWithPositions.marginTop + dataWithPositions.plotHeight / 2})`}
              >
                Severity (0-10)
              </text>
              {/* Y-axis ticks and labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                const y = dataWithPositions.marginTop + tick * dataWithPositions.plotHeight;
                const value = dataWithPositions.maxSev - tick * (dataWithPositions.maxSev - dataWithPositions.minSev);
                return (
                  <g key={`y-tick-${tick}`}>
                    <line
                      x1={dataWithPositions.marginLeft}
                      y1={y}
                      x2={dataWithPositions.marginLeft - 5}
                      y2={y}
                      stroke="#9ca3af"
                      strokeWidth="2"
                    />
                    <text
                      x={dataWithPositions.marginLeft - 10}
                      y={y + 4}
                      textAnchor="end"
                      fill="#9ca3af"
                      fontSize="11"
                    >
                      {value.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Bubbles */}
              {dataWithPositions.entities.map((entity) => {
              if (!entity.x || !entity.y) return null;

              const bubbleSize = getBubbleSize(entity.frequency);
              const bubbleColor = getSeverityColor(entity.severity);
              const filterId = entity.trend === "rising" ? "bubblePulse" : "bubbleGlow";

              return (
                <g key={entity.id}>
                  {/* Bubble circle */}
                  <circle
                    cx={entity.x}
                    cy={entity.y}
                    r={bubbleSize}
                    fill={bubbleColor}
                    fillOpacity={0.6}
                    stroke={bubbleColor}
                    strokeWidth={2}
                    filter={`url(#${filterId})`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      const svg = e.currentTarget.ownerSVGElement;
                      const container = svg?.parentElement;
                      if (container) {
                        const containerRect = container.getBoundingClientRect();
                        const svgRect = svg.getBoundingClientRect();
                        setTooltipPosition({
                          x: e.clientX - containerRect.left,
                          y: e.clientY - containerRect.top,
                        });
                        setHoveredEntity(entity);
                      }
                    }}
                    onMouseMove={(e) => {
                      const svg = e.currentTarget.ownerSVGElement;
                      const container = svg?.parentElement;
                      if (container) {
                        const containerRect = container.getBoundingClientRect();
                        setTooltipPosition({
                          x: e.clientX - containerRect.left,
                          y: e.clientY - containerRect.top,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredEntity(null);
                      setTooltipPosition(null);
                    }}
                  />

                  {/* Entity name */}
                  <text
                    x={entity.x}
                    y={entity.y - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffffff"
                    fontSize="16"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {entity.name}
                  </text>

                  {/* AI summary subtext */}
                  <text
                    x={entity.x}
                    y={entity.y + 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="semibold"
                    className="pointer-events-none"
                  >
                    {entity.trend === "rising" && entity.trendPercentage
                      ? `↑ ${entity.trendPercentage}%`
                      : getSeverityLabel(entity)}
                  </text>
                </g>
              );
            })}
            </svg>
          )}
          {/* Tooltip */}
          {hoveredEntity && tooltipPosition && (
            <div
              className="absolute z-50 rounded-lg border border-white/20 bg-gray-900/95 backdrop-blur-sm p-4 shadow-xl min-w-[240px] max-w-[320px] pointer-events-none"
              style={{
                left: tooltipPosition.x > 500 ? `${tooltipPosition.x - 335}px` : `${tooltipPosition.x + 15}px`,
                top: tooltipPosition.y < 100 ? `${tooltipPosition.y + 20}px` : `${tooltipPosition.y - 10}px`,
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSeverityColor(hoveredEntity.severity) }}
                  />
                  <h4 className="text-base font-bold text-white">{hoveredEntity.name}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Frequency:</span>
                    <span className="ml-1 text-white font-semibold">{hoveredEntity.frequency}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Severity:</span>
                    <span className="ml-1 text-white font-semibold">{hoveredEntity.severity.toFixed(1)}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Trend:</span>
                    <span className={`ml-1 font-semibold ${
                      hoveredEntity.trend === "rising" ? "text-red-400" :
                      hoveredEntity.trend === "declining" ? "text-green-400" : "text-yellow-400"
                    }`}>
                      {hoveredEntity.trend === "rising" && hoveredEntity.trendPercentage
                        ? `↑ ${hoveredEntity.trendPercentage}%`
                        : hoveredEntity.trend === "declining" ? "↓ Declining" : "→ Stable"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-gray-400 text-xs">Channels:</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {(["email", "voice", "chat", "social", "ticket"] as ChannelKey[]).map((channel) => {
                      if (!hoveredEntity.channels[channel]) return null;
                      return (
                        <span key={channel} className="text-xs text-white bg-white/10 px-2 py-1 rounded border border-white/20">
                          {channelLabels[channel]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {hoveredEntity.relatedEntities && hoveredEntity.relatedEntities.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-gray-400 text-xs">Related:</span>
                    <div className="text-white text-xs mt-1">
                      {hoveredEntity.relatedEntities.join(", ")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Channel-Specific Insights - Side Panel */}
        <div className="rounded-lg border border-white/10 bg-[rgba(26,26,26,0.4)] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            📊 Channel Insights
            <span className="ml-2 text-sm text-gray-400">({channelLabels[selectedChannel]})</span>
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {(() => {
                const channelEntities = allData.entities.filter((e) => e.channels[selectedChannel]);
                
                if (channelEntities.length === 0) {
                  return (
                    <div className="rounded-lg border border-white/10 bg-[rgba(26,26,26,0.6)] p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{channelIcons[selectedChannel]}</span>
                        <h4 className="text-sm font-bold text-white">{channelLabels[selectedChannel]}</h4>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        No significant painpoints detected in {channelLabels[selectedChannel]} channel. Continue monitoring for emerging issues.
                      </p>
                    </div>
                  );
                }

                const topEntity = channelEntities.sort((a, b) => b.severity - a.severity)[0];
                const risingEntities = channelEntities.filter((e) => e.trend === "rising");
                const decliningEntities = channelEntities.filter((e) => e.trend === "declining");
                const stableEntities = channelEntities.filter((e) => e.trend === "stable");
                const risingCount = risingEntities.length;
                const avgSeverity = channelEntities.reduce((sum, e) => sum + e.severity, 0) / channelEntities.length;
                const totalFrequency = channelEntities.reduce((sum, e) => sum + e.frequency, 0);
                const maxSeverity = Math.max(...channelEntities.map((e) => e.severity));
                const minSeverity = Math.min(...channelEntities.map((e) => e.severity));
                const criticalEntities = channelEntities.filter((e) => e.severity >= 8);
                const highSeverityEntities = channelEntities.filter((e) => e.severity >= 6 && e.severity < 8);
                const topRisingEntity = risingEntities.sort((a, b) => (b.trendPercentage || 0) - (a.trendPercentage || 0))[0];

                return (
                  <>
                    {/* Insight Container */}
                    <div className="rounded-lg border border-white/10 bg-[rgba(26,26,26,0.6)] p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">{channelIcons[selectedChannel]}</span>
                        <h4 className="text-sm font-bold text-white">{channelLabels[selectedChannel]} • Insight Analysis</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 mb-2">Primary Concern:</p>
                          <p className="text-sm text-gray-200 leading-relaxed mb-3">
                            <span className="font-bold text-white">{topEntity?.name || "Multiple"}</span> issues dominate the {channelLabels[selectedChannel]} channel with a severity rating of <span className="font-semibold text-red-400">{topEntity?.severity.toFixed(1)}/10</span>, representing the highest risk factor among all detected entities.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Total Entities:</p>
                            <p className="text-sm font-bold text-white">{channelEntities.length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Total Frequency:</p>
                            <p className="text-sm font-bold text-white">{totalFrequency.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Avg Severity:</p>
                            <p className="text-sm font-bold text-white">{avgSeverity.toFixed(1)}/10</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Severity Range:</p>
                            <p className="text-sm font-bold text-white">{minSeverity.toFixed(1)} - {maxSeverity.toFixed(1)}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10">
                          <p className="text-xs font-semibold text-gray-400 mb-2">Trend Distribution:</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">Rising Trends:</span>
                              <span className="font-semibold text-red-400">{risingCount} entities</span>
                            </div>
                            {topRisingEntity && (
                              <p className="text-xs text-gray-400 pl-2">
                                • {topRisingEntity.name} showing <span className="text-red-400 font-semibold">↑ {topRisingEntity.trendPercentage}%</span> increase
                              </p>
                            )}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">Stable Trends:</span>
                              <span className="font-semibold text-yellow-400">{stableEntities.length} entities</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">Declining Trends:</span>
                              <span className="font-semibold text-green-400">{decliningEntities.length} entities</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10">
                          <p className="text-xs font-semibold text-gray-400 mb-2">Severity Breakdown:</p>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Critical (≥8.0):</span>
                              <span className="font-semibold text-red-400">{criticalEntities.length} entities</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">High (6.0-7.9):</span>
                              <span className="font-semibold text-orange-400">{highSeverityEntities.length} entities</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Medium/Low (&lt;6.0):</span>
                              <span className="font-semibold text-yellow-400">{channelEntities.length - criticalEntities.length - highSeverityEntities.length} entities</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Container */}
                    <div className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-[#5332ff]/10 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">✨</span>
                        <h4 className="text-sm font-bold text-purple-300">Recommended Actions</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-purple-300 mb-2">Immediate Priority:</p>
                          <p className="text-sm text-gray-200 leading-relaxed">
                            Prioritize <span className="font-bold text-white">{topEntity?.name || "critical"}</span> resolution workflows and allocate dedicated {channelLabels[selectedChannel]} resources to address the {totalFrequency.toLocaleString()} total frequency cases. Focus on the {criticalEntities.length} critical severity entities first to prevent escalation.
                          </p>
                        </div>

                        {risingCount > 0 && (
                          <div className="pt-3 border-t border-purple-500/20">
                            <p className="text-xs font-semibold text-purple-300 mb-2">Rising Trend Response:</p>
                            <p className="text-sm text-gray-200 leading-relaxed">
                              {risingCount} {risingCount === 1 ? "entity is" : "entities are"} showing upward trends, with {topRisingEntity?.name || "multiple issues"} experiencing a {topRisingEntity?.trendPercentage || 0}% increase. Deploy proactive monitoring and early intervention protocols to prevent further escalation.
                            </p>
                          </div>
                        )}

                        <div className="pt-3 border-t border-purple-500/20">
                          <p className="text-xs font-semibold text-purple-300 mb-2">Resource Allocation:</p>
                          <p className="text-sm text-gray-200 leading-relaxed">
                            Based on average severity of {avgSeverity.toFixed(1)}/10 and {channelEntities.length} active entities, recommend allocating approximately <span className="font-semibold text-white">{Math.ceil(channelEntities.length * 0.3)}</span> dedicated agents to {channelLabels[selectedChannel]} channel, with focus on {topEntity?.name || "critical"} workflows requiring immediate attention.
                          </p>
                        </div>

                        {decliningEntities.length > 0 && (
                          <div className="pt-3 border-t border-purple-500/20">
                            <p className="text-xs font-semibold text-green-400 mb-2">Positive Indicators:</p>
                            <p className="text-sm text-gray-200 leading-relaxed">
                              {decliningEntities.length} {decliningEntities.length === 1 ? "entity is" : "entities are"} showing declining trends, indicating successful resolution strategies. Continue current approaches for these areas while redirecting resources to rising trend entities.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function IntentIntelligenceSection({
  clusters: _clusters,
  severityMatrix: _severityMatrix,
  selectedIntentId: _selectedIntentId,
  onIntentSelect: _onIntentSelect,
}: IntentIntelligenceSectionProps) {
  return (
    <div className="space-y-6">
      <EmotionShockboard />
      <ResolutionIntegrityMonitor />
      <PatternRecognitionEngine />
    </div>
  );
}

const emotionShockBars: ShockBar[] = getEmotionShockboardData();

const emotionShockEvents: ShockEvent[] = [
  {
    id: "shock-critical-email",
    tone: "critical",
    channel: "Email",
    spike: 4.2,
    shiftType: "Negative surge",
    intent: "Billing Inquiry Spike",
    cause: "150+ threads with frustration about invoice clarity in past 2 hours",
    suggestion: "Deploy clarification email template to waiting queue",
  },
  {
    id: "shock-warning-voice",
    tone: "warning",
    channel: "Voice",
    spike: 2.8,
    shiftType: "Positive spike",
    intent: "Resolution Appreciation",
    cause: "Agent performance on complex issues exceeded targets by 40%",
    suggestion: "Capture call recordings for training library",
  },
  {
    id: "shock-positive-chat",
    tone: "positive",
    channel: "Chat",
    spike: -1.8,
    shiftType: "Sentiment stabilizing",
    intent: "Self-Service Deflection Success",
    cause: "Knowledge base articles reduced frustrated escalations by 35%",
    suggestion: "Monitor for sustained improvement over next 4 hours",
  },
];

const resolutionIntegrityScore = {
  score: 62,
  delta: -8,
};

const resolutionIntegrityIssues: ResolutionIssue[] = [
  {
    id: "issue-conflict",
    title: "Conflicting Resolution Messages",
    intent: "Debit Card Replacement",
    summary:
      "Chat confirms card dispatched, Ticket shows pending fraud review, Voice requests resend after verification failure.",
    recommendation: "Sync fraud verification workflow across CRM before allowing channel-specific closure updates.",
    tone: "danger",
  },
  {
    id: "issue-loop",
    title: "Repeated Resolution Loops",
    intent: "Mortgage Rate Lock",
    summary: "Closed → Reopened → Closed → Reopened sequence detected three times this week.",
    recommendation: "Freeze closure until underwriting pipeline clears backlog; alert compliance QA automatically.",
    tone: "warning",
  },
  {
    id: "issue-dependency",
    title: "Action Dependency Mismatch",
    intent: "Account Access Reset",
    summary: "Email flagged customer pending, Voice shows company pending, Ticket already closed.",
    recommendation: "Unify responsibility assignment and auto-reopen channels when conflicting dependencies exist.",
    tone: "info",
  },
];

