"use client";

/**
 * "My view" (30 Sep review, K5, stretch): the Ask LisN answers the user pinned, as panels. Session state only: held in
 * memory, never stored, cleared by a reload.
 */

import { X } from "lucide-react";
import Link from "next/link";

import { unpin, useAskSession } from "@/lib/indusind-v2/askSession";
import { AnswerBody } from "./AskBar";
import { C, cols, MutedNote, Tile } from "./primitives";

export function MyView() {
  const { pinned } = useAskSession();
  if (!pinned.length)
    return (
      <Tile title="Nothing pinned yet" prov="internal">
        <MutedNote>
          Ask LisN a question in the bar at the bottom of any screen, then
          choose &ldquo;Pin to my view&rdquo;. Pinned answers appear here as
          panels for this session.
        </MutedNote>
        <Link
          href="/role-based/indusind_bank/pulse-v2/mds-office"
          style={{ color: C.brandInk, fontSize: 14 }}
        >
          Open the MD&apos;s office / Head of CX view
        </Link>
      </Tile>
    );
  return (
    <>
      <div style={{ ...cols(2, 440, 14), alignItems: "start" }}>
        {pinned.map((a) => (
          <Tile
            key={a.key}
            title={a.q}
            sub={`${a.from} · ${a.period}`}
            prov={["internal", "public"]}
          >
            <AnswerBody a={a} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                flexWrap: "wrap",
                fontSize: 12.5,
                color: C.textMut,
              }}
            >
              <span>
                Precomputed from that view&apos;s data; no live model call.
              </span>
              <button
                type="button"
                onClick={() => unpin(a.key)}
                style={{
                  display: "inline-flex",
                  gap: 4,
                  alignItems: "center",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.textSec,
                  borderRadius: 8,
                  padding: "2px 9px",
                  fontSize: 12.5,
                  cursor: "pointer",
                }}
              >
                <X size={12} /> Remove
              </button>
            </div>
          </Tile>
        ))}
      </div>
      <MutedNote>
        Panels are kept for this session only and are cleared when the page is
        reloaded.
      </MutedNote>
    </>
  );
}
