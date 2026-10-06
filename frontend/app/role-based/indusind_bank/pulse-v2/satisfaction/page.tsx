import { SatisfactionView } from "@/components/indusind-v2/SatisfactionView";
import { Shell } from "@/components/indusind-v2/Shell";
import { loadBundle } from "@/lib/indusind-v2/load";
import { shellProps } from "@/lib/indusind-v2/shellProps";
import { sliceBundle } from "@/lib/indusind-v2/slice";

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
