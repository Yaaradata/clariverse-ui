"use client";

import { useLabel2, useV2K } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import {
  Activity,
  ArrowLeft,
  Handshake,
  RefreshCw,
  SlidersHorizontal,
  Users,
  Wrench,
} from "lucide-react";
import { type ComponentType, useState } from "react";
import { withAlpha } from "@/components/role-based-dashboard/kgs/shared/tokens";
import { useKgs2Nav } from "../nav";

type RailItem = {
  key: V2View | "back" | "demo";
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  onClick: () => void;
  active?: boolean;
};

const RAIL: { key: V2View; label: string; icon: RailItem["icon"] }[] = [
  { key: "overview", label: "Overview", icon: Activity },
  { key: "promise", label: "Promises", icon: Handshake },
  { key: "recurring", label: "Recurring", icon: RefreshCw },
  { key: "install", label: "Install", icon: Wrench },
  { key: "partner", label: "Partners", icon: Users },
];

export function LeftRail({ onOpenDemoMenu }: { onOpenDemoMenu: () => void }) {
  const { view, go, exit } = useKgs2Nav();
  const L = useLabel2();
  const K = useV2K();
  const brand = L("LiSN · {{region:India & SEA}}");
  const [hover, setHover] = useState(false);
  const w = hover ? 268 : 76;

  const top: RailItem[] = RAIL.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    onClick: () => go(item.key),
    active:
      item.key === "overview"
        ? view === "overview"
        : item.key === "promise"
          ? view === "promise" || view === "promiseHero"
          : item.key === "recurring"
            ? view === "recurring" || view === "recurringTheme"
            : view === item.key,
  }));

  const bottom: RailItem[] = [
    { key: "back", label: "Back", icon: ArrowLeft, onClick: exit },
    {
      key: "demo",
      label: "Demo controls",
      icon: SlidersHorizontal,
      onClick: onOpenDemoMenu,
    },
  ];

  const renderItem = (item: RailItem) => {
    const Icon = item.icon;
    return (
      <button
        key={item.key}
        type="button"
        onClick={item.onClick}
        title={item.label}
        aria-label={item.label}
        aria-current={item.active ? "page" : undefined}
        className="kgs2-focus"
        style={{
          width: "100%",
          textAlign: "left",
          border: "none",
          background: item.active ? withAlpha(K.brand, 0.18) : "transparent",
          color: item.active ? K.text : K.textSec,
          borderRadius: 8,
          padding: hover ? "9px 10px" : "10px 8px",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: hover ? 10 : 0,
          cursor: "pointer",
          borderLeft: item.active
            ? `3px solid ${K.violet400}`
            : "3px solid transparent",
          justifyContent: hover ? "flex-start" : "center",
          fontFamily: K.font,
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: item.active
              ? withAlpha(K.brand, 0.25)
              : withAlpha(K.textMut, 0.12),
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={14} color={item.active ? K.violet300 : K.textMut} />
        </span>
        {hover ? (
          <span
            style={{
              fontSize: 13,
              fontWeight: item.active ? 700 : 500,
              lineHeight: 1.3,
            }}
          >
            {item.label}
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <aside
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: w,
        minWidth: w,
        transition: "width 0.22s ease, min-width 0.22s ease",
        borderRight: `1px solid ${K.borderLight}`,
        background: K.elevated,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 40,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          padding: "14px 10px",
          borderBottom: `1px solid ${K.borderLight}`,
          display: "flex",
          justifyContent: hover ? "flex-start" : "center",
        }}
      >
        <button
          type="button"
          onClick={() => go("overview")}
          title={brand}
          aria-label={brand}
          className="kgs2-focus"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: K.brandTint,
            border: `1px solid ${withAlpha(K.violet300, 0.3)}`,
            display: "grid",
            placeItems: "center",
            fontSize: 15,
            fontWeight: 800,
            color: K.violet300,
            fontFamily: K.font,
            cursor: "pointer",
            marginLeft: hover ? 6 : 0,
          }}
        >
          Li
        </button>
      </div>
      <nav
        aria-label={L("{{region:India & SEA}}")}
        style={{ padding: "10px 8px", flex: 1, overflowY: "auto" }}
      >
        {top.map(renderItem)}
      </nav>
      <div
        style={{
          padding: "10px 8px",
          borderTop: `1px solid ${K.borderLight}`,
        }}
      >
        {bottom.map(renderItem)}
      </div>
    </aside>
  );
}
