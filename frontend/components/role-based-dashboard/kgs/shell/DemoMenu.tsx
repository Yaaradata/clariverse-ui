"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDemo, useLabel } from "./DemoProvider";
import { meta } from "@kgs/lib/data";
import { showToast } from "./Toast";

type DemoMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DemoMenu({ isOpen, onClose }: DemoMenuProps) {
  const { state, setAnonymise, reset } = useDemo();
  const router = useRouter();
  const L = useLabel();

  if (!isOpen) return null;

  const handleReset = () => {
    reset();
    onClose();
    router.push("/");
    showToast({
      title: L(meta.demo.resetToast),
      body: "",
    });
  };

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

      {/* Menu popover */}
      <div
        style={{
          position: "fixed",
          bottom: 80,
          left: 80,
          width: 280,
          background: "#0d0d0d",
          border: "1px solid #1f1f1f",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          zIndex: 201,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 18px",
            borderBottom: "1px solid #1f1f1f",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: "#ffffff" }}>
            Demo Controls
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              padding: 4,
              cursor: "pointer",
              color: "#939394",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 18px" }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              width: "100%",
              background: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            Reset demo
          </button>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <span style={{ fontSize: 14, color: "#d4d4d8" }}>
              Anonymise names
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={state.anonymise}
              onClick={() => setAnonymise(!state.anonymise)}
              style={{
                width: 36,
                height: 20,
                borderRadius: 999,
                background: state.anonymise ? "#5332ff" : "#3f3f46",
                border: "none",
                padding: 2,
                cursor: "pointer",
                transition: "background 0.15s",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#ffffff",
                  transition: "transform 0.15s",
                  transform: state.anonymise ? "translateX(16px)" : "translateX(0)",
                }}
              />
            </button>
          </label>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 18px",
            borderTop: "1px solid #1f1f1f",
            fontSize: 12,
            color: "#737373",
            fontStyle: "italic",
          }}
        >
          Demo controls — not part of the product.
        </div>
      </div>
    </>
  );
}
