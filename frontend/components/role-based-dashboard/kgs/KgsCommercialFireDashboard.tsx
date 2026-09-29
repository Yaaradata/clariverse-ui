"use client";

import { runKgsChecks } from "@kgs/checks";
import {
  channel,
  installedBase,
  meta,
  separation,
  signalFw41,
} from "@kgs/lib/data";
import { anonFromUrl } from "@kgs/lib/demoState";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type KgsNav,
  KgsNavContext,
  type KgsView,
  parseLink,
  useKgsNav,
} from "./nav";
import { DemoProvider, useDemo, useLabel } from "./shell/DemoProvider";

export type KgsCommercialFireDashboardProps = {
  /** Back to the role list (role-based route). */
  onExit: () => void;
};

/**
 * LiSN × KGS Global Commercial Fire — President view.
 * One component, five in-component views (BUILD_PLAN §1). Demo state lives in memory only.
 */
export function KgsCommercialFireDashboard({
  onExit,
}: KgsCommercialFireDashboardProps) {
  return (
    <DemoProvider>
      <KgsDashboardInner onExit={onExit} />
    </DemoProvider>
  );
}

function KgsDashboardInner({ onExit }: { onExit: () => void }) {
  const { setAnonymise } = useDemo();
  const [view, setView] = useState<KgsView>("/");
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  // ?anon=1 read once after mount (never during render → no hydration mismatch).
  const urlApplied = useRef(false);
  useEffect(() => {
    if (urlApplied.current) return;
    urlApplied.current = true;
    if (anonFromUrl()) setAnonymise(true);
    if (process.env.NODE_ENV !== "production") runKgsChecks();
  }, [setAnonymise]);

  const scrollTo = useCallback((anchor: string) => {
    document
      .getElementById(anchor)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const go = useCallback((linkTo: string) => {
    const { view: next, anchor } = parseLink(linkTo);
    setView(next);
    setPendingAnchor(anchor ?? null);
  }, []);

  // After a view switch, scroll to the requested anchor, or to the top.
  useEffect(() => {
    if (pendingAnchor) {
      const id = pendingAnchor;
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ block: "start" }),
      );
      setPendingAnchor(null);
    }
  }, [pendingAnchor]);

  const nav = useMemo<KgsNav>(
    () => ({ view, go, scrollTo, exit: onExit }),
    [view, go, scrollTo, onExit],
  );

  return (
    <KgsNavContext.Provider value={nav}>
      <ViewPlaceholder view={view} />
    </KgsNavContext.Provider>
  );
}

/** Step 2 skeleton: each view shows its H1 from JSON through useLabel. */
function ViewPlaceholder({ view }: { view: KgsView }) {
  const L = useLabel();
  const { go } = useKgsNav();
  const title =
    view === "/"
      ? meta.title
      : view === "/installed-base"
        ? installedBase.title
        : view === "/installed-base/signal/fw-4-1"
          ? signalFw41.signal.headline
          : view === "/channel"
            ? channel.title
            : separation.title;
  const links: string[] = [
    "/",
    "/installed-base",
    "/signals/A1",
    "/channel",
    "/separation",
  ];
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#010101",
        color: "#e8e9e9",
        padding: 32,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 16px" }}>
        {L(title)}
      </h1>
      <nav style={{ display: "flex", gap: 12 }}>
        {links.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => go(l)}
            style={{ fontSize: 14 }}
          >
            {l}
          </button>
        ))}
      </nav>
    </div>
  );
}
