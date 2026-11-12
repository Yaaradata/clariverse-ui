import { PriorityView } from "@/components/hdfc-oct13/PriorityView";
import { Shell } from "@/components/hdfc-oct13/Shell";
import { loadBundle } from "@/lib/hdfc-oct13/load";
import { shellProps } from "@/lib/hdfc-oct13/shellProps";
import { sliceBundle } from "@/lib/hdfc-oct13/slice";

export default function PriorityPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="Priority relationships"
      subtitle="Cohorts from the bank's own tiers and lists · Open over 5 and 24 hours · RM notified · High-impact complaints"
      drill
    >
      <PriorityView b={sliceBundle(b, { view: "priority" })} />
    </Shell>
  );
}
