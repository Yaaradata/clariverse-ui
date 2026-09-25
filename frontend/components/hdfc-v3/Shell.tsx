"use client";

import {
  Activity,
  ArrowLeft,
  Headphones,
  MessageSquareText,
  Shield,
  Target,
  Timer,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, Suspense, useState } from "react";

import type { AskFile, Evidence, Meta, View } from "@/lib/hdfc-v3/types";
import { AskLisN } from "./AskLisN";
import { C } from "./primitives";

export type ShellProps = {
  meta: Meta;
  ask: AskFile;
  askEvidence: Record<
    string,
    Pick<Evidence, "id" | "summary" | "source_label" | "created_at" | "themes">
  >;
  title: string;
  subtitle?: string;
  view?: View;
  drill?: boolean;
  children: ReactNode;
};

const VIEW_LABEL: Record<View, string> = {
  "mds-office": "MD's office",
  "head-cx": "Head of CX",
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
      href: "/hdfc-v3/mds-office",
      label: "MD's office",
      icon: Activity,
      exec: true,
    },
    { href: "/hdfc-v3/head-cx", label: "Head of CX", icon: Users, exec: true },
    {
      href: withFrom("/hdfc-v3/satisfaction", view),
      label: "Are customers satisfied with their journey?",
      icon: Target,
    },
    {
      href: withFrom("/hdfc-v3/market", view),
      label: "What is the market saying about us?",
      icon: Shield,
    },
    {
      href: withFrom("/hdfc-v3/service-promise", view),
      label: "Are we keeping our service promise?",
      icon: Timer,
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
              color={active ? "#b7a6ff" : C.textMut}
              style={{ flexShrink: 0 }}
            />
            {collapsed ? null : <span>{it.label}</span>}
          </Link>
        );
      })}
    </nav>
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
        else router.push(`/hdfc-v3/${from}`);
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
  askEvidence,
  title,
  subtitle,
  view,
  drill,
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
                border: `1px solid ${C.brand}55`,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Headphones size={17} color="#b7a6ff" />
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
              <MessageSquareText size={16} color="#b7a6ff" />
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
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "rgba(11,11,12,0.94)",
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
              <strong style={{ color: C.text }}>HDFC Bank</strong> · Customer
              Pulse · {meta.brief_label}, {meta.brief_time}
            </div>
            <fieldset
              aria-label="View"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                border: "none",
                margin: 0,
                padding: 0,
              }}
            >
              <span style={{ color: C.textMut }}>View:</span>
              {(["mds-office", "head-cx"] as View[]).map((v) => {
                const on = current === v;
                return (
                  <Link
                    key={v}
                    href={`/hdfc-v3/${v}`}
                    aria-current={on && !drill ? "page" : undefined}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      textDecoration: "none",
                      color: on ? C.text : C.textSec,
                      background: on ? C.brandSoft : "transparent",
                      border: `1px solid ${on ? `${C.brand}66` : C.border}`,
                      fontWeight: on ? 700 : 500,
                    }}
                  >
                    {VIEW_LABEL[v]}
                  </Link>
                );
              })}
            </fieldset>
            <button
              type="button"
              onClick={() => setAskOpen(true)}
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
              <MessageSquareText size={14} color="#b7a6ff" /> Ask LisN
            </button>
          </header>

          <main
            style={{
              padding: "18px 20px 48px",
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
              {meta.scope_note} Window {meta.window.start} to {meta.window.end}.
              Every action is a recommendation routed to its owner; LisN does
              not execute, authorise or decide. Runs inside the bank, on the
              bank&apos;s approved models, complementary to GenBI.
            </footer>
          </main>
        </div>
      </div>
      <AskLisN
        open={askOpen}
        onClose={() => setAskOpen(false)}
        ask={ask}
        evidence={askEvidence}
        from={current}
      />
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
    <Suspense
      fallback={<div style={{ minHeight: "100vh", background: C.bg }} />}
    >
      <ShellInner {...props} />
    </Suspense>
  );
}
