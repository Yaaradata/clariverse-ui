"use client";

import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

import { fmt, fmtDate, fmtPct } from "@/lib/hdfc-v3/format";
import {
  type ReleasePulse,
  releasePulse,
  routedList,
  trendWords,
} from "@/lib/hdfc-v3/selectors";
import type { Bundle, Evidence, StatusValue, Theme } from "@/lib/hdfc-v3/types";
import {
  ActionChip,
  AnswerLine,
  BaselineCaption,
  C,
  Kpi,
  MONO,
  MutedNote,
  OwnerChip,
  ProvenanceTag,
  RungChip,
  STATUS_TONE,
  Status,
  Table,
  Tile,
  TrendLine,
  tint,
  WeeklyBars,
} from "./primitives";

const PILLAR: Record<string, string> = {
  availability: "Availability",
  experience: "Experience",
  data_intimacy: "Data intimacy",
  security: "Security",
};
const BUSINESS: Record<string, string> = {
  retail_banking: "Retail banking",
  cards: "Cards",
  loans: "Loans",
  payments: "Payments",
  wealth: "Wealth",
  sme_merchant: "SME and merchant",
  corporate: "Corporate",
  group_company: "Group company",
};
const SOURCE: Record<string, string> = {
  x: "X",
  reddit: "Reddit",
  forum: "Forums",
  playstore: "Play Store",
  appstore: "App Store",
};

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
          fontSize: 13,
          color: C.violet,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            display: "grid",
            placeItems: "center",
            fontSize: 11.5,
            background: tint(C.violet, 0.15),
          }}
        >
          {n}
        </span>
        {title}
      </div>
      {children}
    </div>
  );
}

