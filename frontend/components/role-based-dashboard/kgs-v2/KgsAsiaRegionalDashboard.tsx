"use client";

import { DemoProvider, useDemo2, useV2K } from "@kgs2/lib/demoState";
import type { V2View } from "@kgs2/types";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { InstallView } from "./install/InstallView";
import { type Kgs2Nav, Kgs2NavContext } from "./nav";
import { OverviewView } from "./overview/OverviewView";
import { PartnerView } from "./partner/PartnerView";
import { PromiseHeroView } from "./promise/PromiseHeroView";
import { PromiseView } from "./promise/PromiseView";
import { RecurringView } from "./recurring/RecurringView";
import { ThemeView } from "./recurring/ThemeView";
import { DemoMenu } from "./shell/DemoMenu";
import { DrillHeader } from "./shell/DrillHeader";
import { LeftRail } from "./shell/LeftRail";
import { ToastProvider2 } from "./shell/Toast";

export type KgsAsiaRegionalDashboardProps = {
  onExit: () => void;
};

/**
 * LiSN × KGS v2 — Regional GM, India & Southeast Asia.
 * Views are held in v2 demoState; no new Next.js pages.
 */
export function KgsAsiaRegionalDashboard({
  onExit,
}: KgsAsiaRegionalDashboardProps) {
  return (
    <DemoProvider>
      <ToastProvider2>
        <Kgs2DashboardInner onExit={onExit} />
      </ToastProvider2>
    </DemoProvider>
  );
}

function Kgs2DashboardInner({ onExit }: { onExit: () => void }) {
  const { state, setView, reset } = useDemo2();
  const K = useV2K();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = useCallback((view: V2View) => setView(view), [setView]);

  const nav = useMemo<Kgs2Nav>(
    () => ({
      view: state.view,
      go,
      exit: onExit,
    }),
    [state.view, go, onExit],
  );

  const onReset = useCallback(() => {
    reset();
    setMenuOpen(false);
  }, [reset]);

  let body: ReactNode;
  switch (state.view) {
    case "overview":
      body = <OverviewView />;
      break;
    case "promise":
      body = <PromiseView />;
      break;
    case "promiseHero":
      body = <PromiseHeroView />;
      break;
    case "recurring":
      body = <RecurringView />;
      break;
    case "recurringTheme":
      body = <ThemeView />;
      break;
    case "install":
      body = <InstallView />;
      break;
    case "partner":
      body = <PartnerView />;
      break;
    default: {
      const _exhaustive: never = state.view;
      body = _exhaustive;
      break;
    }
  }

  return (
    <Kgs2NavContext.Provider value={nav}>
      <div
        className="kgs2-root"
        data-theme={state.theme}
        style={{
          display: "flex",
          minHeight: "100vh",
          background: K.page,
          color: K.text,
          fontFamily: K.font,
          transition: "background 160ms ease, color 160ms ease",
        }}
      >
        <style>{`
          .kgs2-root .kgs2-focus:focus-visible { outline: none; box-shadow: ${K.focus}; }
        `}</style>
        <LeftRail onOpenDemoMenu={() => setMenuOpen(true)} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            minHeight: "100vh",
          }}
        >
          <DrillHeader view={state.view} />
          <main
            style={{
              flex: 1,
              overflow: "auto",
              padding: "16px 24px 24px",
              minWidth: 0,
            }}
          >
            {body}
          </main>
        </div>
        <DemoMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onReset={onReset}
        />
      </div>
    </Kgs2NavContext.Provider>
  );
}
