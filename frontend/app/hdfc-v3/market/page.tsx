import { MarketView } from "@/components/hdfc-v3/MarketView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

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
