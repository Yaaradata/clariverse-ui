"use client";

/**
 * M1–M3 · Product modules (B7 §1): one template, seven sections. What · Is it real · The fix or issue list · Where ·
 * How high · Owner and action · Evidence.
 *
 * Method rules (B7 §1 M, §4.1): ratings compared within one store only, with counts; store series plotted as share
 * negative from each store's own first review (never raw counts across a start date); the "customers ask for" column
 * keeps only feature asks that match the row's theme.
 */

import type { ReactNode } from "react";

import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/natwest-pulse/format";
import { releasePulse, signalHref } from "@/lib/natwest-pulse/selectors";
import type { Bundle, StoreSeries } from "@/lib/natwest-pulse/types";
import { PublicNotLoaded } from "./Pulse";
import {
  ActionChip,
  AnswerLine,
  BaselineCaption,
  C,
  Kpi,
  MutedNote,
  OwnerChip,
  RungChip,
  Status,
  Table,
  Tile,
  TrendLine,
  WeeklyBars,
} from "./primitives";
import { useFrom } from "./Shell";
import { EvidenceList } from "./SignalDetail";
import { DialsRow } from "./V3Blocks";

function Section({
  n,
  title,
  children,
  id,
}: {
  n: number;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        borderTop: `1px solid ${C.border}`,
        paddingTop: 12,
        scrollMarginTop: 90,
      }}
    >
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 800,
          color: C.violet,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {n}. {title}
      </div>
      {children}
    </div>
  );
}

/** Feature asks must match the row: keep only asks whose words belong to the row's theme. */

function StoreChart({ s }: { s: StoreSeries }) {
  return (
    <div
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
        {s.store_label}: share of negative reviews by week
      </div>
      <div style={{ fontSize: 12.5, color: C.textMut, marginTop: 2 }}>
        {fmt(s.window.n)} reviews in the window · export from{" "}
        {fmtDate(s.export_start)}
        {s.starts_mid_window
          ? " (starts mid-window: plotted from that date)"
          : ""}
      </div>
      <TrendLine
        data={s.weekly.map((w) => ({
          week: fmtDate(w.week),
          share: w.n >= 5 ? w.share_negative : null,
        }))}
        xKey="week"
        yKey="share"
        yLabel="% negative (1–2★)"
        xLabel="Week starting"
        height={160}
        domain={[0, 100]}
      />
    </div>
  );
}

function VersionTable({ s, majors }: { s: StoreSeries; majors: string[] }) {
  const rows = majors
    .filter((m) => s.by_major[m])
    .map((m) => {
      const v = s.by_major[m];
      return [
        `v${m}.x`,
        fmt(v.n),
        `${v.avg_rating?.toFixed(2)}★`,
        fmtPct(v.share_positive),
        fmtPct(v.share_negative),
      ];
    });
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          color: C.text,
          marginBottom: 6,
        }}
      >
        {s.store_label} only
      </div>
      <Table
        head={["Version", "Reviews", "Average", "Positive", "Negative"]}
        align={["left", "right", "right", "right", "right"]}
        rows={rows}
      />
    </div>
  );
}

const GRID2 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
  gap: 12,
} as const;

/* ================================================================= M1 digital */

