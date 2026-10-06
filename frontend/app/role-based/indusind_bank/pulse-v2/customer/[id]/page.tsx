import { notFound } from "next/navigation";

import { CustomerTrail } from "@/components/indusind-v2/PriorityView";
import { Shell } from "@/components/indusind-v2/Shell";
import { loadBundle } from "@/lib/indusind-v2/load";
import { shellProps } from "@/lib/indusind-v2/shellProps";
import { sliceBundle } from "@/lib/indusind-v2/slice";

export const dynamicParams = false;

export function generateStaticParams() {
  return loadBundle().v3.personas.map((p) => ({ id: p.masked_id }));
}

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const b = loadBundle();
  const p = b.v3.personas.find((x) => x.masked_id === id);
  if (!p) notFound();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title={`Customer signal trail: ${p.persona}`}
      subtitle="One customer, every product and channel · Fictional persona, masked id"
      drill
    >
      <CustomerTrail b={sliceBundle(b, { view: "customer" })} id={id} />
    </Shell>
  );
}
