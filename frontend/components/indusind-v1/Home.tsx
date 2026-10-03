"use client";

/**
 * S-HOME, the customer pulse, top to bottom: the quarter line; the pulse (inside the bank · outside · what customers
 * are doing, never added together); the Ombudsman watch; the pulse by business; the four items that need a decision;
 * Improving; peer moves; the horizon; one checked-and-within-range item. CEO's office sees the summary; Head of CX
 * sees the pulse by channel, the watch open, the evidence open and the owners table.
 */

import { hrefWith, type Sel } from "@/lib/indusind-v1/params";
import type {
  Common,
  Fig as FigT,
  Home,
  HomeWindow,
} from "@/lib/indusind-v1/types";
import { AreaChart, trendPoints } from "./charts";
import { OmbudsmanWatch } from "./Ombudsman";
import { OutsideMeter, ThemeLine, Thin } from "./PublicVoice";
import {
  C,
  cols,
  Fig,
  Info,
  Kpi,
  Label,
  MONO,
  MutedNote,
  NotLoadedNote,
  OpenLink,
  Pending,
  SourceTag,
  Table,
  Tile,
  tint,
} from "./primitives";
import { SignalCards } from "./SignalCards";

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

function Pulse({
  s,
  common,
  cx,
}: {
  s: HomeSlice;
  common: Common;
  cx: boolean;
}) {
  const p = s.win.pulse;
  const i = p.inside;
  const d = s.win.doing;
  const rt = trendPoints(i.trend);
  const ot = trendPoints(d.outflow_index.trend);
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
      <div style={{ ...cols(3, 300, 12), alignItems: "start" }}>
        <Tile
          title="Inside the bank"
          sub="Complaints and contacts"
          layers={["L3"]}
        >
          <div style={cols(2, 120, 8)}>
            <Kpi
              label="Complaints received"
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
          <div style={{ ...cols(3, 90, 8), fontSize: 12.5, color: C.textSec }}>
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
              Contacts{" "}
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

        <Tile title="Outside" sub="Public voice" layers={["L2"]}>
          <OutsideMeter
            v={s.win.outside}
            defs={common.defs}
            rating={s.win.outside.rating}
            trend={s.win.outside.trend}
            before={s.win.outside.before}
            caption={common.pulse_caption}
          />
        </Tile>

        <Tile
          title="What customers are doing"
          sub="Savings, flows, app"
          layers={["L1", "L3"]}
        >
          <div style={cols(2, 120, 8)}>
            <Kpi
              label="Savings outflow"
              f={d.outflow_index}
              info={common.defs.outflow}
            />
            <Kpi
              label="Savings closures"
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
      </div>

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
          "Received",
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
            !r.outside.thin ? (
              <span key="out" style={{ fontSize: 12.5 }}>
                <Fig
                  f={r.outside.items}
                  style={{ fontFamily: MONO, color: C.text }}
                />{" "}
                items
                {r.outside.escalation.value ? (
                  <>
                    {" · "}
                    <Fig f={r.outside.escalation} /> escalation
                  </>
                ) : null}
                {r.outside.footnotes.length ? (
                  <span title={r.outside.footnotes.join(" ")}> *</span>
                ) : null}
              </span>
            ) : (
              <Thin key="out" text={r.outside.text} />
            ),
            <span
              key="th"
              title={r.theme.thin ? undefined : r.theme.paraphrase}
            >
              <ThemeLine t={r.theme} compact />
            </span>,
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
    </Tile>
  );
}

function Strips({ s, sel }: { s: HomeSlice; sel: Sel }) {
  const q = s.win.quiet;
  return (
    <>
      <div style={{ ...cols(3, 300, 12), alignItems: "start" }}>
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
        <Tile
          title="Peer moves this week"
          sub="Rate cards, press"
          layers={["L2"]}
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
          <NotLoadedNote n={s.peer_moves} />
        </Tile>
        <Tile
          title="Horizon"
          sub="Dated obligations"
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
              <Fig f={h.date} />
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
          <SourceTag layer="L3" />
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
  return (
    <>
      <QuarterLine q={s.quarter} common={common} />
      <Pulse s={s} common={common} cx={cx} />
      <OmbudsmanWatch
        o={s.win.pulse.ombudsman}
        def={common.defs.ombudsman}
        expanded={cx}
        byBusiness={s.win.risk_by_business}
        byBusinessDef={common.defs.risk_by_business}
      />
      <ByBusiness s={s} sel={sel} />
      <SignalCards cards={s.win.cards} view={sel.v} common={common} />
      <Strips s={s} sel={sel} />
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
