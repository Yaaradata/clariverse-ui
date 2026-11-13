import { OmbudsmanWatch } from "@/components/natwest-pulse/Ombudsman";
import { Shell } from "@/components/natwest-pulse/Shell";
import { SCREEN_COPY } from "@/lib/natwest-pulse/copy";
import {
  askFor,
  frame,
  nwSlice,
  registerEntries,
  type SearchParams,
  selection,
} from "@/lib/natwest-pulse/natwest";

/** S-FOS Ombudsman watch. */
export default async function OmbudsmanPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { w, b } = await selection(searchParams);
  const f = frame(w, b);
  return (
    <Shell
      frame={f}
      ask={askFor(w, b)}
      screen="fos"
      title={SCREEN_COPY.fos.title}
      subtitle={SCREEN_COPY.fos.subtitle}
    >
      <OmbudsmanWatch
        fos={nwSlice(w, b).fos}
        rules={registerEntries(["REG-DISP-8W", "REG-PSD-15", "REG-FOS-6M"])}
        windowLabel={f.window.label}
      />
    </Shell>
  );
}
