"use client";

/**
 * A1 · Action queue: escalation email triage (B7 §1). Core = a static mock of 20 synthetic L2 emails in six buckets.
 * LisN recommends; people send. It never executes.
 */

import { useState } from "react";

import { fmt, fmtDate, fmtDateTime } from "@/lib/hdfc-v3/format";
import type { Bundle, EscalationEmail } from "@/lib/hdfc-v3/types";
import { AnswerLine, C, MONO, MutedNote, Tile, tint } from "./primitives";

const BUCKET_TONE: Record<string, string> = {
  reply_status: C.cyan,
  call_today: C.red,
  escalate: C.red,
  proactive_status: C.amber,
  close_confirm: C.green,
  route_owner: C.violet,
};

function EmailCard({ e }: { e: EscalationEmail }) {
  const [open, setOpen] = useState(false);
  const tone = BUCKET_TONE[e.bucket] ?? C.cyan;
  return (
    <div
      data-testid="email"
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${tone}`,
        borderRadius: 10,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
          fontSize: 12.5,
          color: C.textMut,
        }}
      >
        <span style={{ fontFamily: MONO }}>
          {e.id} · {fmtDateTime(e.received_at)}
        </span>
        <span>
          {e.product_label} · {e.language}
          {e.sender === "proxy" ? " · from the customer's assistant" : ""}
        </span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 650, color: C.text }}>
        {e.subject}
      </div>
      {/* The body takes the spare height, so backend status and the draft button line up across a row of cards. */}
      <div
        style={{ fontSize: 13.5, color: C.textSec, lineHeight: 1.5, flex: 1 }}
      >
        {e.body}
      </div>
      <div
        style={{
          fontSize: 13,
          color: C.textSec,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "6px 8px",
        }}
      >
        <span style={{ color: C.textMut }}>Backend status: </span>
        {e.backend_status}
      </div>
      {e.draft_reply ? (
        <div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            style={{
              background: "transparent",
              border: `1px solid ${tint(tone, 0.4)}`,
              color: tone,
              borderRadius: 999,
              padding: "3px 10px",
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            {open ? "Hide draft reply" : "Show draft reply"}
          </button>
          {open ? (
            <div
              style={{
                marginTop: 6,
                fontSize: 13.5,
                color: C.textSec,
                lineHeight: 1.55,
                borderLeft: `2px solid ${tint(tone, 0.5)}`,
                paddingLeft: 10,
              }}
            >
              {e.draft_reply}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginTop: 6,
                }}
              >
                <button
                  type="button"
                  disabled
                  title="Mock: in the bank's system an agent approves, edits and sends. LisN never sends."
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    color: C.textSec,
                    borderRadius: 999,
                    padding: "3px 10px",
                    fontSize: 12.5,
                    cursor: "not-allowed",
                  }}
                >
                  Approve and send (agent)
                </button>
                <span style={{ fontSize: 12, color: C.textMut }}>
                  Draft only: a person approves, edits and sends. LisN never
                  sends.
                </span>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** First and last received dates of the queue, e.g. "25 Sep to 28 Sep". */
function receivedRange(emails: EscalationEmail[]): string {
  const at = emails.map((e) => e.received_at).sort();
  if (!at.length) return "—";
  const a = fmtDate(at[0]);
  const z = fmtDate(at[at.length - 1]);
  return a === z ? a : `${a} to ${z}`;
}

export function ActionQueue({ b }: { b: Bundle }) {
  const t = b.v3.triage;
  const emails = b.v3.emails;
  const saved =
    t.total * (t.manual_minutes_per_email - t.assisted_minutes_per_email);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Tile prov="internal" accent tone="red">
        <AnswerLine sub="Each email is read against its backend status and the deliverable clock, then sorted into one of six buckets. LisN recommends; people send. It never executes.">
          {fmt(t.total)} escalation emails in the L2 queue (received{" "}
          {receivedRange(emails)}):{" "}
          {t.buckets
            .filter((x) => x.id === "call_today" || x.id === "escalate")
            .map(
              (x) =>
                `${fmt(x.count)} ${x.id === "call_today" ? "to call today" : "to escalate"}`,
            )
            .join(", ")}
          ; {fmt(t.buckets.find((x) => x.id === "reply_status")?.count)} can be
          answered now from the backend status.
        </AnswerLine>
      </Tile>

      <Tile title="Buckets" prov="internal" tone="violet">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
            gap: 8,
          }}
        >
          {t.buckets.map((x, i) => (
            <a
              key={x.id}
              href={`#${x.id}`}
              style={{
                textDecoration: "none",
                background: tint(BUCKET_TONE[x.id], 0.06),
                border: `1px solid ${tint(BUCKET_TONE[x.id], 0.3)}`,
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <div style={{ fontSize: 12.5, color: C.textMut }}>
                Bucket {i + 1}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: C.text,
                  fontWeight: 650,
                  lineHeight: 1.3,
                }}
              >
                {x.label}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  fontFamily: MONO,
                  color: BUCKET_TONE[x.id],
                }}
              >
                {fmt(x.count)}
              </div>
            </a>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: 8,
            fontSize: 14,
            color: C.textSec,
          }}
        >
          <div>
            Time saved on this batch:{" "}
            <strong style={{ color: C.text }}>{fmt(saved)} minutes</strong> (
            {t.manual_minutes_per_email} to {t.assisted_minutes_per_email}{" "}
            minutes per email)
          </div>
          <div>
            Projected time to resolve:{" "}
            <strong style={{ color: C.text }}>
              {t.projected_days_to_resolve} days
            </strong>{" "}
            against a baseline of {t.baseline_days_to_resolve} days
          </div>
        </div>
        <MutedNote>
          Time and resolution figures are illustrative assumptions for the demo,
          to be replaced with the email team&apos;s own measures in discovery.
        </MutedNote>
      </Tile>

      {t.buckets.map((x, i) => (
        <Tile
          key={x.id}
          id={x.id}
          title={`${i + 1}. ${x.label}`}
          sub={`${fmt(x.count)} ${x.count === 1 ? "email" : "emails"}`}
          prov="internal"
          tone={x.id === "call_today" || x.id === "escalate" ? "red" : "cyan"}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
              gap: 10,
            }}
          >
            {emails
              .filter((e) => e.bucket === x.id)
              .map((e) => (
                <EmailCard key={e.id} e={e} />
              ))}
          </div>
        </Tile>
      ))}
    </div>
  );
}
