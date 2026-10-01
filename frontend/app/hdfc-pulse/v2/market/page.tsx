import { MarketView } from "@/components/hdfc-v3/MarketView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";
import { sliceBundle } from "@/lib/hdfc-v3/slice";

export default function MarketPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title="What is the market saying about us?"
      subtitle="What we say vs what customers hear · Rising themes · Voices with reach · App pulse · Safety"
      drill
    >
      <MarketView b={sliceBundle(b, { view: "market" })} />
    </Shell>
  );
}
