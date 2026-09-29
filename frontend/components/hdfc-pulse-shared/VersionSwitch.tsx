"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Switch between the two LisN HDFC demo versions, keeping the same screen where both versions have it.
 * V1 · first demo (before the Vidya call). V2 · after the Vidya call (B7 brief).
 */
const VERSIONS = [
  { id: "v1", label: "V1 · first demo" },
  { id: "v2", label: "V2 · after Vidya call" },
] as const;

/** Screens both versions share; anything else lands on the exec page. */
const SHARED = ["mds-office", "head-cx", "satisfaction", "market", "signal"];

function targetFor(pathname: string, to: "v1" | "v2"): string {
  const rest = pathname.replace(/^\/hdfc-pulse\/v[12]\/?/, "");
  const first = rest.split("/")[0];
  if (to === "v1" && first === "deliverables")
    return "/hdfc-pulse/v1/service-promise";
  if (to === "v2" && first === "service-promise")
    return "/hdfc-pulse/v2/deliverables";
  if (SHARED.includes(first)) {
    // Signal pages exist in both, except the release pulse in V2 is also a module; both keep the same id.
    return `/hdfc-pulse/${to}/${rest}`;
  }
  return `/hdfc-pulse/${to}/mds-office`;
}

export function VersionSwitch({
  current,
  colors,
}: {
  current: "v1" | "v2";
  colors: {
    text: string;
    textSec: string;
    textMut: string;
    border: string;
    on: string;
    onBorder: string;
  };
}) {
  const pathname = usePathname() ?? "";
  return (
    <fieldset
      aria-label="Version"
      data-testid="version-switch"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 14,
        border: "none",
        margin: 0,
        padding: 0,
      }}
    >
      <span style={{ color: colors.textMut }}>Version:</span>
      {VERSIONS.map((v) => {
        const on = v.id === current;
        return (
          <Link
            key={v.id}
            href={on ? pathname : targetFor(pathname, v.id)}
            aria-current={on ? "true" : undefined}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              textDecoration: "none",
              color: on ? colors.text : colors.textSec,
              background: on ? colors.on : "transparent",
              border: `1px solid ${on ? colors.onBorder : colors.border}`,
              fontWeight: on ? 700 : 500,
              whiteSpace: "nowrap",
            }}
          >
            {v.label}
          </Link>
        );
      })}
    </fieldset>
  );
}
