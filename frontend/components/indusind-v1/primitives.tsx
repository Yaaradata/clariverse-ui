"use client";

/**
 * IndusInd · global components, copied from the earlier LisN demo (dark canvas, inline styles, Outfit / JetBrains Mono).
 * Five colours, one meaning each: red is a breach or worse, amber needs attention, green improving, cyan neutral data
 * and volume, violet the brand and owners.
 *
 * Every figure renders through <Fig>: its register, L2 or L3 id goes in `data-register`, never in visible text. A
 * register value IND-D1 has not verified renders as a greyed "pending verification" chip.
 */

import Link from "next/link";
import { type CSSProperties, type ReactNode, useState } from "react";

import { v } from "@/lib/indusind-v1/theme";
import type { Fig as FigT, Layer, NotLoaded } from "@/lib/indusind-v1/types";

export const C = {
  bg: v("bg"),
  surface: v("surface"),
  card: v("card"),
  cardAlt: v("card-alt"),
  border: v("border"),
  borderLight: v("border-light"),
  text: v("text"),
  textSec: v("text-sec"),
  textMut: v("text-mut"),
  textDim: v("text-dim"),
  track: v("track"),
  inner: v("inner"),
  accent: v("accent"),
  green: v("green"),
  red: v("red"),
  amber: v("amber"),
  cyan: v("cyan"),
  violet: v("violet"),
  brand: v("brand"),
  brandInk: v("brand-ink"),
  neutral: v("neutral"),
  header: v("header"),
  tooltip: v("tooltip"),
  hover: v("hover"),
} as const;

export type Tone = "red" | "amber" | "green" | "cyan" | "violet";

export const TONE: Record<Tone, string> = {
  red: C.red,
  amber: C.amber,
  green: C.green,
  cyan: C.cyan,
  violet: C.violet,
};

function mix(color: string, a: number) {
  return `color-mix(in srgb, ${color} ${Math.round(a * 100)}%, transparent)`;
}

