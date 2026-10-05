"use client";

/**
 * S-CARDS · Cards, business view: the same engine at a business head's altitude. Issue pulse (internal and public,
 * side by side, never added), Ombudsman watch for Cards, accounts at risk of closure by category (aggregate; replaces
 * the customer-level save list), issues by category with owner roles, voice and timelines. Money line: N18 only.
 * Reconciles to the Cards row on the home page.
 */

import type {
  Common,
  Fig as FigT,
  OmbudsmanBlock,
  Trend,
  VoiceBlock,
} from "@/lib/indusind-v1/types";
import { AreaChart, trendPoints } from "./charts";
import { StateBar } from "./Home";
import { OmbudsmanWatch } from "./Ombudsman";
import { OutsideMeter, Thin } from "./PublicVoice";
import {
  C,
  cols,
  Fig,
  Info,
  Kpi,
  Label,
  MONO,
  ShareBar,
  Table,
  Tile,
} from "./primitives";

type Category = {
  id: string;
  label: string;
  owner: string;
  share: FigT;
  open: FigT;
  waiting: FigT;
  negative: FigT;
  change: FigT;
};

export type CardsSlice = {
  money: FigT;
  most_voice: boolean;
  win: {
    issue: Record<"index" | "resolved" | "open" | "waiting" | "negative", FigT>;
    complaints: Record<
      "received_index" | "change" | "open" | "over_30",
      FigT
    > & {
      trend: Trend;
    };
    ombudsman: OmbudsmanBlock;
    categories: Category[];
    closure_risk: { index: FigT; by_category: FigT[] };
    external: VoiceBlock & {
      categories: (FigT & { category: string; thin: boolean })[];
      praise: { show: boolean; count: number };
    };
  };
  windowLabel: string;
};

export function CardsView({ c, common }: { c: CardsSlice; common: Common }) {
  const w = c.win;
  const t = trendPoints(w.complaints.trend);
  const maxClosure = Math.max(
    ...w.closure_risk.by_category.map((f) => f.value ?? 0),
    1,
  );
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 750 }}>
            The same engine, at a business head's altitude.
          </h2>
          <div style={{ fontSize: 13, color: C.textMut }}>
            {c.most_voice
              ? "Cards: the business with the most public customer voice this quarter"
              : "Business view: Cards"}{" "}
            · {c.windowLabel}
          </div>
        </div>
        <div
          data-testid="money-line"
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontSize: 13.5,
            color: C.textSec,
          }}
        >
          {c.money.label}{" "}
          <span style={{ color: C.textMut }}>· {c.money.period}</span>
          <Fig f={c.money} style={{ fontFamily: MONO, color: C.text }} />
        </div>
      </div>

      <div style={cols(2, 380, 12)}>
        <div
          style={{
            display: "grid",
            gridTemplateRows: "auto 1fr",
            gap: 12,
            minWidth: 0,
          }}
        >
          <Tile
            title="Cards: issue pulse, inside the bank"
            sub="Contacts and complaints"
            layers={["L3"]}
          >
            <div style={cols(3, 120, 8)}>
              <Kpi
                label="Contacts (index)"
                f={w.issue.index}
                info={common.defs.contacts}
              />
              <Kpi
                label="Complaints received (index)"
                f={w.complaints.received_index}
                info={common.defs.received}
                sub={<Fig f={w.complaints.change} />}
              />
              <Kpi
                label="Open too long"
                f={w.complaints.over_30}
                info={common.defs.over_30}
              />
            </div>
            <Label>Complaints received, weekly</Label>
            <div style={{ position: "relative", height: 64 }}>
              <AreaChart
                id="cards-received"
                values={t.values}
                color={C.cyan}
                height="100%"
                title="Cards complaints received, weekly index"
                points={t.points}
              />
            </div>
            <div>
              <Label>
                Contacts, state at window end
                <Info text={common.defs.states} />
              </Label>
              <div style={{ marginTop: 6 }}>
                <StateBar
                  r={w.issue.resolved}
                  o={w.issue.open}
                  w={w.issue.waiting}
                />
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: C.textSec }}>
              Negative{" "}
              <Fig
                f={w.issue.negative}
                style={{ fontFamily: MONO, color: C.text }}
              />{" "}
              · complaints open{" "}
              <Fig
                f={w.complaints.open}
                style={{ fontFamily: MONO, color: C.text }}
              />
            </div>
          </Tile>
          <Tile
            title="Cards: accounts at risk of closure (index)"
            sub="Illustrative; aggregate, by category"
            layers={["L3"]}
            info={common.defs.closure_risk}
          >
            <Kpi
              label="At risk of closure (index)"
              f={w.closure_risk.index}
              sub="Q1 weekly avg = 100"
            />
            <div>
              {w.closure_risk.by_category.map((f) => (
                <ShareBar key={f.id} label={f.label} f={f} max={maxClosure} />
              ))}
            </div>
          </Tile>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateRows: "auto auto 1fr",
            gap: 12,
            minWidth: 0,
          }}
        >
          <Tile
            title="Cards: issue pulse, in public"
            sub="Public voice"
            layers={["L2"]}
          >
            <OutsideMeter
              v={w.external}
              defs={common.defs}
              caption={common.pulse_caption}
            />
          </Tile>
          <OmbudsmanWatch
            o={w.ombudsman}
            def={common.defs.ombudsman}
            expanded
            title="Cards: Ombudsman watch"
          />
          <Tile
            title="Cards: public items by category"
            sub="What customers say"
            layers={["L2"]}
          >
            {w.external.categories.length ? (
              <div>
                {w.external.categories
                  .filter((f) => !f.thin)
                  .map((f) => (
                    <div
                      key={f.id}
                      data-register={f.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        fontSize: 13,
                        color: C.textSec,
                        padding: "2px 0",
                      }}
                    >
                      <span>{f.label}</span>
                      <strong style={{ color: C.text }}>{f.display}</strong>
                    </div>
                  ))}
                {w.external.categories.some((f) => f.thin) ? (
                  <div style={{ fontSize: 12.5, color: C.textMut }}>
                    <span style={{ fontStyle: "italic" }}>
                      Not enough items:
                    </span>{" "}
                    {w.external.categories
                      .filter((f) => f.thin)
                      .map((f) => f.label)
                      .join(", ")}
                  </div>
                ) : null}
              </div>
            ) : (
              <Thin text={w.external.text} />
            )}
            {w.external.praise.show ? null : (
              <div style={{ fontSize: 12.5, color: C.textMut }}>
                Where customers praise us: {w.external.text.toLowerCase()}.
              </div>
            )}
          </Tile>
        </div>
      </div>

      <Tile
        title="Cards: issues by category"
        sub="Each with an owner role"
        layers={["L3"]}
      >
        <Table
          testid="categories"
          head={[
            "Category",
            "Owner",
            "Share",
            "Open",
            "Waiting",
            "Negative",
            "Share change, pts",
          ]}
          align={["left", "left", "right", "right", "right", "right", "right"]}
          rows={w.categories.map((x) => ({
            key: x.id,
            cells: [
              <strong key="l" style={{ color: C.text, fontWeight: 600 }}>
                {x.label}
              </strong>,
              x.owner,
              <Fig key="s" f={x.share} />,
              <Fig key="o" f={x.open} />,
              <Fig key="w" f={x.waiting} />,
              <Fig key="n" f={x.negative} />,
              <Fig
                key="c"
                f={{ ...x.change, display: x.change.display.split(" ")[0] }}
              />,
            ],
          }))}
        />
      </Tile>
    </>
  );
}
