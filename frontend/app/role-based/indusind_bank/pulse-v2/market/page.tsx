import { MarketView } from "@/components/indusind-v2/MarketView";
import { Shell } from "@/components/indusind-v2/Shell";
import { loadBundle } from "@/lib/indusind-v2/load";
import { shellProps } from "@/lib/indusind-v2/shellProps";
import { sliceBundle } from "@/lib/indusind-v2/slice";

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
