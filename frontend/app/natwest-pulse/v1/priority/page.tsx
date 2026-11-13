import { DutyView } from "@/components/natwest-pulse/PriorityView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { SCREEN_COPY } from "@/lib/natwest-pulse/copy";
import {
  askFor,
  frame,
  nwDoc,
  nwSlice,
  registerEntries,
  type SearchParams,
  selection,
} from "@/lib/natwest-pulse/natwest";

/** S-DUTY Consumer Duty outcomes. */
export default async function DutyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { w, b } = await selection(searchParams);
  const duty = nwSlice(w, b).duty;
  const ids = [...new Set(duty.flatMap((o) => o.evidence))];
  return (
    <Shell
      frame={frame(w, b)}
      ask={askFor(w, b)}
      screen="duty"
      title={SCREEN_COPY.duty.title}
      subtitle={SCREEN_COPY.duty.subtitle}
    >
      <DutyView
        duty={duty}
        evidence={registerEntries(ids)}
        segments={nwDoc().segments}
      />
    </Shell>
  );
}
