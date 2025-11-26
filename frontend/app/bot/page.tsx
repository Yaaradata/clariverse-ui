"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getKPIs, 
  getEisenhowerThreads, 
  getExecutiveSummary, 
  getUnifiedDashboard,
  getChannelPerformance,
  getActionItems,
  getAIInsights,
  getTopicDistribution
} from "@/lib/api";
import { emailData } from "@/lib/emailData";
import type { KPIData, EisenhowerThread, ExecutiveSummary, UnifiedDashboardData, ChannelPerformance, ActionItem, AIInsight } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  data?: BotResponse;
}

interface BotResponse {
  summary: string;
  channels?: ChannelData[];
  actions?: ActionSuggestion[];
  metrics?: {
    label: string;
    value: string | number;
    trend?: string;
  }[];
}

interface ChannelData {
  name: string;
  summary: string;
  metrics: {
    label: string;
    value: string | number;
  }[];
  topIssues?: string[];
  sentiment?: string;
}

interface ActionSuggestion {
  action: string;
  priority: "critical" | "high" | "medium" | "low";
  reason: string;
  timeframe?: string;
}

const PREDEFINED_QUESTIONS = [
  "What are the top priorities for today?",
  "Analyze the dashboard performance",
  "Give me a summary of critical issues",
  "Which threads require escalation?",
  "Show me today's key insights",
  "What needs immediate attention?",
  "What are the trends I should know?",
  "What's the sentiment analysis for today?",
];

