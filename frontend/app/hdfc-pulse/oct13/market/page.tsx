import { MarketView } from "@/components/hdfc-oct13/MarketView";
import { Shell } from "@/components/hdfc-oct13/Shell";
import { loadBundle } from "@/lib/hdfc-oct13/load";
import { shellProps } from "@/lib/hdfc-oct13/shellProps";
import { sliceBundle } from "@/lib/hdfc-oct13/slice";

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
