import { notFound } from "next/navigation";

import { CustomerTrail } from "@/components/hdfc-oct13/PriorityView";
import { Shell } from "@/components/hdfc-oct13/Shell";
import { loadBundle } from "@/lib/hdfc-oct13/load";
import { shellProps } from "@/lib/hdfc-oct13/shellProps";
import { sliceBundle } from "@/lib/hdfc-oct13/slice";

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
