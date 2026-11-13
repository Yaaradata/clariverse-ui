import { ActionQueue } from "@/components/natwest-pulse/ActionQueue";
import { Shell } from "@/components/natwest-pulse/Shell";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { shellProps } from "@/lib/natwest-pulse/shellProps";
import { sliceBundle } from "@/lib/natwest-pulse/slice";

export default function ActionQueuePage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="Action queue: escalation email triage"
      subtitle="20 synthetic second-line escalation emails · Six buckets · Draft replies for a person to approve"
      drill
    >
      <ActionQueue b={sliceBundle(b, { view: "action-queue" })} />
    </Shell>
  );
}
