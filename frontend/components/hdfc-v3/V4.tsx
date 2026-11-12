"use client";

/**
 * B11 · HDFC demo V4 (Vidya's 13 Oct review): additions to the validated screens, never a redesign of them.
 *   1 the interaction hierarchy with a "how to read this" strip; every derived figure names its denominator
 *   2 open too long, by segment and timeline, with its list
 *   3 the priority-customer slice for a business
 *   4 the action layer (assign · notify · export · status trail) and today's 15 to close
 *   5 social response oversight; 6 the top 15 complaints with evidence
 * Figures come from periods.json (scripts/hdfc_v3/v4_blocks.py). Actions stay in this browser (phase 1).
 */

import { ChevronDown, ChevronRight, Download, Info, Mail } from "lucide-react";
import { type ReactNode, useState } from "react";

import { fmt, fmtPct } from "@/lib/hdfc-v3/format";
import {
  type ActionStatus,
  type CloseRow,
  downloadCsv,
  type Hierarchy,
  type OpenTooLong,
  parseTeamCsv,
  type Service,
  type SliceBlock,
  type Social,
  STATUSES,
  type TopComplaint,
  useActions,
  useTeamRoles,
} from "@/lib/hdfc-v3/v4";
import { C, cols, MONO, MutedNote, Tile, tint } from "./primitives";

const pct = (a: number, b: number) => (b ? (100 * a) / b : null);
const ofN = (a: number, b: number, what: string) =>
  `${fmtPct(pct(a, b))} of ${fmt(b)} ${what}`;

/* ---------------------------------------------------------------- small parts */

export function InfoTip({ text }: { text: string }) {
  return (
    <span
      role="img"
      aria-label={text}
      title={text}
      style={{
        display: "inline-flex",
        color: C.textMut,
        cursor: "help",
        verticalAlign: "middle",
      }}
    >
      <Info size={13} />
    </span>
  );
}

const box = {
  background: C.cardAlt,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "12px 14px",
  minWidth: 0,
} as const;

/** One figure with its denominator under it. */
function Fig({
  label,
  value,
  of,
  tone,
  def,
}: {
  label: string;
  value: number;
  of?: string;
  tone?: string;
  def: string;
}) {
  return (
    <div data-testid="v4-fig" style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 12,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        {label} <InfoTip text={def} />
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 22,
          fontWeight: 800,
          color: tone ?? C.text,
        }}
      >
        {fmt(value)}
      </div>
      {of ? <div style={{ fontSize: 12.5, color: C.textSec }}>{of}</div> : null}
    </div>
  );
}

const Arrow = () => (
  <span style={{ color: C.textMut, fontSize: 18, alignSelf: "center" }}>→</span>
);

/* ---------------------------------------------------------------- 1 · hierarchy */

export const DEFS = {
  total:
    "Total customer interactions: every contact on the bank's own channels plus every public post or review about it, in the period.",
  inside:
    "Inside the bank: contacts on the bank's own channels (calls, email, chat, WhatsApp, social inbox, branch). Internal · illustrative.",
  public:
    "Public: posts and reviews about the bank on app stores, X, Reddit and forums. Public · live.",
  complaint:
    "Complaint: the customer reports something went wrong and wants it put right (including disputes, refunds and reversals).",
  query: "Query: the customer asks for information; nothing needs fixing.",
  request:
    "Request: the customer asks the bank to do something (a service request, closure, upgrade, dispatch).",
  resolved: "Resolved: closed by the period end.",
  open: "Open: still with the bank at the period end (not waiting on the customer).",
  waiting:
    "Waiting on customer: the bank has sent a resolution and is waiting for the customer.",
  otl: "Open too long: open past its limit. 5 hours for Ultra-sensitive customers, 24 hours for Ultra-HNI, the RBI timeline where one applies, else 48 hours (bank TAT to confirm in discovery).",
  responded:
    "Responded: the bank's handle or the store developer replied. Play Store replies are collected; on other sources replies are simulated.",
};

