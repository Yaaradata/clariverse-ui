"use client";

import Link from "next/link";

import { promiseAnswer } from "@/lib/hdfc-v3/copy";
import { fmt, fmtPct, fmtSigned } from "@/lib/hdfc-v3/format";
import { signalHref, themeMap } from "@/lib/hdfc-v3/selectors";
import type { Bundle, View } from "@/lib/hdfc-v3/types";
import {
  ActionChip,
  AnswerLine,
  BarRow,
  BaselineCaption,
  C,
  Kpi,
  MONO,
  MutedNote,
  OWNER_LABEL,
  PAIRS,
  RungChip,
  rungColor,
  SPLIT,
  SPLIT3,
  Table,
  Tile,
  WeeklyBars,
} from "./primitives";
import { useFrom } from "./Shell";

type Internal = {
  promise_ledger_ageing: {
    request_type: string;
    open_cases: number;
    beyond_tat: number;
    beyond_tat_share: number;
  }[];
  ladder: { rung: string; count: number }[];
  action_triage: { total: number; rows: { action: string; count: number }[] };
  closure: { closure_requests: number; saved: number; save_rate: number };
};
type Joined = {
  disputes: {
    beyond_sla_total: number;
    drivers: { driver: string; cases: number }[];
    aged_cases: { band: string; cases: number }[];
    funnel: { stage: string; count: number }[];
    public_dispute_items: number;
  };
};

export const REQUEST_LABEL: Record<string, string> = {
  card_delivery: "Card dispatch and delivery",
  refund: "Refunds",
  reversal: "Failed-transaction reversal",
  dispute: "Dispute resolution",
  closure: "Card, account and loan closure",
  loan_disbursal: "Loan processing and disbursal",
  credit_report: "Credit-information correction",
  kyc: "KYC and profile updates",
  other: "Other service requests",
};
const ACTION_FOR: Record<string, string> = {
  card_delivery: "Notify proactively",
  refund: "Notify proactively",
  reversal: "Re-promise",
  dispute: "Update and close",
  closure: "Re-promise",
  loan_disbursal: "Notify proactively",
  credit_report: "Re-promise",
  kyc: "Update and close",
  other: "Route with evidence",
};
const SERVICE_GROUPS = new Set(["Service", "Payments", "Loans", "Cards"]);

