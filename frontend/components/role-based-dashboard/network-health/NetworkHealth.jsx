"use client";

import React, { useMemo, useState } from "react";
import {
  Sparkles, Layers,
  Radio, ArrowLeft,
  ArrowUpRight, ArrowDownRight,
  ScanSearch, Stethoscope, ListChecks, Info,
} from "lucide-react";
import { buildNetworkHealth, normalizePeriod } from "./networkHealthPeriod";
import { RunningValue } from "./RunningValue";

/* ================================================================= tokens */
const C = {
  appBg: "#f4f5fb", panel: "#ffffff", panelAlt: "#fafbff",
  border: "#e7e9f3", borderStrong: "#d6d9ea",
  ink: "#1b1e34", ink2: "#585d7d", ink3: "#8a8fac",
  accent: "#4f46e5", accentLine: "#6366f1", accentSoft: "#eef0fe",
};
/* --------------------------------------------------------------- helpers */
const Pill = ({ children, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
    padding: "3px 9px", borderRadius: 999, lineHeight: 1.1, ...style }}>{children}</span>
);

function RateBar({ pct, color }) {
  return (
    <div style={{ height: 6, background: "#eef0f6", borderRadius: 999, overflow: "hidden", width: "100%" }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 999 }} />
    </div>
  );
}

const Card = ({ children, style, accent }) => {
  const flush = style?.padding === 0;
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", ...style }}>
      {accent && <div style={{ height: 3, background: accent }} />}
      <div style={{ padding: flush ? 0 : "14px 16px" }}>{children}</div>
    </div>
  );
};

const SecTitle = ({ children, sub, right, compact }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: compact ? 8 : 10 }}>
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ fontSize: compact ? 13.5 : 14.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>{children}</div>
      {sub && <div style={{ fontSize: compact ? 11 : 11.5, color: C.ink3, fontWeight: 600, marginTop: 2, lineHeight: 1.35 }}>{sub}</div>}
    </div>
    {right && <div style={{ marginLeft: "auto", flexShrink: 0 }}>{right}</div>}
  </div>
);

const LISN_ICONS = {
  scan: ScanSearch,
  sop: Stethoscope,
  dispo: ListChecks,
};

function FlowMixBar({ mix }) {
  return (
    <div>
      <div style={{ height: 10, borderRadius: 999, overflow: "hidden", display: "flex", background: "#eef0f6" }}>
        {mix.map((m) => (
          <div key={m.label} style={{ width: `${m.pct}%`, background: m.c, height: "100%" }} title={`${m.label} ${m.pct}%`} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", marginTop: 8 }}>
        {mix.map((m) => (
          <span key={m.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.ink2, fontWeight: 600 }}>
            <span style={{ width: 9, height: 9, borderRadius: 0, background: m.c, flexShrink: 0 }} />
            {m.label} {m.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

function LisnStepCard({ card, delay = 40 }) {
  const Arrow = card.deltaDown ? ArrowDownRight : ArrowUpRight;
  const dcol = card.deltaBad ? "#dc2626" : "#16a34a";
  const SecArrow = card.secondaryDeltaDown ? ArrowDownRight : ArrowUpRight;
  const scol = card.secondaryDeltaDown ? "#16a34a" : "#16a34a";
  const Icon = LISN_ICONS[card.icon] || ScanSearch;
  const hasSecondary = card.secondaryValue != null;
  return (
    <Card accent={card.accent} style={{ height: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: `${card.accent}14`, color: card.accent,
          display: "grid", placeItems: "center",
        }}>
          <Icon size={15} strokeWidth={2.4} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>
              {card.title}
            </div>
            {card.badge && (
              <Pill style={{
                marginLeft: "auto", flexShrink: 0,
                background: C.accentSoft, color: C.accent,
                fontSize: 11, fontWeight: 800, gap: 4,
              }}>
                {card.badge.ai ? <Sparkles size={11} strokeWidth={2.4} /> : null}
                {card.badge.value != null && (
                  <RunningValue value={card.badge.value} delay={delay} duration={650} />
                )}
                <span style={{ fontWeight: 700 }}>{card.badge.label}</span>
              </Pill>
            )}
          </div>
          <div style={{ fontSize: 11, color: C.ink3, fontWeight: 600, marginTop: 2, lineHeight: 1.35 }}>
            {card.subtitle}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.6, color: C.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          <RunningValue value={card.value} delay={delay} />
        </span>
        {card.delta != null && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 1, fontSize: 12, fontWeight: 800, color: dcol }}>
            <Arrow size={13} strokeWidth={2.6} />
            <RunningValue value={card.delta} delay={delay + 40} duration={700} />
          </span>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600, marginBottom: hasSecondary ? 12 : 14, lineHeight: 1.35 }}>
        {card.valueLabel}
      </div>

      {hasSecondary && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: C.ink, fontVariantNumeric: "tabular-nums" }}>
            <RunningValue value={card.secondaryValue} delay={delay + 60} />
          </span>
          <span style={{ fontSize: 11.5, color: C.ink3, fontWeight: 600 }}>{card.secondaryLabel}</span>
          {card.secondaryDelta != null && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 1, fontSize: 11, fontWeight: 800, color: scol }}>
              <SecArrow size={12} strokeWidth={2.6} />
              <RunningValue value={card.secondaryDelta} delay={delay + 80} duration={650} />
            </span>
          )}
        </div>
      )}

      <div style={{ fontSize: 10.5, letterSpacing: 0.3, textTransform: "uppercase", color: C.ink3, fontWeight: 700, marginBottom: 6 }}>
        {card.mixTitle}
      </div>
      <FlowMixBar mix={card.mix} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 12 }}>
        <Info size={12} strokeWidth={2.4} style={{ color: C.ink3, flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 10.5, color: C.ink3, fontWeight: 600, lineHeight: 1.4 }}>
          {card.foot}
        </div>
      </div>
    </Card>
  );
}

