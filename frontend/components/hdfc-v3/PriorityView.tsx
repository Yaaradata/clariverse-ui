"use client";

/**
 * E2 · Priority relationships and E3 · Customer signal trail (B7 §1). Internal, illustrative, fictional personas only.
 * Cohorts come from the bank's own tiers and lists; high impact is a property of a complaint, never of a person.
 */

import {
  BellRing,
  ChevronRight,
  Flag,
  PhoneCall,
  Route,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { fmt, fmtDateTime } from "@/lib/hdfc-v3/format";
import type { Bundle, Persona, TrailStep } from "@/lib/hdfc-v3/types";
import {
  AnswerLine,
  C,
  MONO,
  MutedNote,
  OwnerChip,
  Table,
  Tile,
  tint,
} from "./primitives";
import { useFrom } from "./Shell";
import { hoursLabel } from "./V3Blocks";

const COHORT_LABEL: Record<string, string> = {
  priority_a: "Priority list A",
  priority_b: "Priority list B",
  uhni: "Ultra-HNI",
  hni: "HNI",
};
const PRODUCT_LABEL: Record<string, string> = {
  cards: "Cards",
  payzapp: "PayZapp and UPI",
  accounts: "Accounts and deposits",
  personal_loans: "Personal loans",
  home_loans: "Home loans",
  auto_loans: "Auto and two-wheeler loans",
  insurance: "Insurance",
  digital: "Digital",
};
const CHANNEL_ORDER = [
  "email",
  "inbound_voice",
  "outbound_voice",
  "chat",
  "whatsapp",
  "social_inbox",
  "ivr_bot",
  "branch",
];

function ageHours(iso: string, now: string): number {
  return (new Date(now).getTime() - new Date(iso).getTime()) / 3.6e6;
}

function CohortChips({ cohorts }: { cohorts: string[] }) {
  return (
    <span style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
      {cohorts.map((c) => (
        <span
          key={c}
          style={{
            fontSize: 12,
            color: c.startsWith("priority") ? C.red : C.violet,
            border: `1px solid ${tint(c.startsWith("priority") ? C.red : C.violet, 0.35)}`,
            background: tint(c.startsWith("priority") ? C.red : C.violet, 0.08),
            borderRadius: 999,
            padding: "1px 8px",
            whiteSpace: "nowrap",
          }}
        >
          {COHORT_LABEL[c] ?? c}
        </span>
      ))}
    </span>
  );
}

/* ================================================================= E2 */

/** RM status from the RM rule: no alert due, alert sent, or alert due but not sent. */
function rmStatus(p: { rm_alert_due: boolean; rm_notified: boolean }): string {
  if (!p.rm_alert_due) return "no alert due";
  return p.rm_notified ? "notified" : "not notified";
}
function rmColor(p: { rm_alert_due: boolean; rm_notified: boolean }): string {
  if (!p.rm_alert_due) return C.textMut;
  return p.rm_notified ? C.green : C.red;
}

export function PriorityView({ b }: { b: Bundle }) {
  const from = useFrom();
  const v = b.v3;
  const all = v.cohorts;
  const lists = all.filter((c) => c.id.startsWith("priority"));
  const openCustomers = lists.reduce(
    (s, c) => s + c.customers_with_open_issue,
    0,
  );
  const over24 = all.find((c) => c.id === "priority_a")?.open_over_24h ?? 0;
  const rmShould = lists.reduce((s, c) => s + c.rm_should_know, 0);
  const rmDid = lists.reduce((s, c) => s + c.rm_notified_today, 0);
  const hi = v.high_impact;
  const labels = v.channel_labels;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov="internal" accent tone="red">
        <AnswerLine
          sub={
            <>
              Flags prioritise service. They never restrict or downgrade it.
              LisN reads the lists the bank already keeps; it never infers who a
              customer is from public data.
            </>
          }
        >
          {fmt(openCustomers)} customers on the bank&apos;s priority lists have
          an issue open this morning; {fmt(over24)} issues on list A have been
          open for more than 24 hours. Their RMs know about {fmt(rmDid)} of{" "}
          {fmt(rmShould)}.
        </AnswerLine>
      </Tile>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: 14,
        }}
      >
        {all.map((c) => (
          <Tile
            key={c.id}
            id={c.id}
            title={c.label}
            sub={`${c.source} · ${fmt(c.customers)} customers in the sample`}
            prov="internal"
            tone={c.id.startsWith("priority") ? "red" : "violet"}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 6,
              }}
            >
              <Stat
                label="With open issue"
                value={fmt(c.customers_with_open_issue)}
              />
              <Stat label="Open" value={fmt(c.open)} color={C.amber} />
              <Stat
                label="Over 5 h"
                value={fmt(c.open_over_5h)}
                color={C.amber}
              />
              <Stat
                label="Over 24 h"
                value={fmt(c.open_over_24h)}
                color={C.red}
              />
            </div>
            <Table
              head={["Negative mentions by channel", ""]}
              align={["left", "right"]}
              rows={CHANNEL_ORDER.filter((ch) => c.negative_by_channel[ch]).map(
                (ch) => [labels[ch] ?? ch, fmt(c.negative_by_channel[ch])],
              )}
            />
            <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.5 }}>
              Products with open issues:{" "}
              {Object.entries(c.products_affected)
                .sort((a, z) => z[1] - a[1])
                .map(([p, n]) => `${PRODUCT_LABEL[p] ?? p} ${fmt(n)}`)
                .join(" · ") || "none"}
            </div>
            <div style={{ fontSize: 13.5, color: C.textSec }}>
              RM notified:{" "}
              <strong style={{ color: C.red }}>
                {fmt(c.rm_notified_today)} of {fmt(c.rm_should_know)}
              </strong>{" "}
              customers who should have an RM alert today.
            </div>
            <div style={{ fontSize: 13, color: C.textMut }}>
              Added this week: {fmt(c.added_this_week)}
              {c.added_this_week_by_lisn
                ? ` (${fmt(c.added_this_week_by_lisn)} suggested by LisN, confirmed by the bank)`
                : ""}
            </div>
          </Tile>
        ))}
      </div>

      <Tile
        id="customers"
        title="Priority customers this morning"
        sub="Fictional personas with masked ids. Each row opens the customer's signal trail across products and channels."
        prov="internal"
        tone="violet"
      >
        <Table
          head={[
            "Customer",
            "Cohort",
            "Products",
            "Latest signal",
            "Oldest open",
            "Owner",
            "RM",
            "",
          ]}
          align={[
            "left",
            "left",
            "left",
            "left",
            "right",
            "left",
            "left",
            "right",
          ]}
          rows={[...v.personas]
            .sort(
              (a, z) =>
                (z.oldest_open_hours ?? -1) - (a.oldest_open_hours ?? -1),
            )
            .map((p) => {
              const latestStep = p.trail[p.trail.length - 1];
              const href = `/hdfc-pulse/v2/customer/${p.masked_id}?from=${from}`;
              return [
                <Link
                  key="c"
                  href={href}
                  style={{
                    color: C.text,
                    textDecoration: "none",
                    fontWeight: 650,
                  }}
                >
                  {p.persona}
                  <div
                    style={{ fontSize: 12, color: C.textMut, fontFamily: MONO }}
                  >
                    {p.masked_id}
                  </div>
                </Link>,
                <CohortChips key="k" cohorts={p.cohorts} />,
                p.products.map((x) => PRODUCT_LABEL[x] ?? x).join(", "),
                <span key="l">
                  <span style={{ color: C.textMut }}>
                    {fmtDateTime(p.latest.at)} · {latestStep.channel_label}
                    {latestStep.sender === "proxy" ? " · assistant" : ""}
                  </span>
                  <div>{p.latest.summary}</div>
                </span>,
                <span
                  key="a"
                  style={{
                    fontFamily: MONO,
                    color:
                      (p.oldest_open_hours ?? 0) > 24
                        ? C.red
                        : (p.oldest_open_hours ?? 0) > 5
                          ? C.amber
                          : C.textSec,
                  }}
                >
                  {p.oldest_open_hours === null
                    ? "none open"
                    : hoursLabel(p.oldest_open_hours)}
                </span>,
                latestStep.team,
                <span key="rm">
                  {p.rm_id}
                  <div style={{ fontSize: 12, color: rmColor(p) }}>
                    {rmStatus(p)}
                  </div>
                </span>,
                <Link key="go" href={href} aria-label={`Open ${p.persona}`}>
                  <ChevronRight size={16} color={C.textMut} />
                </Link>,
              ];
            })}
        />
      </Tile>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
          gap: 14,
        }}
      >
        <Tile
          id="high-impact"
          title="High-impact complaints"
          sub="A property of the complaint, never a flag on the person. Any customer's complaint can be high impact."
          prov="internal"
          tone="amber"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 6,
            }}
          >
            <Stat label="In the window" value={fmt(hi.total)} />
            <Stat label="Open" value={fmt(hi.open)} color={C.amber} />
            <Stat
              label="Open too long"
              value={fmt(hi.open_too_long)}
              color={C.red}
            />
          </div>
          <Table
            head={["Why it is high impact", "Complaints"]}
            align={["left", "right"]}
            rows={hi.reasons.map((r) => [r.label, fmt(r.count)])}
          />
          <MutedNote>
            A complaint can carry more than one reason. &ldquo;Sent from an
            official or regulator domain&rdquo; reads the sender&apos;s email
            domain on that one message; it does not label the person.
          </MutedNote>
        </Tile>
        <Tile
          id="how-lists-work"
          title="How a customer gets on a list"
          sub="The cohort is appendable: the bank adds to it, and LisN suggests additions as signals arrive."
          prov="internal"
          tone="violet"
        >
          <ol
            style={{
              margin: 0,
              paddingLeft: 18,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 14,
              color: C.textSec,
              lineHeight: 1.5,
            }}
          >
            <li>
              <strong style={{ color: C.text }}>Relationship tier</strong> from
              core banking: ultra-HNI and HNI come from the bank&apos;s own
              segment, refreshed daily.
            </li>
            <li>
              <strong style={{ color: C.text }}>
                The bank&apos;s priority lists
              </strong>{" "}
              (lists A and B here, until the bank&apos;s own name for them is
              confirmed): maintained by the bank, for whatever reason the bank
              chooses. LisN reads the list; it does not store why a customer is
              on it.
            </li>
            <li>
              <strong style={{ color: C.text }}>Linked contacts</strong>: an
              assistant or office writing on the customer&apos;s behalf is
              linked only through contact details the bank already holds.
            </li>
            <li>
              <strong style={{ color: C.text }}>Suggestions</strong>: when a
              complaint is high impact, LisN can suggest adding the customer to
              a list. The bank confirms or declines.
            </li>
          </ol>
          <MutedNote>
            LisN never labels a customer by occupation and never profiles a
            named individual from public data.
          </MutedNote>
        </Tile>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "6px 8px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          fontFamily: MONO,
          color: color ?? C.text,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ================================================================= E3 */

