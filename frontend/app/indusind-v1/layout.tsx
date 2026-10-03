import type { Metadata } from "next";
import type { ReactNode } from "react";

import { THEME_BOOT, THEME_CSS } from "@/lib/indusind-v1/theme";

const HEADPHONES_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎧</text></svg>";

export const metadata: Metadata = {
  title: "LisN · Customer pulse",
  description: "Demonstration: public data plus illustrative internal data.",
  icons: { icon: HEADPHONES_ICON },
  // Behind Deployment Protection, and never indexed.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/** Fonts, the light and dark palettes, and the saved theme applied before first paint. */
export default function IndusIndLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        :root { --font: 'Outfit', system-ui, sans-serif; --mono: 'JetBrains Mono', monospace; }
        ${THEME_CSS}
        /* Phones: a table becomes one block per row, each cell a label and its value, so nothing sits off-screen. */
        @media (max-width: 640px) {
          .ind-table thead { display: none; }
          .ind-table tr { display: block; padding: 6px 0; }
          .ind-table td { display: flex; justify-content: space-between; gap: 12px; padding: 3px 10px !important; text-align: right !important; }
          .ind-table td::before { content: attr(data-label); color: var(--v2-text-mut); text-align: left; font-size: 12px; font-family: var(--font); }
          .ind-table td:first-child { text-align: left !important; font-weight: 600; }
          .ind-heat { font-size: 10.5px !important; border-spacing: 2px !important; }
          .ind-heat td, .ind-heat th { padding: 3px 2px !important; white-space: normal !important; }
        }
      `}</style>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static boot script, no user input
        dangerouslySetInnerHTML={{ __html: THEME_BOOT }}
      />
      {children}
    </>
  );
}
