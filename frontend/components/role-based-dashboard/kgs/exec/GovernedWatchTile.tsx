"use client";

import { Lock, X } from "lucide-react";
import { useState } from "react";
import { SeverityChip } from "../shared/SeverityChip";
import { useLabel } from "../shell/DemoProvider";

type WatchItem = {
  id: string;
  severity: "S1";
  domain: "Safety" | "Cyber";
  status: string;
  routed: string;
  timestamp: string;
  secondLine: string;
  confidence: string;
  clockRing?: {
    elapsedLabel: string;
    caption: string;
  };
};

type GovernedWatchTileProps = {
  headline: string;
  pnl: string;
  items: WatchItem[];
  footer: string;
  modal: {
    title: string;
    body: string;
    buttonLabel: string;
  };
};

export function GovernedWatchTile({ headline, pnl, items, footer, modal }: GovernedWatchTileProps) {
  const [showModal, setShowModal] = useState(false);
  const L = useLabel();

  return (
    <>
      <div
        id="governed-watch"
        style={{
          scrollMarginTop: 80,
          gridColumn: "span 7",
          background: "#0d0d0d",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* Striped Header */}
        <div
          style={{
            height: 32,
            background: "repeating-linear-gradient(45deg, #1a0f0f 0 6px, #140c0c 6px 12px)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 10,
          }}
        >
          <Lock size={14} color="#ef4444" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ef4444",
            }}
          >
            RESTRICTED
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#f87171" }}>
            Governed safety & cyber watch
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "20px 18px",
            cursor: "pointer",
          }}
          onClick={() => setShowModal(true)}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>
            {L(headline)}
          </div>
          <div style={{ fontSize: 14, color: "#a3a3a3", marginBottom: 20 }}>
            P&L: {L(pnl)}
          </div>

          {/* Watch Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  borderLeft: "3px solid #ef4444",
                  paddingLeft: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "var(--mono, monospace)",
                      color: "#ffffff",
                    }}
                  >
                    {item.id}
                  </span>
                  <SeverityChip cls="S1" compact />
                  <span style={{ fontSize: 13, color: "#a3a3a3" }}>· {item.domain}</span>
                </div>

                <div style={{ fontSize: 13, color: "#e8e9e9", lineHeight: 1.5 }}>
                  {L(item.status)}
                </div>

                <div style={{ fontSize: 13, color: "#a3a3a3" }}>
                  {L(item.routed)} · {L(item.timestamp)}
                </div>

                <div style={{ fontSize: 13, color: "#737373", fontStyle: "italic" }}>
                  {L(item.secondLine)}
                </div>

                {/* Redaction bars for content */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                  <div style={{ height: 12, background: "#2a2a2a", borderRadius: 4, width: "90%" }} />
                  <div style={{ height: 12, background: "#2a2a2a", borderRadius: 4, width: "75%" }} />
                  <div style={{ height: 12, background: "#2a2a2a", borderRadius: 4, width: "60%" }} />
                </div>

                {item.clockRing ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#2a2a2a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "var(--mono, monospace)",
                        color: "#d4d4d8",
                      }}
                    >
                      {item.clockRing.elapsedLabel}
                    </div>
                    <div style={{ fontSize: 12, color: "#737373", flex: 1 }}>
                      {L(item.clockRing.caption)}
                    </div>
                  </div>
                ) : null}

                <div style={{ fontSize: 12, color: "#a3a3a3" }}>
                  {L(item.confidence)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 13, color: "#d4d4d8", fontWeight: 700 }}>
            {L(footer)}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal ? (
        <>
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 300,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 560,
              background: "#0d0d0d",
              border: "1px solid #1f1f1f",
              borderRadius: 16,
              zIndex: 301,
            }}
          >
            <div style={{ padding: "24px 26px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#ffffff" }}>
                  {L(modal.title)}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "#939394",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ fontSize: 14, color: "#d4d4d8", lineHeight: 1.6, marginBottom: 24 }}>
                {L(modal.body)}
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  width: "100%",
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                  padding: "10px 16px",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {L(modal.buttonLabel)}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
