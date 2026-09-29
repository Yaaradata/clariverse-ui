"use client";

import { useState, useEffect } from "react";
import { DemoProvider } from "./shell/DemoProvider";
import { LeftRail } from "./shell/LeftRail";
import { ContextBar } from "./shell/ContextBar";
import { FixedFooter } from "./shell/FixedFooter";
import { DemoMenu } from "./shell/DemoMenu";
import { ToastContainer } from "./shell/Toast";
import { FloatingAIButton } from "./shell/FloatingAIButton";

export interface KgsCommercialFireDashboardProps {
  onExit?: () => void;
}

type ViewId = "overview" | "installedBase" | "hero" | "channel" | "separation";

/**
 * LiSN × KGS Global Commercial Fire demo dashboard
 * Entry component for President role
 *
 * Routes (in-component view state, not Next.js routes per adaptations):
 * - overview: /
 * - installedBase: /installed-base
 * - hero: /installed-base/signal/fw-4-1
 * - channel: /channel
 * - separation: /separation
 */
function KgsCommercialFireDashboardInner({ onExit }: KgsCommercialFireDashboardProps) {
  const [view, setView] = useState<ViewId>("overview");
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  // Handle print mode - force anonymise ON
  useEffect(() => {
    const beforePrint = () => {
      // Handled by DemoProvider
    };
    const afterPrint = () => {
      // Handled by DemoProvider
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#010101",
        color: "#e8e9e9",
        fontFamily: "var(--font, Outfit), system-ui, sans-serif",
      }}
    >
      <LeftRail onExit={onExit} onOpenDemoMenu={() => setDemoMenuOpen(true)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ContextBar />

        <main
          style={{
            flex: 1,
            padding: "24px 32px 64px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/* Step 4 Complete - Shell is ready */}
          <div style={{ maxWidth: 1440, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: "#ffffff" }}>
              Global Commercial Fire — Signals this week
            </h1>

            <p style={{ fontSize: 18, color: "#a3a3a3", marginBottom: 32 }}>
              President · LiSN × KGS Global Commercial Fire Demo
            </p>

            <div
              style={{
                background: "#fef3c7",
                border: "2px dashed #d97706",
                borderRadius: 8,
                padding: 24,
                marginBottom: 32,
              }}
            >
              <p style={{ color: "#78350f", fontWeight: 600, marginBottom: 8 }}>
                ⚠️ Shell components ready (Step 4 complete)
              </p>
              <p style={{ color: "#78350f", fontSize: 14 }}>
                Current view: {view}. Shell includes: LeftRail, ContextBar (sticky), FixedFooter, DemoMenu, Toast, Watermark (when anonymised), SyntheticBadge.
              </p>
            </div>

            <div
              style={{
                background: "#151515",
                border: "1px solid #2a2a2a",
                borderRadius: 12,
                padding: 24,
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#ffffff" }}>
                Step 4 Complete ✓
              </h2>
              <ul style={{ listStyle: "disc", paddingLeft: 24, color: "#a3a3a3", lineHeight: 1.8 }}>
                <li>✓ LeftRail with LiSN monogram</li>
                <li>✓ ContextBar (sticky) with filters, timestamp, anonymise toggle, badge</li>
                <li>✓ SyntheticBadge visible at all times</li>
                <li>✓ AnonymiseToggle + ANONYMISED chip</li>
                <li>✓ Watermark (shows when anonymised)</li>
                <li>✓ FixedFooter</li>
                <li>✓ DemoMenu with Reset + Anonymise mirror switch</li>
                <li>✓ Toast system</li>
                <li>✓ FloatingAIButton (P2)</li>
              </ul>

              <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 12, color: "#ffffff" }}>
                Next: Steps 5-8
              </h3>
              <ul style={{ listStyle: "disc", paddingLeft: 24, color: "#a3a3a3", lineHeight: 1.8 }}>
                <li>Step 5: Signal primitives (SeverityChip, DomainChip, ConfidenceMarker, etc.)</li>
                <li>Steps 6-8: Exec overview A/B/C (FunnelStrip, Brief, Pulse, QuestionCards, Monitor, Applied Value, Governed Watch)</li>
              </ul>

              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: "#0a0a0a",
                  borderRadius: 8,
                  border: "1px solid #2a2a2a",
                }}
              >
                <p style={{ fontSize: 14, color: "#71717a", marginBottom: 8 }}>
                  <strong>View State Demo:</strong>
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(["overview", "installedBase", "hero", "channel", "separation"] as ViewId[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setView(v)}
                      style={{
                        background: view === v ? "#5332ff" : "#18181b",
                        color: view === v ? "#fff" : "#a3a3a3",
                        border: "1px solid #3f3f46",
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        <FixedFooter />
      </div>

      <FloatingAIButton />
      <DemoMenu isOpen={demoMenuOpen} onClose={() => setDemoMenuOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export function KgsCommercialFireDashboard(props: KgsCommercialFireDashboardProps) {
  return (
    <DemoProvider>
      <KgsCommercialFireDashboardInner {...props} />
    </DemoProvider>
  );
}
