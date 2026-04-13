import type { ReactNode } from "react";

/**
 * Wraps unified (Tailwind) embeds on `/role-based` so muted grays read clearly on near-black
 * backgrounds without changing accent colors or surface tokens.
 */
export function RoleBasedUnifiedReadingShell({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        /* Full width of the main pane — no max-width so content fits the viewport */
        "w-full min-w-0",
        "text-[16px] leading-relaxed",
        /* Lift common muted utility classes used inside unified components */
        "[&_.text-gray-400]:text-zinc-300",
        "[&_.text-gray-500]:text-zinc-400",
        "[&_.text-gray-600]:text-zinc-400",
        "[&_span.text-gray-400]:text-zinc-300",
        "[&_p.text-gray-400]:text-zinc-300",
        "[&_.text-muted-foreground]:text-zinc-300",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