function EvidenceList({ items }: { items: Evidence[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((e) => (
        <div
          key={e.id}
          id={`ev-${e.id}`}
          data-testid="evidence"
          style={{
            background: C.cardAlt,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${
              e.sentiment === "negative"
                ? C.red
                : e.sentiment === "positive"
                  ? C.green
                  : C.cyan
            }`,
            borderRadius: 10,
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            scrollMarginTop: 90,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              flexWrap: "wrap",
              fontSize: 12.5,
              color: C.textMut,
            }}
          >
            <span>
              {e.source_label}
              {e.app_name ? ` · ${e.app_name}` : ""}
              {e.app_version ? ` v${e.app_version}` : ""}
              {e.rating ? ` · ${e.rating}★` : ""} · {fmtDate(e.created_at)}
            </span>
            <a
              href={e.url}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#b7a6ff",
                display: "inline-flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              Source <ExternalLink size={12} />
            </a>
          </div>
          <div
            style={{
              fontSize: 14.5,
              color: C.text,
              fontWeight: 600,
              lineHeight: 1.45,
            }}
          >
            {e.summary}
          </div>
          <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.55 }}>
            {e.title ? <strong>{e.title} · </strong> : null}
            {e.redacted_text}
          </div>
        </div>
      ))}
      <MutedNote>
        Anonymised: names, handles, numbers and IDs are redacted. Summaries are
        paraphrased.
      </MutedNote>
    </div>
  );
}

function ThemeSignal({ b, t }: { b: Bundle; t: Theme }) {
  const routed = routedList(b).find((r) => r.theme === t.id);
  const status: StatusValue = routed ? "routed" : t.status;
  const ev = t.exemplars
    .map((id) => b.evidence[id])
    .filter(Boolean)
    .slice(0, 5);
  const total = Object.values(t.by_source).reduce((s, v) => s + v, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov="public" accent tone={STATUS_TONE[status]}>
        <AnswerLine sub={t.definition}>
          {t.label}: {fmt(t.count)} public items, {trendWords(t)}. Owner{" "}
          {t.owner_label}; recommended action{" "}
          {status === "improving" ? "Monitor" : t.action.toLowerCase()}.
        </AnswerLine>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Status value={status} />
          <OwnerChip owner={t.owner} />
          <RungChip rung={t.rung} />
          <ActionChip action={status === "improving" ? "Monitor" : t.action} />
        </div>
        <Section n={1} title="What">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Customers talk about {t.label.toLowerCase()}: {fmt(t.count)} HDFC
            Bank items in the window, {fmtPct(t.share_negative)} negative.
            {t.count_group_companies
              ? ` A further ${fmt(t.count_group_companies)} items concern group companies and are kept separate.`
              : ""}
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
              label="First seen in window"
              value={fmtDate(t.first_seen)}
              sub={`latest ${fmtDate(t.latest)}`}
            />
            <Kpi
              label="Trend"
              value={
                t.rise_pct === null
                  ? "—"
                  : `${t.rise_pct > 0 ? "+" : "−"}${Math.abs(Math.round(t.rise_pct))}%`
              }
              sub={
                t.trend_mode === "vs_baseline"
                  ? "vs baseline"
                  : "trend within window"
              }
              tone={
                t.rise_pct === null
                  ? undefined
                  : t.rise_pct > 0
                    ? "red"
                    : "green"
              }
            />
            <Kpi
              label="Overnight"
              value={fmt(t.last_day_count)}
              sub="since yesterday's 8:30"
              tone="amber"
            />
          </div>
          <WeeklyBars data={t.weekly} height={170} />
          <BaselineCaption>
            {t.trend_mode === "vs_baseline" && t.vs_baseline
              ? `vs baseline: ${t.vs_baseline.window_share}% of store reviews in the window against ${t.vs_baseline.baseline_share}% in the 26 weeks before 1 August.`
              : t.trend_mode === "insufficient"
                ? "Most items come from store exports that begin in September, so no trend is claimed."
                : `Trend within window: ${t.trend.second_half} items (28 Aug–24 Sep) vs ${t.trend.first_half} (1–27 Aug), compared as a share of all posts in each half.`}{" "}
            Seasonal check: in discovery, using your history.
          </BaselineCaption>
          <MutedNote>
            One problem counted once: each post or review counts once for this
            theme, however many phrasings it uses. Reposts and near-duplicates
            are kept, because repetition is signal.
          </MutedNote>
        </Section>
        <Section n={3} title="Where">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14 }}>
              Pillar: {PILLAR[t.pillar] ?? t.pillar}
            </span>
            <span style={{ fontSize: 14, color: C.textMut }}>·</span>
            <span style={{ fontSize: 14 }}>
              Business:{" "}
              {Object.entries(t.by_business)
                .sort((a, c) => c[1] - a[1])
                .slice(0, 3)
                .map(([k, v]) => `${BUSINESS[k] ?? k} ${fmt(v)}`)
                .join(", ")}
            </span>
          </div>
          <Table
            head={["Source", "Items", "Share"]}
            align={["left", "right", "right"]}
            rows={Object.entries(t.by_source)
              .sort((a, c) => c[1] - a[1])
              .map(([k, v]) => [
                SOURCE[k] ?? k,
                fmt(v),
                fmtPct((100 * v) / total),
              ])}
          />
        </Section>
        <Section n={4} title="How high">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Highest rung heard: <strong>{t.rung}</strong>.{" "}
            {fmt(t.escalation_count)} items ({fmtPct(t.share_escalation)})
            mention the RBI, the ombudsman, a court or a complaint number;{" "}
            {fmt(t.repeat_count)} say they have raised it before.
          </div>
        </Section>
        <Section n={5} title="Who and what next">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            Owner: <strong>{t.owner_label}</strong>. Recommended action:{" "}
            <strong>{status === "improving" ? "Monitor" : t.action}</strong>,
            routed with evidence
            {routed
              ? ` to the ${routed.system}; acknowledged ${routed.acknowledged_at}`
              : " into the owner's system"}
            .
          </div>
          {routed ? (
            <ProvenanceTag
              kind="internal"
              style={{ alignSelf: "flex-start" }}
            />
          ) : null}
        </Section>
        <Section n={6} title="Evidence" id="evidence">
          <EvidenceList items={ev} />
        </Section>
        <Section n={7} title="Provenance">
          <MutedNote>
            Public voice from X, Reddit, consumer forums, Play Store and App
            Store, 1 August to 24 September 2026, HDFC Bank only. Classified by
            LisN; counts reproduce from the classified data.
          </MutedNote>
        </Section>
      </Tile>
    </div>
  );
}

function ReleaseSignal({ b, rp }: { b: Bundle; rp: ReleasePulse }) {
  const ev = rp.exemplars.map((id) => b.evidence[id]).filter(Boolean);
  const praise = rp.praise_exemplars
    .map((id) => b.evidence[id])
    .filter(Boolean)
    .slice(0, 2);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov="public" accent tone="red">
        <AnswerLine sub="Framed as a release pulse: the specific, fixable issues customers have written about the new app, with the praise alongside.">
          New HDFC Bank app: {fmt(rp.count)} negative reviews in the window;
          versions 11.x average {rp.new_app_avg?.toFixed(1)}★ against{" "}
          {rp.old_app_avg?.toFixed(1)}★ on the previous app.{" "}
          {Math.round(rp.share_positive ?? 0)}% of reviews are positive.
        </AnswerLine>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Status value="needs_you" />
          <OwnerChip owner={rp.owner} />
          <RungChip rung={rp.rung} />
          <ActionChip action={rp.action} />
        </div>
        <Section n={1} title="What">
          <div style={{ fontSize: 15, color: C.textSec, lineHeight: 1.5 }}>
            The fix list customers have written for the HDFC Bank app, from{" "}
            {fmt(rp.n_reviews)} Play Store and App Store reviews in the window.
          </div>
          <Table
            head={[
              "Issue",
              "Negative reviews",
              "First seen",
              "Latest version",
              "Customers ask for",
            ]}
            align={["left", "right", "left", "left", "left"]}
            rows={rp.fix_list
              .slice(0, 7)
              .map((f) => [
                f.issue,
                fmt(f.count),
                f.first_seen_version ? `v${f.first_seen_version}` : "—",
                f.latest_version_seen ? `v${f.latest_version_seen}` : "—",
                f.feature_asks.slice(0, 2).join("; ") || "—",
              ])}
          />
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
              label="Versions 11.x"
              value={`${rp.new_app_avg?.toFixed(1)}★`}
              sub={`${fmt(rp.new_app_n)} reviews`}
              tone="red"
            />
            <Kpi
              label="Previous app (v9)"
              value={`${rp.old_app_avg?.toFixed(1)}★`}
              sub={`${fmt(rp.old_app_n)} reviews`}
              tone="green"
            />
            <Kpi
              label="Positive reviews"
              value={fmtPct(rp.share_positive)}
              sub="4–5★, all versions"
              tone="green"
            />
          </div>
          <TrendLine
            data={rp.daily_negative.map((d) => ({
              day: fmtDate(d.date),
              n: d.count,
            }))}
            xKey="day"
            yKey="n"
            yLabel="Negative reviews"
            xLabel="Day"
            height={170}
          />
          <BaselineCaption>
            {rp.trend_label}. No baseline claim.
          </BaselineCaption>
          <Table
            head={["Version", "Reviews", "Average", "Positive", "Negative"]}
            align={["left", "right", "right", "right", "right"]}
            rows={rp.versions.map((v) => [
              `v${v.version}`,
              fmt(v.n),
              `${v.avg_rating.toFixed(1)}★`,
              fmtPct(v.share_positive),
              fmtPct(v.share_negative),
            ])}
          />
        </Section>
        <Section n={3} title="Where">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Pillar: Availability · Business: Retail banking · Sources:{" "}
            {rp.coverage.join("; ")}
          </div>
        </Section>
        <Section n={4} title="How high">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Rung: Voice. Store reviews are public and visible to every
            prospective customer on the store page.
          </div>
        </Section>
        <Section n={5} title="Who and what next">
          <div style={{ fontSize: 15, color: C.textSec }}>
            Owner: <strong>Digital</strong>. Recommended action:{" "}
            <strong>Route with evidence</strong>: the fix list, versions and
            example reviews go to the app backlog. Track the rating by version
            after each release.
          </div>
        </Section>
        <Section n={6} title="Evidence" id="evidence">
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
        <Section n={7} title="Provenance">
          <MutedNote>
            Play Store export 7–23 September; App Store export 10 June–23
            September. Public · live.
          </MutedNote>
        </Section>
      </Tile>
      <div style={{ fontFamily: MONO, display: "none" }} />
    </div>
  );
}

export function SignalDetail({ b, id }: { b: Bundle; id: string }) {
  if (id === "release-pulse") {
    const rp = releasePulse(b);
    if (rp) return <ReleaseSignal b={b} rp={rp} />;
  }
  const t = b.themes.themes.find((x) => x.id === id);
  if (!t) return <MutedNote>Signal not found.</MutedNote>;
  return <ThemeSignal b={b} t={t} />;
}
