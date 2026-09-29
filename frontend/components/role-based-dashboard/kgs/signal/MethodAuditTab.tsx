"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { withTs } from "@kgs/lib/label";
import { IllustrativeChip } from "../shared/IllustrativeChip";
import { K } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";
import { HERO_ID } from "./format";

const MONEY = /[$£]/;
const BRIEF = signalFw41.signal.gates.find(
  (g) => g.artefactType === "investigation-brief",
);

/**
 * Method & audit tab (04 §4.10). Audit log newest first: runtime lines (approval, decision request,
 * first drawer open this session) read their stored ts, then the static audit entries.
 */
export function MethodAuditTab() {
  const L = useLabel();
  const { state } = useDemo();
  const { method, audit, auditRuntime } = signalFw41;
  const approval = state.approvals[HERO_ID];
  const request = state.decisionRequested[HERO_ID];

  const runtime: string[] = [];
  if (approval && BRIEF?.onApprove)
    runtime.push(L(withTs(BRIEF.onApprove.auditEntry, approval.ts)));
  if (request && BRIEF?.decisionRequest)
    runtime.push(L(withTs(BRIEF.decisionRequest.auditEntry, request.ts)));
  if (state.drawerOpenedAt) runtime.push(L(auditRuntime.drawerOpen));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <dl
        style={{
          margin: 0,
          display: "grid",
          gridTemplateColumns: "150px 1fr",
          gap: "8px 12px",
          fontSize: 14,
        }}
      >
        {method.map((m) => (
          <div key={m.k} style={{ display: "contents" }}>
            <dt style={{ color: K.textMut, fontSize: 13 }}>{L(m.k)}</dt>
            <dd
              style={{
                margin: 0,
                color: K.textSec,
                lineHeight: 1.5,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {L(m.v)}
              {MONEY.test(m.v) ? <IllustrativeChip /> : null}
            </dd>
          </div>
        ))}
      </dl>
      <section>
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 14,
            fontWeight: 700,
            color: K.text,
          }}
        >
          {L(meta.ui.hero.auditLog)}
        </h3>
        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {runtime.map((line) => (
            <li
              key={line}
              className="kgs-slide"
              style={{
                fontSize: 13,
                color: K.textSec,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                paddingLeft: 10,
                borderLeft: `2px solid ${K.violet400}`,
              }}
            >
              {line}
            </li>
          ))}
          {audit.map((a) => (
            <li
              key={a.ts}
              style={{
                fontSize: 13,
                color: K.textMut,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                paddingLeft: 10,
                borderLeft: `2px solid ${K.borderLight}`,
              }}
            >
              {L(a.label)}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
