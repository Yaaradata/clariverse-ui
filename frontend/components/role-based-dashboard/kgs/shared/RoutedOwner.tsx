"use client";

import { roleLabel } from "@kgs/lib/label";
import type { Role } from "@kgs/types";
import { useDemo } from "../shell/DemoProvider";
import { K, withAlpha } from "./tokens";

/** RoutedOwner (03 §6.5): roles only, never names; initials tile from the role words. */
export function RoutedOwner({ role, cc }: { role: Role; cc?: Role[] }) {
  const { state } = useDemo();
  const text = roleLabel(role, state.anonymise);
  const initials = text
    .split(/[\s/&]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        aria-hidden
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          display: "grid",
          placeItems: "center",
          fontSize: 11,
          fontWeight: 800,
          color: K.violet300,
          background: withAlpha(K.brand, 0.22),
          border: `1px solid ${withAlpha(K.violet400, 0.4)}`,
        }}
      >
        {initials}
      </span>
      <span style={{ fontSize: 13, color: K.textSec }}>
        {text}
        {cc?.length ? (
          <span style={{ color: K.textMut }}>
            {" · cc "}
            {cc.map((r) => roleLabel(r, state.anonymise)).join(", ")}
          </span>
        ) : null}
      </span>
    </span>
  );
}
