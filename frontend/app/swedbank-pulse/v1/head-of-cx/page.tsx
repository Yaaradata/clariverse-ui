import { MdView } from "@/components/swedbank-pulse/MdView";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";
import { sliceBundle } from "@/lib/swedbank-pulse/slice";

/** One view for the MD's office and the Head of CX (30 Sep review); /head-cx renders the same page. */
export default function HeadOfCxPage() {
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
