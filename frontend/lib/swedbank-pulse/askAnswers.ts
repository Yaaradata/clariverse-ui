/**
 * Ask LisN suggested questions (30 Sep review, K5). Each answer is built from the page's own period figures
 * (periods.json), so it always matches the screen: a short answer plus a small table. No live model call.
 * One Everyday accounts and app question asks about another product and is refused, to show role-based access.
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

const CARDS = "/swedbank-pulse/v1/business/everyday_accounts_app";
const dash = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : fmt(n);
const withPeriod = (href: string, p: Period) => `${href}?period=${p.id}`;

/* ---------------------------------------------------------------- ARN watch (SW-D06) */

const signed = (n: number) =>
  n > 0 ? `up ${fmt(n)}` : n < 0 ? `down ${fmt(-n)}` : "no change";
const IO_NOTE =
  "First reply within 15 business days (bank standard), then the bank's final decision and a Kundombudsman appeal.";
/** The four ARN watch tiles, in screen order (SW-D06). */
const TILE = {
  brink: "First reply overdue",
  eligible: "Final decision issued, Kundombudsman appeal open",
  unhappy: "Unhappy with the final decision (ARN eligible)",
  awaiting_io: "Filed with ARN",
} as const;

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
    answer: `As of ${fmtDateTime(o.as_of)}, ${fmt(n.brink)} ${scope} complaints have a first reply overdue (past 15 business days, bank standard). ${fmt(n.eligible)} have the bank's final decision with a Kundombudsman appeal open, and ${fmt(n.unhappy)} are unhappy with the final decision and ARN eligible. That is ${fmt(n.at_risk)} at risk (${signed(o.delta.at_risk)} since ${fmtDateTime(o.prev_as_of)}), of ${fmt(n.received)} complaints received in the window; ${fmt(n.open)} are open. Eligibility only; LisN does not predict who will file with ARN.`,
    table: {
      head: ["Measure", "Now", "Change"],
      rows: (["brink", "eligible", "unhappy", "awaiting_io"] as const).map(
        (k) => [TILE[k], fmt(n[k]), signed(o.delta[k])],
      ),
    },
  };
}

function ioQA(id: string, o: OmbudsmanBlock, scope: string): AskQA {
  return {
    id,
    q: `How many ${scope}complaints are filed with ARN?`,
    answer: `${fmt(o.now.awaiting_io)} ${scope}complaints are filed with ARN (${signed(o.delta.awaiting_io)} since ${fmtDateTime(o.prev_as_of)}). ${IO_NOTE}`,
  };
}

const RISK_HEAD = [
  "At risk",
  "First reply overdue",
  "Appeal open",
  "ARN eligible",
];

function ombudsmanMd(p: Period): AskQA[] {
  const o = p.ombudsman;
  const biz = [...o.by_business].sort((a, b) => b.at_risk - a.at_risk);
  return [
    brinkQA(
      "md-ombudsman",
      "How many complaints could go to ARN?",
      o,
      "internal",
    ),
    {
      id: "md-ombudsman-business",
      q: "Which product has the most ARN risk?",
      answer: biz[0]
        ? `${biz[0].label}: ${fmt(biz[0].at_risk)} of the ${fmt(o.now.at_risk)} at-risk complaints (${fmt(biz[0].brink)} first reply overdue, ${fmt(biz[0].eligible)} with a Kundombudsman appeal open, ${fmt(biz[0].unhappy)} ARN eligible).`
        : "— (no complaint is at risk in this period).",
      table: {
        head: ["Product", ...RISK_HEAD],
        rows: o.by_business.map((x) => [
          x.label,
          fmt(x.at_risk),
          fmt(x.brink),
          fmt(x.eligible),
          fmt(x.unhappy),
        ]),
      },
      link: biz[0]
        ? {
            label: `Open the ${biz[0].label} product view`,
            href: withPeriod(`/swedbank-pulse/v1/business/${biz[0].id}`, p),
          }
        : undefined,
    },
    {
      id: "md-ombudsman-lists",
      q: "Are customers on our lists at risk of going to ARN?",
      answer: `${fmt(o.on_lists.at_risk)} of the ${fmt(o.now.at_risk)} at-risk complaints come from customers on the bank's lists (a customer can be on more than one list). Their owners should hear first.`,
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
      "How many Everyday accounts and app complaints could go to ARN?",
      o,
      "Everyday accounts and app",
    ),
    {
      id: "cards-ombudsman-save",
      q: "Which Everyday accounts and app complaints should we call today?",
      answer: o.save_list[0]
        ? `${o.save_list.length} complaints, highest risk first. The first: ${o.save_list[0].id}, ${o.save_list[0].issue} (${o.save_list[0].state === "eligible" ? "Kundombudsman appeal open" : o.save_list[0].days_left === null ? "first reply overdue" : `${o.save_list[0].days_left} days left`}). ${o.save_list[0].reason} Owner: ${o.save_list[0].owner}.`
        : "No Everyday accounts and app complaint is at risk.",
      table: {
        head: ["Complaint", "Status", "Owner"],
        rows: o.save_list.map((r) => [
          `${r.id} · ${r.issue}`,
          r.state === "eligible"
            ? "Appeal open"
            : r.days_left === null
              ? "Reply overdue"
              : `${r.days_left} days left`,
          r.owner,
        ]),
      },
    },
    {
      id: "cards-ombudsman-categories",
      q: "Which Everyday accounts and app categories feed ARN risk?",
      answer: cats[0]
        ? `${cats[0].label} has the most: ${fmt(cats[0].at_risk)} of ${fmt(o.now.at_risk)} at-risk Everyday accounts and app complaints.`
        : "No Everyday accounts and app category has an at-risk complaint.",
      table: {
        head: ["Category", ...RISK_HEAD],
        rows: cats.map((c) => [
          c.label,
          fmt(c.at_risk),
          fmt(c.brink),
          fmt(c.eligible),
          fmt(c.unhappy),
        ]),
      },
    },
    ioQA("cards-ombudsman-io", o, "Everyday accounts and app "),
  ];
}

