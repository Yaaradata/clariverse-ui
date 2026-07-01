"use client";

import React from "react";
import { BRIDGE_CATALOGUE, STARRED_BRIDGE_IDS, type BridgeCatalogueEntry } from "../../lib/cxHeadRetailData";
import { cssVar, radius, space, type } from "../../theme/tokens";

const STARRED = new Set<string>(STARRED_BRIDGE_IDS);

/** Fixed row height — matches MB1 row with room for two clamped title lines. */
const CATALOGUE_CARD_HEIGHT = 72;
const CATALOGUE_TITLE_HEIGHT = 32;
const CATALOGUE_HEADER_HEIGHT = 14;

/** Shared height for catalogue list + detail panel alignment. */
export const BRIDGE_CATALOGUE_PANEL_HEIGHT = 520;

function statusTone(entry: BridgeCatalogueEntry): { label: string; color: string } {
  if (entry.status === "ready") return { label: "Ready", color: cssVar("positive") };
  return { label: "Pending", color: cssVar("text-muted") };
}

function catalogueCardStyle(selected: boolean): React.CSSProperties {
  return {
    textAlign: "left",
    width: "100%",
    height: CATALOGUE_CARD_HEIGHT,
    minHeight: CATALOGUE_CARD_HEIGHT,
    maxHeight: CATALOGUE_CARD_HEIGHT,
    boxSizing: "border-box",
    flexShrink: 0,
    padding: `${space["2"]} ${space["3"]}`,
    borderRadius: radius.md,
    border: `1px solid ${selected ? cssVar("accent") : cssVar("border")}`,
    borderLeft: `3px solid ${selected ? cssVar("accent") : "transparent"}`,
    background: selected ? cssVar("accent-soft") : cssVar("surface"),
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: space["1"],
    minWidth: 0,
  };
}

export function BridgeCatalogueList({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}): React.ReactElement {
  return (
    <nav
      aria-label="Bridge catalogue MB1 to MB17"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space["1"],
        minWidth: 0,
        height: BRIDGE_CATALOGUE_PANEL_HEIGHT,
        minHeight: BRIDGE_CATALOGUE_PANEL_HEIGHT,
        maxHeight: BRIDGE_CATALOGUE_PANEL_HEIGHT,
        overflowY: "auto",
        paddingRight: 2,
      }}
    >
      {BRIDGE_CATALOGUE.map((entry) => {
        const selected = entry.id === selectedId;
        const tone = statusTone(entry);
        const starred = STARRED.has(entry.id);

        return (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry.id)}
            aria-current={selected ? "true" : undefined}
            style={catalogueCardStyle(selected)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: space["2"],
                height: CATALOGUE_HEADER_HEIGHT,
                minHeight: CATALOGUE_HEADER_HEIGHT,
                flexShrink: 0,
              }}
            >
              <span
                className="lisn-num"
                style={{
                  fontSize: type.scale.caption,
                  fontWeight: type.weight.bold,
                  lineHeight: 1,
                  color: selected ? cssVar("accent") : cssVar("text-secondary"),
                }}
              >
                {entry.id}
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: type.weight.bold,
                  lineHeight: 1,
                  color: tone.color,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                  minWidth: 44,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {tone.label}
              </span>
            </div>
            <span
              style={{
                height: CATALOGUE_TITLE_HEIGHT,
                minHeight: CATALOGUE_TITLE_HEIGHT,
                maxHeight: CATALOGUE_TITLE_HEIGHT,
                overflow: "hidden",
                fontSize: type.scale.caption,
                fontWeight: starred ? type.weight.semibold : type.weight.medium,
                color: cssVar("text-primary"),
                lineHeight: 1.35,
                overflowWrap: "anywhere",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {entry.title}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
