/**
 * v2 demo state — Regional GM Asia ex China.
 * Own provider; does not touch v1 demoState.
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
import anonymise from "../data/anonymise.json";
import type {
  AnonymiseMap,
  DemoStateV2,
  LoopStatus,
  Role,
  TokenKind,
  V2View,
} from "../types";
import { withTs } from "@kgs/lib/label";

const MAP = anonymise as AnonymiseMap;
const TOKEN =
  /\{\{(brand|platform|fw|partner|region|place|term):([^{}]+)\}\}/g;
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
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
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
  | { type: "approve"; signalId: string; ts: string }
  | { type: "askForDecision"; signalId: string; ts: string }
  | { type: "setLoop"; signalId: string; loop: LoopStatus }
  | { type: "reset" };

function initialState(): DemoStateV2 {
  return {
    role: "Regional GM",
    anonymise: false,
    approvals: {},
    decisionRequested: {},
    loop: {},
    view: "overview",
  };
}

function reducer(state: DemoStateV2, action: Action): DemoStateV2 {
  switch (action.type) {
    case "setRole":
      return { ...state, role: action.role };
    case "setAnonymise":
      return { ...state, anonymise: action.on };
    case "setView":
      return { ...state, view: action.view };
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

export interface DemoApi2 {
  state: DemoStateV2;
  setRole: (role: Role) => void;
  setAnonymise: (on: boolean) => void;
  toggleAnonymise: () => void;
  setView: (view: V2View) => void;
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
      state,
      setRole,
      setAnonymise,
      toggleAnonymise,
      setView,
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
  if (!ctx) throw new Error("useDemo2 must be used inside DemoProvider (kgs-v2)");
  return ctx;
}

/** t(str) resolves {{tokens}} with the current v2 anonymise flag. */
export function useLabel2(): (str: string) => string {
  const { state } = useDemo2();
  return useCallback((str: string) => fmt2(str, state.anonymise), [state.anonymise]);
}
