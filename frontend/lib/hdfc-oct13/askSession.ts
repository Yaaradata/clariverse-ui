/**
 * Ask LisN session state (30 Sep review, K5): recent questions and the answers pinned to "My view". Held in memory for
 * the browser session only; nothing is stored or sent anywhere, and a reload clears it.
 */

import { useSyncExternalStore } from "react";
import type { AskQA } from "./askAnswers";

export type Pinned = AskQA & { key: string; period: string; from: string };

type State = { recent: string[]; pinned: Pinned[] };

let state: State = { recent: [], pinned: [] };
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  for (const l of listeners) l();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const EMPTY: State = { recent: [], pinned: [] };

export function useAskSession(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY,
  );
}

export function addRecent(q: string) {
  set({
    ...state,
    recent: [q, ...state.recent.filter((x) => x !== q)].slice(0, 5),
  });
}

export function pin(a: AskQA, period: string, from: string) {
  const key = `${a.id}:${period}`;
  if (state.pinned.some((x) => x.key === key)) return;
  set({ ...state, pinned: [...state.pinned, { ...a, key, period, from }] });
}

export function unpin(key: string) {
  set({ ...state, pinned: state.pinned.filter((x) => x.key !== key) });
}
