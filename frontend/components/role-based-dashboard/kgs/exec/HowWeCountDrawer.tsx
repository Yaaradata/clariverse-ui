"use client";

import { X } from "lucide-react";
import { SyntheticBadge } from "../shell/SyntheticBadge";
import { useLabel } from "../shell/DemoProvider";
import { valueRegister, unitCosts, valueStatements, neverOnScreen } from "@kgs/lib/values";

type HowWeCountDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function HowWeCountDrawer({ isOpen, onClose }: HowWeCountDrawerProps) {
  const L = useLabel();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 200,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: 520,
          background: "#0d0d0d",
          borderLeft: "1px solid #1f1f1f",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.24s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: 64,
            borderBottom: "1px solid #1f1f1f",
            background: "#0d0d0d",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#ffffff" }}>
              How we count
            </h2>
            <SyntheticBadge small />
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              padding: 8,
              cursor: "pointer",
              color: "#939394",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* Value Statements */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginBottom: 16 }}>
              Value Statements
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {valueStatements.map((statement, idx) => (
                <div key={idx} style={{ fontSize: 14, color: "#d4d4d8", lineHeight: 1.6 }}>
                  {L(statement)}
                </div>
              ))}
            </div>
          </div>

          {/* Unit Costs */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginBottom: 16 }}>
              Unit Cost Assumptions
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  fontSize: 14,
                  color: "#d4d4d8",
                  lineHeight: 1.6,
                  fontFamily: "var(--mono, monospace)",
                }}
              >
                Tier-1 contact ${unitCosts.tier1ContactUsd[0]}–${unitCosts.tier1ContactUsd[1]}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#d4d4d8",
                  lineHeight: 1.6,
                  fontFamily: "var(--mono, monospace)",
                }}
              >
                Fully loaded field cost per excess fault contact ${unitCosts.excessFaultContactUsd} (
                {unitCosts.breakdown.map((item, idx) => (
                  <span key={idx}>
                    {item.label} ${item.usd}
                    {idx < unitCosts.breakdown.length - 1 ? " · " : ""}
                  </span>
                ))}
                )
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#d4d4d8",
                  lineHeight: 1.6,
                  fontFamily: "var(--mono, monospace)",
                }}
              >
                Detector field replacement ${unitCosts.detectorReplacementUsd} per unit
              </div>
            </div>
          </div>

          {/* Value Register */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#ffffff", marginBottom: 16 }}>
              Value Register
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {valueRegister.map((value) => (
                <div
                  key={value.id}
                  style={{
                    background: "#151515",
                    border: "1px solid #1f1f1f",
                    borderRadius: 8,
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#737373",
                        fontFamily: "var(--mono, monospace)",
                      }}
                    >
                      {value.id}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
                      {L(value.figure)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#a3a3a3", lineHeight: 1.5 }}>
                    {L(value.method)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              fontSize: 13,
              color: "#737373",
              fontStyle: "italic",
              lineHeight: 1.6,
              padding: "16px",
              background: "#151515",
              borderRadius: 8,
              border: "1px solid #1f1f1f",
            }}
          >
            {L(neverOnScreen)}
          </div>
        </div>

        {/* Sticky Footer */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            borderTop: "1px solid #1f1f1f",
            background: "#0d0d0d",
            padding: "16px 24px",
            fontSize: 13,
            color: "#737373",
            textAlign: "center",
          }}
        >
          Every claim links to the interactions behind it. No customer-facing action taken. Synthetic scenario — not KGS data.
        </div>
      </div>
    </>
  );
}
