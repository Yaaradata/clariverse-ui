import { PriorityView } from "@/components/swedbank-pulse/PriorityView";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

export default function PriorityPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="Priority customers"
      subtitle="Cohorts from the bank's own tiers and lists · Open over 5 and 24 hours · Owner notified · High-impact complaints"
      drill
    >
      <PriorityView b={sliceBundle(b, { view: "priority" })} />
    </Shell>
  );
}
