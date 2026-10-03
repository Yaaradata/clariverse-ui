"use client";

/**
 * Needs you this week: four tiles in a 2×2 grid, the morning-brief block copied from the earlier LisN demo. Each tile
 * shows its headline, two or three figures and chips (peer, voice, rupee or exposure, owner, status). The drawer
 * follows the eight-part anatomy: what moved · peer context · what customers said · rupee line or exposure · owner ·
 * drafted action · approval state · evidence. Head of CX sees the evidence open; CEO's office can copy a card to the
 * pack.
 */

import { X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { fmtDate } from "@/lib/indusind-v1/format";
import type {
  Card,
  Common,
  Fig as FigT,
  Sens,
  TitlePart,
  ViewId,
} from "@/lib/indusind-v1/types";
import { CardVoiceBlock } from "./PublicVoice";
import {
  C,
  Chip,
  cols,
  Fig,
  Info,
  LAYER_LABEL,
  Label,
  MutedNote,
  OpenLink,
  Pending,
  SourceTag,
  tint,
} from "./primitives";

/** The fixed peer column: the three core peers, in this order. */
const CORE_PEERS = ["Federal Bank", "Yes Bank", "IDFC First Bank"];

export function TitleLine({ parts }: { parts: TitlePart[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.fig ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: title parts are positional
          <Fig key={i} f={p.fig} />
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: title parts are positional
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

function plainTitle(parts: TitlePart[]) {
  return parts.map((p) => (p.fig ? p.fig.display : p.text)).join("");
}

export function FigRow({ f, label }: { f: FigT; label?: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 10,
        fontSize: 13.5,
        padding: "3px 0",
      }}
    >
      <span style={{ color: C.textSec, minWidth: 0 }}>
        {label ?? f.label}
        {f.period ? (
          <span style={{ color: C.textMut }}> · {f.period}</span>
        ) : null}
      </span>
      <strong style={{ color: C.text, whiteSpace: "nowrap" }}>
        <Fig f={f} />
      </strong>
    </div>
  );
}

export function SensBlock({ s }: { s: Sens }) {
  return (
    <div
      data-register={s.id}
      style={{
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          fontSize: 13.5,
        }}
      >
        <span style={{ color: C.textSec }}>{s.label}</span>
        <strong style={{ whiteSpace: "nowrap" }}>
          {s.pending ? <Pending /> : s.display}
        </strong>
      </div>
      <details>
        <summary
          style={{ fontSize: 12.5, color: C.brandInk, cursor: "pointer" }}
        >
          Arithmetic
        </summary>
        <div
          style={{
            fontSize: 12.5,
            color: C.textSec,
            marginTop: 4,
            lineHeight: 1.5,
          }}
        >
          {s.formula_text}
          <br />
          {s.basis_note} {s.caveat}
        </div>
      </details>
    </div>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <Label>
        <span style={{ color: C.brandInk }}>{n}</span> {title}
      </Label>
      {children}
    </section>
  );
}

function peerRows(card: Card) {
  return CORE_PEERS.map((bank) => ({
    bank,
    figs: card.peers.filter((p) => (p.label ?? "").startsWith(bank)),
  }));
}

function evidence(card: Card): FigT[] {
  const all = [
    ...card.what,
    ...card.peers,
    ...(card.inside.figures ?? []),
    ...card.sensitivity.flatMap((s) => s.inputs),
  ];
  const seen = new Set<string>();
  return all.filter((f) => {
    if (!f.layer || seen.has(f.id)) return false;
    seen.add(f.id);
    return true;
  });
}

function packText(card: Card): string {
  const lines = [plainTitle(card.title_parts)];
  for (const f of card.what)
    lines.push(`${f.label} (${f.period}): ${f.display}`);
  for (const s of card.sensitivity)
    lines.push(`${s.label}: ${s.display}. ${s.caveat}`);
  if (card.exposure) lines.push(card.exposure);
  lines.push(
    `Owner: ${card.owner}. Drafted action: ${card.action.scope}. Status: ${card.action.status}.`,
  );
  const tags = new Set(evidence(card).map((f) => LAYER_LABEL[f.layer]));
  lines.push(`Sources: ${[...tags].join("; ")}.`);
  return lines.join("\n");
}

function Drawer({
  card,
  view,
  common,
  onClose,
}: {
  card: Card;
  view: ViewId;
  common: Common;
  onClose: () => void;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const a = card.action;
  return (
    <>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "rgba(0,0,0,0.4)",
          border: "none",
        }}
      />
      <aside
        role="dialog"
        aria-label={plainTitle(card.title_parts)}
        data-testid="card-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(560px, 100vw)",
          zIndex: 61,
          background: C.card,
          borderLeft: `1px solid ${C.border}`,
          overflowY: "auto",
          padding: "16px 18px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 10 }}
        >
          <h3
            style={{ margin: 0, fontSize: 17, lineHeight: 1.35, color: C.text }}
          >
            <TitleLine parts={card.title_parts} />
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: C.textSec,
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: C.amber,
            background: tint(C.amber, 0.08),
            borderRadius: 6,
            padding: "3px 8px",
          }}
        >
          {common.watermark}
        </div>

        <Section n={1} title="What moved">
          {card.what.map((f) => (
            <FigRow key={f.id + (f.period ?? "")} f={f} />
          ))}
        </Section>

        <Section n={2} title="Peer context">
          {peerRows(card).map((r) => (
            <div
              key={r.bank}
              style={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {r.figs.length ? (
                r.figs.map((f) => <FigRow key={f.id} f={f} />)
              ) : (
                <FigRow
                  label={r.bank}
                  f={{
                    id: "held",
                    layer: "L1",
                    value: null,
                    display: common.pending,
                    pending: true,
                  }}
                />
              )}
            </div>
          ))}
        </Section>

        <Section n={3} title="What customers and the market said">
          <CardVoiceBlock v={card.voice} />
          <MutedNote>{card.inside.text}</MutedNote>
          {card.inside.figures?.length ? (
            <div>
              {card.inside.figures.map((f) => (
                <FigRow key={f.id} f={f} />
              ))}
            </div>
          ) : null}
        </Section>

        <Section n={4} title={card.exposure ? "Exposure" : "Rupee line"}>
          {card.exposure ? (
            <div style={{ fontSize: 14, color: C.text }}>{card.exposure}</div>
          ) : (
            card.sensitivity.map((s) => <SensBlock key={s.id} s={s} />)
          )}
          <MutedNote>{common.sensitivity_footer}</MutedNote>
        </Section>

        <Section n={5} title="Owner">
          <div style={{ fontSize: 14, color: C.text }}>
            {card.owner}
            {card.with ? (
              <span style={{ color: C.textMut }}>, with {card.with}</span>
            ) : null}
          </div>
        </Section>

        <Section n={6} title="Drafted action">
          <dl
            style={{
              margin: 0,
              display: "grid",
              gridTemplateColumns: "max-content 1fr",
              gap: "4px 12px",
              fontSize: 13.5,
            }}
          >
            <dt style={{ color: C.textMut }}>Scope</dt>
            <dd style={{ margin: 0, color: C.text }}>{a.scope}</dd>
            <dt style={{ color: C.textMut }}>Ask</dt>
            <dd style={{ margin: 0, color: C.text }}>{a.ask}</dd>
            <dt style={{ color: C.textMut }}>Cost cap</dt>
            <dd style={{ margin: 0, color: C.text }}>
              {a.cost_cap_note ?? "None"}
            </dd>
            <dt style={{ color: C.textMut }}>Success</dt>
            <dd style={{ margin: 0, color: C.text }}>{a.success_measure}</dd>
            <dt style={{ color: C.textMut }}>Review</dt>
            <dd style={{ margin: 0, color: C.text }}>
              {fmtDate(a.review_date)}
            </dd>
          </dl>
        </Section>

        <Section n={7} title="Approval">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Chip label="Status" color={C.amber}>
              {a.status}
            </Chip>
            <Chip label="Approver" color={C.violet}>
              {a.approver_role}
            </Chip>
          </div>
          <OpenLink href="/role-based/indusind_bank/customer-pulse/approvals">
            Approvals
          </OpenLink>
        </Section>

        <Section n={8} title="Evidence">
          <details open={view === "cx"}>
            <summary
              style={{ fontSize: 13, color: C.brandInk, cursor: "pointer" }}
            >
              Sources, dates and layers
            </summary>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginTop: 6,
              }}
            >
              {evidence(card).map((f) => (
                <div
                  key={f.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    flexWrap: "wrap",
                    fontSize: 12.5,
                    color: C.textSec,
                    borderBottom: `1px solid ${C.border}`,
                    paddingBottom: 4,
                  }}
                >
                  <span style={{ minWidth: 0 }}>
                    {f.label}
                    {f.period ? ` · ${f.period}` : ""}
                    {f.layer === "L1" ? (
                      <span style={{ color: C.textMut }}>
                        {" "}
                        · source{" "}
                        {f.source_date
                          ? fmtDate(f.source_date)
                          : common.pending}
                      </span>
                    ) : null}
                  </span>
                  <SourceTag layer={f.layer} />
                </div>
              ))}
            </div>
          </details>
        </Section>
        {card.module ? <OpenLink href={card.module}>Open</OpenLink> : null}
      </aside>
    </>
  );
}

