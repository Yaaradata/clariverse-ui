"use client";

import { Activity, ChevronRight, Shield, Sparkles, Timer } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { execAnswer, moodLine, whatChanged } from "@/lib/hdfc-v3/copy";
import {
  fmt,
  fmtDateTime,
  fmtNum,
  fmtPct,
  fmtSigned,
} from "@/lib/hdfc-v3/format";
import {
  actions,
  improvingItems,
  needsYou,
  releasePulse,
  routedItems,
  type SignalItem,
  signalHref,
  themeMap,
  thisWeekItems,
} from "@/lib/hdfc-v3/selectors";
import type { Bundle, View } from "@/lib/hdfc-v3/types";
import {
  ActionChip,
  AnswerLine,
  BaselineCaption,
  C,
  HalfGauge,
  MONO,
  MutedNote,
  OWNER_LABEL,
  OwnerChip,
  ProvenanceTag,
  RungChip,
  Status,
  statusColor,
  Table,
  Tile,
  type Tone,
  tint,
} from "./primitives";

type Internal = {
  md_mail: {
    total: number;
    rows: {
      theme: string;
      label: string;
      owner: string;
      mails: number;
      median_age_days: number;
      resolved_before_md: number;
      resolved_share: number;
    }[];
  };
  since_830_ack: { theme: string; status: string }[];
  promise_ledger_ageing: {
    request_type: string;
    open_cases: number;
    beyond_tat: number;
    beyond_tat_share: number;
  }[];
};

function PulseBox({
  title,
  items,
  from,
  empty,
  color,
}: {
  title: string;
  items: SignalItem[];
  from: View;
  empty: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: tint(color, 0.05),
        border: `1px solid ${tint(color, 0.25)}`,
        borderTop: `3px solid ${color}`,
        borderRadius: 10,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: color,
            boxShadow: `0 0 8px ${tint(color, 0.7)}`,
          }}
        />
        {title}
      </div>
      {items.length === 0 ? <MutedNote>{empty}</MutedNote> : null}
      {items.map((s) => (
        <Link
          key={s.id}
          href={signalHref(s.id, from)}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 650,
                color: C.text,
                lineHeight: 1.35,
              }}
            >
              {s.label}
            </span>
            <ChevronRight
              size={16}
              color={C.textDim}
              style={{ flexShrink: 0, marginTop: 2 }}
            />
          </div>
          <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.45 }}>
            {s.why}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Status value={s.status} />
            <OwnerChip owner={s.owner} />
            {s.ackAt ? (
              <span style={{ fontSize: 12.5, color: C.textMut }}>
                Acknowledged {s.ackAt}
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}

function QuestionCard({
  href,
  icon,
  title,
  micro,
  answer,
  headline,
  headlineLabel,
  caption,
  gauges,
  stats,
  saying,
  prov,
  accent,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  micro: string;
  answer: string;
  headline: string;
  headlineLabel: string;
  caption: string;
  gauges: { label: string; value: number; sub: string; tone?: Tone }[];
  stats: {
    label: string;
    value: string;
    sub: string;
    href?: string;
    color?: string;
  }[];
  saying: string;
  prov: ("public" | "internal")[];
  accent: string;
}) {
  return (
    <section
      data-testid="tile"
      style={{
        background: C.card,
        border: `1px solid ${tint(accent, 0.25)}`,
        borderRadius: 16,
        padding: "18px 18px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 0,
        boxShadow: `0 8px 32px ${tint(accent, 0.08)}`,
      }}
    >
      <Link
        href={href}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: tint(accent, 0.12),
            color: accent,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 16.5,
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 12.5, color: C.textMut, marginTop: 2 }}>
            {micro}
          </div>
        </div>
        <ChevronRight size={20} color={C.textDim} />
      </Link>
      <p
        style={{ margin: 0, fontSize: 14.5, color: C.textSec, lineHeight: 1.5 }}
      >
        {answer}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "start",
        }}
      >
        <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
          <div
            style={{
              fontSize: 12.5,
              color: C.textMut,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {headlineLabel}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              fontFamily: MONO,
              color: C.text,
              lineHeight: 1.1,
              marginTop: 2,
            }}
          >
            {headline}
          </div>
          <BaselineCaption>{caption}</BaselineCaption>
        </Link>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {gauges.map((g) => (
            <HalfGauge
              key={g.label}
              label={g.label}
              value={g.value}
              sub={g.sub}
              tone={g.tone}
            />
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          borderTop: `1px solid ${C.border}`,
          paddingTop: 10,
        }}
      >
        {stats.map((s, i) => (
          <Link
            key={s.label}
            href={s.href ?? href}
            style={{
              textDecoration: "none",
              color: "inherit",
              textAlign: i === 1 ? "right" : "left",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: C.textMut,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: s.color ?? C.text,
                marginTop: 3,
                lineHeight: 1.3,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: C.textMut, marginTop: 2 }}>
              {s.sub}
            </div>
          </Link>
        ))}
      </div>
      <div
        style={{
          background: tint(accent, 0.055),
          border: `1px solid ${tint(accent, 0.22)}`,
          borderLeft: `3px solid ${accent}`,
          borderRadius: 10,
          padding: "10px 12px",
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 800,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles size={13} color={accent} />
          What customers are saying
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            color: C.textSec,
            lineHeight: 1.5,
          }}
        >
          {saying}
        </p>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {prov.map((p) => (
          <ProvenanceTag key={p} kind={p} />
        ))}
      </div>
    </section>
  );
}

