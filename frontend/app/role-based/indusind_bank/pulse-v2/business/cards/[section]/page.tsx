import { notFound } from "next/navigation";

import { CardsDrillDown } from "@/components/indusind-v2/CardsView";
import { Shell } from "@/components/indusind-v2/Shell";
import { DRILL_DOWNS, type DrillDownId } from "@/lib/indusind-v2/drilldowns";
import { loadBundle } from "@/lib/indusind-v2/load";
import { shellProps } from "@/lib/indusind-v2/shellProps";
import { sliceBundle } from "@/lib/indusind-v2/slice";

export const dynamicParams = false;

export function generateStaticParams() {
  return DRILL_DOWNS.map((d) => ({ section: d.id }));
}

/** One of the three Cards drill-downs (30 Sep review C4): happy, market or service, for the selected period. */
export default async function CardsDrillDownPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const d = DRILL_DOWNS.find((x) => x.id === section);
  if (!d) notFound();
  const b = loadBundle();
  const sliced = sliceBundle(b, { view: "business" });
  return (
    <Shell
      {...shellProps(b)}
      title={`Cards: ${d.title}`}
      subtitle={d.sub}
      periods={sliced.periods}
      context="Cards · Business view"
      drill
    >
      <CardsDrillDown b={sliced} id={section as DrillDownId} />
    </Shell>
  );
}
