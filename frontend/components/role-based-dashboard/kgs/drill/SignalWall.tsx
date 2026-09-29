"use client";

import { monitor } from "@kgs/lib/data";
import type {
  MonitorCard,
  SignalWall as SignalWallData,
  WallCard as WallCardData,
  WallCardCompact,
  WallLevel,
} from "@kgs/types";
import {
  CircleAlert,
  ChevronRight,
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
import { EmptyScope } from "../shared/EmptyScope";
import { K } from "../shared/tokens";
import { useLabel } from "../shell/DemoProvider";
import { useScope } from "../shell/Scope";

const RANK = /^#(\d+) of \d+$/;
const MONEY = /[$£]/;

const LEVEL: Record<
  WallLevel,
  { color: string; Icon: typeof CircleAlert }
> = {
  CRITICAL: { color: "#ef4444", Icon: CircleAlert },
  ALERT: { color: "#f97316", Icon: TriangleAlert },
  WARNING: { color: "#eab308", Icon: Zap },
};

/** The monitor card behind a wall card, found by its "#n of 5" rank chip. */
export function monitorCardForWall(
  card: WallCardData,
): MonitorCard | undefined {
  const rank = card.chips.map((c) => RANK.exec(c)?.[1]).find(Boolean);
  return rank ? monitor.cards.find((c) => c.rank === Number(rank)) : undefined;
}

function compactOf(card: WallCardData): WallCardCompact | null {
  return card.compact ?? null;
}

function WallCardRow({
  card,
  selected,
  pulse,
  onOpen,
}: {
  card: WallCardData;
  selected: boolean;
  pulse: boolean;
  onOpen: (card: WallCardData, e: ReactMouseEvent<HTMLDivElement>) => void;
}) {
  const L = useLabel();
  const c = compactOf(card);
  if (!c) return null;
  const meta = LEVEL[c.level];
  const Icon = meta.Icon;
  const color = meta.color;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => onOpen(card, e)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(card, e as unknown as ReactMouseEvent<HTMLDivElement>);
        }
      }}
      style={{
        position: "relative",
        borderRadius: 12,
        padding: 16,
        cursor: "pointer",
        background: `linear-gradient(135deg, ${color}26 0%, ${color}0d 100%)`,
        border: `1px solid ${color}50`,
        boxShadow: selected ? `0 0 0 1px ${color}80 inset` : "none",
      }}
    >
      {pulse ? (
        <div
          aria-hidden
          className="kgs-pulse"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 12,
            background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div
          style={{
            padding: 8,
            borderRadius: 8,
            background: `${color}20`,
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 11,
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
              <Icon size={11} color={color} />
              {c.level}
            </span>
            <span
              style={{
                fontSize: 11,
                padding: "2px 6px",
                borderRadius: 4,
                background: "#2a2a2a",
                color: "#939394",
              }}
            >
              {L(c.tag)}
            </span>
          </div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.35,
            }}
          >
            {L(c.title)}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.55,
              color: "#d6d9d8",
            }}
          >
            {L(c.body)}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 500, color }}>
              {L(c.metric)}
            </span>
            {c.money || MONEY.test(c.metric) ? (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: K.textMut,
                  border: `1px dashed ${K.borderLight}`,
                  borderRadius: 4,
                  padding: "1px 5px",
                }}
              >
                illustrative
              </span>
            ) : null}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
              color,
            }}
          >
            <TrendingUp size={14} aria-hidden />
            <span style={{ fontSize: 12, fontWeight: 700 }}>{L(c.trend)}</span>
          </div>
        </div>
        <ChevronRight
          size={16}
          color={color}
          style={{ flexShrink: 0, opacity: selected ? 1 : 0.4, marginTop: 2 }}
          aria-hidden
        />
      </div>
    </div>
  );
}