/* ---------------------------------------------------------------- the five persona questions (SW-D12) */

const NINA_MODULE = "/swedbank-pulse/v1/module/nina_digital";
const pctOf = (a: number, b: number) => (b ? (100 * a) / b : null);

/**
 * Head of Customer Experience questions, built from the period figures only (no typed figures). `p` is the selected
 * period; `week` the Last 7 days and `full` the Full window, for the questions that name their own time span.
 */
export function personaQuestions(
  p: Period,
  week: Period = p,
  full: Period = p,
): AskQA[] {
  return [
    nkiQA(p),
    appUpdateQA(full),
    arnWeekQA(week),
    measureOwnerQA(p),
    ninaQA(full),
  ];
}

function nkiQA(p: Period): AskQA {
  // SW-D19: a product with fewer than 3 public items shows its share on the card but never leads a ranking.
  const rankable = (x: Period["businesses"][number]) => x.external.volume >= 3;
  const rows = [...p.businesses].sort(
    (x, y) =>
      Number(rankable(y)) - Number(rankable(x)) ||
      (y.external.negative_share ?? -1) - (x.external.negative_share ?? -1) ||
      y.internal.negative - x.internal.negative,
  );
  const inside = [...p.businesses].sort(
    (x, y) => y.internal.negative - x.internal.negative,
  )[0];
  const top = rows[0];
  const pub =
    top && top.external.negative_share !== null && rankable(top)
      ? `In public voice, ${top.label} loses the most: ${fmtPct(top.external.negative_share)} of its ${fmt(top.external.volume)} items are negative, source-weighted${top.top_issue ? `, led by ${top.top_issue.label.toLowerCase()}` : ""}.`
      : `Public voice is too thin in ${p.label.toLowerCase()} for a negative share (— with ${fmt(p.cx_pulse.external.volume)} items); counts are in the table.`;
  return {
    id: "persona-nki",
    q: "Where is NKI being lost this month?",
    answer: `${pub}${inside ? ` Inside the bank, ${inside.label} carries the most negative contacts (${fmt(inside.internal.negative)} of ${fmt(inside.internal.volume)}).` : ""} NKI itself is a survey measure; these are the signals that move it.`,
    table: {
      head: [
        "Product",
        "Public items",
        "Negative share",
        "Negative contacts",
        "Top issue",
      ],
      rows: rows.map((x) => [
        x.label,
        fmt(x.external.volume),
        x.external.negative_share === null
          ? `— (${fmt(x.external.volume)})`
          : fmtPct(x.external.negative_share),
        fmt(x.internal.negative),
        x.top_issue?.label ?? "—",
      ]),
    },
  };
}

/** SW-D16 Q2: what the app update cost in the stores this month (the full window), from the deep-dive store rows and
 * the app categories. Every figure comes from the period data. */