function LisnEngineSection({ engine }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <SecTitle
        sub={engine.sub}
        right={
          <Pill style={{ background: C.accentSoft, color: C.accent }}>
            <Sparkles size={11} strokeWidth={2.4} /> {engine.live}
          </Pill>
        }
      >
        {engine.title}
      </SecTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {engine.cards.map((card, i) => (
          <LisnStepCard key={card.step} card={card} delay={40 + i * 50} />
        ))}
      </div>
    </div>
  );
}

/* =================================================================== data */
function contribColor(pct) {
  if (pct >= 35) return "#dc2626";
  if (pct >= 18) return "#d97706";
  return "#16a34a";
}

const RAG = {
  green: { bg: "#ecfdf3", fg: "#15803d", bd: "#bbf7d0" },
  amber: { bg: "#fffbeb", fg: "#b45309", bd: "#fde68a" },
  red:   { bg: "#fef2f2", fg: "#b91c1c", bd: "#fecaca" },
};

/** Map metric value → RAG band. higherIsBad=true for risk-style metrics. */
function ragBand(kind, value) {
  switch (kind) {
    case "rePromise":
      if (value <= 13) return "green";
      if (value <= 15.5) return "amber";
      return "red";
    case "breach":
      if (value <= 7) return "green";
      if (value <= 8) return "amber";
      return "red";
    case "risk":
      if (value <= 15) return "green";
      if (value <= 18) return "amber";
      return "red";
    case "escalation":
      if (value <= 5.5) return "green";
      if (value <= 7) return "amber";
      return "red";
    case "sop":
      // higher is better — share decided by deterministic SOP
      if (value >= 82) return "green";
      if (value >= 78) return "amber";
      return "red";
    default:
      return "amber";
  }
}

function heatBg(kind, value) {
  return RAG[ragBand(kind, value)].bg;
}

function heatFg(kind, value) {
  return RAG[ragBand(kind, value)].fg;
}

const SELLER_LABEL = {
  CloudTail: { bg: "#fef2f2", fg: "#b91c1c", bd: "#fecaca" },
  RetailNet: { bg: "#fffbeb", fg: "#b45309", bd: "#fde68a" },
  Omniverse: { bg: "#eff6ff", fg: "#1d4ed8", bd: "#bfdbfe" },
};

