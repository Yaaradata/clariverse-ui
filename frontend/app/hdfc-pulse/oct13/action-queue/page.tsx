import { ActionQueue } from "@/components/hdfc-oct13/ActionQueue";
import { Shell } from "@/components/hdfc-oct13/Shell";
import { loadBundle } from "@/lib/hdfc-oct13/load";
import { shellProps } from "@/lib/hdfc-oct13/shellProps";
import { sliceBundle } from "@/lib/hdfc-oct13/slice";

export default function ActionQueuePage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="Action queue: escalation email triage"
      subtitle="20 synthetic L2 escalation emails · Six buckets · Draft replies for a person to approve"
      drill
    >
      <ActionQueue b={sliceBundle(b, { view: "action-queue" })} />
    </Shell>
  );
}
