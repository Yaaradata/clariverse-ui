"use client";

import React from "react";
import type { HubCardId } from "../../lib/cxHeadRetailV3HubCards";
import { HUB_PAGE_PURPOSE } from "../../lib/cxHeadRetailV3HubCards";
import { cssVar, space, type } from "../../theme/tokens";

const accentSpan: React.CSSProperties = {
  color: cssVar("accent"),
  fontWeight: 800,
};

const accent2Span: React.CSSProperties = {
  color: cssVar("accent-2"),
  fontWeight: 800,
  boxShadow: `inset 0 -3px 0 ${cssVar("accent")}40`,
};

function HubHeadlineTitle({ variant }: { variant: HubCardId }): React.ReactElement {
  switch (variant) {
    case "customer-happiness":
      return (
        <>
          Are our{" "}
          <span style={accent2Span}>customers</span>{" "}
          <span style={accentSpan}>happy</span>
          <span style={{ color: cssVar("accent") }}>?</span>
        </>
      );
    case "brand-risk":
      return (
        <>
          Where is customer <span style={accentSpan}>trust</span> breaking — and{" "}
          <span style={accent2Span}>why</span>
          <span style={{ color: cssVar("accent") }}>?</span>
        </>
      );
    case "service-delivery":
      return (
        <>
          How is our <span style={accentSpan}>service</span>{" "}
          <span style={accent2Span}>delivery</span>
          <span style={{ color: cssVar("accent") }}>?</span>
        </>
      );
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export function HubFluidHeadline({
  variant,
  trailing,
}: {
  variant: HubCardId;
  /** Aligned top-right on the headline row (e.g. Back to Overview). */
  trailing?: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      style={{
        borderLeft: `3px solid ${cssVar("accent")}`,
        paddingLeft: 14,
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <h2
          style={{
            margin: 0,
            flex: 1,
            minWidth: 0,
            fontSize: type.scale.display,
            fontWeight: type.weight.bold,
            color: cssVar("text-primary"),
            lineHeight: 1.12,
            letterSpacing: -0.55,
          }}
        >
          <HubHeadlineTitle variant={variant} />
        </h2>
        {trailing ? <div style={{ flexShrink: 0 }}>{trailing}</div> : null}
      </div>
      <p
        style={{
          margin: `${space["2"]} 0 0`,
          fontSize: type.scale.small,
          color: cssVar("text-secondary"),
          lineHeight: 1.5,
          maxWidth: 720,
        }}
      >
        {HUB_PAGE_PURPOSE[variant]}
      </p>
    </div>
  );
}
