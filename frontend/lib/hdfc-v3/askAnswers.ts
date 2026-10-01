/**
 * Ask LisN suggested questions (30 Sep review, K5). Each answer is built from the page's own period figures
 * (periods.json), so it always matches the screen: a short answer plus a small table. No live model call.
 * One Cards question asks about another business and is refused, to show role-based access.
 */

import { fmt, fmtDate, fmtDateTime, fmtPct, fmtSigned } from "./format";
import {
  CHANNEL_LABEL,
  CHANNEL_ORDER,
  type OmbudsmanBlock,
  type Period,
} from "./periods";

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

/* ---------------------------------------------------------------- Ombudsman watch (ombudsman_watch_design.md) */

const signed = (n: number) =>
  n > 0 ? `up ${fmt(n)}` : n < 0 ? `down ${fmt(-n)}` : "no change";
const IO_NOTE = "IO timeline: confirm with the bank.";

function brinkQA(
  id: string,
  q: string,
  o: OmbudsmanBlock,
  scope: string,
): AskQA {
  const n = o.now;
  return {
    id,
    q,
    answer: `As of ${fmtDateTime(o.as_of)}, ${fmt(n.brink)} ${scope} complaints have no reply and 10 days or fewer to the 30-day limit (${fmt(n.buckets["0-3"])} with 3 days or fewer). ${fmt(n.eligible)} are already eligible to approach the RBI Ombudsman with no reply, and ${fmt(n.unhappy)} more because the customer is unhappy with the reply. That is ${fmt(n.at_risk)} at risk of ${fmt(n.open)} open complaints, ${signed(o.delta.at_risk)} since ${fmtDateTime(o.prev_as_of)}. Eligibility only; LisN does not predict who will file.`,
    table: {
      head: ["Measure", "Now", "Change"],
      rows: [
        ["0–3 days left", fmt(n.buckets["0-3"]), "—"],
        ["4–7 days left", fmt(n.buckets["4-7"]), "—"],
        ["8–10 days left", fmt(n.buckets["8-10"]), "—"],
        [
          "On the brink (10 days or fewer)",
          fmt(n.brink),
          signed(o.delta.brink),
        ],
        [
          "Eligible: past day 30, no reply",
          fmt(n.eligible),
          signed(o.delta.eligible),
        ],
        [
          "Eligible: unhappy with the reply",
          fmt(n.unhappy),
          signed(o.delta.unhappy),
        ],
        [
          "Awaiting Internal Ombudsman review",
          fmt(n.awaiting_io),
          signed(o.delta.awaiting_io),
        ],
      ],
    },
  };
}

function ioQA(id: string, o: OmbudsmanBlock, scope: string): AskQA {
  return {
    id,
    q: `How many ${scope}complaints are waiting for Internal Ombudsman review?`,
    answer: `${fmt(o.now.awaiting_io)} ${scope}complaints the bank has decided to partly or fully reject are waiting for Internal Ombudsman review, so their final reply cannot go out yet (${signed(o.delta.awaiting_io)} since ${fmtDateTime(o.prev_as_of)}). A slow review can take them past day 30. ${IO_NOTE}`,
  };
}

function ombudsmanMd(p: Period): AskQA[] {
  const o = p.ombudsman;
  const biz = [...o.by_business].sort((a, b) => b.at_risk - a.at_risk);
  return [
    brinkQA(
      "md-ombudsman",
      "How many complaints are on the brink of going to the Ombudsman?",
      o,
      "internal",
    ),
    {
      id: "md-ombudsman-business",
      q: "Which business has the most Ombudsman risk?",
      answer: `${biz[0].label}: ${fmt(biz[0].at_risk)} of the ${fmt(o.now.at_risk)} at-risk complaints (${fmt(biz[0].brink)} on the brink, ${fmt(biz[0].eligible)} eligible with no reply, ${fmt(biz[0].unhappy)} unhappy with the reply).`,
      table: {
        head: [
          "Business",
          "At risk",
          "On the brink",
          "Eligible, no reply",
          "Unhappy with reply",
        ],
        rows: biz.map((x) => [
          x.label,
          fmt(x.at_risk),
          fmt(x.brink),
          fmt(x.eligible),
          fmt(x.unhappy),
        ]),
      },
      link: {
        label: "Open the Cards business view",
        href: withPeriod(CARDS, p),
      },
    },
    {
      id: "md-ombudsman-lists",
      q: "Are customers on our lists at risk of going to the Ombudsman?",
      answer: `${fmt(o.on_lists.at_risk)} of the ${fmt(o.now.at_risk)} at-risk complaints come from customers on the bank's lists. The RM should hear first.`,
      table: {
        head: ["List", "At-risk complaints"],
        rows: Object.entries(o.on_lists.by_list).map(([k, v]) => [
          o.on_lists.labels[k],
          fmt(v),
        ]),
      },
    },
    ioQA("md-ombudsman-io", o, ""),
  ];
}

