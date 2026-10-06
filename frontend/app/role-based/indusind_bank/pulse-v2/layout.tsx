import type { Metadata } from "next";
import type { ReactNode } from "react";

import { THEME_BOOT, THEME_CSS } from "@/lib/indusind-v2/theme";

const HEADPHONES_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎧</text></svg>";

/** IndusInd pulse V2: a clone of the HDFC pulse V2 screens (/hdfc-pulse/v2). Never indexed. */
export const metadata: Metadata = {
  title: "LisN · IndusInd Bank",
  description:
    "Customer Pulse: what customers are saying, where it is heading and who needs to act.",
  icons: { icon: HEADPHONES_ICON },
  robots: { index: false, follow: false, nocache: true },
};

/** The light and dark palettes, and the saved theme applied before first paint. */
export default function V2Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{THEME_CSS}</style>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static boot script, no user input
        dangerouslySetInnerHTML={{ __html: THEME_BOOT }}
      />
      {children}
    </>
  );
}
