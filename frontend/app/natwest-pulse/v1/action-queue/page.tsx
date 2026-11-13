import { AgentOutcomes } from "@/components/natwest-pulse/ActionQueue";
import { DeliverablesLedger } from "@/components/natwest-pulse/DeliverablesLedger";
import { Shell } from "@/components/natwest-pulse/Shell";
import { SCREEN_COPY } from "@/lib/natwest-pulse/copy";
import {
  askFor,
  frame,
  nwSlice,
  registerEntries,
  type SearchParams,
  selection,
} from "@/lib/natwest-pulse/natwest";

/** S-AGENTS AI-agent outcomes, with the timelines ledger. */
export default async function AgentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { w, b } = await selection(searchParams);
  const s = nwSlice(w, b);
  return (
    <Shell
      frame={frame(w, b)}
      ask={askFor(w, b)}
      screen="agents"
      title={SCREEN_COPY.agents.title}
      subtitle={SCREEN_COPY.agents.subtitle}
    >
      <AgentOutcomes agents={s.agents} />
      <DeliverablesLedger
        rows={s.ledger}
        register={registerEntries(s.ledger.map((r) => r.register))}
      />
    </Shell>
  );
}
