import { notFound } from "next/navigation";

import { CustomerTrail } from "@/components/swedbank-pulse/PriorityView";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

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
