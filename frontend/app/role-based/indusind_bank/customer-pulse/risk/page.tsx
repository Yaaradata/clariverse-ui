import { type RiskSlice, RiskView } from "@/components/indusind-v1/Risk";
import { Shell } from "@/components/indusind-v1/Shell";
import { loadPage } from "@/lib/indusind-v1/load";
import { readSel } from "@/lib/indusind-v1/params";
import type { AskBank, Common } from "@/lib/indusind-v1/types";

export const dynamic = "force-dynamic";

type RiskFile = Omit<RiskSlice, "win" | "windowLabel"> & {
  windows: Record<string, RiskSlice["win"]>;
};

/** S-RISK. One window sent to the browser. */
export default async function IndusIndRisk({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const common = loadPage<Common>("common");
  const ask = loadPage<AskBank>("ask");
  const { windows, ...rest } = loadPage<RiskFile>("risk");
  const sel = readSel(await searchParams, common.default_window);
  const r: RiskSlice = {
    ...rest,
    win: windows[sel.w],
    windowLabel: common.windows.find((x) => x.id === sel.w)?.label ?? "",
  };
  return (
    <Shell
      common={common}
      ask={ask}
      sel={sel}
      path="/role-based/indusind_bank/customer-pulse/risk"
      controls={{ window: true }}
    >
      <RiskView r={r} common={common} />
    </Shell>
  );
}
