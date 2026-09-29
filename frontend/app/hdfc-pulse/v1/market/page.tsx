import { MarketView } from "@/components/hdfc-pulse-v1/MarketView";
import { Shell } from "@/components/hdfc-pulse-v1/Shell";
import { loadBundle } from "@/lib/hdfc-pulse-v1/load";
import { shellProps } from "@/lib/hdfc-pulse-v1/shellProps";

export default function MarketPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="What is the market saying about us?"
      subtitle="Promise gap · Rising themes · Voices with reach · App pulse · Safety"
      drill
    >
      <MarketView b={b} />
    </Shell>
  );
}
