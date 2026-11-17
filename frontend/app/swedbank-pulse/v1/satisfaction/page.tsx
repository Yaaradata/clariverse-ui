import { SatisfactionView } from "@/components/swedbank-pulse/SatisfactionView";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

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
