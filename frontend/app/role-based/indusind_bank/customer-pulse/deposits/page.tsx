import {
  type DepositsSlice,
  DepositsView,
} from "@/components/indusind-v1/Deposits";
import { Shell } from "@/components/indusind-v1/Shell";
import { loadPage } from "@/lib/indusind-v1/load";
import { readSel } from "@/lib/indusind-v1/params";
import type { AskBank, Common } from "@/lib/indusind-v1/types";

export const dynamic = "force-dynamic";

type DepositsFile = Omit<DepositsSlice, "win" | "windowLabel"> & {
  windows: Record<string, DepositsSlice["win"]>;
};

/** S-DEP. One window sent to the browser. */
export default async function IndusIndDeposits({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const common = loadPage<Common>("common");
  const ask = loadPage<AskBank>("ask");
  const { windows, ...rest } = loadPage<DepositsFile>("deposits");
  const sel = readSel(await searchParams, common.default_window);
  const d: DepositsSlice = {
    ...rest,
    win: windows[sel.w],
    windowLabel: common.windows.find((x) => x.id === sel.w)?.label ?? "",
  };
  return (
    <Shell
      common={common}
      ask={ask}
      sel={sel}
      path="/role-based/indusind_bank/customer-pulse/deposits"
      controls={{ window: true }}
    >
      <DepositsView d={d} common={common} />
    </Shell>
  );
}
