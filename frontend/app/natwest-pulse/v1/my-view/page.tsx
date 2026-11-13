import { redirect } from "next/navigation";

/** Pinned answers are not part of the NatWest build; the route goes back to the customer pulse. */
export default function MyViewPage() {
  redirect("/natwest-pulse/v1/mds-office");
}
