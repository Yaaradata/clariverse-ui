import type { ReactNode } from "react";

import { IndustryChrome } from "@/components/industry-dashboard/IndustryChrome";

export default function IndustryDashboardLayout({ children }: { children: ReactNode }) {
  return <IndustryChrome>{children}</IndustryChrome>;
}