export function ServicePromiseView({ b }: { b: Bundle }) {
  const from: View = useFrom();
  const tm = themeMap(b);
  const it = b.internal as unknown as Internal;
  const jn = b.joined as unknown as Joined;
  const sig = b.signals;
  const ageing = Object.fromEntries(
    it.promise_ledger_ageing.map((r) => [r.request_type, r]),
  );
  const ledger = [...sig.promise_by_request_type].sort(
    (a, c) =>
      Number(a.request_type === "other") - Number(c.request_type === "other"),
  );
  const pb = sig.flags.promise_break;
  const st = sig.flags.status_seeking;
  const esc = sig.flags.escalation_intent;
  const topFailures = b.themes.themes
    .filter((t) => SERVICE_GROUPS.has(t.group) && t.sentiment.negative > 0)
    .sort((a, c) => c.sentiment.negative - a.sentiment.negative)
    .slice(0, 6);
  const funnel = jn.disputes.funnel;
  const ladderPublic = sig.ladder_public;
  const cure = sig.cure_watch;
  const tg = sig.transparency_gap;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov={["public", "internal"]}>
        <AnswerLine sub="Promise breaks and status-seeking are heard in public voice (live). Internal ageing, the internal ladder rungs and dispute feeds are illustrative until discovery.">
          {promiseAnswer(b)}
        </AnswerLine>
      </Tile>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 14,
        }}
      >
        <Tile
          id="ledger"
          title="Promise ledger"
          sub="Where committed timelines snapped, detected from what customers say, with the likely owner and next action."
          prov={["public", "internal"]}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 8,
            }}
          >
            <Kpi
              label="Promise breaks heard"
              value={fmt(pb.count)}
              sub={`${fmtSigned(pb.trend.change_pct)} 2nd half vs 1st`}
              href="#ledger-table"
              tone="red"
            />
            <Kpi
              label="Asking where it is"
              value={fmt(st.count)}
              sub={`${fmtPct(tg.share)} of posts`}
              href="#transparency"
              tone="amber"
            />
            <Kpi
              label="Escalation language"
              value={fmt(esc.count)}
              sub="RBI, ombudsman, court"
              href="#ladder"
              tone="red"
            />
            <Kpi
              label="Beyond TAT (internal)"
              value={fmt(
                it.promise_ledger_ageing.reduce((s, r) => s + r.beyond_tat, 0),
              )}
              sub="illustrative"
              tone="violet"
            />
          </div>
          <div id="ledger-table">
            <Table
              head={[
                "Promise",
                "Stated or regulatory TAT",
                "Breaches heard",
                "Asking status",
                "Repeat",
                "Open · beyond TAT",
                "Owner",
                "Action",
              ]}
              align={[
                "left",
                "left",
                "right",
                "right",
                "right",
                "right",
                "left",
                "left",
              ]}
              rows={ledger.map((p) => {
                const a = ageing[p.request_type];
                const theme = tm[p.top_theme];
                return [
                  theme ? (
                    <Link
                      key="l"
                      href={signalHref(theme.id, from)}
                      style={{ color: C.text }}
                    >
                      {REQUEST_LABEL[p.request_type] ?? p.request_type}
                    </Link>
                  ) : (
                    (REQUEST_LABEL[p.request_type] ?? p.request_type)
                  ),
                  <span key="t" style={{ color: C.textMut }}>
                    To verify
                  </span>,
                  <span key="c" style={{ color: C.red, fontWeight: 700 }}>
                    {fmt(p.count)}
                  </span>,
                  <span key="s" style={{ color: C.amber }}>
                    {fmt(p.status_seeking)}
                  </span>,
                  fmtPct(p.repeat_share),
                  a ? `${fmt(a.open_cases)} · ${fmt(a.beyond_tat)}` : "—",
                  OWNER_LABEL[p.owner] ?? p.owner,
                  ACTION_FOR[p.request_type] ?? "Route with evidence",
                ];
              })}
            />
          </div>
          <MutedNote>
            TATs are shown only after verification against the current RBI
            instrument and the bank&apos;s own commitments (B2 §7). Breaches,
            status-seeking and repeat are public voice; open cases and
            beyond-TAT are illustrative.
          </MutedNote>
        </Tile>
      </div>

      <Tile
        id="ladder"
        title="Escalation ladder"
        sub="Hear it on the first rung. Voice → Repeat → Grievance → MD's office → IO → RBI Ombudsman → Public."
        prov={["public", "internal"]}
        tone="red"
      >
        <div style={SPLIT3}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {it.ladder.map((r) => (
              <BarRow
                key={r.rung}
                label={
                  <span>
                    {r.rung}{" "}
                    <span style={{ color: C.textMut, fontSize: 12 }}>
                      · internal, illustrative
                    </span>
                  </span>
                }
                value={r.count}
                max={it.ladder[0].count}
                color={rungColor(r.rung)}
              />
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                borderTop: `1px solid ${C.border}`,
                paddingTop: 8,
                fontSize: 14,
              }}
            >
              <span>
                Public{" "}
                <span style={{ color: C.textMut, fontSize: 12 }}>
                  · public posts with escalation language, live
                </span>
              </span>
              <span style={{ fontFamily: MONO, fontWeight: 700, color: C.red }}>
                {fmt(ladderPublic.public_posts_with_escalation)}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontSize: 13,
                color: C.textMut,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Escalation language in public voice, by target
            </div>
            <Table
              head={["Target", "Rung", "Posts"]}
              align={["left", "left", "right"]}
              rows={sig.escalation_by_target.map((e) => [
                {
                  rbi: "RBI (named or tagged)",
                  rbi_ombudsman: "RBI Ombudsman",
                  grievance: "Grievance or nodal officer",
                  legal: "Legal action",
                  consumer_court: "Consumer court or helpline",
                  ministers: "Ministers tagged",
                  repeat: "Complaint number or third time",
                  md_office: "MD or CEO",
                  internal_ombudsman: "Internal Ombudsman",
                }[e.target] ?? e.target,
                e.rung,
                fmt(e.count),
              ])}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontSize: 13,
                color: C.textMut,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Climb risk: themes closest to the ombudsman rung
            </div>
            {ladderPublic.climb_themes.slice(0, 5).map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Link
                  href={signalHref(c.id, from)}
                  style={{ color: C.textSec, fontSize: 14 }}
                >
                  {c.label}
                </Link>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {tm[c.id] ? <RungChip rung={tm[c.id].rung} /> : null}
                  <span style={{ fontFamily: MONO, fontWeight: 700 }}>
                    {fmt(c.count)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Tile>

      <div style={PAIRS}>
        <Tile
          id="closure"
          title="Closure intent"
          sub="Customers saying they will close, or have closed, a card or account"
          prov={["public", "internal"]}
          tone="red"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: 8,
            }}
          >
            <Kpi
              label="Closure intent (public)"
              value={fmt(sig.closure_intent.count)}
              sub="posts and reviews"
              tone="red"
            />
            <Kpi
              label="Save rate (internal)"
              value={fmtPct(it.closure.save_rate)}
              sub={`${fmt(it.closure.saved)} of ${fmt(it.closure.closure_requests)} requests · illustrative`}
              tone="green"
            />
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.textMut,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            What drives it
          </div>
          {sig.closure_intent.drivers
            .filter((d) => d.id !== "general_dissatisfaction")
            .slice(0, 5)
            .map((d) => (
              <BarRow
                key={d.id}
                label={d.label}
                value={d.count}
                max={sig.closure_intent.drivers[0]?.count ?? 1}
                href={signalHref(d.id, from)}
                color={C.red}
              />
            ))}
        </Tile>

        <Tile
          id="cure"
          title="Cure watch"
          sub="Posts after a decline, failed payment or block that a proactive message or auto-reversal should have handled"
          prov="public"
          tone="amber"
        >
          <Kpi
            label="Cure did not land"
            value={fmt(cure.count)}
            sub="customers still had to chase"
            tone="amber"
          />
          {cure.by_theme.slice(0, 4).map((c) => (
            <BarRow
              key={c.id}
              label={c.label}
              value={c.count}
              max={cure.by_theme[0]?.count ?? 1}
              href={signalHref(c.id, from)}
              color={C.amber}
            />
          ))}
          {cure.exemplars
            .map((id) => b.evidence[id])
            .filter(Boolean)
            .slice(0, 2)
            .map((e) => (
              <Link
                key={e.id}
                href={`${signalHref(e.themes[0], from)}#ev-${encodeURIComponent(e.id)}`}
                style={{
                  fontSize: 13.5,
                  color: C.textSec,
                  borderLeft: `2px solid ${C.amber}`,
                  paddingLeft: 10,
                  textDecoration: "none",
                }}
              >
                {e.summary}{" "}
                <span style={{ color: C.textMut }}>({e.source_label})</span>
              </Link>
            ))}
        </Tile>
      </div>

      <Tile
        id="transparency"
        title="Transparency gap"
        sub="Customers asking “where is my…”: avoidable demand. Each point of reduction is capacity released."
        prov="public"
        tone="amber"
      >
        <div style={SPLIT}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Kpi
              label="Status-seeking posts"
              value={fmt(tg.count)}
              sub={`${fmtPct(tg.share)} of on-topic posts`}
              tone="amber"
            />
            {tg.by_request_type.slice(0, 6).map((r) => (
              <BarRow
                key={r.request_type}
                label={REQUEST_LABEL[r.request_type] ?? r.request_type}
                value={r.count}
                max={tg.by_request_type[0]?.count ?? 1}
                color={C.amber}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <WeeklyBars data={st.weekly} height={300} yLabel="Posts per week" />
            <BaselineCaption>
              Trend within window: {fmtSigned(st.trend.change_pct)} second half
              vs first half, as a share of posts.
            </BaselineCaption>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <ActionChip action="Notify proactively" />
              <span style={{ fontSize: 12.5, color: C.textMut }}>
                Push stage updates in app, WhatsApp and SMS.
              </span>
            </div>
          </div>
        </div>
      </Tile>

      <Tile
        id="disputes"
        title="Why disputes breach SLA"
        sub={`${fmt(jn.disputes.beyond_sla_total)} disputes beyond SLA, by driver and by age. Public voice: ${fmt(jn.disputes.public_dispute_items)} posts about disputes this window.`}
        prov="joined"
      >
        <div style={SPLIT}>
          <div>
            <div
              style={{
                fontSize: 13,
                color: C.textMut,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: 4,
              }}
            >
              Root cause
            </div>
            {jn.disputes.drivers.map((d) => (
              <BarRow
                key={d.driver}
                label={d.driver}
                value={d.cases}
                max={jn.disputes.drivers[0].cases}
                color={C.amber}
              />
            ))}
            <div style={{ fontSize: 13, color: C.textSec, marginTop: 6 }}>
              Total beyond SLA:{" "}
              <strong style={{ fontFamily: MONO }}>
                {fmt(jn.disputes.drivers.reduce((s, d) => s + d.cases, 0))}
              </strong>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                color: C.textMut,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: 4,
              }}
            >
              Aged case watchlist
            </div>
            <Table
              head={["Age", "Cases"]}
              align={["left", "right"]}
              rows={jn.disputes.aged_cases.map((a) => [a.band, fmt(a.cases)])}
            />
          </div>
        </div>
        <MutedNote>
          Needs dispute-platform feeds. Illustrative until discovery.
        </MutedNote>
      </Tile>

      <div style={PAIRS}>
        <Tile
          id="failures"
          title="Top service failures"
          sub="Service, payments, loans and cards themes with the most negative public items"
          prov="public"
          tone="red"
        >
          {topFailures.map((t) => (
            <BarRow
              key={t.id}
              label={t.label}
              value={t.sentiment.negative}
              max={topFailures[0]?.sentiment.negative ?? 1}
              href={signalHref(t.id, from)}
              color={C.red}
              sub={`${t.owner_label} · ${fmt(t.repeat_count)} repeat · ${fmt(t.escalation_count)} escalation`}
            />
          ))}
        </Tile>

        <Tile
          id="funnel"
          title="Dispute recovery funnel"
          sub="Each stage is a subset of the one before"
          prov="joined"
        >
          {funnel.map((f, i) => (
            <BarRow
              key={f.stage}
              label={f.stage}
              value={f.count}
              max={funnel[0].count}
              color={C.violet}
              sub={
                i > 0
                  ? `${fmtPct((100 * f.count) / funnel[i - 1].count)} of previous stage`
                  : undefined
              }
            />
          ))}
        </Tile>
      </div>

      <Tile
        id="triage"
        title="Action triage"
        sub={`${fmt(it.action_triage.total)} routed items this window, by recommended action`}
        prov="internal"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 8,
          }}
        >
          {it.action_triage.rows.map((r) => (
            <Kpi
              key={r.action}
              label={r.action}
              value={fmt(r.count)}
              sub={`${fmtPct((100 * r.count) / it.action_triage.total)} of routed items`}
            />
          ))}
        </div>
        <MutedNote>
          Recommendations are routed into the owner&apos;s system (CRM, work
          queues). LisN never executes them.
        </MutedNote>
      </Tile>
    </div>
  );
}
