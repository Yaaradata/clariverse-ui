"use client";

/**
 * IndusInd · the frame of every screen, in the role-based layout (/role-based/indusind_bank): the icon rail (back to
 * roles, one icon per screen), the title bar with the data-freeze pill, the view toggle (CEO's office · Head of CX),
 * the window selector, the business filter, the watermark, the footer and Ask LisN. The selection lives in the URL,
 * so the server sends only the slice a page renders.
 */

import {
  Activity,
  CheckSquare,
  CreditCard,
  Landmark,
  Moon,
  Scale,
  Sun,
  Users,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";

import { BASE, hrefWith, type Sel } from "@/lib/indusind-v1/params";
import { THEME_KEY, type ThemeName } from "@/lib/indusind-v1/theme";
import type { AskBank, Common } from "@/lib/indusind-v1/types";
import { AskBar } from "./AskBar";
import { C, tint } from "./primitives";

const NAV = [
  { href: BASE, label: "Customer pulse", icon: Activity },
  { href: `${BASE}/deposits`, label: "Deposits", icon: Landmark },
  { href: `${BASE}/peers`, label: "Peer and market moves", icon: Users },
  { href: `${BASE}/risk`, label: "Conduct and complaints", icon: Scale },
  { href: `${BASE}/cards`, label: "Cards", icon: CreditCard },
  { href: `${BASE}/approvals`, label: "Approvals", icon: CheckSquare },
];

/** The role picker for the bank, as in every role-based dashboard. */
const ROLES_HREF = "/role-based/indusind_bank";

function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>("dark");
  useEffect(() => {
    setTheme(
      document.documentElement.getAttribute("data-lisn-theme") === "light"
        ? "light"
        : "dark",
    );
  }, []);
  const next: ThemeName = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={() => {
        document.documentElement.setAttribute("data-lisn-theme", next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
          // private mode: the switch still applies for this visit
        }
        setTheme(next);
      }}
      data-testid="theme-toggle"
      title={`Switch to ${next} theme`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: C.cardAlt,
        border: `1px solid ${C.borderLight}`,
        color: C.text,
        borderRadius: 999,
        padding: "5px 12px",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {theme === "dark" ? (
        <Sun size={14} color={C.amber} aria-hidden="true" />
      ) : (
        <Moon size={14} color={C.amber} aria-hidden="true" />
      )}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

function Segmented({
  label,
  items,
  variant = "pills",
}: {
  label: string;
  items: { href: string; label: string; on: boolean }[];
  /** "switch": one joined track with the active item filled (the role switch); "pills": separate pills. */
  variant?: "pills" | "switch";
}) {
  if (variant === "switch")
    return (
      <nav
        aria-label={label}
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: C.cardAlt,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 10,
          padding: 3,
          gap: 2,
        }}
      >
        {items.map((x) => (
          <Link
            key={x.href + x.label}
            href={x.href}
            scroll={false}
            aria-current={x.on ? "true" : undefined}
            style={{
              padding: "4px 12px",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: x.on ? 700 : 500,
              color: x.on ? "#fff" : C.textSec,
              background: x.on ? C.brand : "transparent",
              boxShadow: x.on ? `0 1px 6px ${tint(C.brand, 0.35)}` : "none",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {x.label}
          </Link>
        ))}
      </nav>
    );
  return (
    <nav
      aria-label={label}
      data-testid={label === "Window" ? "period-filter" : undefined}
      style={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {items.map((x) => (
        <Link
          key={x.href + x.label}
          href={x.href}
          scroll={false}
          aria-current={x.on ? "true" : undefined}
          style={{
            padding: "4px 11px",
            borderRadius: 999,
            fontSize: 13,
            color: x.on ? C.text : C.textSec,
            background: x.on ? tint(C.brand, 0.16) : "transparent",
            border: `1px solid ${x.on ? C.brand : C.border}`,
            fontWeight: x.on ? 700 : 500,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {x.label}
        </Link>
      ))}
    </nav>
  );
}

export function Shell({
  common,
  ask,
  sel,
  path,
  controls = {},
  children,
}: {
  common: Common;
  ask: AskBank;
  sel: Sel;
  path: string;
  controls?: { view?: boolean; window?: boolean; business?: boolean };
  children: ReactNode;
}) {
  const view = common.views.find((x) => x.id === sel.v)?.label ?? "";
  const screen = NAV.find((n) => n.href === path)?.label ?? "";
  // The Cards page is the business head's view, not the CEO's office (review finding 15).
  const isCards = path === `${BASE}/cards`;
  const title = isCards ? "Cards — business view" : view;
  // One line under the title on the pulse home; the other screens open with their own heading.
  const subtitle =
    path === BASE
      ? "The pulse first, then what needs you this week, business by business."
      : null;
  const initials = isCards ? "HC" : sel.v === "cx" ? "CX" : "CO";
  return (
    <div
      className="lisn-v2 ind-shell"
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "var(--font), system-ui, sans-serif",
      }}
    >
      {/* The role-based rail: back to roles, one icon per screen, the theme switch and the role's initials. */}
      <aside className="ind-rail" aria-label="Screens">
        <Link
          href={ROLES_HREF}
          title="Back to roles"
          aria-label="Back to roles"
          className="ind-rail-home"
        >
          Y
        </Link>
        <div className="ind-rail-rule" />
        {NAV.map((n) => {
          const on = n.href === path;
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={hrefWith(n.href, sel, { b: "all" })}
              title={n.label}
              aria-label={n.label}
              aria-current={on ? "page" : undefined}
              className={on ? "ind-rail-item ind-rail-on" : "ind-rail-item"}
            >
              <Icon size={17} />
            </Link>
          );
        })}
        <div className="ind-rail-fill" />
        <div className="ind-rail-me" title={isCards ? "Head of Cards" : view}>
          {initials}
        </div>
      </aside>

      <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Header as on the HDFC pulse: a thin top bar (bank · screen · data freeze, window on the right), then the
            page title, one line under it, and the view and business choices. */}
        <header>
          <div
            className="lisn-header"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: C.header,
              backdropFilter: "blur(6px)",
              borderBottom: `1px solid ${C.border}`,
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: C.textSec,
                lineHeight: 1.4,
                flex: "1 1 360px",
                minWidth: 0,
              }}
            >
              <strong style={{ color: C.text }}>{common.bank}</strong> ·{" "}
              {screen} ·{" "}
              <span data-testid="freeze">Data freeze {common.freeze}</span>
            </div>
            {controls.view ? (
              <Segmented
                variant="switch"
                label="View"
                items={common.views.map((x) => ({
                  href: hrefWith(path, sel, { v: x.id }),
                  label: x.label,
                  on: sel.v === x.id,
                }))}
              />
            ) : null}
            {controls.window ? (
              <Segmented
                label="Window"
                items={common.windows.map((x) => ({
                  href: hrefWith(path, sel, { w: x.id }),
                  label: x.label,
                  on: sel.w === x.id,
                }))}
              />
            ) : null}
            <ThemeToggle />
          </div>
          <div
            style={{
              padding: "18px 22px 0",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h1>
              {subtitle ? (
                <div style={{ fontSize: 14, color: C.textSec, marginTop: 4 }}>
                  {subtitle}
                </div>
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {controls.business ? (
                <Segmented
                  label="Business"
                  items={common.businesses.map((x) => ({
                    href: hrefWith(path, sel, { b: x.id }),
                    label: x.label,
                    on: sel.b === x.id,
                  }))}
                />
              ) : null}
            </div>
          </div>
        </header>

        <main
          style={{
            // Full width, like the header: no strip left empty on wide screens (reviewer, 5 Oct).
            width: "100%",
            // Ask LisN sits in the title bar, so nothing floats over the page.
            padding: "14px 22px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {children}
          <footer
            data-testid="footer"
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 12,
              marginTop: 6,
              fontSize: 12.5,
              color: C.textMut,
              lineHeight: 1.55,
            }}
          >
            {common.footer}
          </footer>
        </main>
      </div>
      <AskBar ask={ask} />
    </div>
  );
}
