import { MdView } from "@/components/natwest-pulse/MdView";
import { Shell } from "@/components/natwest-pulse/Shell";
import { SCREEN_COPY } from "@/lib/natwest-pulse/copy";
import {
  askFor,
  frame,
  nwSlice,
  type SearchParams,
  selection,
  sources,
} from "@/lib/natwest-pulse/natwest";

/** S-HOME customer pulse. The MD's office and the Head of CX share one view (as in the IndusInd pulse). */
export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { w, b } = await selection(searchParams);
  const s = nwSlice(w, b);
  const f = frame(w, b);
  const { leakage_pct, leakage_delta, back_call, back_complaint } = s.cora;
  const { pending, at_risk, states, as_at } = s.fos;
  return (
    <Shell
      frame={f}
      ask={askFor(w, b)}
      screen="home"
      title={SCREEN_COPY.home.title}
      subtitle={SCREEN_COPY.home.subtitle}
    >
      <MdView
        group={s.group}
        segments={s.segments}
        cora={{ leakage_pct, leakage_delta, back_call, back_complaint }}
        fos={{ pending, at_risk, states, as_at }}
        brief={s.brief}
        sources={sources()}
        w={w}
        b={b}
        windowLabel={f.window.label}
      />
    </Shell>
  );
}
