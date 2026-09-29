"use client";

import { Info, X } from "lucide-react";
import { useState } from "react";
import { useLabel } from "../shell/DemoProvider";

type WhatsCountedPopoverProps = {
  counted: Array<{ signalId: string; text: string }>;
  notCounted: string;
  countedFooter: string;
};

export function WhatsCountedPopover({
  counted,
  notCounted,
  countedFooter,
}: WhatsCountedPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const L = useLabel();

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "#a3a3a3",
          display: "flex",
          alignItems: "center",
        }}
        title="What's counted"
      >
        <Info size={14} />
      </button>

      {isOpen ? (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 150,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              right: 0,
              marginBottom: 8,
              background: "#0d0d0d",
              border: "1px solid #1f1f1f",
              borderRadius: 12,
              padding: "16px 18px",
              minWidth: 360,
              maxWidth: 480,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              zIndex: 151,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>
                What's counted
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "#939394",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              {counted.map((item, idx) => (
                <div key={idx} style={{ fontSize: 13, color: "#d4d4d8", lineHeight: 1.5 }}>
                  {L(item.text)}
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#a3a3a3",
                lineHeight: 1.5,
                marginBottom: 12,
                paddingTop: 12,
                borderTop: "1px solid #1f1f1f",
              }}
            >
              {L(notCounted)}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#737373",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              {L(countedFooter)}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
