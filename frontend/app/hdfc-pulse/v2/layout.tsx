import { JetBrains_Mono, Outfit } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

import { THEME_BOOT, THEME_CSS } from "@/lib/hdfc-v3/theme";

// B11 item 9: fonts are bundled at build time (next/font), so the demo runs offline from a local build.
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit-local",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-mono-local",
  display: "swap",
});

/** V2 only: the light and dark palettes, and the saved theme applied before first paint. */
export default function V2Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{THEME_CSS}</style>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static boot script, no user input
        dangerouslySetInnerHTML={{ __html: THEME_BOOT }}
      />
      <div
        className={`${outfit.variable} ${mono.variable}`}
        style={
          {
            display: "contents",
            "--font": "var(--font-outfit-local), 'Outfit'",
            "--mono": "var(--font-mono-local), 'JetBrains Mono'",
          } as CSSProperties
        }
      >
        {children}
      </div>
    </>
  );
}
