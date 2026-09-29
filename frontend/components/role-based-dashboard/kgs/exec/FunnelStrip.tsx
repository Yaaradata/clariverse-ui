"use client";

import { Info } from "lucide-react";
import { useState } from "react";

type FunnelStripProps = {
  interactions: number;
  weekApprox: string;
  candidateClusters: number;
  suppressed: number;
  aboveThreshold: number;
  governed: number;
  suppressedReasons: Array<{ label: string; count: number }>;
  suppressedFooter: string;
  onScrollToMonitor: () => void;
  onScrollToGoverned: () => void;
};

export function FunnelStrip({
  interactions,
  weekApprox,
  candidateClusters,
  suppressed,
  aboveThreshold,
  governed,
  suppressedReasons,
  suppressedFooter,
  onScrollToMonitor,
  onScrollToGoverned,
}: FunnelStripProps) {
  const [showSuppressed, setShowSuppressed] = useState(false);

  return (
    <div
      style={{
        fontSize: 13,
        color: "#a3a3a3",
        lineHeight: 1.6,
        marginBottom: 24,
        position: "relative",
      }}
    >
      <span style={{ fontFamily: "var(--mono, monospace)", fontWeight: 600 }}>
        {interactions.toLocaleString("en-GB")}
      </span>{" "}
      interactions read (26 weeks; {weekApprox} this week) ·{" "}
      <span style={{ fontFamily: "var(--mono, monospace)", fontWeight: 600 }}>
        {candidateClusters.toLocaleString("en-GB")}
      </span>{" "}
      candidate clusters ·{" "}
      <span style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setShowSuppressed(!showSuppressed)}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            color: "#a3a3a3",
            cursor: "pointer",
            fontFamily: "var(--mono, monospace)",
            fontWeight: 600,
            textDecoration: "underline",
            textDecorationStyle: "dotted",
          }}
        >
          {suppressed}
        </button>{" "}
        suppressed{" "}
        <Info
          size={14}
          style={{ verticalAlign: "middle", marginLeft: 2, cursor: "pointer" }}
          onClick={() => setShowSuppressed(!showSuppressed)}
        />
        {showSuppressed ? (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              marginTop: 8,
              background: "#0d0d0d",
              border: "1px solid #1f1f1f",
              borderRadius: 12,
              padding: "16px 18px",
              minWidth: 320,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              zIndex: 100,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 12,
              }}
            >
              Suppressed this window — not signals
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {suppressedReasons.map((reason, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "#d4d4d8",
                  }}
                >
                  <span>{reason.label}</span>
                  <span
                    style={{
                      fontFamily: "var(--mono, monospace)",
                      fontWeight: 600,
                      color: "#a3a3a3",
                    }}
                  >
                    {reason.count}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid #1f1f1f",
                fontSize: 12,
                color: "#737373",
                fontStyle: "italic",
              }}
            >
              {suppressedFooter}
            </div>
          </div>
        ) : null}
      </span>{" "}
      ·{" "}
      <button
        type="button"
        onClick={onScrollToMonitor}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          color: "#a78bfa",
          cursor: "pointer",
          fontFamily: "var(--mono, monospace)",
          fontWeight: 600,
          textDecoration: "underline",
        }}
      >
        {aboveThreshold}
      </button>{" "}
      signals above threshold ·{" "}
      <button
        type="button"
        onClick={onScrollToGoverned}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          color: "#a78bfa",
          cursor: "pointer",
          fontFamily: "var(--mono, monospace)",
          fontWeight: 600,
          textDecoration: "underline",
        }}
      >
        {governed}
      </button>{" "}
      governed watch items
    </div>
  );
}
