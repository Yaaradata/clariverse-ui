import type { Metadata } from "next";
import type { ReactNode } from "react";

import { RoleBasedChrome } from "@/components/role-based-dashboard/RoleBasedChrome";

const HEADPHONES_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎧</text></svg>";

/** NatWest Group pulse (copied from app/hdfc-pulse/layout.tsx). Never indexed: page meta, X-Robots-Tag, robots.txt. */
export const metadata: Metadata = {
  title: "LisN · NatWest",
  description:
    "Customer Pulse: what customers are saying, where it is heading and who needs to act.",
  icons: { icon: HEADPHONES_ICON },
  robots: { index: false, follow: false, nocache: true },
};

export default function NatWestPulseLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RoleBasedChrome>{children}</RoleBasedChrome>;
}
