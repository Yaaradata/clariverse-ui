import type { LucideIcon } from "lucide-react";
import { CheckCircle, Heart, ThumbsUp, Zap } from "lucide-react";

export type FciHeatmapCell = {
  score: number;
  caseCount: number;
  trend: "up" | "down" | "stable";
  avgHandleTime: string;
};

export type FciPillar = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
};

export type FciIntent = {
  id: string;
  label: string;
  shortLabel: string;
};

export const ECOMMERCE_FCI_PILLARS: FciPillar[] = [
  { id: "takeOwnership", label: "Take Ownership", icon: ThumbsUp, color: "#3b82f6" },
  { id: "actWithEmpathy", label: "Act with Empathy", icon: Heart, color: "#ec4899" },
  { id: "makeItEasy", label: "Make it Easy", icon: Zap, color: "#f97316" },
  { id: "getItRight", label: "Get it Right", icon: CheckCircle, color: "#22c55e" },
];

export const ECOMMERCE_FCI_INTENTS: FciIntent[] = [
  { id: "orderTracking", label: "Order Tracking & Status", shortLabel: "ORDER TRACKING" },
  { id: "returnsRefunds", label: "Returns & Refunds", shortLabel: "RETURNS" },
  { id: "productQuality", label: "Product Quality", shortLabel: "PRODUCT QUALITY" },
  { id: "shippingDelivery", label: "Shipping & Delivery", shortLabel: "SHIPPING" },
  { id: "paymentIssues", label: "Payment Issues", shortLabel: "PAYMENT" },
  { id: "promoOffers", label: "Promo & Offers", shortLabel: "PROMO" },
  { id: "accountLogin", label: "Account & Login", shortLabel: "ACCOUNT" },
  { id: "sellerDisputes", label: "Seller Disputes", shortLabel: "SELLER" },
  { id: "cancellation", label: "Cancellation", shortLabel: "CANCEL" },
];

export const ECOMMERCE_CARE_UNITS = [
  { value: "all", label: "All hubs" },
  { value: "bangalore", label: "Bangalore care hub" },
  { value: "delhi", label: "Delhi NCR hub" },
  { value: "mumbai", label: "Mumbai hub" },
  { value: "inhouse", label: "In-house voice" },
  { value: "bpo-trinetra", label: "BPO — Trinetra" },
  { value: "darkstore", label: "Dark-store liaison" },
];

