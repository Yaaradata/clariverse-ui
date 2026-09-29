"use client";

import { useState } from "react";
import { KpiTile } from "./KpiTile";
import { HowWeCountDrawer } from "./HowWeCountDrawer";
import { useLabel } from "../shell/DemoProvider";

type AppliedValueTile = {
  id: string;
  value: string;
  sub?: string;
  chip?: string;
  chipColor?: string;
  tooltip?: string;
  onClick?: "popover" | "scroll";
  onApprove?: { value: string; sub: string };
  popoverContent?: any;
  money?: boolean;
};

type AppliedValueStripProps = {
  header: string;
  chip: string;
  tiles: AppliedValueTile[];
  footnote: string;
  isApproved?: boolean;
  onScrollToMonitor?: () => void;
  onShowSuppressed?: () => void;
};

export function AppliedValueStrip({
  header,
  chip,
  tiles,
  footnote,
  isApproved,
  onScrollToMonitor,
  onShowSuppressed,
}: AppliedValueStripProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const L = useLabel();

  return (
    <>
      <div id="applied-value" style={{ scrollMarginTop: 80, marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.01em",
              }}
            >
              {header}
            </h2>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(234, 179, 8, 0.1)",
                border: "1px dashed rgba(234, 179, 8, 0.5)",
                color: "#fde047",
              }}
            >
              {chip}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              color: "#a78bfa",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            How we count
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, marginBottom: 12 }}>
          {tiles.map((tile) => {
            const tileData = isApproved && tile.onApprove && tile.id === "AV-3" ? tile.onApprove : tile;
            
            return (
              <KpiTile
                key={tile.id}
                value={tileData.value}
                sub={tileData.sub}
                chip={tile.chip}
                chipColor={tile.chipColor}
                tooltip={tile.tooltip}
                money={tile.money}
                onClick={
                  tile.onClick === "scroll" && onScrollToMonitor
                    ? onScrollToMonitor
                    : tile.onClick === "popover" && onShowSuppressed
                      ? onShowSuppressed
                      : undefined
                }
              />
            );
          })}
        </div>

        <div style={{ fontSize: 13, color: "#737373", fontStyle: "italic", lineHeight: 1.5 }}>
          {L(footnote)}
        </div>
      </div>

      <HowWeCountDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