function ActionCard({ s, from }: { s: SignalItem; from: View }) {
  const color = statusColor(s.status);
  return (
    <Link
      href={signalHref(s.id, from)}
      data-testid="action-card"
      style={{
        textDecoration: "none",
        color: "inherit",
        background: `linear-gradient(180deg, ${tint(color, 0.07)}, ${C.card} 70%)`,
        border: `1px solid ${tint(color, 0.28)}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: 15.5,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.35,
          }}
        >
          {s.label}
        </span>
        <Status value={s.status} />
      </div>
      <div style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.5 }}>
        {s.why}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <OwnerChip owner={s.owner} />
        <RungChip rung={s.rung} />
        <ActionChip action={s.action} />
      </div>
      {s.ackAt ? (
        <div style={{ fontSize: 12.5, color: C.textMut }}>
          Routed to {OWNER_LABEL[s.owner] ?? s.owner} · {s.ackSystem} ·
          acknowledged {s.ackAt}
        </div>
      ) : null}
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto" }}
      >
        <ProvenanceTag kind="public" />
        {s.ackAt ? <ProvenanceTag kind="internal" /> : null}
      </div>
    </Link>
  );
}

export function ExecPage({ b, view }: { b: Bundle; view: View }) {
  const tm = themeMap(b);
  const internal = b.internal as unknown as Internal;
  const from = view;
  const rp = releasePulse(b);
  const needs = needsYou(b);
  const focus = [...routedItems(b), ...thisWeekItems(b)].slice(0, 3);
  const improving = improvingItems(b);
  const acts = actions(b, view);
  const ackBy = Object.fromEntries(
    internal.since_830_ack.map((a) => [a.theme, a.status]),
  );

  // Card 1: satisfaction
  const pillars = b.themes.pillars;
  const allPos = pillars.reduce((s, p) => s + p.sentiment.positive, 0);
  const allN = pillars.reduce((s, p) => s + p.count, 0);
  const posShare = (id: string) => {
    const p = pillars.find((x) => x.id === id);
    return p?.count ? (100 * p.sentiment.positive) / p.count : 0;
  };
  const topPain = b.themes.themes
    .filter(
      (t) =>
        ![
          "general_dissatisfaction",
          "other",
          "app_praise",
          "service_praise",
          "product_advice",
          "offers_deals",
          "market_news",
        ].includes(t.id),
    )
    .sort((a, c) => c.sentiment.negative - a.sentiment.negative)[0];
  const ev = (id?: string) => (id ? b.evidence[id] : undefined);
  const sayingFor = (ids: string[]) =>
    ev(ids.find((i) => b.evidence[i]))?.summary ?? "";

  // Card 2: market
  const riser = b.themes.themes
    .filter((t) => t.score > 0)
    .sort((a, c) => c.score - a.score)[0];
  const bankApp = b.pulse.apps.find((a) => a.app === "HDFC Bank app");
  const payzapp = b.pulse.apps.find((a) => a.app === "PayZapp");

  // Card 3: service promise
  const sig = b.signals;
  const pbCount = sig.flags.promise_break.count;
  const stCount = sig.flags.status_seeking.count;
  const escCount = sig.flags.escalation_intent.count;
  const beyond = internal.promise_ledger_ageing.reduce(
    (s, r) => s + r.beyond_tat,
    0,
  );
  const repeatInPromise = sig.promise_by_request_type.reduce(
    (s, p) => s + ((p.repeat_share ?? 0) * p.count) / 100,
    0,
  );
  const statusInPromise = sig.promise_by_request_type.reduce(
    (s, p) => s + p.status_seeking,
    0,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov={["public", "internal"]} accent>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 800,
            color: C.violet,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Executive summary
        </div>
        <AnswerLine sub={whatChanged(b)}>{execAnswer(b)}</AnswerLine>
      </Tile>

      <Tile
        title="Since yesterday's 8:30"
        sub={`${fmt(b.briefing.since_830_total)} public items since ${fmtDateTime(b.briefing.since_830_from)}. Owner acknowledgement shown where routed.`}
        prov={["public", "internal"]}
        tone="amber"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
            gap: 10,
          }}
        >
          {b.briefing.since_830.slice(0, 3).map((s) => (
            <Link
              key={s.theme}
              href={signalHref(s.theme, from)}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: tint(C.amber, 0.05),
                border: `1px solid ${tint(C.amber, 0.22)}`,
                borderLeft: `3px solid ${C.amber}`,
                borderRadius: 10,
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 650, color: C.text }}>
                {s.label}
              </div>
              <div style={{ fontSize: 13.5, color: C.textSec }}>
                <span style={{ color: C.amber, fontWeight: 700 }}>
                  {fmt(s.count)}
                </span>{" "}
                new public items overnight
                {tm[s.theme]
                  ? ` · ${fmt(tm[s.theme].count)} in the window`
                  : ""}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <OwnerChip owner={s.owner} />
                <span style={{ fontSize: 12.5, color: C.textMut }}>
                  {ackBy[s.theme] ?? "Awaiting owner"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Tile>

      <Tile title="Executive pulse" prov={["public", "internal"]}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: 10,
          }}
        >
          <PulseBox
            title="1. What needs you"
            items={needs}
            from={from}
            empty="Nothing needs you today."
            color={C.red}
          />
          <PulseBox
            title="2. Where to focus"
            items={focus}
            from={from}
            empty="No routed items."
            color={C.amber}
          />
          <PulseBox
            title="3. What's improving or stable"
            items={improving}
            from={from}
            empty="Stable."
            color={C.green}
          />
        </div>
      </Tile>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
          gap: 14,
        }}
      >
        <QuestionCard
          href={`/hdfc-v3/satisfaction?from=${from}`}
          accent={C.violet}
          icon={<Activity size={18} />}
          title="Are customers satisfied with their journey?"
          micro="Mood · Trust pillars · Top pain"
          answer={moodLine(b)}
          headlineLabel="Mood index (7 days)"
          headline={fmtNum(b.mood.value)}
          caption={`${fmtSigned(b.mood.delta_pts, " pts")} vs window average (1 Aug–24 Sep); scale −100 to +100. No earlier baseline for social sources.`}
          gauges={[
            {
              label: "All voice",
              value: allN ? (100 * allPos) / allN : 0,
              sub: "positive share",
            },
            {
              label: "Experience",
              value: posShare("experience"),
              sub: "positive share",
            },
          ]}
          stats={[
            {
              label: "Top pain",
              value: topPain?.label ?? "—",
              sub: `${fmt(topPain?.sentiment.negative)} negative items`,
              href: topPain ? signalHref(topPain.id, from) : undefined,
              color: C.red,
            },
            {
              label: "Closure intent",
              value: `${fmt(sig.closure_intent.count)} posts`,
              color: C.amber,
              sub: "customers saying they will close",
              href: `/hdfc-v3/service-promise?from=${from}#closure`,
            },
          ]}
          saying={sayingFor(topPain?.exemplars ?? [])}
          prov={["public"]}
        />
        <QuestionCard
          href={`/hdfc-v3/market?from=${from}`}
          accent={C.violet}
          icon={<Shield size={18} />}
          title="What is the market saying about us?"
          micro="Themes · Rising · App pulse"
          answer={`${riser?.label ?? "—"} is rising fastest. The new HDFC Bank app has ${fmtPct(bankApp?.window?.share_positive)} positive reviews in the window.`}
          headlineLabel="Public posts and reviews"
          headline={fmt(b.themes.total_items)}
          caption="HDFC Bank, on-topic, 1 Aug–24 Sep. X, Reddit, forums, Play Store, App Store."
          gauges={[
            {
              label: "HDFC Bank app",
              value: bankApp?.window?.share_positive ?? 0,
              sub: "4–5★ share",
            },
            {
              label: "PayZapp",
              value: payzapp?.window?.share_positive ?? 0,
              sub: "4–5★ share",
            },
          ]}
          stats={[
            {
              label: "Rising theme",
              value: riser?.label ?? "—",
              sub: riser ? `${fmt(riser.count)} items` : "",
              href: riser ? signalHref(riser.id, from) : undefined,
              color: C.amber,
            },
            {
              label: "App pulse",
              value: rp ? `${fmt(rp.count)} negative reviews` : "—",
              color: C.red,
              sub: "new HDFC Bank app",
              href: signalHref("release-pulse", from),
            },
          ]}
          saying={sayingFor(riser?.exemplars ?? [])}
          prov={["public"]}
        />
        <QuestionCard
          href={`/hdfc-v3/service-promise?from=${from}`}
          accent={C.violet}
          icon={<Timer size={18} />}
          title="Are we keeping our service promise?"
          micro="Promise breaks · Status-seeking · Climb risk"
          answer={`${fmt(pbCount)} public posts describe a broken timeline; ${fmt(stCount)} ask where something is; ${fmt(escCount)} use escalation language.`}
          headlineLabel="Promise breaks heard"
          headline={fmt(pbCount)}
          caption={`Trend within window: ${fmtSigned(sig.flags.promise_break.trend.change_pct)} second half vs first half (share of posts).`}
          gauges={[
            {
              label: "Repeat contact",
              value: pbCount ? (100 * repeatInPromise) / pbCount : 0,
              sub: "of promise breaks",
              tone: "red",
            },
            {
              label: "Asking status",
              value: pbCount ? (100 * statusInPromise) / pbCount : 0,
              sub: "of promise breaks",
              tone: "amber",
            },
          ]}
          stats={[
            {
              label: "Escalation language",
              value: `${fmt(escCount)} posts`,
              sub: "RBI, ombudsman, court",
              href: `/hdfc-v3/service-promise?from=${from}#ladder`,
              color: C.red,
            },
            {
              label: "Beyond TAT (internal)",
              value: `${fmt(beyond)} cases`,
              color: C.violet,
              sub: "illustrative until discovery",
              href: `/hdfc-v3/service-promise?from=${from}#ledger`,
            },
          ]}
          saying={sayingFor(sig.promise_by_request_type[0]?.exemplars ?? [])}
          prov={["public", "internal"]}
        />
      </div>

      <Tile
        title="Actions to take"
        sub={
          view === "mds-office"
            ? "At most three. Reputation and regulatory rungs first."
            : "At most five, each with its owner, rung and recommended action."
        }
        prov={["public", "internal"]}
        tone="red"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: 10,
          }}
        >
          {acts.map((s) => (
            <ActionCard key={s.id} s={s} from={from} />
          ))}
        </div>
        <MutedNote>
          Every action is a recommendation routed to the owner&apos;s system.
          LisN never executes, authorises or decides.
        </MutedNote>
      </Tile>

      {view === "mds-office" ? (
        <Tile
          id="md-mail"
          title="MD-marked mail"
          sub={`${fmt(internal.md_mail.total)} customer mails marked to the MD's office this window, sieved into themes and routed to owners.`}
          prov="internal"
        >
          <Table
            head={[
              "Theme",
              "Owner",
              "Mails",
              "Median age",
              "Resolved before reaching the MD",
            ]}
            align={["left", "left", "right", "right", "right"]}
            rows={internal.md_mail.rows.map((r) => [
              <Link
                key={r.theme}
                href={signalHref(r.theme, from)}
                style={{ color: C.text, textDecoration: "none" }}
              >
                {r.label}
              </Link>,
              OWNER_LABEL[r.owner] ?? r.owner,
              fmt(r.mails),
              `${r.median_age_days.toFixed(1)} days`,
              `${fmt(r.resolved_before_md)} (${r.resolved_share.toFixed(0)}%)`,
            ])}
          />
        </Tile>
      ) : (
        <Tile
          id="routing"
          title="Who should hear what"
          sub="Each owner's top three themes from public voice. CX hears everything."
          prov="public"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: 10,
            }}
          >
            {b.briefing.routing
              .filter((r) =>
                [
                  "cx",
                  "digital",
                  "cards",
                  "retail",
                  "loans",
                  "payments",
                  "compliance",
                  "fraud_cyber",
                  "operations",
                ].includes(r.owner),
              )
              .slice(0, 9)
              .map((r) => (
                <div
                  key={r.owner}
                  style={{
                    background: C.cardAlt,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: C.violet,
                      }}
                    >
                      {r.owner_label}
                    </span>
                    <span style={{ fontSize: 12.5, color: C.textMut }}>
                      {fmt(r.total)} items
                    </span>
                  </div>
                  <ol
                    style={{
                      margin: "8px 0 0",
                      paddingLeft: 18,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {r.themes.map((t) => (
                      <li
                        key={t.id}
                        style={{ fontSize: 13.5, color: C.textSec }}
                      >
                        <Link
                          href={signalHref(t.id, from)}
                          style={{ color: C.textSec }}
                        >
                          {t.label}
                        </Link>{" "}
                        <span style={{ fontFamily: MONO, color: C.text }}>
                          {fmt(t.count)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
          </div>
        </Tile>
      )}
    </div>
  );
}
