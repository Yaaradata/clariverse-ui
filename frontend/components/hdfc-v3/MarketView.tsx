"use client";

import Link from "next/link";
import { useState } from "react";

import { marketAnswer } from "@/lib/hdfc-v3/copy";
import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/hdfc-v3/format";
import { signalHref, themeMap, trendWords } from "@/lib/hdfc-v3/selectors";
import type { AppPulse, Bundle, Theme, View } from "@/lib/hdfc-v3/types";
import {
  AnswerLine,
  BarRow,
  BaselineCaption,
  C,
  cols,
  MONO,
  MutedNote,
  negColor,
  OwnerChip,
  PAIRS,
  RungChip,
  Status,
  statusColor,
  Table,
  Tile,
  tint,
  WeeklyBars,
} from "./primitives";
import { useFrom } from "./Shell";

/** HDFC's stated promises, framed on the four trust pillars the bank uses publicly (availability, experience, data intimacy, security). */
const PROMISES: { promise: string; pillar: string; themes: string[] }[] = [
  {
    promise: "Available when customers need it, around the clock",
    pillar: "availability",
    themes: [
      "app_speed_crash",
      "login_mpin",
      "care_unreachable",
      "netbanking",
      "upi_failures",
      "account_freeze",
    ],
  },
  {
    promise: "Effortless, one-click digital journeys",
    pillar: "experience",
    themes: [
      "app_usability",
      "new_app_release",
      "device_security_block",
      "card_application",
    ],
  },
  {
    promise: "Transparent: customers can see where their request is",
    pillar: "experience",
    themes: [
      "complaint_handling",
      "refund_delay",
      "failed_txn_reversal",
      "card_dispatch",
      "dispute_chargeback",
    ],
  },
  {
    promise: "A bank that knows me: relevant offers, with consent",
    pillar: "data_intimacy",
    themes: [
      "unsolicited_calls",
      "mis_selling",
      "kyc_updates",
      "credit_report",
    ],
  },
  {
    promise: "Rewarding to hold: cards and benefits that keep their value",
    pillar: "experience",
    themes: [
      "rewards_value",
      "card_variant_migration",
      "reward_redemption",
      "card_fees_charges",
    ],
  },
  {
    promise: "Safe: security that protects without getting in the way",
    pillar: "security",
    themes: ["fraud_scam", "unauthorised_txn", "phishing", "recovery_conduct"],
  },
];
const EXCLUDE = new Set([
  "other",
  "market_news",
  "offers_deals",
  "general_dissatisfaction",
  "product_advice",
  "app_praise",
  "service_praise",
]);
const SEC = new Set([
  "fraud_scam",
  "unauthorised_txn",
  "phishing",
  "recovery_conduct",
  "unsolicited_calls",
  "mis_selling",
]);

const STAR_COLOR: Record<number, string> = {
  5: C.green,
  4: C.green,
  3: C.amber,
  2: C.red,
  1: C.red,
};

const ratingColor = (r: number) =>
  r >= 4 ? C.green : r >= 3 ? C.amber : C.red;

