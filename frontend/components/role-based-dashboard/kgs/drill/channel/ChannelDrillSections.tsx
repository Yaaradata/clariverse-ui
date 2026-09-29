"use client";

import type { ChannelV2 } from "@kgs/types";
import {
  Globe,
  type LucideIcon,
  Mail,
  MessageSquare,
  Phone,
  Share2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { IllustrativeChip } from "../../shared/IllustrativeChip";
import { K, withAlpha } from "../../shared/tokens";
import { useLabel } from "../../shell/DemoProvider";
import {
  DR,
  DrBadge,
  DrCard,
  DrFilterBar,
  DrHead,
  DrMono,
  DrPill,
  DrTag,
  DrTd,
  DrTh,
  severityColor,
} from "../ui/DrillChrome";

const ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  mail: Mail,
  chat: MessageSquare,
  portal: Globe,
  social: Share2,
};

export function ChannelMixStrip({ mix }: { mix: ChannelV2["channelMix"] }) {
  const L = useLabel();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))",
        gap: 10,
      }}
    >
      {mix.map((t) => {
        const Icon = ICONS[t.icon] ?? Globe;
        const up = t.wow >= 0;
        return (
          <div
            key={t.id}
            style={{
              background: DR.card,
              border: `1px solid ${DR.border}`,
              borderRadius: 14,
              padding: "12px 12px 10px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  display: "grid",
                  placeItems: "center",
                  background: withAlpha(K.violet400, 0.12),
                  color: K.violet300,
                }}
              >
                <Icon size={14} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: DR.sub }}>
                {L(t.label)}
              </span>
            </div>
            <DrMono size={22}>{t.interactions.toLocaleString()}</DrMono>
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                fontWeight: 700,
                color: up ? DR.green : DR.red,
              }}
            >
              {up ? "▲" : "▼"}
              {Math.abs(t.wow)}%
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: DR.muted }}>
              {t.negativeShare}% negative
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: DR.text,
                lineHeight: 1.35,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {L(t.topTopic)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PartnerPromiseGap({ data }: { data: ChannelV2["promiseGap"] }) {
  const L = useLabel();
  const [lens, setLens] = useState("all");
  const rows = useMemo(
    () => data.rows.filter((r) => r.lens.includes(lens)),
    [data.rows, lens],
  );
  return (
    <DrCard accent={DR.orange}>
      <DrHead sub={data.sub} badge="LiSN">
        Partner Promise Gap
      </DrHead>
      <DrFilterBar options={data.lenses} value={lens} onChange={setLens} />
      <div style={{ overflowX: "auto", maxHeight: 520 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 960,
            tableLayout: "fixed",
          }}
        >
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <DrTh>We promise</DrTh>
              <DrTh>Where it breaks</DrTh>
              <DrTh>Affected partners</DrTh>
              <DrTh>Volume + channels</DrTh>
              <DrTh align="right">Tone</DrTh>
              <DrTh>Importance</DrTh>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <DrTd>
                  <div
                    style={{ fontWeight: 700, color: DR.text, fontSize: 12 }}
                  >
                    {L(r.promise)}
                  </div>
                  <div style={{ fontSize: 10, color: DR.muted, marginTop: 4 }}>
                    {L(r.category)}
                  </div>
                </DrTd>
                <DrTd>
                  <div style={{ color: DR.text }}>{L(r.whereItBreaks)}</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: DR.muted,
                      marginTop: 6,
                      fontStyle: "italic",
                    }}
                  >
                    {L(r.evidence)}
                  </div>
                </DrTd>
                <DrTd>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {r.partners.map((p) => (
                      <DrPill key={p}>{L(p)}</DrPill>
                    ))}
                  </div>
                </DrTd>
                <DrTd>
                  <DrMono size={18}>{r.volume.toLocaleString()}</DrMono>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 10,
                      color: DR.muted,
                      fontFamily: K.mono,
                      lineHeight: 1.35,
                    }}
                  >
                    {r.channelsLine}
                  </div>
                </DrTd>
                <DrTd align="right">
                  <DrMono
                    size={12}
                    color={r.tone <= -0.35 ? DR.red : DR.orange}
                  >
                    {r.tone.toFixed(2)}
                  </DrMono>
                </DrTd>
                <DrTd>
                  <DrBadge color={severityColor(r.importance)}>
                    {r.importance}
                  </DrBadge>
                </DrTd>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DrCard>
  );
}

export function TrendingPartnerTopics({
  topics,
}: {
  topics: ChannelV2["trendingTopics"];
}) {
  const L = useLabel();
  return (
    <DrCard>
      <DrHead sub="Topics gaining mentions this week across partner channels.">
        Trending Partner Topics
      </DrHead>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {topics.map((t) => (
          <div
            key={t.topic}
            style={{
              border: `1px solid ${DR.border}`,
              borderRadius: 10,
              padding: "10px 10px 8px",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 700, color: DR.text, fontSize: 12 }}>
                {L(t.topic)}
              </div>
              <DrTag color={severityColor(t.tone)}>{t.tone}</DrTag>
            </div>
            <div style={{ marginTop: 6 }}>
              <DrMono size={22} color={t.growthPct >= 0 ? DR.orange : DR.green}>
                {t.growthPct >= 0 ? "+" : ""}
                {t.growthPct}%
              </DrMono>
              <span style={{ marginLeft: 8, fontSize: 11, color: DR.muted }}>
                {t.mentions} mentions
              </span>
            </div>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 11,
                color: DR.muted,
                lineHeight: 1.4,
              }}
            >
              {L(t.why)}
            </p>
          </div>
        ))}
      </div>
    </DrCard>
  );
}

