"use client";

/**
 * S-HOME, the customer pulse, top to bottom: the quarter line; the pulse (inside the bank · outside · what customers
 * are doing, never added together); the Ombudsman watch; the pulse by business; the four items that need a decision;
 * Improving; peer moves; the horizon; one checked-and-within-range item. CEO's office sees the summary; Head of CX
 * sees the pulse by channel, the watch open, the evidence open and the owners table.
 */

import type { ReactNode } from "react";
import { hrefWith, type Sel } from "@/lib/indusind-v1/params";
import type {
  Common,
  Fig as FigT,
  Home,
  HomeWindow,
} from "@/lib/indusind-v1/types";
import { AreaChart, trendPoints } from "./charts";
import { OmbudsmanWatch } from "./Ombudsman";
import { CardDateList } from "./Peers";
import { OutsideMeter, ThemeLine } from "./PublicVoice";
import {
  C,
  cols,
  Fig,
  Info,
  Kpi,
  Label,
  MONO,
  MutedNote,
  OpenLink,
  Pending,
  SourceTag,
  Table,
  Tile,
  tint,
} from "./primitives";
import { FigRow, SignalCards } from "./SignalCards";

/** What the home page receives: one window, one business, one view. Sliced on the server. */
export type HomeSlice = {
  quarter: Home["quarter"];
  win: Omit<HomeWindow, "pulse"> & {
    pulse: HomeWindow["pulse"][string];
  };
  improving: Home["improving"];
  horizon: Home["horizon"];
  peer_moves: Home["peer_moves"];
  owners: Home["owners"] | null;
  windowLabel: string;
  businessLabel: string;
};

/** The thin quarter line: three register figures and the two sensitivity chips, each opening its basis. */
function QuarterLine({ q, common }: { q: Home["quarter"]; common: Common }) {
  return (
    <div
      data-testid="quarter-line"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px 14px",
        flexWrap: "wrap",
        fontSize: 13,
        color: C.textSec,
        padding: "2px 2px",
      }}
    >
      <strong style={{ color: C.text }}>{q.items[0]?.period}</strong>
      {q.items.map((f) => (
        <span
          key={f.id}
          style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
        >
          {f.label} <Fig f={f} style={{ fontFamily: MONO, color: C.text }} />
        </span>
      ))}
      {q.chips.map((s) => (
        <span
          key={s.id}
          data-register={s.id}
          style={{
            display: "inline-flex",
            gap: 6,
            alignItems: "center",
            border: `1px solid ${tint(C.cyan, 0.3)}`,
            background: tint(C.cyan, 0.06),
            borderRadius: 999,
            padding: "1px 4px 1px 10px",
          }}
        >
          {s.label}
          {s.pending ? <Pending /> : <strong>{s.display}</strong>}
          <Info
            label={s.label}
            text={`${s.formula_text}. ${s.basis_note} ${common.sensitivity_footer}`}
          />
        </span>
      ))}
      <SourceTag layer="L1" />
    </div>
  );
}

export function StateBar({ r, o, w }: { r: FigT; o: FigT; w: FigT }) {
  const seg = (f: FigT, color: string) => (
    <div style={{ width: `${f.value ?? 0}%`, background: color }} />
  );
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 10,
          borderRadius: 5,
          overflow: "hidden",
          background: C.track,
        }}
      >
        {seg(r, C.green)}
        {seg(o, C.cyan)}
        {seg(w, C.neutral)}
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          fontSize: 12.5,
          color: C.textSec,
          marginTop: 5,
        }}
      >
        <span>
          Resolved <Fig f={r} style={{ fontFamily: MONO, color: C.text }} />
        </span>
        <span>
          Open <Fig f={o} style={{ fontFamily: MONO, color: C.text }} />
        </span>
        <span>
          Waiting on customer{" "}
          <Fig f={w} style={{ fontFamily: MONO, color: C.text }} />
        </span>
      </div>
    </div>
  );
}

// A column of tiles: the last tile fills to the row height, so the columns end level whatever the filter shows.
const STACK = {
  display: "grid",
  gridTemplateRows: "auto 1fr",
  gap: 12,
  minWidth: 0,
} as const;

