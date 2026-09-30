import { MdView } from "@/components/hdfc-v3/MdView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";
import { sliceBundle } from "@/lib/hdfc-v3/slice";

/** One view for the MD's office and the Head of CX (30 Sep review); /head-cx renders the same page. */
export default function MdsOfficePage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="MD's office / Head of CX"
      subtitle="The pulse first, then today's morning brief, business by business."
      view="mds-office"
    >
      <MdView b={sliceBundle(b, { view: "exec" })} />
    </Shell>
  );
}
