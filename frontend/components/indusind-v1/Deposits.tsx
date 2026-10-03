"use client";

/**
 * S-DEP · Deposits, from the earlier LisN product-module template. What (verified balances at 31 Mar and 30 Jun, then
 * indexed flows only) · is it real · where (slab × region × branch type, illustrative) · why, from outside · how high ·
 * owner and action · evidence. Sub-tabs: cost of deposits, retail franchise.
 */

import { useState } from "react";

import { fmtDate, fmtStamp } from "@/lib/indusind-v1/format";
import type {
  Action,
  CardDate,
  CardVoice,
  Common,
  Fig as FigT,
  Sens,
  Trend,
} from "@/lib/indusind-v1/types";
import { AreaChart, trendPoints } from "./charts";
import { CardDateList } from "./Peers";
import { CardVoiceBlock } from "./PublicVoice";
import {
  C,
  Chip,
  cols,
  Fig,
  Kpi,
  Label,
  MONO,
  MutedNote,
  OpenLink,
  SourceTag,
  Table,
  Tile,
  tint,
} from "./primitives";
import { FigRow, SensBlock } from "./SignalCards";

type Opt = { id: string; label: string };
type Flow = FigT & { trend: Trend };

export type DepositsSlice = {
  balances: Record<string, Record<"CA" | "SA" | "TD", FigT>>;
  casa: FigT[];
  how_high: Sens[];
  cost: {
    own: FigT[];
    peers: FigT[];
    funds: FigT;
    decomposition: FigT[];
    rate_table: { loaded: boolean; text: string };
  };
  franchise: FigT[];
  why_cards: CardDate[];
  action: Action;
  win: {
    flows: Record<"CA" | "SA" | "TD", { inflow: Flow; outflow: Flow }>;
    heatmap: (FigT & { slab: string; region: string; branch_type: string })[];
    top: FigT[];
    premature: FigT;
    new_money: FigT;
    why: CardVoice;
  };
  slabs: Opt[];
  regions: Opt[];
  branch_types: Opt[];
  windowLabel: string;
};

const PRODUCTS = [
  { id: "CA", label: "Current accounts" },
  { id: "SA", label: "Savings" },
  { id: "TD", label: "Term deposits" },
] as const;