/** Grid rows for a column of tiles: every tile at its height, the last one filling to the row height. */
const rows = (extra?: ReactNode[]) =>
  `${"auto ".repeat(extra?.length ?? 0)}1fr`;

function Pulse({
  s,
  common,
  cx,
  col1,
  col3,
  wide,
}: {
  s: HomeSlice;
  common: Common;
  cx: boolean;
  /** Stacked under Inside and under "What customers are doing", so the three columns end level. */
  col1?: ReactNode[];
  col3?: ReactNode[];
  /** Full width under the pulse row (the expanded Ombudsman watch in the Head of CX view). */
  wide?: ReactNode;
}) {
  const p = s.win.pulse;
  const i = p.inside;
  const d = s.win.doing;
  const rt = trendPoints(i.trend);
  const ot = trendPoints(
    d.kind === "lines"
      ? { id: "", layer: "L3", unit: "", points: [] }
      : d.outflow_index.trend,
  );
  const sub = {
    fontSize: 12.5,
    color: C.textMut,
    marginTop: 2,
  };
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
        Customer pulse
        <span style={{ fontWeight: 400, color: C.textMut, fontSize: 13 }}>
          {" "}
          · {s.businessLabel} · {s.windowLabel}
        </span>
      </h2>
      <div style={cols(3, 300, 12)}>
        <div style={{ ...STACK, gridTemplateRows: rows(col1) }}>
          <Tile
            title="Inside the bank"
            sub="Complaints and contacts"
            layers={["L3"]}
          >
            <div style={cols(2, 120, 8)}>
              <Kpi
                label="Complaints received (index)"
                f={i.received_index}
                info={common.defs.received}
                sub={<Fig f={i.change} />}
              />
              <Kpi
                label="Open too long"
                f={i.over_30}
                info={common.defs.over_30}
              />
            </div>
            <div style={{ position: "relative", height: 64 }}>
              <AreaChart
                id="home-received"
                values={rt.values}
                color={C.cyan}
                height="100%"
                title="Complaints received, weekly index"
                points={rt.points}
              />
            </div>
            <div>
              <Label>
                State at window end
                <Info text={common.defs.states} />
              </Label>
              <div style={{ marginTop: 6 }}>
                <StateBar r={i.resolved} o={i.open} w={i.waiting} />
              </div>
            </div>
            <div
              style={{ ...cols(3, 90, 8), fontSize: 12.5, color: C.textSec }}
            >
              <div>
                <div style={sub}>
                  Grievance desk <Info text={common.defs.escalated} />
                </div>
                <Fig
                  f={i.escalated}
                  style={{ fontFamily: MONO, color: C.text, fontSize: 15 }}
                />
              </div>
              <div>
                <div style={sub}>
                  Internal Ombudsman <Info text={common.defs.io} />
                </div>
                <Fig
                  f={i.io}
                  style={{ fontFamily: MONO, color: C.text, fontSize: 15 }}
                />
              </div>
              <div>
                <div style={sub}>
                  Escalation language{" "}
                  <Info text={common.defs.escalation_language} />
                </div>
                <Fig
                  f={i.escalation_language}
                  style={{ fontFamily: MONO, color: C.text, fontSize: 15 }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                fontSize: 12.5,
                color: C.textSec,
                borderTop: `1px solid ${C.border}`,
                paddingTop: 8,
              }}
            >
              <span>
                Contacts (index){" "}
                <Fig
                  f={p.contacts.index}
                  style={{ fontFamily: MONO, color: C.text }}
                />
              </span>
              <span>
                Negative{" "}
                <Fig
                  f={p.contacts.negative}
                  style={{ fontFamily: MONO, color: C.text }}
                />
              </span>
              <Info text={common.defs.contacts} />
            </div>
          </Tile>
          {col1}
        </div>

        <Tile title="Outside" sub="Public voice" layers={["L2"]}>
          <OutsideMeter
            v={s.win.outside}
            defs={common.defs}
            rating={s.win.outside.rating}
            trend={s.win.outside.trend ?? undefined}
            before={s.win.outside.before}
            caption={common.pulse_caption}
          />
        </Tile>

        <div
          style={{
            ...STACK,
            gridTemplateRows: rows(col3),
          }}
        >
          {d.kind === "lines" ? (
            <Tile
              title="What customers are doing"
              sub={d.sub}
              layers={Array.from(new Set(d.lines.map((f) => f.layer)))}
            >
              {d.lines.map((f) => (
                <FigRow key={f.id + (f.label ?? "")} f={f} />
              ))}
            </Tile>
          ) : (
            <Tile
              title="What customers are doing"
              sub="Savings, flows, app"
              layers={["L1", "L3"]}
            >
              <div style={cols(2, 120, 8)}>
                <Kpi
                  label="Savings outflow (index)"
                  f={d.outflow_index}
                  info={common.defs.outflow}
                />
                <Kpi
                  label="Savings closures (index)"
                  f={d.closures_index}
                  info={common.defs.closures}
                />
              </div>
              <div style={{ position: "relative", height: 64 }}>
                <AreaChart
                  id="home-outflow"
                  values={ot.values}
                  color={C.cyan}
                  height="100%"
                  title="Savings outflow, weekly index"
                  points={ot.points}
                />
              </div>
              <div>
                {d.savings.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      fontSize: 13,
                      color: C.textSec,
                      padding: "2px 0",
                    }}
                  >
                    <span>
                      {f.label}{" "}
                      <span style={{ color: C.textMut }}>· {f.period}</span>
                    </span>
                    <Fig f={f} style={{ fontFamily: MONO, color: C.text }} />
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    fontSize: 13,
                    color: C.textSec,
                    padding: "2px 0",
                  }}
                >
                  <span>
                    {d.app_deposits.label}{" "}
                    <span style={{ color: C.textMut }}>
                      · {d.app_deposits.period}
                    </span>
                  </span>
                  <Fig
                    f={d.app_deposits}
                    style={{ fontFamily: MONO, color: C.text }}
                  />
                </div>
              </div>
            </Tile>
          )}
          {col3}
        </div>
      </div>
      {wide}

      {cx ? (
        <Tile
          title="Inside the bank, by channel"
          sub="Complaints by channel"
          layers={["L3"]}
          info={common.defs.channels}
        >
          <Table
            testid="channels"
            head={[
              "Channel",
              "Share",
              "Resolved",
              "Open",
              "Waiting on customer",
              "Open too long",
            ]}
            align={["left", "right", "right", "right", "right", "right"]}
            rows={p.channels.map((c) => ({
              key: c.id,
              cells: [
                c.label,
                <Fig key="s" f={c.share} />,
                <Fig key="r" f={c.resolved} />,
                <Fig key="o" f={c.open} />,
                <Fig key="w" f={c.waiting} />,
                <Fig key="t" f={c.over_30} />,
              ],
            }))}
          />
        </Tile>
      ) : null}
    </section>
  );
}