export function MarketSaying({ data }: { data: ChannelV2["marketSay"] }) {
  const L = useLabel();
  const [tab, setTab] = useState("all");
  const cards = useMemo(
    () => data.cards.filter((c) => tab === "all" || c.source === tab),
    [data.cards, tab],
  );
  return (
    <DrCard>
      <DrHead sub="External posts and forum threads that echo partner friction.">
        What the market is saying
      </DrHead>
      <DrFilterBar options={data.tabs} value={tab} onChange={setTab} />
      <div style={{ display: "grid", gap: 8 }}>
        {cards.map((c) => (
          <div
            key={c.id}
            style={{
              border: `1px solid ${DR.border}`,
              borderRadius: 10,
              padding: 10,
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ fontSize: 10, color: DR.muted, marginBottom: 4 }}>
              {L(c.sourceLabel)}
            </div>
            <div style={{ fontWeight: 800, color: DR.text, fontSize: 13 }}>
              {L(c.theme)}
            </div>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 11,
                color: DR.sub,
                lineHeight: 1.45,
              }}
            >
              {L(c.summary)}
            </p>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
                fontSize: 11,
                color: DR.muted,
              }}
            >
              <span>{L(c.members)}</span>
              <span>·</span>
              <span>{c.postsThisWeek} posts this week</span>
              <DrTag color={severityColor(c.tone)}>{c.tone}</DrTag>
            </div>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                alignItems: "center",
              }}
            >
              {c.pills.map((p) => (
                <DrPill key={p}>{L(p)}</DrPill>
              ))}
              <span
                style={{ marginLeft: "auto", fontSize: 11, color: DR.cyan }}
              >
                {L(c.action)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DrCard>
  );
}

export function PartnerStandings({ data }: { data: ChannelV2["standings"] }) {
  const L = useLabel();
  const [lens, setLens] = useState("all");
  const rows = useMemo(
    () => data.rows.filter((r) => r.lens.includes(lens)),
    [data.rows, lens],
  );
  return (
    <DrCard>
      <DrHead sub={data.sub} badge="LiSN">
        Partner Standings
      </DrHead>
      <DrFilterBar options={data.lenses} value={lens} onChange={setLens} />
      <div style={{ overflowX: "auto", maxHeight: 420 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 1040,
          }}
        >
          <thead>
            <tr>
              <DrTh>Partner</DrTh>
              <DrTh>Region</DrTh>
              <DrTh>Tier</DrTh>
              <DrTh>Sell-in vs LY</DrTh>
              <DrTh>Recontact</DrTh>
              <DrTh>Competitor mentions</DrTh>
              <DrTh>Why it moved</DrTh>
              <DrTh>Internal echo</DrTh>
              <DrTh>Risk</DrTh>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <DrTd>
                  <span style={{ fontWeight: 700, color: DR.text }}>
                    {L(r.partner)}
                  </span>
                </DrTd>
                <DrTd>{L(r.region)}</DrTd>
                <DrTd>{L(r.tier)}</DrTd>
                <DrTd>
                  <DrMono
                    size={12}
                    color={
                      r.sellIn.startsWith("−") || r.sellIn.startsWith("-")
                        ? DR.red
                        : DR.green
                    }
                  >
                    {r.sellIn}
                  </DrMono>
                </DrTd>
                <DrTd>{r.recontact}</DrTd>
                <DrTd>
                  <DrMono size={12}>{r.competitorMentions}</DrMono>
                </DrTd>
                <DrTd>{L(r.whyMoved)}</DrTd>
                <DrTd>
                  <DrMono size={12}>{r.echoCount}</DrMono>
                  <div
                    style={{
                      fontSize: 10,
                      color: DR.muted,
                      marginTop: 4,
                      fontStyle: "italic",
                    }}
                  >
                    {L(r.echoQuote)}
                  </div>
                </DrTd>
                <DrTd>
                  <DrBadge color={severityColor(r.risk)}>{r.risk}</DrBadge>
                </DrTd>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          marginTop: 12,
          padding: "8px 10px",
          borderRadius: 10,
          background: withAlpha(K.violet400, 0.08),
          border: `1px solid ${withAlpha(K.violet400, 0.28)}`,
          fontSize: 12,
          color: DR.sub,
          lineHeight: 1.45,
        }}
      >
        <strong style={{ color: DR.text }}>LiSN note · </strong>
        {L(data.lisnNote)}
      </div>
    </DrCard>
  );
}

/** Money illustrative helper for channel backlog notes if needed later. */
export function MoneyHint() {
  return <IllustrativeChip />;
}
