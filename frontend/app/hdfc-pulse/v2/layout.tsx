import type { ReactNode } from "react";

import { THEME_BOOT, THEME_CSS } from "@/lib/hdfc-v3/theme";

/** V2 only: the light and dark palettes, and the saved theme applied before first paint. */
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