/** The tile's voice chip: the strongest topic line with enough items, else the thin state. */
function voiceChip(card: Card) {
  const v = card.voice;
  if (v.theme && !v.theme.thin)
    return `${v.theme.label} (${v.theme.count.display})`;
  const line = v.lines.find((l) => !l.thin);
  return line
    ? `${line.label} (${line.fig.display})`
    : "Not enough public items";
}

function CardTile({
  card,
  view,
  onOpen,
}: {
  card: Card;
  view: ViewId;
  onOpen: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const peer = card.peers[0];
  const sens = card.sensitivity[0];
  const layers = Array.from(new Set(evidence(card).map((f) => f.layer))).concat(
    ["L2" as const],
  );
  return (
    <section
      data-testid="signal-tile"
      data-card={card.id}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderTop: `3px solid ${C.amber}`,
        borderRadius: 14,
        padding: "14px 16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: 0,
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        style={{
          all: "unset",
          cursor: "pointer",
          fontSize: 15.5,
          fontWeight: 700,
          color: C.text,
          lineHeight: 1.4,
        }}
      >
        <TitleLine parts={card.title_parts} />
      </button>
      <div>
        {card.what.slice(0, 3).map((f) => (
          <FigRow key={f.id + (f.period ?? "")} f={f} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Chip label="Peer">
          {card.peers_held || !peer ? <Pending /> : <Fig f={peer} />}
        </Chip>
        <Chip label="Voice">{voiceChip(card)}</Chip>
        {card.exposure ? (
          <Chip label="Exposure" color={C.amber}>
            Not quantified
          </Chip>
        ) : sens ? (
          <Chip label="Rupee line" color={C.amber}>
            {sens.pending ? <Pending /> : sens.display}
          </Chip>
        ) : null}
        <Chip label="Owner" color={C.violet}>
          {card.owner}
        </Chip>
        <Chip label="Status" color={C.amber}>
          {card.action.status}
        </Chip>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginTop: "auto",
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Array.from(new Set(layers)).map((l) => (
            <SourceTag key={l} layer={l} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {view === "ceo" ? (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(packText(card)).then(
                  () => setCopied(true),
                  () => setCopied(false),
                );
              }}
              style={{
                background: "transparent",
                border: `1px solid ${C.border}`,
                color: C.textSec,
                borderRadius: 8,
                padding: "3px 9px",
                fontSize: 12.5,
                cursor: "pointer",
              }}
            >
              {copied ? "Copied" : "Copy to pack"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onOpen}
            style={{
              background: "transparent",
              border: "none",
              color: C.brandInk,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
            }}
          >
            Details
          </button>
          {card.module ? <OpenLink href={card.module}>Open</OpenLink> : null}
        </div>
      </div>
    </section>
  );
}

export function SignalCards({
  cards,
  view,
  common,
}: {
  cards: Card[];
  view: ViewId;
  common: Common;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const card = cards.find((c) => c.id === open) ?? null;
  return (
    <section
      id="needs-you"
      style={{ display: "flex", flexDirection: "column", gap: 10 }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        Needs you this week
        <Info text="The items in the pulse that need a decision. Each is sized on the book or tied to a dated obligation." />
      </h2>
      <div style={cols(2, 360, 12)}>
        {cards.map((c) => (
          <CardTile
            key={c.id}
            card={c}
            view={view}
            onOpen={() => setOpen(c.id)}
          />
        ))}
      </div>
      {card ? (
        <Drawer
          card={card}
          view={view}
          common={common}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  );
}
