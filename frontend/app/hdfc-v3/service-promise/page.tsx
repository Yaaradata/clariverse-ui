import { ServicePromiseView } from "@/components/hdfc-v3/ServicePromiseView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

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
