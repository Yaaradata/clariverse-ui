"use client";

import React, { useEffect, useState } from "react";
import { useAnimatedNumber } from "./useAnimatedNumber";

/**
 * Parse display strings used on Network Health into a numeric target + format.
 * Returns null when the value is non-numeric (pills, labels).
 * Uses fresh const matches (no reassignment) to avoid TDZ issues under bundlers.
 */
export function parseRunningValue(raw) {
  if (raw == null) return null;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    const decimals = Number.isInteger(raw) ? 0 : 1;
    return { num: raw, prefix: "", suffix: "", decimals, locale: "en-IN" };
  }

  const s = String(raw).trim();
  if (!s) return null;

  // +1,400 / −700 (open backlog day-over-day)
  const signedCount = s.match(/^([+−-])([\d,]+)$/);
  if (signedCount) {
    const num = Number(signedCount[2].replace(/,/g, ""));
    if (!Number.isFinite(num)) return null;
    return {
      num,
      prefix: signedCount[1] === "-" || signedCount[1] === "−" ? "−" : "+",
      suffix: "",
      decimals: 0,
      locale: "en-IN",
    };
  }

  // ↘ 5 / ↗ 2.8 (ledger tip chips)
  const tipChip = s.match(/^([↘↗])\s*(\d+(?:\.\d+)?)$/);
  if (tipChip) {
    return {
      num: parseFloat(tipChip[2]),
      prefix: `${tipChip[1]} `,
      suffix: "",
      decimals: tipChip[2].includes(".") ? 1 : 0,
    };
  }

  // 8.1 30D | 4 pts 7D | 1,900 90D
  const periodCmp = s.match(/^([\d,]+(?:\.\d+)?)(\s+(?:pts\s+)?(?:7D|30D|90D|WoW|MoM))$/i);
  if (periodCmp) {
    const num = Number(periodCmp[1].replace(/,/g, ""));
    if (!Number.isFinite(num)) return null;
    return {
      num,
      prefix: "",
      suffix: periodCmp[2],
      decimals: periodCmp[1].includes(".") ? 1 : 0,
      locale: periodCmp[1].includes(",") ? "en-IN" : undefined,
    };
  }

  // +3.1d / -0.5d
  const dayDelta = s.match(/^([+-])(\d+(?:\.\d+)?)(d)$/i);
  if (dayDelta) {
    return {
      num: parseFloat(dayDelta[2]),
      prefix: dayDelta[1],
      suffix: "d",
      decimals: dayDelta[2].includes(".") ? 1 : 0,
    };
  }

  // 3.2× (hub volume weight)
  const times = s.match(/^(\d+(?:\.\d+)?)(×)$/);
  if (times) {
    return {
      num: parseFloat(times[1]),
      prefix: "",
      suffix: "×",
      decimals: times[1].includes(".") ? 1 : 0,
    };
  }

  // 18.4m
  const millions = s.match(/^(\d+(?:\.\d+)?)(m)$/i);
  if (millions) {
    return {
      num: parseFloat(millions[1]),
      prefix: "",
      suffix: "m",
      decimals: millions[1].includes(".") ? 1 : 0,
    };
  }

  // +43K / 28.6k …rest  |  8k shipments exposed
  const thousands = s.match(/^([+−-]?)(\d+(?:\.\d+)?)([kK])\b(.*)$/);
  if (thousands) {
    const sign = thousands[1] === "-" || thousands[1] === "−" ? "−" : thousands[1] === "+" ? "+" : "";
    return {
      num: parseFloat(thousands[2]),
      prefix: sign,
      suffix: `${thousands[3]}${thousands[4] || ""}`,
      decimals: thousands[2].includes(".") ? 1 : 0,
    };
  }

  // 63% | 4.2% | 11.2%
  const pct = s.match(/^(\d+(?:\.\d+)?)(%)$/);
  if (pct) {
    return {
      num: parseFloat(pct[1]),
      prefix: "",
      suffix: "%",
      decimals: pct[1].includes(".") ? 1 : 0,
    };
  }

  // 2,14,600 | 214600 | 12.5
  const plain = s.match(/^([\d,]+(?:\.\d+)?)$/);
  if (plain) {
    const num = Number(plain[1].replace(/,/g, ""));
    if (!Number.isFinite(num)) return null;
    return {
      num,
      prefix: "",
      suffix: "",
      decimals: plain[1].includes(".") ? 1 : 0,
      locale: "en-IN",
    };
  }

  return null;
}

function formatRunning(parsed, animated) {
  const { prefix = "", suffix = "", decimals = 0, locale } = parsed;
  let body;
  if (locale) {
    body = animated.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  } else if (decimals > 0) {
    body = animated.toFixed(decimals);
  } else {
    body = String(Math.round(animated));
  }
  return `${prefix}${body}${suffix}`;
}

/** Count-up / period-tween display for KPI-style strings and numbers. */
export function RunningValue({ value, duration = 850, delay = 40, enabled = true }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const parsed = parseRunningValue(value);
  const target = parsed?.num ?? 0;
  const decimals = parsed?.decimals ?? 0;
  const canAnimate = mounted && enabled && !!parsed;
  const animated = useAnimatedNumber(target, {
    duration,
    decimals,
    delay,
    enabled: canAnimate,
  });

  // SSR + first client paint: render the raw string so hydration matches.
  if (!parsed || !mounted) return <span suppressHydrationWarning>{value}</span>;
  return <span suppressHydrationWarning>{formatRunning(parsed, animated)}</span>;
}
