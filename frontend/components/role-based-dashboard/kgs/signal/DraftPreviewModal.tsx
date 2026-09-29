"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import { withTs } from "@kgs/lib/label";
import type { DraftBriefSection } from "@kgs/types";
import { GateChip } from "../shared/GateChip";
import { Modal } from "../shared/Overlay";
import { K } from "../shared/tokens";
import { useDemo, useLabel } from "../shell/DemoProvider";
import { HERO_ID } from "./format";

const { draftBrief, evidence, rmas } = signalFw41;
const FEATURED = evidence
  .filter((e) => e.featured)
  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

/** "H1 · lead. For: … Against: … Test: …" → lead plus labelled lines; lead-ins come from the data. */
const HYPOTHESIS =
  /^(.*?)\s+(For:)\s*(.*?)\s+(Against:)\s*(.*?)\s+(Test:)\s*(.*)$/;

const bodyText = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.6,
  color: K.body,
} as const;

function Hypothesis({ text }: { text: string }) {
  const m = HYPOTHESIS.exec(text);
  if (!m) return <p style={bodyText}>{text}</p>;
  const [, lead, ...rest] = m;
  const pairs = [0, 2, 4].map((i) => [rest[i], rest[i + 1]] as const);
  return (
    <div
      style={{
        background: "#131313",
        borderRadius: K.radius.tile,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: K.text,
          lineHeight: 1.5,
        }}
      >
        {lead}
      </div>
      {pairs.map(([label, value]) => (
        <div key={label} style={{ ...bodyText, fontSize: 14 }}>
          <strong style={{ color: K.textSec }}>{label}</strong> {value}
        </div>
      ))}
    </div>
  );
}

function Section({ s }: { s: DraftBriefSection }) {
  const L = useLabel();
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: K.text }}>
        {s.h}
      </h3>
      {s.body ? <p style={bodyText}>{L(s.body)}</p> : null}
      {s.attachFeatured ? (
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {FEATURED.map((e) => (
            <li
              key={e.id}
              style={{
                paddingLeft: 12,
                borderLeft: `2px solid ${K.violet400}`,
              }}
            >
              <div style={{ ...bodyText, fontSize: 14 }}>
                {`\u201c${L(e.text)}\u201d`}
              </div>
              <div style={{ fontSize: 12, color: K.textMut }}>
                {[e.channelLabel, L(e.partnerId), e.localDateLabel].join(" · ")}
              </div>
            </li>
          ))}
          {rmas.map((r) => (
            <li
              key={r.id}
              style={{
                paddingLeft: 12,
                borderLeft: `2px solid ${K.borderLight}`,
                fontSize: 13,
                color: K.textSec,
                fontFamily: K.mono,
              }}
            >
              {r.id} · {r.disposition}
            </li>
          ))}
        </ul>
      ) : null}
      {s.items?.map((item) => (
        <Hypothesis key={item} text={L(item)} />
      ))}
      {s.ordered ? (
        <ol style={{ ...bodyText, margin: 0, paddingLeft: 22 }}>
          {s.ordered.map((o) => (
            <li key={o}>{L(o)}</li>
          ))}
        </ol>
      ) : null}
      {s.footer ? (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: K.textMut,
            fontStyle: "italic",
          }}
        >
          {s.footer}
        </p>
      ) : null}
    </section>
  );
}

/**
 * DraftPreviewModal "View draft" (04 §4.11): a read-only engineering brief. The header chip reads
 * "DRAFT — not sent" until approval, then "APPROVED · {ts}" from the stored approval stamp. The only
 * control is Close; nothing is sent from here.
 */
export function DraftPreviewModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const L = useLabel();
  const { state } = useDemo();
  const approval = state.approvals[HERO_ID];
  return (
    <Modal
      open={open}
      title={L(draftBrief.title)}
      onClose={onClose}
      width={760}
      chip={
        approval ? (
          <GateChip
            status="approved"
            text={withTs(draftBrief.chipApproved, approval.ts)}
          />
        ) : (
          <GateChip status="awaiting" text={draftBrief.chipPending} />
        )
      }
      footer={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12, color: K.textMut }}>
            {draftBrief.footer}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="kgs-focus"
            style={{
              flexShrink: 0,
              padding: "7px 14px",
              borderRadius: K.radius.chip,
              background: "transparent",
              border: `1px solid ${K.borderLight}`,
              color: K.textSec,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {meta.ui.close}
          </button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            fontSize: 13,
            color: K.textMut,
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {draftBrief.meta}
        </div>
        {draftBrief.sections.map((s) => (
          <Section key={s.h} s={s} />
        ))}
      </div>
    </Modal>
  );
}
