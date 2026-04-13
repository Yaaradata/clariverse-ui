"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export type RoleBasedTimeFilter = "24h" | "7d" | "30d";

const OPTIONS: { id: RoleBasedTimeFilter; label: string }[] = [
  { id: "24h", label: "Last 24 Hours" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
];

/** Matches `app/swedbank/compliance-fci` time control styling (#1a1a1a / #2a2a2a / #5332FF / #D6D9D8). */
export function RoleBasedComplianceTimePills() {
  const [active, setActive] = useState<RoleBasedTimeFilter>("7d");

  const publish = (id: RoleBasedTimeFilter) => {
    setActive(id);
    try {
      localStorage.setItem("roleBasedTimeFilter", id);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("roleBasedFiltersApply", { detail: { timeFilter: id } }));
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("roleBasedTimeFilter") as RoleBasedTimeFilter | null;
      if (saved === "24h" || saved === "7d" || saved === "30d") {
        setActive(saved);
        window.dispatchEvent(new CustomEvent("roleBasedFiltersApply", { detail: { timeFilter: saved } }));
      } else {
        window.dispatchEvent(new CustomEvent("roleBasedFiltersApply", { detail: { timeFilter: "7d" } }));
      }
    } catch {
      window.dispatchEvent(new CustomEvent("roleBasedFiltersApply", { detail: { timeFilter: "7d" } }));
    }
  }, []);

  return (
    <div
      className="flex flex-wrap items-center rounded-xl p-1"
      style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
    >
      {OPTIONS.map((o) => {
        const isActive = active === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => publish(o.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${isActive ? "shadow-sm" : ""}`}
            style={{
              backgroundColor: isActive ? "#5332FF" : "transparent",
              color: isActive ? "#FFFFFF" : "#e8e9e9",
            }}
          >
            <Calendar className="h-5 w-5 shrink-0" aria-hidden />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
