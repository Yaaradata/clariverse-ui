"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  ANXIETY_CLUSTERS,
  ANXIETY_IMPERFECTIONS,
  ANXIETY_PERIODS,
  ANXIETY_SCREEN_QUESTIONS,
  ANXIETY_SCREENS,
  getEscalationTop10,
  getImperfectionEvidence,
  scaleAnxietyUnits,
  type AnxietyContribDim,
  type AnxietyPeriodData,
  type AnxietyPeriodKey,
  type AnxietyScreenId,
} from "../../lib/cxHeadRetailV3AnxietyData";
import { cssVar, radius } from "../../theme/tokens";
import { AnxietyTriadKpiCards } from "./AnxietyTriadKpiCards";
import {
  AnxietyJourneyPromisePanel,
  getJourneyMatrixTopHotspot,
  JourneyMatrixLegend,
} from "./AnxietyJourneyPromisePanel";
import { ReliabilityVsAnxietyPanel } from "./ReliabilityVsAnxietyPanel";
import {
  AnxietyCard,
  AnxietyToastStack,
  ContribBar,
  GhostBtn,
  InferenceBadge,
  MiniBand,
  PrimaryBtn,
  SegButton,
  ServiceStatusTag,
  SLATimer,
  StatePill,
  TileHead,
  anxietyBandColor,
  anxietyFmt,
} from "./AnxietyPrimitives";
import { useAnimatedNumber } from "../../lib/useAnimatedNumber";

type ToastItem = { id: number; msg: string };

function contribRagColor(pct: number): string {
  if (pct >= 35) return cssVar("severity-high");
  if (pct >= 18) return cssVar("severity-med");
  return cssVar("positive");
}

function DashboardSectionHead({
  n,
  title,
  plane,
  sub,
  trailing,
}: {
  n: string;
  title: string;
  plane?: string;
  sub?: string;
  trailing?: React.ReactNode;
}): React.ReactElement {
  return (
    <div style={{ minWidth: 0, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <span
          className="lisn-num"
          style={{
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            fontSize: 15,
            fontWeight: 800,
            color: cssVar("accent-2"),
            borderRadius: 10,
            border: `2px solid ${cssVar("accent")}`,
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          {n}
        </span>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: cssVar("text-primary"),
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h2>
            {plane ? (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: radius.pill,
                  border: `1px solid ${cssVar("border")}`,
                  color: cssVar("text-muted"),
                }}
              >
                {plane} plane
              </span>
            ) : null}
          </div>
          {trailing ? <div style={{ marginLeft: "auto", flexShrink: 0 }}>{trailing}</div> : null}
        </div>
      </div>
      {sub ? (
        <p style={{ margin: "6px 0 0 52px", fontSize: 14, color: cssVar("text-secondary"), lineHeight: 1.45 }}>{sub}</p>
      ) : null}
    </div>
  );
}

function AnxietySection({
  sectionNumber,
  screenId,
  title,
  plane,
  sub,
  headerTrailing,
  first = false,
  children,
}: {
  sectionNumber: string;
  screenId?: AnxietyScreenId;
  title?: string;
  plane?: string;
  sub?: string;
  headerTrailing?: React.ReactNode;
  first?: boolean;
  children: React.ReactNode;
}): React.ReactElement {
  const meta = screenId ? ANXIETY_SCREENS.find((s) => s.id === screenId) : undefined;
  const displayTitle = title ?? meta?.name ?? "";
  const displayPlane = plane ?? meta?.plane;
  const displaySub = sub !== undefined ? sub : screenId ? ANXIETY_SCREEN_QUESTIONS[screenId] : undefined;

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        paddingTop: first ? 0 : 8,
        borderTop: first ? undefined : `1px solid ${cssVar("border")}`,
        marginTop: first ? 0 : 8,
      }}
    >
      <DashboardSectionHead
        n={sectionNumber}
        title={displayTitle}
        plane={displayPlane}
        sub={displaySub || undefined}
        trailing={headerTrailing}
      />
      {children}
    </section>
  );
}

function AnxietyCommandScreen({
  d,
}: {
  d: (typeof ANXIETY_PERIODS)[AnxietyPeriodKey];
}): React.ReactElement {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <AnxietyCard>
        <AnxietyJourneyPromisePanel d={d} />
      </AnxietyCard>
    </div>
  );
}

function AnimatedPct({ value }: { value: number }): React.ReactElement {
  const animated = useAnimatedNumber(value, { duration: 900, delay: 60 });
  return <>{animated}%</>;
}

function AnimatedContribBar({
  label,
  pct,
  color,
  labelColor,
  pctColor,
}: {
  label: string;
  pct: number;
  color?: string;
  labelColor?: string;
  pctColor?: string;
}): React.ReactElement {
  const animatedPct = useAnimatedNumber(pct, { duration: 900, delay: 80 });
  return <ContribBar label={label} pct={animatedPct} color={color} labelColor={labelColor} pctColor={pctColor} />;
}

