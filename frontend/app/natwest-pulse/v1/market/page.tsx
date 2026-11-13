import { MarketView } from "@/components/natwest-pulse/MarketView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { SCREEN_COPY } from "@/lib/natwest-pulse/copy";
import {
  askFor,
  frame,
  nwSlice,
  peers,
  registerEntries,
  type SearchParams,
  selection,
  sources,
} from "@/lib/natwest-pulse/natwest";

/** S-BRAND brand lens: always all three brands, so the brand filter is off. */
export default async function BrandPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { w } = await selection(searchParams);
  const brand = nwSlice(w, "all").brand;
  return (
    <Shell
      frame={frame(w, "all")}
      ask={askFor(w, "all")}
      screen="brand"
      brandFilter={false}
      title={SCREEN_COPY.brand.title}
      subtitle={SCREEN_COPY.brand.subtitle}
    >
      <MarketView
        brands={brand?.brands ?? []}
        opening={registerEntries(["REG-CMA-RBS-APP"])[0] ?? null}
        peers={peers()}
        sources={sources()}
      />
    </Shell>
  );
}
