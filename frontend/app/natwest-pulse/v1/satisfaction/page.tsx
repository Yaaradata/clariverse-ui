import { SatisfactionView } from "@/components/natwest-pulse/SatisfactionView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { shellProps } from "@/lib/natwest-pulse/shellProps";
import { sliceBundle } from "@/lib/natwest-pulse/slice";

export default function SatisfactionPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="Are customers satisfied with their journey?"
      subtitle="Consumer Duty outcomes · Account tiers · Journey stages"
      drill
    >
      <SatisfactionView b={sliceBundle(b, { view: "satisfaction" })} />
    </Shell>
  );
}
