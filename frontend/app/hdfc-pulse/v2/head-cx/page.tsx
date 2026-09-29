import { ExecPage } from "@/components/hdfc-v3/ExecPage";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";
import { sliceBundle } from "@/lib/hdfc-v3/slice";

export default function HeadCxPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="Head of CX"
      subtitle="The same listening at working altitude: every item with its owner and next action."
      view="head-cx"
    >
      <ExecPage b={sliceBundle(b, { view: "exec" })} view="head-cx" />
    </Shell>
  );
}
