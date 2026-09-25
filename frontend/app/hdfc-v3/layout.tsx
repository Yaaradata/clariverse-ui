import type { Metadata } from "next";
import type { ReactNode } from "react";

import { RoleBasedChrome } from "@/components/role-based-dashboard/RoleBasedChrome";

const HEADPHONES_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎧</text></svg>";

export const metadata: Metadata = {
  title: "LisN · HDFC Bank",
  description:
    "Customer Pulse: what customers are saying, where it is heading and who needs to act.",
  icons: { icon: HEADPHONES_ICON },
};

/** Reuses the role-based chrome (dark canvas, Outfit / JetBrains Mono) so /hdfc-v3 matches the existing dashboards. */
export default function HdfcV3Layout({ children }: { children: ReactNode }) {
  return <RoleBasedChrome>{children}</RoleBasedChrome>;
}
