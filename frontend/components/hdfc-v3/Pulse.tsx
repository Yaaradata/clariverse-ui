"use client";

/**
 * The first scroll of the MD's office / Head of CX view (30 Sep review, changes_30sep.md A): the period filter, the
 * Customer pulse and the CX pulse. Every figure comes from periods.json for the selected period.
 */

import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useState } from "react";

import { fmt, fmtDate, fmtPct, fmtSigned } from "@/lib/hdfc-v3/format";
import {
  CHANNEL_LABEL,
  CHANNEL_ORDER,
  PERIOD_IDS,
  type Period,
  type PeriodId,
  type PeriodsFile,
  type PublicFigures,
  type PulseList,
  type SocialPost,
} from "@/lib/hdfc-v3/periods";
import {
  C,
  Kpi,
  MONO,
  MutedNote,
  ProvenanceTag,
  Table,
  Tile,
  tint,
} from "./primitives";

/* ---------------------------------------------------------------- period */

export function usePeriod(file: PeriodsFile): Period {
  const sp = useSearchParams();
  const id = sp?.get("period") as PeriodId | null;
  return file.periods[id && PERIOD_IDS.includes(id) ? id : file.default];
}

/** "Last 7 days · 22 Sep 08:30 to 29 Sep 08:30" */
export function periodLabel(p: Period): string {
  const t = (iso: string) => `${fmtDate(iso)} ${iso.slice(11, 16)}`;
  return p.id === "all"
    ? `${p.label} · ${fmtDate(p.start)} to ${t(p.end)}`
    : `${p.label} · ${t(p.start)} to ${t(p.end)}`;
}

/** Link that keeps the selected period. */
export function withPeriod(href: string, p: Period): string {
  return `${href}${href.includes("?") ? "&" : "?"}period=${p.id}`;
}

export function PeriodFilter({
  file,
  current,
}: {
  file: PeriodsFile;
  current: Period;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  return (
    <div
      data-testid="period-filter"
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "8px 12px",
      }}
    >
      <span style={{ fontSize: 13.5, color: C.textMut }}>Period:</span>
      {PERIOD_IDS.map((id) => {
        const on = id === current.id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            onClick={() =>
              router.replace(`${pathname}?period=${id}`, { scroll: false })
            }
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 13.5,
              cursor: "pointer",
              color: on ? C.text : C.textSec,
              background: on ? C.brandSoft : "transparent",
              border: `1px solid ${on ? C.brand : C.border}`,
              fontWeight: on ? 700 : 500,
            }}
          >
            {file.periods[id].label}
          </button>
        );
      })}
      <span style={{ fontSize: 13, color: C.textMut, marginLeft: "auto" }}>
        {periodLabel(current)}. Data runs to {fmtDate(file.end)}{" "}
        {file.end.slice(11, 16)}.
      </span>
    </div>
  );
}

/** Compact period filter for the Shell header (buttons only; the range shows under the page title). */
export function HeaderPeriodFilter({ file }: { file: PeriodsFile }) {
  const current = usePeriod(file);
  const router = useRouter();
  const pathname = usePathname() ?? "";
  return (
    <div
      data-testid="period-filter"
      style={{
        display: "flex",
        gap: 4,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {PERIOD_IDS.map((id) => {
        const on = id === current.id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            title={periodLabel(file.periods[id])}
            onClick={() =>
              router.replace(`${pathname}?period=${id}`, { scroll: false })
            }
            style={{
              padding: "4px 11px",
              borderRadius: 999,
              fontSize: 13,
              cursor: "pointer",
              color: on ? C.text : C.textSec,
              background: on ? C.brandSoft : "transparent",
              border: `1px solid ${on ? C.brand : C.border}`,
              fontWeight: on ? 700 : 500,
              whiteSpace: "nowrap",
            }}
          >
            {file.periods[id].label}
          </button>
        );
      })}
    </div>
  );
}

export function titled(title: string, _p: Period): ReactNode {
  return title;
}

/* ---------------------------------------------------------------- visuals */

export function SmallRing({
  value,
  color,
  size = 64,
  centre,
}: {
  value: number | null;
  color: string;
  size?: number;
  centre?: string;
}) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const v = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.inner}
        strokeWidth="6"
      />
      {value === null ? null : (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(circ * v) / 100} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        style={{ fontSize: 12, fontWeight: 700, fill: C.text }}
      >
        {centre ?? (value === null ? "—" : `${Math.round(v)}%`)}
      </text>
    </svg>
  );
}

