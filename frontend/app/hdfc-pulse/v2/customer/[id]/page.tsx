import { notFound } from "next/navigation";

import { CustomerTrail } from "@/components/hdfc-v3/PriorityView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { sliceBundle } from "@/lib/hdfc-v3/slice";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

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
      title={`Customer signal trail: ${p.persona}`}
      subtitle="One customer, every product and channel · Fictional persona, masked id"
      drill
    >
      <CustomerTrail b={sliceBundle(b, { view: "customer" })} id={id} />
    </Shell>
  );
}
