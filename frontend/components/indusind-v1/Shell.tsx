"use client";

/**
 * IndusInd · the frame of every screen: title line with the date and the data freeze, the view toggle (CEO's office ·
 * Head of CX), the window selector, the business filter, the nav, the watermark, the footer and Ask LisN. The
 * selection lives in the URL, so the server sends only the slice a page renders.
 */

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";

import { BASE, hrefWith, type Sel } from "@/lib/indusind-v1/params";
import { THEME_KEY, type ThemeName } from "@/lib/indusind-v1/theme";
import type { AskBank, Common } from "@/lib/indusind-v1/types";
import { AskBar } from "./AskBar";
import { C, tint } from "./primitives";

const NAV = [
  { href: BASE, label: "Customer pulse" },
  { href: `${BASE}/deposits`, label: "Deposits" },
  { href: `${BASE}/peers`, label: "Peer and market moves" },
  { href: `${BASE}/risk`, label: "Conduct and complaints" },
  { href: `${BASE}/cards`, label: "Cards" },
  { href: `${BASE}/approvals`, label: "Approvals" },
];

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
  return (
    <div
      className="lisn-v2"
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "var(--font), system-ui, sans-serif",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: C.header,
          borderBottom: `1px solid ${C.border}`,
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "10px 16px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 750,
                  letterSpacing: "-0.01em",
                }}
              >
                {common.bank} · Customer pulse
              </h1>
              <div
                style={{
                  fontSize: 12.5,
                  color: C.textMut,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <Now />
                <span data-testid="freeze">
                  Data freeze {common.freeze}
                  {common.freeze_provisional ? " (provisional)" : ""}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
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
              <ThemeToggle />
            </div>
          </div>
          <nav
            aria-label="Screens"
            style={{
              display: "flex",
              gap: 4,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {NAV.map((n) => {
              const on = n.href === path;
              return (
                <Link
                  key={n.href}
                  href={hrefWith(n.href, sel, { b: "all" })}
                  aria-current={on ? "page" : undefined}
                  style={{
                    fontSize: 13.5,
                    fontWeight: on ? 700 : 500,
                    color: on ? C.text : C.textSec,
                    padding: "5px 10px",
                    borderRadius: 8,
                    background: on ? C.cardAlt : "transparent",
                    border: `1px solid ${on ? C.border : "transparent"}`,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          {controls.business ? (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 12, color: C.textMut }}>Business</span>
              <Segmented
                label="Business"
                items={common.businesses.map((x) => ({
                  href: hrefWith(path, sel, { b: x.id }),
                  label: x.label,
                  on: sel.b === x.id,
                }))}
              />
            </div>
          ) : null}
        </div>
        <div
          data-testid="watermark"
          style={{
            fontSize: 11.5,
            color: C.amber,
            background: tint(C.amber, 0.08),
            borderTop: `1px solid ${tint(C.amber, 0.25)}`,
            textAlign: "center",
            padding: "3px 16px",
            letterSpacing: "0.02em",
          }}
        >
          {common.watermark}
        </div>
      </header>

      <main
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          // The Ask bar floats at the bottom: the page ends well above it, so it never covers content.
          padding: "16px 16px 120px",
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
      <AskBar ask={ask} />
    </div>
  );
}
