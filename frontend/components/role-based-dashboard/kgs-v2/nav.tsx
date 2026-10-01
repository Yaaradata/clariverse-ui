"use client";

import type { V2View } from "@kgs2/types";
import { createContext, useContext } from "react";

export type Kgs2Nav = {
  view: V2View;
  go: (view: V2View) => void;
  exit: () => void;
};

export const Kgs2NavContext = createContext<Kgs2Nav | null>(null);

export function useKgs2Nav(): Kgs2Nav {
  const ctx = useContext(Kgs2NavContext);
  if (!ctx)
    throw new Error("useKgs2Nav must be used inside KgsAsiaRegionalDashboard");
  return ctx;
}

/** SPEC §9 — default landing when the presenter clicks "Go to my view". */
export const ROLE_LANDING: Record<string, V2View> = {
  "Regional GM": "overview",
  "Operations lead": "promise",
  "Technical support lead": "recurring",
  "Product liaison": "install",
  "Partner manager": "partner",
  "Sales ops": "overview",
  "Partner service manager": "partner",
};

export const VIEW_TITLE: Record<V2View, string> = {
  overview: "India & Southeast Asia — this week",
  promise: "Are we keeping our promises?",
  promiseHero: "North region: promises slipping",
  recurring: "What keeps coming back?",
  recurringTheme: "Licence re-activation, back a third time",
  install: "What do installers experience?",
  partner: "Partner view",
};

export const VIEW_PAGE_LABEL: Record<V2View, string> = {
  overview: "Overview",
  promise: "Promises",
  promiseHero: "Promise deep dive",
  recurring: "Recurring",
  recurringTheme: "Theme",
  install: "Install",
  partner: "Partners",
};
