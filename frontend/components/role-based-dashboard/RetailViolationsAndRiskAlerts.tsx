"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  UserCheck,
  ShieldCheck,
  Banknote,
  Globe,
  Building2,
  AlertCircle,
  Search,
  FileBarChart,
  Mail,
  MessageSquare,
  Ticket,
  Mic,
  Share2,
  AlertTriangle,
  Server,
  Users,
  Clock,
  MapPin,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ───────────── Violations by Category ───────────── */

type Severity = "critical" | "high" | "medium" | "low";

type ViolationData = {
  category: string;
  count: number;
  trend: number;
  severity: Severity;
  percentage: number;
};

const VIOLATIONS: ViolationData[] = [
  { category: "AML Compliance",                  count: 1284, trend:  12, severity: "critical", percentage: 28 },
  { category: "Sanctions / PEP Screening",       count:  872, trend:   8, severity: "critical", percentage: 19 },
  { category: "Customer Identification Program", count:  641, trend:  -4, severity: "high",     percentage: 14 },
  { category: "Cross-Border Compliance",         count:  498, trend:  17, severity: "high",     percentage: 11 },
  { category: "GDPR Compliance",                 count:  412, trend:  -2, severity: "medium",   percentage:  9 },
  { category: "Regulatory Reporting",            count:  356, trend:   5, severity: "medium",   percentage:  8 },
  { category: "Vendor Compliance",               count:  214, trend: -11, severity: "low",      percentage:  5 },
];

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: "#ef4444",
  high:     "#f97316",
  medium:   "#eab308",
  low:      "#22c55e",
};

const CHANNEL_CONFIG = [
  { key: "email",  label: "Email",  icon: Mail,          color: "#3b82f6" },
  { key: "chat",   label: "Chat",   icon: MessageSquare, color: "#22c55e" },
  { key: "ticket", label: "Ticket", icon: Ticket,        color: "#f97316" },
  { key: "voice",  label: "Voice",  icon: Mic,           color: "#8b5cf6" },
  { key: "social", label: "Social", icon: Share2,        color: "#ec4899" },
] as const;

type ChannelKey = (typeof CHANNEL_CONFIG)[number]["key"];

const CHANNEL_DISTRIBUTIONS: Record<string, number[]> = {
  "Sanctions / PEP Screening":       [0.15, 0.20, 0.35, 0.25, 0.05],
  "AML Compliance":                  [0.10, 0.15, 0.30, 0.40, 0.05],
  "Customer Identification Program": [0.20, 0.30, 0.20, 0.25, 0.05],
  "Regulatory Reporting":            [0.40, 0.10, 0.35, 0.10, 0.05],
  "GDPR Compliance":                 [0.25, 0.25, 0.20, 0.15, 0.15],
  "Cross-Border Compliance":         [0.30, 0.15, 0.25, 0.20, 0.10],
  "Vendor Compliance":               [0.35, 0.20, 0.30, 0.10, 0.05],
};

function getChannelBreakdown(category: string, total: number): Record<ChannelKey, number> {
  const dist = CHANNEL_DISTRIBUTIONS[category] || [0.2, 0.2, 0.2, 0.2, 0.2];
  return {
    email:  Math.round(total * dist[0]),
    chat:   Math.round(total * dist[1]),
    ticket: Math.round(total * dist[2]),
    voice:  Math.round(total * dist[3]),
    social: Math.round(total * dist[4]),
  };
}

function getCategoryIcon(category: string, color: string) {
  const iconProps = { className: "w-4 h-4", style: { color } };
  switch (category) {
    case "Sanctions / PEP Screening":       return <Search {...iconProps} />;
    case "AML Compliance":                  return <Banknote {...iconProps} />;
    case "Customer Identification Program": return <UserCheck {...iconProps} />;
    case "Regulatory Reporting":            return <FileBarChart {...iconProps} />;
    case "GDPR Compliance":                 return <ShieldCheck {...iconProps} />;
    case "Cross-Border Compliance":         return <Globe {...iconProps} />;
    case "Vendor Compliance":               return <Building2 {...iconProps} />;
    default:                                return <AlertCircle {...iconProps} />;
  }
}

