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
  return (
    <div
      data-testid="l2-footnotes"
      style={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {notes.map((n) => (
        <MutedNote key={n}>* {n}</MutedNote>
      ))}
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
  caption?: string;
}) {
  const max = Math.max(...v.by_source.map((s) => s.share ?? 0), 1);
  const t = trend ? trendPoints(trend) : null;
  return (
    <div
      data-testid="outside-meter"
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <div style={cols(3, 100, 8)}>
        <Stat label="Public items" f={v.items} info={defs.l2_items} />
        <Stat
          label="Escalation language"
          f={v.escalation}
          info={defs.escalation_public}
        />
        <Stat label="Responded" f={v.responded} info={defs.responded} />
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
      {rating ? (
        <div
          data-register={rating.id}
          style={{ fontSize: 13, color: C.textSec }}
        >
          {rating.label}:{" "}
          <strong style={{ color: C.text, fontFamily: MONO }}>
            {rating.display}
          </strong>{" "}
          from {rating.ratings_display} ratings · as of {fmtDate(rating.as_of)}
        </div>
      ) : null}
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
      <Footnotes notes={v.footnotes} />
      {caption ? <MutedNote>{caption}</MutedNote> : null}
    </div>
  );
}

/** A card's "what customers said": the topic lines (or the thin state per line), the theme, switching talk. */
export function CardVoiceBlock({ v }: { v: CardVoice }) {
  return (
    <div
      data-testid="card-voice"
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      {v.theme ? (
        <div>
          <ThemeLine t={v.theme} />
        </div>
      ) : null}
      {v.lines.map((l) => (
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
          {l.thin ? (
            <Thin text={v.text} />
          ) : (
            <strong style={{ color: C.text, fontFamily: MONO }}>
              {l.fig.display}
            </strong>
          )}
        </div>
      ))}
      {v.switching ? (
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
          {v.switching_thin ? (
            <Thin text={v.text} />
          ) : (
            <strong style={{ color: C.text }}>{v.switching.display}</strong>
          )}
        </div>
      ) : null}
      <MutedNote>
        Public items in scope: <Fig f={v.items} />. Public, unverified;
        paraphrased.
      </MutedNote>
      <Footnotes notes={v.footnotes} />
    </div>
  );
}
