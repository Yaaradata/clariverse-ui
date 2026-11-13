import { notFound } from "next/navigation";

import { CardsView, ComingSoon } from "@/components/natwest-pulse/CardsView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { PRODUCT_ORDER } from "@/lib/natwest-pulse/products";
import { shellProps } from "@/lib/natwest-pulse/shellProps";
import { sliceBundle } from "@/lib/natwest-pulse/slice";

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
      context={cards ? "Cards · Business view" : undefined}
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
