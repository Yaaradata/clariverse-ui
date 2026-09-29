import { ExecPage } from "@/components/hdfc-pulse-v1/ExecPage";
import { Shell } from "@/components/hdfc-pulse-v1/Shell";
import { loadBundle } from "@/lib/hdfc-pulse-v1/load";
import { shellProps } from "@/lib/hdfc-pulse-v1/shellProps";

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
