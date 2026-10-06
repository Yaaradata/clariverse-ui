import { ActionQueue } from "@/components/indusind-v2/ActionQueue";
import { Shell } from "@/components/indusind-v2/Shell";
import { loadBundle } from "@/lib/indusind-v2/load";
import { shellProps } from "@/lib/indusind-v2/shellProps";
import { sliceBundle } from "@/lib/indusind-v2/slice";

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
