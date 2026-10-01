"use client";

import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import type { CSSProperties, ReactNode } from "react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";

/** Local drill chrome (v1 DrillChrome look; useLabel2, no v1 DemoProvider). */
const DR = {
  card: K.bg,
  border: K.border,
  text: K.text,
  sub: K.textSec,
  muted: K.textMut,
  dim: K.textMut,
  red: K.red,
  orange: K.orange,
  amber: K.amber,
  green: K.green,
  purple: K.violet400,
} as const;

function severityColor(s: string): string {
  const k = s.toLowerCase();
  if (k.includes("critical")) return DR.red;
  if (k.includes("high")) return DR.orange;
  if (k.includes("medium") || k.includes("watch")) return DR.amber;
  if (k.includes("healthy") || k.includes("low")) return DR.green;
  return DR.muted;
}

function DrMono({
  children,
  color,
  size = 15,
}: {
  children: ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <span
      style={{
        fontFamily: K.mono,
        fontWeight: 700,
        color: color || DR.text,
        fontSize: size,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {children}
    </span>
  );
}

function DrBadge({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 8px",
        borderRadius: 4,
        background: withAlpha(color, 0.14),
        color,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

function DrPill({
  children,
  color = DR.muted,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 8px",
        borderRadius: 999,
        background: withAlpha(color, 0.12),
        color,
        border: `1px solid ${withAlpha(color, 0.28)}`,
      }}
    >
      {children}
    </span>
  );
}

function DrCard({
  children,
  accent,
  style,
}: {
  children: ReactNode;
  accent?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      style={{
        background: DR.card,
        border: `1px solid ${DR.border}`,
        borderLeft: accent ? `3px solid ${accent}` : `1px solid ${DR.border}`,
        borderRadius: 16,
        padding: 14,
        minWidth: 0,
        minHeight: 0,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function DrHead({ children, sub }: { children: ReactNode; sub?: string }) {
  const L = useLabel2();
  return (
    <header style={{ marginBottom: 12 }}>
      <h3
        style={{
          margin: 0,
          color: DR.text,
          fontSize: 17,
          fontWeight: 800,
          lineHeight: 1.25,
        }}
      >
        {typeof children === "string" ? L(children) : children}
      </h3>
      {sub ? (
        <p style={{ margin: "4px 0 0", fontSize: 13, color: DR.muted }}>
          {L(sub)}
        </p>
      ) : null}
    </header>
  );
}

function MetricTiles({
  items,
}: {
  items: { label: string; value: string; status: string }[];
}) {
  const L = useLabel2();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 8,
        flexShrink: 0,
      }}
    >
      {items.map((m) => (
        <div
          key={m.label}
          style={{
            border: `1px solid ${DR.border}`,
            borderRadius: 10,
            padding: "10px 12px",
            background: "rgba(255,255,255,0.02)",
            minHeight: 78,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 6,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: DR.muted, fontWeight: 700 }}>
              {L(m.label)}
            </span>
            <DrBadge color={severityColor(m.status)}>{m.status}</DrBadge>
          </div>
          <div style={{ marginTop: 6 }}>
            <DrMono size={22}>{L(m.value)}</DrMono>
          </div>
        </div>
      ))}
    </div>
  );
}

export type RecurringThemeRow = {
  id: string;
  name: string;
  contacts13w: number;
  channels: string[];
  partners: number;
  status: string;
  fixes: Array<{
    date: string;
    type: string;
    owner: string;
    before: number;
    after: number;
  }>;
  lastFixLabel: string;
};

function fmtDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fixTypeLabel(type: string): string {
  if (type === "kb") return "knowledge article";
  if (type === "training") return "training";
  if (type === "process") return "process";
  if (type === "product-feedback") return "product feedback";
  return type;
}

/** Left panel — Fixes that didn't hold (v1 CutoverFailures layout). */
export function FixesDidntHoldPanel({
  kpis,
  themes,
  beforeNowById,
  onShowAll,
}: {
  kpis: { label: string; value: string; status: string }[];
  themes: RecurringThemeRow[];
  beforeNowById: Record<string, { before: number; now: number }>;
  onShowAll: () => void;
}) {
  const L = useLabel2();
  const returning = themes.filter((t) => t.status === "back-after-fix");

  return (
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <DrHead sub="Returning after a recorded fix">Fixes that didn't hold</DrHead>
      <MetricTiles items={kpis} />
      <div
        style={{
          marginTop: 12,
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 800,
          color: DR.text,
          flexShrink: 0,
        }}
      >
        Returning themes
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateRows: `auto repeat(${returning.length}, minmax(0, 1fr))`,
          border: `1px solid ${DR.border}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1.1fr 0.9fr 0.7fr",
            gap: 8,
            padding: "8px 10px",
            borderBottom: `1px solid ${DR.border}`,
            background: "rgba(255,255,255,0.02)",
            fontSize: 11,
            fontWeight: 700,
            color: DR.dim,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          <span>Theme</span>
          <span>Last fix</span>
          <span>Contacts/wk</span>
          <span>Owner</span>
        </div>
        {returning.map((t) => {
          const fix = t.fixes[0];
          const bn = beforeNowById[t.id];
          const lo = bn?.before ?? fix?.after ?? 0;
          const hi = bn?.now ?? fix?.before ?? 0;
          return (
            <div
              key={t.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1.1fr 0.9fr 0.7fr",
                gap: 8,
                padding: "0 10px",
                alignItems: "center",
                borderBottom: `1px solid ${DR.border}`,
                minHeight: 0,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: DR.text,
                  fontSize: 13,
                  lineHeight: 1.3,
                }}
              >
                {L(t.name)}
              </span>
              <span style={{ fontSize: 12, color: DR.muted, lineHeight: 1.3 }}>
                {fix
                  ? `${fmtDate(fix.date)} · ${fixTypeLabel(fix.type)}`
                  : "—"}
              </span>
              <span style={{ fontSize: 13, color: DR.sub }}>
                <DrMono size={13}>
                  {lo} → {hi}
                </DrMono>
              </span>
              <span style={{ fontSize: 12, color: DR.sub }}>
                {fix?.owner ?? "—"}
              </span>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="kgs2-focus"
        onClick={onShowAll}
        style={{
          marginTop: 10,
          alignSelf: "flex-start",
          background: "transparent",
          border: "none",
          color: K.violet300,
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          padding: 0,
        }}
      >
        Show all {themes.length} themes
      </button>
    </DrCard>
  );
}

/** Right panel — Biggest open themes (v1 CashImpact layout). */
export function BiggestOpenThemesPanel({
  kpis,
  themes,
  onShowAll,
}: {
  kpis: { label: string; value: string; status: string }[];
  themes: RecurringThemeRow[];
  onShowAll: () => void;
}) {
  const L = useLabel2();
  const rows = [...themes]
    .filter((t) => t.status === "no-fix")
    .sort((a, b) => b.contacts13w - a.contacts13w)
    .slice(0, 5);

  return (
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <DrHead sub="No fix on record · highest contact volume">
        Biggest open themes
      </DrHead>
      <MetricTiles items={kpis} />
      <div
        style={{
          marginTop: 12,
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 800,
          color: DR.text,
          flexShrink: 0,
        }}
      >
        Top unfixed themes
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateRows: `auto repeat(${rows.length}, minmax(0, 1fr))`,
          border: `1px solid ${DR.border}`,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 72px 1fr 64px",
            gap: 8,
            padding: "8px 10px",
            borderBottom: `1px solid ${DR.border}`,
            background: "rgba(255,255,255,0.02)",
            fontSize: 11,
            fontWeight: 700,
            color: DR.dim,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          <span>Theme</span>
          <span>Contacts</span>
          <span>Channels</span>
          <span>Partners</span>
        </div>
        {rows.map((t) => (
          <div
            key={t.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 72px 1fr 64px",
              gap: 8,
              padding: "0 10px",
              alignItems: "center",
              borderBottom: `1px solid ${DR.border}`,
              minHeight: 0,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: DR.text,
                fontSize: 13,
                lineHeight: 1.3,
              }}
            >
              {L(t.name)}
            </span>
            <DrMono size={13}>{t.contacts13w}</DrMono>
            <span style={{ fontSize: 12, color: DR.muted, lineHeight: 1.3 }}>
              {t.channels.slice(0, 2).join(" · ")}
              {t.channels.length > 2 ? ` +${t.channels.length - 2}` : ""}
            </span>
            <DrMono size={13}>{t.partners}</DrMono>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="kgs2-focus"
        onClick={onShowAll}
        style={{
          marginTop: 10,
          alignSelf: "flex-start",
          background: "transparent",
          border: "none",
          color: K.violet300,
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          padding: 0,
        }}
      >
        Show all {themes.length} themes
      </button>
    </DrCard>
  );
}

type WhyCause = {
  cause: string;
  count: number;
  sharePct: number;
  owner: string;
  severity: string;
};

type WatchCard = {
  id: string;
  title: string;
  fixDate: string;
  returnDate: string;
  before: number;
  now: number;
};

/** Why fixes don't hold — v1 WhyInvoicesStuck layout. */
export function WhyFixesDontHold({
  title,
  sub,
  causes,
  watchlist,
}: {
  title: string;
  sub: string;
  causes: WhyCause[];
  watchlist: WatchCard[];
}) {
  const L = useLabel2();
  const { setView } = useDemo2();
  const max = Math.max(...causes.map((c) => c.count), 1);

  return (
    <DrCard accent={DR.purple}>
      <DrHead sub={sub}>{title}</DrHead>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: DR.text }}>
            Candidate reasons
          </div>
          <div style={{ fontSize: 14, color: DR.muted, margin: "4px 0 12px" }}>
            Count · share · owner
          </div>
          <div style={{ display: "grid", gap: 12, flex: 1 }}>
            {causes.map((r) => {
              const width = Math.max(12, Math.round((r.count / max) * 100));
              const col = severityColor(r.severity);
              return (
                <div
                  key={r.cause}
                  style={{
                    border: `1px solid ${DR.border}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        color: DR.text,
                        fontWeight: 700,
                        lineHeight: 1.3,
                        minWidth: 0,
                      }}
                    >
                      {L(r.cause)}
                    </div>
                    <DrPill color={col}>{r.owner}</DrPill>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      gap: 14,
                      flexWrap: "wrap",
                      fontSize: 14,
                      color: DR.muted,
                    }}
                  >
                    <span>
                      <DrMono size={14} color={DR.sub}>
                        {r.count}
                      </DrMono>{" "}
                      themes
                    </span>
                    <span>{r.sharePct}% share</span>
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                    aria-hidden
                  >
                    <div
                      style={{
                        width: `${width}%`,
                        height: "100%",
                        borderRadius: 4,
                        background: col,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: DR.text }}>
            Returning themes watchlist
          </div>
          <div style={{ fontSize: 14, color: DR.muted, margin: "4px 0 12px" }}>
            Fix date · return · contacts/week
          </div>
          <div
            style={{
              display: "grid",
              gap: 10,
              flex: 1,
              gridTemplateRows: `repeat(${watchlist.length}, minmax(0, 1fr))`,
            }}
          >
            {watchlist.map((r) => {
              const openable = r.id === "rc-01";
              return (
                <div
                  key={r.id}
                  style={{
                    border: `1px solid ${DR.border}`,
                    borderLeft: `3px solid ${DR.red}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      color: DR.text,
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}
                  >
                    {L(r.title)}
                  </div>
                  <div
                    style={{ marginTop: 6, fontSize: 12, color: DR.muted }}
                  >
                    Fix {fmtDate(r.fixDate)} · Return {fmtDate(r.returnDate)}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13, color: DR.sub }}>
                    Contacts/week{" "}
                    <DrMono size={13}>
                      {r.before} → {r.now}
                    </DrMono>
                  </div>
                  <button
                    type="button"
                    className="kgs2-focus"
                    disabled={!openable}
                    onClick={() => openable && setView("recurringTheme")}
                    style={{
                      marginTop: 8,
                      alignSelf: "flex-start",
                      background: "transparent",
                      border: "none",
                      color: openable ? K.violet300 : DR.muted,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: openable ? "pointer" : "default",
                      fontFamily: "inherit",
                      padding: 0,
                    }}
                  >
                    Open theme →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DrCard>
  );
}

type TopTheme = {
  id: string;
  name: string;
  contacts: number;
  repeatPct: number;
  channel: string;
  severity: string;
};

/** Top recurring themes — v1 TopCutoverIssues layout. */
export function TopRecurringThemes({ rows }: { rows: TopTheme[] }) {
  const L = useLabel2();
  const max = Math.max(...rows.map((r) => r.contacts), 1);
  return (
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <DrHead sub="Ranked by contacts · repeat % · main channel">
        Top recurring themes
      </DrHead>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateRows: `repeat(${rows.length}, minmax(0, 1fr))`,
          gap: 8,
          minHeight: 0,
        }}
      >
        {rows.map((r, idx) => {
          const sev = severityColor(r.severity);
          const width = Math.round((r.contacts / max) * 100);
          const hot = idx < 2;
          return (
            <div
              key={r.id}
              style={{
                border: `1px solid ${hot ? withAlpha(DR.red, 0.35) : DR.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                background: hot
                  ? withAlpha(DR.red, 0.06)
                  : "rgba(255,255,255,0.02)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: 0,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px minmax(0, 1fr) 68px 56px",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    color: hot ? DR.red : DR.muted,
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  #{idx + 1}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{ color: DR.text, fontWeight: 700, fontSize: 13 }}
                  >
                    {L(r.name)}
                  </div>
                  <div style={{ color: DR.muted, fontSize: 12, marginTop: 2 }}>
                    Main channel: {L(r.channel)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <DrMono size={13}>{r.contacts}</DrMono>
                  <div style={{ color: DR.muted, fontSize: 11 }}>contacts</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <DrMono size={13} color={sev}>
                    {r.repeatPct}%
                  </DrMono>
                  <div style={{ color: DR.muted, fontSize: 11 }}>repeat</div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 4,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${width}%`,
                    height: "100%",
                    background: hot ? DR.red : sev,
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </DrCard>
  );
}

type FunnelStage = { label: string; volume: number; status: string };

/** Fix loop funnel — v1 InvoiceDisputeFunnel layout. */
export function FixLoopFunnel({
  title,
  sub,
  stages,
}: {
  title: string;
  sub: string;
  stages: FunnelStage[];
}) {
  const L = useLabel2();
  const max = stages[0]?.volume ?? 1;
  return (
    <DrCard
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <DrHead sub={sub}>{title}</DrHead>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateRows: `repeat(${stages.length}, minmax(0, 1fr))`,
          gap: 8,
          minHeight: 0,
        }}
      >
        {stages.map((s) => {
          const width = Math.max(18, Math.round((s.volume / max) * 100));
          const col = severityColor(s.status);
          return (
            <div
              key={s.label}
              style={{
                border: `1px solid ${DR.border}`,
                borderRadius: 10,
                padding: "10px 12px",
                background: "rgba(255,255,255,0.02)",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.1fr) minmax(90px, 1fr) auto",
                gap: 12,
                alignItems: "center",
                minHeight: 0,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: DR.text }}>
                  {L(s.label)}
                </div>
              </div>
              <div
                style={{
                  height: 28,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: `${width}%`,
                    height: "100%",
                    borderRadius: 6,
                    background: withAlpha(col, 0.28),
                    borderRight: `2px solid ${col}`,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 8,
                    minWidth: 44,
                  }}
                >
                  <DrMono size={14}>{s.volume}</DrMono>
                </div>
              </div>
              <DrBadge color={col}>{s.status}</DrBadge>
            </div>
          );
        })}
      </div>
    </DrCard>
  );
}

/** Full theme register drawer. */
export function ThemeRegisterDrawer({
  open,
  onClose,
  themes,
}: {
  open: boolean;
  onClose: () => void;
  themes: RecurringThemeRow[];
}) {
  const L = useLabel2();
  if (!open) return null;

  const sorted = [...themes].sort((a, b) => {
    const order: Record<string, number> = {
      "back-after-fix": 0,
      "no-fix": 1,
      holding: 2,
    };
    const d = (order[a.status] ?? 9) - (order[b.status] ?? 9);
    if (d !== 0) return d;
    return b.contacts13w - a.contacts13w;
  });

  const statusLabel = (s: string, id: string) => {
    if (s === "back-after-fix")
      return id === "rc-01" ? "Back after fix (3rd time)" : "Back after fix";
    if (s === "no-fix") return "No fix on record";
    return "Holding";
  };

  return (
    <div
      role="dialog"
      aria-label="Theme register"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.45)",
      }}
    >
      <button
        type="button"
        aria-label="Close register"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      />
      <aside
        style={{
          position: "relative",
          width: "min(720px, 100%)",
          height: "100%",
          background: K.elevated,
          borderLeft: `1px solid ${K.borderLight}`,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: K.text }}>
            Theme register · {themes.length}
          </h2>
          <button
            type="button"
            className="kgs2-focus"
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${K.borderLight}`,
              borderRadius: 8,
              color: K.textSec,
              padding: "6px 10px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Close
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                {[
                  "Theme",
                  "Contacts",
                  "Last fix",
                  "Status",
                  "Channels",
                  "Partners",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 8px",
                      color: K.textMut,
                      borderBottom: `1px solid ${K.borderLight}`,
                      fontWeight: 700,
                      fontSize: 11,
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.id}>
                  <td style={td}>{L(t.name)}</td>
                  <td style={{ ...td, fontFamily: K.mono }}>{t.contacts13w}</td>
                  <td style={td}>{t.lastFixLabel}</td>
                  <td style={td}>{statusLabel(t.status, t.id)}</td>
                  <td style={td}>{t.channels.join(", ")}</td>
                  <td style={{ ...td, fontFamily: K.mono }}>{t.partners}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </aside>
    </div>
  );
}

const td: CSSProperties = {
  padding: "8px 8px",
  borderBottom: `1px solid ${K.borderLight}`,
  color: K.body,
  verticalAlign: "top",
};
