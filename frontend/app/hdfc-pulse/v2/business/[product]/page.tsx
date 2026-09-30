import { notFound } from "next/navigation";

import { CardsView, ComingSoon } from "@/components/hdfc-v3/CardsView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { PRODUCT_ORDER } from "@/lib/hdfc-v3/products";
import { shellProps } from "@/lib/hdfc-v3/shellProps";
import { sliceBundle } from "@/lib/hdfc-v3/slice";

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
  const cards = product === "cards";
  const sliced = sliceBundle(b, { view: "business" });
  return (
    <Shell
      {...shellProps(b)}
      periods={cards ? sliced.periods : undefined}
      title={`${row.label}: business view`}
      subtitle={
        cards
          ? "For the head of Cards: the issue pulse, issues by category and what customers say, for the selected period."
          : "Coming soon."
      }
    >
      {cards ? <CardsView b={sliced} /> : <ComingSoon label={row.label} />}
    </Shell>
  );
}
