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
      `}</style>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static boot script, no user input
        dangerouslySetInnerHTML={{ __html: THEME_BOOT }}
      />
      {children}
    </>
  );
}