function AppCard({ a, from, b }: { a: AppPulse; from: View; b: Bundle }) {
  const w = a.window;
  if (!w) return null;
  const maxR = Math.max(...Object.values(w.ratings), 1);
  const rc = ratingColor(w.avg_rating);
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${tint(rc, 0.07)}, ${C.cardAlt} 45%)`,
        border: `1px solid ${tint(rc, 0.28)}`,
        borderTop: `3px solid ${rc}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 700 }}>{a.app}</span>
        <span style={{ fontSize: 12.5, color: C.textMut }}>
          {fmt(w.n)} reviews in window
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 28,
              fontWeight: 800,
              color: rc,
            }}
          >
            {w.avg_rating.toFixed(1)}★
          </div>
          <div style={{ fontSize: 12.5, color: C.textMut }}>
            {fmtPct(w.share_positive)} positive (4–5★)
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[5, 4, 3, 2, 1].map((k) => (
            <div
              key={k}
              style={{
                display: "grid",
                gridTemplateColumns: "22px 1fr 40px",
                gap: 6,
                alignItems: "center",
                fontSize: 12,
              }}
            >
              <span style={{ color: STAR_COLOR[k] }}>{k}★</span>
              <div
                style={{
                  height: 7,
                  background: C.track,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(100 * (w.ratings[String(k)] ?? 0)) / maxR}%`,
                    height: "100%",
                    borderRadius: 4,
                    background: STAR_COLOR[k],
                  }}
                />
              </div>
              <span
                style={{
                  color: C.textSec,
                  fontFamily: MONO,
                  textAlign: "right",
                }}
              >
                {fmt(w.ratings[String(k)] ?? 0)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <BaselineCaption>
        {a.mode === "vs_baseline" && a.baseline
          ? `vs baseline (${fmt(a.baseline.n)} reviews, Feb–Jul): ${a.baseline.avg_rating.toFixed(1)}★, ${fmtPct(a.baseline.share_positive)} positive; change ${fmtSigned(
              (w.share_positive ?? 0) - (a.baseline.share_positive ?? 0),
              " pts",
            )}.`
          : `Trend within window (${a.streams.map((s) => `${s.stream.split(":")[0] === "playstore" ? "Play Store" : "App Store"} from ${fmtDate(s.window_first ?? s.earliest)}`).join("; ")}). No baseline claim.`}
      </BaselineCaption>
      <div>
        <div
          style={{
            fontSize: 12.5,
            color: C.textMut,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: 4,
          }}
        >
          Top issues
        </div>
        {a.top_issues.slice(0, 3).map((i) => (
          <Link
            key={i.id}
            href={signalHref(i.id, from)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13.5,
              color: C.textSec,
              textDecoration: "none",
              padding: "2px 0",
            }}
          >
            <span>{i.label}</span>
            <span style={{ fontFamily: MONO, color: C.red, fontWeight: 700 }}>
              {fmt(i.count)}
            </span>
          </Link>
        ))}
      </div>
      {a.fix_list.length ? (
        <div>
          <div
            style={{
              fontSize: 12.5,
              color: C.textMut,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 4,
            }}
          >
            Fix list customers have written
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {a.fix_list.slice(0, 5).map((f) => {
              const e = b.evidence[f.example_ids[0]];
              const href = `${signalHref(a.app === "HDFC Bank app" ? "release-pulse" : f.theme, from)}${e ? `#ev-${encodeURIComponent(e.id)}` : ""}`;
              return (
                <Link
                  key={f.theme}
                  href={href}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    borderLeft: `2px solid ${C.amber}`,
                    paddingLeft: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      fontSize: 14,
                    }}
                  >
                    <span style={{ fontWeight: 650, color: C.text }}>
                      {f.issue}
                    </span>
                    <span
                      style={{
                        fontFamily: MONO,
                        color: C.amber,
                        fontWeight: 700,
                      }}
                    >
                      {fmt(f.count)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: C.textMut }}>
                    {f.first_seen_version
                      ? `First seen v${f.first_seen_version}`
                      : "Version not stated"}
                    {f.latest_version_seen
                      ? ` · still in v${f.latest_version_seen}`
                      : ""}
                  </div>
                  {e ? (
                    <div
                      style={{
                        fontSize: 13,
                        color: C.textSec,
                        lineHeight: 1.45,
                        marginTop: 2,
                      }}
                    >
                      {e.summary}
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
      {a.versions.length ? (
        <div style={{ fontSize: 12.5, color: C.textMut }}>
          By version:{" "}
          {a.versions
            .slice(0, 4)
            .map(
              (v) => `v${v.version} ${v.avg_rating.toFixed(1)}★ (${fmt(v.n)})`,
            )
            .join(" · ")}
        </div>
      ) : null}
    </div>
  );
}

export function MarketView({ b }: { b: Bundle }) {
  const from: View = useFrom();
  const tm = themeMap(b);
  const [showGroup, setShowGroup] = useState(false);
  const themes = b.themes.themes.filter((t) => !EXCLUDE.has(t.id));
  const top = [...themes].sort((a, c) => c.count - a.count).slice(0, 10);
  const rising = [...b.themes.themes]
    .filter((t) => t.score > 0)
    .sort((a, c) => c.score - a.score)
    .slice(0, 6);
  const apps = b.pulse.apps.filter(
    (a) => a.window && a.window.n >= 20 && (showGroup || !a.group_company),
  );
  const safety = themes
    .filter((t) => SEC.has(t.id))
    .sort((a, c) => c.count - a.count);
  const all = [...b.themes.themes].sort((a, c) => c.count - a.count);

  const promiseRow = (p: (typeof PROMISES)[number]) => {
    const ts = p.themes
      .map((id) => tm[id])
      .filter((t): t is Theme => Boolean(t));
    const n = ts.reduce((s, t) => s + t.sentiment.negative, 0);
    const worst = [...ts].sort(
      (a, c) => c.sentiment.negative - a.sentiment.negative,
    )[0];
    return { ...p, n, worst };
  };
  const promises = PROMISES.map(promiseRow).sort((a, c) => c.n - a.n);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov="public">
        <AnswerLine sub="Public voice only: X, Reddit, consumer forums, Play Store and App Store, 1 August to 24 September 2026. HDFC Bank only; group companies shown separately.">
          {marketAnswer(b)}
        </AnswerLine>
      </Tile>

      <Tile
        id="promise-gap"
        title="Brand promise gap"
        sub="What HDFC Bank promises in public, against where customers say it breaks. Ordered by negative items."
        prov="public"
      >
        <Table
          head={[
            "Promise",
            "Negative items",
            "Where it breaks most",
            "Trend",
            "Owner",
          ]}
          align={["left", "right", "left", "left", "left"]}
          rows={promises.map((p) => [
            <span key="p" style={{ color: C.text, fontWeight: 600 }}>
              {p.promise}
            </span>,
            <span key="n" style={{ color: C.red, fontWeight: 700 }}>
              {fmt(p.n)}
            </span>,
            p.worst ? (
              <Link
                key="w"
                href={signalHref(p.worst.id, from)}
                style={{ color: C.textSec }}
              >
                {p.worst.label} ({fmt(p.worst.sentiment.negative)})
              </Link>
            ) : (
              "—"
            ),
            p.worst ? trendWords(p.worst) : "—",
            p.worst ? p.worst.owner_label : "—",
          ])}
        />
        <MutedNote>
          Promises paraphrase the bank&apos;s public trust pillars:
          availability, experience, data intimacy and security.
        </MutedNote>
      </Tile>

      <div style={PAIRS}>
        <Tile
          id="rising"
          title="Rising themes"
          sub="Largest rise, weighted by volume and escalation. Real themes only; no hashtags."
          prov="public"
          tone="amber"
        >
          {rising.map((t) => (
            <Link
              key={t.id}
              href={signalHref(t.id, from)}
              style={{
                textDecoration: "none",
                color: "inherit",
                borderBottom: `1px solid ${C.border}`,
                borderLeft: `3px solid ${statusColor(t.status)}`,
                paddingLeft: 10,
                paddingBottom: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 650 }}>{t.label}</span>
                <Status
                  value={
                    t.status === "needs_you" || t.status === "improving"
                      ? t.status
                      : t.status === "this_week"
                        ? "this_week"
                        : "watching"
                  }
                />
              </div>
              <div style={{ fontSize: 13.5, color: C.textSec }}>
                <span style={{ color: C.cyan, fontWeight: 700 }}>
                  {fmt(t.count)}
                </span>{" "}
                items · {trendWords(t)} ·{" "}
                <span style={{ color: negColor(t.share_negative) }}>
                  {fmtPct(t.share_negative)} negative
                </span>
              </div>
            </Link>
          ))}
          <BaselineCaption>
            Trend within window: share of posts, 28 Aug–24 Sep vs 1–27 Aug.
            Seasonal check: in discovery, using your history.
          </BaselineCaption>
        </Tile>

        <Tile
          id="voices"
          title="Voices with reach"
          sub="Anonymised. Accounts and posts with the widest reach this window."
          prov="public"
        >
          {b.signals.voices_with_reach.slice(0, 5).map((v) => {
            const e = b.evidence[v.id];
            return (
              <Link
                key={v.id}
                href={`${signalHref(v.theme, from)}#ev-${encodeURIComponent(v.id)}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  borderBottom: `1px solid ${C.border}`,
                  paddingBottom: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 13, color: C.textMut }}>
                  {v.who} · {fmtDate(v.created_at)}
                </div>
                <div
                  style={{ fontSize: 14, color: C.textSec, lineHeight: 1.45 }}
                >
                  {e?.summary}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <OwnerChip owner={v.owner} />
                  <span style={{ fontSize: 12.5, color: C.textMut }}>
                    {v.theme_label}
                  </span>
                </div>
              </Link>
            );
          })}
        </Tile>
      </div>

      <Tile
        id="app-pulse"
        title="App pulse"
        sub="Per app: rating distribution, share positive, top issues and, for the new HDFC Bank app and PayZapp, the fix list customers have written."
        prov="public"
        right={
          <label
            style={{
              fontSize: 13,
              color: C.textSec,
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              checked={showGroup}
              onChange={(e) => setShowGroup(e.target.checked)}
            />{" "}
            Show group-company apps
          </label>
        }
      >
        <div style={cols(2, 420, 12)}>
          {apps
            .filter((a) => a.fix_list.length)
            .map((a) => (
              <AppCard key={a.app} a={a} from={from} b={b} />
            ))}
        </div>
        <div style={cols(4, 240, 12)}>
          {apps
            .filter((a) => !a.fix_list.length)
            .map((a) => (
              <AppCard key={a.app} a={a} from={from} b={b} />
            ))}
        </div>
        <MutedNote>{b.pulse.note}</MutedNote>
      </Tile>

      <div style={PAIRS}>
        <Tile
          id="safety"
          title="Safety and reputation watch"
          sub="Security and conduct themes, routed to Fraud and Cyber or Compliance. LisN detects in voice; it never makes fraud decisions."
          prov="public"
          tone="red"
        >
          {safety.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                borderBottom: `1px solid ${C.border}`,
                paddingBottom: 8,
              }}
            >
              <BarRow
                label={t.label}
                value={t.count}
                max={safety[0]?.count ?? 1}
                href={signalHref(t.id, from)}
                sub={`${fmt(t.escalation_count)} with escalation language · ${trendWords(t)}`}
                color={C.red}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <OwnerChip owner={t.owner} />
                <RungChip rung={t.rung} />
              </div>
            </div>
          ))}
        </Tile>

        <Tile
          id="themes"
          title="All themes this window"
          sub={`Every theme heard, HDFC Bank only. ${fmt(b.themes.total_items)} items; an item can carry up to three themes.`}
          prov="public"
        >
          <div style={{ maxHeight: 640, overflowY: "auto", paddingRight: 6 }}>
            {all.map((t) => (
              <BarRow
                key={t.id}
                label={t.label}
                value={t.count}
                max={all[0]?.count ?? 1}
                href={signalHref(t.id, from)}
                sub={`${t.owner_label} · ${fmtPct(t.share_negative)} negative`}
                color={negColor(t.share_negative)}
              />
            ))}
          </div>
        </Tile>
      </div>

      <Tile
        id="top10"
        title="Top ten themes and their weekly volume"
        sub="Items per week from full-window sources (X, Reddit, forums, store exports with full coverage)"
        prov="public"
      >
        <div style={cols(3, 300, 12)}>
          {top.slice(0, 6).map((t) => (
            <Link
              key={t.id}
              href={signalHref(t.id, from)}
              style={{
                textDecoration: "none",
                color: "inherit",
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
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14.5, fontWeight: 650 }}>
                  {t.label}
                </span>
                <span style={{ fontFamily: MONO, fontWeight: 700 }}>
                  {fmt(t.count)}
                </span>
              </div>
              <WeeklyBars data={t.weekly} height={130} />
            </Link>
          ))}
        </div>
        <BaselineCaption>
          Dashed line: weekly average in the window. Trend within window; no
          earlier baseline for social sources.
        </BaselineCaption>
      </Tile>

      <Tile id="compare" prov="public">
        <div
          data-testid="icici-strip"
          style={{ fontSize: 14, color: C.textMut }}
        >
          {b.meta.icici_available
            ? "Where customers compare us: see the competitor strip."
            : "Competitor view: available on request."}
        </div>
      </Tile>
    </div>
  );
}
