import type { ReactNode } from "react";

import { RoleBasedChrome } from "@/components/role-based-dashboard/RoleBasedChrome";

/** Avoid stale static HTML for industry/role counts after registry edits. */
export const dynamic = "force-dynamic";

export default function RoleBasedLayout({ children }: { children: ReactNode }) {
  return <RoleBasedChrome>{children}</RoleBasedChrome>;
}
