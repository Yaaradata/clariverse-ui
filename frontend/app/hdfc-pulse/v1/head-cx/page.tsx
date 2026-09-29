import { ExecPage } from "@/components/hdfc-pulse-v1/ExecPage";
import { Shell } from "@/components/hdfc-pulse-v1/Shell";
import { loadBundle } from "@/lib/hdfc-pulse-v1/load";
import { shellProps } from "@/lib/hdfc-pulse-v1/shellProps";

export default function HeadCxPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="Head of CX"
      subtitle="The same listening at working altitude: every item with its owner and next action."
      view="head-cx"
    >
      <ExecPage b={b} view="head-cx" />
    </Shell>
  );
}
