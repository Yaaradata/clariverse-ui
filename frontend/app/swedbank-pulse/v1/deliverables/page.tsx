import { DeliverablesLedger } from "@/components/swedbank-pulse/DeliverablesLedger";
import { ServicePromiseView } from "@/components/swedbank-pulse/ServicePromiseView";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

export default function DeliverablesPage() {
  const b = loadBundle();
  const sliced = sliceBundle(b, { view: "standards" });
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="Are we meeting our service standards?"
      subtitle="Service standards ledger · By product · Escalation ladder · Transparency gap · Cure watch · Disputes"
      drill
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DeliverablesLedger b={sliced} />
        <ServicePromiseView b={sliced} />
      </div>
    </Shell>
  );
}
