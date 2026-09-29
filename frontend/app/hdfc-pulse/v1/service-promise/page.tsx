import { ServicePromiseView } from "@/components/hdfc-pulse-v1/ServicePromiseView";
import { Shell } from "@/components/hdfc-pulse-v1/Shell";
import { loadBundle } from "@/lib/hdfc-pulse-v1/load";
import { shellProps } from "@/lib/hdfc-pulse-v1/shellProps";

export default function ServicePromisePage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="Are we keeping our service promise?"
      subtitle="Promise ledger · Escalation ladder · Transparency gap · Cure watch · Disputes"
      drill
    >
      <ServicePromiseView b={b} />
    </Shell>
  );
}
