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

/** The timelines ledger on its own (also on the AI-agent outcomes screen). */
export default async function LedgerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { w, b } = await selection(searchParams);
  const rows = nwSlice(w, b).ledger;
  return (
    <Shell
      frame={frame(w, b)}
      ask={askFor(w, b)}
      screen="agents"
      title={SCREEN_COPY.ledger.title}
      subtitle={SCREEN_COPY.ledger.subtitle}
    >
      <DeliverablesLedger
        rows={rows}
        register={registerEntries(rows.map((r) => r.register))}
      />
    </Shell>
  );
}
