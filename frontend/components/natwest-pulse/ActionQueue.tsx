/**
 * NatWest Group · S-AGENTS AI-agent outcomes (re-bound from the action queue): the Fraud Triage Agent and AI complaint
 * letters, each followed to repeat contact and Ombudsman referral, beside the human lane. Internal and illustrative.
 * LisN reports outcomes; it does not run or approve either agent.
 */

import { type AgentsBlock, fmtN, fmtP } from "@/lib/natwest-pulse/nw";
import { C, MONO, PAIRS, Table, Tile } from "./primitives";

function rows(rs: string[][]) {
  return rs.map((r) =>
    r.map((c, i) => (
      <span
        key={`${r[0]}-${i}`}
        style={{
          fontFamily: i ? MONO : undefined,
          color: i ? C.textSec : C.text,
        }}
      >
        {c}
      </span>
    )),
  );
}

export function AgentOutcomes({ agents }: { agents: AgentsBlock }) {
  const [a, h] = agents.triage;
  const [ai, hw] = agents.letters;
  return (
    <div style={PAIRS}>
      <Tile
        title="Fraud Triage Agent"
        sub="Alerts followed to outcome"
        prov={["internal", "joined"]}
        accent
      >
        <Table
          head={["", "Agent", "Analyst"]}
          align={["left", "right", "right"]}
          rows={rows([
            ["Alerts triaged", fmtN(a.triaged), fmtN(h.triaged)],
            ["Released", fmtN(a.released), fmtN(h.released)],
            ["Held for review", fmtN(a.held), fmtN(h.held)],
            ["Blocked", fmtN(a.blocked), fmtN(h.blocked)],
            [
              "Repeat contact within 7 days",
              fmtP(a.repeat_pct),
              fmtP(h.repeat_pct),
            ],
            [
              "Complaints per 10,000 alerts",
              a.complaints_per_10k?.toFixed(1) ?? "—",
              h.complaints_per_10k?.toFixed(1) ?? "—",
            ],
            ["Referred to the Ombudsman Service", fmtN(a.fos), fmtN(h.fos)],
          ])}
        />
        <div style={{ fontSize: 12.5, color: C.textMut }}>
          Repeat is of released and held alerts. Needs fraud and contact records
          joined.
        </div>
      </Tile>
      <Tile
        title="AI complaint letters"
        sub="Final responses since 1 September"
        prov={["internal", "joined"]}
        accent
      >
        <Table
          head={["", "AI-drafted", "Handler-written"]}
          align={["left", "right", "right"]}
          rows={rows([
            ["Final responses", fmtN(ai.letters), fmtN(hw.letters)],
            ["Back within 14 days", fmtP(ai.repeat_pct), fmtP(hw.repeat_pct)],
            [
              "Referred to the Ombudsman Service",
              fmtN(ai.referred),
              fmtN(hw.referred),
            ],
            [
              "Referral rate",
              fmtP(ai.referred_pct, 2),
              fmtP(hw.referred_pct, 2),
            ],
          ])}
        />
        <div style={{ fontSize: 12.5, color: C.textMut }}>
          Every AI draft is approved by a handler before it is sent.
        </div>
      </Tile>
    </div>
  );
}
