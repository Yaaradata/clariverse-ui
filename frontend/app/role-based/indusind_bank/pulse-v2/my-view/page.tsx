import { MyView } from "@/components/indusind-v2/MyView";
import { Shell } from "@/components/indusind-v2/Shell";
import { loadBundle } from "@/lib/indusind-v2/load";
import { shellProps } from "@/lib/indusind-v2/shellProps";

/** My view (30 Sep review, K5): the Ask LisN answers pinned in this session. */
export default function MyViewPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="My view"
      subtitle="The Ask LisN answers you pinned, as panels. This session only."
    >
      <MyView />
    </Shell>
  );
}
