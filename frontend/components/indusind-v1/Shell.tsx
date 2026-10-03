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
      style={{
        width: 34,
        height: 34,
        borderRadius: 999,
        border: `1px solid ${C.border}`,
        background: C.cardAlt,
        color: C.textSec,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
      }}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

/** Today's date and time, shown once mounted so the server and the browser render the same first frame. */
function Now() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const f = () =>
      setNow(
        new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        })
          .format(new Date())
          .replace(",", ""),
      );
    f();
    const t = setInterval(f, 30_000);
    return () => clearInterval(t);
  }, []);
  return <span suppressHydrationWarning>{now ? `${now} IST` : ""}</span>;
}

function Segmented({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string; on: boolean }[];
}) {
  return (
    <nav
      aria-label={label}
      style={{
        display: "inline-flex",
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 999,
        padding: 2,
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
            fontSize: 12.5,
            fontWeight: x.on ? 700 : 500,
            color: x.on ? C.text : C.textMut,
            background: x.on ? tint(C.brand, 0.28) : "transparent",
            borderRadius: 999,
            padding: "4px 11px",
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
        <ThemeToggle />
        <div className="ind-rail-me" title={view}>
          {sel.v === "cx" ? "CX" : "CO"}
        </div>
      </aside>

      <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "16px 22px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 21,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                }}
              >
                Customer pulse — {view}
              </h1>
              <div style={{ fontSize: 12.5, color: C.textMut, marginTop: 2 }}>
                {common.bank} · {screen}
              </div>
            </div>
            <div
              data-testid="freeze"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.textSec,
                background: C.cardAlt,
                border: `1px solid ${C.border}`,
                borderRadius: 999,
                padding: "5px 11px",
                whiteSpace: "nowrap",
                display: "flex",
                gap: 8,
              }}
            >
              <span>
                Data freeze {common.freeze}
                {common.freeze_provisional ? " (provisional)" : ""}
              </span>
              <span style={{ color: C.textMut, fontWeight: 500 }}>
                <Now />
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: 12,
            }}
          >
            {controls.view ? (
              <Segmented
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
          <div
            data-testid="watermark"
            style={{
              fontSize: 11.5,
              color: C.amber,
              background: tint(C.amber, 0.08),
              border: `1px solid ${tint(C.amber, 0.25)}`,
              borderRadius: 8,
              textAlign: "center",
              padding: "3px 12px",
              marginTop: 12,
              letterSpacing: "0.02em",
            }}
          >
            {common.watermark}
          </div>
        </header>

        <main
          style={{
            width: "100%",
            maxWidth: 1400,
            // The Ask bar floats at the bottom: the page ends well above it, so it never covers content.
            padding: "14px 22px 120px",
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