export function InteractionHierarchy({
  h,
  title,
}: {
  h: Hierarchy;
  title: ReactNode;
}) {
  const i = h.inside;
  const pu = h.public;
  const kinds = (["complaint", "query", "request"] as const).map((k) => ({
    k,
    ...i.kinds[k],
  }));
  const cell = { padding: "6px 8px", textAlign: "right" as const };
  return (
    <Tile
      id="hierarchy"
      title={title}
      sub="One hierarchy, left to right: total interactions, then inside the bank and public."
      prov={["internal", "public"]}
      tone="violet"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(150px, 0.6fr) auto minmax(0, 2fr)",
          gap: 12,
          alignItems: "stretch",
        }}
        className="v4-hier"
      >
        <div style={box}>
          <Fig
            label="Total customer interactions"
            value={h.total}
            of={`${fmt(i.volume)} inside + ${fmt(pu.volume)} public`}
            def={DEFS.total}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 14,
            }}
          >
            {[
              ...kinds.map((x) => ({
                label: x.label,
                n: x.volume,
                tone: C.violet,
              })),
              { label: "Public", n: pu.volume, tone: C.cyan },
            ].map((x) => (
              <div key={x.label} style={{ fontSize: 12.5, color: C.textSec }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{x.label}</span>
                  <span style={{ fontFamily: MONO }}>
                    {fmtPct(pct(x.n, h.total))}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: C.border,
                    marginTop: 3,
                  }}
                >
                  <div
                    style={{
                      height: 6,
                      borderRadius: 3,
                      background: x.tone,
                      width: `${Math.max(1, pct(x.n, h.total) ?? 0)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            <span style={{ fontSize: 11.5, color: C.textMut }}>
              Shares of {fmt(h.total)} interactions.
            </span>
          </div>
        </div>
        <Arrow />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={box}>
            <Fig
              label="Inside the bank"
              value={i.volume}
              of={ofN(i.volume, h.total, "interactions")}
              def={DEFS.inside}
            />
            <div style={{ overflowX: "auto", marginTop: 8 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ color: C.textMut, fontSize: 12 }}>
                    <th style={{ ...cell, textAlign: "left" }}>Type</th>
                    <th style={cell}>
                      Received <InfoTip text={DEFS.inside} />
                    </th>
                    <th style={cell}>
                      Resolved <InfoTip text={DEFS.resolved} />
                    </th>
                    <th style={cell}>
                      Open <InfoTip text={DEFS.open} />
                    </th>
                    <th style={cell}>
                      Open too long <InfoTip text={DEFS.otl} />
                    </th>
                    <th style={cell}>
                      Waiting on customer <InfoTip text={DEFS.waiting} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {kinds.map((x) => (
                    <tr
                      key={x.k}
                      data-testid="v4-kind"
                      style={{ borderTop: `1px solid ${C.border}` }}
                    >
                      <td style={{ ...cell, textAlign: "left" }}>
                        <strong>{x.label}</strong> <InfoTip text={DEFS[x.k]} />
                      </td>
                      <td style={cell}>
                        <span style={{ fontFamily: MONO }}>
                          {fmt(x.volume)}
                        </span>
                        <div style={{ fontSize: 11.5, color: C.textMut }}>
                          {fmtPct(pct(x.volume, i.volume))} of {fmt(i.volume)}
                        </div>
                      </td>
                      {(
                        [
                          ["resolved", C.green],
                          ["open", C.amber],
                          ["open_too_long", C.red],
                          ["waiting_on_customer", C.cyan],
                        ] as const
                      ).map(([key, tone]) => (
                        <td key={key} style={cell}>
                          <span style={{ fontFamily: MONO, color: tone }}>
                            {fmt(x[key])}
                          </span>
                          <div style={{ fontSize: 11.5, color: C.textMut }}>
                            {key === "open_too_long"
                              ? `${fmtPct(pct(x[key], x.open))} of ${fmt(x.open)} open`
                              : `${fmtPct(pct(x[key], x.volume))} of ${fmt(x.volume)}`}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={box}>
            <Fig
              label="Public"
              value={pu.volume}
              of={ofN(pu.volume, h.total, "interactions")}
              def={DEFS.public}
            />
            <div style={{ ...cols(3, 150, 10), marginTop: 8 }}>
              {(["positive", "neutral", "negative"] as const).map((s) => {
                const x = pu.sentiments[s];
                const tone =
                  s === "positive"
                    ? C.green
                    : s === "negative"
                      ? C.red
                      : C.textSec;
                return (
                  <div
                    key={s}
                    data-testid="v4-sentiment"
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: "8px 10px",
                    }}
                  >
                    <div style={{ fontSize: 13, color: tone, fontWeight: 700 }}>
                      {s[0].toUpperCase() + s.slice(1)}{" "}
                      <span style={{ fontFamily: MONO }}>{fmt(x.volume)}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: C.textMut }}>
                      {fmtPct(pct(x.volume, pu.volume))} of {fmt(pu.volume)}{" "}
                      public
                    </div>
                    <div style={{ fontSize: 12.5, color: C.textSec }}>
                      Responded {fmt(x.responded)} · not {fmt(x.not_responded)}{" "}
                      <InfoTip text={DEFS.responded} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 720px) { .v4-hier { grid-template-columns: minmax(0,1fr) !important; } .v4-hier > span { display: none; } }`}</style>
    </Tile>
  );
}

/* ---------------------------------------------------------------- 4 · actions */

function ActionControls({ id, overdue }: { id: string; overdue?: boolean }) {
  const a = useActions();
  const team = useTeamRoles(OWNERS);
  const s = a.get(id);
  const [mail, setMail] = useState(false);
  const late = overdue && s.status !== "Closed";
  const sel = {
    fontSize: 12.5,
    background: C.cardAlt,
    color: C.text,
    border: `1px solid ${C.borderLight}`,
    borderRadius: 6,
    padding: "3px 4px",
    maxWidth: 160,
  };
  return (
    <div
      data-testid="v4-actions"
      style={{
        display: "flex",
        gap: 6,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <select
        aria-label={`Assign ${id}`}
        value={s.owner ?? ""}
        onChange={(e) => e.target.value && a.assign(id, e.target.value)}
        style={sel}
      >
        <option value="">Assign…</option>
        {team.roles.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <select
        aria-label={`Status of ${id}`}
        value={s.status}
        onChange={(e) => a.setStatus(id, e.target.value as ActionStatus)}
        style={sel}
        title={
          s.trail.length
            ? s.trail
                .map(
                  (t) =>
                    `${t.status}${t.owner ? ` (${t.owner})` : ""} · ${new Date(t.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`,
                )
                .join("\n")
            : "Status trail: New"
        }
      >
        {STATUSES.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setMail(true)}
        disabled={!s.owner}
        title={s.owner ? "Notify the owner" : "Assign an owner first"}
        style={{
          ...sel,
          cursor: s.owner ? "pointer" : "not-allowed",
          display: "inline-flex",
          gap: 4,
          alignItems: "center",
          opacity: s.owner ? 1 : 0.5,
        }}
      >
        <Mail size={13} /> {s.notified ? "Notified" : "Notify"}
      </button>
      {late ? (
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 800,
            color: C.red,
            border: `1px solid ${tint(C.red, 0.4)}`,
            borderRadius: 999,
            padding: "1px 7px",
          }}
        >
          Overdue
        </span>
      ) : null}
      {mail && s.owner ? (
        <MailPreview
          id={id}
          owner={s.owner}
          onClose={() => setMail(false)}
          onSend={() => {
            a.notify(id);
            setMail(false);
          }}
        />
      ) : null}
    </div>
  );
}

let OWNERS: string[] = [
  "Escalations lead",
  "Upgrades lead",
  "Premium cards lead",
  "Service-delivery head",
];

/** The owner roles come from periods.json (v4.owner_roles); roles, never names. */
export function setOwnerRoles(roles: string[] | undefined) {
  if (roles?.length) OWNERS = roles;
}

function MailPreview({
  id,
  owner,
  onClose,
  onSend,
}: {
  id: string;
  owner: string;
  onClose: () => void;
  onSend: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-label="Notify preview"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(0,0,0,0.45)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 14,
          padding: 18,
          width: "min(520px, calc(100vw - 28px))",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          fontSize: 14,
        }}
      >
        <strong>Notify: in-app notice and email preview</strong>
        <div style={{ ...box, fontSize: 13.5, lineHeight: 1.6 }}>
          <div>To: {owner}</div>
          <div>Subject: Assigned to you: {id}</div>
          <div style={{ marginTop: 6, color: C.textSec }}>
            {id} has been assigned to you in LisN. Please acknowledge and close
            it within its limit. Open LisN to see the case and its status trail.
          </div>
        </div>
        <MutedNote>
          Preview only: no email is sent. The in-app notice is recorded on this
          screen. Phase 2: live email and acknowledgement tracking.
        </MutedNote>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={btn(false)}>
            Cancel
          </button>
          <button type="button" onClick={onSend} style={btn(true)}>
            Record in-app notice
          </button>
        </div>
      </div>
    </div>
  );
}