function appUpdateQA(full: Period): AskQA {
  const stores = full.cards.stores ?? [];
  const reviews = stores.reduce((s, x) => s + (x.reviews ?? 0), 0);
  const cats = full.cards.categories ?? [];
  const upd = cats.find((c) => c.id === "app_update");
  const rel = cats.find((c) => c.id === "app_reliability");
  const storeLine = stores
    .filter((x) => x.reviews)
    .map(
      (x) =>
        `${x.label} ${fmt(x.reviews)} reviews${x.avg_rating !== null ? `, average ${x.avg_rating.toFixed(1)} stars` : ""}${x.share_negative !== null ? `, ${fmtPct(x.share_negative)} negative` : ""}${x.complaints[0] ? ` (top complaint: ${x.complaints[0].label.toLowerCase()}, ${fmt(x.complaints[0].count)})` : ""}`,
    )
    .join("; ");
  return {
    id: "persona-app-update",
    q: "What did the app update cost us in the stores this month?",
    answer: `${
      upd
        ? `The app update drew ${fmt(upd.external.volume)} public items, ${fmt(upd.external.negative)} of them negative, and ${fmt(upd.internal.volume)} contacts inside the bank${rel ? `; app crashes and speed add ${fmt(rel.external.volume)} public items and ${fmt(rel.internal.volume)} contacts` : ""}.`
        : "—"
    } In the stores since ${fmtDate(full.start)}: ${storeLine || `— (${fmt(reviews)} reviews)`}.`,
    table: {
      head: ["Category", "Public items", "Negative public", "Contacts", "Open"],
      rows: [...cats]
        .filter((c) => c.id !== "other")
        .sort((a, b) => b.external.volume - a.external.volume)
        .map((c) => [
          c.label,
          fmt(c.external.volume),
          fmt(c.external.negative),
          fmt(c.internal.volume),
          fmt(c.internal.open),
        ]),
    },
    link: {
      label: "Open the Everyday accounts and app product view",
      href: withPeriod(CARDS, full),
    },
  };
}

function arnWeekQA(w: Period): AskQA {
  const o = w.ombudsman;
  const n = o.now;
  const biz = [...o.by_business].sort((a, b) => b.unhappy - a.unhappy);
  return {
    id: "persona-arn",
    q: "Which complaints are ARN-eligible this week?",
    answer: `As of ${fmtDateTime(o.as_of)}, ${fmt(n.unhappy)} complaints are unhappy with the bank's final decision and ARN eligible (${signed(o.delta.unhappy)} since ${fmtDateTime(o.prev_as_of)}). ${fmt(n.eligible)} more have a Kundombudsman appeal open and ${fmt(n.awaiting_io)} are filed with ARN.${biz[0] ? ` Most sit in ${biz[0].label} (${fmt(biz[0].unhappy)}).` : ""} Eligibility only; LisN does not predict who will file.`,
    table: {
      head: ["Product", "ARN eligible", "Appeal open", "First reply overdue"],
      rows: biz.map((x) => [
        x.label,
        fmt(x.unhappy),
        fmt(x.eligible),
        fmt(x.brink),
      ]),
    },
  };
}

function measureOwnerQA(p: Period): AskQA {
  const q = "How many account-measure customers have no owner?";
  const lists = p.customer_pulse.lists;
  const l =
    lists.find((x) => /account[- ]measure/i.test(x.label)) ??
    lists.find((x) => x.id === "multi");
  if (!l)
    return {
      id: "persona-measures",
      q,
      answer: "— (the account-measure list is not in this period).",
    };
  const none = Math.max(0, l.rm.of - l.rm.alerted);
  return {
    id: "persona-measures",
    q,
    answer: `${fmt(none)} of ${fmt(l.rm.of)} ${l.label.toLowerCase()} customers due an owner alert have no owner alerted yet. In ${p.label.toLowerCase()}, ${fmt(l.in_contact)} of them were in contact, with ${fmt(l.open)} contacts open${l.not_responded_48h === null ? "" : ` and ${fmt(l.not_responded_48h)} with no reply after 48 hours`}.`,
    table: {
      head: ["Measure", "Count"],
      rows: [
        ["Due an owner alert", fmt(l.rm.of)],
        ["Owners alerted", fmt(l.rm.alerted)],
        ["No owner yet", fmt(none)],
        ["Contacts open", fmt(l.open)],
        ["No reply 48 h", dash(l.not_responded_48h)],
      ],
    },
  };
}

