"use client";

/**
 * NatWest Group · the frame of every screen (re-bound from the oct13 shell): icon rail on desktop, screen strip on a
 * phone, the header with the freeze, the window and brand filters, the watermark, the footer and Ask LisN. The
 * selection lives in the URL (?w=&b=), so the server sends only the slice a page renders (HL-01).
 */

import {
  Activity,
  ArrowLeft,
  Bot,
  Headphones,
  Layers,
  MessagesSquare,
  Moon,
  Scale,
  ShieldCheck,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import {
  type AskQA,
  type BrandId,
  NW_BASE,
  type NwFrame,
  nwHref,
  rangeText,
  type WindowId,
} from "@/lib/natwest-pulse/nw";
import { THEME_KEY, type ThemeName } from "@/lib/natwest-pulse/theme";
import { AskBar } from "./AskBar";
import { C, tint } from "./primitives";

export type ScreenId =
  | "home"
  | "channel"
  | "cora"
  | "fos"
  | "duty"
  | "brand"
  | "agents";

export const SCREENS: {
  id: ScreenId;
  href: string;
  label: string;
  icon: typeof Activity;
}[] = [
  { id: "home", href: "mds-office", label: "Customer pulse", icon: Activity },
  {
    id: "channel",
    href: "satisfaction",
    label: "Cross-channel pulse",
    icon: Layers,
  },
  {
    id: "cora",
    href: "module/cora_digital",
    label: "Cora leakage",
    icon: MessagesSquare,
  },
  { id: "fos", href: "service-promise", label: "Ombudsman watch", icon: Scale },
  {
    id: "duty",
    href: "priority",
    label: "Consumer Duty outcomes",
    icon: ShieldCheck,
  },
  { id: "brand", href: "market", label: "Brand lens", icon: Headphones },
  { id: "agents", href: "action-queue", label: "AI-agent outcomes", icon: Bot },
];

export type ShellProps = {
  frame: NwFrame;
  title: string;
  subtitle?: string;
  screen?: ScreenId;
  drill?: boolean;
  /** The brand lens always compares all three brands, so it has no brand filter. */
  brandFilter?: boolean;
  ask: { qa: AskQA[]; fallback: string };
  children: ReactNode;
};

function Nav({
  screen,
  collapsed,
  w,
  b,
}: {
  screen?: ScreenId;
  collapsed: boolean;
  w: WindowId;
  b: BrandId;
}) {
  return (
    <nav
      aria-label="LisN screens"
      style={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      {SCREENS.map((it) => {
        const active = it.id === screen;
        const Icon = it.icon;
        return (
          <Link
            key={it.id}
            href={nwHref(it.href, w, it.id === "brand" ? "all" : b)}
            title={it.label}
            aria-current={active ? "page" : undefined}
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

/** On a phone the rail is hidden; the screens sit in one scrolling strip under the header. */
function PhoneNav({
  screen,
  w,
  b,
}: {
  screen?: ScreenId;
  w: WindowId;
  b: BrandId;
}) {
  return (
    <nav
      aria-label="LisN screens"
      className="lisn-phone-nav"
      style={{
        gap: 6,
        overflowX: "auto",
        padding: "8px 16px",
        borderBottom: `1px solid ${C.border}`,
        background: C.surface,
      }}
    >
      {SCREENS.map((it) => (
        <Link
          key={it.id}
          href={nwHref(it.href, w, it.id === "brand" ? "all" : b)}
          aria-current={it.id === screen ? "page" : undefined}
          style={{
            flexShrink: 0,
            fontSize: 13,
            fontWeight: it.id === screen ? 700 : 500,
            color: it.id === screen ? C.text : C.textSec,
            background: it.id === screen ? C.brandSoft : C.cardAlt,
            border: `1px solid ${it.id === screen ? tint(C.brand, 0.5) : C.border}`,
            borderRadius: 999,
            padding: "5px 11px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

/** Light / dark switch. The theme lives on <html data-lisn-theme> (set before first paint by the layout). */
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

function Segmented({
  label,
  options,
  active,
  href,
  testid,
}: {
  label: string;
  options: { id: string; label: string }[];
  active: string;
  href: (id: string) => string;
  testid: string;
}) {
  return (
    <nav
      aria-label={label}
      data-testid={testid}
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        gap: 2,
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: 2,
      }}
    >
      {options.map((o) => (
        <Link
          key={o.id}
          href={href(o.id)}
          aria-current={o.id === active ? "true" : undefined}
          scroll={false}
          style={{
            fontSize: 13,
            fontWeight: o.id === active ? 700 : 500,
            color: o.id === active ? C.text : C.textSec,
            background: o.id === active ? C.brandSoft : "transparent",
            border: `1px solid ${o.id === active ? tint(C.brand, 0.45) : "transparent"}`,
            borderRadius: 999,
            padding: "4px 11px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {o.label}
        </Link>
      ))}
    </nav>
  );
}

function BackButton({ w, b }: { w: WindowId; b: BrandId }) {
  const router = useRouter();
  return (
    <button
      type="button"
      data-testid="back"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1)
          router.back();
        else router.push(nwHref("mds-office", w, b));
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

export function Shell({
  frame,
  title,
  subtitle,
  screen,
  drill,
  brandFilter = true,
  ask,
  children,
}: ShellProps) {
  const pathname = usePathname() ?? NW_BASE;
  const [askOpen, setAskOpen] = useState(false);
  const [navHover, setNavHover] = useState(false);
  const { w, b } = frame;

  return (
    <div className="lisn-v2" style={{ background: C.bg, color: C.text }}>
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
                padding: "2px 6px",
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
                    Customer pulse · NatWest Group
                  </div>
                </div>
              ) : null}
            </div>
            <Nav screen={screen} collapsed={!navHover} w={w} b={b} />
          </aside>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
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
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: C.textSec,
                  lineHeight: 1.4,
                  flex: "1 1 300px",
                  minWidth: 0,
                }}
              >
                <strong style={{ color: C.text }}>NatWest Group</strong> ·
                Customer pulse ·{" "}
                <span data-testid="header-freeze">
                  Data frozen {frame.freezeLabel}
                </span>
              </div>
              <Segmented
                label="Window"
                testid="window-filter"
                options={frame.windows}
                active={w}
                href={(id) => nwHref(pathname, id as WindowId, b)}
              />
              {brandFilter ? (
                <Segmented
                  label="Brand"
                  testid="brand-filter"
                  options={frame.brands}
                  active={b}
                  href={(id) => nwHref(pathname, w, id as BrandId)}
                />
              ) : null}
              <ThemeToggle />
            </header>
            <PhoneNav screen={screen} w={w} b={b} />
            {/* Watermark on every screen (docs/natwest/brief.md Step 1.2). */}
            <div
              data-testid="watermark"
              role="note"
              style={{
                background: C.cardAlt,
                borderBottom: `1px solid ${C.border}`,
                color: C.textSec,
                fontSize: 12.5,
                fontWeight: 650,
                letterSpacing: "0.02em",
                textAlign: "center",
                padding: "5px 16px",
              }}
            >
              Demonstration · public data plus illustrative internal data · not
              NatWest Group MIS
            </div>

            <main
              style={{
                padding: "18px 20px 132px",
                maxWidth: 1480,
                width: "100%",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                boxSizing: "border-box",
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
                {drill ? <BackButton w={w} b={b} /> : null}
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
                  <div
                    data-testid="subtitle"
                    style={{ fontSize: 14.5, color: C.textMut, marginTop: 4 }}
                  >
                    {subtitle ? `${subtitle} · ` : ""}
                    {frame.window.label},{" "}
                    {rangeText(frame.window.start, frame.window.end)}
                    {brandFilter ? ` · ${frame.brand.label}` : ""}
                  </div>
                </div>
              </div>
              {children}
              <footer
                data-testid="footer"
                style={{
                  fontSize: 12.5,
                  color: C.textDim,
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 12,
                  lineHeight: 1.6,
                }}
              >
                {frame.scopeNote} Every action is a recommendation routed to its
                owner; LisN does not execute, authorise or decide. Public
                figures from NatWest Group and regulator disclosures as dated in
                the research pack; internal figures illustrative until
                discovery. Data frozen{" "}
                <span data-testid="freeze">{frame.freezeLabel}</span>.
              </footer>
            </main>
          </div>
        </div>
        <AskBar
          qa={ask.qa}
          fallback={ask.fallback}
          context={`${frame.window.label} · ${frame.brand.label}`}
          open={askOpen}
          setOpen={setAskOpen}
        />
        <style>{`
          .lisn-sidebar { display: flex; }
          .lisn-phone-nav { display: none; }
          @media (max-width: 720px) {
            .lisn-sidebar { display: none; }
            .lisn-phone-nav { display: flex; }
            .lisn-header { position: static !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
