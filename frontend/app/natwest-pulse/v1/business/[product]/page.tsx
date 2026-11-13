import { notFound } from "next/navigation";

import { ProductView } from "@/components/natwest-pulse/Brief";
import { Shell } from "@/components/natwest-pulse/Shell";
import {
  askFor,
  frame,
  nwDoc,
  nwSlice,
  type SearchParams,
  selection,
} from "@/lib/natwest-pulse/natwest";
import { PRODUCT_ORDER } from "@/lib/natwest-pulse/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_ORDER.map((product) => ({ product }));
}

/** One product's own slice (HL-23), opened from the morning brief. */
export default async function BusinessPage({
  params,
  searchParams,
}: {
  params: Promise<{ product: string }>;
  searchParams: SearchParams;
}) {
  const { product } = await params;
  const { w, b } = await selection(searchParams);
  const p = nwSlice(w, b).products[product];
  if (!p || !nwDoc().products.some((x) => x.id === product)) notFound();
  const f = frame(w, b);
  return (
    <Shell
      frame={f}
      ask={askFor(w, b)}
      screen="home"
      drill
      title={p.label}
      subtitle="Product view"
    >
      <ProductView p={p} windowLabel={f.window.label} showDelta={w !== "w13"} />
    </Shell>
  );
}
