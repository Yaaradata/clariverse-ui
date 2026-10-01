/**
 * v2 demo state — Regional GM India & Southeast Asia.
 * Own provider; does not touch v1 demoState.
 */

import { withTs } from "@kgs/lib/label";
import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import {
  tokensFor,
  type V2Tokens,
} from "@/components/role-based-dashboard/kgs-v2/shared/themeTokens";
import anonymise from "../data/anonymise.json";
import type {
  AnonymiseMap,
  DateRangeId,
  DemoStateV2,
  LoopStatus,
  PeriodId,
  Role,
  TokenKind,
  V2ThemeMode,
  V2View,
} from "../types";
import { overviewForPeriod } from "./overviewFromPeriod";
import { seriesForRange } from "./periodData";

const MAP = anonymise as AnonymiseMap;
const TOKEN = /\{\{(brand|platform|fw|partner|region|place|term):([^{}]+)\}\}/g;
const warned = new Set<string>();

/** Live click time in IST — capture once per approval. */
export function fmtDemoTimeIst(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = get("day");
  const month = get("month");
  const hour = get("hour");
  const minute = get("minute");
  return `${day} ${month} ${hour}:${minute} IST`;
}

export function label2(kind: TokenKind, key: string, anon: boolean): string {
  const entry = MAP[kind]?.[key];
  if (!entry) {
    const id = `${kind}:${key}`;
    if (!warned.has(id)) {
      warned.add(id);
      console.warn(`[fmt2] unknown token {{${id}}}`);
    }
    return key;
  }
  return anon ? entry.anon : entry.named;
}

/** Resolve {{kind:key}} tokens using the v2 anonymise map. */
export function fmt2(str: string, anon: boolean): string {
  return str.replace(TOKEN, (_m, kind: TokenKind, key: string) =>
    label2(kind, key, anon),
  );
}

export { withTs };

type Action =
  | { type: "setRole"; role: Role }
  | { type: "setAnonymise"; on: boolean }
  | { type: "setView"; view: V2View }
  | { type: "openRecurringTheme"; id: string }
  | { type: "setPeriod"; period: PeriodId }
  | { type: "setTheme"; theme: V2ThemeMode }
  | { type: "toggleTheme" }
  | { type: "approve"; signalId: string; ts: string }
  | { type: "askForDecision"; signalId: string; ts: string }
  | { type: "setLoop"; signalId: string; loop: LoopStatus }
  | { type: "reset" };

function initialState(): DemoStateV2 {
  return {
    role: "Regional GM",
    roleChanged: false,
    anonymise: false,
    approvals: {},
    decisionRequested: {},
    loop: {},
    view: "overview",
    period: "7d",
    theme: "dark",
    recurringThemeId: "rc-01",
  };
}

