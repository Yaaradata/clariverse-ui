"use client";

import React, { useState } from "react";
import { Mail, MessageCircle, Mic } from "lucide-react";

import type { ReturnsChannelEvidence, ReturnsEvidenceChannel } from "../../lib/categoryDetailData";
import { AiMarker } from "./AiMarker";
import { cssVar, radius, space, type } from "../../theme/tokens";

const CHANNEL_ICONS: Record<ReturnsEvidenceChannel, typeof Mic> = {
  voice: Mic,
  chat: MessageCircle,
  email: Mail,
};

function ChannelColumn({
  channel,
  active,
  onSelect,
}: {
  channel: ReturnsChannelEvidence;
  active: boolean;
  onSelect: () => void;
}): React.ReactElement {
  const Icon = CHANNEL_ICONS[channel.channel];

  const sideBorder = `1px solid ${active ? channel.color : cssVar("border")}`;

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space["2"],
        minWidth: 0,
        flex: 1,
        textAlign: "left",
        background: active ? `${channel.color}0C` : cssVar("surface-raised"),
        borderTop: `3px solid ${channel.color}`,
        borderRight: sideBorder,
        borderBottom: sideBorder,
        borderLeft: sideBorder,
        borderRadius: radius.md,
        padding: space["3"],
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "border-color 0.15s ease, background 0.15s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: radius.sm,
            background: `${channel.color}22`,
            color: channel.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} strokeWidth={2.25} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: type.scale.small, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>
            {channel.label}
          </div>
          <div style={{ fontSize: type.scale.caption, color: cssVar("text-muted"), lineHeight: 1.35 }}>
            {channel.count} signals · {channel.sharePct}%
          </div>
        </div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: channel.color, letterSpacing: "0.03em" }}>{channel.theme}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: space["2"] }}>
        {channel.items.map((item) => (
          <div
            key={item.meta}
            style={{
              padding: "10px 11px",
              borderRadius: radius.sm,
              background: active ? `${channel.color}10` : cssVar("surface"),
              border: `1px solid ${active ? `${channel.color}33` : cssVar("border")}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: type.scale.caption,
                color: cssVar("text-primary"),
                lineHeight: 1.45,
                fontStyle: "italic",
              }}
            >
              &ldquo;{item.quote}&rdquo;
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 10, color: cssVar("text-muted"), lineHeight: 1.35 }}>{item.meta}</p>
          </div>
        ))}
      </div>
    </button>
  );
}

export function CustomerChannelEvidence({
  channels,
  title = "Customer evidence",
  subtitle = "Sizing mismatch · not buyer remorse",
}: {
  channels: ReturnsChannelEvidence[];
  title?: string;
  subtitle?: string;
}): React.ReactElement {
  const [activeChannel, setActiveChannel] = useState<ReturnsEvidenceChannel>("voice");

  return (
    <div
      style={{
        background: cssVar("surface"),
        border: `1px solid ${cssVar("border")}`,
        borderRadius: radius.lg,
        padding: space["4"],
        display: "flex",
        flexDirection: "column",
        gap: space["3"],
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: space["3"],
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
          <AiMarker />
          <span style={{ fontSize: type.scale.body, fontWeight: type.weight.bold, color: cssVar("text-primary") }}>
            {title}
          </span>
        </div>
        <span style={{ fontSize: type.scale.caption, color: cssVar("text-muted") }}>{subtitle}</span>
      </div>

      <div
        style={{
          display: "flex",
          height: 8,
          borderRadius: radius.pill,
          overflow: "hidden",
          background: cssVar("border"),
        }}
      >
        {channels.map((ch) => (
          <div
            key={ch.channel}
            style={{
              width: `${ch.sharePct}%`,
              background: ch.color,
              opacity: activeChannel === ch.channel ? 1 : 0.55,
              transition: "opacity 0.15s ease",
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: space["3"],
          alignItems: "stretch",
        }}
      >
        {channels.map((ch) => (
          <ChannelColumn
            key={ch.channel}
            channel={ch}
            active={activeChannel === ch.channel}
            onSelect={() => setActiveChannel(ch.channel)}
          />
        ))}
      </div>
    </div>
  );
}
