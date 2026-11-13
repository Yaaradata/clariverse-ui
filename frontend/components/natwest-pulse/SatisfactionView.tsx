/**
 * NatWest Group · S-CHANNEL cross-channel pulse (re-bound from the satisfaction view): calls, Cora, complaints, branch
 * and public voice on one screen, the same metric set and window. Cora is a channel, not a competitor. Complaints sit in
 * their own row and are never added to contacts.
 */

import { DEFINITIONS } from "@/lib/natwest-pulse/copy";
import {
  type ChannelBlock,
  fmtBig,
  fmtP,
  type SourceRow,
  vsPrev,
} from "@/lib/natwest-pulse/nw";
import { Delta, NotLoadedTile } from "./Pulse";
import { C, MONO, Table, Tile } from "./primitives";
import { ChannelCard } from "./V3Blocks";

export function SatisfactionView({
  channel,
  sources,
  showDelta,
  windowLabel,
}: {
  channel: ChannelBlock;
  sources: SourceRow[];
  showDelta: boolean;
  windowLabel: string;
}) {
  return (
    <>
      <Tile
        title="Every channel, one metric set"
        sub={
          showDelta ? `Change ${vsPrev(windowLabel)}` : "Levels in the window"
        }
        prov={["internal", "public"]}
        id="channels"
      >
        <Table
          head={[
            "Channel",
            "Volume",
            "Negative",
            "Repeat",
            "Resolved first time",
          ]}
          align={["left", "right", "right", "right", "right"]}
          rows={[
            ...channel.rows.map((r) => [
              <strong key="l" style={{ color: C.text }}>
                {r.label}
              </strong>,
              <span key="v" style={{ fontFamily: MONO }}>
                {fmtBig(r.volume)}{" "}
                {showDelta ? (
                  <Delta
                    value={r.volume_change_pct}
                    kind="pct"
                    worseWhen="neutral"
                  />
                ) : null}
              </span>,
              <span key="n" style={{ fontFamily: MONO }}>
                {r.id === "complaints" ? "All" : fmtP(r.negative_pct)}{" "}
                {showDelta && r.id !== "complaints" ? (
                  <Delta value={r.negative_delta} kind="pts" />
                ) : null}
              </span>,
              <span key="r" style={{ fontFamily: MONO }}>
                {fmtP(r.repeat_pct)}{" "}
                {showDelta ? <Delta value={r.repeat_delta} kind="pts" /> : null}
              </span>,
              <span key="f" style={{ fontFamily: MONO }}>
                {fmtP(r.resolved_pct)}{" "}
                {showDelta ? (
                  <Delta value={r.resolved_delta} kind="pts" worseWhen="down" />
                ) : null}
              </span>,
            ]),
            [
              <strong key="l" style={{ color: C.text }}>
                Public voice
              </strong>,
              <span
                key="v"
                data-testid="public-not-loaded"
                style={{ color: C.textMut }}
              >
                Public data not yet loaded
              </span>,
              "—",
              "—",
              "—",
            ],
          ]}
        />
        <div style={{ fontSize: 12.5, color: C.textMut, lineHeight: 1.5 }}>
          {DEFINITIONS.repeat} Complaints: back within 14 days of the response.
        </div>
      </Tile>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: 14,
        }}
      >
        {channel.rows.map((r) => (
          <ChannelCard
            key={r.id}
            row={r}
            themes={channel.top_themes[r.id] ?? []}
            showDelta={showDelta}
          />
        ))}
        <NotLoadedTile title="Public voice" sources={sources} />
      </div>
    </>
  );
}
