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
  // SW-D16: Everyday accounts and app carries the worked deep dive; every other product is an ordinary product page.
  const cards = product === "everyday_accounts_app";
  const sliced = sliceBundle(b, { view: "business" });
  return (
    <Shell
      {...shellProps(b)}
      periods={cards ? sliced.periods : undefined}
      context={cards ? "Everyday accounts and app · Product view" : undefined}
      title={`${row.label}: product view`}
      subtitle={
        cards
          ? "For the Everyday accounts and app owner: the issue pulse, issues by category and what customers say, for the selected period."
          : "Coming soon."
      }
    >
      {cards ? <CardsView b={sliced} /> : <ComingSoon label={row.label} />}
    </Shell>
  );
}