const btn = (primary: boolean) => ({
  fontSize: 13,
  borderRadius: 8,
  padding: "6px 12px",
  cursor: "pointer",
  border: `1px solid ${primary ? C.brand : C.borderLight}`,
  background: primary ? C.brand : C.cardAlt,
  color: primary ? "#fff" : C.text,
  display: "inline-flex",
  gap: 6,
  alignItems: "center",
});

export function ExportButton({
  name,
  head,
  rows,
}: {
  name: string;
  head: string[];
  rows: string[][];
}) {
  return (
    <button
      type="button"
      data-testid="v4-export"
      onClick={() => downloadCsv(name, head, rows)}
      style={btn(false)}
    >
      <Download size={13} /> Export CSV
    </button>
  );
}

/** A list of items, each with its action controls, and an export of the whole list. */
export function ActionList({
  name,
  head,
  rows,
  max = 15,
}: {
  name: string;
  head: string[];
  rows: { id: string; cells: ReactNode[]; csv: string[]; overdue?: boolean }[];
  max?: number;
}) {
  const a = useActions();
  const [all, setAll] = useState(false);
  const shown = all ? rows : rows.slice(0, max);
  const cell = { padding: "6px 8px", textAlign: "left" as const };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ color: C.textMut, fontSize: 12 }}>
              {head.map((h) => (
                <th key={h} style={cell}>
                  {h}
                </th>
              ))}
              <th style={cell}>Owner · status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr
                key={r.id}
                data-testid="v4-row"
                style={{ borderTop: `1px solid ${C.border}` }}
              >
                {r.cells.map((c, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed columns
                  <td key={i} style={cell}>
                    {c}
                  </td>
                ))}
                <td style={cell}>
                  <ActionControls id={r.id} overdue={r.overdue} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <ExportButton
          name={name}
          head={[...head, "Owner", "Status"]}
          rows={rows.map((r) => [
            ...r.csv,
            a.get(r.id).owner ?? "",
            a.get(r.id).status,
          ])}
        />
        {rows.length > max ? (
          <button type="button" onClick={() => setAll(!all)} style={btn(false)}>
            {all ? "Show fewer" : `Show all ${rows.length}`}
          </button>
        ) : null}
        <span style={{ fontSize: 12, color: C.textMut }}>
          Status trail: New → Assigned → Acknowledged → Closed (hover the
          status). Phase 2: status writes back to CRM and social tools.
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 2 · open too long */

