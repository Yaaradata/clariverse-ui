"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";

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
export function KgsCommercialFireDashboard({ onExit }: KgsCommercialFireDashboardProps) {
  const [view, setView] = useState<ViewId>("overview");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#010101",
        color: "#e8e9e9",
        padding: "40px 48px",
        fontFamily: "inherit",
      }}
    >
      {/* Temporary placeholder - Step 2 complete */}
      <button
        type="button"
        onClick={onExit}
        style={{
          background: "transparent",
          border: "1px solid #2a2a2a",
          color: "#a1a1aa",
          borderRadius: 8,
          padding: "8px 14px",
          cursor: onExit ? "pointer" : "default",
          marginBottom: 24,
        }}
      >
        <ArrowLeft style={{ width: 16, height: 16, display: "inline", marginRight: 8 }} />
        Back to Role Picker
      </button>

      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
        Global Commercial Fire — Signals this week
      </h1>
      
      <p style={{ fontSize: 18, color: "#a1a1aa", marginBottom: 32 }}>
        President · LiSN × KGS Global Commercial Fire Demo
      </p>

      <div style={{
        background: "#fef3c7",
        border: "2px dashed #d97706",
        borderRadius: 8,
        padding: 24,
        marginBottom: 32,
      }}>
        <p style={{ color: "#78350f", fontWeight: 600, marginBottom: 8 }}>
          ⚠️ SYNTHETIC SCENARIO — illustrative data, not KGS data
        </p>
        <p style={{ color: "#78350f", fontSize: 14 }}>
          KGS dashboard foundation ready. Current view: {view}
        </p>
      </div>

      <div style={{
        background: "#151515",
        border: "1px solid #2a2a2a",
        borderRadius: 12,
        padding: 24,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          Step 2 Complete ✓
        </h2>
        <ul style={{ listStyle: "disc", paddingLeft: 24, color: "#a1a1aa", lineHeight: 1.8 }}>
          <li>✓ Mock data copied to lib/role-based-dashboard/kgs/</li>
          <li>✓ @kgs/* path alias added to tsconfig.json</li>
          <li>✓ KIDDE_GLOBAL_PRESIDENT_ROLE_ID exported from kiddeGlobalIndustry.ts</li>
          <li>✓ President role added to registry.tsx</li>
          <li>✓ KgsCommercialFireDashboard entry component created</li>
          <li>✓ RoleDashboardView routing updated</li>
        </ul>
        
        <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 12 }}>
          Next Steps (Steps 3-8):
        </h3>
        <ul style={{ listStyle: "disc", paddingLeft: 24, color: "#a1a1aa", lineHeight: 1.8 }}>
          <li>Step 3: Fork components from bank demo</li>
          <li>Step 4: Build shell (rail, header, context bar, badge, footer)</li>
          <li>Step 5: Build signal primitives</li>
          <li>Steps 6-8: Build exec overview A/B/C</li>
        </ul>

        <div style={{
          marginTop: 24,
          padding: 16,
          background: "#0a0a0a",
          borderRadius: 8,
          border: "1px solid #2a2a2a",
        }}>
          <p style={{ fontSize: 14, color: "#71717a", marginBottom: 8 }}>
            <strong>View State Demo:</strong>
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["overview", "installedBase", "hero", "channel", "separation"] as ViewId[]).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                style={{
                  background: view === v ? "#5332ff" : "#18181b",
                  color: view === v ? "#fff" : "#a1a1aa",
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
  );
}
