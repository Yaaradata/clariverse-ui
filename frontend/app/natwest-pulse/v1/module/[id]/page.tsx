import { notFound } from "next/navigation";

import { CoraModule } from "@/components/natwest-pulse/ModuleView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { SCREEN_COPY } from "@/lib/natwest-pulse/copy";
import {
  askFor,
  frame,
  nwDoc,
  nwSlice,
  type SearchParams,
  selection,
} from "@/lib/natwest-pulse/natwest";
import { MODULES } from "@/lib/natwest-pulse/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(MODULES).map((id) => ({ id }));
}

/** S-CORA Cora leakage: the cora_digital module. */
export default async function ModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  if (!(id in MODULES)) notFound();
  const { w, b } = await selection(searchParams);
  const f = frame(w, b);
  const productLabel = Object.fromEntries(
    nwDoc().products.map((p) => [p.id, p.label]),
  );
  return (
    <Shell
      frame={f}
      ask={askFor(w, b)}
      screen="cora"
      title={SCREEN_COPY.cora.title}
      subtitle={SCREEN_COPY.cora.subtitle}
    >
      <CoraModule
        cora={nwSlice(w, b).cora}
        w={w}
        b={b}
        windowLabel={f.window.label}
        productLabel={productLabel}
      />
    </Shell>
  );
}
