import { DeliverablesLedger } from "@/components/hdfc-oct13/DeliverablesLedger";
import { ServicePromiseView } from "@/components/hdfc-oct13/ServicePromiseView";
import { Shell } from "@/components/hdfc-oct13/Shell";
import { loadBundle } from "@/lib/hdfc-oct13/load";
import { shellProps } from "@/lib/hdfc-oct13/shellProps";
import { sliceBundle } from "@/lib/hdfc-oct13/slice";

export default function DeliverablesPage() {
  const b = loadBundle();
  const sliced = sliceBundle(b, { view: "deliverables" });
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="Are we meeting our deliverables?"
      subtitle="Deliverables ledger · By product · Escalation ladder · Transparency gap · Cure watch · Disputes"
      drill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DeliverablesLedger b={sliced} />
        <ServicePromiseView b={sliced} />
      </div>
    </Shell>
  );
}
