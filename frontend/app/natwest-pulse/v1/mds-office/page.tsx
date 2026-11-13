import { MdView } from "@/components/natwest-pulse/MdView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { shellProps } from "@/lib/natwest-pulse/shellProps";
import { sliceBundle } from "@/lib/natwest-pulse/slice";

/** One view for the MD's office and the Head of CX (30 Sep review); /head-cx renders the same page. */
export default function MdsOfficePage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="Head of Customer Experience"
      subtitle="The pulse first, then today's morning brief, product by product."
      view="mds-office"
      periods={sliceBundle(b, { view: "exec" }).periods}
    >
      <MdView b={sliceBundle(b, { view: "exec" })} />
    </Shell>
  );
}
