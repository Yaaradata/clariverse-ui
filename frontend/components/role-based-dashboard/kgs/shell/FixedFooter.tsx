"use client";

import { useLabel } from "./DemoProvider";

export function FixedFooter() {
  const L = useLabel();
  
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 24,
        background: "#0d0d0d",
        borderTop: "1px solid #1f1f1f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: "#a3a3a3",
        zIndex: 50,
      }}
    >
      {L("Synthetic scenario for illustration; no inference about any KGS product. LiSN aids resolution; every action is human-approved.")}
    </div>
  );
}
