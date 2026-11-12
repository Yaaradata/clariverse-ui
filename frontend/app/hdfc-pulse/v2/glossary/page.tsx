import { Glossary } from "@/components/hdfc-v3/Glossary";
import { Shell } from "@/components/hdfc-v3/Shell";
import { loadBundle } from "@/lib/hdfc-v3/load";
import { shellProps } from "@/lib/hdfc-v3/shellProps";

/** B11 item 10: the terms used on every screen, in one place. */
export default function GlossaryPage() {
  const b = loadBundle();
  return (
    <Shell
      {...shellProps(b)}
      title="Glossary"
      subtitle="The words on these screens, in one line each."
    >
      <Glossary />
    </Shell>
  );
}
