import type { ShellProps } from "@/components/hdfc-v3/Shell";
import type { Bundle } from "./types";

/** The slice of the bundle the shell needs (Ask LisN answers and the evidence they cite). */
export function shellProps(
  b: Bundle,
): Pick<ShellProps, "meta" | "ask" | "askEvidence"> {
  const askEvidence: ShellProps["askEvidence"] = {};
  for (const p of b.ask.prompts) {
    for (const id of p.evidence) {
      const e = b.evidence[id];
      if (e)
        askEvidence[id] = {
          id: e.id,
          summary: e.summary,
          source_label: e.source_label,
          created_at: e.created_at,
          themes: e.themes,
        };
    }
  }
  return { meta: b.meta, ask: b.ask, askEvidence };
}
