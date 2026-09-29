import { PriorityView } from "@/components/hdfc-v3/PriorityView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";
import { sliceBundle } from "@/lib/hdfc-v3/slice";

export default function PriorityPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="Priority relationships"
      subtitle="Cohorts from the bank's own tiers and lists · Open over 5 and 24 hours · RM notified · High-impact complaints"
      drill
    >
      <PriorityView b={sliceBundle(b, { view: "priority" })} />
    </Shell>
  );
}
