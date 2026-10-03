import {
  type ApprovalItem,
  ApprovalsView,
} from "@/components/indusind-v1/Approvals";
import { Shell } from "@/components/indusind-v1/Shell";
import { loadPage } from "@/lib/indusind-v1/load";
import { readSel } from "@/lib/indusind-v1/params";
import type { AskBank, Common } from "@/lib/indusind-v1/types";

export const dynamic = "force-dynamic";

/** S-APPR (mock). */
export default async function IndusIndApprovals({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const common = loadPage<Common>("common");
  const ask = loadPage<AskBank>("ask");
  const a = loadPage<{ actions: ApprovalItem[]; banner: string }>("approvals");
  const sel = readSel(await searchParams, common.default_window);
  return (
    <Shell common={common} ask={ask} sel={sel} path="/indusind-v1/approvals">
      <ApprovalsView actions={a.actions} banner={a.banner} />
    </Shell>
  );
}
