import { notFound } from "next/navigation";

import { PublicNotLoaded } from "@/components/swedbank-pulse/Pulse";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { SignalDetail } from "@/components/swedbank-pulse/SignalDetail";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

export const dynamicParams = false;

/** Swedbank (NW-D29): a page for every taxonomy theme, so every on-screen theme link resolves; while no public source is
 * loaded, a theme with no public items shows its name and "Public data not yet loaded". */
type NwMeta = {
  public_loaded?: boolean;
  theme_labels?: Record<string, string>;
};

export function generateStaticParams() {
  const b = loadBundle();
  const labels = (b.meta as unknown as NwMeta).theme_labels ?? {};
  const ids = [
    ...new Set([...b.themes.themes.map((t) => t.id), ...Object.keys(labels)]),
  ].map((id) => ({ id }));
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
  const label = (b.meta as unknown as NwMeta).theme_labels?.[id];
  if (!theme && label) {
    return (
      <Shell
        {...shellProps(b)}
        sampleRows={b.periods.scale.sample_rows}
        title={label}
        subtitle="Signal detail · What · Is it real · Where · How high · Who and what next · Evidence"
        drill
      >
        <PublicNotLoaded />
      </Shell>
    );
  }
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
