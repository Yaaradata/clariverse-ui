/**
 * Ask LisN suggested questions (30 Sep review, K5). Each answer is built from the page's own period figures
 * (periods.json), so it always matches the screen: a short answer plus a small table. No live model call.
 * One Cards question asks about another business and is refused, to show role-based access.
 */

import { fmt, fmtDate, fmtPct, fmtSigned } from "./format";
import { CHANNEL_LABEL, CHANNEL_ORDER, type Period } from "./periods";

export type AskQA = {
  id: string;
  q: string;
  answer: string;
  table?: { head: string[]; rows: string[][] };
  link?: { label: string; href: string };
  /** Refused under role-based access. */
  denied?: boolean;
};

export type AskScope = "md" | "cards";

const CARDS = "/hdfc-pulse/v2/business/cards";
const dash = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : fmt(n);
const withPeriod = (href: string, p: Period) => `${href}?period=${p.id}`;

export function mdQuestions(p: Period): AskQA[] {
  const cp = p.customer_pulse;
  const i = p.cx_pulse.internal;
  const sp = p.social_pulse;
  const b = p.brief;
  const biz = p.businesses;
  const byNeg = [...biz]
    .filter((x) => x.external.negative_share !== null)
    .sort(
      (x, y) =>
        (y.external.negative_share ?? 0) - (x.external.negative_share ?? 0),
    );
  const byOpen = [...biz].sort((x, y) => y.internal.open - x.internal.open);
  const chans = CHANNEL_ORDER.map((ch) => ({
    label: CHANNEL_LABEL[ch],
    ...i.by_channel[ch],
  })).sort((x, y) => y.volume - x.volume);
  const first = b.needs_you[0];
  return [
    {
      id: "md-needs",
      q: "Which business needs my attention first?",
      answer: first
        ? `${first.business_label}${first.issue ? `: ${first.issue}` : ""}. ${first.text}`
        : "Nothing meets the rule in this period.",
      table: {
        head: ["Business", "Issue", "Why"],
        rows: b.needs_you.map((x) => [
          x.business_label,
          x.issue ?? "—",
          x.text,
        ]),
      },
    },
    {
      id: "md-lists",
      q: "How are our most sensitive customers being served?",
      answer: `Across the four lists, on the bank's own channels: ${cp.lists.map((l) => `${l.label} ${fmt(l.open)} open`).join("; ")}. RMs alerted for ${fmt(cp.rm.alerted)} of ${fmt(cp.rm.of)} customers due an alert.`,
      table: {
        head: [
          "List",
          "Contacts",
          "Open",
          "Waiting on customer",
          "No reply 48 h",
          "RMs alerted",
        ],
        rows: cp.lists.map((l) => [
          l.label,
          fmt(l.volume),
          fmt(l.open),
          fmt(l.waiting_on_customer),
          dash(l.not_responded_48h),
          `${fmt(l.rm.alerted)} of ${fmt(l.rm.of)}`,
        ]),
      },
    },
    {
      id: "md-open",
      q: "How many contacts are open too long?",
      answer:
        i.open_too_long === null
          ? `${fmt(i.open)} contacts are open with the bank and ${fmt(i.waiting_on_customer)} are waiting on the customer. "Open too long" needs 48 hours, so it is not measured for the Morning brief.`
          : `${fmt(i.open_too_long)} of ${fmt(i.open)} open contacts have been with the bank more than 48 hours. ${fmt(i.waiting_on_customer)} more are waiting on the customer and are not counted as open.`,
      table: {
        head: ["Channel", "Open", "Waiting on customer", "Open too long"],
        rows: chans.map((c) => [
          c.label,
          fmt(c.open),
          fmt(c.waiting_on_customer),
          dash(c.open_too_long),
        ]),
      },
    },
    {
      id: "md-channel",
      q: "Which channel carries the most contacts?",
      answer: `${chans[0].label}, with ${fmt(chans[0].volume)} of ${fmt(i.volume)} internal contacts (${fmtPct((100 * chans[0].volume) / (i.volume || 1))}).`,
      table: {
        head: ["Channel", "Contacts", "Resolved"],
        rows: chans.map((c) => [c.label, fmt(c.volume), dash(c.resolved)]),
      },
    },
    {
      id: "md-backlog",
      q: "Which business has the largest backlog?",
      answer: `${byOpen[0].label}: ${fmt(byOpen[0].internal.open)} open with the bank${byOpen[0].internal.open_too_long === null ? "" : `, ${fmt(byOpen[0].internal.open_too_long)} of them for more than 48 hours`}.`,
      table: {
        head: ["Business", "Open", "Waiting on customer", "Open too long"],
        rows: byOpen.map((x) => [
          x.label,
          fmt(x.internal.open),
          fmt(x.internal.waiting_on_customer),
          dash(x.internal.open_too_long),
        ]),
      },
    },
    {
      id: "md-negative",
      q: "Which business has the most negative public voice?",
      answer: byNeg[0]
        ? `${byNeg[0].label}: ${fmtPct(byNeg[0].external.negative_share)} of its public voice is negative, source-weighted (${fmt(byNeg[0].external.volume)} items).`
        : "Too few public items in this period to compare.",
      table: {
        head: ["Business", "Public items", "Negative share", "Top issue"],
        rows: byNeg.map((x) => [
          x.label,
          fmt(x.external.volume),
          fmtPct(x.external.negative_share),
          x.top_issue?.label ?? "—",
        ]),
      },
    },
    {
      id: "md-building",
      q: "What is building in public voice?",
      answer: b.building[0]
        ? `${b.building[0].issue ?? b.building[0].business_label} (${b.building[0].business_label}). ${b.building[0].text}`
        : "No issue is building by the rule in this period.",
      table: {
        head: ["Business", "Issue", "Signal"],
        rows: b.building.map((x) => [x.business_label, x.issue ?? "—", x.text]),
      },
    },
    {
      id: "md-improving",
      q: "What is improving or stable?",
      answer: b.improving[0]
        ? `${b.improving[0].business_label}. ${b.improving[0].text}`
        : "Nothing meets the rule in this period.",
      table: {
        head: ["Business", "Status", "Detail"],
        rows: b.improving.map((x) => [
          x.business_label,
          x.status ?? "—",
          x.text,
        ]),
      },
    },
    {
      id: "md-trending",
      q: "What is trending on social media?",
      answer: sp.posts[0]
        ? `${fmt(sp.mentions)} public mentions, ${fmt(sp.high_impact)} of them high impact. The post with the most engagement is on ${sp.posts[0].platform} (${fmtDate(sp.posts[0].date)}).`
        : `${fmt(sp.mentions)} public mentions; none with engagement in this period.`,
      table: {
        head: ["Post", "Platform", "Engagement"],
        rows: sp.posts.map((x) => [
          x.text,
          `${x.platform} · ${fmtDate(x.date)}`,
          fmt(x.score),
        ]),
      },
    },
    {
      id: "md-response",
      q: "Did the bank respond to public posts?",
      answer: sp.tracked
        ? `The bank replied to ${fmt(sp.responded)} of ${fmt(sp.tracked)} Play Store reviews (${sp.response_pct}%), the only source with reply data; ${fmt(sp.high_impact_responded)} of ${fmt(sp.high_impact_tracked)} high-impact reviews. Response means acknowledged and routed to an official channel. Informational, not a target.`
        : "No Play Store reviews in this period, and replies on other platforms are not collected.",
      table: {
        head: ["Platform", "Mentions"],
        rows: Object.entries(sp.by_platform).map(([k, v]) => [k, fmt(v)]),
      },
    },
  ];
}

