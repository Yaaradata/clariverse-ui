"use client";

import { exec, meta } from "@kgs/lib/data";
import {
  Activity,
  ArrowLeft,
  Cpu,
  Handshake,
  Lock,
  SlidersHorizontal,
  Split,
} from "lucide-react";
import { type ComponentType, useState } from "react";
import { useKgsNav } from "../nav";
import { K, withAlpha } from "../shared/tokens";
import { useLabel } from "./DemoProvider";

type RailItem = {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  onClick: () => void;
  active?: boolean;
};

/**
 * Fork of the bank rail (HeadOfCreditCardsDashboard.tsx:1030-1193): 76px, expands on hover.
 * KGS changes: "Li" monogram replaces the "Y" mark; the two industry/role colour squares are
 * removed; nav per 04 §1.2; bottom "Back" (exits the dashboard) and "Demo controls".
 */
export function LeftRail({ onOpenDemoMenu }: { onOpenDemoMenu: () => void }) {
  const { view, go, exit } = useKgsNav();
  const L = useLabel();
  const [hover, setHover] = useState(false);
  const w = hover ? 268 : 76;
  const ui = meta.ui.rail;
  const [q1, q2, q3] = exec.questionCards;

  const top: RailItem[] = [
    {
      key: "overview",
      label: L(ui.overview),
      icon: Activity,
      onClick: () => go("/"),
      active: view === "/",
    },
    {
      key: q1.id,
      label: L(q1.title),
      icon: Cpu,
      onClick: () => go(q1.route),
      active: view.startsWith("/installed-base"),
    },
    {
      key: q2.id,
      label: L(q2.title),
      icon: Handshake,
      onClick: () => go(q2.route),
      active: view === "/channel",
    },
    {
      key: q3.id,
      label: L(q3.title),
      icon: Split,
      onClick: () => go(q3.route),
      active: view === "/separation",
    },
  ];
  const watch: RailItem = {
    key: "watch",
    label: L(ui.watch),
    icon: Lock,
    onClick: () => go("/#governed-watch"),
  };
  const bottom: RailItem[] = [
    { key: "back", label: L(ui.back), icon: ArrowLeft, onClick: exit },
    {
      key: "demo",
      label: L(ui.demoControls),
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
        className="kgs-focus"
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
          onClick={() => go("/")}
          title={L(ui.logo)}
          aria-label={L(ui.logo)}
          className="kgs-focus"
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
          {L(ui.monogram)}
        </button>
      </div>
      <nav
        aria-label={L(meta.title)}
        style={{ padding: "10px 8px", flex: 1, overflowY: "auto" }}
      >
        {top.map(renderItem)}
        <div
          style={{
            height: 1,
            background: K.borderLight,
            margin: "8px 4px 12px",
          }}
        />
        {renderItem(watch)}
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
