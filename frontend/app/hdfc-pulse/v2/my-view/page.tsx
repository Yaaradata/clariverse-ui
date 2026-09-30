import { MyView } from "@/components/hdfc-v3/MyView";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

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
