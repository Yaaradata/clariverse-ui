"use client";

import React, { useMemo, useState } from "react";
import { DARK_STORES, type DarkStoreNode } from "../../lib/cxHeadRetailData";
import { cssVar, radius } from "../../theme/tokens";

const CITIES = ["Bengaluru", "Hyderabad", "Delhi NCR", "Mumbai"] as const;
type CityFilter = (typeof CITIES)[number];

function nodeColor(status: DarkStoreNode["status"]): string {
  if (status === "outbreak") return cssVar("severity-high");
  if (status === "flat") return cssVar("severity-med");
  return cssVar("positive");
}

export function OutbreakMap({
  onSelectStore,
  defaultCity = "Bengaluru",
}: {
  onSelectStore: (storeId: string) => void;
  defaultCity?: CityFilter;
}): React.ReactElement {
  const [city, setCity] = useState<CityFilter>(defaultCity);

  const nodes = useMemo(() => {
    const filtered = DARK_STORES.filter((d) => d.city === city);
    return [...filtered].sort((a, b) => b.peerMultiple - a.peerMultiple).slice(0, 6);
  }, [city]);

  return (
    <div
      style={{
        padding: 12,
        borderRadius: radius.md,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: cssVar("text-primary") }}>Dark-store map</div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value as CityFilter)}
          style={{
            fontSize: 11,
            padding: "4px 8px",
            borderRadius: radius.sm,
            border: `1px solid ${cssVar("border")}`,
            background: cssVar("surface-raised"),
            color: cssVar("text-secondary"),
          }}
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 6,
          alignContent: "start",
        }}
      >
        {nodes.map((store) => (
          <button
            key={store.id}
            type="button"
            onClick={() => onSelectStore(store.id)}
            style={{
              textAlign: "left",
              padding: "8px 10px",
              borderRadius: radius.sm,
              border: `1px solid ${store.status === "outbreak" ? cssVar("severity-high") : cssVar("border")}`,
              background: store.status === "outbreak" ? `${cssVar("severity-high")}12` : cssVar("surface-raised"),
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: nodeColor(store.status),
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: cssVar("text-primary"),
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {store.label}
              </span>
            </div>
            <span className="lisn-num" style={{ fontSize: 11, fontWeight: 700, color: nodeColor(store.status) }}>
              {store.peerMultiple}× · {store.issueRate.toFixed(1)}/1k
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