function ninaQA(full: Period): AskQA {
  const q = "Where does Nina hand off and lose the customer?";
  const link = { label: "Open the Nina module", href: NINA_MODULE };
  const c = full.cora;
  if (!c)
    return {
      id: "persona-nina",
      q,
      answer: "— (no Nina figures in this period).",
      link,
    };
  const rows = [...c.rows].sort(
    (a, b) => b.internal.volume - a.internal.volume,
  );
  const handoff = c.rows.find((r) => r.id === "nina_handoff_lost");
  const r = c.returns;
  const back = r?.resolved ? pctOf(r.back_7d, r.resolved) : null;
  return {
    id: "persona-nina",
    q,
    answer: `${rows[0] ? `${rows[0].label} leads: ${fmt(rows[0].internal.volume)} contacts where Nina did not finish the job, ${fmt(rows[0].internal.open)} still open.` : "—"}${handoff && handoff !== rows[0] ? ` ${handoff.label}: ${fmt(handoff.internal.volume)} contacts.` : ""}${r?.resolved ? ` Of ${fmt(r.resolved)} Nina conversations resolved ${fmtDate(r.from)} to ${fmtDate(r.until)}, ${fmt(r.back_7d)} (${fmtPct(back)}) came back as a call or a complaint within 7 days.` : ""}`,
    table: {
      head: [
        "Where Nina lost the customer",
        "Contacts",
        "Open",
        "Open too long",
      ],
      rows: rows.map((x) => [
        x.label,
        fmt(x.internal.volume),
        fmt(x.internal.open),
        dash(x.internal.open_too_long),
      ]),
    },
    link,
  };
}

export function mdQuestions(p: Period): AskQA[] {
  return [...ombudsmanMd(p), ...mdBase(p)];
}