export function cardsQuestions(p: Period): AskQA[] {
  const c = p.cards;
  const sv = c.service_full;
  const mk = c.market_full;
  const cats = c.categories.filter((x) => x.id !== "other");
  const late = [...cats].sort(
    (x, y) =>
      (y.internal.not_responded_48h ?? 0) - (x.internal.not_responded_48h ?? 0),
  );
  const act = [...cats]
    .map((x) => ({
      x,
      score:
        (x.internal.not_responded_48h ?? x.internal.open) +
        x.external.escalation,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const chans = CHANNEL_ORDER.map((ch) => [
    CHANNEL_LABEL[ch],
    fmt(c.channels.internal[ch] ?? 0),
  ]);
  return [
    {
      id: "cards-top",
      q: "What are the top issues in Cards?",
      answer: `${c.categories[0].label} leads: ${fmt(c.categories[0].internal.volume)} internal contacts and ${fmt(c.categories[0].external.volume)} public items.`,
      table: {
        head: ["Category", "Internal", "Open", "Public", "Negative public"],
        rows: c.categories
          .slice(0, 5)
          .map((x) => [
            x.label,
            fmt(x.internal.volume),
            fmt(x.internal.open),
            fmt(x.external.volume),
            fmt(x.external.negative),
          ]),
      },
    },
    {
      id: "cards-late",
      q: "Where are replies late?",
      answer:
        c.internal.not_responded_48h === null
          ? "A reply can only be 48 hours late in a period longer than 48 hours; pick 7 days or more."
          : `${fmt(c.internal.not_responded_48h)} Cards contacts waited more than 48 hours for a first reply. ${late[0].label} has the most (${dash(late[0].internal.not_responded_48h)}). Threads waiting on the customer are not counted.`,
      table: {
        head: [
          "Category",
          "Not responded to in 48h+",
          "Open",
          "Waiting on customer",
        ],
        rows: late
          .slice(0, 5)
          .map((x) => [
            x.label,
            dash(x.internal.not_responded_48h),
            fmt(x.internal.open),
            fmt(x.internal.waiting_on_customer),
          ]),
      },
    },
    {
      id: "cards-act",
      q: "What should the Cards team act on first?",
      answer: act[0]
        ? `${act[0].x.label} (${act[0].x.owner}): the most late replies plus public escalation language. Recommended: route with evidence. LisN recommends; people act.`
        : "No category stands out in this period.",
      table: {
        head: ["Category", "Owner", "Late replies", "Public escalation"],
        rows: act.map(({ x }) => [
          x.label,
          x.owner,
          dash(x.internal.not_responded_48h),
          fmt(x.external.escalation),
        ]),
      },
    },
    {
      id: "cards-timelines",
      q: "Are we keeping our timelines?",
      answer: `${fmt(sv.missed_timelines.total)} public Cards posts describe a missed timeline, ${fmt(sv.transparency.count)} ask where something is, and ${fmt(sv.tat_related.contacts)} internal contacts (${fmtPct(sv.tat_related.share)}) carry a delivery timeline. Heard in public; not a compliance figure.`,
      table: {
        head: ["Request type", "Posts"],
        rows: sv.missed_timelines.rows.map((r) => [r.label, fmt(r.count)]),
      },
      link: {
        label: "Open the full timelines panel",
        href: withPeriod(`${CARDS}/service`, p),
      },
    },
    {
      id: "cards-escalate",
      q: "Where do Cards contacts escalate?",
      answer: `${fmt(c.internal.escalations)} internal contacts reached a grievance desk or beyond; ${fmt(sv.public_escalation)} public posts use escalation language${sv.targets[0] ? `, most naming ${sv.targets[0].label}` : ""}.`,
      table: {
        head: ["Rung (internal)", "Contacts"],
        rows: sv.ladder.map((x) => [x.rung, fmt(x.count)]),
      },
      link: {
        label: "Open the escalation ladder",
        href: withPeriod(`${CARDS}/service`, p),
      },
    },
    {
      id: "cards-channels",
      q: "Which channels do Cards customers use?",
      answer: `The bank's own Cards contacts by channel, ${fmt(c.internal.volume)} in all; and ${fmt(c.external.volume)} public items (${Object.entries(
        c.channels.external,
      )
        .map(([k, v]) => `${k} ${fmt(v)}`)
        .join(", ")}).`,
      table: { head: ["Internal channel", "Contacts"], rows: chans },
    },
    {
      id: "cards-rising",
      q: "Which Cards themes are rising in public?",
      answer: mk.rising[0]
        ? `${mk.rising[0].label}: share of voice ${fmtSigned(mk.rising[0].share_change_pct)} ${p.compare} (${fmt(mk.rising[0].count)} items).`
        : "No Cards theme is rising in this period.",
      table: {
        head: ["Theme", "Items", "Share of voice"],
        rows: mk.rising.map((t) => [
          t.label,
          fmt(t.count),
          fmtSigned(t.share_change_pct),
        ]),
      },
      link: {
        label: "Open the market panel",
        href: withPeriod(`${CARDS}/market`, p),
      },
    },
    {
      id: "cards-closure",
      q: "Are customers saying they will close their card?",
      answer: `${fmt(sv.closure.public_intent)} public posts say they will close the card or leave. The bank received ${fmt(sv.closure.internal_requests)} closure requests; ${fmt(sv.closure.internal_open)} are still open.`,
      table: {
        head: ["Measure", "Count"],
        rows: [
          ["Public posts with closure intent", fmt(sv.closure.public_intent)],
          ["Closure requests to the bank", fmt(sv.closure.internal_requests)],
          ["Closure requests still open", fmt(sv.closure.internal_open)],
        ],
      },
    },
    {
      id: "cards-disputes",
      q: "How are card disputes moving?",
      answer: `${sv.disputes.map((d) => `${d.stage.toLowerCase()} ${fmt(d.count)}`).join("; ")}.`,
      table: {
        head: ["Stage", "Disputes"],
        rows: sv.disputes.map((d) => [d.stage, fmt(d.count)]),
      },
    },
    {
      id: "cards-other-business",
      q: "How are Home loans customers doing this week?",
      answer:
        "You're not authorised to see this. Answers follow your bank's role-based access.",
      denied: true,
    },
  ];
}
