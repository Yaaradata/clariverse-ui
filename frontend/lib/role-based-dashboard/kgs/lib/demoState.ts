/**
 * demoState.ts — tiny client-side store for the demo (plain React context, no library).
 *
 * Holds only runtime state (05a DemoState): who we are viewing as, whether names are
 * anonymised, which gates were approved (with the live click time) and which decisions
 * the President requested. Nothing is persisted: a page reload resets everything
 * (02 HS-9), and reset() does the same on demand.
 *
 * Written with createElement (no JSX) so it drops into a .ts file; rename to .tsx and
 * use <DemoContext.Provider> if you prefer. Mark the importing file 'use client' in the
 * Next.js App Router.
 *
 *   // app/providers.tsx
 *   'use client';
 *   import { DemoProvider } from '@kgs/lib/demoState';
 *   export default function Providers({ children }) { return <DemoProvider>{children}</DemoProvider>; }
 *
 *   // any component
 *   const { state, approve } = useDemo();
 *   const t = useLabel();                       // t(str) renders {{tokens}} for the current mode
 *   const ts = approve('fw-4-1');               // capture once; reuse for gate, audit entry and toast
 *   toast(t(withTs(gate.onApprove!.toast.body, ts)));
 */
import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { DemoState, TokenKind } from "../types";
import { fmt, fmtDemoTime, label } from "./label";

export type ViewingAs = DemoState["viewingAs"]; // 'President' | 'VP Engineering'

type Action =
  | { type: "setViewingAs"; role: ViewingAs }
  | { type: "setAnonymise"; on: boolean }
  | { type: "approve"; signalId: string; ts: string }
  | { type: "requestDecision"; signalId: string; ts: string }
  | { type: "drawerOpened"; ts: string }
  | { type: "reset"; anonymise: boolean };

/** ?anon=1 forces anonymised mode on load and after reset (04 §7.1). */
export function anonFromUrl(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("anon") === "1";
}

function initialState(anonymise: boolean): DemoState {
  return {
    anonymise,
    viewingAs: "President",
    approvals: {},
    decisionRequested: {},
  };
}

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "setViewingAs":
      return { ...state, viewingAs: action.role }; // approvals survive a role switch (04 §4.9 step 10)
    case "setAnonymise":
      return { ...state, anonymise: action.on };
    case "approve":
      if (state.approvals[action.signalId]) return state; // first click wins; the timestamp never changes
      return {
        ...state,
        approvals: { ...state.approvals, [action.signalId]: { ts: action.ts } },
      };
    case "requestDecision":
      if (state.decisionRequested[action.signalId]) return state;
      return {
        ...state,
        decisionRequested: {
          ...state.decisionRequested,
          [action.signalId]: { ts: action.ts },
        },
      };
    case "drawerOpened":
      return state.drawerOpenedAt
        ? state
        : { ...state, drawerOpenedAt: action.ts };
    case "reset":
      return initialState(action.anonymise);
  }
}

export interface DemoApi {
  state: DemoState;
  setViewingAs: (role: ViewingAs) => void;
  setAnonymise: (on: boolean) => void;
  toggleAnonymise: () => void;
  /** Captures fmtDemoTime(new Date()) once and returns it. Returns the stored ts if already approved. */
  approve: (signalId: string) => string;
  /** President-only "Ask VP Engineering for a decision". Returns the captured ts. */
  requestDecision: (signalId: string) => string;
  /** Call when the evidence drawer first opens ("President · just now" audit line). */
  drawerOpened: () => void;
  /** Clears approvals and requests, Viewing as → President, anonymise → OFF (unless ?anon=1). */
  reset: () => void;
  isApproved: (signalId: string) => boolean;
}

const DemoContext = createContext<DemoApi | null>(null);

export function DemoProvider(props: {
  children?: ReactNode;
  initialAnonymise?: boolean;
}) {
  // Repo copy: start OFF on both server and client (no hydration mismatch). The dashboard
  // applies ?anon=1 once in a useEffect via setAnonymise(anonFromUrl()).
  const startAnon = props.initialAnonymise ?? false;
  const [state, dispatch] = useReducer(reducer, initialState(startAnon));

  const approve = useCallback(
    (signalId: string) => {
      const existing = state.approvals[signalId];
      if (existing) return existing.ts;
      const ts = fmtDemoTime(new Date()); // captured once, at the click
      dispatch({ type: "approve", signalId, ts });
      return ts;
    },
    [state.approvals],
  );

  const requestDecision = useCallback(
    (signalId: string) => {
      const existing = state.decisionRequested[signalId];
      if (existing) return existing.ts;
      const ts = fmtDemoTime(new Date());
      dispatch({ type: "requestDecision", signalId, ts });
      return ts;
    },
    [state.decisionRequested],
  );

  const api = useMemo<DemoApi>(
    () => ({
      state,
      setViewingAs: (role) => dispatch({ type: "setViewingAs", role }),
      setAnonymise: (on) => dispatch({ type: "setAnonymise", on }),
      toggleAnonymise: () =>
        dispatch({ type: "setAnonymise", on: !state.anonymise }),
      approve,
      requestDecision,
      drawerOpened: () =>
        dispatch({ type: "drawerOpened", ts: fmtDemoTime(new Date()) }),
      reset: () => dispatch({ type: "reset", anonymise: anonFromUrl() }),
      isApproved: (signalId) => Boolean(state.approvals[signalId]),
    }),
    [state, approve, requestDecision],
  );

  return createElement(DemoContext.Provider, { value: api }, props.children);
}

export function useDemo(): DemoApi {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}

/**
 * useLabel() — renders tokens for the current anonymise mode.
 *   const t = useLabel();
 *   t(signal.headline)                 // whole string with tokens
 *   t.one('partner', 'ESD-SE-07')      // a single key, e.g. for a filter option
 */
export function useLabel() {
  const { state } = useDemo();
  return useMemo(() => {
    const t = (str: string) => fmt(str, state.anonymise);
    return Object.assign(t, {
      one: (kind: TokenKind, key: string) => label(kind, key, state.anonymise),
    });
  }, [state.anonymise]);
}
