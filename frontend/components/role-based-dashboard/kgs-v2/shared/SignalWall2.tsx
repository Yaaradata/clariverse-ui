"use client";

import { useLabel2, useV2K } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import {
  ChevronRight,
  CircleAlert,
  Sparkles,
  Timer,
  TrendingUp,
  TriangleAlert,
  User,
  Zap,
} from "lucide-react";
import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useKgs2Nav } from "../nav";
import type { V2Tokens } from "./themeTokens";

export type WallLevel2 = "critical" | "alert" | "warning" | "improving";

export type SignalWall2Card = {
  id: string;
  level: WallLevel2;
  tag: string;
  title: string;
  body: string;
  metric: string;
  trend: string;
  detail: {
    cause: string;
    areas: string[];
    actions: string[];
    timeline: string;
    owner: string;
    priority: string;
  };
  /** When set, detail panel shows "Open signal →" to this view. */
  openView?: V2View;
};

export type SignalWall2Data = {
  title: string;
  sub: string;
  pill?: string;
  cards: SignalWall2Card[];
  footer: Array<{ label: string; value: number }>;
};

/** Footer counts for the cards on the wall right now. */
export function wallFooter(
  cards: Array<{ level: WallLevel2 }>,
): SignalWall2Data["footer"] {
  const count = (levels: WallLevel2[]) =>
    cards.filter((c) => levels.includes(c.level)).length;
  return [
    { label: "Critical", value: count(["critical"]) },
    { label: "Needs action", value: count(["alert", "warning"]) },
    { label: "Improving", value: count(["improving"]) },
  ];
}

const LEVEL: Record<WallLevel2, { label: string; Icon: typeof CircleAlert }> =
  {
    critical: { label: "CRITICAL", Icon: CircleAlert },
    alert: { label: "ALERT", Icon: TriangleAlert },
    warning: { label: "WARNING", Icon: Zap },
    improving: { label: "IMPROVING", Icon: TrendingUp },
  };

function levelColor(K: V2Tokens, level: WallLevel2): string {
  if (level === "critical") return K.red;
  if (level === "alert") return K.orange;
  if (level === "warning") return K.warn;
  return K.green;
}

function WallCardRow({
  card,
  selected,
  onOpen,
  compact,
}: {
  card: SignalWall2Card;
  selected: boolean;
  onOpen: (card: SignalWall2Card, e: ReactMouseEvent<HTMLElement>) => void;
  compact?: boolean;
}) {
  const L = useLabel2();
  const K = useV2K();
  const meta = LEVEL[card.level];
  const Icon = meta.Icon;
  const color = levelColor(K, card.level);
  const pad = compact ? 12 : 16;

  return (
    <button
      type="button"
      onClick={(e) => onOpen(card, e)}
      style={{
        position: "relative",
        borderRadius: 12,
        padding: pad,
        cursor: "pointer",
        background: `linear-gradient(135deg, ${color}26 0%, ${color}0d 100%)`,
        border: `1px solid ${color}50`,
        boxShadow: selected ? `0 0 0 1px ${color}80 inset` : "none",
        width: "100%",
        textAlign: "left",
        color: "inherit",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          gap: compact ? 10 : 12,
        }}
      >
        <div
          style={{
            padding: compact ? 6 : 8,
            borderRadius: 8,
            background: `${color}20`,
            flexShrink: 0,
          }}
        >
          <Icon size={compact ? 14 : 16} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "2px 6px",
                borderRadius: 4,
                background: `${color}25`,
                color,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon size={10} color={color} />
              {meta.label}
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "2px 6px",
                borderRadius: 4,
                background: K.chip,
                color: K.textMut,
              }}
            >
              {L(card.tag)}
            </span>
          </div>
          <p
            style={{
              margin: "0 0 2px",
              fontSize: compact ? 13 : 14,
              fontWeight: 700,
              color: K.text,
              lineHeight: 1.3,
            }}
          >
            {L(card.title)}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.4,
              color: K.body,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {L(card.body)}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {L(card.metric)}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                fontWeight: 700,
                color,
              }}
            >
              <TrendingUp size={12} aria-hidden />
              {L(card.trend)}
            </span>
          </div>
        </div>
        <ChevronRight
          size={16}
          color={color}
          style={{ flexShrink: 0, opacity: selected ? 1 : 0.4, marginTop: 2 }}
          aria-hidden
        />
      </div>
    </button>
  );
}