function mdBase(p: Period): AskQA[] {
  const cp = p.customer_pulse;
  const i = p.cx_pulse.internal;
  const sp = p.social_pulse;
  const hh = sp.high_impact_handled;
  const mh = p.customer_pulse.mentions.handled;
  const b = p.brief;
  const biz = p.businesses;
  const byNeg = [...biz]
    .filter((x) => x.external.negative_share !== null && x.external.volume >= 3)
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
      q: "Which product needs my attention first?",
      answer: first
        ? `${first.business_label}${first.issue ? `: ${first.issue}` : ""}. ${first.text}`
        : "Nothing meets the rule in this period.",
      table: {
        head: ["Product", "Issue", "Why"],
        rows: b.needs_you.map((x) => [
          x.business_label,
          x.issue ?? "—",
          x.text,
        ]),
      },
    },
    {
      id: "md-lists",
      q: "How are customers in a vulnerable situation being served?",
      answer: `Across the four lists, on the bank's own channels: ${cp.lists.map((l) => `${l.label} ${fmt(l.open)} open`).join("; ")}. Owners alerted for ${fmt(cp.lists.reduce((s, l) => s + l.rm.alerted, 0))} of ${fmt(cp.lists.reduce((s, l) => s + l.rm.of, 0))} customers due an alert, across the four lists (a customer can be on more than one list).`,
      table: {
        head: [
          "List",
          "Contacts",
          "Open",
          "Waiting on customer",
          "No reply 48 h",
          "Owners alerted",
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
      q: "Which product has the largest backlog?",
      answer: `${byOpen[0].label}: ${fmt(byOpen[0].internal.open)} open with the bank${byOpen[0].internal.open_too_long === null ? "" : `, ${fmt(byOpen[0].internal.open_too_long)} of them for more than 48 hours`}.`,
      table: {
        head: ["Product", "Open", "Waiting on customer", "Open too long"],
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
      q: "Which product has the most negative public voice?",
      answer: byNeg[0]
        ? `${byNeg[0].label}: ${fmtPct(byNeg[0].external.negative_share)} of its public voice is negative, source-weighted (${fmt(byNeg[0].external.volume)} items).`
        : "Too few public items in this period to compare.",
      table: {
        head: ["Product", "Public items", "Negative share", "Top issue"],
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
        head: ["Product", "Issue", "Signal"],
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
        head: ["Product", "Status", "Detail"],
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
      // SW-D17: every source from the internal social inbox (Internal).
      answer: `Internal: the social inbox handled ${fmt(sp.by_source.reduce((n, x) => n + (x.responded ?? 0), 0))} of ${fmt(sp.by_source.reduce((n, x) => n + x.mentions, 0))} on-topic public items across the five sources (${sp.by_source.map((x) => `${x.label} ${x.pct ?? "—"}%`).join(", ")}). The social inbox also handled ${fmt(hh.handled)} of ${fmt(hh.total)} X and Reddit posts with reach and ${fmt(mh.handled)} of ${fmt(mh.total)} high-priority mentions, ${mh.within_24h_pct ?? "—"}% of mentions within 24 hours. Informational, not a target.`,
      table: {
        head: ["Source", "Basis", "Posts", "Responded or handled", "Rate"],
        rows: [
          ...sp.by_source.map((x) => [
            x.label,
            "Internal",
            fmt(x.mentions),
            fmt(x.responded ?? 0),
            x.pct === null ? "—" : `${x.pct}%`,
          ]),
          [
            "X and Reddit, posts with reach",
            "Internal",
            fmt(hh.total),
            fmt(hh.handled),
            hh.total ? `${Math.round((100 * hh.handled) / hh.total)}%` : "—",
          ],
          [
            "High-priority mentions",
            "Internal",
            fmt(mh.total),
            fmt(mh.handled),
            mh.total ? `${Math.round((100 * mh.handled) / mh.total)}%` : "—",
          ],
        ],
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
      q: "What are the top issues in Everyday accounts and app?",
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
          : `${fmt(c.internal.not_responded_48h)} Everyday accounts and app contacts waited more than 48 hours for a first reply. ${late[0].label} has the most (${dash(late[0].internal.not_responded_48h)}). Threads waiting on the customer are not counted.`,
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
      id: "cards-standards",
      q: "Are we meeting our service standards?",
      answer: `${fmt(sv.missed_timelines.total)} public Everyday accounts and app posts describe a missed service standard, ${fmt(sv.transparency.count)} ask where something is, and ${fmt(sv.tat_related.contacts)} internal contacts (${fmtPct(sv.tat_related.share)}) carry a delivery service standard. Heard in public; not a compliance figure.`,
      table: {
        head: ["Request type", "Posts"],
        rows: sv.missed_timelines.rows.map((r) => [r.label, fmt(r.count)]),
      },
      link: {
        label: "Open the full service standards panel",
        href: withPeriod(`${CARDS}/service`, p),
      },
    },
    {
      id: "cards-escalate",
      q: "Where do Everyday accounts and app contacts escalate?",
      answer: `${fmt(c.internal.escalations)} internal contacts were escalated to the complaints team or beyond; ${fmt(sv.public_escalation)} public posts use escalation language${sv.targets[0] ? `, most naming ${sv.targets[0].label}` : ""}.`,
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
      q: "Which channels do Everyday accounts and app customers use?",
      answer: `The bank's own Everyday accounts and app contacts by channel, ${fmt(c.internal.volume)} in all; and ${fmt(c.external.volume)} public items (${Object.entries(
        c.channels.external,
      )
        .map(([k, v]) => `${k} ${fmt(v)}`)
        .join(", ")}).`,
      table: { head: ["Internal channel", "Contacts"], rows: chans },
    },
    {
      id: "cards-rising",
      q: "Which Everyday accounts and app themes are rising in public?",
      answer: mk.rising[0]
        ? `${mk.rising[0].label}: share of voice ${fmtSigned(mk.rising[0].share_change_pct)} ${p.compare} (${fmt(mk.rising[0].count)} items).`
        : "No Everyday accounts and app theme is rising in this period.",
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
      q: "Are customers saying they will switch bank (byta bank)?",
      answer: `${fmt(sv.closure.public_intent)} public posts say they will leave or switch bank (byta bank). The bank received ${fmt(sv.closure.internal_requests)} closure requests; ${fmt(sv.closure.internal_open)} are still open.`,
      table: {
        head: ["Measure", "Count"],
        rows: [
          ["Public posts with switching intent", fmt(sv.closure.public_intent)],
          ["Closure requests to the bank", fmt(sv.closure.internal_requests)],
          ["Closure requests still open", fmt(sv.closure.internal_open)],
        ],
      },
    },
    {
      id: "cards-disputes",
      q: "How are payment disputes moving?",
      answer: `${sv.disputes.map((d) => `${d.stage.toLowerCase()} ${fmt(d.count)}`).join("; ")}.`,
      table: {
        head: ["Stage", "Disputes"],
        rows: sv.disputes.map((d) => [d.stage, fmt(d.count)]),
      },
    },
    {
      id: "cards-other-business",
      q: "How are Mortgages customers doing this week?",
      answer:
        "You're not authorised to see this. Answers follow your bank's role-based access.",
      denied: true,
    },
  ];
}