/** A colour at opacity `a`. Works on theme variables (via color-mix) and on plain hex. */
export function tint(hex: string, a: number) {
  if (!hex.startsWith("#")) return mix(hex, a);
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export const MONO = "var(--mono), ui-monospace, monospace";

/** Grid of at most `n` columns that drops to fewer once a column would be narrower than `min`. */
export function cols(n: number, min: number, gap: number): CSSProperties {
  const share = `calc((100% - ${(n - 1) * gap}px) / ${n})`;
  return {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, max(${min}px, ${share})), 1fr))`,
    gap,
  };
}

/* ---------------------------------------------------------------- source tags */

export const LAYER_LABEL: Record<Layer, string> = {
  L1: "Public · verified",
  L2: "Public · live",
  L3: "Internal · illustrative until discovery",
};

const LAYER_TONE: Record<Layer, Tone> = {
  L1: "cyan",
  L2: "cyan",
  L3: "violet",
};

/** The source tag every tile carries: one per layer it shows. */
export function SourceTag({ layer }: { layer: Layer }) {
  const tone = TONE[LAYER_TONE[layer]];
  return (
    <span
      data-testid="prov"
      data-layer={layer}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11.5,
        color: tone,
        border: `1px solid ${tint(tone, 0.3)}`,
        borderRadius: 999,
        padding: "1px 9px",
        background: tint(tone, 0.07),
        maxWidth: "100%",
      }}
    >
      <span
        aria-hidden
        style={{ width: 6, height: 6, borderRadius: 999, background: tone }}
      />
      {LAYER_LABEL[layer]}
    </span>
  );
}

/* ---------------------------------------------------------------- figures */

/** The greyed chip a register value shows until IND-D1 verifies it. */
export function Pending({ text = "pending verification" }: { text?: string }) {
  return (
    <span
      data-pending
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11.5,
        fontWeight: 600,
        fontFamily: "inherit",
        color: C.textMut,
        background: C.inner,
        border: `1px dashed ${C.borderLight}`,
        borderRadius: 6,
        padding: "1px 7px",
        whiteSpace: "nowrap",
        letterSpacing: 0,
        verticalAlign: "middle",
      }}
    >
      {text}
    </span>
  );
}

function figTitle(f: FigT): string | undefined {
  const parts = [
    f.label,
    f.period,
    f.basis ? `basis: ${f.basis}` : null,
    f.note,
  ]
    .filter(Boolean)
    .join(" · ");
  return parts || undefined;
}

/** One bound figure. Pending register values show the greyed chip; everything else its precomputed display. */
export function Fig({
  f,
  style,
  color,
}: {
  f: FigT;
  style?: CSSProperties;
  color?: string;
}) {
  const pending =
    f.pending ||
    (f.layer === "L1" && f.value === null) ||
    f.display === "pending verification";
  return (
    <span
      data-register={f.id}
      data-layer={f.layer}
      title={figTitle(f)}
      style={{ color, ...style }}
    >
      {pending ? <Pending /> : f.display}
    </span>
  );
}

/** A definition behind an (i): shown on hover, focus or tap. */
export function Info({ text, label }: { text: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-label={label ? `About ${label}` : "Definition"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          border: `1px solid ${C.borderLight}`,
          background: "transparent",
          color: C.textMut,
          fontSize: 10.5,
          fontWeight: 700,
          lineHeight: "14px",
          padding: 0,
          cursor: "help",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
        }}
      >
        i
      </button>
      {open ? (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            width: "max-content",
            maxWidth: "min(300px, 80vw)",
            background: C.surface,
            border: `1px solid ${C.borderLight}`,
            borderRadius: 8,
            padding: "7px 10px",
            fontSize: 12.5,
            lineHeight: 1.45,
            color: C.textSec,
            fontWeight: 400,
            textTransform: "none",
            letterSpacing: 0,
            whiteSpace: "normal",
            textAlign: "left",
            boxShadow: "0 8px 22px rgba(0,0,0,0.3)",
          }}
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}

/** "Public data not yet loaded", in the place the L2 block would sit. No synthetic public data. */
export function NotLoadedNote({
  n,
  compact,
}: {
  n: NotLoaded;
  compact?: boolean;
}) {
  return (
    <div
      data-not-loaded
      data-layer="L2"
      style={{
        border: `1px dashed ${C.borderLight}`,
        borderRadius: 10,
        padding: compact ? "6px 10px" : "12px 14px",
        color: C.textMut,
        fontSize: 13,
        lineHeight: 1.45,
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <strong style={{ color: C.textSec, fontWeight: 600 }}>{n.text}</strong>
      {compact ? null : <Info text={n.what} label={n.text} />}
    </div>
  );
}

/* ---------------------------------------------------------------- layout */

export function Tile({
  title,
  sub,
  layers,
  children,
  id,
  right,
  style,
  tone,
  info,
}: {
  title?: ReactNode;
  sub?: ReactNode;
  layers: Layer[];
  children: ReactNode;
  id?: string;
  right?: ReactNode;
  style?: CSSProperties;
  tone?: Tone;
  info?: string;
}) {
  const color = TONE[tone ?? LAYER_TONE[layers[0] ?? "L1"]];
  return (
    <section
      id={id}
      data-testid="tile"
      style={{
        background: C.card,
        border: `1px solid ${tint(color, 0.22)}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 14,
        padding: "14px 16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
        scrollMarginTop: 120,
        ...style,
      }}
    >
      {title || right ? (
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title ? (
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: C.text,
                  margin: 0,
                  lineHeight: 1.3,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ minWidth: 0 }}>{title}</span>
                {info ? <Info text={info} /> : null}
              </h2>
            ) : null}
            {sub ? (
              <div style={{ fontSize: 13, color: C.textMut, marginTop: 2 }}>
                {sub}
              </div>
            ) : null}
          </div>
          {right}
        </header>
      ) : null}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {children}
      </div>
      <footer style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {layers.map((l) => (
          <SourceTag key={l} layer={l} />
        ))}
      </footer>
    </section>
  );
}

