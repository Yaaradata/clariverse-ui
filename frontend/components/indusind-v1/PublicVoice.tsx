"use client";

/**
 * Public voice (L2) parts, shared by every screen: the outside meter, a top-theme cell, the voice block in a card and
 * the thin state. Figures arrive precomputed and bound to L2 ids; a claim on fewer than the minimum items arrives
 * as `thin` and shows "Not enough public items this window". Volume is neutral; negative share is shown only when
 * the payload carries it (after the sentiment check).
 */

import type { ReactNode } from "react";

import { fmtDate } from "@/lib/indusind-v1/format";
import type {
  CardVoice,
  Fig as FigT,
  Rating,
  Theme,
  Trend,
  VoiceBlock,
} from "@/lib/indusind-v1/types";
import { AreaChart, trendPoints } from "./charts";
import {
  C,
  cols,
  Fig,
  Info,
  Label,
  MONO,
  MutedNote,
  ShareBar,
} from "./primitives";

export function Thin({ text }: { text: string }) {
  return (
    <span
      data-thin
      style={{ fontSize: 12.5, color: C.textMut, fontStyle: "italic" }}
    >
      {text}
    </span>
  );
}

export function Footnotes({ notes }: { notes: string[] }) {
  if (!notes.length) return null;
  // Source caveats sit behind an (i): the executive view stays numbers first (HL-22); the notes stay one tap away.
  return (
    <div
      data-testid="l2-footnotes"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: C.textMut,
      }}
    >
      Source notes ({notes.length})
      <Info text={notes.map((n) => `* ${n}`).join(" ")} label="source notes" />
    </div>
  );
}

/** The top theme: label in bold, the hand-written paraphrase, and its item count. */
export function ThemeLine({ t, compact }: { t: Theme; compact?: boolean }) {
  if (t.thin) return <Thin text={t.text} />;
  return (
    <span
      data-register={t.count.id}
      style={{
        fontSize: compact ? 12.5 : 13.5,
        color: C.textSec,
        lineHeight: 1.45,
      }}
    >
      <strong style={{ color: C.text }}>{t.label}</strong>
      {compact ? null : <>: {t.paraphrase}</>}{" "}
      <span style={{ color: C.textMut, fontFamily: MONO }}>
        (<Fig f={t.count} />)
      </span>
    </span>
  );
}

function Stat({
  label,
  f,
  info,
  children,
}: {
  label: string;
  f: FigT | null;
  info?: string;
  children?: ReactNode;
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 11.5,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "flex",
          gap: 6,
        }}
      >
        {label}
        {info ? <Info text={info} label={label} /> : null}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 22,
          fontWeight: 800,
          color: C.text,
          marginTop: 3,
        }}
      >
        {f ? <Fig f={f} /> : "—"}
      </div>
      {children}
    </div>
  );
}

