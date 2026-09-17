"use client";

/**
 * Bottom row for HDFC Contacts Ending Well:
 * Repeat-contact mining + Recovery priority matrix.
 * Sized to fill like retail_banking/head_contact (not a stub chart).
 */
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Calendar,
  ChevronRight,
  Eye,
  Flag,
  UserCheck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  INTENT_COLOR_MAP,
  QUADRANT_COLOR,
  type ContactsEndingWellSnapshot,
} from "@/lib/role-based-dashboard/hdfc/ContactsEndingWellData";
import {
  type DashboardThemeTokens,
  useDashboardTheme,
} from "../DashboardThemeContext";

type Snapshot = ContactsEndingWellSnapshot;

function borderSides(
  top: string,
  right: string,
  bottom: string,
  left: string,
): Pick<
  CSSProperties,
  "borderTop" | "borderRight" | "borderBottom" | "borderLeft"
> {
  return {
    borderTop: top,
    borderRight: right,
    borderBottom: bottom,
    borderLeft: left,
  };
}

function boxBorder(color: string) {
  const v = `1px solid ${color}`;
  return borderSides(v, v, v, v);
}

function ChartTip({
  active,
  payload,
  label,
  T,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; fill?: string }[];
  label?: string;
  T: DashboardThemeTokens;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(10,14,22,0.96)",
        ...boxBorder(T.borderLight),
        borderRadius: 8,
        padding: "8px 11px",
        fontSize: 11,
      }}
    >
      <div style={{ color: T.text, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div
          key={String(p.name)}
          style={{ display: "flex", alignItems: "center", gap: 6, color: T.textSec }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.color || p.fill || T.cyan,
            }}
          />
          <span style={{ flex: 1 }}>{p.name}</span>
          <span style={{ color: T.text, fontWeight: 700, fontFamily: "var(--mono)" }}>
            {Number(p.value).toLocaleString()} repeats
          </span>
        </div>
      ))}
    </div>
  );
}

const QUADRANT_ICONS = {
  do_now: Flag,
  schedule: Calendar,
  delegate: UserCheck,
  monitor: Eye,
} as const;

type PanelShellProps = {
  title: string;
  subtitle: string;
  accentColor: string;
  aiModel: string;
  children: ReactNode;
};

