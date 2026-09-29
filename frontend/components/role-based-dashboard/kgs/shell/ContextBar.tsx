"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { AnonymiseToggle } from "./AnonymiseToggle";
import { SyntheticBadge } from "./SyntheticBadge";
import { Watermark } from "./Watermark";
import { useDemo, useLabel } from "./DemoProvider";
import { meta } from "@kgs/lib/data";

export function ContextBar() {
  const { state } = useDemo();
  const L = useLabel();
  const [showBrandMenu, setShowBrandMenu] = useState(false);
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: 56,
          background: "#0d0d0d",
          borderBottom: "1px solid #1f1f1f",
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "0 24px",
          zIndex: 55,
        }}
      >
        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
          {/* Brand filter */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowBrandMenu(!showBrandMenu)}
              style={{
                background: "transparent",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                padding: "6px 12px",
                color: "#d4d4d8",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Brand: {L(meta.filters.brand[0])}
              <ChevronDown size={14} />
            </button>
            {showBrandMenu ? (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 4,
                  background: "#0d0d0d",
                  border: "1px solid #1f1f1f",
                  borderRadius: 8,
                  padding: "8px 0",
                  minWidth: 180,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  zIndex: 100,
                }}
              >
                <div style={{ padding: "6px 12px", fontSize: 13, color: "#939394" }}>
                  (P0: filters do nothing)
                </div>
              </div>
            ) : null}
          </div>

          {/* Region filter */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowRegionMenu(!showRegionMenu)}
              style={{
                background: "transparent",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                padding: "6px 12px",
                color: "#d4d4d8",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Region: {L(meta.filters.region[0])}
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Period filter */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowPeriodMenu(!showPeriodMenu)}
              style={{
                background: "transparent",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                padding: "6px 12px",
                color: "#d4d4d8",
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {L(meta.filters.period.value)}
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Data timestamp */}
          <div style={{ fontSize: 13, color: "#a3a3a3" }}>
            {L(meta.dataAsOf.label)}
          </div>
        </div>

        {/* Right side: Anonymise toggle + Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <AnonymiseToggle />
          {state.anonymise ? (
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #3f3f46",
                color: "#a3a3a3",
                letterSpacing: "0.05em",
              }}
            >
              ANONYMISED
            </div>
          ) : null}
          <SyntheticBadge tooltip={meta.badgeTooltip} />
        </div>
      </div>

      {/* Watermark when anonymised */}
      {state.anonymise ? <Watermark text={L(meta.demo.watermark)} /> : null}
    </>
  );
}