function Heatmap({ d }: { d: DepositsSlice }) {
  const cells = d.win.heatmap;
  const max = Math.max(...cells.map((c) => c.value ?? 0), 0.01);
  const cell = (slab: string, bt: string, rg: string) =>
    cells.find(
      (c) => c.slab === slab && c.branch_type === bt && c.region === rg,
    );
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        data-testid="heatmap"
        className="ind-heat"
        style={{
          borderCollapse: "separate",
          borderSpacing: 3,
          fontSize: 12.5,
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th
              style={{ textAlign: "left", color: C.textMut, fontWeight: 600 }}
            >
              Slab · branch type
            </th>
            {d.regions.map((r) => (
              <th key={r.id} style={{ color: C.textMut, fontWeight: 600 }}>
                {r.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {d.slabs.flatMap((s) =>
            d.branch_types.map((b, bi) => (
              <tr key={s.id + b.id}>
                <td
                  style={{
                    color: C.textSec,
                    whiteSpace: "nowrap",
                    paddingRight: 8,
                    borderTop: bi === 0 ? `1px solid ${C.border}` : undefined,
                  }}
                >
                  {bi === 0 ? (
                    <strong style={{ color: C.text }}>{s.label}</strong>
                  ) : null}
                  {bi === 0 ? " · " : ""}
                  {b.label}
                </td>
                {d.regions.map((r) => {
                  const c = cell(s.id, b.id, r.id);
                  const v = c?.value ?? 0;
                  return (
                    <td
                      key={r.id}
                      data-register={c?.id}
                      title={
                        c
                          ? `${s.label} · ${r.label} · ${b.label}: ${c.display}`
                          : undefined
                      }
                      style={{
                        textAlign: "center",
                        fontFamily: MONO,
                        padding: "4px 6px",
                        borderRadius: 4,
                        background: tint(C.cyan, 0.06 + (0.6 * v) / max),
                        color: v / max > 0.55 ? C.text : C.textSec,
                      }}
                    >
                      {c?.display ?? "—"}
                    </td>
                  );
                })}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}

function ActionBlock({ a }: { a: Action }) {
  return (
    <Tile
      title="Owner and action"
      sub="Approval gate"
      layers={["L3"]}
      tone="violet"
    >
      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          gap: "4px 12px",
          fontSize: 13.5,
        }}
      >
        <dt style={{ color: C.textMut }}>Owner</dt>
        <dd style={{ margin: 0, color: C.text }}>{a.owner_role}</dd>
        <dt style={{ color: C.textMut }}>Scope</dt>
        <dd style={{ margin: 0, color: C.text }}>{a.scope}</dd>
        <dt style={{ color: C.textMut }}>Ask</dt>
        <dd style={{ margin: 0, color: C.text }}>{a.ask}</dd>
        <dt style={{ color: C.textMut }}>Cost cap</dt>
        <dd style={{ margin: 0, color: C.text }}>
          {a.cost_cap_note ?? "None"}
        </dd>
        <dt style={{ color: C.textMut }}>Success</dt>
        <dd style={{ margin: 0, color: C.text }}>{a.success_measure}</dd>
        <dt style={{ color: C.textMut }}>Review</dt>
        <dd style={{ margin: 0, color: C.text }}>{fmtDate(a.review_date)}</dd>
      </dl>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Chip label="Status" color={C.amber}>
          {a.status}
        </Chip>
        <Chip label="Approver" color={C.violet}>
          {a.approver_role}
        </Chip>
        <OpenLink href="/role-based/indusind_bank/customer-pulse/approvals">
          Approvals
        </OpenLink>
      </div>
      <MutedNote>
        Drafted from the evidence of {fmtStamp(a.evidence_version)} IST. On
        approval the audit line records who, when and that evidence version.
        Nothing is sent or executed.
      </MutedNote>
    </Tile>
  );
}

const TABS = [
  { id: "flows", label: "Savings and flows" },
  { id: "cost", label: "Cost of deposits" },
  { id: "franchise", label: "Retail franchise" },
] as const;

export function DepositsView({
  d,
  common,
}: {
  d: DepositsSlice;
  common: Common;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("flows");
  const sa = trendPoints(d.win.flows.SA.outflow.trend);
  const dates = Object.keys(d.balances).sort();
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 750 }}>Deposits</h2>
          <div style={{ fontSize: 13, color: C.textMut }}>
            Balances, flows and cost · {d.windowLabel}
          </div>
        </div>
        <div
          role="tablist"
          aria-label="Deposits views"
          style={{ display: "flex", gap: 4, flexWrap: "wrap" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              style={{
                fontSize: 13,
                fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? C.text : C.textSec,
                background: tab === t.id ? C.cardAlt : "transparent",
                border: `1px solid ${tab === t.id ? C.border : "transparent"}`,
                borderRadius: 8,
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "flows" ? (
        <>
          <div style={cols(2, 380, 12)}>
            <Tile
              title="What"
              sub="Verified period-end balances"
              layers={["L1"]}
            >
              <Table
                testid="balances"
                head={["", ...dates.map((x) => fmtDate(x))]}
                align={["left", "right", "right"]}
                rows={[
                  ...PRODUCTS.map((p) => ({
                    key: p.id,
                    cells: [
                      p.label,
                      ...dates.map((x) => (
                        <Fig key={x} f={d.balances[x][p.id]} />
                      )),
                    ],
                  })),
                  {
                    key: "casa",
                    cells: [
                      "CASA ratio",
                      ...d.casa.map((f) => <Fig key={f.id} f={f} />),
                    ],
                  },
                ]}
              />
              <MutedNote>
                No balance is shown after the last verified quarter-end. After
                it, flows only, indexed.
              </MutedNote>
            </Tile>
            <Tile
              title="Flows since the quarter-end"
              sub="Indexed to the Q1 weekly average"
              layers={["L3"]}
              info={common.defs.outflow}
            >
              <Table
                testid="flows"
                head={["", "Inflow", "Outflow"]}
                align={["left", "right", "right"]}
                rows={PRODUCTS.map((p) => ({
                  key: p.id,
                  cells: [
                    p.label,
                    <Fig key="i" f={d.win.flows[p.id].inflow} />,
                    <Fig key="o" f={d.win.flows[p.id].outflow} />,
                  ],
                }))}
              />
              <Label>Savings outflow, weekly</Label>
              <div style={{ position: "relative", height: 70 }}>
                <AreaChart
                  id="dep-sa-outflow"
                  values={sa.values}
                  color={C.cyan}
                  height="100%"
                  title="Savings outflow, weekly index"
                  points={sa.points}
                />
              </div>
            </Tile>
          </div>

          <Tile title="Is it real" sub="Against the baseline" layers={["L3"]}>
            <div style={{ fontSize: 14, color: C.textSec, lineHeight: 1.55 }}>
              Each week against its Q1 average; one high month-end week is not a
              trend.
            </div>
          </Tile>

          <Tile
            title="Where"
            sub="Slab, region and branch type"
            layers={["L3"]}
            info={common.defs.heatmap}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Label>Top three clusters</Label>
              {d.win.top.map((f) => (
                <Chip key={f.id} label={f.label ?? ""}>
                  <Fig f={f} />
                </Chip>
              ))}
            </div>
            <Heatmap d={d} />
            <MutedNote>Illustrative. Your data shows the real split.</MutedNote>
          </Tile>

          <div style={{ ...cols(2, 380, 12), alignItems: "start" }}>
            <Tile
              title="Why, from outside"
              sub="Same weeks"
              layers={["L2", "L1"]}
            >
              <CardVoiceBlock v={d.win.why} />
              {d.why_cards.length ? (
                <>
                  <Label>Peer card dates in the same weeks</Label>
                  <CardDateList items={d.why_cards} />
                </>
              ) : null}
            </Tile>
            <Tile
              title="How high"
              sub="Arithmetic on the book"
              layers={["L1"]}
              info={common.defs.sensitivity}
            >
              {d.how_high.map((s) => (
                <SensBlock key={s.id} s={s} />
              ))}
              <MutedNote>{common.sensitivity_footer}</MutedNote>
            </Tile>
          </div>

          <ActionBlock a={d.action} />
        </>
      ) : null}

      {tab === "cost" ? (
        <div style={cols(2, 380, 12)}>
          <Tile
            title="Cost of deposits"
            sub="IndusInd and true peers"
            layers={["L1"]}
          >
            {d.cost.own.map((f) => (
              <FigRow key={f.id} f={f} />
            ))}
            <Label>Peers, each bank's own disclosure</Label>
            {d.cost.peers.map((f) => (
              <FigRow key={f.id} f={f} />
            ))}
            <FigRow f={d.cost.funds} />
            <MutedNote>
              Cost of funds is a different measure and sits on its own line.
            </MutedNote>
          </Tile>
          <Tile
            title="Gap to peers, by part"
            sub="Illustrative decomposition"
            layers={["L3"]}
          >
            {d.cost.decomposition.map((f) => (
              <FigRow key={f.id} f={f} />
            ))}
            <div
              style={{
                border: `1px dashed ${C.borderLight}`,
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
                color: C.textMut,
              }}
            >
              {d.cost.rate_table.text}
            </div>
          </Tile>
        </div>
      ) : null}

      {tab === "franchise" ? (
        <div style={cols(2, 380, 12)}>
          <Tile
            title="Retail franchise"
            sub="Quarterly average"
            layers={["L1"]}
          >
            {d.franchise.map((f) => (
              <FigRow key={f.id} f={f} />
            ))}
          </Tile>
          <Tile
            title="Premature withdrawals and new money"
            sub="Indexed"
            layers={["L3"]}
          >
            <div style={cols(2, 140, 8)}>
              <Kpi
                label="Premature withdrawals"
                f={d.win.premature}
                info={common.defs.premature}
              />
              <Kpi
                label="New savings accounts"
                f={d.win.new_money}
                info={common.defs.new_money}
              />
            </div>
          </Tile>
        </div>
      ) : null}

      <Tile
        title="Evidence"
        sub="Sources, dates, layers"
        layers={["L1", "L2", "L3"]}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            ...dates.flatMap((x) => PRODUCTS.map((p) => d.balances[x][p.id])),
            ...d.casa,
            ...d.cost.own,
            ...d.franchise,
          ].map((f) => (
            <div
              key={f.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                flexWrap: "wrap",
                fontSize: 12.5,
                color: C.textSec,
              }}
            >
              <span>
                {f.label} · {f.period}
                <span style={{ color: C.textMut }}>
                  {" "}
                  · source{" "}
                  {f.source_date ? fmtDate(f.source_date) : common.pending}
                </span>
              </span>
              <SourceTag layer={f.layer} />
            </div>
          ))}
        </div>
      </Tile>
    </>
  );
}