function ByBusiness({ s, sel }: { s: HomeSlice; sel: Sel }) {
  return (
    <Tile
      title="Pulse by business"
      sub="Bank to product"
      layers={["L1", "L2", "L3"]}
    >
      <Table
        testid="by-business"
        head={[
          "Business",
          "Received (index)",
          "Open",
          "Open too long",
          `Outside, ${s.win.outside.period}`,
          "Top theme",
          "Money line",
          "",
        ]}
        align={[
          "left",
          "right",
          "right",
          "right",
          "left",
          "left",
          "left",
          "left",
        ]}
        rows={s.win.rows.map((r) => ({
          key: r.id,
          muted: r.next,
          cells: [
            <span
              key="n"
              style={{
                fontWeight: sel.b === r.id ? 700 : 500,
                color: sel.b === r.id ? C.text : C.textSec,
              }}
            >
              {r.label}
            </span>,
            r.inside ? <Fig key="i" f={r.inside.received_index} /> : "—",
            r.inside ? <Fig key="o" f={r.inside.open} /> : "—",
            r.inside ? <Fig key="t" f={r.inside.over_30} /> : "—",
            // The count is always shown (a count, not a claim); escalation and theme need the minimum items.
            r.next ? (
              "—"
            ) : (
              <span key="out" style={{ fontSize: 12.5 }}>
                <Fig
                  f={r.outside.items}
                  style={{ fontFamily: MONO, color: C.text }}
                />{" "}
                items
                {r.outside.escalation.value && !r.outside.escalation.thin ? (
                  <>
                    {" · "}
                    <Fig f={r.outside.escalation} /> escalation
                  </>
                ) : null}
                {r.outside.footnotes.length ? (
                  <span title={r.outside.footnotes.join(" ")}> *</span>
                ) : null}
              </span>
            ),
            r.theme.thin ? (
              <span key="th" style={{ color: C.textMut }}>
                —
              </span>
            ) : (
              <span key="th" title={r.theme.paraphrase}>
                <ThemeLine t={r.theme} compact />
              </span>
            ),
            <div
              key="m"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                fontSize: 12.5,
              }}
            >
              {r.money.map((f) => (
                <span key={f.id + (f.period ?? "")}>
                  {r.id === "digital" ? "Scale: " : ""}
                  {f.label} <Fig f={f} />
                </span>
              ))}
            </div>,
            r.outside_only ? (
              ""
            ) : r.next ? (
              <span key="x" style={{ color: C.textMut, fontSize: 12.5 }}>
                Next
              </span>
            ) : r.module ? (
              <OpenLink key="x" href={hrefWith(r.module, sel, { b: "all" })}>
                Open
              </OpenLink>
            ) : (
              <span key="x" style={{ color: C.textMut, fontSize: 12.5 }}>
                Module next
              </span>
            ),
          ],
        }))}
      />
      <MutedNote>
        Top theme shows once a business has 15 or more public items in the
        window; "—" below that.
        {s.win.unassigned?.value ? (
          <>
            {" "}
            App reviews not tied to one business: <Fig f={s.win.unassigned} />.
          </>
        ) : null}
      </MutedNote>
    </Tile>
  );
}

