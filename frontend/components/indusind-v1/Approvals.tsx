"use client";

/**
 * S-APPR · Approvals (mock): one list of drafted actions across the cards. Approve and Return change the status in
 * this browser only; the audit line records the approver role, the time (IST) and the evidence version. Nothing is
 * sent or executed.
 */

import { useState } from "react";

import { fmtDate, fmtStamp } from "@/lib/indusind-v1/format";
import type { Action, Fig as FigT, TitlePart } from "@/lib/indusind-v1/types";
import { C, Chip, MutedNote, Tile, tint } from "./primitives";
import { FigRow, TitleLine } from "./SignalCards";

export type ApprovalItem = Action & {
  card_title_parts: TitlePart[];
  evidence: FigT[];
};

type Local = { status: string; at: string };

function nowIst(): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  })
    .format(new Date())
    .replace(",", "");
}

export function ApprovalsView({
  actions,
  banner,
}: {
  actions: ApprovalItem[];
  banner: string;
}) {
  const [local, setLocal] = useState<Record<string, Local>>({});
  const set = (id: string, status: string) =>
    setLocal((m) => ({ ...m, [id]: { status, at: nowIst() } }));
  return (
    <>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 750 }}>Approvals</h2>
        <div style={{ fontSize: 13, color: C.textMut }}>
          Drafted actions awaiting a decision
        </div>
      </div>
      <div
        data-testid="banner"
        style={{
          border: `1px solid ${tint(C.violet, 0.35)}`,
          background: tint(C.violet, 0.08),
          color: C.text,
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {banner}
      </div>
      {actions.map((a) => {
        const l = local[a.action_id];
        const status = l?.status ?? a.status;
        const tone =
          status === "approved"
            ? C.green
            : status === "returned"
              ? C.textMut
              : C.amber;
        return (
          <Tile
            key={a.action_id}
            title={<TitleLine parts={a.card_title_parts} />}
            sub={a.owner_role}
            layers={["L1", "L3"]}
            tone="violet"
            right={
              <Chip label="Status" color={tone}>
                {status}
              </Chip>
            }
          >
            <dl
              style={{
                margin: 0,
                display: "grid",
                gridTemplateColumns: "max-content 1fr",
                gap: "4px 12px",
                fontSize: 13.5,
              }}
            >
              <dt style={{ color: C.textMut }}>Scope</dt>
              <dd style={{ margin: 0, color: C.text }}>{a.scope}</dd>
              <dt style={{ color: C.textMut }}>Ask</dt>
              <dd style={{ margin: 0, color: C.text }}>{a.ask}</dd>
              <dt style={{ color: C.textMut }}>Cost cap</dt>
              <dd style={{ margin: 0, color: C.text }}>
                {a.cost_cap_note ?? "None"}
              </dd>
              <dt style={{ color: C.textMut }}>Success</dt>
              <dd style={{ margin: 0, color: C.text }}>{a.success_measure}</dd>
              <dt style={{ color: C.textMut }}>Review</dt>
              <dd style={{ margin: 0, color: C.text }}>
                {fmtDate(a.review_date)}
              </dd>
              <dt style={{ color: C.textMut }}>Approver</dt>
              <dd style={{ margin: 0, color: C.text }}>{a.approver_role}</dd>
            </dl>
            <details>
              <summary
                style={{ fontSize: 13, color: C.brandInk, cursor: "pointer" }}
              >
                Evidence
              </summary>
              <div style={{ marginTop: 4 }}>
                {a.evidence.map((f) => (
                  <FigRow key={f.id + (f.period ?? "")} f={f} />
                ))}
              </div>
            </details>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                data-testid="approve"
                disabled={status !== a.status}
                onClick={() => set(a.action_id, "approved")}
                style={{
                  background: status !== a.status ? C.cardAlt : C.brand,
                  color: status !== a.status ? C.textMut : "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: status !== a.status ? "default" : "pointer",
                }}
              >
                Approve
              </button>
              <button
                type="button"
                data-testid="return"
                disabled={status !== a.status}
                onClick={() => set(a.action_id, "returned")}
                style={{
                  background: "transparent",
                  color: status !== a.status ? C.textMut : C.textSec,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "6px 14px",
                  fontSize: 13,
                  cursor: status !== a.status ? "default" : "pointer",
                }}
              >
                Return
              </button>
              {l ? (
                <button
                  type="button"
                  onClick={() =>
                    setLocal((m) => {
                      const n = { ...m };
                      delete n[a.action_id];
                      return n;
                    })
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    color: C.brandInk,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  Undo
                </button>
              ) : null}
            </div>
            <MutedNote>
              {l ? (
                <span data-testid="audit">
                  Audit: {l.status} by {a.approver_role} at {l.at} IST, on the
                  evidence of {fmtStamp(a.evidence_version)} IST. This browser
                  only.
                </span>
              ) : (
                <>Evidence version {fmtStamp(a.evidence_version)} IST.</>
              )}
            </MutedNote>
          </Tile>
        );
      })}
    </>
  );
}
