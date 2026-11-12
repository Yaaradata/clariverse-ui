import { C, MutedNote, Tile } from "./primitives";
import { DEFS } from "./V4";

/** B11 item 10. Definitions match the ⓘ text on the dials (V4.tsx DEFS) where both exist. */
const TERMS: [string, string][] = [
  ["Complaint", DEFS.complaint],
  ["Query", DEFS.query],
  ["Request", DEFS.request],
  ["Total customer interactions", DEFS.total],
  ["Inside the bank", DEFS.inside],
  ["Public", DEFS.public],
  ["Resolved", DEFS.resolved],
  ["Open", DEFS.open],
  ["Waiting on customer", DEFS.waiting],
  ["Open too long", DEFS.otl],
  ["Responded", DEFS.responded],
  [
    "TAT",
    "Turnaround time: the time the bank allows itself, or the regulator allows it, to close an item. Bank TATs are confirmed in discovery; published RBI timelines are used where they apply.",
  ],
  [
    "SDR",
    "Same-day resolution: the share of items resolved on the day they came in. Definition confirmed in discovery.",
  ],
  [
    "FTR",
    "First-time resolution: the share of items resolved in the first contact, with no repeat contact. Definition confirmed in discovery.",
  ],
  [
    "FTNR",
    "First-time not resolved: items that needed a further contact after the first. Definition confirmed in discovery.",
  ],
  [
    "IO",
    "Internal Ombudsman: the bank's own reviewer of complaints it has rejected in full or in part, before the customer goes to the RBI Ombudsman.",
  ],
  [
    "PNO",
    "Principal Nodal Officer: the senior officer the bank names to handle complaints escalated beyond the grievance desk.",
  ],
  [
    "High-impact complaint",
    "A complaint that names a regulator, uses legal language, comes on a third contact or has public reach. A property of the complaint, never of the person.",
  ],
  [
    "Ombudsman risk",
    "A complaint near or past day 30 without a reply, or a customer unhappy with the reply, within the 90 days they have to approach the RBI Ombudsman.",
  ],
  [
    "Simulated / illustrative",
    "Internal figures are synthetic until discovery. Public figures are collected, except bank replies outside the Play Store, which are simulated.",
  ],
];

export function Glossary() {
  return (
    <Tile title="Terms" prov={["internal", "public"]} tone="violet">
      <dl style={{ margin: 0, display: "grid", gap: 10 }}>
        {TERMS.map(([t, d]) => (
          <div
            key={t}
            data-testid="glossary-term"
            style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}
          >
            <dt style={{ fontWeight: 800, fontSize: 15 }}>{t}</dt>
            <dd style={{ margin: "2px 0 0", color: C.textSec, fontSize: 14 }}>
              {d}
            </dd>
          </div>
        ))}
      </dl>
      <MutedNote>
        Every dial carries the same definition behind its ⓘ.
      </MutedNote>
    </Tile>
  );
}