function PeerMoves({ s, sel }: { s: HomeSlice; sel: Sel }) {
  return (
    <Tile
      title="Peer moves this week"
      sub="Peer rate-card dates"
      layers={["L1"]}
      right={
        <OpenLink
          href={hrefWith(
            "/role-based/indusind_bank/customer-pulse/peers",
            sel,
            { b: "all" },
          )}
        >
          Peers
        </OpenLink>
      }
    >
      <CardDateList items={s.peer_moves.items} empty={s.peer_moves.empty} />
    </Tile>
  );
}

function Improving({ s }: { s: HomeSlice }) {
  return (
    <Tile
      title="Improving"
      sub="Verified items only"
      layers={["L1"]}
      tone="green"
    >
      {s.improving.map((f) => (
        <div
          key={f.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            fontSize: 13.5,
            color: C.textSec,
          }}
        >
          <span>
            {f.label} <span style={{ color: C.textMut }}>· {f.period}</span>
          </span>
          <Fig f={f} style={{ fontFamily: MONO, color: C.green }} />
        </div>
      ))}
    </Tile>
  );
}

function Strips({
  s,
  sel,
  tiles,
}: {
  s: HomeSlice;
  sel: Sel;
  /** Bank-wide tiles not placed in the pulse; they share the row with Horizon. */
  tiles: ReactNode[];
}) {
  const q = s.win.quiet;
  return (
    <>
      {tiles.length > 2 ? <div style={cols(3, 300, 12)}>{tiles}</div> : null}
      <div style={cols(tiles.length > 2 ? 1 : tiles.length + 1, 300, 12)}>
        {tiles.length > 2 ? null : tiles}
        <Tile
          title="Horizon"
          sub="Dated obligations; days from data freeze"
          layers={["L1"]}
          right={
            <OpenLink
              href={hrefWith(
                "/role-based/indusind_bank/customer-pulse/risk",
                sel,
                { b: "all" },
              )}
            >
              Calendar
            </OpenLink>
          }
        >
          {s.horizon.map((h) => (
            <div
              key={h.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                fontSize: 13.5,
                color: C.textSec,
              }}
            >
              <span>{h.label}</span>
              <span style={{ textAlign: "right" }}>
                <Fig f={h.date} />
                {h.countdown ? (
                  <span style={{ color: C.textMut }}> · {h.countdown}</span>
                ) : null}
              </span>
            </div>
          ))}
        </Tile>
      </div>
      <div
        data-testid="quiet"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          background: C.card,
          border: `1px solid ${tint(C.green, 0.22)}`,
          borderLeft: `3px solid ${C.green}`,
          borderRadius: 14,
          padding: "10px 16px",
          fontSize: 14,
        }}
      >
        <strong style={{ color: C.text }}>Checked and within range</strong>
        {q ? (
          <span data-register={q.id} style={{ color: C.textSec }}>
            {q.text}
          </span>
        ) : (
          <MutedNote>No check passed this window.</MutedNote>
        )}
        <span style={{ marginLeft: "auto" }}>
          <SourceTag layer={q?.layer ?? "L3"} />
        </span>
      </div>
    </>
  );
}

