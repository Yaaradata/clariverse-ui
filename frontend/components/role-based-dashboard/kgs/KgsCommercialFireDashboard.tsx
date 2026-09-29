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
import { fmt } from "@kgs/lib/label";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type KgsNav, KgsNavContext, type KgsView, parseLink } from "./nav";
import { K } from "./shared/tokens";
import { ContextBar } from "./shell/ContextBar";
import { DemoMenu } from "./shell/DemoMenu";
import { DemoProvider, useDemo, useLabel } from "./shell/DemoProvider";
import { DrillHeader } from "./shell/DrillHeader";
import { FixedFooter } from "./shell/FixedFooter";
import { FloatingAIButton } from "./shell/FloatingAIButton";
import { LeftRail } from "./shell/LeftRail";
import { ToastProvider, useToast } from "./shell/Toast";
import { Watermark } from "./shell/Watermark";
import { OverviewView } from "./views/OverviewView";

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
      <ToastProvider>
        <KgsDashboardInner onExit={onExit} />
      </ToastProvider>
    </DemoProvider>
  );
}

/** DrillHeader title per view (04 §1.3). */
const VIEW_TITLE: Record<KgsView, string> = {
  "/": meta.title,
  "/installed-base": installedBase.title,
  "/installed-base/signal/fw-4-1": signalFw41.signal.headerTitle,
  "/channel": channel.title,
  "/separation": separation.title,
};

/** Focus ring, anchor scroll margin, reduced motion (03 §4, 06 §2). Scoped to the root. */
const GLOBAL_CSS = `
.kgs-root .kgs-focus:focus-visible { outline: none; box-shadow: ${K.focus}; }
.kgs-root [id] { scroll-margin-top: 72px; }
@keyframes kgs-drawer { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes kgs-pop { from { opacity: 0; transform: scale(.98); } to { opacity: 1; transform: scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .kgs-root *, .kgs-root *::before, .kgs-root *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; }
}
`;

function KgsDashboardInner({ onExit }: { onExit: () => void }) {
  const { state, setAnonymise, reset } = useDemo();
  const { show } = useToast();
  const [view, setView] = useState<KgsView>("/");
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ?anon=1 read once after mount (never during render → no hydration mismatch).
  const urlApplied = useRef(false);
  useEffect(() => {
    if (urlApplied.current) return;
    urlApplied.current = true;
    if (anonFromUrl()) setAnonymise(true);
    if (process.env.NODE_ENV !== "production") runKgsChecks();
  }, [setAnonymise]);

  // document.title through fmt (04 §7.1); restored when leaving the dashboard.
  useEffect(() => {
    const prev = document.title;
    return () => {
      document.title = prev;
    };
  }, []);
  useEffect(() => {
    document.title = fmt(meta.title, state.anonymise);
  }, [state.anonymise]);

  // Print forces anonymise ON with the watermark, then restores (04 §7.1).
  const anonRef = useRef(state.anonymise);
  anonRef.current = state.anonymise;
  const setAnonRef = useRef(setAnonymise);
  setAnonRef.current = setAnonymise;
  useEffect(() => {
    let before: boolean | null = null;
    const onBefore = () => {
      before = anonRef.current;
      setAnonRef.current(true);
    };
    const onAfter = () => {
      if (before !== null) setAnonRef.current(before);
      before = null;
    };
    window.addEventListener("beforeprint", onBefore);
    window.addEventListener("afterprint", onAfter);
    return () => {
      window.removeEventListener("beforeprint", onBefore);
      window.removeEventListener("afterprint", onAfter);
    };
  }, []);

  const scrollTo = useCallback((anchor: string) => {
    document
      .getElementById(anchor)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const go = useCallback((linkTo: string) => {
    const { view: next, anchor } = parseLink(linkTo);
    setView(next);
    setPendingAnchor(anchor ?? "__top__");
  }, []);

  // After a view switch, scroll to the requested anchor, or to the top.
  useEffect(() => {
    if (!pendingAnchor) return;
    const id = pendingAnchor;
    requestAnimationFrame(() => {
      if (id === "__top__") scrollRef.current?.scrollTo({ top: 0 });
      else document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
    setPendingAnchor(null);
  }, [pendingAnchor]);

  const onReset = useCallback(() => {
    reset();
    setMenuOpen(false);
    go("/");
    show(meta.demo.resetToast);
  }, [reset, go, show]);

  const nav = useMemo<KgsNav>(
    () => ({ view, go, scrollTo, exit: onExit }),
    [view, go, scrollTo, onExit],
  );

  return (
    <KgsNavContext.Provider value={nav}>
      <div
        className="kgs-root"
        style={{
          display: "flex",
          height: "100vh",
          background: K.bg,
          color: K.text,
          fontFamily: K.font,
          overflow: "hidden",
        }}
      >
        <style>{GLOBAL_CSS}</style>
        <LeftRail onOpenDemoMenu={() => setMenuOpen((o) => !o)} />
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            minWidth: 0,
            height: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DrillHeader view={view} title={VIEW_TITLE[view]} />
          <ContextBar />
          <main style={{ flex: 1, padding: "16px 24px 24px", minWidth: 0 }}>
            {view === "/" ? <OverviewView /> : <PendingView view={view} />}
          </main>
          <FixedFooter />
        </div>
        <FloatingAIButton />
        <DemoMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onReset={onReset}
        />
        <Watermark />
      </div>
    </KgsNavContext.Provider>
  );
}

/** Drill-downs and the hero are built in Pass 4 / 5; until then show the page subtitle. */
function PendingView({ view }: { view: KgsView }) {
  const L = useLabel();
  const sub =
    view === "/installed-base"
      ? installedBase.subtitle
      : view === "/channel"
        ? channel.subtitle
        : view === "/separation"
          ? separation.subtitle
          : signalFw41.signal.subline;
  return <p style={{ color: K.textMut, fontSize: 15 }}>{L(sub)}</p>;
}
