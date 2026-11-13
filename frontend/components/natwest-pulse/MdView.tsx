/**
 * NatWest Group · S-HOME customer pulse (re-bound from the MD's office / Head of CX view): group-wide first, then the
 * pulse by segment, the public layer beside it (never added), the Cora and Ombudsman summaries and the morning brief.
 */

import {
  type BrandId,
  type BriefItem,
  type CoraBlock,
  type FosBlock,
  fmtN,
  fmtP,
  type GroupBlock,
  nwHref,
  type SegmentRow,
  type SourceRow,
  type WindowId,
} from "@/lib/natwest-pulse/nw";
import { MorningBrief } from "./Brief";
import {
  Delta,
  GroupPulse,
  LinkTile,
  NotLoadedTile,
  SegmentPulse,
} from "./Pulse";
import { C, Kpi, PAIRS } from "./primitives";

const ROW = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
  gap: 10,
} as const;

export function MdView({
  group,
  segments,
  cora,
  fos,
  brief,
  sources,
  w,
  b,
  windowLabel,
}: {
  group: GroupBlock;
  segments: SegmentRow[];
  cora: Pick<
    CoraBlock,
    "leakage_pct" | "leakage_delta" | "back_call" | "back_complaint"
  >;
  fos: Pick<FosBlock, "pending" | "at_risk" | "states" | "as_at">;
  brief: BriefItem[];
  sources: SourceRow[];
  w: WindowId;
  b: BrandId;
  windowLabel: string;
}) {
  const showDelta = w !== "w13";
  const eligible = fos.states.find((s) => s.id === "eligible")?.count ?? 0;
  const hrefFor = Object.fromEntries(
    brief.map((it) => [it.id, nwHref(`business/${it.id}`, w, b)]),
  );
  return (
    <>
      <div style={PAIRS}>
        <GroupPulse g={group} windowLabel={windowLabel} showDelta={showDelta} />
        <NotLoadedTile title="Group pulse, in public" sources={sources} />
      </div>
      <SegmentPulse
        rows={segments}
        showDelta={showDelta}
        windowLabel={windowLabel}
      />
      <div style={PAIRS}>
        <LinkTile
          href={nwHref("module/cora_digital", w, b)}
          title="Cora leakage"
          sub="Resolved by Cora, then back"
          prov={["internal", "joined"]}
        >
          <div style={ROW}>
            <Kpi
              label="Back within 7 days"
              value={fmtP(cora.leakage_pct)}
              sub={
                showDelta ? (
                  <Delta value={cora.leakage_delta} kind="pts" />
                ) : (
                  "Of journeys marked resolved"
                )
              }
            />
            <Kpi
              label="As a call"
              value={fmtN(cora.back_call)}
              sub="Within 7 days"
            />
            <Kpi
              label="As a complaint"
              value={fmtN(cora.back_complaint)}
              sub="Within 7 days"
            />
          </div>
        </LinkTile>
        <LinkTile
          href={nwHref("service-promise", w, b)}
          title="Ombudsman watch"
          sub={`As at ${fos.as_at}`}
          prov="internal"
          tone={eligible > 0 ? "red" : undefined}
        >
          <div style={ROW}>
            <Kpi
              label="Awaiting final response"
              value={fmtN(fos.pending)}
              sub="Inside or past the limit"
            />
            <Kpi
              label="Within 7 days of limit"
              value={fmtN(fos.at_risk)}
              sub="Subset of awaiting"
              tone={fos.at_risk ? "amber" : undefined}
            />
            <Kpi
              label="Eligible to refer"
              value={fmtN(eligible)}
              sub="Limit passed, no response"
              tone={eligible ? "red" : undefined}
            />
          </div>
          <div style={{ fontSize: 12.5, color: C.textMut }}>
            Eligibility and risk only; not a prediction.
          </div>
        </LinkTile>
      </div>
      <MorningBrief
        items={brief}
        hrefFor={hrefFor}
        windowLabel={windowLabel}
        showDelta={showDelta}
      />
    </>
  );
}
