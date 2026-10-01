"use client";

import { useLabel2 } from "@kgs2/lib/demoState";
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
import { K } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { useKgs2Nav } from "../nav";

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

const LEVEL: Record<
  WallLevel2,
  { color: string; label: string; Icon: typeof CircleAlert }
> = {
  critical: { color: "#ef4444", label: "CRITICAL", Icon: CircleAlert },
  alert: { color: "#f97316", label: "ALERT", Icon: TriangleAlert },
  warning: { color: "#eab308", label: "WARNING", Icon: Zap },
  improving: { color: "#22c55e", label: "IMPROVING", Icon: TrendingUp },
};

function WallCardRow({
  card,
  selected,
  onOpen,
}: {
  card: SignalWall2Card;
  selected: boolean;
  onOpen: (card: SignalWall2Card, e: ReactMouseEvent<HTMLElement>) => void;
}) {
  const L = useLabel2();
  const meta = LEVEL[card.level];
  const Icon = meta.Icon;
  const color = meta.color;

  return (
    <button
      type="button"
      onClick={(e) => onOpen(card, e)}
      style={{
        position: "relative",
        borderRadius: 12,
        padding: 16,
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
              {meta.label}
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
              {L(card.tag)}
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
            {L(card.title)}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.55,
              color: "#d6d9d8",
            }}
          >
            {L(card.body)}
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
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color,
                fontFamily: K.mono,
              }}
            >
              {L(card.metric)}
            </span>
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
            <span style={{ fontSize: 12, fontWeight: 700 }}>
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
  const meta = LEVEL[card.level];
  const Icon = meta.Icon;
  const color = meta.color;
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
        background: "#1a1a1a",
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: 12,
        boxShadow: `0 8px 32px ${color}40, 0 4px 16px rgba(0,0,0,0.3)`,
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
              color: "#fff",
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
          {d.priority}
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
          {L(card.tag)}
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
          {L(d.cause)}
        </div>
      </div>

      {d.areas.length > 0 ? (
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
            {d.areas.map((a) => (
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
      ) : null}

      {d.actions.length > 0 ? (
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
                style={{ fontSize: 11, color: "#d6d9d8", lineHeight: 1.45 }}
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
            {L(d.timeline)}
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
 */
export function SignalWall2({ wall }: { wall: SignalWall2Data }) {
  const L = useLabel2();
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
        padding: 24,
        background: "#0d0d0d",
        border: "1px solid #2a2a2a",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 520,
        maxHeight: 840,
        minWidth: 0,
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
        ) : null}
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
          {wall.cards.map((c) => (
            <WallCardRow
              key={c.id}
              card={c}
              selected={selectedId === c.id}
              onOpen={openCard}
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
                background: "rgba(0,0,0,0.35)",
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
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid #2a2a2a",
          display: "grid",
          gridTemplateColumns: `repeat(${wall.footer.length}, minmax(0, 1fr))`,
          gap: 12,
          flexShrink: 0,
        }}
      >
        {wall.footer.map((f) => (
          <div key={f.label} style={{ textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color:
                  f.value <= 0
                    ? K.textMut
                    : /Critical/i.test(f.label)
                      ? "#ef4444"
                      : /Needs|action|Alert/i.test(f.label)
                        ? "#f97316"
                        : /Improving/i.test(f.label)
                          ? "#22c55e"
                          : K.textMut,
                fontFamily: K.mono,
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
    </section>
  );
}