export function HomeView({
  s,
  sel,
  common,
}: {
  s: HomeSlice;
  sel: Sel;
  common: Common;
}) {
  const cx = sel.v === "cx";
  const biz = s.win.doing.kind === "lines";
  const omb = (
    <OmbudsmanWatch
      key="omb"
      o={s.win.pulse.ombudsman}
      def={common.defs.ombudsman}
      expanded={cx}
      byBusiness={s.win.risk_by_business}
      byBusinessDef={common.defs.risk_by_business}
    />
  );
  const improving = <Improving key="improving" s={s} />;
  const peer = <PeerMoves key="peer" s={s} sel={sel} />;
  // Tile placement, measured so the three pulse columns end near level (IV-62). Head of CX: the expanded Ombudsman
  // watch runs full width. A single business shrinks "What customers are doing", so the business-scoped Ombudsman
  // watch sits beside it and the bank-wide Peer moves and Improving stay in the bottom row.
  // Outside is tall when it carries the weekly chart (All, Digital); short otherwise.
  const tallOut = !!s.win.outside.trend;
  const ombTile = cx ? [] : [omb];
  const place: { col1: ReactNode[]; col3: ReactNode[]; strips: ReactNode[] } =
    tallOut && !biz
      ? cx
        ? { col1: [improving], col3: [peer], strips: [] }
        : { col1: [omb], col3: [peer], strips: [improving] }
      : tallOut
        ? { col1: ombTile, col3: [peer, improving], strips: [] }
        : biz
          ? cx
            ? { col1: [], col3: [peer], strips: [improving] }
            : { col1: [], col3: [omb], strips: [improving, peer] }
          : { col1: [], col3: [], strips: [...ombTile, peer, improving] };
  return (
    <>
      <QuarterLine q={s.quarter} common={common} />
      <Pulse
        s={s}
        common={common}
        cx={cx}
        // CEO's office: the compact watch stacks under Inside. Head of CX: the expanded watch (gauges and the
        // by-business bars) is too tall for a column, so it runs full width under the pulse row.
        col1={place.col1}
        wide={cx ? omb : undefined}
        col3={place.col3}
      />
      <ByBusiness s={s} sel={sel} />
      <SignalCards cards={s.win.cards} view={sel.v} common={common} />
      <Strips s={s} sel={sel} tiles={place.strips} />
      {cx && s.owners ? (
        <Tile title="Owners and status" sub="Roles, not names" layers={["L3"]}>
          <Table
            testid="owners"
            head={["Item", "Owner", "Action", "Status", "Age", "Approver"]}
            rows={s.owners.map((o) => ({
              key: o.card,
              cells: [
                s.win.cards
                  .find((c) => c.id === o.card)
                  ?.title_parts.map((p) => (p.fig ? p.fig.display : p.text))
                  .join("") ?? o.card,
                o.owner,
                o.action,
                o.status,
                o.age_days === 0 ? "New" : String(o.age_days),
                o.approver,
              ],
            }))}
          />
        </Tile>
      ) : null}
    </>
  );
}
