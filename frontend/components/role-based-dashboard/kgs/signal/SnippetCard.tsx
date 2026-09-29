"use client";

import { meta, signalFw41 } from "@kgs/lib/data";
import type { EvidenceChannel, EvidenceSnippet } from "@kgs/types";
import {
  FileText,
  type LucideIcon,
  Mail,
  Moon,
  Phone,
  RotateCcw,
} from "lucide-react";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { fill } from "./format";

const CHANNEL_ICON: Record<EvidenceChannel, LucideIcon> = {
  call: Phone,
  case: FileText,
  email: Mail,
  rma: RotateCcw,
  afterHours: Moon,
};

/** Known (solid) vs Inferred (hatched) pill; "I" names what the firmware was imputed from. */
function KIPill({ snippet }: { snippet: EvidenceSnippet }) {
  const known = snippet.firmwareSource === "record";
  const tip = known
    ? signalFw41.signal.confidence.known.label
    : fill(meta.ui.hero.inferredTooltip, {
        imputedFrom: snippet.imputedFrom ?? "",
      });
  return (
    <span
      role="img"
      title={tip}
      aria-label={`${known ? "K" : "I"} · ${tip}`}
      style={{
        flexShrink: 0,
        fontSize: 11,
        fontWeight: 800,
        fontFamily: K.mono,
        width: 22,
        height: 20,
        display: "grid",
        placeItems: "center",
        borderRadius: 6,
        color: known ? K.bg : K.text,
        background: known
          ? K.textSec
          : `repeating-linear-gradient(45deg, ${withAlpha(K.textSec, 0.45)} 0 3px, transparent 3px 6px)`,
        border: `1px solid ${K.textSec}`,
      }}
    >
      {known ? "K" : "I"}
    </span>
  );
}

/**
 * Evidence snippet (03 §6.7): channel icon + source line, K/I pill, quote with the matched phrase
 * highlighted, optional note, disabled "Open source interaction". The label helper runs on both the
 * text and the highlight before splitting, so the highlight still matches when anonymised.
 */
export function SnippetCard({ snippet }: { snippet: EvidenceSnippet }) {
  const L = useLabel();
  const Icon = CHANNEL_ICON[snippet.channel];
  const text = L(snippet.text);
  const phrase = snippet.highlight ? L(snippet.highlight) : "";
  const at = phrase ? text.indexOf(phrase) : -1;
  const { drawer } = signalFw41;

  return (
    <article
      style={{
        background: "#131313",
        borderRadius: K.radius.tile,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon size={15} color={K.textMut} aria-hidden />
        <span style={{ flex: 1, fontSize: 13, color: K.textMut }}>
          {[
            snippet.channelLabel,
            L(snippet.partnerId),
            L(snippet.place),
            snippet.localDateLabel,
          ].join(" · ")}
        </span>
        <KIPill snippet={snippet} />
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.6,
          color: "#f5f5f5",
        }}
      >
        {"\u201c"}
        {at >= 0 ? (
          <>
            {text.slice(0, at)}
            <mark
              style={{
                background: withAlpha("#8b5cf6", 0.2),
                color: "inherit",
                borderBottom: `1px solid ${K.violet400}`,
                padding: "0 1px",
              }}
            >
              {phrase}
            </mark>
            {text.slice(at + phrase.length)}
          </>
        ) : (
          text
        )}
        {"\u201d"}
      </p>
      {snippet.note ? (
        <div
          style={{
            fontSize: 12,
            color: K.textMut,
            fontFamily: K.mono,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {snippet.note}
        </div>
      ) : null}
      <button
        type="button"
        aria-disabled
        title={drawer.sourceLinkTooltip}
        onClick={(e) => e.preventDefault()}
        className="kgs-focus"
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: "none",
          padding: 0,
          fontSize: 13,
          color: K.textMut,
          fontFamily: "inherit",
          cursor: "not-allowed",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        {meta.ui.hero.sourceLink}
      </button>
    </article>
  );
}
