import { SatisfactionView } from "@/components/hdfc-pulse-v1/SatisfactionView";
import { Shell } from "@/components/hdfc-pulse-v1/Shell";
import { loadBundle } from "@/lib/hdfc-pulse-v1/load";
import { shellProps } from "@/lib/hdfc-pulse-v1/shellProps";

export default function SatisfactionPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="Are customers satisfied with their journey?"
      subtitle="Trust pillars · Relationship tiers · Journey stages"
      drill
    >
      <SatisfactionView b={b} />
    </Shell>
  );
}