/** Home and Cards: the outside meter. Items by source, escalation language, responded, the top theme. */
export function OutsideMeter({
  v,
  defs,
  rating,
  trend,
  caption,
}: {
  v: VoiceBlock;
  defs: Record<string, string>;
  rating?: Rating | null;
  trend?: Trend & { starts: string | null };
  before?: { to: string; items: FigT } | null;
  caption?: string;
}) {
  const max = Math.max(...v.by_source.map((s) => s.share ?? 0), 1);
  const t = trend ? trendPoints(trend) : null;
  return (
    <div
      data-testid="outside-meter"
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <div data-testid="l2-period" style={{ fontSize: 12, color: C.textMut }}>
        INDIE app reviews (Google Play, App Store), {v.period}
        {v.footnotes[0] ? (
          <div style={{ color: C.amber, marginTop: 2 }}>{v.footnotes[0]}</div>
        ) : null}
      </div>
      <div style={cols(3, 100, 8)}>
        <Stat label="Public items" f={v.items} info={defs.l2_items} />
        <Stat
          label="Escalation language"
          f={v.escalation.thin ? null : v.escalation}
          info={defs.escalation_public}
        >
          {v.escalation.thin ? <Thin text="Fewer than 15 items" /> : null}
        </Stat>
        <Stat
          label="Play Store · bank replied"
          f={v.responded}
          info={defs.responded}
        >
          {v.responded ? (
            <div style={{ fontSize: 12, color: C.textMut }}>
              n = {v.responded.n_display}
            </div>
          ) : null}
        </Stat>
      </div>
      {v.negative ? <Stat label="Negative share" f={v.negative} /> : null}
      <div>
        <Label>By source</Label>
        {v.by_source.map((s) => (
          <ShareBar
            key={s.id}
            label={s.label}
            f={s}
            max={max}
            right={
              <span>
                {s.display} · {s.share}%
              </span>
            }
          />
        ))}
      </div>
      <div>
        <Label>Top theme</Label>
        <div style={{ marginTop: 3 }}>
          <ThemeLine t={v.theme} />
        </div>
      </div>
      {t && t.values.length > 1 ? (
        <div>
          <Label>
            App flagged as unsafe, share of the week's app items
            <Info text={defs.security_trend} />
          </Label>
          <div style={{ position: "relative", height: 56, marginTop: 4 }}>
            <AreaChart
              id="l2-security"
              values={t.values}
              color={C.cyan}
              height="100%"
              title="App flagged as unsafe, weekly share"
              points={{ ...t.points, unit: "%" }}
            />
          </div>
        </div>
      ) : null}
      <Footnotes notes={v.footnotes.slice(1)} />
      {rating ? (
        // The listing rating is all-time and dated: it sits apart from the window's figures.
        <div
          data-register={rating.id}
          style={{
            fontSize: 12.5,
            color: C.textMut,
            borderTop: `1px solid ${C.border}`,
            paddingTop: 8,
          }}
        >
          {rating.label}, as of {fmtDate(rating.as_of)}:{" "}
          <strong style={{ color: C.text, fontFamily: MONO }}>
            {rating.display}
          </strong>{" "}
          from {rating.ratings_display} reviews (Google Play, India listing).
        </div>
      ) : null}
      {caption ? <MutedNote>{caption}</MutedNote> : null}
    </div>
  );
}

/** A card's "what customers said": the topic lines (or the thin state per line), the theme, switching talk. */
export function CardVoiceBlock({ v }: { v: CardVoice }) {
  // Lines with too few items collapse into one line, so a block never repeats the thin state.
  const thin = [
    ...v.lines.filter((l) => l.thin).map((l) => l.label),
    ...(v.switching && v.switching_thin ? [v.switching.label] : []),
  ];
  return (
    <div
      data-testid="card-voice"
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      {v.theme && !v.theme.thin ? (
        <div>
          <ThemeLine t={v.theme} />
        </div>
      ) : null}
      {v.lines
        .filter((l) => !l.thin)
        .map((l) => (
          <div
            key={l.topic}
            data-register={l.fig.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              fontSize: 13,
              color: C.textSec,
            }}
          >
            <span style={{ minWidth: 0 }}>{l.label}</span>
            <strong style={{ color: C.text, fontFamily: MONO }}>
              {l.fig.display}
            </strong>
          </div>
        ))}
      {thin.length ? (
        <div data-thin style={{ fontSize: 12.5, color: C.textMut }}>
          <span style={{ fontStyle: "italic" }}>{v.text}:</span>{" "}
          {thin.join(", ")}
        </div>
      ) : null}
      {v.switching && !v.switching_thin ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            fontSize: 13,
            color: C.textSec,
          }}
        >
          <span>{v.switching.label}</span>
          <strong style={{ color: C.text }}>{v.switching.display}</strong>
        </div>
      ) : null}
      <MutedNote>
        Public items in scope, {v.period}: <Fig f={v.items} />. Public,
        unverified; paraphrased.
      </MutedNote>
      <Footnotes notes={v.footnotes} />
    </div>
  );
}
