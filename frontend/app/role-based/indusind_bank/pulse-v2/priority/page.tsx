import { PriorityView } from "@/components/indusind-v2/PriorityView";
import { Shell } from "@/components/indusind-v2/Shell";
import { loadBundle } from "@/lib/indusind-v2/load";
import { shellProps } from "@/lib/indusind-v2/shellProps";
import { sliceBundle } from "@/lib/indusind-v2/slice";

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