export function OpenTooLongTile({
  o,
  title,
  businesses,
}: {
  o: OpenTooLong;
  title: ReactNode;
  businesses?: {
    id: string;
    label: string;
    count: number;
    open: number;
    share_of_open: number | null;
  }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Tile
      id="open-too-long"
      title={title}
      sub="Open past its limit, by segment and timeline. Click the figure for the list."
      prov="internal"
      tone="red"
    >
      <div
        style={{
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          data-testid="otl-dial"
          onClick={() => setOpen(!open)}
          style={{
            all: "unset",
            cursor: "pointer",
            ...box,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div>
            <Fig
              label="Open too long"
              value={o.count}
              of={`${fmtPct(o.share_of_open)} of ${fmt(o.open)} open`}
              tone={C.red}
              def={DEFS.otl}
            />
          </div>
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {o.by_limit.map((x) => (
            <div key={x.id} style={{ fontSize: 13, color: C.textSec }}>
              <span style={{ fontFamily: MONO, color: C.text }}>
                {fmt(x.count)}
              </span>{" "}
              {x.label}
            </div>
          ))}
        </div>
      </div>
      {businesses ? (
        <div style={cols(4, 170, 8)}>
          {businesses.map((b) => (
            <div key={b.id} data-testid="otl-business" style={box}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{b.label}</div>
              <div style={{ fontFamily: MONO, color: C.red, fontSize: 18 }}>
                {fmt(b.count)}
              </div>
              <div style={{ fontSize: 12, color: C.textMut }}>
                {fmtPct(b.share_of_open)} of {fmt(b.open)} open
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {open ? (
        <ActionList
          name="open-too-long.csv"
          head={[
            "Case",
            "Business",
            "Issue",
            "Type",
            "Channel",
            "Age",
            "Over by",
            "Limit",
          ]}
          rows={o.list.map((r) => ({
            id: r.id,
            overdue: true,
            cells: [
              r.id,
              r.product,
              r.theme,
              r.kind,
              r.channel,
              r.age,
              r.over_by,
              r.limit,
            ],
            csv: [
              r.id,
              r.product,
              r.theme,
              r.kind,
              r.channel,
              r.age,
              r.over_by,
              r.limit,
            ],
          }))}
        />
      ) : null}
    </Tile>
  );
}

/* ---------------------------------------------------------------- 3 · priority slice */

export function PrioritySlice({
  blocks,
  business,
}: {
  blocks: SliceBlock[];
  business: string;
}) {
  return (
    <Tile
      id="priority-slice"
      title={`Priority customers: ${business}`}
      sub={`The same blocks as the priority-customer row on the MD's view, for ${business} only. High-impact is a property of the complaint, never of the person.`}
      prov="internal"
      tone="violet"
    >
      <div style={cols(3, 240, 10)}>
        {blocks.map((b) => (
          <div key={b.id} data-testid="slice-block" style={box}>
            <strong style={{ fontSize: 15 }}>{b.label}</strong>
            <div style={{ fontSize: 12.5, color: C.textMut }}>
              {fmt(b.volume)} contacts in the period
            </div>
            <div style={{ ...cols(3, 70, 8), marginTop: 8 }}>
              <Fig
                label="Open"
                value={b.open}
                of={`of ${fmt(b.volume)}`}
                tone={C.amber}
                def={DEFS.open}
              />
              <Fig
                label="Too long"
                value={b.open_too_long}
                of={`of ${fmt(b.open)} open`}
                tone={C.red}
                def={DEFS.otl}
              />
              <Fig
                label="Negative mentions"
                value={b.negative_mentions}
                def="Negative posts in the social inbox, linked to the customer by the bank's own records. LisN never matches people from public data."
              />
            </div>
            <div style={{ fontSize: 12.5, color: C.textSec, marginTop: 6 }}>
              Channels touched: {b.channels.join(", ") || "none"}
            </div>
          </div>
        ))}
      </div>
    </Tile>
  );
}

/* ---------------------------------------------------------------- 4 · today's 15 to close */

export function TodaysToClose({ rows }: { rows: CloseRow[] }) {
  return (
    <Tile
      id="to-close"
      title={`Today's ${rows.length} to close`}
      sub="The open Cards items furthest past their limit. Assign each one and track it to Closed."
      prov="internal"
      tone="amber"
    >
      <ActionList
        name="todays-15-to-close.csv"
        head={[
          "Case",
          "Issue",
          "Type",
          "Channel",
          "Age",
          "Limit",
          "Suggested owner",
        ]}
        rows={rows.map((r) => ({
          id: r.id,
          overdue: r.overdue,
          cells: [
            r.id,
            r.theme,
            r.kind,
            r.channel,
            r.age,
            r.limit,
            r.suggested_owner,
          ],
          csv: [
            r.id,
            r.theme,
            r.kind,
            r.channel,
            r.age,
            r.limit,
            r.suggested_owner,
          ],
        }))}
      />
    </Tile>
  );
}

/* ---------------------------------------------------------------- 5 · social response oversight */

export function SocialOversight({ s, scope }: { s: Social; scope: string }) {
  const m = s.matrix;
  const maxDay = Math.max(1, ...s.daily.map((d) => d.negative));
  const maxB = Math.max(1, ...s.response_time.buckets.map((b) => b.count));
  const cell = { padding: "6px 10px", textAlign: "right" as const };
  return (
    <Tile
      id="social-oversight"
      title={`Social response oversight: ${scope}`}
      sub="Did the bank answer public voice, and how fast? Daily, not monthly."
      prov="public"
      tone="cyan"
    >
      <div style={cols(2, 320, 12)}>
        <div style={box}>
          <strong style={{ fontSize: 14 }}>
            Sentiment × responded <InfoTip text={DEFS.responded} />
          </strong>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
              marginTop: 6,
            }}
          >
            <thead>
              <tr style={{ color: C.textMut, fontSize: 12 }}>
                <th style={{ ...cell, textAlign: "left" }} />
                <th style={cell}>Responded</th>
                <th style={cell}>Not responded</th>
              </tr>
            </thead>
            <tbody>
              {(["positive", "neutral", "negative"] as const).map((k) => (
                <tr key={k} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ ...cell, textAlign: "left" }}>
                    {k[0].toUpperCase() + k.slice(1)}
                  </td>
                  <td style={{ ...cell, fontFamily: MONO, color: C.green }}>
                    {fmt(m[k].responded)}
                  </td>
                  <td
                    style={{
                      ...cell,
                      fontFamily: MONO,
                      color: k === "negative" ? C.red : C.text,
                    }}
                  >
                    {fmt(m[k].not_responded)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={box}>
          <strong style={{ fontSize: 14 }}>
            Time to first reply{" "}
            <InfoTip
              text={`${s.response_time.basis}: ${fmt(s.response_time.n)} replies in the period.`}
            />
          </strong>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginTop: 8,
            }}
          >
            {s.response_time.buckets.map((b) => (
              <div
                key={b.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 40px",
                  gap: 8,
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <span>{b.label}</span>
                <span
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: C.cyan,
                    width: `${(100 * b.count) / maxB}%`,
                  }}
                />
                <span style={{ fontFamily: MONO, textAlign: "right" }}>
                  {fmt(b.count)}
                </span>
              </div>
            ))}
          </div>
          <MutedNote>
            Median {s.response_time.median_hours ?? "—"} h, Play Store replies
            only (the one source with reply times).
          </MutedNote>
        </div>
      </div>
      <div style={box}>
        <strong style={{ fontSize: 14 }}>
          Negatives per day, and how many were answered
        </strong>
        <div
          data-testid="social-daily"
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            height: 80,
            marginTop: 8,
          }}
        >
          {s.daily.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.negative} negative, ${d.responded} answered`}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <div
                style={{
                  height: `${(100 * (d.negative - d.responded)) / maxDay}%`,
                  background: C.red,
                  borderRadius: "2px 2px 0 0",
                }}
              />
              <div
                style={{
                  height: `${(100 * d.responded) / maxDay}%`,
                  background: C.green,
                }}
              />
            </div>
          ))}
        </div>
        <MutedNote>
          Green: answered. Red: not answered. The bank&apos;s agency report is
          monthly; this is daily.
        </MutedNote>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <strong style={{ fontSize: 14 }}>
          Negatives not responded beyond 24 hours:{" "}
          <span style={{ fontFamily: MONO, color: C.red }}>
            {fmt(s.unanswered_negatives.count)}
          </span>
        </strong>
        <ActionList
          name="unanswered-negatives.csv"
          max={8}
          head={["Post", "Source", "Issue", "Age", "Reach"]}
          rows={s.unanswered_negatives.list.map((r) => ({
            id: r.id,
            overdue: true,
            cells: [r.id, r.source, r.theme, r.age, r.reach ? "High" : "—"],
            csv: [r.id, r.source, r.theme, r.age, r.reach ? "High" : ""],
          }))}
        />
      </div>
      <MutedNote>{s.note}</MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- 6 · top 15 complaints */

export function TopComplaints({ rows }: { rows: TopComplaint[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const cell = { padding: "6px 8px", textAlign: "left" as const };
  return (
    <Tile
      id="top-complaints"
      title={`Top ${rows.length} complaints: Cards`}
      sub="Complaint themes by count. Click a row for the evidence (redacted); assign each row."
      prov="internal"
      tone="red"
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ color: C.textMut, fontSize: 12 }}>
              {[
                "Theme",
                "Product",
                "Complaints",
                "Oldest open",
                "Escalation language",
                "Ombudsman risk",
                "Owner · status",
              ].map((h) => (
                <th key={h} style={cell}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <TopRow
                key={r.id}
                r={r}
                open={openId === r.id}
                toggle={() => setOpenId(openId === r.id ? null : r.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ExportButton
        name="top-complaints.csv"
        head={[
          "Theme",
          "Product",
          "Complaints",
          "Open",
          "Oldest open",
          "Escalation language",
          "Ombudsman risk",
        ]}
        rows={rows.map((r) => [
          r.theme,
          r.product,
          String(r.count),
          String(r.open),
          r.oldest_open,
          r.escalation_language ? "yes" : "no",
          String(r.ombudsman_risk),
        ])}
      />
    </Tile>
  );
}

function TopRow({
  r,
  open,
  toggle,
}: {
  r: TopComplaint;
  open: boolean;
  toggle: () => void;
}) {
  const cell = { padding: "6px 8px", textAlign: "left" as const };
  return (
    <>
      <tr
        data-testid="top-complaint"
        style={{ borderTop: `1px solid ${C.border}` }}
      >
        <td style={cell}>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            style={{
              all: "unset",
              cursor: "pointer",
              display: "inline-flex",
              gap: 4,
              alignItems: "center",
              fontWeight: 700,
            }}
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {r.theme}
          </button>
        </td>
        <td style={cell}>{r.product}</td>
        <td style={{ ...cell, fontFamily: MONO }}>{fmt(r.count)}</td>
        <td style={cell}>{r.oldest_open}</td>
        <td
          style={{
            ...cell,
            color: r.escalation_language ? C.amber : C.textMut,
          }}
        >
          {r.escalation_language ? "Yes" : "No"}
        </td>
        <td style={{ ...cell, color: r.ombudsman_flag ? C.red : C.textMut }}>
          {r.ombudsman_flag ? `Yes · ${fmt(r.ombudsman_risk)}` : "No"}
        </td>
        <td style={cell}>
          <ActionControls id={r.id} overdue={r.ombudsman_flag} />
        </td>
      </tr>
      {open ? (
        <tr>
          <td colSpan={7} style={{ padding: "4px 8px 10px" }}>
            <div style={{ ...box, fontSize: 13 }}>
              <strong>Evidence (redacted): earliest cases in the period</strong>
              {r.evidence.map((e) => (
                <div
                  key={e.case}
                  style={{
                    borderTop: `1px solid ${C.border}`,
                    padding: "6px 0",
                    color: C.textSec,
                  }}
                >
                  <span style={{ fontFamily: MONO, color: C.text }}>
                    {e.case}
                  </span>{" "}
                  · received {e.received} by {e.channel} · {e.contacts} further
                  contacts across {e.channels_touched} channels · escalation:{" "}
                  {e.escalation} · {e.status} · ombudsman: {e.ombudsman}
                </div>
              ))}
              <MutedNote>
                Case timelines only; customer text and identifiers are not
                shown. Internal · illustrative.
              </MutedNote>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

export function Phase2Note() {
  return (
    <MutedNote>
      Phase 1: assign, notify (in-app notice and email preview), export and the
      status trail work inside LisN only; nothing is sent. Phase 2: status
      writes back to CRM and social tools.
    </MutedNote>
  );
}

/* ---------------------------------------------------------------- P1 · service metrics teaser */

export function ServiceMetrics({
  s,
  scope,
  businesses,
}: {
  s: Service;
  scope: string;
  businesses?: { id: string; label: string; service: Service }[];
}) {
  const cell = { padding: "6px 8px", textAlign: "right" as const };
  return (
    <Tile
      id="service-metrics"
      title={`Service metrics: ${scope}`}
      sub="Same-day resolution, first-time resolution and first-time not resolved, computed from the interactions. A teaser: the definitions are confirmed in discovery."
      prov="internal"
      tone="cyan"
    >
      <span
        style={{
          alignSelf: "flex-start",
          fontSize: 12,
          color: C.amber,
          border: `1px solid ${tint(C.amber, 0.4)}`,
          borderRadius: 999,
          padding: "2px 10px",
        }}
      >
        {s.tag}
      </span>
      <div style={cols(3, 180, 10)}>
        <div style={box}>
          <Fig
            label="SDR · same-day resolution"
            value={s.sdr}
            of={`${fmtPct(s.sdr_pct)} of ${fmt(s.volume)} interactions`}
            tone={C.green}
            def="Same-day resolution: of the period's interactions, those closed on the calendar day they came in."
          />
        </div>
        <div style={box}>
          <Fig
            label="FTR · first-time resolution"
            value={s.ftr}
            of={`${fmtPct(s.ftr_pct)} of ${fmt(s.resolved)} resolved`}
            tone={C.green}
            def="First-time resolution: of the resolved, those closed with no repeat contact on the issue."
          />
        </div>
        <div style={box}>
          <Fig
            label="FTNR · first-time not resolved"
            value={s.ftnr}
            of={`${fmtPct(s.ftnr_pct)} of ${fmt(s.resolved)} resolved`}
            tone={C.amber}
            def="First-time not resolved: of the resolved, those that needed a further contact first. FTR + FTNR = resolved."
          />
        </div>
      </div>
      {businesses?.length ? (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ color: C.textMut, fontSize: 12 }}>
                <th style={{ ...cell, textAlign: "left" }}>Business</th>
                <th style={cell}>SDR</th>
                <th style={cell}>FTR</th>
                <th style={cell}>FTNR</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr
                  key={b.id}
                  data-testid="service-business"
                  style={{ borderTop: `1px solid ${C.border}` }}
                >
                  <td style={{ ...cell, textAlign: "left" }}>{b.label}</td>
                  <td style={{ ...cell, fontFamily: MONO }}>
                    {fmtPct(b.service.sdr_pct)}
                  </td>
                  <td style={{ ...cell, fontFamily: MONO }}>
                    {fmtPct(b.service.ftr_pct)}
                  </td>
                  <td style={{ ...cell, fontFamily: MONO }}>
                    {fmtPct(b.service.ftnr_pct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Tile>
  );
}

/* ---------------------------------------------------------------- P1 · team roles upload */

const SAMPLE_ROWS = [
  ["Escalations lead", "Cards service", "Service-delivery head"],
  ["Upgrades lead", "Cards product", "Head of Cards"],
  ["Premium cards lead", "Cards premium", "Head of Cards"],
  ["Service-delivery head", "Cards service", "Head of CX"],
  ["Social care lead", "CX social", "Head of CX"],
];

/** Load a team structure (a CSV of roles) that Assign then offers. Roles only: emails and phone numbers are refused. */
export function TeamRolesUpload() {
  const team = useTeamRoles(OWNERS);
  const [msg, setMsg] = useState<string | null>(null);
  const rows =
    team.loaded ??
    team.roles.map((r) => ({ role: r, team: "", reports_to: "" }));
  return (
    <Tile
      id="team-roles"
      title="Team structure"
      sub="Load your team's roles from a CSV; Assign then offers them. This shows how a team structure would be loaded."
      prov="internal"
      tone="violet"
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <label style={{ ...btn(true), cursor: "pointer" }}>
          Load team roles (CSV)
          <input
            type="file"
            accept=".csv,text/csv"
            data-testid="team-roles-input"
            style={{ display: "none" }}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const r = parseTeamCsv(await f.text());
              if (r.error) {
                setMsg(r.error);
              } else {
                team.save(r.roles);
                setMsg(
                  `${r.roles.length} roles loaded${r.refused ? `; ${r.refused} rows refused (they looked like a person: an email or a phone number)` : ""}.`,
                );
              }
              e.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          onClick={() =>
            downloadCsv(
              "team-roles-sample.csv",
              ["role", "team", "reports_to"],
              SAMPLE_ROWS,
            )
          }
          style={btn(false)}
        >
          <Download size={13} /> Sample CSV
        </button>
        {team.loaded ? (
          <button
            type="button"
            onClick={() => {
              team.save(null);
              setMsg("Back to the default roles.");
            }}
            style={btn(false)}
          >
            Use default roles
          </button>
        ) : null}
      </div>
      {msg ? (
        <div
          data-testid="team-roles-msg"
          style={{ fontSize: 13, color: C.textSec }}
        >
          {msg}
        </div>
      ) : null}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ color: C.textMut, fontSize: 12, textAlign: "left" }}>
              <th style={{ padding: "6px 8px" }}>Role</th>
              <th style={{ padding: "6px 8px" }}>Team</th>
              <th style={{ padding: "6px 8px" }}>Reports to</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.role}
                data-testid="team-role"
                style={{ borderTop: `1px solid ${C.border}` }}
              >
                <td style={{ padding: "6px 8px" }}>{r.role}</td>
                <td style={{ padding: "6px 8px", color: C.textSec }}>
                  {r.team || "—"}
                </td>
                <td style={{ padding: "6px 8px", color: C.textSec }}>
                  {r.reports_to || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MutedNote>
        {team.loaded ? "Loaded in this browser. " : "Default roles shown. "}
        Roles only: a row with an email or a phone number is refused. Phase 2:
        the hierarchy comes from the bank&apos;s HR or CRM system.
      </MutedNote>
    </Tile>
  );
}
