"use client";

import {
  Activity,
  ArrowLeft,
  CreditCard,
  Headphones,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, Suspense, useEffect, useState } from "react";
import { rangeLabel } from "@/lib/hdfc-v3/format";
import type { PeriodsFile } from "@/lib/hdfc-v3/periods";
import { THEME_KEY, type ThemeName } from "@/lib/hdfc-v3/theme";
import type { AskFile, Evidence, Meta, View } from "@/lib/hdfc-v3/types";
import { AskBar } from "./AskBar";
import { HeaderPeriodFilter } from "./Pulse";
import { C, tint } from "./primitives";

export type ShellProps = {
  meta: Meta;
  ask: AskFile;
  askEvidence: Record<
    string,
    Pick<Evidence, "id" | "summary" | "place" | "created_at" | "themes">
  >;
  title: string;
  subtitle?: string;
  view?: View;
  drill?: boolean;
  /** When set, the period filter sits in the header, top right. */
  periods?: PeriodsFile;
  /** Where the user is, kept on screen in the sticky header while scrolling (e.g. "Cards · Business view"). */
  context?: string;
  children: ReactNode;
};

export function withFrom(href: string, from: View): string {
  return `${href}${href.includes("?") ? "&" : "?"}from=${from}`;
}

export function useFrom(fallback: View = "mds-office"): View {
  const sp = useSearchParams();
  const f = sp?.get("from");
  return f === "head-cx" || f === "mds-office" ? f : fallback;
}