export function Sparkline({
  values,
  color,
  width = 90,
  height = 26,
}: {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const pts = values
    .map(
      (v, i) =>
        `${(i * (width - 4)) / (values.length - 1) + 2},${height - 3 - ((height - 6) * v) / max}`,
    )
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrendChip({
  pct,
  label,
}: {
  pct: number | null;
  label: string;
}) {
  if (pct === null)
    return (
      <span style={{ fontSize: 12, color: C.textMut }}>no earlier period</span>
    );
  const up = pct > 0;
  return (
    <span
      title={label}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: 12,
        lineHeight: 1.3,
      }}
    >
      <span style={{ fontWeight: 700, color: C.textSec, whiteSpace: "nowrap" }}>
        {up ? "▲" : pct < 0 ? "▼" : "■"} {fmtSigned(pct)}
      </span>
      <span style={{ fontSize: 11, color: C.textMut }}>{label}</span>
    </span>
  );
}

/** A ring with its figure and label underneath. */
export function Dial({
  value,
  color,
  big,
  label,
  sub,
  centre,
}: {
  value: number | null;
  color: string;
  big: string;
  label: string;
  sub?: ReactNode;
  centre?: string;
}) {
  return (
    <div
      data-testid="dial"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        minWidth: 0,
        textAlign: "center",
      }}
    >
      <SmallRing value={value} color={color} centre={centre} />
      <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 750 }}>
        {big}
      </div>
      <div
        style={{
          fontSize: 12,
          color: C.textMut,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      {sub ? (
        <div style={{ fontSize: 12.5, color: C.textSec, lineHeight: 1.35 }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}

const DIALS = (n: number) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
  gap: 8,
});

function share(a: number | null, b: number): number | null {
  return a === null || !b ? null : (100 * a) / b;
}

/* ---------------------------------------------------------------- customer pulse */

const WAIT_NA =
  "Can't be measured in a 24-hour window: nothing in it is 48 hours old yet.";

function RingStat({
  value,
  color,
  big,
  label,
  sub,
}: {
  value: number | null;
  color: string;
  big: string;
  label: string;
  sub?: ReactNode;
}) {
  return (
    <div
      data-testid="dial"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "8px 10px",
      }}
    >
      <SmallRing value={value} color={color} size={54} />
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 20,
            fontWeight: 750,
            lineHeight: 1.1,
          }}
        >
          {big}
        </span>
        <span
          style={{
            fontSize: 11.5,
            color: C.textMut,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
        {sub ? (
          <span style={{ fontSize: 12, color: C.textSec, lineHeight: 1.3 }}>
            {sub}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** A count's change against the comparison window: direction, amount and what it is compared with. */
function Delta({
  n,
  label,
  goodDown,
}: {
  n: number | null;
  label: string;
  goodDown?: boolean;
}) {
  if (n === null) return <span style={{ color: C.textMut }}>{label}</span>;
  const color = n === 0 || !goodDown ? C.textSec : n > 0 ? C.red : C.green;
  return (
    <span data-testid="delta">
      <strong style={{ color, whiteSpace: "nowrap" }}>
        {n > 0 ? "▲" : n < 0 ? "▼" : "■"} {n > 0 ? "+" : n < 0 ? "−" : ""}
        {fmt(Math.abs(n))}
      </strong>{" "}
      <span style={{ color: C.textMut }}>{label}</span>
    </span>
  );
}

function ListCard({ l, p }: { l: PulseList; p: Period }) {
  const [open, setOpen] = useState(false);
  const rows = CHANNEL_ORDER.map((ch) => {
    const c = l.by_channel[ch];
    return [
      CHANNEL_LABEL[ch],
      fmt(c.volume),
      fmt(c.open),
      fmt(c.waiting_on_customer),
      c.not_responded_48h === null ? "—" : fmt(c.not_responded_48h),
    ];
  });
  const late = l.not_responded_48h;
  return (
    <div
      data-testid="pulse-list"
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          alignItems: "baseline",
        }}
      >
        <strong style={{ fontSize: 15.5, lineHeight: 1.25 }}>{l.label}</strong>
        <span
          style={{ fontSize: 12.5, color: C.textMut, whiteSpace: "nowrap" }}
        >
          {fmt(l.members)} customers
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 30,
              fontWeight: 750,
              lineHeight: 1,
            }}
          >
            {fmt(l.volume)}
          </span>
          <span
            style={{
              fontSize: 11.5,
              color: C.textMut,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginTop: 4,
            }}
          >
            Volume
          </span>
        </div>
        <TrendChip pct={l.change_pct} label={p.compare} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        <RingStat
          value={share(l.open, l.volume)}
          color={C.amber}
          big={fmt(l.open)}
          label="Open"
          sub={<Delta n={l.open_delta} label={p.compare} goodDown />}
        />
        <RingStat
          value={share(late, l.volume)}
          color={C.red}
          big={late === null ? "—" : fmt(late)}
          label="No reply in 48 h"
          sub={
            <Delta
              n={l.not_responded_delta}
              label={late === null ? "needs 48 hours" : p.compare}
              goodDown
            />
          }
        />
      </div>
      <div
        data-testid="rm-line"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
          fontSize: 12.5,
          color: C.textSec,
        }}
      >
        <span>
          RMs alerted:{" "}
          <strong style={{ color: C.text }}>
            {fmt(l.rm.alerted)} of {fmt(l.rm.of)}
          </strong>
        </span>
        <span>
          Waiting on customer:{" "}
          <strong style={{ color: C.text }}>
            {fmt(l.waiting_on_customer)}
          </strong>
        </span>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          style={{
            background: "transparent",
            border: "none",
            color: C.brandInk,
            padding: 0,
            fontSize: 12.5,
            cursor: "pointer",
            display: "inline-flex",
            gap: 3,
            alignItems: "center",
          }}
        >
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />} By
          channel
        </button>
      </div>
      {open ? (
        <Table
          head={["Channel", "Volume", "Open", "Waiting", "No reply 48 h"]}
          align={["left", "right", "right", "right", "right"]}
          rows={[
            ...rows,
            [
              <strong key="t">Total</strong>,
              <strong key="v">{fmt(l.volume)}</strong>,
              <strong key="o">{fmt(l.open)}</strong>,
              <strong key="w">{fmt(l.waiting_on_customer)}</strong>,
              <strong key="n">{late === null ? "—" : fmt(late)}</strong>,
            ],
          ]}
        />
      ) : null}
    </div>
  );
}

