"use client";

/**
 * S-RISK · Conduct and complaints horizon: the calendar with countdowns; card D in full (readiness checklist,
 * distribution-ground complaints, allegation-labelled public posts); the complaint register (disclosed figures, the
 * weekly internal register, what the IO's quarterly pattern analysis would cover); the Ombudsman watch; penalties;
 * public escalation language. No judgement on past management.
 */

import { fmtDate } from "@/lib/indusind-v1/format";
import type {
  Card,
  Common,
  Fig as FigT,
  OmbudsmanBlock,
} from "@/lib/indusind-v1/types";
import { OmbudsmanWatch } from "./Ombudsman";
import { CardVoiceBlock, Thin } from "./PublicVoice";
import {
  C,
  Chip,
  cols,
  Fig,
  Info,
  Label,
  MutedNote,
  OpenLink,
  ShareBar,
  Table,
  Tile,
} from "./primitives";
import { FigRow, TitleLine } from "./SignalCards";

type WeeklyRow = {
  end: string;
  received_index: number;
  closed_index: number;
  pending_weeks: number;
  over_30: number;
  rejected: number;
  reopened: number;
  referred_to_io: number;
};

export type RiskSlice = {
  calendar: {
    id: string;
    label: string;
    date: FigT;
    countdown: string | null;
  }[];
  register: FigT[];
  penalties: FigT[];
  penalty_note: string;
  checklist: { item: string; status: string }[];

  card_d: Card;
  win: {
    weekly: { id: string; layer: "L3"; rows: WeeklyRow[] };
    pattern: Record<"product" | "category" | "group" | "geography", FigT[]>;
    ombudsman: OmbudsmanBlock;
    distribution: FigT[];
    public: PublicRow[];
    public_period: string;
  };
  windowLabel: string;
};

type PublicRow = {
  business: string;
} & Record<
  | "escalation_language"
  | "mis_selling_allegation"
  | "recovery_conduct_allegation",
  FigT & { thin: boolean }
>;

const PUBLIC_COLS = [
  { id: "escalation_language", label: "Escalation language" },
  {
    id: "mis_selling_allegation",
    label: "Posts alleging mis-selling or bundling (public, unverified)",
  },
  {
    id: "recovery_conduct_allegation",
    label: "Posts alleging recovery-agent conduct (public, unverified)",
  },
] as const;

const BUSINESS_LABEL: Record<string, string> = {
  deposits: "Deposits",
  vehicle: "Vehicle finance",
  micro: "Micro loans and rural",
  cards: "Cards",
  personal: "Personal loans",
  digital: "Digital",
};

const PATTERN = [
  { id: "product", label: "Product" },
  { id: "category", label: "Category" },
  { id: "group", label: "Customer group" },
  { id: "geography", label: "Geography" },
] as const;

const STATUS_COLOR: Record<string, string> = {
  "Not started": C.amber,
  "In progress": C.cyan,
  Done: C.green,
};

function Bars({ figs }: { figs: FigT[] }) {
  const max = Math.max(...figs.map((f) => f.value ?? 0), 1);
  return (
    <div>
      {figs.map((f) => (
        <ShareBar key={f.id} label={f.label} f={f} max={max} />
      ))}
    </div>
  );
}

