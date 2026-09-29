"use client";

import { signalFw41 } from "@kgs/lib/data";
import { Info } from "lucide-react";
import { Popover } from "../shared/Popover";
import { K } from "../shared/tokens";
import { WhyRankedPopover } from "./WhyRankedPopover";

/** RankChip (03 §6.13): brand-tint pill "#1 of 5 · Why ranked here? ⓘ" opening WhyRankedPopover. */
export function RankChip() {
  const { whyRanked } = signalFw41.signal;
  return (
    <Popover
      label={whyRanked.title}
      width={460}
      trigger={
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: K.radius.pill,
            background: K.brandTint,
            color: K.violet300,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {whyRanked.title}
          <Info size={13} aria-hidden />
        </span>
      }
    >
      <WhyRankedPopover />
    </Popover>
  );
}
