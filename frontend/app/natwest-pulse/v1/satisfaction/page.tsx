import { SatisfactionView } from "@/components/natwest-pulse/SatisfactionView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { SCREEN_COPY } from "@/lib/natwest-pulse/copy";
import {
  askFor,
  frame,
  nwSlice,
  type SearchParams,
  selection,
  sources,
} from "@/lib/natwest-pulse/natwest";

/** S-CHANNEL cross-channel pulse. */
export default async function ChannelPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { w, b } = await selection(searchParams);
  const f = frame(w, b);
  return (
    <Shell
      frame={f}
      ask={askFor(w, b)}
      screen="channel"
      title={SCREEN_COPY.channel.title}
      subtitle={SCREEN_COPY.channel.subtitle}
    >
      <SatisfactionView
        channel={nwSlice(w, b).channel}
        sources={sources()}
        showDelta={w !== "w13"}
        windowLabel={f.window.label}
      />
    </Shell>
  );
}