function DetailPanel({
  card,
  top,
  onClose,
}: {
  card: WallCardData;
  top: number;
  onClose: () => void;
}) {
  const L = useLabel();
  const c = compactOf(card);
  if (!c) return null;
  const meta = LEVEL[c.level];
  const Icon = meta.Icon;
  const color = meta.color;

  return (
    <div
      role="dialog"
      aria-label={L(c.title)}
      style={{
        position: "absolute",
        left: 8,
        right: 8,
        top,
        zIndex: 30,
        background: "#1a1a1a",
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: 12,
        boxShadow: `0 8px 32px ${color}40, 0 4px 16px rgba(0,0,0,0.3)`,
      }}
    >
      {c.synthetic ? (
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: K.textMut,
            marginBottom: 8,
          }}
        >
          Synthetic
        </div>
      ) : null}

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
              color: "#fff",
              lineHeight: 1.35,
            }}
          >
            {L(c.title)}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            border: "none",
            background: "transparent",
            color: "#939394",
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
          {c.priority}
        </span>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 999,
            background: "#2a2a2a",
            color: "#939394",
          }}
        >
          {L(c.tag)}
        </span>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#939394",
            textTransform: "uppercase",
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          Likely cause (candidate)
        </div>
        <div style={{ fontSize: 12, color: "#e0e0e0", lineHeight: 1.5 }}>
          {L(c.cause)}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#939394",
            textTransform: "uppercase",
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          Affected areas
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {c.areas.map((a) => (
            <span
              key={a}
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 6,
                background: "#2a2a2a",
                color: "#d6d9d8",
              }}
            >
              {L(a)}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#939394",
            textTransform: "uppercase",
            marginBottom: 4,
            letterSpacing: "0.04em",
          }}
        >
          LiSN suggests · owner decides
        </div>
        {c.actions.map((a, idx) => (
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
              style={{ fontSize: 11, color: "#d6d9d8", lineHeight: 1.45 }}
            >
              {L(a)}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 8,
          borderTop: "1px solid #2a2a2a",
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
              color: "#939394",
            }}
          >
            <Timer size={11} aria-hidden />
            {L(c.timeline)}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "#939394",
            }}
          >
            <User size={11} aria-hidden />
            {L(c.owner)}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{c.priority}</span>
      </div>
    </div>
  );
}

function WallFooterCounts({ items }: { items: SignalWallData["footer"] }) {
  const L = useLabel();
  const tone = (label: string, value: number) => {
    if (value <= 0) return K.textMut;
    if (/S1|Critical/i.test(label)) return "#ef4444";
    if (/S2|ALERT|Material/i.test(label)) return "#f97316";
    if (/S3|WARNING|Operational/i.test(label)) return "#eab308";
    if (/Easing|Clean|Suppressed/i.test(label)) return "#22c55e";
    return K.textMut;
  };
  return (
    <div
      style={{
        marginTop: 16,
        paddingTop: 16,
        borderTop: "1px solid #2a2a2a",
        display: "grid",
        gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
        gap: 12,
        flexShrink: 0,
      }}
    >
      {items.map((f) => (
        <div key={f.label} style={{ textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: tone(f.label, f.value),
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.1,
            }}
          >
            {f.value}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#939394" }}>
            {L(f.label)}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * LiSN Signal Wall — bank AI Summary Wall anatomy: fixed-height dark panel, scrollable
 * cards, in-place detail overlay. No page navigation on click.
 */
export function SignalWall({
  wall,
  pulseClass,
}: {
  wall: SignalWallData;
  pulseClass?: string | null;
}) {
  const L = useLabel();
  const { active, inScope } = useScope();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTop, setDetailTop] = useState<number | null>(null);

  const cards = wall.cards.filter((c) => {
    if (!c.compact) return false;
    const linked = monitorCardForWall(c);
    return linked ? inScope(linked.signalId) : !active;
  });
  const selected = cards.find((c) => c.id === selectedId) ?? null;

  const closeDetail = () => {
    setSelectedId(null);
    setDetailTop(null);
  };

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const openCard = (
    card: WallCardData,
    event: ReactMouseEvent<HTMLDivElement>,
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
        padding: 24,
        background: "#0d0d0d",
        border: "1px solid #2a2a2a",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        height: 780,
        maxHeight: 840,
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexShrink: 0,
          padding: "8px 8px",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Sparkles size={22} color={K.violet400} aria-hidden />
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {L(wall.title)}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: "#939394" }}>
              {L(wall.subtitle)}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            background: "#1a1a1a",
            color: "#939394",
            whiteSpace: "nowrap",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#22c55e",
            }}
          />
          {L(wall.pill)}
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 8px 8px 0",
          minHeight: 0,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cards.length ? (
            cards.map((c) => (
              <WallCardRow
                key={c.id}
                card={c}
                selected={selectedId === c.id}
                pulse={Boolean(
                  c.compact?.pulse ||
                    (pulseClass &&
                      (monitorCardForWall(c)?.chips.class === pulseClass ||
                        c.chips.some((x) => x.startsWith(pulseClass)))),
                )}
                onOpen={openCard}
              />
            ))
          ) : (
            <EmptyScope />
          )}
        </div>

        {selected && detailTop !== null ? (
          <>
            <div
              onClick={closeDetail}
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                zIndex: 20,
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

      <WallFooterCounts items={wall.footer} />
    </section>
  );
}