const STATE_LABEL = {
  TS: { bg: "#fef2f2", fg: "#b91c1c", bd: "#fecaca" },
  BR: { bg: "#fff7ed", fg: "#c2410c", bd: "#fed7aa" },
  KA: { bg: "#f5f3ff", fg: "#6d28d9", bd: "#ddd6fe" },
  UP: { bg: "#fffbeb", fg: "#b45309", bd: "#fde68a" },
  MH: { bg: "#ecfeff", fg: "#0e7490", bd: "#a5f3fc" },
  DL: { bg: "#eff6ff", fg: "#1d4ed8", bd: "#bfdbfe" },
};

const DISPO_LABEL = {
  "Info + update": { bg: "#eff6ff", fg: "#1d4ed8", bd: "#bfdbfe" },
  "Re-promise": { bg: "#f5f3ff", fg: "#6d28d9", bd: "#ddd6fe" },
  Escalate: { bg: "#fdf2f8", fg: "#be185d", bd: "#fbcfe8" },
  "Info + follow-up": { bg: "#f0fdfa", fg: "#0f766e", bd: "#99f6e4" },
};

function SellerLabel({ name }) {
  const tone = SELLER_LABEL[name] || { bg: C.accentSoft, fg: C.accent, bd: "#c7d2fe" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", fontSize: 11.5, fontWeight: 700,
      color: tone.fg, background: tone.bg, border: `1px solid ${tone.bd}`,
      borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap",
    }}>{name}</span>
  );
}

function StateLabel({ code }) {
  const tone = STATE_LABEL[code] || { bg: C.accentSoft, fg: C.accent, bd: "#c7d2fe" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: 36, fontSize: 12, fontWeight: 800, letterSpacing: 0.4,
      color: tone.fg, background: tone.bg, border: `1px solid ${tone.bd}`,
      borderRadius: 8, padding: "4px 10px", whiteSpace: "nowrap",
    }}>{code}</span>
  );
}

function DispositionLabel({ name }) {
  const tone = DISPO_LABEL[name] || { bg: C.accentSoft, fg: C.accent, bd: "#c7d2fe" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 11.5, fontWeight: 700,
      color: tone.fg, background: tone.bg, border: `1px solid ${tone.bd}`,
      borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap",
    }}>{name}</span>
  );
}

function LedgerCell({ children, align = "right", bg, color, strong }) {
  return (
    <td style={{
      padding: "10px 12px",
      textAlign: align,
      fontWeight: strong ? 800 : 700,
      color: color || C.ink,
      background: bg || "transparent",
      whiteSpace: "nowrap",
      verticalAlign: "middle",
    }}>{children}</td>
  );
}