function DetailPanel({
  card,
  top,
  onClose,
}: {
  card: SignalWall2Card;
  top: number;
  onClose: () => void;
}) {
  const L = useLabel2();
  const { go } = useKgs2Nav();
  const K = useV2K();
  const meta = LEVEL[card.level];
  const Icon = meta.Icon;
  const color = levelColor(K, card.level);
  const d = card.detail;

  return (
    <div
      role="dialog"
      aria-label={L(card.title)}
      style={{
        position: "absolute",
        left: 8,
        right: 8,
        top,
        zIndex: 30,
        background: K.elevated,
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: 12,
        boxShadow: `0 8px 32px ${color}40, 0 4px 16px ${K.scrim}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
          }}
        >
          <div
            style={{
              padding: 6,
              borderRadius: 8,
              background: `${color}20`,
              flexShrink: 0,
            }}
          >
            <Icon size={14} color={color} />
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: K.text,
              lineHeight: 1.35,
            }}
          >
            {L(card.title)}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="kgs2-focus"
          style={{
            border: "none",
            background: "transparent",
            color: K.textMut,
            fontSize: 18,
            cursor: "pointer",
            lineHeight: 1,
            padding: 4,
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 999,
            background: `${color}20`,
            color,
          }}
        >
          {d.priority}
        </span>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 999,
            background: K.chip,
            color: K.textMut,
          }}
        >
          {L(card.tag)}
        </span>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: K.textMut,
            textTransform: "uppercase",
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          Likely cause (candidate)
        </div>
        <div style={{ fontSize: 12, color: K.textSec, lineHeight: 1.5 }}>
          {L(d.cause)}
        </div>
      </div>

      {d.areas.length > 0 ? (
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: K.textMut,
              textTransform: "uppercase",
              marginBottom: 4,
              letterSpacing: "0.04em",
            }}
          >
            Affected areas
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {d.areas.map((a) => (
              <span
                key={a}
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: K.chip,
                  color: K.body,
                }}
              >
                {L(a)}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {d.actions.length > 0 ? (
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: K.textMut,
              textTransform: "uppercase",
              marginBottom: 4,
              letterSpacing: "0.04em",
            }}
          >
            LiSN suggests · owner decides
          </div>
          {d.actions.map((a, idx) => (
            <div
              key={a}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  background: `${color}20`,
                  color,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </span>
              <span
                style={{ fontSize: 11, color: K.body, lineHeight: 1.45 }}
              >
                {L(a)}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 8,
          borderTop: `1px solid ${K.borderLight}`,
          paddingTop: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: K.textMut,
            }}
          >
            <Timer size={11} aria-hidden />
            {L(d.timeline)}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: K.textMut,
            }}
          >
            <User size={11} aria-hidden />
            {L(d.owner)}
          </span>
        </div>
        {card.openView ? (
          <button
            type="button"
            className="kgs2-focus"
            onClick={() => {
              const view = card.openView;
              if (!view) return;
              onClose();
              go(view);
            }}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            Open signal →
          </button>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 700, color }}>
            {d.priority}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * v2 Signal Wall — v1 AI Summary Wall look: fixed height, scroll, in-place detail.
 * `compact` fits the Promise drill column beside the weekly chart (no tall empty panel).
 */
export function SignalWall2({
  wall,
  compact = false,
  fill = false,
}: {
  wall: SignalWall2Data;
  compact?: boolean;
  /** Slightly taller cap than compact; extra cards scroll inside the wall. */
  fill?: boolean;
}) {
  const L = useLabel2();
  const K = useV2K();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTop, setDetailTop] = useState<number | null>(null);

  const selected = wall.cards.find((c) => c.id === selectedId) ?? null;

  const closeDetail = () => {
    setSelectedId(null);
    setDetailTop(null);
  };

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
        setDetailTop(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const openCard = (
    card: SignalWall2Card,
    event: ReactMouseEvent<HTMLElement>,
  ) => {
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      const rowRect = event.currentTarget.getBoundingClientRect();
      const scrollRect = scrollEl.getBoundingClientRect();
      setDetailTop(rowRect.top - scrollRect.top + scrollEl.scrollTop);
    } else {
      setDetailTop(0);
    }
    setSelectedId(card.id);
  };

  return (
    <section
      style={{
        borderRadius: 16,
        padding: compact ? 14 : 24,
        background: K.panel,
        border: `1px solid ${K.chipBorder}`,
        boxShadow: K.shadow,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: compact ? 340 : 520,
        maxHeight: fill ? 460 : compact ? 420 : 840,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: compact ? 10 : 20,
          flexShrink: 0,
          padding: compact ? "2px 4px" : "8px 8px",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={compact ? 18 : 22} color={K.violet400} aria-hidden />
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: compact ? 16 : 18,
                fontWeight: 700,
                color: K.text,
              }}
            >
              {L(wall.title)}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: K.textMut }}>
              {L(wall.sub)}
            </p>
          </div>
        </div>
        {wall.pill ? (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              background: K.chip,
              color: K.textMut,
              whiteSpace: "nowrap",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: K.green,
              }}
            />
            {L(wall.pill)}
          </div>
        ) : null}
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px 4px 4px 0",
          minHeight: 0,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: compact ? 8 : 12,
          }}
        >
          {wall.cards.map((c) => (
            <WallCardRow
              key={c.id}
              card={c}
              selected={selectedId === c.id}
              onOpen={openCard}
              compact={compact}
            />
          ))}
        </div>

        {selected && detailTop !== null ? (
          <>
            <button
              type="button"
              aria-label="Close detail"
              onClick={closeDetail}
              style={{
                position: "absolute",
                inset: 0,
                background: K.scrim,
                zIndex: 20,
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
            <DetailPanel
              card={selected}
              top={detailTop}
              onClose={closeDetail}
            />
          </>
        ) : null}
      </div>

      <div
        style={{
          marginTop: compact ? 10 : 16,
          paddingTop: compact ? 10 : 16,
          borderTop: `1px solid ${K.borderLight}`,
          display: "grid",
          gridTemplateColumns: `repeat(${wall.footer.length}, minmax(0, 1fr))`,
          gap: 8,
          flexShrink: 0,
        }}
      >
        {wall.footer.map((f) => (
          <div key={f.label} style={{ textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                fontSize: compact ? 22 : 28,
                fontWeight: 700,
                color:
                  f.value <= 0
                    ? K.textMut
                    : /Critical/i.test(f.label)
                      ? K.red
                      : /Needs|action|Alert/i.test(f.label)
                        ? K.orange
                        : /Improving/i.test(f.label)
                          ? K.green
                          : K.textMut,
                fontFamily: K.mono,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.1,
              }}
            >
              {f.value}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: K.textMut }}>
              {L(f.label)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
