"use client";

/**
 * S-PEER · Peer and market moves (core, reduced): the peer table with tier labels (Kotak only as the upper
 * benchmark), card effective dates from the rate captures, rates side by side (IndusInd's own only once read)
 * and press and ratings. Never a league table of all banks.
 */

import type { Common, Fig as FigT, NotLoaded } from "@/lib/indusind-v1/types";
import {
  C,
  cols,
  Fig,
  MutedNote,
  NotLoadedNote,
  Pending,
  Table,
  Tile,
} from "./primitives";
import { FigRow } from "./SignalCards";

export type PeersSlice = {
  table: { bank: string; tier: string; figures: FigT[]; held: FigT[] }[];
  footnote: FigT;
  cards: NotLoaded;
  rates: { peers: FigT[]; indusind: { loaded: boolean; text: string } };
  press: { ratings: FigT[]; press: NotLoaded };
};

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

export function PeersView({ p, common }: { p: PeersSlice; common: Common }) {
  return (
    <>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 750 }}>
          Peer and market moves
        </h2>
        <div style={{ fontSize: 13, color: C.textMut }}>
          True peers, rate cards, press
        </div>
      </div>

      <Tile title="Peer table" sub="Each bank's own disclosure" layers={["L1"]}>
        <Table
          testid="peer-table"
          head={["Bank", "Tier", "Verified figures"]}
          rows={p.table.map((r) => ({
            key: r.bank,
            // The upper benchmark is greyed: Kotak is a reference, not a core peer (review finding 27).
            muted: r.tier === "Upper benchmark",
            cells: [
              <strong key="b" style={{ color: C.text }}>
                {r.bank}
              </strong>,
              r.tier,
              <div
                key="f"
                style={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                {r.figures.map((f) => (
                  <span key={f.id + (f.period ?? "")}>
                    {cap((f.label ?? "").replace(`${r.bank} `, ""))}
                    <span style={{ color: C.textMut }}> · {f.period}</span>{" "}
                    <Fig f={f} />
                  </span>
                ))}
                {r.held.map((f) => (
                  <span key={f.id} style={{ color: C.textMut }}>
                    {f.label} <Pending />
                  </span>
                ))}
              </div>,
            ],
          }))}
        />
        <MutedNote>
          {p.footnote.label} · {p.footnote.period}: <Fig f={p.footnote} />.{" "}
          {p.footnote.note}.
        </MutedNote>
      </Tile>

      <div style={{ ...cols(2, 380, 12), alignItems: "start" }}>
        <Tile
          title="Card effective dates and changes"
          sub="From the rate captures"
          layers={["L2"]}
        >
          <NotLoadedNote n={p.cards} />
        </Tile>
      </div>

      <Tile
        title="Rates side by side"
        sub="Same band, same date"
        layers={["L1"]}
      >
        {p.rates.peers.length ? (
          <Table
            testid="rates"
            head={["Rate", "Date", "Peer"]}
            align={["left", "left", "right"]}
            rows={p.rates.peers.map((f) => ({
              key: f.id,
              cells: [
                f.label,
                <span key="d" style={{ color: C.textMut }}>
                  {f.period}
                </span>,
                <Fig key="v" f={f} />,
              ],
            }))}
          />
        ) : null}
        <MutedNote>
          {p.rates.indusind.loaded ? common.pending : p.rates.indusind.text}
        </MutedNote>
      </Tile>

      <div style={{ ...cols(2, 380, 12), alignItems: "start" }}>
        <Tile title="Ratings" sub="Dated" layers={["L1"]}>
          {p.press.ratings.map((f) => (
            <FigRow key={f.id} f={f} />
          ))}
        </Tile>
        <Tile title="Press" sub="Dated list" layers={["L2"]}>
          <NotLoadedNote n={p.press.press} />
        </Tile>
      </div>
    </>
  );
}
