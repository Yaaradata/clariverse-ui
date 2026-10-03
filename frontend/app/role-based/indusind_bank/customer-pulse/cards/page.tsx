import { type CardsSlice, CardsView } from "@/components/indusind-v1/Cards";
import { Shell } from "@/components/indusind-v1/Shell";
import { loadPage } from "@/lib/indusind-v1/load";
import { readSel } from "@/lib/indusind-v1/params";
import type { AskBank, Common } from "@/lib/indusind-v1/types";

export const dynamic = "force-dynamic";

type CardsFile = Omit<CardsSlice, "win" | "windowLabel"> & {
  windows: Record<string, CardsSlice["win"]>;
};

/** S-CARDS. One window sent to the browser. */
export default async function IndusIndCards({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const common = loadPage<Common>("common");
  const ask = loadPage<AskBank>("ask");
  const { windows, ...rest } = loadPage<CardsFile>("cards");
  const sel = readSel(await searchParams, common.default_window);
  const c: CardsSlice = {
    ...rest,
    win: windows[sel.w],
    windowLabel: common.windows.find((x) => x.id === sel.w)?.label ?? "",
  };
  return (
    <Shell
      common={common}
      ask={ask}
      sel={sel}
      path="/role-based/indusind_bank/customer-pulse/cards"
      controls={{ window: true }}
    >
      <CardsView c={c} common={common} />
    </Shell>
  );
}
