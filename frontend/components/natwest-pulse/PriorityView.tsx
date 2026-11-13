/**
 * NatWest Group · S-DUTY Consumer Duty outcomes (re-bound from the priority view): the four outcomes by segment, the
 * themes behind each, and evidence bound to register entries. Internal and illustrative.
 */

import {
  type DutyOutcome,
  fmtN,
  fmtP,
  type RegisterEntry,
} from "@/lib/natwest-pulse/nw";
import { RegisterLine } from "./Ombudsman";
import { C, MONO, Table, Tile } from "./primitives";

export function DutyView({
  duty,
  evidence,
  segments,
}: {
  duty: DutyOutcome[];
  evidence: RegisterEntry[];
  segments: { id: string; label: string }[];
}) {
  const worst = Math.max(
    ...duty.flatMap((o) => o.segments.map((s) => s.complaints_per_100k)),
  );
  return (
    <>
      <Tile
        title="Outcomes by segment"
        sub="Complaints per 100,000 customers"
        prov={["internal", "joined"]}
        accent
        id="duty-matrix"
      >
        <Table
          head={[
            "Outcome",
            "Negative contacts",
            ...segments.map((s) => s.label),
          ]}
          align={["left", "right", ...segments.map(() => "right" as const)]}
          rows={duty.map((o) => [
            <strong key="l" style={{ color: C.text }}>
              {o.label}
            </strong>,
            <span key="n" style={{ fontFamily: MONO }}>
              {fmtP(o.negative_pct)}
            </span>,
            ...o.segments.map((s) => (
              <span
                key={s.segment}
                style={{
                  fontFamily: MONO,
                  fontWeight: s.complaints_per_100k === worst ? 800 : 500,
                  color: s.complaints_per_100k === worst ? C.text : C.textSec,
                }}
              >
                {s.complaints_per_100k.toFixed(1)}
              </span>
            )),
          ])}
        />
        <div style={{ fontSize: 12.5, color: C.textMut }}>
          Highest cell in bold. Contacts and complaints mapped to an outcome by
          theme.
        </div>
      </Tile>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 14,
        }}
      >
        {duty.map((o) => (
          <Tile
            key={o.id}
            title={o.label}
            sub={`${fmtN(o.complaints)} complaints`}
            prov="internal"
          >
            {o.top_themes.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  fontSize: 14,
                  color: C.textSec,
                }}
              >
                <span>{t.label}</span>
                <span style={{ fontFamily: MONO }}>{fmtN(t.complaints)}</span>
              </div>
            ))}
          </Tile>
        ))}
      </div>
      <Tile title="Evidence" sub="Bound to the register" prov="public">
        {evidence.map((e) => (
          <RegisterLine key={e.id} e={e} />
        ))}
      </Tile>
    </>
  );
}