function ombudsmanCards(p: Period): AskQA[] {
  const o = p.cards.ombudsman;
  const cats = [...o.categories]
    .filter((c) => c.at_risk)
    .sort((a, b) => b.at_risk - a.at_risk);
  return [
    brinkQA(
      "cards-ombudsman",
      "How many Cards complaints are close to the Ombudsman?",
      o,
      "Cards",
    ),
    {
      id: "cards-ombudsman-save",
      q: "Which Cards complaints should we call today?",
      answer: o.save_list[0]
        ? `${o.save_list.length} complaints, highest risk first. The first: ${o.save_list[0].id}, ${o.save_list[0].issue} (${o.save_list[0].state === "eligible" ? "eligible" : `${o.save_list[0].days_left} days left`}). ${o.save_list[0].reason} Owner: ${o.save_list[0].owner}.`
        : "No Cards complaint is at risk.",
      table: {
        head: ["Complaint", "Status", "Owner"],
        rows: o.save_list.map((r) => [
          `${r.id} · ${r.issue}`,
          r.state === "eligible" ? "Eligible" : `${r.days_left} days left`,
          r.owner,
        ]),
      },
    },
    {
      id: "cards-ombudsman-categories",
      q: "Which Cards categories feed Ombudsman risk?",
      answer: cats[0]
        ? `${cats[0].label} has the most: ${fmt(cats[0].at_risk)} of ${fmt(o.now.at_risk)} at-risk Cards complaints.`
        : "No Cards category has an at-risk complaint.",
      table: {
        head: [
          "Category",
          "At risk",
          "On the brink",
          "Eligible, no reply",
          "Unhappy with reply",
        ],
        rows: cats.map((c) => [
          c.label,
          fmt(c.at_risk),
          fmt(c.brink),
          fmt(c.eligible),
          fmt(c.unhappy),
        ]),
      },
    },
    ioQA("cards-ombudsman-io", o, "Cards "),
  ];
}

export function mdQuestions(p: Period): AskQA[] {
  return [...ombudsmanMd(p), ...mdBase(p)];
}

function mdBase(p: Period): AskQA[] {
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
      answer: `The bank responded to ${fmt(sp.responded)} of ${fmt(sp.mentions)} public mentions (${sp.response_pct ?? "—"}%), and to ${fmt(sp.high_impact_responded)} of ${fmt(sp.high_impact)} high-impact ones. Response means acknowledged and routed to an official channel. Informational, not a target. Play Store replies are collected; the other sources are illustrative.`,
      table: {
        head: ["Source", "Mentions", "Responded", "Response"],
        rows: sp.by_source.map((x) => [
          `${x.label}${x.illustrative ? " (illustrative)" : ""}`,
          fmt(x.mentions),
          fmt(x.responded),
          x.pct === null ? "—" : `${x.pct}%`,
        ]),
      },
    },
  ];
}

export function cardsQuestions(p: Period): AskQA[] {
  return [...ombudsmanCards(p), ...cardsBase(p)];
}

function cardsBase(p: Period): AskQA[] {
  const c = p.cards;
  const sv = c.service_full;
  const mk = c.market_full;
  const cats = c.categories.filter((x) => x.id !== "other");
  const late = [...cats].sort(
    (x, y) =>
      (y.internal.not_responded_48h ?? 0) - (x.internal.not_responded_48h ?? 0),
  );
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
