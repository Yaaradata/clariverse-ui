import { type HomeSlice, HomeView } from "@/components/indusind-v1/Home";
import { Shell } from "@/components/indusind-v1/Shell";
import { loadPage } from "@/lib/indusind-v1/load";
import { readSel } from "@/lib/indusind-v1/params";
import type { AskBank, Common, Home } from "@/lib/indusind-v1/types";

export const dynamic = "force-dynamic";

/** S-HOME. The server slices the home payload to one window, one business and one view before it reaches the browser. */
export default async function IndusIndHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const common = loadPage<Common>("common");
  const home = loadPage<Home>("home");
  const ask = loadPage<AskBank>("ask");
  const sel = readSel(await searchParams, common.default_window);
  const w = home.windows[sel.w];
  const pulse = w.pulse[sel.b] ?? w.pulse.all;
  const slice: HomeSlice = {
    quarter: home.quarter,
    win: {
      ...w,
      // CEO's office sees the pulse summary: the channel table is not sent.
      pulse: sel.v === "cx" ? pulse : { ...pulse, channels: [] },
    },
    improving: home.improving,
    horizon: home.horizon,
    peer_moves: home.peer_moves,
    owners: sel.v === "cx" ? home.owners : null,
    windowLabel: common.windows.find((x) => x.id === sel.w)?.label ?? "",
    businessLabel: common.businesses.find((x) => x.id === sel.b)?.label ?? "",
  };
  return (
    <Shell
      common={common}
      ask={ask}
      sel={sel}
      path="/indusind-v1"
      controls={{ view: true, window: true, business: true }}
    >
      <HomeView s={slice} sel={sel} common={common} />
    </Shell>
  );
}