export function CustomerPulse({ p }: { p: Period }) {
  const cp = p.customer_pulse;
  return (
    <Tile
      id="customer-pulse"
      title={titled("Customer pulse", p)}
      sub={`Customers on the bank's own lists, on the bank's own channels only. Every figure is compared ${p.compare}.`}
      prov="internal"
      tone="violet"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, max(280px, calc((100% - 30px) / 4))), 1fr))",
          gap: 10,
          alignItems: "start",
        }}
      >
        {cp.lists.map((l) => (
          <ListCard key={l.id} l={l} p={p} />
        ))}
      </div>
      <MutedNote>
        Internal channels only: emails, calls, chat, WhatsApp, social inbox and
        branch; IVR bot calls are not counted. Public posts are in the Social
        pulse below. Open: with the bank at the period end. Waiting on customer:
        the bank has sent a resolution or proposed one, so the thread is not
        counted as open or as unanswered. No reply in 48 h: waited more than 48
        hours for a first reply. RMs alerted: as of {fmtDate(cp.rm.as_of)}{" "}
        {cp.rm.as_of.slice(11, 16)}, of the list&apos;s customers due an alert.
        Lists come only from the bank&apos;s own records; a customer can be on
        more than one list, so the lists are not added up. Flags prioritise
        service; they never restrict it.
      </MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- Social pulse (30 Sep review, K2) */

