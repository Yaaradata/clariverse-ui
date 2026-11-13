/**
 * NatWest Group · S-BRAND brand lens (re-bound from the market view): NatWest, Royal Bank of Scotland and Ulster Bank
 * side by side, the peers column, and public brand voice (not yet loaded). The Royal Bank of Scotland app-versus-overall
 * finding from the register opens this screen, and only this screen.
 */

import {
  type BrandColumn,
  fmtN,
  fmtP,
  type Peer,
  type RegisterEntry,
  type SourceRow,
} from "@/lib/natwest-pulse/nw";
import { RegisterLine } from "./Ombudsman";
import { NotLoadedTile } from "./Pulse";
import { C, MONO, PAIRS, Table, Tile } from "./primitives";

const METRICS: {
  key: keyof BrandColumn;
  label: string;
  fmt: (v: number) => string;
}[] = [
  {
    key: "customers",
    label: "Customers (assumed)",
    fmt: (v) => `${(v / 1_000_000).toFixed(1)}m`,
  },
  { key: "complaints", label: "Complaints", fmt: (v) => fmtN(v) },
  {
    key: "complaints_per_100k",
    label: "Complaints per 100,000",
    fmt: (v) => v.toFixed(1),
  },
  { key: "upheld_pct", label: "Upheld", fmt: (v) => fmtP(v) },
  { key: "closed_3d_pct", label: "Closed within 3 days", fmt: (v) => fmtP(v) },
  { key: "negative_pct", label: "Negative contacts", fmt: (v) => fmtP(v) },
  { key: "repeat_pct", label: "Repeat within 7 days", fmt: (v) => fmtP(v) },
  { key: "cora_leakage_pct", label: "Cora leakage", fmt: (v) => fmtP(v) },
  { key: "login_contacts", label: "App login contacts", fmt: (v) => fmtN(v) },
  { key: "fos_at_risk", label: "Ombudsman: at risk", fmt: (v) => fmtN(v) },
  {
    key: "fos_eligible",
    label: "Ombudsman: eligible to refer",
    fmt: (v) => fmtN(v),
  },
];

export function MarketView({
  brands,
  opening,
  peers,
  sources,
}: {
  brands: BrandColumn[];
  opening: RegisterEntry | null;
  peers: Peer[];
  sources: SourceRow[];
}) {
  const [app, overall] = opening ? opening.value.split(" vs ") : ["", ""];
  return (
    <>
      {opening ? (
        <Tile
          title="Royal Bank of Scotland: app versus overall service"
          sub="CMA survey, August 2026"
          prov="public"
          accent
          id="opening"
        >
          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "baseline",
            }}
          >
            <div>
              <div style={{ fontSize: 12.5, color: C.textMut }}>App</div>
              <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 800 }}>
                {app}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12.5, color: C.textMut }}>
                Overall service
              </div>
              <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 800 }}>
                {overall}
              </div>
            </div>
          </div>
          <RegisterLine e={opening} />
        </Tile>
      ) : null}
      <Tile
        title="Three brands, one metric set"
        sub="Inside the bank, same window"
        prov="internal"
        id="brands"
      >
        <Table
          head={["Metric", ...brands.map((b) => b.label)]}
          align={["left", ...brands.map(() => "right" as const)]}
          rows={METRICS.map((m) => [
            <span key="l" style={{ color: C.text }}>
              {m.label}
            </span>,
            ...brands.map((b) => {
              const v = b[m.key];
              return (
                <span key={b.id} style={{ fontFamily: MONO }}>
                  {typeof v === "number" ? m.fmt(v) : "—"}
                </span>
              );
            }),
          ])}
        />
      </Tile>
      <div style={PAIRS}>
        <Tile
          title="Peers"
          sub="CMA August 2026, FCA H1 2026"
          prov="public"
          id="peers"
        >
          <Table
            head={["Bank", "Figures"]}
            align={["left", "right"]}
            rows={peers.map((p) => [
              <span
                key="l"
                data-testid={p.benchmark ? "peer-benchmark" : "peer"}
                style={{ color: p.benchmark ? C.textDim : C.text }}
              >
                {p.label}
                {p.benchmark ? " · upper benchmark" : ""}
              </span>,
              <span key="f" style={{ color: C.textMut }}>
                Pending verification
              </span>,
            ])}
          />
          <div style={{ fontSize: 12.5, color: C.textMut }}>
            Figures load from the research pack, once supplied.
          </div>
        </Tile>
        <NotLoadedTile title="Brand voice in public" sources={sources} />
      </div>
    </>
  );
}
