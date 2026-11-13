import { PriorityView } from "@/components/natwest-pulse/PriorityView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { shellProps } from "@/lib/natwest-pulse/shellProps";
import { sliceBundle } from "@/lib/natwest-pulse/slice";

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
