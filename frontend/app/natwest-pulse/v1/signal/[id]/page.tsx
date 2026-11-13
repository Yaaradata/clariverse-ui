import { notFound } from "next/navigation";

import { Shell } from "@/components/natwest-pulse/Shell";
import { SignalDetail } from "@/components/natwest-pulse/SignalDetail";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { shellProps } from "@/lib/natwest-pulse/shellProps";
import { sliceBundle } from "@/lib/natwest-pulse/slice";

export const dynamicParams = false;

export function generateStaticParams() {
  const b = loadBundle();
  const ids = b.themes.themes.map((t) => ({ id: t.id }));
  if (b.briefing.release_pulse) ids.push({ id: "release-pulse" });
  return ids;
}

export default async function SignalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const b = loadBundle();
  const theme = b.themes.themes.find((t) => t.id === id);
  if (!theme && !(id === "release-pulse" && b.briefing.release_pulse))
    notFound();
  const title = theme
    ? theme.label
    : "Release pulse: the fix list customers have written";
  return (
    <Shell
      {...shellProps(b)}
      sampleRows={b.periods.scale.sample_rows}
      title={title}
      subtitle="Signal detail · What · Is it real · Where · How high · Who and what next · Evidence"
      drill
    >
      <SignalDetail b={sliceBundle(b, { view: "signal", id })} id={id} />
    </Shell>
  );
}
