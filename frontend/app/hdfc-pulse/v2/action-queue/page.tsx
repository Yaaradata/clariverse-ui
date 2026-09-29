import { ActionQueue } from "@/components/hdfc-v3/ActionQueue";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { sliceBundle } from "@/lib/hdfc-v3/slice";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

export default function ActionQueuePage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="Action queue: escalation email triage"
      subtitle="20 synthetic L2 escalation emails · Six buckets · Draft replies for a person to approve"
      drill
    >
      <ActionQueue b={sliceBundle(b, { view: "action-queue" })} />
    </Shell>
  );
}
