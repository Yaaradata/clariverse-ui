import { notFound } from "next/navigation";

import { Shell } from "@/components/hdfc-v3/Shell";
import { SignalDetail } from "@/components/hdfc-v3/SignalDetail";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

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
      title={title}
      subtitle="Signal detail · What · Is it real · Where · How high · Who and what next · Evidence"
      drill
    >
      <SignalDetail b={b} id={id} />
    </Shell>
  );
}