/** A labelled figure, numbers first. */
export function Kpi({
  label,
  f,
  sub,
  color,
  info,
  small,
}: {
  label: string;
  f: FigT;
  sub?: ReactNode;
  color?: string;
  info?: string;
  small?: boolean;
}) {
  return (
    <div
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 11.5,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {label}
        {info ? <Info text={info} label={label} /> : null}
      </div>
      <div
        style={{
          fontSize: small ? 18 : 24,
          fontWeight: 800,
          color: color ?? C.text,
          fontFamily: MONO,
          lineHeight: 1.15,
          marginTop: 4,
        }}
      >
        <Fig f={f} />
      </div>
      {sub ? (
        <div style={{ fontSize: 12.5, color: C.textSec, marginTop: 3 }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}

export function Table({
  head,
  rows,
  align,
  testid,
}: {
  head: ReactNode[];
  rows: { key: string; cells: ReactNode[]; muted?: boolean }[];
  align?: ("left" | "right")[];
  testid?: string;
}) {
  return (
    <div
      data-testid={testid}
      style={{
        overflowX: "auto",
        border: `1px solid ${C.border}`,
        borderRadius: 10,
      }}
    >
      <table
        className="ind-table"
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}
      >
        <thead>
          <tr style={{ background: C.cardAlt }}>
            {head.map((h, i) => (
              <th
                // biome-ignore lint/suspicious/noArrayIndexKey: static header order
                key={i}
                style={{
                  textAlign: align?.[i] ?? "left",
                  padding: "8px 10px",
                  color: C.textMut,
                  fontWeight: 600,
                  fontSize: 11.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  verticalAlign: "bottom",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.key}
              style={{
                borderTop: `1px solid ${C.border}`,
                opacity: r.muted ? 0.55 : 1,
              }}
            >
              {r.cells.map((c, ci) => (
                <td
                  data-label={typeof head[ci] === "string" ? head[ci] : ""}
                  // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
                  key={ci}
                  style={{
                    padding: "8px 10px",
                    color: C.textSec,
                    textAlign: align?.[ci] ?? "left",
                    verticalAlign: "top",
                    fontFamily: align?.[ci] === "right" ? MONO : undefined,
                  }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MutedNote({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 12.5, color: C.textMut, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

/** A small uppercase label above a group. */
export function Label({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11.5,
        fontWeight: 700,
        color: C.textMut,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {children}
    </div>
  );
}

/** A labelled chip: owner, status, peer, exposure. */
export function Chip({
  label,
  children,
  color = C.cyan,
}: {
  label: string;
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        color: C.textSec,
        border: `1px solid ${tint(color, 0.3)}`,
        borderRadius: 6,
        padding: "2px 8px",
        background: tint(color, 0.07),
        maxWidth: "100%",
      }}
    >
      <span style={{ color: C.textDim }}>{label}</span>
      <span style={{ fontWeight: 600, color: C.text, minWidth: 0 }}>
        {children}
      </span>
    </span>
  );
}

export function OpenLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      data-open
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: C.brandInk,
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      {children} →
    </Link>
  );
}

/** Proportional bar row for a share (volume is neutral cyan; red is kept for a breach). */
export function ShareBar({
  label,
  f,
  max,
  color = C.cyan,
  right,
}: {
  label: ReactNode;
  f: FigT;
  max: number;
  color?: string;
  right?: ReactNode;
}) {
  const val = f.value ?? 0;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        gap: 10,
        alignItems: "center",
        padding: "3px 0",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: C.textSec }}>{label}</div>
        <div
          style={{
            height: 7,
            borderRadius: 4,
            background: C.track,
            marginTop: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${max ? Math.max(2, (100 * val) / max) : 0}%`,
              height: "100%",
              borderRadius: 4,
              background: color,
            }}
          />
        </div>
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 13.5,
          fontWeight: 700,
          color: C.text,
          textAlign: "right",
          minWidth: 48,
        }}
      >
        {right ?? <Fig f={f} />}
      </div>
    </div>
  );
}
