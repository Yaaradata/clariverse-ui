import { SatisfactionView } from "@/components/hdfc-v3/SatisfactionView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

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
