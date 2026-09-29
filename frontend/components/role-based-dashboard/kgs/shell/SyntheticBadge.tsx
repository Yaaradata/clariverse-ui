"use client";

import { FlaskConical } from "lucide-react";

type SyntheticBadgeProps = {
  tooltip?: string;
  small?: boolean;
};

export function SyntheticBadge({ tooltip, small }: SyntheticBadgeProps) {
  const defaultTooltip =
    "Every figure, firmware version, serial, date code and partner ID on this screen is synthetic. Nothing here is a finding about any KGS product.";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: small ? "3px 8px" : "4px 10px",
        borderRadius: 999,
        background: "rgba(234, 179, 8, 0.1)",
        border: "1px dashed rgba(234, 179, 8, 0.5)",
        fontSize: small ? 10 : 12,
        fontWeight: 800,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "#fde047",
        zIndex: 60,
      }}
      title={tooltip || defaultTooltip}
    >
      <FlaskConical size={small ? 11 : 13} />
      SYNTHETIC SCENARIO — illustrative data, not KGS data
    </div>
  );
}
