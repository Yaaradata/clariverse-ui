import { type PeersSlice, PeersView } from "@/components/indusind-v1/Peers";
import { Shell } from "@/components/indusind-v1/Shell";
import { loadPage } from "@/lib/indusind-v1/load";
import { readSel } from "@/lib/indusind-v1/params";
import type { AskBank, Common } from "@/lib/indusind-v1/types";

export const dynamic = "force-dynamic";

/** S-PEER. */
export default async function IndusIndPeers({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const common = loadPage<Common>("common");
  const ask = loadPage<AskBank>("ask");
  const p = loadPage<PeersSlice>("peers");
  const sel = readSel(await searchParams, common.default_window);
  return (
    <Shell
      common={common}
      ask={ask}
      sel={sel}
      path="/role-based/indusind_bank/customer-pulse/peers"
    >
      <PeersView p={p} common={common} />
    </Shell>
  );
}