/* ==================================================================== app */
export default function NetworkHealth({ onExit }) {
  const [period, setPeriod] = useState("30D");
  const [escIdx, setEscIdx] = useState(0);

  const safePeriod = normalizePeriod(period);
  const data = useMemo(() => buildNetworkHealth(safePeriod), [safePeriod]);
  const escSafeIdx = Math.min(escIdx, Math.max(0, data.escTop5.length - 1));
  const escSelected = data.escTop5[escSafeIdx];
  const escContrib = escSelected?.contrib?.Stage || [];

  const onPeriodChange = (p) => {
    setPeriod(normalizePeriod(p));
    setEscIdx(0);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif", background: C.appBg,
      color: C.ink, minHeight: "100vh" }}>

      {/* -------------------------------------------------------- header */}
      <header style={{ position: "sticky", top: 0, zIndex: 10, background: C.panel,
        borderBottom: `1px solid ${C.border}`, padding: "11px 22px", display: "flex", alignItems: "center", gap: 14 }}>
        {onExit ? (
          <button type="button" onClick={onExit} style={{
            display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${C.border}`,
            background: C.appBg, color: C.ink2, borderRadius: 8, padding: "6px 10px", cursor: "pointer",
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            <ArrowLeft size={14} strokeWidth={2.4} /> Roles
          </button>
        ) : null}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${C.accent},#7c3aed)`,
            display: "grid", placeItems: "center" }}><Radio size={17} color="#fff" strokeWidth={2.4} /></div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 800, letterSpacing: -0.2 }}>Delivery Network Health · Control Tower</div>
            <div style={{ fontSize: 10.5, color: C.ink3, fontWeight: 600, marginTop: -1 }} suppressHydrationWarning>
              Forward-leg · pattern &amp; hotspot view · leadership · {data.period}
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 2, background: C.appBg, border: `1px solid ${C.border}`, borderRadius: 9, padding: 3 }}>
            {["7D", "30D", "90D"].map(p => (
              <button key={p} type="button" onClick={() => onPeriodChange(p)} style={{
                cursor: "pointer", fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 6, border: "none",
                background: safePeriod === p ? C.accent : "transparent", color: safePeriod === p ? "#fff" : C.ink2 }}>{p}</button>
            ))}
          </div>
        </div>
      </header>

      <div style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "16px 28px 40px" }}>

        <LisnEngineSection engine={data.lisnEngine} />

        {/* ------------------------------------------ developing patterns */}
        <div style={{ marginBottom: 16 }}>
          <SecTitle
            sub="Sudden spikes vs creeping degradation — select a pattern, then slice contribution"
            right={
              <Pill style={{ background: C.accentSoft, color: C.accent, display: "inline-flex", alignItems: "center", gap: 5 }}>
                <Sparkles size={11} strokeWidth={2.4} />
                Confidence <RunningValue value={`${escSelected?.conf ?? 0}%`} delay={40} duration={700} />
              </Pill>
            }
          >
            Developing patterns
          </SecTitle>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(280px, 0.9fr)", gap: 12, alignItems: "stretch" }}>
            <Card accent="#7c3aed" style={{ padding: 0, height: "100%" }}>
              <div>
                {data.escTop5.map((t, i) => {
                  const selected = escSafeIdx === i;
                  return (
                    <button
                      key={t.s}
                      type="button"
                      onClick={() => setEscIdx(i)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "28px minmax(0, 1fr) auto",
                        gap: 10,
                        alignItems: "center",
                        width: "100%",
                        minHeight: 52,
                        padding: "12px 14px",
                        border: 0,
                        borderTop: i ? `1px solid ${C.border}` : "none",
                        textAlign: "left",
                        cursor: "pointer",
                        background: selected ? C.panelAlt : "transparent",
                        boxShadow: selected ? `inset 3px 0 0 ${C.accent}` : undefined,
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 800, color: selected ? C.accent : C.ink3 }}>{`#${i + 1}`}</span>
                      <span style={{ fontSize: 13, color: C.ink, fontWeight: 700, lineHeight: 1.35 }}>{t.s}</span>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0,
                        fontSize: 10.5, fontWeight: 700, color: "#b45309", background: "#fffbeb",
                        border: "1px solid #fde68a", padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap",
                      }}>
                        <Layers size={10} strokeWidth={2.6} /> <RunningValue value={t.blast} delay={40 + i * 30} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card style={{ padding: 0, height: "100%" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8, minHeight: 52,
                padding: "12px 14px", borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>Contribution analysis</span>
                <Pill style={{ marginLeft: "auto", background: C.accentSoft, color: C.accent }}>Stage</Pill>
              </div>
              <div style={{ padding: "12px 14px 14px" }}>
                <div style={{ fontSize: 11.5, color: C.ink2, fontWeight: 600, marginBottom: 12, lineHeight: 1.35 }}>
                  <span style={{ color: C.accent, fontWeight: 800 }}>#{escSafeIdx + 1}</span>
                  {" · "}{escSelected?.s}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {escContrib.map(([k, v]) => {
                    const col = contribColor(v);
                    return (
                      <div key={k}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{k}</span>
                          <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 800, color: col }}><RunningValue value={`${v}%`} delay={50} /></span>
                        </div>
                        <RateBar pct={v} color={col} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ------------------------------------------ operations ledger */}
        <Card key={`ledger-${data.period}`} accent="#0891b2" style={{ marginBottom: 16, padding: 0 }}>
          <div style={{
            padding: "14px 12px 12px", borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>
              Operations Ledger
            </div>
            <button
              type="button"
              tabIndex={-1}
              style={{
                marginLeft: "auto",
                cursor: "default",
                fontSize: 11.5, fontWeight: 700,
                padding: "5px 12px", borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.appBg, color: C.ink2,
                lineHeight: 1.1,
              }}
            >
              {data.period === "7D" && "Last 7 days"}
              {data.period === "30D" && "All months"}
              {data.period === "90D" && "Quarter to quarter"}
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%", borderCollapse: "collapse", fontSize: 12.5,
              fontVariantNumeric: "tabular-nums",
            }}>
              <thead>
                <tr style={{ background: C.panelAlt }}>
                  {[
                    { l: data.ledgerDateLabel || "Date", align: "left" },
                    { l: "Inflow", align: "right" },
                    { l: "Closed", align: "right" },
                    { l: "Re-Promise Rate", align: "center" },
                    { l: "Breach", align: "center" },
                    { l: "At risk", align: "center" },
                    { l: "Escalation", align: "center" },
                    { l: "SOP Applied", align: "center" },
                    { l: "Top Dispositions", align: "center" },
                    { l: "Top State", align: "center" },
                    { l: "Flagged Seller", align: "center" },
                  ].map((h) => (
                    <th key={h.l} style={{
                      padding: "10px 12px",
                      textAlign: h.align,
                      borderBottom: `1px solid ${C.border}`,
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                    }}>
                      <span style={{
                        display: "block",
                        fontSize: 10, letterSpacing: 0.3, textTransform: "uppercase",
                        color: C.ink3, fontWeight: 700, lineHeight: 1.2,
                      }}>
                        {h.l}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.opsDays.map((d, i) => (
                  <tr key={`${data.period}-${d.date}-${i}`} style={{ borderTop: `1px solid ${C.border}`, background: d.now ? C.panelAlt : "transparent" }}>
                    <LedgerCell align="left">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        {d.date}
                        {d.now && (
                          <span style={{
                            fontSize: 9.5, fontWeight: 800, letterSpacing: 0.4,
                            color: C.accent, background: C.accentSoft, borderRadius: 999, padding: "2px 6px",
                          }}>{data.ledgerNowLabel || "Today"}</span>
                        )}
                      </span>
                    </LedgerCell>
                    <LedgerCell align="right"><RunningValue value={d.inflow} delay={30} /></LedgerCell>
                    <LedgerCell align="right"><RunningValue value={d.closed} delay={40} /></LedgerCell>
                    <LedgerCell align="center" bg={heatBg("rePromise", d.rePromise)} color={heatFg("rePromise", d.rePromise)}><RunningValue value={`${d.rePromise}%`} delay={45} /></LedgerCell>
                    <LedgerCell
                      align="center"
                      strong
                      bg={d.breachHot ? RAG.red.bg : heatBg("breach", d.breach)}
                      color={d.breachHot ? RAG.red.fg : heatFg("breach", d.breach)}
                    ><RunningValue value={`${d.breach}%`} delay={55} /></LedgerCell>
                    <LedgerCell align="center" bg={heatBg("risk", d.risk)} color={heatFg("risk", d.risk)}><RunningValue value={`${d.risk}%`} delay={60} /></LedgerCell>
                    <LedgerCell align="center" bg={heatBg("escalation", d.escalation)} color={heatFg("escalation", d.escalation)}><RunningValue value={`${d.escalation}%`} delay={65} /></LedgerCell>
                    <LedgerCell align="center" bg={heatBg("sop", d.sopApplied)} color={heatFg("sop", d.sopApplied)}><RunningValue value={`${d.sopApplied}%`} delay={70} /></LedgerCell>
                    <LedgerCell align="center"><DispositionLabel name={d.disposition} /></LedgerCell>
                    <LedgerCell align="center"><StateLabel code={d.state} /></LedgerCell>
                    <LedgerCell align="center"><SellerLabel name={d.seller} /></LedgerCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{
            padding: "10px 10px 12px", borderTop: `1px solid ${C.border}`,
            fontSize: 11, color: C.ink3, fontWeight: 600, lineHeight: 1.45,
          }}>
            Inflow = arrived that {data.ledgerFooterUnit || "day"} · Closed = cleared that {data.ledgerFooterUnit || "day"} · Re-Promise Rate = share of cases with a revised delivery promise · Breach = promise miss · At risk = inside breach window · Escalation = cases raised · SOP Applied = share decided by deterministic SOP rule · Top Dispositions = leading recommended action · Top State = top breach / escalation state · Flagged Seller = breach / escalation concentration
          </div>
        </Card>

      </div>
    </div>
  );
}
