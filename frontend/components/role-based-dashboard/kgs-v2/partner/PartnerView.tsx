"use client";

import partner from "@kgs2/data/partner.json";
import { useDemo2, useLabel2 } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import { Lock } from "lucide-react";
import {
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  K,
  withAlpha,
} from "@/components/role-based-dashboard/kgs/shared/tokens";

type TabId = "workspace" | "kgs";

const SIGNAL_ROUTE: Record<string, V2View> = {
  "PR-01": "promiseHero",
  "PR-02": "promise",
  "RC-01": "recurringTheme",
  "IN-01": "install",
};

function heatColour(n: number, max: number): string {
  if (n <= 0) return K.surface;
  const t = Math.min(1, n / Math.max(max, 1));
  return withAlpha(K.orange, 0.12 + t * 0.55);
}

/**
 * Partner view — Concept (SPEC §8).
 * Only screen where a real competitor name may appear (subtitle).
 */
export function PartnerView() {
  const L = useLabel2();
  const { state, setView } = useDemo2();
  const isPartnerSm = state.role === "Partner service manager";
  const isPartnerMgr = state.role === "Partner manager";

  const [tab, setTab] = useState<TabId>(isPartnerSm ? "workspace" : "kgs");
  const [sharing, setSharing] = useState({ ...partner.workspace.sharing });
  const [draftReady, setDraftReady] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTab(isPartnerSm ? "workspace" : "kgs");
  }, [isPartnerSm]);

  const grid = partner.kgsView.themePartnerGrid;
  const maxHeat = Math.max(0, ...grid.values.flat());
  const cb = partner.consentBoundary;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "16px 24px 24px",
      }}
    >
      {/* Title + Concept pill */}
      <header style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              color: K.text,
              lineHeight: 1.2,
            }}
          >
            {L(partner.title)}
          </h1>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: K.radius.pill,
              background: withAlpha(K.violet400, 0.15),
              color: K.violet300,
              border: `1px solid ${withAlpha(K.violet400, 0.4)}`,
            }}
          >
            {partner.conceptLabel}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            color: K.textSec,
            lineHeight: 1.45,
            maxWidth: 720,
          }}
        >
          {partner.subtitle}
        </p>
      </header>

      {/* Consent boundary */}
      <section
        aria-label="Consent boundary"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: 12,
          alignItems: "stretch",
          background: K.elevated,
          border: `1px solid ${K.borderLight}`,
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div
          style={{
            background: K.surface,
            border: `1px solid ${K.borderLight}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: K.textMut,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Partner keeps
          </div>
          <div style={{ fontSize: 14, color: K.text, lineHeight: 1.5 }}>
            {cb.partnerKeeps.join(" · ")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
            fontSize: 12,
            fontWeight: 600,
            color: K.violet300,
            whiteSpace: "nowrap",
            padding: "0 4px",
            textAlign: "center",
          }}
        >
          <div aria-hidden>aggregates →</div>
          <div aria-hidden>← confirmed dates and fixes</div>
        </div>

        <div
          style={{
            background: K.surface,
            border: `1px solid ${K.borderLight}`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: K.textMut,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            KGS sees
          </div>
          <div style={{ fontSize: 14, color: K.text, lineHeight: 1.5 }}>
            {cb.crossesToKgs.join(" · ")}
          </div>
        </div>
      </section>

      {/* Tabs */}
      {!isPartnerSm ? (
        <div
          role="tablist"
          aria-label="Partner view tabs"
          style={{
            display: "inline-flex",
            gap: 4,
            padding: 4,
            background: K.surface,
            border: `1px solid ${K.borderLight}`,
            borderRadius: 10,
            alignSelf: "flex-start",
          }}
        >
          {(
            [
              { id: "workspace" as const, label: "Partner workspace" },
              { id: "kgs" as const, label: "What KGS sees" },
            ] as const
          ).map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                className="kgs2-focus"
                onClick={() => setTab(t.id)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: on ? K.brandTint : "transparent",
                  color: on ? K.violet300 : K.textSec,
                  fontSize: 13,
                  fontWeight: on ? 700 : 500,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: K.violet300,
            letterSpacing: "0.04em",
          }}
        >
          Partner workspace
        </div>
      )}

      {tab === "workspace" || isPartnerSm ? (
        <WorkspaceTab
          L={L}
          sharing={sharing}
          setSharing={setSharing}
          onOpenSignal={(id) => {
            const route = SIGNAL_ROUTE[id];
            if (route) setView(route);
          }}
        />
      ) : (
        <KgsSeesTab
          L={L}
          maxHeat={maxHeat}
          draftReady={draftReady}
          canMarkReady={isPartnerMgr}
          onMarkReady={(key) =>
            setDraftReady((prev) => ({ ...prev, [key]: true }))
          }
        />
      )}

      <footer
        style={{
          marginTop: 4,
          padding: "12px 14px",
          borderRadius: 10,
          border: `1px dashed ${withAlpha(K.violet400, 0.4)}`,
          background: withAlpha(K.violet400, 0.06),
          fontSize: 12,
          color: K.textMut,
          lineHeight: 1.5,
        }}
      >
        {partner.conceptFooter}
      </footer>
    </div>
  );
}

function WorkspaceTab({
  L,
  sharing,
  setSharing,
  onOpenSignal,
}: {
  L: (s: string) => string;
  sharing: typeof partner.workspace.sharing;
  setSharing: Dispatch<SetStateAction<typeof partner.workspace.sharing>>;
  onOpenSignal: (id: string) => void;
}) {
  const ws = partner.workspace;
  const mv = ws.managerView;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: K.text }}>
          {ws.header}
        </h2>
        <div
          style={{
            fontSize: 12,
            color: K.textMut,
            padding: "8px 14px",
            borderRadius: 10,
            border: `1px dashed ${K.borderLight}`,
            background: K.surface,
            minWidth: 180,
            textAlign: "center",
          }}
        >
          {ws.cobrandPlaceholder}
          <div style={{ fontSize: 11, marginTop: 4 }}>
            {L(ws.partnerLabel)} · no real logos
          </div>
        </div>
      </div>

      {/* Today's queue L1 */}
      <Card title="Today's queue" sub="L1 · customer contacts by priority">
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {ws.queue.map((item) => (
            <li key={item.title}>
              <button
                type="button"
                className="kgs2-focus"
                onClick={() =>
                  item.linkedSignal && onOpenSignal(item.linkedSignal)
                }
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: `1px solid ${K.borderLight}`,
                  background: K.surface,
                  color: K.text,
                  fontFamily: "inherit",
                  cursor: item.linkedSignal ? "pointer" : "default",
                }}
              >
                <span
                  style={{
                    fontFamily: K.mono,
                    fontWeight: 800,
                    fontSize: 12,
                    color: K.orange,
                    minWidth: 28,
                  }}
                >
                  P{item.priority}
                </span>
                <span style={{ flex: 1, fontSize: 14, lineHeight: 1.4 }}>
                  {item.title}
                </span>
                {item.linkedSignal ? (
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: K.mono,
                      color: K.violet300,
                    }}
                  >
                    {item.linkedSignal} →
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Manager view L2 */}
      <Card title="Manager view" sub="L2 · this week">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {[
            { label: "Themes this week", value: String(mv.themesThisWeek) },
            { label: "Reply time", value: mv.replyTimeVsTarget },
            { label: "Repeat contacts", value: String(mv.repeatContacts) },
            {
              label: "Waiting on KGS",
              value: String(mv.waitingOnKgs),
            },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                background: K.surface,
                borderRadius: 10,
                padding: "10px 12px",
                border: `1px solid ${K.borderLight}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: K.textMut,
                  marginBottom: 4,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: K.text,
                  fontFamily: K.mono,
                }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Waiting on KGS */}
      <Card
        title="Waiting on KGS"
        sub="Promised vs current date · open returns · open questions"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ws.waitingOnKgs.map((row) => (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 12,
                padding: "10px 12px",
                background: K.surface,
                borderRadius: 10,
                border: `1px solid ${K.borderLight}`,
                fontSize: 13,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: K.text }}>
                  {row.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: K.textMut,
                    marginTop: 2,
                    textTransform: "capitalize",
                  }}
                >
                  {row.type}
                </div>
              </div>
              <div
                style={{
                  fontFamily: K.mono,
                  color: K.body,
                  textAlign: "right",
                  fontSize: 12,
                }}
              >
                {"promised" in row && row.promised ? (
                  <>
                    promised {row.promised}
                    <br />
                    <span style={{ color: K.orange }}>
                      current {row.current}
                    </span>
                  </>
                ) : (
                  <span>{"status" in row ? row.status : ""}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sharing settings */}
      <Card title="Sharing settings" sub="What this partner shares with KGS">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(
            [
              {
                key: "themes" as const,
                label: "Product and install themes",
                locked: false,
              },
              {
                key: "promise" as const,
                label: "Promise performance",
                locked: false,
              },
              {
                key: "commissioning" as const,
                label: "Commissioning experience",
                locked: false,
              },
              {
                key: "identities" as const,
                label: "Customer identities",
                locked: true,
              },
              { key: "pricing" as const, label: "Pricing", locked: true },
            ] as const
          ).map((row) => {
            const on = sharing[row.key];
            return (
              <div
                key={row.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 12px",
                  background: K.surface,
                  borderRadius: 10,
                  border: `1px solid ${K.borderLight}`,
                  opacity: row.locked ? 0.85 : 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    color: K.text,
                  }}
                >
                  {row.locked ? (
                    <Lock size={14} color={K.textMut} aria-hidden />
                  ) : null}
                  {row.label}
                </div>
                <button
                  type="button"
                  className="kgs2-focus"
                  aria-pressed={on}
                  aria-disabled={row.locked}
                  disabled={row.locked}
                  title={
                    row.locked
                      ? "Locked off — never shared"
                      : on
                        ? "On — click to turn off"
                        : "Off — click to turn on"
                  }
                  onClick={() => {
                    if (row.locked) return;
                    setSharing((s) => ({ ...s, [row.key]: !s[row.key] }));
                  }}
                  style={{
                    minWidth: 52,
                    padding: "4px 10px",
                    borderRadius: K.radius.pill,
                    border: `1px solid ${
                      on ? withAlpha(K.green, 0.45) : K.borderLight
                    }`,
                    background: on ? withAlpha(K.green, 0.15) : "transparent",
                    color: on ? K.green : K.textMut,
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: row.locked ? "not-allowed" : "pointer",
                  }}
                >
                  {on ? "On" : "Off"}
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function KgsSeesTab({
  L,
  maxHeat,
  draftReady,
  canMarkReady,
  onMarkReady,
}: {
  L: (s: string) => string;
  maxHeat: number;
  draftReady: Record<string, boolean>;
  canMarkReady: boolean;
  onMarkReady: (key: string) => void;
}) {
  const kv = partner.kgsView;
  const grid = kv.themePartnerGrid;
  const pc = kv.partnersConnected;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          fontSize: 12,
          fontWeight: 700,
          padding: "6px 12px",
          borderRadius: K.radius.pill,
          background: withAlpha(K.amber, 0.12),
          color: K.amber,
          border: `1px solid ${withAlpha(K.amber, 0.35)}`,
          fontFamily: K.mono,
        }}
      >
        {pc.connected} of {pc.of} partners connected
      </div>

      {/* Heat grid */}
      <Card
        title="Themes × partners"
        sub="Aggregated counts only · no customer names"
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
            }}
          >
            <thead>
              <tr>
                <th style={th}>Theme</th>
                {grid.partners.map((p) => (
                  <th key={p} style={{ ...th, textAlign: "center" }}>
                    {L(`{{partner:${p}}}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.themes.map((theme, ri) => (
                <tr key={theme}>
                  <td style={td}>{theme}</td>
                  {grid.values[ri].map((n, ci) => (
                    <td
                      key={`${theme}-${grid.partners[ci]}`}
                      style={{
                        ...td,
                        textAlign: "center",
                        fontFamily: K.mono,
                        fontWeight: n > 0 ? 700 : 400,
                        background: heatColour(n, maxHeat),
                        color: n > 0 ? K.text : K.textMut,
                      }}
                    >
                      {n}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Promise by partner */}
      <Card
        title="Promise performance by partner"
        sub="Partner complaints joined to KGS order dates"
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                {["Partner", "Kept vs original", "Complaints (4 wks)"].map(
                  (h) => (
                    <th key={h} style={th}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {kv.promiseByPartner.map((row) => (
                <tr key={row.partner}>
                  <td style={td}>{L(row.partner)}</td>
                  <td
                    style={{
                      ...td,
                      fontFamily: K.mono,
                      color: row.keptPct < 80 ? K.orange : K.text,
                      fontWeight: row.keptPct < 80 ? 700 : 500,
                    }}
                  >
                    {row.keptPct}%
                  </td>
                  <td style={{ ...td, fontFamily: K.mono }}>
                    {row.complaints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Commissioning */}
      <Card
        title="Commissioning experience from partners"
        sub={kv.commissioningFromPartners.note}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            fontSize: 14,
            color: K.text,
          }}
        >
          <span>
            Friction mentions{" "}
            <strong style={{ fontFamily: K.mono }}>
              {kv.commissioningFromPartners.frictionMentions}
            </strong>
          </span>
          <span style={{ color: K.textMut }}>·</span>
          <span>
            Praise mentions{" "}
            <strong style={{ fontFamily: K.mono }}>
              {kv.commissioningFromPartners.praiseMentions}
            </strong>
          </span>
        </div>
      </Card>

      {/* Health cards */}
      <Card
        title="Partner health"
        sub="Friction trend · reply time · open items"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {kv.healthCards.map((card) => {
            const key = card.partner;
            const ready = draftReady[key];
            return (
              <div
                key={key}
                style={{
                  background: K.surface,
                  border: `1px solid ${K.borderLight}`,
                  borderRadius: 12,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {L(card.partner)}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: K.body,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <span>
                    Friction trend:{" "}
                    <span
                      style={{
                        color:
                          card.frictionTrend === "up"
                            ? K.orange
                            : card.frictionTrend === "down"
                              ? K.green
                              : K.textMut,
                        fontWeight: 600,
                      }}
                    >
                      {card.frictionTrend}
                    </span>
                  </span>
                  <span>Reply time: {card.replyTime}</span>
                  <span style={{ fontFamily: K.mono }}>
                    Open items: {card.openItems}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <button
                    type="button"
                    className="kgs2-focus"
                    disabled={!canMarkReady || ready}
                    title={
                      ready
                        ? "Ready to send — Partner manager sends outside this demo"
                        : canMarkReady
                          ? "Mark draft ready to send (nothing is sent)"
                          : "Only Partner manager can mark ready to send"
                    }
                    onClick={() => {
                      if (!canMarkReady || ready) return;
                      onMarkReady(key);
                    }}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: `1px solid ${
                        ready
                          ? withAlpha(K.green, 0.45)
                          : canMarkReady
                            ? withAlpha(K.violet400, 0.45)
                            : K.borderLight
                      }`,
                      background: ready
                        ? withAlpha(K.green, 0.12)
                        : canMarkReady
                          ? K.brandTint
                          : "transparent",
                      color: ready
                        ? K.green
                        : canMarkReady
                          ? K.violet300
                          : K.textMut,
                      cursor:
                        !canMarkReady || ready ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      opacity: !canMarkReady && !ready ? 0.7 : 1,
                    }}
                  >
                    {ready ? "Ready to send — Not sent" : card.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Card({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        background: K.elevated,
        border: `1px solid ${K.borderLight}`,
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <header>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 800,
            color: K.text,
          }}
        >
          {title}
        </h3>
        {sub ? (
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: K.textMut,
            }}
          >
            {sub}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

const th: CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  color: K.textMut,
  fontWeight: 600,
  borderBottom: `1px solid ${K.borderLight}`,
  whiteSpace: "nowrap",
};

const td: CSSProperties = {
  padding: "8px 10px",
  borderBottom: `1px solid ${K.borderLight}`,
  color: K.body,
};
