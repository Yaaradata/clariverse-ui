"use client";

import { createContext, useContext } from "react";

/**
 * In-component views replacing the pack's routes (BUILD_PLAN §1, D2). Keys are the
 * pack's route strings so mock `linkTo` / `breadcrumbs` values resolve unchanged.
 */
export type KgsView =
  | "/"
  | "/installed-base"
  | "/installed-base/signal/fw-4-1"
  | "/channel"
  | "/separation";

export const KGS_VIEWS: readonly KgsView[] = [
  "/",
  "/installed-base",
  "/installed-base/signal/fw-4-1",
  "/channel",
  "/separation",
];

/** Legacy alias (02 HS-1): /signals/A1 opens the hero. */
const ALIASES: Record<string, KgsView> = {
  "/signals/A1": "/installed-base/signal/fw-4-1",
};

/** "/installed-base#date-code" → { view: "/installed-base", anchor: "date-code" }. Unknown targets fall back to "/". */
export function parseLink(linkTo: string): { view: KgsView; anchor?: string } {
  const [path, anchor] = linkTo.split("#");
  const aliased = ALIASES[path] ?? path;
  const view = (KGS_VIEWS as readonly string[]).includes(aliased)
    ? (aliased as KgsView)
    : "/";
  return { view, anchor: anchor || undefined };
}

export type KgsNav = {
  view: KgsView;
  /** Go to a view (and optional anchor id) by pack route string, e.g. monitor card `linkTo`. */
  go: (linkTo: string) => void;
  /** Scroll to an anchor on the current view. */
  scrollTo: (anchor: string) => void;
  /** Leave the dashboard (back to the role list). */
  exit: () => void;
};

export const KgsNavContext = createContext<KgsNav | null>(null);

export function useKgsNav(): KgsNav {
  const ctx = useContext(KgsNavContext);
  if (!ctx)
    throw new Error("useKgsNav must be used inside KgsCommercialFireDashboard");
  return ctx;
}
