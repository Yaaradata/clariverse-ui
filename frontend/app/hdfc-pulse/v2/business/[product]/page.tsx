import { notFound } from "next/navigation";

import { BusinessView } from "@/components/hdfc-v3/BusinessView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { PRODUCT_ORDER } from "@/lib/hdfc-v3/products";
import { shellProps } from "@/lib/hdfc-v3/shellProps";
import { sliceBundle } from "@/lib/hdfc-v3/slice";
import type { ProductId } from "@/lib/hdfc-v3/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_ORDER.map((product) => ({ product }));
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product } = await params;
  const b = loadBundle();
  const row = b.products.rows.find((r) => r.id === product);
  if (!row) notFound();
  return (
    <Shell
      {...shellProps(b)}
      title={`${row.label}: business view`}
      subtitle="The exec page, scoped to one product: numbers, priority relationships, issues, deliverables and actions."
      drill
    >
      <BusinessView
        b={sliceBundle(b, { view: "business" })}
        product={product as ProductId}
      />
    </Shell>
  );
}
