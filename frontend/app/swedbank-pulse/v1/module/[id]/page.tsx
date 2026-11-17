import { notFound } from "next/navigation";

import {
  CardsModule,
  DigitalModule,
} from "@/components/swedbank-pulse/ModuleView";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

export const dynamicParams = false;

const MODULES = {
  everyday_accounts_app: {
    title: "Everyday accounts and app",
    subtitle:
      "What · Is it real · Issue list · Where · How high · Owner and action · Evidence",
  },
  // Nina and the Copilot assistant (SW-D04): a channel row and a module, not a card.
  nina_digital: {
    title: "Nina and the Copilot assistant",
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
      {id === "everyday_accounts_app" ? (
        <CardsModule
          b={sliceBundle(b, { view: "module", id: "everyday_accounts_app" })}
        />
      ) : (
        <DigitalModule b={sliceBundle(b, { view: "module", id: "digital" })} />
      )}
    </Shell>
  );
}
