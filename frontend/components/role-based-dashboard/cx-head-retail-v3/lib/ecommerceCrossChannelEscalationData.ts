import type { LucideIcon } from "lucide-react";
import { Mail, MessageSquare, Phone, Share2, Star } from "lucide-react";
import type { CustomerHappinessDrill } from "./cxHeadRetailV3HubCards";

export type ChannelEscalationFlow = {
  from: string;
  to: string;
  customers: number;
};

export type ImpactChannelMeta = {
  icon: LucideIcon;
  color: string;
};

export const IMPACT_CHANNEL_META: Record<string, ImpactChannelMeta> = {
  Voice: { icon: Phone, color: "#E11D48" },
  Chat: { icon: MessageSquare, color: "#EA580C" },
  Email: { icon: Mail, color: "#0D9488" },
  "App reviews": { icon: Star, color: "#8B7CF6" },
  Social: { icon: Share2, color: "#06b6d4" },
};

export function parseMentionCount(text: string): number {
  const match = text.match(/[\d,]+/);
  if (!match) return 0;
  return Number.parseInt(match[0].replace(/,/g, ""), 10) || 0;
}

export function buildEscalationMatrix(
  channelNames: readonly string[],
  flows: ChannelEscalationFlow[],
): Record<string, Record<string, number>> {
  const matrix: Record<string, Record<string, number>> = {};

  channelNames.forEach((origin) => {
    matrix[origin] = {};
    channelNames.forEach((target) => {
      matrix[origin][target] = 0;
    });
  });

  flows.forEach(({ from, to, customers }) => {
    if (from === to || !matrix[from] || matrix[from][to] === undefined) return;
    matrix[from][to] = customers;
  });

  return matrix;
}

export function escalationMatrixMax(matrix: Record<string, Record<string, number>>): number {
  let max = 0;
  Object.values(matrix).forEach((row) => {
    Object.values(row).forEach((count) => {
      max = Math.max(max, count);
    });
  });
  return max;
}

export function escalationHeatTone(count: number, maxCount: number): { bg: string; glow: string } {
  if (count <= 0) return { bg: "transparent", glow: "none" };
  const ratio = count / Math.max(1, maxCount);
  if (ratio >= 0.85) {
    return {
      bg: "rgba(223, 22, 22, 0.80)",
      glow: "0 0 12px rgba(223, 22, 22, 0.96), 0 0 6px rgba(223, 22, 22, 0.96)",
    };
  }
  if (ratio >= 0.45) {
    return {
      bg: "rgba(223, 131, 22, 0.68)",
      glow: "0 0 12px rgba(223, 131, 22, 0.81), 0 0 6px rgba(223, 131, 22, 0.81)",
    };
  }
  return {
    bg: "rgba(43, 223, 22, 0.42)",
    glow: "0 0 10px rgba(43, 223, 22, 0.62), 0 0 5px rgba(43, 223, 22, 0.62)",
  };
}

export function buildImpactChannelIndex(
  channels: CustomerHappinessDrill["channels"],
): Map<string, { mentions: string; count: number }> {
  return new Map(
    channels.map((channel) => [channel.name, { mentions: channel.mentions, count: parseMentionCount(channel.mentions) }]),
  );
}

export function totalEscalationCustomers(flows: ChannelEscalationFlow[]): number {
  return flows.reduce((sum, flow) => sum + flow.customers, 0);
}
