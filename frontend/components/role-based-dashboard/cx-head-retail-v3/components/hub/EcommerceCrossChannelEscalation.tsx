"use client";

import React, { useMemo } from "react";
import type { CustomerHappinessDrill } from "../../lib/cxHeadRetailV3HubCards";
import {
  IMPACT_CHANNEL_META,
  buildEscalationMatrix,
  buildImpactChannelIndex,
  escalationHeatTone,
  escalationMatrixMax,
} from "../../lib/ecommerceCrossChannelEscalationData";
import { cssVar } from "../../theme/tokens";

function ChannelHeader({ channel }: { channel: string }): React.ReactElement {
  const meta = IMPACT_CHANNEL_META[channel];
  const Icon = meta?.icon;
  const color = meta?.color ?? cssVar("accent");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 56 }}>
      {Icon ? <Icon size={16} color={color} /> : null}
      <span style={{ fontSize: 10, fontWeight: 600, color: cssVar("text-secondary"), lineHeight: 1.25, textAlign: "center" }}>
        {channel}
      </span>
    </div>
  );
}

export function EcommerceCrossChannelEscalation({
  channels,
  escalationFlows,
}: {
  channels: CustomerHappinessDrill["channels"];
  escalationFlows: CustomerHappinessDrill["escalationFlows"];
}): React.ReactElement {
  const channelNames = useMemo(() => channels.map((channel) => channel.name), [channels]);
  const impactByChannel = useMemo(() => buildImpactChannelIndex(channels), [channels]);

  const matrix = useMemo(
    () => buildEscalationMatrix(channelNames, escalationFlows),
    [channelNames, escalationFlows],
  );

  const maxCount = useMemo(() => escalationMatrixMax(matrix), [matrix]);

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
          <thead>
            <tr>
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  fontSize: 12,
                  fontWeight: 700,
                  color: cssVar("text-secondary"),
                }}
              >
                Origin channels
              </th>
              {channelNames.map((target) => (
                <th key={target} style={{ padding: "10px 8px", textAlign: "center" }}>
                  <ChannelHeader channel={target} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channelNames.map((origin) => {
              const meta = IMPACT_CHANNEL_META[origin];
              const OriginIcon = meta?.icon;
              const originColor = meta?.color ?? cssVar("accent");
              const impact = impactByChannel.get(origin);

              return (
                <tr key={origin}>
                  <td style={{ padding: "10px 12px", minWidth: 148 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {OriginIcon ? <OriginIcon size={16} color={originColor} /> : null}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: cssVar("text-primary") }}>{origin}</div>
                        {impact ? (
                          <div style={{ fontSize: 10, color: cssVar("text-muted"), marginTop: 2 }}>
                            {impact.mentions} mentions
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  {channelNames.map((target) => {
                    const count = matrix[origin]?.[target] ?? 0;
                    const tone = escalationHeatTone(count, maxCount);
                    return (
                      <td
                        key={`${origin}-${target}`}
                        style={{
                          padding: 12,
                          textAlign: "center",
                          background: tone.bg,
                          boxShadow: tone.glow,
                          borderRadius: 6,
                        }}
                      >
                        {count > 0 ? (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <span className="lisn-num" style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                              {count}
                            </span>
                            <span style={{ fontSize: 10, color: cssVar("text-secondary") }}>customers</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: cssVar("text-muted") }}>-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
