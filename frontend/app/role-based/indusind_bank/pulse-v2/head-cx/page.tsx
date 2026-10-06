import { MdView } from "@/components/indusind-v2/MdView";
import { Shell } from "@/components/indusind-v2/Shell";
import { loadBundle } from "@/lib/indusind-v2/load";
import { shellProps } from "@/lib/indusind-v2/shellProps";
import { sliceBundle } from "@/lib/indusind-v2/slice";

/** One view for the MD's office and the Head of CX (30 Sep review); /head-cx renders the same page. */
export default function HeadCxPage() {
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
