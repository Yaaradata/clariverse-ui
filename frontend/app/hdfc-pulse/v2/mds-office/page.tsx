import { ExecPage } from "@/components/hdfc-v3/ExecPage";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

export default function MdsOfficePage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="MD's Desk"
      subtitle="What needs you today, what's already handled, and what's changing."
      view="mds-office"
    >
      <ExecPage b={b} view="mds-office" />
    </Shell>
  );
}
