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
import { prefersReducedMotion } from "./shared/motion";
import { K } from "./shared/tokens";
import { ContextBar } from "./shell/ContextBar";
import { DemoMenu } from "./shell/DemoMenu";
import { DemoProvider, useDemo } from "./shell/DemoProvider";
import { DrillHeader } from "./shell/DrillHeader";
import { FixedFooter } from "./shell/FixedFooter";
import { FloatingAIButton } from "./shell/FloatingAIButton";
import { LeftRail } from "./shell/LeftRail";
import { ToastProvider, useToast } from "./shell/Toast";
import { Watermark } from "./shell/Watermark";
import { ChannelView } from "./views/ChannelView";
import { InstalledBaseView } from "./views/InstalledBaseView";
import { OverviewView } from "./views/OverviewView";
import { SeparationView } from "./views/SeparationView";
import { SignalFw41View } from "./views/SignalFw41View";

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

const EXIT_MS = 150;

/**
 * Focus ring, anchor scroll margin and motion (03 §4, 04 §6, 06 §2). Scoped to the root.
 * Reduced motion keeps opacity only: transforms are swapped for fades or dropped.
 */
const GLOBAL_CSS = `
.kgs-root .kgs-focus:focus-visible { outline: none; box-shadow: ${K.focus}; }
.kgs-root [id] { scroll-margin-top: 72px; }
@keyframes kgs-drawer { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes kgs-drawer-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
@keyframes kgs-pop { from { opacity: 0; transform: scale(.98); } to { opacity: 1; transform: scale(1); } }
@keyframes kgs-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes kgs-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes kgs-enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes kgs-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.kgs-root .kgs-enter { animation: kgs-enter 220ms cubic-bezier(.2, .8, .2, 1) both; }
.kgs-root .kgs-exit { animation: kgs-out ${EXIT_MS}ms ease-in both; }
.kgs-root .kgs-lift { transition: transform 150ms ease-out, border-color 150ms ease-out, box-shadow 150ms ease-out; }
.kgs-root .kgs-lift:hover { transform: translateY(-2px); border-color: var(--kgs-accent) !important; box-shadow: var(--kgs-glow) !important; }
.kgs-root .kgs-grow { transform-origin: left center; animation: kgs-grow 600ms ease-out 100ms both; }
.kgs-root .kgs-pop-in { animation: kgs-pop 150ms ease-out both; }
.kgs-root .kgs-drawer-in { animation: kgs-drawer 240ms cubic-bezier(.32, .72, 0, 1) both; }
.kgs-root .kgs-drawer-out { animation: kgs-drawer-out 180ms cubic-bezier(.32, .72, 0, 1) both; }
.kgs-root .kgs-fade-in { animation: kgs-fade 240ms ease-out both; }
.kgs-root .kgs-fade-out { animation: kgs-out 180ms ease-in both; }
.kgs-root .kgs-watermark { animation: kgs-fade 200ms ease-out both; }
@keyframes kgs-ping-ring { 0% { transform: scale(1); opacity: .9; } 100% { transform: scale(3); opacity: 0; } }
.kgs-root .kgs-ping { transform-box: fill-box; transform-origin: center; opacity: 0; animation: kgs-ping-ring 1.2s ease-out 1.1s 2; }
@keyframes kgs-spin { to { transform: rotate(360deg); } }
.kgs-root .kgs-spin { animation: kgs-spin 800ms linear infinite; }
@keyframes kgs-slide { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.kgs-root .kgs-slide { animation: kgs-slide 200ms ease-out both; }
@keyframes kgs-draw { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
.kgs-root .kgs-check path { stroke-dasharray: 40; animation: kgs-draw 250ms ease-out both; }
@keyframes kgs-pulse-ring { 0%, 100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0); } 50% { box-shadow: 0 0 0 3px rgba(167, 139, 250, .7); } }
.kgs-root .kgs-pulse { animation: kgs-pulse-ring 600ms ease-in-out 2; }
.kgs-root .kgs-row:hover { background: rgba(255, 255, 255, 0.03); }
.kgs-root .kgs-wall-scroll { scrollbar-width: thin; scrollbar-color: #5b4bb7 transparent; }
@media (prefers-reduced-motion: reduce) {
  .kgs-root *, .kgs-root *::before, .kgs-root *::after { transition-property: opacity, color, background-color, border-color, box-shadow !important; }
  .kgs-root .kgs-lift:hover { transform: none; }
  .kgs-root .kgs-enter, .kgs-root .kgs-slide, .kgs-root .kgs-pop-in, .kgs-root .kgs-drawer-in, .kgs-root .kgs-grow { animation-name: kgs-fade; }
  .kgs-root .kgs-drawer-out { animation-name: kgs-out; }
  .kgs-root .kgs-ping, .kgs-root .kgs-spin, .kgs-root .kgs-pulse { animation: none; }
  .kgs-root .kgs-check path { animation: none; stroke-dashoffset: 0; }
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
    document.getElementById(anchor)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  // Route change (04 §6): the current view fades out for EXIT_MS, then the next one enters.
  const viewRef = useRef(view);
  viewRef.current = view;
  const exitTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    },
    [],
  );
  const [leaving, setLeaving] = useState(false);
  const go = useCallback((linkTo: string) => {
    const { view: next, anchor } = parseLink(linkTo);
    const land = () => {
      setLeaving(false);
      setView(next);
      setPendingAnchor(anchor ?? "__top__");
    };
    if (exitTimer.current) window.clearTimeout(exitTimer.current);
    if (next === viewRef.current) {
      land();
      return;
    }
    setLeaving(true);
    exitTimer.current = window.setTimeout(land, EXIT_MS);
  }, []);

  // Anonymise (04 §6): a 150ms crossfade on the swapped labels; the first render is skipped.
  const mainRef = useRef<HTMLElement>(null);
  const anonSeen = useRef(state.anonymise);
  useEffect(() => {
    if (anonSeen.current === state.anonymise) return;
    anonSeen.current = state.anonymise;
    mainRef.current?.animate([{ opacity: 0.35 }, { opacity: 1 }], {
      duration: 150,
      easing: "ease-out",
    });
  }, [state.anonymise]);

  // After a view switch, scroll to the requested anchor, or to the top.
  useEffect(() => {
    if (!pendingAnchor) return;
    const id = pendingAnchor;
    requestAnimationFrame(() => {
      const scroller = scrollRef.current;
      const el = id === "__top__" ? null : document.getElementById(id);
      if (!scroller) return;
      if (!el) {
        scroller.scrollTo({ top: 0 });
        return;
      }
      // The view is mid kgs-enter (translateY 8px → 0); land where the anchor will settle.
      const wrap = el.closest(".kgs-enter");
      const shift = wrap
        ? new DOMMatrix(getComputedStyle(wrap).transform).m42
        : 0;
      const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop);
      scroller.scrollTo({
        top:
          scroller.scrollTop +
          el.getBoundingClientRect().top -
          scroller.getBoundingClientRect().top -
          shift -
          (margin || 0),
      });
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
          data-kgs-scroll
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
          <main
            ref={mainRef}
            style={{ flex: 1, padding: "16px 24px 24px", minWidth: 0 }}
          >
            <div key={view} className={leaving ? "kgs-exit" : "kgs-enter"}>
              <ViewBody view={view} />
            </div>
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

function ViewBody({ view }: { view: KgsView }) {
  switch (view) {
    case "/":
      return <OverviewView />;
    case "/installed-base":
      return <InstalledBaseView />;
    case "/installed-base/signal/fw-4-1":
      return <SignalFw41View />;
    case "/channel":
      return <ChannelView />;
    case "/separation":
      return <SeparationView />;
    default: {
      const unhandled: never = view;
      return unhandled;
    }
  }
}
