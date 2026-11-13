import { notFound } from "next/navigation";

import { CardsModule, DigitalModule } from "@/components/natwest-pulse/ModuleView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { shellProps } from "@/lib/natwest-pulse/shellProps";
import { sliceBundle } from "@/lib/natwest-pulse/slice";

export const dynamicParams = false;

const MODULES = {
  cards: {
    title: "Cards",
    subtitle:
      "What · Is it real · Issue list · Where · How high · Owner and action · Evidence",
  },
  digital: {
    title: "Digital: HDFC Bank app",
    subtitle:
      "What · Is it real · Fix list · Where · How high · Owner and action · Evidence",
  },
} as const;

export function generateStaticParams() {
  return Object.keys(MODULES).map((id) => ({ id }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!(id in MODULES)) notFound();
  const m = MODULES[id as keyof typeof MODULES];
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title={m.title}
      subtitle={m.subtitle}
      drill
    >
      {id === "cards" ? (
        <CardsModule b={sliceBundle(b, { view: "module", id: "cards" })} />
      ) : (
        <DigitalModule b={sliceBundle(b, { view: "module", id: "digital" })} />
      )}
    </Shell>
  );
}
