"use client";

/**
 * B11 · HDFC demo V4 (Vidya's 13 Oct review): the payload types for the additions (scripts/hdfc_v3/v4_blocks.py) and
 * the phase-1 action layer. Assign, notify and the status trail live in this browser only (no integrations): nothing is
 * sent and no CRM or social tool is written. Phase 2 writes the status back to CRM and social tools.
 */

import { useCallback, useEffect, useState } from "react";

export type Split = {
  label: string;
  volume: number;
  resolved: number;
  open: number;
  waiting_on_customer: number;
  open_too_long: number;
};
export type Hierarchy = {
  total: number;
  inside: {
    volume: number;
    kinds: Record<"complaint" | "query" | "request", Split>;
    resolved: number;
    open: number;
    waiting_on_customer: number;
    open_too_long: number;
  };
  public: {
    volume: number;
    sentiments: Record<
      "positive" | "neutral" | "negative",
      { volume: number; responded: number; not_responded: number }
    >;
    responded: number;
    not_responded: number;
    responded_live_only: string;
  };
};
export type OtlRow = {
  id: string;
  product: string;
  theme: string;
  kind: string;
  channel: string;
  age: string;
  over_by: string;
  limit: string;
};
export type OpenTooLong = {
  count: number;
  open: number;
  share_of_open: number | null;
  by_limit: { id: string; label: string; count: number }[];
  list: OtlRow[];
};
export type SliceBlock = {
  id: string;
  label: string;
  volume: number;
  open: number;
  open_too_long: number;
  negative_mentions: number;
  channels: string[];
};
export type CloseRow = {
  id: string;
  theme: string;
  kind: string;
  channel: string;
  age: string;
  overdue: boolean;
  limit: string;
  suggested_owner: string;
};
export type Social = {
  matrix: Record<
    "positive" | "neutral" | "negative",
    { responded: number; not_responded: number }
  >;
  response_time: {
    basis: string;
    n: number;
    buckets: { label: string; count: number }[];
    median_hours: number | null;
  };
  unanswered_negatives: {
    count: number;
    list: {
      id: string;
      source: string;
      theme: string;
      age: string;
      reach: boolean;
    }[];
  };
  daily: { date: string; negative: number; responded: number }[];
  note: string;
};
export type TopComplaint = {
  id: string;
  theme: string;
  product: string;
  count: number;
  open: number;
  oldest_open: string;
  escalation_language: boolean;
  ombudsman_risk: number;
  ombudsman_flag: boolean;
  evidence: {
    case: string;
    received: string;
    channel: string;
    contacts: number;
    channels_touched: number;
    escalation: string;
    status: string;
    ombudsman: string;
  }[];
};
export type V4Period = {
  cards?: {
    hierarchy: Hierarchy;
    open_too_long: OpenTooLong;
    priority_slice: SliceBlock[];
    to_close: CloseRow[];
    social: Social;
    top_complaints: TopComplaint[];
  };
  bank: {
    hierarchy: Hierarchy;
    open_too_long: OpenTooLong & {
      by_business: {
        id: string;
        label: string;
        count: number;
        open: number;
        share_of_open: number | null;
        list: OtlRow[];
      }[];
    };
    social: Social;
  };
};
export type QueryList = {
  q: string;
  count: number;
  list: { id: string; theme: string; why: string }[];
};
export type V4File = {
  limits: Record<string, unknown>;
  limit_labels: Record<string, string>;
  owner_roles: string[];
  queries: Record<string, QueryList>;
};

/* ---------------------------------------------------------------- action layer (phase 1) */

export const STATUSES = ["New", "Assigned", "Acknowledged", "Closed"] as const;
export type ActionStatus = (typeof STATUSES)[number];
export type ActionState = {
  owner: string | null;
  status: ActionStatus;
  trail: { status: ActionStatus; at: string; owner?: string | null }[];
  notified: boolean;
};

const KEY = "lisn-v4-actions";
const EVENT = "lisn-v4-actions";

function read(): Record<string, ActionState> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function write(all: Record<string, ActionState>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // private mode: the change still applies on this screen
  }
  window.dispatchEvent(new Event(EVENT));
}

export const NEW_STATE: ActionState = {
  owner: null,
  status: "New",
  trail: [],
  notified: false,
};

/** The actions on every listed item, shared across screens in this browser. */
export function useActions() {
  const [all, setAll] = useState<Record<string, ActionState>>({});
  useEffect(() => {
    const sync = () => setAll(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const update = useCallback(
    (id: string, fn: (s: ActionState) => ActionState) => {
      const cur = read();
      cur[id] = fn(cur[id] ?? NEW_STATE);
      write(cur);
    },
    [],
  );
  const get = (id: string) => all[id] ?? NEW_STATE;
  return {
    get,
    assign: (id: string, owner: string) =>
      update(id, (s) => ({
        ...s,
        owner,
        status: s.status === "New" ? "Assigned" : s.status,
        trail: [
          ...s.trail,
          {
            status: s.status === "New" ? "Assigned" : s.status,
            at: new Date().toISOString(),
            owner,
          },
        ],
      })),
    setStatus: (id: string, status: ActionStatus) =>
      update(id, (s) => ({
        ...s,
        status,
        trail: [...s.trail, { status, at: new Date().toISOString() }],
      })),
    notify: (id: string) => update(id, (s) => ({ ...s, notified: true })),
    reset: () => write({}),
  };
}

/** A CSV of a list, downloaded in the browser. Nothing leaves the machine. */
export function downloadCsv(name: string, head: string[], rows: string[][]) {
  const esc = (x: string) => `"${String(x).replace(/"/g, '""')}"`;
  const body = [head, ...rows].map((r) => r.map(esc).join(",")).join("\n");
  const url = URL.createObjectURL(
    new Blob([body], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
