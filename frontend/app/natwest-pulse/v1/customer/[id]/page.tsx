import { redirect } from "next/navigation";

/** The customer signal trail is removed for NatWest (brief Step 5); next.config.mjs redirects first. */
export default function RemovedCustomerTrail() {
  redirect("/natwest-pulse/v1/mds-office");
}
