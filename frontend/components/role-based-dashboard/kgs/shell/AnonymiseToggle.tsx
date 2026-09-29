"use client";

import { useDemo } from "./DemoProvider";

export function AnonymiseToggle() {
  const { state, toggleAnonymise } = useDemo();

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 13, color: "#d4d4d8" }}>Anonymise names</span>
      <button
        type="button"
        role="switch"
        aria-checked={state.anonymise}
        onClick={toggleAnonymise}
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
  );
}