function RetailViolationsByCategory() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<{ idx: number; channel: ChannelKey } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const maxCount = Math.max(...VIOLATIONS.map(d => d.count));
  const total = VIOLATIONS.reduce((sum, d) => sum + d.count, 0);

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-500 flex flex-col overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        backgroundColor: "#0d0d0d",
        border: "1px solid #2a2a2a",
        boxShadow:
          "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        maxHeight: 600,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold mb-1 text-white">Violations by Category</h3>
          <p className="text-xs" style={{ color: "#939394" }}>
            {total.toLocaleString()} total violations detected
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {VIOLATIONS.map((item, index) => {
          const barWidth = (item.count / maxCount) * 100;
          const severityColor = SEVERITY_COLOR[item.severity];
          const channelBreakdown = getChannelBreakdown(item.category, item.count);

          return (
            <div
              key={item.category}
              className={`transition-all duration-300 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${severityColor}15` }}>
                    {getCategoryIcon(item.category, severityColor)}
                  </div>
                  <span className="text-sm font-medium text-white">{item.category}</span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                    style={{ backgroundColor: `${severityColor}20`, color: severityColor }}
                  >
                    {item.severity}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums text-white">
                    {item.count.toLocaleString()}
                  </span>
                  <div
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: item.trend > 0 ? "#ef4444" : "#22c55e" }}
                  >
                    {item.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(item.trend)}%</span>
                  </div>
                </div>
              </div>

              <div
                className="relative h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <div
                  className="h-full flex rounded-full overflow-hidden transition-all duration-700 ease-out"
                  style={{
                    width: isVisible ? `${barWidth}%` : "0%",
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {CHANNEL_CONFIG.map(channel => {
                    const channelCount = channelBreakdown[channel.key];
                    const channelPercentage = (channelCount / item.count) * 100;
                    const isHovered =
                      hoveredBar?.idx === index && hoveredBar?.channel === channel.key;
                    if (channelCount === 0) return null;
                    return (
                      <div
                        key={channel.key}
                        className="h-full flex items-center justify-center relative cursor-pointer transition-all duration-300"
                        style={{
                          width: `${channelPercentage}%`,
                          backgroundColor: channel.color,
                          opacity: isHovered ? 1 : 0.9,
                          transform: isHovered ? "scaleY(1.3)" : "scaleY(1)",
                          boxShadow: isHovered ? "inset 0 0 0 1px #ffffff60" : "none",
                        }}
                        onMouseEnter={() =>
                          setHoveredBar({ idx: index, channel: channel.key })
                        }
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {isHovered && (
                          <span
                            className="text-[9px] font-bold text-white z-10"
                            style={{
                              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {Math.round(channelPercentage)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-6 pt-4 border-t flex-shrink-0"
        style={{ borderColor: "#2a2a2a" }}
      >
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#939394" }}>
            Channels:
          </span>
          {CHANNEL_CONFIG.map(channel => {
            const Icon = channel.icon;
            return (
              <div key={channel.key} className="flex items-center gap-1 flex-shrink-0">
                <Icon className="w-3 h-3" style={{ color: channel.color }} />
                <span className="text-[11px]" style={{ color: "#939394" }}>
                  {channel.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Risk Alert Center ───────────── */

type RiskCategory = "fraud" | "operational" | "reputation" | "third-party";
type RiskStatus = "active" | "monitoring" | "resolved";

type RiskAlert = {
  id: string;
  category: RiskCategory;
  severity: Severity;
  status: RiskStatus;
  region: string;
  title: string;
  description: string;
  timestamp: string;
  impactedAgents: number;
  impactedCustomers: number;
};

const NOW = Date.now();
const ALERTS: RiskAlert[] = [
  {
    id: "a1",
    category: "fraud",
    severity: "critical",
    status: "active",
    region: "EU",
    title: "Synthetic identity ring targeting new-to-bank onboarding",
    description:
      "42 applications this week sharing device fingerprints and Cyprus IP ranges · 6 accounts already funded before KYC re-check.",
    timestamp: new Date(NOW - 1000 * 60 * 14).toISOString(),
    impactedAgents: 8,
    impactedCustomers: 42,
  },
  {
    id: "a2",
    category: "operational",
    severity: "high",
    status: "active",
    region: "UK",
    title: "Payment rail latency breach (UK FPS)",
    description:
      "P95 latency crossed 18s vs. 6s baseline for 37 minutes · 2,140 payments queued · BACS contingency routing engaged.",
    timestamp: new Date(NOW - 1000 * 60 * 42).toISOString(),
    impactedAgents: 14,
    impactedCustomers: 2140,
  },
  {
    id: "a3",
    category: "reputation",
    severity: "high",
    status: "monitoring",
    region: "EU",
    title: "Consumer Duty narrative on hidden FX margins",
    description:
      "Influencer thread at 2.1k upvotes with FCA-adjacent accounts re-posting · no regulator contact yet.",
    timestamp: new Date(NOW - 1000 * 60 * 90).toISOString(),
    impactedAgents: 0,
    impactedCustomers: 0,
  },
  {
    id: "a4",
    category: "third-party",
    severity: "medium",
    status: "monitoring",
    region: "APAC",
    title: "KYC vendor — credential rotation overdue",
    description:
      "Primary KYC provider missed quarterly credential rotation window · vendor-risk committee notified, no customer impact observed.",
    timestamp: new Date(NOW - 1000 * 60 * 60 * 4).toISOString(),
    impactedAgents: 3,
    impactedCustomers: 0,
  },
  {
    id: "a5",
    category: "fraud",
    severity: "medium",
    status: "monitoring",
    region: "US",
    title: "Card-not-present dispute cluster · eCom merchant",
    description:
      "38 disputes in 72 hours against a single online merchant · chargeback rate at 1.8% vs 0.3% baseline.",
    timestamp: new Date(NOW - 1000 * 60 * 60 * 6).toISOString(),
    impactedAgents: 5,
    impactedCustomers: 38,
  },
  {
    id: "a6",
    category: "reputation",
    severity: "low",
    status: "resolved",
    region: "EU",
    title: "Mortgage broker wait-time complaint thread",
    description:
      "Reddit thread about broker appointment SLA · resolved after product comms pushed revised SLA to social channels.",
    timestamp: new Date(NOW - 1000 * 60 * 60 * 22).toISOString(),
    impactedAgents: 6,
    impactedCustomers: 120,
  },
];

function getCategoryConfig(category: RiskCategory) {
  switch (category) {
    case "fraud":
      return { icon: AlertTriangle, color: "#ef4444", label: "Fraud",       bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" };
    case "operational":
      return { icon: Server,         color: "#f97316", label: "Operational", bgGradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" };
    case "reputation":
      return { icon: MessageSquare,  color: "#ec4899", label: "Reputation",  bgGradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" };
    case "third-party":
      return { icon: Users,          color: "#06b6d4", label: "Third-Party", bgGradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" };
  }
}

function getStatusConfig(status: RiskStatus) {
  switch (status) {
    case "active":     return { color: "#ef4444", label: "Active",     pulse: true  };
    case "monitoring": return { color: "#eab308", label: "Monitoring", pulse: true  };
    case "resolved":   return { color: "#22c55e", label: "Resolved",   pulse: false };
  }
}

function getRegionFlag(region: string) {
  switch (region) {
    case "EU":   return "🇪🇺";
    case "UK":   return "🇬🇧";
    case "US":   return "🇺🇸";
    case "APAC": return "🌏";
    default:     return "🌐";
  }
}

function formatTimestamp(ts: string) {
  const diffMs = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diffMs / 60000);
  const h = Math.floor(diffMs / 3600000);
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return new Date(ts).toLocaleDateString();
}

function RetailRiskAlertCenter() {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | "all">("all");

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = selectedCategory === "all" ? ALERTS : ALERTS.filter(a => a.category === selectedCategory);

  const sorted = [...filtered].sort((a, b) => {
    const severityOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    const statusOrder: Record<RiskStatus, number> = { active: 0, monitoring: 1, resolved: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const categoryCounts = {
    all: ALERTS.length,
    fraud: ALERTS.filter(a => a.category === "fraud").length,
    operational: ALERTS.filter(a => a.category === "operational").length,
    reputation: ALERTS.filter(a => a.category === "reputation").length,
    "third-party": ALERTS.filter(a => a.category === "third-party").length,
  };
  const categories: (RiskCategory | "all")[] = [
    "all",
    "fraud",
    "operational",
    "reputation",
    "third-party",
  ];

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-500 flex flex-col ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{
        backgroundColor: "#0d0d0d",
        border: "1px solid #2a2a2a",
        boxShadow:
          "0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        maxHeight: 600,
      }}
    >
      <div
        className="p-6"
        style={{
          background: "linear-gradient(135deg, #1a0a1a 0%, #0d0d0d 100%)",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #B90ABD 100%)",
                boxShadow: "0 4px 16px rgba(239, 68, 68, 0.35)",
              }}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Risk Alert Center</h3>
              <p className="text-xs" style={{ color: "#939394" }}>
                {ALERTS.filter(a => a.status === "active").length} active alerts requiring attention
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "#ef444420", border: "1px solid #ef444440" }}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold" style={{ color: "#ef4444" }}>
              {ALERTS.filter(a => a.status === "active").length} Active
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            const config = cat === "all" ? null : getCategoryConfig(cat);
            const count = categoryCounts[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isSelected ? "scale-105" : ""
                }`}
                style={{
                  backgroundColor: isSelected
                    ? config
                      ? `${config.color}20`
                      : "#5332FF20"
                    : "#1a1a1a",
                  color: isSelected ? (config ? config.color : "#5332FF") : "#939394",
                  border: isSelected
                    ? `1px solid ${config ? config.color : "#5332FF"}50`
                    : "1px solid transparent",
                }}
              >
                {config && <config.icon className="w-3.5 h-3.5" />}
                <span>{cat === "all" ? "All Risks" : config?.label}</span>
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px]"
                  style={{
                    backgroundColor: isSelected
                      ? config
                        ? `${config.color}30`
                        : "#5332FF30"
                      : "#2a2a2a",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sorted.map((alert, index) => {
          const catConfig = getCategoryConfig(alert.category);
          const statusConfig = getStatusConfig(alert.status);
          const severityColor = SEVERITY_COLOR[alert.severity];
          const isExpanded = expanded === alert.id;
          const Icon = catConfig.icon;

          return (
            <div
              key={alert.id}
              className={`border-b transition-all duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transitionDelay: `${index * 60}ms`,
                borderColor: "#1f1f1f",
                backgroundColor: isExpanded ? "#141414" : "transparent",
              }}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : alert.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ background: catConfig.bgGradient }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                        style={{ backgroundColor: `${severityColor}20`, color: severityColor }}
                      >
                        {alert.severity}
                      </span>
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: `${statusConfig.color}15`, color: statusConfig.color }}
                      >
                        {statusConfig.pulse && (
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: statusConfig.color }}
                          />
                        )}
                        {statusConfig.label}
                      </span>
                      <span
                        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: "#2a2a2a", color: "#FFFFFF" }}
                      >
                        <MapPin className="w-3 h-3" style={{ color: "#939394" }} />
                        {getRegionFlag(alert.region)} {alert.region}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold mb-1 text-white">{alert.title}</h4>
                    <p
                      className={`text-xs ${isExpanded ? "" : "line-clamp-2"}`}
                      style={{ color: "#939394" }}
                    >
                      {alert.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" style={{ color: "#939394" }} />
                      <span
                        className="text-[10px]"
                        style={{ color: "#939394" }}
                        suppressHydrationWarning
                      >
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" style={{ color: "#939394" }} />
                    ) : (
                      <ChevronDown className="w-4 h-4" style={{ color: "#939394" }} />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0" style={{ marginLeft: 52 }}>
                  <div
                    className="rounded-lg p-4 grid grid-cols-2 gap-4"
                    style={{ backgroundColor: "#0a0a0a" }}
                  >
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-wider mb-1"
                        style={{ color: "#939394" }}
                      >
                        Impacted Agents
                      </p>
                      <p className="text-lg font-bold text-white">{alert.impactedAgents}</p>
                    </div>
                    <div>
                      <p
                        className="text-[10px] uppercase tracking-wider mb-1"
                        style={{ color: "#939394" }}
                      >
                        Impacted Customers
                      </p>
                      <p className="text-lg font-bold text-white">
                        {alert.impactedCustomers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="p-4 border-t"
        style={{ borderColor: "#2a2a2a", backgroundColor: "#0a0a0a" }}
      >
        <div className="grid grid-cols-4 gap-2">
          {(["fraud", "operational", "reputation", "third-party"] as RiskCategory[]).map(cat => {
            const config = getCategoryConfig(cat);
            const count = ALERTS.filter(a => a.category === cat).length;
            return (
              <div
                key={cat}
                className="text-center p-2 rounded-lg"
                style={{ backgroundColor: "#141414" }}
              >
                <config.icon
                  className="w-4 h-4 mx-auto mb-1"
                  style={{ color: count > 0 ? config.color : "#939394" }}
                />
                <p
                  className="text-lg font-bold"
                  style={{ color: count > 0 ? config.color : "#939394" }}
                >
                  {count}
                </p>
                <p className="text-[9px] uppercase" style={{ color: "#939394" }}>
                  {config.label.split(" ")[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Combined wrapper ───────────── */

export function RetailViolationsAndRiskAlerts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RetailViolationsByCategory />
      <RetailRiskAlertCenter />
    </div>
  );
}
