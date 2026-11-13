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
      title="MD's office / Head of CX"
      subtitle="The pulse first, then today's morning brief, business by business."
      view="mds-office"
      periods={sliceBundle(b, { view: "exec" }).periods}
    >
      <MdView b={sliceBundle(b, { view: "exec" })} />
    </Shell>
  );
}
