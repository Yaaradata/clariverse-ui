"use client";

export function EmptyScope() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        border: "2px dashed #2a2a2a",
        borderRadius: 12,
        fontSize: 14,
        color: "#a3a3a3",
        textAlign: "center",
      }}
    >
      No signal above threshold in this scope
    </div>
  );
}
