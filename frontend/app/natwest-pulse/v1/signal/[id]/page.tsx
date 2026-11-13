import { notFound } from "next/navigation";
import { Shell } from "@/components/natwest-pulse/Shell";
import { SignalDetail } from "@/components/natwest-pulse/SignalDetail";
import { SCREEN_COPY } from "@/lib/natwest-pulse/copy";
import {
  askFor,
  frame,
  nwDoc,
  nwSlice,
  type SearchParams,
  selection,
} from "@/lib/natwest-pulse/natwest";

export const dynamicParams = false;

export function generateStaticParams() {
  return nwDoc().journeys.map((j) => ({ id: j.id }));
}

/** One Cora journey (the drill behind S-CORA). */
export default async function SignalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { w, b } = await selection(searchParams);
  const j = nwSlice(w, b).journeys[id];
  if (!j) notFound();
  const product = nwDoc().products.find((p) => p.id === j.product);
  return (
    <Shell
      frame={frame(w, b)}
      ask={askFor(w, b)}
      screen="cora"
      drill
      title={j.label}
      subtitle={SCREEN_COPY.cora.title}
    >
      <SignalDetail j={j} productLabel={product?.label ?? ""} />
    </Shell>
  );
}
