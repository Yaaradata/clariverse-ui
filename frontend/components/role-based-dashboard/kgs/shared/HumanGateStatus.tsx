"use client";

import type { GateStatus } from "@kgs/types";
import {
  CheckCircle2,
  CircleSlash,
  Clock,
  FileText,
  type LucideIcon,
  Undo2,
} from "lucide-react";
import type { ReactNode } from "react";
import { K, withAlpha } from "./tokens";

const STYLE: Record<
  GateStatus,
  { bg: string; border: string; bar: string; icon: LucideIcon }
> = {
  draft: {
    bg: "#131313",
    border: K.chipBorder,
    bar: "#737373",
    icon: FileText,
  },
  awaiting: {
    bg: "#1f190d",
    border: withAlpha(K.amber, 0.4),
    bar: K.amber,
    icon: Clock,
  },
  approved: {
    bg: "#101b13",
    border: withAlpha(K.green, 0.35),
    bar: K.green,
    icon: CheckCircle2,
  },
  returned: {
    bg: "#131313",
    border: K.chipBorder,
    bar: K.textMut,
    icon: Undo2,
  },
  not_sent: {
    bg: "transparent",
    border: "transparent",
    bar: "transparent",
    icon: CircleSlash,
  },
};

/**
 * HumanGateStatus (03 §6.6): the most prominent block on the hero, keyed to gate state
 * (r=12, p16, 3px left bar). `not_sent` renders as an inline secondary line. The background,
 * border and bar crossfade over 300ms when the state changes; the approved check draws in.
 */
export function HumanGateStatus({
  status,
  title,
  auditLine,
  children,
}: {
  status: GateStatus;
  title: string;
  auditLine?: string;
  children?: ReactNode;
}) {
  const s = STYLE[status];
  const Icon = s.icon;
  if (status === "not_sent") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          fontSize: 13,
          color: K.textMut,
          lineHeight: 1.45,
        }}
      >
        <Icon size={15} aria-hidden style={{ flexShrink: 0, marginTop: 2 }} />
        {title}
      </div>
    );
  }
  return (
    <div
      aria-live="polite"
      style={{
        borderRadius: K.radius.tile,
        padding: 16,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderLeft: `3px solid ${s.bar}`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition:
          "background-color 300ms ease, border-color 300ms ease, border-left-color 300ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Icon
          key={status}
          size={18}
          color={s.bar}
          aria-hidden
          className={status === "approved" ? "kgs-check" : undefined}
          style={{ flexShrink: 0, marginTop: 1 }}
        />
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: K.text,
            lineHeight: 1.4,
          }}
        >
          {title}
        </div>
      </div>
      {auditLine ? (
        <div
          key={auditLine}
          className={status === "approved" ? "kgs-slide" : undefined}
          style={{
            fontSize: 13,
            color: K.textMut,
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
            paddingLeft: 28,
          }}
        >
          {auditLine}
        </div>
      ) : null}
      {children ? (
        <div
          style={{
            paddingLeft: 28,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