const ENGAGEMENT_LABEL: Record<string, string> = {
  likes: "likes",
  replies: "replies",
  reposts: "reposts",
  upvotes: "upvotes",
  helpful: "found helpful",
};

function engagementLine(e: Record<string, number>) {
  const parts = Object.entries(e).map(
    ([k, v]) => `${fmt(v)} ${ENGAGEMENT_LABEL[k] ?? k}`,
  );
  return parts.length ? parts.join(" · ") : "no engagement recorded";
}

function ResponseChip({ responded }: { responded: boolean | null }) {
  const [label, color] =
    responded === null
      ? ["Replies not collected", C.textMut]
      : responded
        ? ["Responded", C.green]
        : ["Not responded", C.red];
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        color,
        border: `1px solid ${tint(color, 0.4)}`,
        background: tint(color, 0.08),
        borderRadius: 999,
        padding: "1px 9px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function SocialPostRow({ post, rank }: { post: SocialPost; rank: number }) {
  return (
    <div
      data-testid="social-post"
      style={{
        display: "grid",
        gridTemplateColumns: "26px minmax(0, 1fr)",
        gap: 10,
        padding: "9px 0",
        borderTop: rank > 1 ? `1px solid ${C.border}` : "none",
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontWeight: 750,
          fontSize: 15,
          color: C.textMut,
        }}
      >
        {rank}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 14, lineHeight: 1.45 }}>
          &ldquo;{post.text}&rdquo;
        </span>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
            fontSize: 12.5,
            color: C.textSec,
          }}
        >
          <strong>
            {post.platform} · {fmtDate(post.date)}
          </strong>
          <span style={{ color: C.textMut }}>
            {engagementLine(post.engagement)}
          </span>
          <ResponseChip responded={post.responded} />
        </div>
      </div>
    </div>
  );
}

