import { redirect } from "next/navigation";

/** Latest version by default; V1 (first demo) stays at /hdfc-pulse/v1. */
export default function HdfcPulseIndex() {
  redirect("/hdfc-pulse/v2/mds-office");
}