function flaggedAt(p: Persona): number | null {
  const i = p.trail.findIndex((s) => s.flag_set);
  if (i >= 0) return i + 1;
  const neg = p.trail.findIndex((s) => s.sentiment === "negative");
  return neg >= 0 ? neg + 1 : null;
}

function StepRow({
  s,
  i,
  now,
  flagOn,
}: {
  s: TrailStep;
  i: number;
  now: string;
  flagOn: boolean;
}) {
  const open = s.status === "open";
  const age = open ? ageHours(s.at, now) : null;
  const color = s.event
    ? C.textMut
    : open
      ? (age ?? 0) > 24
        ? C.red
        : C.amber
      : C.green;
  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: "34px minmax(0, 1fr)",
        gap: 10,
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          width: 30,
          height: 30,
          borderRadius: 999,
          background: tint(color, 0.14),
          border: `1px solid ${tint(color, 0.5)}`,
          color,
          display: "grid",
          placeItems: "center",
          fontSize: 13,
          fontWeight: 800,
          fontFamily: MONO,
        }}
      >
        {i + 1}
      </div>
      <div
        style={{
          background: flagOn ? tint(C.violet, 0.05) : C.cardAlt,
          border: `1px solid ${flagOn ? tint(C.violet, 0.3) : C.border}`,
          borderRadius: 10,
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "baseline",
            fontSize: 13,
            color: C.textMut,
          }}
        >
          <span style={{ fontFamily: MONO, color: C.textSec }}>
            {fmtDateTime(s.at)}
          </span>
          <span>·</span>
          <span style={{ color: C.text, fontWeight: 650 }}>
            {s.channel_label}
          </span>
          <span>·</span>
          <span>
            {s.product_label} ({s.team} team)
          </span>
          {s.sender === "proxy" ? (
            <span
              style={{
                color: C.cyan,
                border: `1px solid ${tint(C.cyan, 0.35)}`,
                borderRadius: 999,
                padding: "0 8px",
              }}
            >
              Sent by the customer&apos;s assistant
            </span>
          ) : null}
        </div>
        <div style={{ fontSize: 14.5, color: C.textSec, lineHeight: 1.5 }}>
          {s.summary}
        </div>
        <div
          style={{ display: "flex", gap: 6, flexWrap: "wrap", fontSize: 12.5 }}
        >
          {s.event ? (
            <span style={{ color: C.textMut }}>System event</span>
          ) : (
            <span style={{ color }}>
              {open
                ? `Open ${hoursLabel(age)}${s.first_response_at ? "" : " · no response yet"}`
                : "Closed"}
            </span>
          )}
          {s.flag_set ? (
            <span style={{ color: C.violet, fontWeight: 700 }}>
              <Flag size={12} style={{ verticalAlign: "-1px" }} /> LisN sets the
              sensitivity flag here
            </span>
          ) : null}
          {s.flag_follows ? (
            <span style={{ color: C.violet, fontWeight: 700 }}>
              <Flag size={12} style={{ verticalAlign: "-1px" }} /> Flag follows
              the customer into {s.product_label}
            </span>
          ) : null}
          {s.high_impact.map((h) => (
            <span key={h} style={{ color: C.amber }}>
              High impact: {h}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}

export function CustomerTrail({ b, id }: { b: Bundle; id: string }) {
  const from = useFrom();
  const p = b.v3.personas.find((x) => x.masked_id === id);
  if (!p) return <MutedNote>Customer not found.</MutedNote>;
  const now = b.v3.now;
  const teams = new Set(p.trail.map((s) => s.team));
  const flagged = flaggedAt(p);
  const openSteps = p.trail.filter((s) => s.status === "open");
  const oldest = openSteps[0];
  const priority = p.cohorts.some(
    (c) => c.startsWith("priority") || c === "uhni",
  );
  const hasPublic = p.trail.some((s) => s.channel === "social_inbox");
  const hasProxy = p.trail.some((s) => s.sender === "proxy");
  const flagIndex = flagged ? flagged - 1 : -1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov="internal" accent tone="violet">
        <AnswerLine
          sub={
            p.trail.length > 1 ? (
              <>
                <strong style={{ color: C.red }}>Without LisN:</strong>{" "}
                {p.trail.length} touchpoints, {teams.size}{" "}
                {teams.size === 1 ? "team" : "teams"}, no one saw the pattern
                {p.rm_alert_due && !p.rm_notified
                  ? "; the RM was not told."
                  : "."}{" "}
                <strong style={{ color: C.green }}>With LisN:</strong> flagged
                at touchpoint {flagged}, the RM alerted, and every later contact
                opens with the history.
              </>
            ) : (
              <>
                One touchpoint so far. LisN holds it against the customer&apos;s
                record, so the next contact, in any product, opens with this
                history.
              </>
            )
          }
        >
          {p.persona} ({p.masked_id}): {openSteps.length} open{" "}
          {openSteps.length === 1 ? "item" : "items"}
          {oldest
            ? `, the oldest open for ${hoursLabel(ageHours(oldest.at, now))}`
            : ""}
          .
          {priority
            ? " Priority target: first response in 5 hours, closure in 24."
            : ""}
        </AnswerLine>
      </Tile>

      <Tile title="Customer" prov="internal" tone="violet">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: 10,
            fontSize: 14,
            color: C.textSec,
          }}
        >
          <div>
            <UserRound size={14} style={{ verticalAlign: "-2px" }} />{" "}
            {p.descriptor} (fictional)
          </div>
          <div>
            Cohort: <CohortChips cohorts={p.cohorts} />
          </div>
          <div>
            Products: {p.products.map((x) => PRODUCT_LABEL[x] ?? x).join(", ")}
          </div>
          <div>
            RM: <span style={{ fontFamily: MONO }}>{p.rm_id}</span> ·{" "}
            <span style={{ color: rmColor(p) }}>{rmStatus(p)}</span>
          </div>
          <div>
            Linked contacts:{" "}
            {p.proxy_contacts
              ? "an assistant, through the bank's own contact records"
              : "none"}
          </div>
        </div>
      </Tile>

      <Tile
        title="Signal trail: one customer, every channel"
        sub="In time order, across products and teams. The sensitivity flag is set once and follows the customer."
        prov="internal"
        tone="cyan"
      >
        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {p.trail.map((s, i) => (
            <StepRow
              key={`${s.at}-${i}`}
              s={s}
              i={i}
              now={now}
              flagOn={flagIndex >= 0 && i >= flagIndex}
            />
          ))}
        </ol>
        {hasPublic ? (
          <MutedNote>
            A public post appears in the trail only when it arrives through a
            channel the bank already links to the customer, such as a reply to
            the bank&apos;s own handle from a verified contact in the social
            inbox. LisN does not search for a customer in public data.
          </MutedNote>
        ) : null}
        {hasProxy ? (
          <MutedNote>
            Mail from an assistant is linked to the customer only through
            contact details already on the bank&apos;s records.
          </MutedNote>
        ) : null}
      </Tile>

      <Tile
        title="Recommended actions"
        sub="LisN recommends; people act. Each goes to the owner's own system."
        prov="internal"
        tone="red"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 10,
          }}
        >
          <ActionBox
            icon={<BellRing size={16} />}
            title="Alert the RM"
            body={`CRM task for ${p.rm_id}: ${openSteps.length} open ${openSteps.length === 1 ? "item" : "items"} across ${[...new Set(openSteps.map((s) => s.team))].join(" and ") || "no team"}. Call the customer today with the full history.`}
            owner="rm"
          />
          <ActionBox
            icon={<PhoneCall size={16} />}
            title="Callback within the deliverable"
            body={
              priority
                ? "Priority target: call back within 5 hours of the first unresolved contact; close within 24 hours or tell the customer why not."
                : "Call back within the bank TAT for this request; confirm the outcome in writing."
            }
            owner={
              p.trail[p.trail.length - 1].team === "Retail" ? "retail" : "cards"
            }
          />
          <ActionBox
            icon={<Route size={16} />}
            title="Route to the account owner"
            body={`One owner for the customer across ${teams.size} ${teams.size === 1 ? "team" : "teams"}: the others see the history and hand off, rather than start again.`}
            owner="cx"
          />
        </div>
        {p.rm_id ? (
          <div
            data-testid="crm-task"
            style={{
              background: C.cardAlt,
              border: `1px dashed ${C.borderLight}`,
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 13.5,
              color: C.textSec,
              lineHeight: 1.55,
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 800,
                color: C.textMut,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Mock: CRM task (not sent)
            </div>
            <strong style={{ color: C.text }}>To:</strong> {p.rm_id} ·{" "}
            <strong style={{ color: C.text }}>Customer:</strong> {p.masked_id} ·{" "}
            <strong style={{ color: C.text }}>Due:</strong> today, 10:45
            <br />
            {openSteps.length} open {openSteps.length === 1 ? "item" : "items"}:{" "}
            {openSteps
              .map(
                (s) =>
                  `${s.theme_label.toLowerCase()} (${s.channel_label.toLowerCase()})`,
              )
              .join("; ") || "none"}
            . Suggested: call the customer, confirm what has been done, and
            close each open item with a written update.
          </div>
        ) : null}
      </Tile>
      <Link
        href={`/hdfc-pulse/v2/priority?from=${from}#customers`}
        style={{ fontSize: 14, color: C.textSec }}
      >
        All priority customers
      </Link>
    </div>
  );
}

function ActionBox({
  icon,
  title,
  body,
  owner,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  owner: string;
}) {
  return (
    <div
      style={{
        background: tint(C.red, 0.04),
        border: `1px solid ${tint(C.red, 0.22)}`,
        borderLeft: `3px solid ${C.red}`,
        borderRadius: 10,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 15,
          fontWeight: 700,
          color: C.text,
        }}
      >
        <span style={{ color: C.red }}>{icon}</span>
        {title}
      </div>
      <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.5 }}>
        {body}
      </div>
      <div>
        <OwnerChip owner={owner} />
      </div>
    </div>
  );
}
