/**
 * Flipkart Trustpilot – e-commerce topic volume split and topic whitelist for insights.
 * getTrustpilotTopicVolumeSplit returns e-commerce topics; ECOMMERCE_TOPICS is used as bankTopics in buildTrustpilotInsights.
 */

import type { TrustpilotTopicVolumeSplitEntry } from "@/lib/social/trustpilot/trustpilotInsights";

/** E-commerce topic names for Trustpilot “Top 10 Dominant Topics” and viral negative posts when Flipkart is selected. */
export const ECOMMERCE_TOPICS = [
  "Fast Delivery Praise",
  "Delivery Delays",
  "Refund Delays",
  "Return Pickup Experience",
  "Order Tracking Accuracy",
  "Product Quality Mismatch",
  "Checkout & Payment Issues",
  "Seller Communication",
  "Customer Support Wait",
  "Easy Returns Praise",
  "Deals & Offers",
  "App Experience",
  "Wrong Item Delivered",
  "Packaging Quality",
  "Wishlist & Cart",
  "Search & Discovery",
  "Price Drop Alerts",
  "Seller Ratings",
  "Replacement Flow",
  "Live Chat Support",
];

const TRUSTPILOT_TOPIC_VOLUME_SPLIT: TrustpilotTopicVolumeSplitEntry[] = [
  { name: "Delivery Delays", volume: 54, sentiment: "negative" },
  { name: "Refund Delays", volume: 48, sentiment: "negative" },
  { name: "Return Pickup Experience", volume: 45, sentiment: "negative" },
  { name: "Order Tracking Accuracy", volume: 42, sentiment: "negative" },
  { name: "Product Quality Mismatch", volume: 40, sentiment: "negative" },
  { name: "Fast Delivery Praise", volume: 38, sentiment: "positive" },
  { name: "Easy Returns Praise", volume: 36, sentiment: "positive" },
  { name: "Checkout & Payment Issues", volume: 34, sentiment: "negative" },
  { name: "Deals & Offers", volume: 31, sentiment: "positive" },
  { name: "Seller Communication", volume: 30, sentiment: "negative" },
  { name: "App Experience", volume: 28, sentiment: "positive" },
  { name: "Customer Support Wait", volume: 27, sentiment: "negative" },
  { name: "Packaging Quality", volume: 26, sentiment: "positive" },
  { name: "Wrong Item Delivered", volume: 25, sentiment: "negative" },
  { name: "Wishlist & Cart", volume: 24, sentiment: "positive" },
  { name: "Search & Discovery", volume: 23, sentiment: "negative" },
  { name: "Price Drop Alerts", volume: 22, sentiment: "positive" },
  { name: "Seller Ratings", volume: 21, sentiment: "negative" },
  { name: "Replacement Flow", volume: 20, sentiment: "negative" },
  { name: "Live Chat Support", volume: 19, sentiment: "positive" },
];

export function getTrustpilotTopicVolumeSplit(): TrustpilotTopicVolumeSplitEntry[] {
  return [...TRUSTPILOT_TOPIC_VOLUME_SPLIT];
}