export function DigitalModule({ b }: { b: Bundle }) {
  const from = useFrom();
  // Pass 2 section 12: the Cora module reads the Cora themes inside the bank (bank scale, full window). Public
  // columns stay in place and read "not yet loaded" until the pull lands.
  const full = b.periods.periods.all;
  const cora = full?.cora;
  const sample = b.v3.cora;
  if (!cora || !sample) return <MutedNote>No Cora data.</MutedNote>;
  const i = cora.internal;
  const rows = [...cora.rows].sort(
    (a, c) => (c.internal.open_too_long ?? 0) - (a.internal.open_too_long ?? 0),
  );
  const top = rows[0];
  const rp = releasePulse(b);
  const app = b.storeSeries.apps.find((a) => a.app === "NatWest app");
  const play = app?.stores.find((s) => s.store === "playstore");
  const ios = app?.stores.find((s) => s.store === "appstore");
  const publicLoaded = full.public_loaded !== false && !!rp;
  const ev = rp ? rp.exemplars.map((id) => b.evidence[id]).filter(Boolean) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov={["internal", "public"]} accent tone="red">
        <AnswerLine
          sub={`Inside the bank, illustrative, at bank scale: contacts tagged to a Cora theme on any channel, ${fmtDate(full.start)} to ${fmtDate(full.end)}. Public reviews of Cora: ${publicLoaded ? "on the market view" : "not yet loaded"}.`}
        >
          Cora: {fmt(i.volume)} contacts where Cora did not finish the job;{" "}
          {fmt(i.open)} still open, {fmt(i.open_too_long)} open too long.{" "}
          {top ? `${top.label} leads the open-too-long list.` : null}
        </AnswerLine>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Status value="needs_you" />
          <OwnerChip owner="digital" />
          <RungChip rung="Repeat" />
          <ActionChip action="Route with evidence" />
        </div>

        <Section n={1} title="What">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Contacts where Cora did not finish the job: unresolved so the
            customer had to call, a wrong answer, a hand-off that lost the
            context, or no way to reach a person. Each sits with the product the
            query was about; {fmt(sample.via_cora)} of {fmt(sample.dials.total)}{" "}
            in the demo sample came in through Cora itself.
          </div>
        </Section>

        <Section n={2} title="Is it real">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Inside the bank: {fmt(i.volume)} contacts in the window,{" "}
            {fmtSigned(i.change_pct, "%")} on the comparison period;{" "}
            {fmt(i.escalations)} carried escalation language.
          </div>
          {publicLoaded && play && ios ? (
            <>
              <div style={GRID2}>
                <StoreChart s={ios} />
                <StoreChart s={play} />
              </div>
              <div style={GRID2}>
                <VersionTable s={play} majors={["11", "10", "9"]} />
                <VersionTable s={ios} majors={["11", "10", "8"]} />
              </div>
            </>
          ) : (
            <PublicNotLoaded />
          )}
        </Section>

        <Section n={3} title="The fix list" id="fix-list">
          <Table
            head={[
              "Issue",
              "Inside: interactions",
              "Open / open too long",
              "Public: negative reviews",
            ]}
            align={["left", "right", "right", "right"]}
            rows={rows.map((r) => [
              <a
                key={r.id}
                href={signalHref(r.id, from)}
                style={{ color: C.text }}
              >
                {r.label}
              </a>,
              fmt(r.internal.volume),
              `${fmt(r.internal.open)} / ${fmt(r.internal.open_too_long)}`,
              publicLoaded ? "—" : "not yet loaded",
            ])}
          />
          <MutedNote>
            Inside figures are illustrative, at bank scale, from the demo
            sample. Open too long: open past the service standard for the
            request.
          </MutedNote>
        </Section>

        <Section n={4} title="Where">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Consumer Duty outcome: Consumer support · Module: Cora and digital
            assistant · Channels: all, with the product the query was about.
          </div>
        </Section>

        <Section n={5} title="How high">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Rung: Repeat. A Cora failure brings the customer back on another
            channel; {fmt(i.escalations)} of these contacts carried escalation
            language.
          </div>
        </Section>

        <Section n={6} title="Owner and action">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Owner: <strong>Digital and Cora</strong>. Recommended action:{" "}
            <strong>Route with evidence</strong>: the fix list, with the
            conversations behind each row, goes to the Cora backlog. Track open
            too long weekly.
          </div>
        </Section>

        <Section n={7} title="Evidence" id="evidence">
          {ev.length ? <EvidenceList items={ev} /> : <PublicNotLoaded />}
        </Section>
      </Tile>
      <DialsRow b={b} insideOverride={sample.dials} outside={false} />
      <MutedNote>
        Theme detail:{" "}
        <a
          href={signalHref("cora_unresolved", from)}
          style={{ color: C.textSec }}
        >
          Cora unresolved, had to call
        </a>
      </MutedNote>
    </div>
  );
}