// Helper function to check if a date is today
const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Helper function to get threads for today
const getTodayThreads = (threads: EisenhowerThread[]): EisenhowerThread[] => {
  return threads.filter((t) => {
    const lastMessageDate = t.last_message_at || t.first_message_at;
    return isToday(lastMessageDate);
  });
};

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Business Assistant. I can help you understand what's happening across all your channels today, answer questions about specific channels like Email, Chat, Social Media, or Voice, and provide summaries with action suggestions.\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseQuery = (query: string): { type: string; channel?: string; filters?: any } => {
    const lowerQuery = query.toLowerCase();
    
    // Check for specific channels FIRST (before other keywords)
    if (lowerQuery.includes("chat") || lowerQuery.includes("messaging") || lowerQuery.includes("message")) {
      return { type: "channel_detail", channel: "chat" };
    }
    if (lowerQuery.includes("email") && !lowerQuery.includes("social") && !lowerQuery.includes("chat")) {
      return { type: "channel_detail", channel: "email" };
    }
    if (lowerQuery.includes("social") || lowerQuery.includes("twitter") || lowerQuery.includes("x") || lowerQuery.includes("reddit") || lowerQuery.includes("trustpilot") || lowerQuery.includes("app store") || lowerQuery.includes("play store")) {
      return { type: "channel_detail", channel: "social" };
    }
    if (lowerQuery.includes("voice") || lowerQuery.includes("call") || lowerQuery.includes("phone")) {
      return { type: "channel_detail", channel: "voice" };
    }
    
    // Check for today's situation
    if (lowerQuery.includes("today") || lowerQuery.includes("current") || lowerQuery.includes("situation") || lowerQuery.includes("what is happening") || lowerQuery.includes("what's happening")) {
      return { type: "today_overview" };
    }
    
    // Check for priority/urgent requests
    if (lowerQuery.includes("priority") || lowerQuery.includes("priorities") || lowerQuery.includes("urgent") || lowerQuery.includes("critical")) {
      return { type: "priorities" };
    }
    
    // Check for summary requests
    if (lowerQuery.includes("summary") || lowerQuery.includes("overview") || lowerQuery.includes("insights") || lowerQuery.includes("analyze")) {
      return { type: "summary" };
    }
    
    // Check for action requests
    if (lowerQuery.includes("action") || lowerQuery.includes("suggestion") || lowerQuery.includes("recommend") || lowerQuery.includes("escalation") || lowerQuery.includes("escalate")) {
      return { type: "actions" };
    }
    
    // Check for trends
    if (lowerQuery.includes("trend") || lowerQuery.includes("trends")) {
      return { type: "trends" };
    }
    
    // Check for sentiment
    if (lowerQuery.includes("sentiment") || lowerQuery.includes("feeling") || lowerQuery.includes("mood")) {
      return { type: "sentiment" };
    }
    
    // Default to today overview
    return { type: "today_overview" };
  };

  const generateResponse = async (query: string): Promise<BotResponse> => {
    const parsed = parseQuery(query);
    
    try {
      if (parsed.type === "today_overview") {
        return await getTodayOverview();
      } else if (parsed.type === "channel_detail") {
        return await getChannelDetail(parsed.channel!);
      } else if (parsed.type === "summary") {
        return await getExecutiveSummaryResponse();
      } else if (parsed.type === "actions" || parsed.type === "priorities") {
        return await getActionsResponse();
      } else if (parsed.type === "trends") {
        return await getTrendsResponse();
      } else if (parsed.type === "sentiment") {
        return await getSentimentResponse();
      } else {
        return await getTodayOverview();
      }
    } catch (error) {
      console.error("Error generating response:", error);
      return {
        summary: "I apologize, but I encountered an error while processing your request. Could you please try rephrasing your question?",
      };
    }
  };

  const getTodayOverview = async (): Promise<BotResponse> => {
    // Use the same data sources as the dashboard pages
    const [kpis, allThreads, unified, channels] = await Promise.all([
      getKPIs(),
      getEisenhowerThreads(),
      getUnifiedDashboard(),
      getChannelPerformance(),
    ]);

    // Filter threads for today using the same logic as dashboards
    const todayThreads = getTodayThreads(allThreads);

    const channelData: ChannelData[] = [];

    // Email Channel - use actual email threads
    const emailThreads = todayThreads.filter((t) => t.channel === "email");
    if (emailThreads.length > 0) {
      const highUrgency = emailThreads.filter((t) => t.urgency === "critical" || t.urgency === "high").length;
      const openCount = emailThreads.filter((t) => t.resolution_status === "open").length;
      const inProgress = emailThreads.filter((t) => t.resolution_status === "in_progress").length;
      const avgSentiment = emailThreads.reduce((sum, t) => sum + t.overall_sentiment, 0) / emailThreads.length;
      
      // Get top issues from thread subjects
      const topIssues = emailThreads
        .map((t) => t.subject_norm)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 3);
      
      channelData.push({
        name: "Email",
        summary: `Today, you have ${emailThreads.length} email conversations. ${highUrgency > 0 ? `${highUrgency} require urgent attention` : "No urgent items"}, and ${openCount} are still open.`,
        metrics: [
          { label: "Total Emails", value: emailThreads.length },
          { label: "Urgent", value: highUrgency },
          { label: "Open", value: openCount },
          { label: "In Progress", value: inProgress },
          { label: "Avg Sentiment", value: `${avgSentiment.toFixed(1)}/5` },
        ],
        topIssues: topIssues.length > 0 ? topIssues : undefined,
        sentiment: avgSentiment > 3.5 ? "Positive" : avgSentiment > 2.5 ? "Neutral" : "Negative",
      });
    }

    // Chat Channel - use actual chat threads
    const chatThreads = todayThreads.filter((t) => t.channel === "chat");
    if (chatThreads.length > 0) {
      const highUrgency = chatThreads.filter((t) => t.urgency === "critical" || t.urgency === "high").length;
      const openCount = chatThreads.filter((t) => t.resolution_status === "open").length;
      const inProgress = chatThreads.filter((t) => t.resolution_status === "in_progress").length;
      
      // Get top issues from thread subjects
      const topIssues = chatThreads
        .map((t) => t.subject_norm)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 3);
      
      channelData.push({
        name: "Chat",
        summary: `Today, there are ${chatThreads.length} chat conversations. ${highUrgency > 0 ? `${highUrgency} require urgent attention` : "No urgent items"}, and ${openCount} are still open.`,
        metrics: [
          { label: "Total Chats", value: chatThreads.length },
          { label: "Urgent", value: highUrgency },
          { label: "Open", value: openCount },
          { label: "In Progress", value: inProgress },
        ],
        topIssues: topIssues.length > 0 ? topIssues : undefined,
      });
    }

    // Social Media Channels - use actual data from API
    const socialChannels = channels.filter((c) => 
      ["X", "Twitter", "Reddit", "Trustpilot", "App Store", "Play Store"].includes(c.channel)
    );
    
    if (socialChannels.length > 0) {
      const totalIssues = socialChannels.reduce((sum, c) => sum + c.issueCount, 0);
      const avgSentiment = unified.kpis.overallSentiment;
      
      channelData.push({
        name: "Social Media",
        summary: `Across social media channels, there are ${totalIssues} active issues. Overall sentiment is ${avgSentiment}%. Key platforms include ${socialChannels.slice(0, 3).map(c => c.channel).join(", ")}.`,
        metrics: [
          { label: "Total Issues", value: totalIssues },
          { label: "Overall Sentiment", value: `${avgSentiment}%` },
          { label: "Active Channels", value: socialChannels.length },
          { label: "Avg Response Time", value: `${(socialChannels.reduce((sum, c) => sum + c.avgResponseTime, 0) / socialChannels.length).toFixed(1)}h` },
        ],
        topIssues: unified.kpis.top5Topics.slice(0, 3),
        sentiment: avgSentiment > 50 ? "Positive" : avgSentiment > 30 ? "Neutral" : "Negative",
      });
    }

    // Voice Channel - use actual voice threads
    const voiceThreads = todayThreads.filter((t) => t.channel === "voice");
    if (voiceThreads.length > 0) {
      const highUrgency = voiceThreads.filter((t) => t.urgency === "critical" || t.urgency === "high").length;
      const openCount = voiceThreads.filter((t) => t.resolution_status === "open").length;
      
      channelData.push({
        name: "Voice",
        summary: `Today, there are ${voiceThreads.length} voice interactions. ${highUrgency > 0 ? `${highUrgency} require immediate attention` : "No urgent items"}.`,
        metrics: [
          { label: "Total Calls", value: voiceThreads.length },
          { label: "Urgent", value: highUrgency },
          { label: "Open", value: openCount },
        ],
      });
    }

    // Get critical actions from actual threads
    const urgentCount = allThreads.filter(t => t.urgency === "critical" || t.urgency === "high").length;
    const criticalActions = allThreads
      .filter((t) => (t.urgency === "critical" || t.urgency === "high") && t.resolution_status !== "closed")
      .slice(0, 5)
      .map((t) => ({
        action: t.next_action_suggestion || `Address ${t.subject_norm}`,
        priority: t.urgency as "critical" | "high" | "medium" | "low",
        reason: `Thread: ${t.subject_norm} - ${t.action_pending_from === "customer" ? "Waiting for customer response" : "Action required from your team"}`,
        timeframe: t.urgency === "critical" ? "Immediate" : "24-48 hours",
      }));

    return {
      summary: `Here's what's happening today across all your channels:\n\nYou have ${todayThreads.length} active threads today, with ${urgentCount} requiring urgent attention. Overall sentiment is ${(kpis.avg_sentiment_weighted || 0).toFixed(1)}/5. ${urgentCount > 0 ? "I recommend reviewing the urgent items first." : "Everything looks manageable."}`,
      channels: channelData,
      actions: criticalActions.length > 0 ? criticalActions : undefined,
      metrics: [
        { label: "Total Active Threads", value: todayThreads.length },
        { label: "Urgent Issues", value: urgentCount },
        { label: "Open (Customer)", value: kpis.pending_customer || 0 },
        { label: "Open (Internal)", value: kpis.pending_internal || 0 },
        { label: "Avg Sentiment", value: `${(kpis.avg_sentiment_weighted || 0).toFixed(1)}/5` },
        { label: "SLA Compliance", value: `${(kpis.sla_compliance_rate || 0).toFixed(0)}%` },
      ],
    };
  };

  const getChannelDetail = async (channel: string): Promise<BotResponse> => {
    // Use the same data sources as dashboard pages
    const allThreads = await getEisenhowerThreads();
    const todayThreads = getTodayThreads(allThreads);

    if (channel === "chat") {
      const chatThreads = todayThreads.filter((t) => t.channel === "chat");
      
      if (chatThreads.length === 0) {
        return {
          summary: "I don't see any chat conversations for today. Would you like me to check a different time period or another channel?",
        };
      }

      const highUrgency = chatThreads.filter((t) => t.urgency === "critical" || t.urgency === "high").length;
      const openCount = chatThreads.filter((t) => t.resolution_status === "open").length;
      const inProgress = chatThreads.filter((t) => t.resolution_status === "in_progress").length;
      const closed = chatThreads.filter((t) => t.resolution_status === "closed").length;

      const topSubjects = chatThreads
        .map((t) => t.subject_norm)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 5);

      const actions = chatThreads
        .filter((t) => t.action_pending_from === "company" && t.resolution_status !== "closed")
        .slice(0, 5)
        .map((t) => ({
          action: t.next_action_suggestion || `Respond to: ${t.subject_norm}`,
          priority: t.urgency as "critical" | "high" | "medium" | "low",
          reason: `Action pending from your team for: ${t.subject_norm}`,
          timeframe: t.urgency === "critical" ? "Immediate" : t.urgency === "high" ? "24 hours" : "48 hours",
        }));

      return {
        summary: `Here's what's happening in Chat today:\n\nYou have ${chatThreads.length} chat conversations. ${highUrgency > 0 ? `${highUrgency} require urgent attention` : "No urgent items at the moment"}. ${openCount} are still open, ${inProgress} are in progress, and ${closed} have been closed.${topSubjects.length > 0 ? `\n\nTop conversation topics include: ${topSubjects.slice(0, 3).join(", ")}.` : ""}`,
        channels: [{
          name: "Chat",
          summary: `${chatThreads.length} active chat conversations with ${highUrgency} urgent items requiring immediate attention.`,
          metrics: [
            { label: "Total Chats", value: chatThreads.length },
            { label: "Urgent", value: highUrgency },
            { label: "Open", value: openCount },
            { label: "In Progress", value: inProgress },
            { label: "Closed", value: closed },
            { label: "Resolution Rate", value: `${((closed / chatThreads.length) * 100).toFixed(0)}%` },
          ],
          topIssues: topSubjects.slice(0, 3),
        }],
        actions: actions.length > 0 ? actions : undefined,
      };
    } else if (channel === "email") {
      const emailThreads = todayThreads.filter((t) => t.channel === "email");
      
      if (emailThreads.length === 0) {
        return {
          summary: "I don't see any email conversations for today. Would you like me to check a different time period?",
        };
      }

      const highUrgency = emailThreads.filter((t) => t.urgency === "critical" || t.urgency === "high").length;
      const openCount = emailThreads.filter((t) => t.resolution_status === "open").length;
      const inProgress = emailThreads.filter((t) => t.resolution_status === "in_progress").length;
      const closed = emailThreads.filter((t) => t.resolution_status === "closed").length;
      const avgSentiment = emailThreads.reduce((sum, t) => sum + t.overall_sentiment, 0) / emailThreads.length;

      const topSubjects = emailThreads
        .map((t) => t.subject_norm)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 5);

      const actions = emailThreads
        .filter((t) => t.action_pending_from === "company" && t.resolution_status !== "closed")
        .slice(0, 5)
        .map((t) => ({
          action: t.next_action_suggestion || `Respond to: ${t.subject_norm}`,
          priority: t.urgency as "critical" | "high" | "medium" | "low",
          reason: `Action pending from your team for: ${t.subject_norm}`,
          timeframe: t.urgency === "critical" ? "Immediate" : t.urgency === "high" ? "24 hours" : "48 hours",
        }));

      return {
        summary: `Here's what's happening in Email today:\n\nYou have ${emailThreads.length} email conversations. ${highUrgency > 0 ? `${highUrgency} require urgent attention` : "No urgent items"}. ${openCount} are still open, ${inProgress} are in progress, and the average sentiment is ${avgSentiment.toFixed(1)}/5.${topSubjects.length > 0 ? `\n\nTop issues include: ${topSubjects.slice(0, 3).join(", ")}.` : ""}`,
        channels: [{
          name: "Email",
          summary: `Active email conversations with ${highUrgency} urgent items requiring immediate attention.`,
          metrics: [
            { label: "Total Emails", value: emailThreads.length },
            { label: "Urgent", value: highUrgency },
            { label: "Open", value: openCount },
            { label: "In Progress", value: inProgress },
            { label: "Avg Sentiment", value: `${avgSentiment.toFixed(1)}/5` },
            { label: "Resolution Rate", value: `${((closed / emailThreads.length) * 100).toFixed(0)}%` },
          ],
          topIssues: topSubjects.slice(0, 3),
          sentiment: avgSentiment > 3.5 ? "Positive" : avgSentiment > 2.5 ? "Neutral" : "Negative",
        }],
        actions: actions.length > 0 ? actions : undefined,
      };
    } else if (channel === "social") {
      const [unified, channels, executive] = await Promise.all([
        getUnifiedDashboard(),
        getChannelPerformance(),
        getExecutiveSummary(),
      ]);

      const socialChannels = channels.filter((c) => 
        ["X", "Twitter", "Reddit", "Trustpilot", "App Store", "Play Store"].includes(c.channel)
      );

      const totalIssues = socialChannels.reduce((sum, c) => sum + c.issueCount, 0);
      const criticalIssues = executive.keyMetrics.criticalIssues;

      const actions = executive.recommendedActions.map((a) => ({
        action: a.action,
        priority: a.priority === 1 ? "critical" : a.priority === 2 ? "high" : "medium" as "critical" | "high" | "medium" | "low",
        reason: a.expectedImpact,
        timeframe: a.timeframe,
      }));

      return {
        summary: `Here's what's happening across Social Media:\n\nAcross ${socialChannels.length} platforms, there are ${totalIssues} active issues. Overall sentiment is ${unified.kpis.overallSentiment}%, with ${criticalIssues} critical issues requiring immediate attention.${unified.kpis.top5Topics.length > 0 ? `\n\nTop topics: ${unified.kpis.top5Topics.slice(0, 3).join(", ")}.` : ""}`,
        channels: socialChannels.map((c) => ({
          name: c.channel,
          summary: `${c.issueCount} issues with ${c.resolutionRate}% resolution rate and ${c.customerSatisfaction}% satisfaction.`,
          metrics: [
            { label: "Issues", value: c.issueCount },
            { label: "Response Time", value: `${c.avgResponseTime}h` },
            { label: "Resolution Rate", value: `${c.resolutionRate}%` },
            { label: "Satisfaction", value: `${c.customerSatisfaction}%` },
            { label: "SLA Compliance", value: `${c.slaCompliance}%` },
          ],
        })),
        actions: actions.length > 0 ? actions : undefined,
      };
    } else if (channel === "voice") {
      const voiceThreads = todayThreads.filter((t) => t.channel === "voice");
      
      if (voiceThreads.length === 0) {
        return {
          summary: "I don't see any voice interactions for today. Would you like me to check a different time period?",
        };
      }

      const highUrgency = voiceThreads.filter((t) => t.urgency === "critical" || t.urgency === "high").length;
      const openCount = voiceThreads.filter((t) => t.resolution_status === "open").length;
      const inProgress = voiceThreads.filter((t) => t.resolution_status === "in_progress").length;

      const actions = voiceThreads
        .filter((t) => t.action_pending_from === "company" && t.resolution_status !== "closed")
        .slice(0, 5)
        .map((t) => ({
          action: t.next_action_suggestion || `Follow up on: ${t.subject_norm}`,
          priority: t.urgency as "critical" | "high" | "medium" | "low",
          reason: `Action pending from your team for: ${t.subject_norm}`,
          timeframe: t.urgency === "critical" ? "Immediate" : t.urgency === "high" ? "24 hours" : "48 hours",
        }));

      return {
        summary: `Here's what's happening in Voice today:\n\nYou have ${voiceThreads.length} voice interactions. ${highUrgency > 0 ? `${highUrgency} require urgent attention` : "No urgent items"}. ${openCount} are still open.`,
        channels: [{
          name: "Voice",
          summary: `${voiceThreads.length} voice interactions with ${highUrgency} urgent items requiring immediate attention.`,
          metrics: [
            { label: "Total Calls", value: voiceThreads.length },
            { label: "Urgent", value: highUrgency },
            { label: "Open", value: openCount },
            { label: "In Progress", value: inProgress },
          ],
        }],
        actions: actions.length > 0 ? actions : undefined,
      };
    }

    return {
      summary: `I'm processing information for the ${channel} channel. Please give me a moment.`,
    };
  };

  const getExecutiveSummaryResponse = async (): Promise<BotResponse> => {
    const executive = await getExecutiveSummary();
    
    return {
      summary: executive.summary,
      actions: executive.recommendedActions.map((a) => ({
        action: a.action,
        priority: a.priority === 1 ? "critical" : a.priority === 2 ? "high" : "medium" as "critical" | "high" | "medium" | "low",
        reason: a.expectedImpact,
        timeframe: a.timeframe,
      })),
      metrics: [
        { label: "Total Mentions", value: executive.keyMetrics.totalMentions },
        { label: "Sentiment Score", value: `${executive.keyMetrics.sentimentScore}%` },
        { label: "Critical Issues", value: executive.keyMetrics.criticalIssues },
        { label: "Opportunities", value: executive.keyMetrics.opportunities },
      ],
    };
  };

  const getActionsResponse = async (): Promise<BotResponse> => {
    const [actions, allThreads, insights] = await Promise.all([
      getActionItems(),
      getEisenhowerThreads(),
      getAIInsights(),
    ]);

    const criticalActions = allThreads
      .filter((t) => (t.urgency === "critical" || t.urgency === "high") && t.resolution_status !== "closed")
      .slice(0, 10)
      .map((t) => ({
        action: t.next_action_suggestion || `Address ${t.subject_norm}`,
        priority: t.urgency as "critical" | "high" | "medium" | "low",
        reason: `Thread: ${t.subject_norm} - ${t.action_pending_from === "customer" ? "Waiting for customer response" : "Action required from your team"}`,
        timeframe: t.urgency === "critical" ? "Immediate" : "24-48 hours",
      }));

    const aiActions = insights
      .filter((i) => i.severity === "critical" || i.severity === "high")
      .slice(0, 5)
      .map((i) => ({
        action: i.recommendedAction,
        priority: i.severity,
        reason: i.description,
        timeframe: i.severity === "critical" ? "Immediate" : "24-48 hours",
      }));

    const allActions = [...criticalActions, ...aiActions].slice(0, 10);

    return {
      summary: `Here are your action recommendations:\n\n${allActions.length} ${allActions.length === 1 ? "action requires" : "actions require"} attention. ${criticalActions.length > 0 ? `${criticalActions.length} are from active threads` : ""}${aiActions.length > 0 ? `, and ${aiActions.length} are AI-recommended based on patterns and trends.` : ""}`,
      actions: allActions,
    };
  };

  const getTrendsResponse = async (): Promise<BotResponse> => {
    const [unified, kpis] = await Promise.all([
      getUnifiedDashboard(),
      getKPIs(),
    ]);

    return {
      summary: `Here are the key trends I'm seeing:\n\nTop trending topics: ${unified.kpis.top5Topics.slice(0, 3).join(", ")}. Overall sentiment is ${unified.kpis.overallSentiment}%, and ${unified.kpis.actionableIssuesPercent.toFixed(1)}% of issues are actionable. Brand health index is ${unified.kpis.brandHealthIndex}%.`,
      metrics: [
        { label: "Top Topics", value: unified.kpis.top5Topics.slice(0, 3).join(", ") },
        { label: "Overall Sentiment", value: `${unified.kpis.overallSentiment}%` },
        { label: "Actionable Issues", value: `${unified.kpis.actionableIssuesPercent.toFixed(1)}%` },
        { label: "Brand Health", value: `${unified.kpis.brandHealthIndex}%` },
      ],
    };
  };

  const getSentimentResponse = async (): Promise<BotResponse> => {
    const [kpis, unified] = await Promise.all([
      getKPIs(),
      getUnifiedDashboard(),
    ]);

    const sentimentScore = kpis.avg_sentiment_weighted || 0;
    const sentimentPercent = unified.kpis.overallSentiment;

    return {
      summary: `Here's the sentiment analysis:\n\nOverall sentiment across all channels is ${sentimentPercent}% (on a 0-100 scale) and ${sentimentScore.toFixed(1)}/5 (on a 1-5 scale). ${sentimentPercent > 50 ? "This indicates a positive trend." : sentimentPercent > 30 ? "Sentiment is neutral." : "This suggests some areas need attention."}`,
      metrics: [
        { label: "Overall Sentiment", value: `${sentimentPercent}%` },
        { label: "Weighted Average", value: `${sentimentScore.toFixed(1)}/5` },
        { label: "Customer Sentiment Index", value: `${(kpis.customer_sentiment_index || 0).toFixed(1)}` },
      ],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.summary,
        timestamp: new Date(),
        data: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Could you please try rephrasing your question?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  return (
    <div className="flex h-screen bg-app-black text-white">
      <div className="flex flex-col w-full max-w-6xl mx-auto p-6">
        <Card className="flex-1 flex flex-col shadow-lg">
          <CardHeader className="border-b border-(--border)">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-electric-violet">✨</span>
              <span className="text-electric-violet">AI</span> Business Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-electric-violet/20 text-white"
                        : "bg-app-blue/10 text-gray-200"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.data && (
                      <div className="mt-4 space-y-4">
                        {message.data.metrics && message.data.metrics.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                            {message.data.metrics.map((metric, idx) => (
                              <div
                                key={idx}
                                className="bg-app-black/50 rounded p-2 border border-app-blue/30"
                              >
                                <div className="text-xs text-manatee">{metric.label}</div>
                                <div className="text-lg font-semibold text-white">{metric.value}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {message.data.channels && message.data.channels.length > 0 && (
                          <div className="space-y-3 mt-4">
                            {message.data.channels.map((channel, idx) => (
                              <Card key={idx} className="bg-app-black/50 border-(--border) p-4">
                                <div className="font-semibold text-electric-violet mb-2">{channel.name}</div>
                                <div className="text-sm text-gray-300 mb-3">{channel.summary}</div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                                  {channel.metrics.map((metric, mIdx) => (
                                    <div key={mIdx} className="text-xs">
                                      <span className="text-manatee">{metric.label}: </span>
                                      <span className="text-white font-medium">{metric.value}</span>
                                    </div>
                                  ))}
                                </div>
                                {channel.topIssues && channel.topIssues.length > 0 && (
                                  <div className="mt-2">
                                    <div className="text-xs text-manatee mb-1">Top Issues:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {channel.topIssues.map((issue, iIdx) => (
                                        <Badge key={iIdx} variant="outline" className="text-xs">
                                          {issue}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {channel.sentiment && (
                                  <div className="mt-2">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        channel.sentiment === "Positive"
                                          ? "border-green-500/50 text-green-400"
                                          : channel.sentiment === "Negative"
                                          ? "border-red-500/50 text-red-400"
                                          : "border-yellow-500/50 text-yellow-400"
                                      }`}
                                    >
                                      Sentiment: {channel.sentiment}
                                    </Badge>
                                  </div>
                                )}
                              </Card>
                            ))}
                          </div>
                        )}

                        {message.data.actions && message.data.actions.length > 0 && (
                          <div className="mt-4">
                            <div className="font-semibold text-electric-violet mb-2">Recommended Actions:</div>
                            <div className="space-y-2">
                              {message.data.actions.map((action, idx) => (
                                <Card
                                  key={idx}
                                  className="bg-app-black/50 border-(--border) p-3"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${getPriorityColor(action.priority)}`}
                                        >
                                          {action.priority.toUpperCase()}
                                        </Badge>
                                        {action.timeframe && (
                                          <span className="text-xs text-manatee">{action.timeframe}</span>
                                        )}
                                      </div>
                                      <div className="text-sm font-medium text-white mb-1">
                                        {action.action}
                                      </div>
                                      <div className="text-xs text-gray-400">{action.reason}</div>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-app-blue/10 text-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-electric-violet rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-electric-violet rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-electric-violet rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {showSuggestions && messages.length === 1 && (
              <div className="px-6 pb-4 border-t border-(--border) pt-4">
                <div className="text-sm text-manatee mb-3">Try asking:</div>
                <div className="grid grid-cols-2 gap-2">
                  {PREDEFINED_QUESTIONS.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(question)}
                      className="text-left px-4 py-2 rounded-lg border border-electric-violet/30 text-electric-violet hover:bg-electric-violet/10 hover:border-electric-violet/50 transition-colors text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="border-t border-(--border) p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your business data..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  Send
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
