import { redirect } from "next/navigation";

/** NatWest Group pulse: one version, v1. */
export default function NatWestPulseIndex() {
  redirect("/natwest-pulse/v1/mds-office");
}
