"use client";

import { usePathname } from "next/navigation";
import { useLabel } from "./DemoProvider";
import { meta } from "@kgs/lib/data";

export function DrillHeader() {
  const pathname = usePathname();
  const L = useLabel();

  // Get breadcrumb for current route
  const breadcrumbRaw = meta.breadcrumbs[pathname as keyof typeof meta.breadcrumbs];
  if (!breadcrumbRaw) return null;

  const breadcrumb = L(breadcrumbRaw);

  return (
    <div
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid #1f1f1f",
        background: "#151515",
      }}
    >
      <div
        style={{
          fontSize: 14,
          color: "#939394",
          lineHeight: 1.45,
        }}
      >
        {breadcrumb}
      </div>
    </div>
  );
}
