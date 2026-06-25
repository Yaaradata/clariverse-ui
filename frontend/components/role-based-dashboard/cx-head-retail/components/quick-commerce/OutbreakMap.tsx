"use client";

import React, { useMemo, useState } from "react";
import { DARK_STORES, type DarkStoreNode } from "../../lib/cxHeadRetailData";
import { cssVar, radius } from "../../theme/tokens";

const CITIES = ["Bengaluru", "Hyderabad", "Delhi NCR", "Mumbai", "All cities"] as const;
type CityFilter = (typeof CITIES)[number];

function nodeColor(status: DarkStoreNode["status"]): string {
  if (status === "outbreak") return cssVar("severity-high");
  if (status === "flat") return cssVar("severity-med");
  return cssVar("positive");
}

/** AP-009 geo carve-out — peer-relative node map by city, not a dense matrix. */
export function OutbreakMap({
  onSelectStore,
  defaultCity = "Bengaluru",
}: {
  onSelectStore: (storeId: string) => void;
  defaultCity?: CityFilter;
}): React.ReactElement {
  const [city, setCity] = useState<CityFilter>(defaultCity);

  const nodes = useMemo(() => {
    if (city === "All cities") return DARK_STORES;
    return DARK_STORES.filter((d) => d.city === city);
  }, [city]);

  return (
    <div
      style={{
        padding: 16,
        borderRadius: radius.lg,
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: cssVar("text-primary") }}>Catchment outbreak map</div>
          <div style={{ fontSize: 12, color: cssVar("text-muted"), marginTop: 2 }}>
            Peer-relative · normalised per 1k orders
          </div>
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value as CityFilter)}
          style={{
            fontSize: 12,
            padding: "6px 10px",
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
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 10,
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
              padding: "12px 12px",
              borderRadius: radius.md,
              border: `2px solid ${store.status === "outbreak" ? cssVar("severity-high") : cssVar("border")}`,
              background:
                store.status === "outbreak"
                  ? `${cssVar("severity-high")}14`
                  : cssVar("surface-raised"),
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              minHeight: 88,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                aria-hidden
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: nodeColor(store.status),
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: cssVar("text-primary"), lineHeight: 1.2 }}>
                {store.label}
              </span>
            </div>
            <span style={{ fontSize: 11, color: cssVar("text-muted") }}>{store.city}</span>
            <span className="lisn-num" style={{ fontSize: 12, fontWeight: 700, color: nodeColor(store.status) }}>
              {store.peerMultiple}× baseline
            </span>
            <span className="lisn-num" style={{ fontSize: 11, color: cssVar("text-muted") }}>
              {store.issueRate.toFixed(1)} / 1k orders
            </span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: cssVar("text-muted"), lineHeight: 1.4 }}>
        Click a node for peer comparison and corpus evidence. CX detects; Ops acts on approval.
      </div>
    </div>
  );
}