function ContainmentClusterUnits({ units }: { units: number }): React.ReactElement {
  const animated = useAnimatedNumber(units, { duration: 900, delay: 80 });
  return <span style={{ fontFamily: cssVar("font-numeric") }}>{anxietyFmt(animated)}</span>;
}

function shortImpactPills(text: string): readonly string[] {
  return text
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => {
      const num = part.match(/\d[\d,]*/)?.[0] ?? "0";
      if (index === 0) return `${num} contacts`;
      return `${num} escalation`;
    });
}

function ImpactLineHighlight({
  text,
  band,
}: {
  text: string;
  band: "High" | "Building";
}): React.ReactElement {
  const color = anxietyBandColor(band);
  const pills = shortImpactPills(text);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 6,
        alignItems: "center",
      }}
    >
      {pills.map((pill) => (
        <span
          key={pill}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: 18,
            padding: "0 8px",
            borderRadius: radius.pill,
            background: color,
            color: "#ffffff",
            fontSize: 9,
            fontWeight: 700,
            lineHeight: 1,
            whiteSpace: "nowrap",
            border: "none",
            boxShadow: "none",
          }}
        >
          {pill}
        </span>
      ))}
    </div>
  );
}

function ContainmentQueueScreen({
  d,
  toast,
}: {
  d: AnxietyPeriodData;
  toast: (msg: string) => void;
}): React.ReactElement {
  const [open, setOpen] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [escalatedIds, setEscalatedIds] = useState<ReadonlySet<string>>(() => new Set());

  const clusters = useMemo(
    () =>
      ANXIETY_CLUSTERS.map((c) => ({
        ...c,
        units: scaleAnxietyUnits(c.units, d.high),
        sla: Math.round(c.sla * d.clusterSlaScale),
      })),
    [d.clusterSlaScale, d.high],
  );

  const markApproved = (id: string): void => {
    setApprovedIds((prev) => new Set(prev).add(id));
  };

  const markEscalated = (id: string): void => {
    setEscalatedIds((prev) => new Set(prev).add(id));
  };

  const queueCols =
    "minmax(280px, 2.2fr) minmax(110px, 0.9fr) minmax(88px, 0.7fr) minmax(80px, 0.65fr) minmax(130px, 1fr) minmax(150px, 1.2fr) minmax(88px, 0.75fr) minmax(210px, 1fr)";

  const queueHeaders = [
    "Customer problem",
    "Journey stage",
    "Cust. affected",
    "Cust. signal",
    "Service status",
    "Recommended intervention",
    "Time to act",
    "Actions",
  ] as const;

  const headerAlign: Record<(typeof queueHeaders)[number], "left" | "center"> = {
    "Customer problem": "left",
    "Journey stage": "left",
    "Cust. affected": "center",
    "Cust. signal": "center",
    "Service status": "left",
    "Recommended intervention": "left",
    "Time to act": "center",
    Actions: "left",
  };

  /** Nudge header text only. Raise = move right, lower = move left. */
  const headerPadLeft: Record<(typeof queueHeaders)[number], number> = {
    "Customer problem": 55,
    "Journey stage": 0,
    "Cust. affected": 0,
    "Cust. signal": 0,
    "Service status": 15,
    "Recommended intervention": 0,
    "Time to act": 0,
    Actions: 60,
  };

  const cellAlign = (align: "left" | "center"): React.CSSProperties => ({
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: align === "center" ? "center" : "flex-start",
    textAlign: align,
  });

  const rowGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "subgrid",
    gridColumn: "1 / -1",
    alignItems: "center",
    padding: "12px 16px",
    minWidth: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <AnxietyCard pad={0} style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: queueCols,
            columnGap: 12,
            width: "100%",
            minWidth: 0,
          }}
        >
          <div
            style={{
              ...rowGridStyle,
              fontSize: 11,
              fontWeight: 700,
              color: cssVar("text-muted"),
              textTransform: "uppercase",
              letterSpacing: 0.35,
              borderBottom: `1px solid ${cssVar("border")}`,
              background: cssVar("surface-raised"),
            }}
          >
            {queueHeaders.map((label) => (
              <span
                key={label}
                title={label}
                style={{
                  ...cellAlign(headerAlign[label]),
                  lineHeight: 1.35,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingLeft: headerPadLeft[label],
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {clusters.map((c) => {
            const isApproved = approvedIds.has(c.id);
            const isEscalated = escalatedIds.has(c.id);

            return (
              <React.Fragment key={c.id}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={open === c.id}
                  aria-label={`Show evidence for ${c.label}`}
                  onClick={() => setOpen(open === c.id ? null : c.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpen(open === c.id ? null : c.id);
                    }
                  }}
                  style={{
                    ...rowGridStyle,
                    fontSize: 12,
                    borderBottom: `1px solid ${cssVar("border")}`,
                    cursor: "pointer",
                    background: c.carve
                      ? `${cssVar("severity-med")}08`
                      : open === c.id
                        ? cssVar("surface-raised")
                        : undefined,
                  }}
                >
                  <span style={{ minWidth: 0, padding: 0, margin: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: cssVar("text-primary"),
                        lineHeight: 1.35,
                        margin: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.label}
                    </div>
                    <ImpactLineHighlight text={c.impactLine} band={c.band} />
                  </span>
                  <span style={{ ...cellAlign("left"), color: cssVar("text-secondary") }}>{c.node}</span>
                  <span style={cellAlign("center")}>
                    <ContainmentClusterUnits units={c.units} />
                  </span>
                  <span style={cellAlign("center")}>
                    <MiniBand band={c.band} />
                  </span>
                  <span style={cellAlign("left")}>
                    <ServiceStatusTag status={c.serviceStatus} />
                  </span>
                  <span style={cellAlign("left")}>
                    <div style={{ color: cssVar("text-primary"), fontWeight: 500, lineHeight: 1.35 }}>{c.tmpl}</div>
                  </span>
                  <span style={cellAlign("center")}>
                    <SLATimer seconds={c.sla} />
                  </span>
                  <span
                    style={{
                      ...cellAlign("left"),
                      gap: 4,
                      flexWrap: "nowrap",
                      whiteSpace: "nowrap",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <PrimaryBtn
                      tiny
                      disabled={isApproved}
                      onClick={() => {
                        if (isApproved) return;
                        markApproved(c.id);
                        toast(`Outreach approved — ${c.tmpl} · ${anxietyFmt(c.units)} customers`);
                      }}
                    >
                      {isApproved ? "Approved" : "Approve outreach"}
                    </PrimaryBtn>
                    <GhostBtn
                      disabled={isEscalated}
                      onClick={() => {
                        if (isEscalated) return;
                        markEscalated(c.id);
                        toast(`${c.id} escalated to customer operations`);
                      }}
                    >
                      {isEscalated ? "Escalated" : "Escalate"}
                    </GhostBtn>
                  </span>
                </div>
                {open === c.id ? (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      padding: "12px 18px 16px",
                      background: cssVar("surface-raised"),
                      borderBottom: `1px solid ${cssVar("border")}`,
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: cssVar("text-muted"), marginBottom: 8 }}>
                      Evidence behind this customer problem
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                      {c.evidence.map((e, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 12,
                            color: cssVar("text-secondary"),
                            display: "flex",
                            gap: 6,
                            alignItems: "flex-start",
                          }}
                        >
                          {e}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: cssVar("text-secondary") }}>
                      <span style={{ fontWeight: 700, color: cssVar("text-muted") }}>Outreach preview:</span>{" "}
                      &ldquo;
                      {c.serviceStatus === "Within service window"
                        ? "Your order is still on track for the committed window. We are moving it now and will keep you updated with the latest ETA."
                        : "We missed the promised timeline on your order. Here is your revised ETA and a way to confirm a convenient slot."}
                      &rdquo;
                    </div>
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </AnxietyCard>
    </div>
  );
}

function EscalationPatternsScreen({
  d,
  toast,
}: {
  d: AnxietyPeriodData;
  toast: (msg: string) => void;
}): React.ReactElement {
  const [selectedTop10, setSelectedTop10] = useState(0);
  const [dim, setDim] = useState<AnxietyContribDim>("Channel");
  const top10 = useMemo(() => getEscalationTop10(d), [d]);
  const selectedStatement = top10[selectedTop10];
  const contrib = selectedStatement.contrib;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
        <AnxietyCard pad={0} style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 18px 10px" }}>
            <TileHead title="Top-10 problem statements" />
          </div>
          <div style={{ overflowY: "visible" }}>
            {top10.map((t, i) => {
              const selected = selectedTop10 === i;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedTop10(i)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr 44px auto",
                    gap: 10,
                    alignItems: "center",
                    width: "100%",
                    padding: "10px 18px",
                    border: 0,
                    borderTop: `1px solid ${cssVar("border")}`,
                    textAlign: "left",
                    cursor: "pointer",
                    background: selected ? cssVar("surface-raised") : "transparent",
                    boxShadow: selected ? `inset 3px 0 0 ${cssVar("accent")}` : undefined,
                    transition: "background 0.15s ease, box-shadow 0.15s ease",
                  }}
                >
                  <span
                    className="lisn-num"
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: selected ? cssVar("accent-2") : cssVar("text-muted"),
                    }}
                  >
                    #{i + 1}
                  </span>
                  <span>
                    <span style={{ fontSize: 13, color: cssVar("text-primary"), display: "block" }}>
                      {t.s}
                    </span>
                  </span>
                  <span style={{ fontFamily: cssVar("font-numeric"), fontSize: 12 }}>
                    <AnimatedPct value={t.c} />
                  </span>
                  <StatePill state={t.state} />
                </button>
              );
            })}
          </div>
        </AnxietyCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <AnxietyCard>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 10,
                width: "100%",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>Contribution analysis</span>
              <div style={{ display: "flex", gap: 6, marginLeft: "auto", flexShrink: 0 }}>
                {(Object.keys(contrib) as AnxietyContribDim[]).map((k) => (
                  <SegButton key={k} active={dim === k} onClick={() => setDim(k)}>
                    {k}
                  </SegButton>
                ))}
              </div>
            </div>

            <p
              style={{
                fontSize: 11,
                color: cssVar("text-muted"),
                margin: "0 0 10px",
                lineHeight: 1.45,
              }}
            >
              Under <span style={{ color: cssVar("text-secondary"), fontWeight: 600 }}>#{selectedTop10 + 1}</span> ·{" "}
              {selectedStatement.s}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {contrib[dim].map(([k, v]) => {
                const barColor = contribRagColor(v);

                return (
                  <AnimatedContribBar
                    key={k}
                    label={k}
                    pct={v}
                    color={barColor}
                    labelColor={barColor}
                    pctColor={barColor}
                  />
                );
              })}
            </div>
          </AnxietyCard>

          <AnxietyCard>
            <TileHead title="Emerging-imperfection candidates" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ANXIETY_IMPERFECTIONS.map((im, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 12px",
                    borderRadius: radius.md,
                    border: `1px solid ${cssVar("border")}`,
                    background: cssVar("surface-raised"),
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary") }}>{im.title}</span>
                    {"conf" in im ? <InferenceBadge conf={im.conf} small /> : null}
                  </div>
                  <div style={{ fontSize: 12, color: cssVar("text-muted"), marginBottom: 8 }}>
                    {getImperfectionEvidence(im, d)}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <GhostBtn
                      onClick={() => toast(`"${im.title.split(" — ")[0]}" flagged as emerging imperfection`)}
                    >
                      Flag as imperfection
                    </GhostBtn>
                    <GhostBtn onClick={() => toast("Routed to accountable pre-order team")}>Route to team</GhostBtn>
                  </div>
                </div>
              ))}
            </div>
          </AnxietyCard>
        </div>
      </div>
    </div>
  );
}

export function AnxietyPeriodControls({
  period,
  onPeriodChange,
}: {
  period: AnxietyPeriodKey;
  onPeriodChange: (k: AnxietyPeriodKey) => void;
}): React.ReactElement {
  const groupStyle: React.CSSProperties = {
    display: "inline-flex",
    background: cssVar("surface-raised"),
    border: `1px solid ${cssVar("border")}`,
    borderRadius: 9,
    padding: 2,
    flexShrink: 0,
  };
  const btnStyle = (active: boolean): React.CSSProperties => ({
    border: 0,
    background: active ? cssVar("surface") : "transparent",
    fontSize: 11.5,
    fontWeight: 600,
    color: active ? cssVar("accent") : cssVar("text-muted"),
    padding: "5px 10px",
    borderRadius: 7,
    cursor: "pointer",
    boxShadow: active ? cssVar("shadow-card") : undefined,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <div style={groupStyle}>
        {(Object.keys(ANXIETY_PERIODS) as AnxietyPeriodKey[]).map((k) => (
          <button key={k} type="button" onClick={() => onPeriodChange(k)} style={btnStyle(period === k)}>
            {ANXIETY_PERIODS[k].label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ServiceDeliveryAnxietyDashboard({
  period,
}: {
  period: AnxietyPeriodKey;
}): React.ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const d = ANXIETY_PERIODS[period];

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);
  const deliveryTopHotspot = useMemo(() => getJourneyMatrixTopHotspot(d), [d]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <AnxietyTriadKpiCards d={d} periodLabel={d.label} />

      <AnxietySection sectionNumber="01" screenId={4}>
        <EscalationPatternsScreen d={d} toast={toast} />
      </AnxietySection>

      <AnxietySection
        sectionNumber="02"
        title="Delivery signals"
        sub=""
        headerTrailing={<JourneyMatrixLegend topHotspot={deliveryTopHotspot} />}
      >
        <AnxietyCommandScreen d={d} />
      </AnxietySection>

      <AnxietySection sectionNumber="03" screenId={3} sub="">
        <ReliabilityVsAnxietyPanel d={d} />
      </AnxietySection>

      <AnxietySection sectionNumber="04" screenId={2}>
        <ContainmentQueueScreen d={d} toast={toast} />
      </AnxietySection>

      <AnxietyToastStack items={toasts} />
    </div>
  );
}
