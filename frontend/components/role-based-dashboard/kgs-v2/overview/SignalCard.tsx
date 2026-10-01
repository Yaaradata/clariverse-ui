"use client";

import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";

export type OverviewSignal = {
  id: string;
  title: string;
  severity: string;
  severityType: string;
  owner: string;
  pnlTag: string;
  confidence: string;
  hero?: boolean;
  channelMix: Record<string, number>;
  topIntent: string;
  timeWindow: string;
  beforeAfter: { before: string; after: string };
  recommendation: string;
};

const SEVERITY_STYLE: Record<string, { color: string; word: string }> = {
  S2: { color: K.red, word: "S2 · Material" },
  S3: { color: K.amber, word: "S3 · Operational" },
  S4: { color: "#fbbf24", word: "S4 · Watch" },
  improving: { color: K.green, word: "Improving" },
};

const SIGNAL_ROUTE: Record<string, V2View> = {
  "PR-01": "promiseHero",
  "PR-02": "promise",
  "RC-01": "recurringTheme",
  "RC-03": "recurring",
  "IN-01": "install",
};

const CHANNEL_LABEL: Record<string, string> = {
  email: "email",
  help_desk: "help desk",
  service_calls: "service calls",
  salesforce: "Salesforce",
  partner_portal: "portal",
};

function channelLine(mix: Record<string, number>): string {
  return Object.entries(mix)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => CHANNEL_LABEL[k] ?? k)
    .join(" · ");
}

export function SignalCard({ signal }: { signal: OverviewSignal }) {
  const L = useLabel2();
  const { state, setView } = useDemo2();
  const sev = SEVERITY_STYLE[signal.severity] ?? SEVERITY_STYLE.S3;
  const tone = sev.color;
  const approvedTs = state.approvals[signal.id]?.ts;
  const route = SIGNAL_ROUTE[signal.id] ?? "overview";

  return (
    <button
      type="button"
      onClick={() => setView(route)}
      className="kgs2-focus"
      style={{
        width: 252,
        minWidth: 252,
        maxWidth: 252,
        minHeight: 280,
        flex: "0 0 252px",
        borderRadius: 16,
        border: `1px solid ${withAlpha(tone, 0.45)}`,
        background: withAlpha(tone, 0.05),
        color: K.textSec,
        padding: "14px 14px 16px",
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: K.text,
            lineHeight: 1.3,
            minWidth: 0,
          }}
        >
          {L(signal.title)}
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: 999,
            border: `1px solid ${withAlpha(tone, 0.4)}`,
            background: withAlpha(tone, 0.13),
            color: `${tone}dd`,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {sev.word}
        </span>
      </div>

      {approvedTs && signal.id === "PR-01" ? (
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            fontWeight: 700,
            color: K.green,
          }}
        >
          Action approved · {approvedTs}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          fontSize: 11,
          color: K.textMut,
        }}
      >
        <Row label="Channel" value={channelLine(signal.channelMix)} />
        <Row label="Top issue" value={L(signal.topIntent)} />
        <Row label="Time" value={L(signal.timeWindow)} />
      </div>

      <div
        style={{
          marginTop: 14,
          minHeight: 108,
          borderRadius: 12,
          border: `1px solid ${K.borderLight}`,
          background: "rgba(0,0,0,0.25)",
          padding: 10,
          fontSize: 11,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
          flex: 1,
        }}
      >
        <Metric label="Before" value={L(signal.beforeAfter.before)} />
        <Metric label="After" value={L(signal.beforeAfter.after)} tone={tone} />
        <Metric label="Confidence" value={signal.confidence} />
      </div>

      <div
        style={{
          marginTop: 16,
          borderRadius: 12,
          border: `1px solid ${withAlpha(tone, 0.35)}`,
          background: withAlpha(tone, 0.1),
          padding: 12,
          fontSize: 12,
          lineHeight: 1.45,
          color: K.textSec,
        }}
      >
        {signal.owner}: {L(signal.recommendation)}
      </div>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
      <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </span>
      <span style={{ color: K.text, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
      <span style={{ color: K.textMut }}>{label}</span>
      <span
        style={{
          color: tone ?? K.text,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}
