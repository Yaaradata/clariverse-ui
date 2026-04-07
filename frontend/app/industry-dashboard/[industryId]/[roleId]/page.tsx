"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { RoleDashboardView } from "@/components/industry-dashboard/RoleDashboardView";
import { resolveIndustryAndRole, T } from "@/lib/industry-dashboard/registry";

export default function IndustryRoleDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const industryId = typeof params.industryId === "string" ? params.industryId : "";
  const roleId = typeof params.roleId === "string" ? params.roleId : "";
  const resolved = resolveIndustryAndRole(industryId, roleId);

  if (!resolved) {
    return (
      <div style={{ padding: "60px 40px", maxWidth: 560, margin: "0 auto" }}>
        <p style={{ color: T.textSec, marginBottom: 20 }}>
          No dashboard for industry &quot;{industryId}&quot; and role &quot;{roleId}&quot;.
        </p>
        <Link href="/industry-dashboard" style={{ color: T.cyan, marginRight: 16 }}>
          All industries
        </Link>
        {industryId ? (
          <Link href={`/industry-dashboard/${industryId}`} style={{ color: T.cyan }}>
            Roles in this industry
          </Link>
        ) : null}
      </div>
    );
  }

  const { industry, role } = resolved;

  return (
    <RoleDashboardView
      industry={industry}
      role={role}
      onExit={() => {
        router.push(`/industry-dashboard/${industry.id}`);
      }}
    />
  );
}
