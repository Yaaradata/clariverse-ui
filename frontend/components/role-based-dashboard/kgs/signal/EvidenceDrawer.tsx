"use client";

import { signalFw41 } from "@kgs/lib/data";
import { Drawer } from "../shared/Overlay";
import { K } from "../shared/tokens";
import { CohortTab } from "./CohortTab";
import { LinkedRmaList } from "./LinkedRmaList";
import { MethodAuditTab } from "./MethodAuditTab";
import { SnippetCard } from "./SnippetCard";

export const EVIDENCE_TABS = ["snippets", "rmas", "cohort", "method"] as const;
export type EvidenceTab = (typeof EVIDENCE_TABS)[number];

const { evidence, drawer } = signalFw41;
const FEATURED = evidence
  .filter((e) => e.featured)
  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
const CHRONOLOGICAL = [...evidence].sort((a, b) =>
  a.timestampUtc.localeCompare(b.timestampUtc),
);

function Heading({ children }: { children: string }) {
  return (
    <h3
      style={{
        margin: "4px 0 0",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.04em",
        color: K.textMut,
      }}
    >
      {children}
    </h3>
  );
}

function Snippets() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Heading>{drawer.featuredHeading}</Heading>
      {FEATURED.map((e) => (
        <SnippetCard key={`f-${e.id}`} snippet={e} />
      ))}
      <Heading>{drawer.allHeading}</Heading>
      {CHRONOLOGICAL.map((e) => (
        <SnippetCard key={e.id} snippet={e} />
      ))}
    </div>
  );
}

function TabBody({ tab }: { tab: EvidenceTab }) {
  switch (tab) {
    case "snippets":
      return <Snippets />;
    case "rmas":
      return <LinkedRmaList />;
    case "cohort":
      return <CohortTab />;
    case "method":
      return <MethodAuditTab />;
    default: {
      const never: never = tab;
      return never;
    }
  }
}

/**
 * EvidenceDrawer (04 §4.10, 03 §6.7): right overlay, 520px, "Evidence · 23" with the synthetic
 * badge, four tabs, sticky footer. Esc and backdrop close it, focus is trapped, and focus returns
 * to the opener.
 */
export function EvidenceDrawer({
  tab,
  onTab,
  onClose,
}: {
  tab: EvidenceTab | null;
  onTab: (tab: EvidenceTab) => void;
  onClose: () => void;
}) {
  const active = tab ?? "snippets";
  return (
    <Drawer
      open={tab !== null}
      title={drawer.title}
      onClose={onClose}
      footer={drawer.footer}
    >
      <div
        role="tablist"
        aria-label={drawer.title}
        style={{
          position: "sticky",
          top: -16,
          zIndex: 1,
          margin: "-16px -16px 14px",
          padding: "10px 16px 0",
          display: "flex",
          gap: 4,
          background: K.elevated,
          borderBottom: `1px solid ${K.borderLight}`,
        }}
      >
        {EVIDENCE_TABS.map((id, i) => {
          const on = id === active;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`kgs-ev-tab-${id}`}
              aria-selected={on}
              aria-controls="kgs-ev-panel"
              onClick={() => onTab(id)}
              className="kgs-focus"
              style={{
                padding: "8px 10px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${on ? K.violet400 : "transparent"}`,
                color: on ? K.violet300 : K.textSec,
                fontSize: 13,
                fontWeight: on ? 700 : 500,
                fontFamily: "inherit",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {drawer.tabs[i]}
            </button>
          );
        })}
      </div>
      <div
        id="kgs-ev-panel"
        role="tabpanel"
        aria-labelledby={`kgs-ev-tab-${active}`}
      >
        <TabBody tab={active} />
      </div>
    </Drawer>
  );
}
