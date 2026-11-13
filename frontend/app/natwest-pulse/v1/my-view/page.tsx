import { MyView } from "@/components/natwest-pulse/MyView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { loadBundle } from "@/lib/natwest-pulse/load";
import { shellProps } from "@/lib/natwest-pulse/shellProps";

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