/* ================================================================= M2 cards */

const CARD_ISSUES: { label: string; themes: string[]; note?: string }[] = [
  {
    label: "Variant migration and forced upgrade",
    themes: ["card_variant_migration"],
  },
  { label: "Upgrades and downgrades", themes: ["card_eligibility_upgrade"] },
  {
    label: "Application rejection and verification",
    themes: ["card_application"],
  },
  {
    label: "Rewards value and caps",
    themes: ["rewards_value", "reward_redemption"],
  },
  { label: "Fees and charges", themes: ["card_fees_charges"] },
  { label: "Limits", themes: ["card_limit"] },
  { label: "Disputes and chargebacks", themes: ["dispute_chargeback"] },
  {
    label: "Closure",
    themes: ["closure_requests"],
    note: "Bank service standard: confirm with the bank",
  },
];

export function CardsModule({ b }: { b: Bundle }) {
  const from = useFrom();
  const pub = b.products.rows.find((r) => r.id === "cards");
  const inn = b.v3.products.find((r) => r.id === "cards");
  if (!pub || !inn) return <MutedNote>No cards data.</MutedNote>;
  const pubIssue = Object.fromEntries(pub.issues.map((i) => [i.id, i]));
  const inIssue = Object.fromEntries(
    b.v3.cards_issues.map((i) => [i.theme, i]),
  );
  const tm = Object.fromEntries(b.themes.themes.map((t) => [t.id, t]));
  const ledger = Object.fromEntries(b.v3.deliverables.map((d) => [d.id, d]));
  const rows = CARD_ISSUES.map((ci) => {
    const pm = ci.themes.reduce(
      (s, t) => s + (pubIssue[t]?.count ?? tm[t]?.by_business?.cards ?? 0),
      0,
    );
    const pn = ci.themes.reduce((s, t) => {
      if (pubIssue[t]) return s + pubIssue[t].negative;
      const th = tm[t];
      // Not in the product's issue list: estimate from the theme's negative share on its cards items.
      return th?.count
        ? s +
            Math.round(
              (th.sentiment.negative * (th.by_business.cards ?? 0)) / th.count,
            )
        : s;
    }, 0);
    const ins = ci.themes.map((t) => inIssue[t]).filter(Boolean);
    const inter = ins.reduce((s, x) => s + x.interactions, 0);
    const open = ins.reduce((s, x) => s + x.open, 0);
    const otl = ins.reduce((s, x) => s + x.open_too_long, 0);
    const deliv = ins[0]?.deliverable;
    return {
      ci,
      pm,
      pn,
      inter,
      open,
      otl,
      deliv,
      met: ins[0]?.deliv_met_pct ?? null,
    };
  });
  const top = [...rows].sort((a, z) => z.pn - a.pn)[0];
  const ev = ["card_variant_migration", "card_fees_charges", "rewards_value"]
    .flatMap((t) => (tm[t]?.exemplars ?? []).slice(0, 1))
    .map((id) => b.evidence[id])
    .filter(Boolean);
  const channels = Object.entries(inn.by_channel).sort((a, z) => z[1] - a[1]);
  const trend = pub.trend_change_pct;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov={["public", "internal"]} accent tone="red">
        <AnswerLine
          sub={`Inside the bank (illustrative): ${fmt(inn.total)} card interactions in the sample, ${fmt(inn.open)} open, ${fmt(inn.waiting_on_customer)} waiting on customer, ${fmt(inn.open_too_long)} past their service standard.`}
        >
          Credit cards: {fmt(pub.negative)} negative public items out of{" "}
          {fmt(pub.count)}
          {trend !== null
            ? `, share of voice ${fmtSigned(trend)} in the second half of the window (source-weighted)`
            : ""}
          . {top.ci.label} leads.
        </AnswerLine>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Status value="needs_you" />
          <OwnerChip owner="cards" />
          <RungChip rung="Grievance" />
          <ActionChip action="Set a new date" />
        </div>

        <Section n={1} title="What">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Everything customers say about credit cards, in public and to the
            bank, on one page: the same issue list the cards business reviews,
            with public voice beside the bank&apos;s own queues.
          </div>
        </Section>

        <Section n={2} title="Is it real">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 8,
            }}
          >
            <Kpi
              label="Public items"
              value={fmt(pub.count)}
              sub={`${fmt(pub.negative)} negative`}
              tone="cyan"
            />
            <Kpi
              label="Share of voice"
              value={trend === null ? "—" : fmtSigned(trend)}
              sub="second half vs first half · source-weighted"
              tone="amber"
            />
            <Kpi
              label="Inside: negative"
              value={fmt(inn.negative)}
              sub="card interactions (illustrative)"
              tone="violet"
            />
            <Kpi
              label="Inside: last 3 full weeks"
              value={
                inn.negative_change_pct === null
                  ? "—"
                  : fmtSigned(inn.negative_change_pct)
              }
              sub="negative interactions vs the 3 weeks before"
              tone="violet"
            />
          </div>
          <WeeklyBars
            data={inn.negative_weekly}
            yLabel="Negative card interactions (inside, illustrative)"
          />
          <BaselineCaption>
            Public trend is the source-weighted share of trend-basis items,
            second half vs first half of the window: each source counts by its
            share of the window, so the capped late-September X run cannot swing
            it. Reddit (collector changed 1 Sep) and the store exports that
            start mid-window are left out. Internal weeks are from the demo
            sample.
          </BaselineCaption>
        </Section>

        <Section n={3} title="The issue list" id="issues">
          <Table
            head={[
              "Issue",
              "Public mentions",
              "Public negative",
              "Inside: interactions",
              "Open / open too long",
              "Service standard met",
              "Standard",
            ]}
            align={[
              "left",
              "right",
              "right",
              "right",
              "right",
              "right",
              "left",
            ]}
            rows={rows.map((r) => [
              <a
                key="l"
                href={signalHref(r.ci.themes[0], from)}
                style={{
                  color: C.text,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                {r.ci.label}
              </a>,
              fmt(r.pm),
              fmt(r.pn),
              r.inter ? fmt(r.inter) : "—",
              r.inter ? `${fmt(r.open)} / ${fmt(r.otl)}` : "—",
              fmtPct(r.met),
              r.ci.note ?? (r.deliv ? ledger[r.deliv]?.tat_label : "—"),
            ])}
          />
          <MutedNote>
            Public mentions count theme tags on cards items (an item can carry
            up to three). Inside figures are from the synthetic sample and are
            illustrative until discovery.
          </MutedNote>
        </Section>

        <Section n={4} title="Where">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Inside the bank, card contacts arrive by{" "}
            {channels
              .slice(0, 4)
              .map(
                ([ch, n]) =>
                  `${(b.v3.channel_labels[ch] ?? ch).toLowerCase()} (${fmt(n)})`,
              )
              .join(", ")}
            . In public, on X, Reddit and card forums.
          </div>
        </Section>

        <Section n={5} title="How high">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            {fmt(pub.escalation)} public cards items name a regulator, court or
            ombudsman. Inside: {fmt(inn.high_impact)} high-impact card
            complaints in the sample.
          </div>
        </Section>

        <Section n={6} title="Owner and action">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Owner: <strong>Credit cards</strong>. Set a new date on variant
            migration and upgrade requests; notify customers proactively before
            a variant change; hold closure to the 7-working-day rule.
          </div>
        </Section>

        <Section n={7} title="Evidence" id="evidence">
          <EvidenceList items={ev} />
        </Section>
      </Tile>
      <DialsRow b={b} product="cards" />
    </div>
  );
}
