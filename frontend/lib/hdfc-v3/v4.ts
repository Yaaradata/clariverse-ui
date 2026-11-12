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
/** P1 teaser: SDR, FTR and FTNR (scripts/hdfc_v3/v4_blocks.py service_metrics). Illustrative definitions. */
export type Service = {
  volume: number;
  resolved: number;
  sdr: number;
  sdr_pct: number | null;
  ftr: number;
  ftr_pct: number | null;
  ftnr: number;
  ftnr_pct: number | null;
  tag: string;
};

export type V4Period = {
  cards?: {
    hierarchy: Hierarchy;
    open_too_long: OpenTooLong;
    priority_slice: SliceBlock[];
    to_close: CloseRow[];
    social: Social;
    top_complaints: TopComplaint[];
    service: Service;
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
        service: Service;
      }[];
    };
    social: Social;
    service: Service;
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

/* ---------------------------------------------------------------- team roles (P1: hierarchy upload) */

const ROLES_KEY = "lisn-v4-team-roles";
const ROLES_EVENT = "lisn-v4-team-roles";
export type TeamRole = { role: string; team: string; reports_to: string };

/** A cell that looks like a person (an email, a phone number) is refused: Assign uses roles, never names. */
const PERSONAL = /@|\d{6,}|\+\d/;

/** Parse a team-roles CSV: a header row with a "role" column, optional "team" and "reports_to". */
export function parseTeamCsv(text: string): {
  roles: TeamRole[];
  refused: number;
  error?: string;
} {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length)
    return { roles: [], refused: 0, error: "The file is empty." };
  const split = (l: string) =>
    l.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
  const head = split(lines[0]).map((h) => h.toLowerCase());
  const ri = head.indexOf("role");
  if (ri < 0)
    return {
      roles: [],
      refused: 0,
      error: 'The first row needs a "role" column.',
    };
  const ti = head.indexOf("team");
  const pi = head.indexOf("reports_to");
  let refused = 0;
  const seen = new Set<string>();
  const roles: TeamRole[] = [];
  for (const l of lines.slice(1)) {
    const c = split(l);
    const role = c[ri] ?? "";
    if (!role) continue;
    if (c.some((x) => PERSONAL.test(x))) {
      refused++;
      continue;
    }
    if (seen.has(role)) continue;
    seen.add(role);
    roles.push({
      role,
      team: ti >= 0 ? (c[ti] ?? "") : "",
      reports_to: pi >= 0 ? (c[pi] ?? "") : "",
    });
  }
  return { roles, refused };
}

export function useTeamRoles(defaults: string[]) {
  const [loaded, setLoaded] = useState<TeamRole[] | null>(null);
  useEffect(() => {
    const sync = () => {
      try {
        const v = localStorage.getItem(ROLES_KEY);
        setLoaded(v ? JSON.parse(v) : null);
      } catch {
        setLoaded(null);
      }
    };
    sync();
    window.addEventListener(ROLES_EVENT, sync);
    return () => window.removeEventListener(ROLES_EVENT, sync);
  }, []);
  const save = (roles: TeamRole[] | null) => {
    try {
      if (roles) localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
      else localStorage.removeItem(ROLES_KEY);
    } catch {
      // private mode
    }
    window.dispatchEvent(new Event(ROLES_EVENT));
  };
  return {
    roles: loaded?.length ? loaded.map((r) => r.role) : defaults,
    loaded,
    save,
  };
}
