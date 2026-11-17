/** The three Cards drill-downs and their routes (30 Sep review C4). Server-safe: no client code here. */
export type DrillDownId = "happy" | "market" | "service";

export const DRILL_DOWNS: { id: DrillDownId; title: string; sub: string }[] = [
  {
    id: "happy",
    title: "Are my customers happy?",
    sub: "Public voice about Everyday accounts and app, source-weighted; the bank's own Everyday accounts and app contacts by list and stage.",
  },
  {
    id: "market",
    title: "What is the market saying about us?",
    sub: "Every public Everyday accounts and app theme in the period, what is rising, who has reach, and the stores.",
  },
  {
    id: "service",
    title: "Are we meeting our service standards?",
    sub: "How Everyday accounts and app contacts are handled, where they escalate, and which service standards customers say were missed. No service standard compliance figures.",
  },
];
