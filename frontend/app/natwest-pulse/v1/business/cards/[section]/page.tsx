import { redirect } from "next/navigation";

/** The cards-portfolio drill is removed for NatWest (brief Step 5); next.config.mjs redirects first. */
export default function RemovedCardsDrill() {
  redirect("/natwest-pulse/v1/mds-office");
}
