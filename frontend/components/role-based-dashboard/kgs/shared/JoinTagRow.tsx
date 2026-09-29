"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";
import { useLabel } from "../shell/DemoProvider";

type JoinTagRowProps = {
  tags: Array<{ key: string; value: string }>;
  max?: number;
};

export function JoinTagRow({ tags, max = 5 }: JoinTagRowProps) {
  const [expanded, setExpanded] = useState(false);
  const L = useLabel();

  const visibleTags = expanded ? tags : tags.slice(0, max);
  const remaining = tags.length - max;

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: "#a3a3a3",
        }}
      >
        <Link2 size={14} />
        JOINED ON
      </div>

      {visibleTags.map((tag, idx) => (
        <span
          key={idx}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 8,
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            height: 26,
            fontSize: 12,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#737373",
            }}
          >
            {tag.key}
          </span>
          <span style={{ fontWeight: 600, color: "#ffffff" }}>
            {L(tag.value)}
          </span>
        </span>
      ))}

      {!expanded && remaining > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          style={{
            padding: "4px 10px",
            borderRadius: 8,
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            color: "#a78bfa",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            height: 26,
          }}
        >
          +{remaining}
        </button>
      ) : null}
    </div>
  );
}
