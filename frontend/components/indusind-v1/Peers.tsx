"use client";

/**
 * S-PEER · Peer and market moves (core, reduced): the peer table with tier labels (Kotak only as the upper
 * benchmark), card effective dates from the rate captures, rates side by side (IndusInd's own only once read)
 * and press and ratings. Never a league table of all banks.
 */

import type { CardDate, Common, Fig as FigT } from "@/lib/indusind-v1/types";
import { C, cols, Fig, MutedNote, Pending, Table, Tile } from "./primitives";

export type PeersSlice = {
  table: { bank: string; tier: string; figures: FigT[]; held: FigT[] }[];
  footnote: FigT;
  pending_note: string | null;
  cards: CardDate[];
  rates: { peers: FigT[]; indusind: { loaded: boolean; text: string } };
  press: FigT[];
};

/** Peer rate-card dates: one line each, tagged with the page date. Card dates, not rate changes. */
export function CardDateList({
  items,
  empty,
}: {
  items: CardDate[];
  empty?: string;
}) {
  if (!items.length)
    return empty ? (
      <div style={{ fontSize: 13, color: C.textMut }}>{empty}</div>
    ) : null;
  return (
    <div
      data-testid="card-dates"
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      {items.map((f) => (
        <div
          key={f.id}
          data-register={f.id}
          style={{ fontSize: 13.5, color: C.text, lineHeight: 1.4 }}
        >
          {f.display}
          <div style={{ fontSize: 11.5, color: C.textMut }}>
            Public · verified · {f.page_date}
          </div>
        </div>
      ))}
    </div>
  );
}

/** A dated list: label left, date right. */
function DatedList({ items }: { items: FigT[] }) {
  return (
    <div
      data-testid="press"
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      {items.map((f) => (
        <div
          key={f.id + (f.label ?? "")}
          data-register={f.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            fontSize: 13.5,
            color: C.textSec,
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: 4,
          }}
        >
          <span style={{ minWidth: 0 }}>{f.label}</span>
          <strong style={{ color: C.text, whiteSpace: "nowrap" }}>
            <Fig f={f} />
          </strong>
        </div>
      ))}
    </div>
  );
}

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
          {p.footnote.note}.{p.pending_note ? ` ${p.pending_note}.` : ""}
        </MutedNote>
      </Tile>

      <div style={cols(2, 380, 12)}>
        <Tile
          title="Card effective dates"
          sub="Dates, not rate changes"
          layers={["L1"]}
        >
          <CardDateList items={p.cards} />
        </Tile>
        <Tile title="Press and ratings" sub="Dated list" layers={["L1"]}>
          <DatedList items={p.press} />
        </Tile>
      </div>

      {p.rates.peers.length ? (
        <Tile
          title="Rates side by side"
          sub="Same band, same date"
          layers={["L1"]}
        >
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
          <MutedNote>
            {p.rates.indusind.loaded ? common.pending : p.rates.indusind.text}
          </MutedNote>
        </Tile>
      ) : null}
    </>
  );
}