export function RiskView({ r, common }: { r: RiskSlice; common: Common }) {
  const d = r.card_d;
  const a = d.action;
  // The weekly register always shows the last 13 weeks to the freeze, most recent first, whatever the window.
  const rows = [...r.win.weekly.rows].reverse();
  return (
    <>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 750 }}>
          Conduct and complaints
        </h2>
        <div style={{ fontSize: 13, color: C.textMut }}>
          Dated rules, complaints, Ombudsman · {r.windowLabel}
        </div>
      </div>

      <Tile title="Calendar" sub="Dated obligations" layers={["L1"]}>
        <Table
          testid="calendar"
          head={["Obligation", "Date", "Days to go"]}
          align={["left", "left", "left"]}
          rows={r.calendar.map((c) => ({
            key: c.id,
            cells: [
              c.label,
              <Fig key="d" f={c.date} />,
              <Fig key="c" f={{ ...c.date, display: c.countdown ?? "—" }} />,
            ],
          }))}
        />
      </Tile>

      <Tile
        title={<TitleLine parts={d.title_parts} />}
        sub="The one risk card"
        layers={["L1", "L2", "L3"]}
        tone="amber"
      >
        <div style={{ ...cols(2, 360, 16), alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Label>What moved</Label>
            {d.what.map((f) => (
              <FigRow key={f.id} f={f} />
            ))}
            <Label>Exposure</Label>
            <div style={{ fontSize: 14, color: C.text }}>{d.exposure}</div>
            <Label>Peers</Label>
            <FigRow
              label="Peer conduct penalties"
              f={{
                id: "held",
                layer: "L1",
                value: null,
                display: common.pending,
                pending: true,
              }}
            />
            <Label>Posts alleging mis-selling or bundling</Label>
            <CardVoiceBlock v={d.voice} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Label>
              Complaints in distribution-related grounds, by product
              <Info text={d.inside.text} />
            </Label>
            <Bars figs={r.win.distribution} />
            <Label>Readiness checklist · illustrative</Label>
            {r.checklist.map((c) => (
              <div
                key={c.item}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  fontSize: 13.5,
                  color: C.textSec,
                }}
              >
                <span>{c.item}</span>
                <span
                  style={{
                    color: STATUS_COLOR[c.status] ?? C.textSec,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 13.5,
            color: C.textSec,
          }}
        >
          <div>
            <strong style={{ color: C.text }}>Drafted action:</strong> {a.scope}
            . {a.ask}.
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Chip label="Owner" color={C.violet}>
              {d.owner}
            </Chip>
            <Chip label="With" color={C.violet}>
              {d.with}
            </Chip>
            <Chip label="Review" color={C.cyan}>
              {fmtDate(a.review_date)}
            </Chip>
            <Chip label="Status" color={C.amber}>
              {a.status}
            </Chip>
            <OpenLink href="/role-based/indusind_bank/customer-pulse/approvals">
              Approvals
            </OpenLink>
          </div>
        </div>
      </Tile>

      <Tile
        title="Complaint register"
        sub="Disclosed, then weekly internal"
        layers={["L1", "L3"]}
        right={
          <Chip label="Owner" color={C.violet}>
            Principal Nodal Officer, with the Chief Compliance Officer; IO
            informed
          </Chip>
        }
      >
        <div style={cols(2, 300, 12)}>
          {r.register.map((f) => (
            <FigRow key={f.id} f={f} />
          ))}
        </div>
        <MutedNote>
          {(r.register[0]?.note ?? "").replace(/^./, (x) => x.toUpperCase())}.
        </MutedNote>
        <Label>
          Weekly, inside the bank · last 13 weeks
          <Info text={common.defs.weekly} />
        </Label>
        <div data-register={r.win.weekly.id} data-layer="L3">
          <Table
            testid="weekly-register"
            head={[
              "Week to",
              "Received",
              "Closed",
              "Pending, weeks",
              "Over 30",
              "Rejected",
              "Reopened",
              "To the IO",
            ]}
            align={[
              "left",
              "right",
              "right",
              "right",
              "right",
              "right",
              "right",
              "right",
            ]}
            rows={rows.map((w) => ({
              key: w.end,
              cells: [
                fmtDate(w.end),
                w.received_index,
                w.closed_index,
                w.pending_weeks.toFixed(1),
                `${w.over_30.toFixed(1)}%`,
                `${w.rejected.toFixed(1)}%`,
                `${w.reopened.toFixed(1)}%`,
                `${w.referred_to_io.toFixed(1)}%`,
              ],
            }))}
          />
        </div>
      </Tile>

      <Tile
        title="What the IO's quarterly pattern analysis would cover"
        sub="Shares of the window's complaints"
        layers={["L3"]}
        info={common.defs.pattern}
      >
        <div style={{ ...cols(4, 240, 16), alignItems: "start" }}>
          {PATTERN.map((g) => (
            <div key={g.id}>
              <Label>{g.label}</Label>
              <Bars figs={r.win.pattern[g.id]} />
            </div>
          ))}
        </div>
      </Tile>

      <OmbudsmanWatch
        o={r.win.ombudsman}
        def={common.defs.ombudsman}
        expanded
        title="Ombudsman exposure"
      />

      <div style={{ ...cols(2, 380, 12), alignItems: "start" }}>
        <Tile title="Penalties" sub="Dated, cited Directions" layers={["L1"]}>
          {r.penalties.map((f) => (
            <FigRow key={f.id} f={f} />
          ))}
          <div style={{ fontSize: 13.5, color: C.text }}>
            {r.penalty_note} ({r.penalties.map((f) => f.period).join(" and ")}).
          </div>
          <MutedNote>
            Suggested: one review of deposit-rate controls, owned by the Chief
            Compliance Officer.
          </MutedNote>
        </Tile>
        <Tile
          title="Public escalation language"
          sub={`By product, ${r.win.public_period}`}
          layers={["L2"]}
          info={common.defs.escalation_public}
        >
          {r.win.public.every((p) => PUBLIC_COLS.every((c) => p[c.id].thin)) ? (
            <div
              data-testid="public-by-product"
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              {PUBLIC_COLS.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    fontSize: 13,
                    color: C.textSec,
                  }}
                >
                  <span>{c.label}</span>
                  <Thin text={common.l2_not_enough} />
                </div>
              ))}
            </div>
          ) : (
            <Table
              testid="public-by-product"
              head={["Business", ...PUBLIC_COLS.map((c) => c.label)]}
              align={["left", "right", "right", "right"]}
              rows={r.win.public.map((p) => ({
                key: p.business,
                cells: [
                  BUSINESS_LABEL[p.business] ?? p.business,
                  ...PUBLIC_COLS.map((c) =>
                    p[c.id].thin ? (
                      <Thin key={c.id} text={common.l2_not_enough} />
                    ) : (
                      <Fig key={c.id} f={p[c.id]} />
                    ),
                  ),
                ],
              }))}
            />
          )}
        </Tile>
      </div>
    </>
  );
}
