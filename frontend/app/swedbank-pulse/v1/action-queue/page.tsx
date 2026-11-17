import { ActionQueue } from "@/components/swedbank-pulse/ActionQueue";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

export default function ActionQueuePage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="Action queue: complaint escalation triage"
      subtitle="Complaint escalations · Six buckets · Draft replies for a person to approve"
      drill
    >
      <ActionQueue b={sliceBundle(b, { view: "action-queue" })} />
    </Shell>
  );
}
