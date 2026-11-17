import { redirect } from "next/navigation";

/** Swedbank pulse: one version, v1. */
export default function SwedbankPulseIndex() {
  redirect("/swedbank-pulse/v1/head-of-cx");
}
