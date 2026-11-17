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

import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/swedbank-pulse/format";
import { releasePulse, signalHref } from "@/lib/swedbank-pulse/selectors";
import type { Bundle, StoreSeries } from "@/lib/swedbank-pulse/types";
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

/** The three newest major versions in the store's data (none typed in). */
function VersionTable({ s }: { s: StoreSeries }) {
  const majors = Object.keys(s.by_major)
    .sort((a, z) => Number(z) - Number(a))
    .slice(0, 3);
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
  // Pass 2 section 12: the Nina module reads the Nina themes inside the bank (bank scale, full window). Public
  // columns stay in place and read "not yet loaded" until the pull lands.
  const full = b.periods.periods.all;
  const cora = full?.cora;
  const sample = b.v3.cora;
  if (!cora || !sample) return <MutedNote>No Nina data.</MutedNote>;
  const i = cora.internal;
  const rows = [...cora.rows].sort(
    (a, c) => (c.internal.open_too_long ?? 0) - (a.internal.open_too_long ?? 0),
  );
  const top = rows[0];
  const rp = releasePulse(b);
  const app = b.storeSeries.apps[0];
  const play = app?.stores.find((s) => s.store === "playstore");
  const ios = app?.stores.find((s) => s.store === "appstore");
  const publicLoaded = full.public_loaded !== false && !!rp;
  const ev = rp ? rp.exemplars.map((id) => b.evidence[id]).filter(Boolean) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov={["internal", "public"]} accent tone="red">
        <AnswerLine
          sub={`Inside the bank, at bank scale: contacts tagged to a Nina theme on any channel, ${fmtDate(full.start)} to ${fmtDate(full.end)}. Public reviews of Nina: ${publicLoaded ? "on the market view" : "not yet loaded"}.`}
        >
          Nina: {fmt(i.volume)} contacts where Nina did not finish the job;{" "}
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
            Contacts where Nina did not finish the job: unresolved so the
            customer had to call, a wrong answer, a hand-off that lost the
            context, or no way to reach a person. Each sits with the product the
            query was about; {fmt(sample.via_cora)} of {fmt(sample.dials.total)}{" "}
            in the sample came in through Nina itself.
          </div>
        </Section>

        <Section n={2} title="Is it real">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Inside the bank: {fmt(i.volume)} contacts in the window,{" "}
            {fmtSigned(i.change_pct, "%")} on the comparison period;{" "}
            {fmt(i.escalations)} carried escalation language.
            {cora.returns?.resolved ? (
              <>
                {" "}
                Of {fmt(cora.returns.resolved)} Nina conversations resolved{" "}
                {fmtDate(cora.returns.from)} to {fmtDate(cora.returns.until)},{" "}
                {fmt(cora.returns.back_7d)} (
                {Math.round(
                  (100 * cora.returns.back_7d) / cora.returns.resolved,
                )}
                %) came back as a call or a complaint within 7 days.
              </>
            ) : null}
          </div>
          {publicLoaded && play && ios ? (
            <>
              <div style={GRID2}>
                <StoreChart s={ios} />
                <StoreChart s={play} />
              </div>
              <div style={GRID2}>
                <VersionTable s={play} />
                <VersionTable s={ios} />
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
            Inside figures are at bank scale, from the bank sample. Open too
            long: open past the service standard for the request.
          </MutedNote>
        </Section>

        <Section n={4} title="Where">
          <div style={{ fontSize: 15, color: C.textSec }}>
            FI focus area: clear information · Module: Nina and the Copilot
            assistant · Channels: all, with the product the query was about.
          </div>
        </Section>

        <Section n={5} title="How high">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Rung: Repeat. A Nina failure brings the customer back on another
            channel; {fmt(i.escalations)} of these contacts carried escalation
            language.
          </div>
        </Section>

        <Section n={6} title="Owner and action">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Owner: <strong>Digital and Nina</strong>. Recommended action:{" "}
            <strong>Route with evidence</strong>: the fix list, with the
            conversations behind each row, goes to the Nina backlog. Track open
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
          href={signalHref("nina_unresolved", from)}
          style={{ color: C.textSec }}
        >
          Nina unresolved, had to call
        </a>
      </MutedNote>
    </div>
  );
}

/* ================================================================= M2 Everyday accounts and app (the deep dive) */

/** One quote each from the lead Everyday accounts and app themes; slice.ts sends the same ids. */
export const DEEP_DIVE_EVIDENCE_THEMES_IDS = [
  "new_app_release",
  "app_speed_crash",
  "account_freeze",
];

/** The Everyday accounts and app issue list: the deep-dive categories (SW-D16), each with its themes. */
const CARD_ISSUES: { label: string; themes: string[]; note?: string }[] = [
  {
    label: "App update and new release",
    themes: ["new_app_release"],
  },
  {
    label: "App crashes, speed and outages",
    themes: ["app_speed_crash", "online_banking"],
  },
  {
    label: "BankID and sign-in",
    themes: [
      "app_login_biometrics",
      "identity_checks",
      "device_security_block",
    ],
  },
  {
    label: "Account measures: frozen or restricted accounts",
    themes: ["account_freeze", "closure_requests"],
  },
  {
    label: "App features and usability",
    themes: ["app_usability", "statements_documents"],
  },
  {
    label: "Account fees and opening",
    themes: ["fees_charges_bank", "account_opening"],
  },
  {
    label: "Service, branch (kontor) and complaint handling",
    themes: [
      "complaint_handling",
      "care_unreachable",
      "branch_service",
      "branch_closure",
      "premium_service",
      "unsolicited_calls",
    ],
  },
];

export function CardsModule({ b }: { b: Bundle }) {
  const from = useFrom();
  const pub = b.products.rows.find((r) => r.id === "everyday_accounts_app");
  const inn = b.v3.products.find((r) => r.id === "everyday_accounts_app");
  if (!pub || !inn)
    return <MutedNote>No Everyday accounts and app data.</MutedNote>;
  const pubIssue = Object.fromEntries(pub.issues.map((i) => [i.id, i]));
  const inIssue = Object.fromEntries(
    b.v3.cards_issues.map((i) => [i.theme, i]),
  );
  const tm = Object.fromEntries(b.themes.themes.map((t) => [t.id, t]));
  const ledger = Object.fromEntries(b.v3.deliverables.map((d) => [d.id, d]));
  const rows = CARD_ISSUES.map((ci) => {
    const pm = ci.themes.reduce(
      (s, t) => s + (pubIssue[t]?.count ?? tm[t]?.by_business?.payments ?? 0),
      0,
    );
    const pn = ci.themes.reduce((s, t) => {
      if (pubIssue[t]) return s + pubIssue[t].negative;
      const th = tm[t];
      // Not in the product's issue list: estimate from the theme's negative share on its Everyday accounts and app items.
      return th?.count
        ? s +
            Math.round(
              (th.sentiment.negative * (th.by_business.payments ?? 0)) /
                th.count,
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
  // The lead issue: by negative public items; with none, by the bank's own interactions (review round 3).
  const top = [...rows].sort((a, z) => z.pn - a.pn || z.inter - a.inter)[0];
  const leadLine =
    top.pn > 0
      ? `${top.ci.label} leads.`
      : `Inside the bank, ${top.ci.label.toLowerCase()} leads (${fmt(top.inter)} interactions in the sample).`;
  const ev = DEEP_DIVE_EVIDENCE_THEMES_IDS.flatMap((t) =>
    (tm[t]?.exemplars ?? []).slice(0, 1),
  )
    .map((id) => b.evidence[id])
    .filter(Boolean);
  const channels = Object.entries(inn.by_channel).sort((a, z) => z[1] - a[1]);
  const trend = pub.trend_change_pct;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov={["public", "internal"]} accent tone="red">
        <AnswerLine
          sub={`Inside the bank: ${fmt(inn.total)} Everyday accounts and app interactions in the sample, ${fmt(inn.open)} open, ${fmt(inn.waiting_on_customer)} waiting on customer, ${fmt(inn.open_too_long)} past their service standard.`}
        >
          Everyday accounts and app: {fmt(pub.negative)} negative public items
          out of {fmt(pub.count)}
          {trend !== null
            ? `, share of voice ${fmtSigned(trend)} in the second half of the window (source-weighted)`
            : ""}
          . {leadLine}
        </AnswerLine>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Status value="needs_you" />
          <OwnerChip owner="payments" />
          <RungChip rung="Complaint" />
          <ActionChip action="Set a new date" />
        </div>

        <Section n={1} title="What">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Everything customers say about Everyday accounts and app, in public
            and to the bank, on one page: the same issue list the Everyday
            accounts and app product owner reviews, with public voice beside the
            bank&apos;s own queues.
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
              sub="Everyday accounts and app interactions"
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
            yLabel="Negative Everyday accounts and app interactions (inside)"
          />
          <BaselineCaption>
            Public trend is the source-weighted share of trend-basis items,
            second half vs first half of the window: each source counts by its
            share of the window, so a burst in one source cannot swing it.
            Internal weeks are from the bank sample.
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
            Public mentions count theme tags on Everyday accounts and app items
            (an item can carry up to three). Inside figures are from the bank
            sample.
          </MutedNote>
        </Section>

        <Section n={4} title="Where">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Inside the bank, Everyday accounts and app contacts arrive by{" "}
            {channels
              .slice(0, 4)
              .map(
                ([ch, n]) =>
                  `${(b.v3.channel_labels[ch] ?? ch).toLowerCase()} (${fmt(n)})`,
              )
              .join(", ")}
            . In public, on X, Reddit, Trustpilot and the app stores.
          </div>
        </Section>

        <Section n={5} title="How high">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            {fmt(pub.escalation)} public Everyday accounts and app items name a
            regulator, a court or ARN. Inside: {fmt(inn.high_impact)}{" "}
            high-impact Everyday accounts and app complaints in the sample.
          </div>
        </Section>

        <Section n={6} title="Owner and action">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Owner: <strong>Everyday banking product owner</strong>. Set a date
            on every manipulated-transfer investigation (15 business days, bank
            standard) and tell customers before an account measure blocks a
            payment.
          </div>
        </Section>

        <Section n={7} title="Evidence" id="evidence">
          <EvidenceList items={ev} />
        </Section>
      </Tile>
      <DialsRow b={b} product="everyday_accounts_app" />
    </div>
  );
}
