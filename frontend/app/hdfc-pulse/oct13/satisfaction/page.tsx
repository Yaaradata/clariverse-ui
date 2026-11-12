import { SatisfactionView } from "@/components/hdfc-oct13/SatisfactionView";
import { Shell } from "@/components/hdfc-oct13/Shell";
import { loadBundle } from "@/lib/hdfc-oct13/load";
import { shellProps } from "@/lib/hdfc-oct13/shellProps";
import { sliceBundle } from "@/lib/hdfc-oct13/slice";

export default function SatisfactionPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="Are customers satisfied with their journey?"
      subtitle="Trust pillars · Relationship tiers · Journey stages"
      drill
    >
      <SatisfactionView b={sliceBundle(b, { view: "satisfaction" })} />
    </Shell>
  );
}
