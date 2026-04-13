import type { ReactNode } from "react";

import { RoleBasedChrome } from "@/components/role-based-dashboard/RoleBasedChrome";

export default function RoleBasedLayout({ children }: { children: ReactNode }) {
  return <RoleBasedChrome>{children}</RoleBasedChrome>;
}