export function SocialPulse({ p }: { p: Period }) {
  const sp = p.social_pulse;
  const g = sp.good_response;
  const platforms = Object.entries(sp.by_platform)
    .map(([k, v]) => `${k} ${fmt(v)}`)
    .join(" · ");
  const box = {
    background: C.cardAlt,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    minWidth: 0,
  };
  return (
    <Tile
      id="social-pulse"
      title={titled("Social pulse", p)}
      sub="What LisN adds beyond your own systems: what is being said in public, what is travelling, and whether it was picked up. For awareness, not a service target."
      prov="public"
      tone="cyan"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
          gap: 8,
        }}
      >
        <Kpi
          label="Total mentions"
          value={fmt(sp.mentions)}
          sub={platforms || "no public items in this period"}
        />
        <Kpi
          label="High-impact mentions"
          value={fmt(sp.high_impact)}
          sub="posts with reach: high likes, replies and reposts"
          tone="amber"
        />
        <Kpi
          label="Bank response · informational"
          value={sp.response_pct === null ? "—" : `${sp.response_pct}%`}
          sub={
            sp.tracked
              ? `${fmt(sp.responded)} of ${fmt(sp.tracked)} Play Store reviews; high impact ${fmt(sp.high_impact_responded)} of ${fmt(sp.high_impact_tracked)}`
              : "no Play Store reviews in this period"
          }
        />
      </div>
      <div style={{ fontSize: 13.5, color: C.textSec }}>
        Response here means acknowledged and routed to an official channel. It
        is shown for information, not as a target.
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div style={{ ...box, flex: "3 1 460px" }}>
          <strong style={{ fontSize: 14.5 }}>
            Top {sp.posts.length || ""} trending posts, by engagement
          </strong>
          {sp.posts.length ? (
            sp.posts.map((post, i) => (
              <SocialPostRow
                key={`${post.platform}-${post.date}-${post.score}`}
                post={post}
                rank={i + 1}
              />
            ))
          ) : (
            <MutedNote>No posts with engagement in this period.</MutedNote>
          )}
        </div>
        {g ? (
          <div
            data-testid="good-response"
            style={{
              ...box,
              flex: "2 1 320px",
              border: `1px solid ${tint(C.green, 0.45)}`,
              background: tint(C.green, 0.05),
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                fontSize: 12,
                fontWeight: 800,
                color: C.green,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Good response
            </span>
            <span style={{ fontSize: 14, lineHeight: 1.45 }}>
              &ldquo;{g.text}&rdquo;
            </span>
            <span style={{ fontSize: 12.5, color: C.textSec }}>
              <strong>
                {g.platform} · {fmtDate(g.date)}
              </strong>{" "}
              <span style={{ color: C.textMut }}>
                {engagementLine(g.engagement)}
                {g.in_period
                  ? ""
                  : " · most recent example, before this period"}
              </span>
            </span>
            <div
              style={{
                borderLeft: `3px solid ${C.green}`,
                paddingLeft: 10,
                fontSize: 13.5,
                color: C.textSec,
                lineHeight: 1.5,
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  color: C.textMut,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                The bank&apos;s reply
              </div>
              {g.reply}
            </div>
            <span style={{ fontSize: 12.5, color: C.textMut }}>
              Acknowledged, given a reference and routed to an official channel.
              Names and links are removed.
            </span>
          </div>
        ) : null}
      </div>
      <MutedNote>
        {sp.rule} Reply data exists for Play Store reviews only; replies on X,
        Reddit and forums are not collected, and the screen says so on each
        post. Text is an anonymised summary: no names, handles or links.
      </MutedNote>
    </Tile>
  );
}

/* ---------------------------------------------------------------- CX pulse */

function ExternalSet({
  title,
  f,
  hi,
}: {
  title: string;
  f: {
    volume: number;
    positive: number;
    negative: number;
    positive_share: number | null;
    negative_share: number | null;
    responded: PublicFigures["responded"];
  };
  hi?: boolean;
}) {
  const r = f.responded;
  return (
    <div
      style={{
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <strong style={{ fontSize: 14.5 }}>{title}</strong>
      <div style={DIALS(3)}>
        <Dial
          value={100}
          color={hi ? C.amber : C.cyan}
          centre={fmt(f.volume)}
          big={fmt(f.volume)}
          label={hi ? "High impact" : "Signals"}
        />
        <Dial
          value={f.positive_share}
          color={C.green}
          big={`${fmt(f.positive)} / ${fmt(f.negative)}`}
          label="Positive / negative"
          sub={`${fmtPct(f.positive_share)} positive · ${fmtPct(f.negative_share)} negative, source-weighted`}
        />
        <Dial
          value={share(r.responded, r.reviews)}
          color={C.violet}
          big={`${fmt(r.responded)} of ${fmt(r.reviews)}`}
          label="Responded"
          sub={`positive ${fmt(r.positive_responded)} of ${fmt(r.positive_reviews)} · negative ${fmt(r.negative_responded)} of ${fmt(r.negative_reviews)}`}
        />
      </div>
    </div>
  );
}

function LegendDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: 9,
        height: 9,
        borderRadius: 999,
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

export function CxPulse({ p }: { p: Period }) {
  const cx = p.cx_pulse;
  const i = cx.internal;
  const e = cx.external;
  const na = i.open_too_long === null;
  const mix = Object.entries(e.source_mix).sort((a, b) => b[1] - a[1])[0];
  const head = (
    label: string,
    kind: "internal" | "public",
    extra?: ReactNode,
  ) => (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <strong style={{ fontSize: 15 }}>{label}</strong>
      <ProvenanceTag kind={kind} />
      {extra}
    </div>
  );
  return (
    <Tile
      id="cx-pulse"
      title={titled("CX pulse", p)}
      sub="All customer contact: the bank's own channels and public voice."
      prov={["internal", "public"]}
      tone="cyan"
    >
      <div data-testid="overall-volume">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            fontSize: 14.5,
          }}
        >
          <span>
            Overall contact volume{" "}
            <strong style={{ fontFamily: MONO, fontSize: 18 }}>
              {fmt(cx.overall.total)}
            </strong>
          </span>
          <span
            style={{
              color: C.textSec,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <LegendDot color={C.violet} />
            Internal {fmt(cx.overall.internal)} (
            {fmtPct(cx.overall.internal_pct)}) ·
            <LegendDot color={C.cyan} />
            External {fmt(cx.overall.external)} (
            {fmtPct(cx.overall.external_pct)})
          </span>
        </div>
        <div
          style={{
            display: "flex",
            height: 10,
            borderRadius: 999,
            overflow: "hidden",
            marginTop: 6,
            background: C.inner,
          }}
        >
          <div
            style={{
              width: `${cx.overall.internal_pct ?? 0}%`,
              background: C.violet,
            }}
          />
          <div
            style={{
              width: `${cx.overall.external_pct ?? 0}%`,
              background: C.cyan,
            }}
          />
        </div>
      </div>

      {head("Internal channels", "internal")}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            flex: "5 1 520px",
            minWidth: 0,
            background: C.cardAlt,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            gap: 10,
          }}
        >
          <div style={DIALS(5)}>
            <Dial
              value={100}
              color={C.violet}
              centre={fmt(i.volume)}
              big={fmt(i.volume)}
              label="Volume"
              sub={<TrendChip pct={i.change_pct} label={p.compare} />}
            />
            <Dial
              value={share(i.resolved, i.volume)}
              color={C.green}
              big={fmt(i.resolved)}
              label="Resolved"
            />
            <Dial
              value={share(i.open, i.volume)}
              color={C.amber}
              big={fmt(i.open)}
              label="Open"
              sub={<Delta n={i.open_delta} label={p.compare} goodDown />}
            />
            <Dial
              value={share(i.waiting_on_customer, i.volume)}
              color={C.cyan}
              big={fmt(i.waiting_on_customer)}
              label="Waiting on customer"
            />
            <Dial
              value={share(i.open_too_long, i.volume)}
              color={C.red}
              big={na ? "—" : fmt(i.open_too_long)}
              label="Open too long"
              sub={na ? "needs 48 hours" : "over 48 hours"}
            />
          </div>
          <div style={{ fontSize: 12.5, color: C.textMut, lineHeight: 1.5 }}>
            Emails, calls, chat, WhatsApp, social inbox and branch; IVR bot
            calls are not counted. Resolved: closed by the period end. Waiting
            on customer: the bank has sent a resolution or proposed one; not
            counted as open. Open too long: still open with the bank more than
            48 hours after the contact came in.
            {na ? ` ${WAIT_NA}` : ""} The channels on the right add up to these
            dials.
          </div>
        </div>
        <div style={{ flex: "3 1 340px", minWidth: 0 }}>
          <Table
            head={[
              "Channel",
              "Volume",
              "Resolved",
              "Open",
              "Waiting",
              "Too long",
            ]}
            align={["left", "right", "right", "right", "right", "right"]}
            rows={CHANNEL_ORDER.map((ch) => {
              const c = i.by_channel[ch];
              return [
                CHANNEL_LABEL[ch],
                fmt(c.volume),
                fmt(c.resolved),
                fmt(c.open),
                fmt(c.waiting_on_customer),
                c.open_too_long === null || c.open_too_long === undefined
                  ? "—"
                  : fmt(c.open_too_long),
              ];
            })}
          />
        </div>
      </div>
      {head(
        "External channels",
        "public",
        <TrendChip
          pct={e.change_pct}
          label={`${p.compare}, stores and forums`}
        />,
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
          gap: 12,
        }}
      >
        <ExternalSet title="Total signals" f={e} />
        <ExternalSet title="High-impact signals" f={e.high_impact} hi />
      </div>
      <MutedNote>
        Public posts and reviews
        {p.id === "brief"
          ? `, ${fmtDate(p.public_start)} ${p.public_start.slice(11, 16)} to ${fmtDate(p.public_end)} ${p.public_end.slice(11, 16)} (public data ends there)`
          : ""}
        . Responded: a bank reply on a Play Store review, the only source with
        reply data. High impact: a post with reach (an X account with 10,000+
        followers, or 50+ likes or 20+ reposts; a Reddit post with 50+ upvotes;
        a store review 20+ people found helpful). Shares are source-weighted
        {mix
          ? ` (${mix[0] === "x" ? "X" : mix[0]} is ${fmtPct(mix[1])} of this period)`
          : ""}
        ; trends use store reviews and forums only.
      </MutedNote>
    </Tile>
  );
}
