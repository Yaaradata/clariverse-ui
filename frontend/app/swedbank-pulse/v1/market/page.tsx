import { MarketView } from "@/components/swedbank-pulse/MarketView";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

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
