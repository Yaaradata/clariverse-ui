"use client";

import { useLabel } from "../shell/DemoProvider";

type RoutedOwnerProps = {
  owner: string;
  cc?: string;
  reason?: string;
};

export function RoutedOwner({ owner, cc, reason }: RoutedOwnerProps) {
  const L = useLabel();

  const initials = owner
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#2b2646",
          color: "#a78bfa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 14, color: "#ffffff", lineHeight: 1.4 }}>
          Routed to <strong>{L(owner)}</strong> (owner)
          {cc ? (
            <>
              {" · cc "}
              {L(cc)}
            </>
          ) : null}
        </div>
        {reason ? (
          <div style={{ fontSize: 12, color: "#a3a3a3", marginTop: 2, lineHeight: 1.4 }}>
            {L(reason)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
