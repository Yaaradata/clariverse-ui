import { MarketView } from "@/components/natwest-pulse/MarketView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { shellProps } from "@/lib/natwest-pulse/shellProps";
import { sliceBundle } from "@/lib/natwest-pulse/slice";

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
