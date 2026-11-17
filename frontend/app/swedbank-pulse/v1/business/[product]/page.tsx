import { notFound } from "next/navigation";

import { CardsView, ComingSoon } from "@/components/swedbank-pulse/CardsView";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { PRODUCT_ORDER } from "@/lib/swedbank-pulse/products";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

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
      context={cards ? "Credit cards · Product view" : undefined}
      title={`${row.label}: product view`}
      subtitle={
        cards
          ? "For the credit cards product owner: the issue pulse, issues by category and what customers say, for the selected period."
          : "Coming soon."
      }
    >
      {cards ? <CardsView b={sliced} /> : <ComingSoon label={row.label} />}
    </Shell>
  );
}