function Nav({ view, collapsed }: { view: View; collapsed: boolean }) {
  const pathname = usePathname() ?? "";
  const items = [
    {
      href: "/hdfc-pulse/v2/mds-office",
      label: "MD's office / Head of CX",
      icon: Activity,
      exec: true,
    },
    {
      href: "/hdfc-pulse/v2/business/cards",
      label: "Cards: business view",
      icon: CreditCard,
    },
    {
      href: withFrom("/hdfc-pulse/v2/action-queue", view),
      label: "Action queue: escalation emails",
      icon: Inbox,
    },
    {
      href: "/hdfc-pulse/v2/my-view",
      label: "My view: pinned answers",
      icon: LayoutDashboard,
    },
  ];
  return (
    <nav
      aria-label="LisN screens"
      style={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      {items.map((it) => {
        const active = pathname === it.href.split("?")[0];
        const Icon = it.icon;
        return (
          <Link
            key={it.href}
            href={it.href}
            title={it.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed ? "10px 8px" : "9px 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 8,
              textDecoration: "none",
              color: active ? C.text : C.textSec,
              background: active ? C.brandSoft : "transparent",
              borderLeft: active
                ? `3px solid ${C.brand}`
                : "3px solid transparent",
              fontSize: 14,
              fontWeight: active ? 700 : 500,
              lineHeight: 1.3,
            }}
          >
            <Icon
              size={16}
              color={active ? C.brandInk : C.textMut}
              style={{ flexShrink: 0 }}
            />
            {collapsed ? null : <span>{it.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

/** Light / dark switch. The theme lives on <html data-lisn-theme> (set before first paint by the V2 layout). */
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
      data-testid="theme-toggle"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
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
        <Sun size={14} color={C.amber} />
      ) : (
        <Moon size={14} color={C.brandInk} />
      )}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

function BackButton({ from }: { from: View }) {
  const router = useRouter();
  return (
    <button
      type="button"
      data-testid="back"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1)
          router.back();
        else router.push(`/hdfc-pulse/v2/${from}`);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: C.cardAlt,
        border: `1px solid ${C.borderLight}`,
        color: C.textSec,
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      <ArrowLeft size={14} /> Back
    </button>
  );
}

function ShellInner({
  meta,
  ask,
  title,
  subtitle,
  view,
  drill,
  periods,
  context,
  children,
}: ShellProps) {
  const from = useFrom(view ?? "mds-office");
  const current: View = view ?? from;
  const [askOpen, setAskOpen] = useState(false);
  const [navHover, setNavHover] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "var(--font), system-ui, sans-serif",
      }}
    >
      <div
        className="lisn-layout"
        style={{ display: "flex", minHeight: "100vh" }}
      >
        <aside
          className="lisn-sidebar"
          onMouseEnter={() => setNavHover(true)}
          onMouseLeave={() => setNavHover(false)}
          style={{
            width: navHover ? 280 : 72,
            transition: "width 0.2s ease",
            flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
            background: C.surface,
            padding: "14px 8px",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            flexDirection: "column",
            gap: 14,
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 6px",
              justifyContent: navHover ? "flex-start" : "center",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: C.brandSoft,
                border: `1px solid ${tint(C.brand, 0.33)}`,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Headphones size={17} color={C.brandInk} />
            </div>
            {navHover ? (
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: "0.02em",
                  }}
                >
                  LisN
                </div>
                <div style={{ fontSize: 12, color: C.textMut }}>
                  Customer Pulse · HDFC Bank
                </div>
              </div>
            ) : null}
          </div>
          <Nav view={current} collapsed={!navHover} />
          <div style={{ marginTop: "auto" }}>
            <button
              type="button"
              onClick={() => setAskOpen(true)}
              title="Ask LisN"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: navHover ? "flex-start" : "center",
                gap: 10,
                background: C.cardAlt,
                border: `1px solid ${C.borderLight}`,
                color: C.text,
                borderRadius: 8,
                padding: "10px",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              <MessageSquareText size={16} color={C.brandInk} />
              {navHover ? "Ask LisN" : null}
            </button>
          </div>
        </aside>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* On a phone the header scrolls away instead of holding a fifth of the screen (review finding #44). */}
          <style>
            {
              "@media (max-width: 640px) { .lisn-header { position: static !important; } }"
            }
          </style>
          <header
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
              {context ? (
                <strong
                  data-testid="context"
                  style={{
                    color: C.text,
                    background: tint(C.brand, 0.14),
                    border: `1px solid ${tint(C.brand, 0.4)}`,
                    borderRadius: 8,
                    padding: "3px 10px",
                    marginRight: 10,
                    fontSize: 14.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {context}
                </strong>
              ) : null}
              <strong style={{ color: C.text }}>HDFC Bank</strong> · Customer
              Pulse · {meta.brief_label}, {meta.brief_time}
            </div>
            {periods ? <HeaderPeriodFilter file={periods} /> : null}
            <ThemeToggle />
          </header>

          <main
            style={{
              padding: "18px 20px 110px",
              maxWidth: 1480,
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {drill ? <BackButton from={from} /> : null}
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    fontSize: 26,
                    fontWeight: 750,
                    margin: 0,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </h1>
                {subtitle ? (
                  <div
                    style={{ fontSize: 14.5, color: C.textMut, marginTop: 4 }}
                  >
                    {subtitle}
                  </div>
                ) : null}
              </div>
            </div>
            {children}
            <footer
              style={{
                fontSize: 12.5,
                color: C.textDim,
                borderTop: `1px solid ${C.border}`,
                paddingTop: 12,
                lineHeight: 1.6,
              }}
            >
              {meta.scope_note} Window{" "}
              {rangeLabel(meta.window.start, meta.window.end)}. Every action is
              a recommendation routed to its owner; LisN does not execute,
              authorise or decide. Runs inside the bank, on the bank&apos;s
              approved models.
            </footer>
          </main>
        </div>
      </div>
      <AskBar ask={ask} periods={periods} open={askOpen} setOpen={setAskOpen} />
      <style>{`
        .lisn-sidebar { display: flex; }
        @media (max-width: 720px) {
          .lisn-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}

export function Shell(props: ShellProps) {
  return (
    <div className="lisn-v2" style={{ background: C.bg, color: C.text }}>
      <Suspense
        fallback={<div style={{ minHeight: "100vh", background: C.bg }} />}
      >
        <ShellInner {...props} />
      </Suspense>
    </div>
  );
}