/** Shared AI panel shell — matches retail AIPanel rhythm. */
export function BottomRowPanel({
  title,
  subtitle,
  accentColor,
  aiModel,
  children,
}: PanelShellProps) {
  const T = useDashboardTheme();
  const edge = `${accentColor}35`;
  return (
    <div
      style={{
        background: T.elevated,
        ...borderSides(
          `1px solid ${edge}`,
          `1px solid ${edge}`,
          `1px solid ${edge}`,
          `3px solid ${accentColor}`,
        ),
        borderRadius: 14,
        padding: 18,
        position: "relative",
        overflow: "hidden",
        height: "100%",
        minHeight: 480,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>✨</span>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: T.text,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              {title}
            </span>
          </div>
          <div style={{ fontSize: 11, color: T.textMut, marginTop: 4 }}>{subtitle}</div>
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            color: accentColor,
            letterSpacing: 0.7,
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: 999,
            background: `${accentColor}15`,
            ...boxBorder(`${accentColor}40`),
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          ✨ AI · {aiModel}
        </span>
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Left: repeat-contact by intent — full panel height, readable labels. */
export function RepeatContactMiningPanel({
  data,
}: {
  data: Snapshot["repeat_contact_mining"];
}) {
  const T = useDashboardTheme();
  const chartRows = useMemo(
    () =>
      data.intents.map((i) => ({
        intent: i.intent,
        repeats: i.repeats,
        fill: INTENT_COLOR_MAP[i.color] ?? INTENT_COLOR_MAP.gray,
      })),
    [data.intents],
  );

  return (
    <BottomRowPanel
      title={data.title}
      subtitle={data.subtitle}
      accentColor={T.amber}
      aiModel="Repeat-Contact Mining"
    >
      {/* Chart fills remaining panel height — no stub 260px box */}
      <div style={{ flex: 1, minHeight: 360, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartRows}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            barCategoryGap="18%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke={T.borderLight} horizontal={false} />
            <XAxis type="number" stroke={T.textMut} fontSize={11} tickMargin={6} />
            <YAxis
              type="category"
              dataKey="intent"
              stroke={T.textSec}
              fontSize={12}
              width={168}
              tickMargin={6}
              interval={0}
            />
            <Tooltip
              cursor={{ fill: `${T.cyan}10` }}
              content={(p: any) => <ChartTip {...p} T={T} />}
            />
            <Bar dataKey="repeats" radius={[0, 6, 6, 0]} barSize={22}>
              {chartRows.map((row) => (
                <Cell key={row.intent} fill={row.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${T.borderLight}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          fontSize: 12,
          color: T.textMut,
          flexShrink: 0,
        }}
      >
        <span>{data.footer}</span>
        <span style={{ color: T.amber, fontWeight: 700 }}>{data.flag}</span>
      </div>
    </BottomRowPanel>
  );
}

/** Right: Eisenhower recovery matrix — retail tile + selected strip. */
export function RecoveryPriorityMatrixPanel({
  data,
}: {
  data: Snapshot["recovery_priority_matrix"];
}) {
  const T = useDashboardTheme();
  const [selectedKey, setSelectedKey] = useState(data.selected.quadrant);
  const selected =
    data.quadrants.find((q) => q.key === selectedKey) ?? data.quadrants[0];
  const selectedColor = QUADRANT_COLOR[selected.key] ?? T.cyan;

  const selectedCopy =
    data.selected.quadrant === selectedKey
      ? {
          topReason: data.selected.top_reason,
          topIntents: data.selected.top_intents,
          action: data.selected.recommended_action,
        }
      : {
          topReason: selected.descriptor,
          topIntents: selected.items,
          action: `Prioritise ${selected.label.toLowerCase()} items in the recovery queue.`,
        };

  return (
    <BottomRowPanel
      title={data.title}
      subtitle={data.subtitle}
      accentColor={T.cyan}
      aiModel="Recovery Prioritiser"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          flex: 1,
          minHeight: 0,
          alignContent: "stretch",
        }}
      >
        {data.quadrants.map((q) => {
          const color = QUADRANT_COLOR[q.key] ?? T.textMut;
          const active = q.key === selectedKey;
          const Icon =
            QUADRANT_ICONS[q.key as keyof typeof QUADRANT_ICONS] ?? Flag;
          return (
            <button
              key={q.key}
              type="button"
              onClick={() => setSelectedKey(q.key)}
              style={{
                textAlign: "left",
                background: active ? `${color}18` : T.surface,
                ...borderSides(
                  `3px solid ${color}`,
                  `1px solid ${active ? color : T.borderLight}`,
                  `1px solid ${active ? color : T.borderLight}`,
                  `1px solid ${active ? color : T.borderLight}`,
                ),
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                cursor: "pointer",
                color: T.text,
                fontFamily: "inherit",
                transition: "all 0.18s",
                minHeight: 140,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 6,
                }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Icon size={13} color={color} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                    }}
                  >
                    {q.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    color: T.textMut,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    textAlign: "right",
                  }}
                >
                  {q.axis}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color,
                    fontFamily: "var(--mono)",
                    lineHeight: 1,
                  }}
                >
                  {q.count}
                </span>
                <span style={{ fontSize: 11, color: T.textMut }}>
                  contacts · {q.descriptor}
                </span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 14,
                  color: T.textSec,
                  fontSize: 11.5,
                  lineHeight: 1.5,
                }}
              >
                {q.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: "12px 14px",
          background: `${selectedColor}10`,
          ...borderSides(
            `1px solid ${selectedColor}40`,
            `1px solid ${selectedColor}40`,
            `1px solid ${selectedColor}40`,
            `3px solid ${selectedColor}`,
          ),
          borderRadius: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <ChevronRight size={11} color={selectedColor} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: selectedColor,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Selected · {selected.label}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 12,
            color: T.textSec,
            lineHeight: 1.5,
          }}
        >
          <div>
            <strong style={{ color: T.text }}>Top reason: </strong>
            {selectedCopy.topReason}
          </div>
          <div>
            <strong style={{ color: T.text }}>Top intents: </strong>
            {selectedCopy.topIntents.join(" · ")}
          </div>
          <div>
            <strong style={{ color: T.text }}>Recommended action: </strong>
            {selectedCopy.action}
          </div>
        </div>
      </div>
    </BottomRowPanel>
  );
}

/** Equal-height bottom row used by ContactsEndingWellDashboard. */
export function ContactsEndingWellBottomRow({
  repeats,
  recovery,
}: {
  repeats: Snapshot["repeat_contact_mining"];
  recovery: Snapshot["recovery_priority_matrix"];
}) {
  return (
    <div
      className="cew-bottom-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        alignItems: "stretch",
      }}
    >
      <RepeatContactMiningPanel data={repeats} />
      <RecoveryPriorityMatrixPanel data={recovery} />
      <style>{`
        @media (max-width: 1100px) {
          .cew-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
