"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

export function FloatingAIButton() {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 100 }}>
      <button
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        title="Ask LiSN (P2 — canned answers)"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #5332ff 0%, #7c3aed 100%)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(83, 50, 255, 0.3)",
        }}
      >
        <Sparkles size={24} color="#ffffff" />
      </button>

      {showPopover ? (
        <div
          style={{
            position: "absolute",
            bottom: 70,
            right: 0,
            width: 280,
            background: "#0d0d0d",
            border: "1px solid #1f1f1f",
            borderRadius: 12,
            padding: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff", marginBottom: 8 }}>
            Ask LiSN
          </div>
          <div style={{ fontSize: 13, color: "#939394" }}>
            Canned questions in this demo (P2)
          </div>
        </div>
      ) : null}
    </div>
  );
}
