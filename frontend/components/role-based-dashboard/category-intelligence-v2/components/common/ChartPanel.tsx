"use client";

import React from "react";
import { cssVar, radius, space, type } from "../../theme/tokens";
import { ScreenBackBar } from "./ScreenBackBar";

export function ChartPanel({
  title,
  subtitle,
  subtitlePlacement = "header",
  headerTag,
  headerEnd,
  children,
  height,
}: {
  title: string;
  subtitle?: React.ReactNode;
  /** Subtitle under the title (HTML card-head) or footer caption. */
  subtitlePlacement?: "header" | "footer";
  headerTag?: string;
  /** Right-aligned content on the title row (e.g. chart legend). */
  headerEnd?: React.ReactNode;
  children: React.ReactNode;
  height?: number | string;
}): React.ReactElement {
  const subtitleStyle: React.CSSProperties = {
    fontSize: type.scale.caption,
    color: cssVar("text-muted"),
    lineHeight: 1.4,
    margin: 0,
  };

  return (
    <div
      style={{
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.lg,
        padding: space["4"],
        height: height ?? "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: space["3"],
          marginBottom: subtitlePlacement === "header" && subtitle ? space["1"] : 0,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: space["3"],
            }}
          >
            <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary"), lineHeight: 1.3 }}>
              {title}
            </div>
            {headerEnd ? <div style={{ flexShrink: 0 }}>{headerEnd}</div> : null}
          </div>
          {subtitlePlacement === "header" && subtitle ? <div style={subtitleStyle}>{subtitle}</div> : null}
        </div>
        {headerTag ? (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: cssVar("severity-med"),
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {headerTag}
          </span>
        ) : null}
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>{children}</div>
      {subtitlePlacement === "footer" && subtitle ? (
        <div
          style={{
            ...subtitleStyle,
            flexShrink: 0,
            marginTop: "auto",
            paddingTop: space["2"],
            borderTop: `1px solid ${cssVar("border")}`,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

export function DetailPageHeader({
  title,
  subtitle,
  accentWord,
  accentWord2,
  onBack,
}: {
  title: string;
  subtitle: React.ReactNode;
  accentWord?: string;
  accentWord2?: string;
  onBack?: () => void;
}): React.ReactElement {
  const renderTitle = (): React.ReactNode => {
    if (!accentWord) return title;

    const parts = title.split(accentWord);
    if (parts.length !== 2) {
      return (
        <>
          {parts[0]}
          <span style={{ color: cssVar("accent"), fontWeight: 800 }}>{accentWord}</span>
          {parts[1]}
        </>
      );
    }

    if (accentWord2 && parts[1].includes(accentWord2)) {
      const subParts = parts[1].split(accentWord2);
      return (
        <>
          {parts[0]}
          <span style={{ color: cssVar("accent"), fontWeight: 800 }}>{accentWord}</span>
          {subParts[0]}
          <span
            style={{
              color: cssVar("accent-2"),
              fontWeight: 800,
              boxShadow: `inset 0 -3px 0 ${cssVar("accent")}40`,
            }}
          >
            {accentWord2}
          </span>
          {subParts[1]}
        </>
      );
    }

    return (
      <>
        {parts[0]}
        <span style={{ color: cssVar("accent"), fontWeight: 800 }}>{accentWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: space["4"],
        width: "100%",
      }}
    >
      <div style={{ borderLeft: `3px solid ${cssVar("accent")}`, paddingLeft: 14, maxWidth: 920, minWidth: 0, flex: 1 }}>
        <h2
          style={{
            margin: 0,
            fontSize: type.scale.display,
            fontWeight: type.weight.bold,
            color: cssVar("text-primary"),
            lineHeight: 1.12,
            letterSpacing: -0.55,
          }}
        >
          {renderTitle()}
        </h2>
        <p
          style={{
            margin: `${space["2"]} 0 0`,
            fontSize: type.scale.small,
            color: cssVar("text-secondary"),
            lineHeight: 1.5,
            maxWidth: 720,
          }}
        >
          {subtitle}
        </p>
      </div>
      {onBack ? <ScreenBackBar onBack={onBack} /> : null}
    </div>
  );
}

export function SectionHeader({ title, hint }: { title: string; hint?: string }): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: space["3"],
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>{title}</div>
      {hint ? <div style={{ fontSize: type.scale.caption, color: cssVar("text-muted") }}>{hint}</div> : null}
    </div>
  );
}
