import { DeliverablesLedger } from "@/components/hdfc-v3/DeliverablesLedger";
import { ServicePromiseView } from "@/components/hdfc-v3/ServicePromiseView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

export default function DeliverablesPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="Are we meeting our deliverables?"
      subtitle="Deliverables ledger · By product · Escalation ladder · Transparency gap · Cure watch · Disputes"
      drill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DeliverablesLedger b={b} />
        <ServicePromiseView b={b} />
      </div>
    </Shell>
  );
}