function reducer(state: DemoStateV2, action: Action): DemoStateV2 {
  switch (action.type) {
    case "setRole":
      return {
        ...state,
        role: action.role,
        roleChanged: action.role !== state.role ? true : state.roleChanged,
      };
    case "setAnonymise":
      return { ...state, anonymise: action.on };
    case "setView":
      return { ...state, view: action.view };
    case "openRecurringTheme":
      return { ...state, view: "recurringTheme", recurringThemeId: action.id };
    case "setPeriod":
      return { ...state, period: action.period };
    case "setTheme":
      return { ...state, theme: action.theme };
    case "toggleTheme":
      return {
        ...state,
        theme: state.theme === "dark" ? "light" : "dark",
      };
    case "approve":
      if (state.approvals[action.signalId]) return state;
      return {
        ...state,
        approvals: {
          ...state.approvals,
          [action.signalId]: { ts: action.ts },
        },
        loop: {
          ...state.loop,
          [action.signalId]: {
            step: "watching",
            nextCheck: state.loop[action.signalId]?.nextCheck ?? "2026-10-02",
            approvedAt: action.ts,
            approvedBy: state.role,
          },
        },
      };
    case "askForDecision":
      if (state.decisionRequested[action.signalId]) return state;
      return {
        ...state,
        decisionRequested: {
          ...state.decisionRequested,
          [action.signalId]: { ts: action.ts },
        },
      };
    case "setLoop":
      return {
        ...state,
        loop: { ...state.loop, [action.signalId]: action.loop },
      };
    case "reset":
      return initialState();
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

/** View state: period is canonical; dateRange mirrors it for drill pages. */
export type DemoStateView = DemoStateV2 & { dateRange: PeriodId };

export interface DemoApi2 {
  state: DemoStateView;
  setRole: (role: Role) => void;
  setAnonymise: (on: boolean) => void;
  toggleAnonymise: () => void;
  setView: (view: V2View) => void;
  /** Open the theme deep dive for one recurring theme (rc-01, rc-03, rc-05). */
  openRecurringTheme: (id: string) => void;
  setPeriod: (period: PeriodId) => void;
  /** Alias for setPeriod — drills still call setDateRange. */
  setDateRange: (dateRange: DateRangeId) => void;
  setTheme: (theme: V2ThemeMode) => void;
  toggleTheme: () => void;
  /** Captures IST time once; returns stored ts if already approved. */
  approve: (signalId: string) => string;
  askForDecision: (signalId: string) => string;
  setLoop: (signalId: string, loop: LoopStatus) => void;
  reset: () => void;
  isApproved: (signalId: string) => boolean;
}

const DemoContext2 = createContext<DemoApi2 | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const setRole = useCallback(
    (role: Role) => dispatch({ type: "setRole", role }),
    [],
  );
  const setAnonymise = useCallback(
    (on: boolean) => dispatch({ type: "setAnonymise", on }),
    [],
  );
  const toggleAnonymise = useCallback(
    () => dispatch({ type: "setAnonymise", on: !state.anonymise }),
    [state.anonymise],
  );
  const setView = useCallback(
    (view: V2View) => dispatch({ type: "setView", view }),
    [],
  );
  const openRecurringTheme = useCallback(
    (id: string) => dispatch({ type: "openRecurringTheme", id }),
    [],
  );
  const setPeriod = useCallback(
    (period: PeriodId) => dispatch({ type: "setPeriod", period }),
    [],
  );
  const setDateRange = useCallback(
    (dateRange: DateRangeId) =>
      dispatch({ type: "setPeriod", period: dateRange }),
    [],
  );
  const setTheme = useCallback(
    (theme: V2ThemeMode) => dispatch({ type: "setTheme", theme }),
    [],
  );
  const toggleTheme = useCallback(() => dispatch({ type: "toggleTheme" }), []);
  const approve = useCallback(
    (signalId: string) => {
      const existing = state.approvals[signalId]?.ts;
      if (existing) return existing;
      const ts = fmtDemoTimeIst(new Date());
      dispatch({ type: "approve", signalId, ts });
      return ts;
    },
    [state.approvals],
  );
  const askForDecision = useCallback(
    (signalId: string) => {
      const existing = state.decisionRequested[signalId]?.ts;
      if (existing) return existing;
      const ts = fmtDemoTimeIst(new Date());
      dispatch({ type: "askForDecision", signalId, ts });
      return ts;
    },
    [state.decisionRequested],
  );
  const setLoop = useCallback(
    (signalId: string, loop: LoopStatus) =>
      dispatch({ type: "setLoop", signalId, loop }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const isApproved = useCallback(
    (signalId: string) => Boolean(state.approvals[signalId]),
    [state.approvals],
  );

  const api = useMemo<DemoApi2>(
    () => ({
      state: { ...state, dateRange: state.period },
      setRole,
      setAnonymise,
      toggleAnonymise,
      setView,
      openRecurringTheme,
      setPeriod,
      setDateRange,
      setTheme,
      toggleTheme,
      approve,
      askForDecision,
      setLoop,
      reset,
      isApproved,
    }),
    [
      state,
      setRole,
      setAnonymise,
      toggleAnonymise,
      setView,
      openRecurringTheme,
      setPeriod,
      setDateRange,
      setTheme,
      toggleTheme,
      approve,
      askForDecision,
      setLoop,
      reset,
      isApproved,
    ],
  );

  return createElement(DemoContext2.Provider, { value: api }, children);
}

export function useDemo2(): DemoApi2 {
  const ctx = useContext(DemoContext2);
  if (!ctx)
    throw new Error("useDemo2 must be used inside DemoProvider (kgs-v2)");
  return ctx;
}

/** t(str) resolves {{tokens}} with the current v2 anonymise flag. */
export function useLabel2(): (str: string) => string {
  const { state } = useDemo2();
  return useCallback(
    (str: string) => fmt2(str, state.anonymise),
    [state.anonymise],
  );
}

/** Active dark/light surface + accent tokens for kgs-v2 only. */
export function useV2K(): V2Tokens {
  const { state } = useDemo2();
  return useMemo(() => tokensFor(state.theme), [state.theme]);
}

/** Overview JSON-shaped snapshot for the active period. */
export function useOverviewData() {
  const { state } = useDemo2();
  return useMemo(() => {
    const data = overviewForPeriod(state.period);
    return {
      data,
      period: state.period,
      signalsTitle: data.signalsTitle,
    };
  }, [state.period]);
}

/** Remap a weekly numeric series to the active date window (drills). */
export function usePeriodSeries(values: number[]): number[] {
  const { state } = useDemo2();
  return useMemo(
    () => seriesForRange(values, state.period),
    [values, state.period],
  );
}
