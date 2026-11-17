import { MyView } from "@/components/swedbank-pulse/MyView";
import { Shell } from "@/components/swedbank-pulse/Shell";
import { loadBundle } from "@/lib/swedbank-pulse/load";
import { shellProps } from "@/lib/swedbank-pulse/shellProps";

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
