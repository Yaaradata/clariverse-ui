import { DeliverablesLedger } from "@/components/natwest-pulse/DeliverablesLedger";
import { ServicePromiseView } from "@/components/natwest-pulse/ServicePromiseView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { shellProps } from "@/lib/natwest-pulse/shellProps";
import { sliceBundle } from "@/lib/natwest-pulse/slice";

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
