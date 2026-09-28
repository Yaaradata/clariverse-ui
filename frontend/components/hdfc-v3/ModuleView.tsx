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

import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/hdfc-v3/format";
import {
  RELEASE_LABEL,
  releasePulse,
  signalHref,
} from "@/lib/hdfc-v3/selectors";
import type { Bundle, StoreSeries } from "@/lib/hdfc-v3/types";
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
const ASK_MATCH: Record<string, RegExp> = {
  app_speed_crash: /speed|slow|load|crash|lag|perform|fast|hang|freez/i,
  app_usability:
    /option|show|add|remove|feature|breakdown|label|view|menu|swip|icon/i,
  new_app_release:
    /keyboard|screenshot|old app|previous|revert|disable|update/i,
  login_mpin: /login|mpin|pin|keyboard|password|otp|regist/i,
  device_security_block: /screenshot|security|root|block|alert|developer/i,
  upi_failures: /upi/i,
};

export function asksFor(theme: string, asks: string[]): string[] {
  const re = ASK_MATCH[theme];
  return re ? asks.filter((a) => re.test(a)) : [];
}

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
  const rp = releasePulse(b);
  const app = b.storeSeries.apps.find((a) => a.app === "HDFC Bank app");
  const play = app?.stores.find((s) => s.store === "playstore");
  const ios = app?.stores.find((s) => s.store === "appstore");
  const pub = b.products.rows.find((r) => r.id === "digital");
  if (!rp || !play || !ios || !pub) return <MutedNote>No app data.</MutedNote>;
  const p11 = play.by_major["11"];
  const p9 = play.by_major["9"];
  const i11 = ios.by_major["11"];
  const i10 = ios.by_major["10"];
  const ev = rp.exemplars.map((id) => b.evidence[id]).filter(Boolean);
  const praise = rp.praise_exemplars
    .map((id) => b.evidence[id])
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov="public" accent tone="red">
        <AnswerLine
          sub={`Compared within each store only. Play Store: v11 averages ${p11?.avg_rating?.toFixed(1)}★ over ${fmt(p11?.n)} reviews against ${p9?.avg_rating?.toFixed(1)}★ for v9 (${fmt(p9?.n)}). App Store: v11 averages ${i11?.avg_rating?.toFixed(1)}★ (${fmt(i11?.n)}) against ${i10?.avg_rating?.toFixed(1)}★ for v10 (${fmt(i10?.n)}).`}
        >
          {RELEASE_LABEL}: {fmt(rp.count)} negative reviews of the new HDFC Bank
          app in the window, led by speed and loading. The fix list below is
          what customers have written.
        </AnswerLine>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Status value="needs_you" />
          <OwnerChip owner="digital" />
          <RungChip rung="Voice" />
          <ActionChip action="Route with evidence" />
        </div>

        <Section n={1} title="What">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Store reviews of the new HDFC Bank app (versions 11.x), read as a
            release pulse: the specific, fixable issues customers name, with the
            praise alongside. {fmt(pub.count)} public items sit in the Digital
            row of the product table; {fmt(pub.negative)} are negative.
          </div>
        </Section>

        <Section n={2} title="Is it real">
          <div style={GRID2}>
            <StoreChart s={ios} />
            <StoreChart s={play} />
          </div>
          <BaselineCaption>
            {b.storeSeries.rule} Weeks with fewer than 5 reviews are not
            plotted. The Play Store export starts on{" "}
            {fmtDate(play.export_start)}, so its series starts there: there is
            no spike, only a start date.
          </BaselineCaption>
          <div style={GRID2}>
            <VersionTable s={play} majors={["11", "10", "9"]} />
            <VersionTable s={ios} majors={["11", "10", "8"]} />
          </div>
        </Section>

        <Section n={3} title="The fix list" id="fix-list">
          <Table
            head={[
              "Issue",
              "Negative reviews",
              "First seen",
              "Latest version",
              "Customers ask for",
            ]}
            align={["left", "right", "left", "left", "left"]}
            rows={rp.fix_list.slice(0, 7).map((f) => {
              const asks = asksFor(f.theme, f.feature_asks);
              return [
                f.issue,
                fmt(f.count),
                f.first_seen_version ? `v${f.first_seen_version}` : "—",
                f.latest_version_seen ? `v${f.latest_version_seen}` : "—",
                asks.slice(0, 2).join("; ") || "—",
              ];
            })}
          />
          <MutedNote>
            &ldquo;Customers ask for&rdquo; lists only feature requests that
            belong to the row&apos;s issue; unrelated asks are left out.
          </MutedNote>
        </Section>

        <Section n={4} title="Where">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Pillar: Availability · Product: Digital (app and NetBanking) ·
            Sources: {rp.coverage.join("; ")}.
          </div>
        </Section>

        <Section n={5} title="How high">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Rung: Voice. {fmt(pub.escalation)} Digital items use escalation
            language. Store reviews are public and visible to every prospective
            customer on the store page.
          </div>
        </Section>

        <Section n={6} title="Owner and action">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Owner: <strong>Digital</strong>. Recommended action:{" "}
            <strong>Route with evidence</strong>: the fix list, versions and
            example reviews go to the app backlog. Track share negative by store
            and version after each release.
          </div>
        </Section>

        <Section n={7} title="Evidence" id="evidence">
          <EvidenceList items={ev} />
          {praise.length ? (
            <>
              <div
                style={{
                  fontSize: 13,
                  color: C.textMut,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginTop: 6,
                }}
              >
                Praise alongside
              </div>
              <EvidenceList items={praise} />
            </>
          ) : null}
        </Section>
      </Tile>
      <DialsRow b={b} product="digital" />
      <MutedNote>
        Theme detail:{" "}
        <a
          href={signalHref("app_speed_crash", from)}
          style={{ color: C.textSec }}
        >
          App speed, loading and crashes
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
    note: "7 working days (RBI); ₹500 per day of delay",
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
      return th && th.count
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
          sub={`Inside the bank (illustrative): ${fmt(inn.total)} card interactions in the sample, ${fmt(inn.open)} open, ${fmt(inn.open_too_long)} past their deliverable.`}
        >
          Cards: {fmt(pub.negative)} negative public items out of{" "}
          {fmt(pub.count)}
          {trend !== null
            ? `, share of voice ${fmtSigned(trend)} in the second half of the window`
            : ""}
          . {top.ci.label} leads.
        </AnswerLine>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Status value="needs_you" />
          <OwnerChip owner="cards" />
          <RungChip rung="Grievance" />
          <ActionChip action="Re-promise" />
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
              sub="second half vs first half"
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
            Public trend is the share of trend-basis items, second half vs first
            half of the window; the store exports that start mid-window are left
            out of it. Internal weeks are from the demo sample.
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
              "Deliverable met",
              "TAT",
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
            Owner: <strong>Cards</strong>. Set a new date on variant migration
            and upgrade requests; notify customers proactively before a variant
            change; hold closure to the 7-working-day rule.
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
