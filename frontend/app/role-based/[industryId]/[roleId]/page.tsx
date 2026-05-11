"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { RoleDashboardView } from "@/components/role-based-dashboard/RoleDashboardView";
import { SWEDBANK_DASHBOARD_THEME } from "@/lib/role-based-dashboard/swedbank-compliance-theme";
import { resolveIndustryAndRole } from "@/lib/role-based-dashboard/registry";

const accent = "#5332FF";
const textSec = "#e8e9e9";

export default function RoleBasedRoleDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const industryId = typeof params.industryId === "string" ? params.industryId : "";
  const roleId = typeof params.roleId === "string" ? params.roleId : "";
  const normalizedRoleId =
    industryId === "credit_cards" && roleId === "head_cards_v3" ? "head_cards" : roleId;

  useEffect(() => {
    if (industryId === "credit_cards" && roleId === "head_cards_v3") {
      router.replace(`/role-based/credit_cards/head_cards`);
    }
  }, [industryId, roleId, router]);

  const resolved = resolveIndustryAndRole(industryId, normalizedRoleId);

  if (!resolved) {
    return (
      <div style={{ padding: "60px 40px", maxWidth: 560, margin: "0 auto", minHeight: "100vh", backgroundColor: "#010101" }}>
        <p style={{ color: textSec, marginBottom: 20, lineHeight: 1.55, fontSize: 16 }}>
          No dashboard for industry &quot;{industryId}&quot; and role &quot;{roleId}&quot;.
        </p>
        <Link href="/role-based" style={{ color: accent, marginRight: 16, fontSize: 15 }}>
          All industries
        </Link>
        {industryId ? (
          <Link href={`/role-based/${industryId}`} style={{ color: accent, fontSize: 15 }}>
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
      theme={SWEDBANK_DASHBOARD_THEME}
      unifiedNavigation
      onExit={() => {
        router.push(`/role-based/${industry.id}`);
      }}
    />
  );
}
