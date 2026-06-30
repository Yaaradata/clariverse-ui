/**
 * Sterling Bank · head_contact — AI Summary Wall copy for all three drill-downs.
 * UK digital-bank voice (Trustpilot, App Store, FOS/Consumer Duty, Starling Assistant).
 */

export type SterlingHeadContactSummaryInsight = {
  tone: "danger" | "warning" | "info";
  title: string;
  body: string;
};

/** Drill 1 — Is every contact ending well? */
export const STERLING_HEAD_CONTACT_DRILL1_INSIGHTS: SterlingHeadContactSummaryInsight[] =
  [
    {
      tone: "danger",
      title: "Per-contact resolution is breaking on in-app chat + complaints",
      body: "Chat tone-drift 22% and Complaints premature-closure 11% are the worst cells. Passcode-reset and payment-declined journeys account for ~60% of poor-ending contacts this week.",
    },
    {
      tone: "warning",
      title: "Fee/charge disputes and payment declines drive half of all repeats",
      body: "412 + 248 repeat contacts — 49% of total. No standard playbook for payee-block or dispute representment; agents improvise, inflating AHT and avoidable cost-to-serve.",
    },
    {
      tone: "info",
      title: "Switch-intent surfacing in voice before balances move",
      body: "18% of evening-shift contacts show softening sentiment-at-close — 2.4× day-shift rate. 'Moving to Monzo/Chase' language clustering 48h before outbound transfers.",
    },
  ];

/** Drill 2 — Is our service shaping how we're seen? */
export const STERLING_HEAD_CONTACT_DRILL2_INSIGHTS: SterlingHeadContactSummaryInsight[] =
  [
    {
      tone: "danger",
      title: "Hold-time is now defining public service perception",
      body: "482 mentions of 'kept on hold > 30 min' across Trustpilot and X. Viral posts are amplifying fastest on X while Trustpilot gives the narrative long-tail credibility.",
    },
    {
      tone: "warning",
      title: "App Store service perception is decaying",
      body: "Service complaints in App Store reviews are up 3.8× in 8 weeks. Customers repeatedly cite 'no one answered' and 'Starling Assistant did not resolve'.",
    },
    {
      tone: "info",
      title: "Payee-block and callback failures spreading across review channels",
      body: "Trustpilot and App Store carry the most durable negative service evidence; X and Reddit are accelerating FOS / Consumer Duty spillover on disputed payments.",
    },
  ];

/** Drill 3 — Is the service engine running clean? */
export const STERLING_HEAD_CONTACT_DRILL3_INSIGHTS: SterlingHeadContactSummaryInsight[] =
  [
    {
      tone: "danger",
      title: "BPO Beta is the single biggest operational risk",
      body: "19pt FCR gap and a 33pt dispute-win-rate gap (38% vs 71% in-house). Mumbai centre health 64/100 — evidence-collection step ~4 days slower than London in-house.",
    },
    {
      tone: "warning",
      title: "10–11 AM peak is short 12 agents · SLA bleeding 4pts",
      body: "Workforce gap concentrated in the morning peak. Activate overflow before 9:45 AM and rebalance Manchester (8 short) to keep SLA above 90%.",
    },
    {
      tone: "info",
      title: "Consumer Duty holding, but two active red flags",
      body: "FOS exposure on payee-block journeys (18 open), KYC handoff failing on 12% of digital→voice transitions. Starling Assistant containment at 84% — override calls rising.",
    },
  ];

export function sterlingHeadContactDrillInsights(
  drill: 1 | 2 | 3,
): SterlingHeadContactSummaryInsight[] {
  switch (drill) {
    case 1:
      return STERLING_HEAD_CONTACT_DRILL1_INSIGHTS;
    case 2:
      return STERLING_HEAD_CONTACT_DRILL2_INSIGHTS;
    case 3:
      return STERLING_HEAD_CONTACT_DRILL3_INSIGHTS;
    default: {
      const _exhaustive: never = drill;
      return _exhaustive;
    }
  }
}
