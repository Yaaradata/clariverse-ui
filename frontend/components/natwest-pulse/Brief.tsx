"use client";

/**
 * NatWest Group · morning brief by product (re-bound from the oct13 brief) and the product view behind each card.
 * Every line is generated from the figures by the pipeline (HL-29). "Copy to pack" copies the card as plain text.
 */

import { Check, ClipboardCopy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { OUTCOME_LABEL } from "@/lib/natwest-pulse/copy";
import {
  type BriefItem,
  fmtN,
  fmtP,
  type ProductBlock,
} from "@/lib/natwest-pulse/nw";
import { Delta, vsPrev } from "./Pulse";
import { C, Kpi, MONO, Table, Tile, tint } from "./primitives";

function CopyToPack({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      data-testid="copy-to-pack"
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => undefined);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12.5,
        color: C.textSec,
        background: C.cardAlt,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "3px 9px",
        cursor: "pointer",
      }}
    >
      {done ? <Check size={13} /> : <ClipboardCopy size={13} />}
      {done ? "Copied" : "Copy to pack"}
    </button>
  );
}

export function MorningBrief({
  items,
  hrefFor,
  windowLabel,
  showDelta,
}: {
  items: BriefItem[];
  hrefFor: Record<string, string>;
  windowLabel: string;
  showDelta: boolean;
}) {
  return (
    <Tile
      title="Morning brief by product"
      sub="One line per product"
      prov="internal"
      id="brief"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 10,
        }}
      >
        {items.map((it) => {
          const pack = `${it.label}: ${it.headline}. ${fmtN(it.complaints)} complaints, ${fmtP(it.negative_pct)} of contacts negative (${windowLabel}). Owner: ${it.owner}. ${it.action}. Consumer Duty: ${OUTCOME_LABEL[it.outcome]}. Internal, illustrative until discovery.`;
          return (
            <div
              key={it.id}
              data-testid="brief-card"
              style={{
                background: C.cardAlt,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "baseline",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href={hrefFor[it.id]}
                  style={{
                    fontWeight: 700,
                    color: C.text,
                    textDecoration: "none",
                  }}
                >
                  {it.label}
                </Link>
                <span
                  style={{ fontFamily: MONO, fontSize: 13, color: C.textSec }}
                >
                  {fmtN(it.complaints)} complaints{" "}
                  {showDelta ? (
                    <Delta
                      value={it.complaints_change_pct}
                      kind="pct"
                      worseWhen="neutral"
                    />
                  ) : null}
                </span>
              </div>
              <div style={{ fontSize: 14, color: C.textSec }}>
                {it.headline}
              </div>
              <div style={{ fontSize: 13, color: C.textMut }}>
                {it.owner} · {it.action}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: C.textSec,
                    border: `1px solid ${tint(C.cyan, 0.35)}`,
                    borderRadius: 999,
                    padding: "1px 8px",
                  }}
                >
                  {OUTCOME_LABEL[it.outcome]}
                </span>
                <CopyToPack text={pack} />
              </div>
            </div>
          );
        })}
      </div>
      {showDelta ? (
        <div style={{ fontSize: 12.5, color: C.textMut }}>
          Changes {vsPrev(windowLabel)}.
        </div>
      ) : null}
    </Tile>
  );
}

/** The product view (business route): the product's own slice only (HL-23). */
export function ProductView({
  p,
  windowLabel,
  showDelta,
}: {
  p: ProductBlock;
  windowLabel: string;
  showDelta: boolean;
}) {
  const vs = vsPrev(windowLabel);
  return (
    <>
      <Tile title={`${p.label}: pulse`} sub={p.owner} prov="internal">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 170px), 1fr))",
            gap: 10,
          }}
        >
          <Kpi
            label="Contacts"
            value={fmtN(p.contacts)}
            sub="Calls, Cora and branch"
          />
          <Kpi
            label="Negative share"
            value={fmtP(p.negative_pct)}
            sub={
              showDelta ? (
                <span>
                  <Delta value={p.negative_delta} kind="pts" /> {vs}
                </span>
              ) : (
                "Of contacts"
              )
            }
          />
          <Kpi
            label="Complaints"
            value={fmtN(p.complaints)}
            sub={
              showDelta ? (
                <span>
                  <Delta
                    value={p.complaints_change_pct}
                    kind="pct"
                    worseWhen="neutral"
                  />{" "}
                  {vs}
                </span>
              ) : (
                "In the window"
              )
            }
          />
          <Kpi label="Upheld" value={fmtP(p.upheld_pct)} sub="Of complaints" />
          <Kpi
            label="Closed within 3 days"
            value={fmtP(p.closed_3d_pct)}
            sub="Of complaints"
          />
        </div>
      </Tile>
      <Tile
        title={`${p.label}: themes`}
        sub="Ordered by complaints"
        prov="internal"
      >
        <Table
          head={[
            "Theme",
            "Contacts",
            "Negative",
            "Complaints",
            showDelta ? "Change" : "Outcome",
            "Owner",
          ]}
          align={["left", "right", "right", "right", "right", "left"]}
          rows={p.themes.map((t) => [
            <strong key="l" style={{ color: C.text }}>
              {t.label}
            </strong>,
            <span key="c" style={{ fontFamily: MONO }}>
              {fmtN(t.contacts)}
            </span>,
            <span key="n" style={{ fontFamily: MONO }}>
              {fmtP(t.negative_pct)}
            </span>,
            <span key="k" style={{ fontFamily: MONO }}>
              {fmtN(t.complaints)}
            </span>,
            showDelta ? (
              <Delta
                key="d"
                value={t.complaints_change_pct}
                kind="pct"
                worseWhen="neutral"
              />
            ) : (
              <span key="o">{OUTCOME_LABEL[t.outcome]}</span>
            ),
            <span key="w">{t.owner}</span>,
          ])}
        />
      </Tile>
    </>
  );
}