/** Deterministic pillar × intent scores for retail e-commerce care. */
export const ECOMMERCE_FCI_HEATMAP: Record<string, Record<string, FciHeatmapCell>> = {
  takeOwnership: {
    orderTracking: { score: 74, caseCount: 2184, trend: "up", avgHandleTime: "5m 42s" },
    returnsRefunds: { score: 41, caseCount: 1632, trend: "down", avgHandleTime: "8m 14s" },
    productQuality: { score: 58, caseCount: 986, trend: "stable", avgHandleTime: "7m 3s" },
    shippingDelivery: { score: 46, caseCount: 1891, trend: "down", avgHandleTime: "6m 51s" },
    paymentIssues: { score: 36, caseCount: 1427, trend: "down", avgHandleTime: "7m 28s" },
    promoOffers: { score: 52, caseCount: 712, trend: "stable", avgHandleTime: "5m 19s" },
    accountLogin: { score: 68, caseCount: 534, trend: "up", avgHandleTime: "4m 56s" },
    sellerDisputes: { score: 44, caseCount: 621, trend: "down", avgHandleTime: "9m 2s" },
    cancellation: { score: 39, caseCount: 488, trend: "down", avgHandleTime: "6m 37s" },
  },
  actWithEmpathy: {
    orderTracking: { score: 71, caseCount: 1942, trend: "stable", avgHandleTime: "6m 8s" },
    returnsRefunds: { score: 38, caseCount: 1784, trend: "down", avgHandleTime: "9m 41s" },
    productQuality: { score: 49, caseCount: 1102, trend: "down", avgHandleTime: "8m 22s" },
    shippingDelivery: { score: 42, caseCount: 2016, trend: "down", avgHandleTime: "7m 55s" },
    paymentIssues: { score: 34, caseCount: 1318, trend: "down", avgHandleTime: "8m 6s" },
    promoOffers: { score: 55, caseCount: 648, trend: "stable", avgHandleTime: "5m 44s" },
    accountLogin: { score: 62, caseCount: 491, trend: "stable", avgHandleTime: "5m 12s" },
    sellerDisputes: { score: 37, caseCount: 574, trend: "down", avgHandleTime: "10m 18s" },
    cancellation: { score: 41, caseCount: 512, trend: "stable", avgHandleTime: "7m 4s" },
  },
  makeItEasy: {
    orderTracking: { score: 78, caseCount: 2056, trend: "up", avgHandleTime: "4m 31s" },
    returnsRefunds: { score: 43, caseCount: 1698, trend: "down", avgHandleTime: "9m 52s" },
    productQuality: { score: 51, caseCount: 924, trend: "stable", avgHandleTime: "6m 47s" },
    shippingDelivery: { score: 48, caseCount: 1822, trend: "down", avgHandleTime: "6m 19s" },
    paymentIssues: { score: 40, caseCount: 1386, trend: "down", avgHandleTime: "7m 44s" },
    promoOffers: { score: 61, caseCount: 688, trend: "up", avgHandleTime: "4m 58s" },
    accountLogin: { score: 66, caseCount: 502, trend: "stable", avgHandleTime: "4m 22s" },
    sellerDisputes: { score: 46, caseCount: 598, trend: "stable", avgHandleTime: "8m 36s" },
    cancellation: { score: 44, caseCount: 476, trend: "down", avgHandleTime: "6m 58s" },
  },
  getItRight: {
    orderTracking: { score: 81, caseCount: 1874, trend: "up", avgHandleTime: "5m 14s" },
    returnsRefunds: { score: 47, caseCount: 1542, trend: "stable", avgHandleTime: "10m 6s" },
    productQuality: { score: 56, caseCount: 1018, trend: "stable", avgHandleTime: "7m 38s" },
    shippingDelivery: { score: 51, caseCount: 1764, trend: "down", avgHandleTime: "7m 11s" },
    paymentIssues: { score: 42, caseCount: 1264, trend: "down", avgHandleTime: "8m 33s" },
    promoOffers: { score: 64, caseCount: 662, trend: "up", avgHandleTime: "5m 27s" },
    accountLogin: { score: 74, caseCount: 518, trend: "up", avgHandleTime: "4m 48s" },
    sellerDisputes: { score: 49, caseCount: 544, trend: "stable", avgHandleTime: "9m 44s" },
    cancellation: { score: 45, caseCount: 462, trend: "stable", avgHandleTime: "7m 22s" },
  },
};

export function fciScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 70) return "#84cc16";
  if (score >= 60) return "#eab308";
  if (score >= 50) return "#f97316";
  if (score >= 40) return "#ef4444";
  return "#dc2626";
}

export function fciScoreBg(score: number): string {
  if (score >= 80) return "rgba(34, 197, 94, 0.25)";
  if (score >= 70) return "rgba(132, 204, 22, 0.25)";
  if (score >= 60) return "rgba(234, 179, 8, 0.25)";
  if (score >= 50) return "rgba(249, 115, 22, 0.25)";
  if (score >= 40) return "rgba(239, 68, 68, 0.25)";
  return "rgba(220, 38, 38, 0.3)";
}

export function fciScoreLabel(score: number): "GOOD" | "AVG" | "LOW" {
  if (score >= 70) return "GOOD";
  if (score >= 50) return "AVG";
  return "LOW";
}

export function computeFciBottleneck(): { pillar: string; intent: string; score: number } {
  let worstScore = 100;
  let worstPillar = "";
  let worstIntent = "";

  ECOMMERCE_FCI_PILLARS.forEach((pillar) => {
    ECOMMERCE_FCI_INTENTS.forEach((intent) => {
      const score = ECOMMERCE_FCI_HEATMAP[pillar.id][intent.id].score;
      if (score < worstScore) {
        worstScore = score;
        worstPillar = pillar.label;
        worstIntent = intent.label;
      }
    });
  });

  return { pillar: worstPillar, intent: worstIntent, score: worstScore };
}

export function computeOwnershipAverage(): number {
  const scores = ECOMMERCE_FCI_INTENTS.map((intent) => ECOMMERCE_FCI_HEATMAP.takeOwnership[intent.id].score);
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

export function computeEfficiencyInsight(): {
  better: string;
  betterScore: number;
  worse: string;
  worseScore: number;
} {
  const tracking = ECOMMERCE_FCI_HEATMAP.makeItEasy.orderTracking.score;
  const returns = ECOMMERCE_FCI_HEATMAP.makeItEasy.returnsRefunds.score;
  return {
    better: "Order Tracking",
    betterScore: tracking,
    worse: "Returns & Refunds",
    worseScore: returns,
  };
}
