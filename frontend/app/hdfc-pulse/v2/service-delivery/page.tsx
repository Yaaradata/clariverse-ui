import { ServiceDeliveryView } from "@/components/hdfc-v3/CardsView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";
import { sliceBundle } from "@/lib/hdfc-v3/slice";

/** Service-delivery head (B11 item 7): the detailed Cards views; the senior views keep the summary. */
export default function ServiceDeliveryPage() {
  const b = loadBundle();
  const sliced = sliceBundle(b, { view: "business" });
  return (
    <Shell
      {...shellProps(b)}
      title="Service-delivery head: Cards"
      subtitle="The detail behind the summary: issue dials, issues by category and channel, repeat contacts."
      periods={sliced.periods}
      context="Cards · Service delivery"
    >
      <ServiceDeliveryView b={sliced} />
    </Shell>
  );
}
