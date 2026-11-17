import { redirect } from "next/navigation";

/** Renamed in V3: "promise" is now "deliverables" everywhere in the UI. */
export default function ServicePromisePage() {
  redirect("/swedbank-pulse/v1/deliverables");
}
