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
        /* The role-based shell: a 64px icon rail beside the page; on phones the rail becomes a strip on top. */
        .ind-shell { display: grid; grid-template-columns: 64px minmax(0, 1fr); }
        .ind-rail { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; align-items: center;
          gap: 12px; padding: 16px 0; background: var(--v2-card-alt); border-right: 1px solid var(--v2-border); z-index: 40; }
        .ind-rail-home { width: 36px; height: 36px; border-radius: 11px; background: #241a44; border: 1px solid #8b5cf6;
          display: flex; align-items: center; justify-content: center; color: #8b5cf6; font-weight: 900; font-size: 15px;
          text-decoration: none; }
        .ind-rail-rule { width: 34px; height: 1px; background: var(--v2-border); }
        .ind-rail-item { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center;
          justify-content: center; color: var(--v2-text-mut); border-left: 3px solid transparent; }
        .ind-rail-item:hover { color: var(--v2-text); background: var(--v2-hover); }
        .ind-rail-on { color: #8b5cf6; background: #221a40; border-left-color: #8b5cf6; }
        .ind-rail-fill { flex: 1; }
        .ind-rail-me { width: 32px; height: 32px; border-radius: 9px; background: var(--v2-inner); display: flex;
          align-items: center; justify-content: center; color: var(--v2-text-mut); font-size: 12px; font-weight: 800; }
        @media (max-width: 640px) {
          .ind-shell { grid-template-columns: minmax(0, 1fr); }
          .ind-rail { height: auto; flex-direction: row; justify-content: flex-start; padding: 8px 12px; gap: 6px;
            border-right: none; border-bottom: 1px solid var(--v2-border); overflow-x: auto; }
          .ind-rail-rule, .ind-rail-fill { display: none; }
        }
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
