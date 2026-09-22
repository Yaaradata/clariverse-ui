"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

import { SWEDBANK_DASHBOARD_THEME } from "@/lib/role-based-dashboard/swedbank-compliance-theme";
import {
  HDFC_BANK_INDUSTRY_ID,
  HDFC_HEAD_OF_CX_ROLE_ID,
  resolveIndustryAndRole,
} from "@/lib/role-based-dashboard/registry";
import {
  NEOGROUP_HEAD_CLIENT_EXPERIENCE_ROLE_ID,
  NEOGROUP_INDUSTRY_ID,
} from "@/lib/role-based-dashboard/neogroupIndustry";

const RoleDashboardView = dynamic(
  () => import("@/components/role-based-dashboard/RoleDashboardView").then((mod) => mod.RoleDashboardView),
  { loading: () => null }
);

/** Client-only: avoids Turbopack SSR/HMR swapping Neo ↔ Nuvama pulse copy. */
const NeoGroupClientExperienceDashboard = dynamic(
  () =>
    import("@/components/role-based-dashboard/neogroupClientExperienceDashboard").then(
      (m) => m.NeoGroupClientExperienceDashboard
    ),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: "100vh", backgroundColor: "#010101" }} />
    ),
  }
);

const accent = "#5332FF";
const textSec = "#e8e9e9";

type PageProps = {
  params: Promise<{ industryId: string; roleId: string }>;
};

function resolveParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
}

export default function RoleBasedRoleDashboardPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const industryId = resolveParam(resolvedParams.industryId);
  const roleId = resolveParam(resolvedParams.roleId);

  // Legacy HDFC contact route → dedicated Head of CX role
  const isLegacyHdfcContact =
    industryId === HDFC_BANK_INDUSTRY_ID && roleId === "head_contact";

  const normalizedRoleId = isLegacyHdfcContact
    ? HDFC_HEAD_OF_CX_ROLE_ID
    : industryId === "credit_cards" && roleId === "head_cards_v3"
      ? "head_cards"
      : industryId === "ecommerce" &&
          (roleId === "head_cx_retail_v2" || roleId === "head_cx_retail_v3")
        ? "head_cx_retail"
        : roleId;

  useEffect(() => {
    if (industryId === HDFC_BANK_INDUSTRY_ID && roleId === "head_contact") {
      router.replace(
        `/role-based/${HDFC_BANK_INDUSTRY_ID}/${HDFC_HEAD_OF_CX_ROLE_ID}`,
      );
      return;
    }
    if (industryId === "credit_cards" && roleId === "head_cards_v3") {
      router.replace(`/role-based/credit_cards/head_cards`);
    }
    if (
      industryId === "ecommerce" &&
      (roleId === "head_cx_retail_v2" || roleId === "head_cx_retail_v3")
    ) {
      router.replace(`/role-based/ecommerce/head_cx_retail`);
    }
  }, [industryId, roleId, router]);

  if (!industryId || !roleId) {
    return (
      <div style={{ padding: "60px 40px", maxWidth: 560, margin: "0 auto", minHeight: "100vh", backgroundColor: "#010101" }} />
    );
  }

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
  const onExit = () => router.push(`/role-based/${industry.id}`);

  // Bypass RoleDashboardView so nuvamapage never enters this route's module graph.
  if (
    industry.id === NEOGROUP_INDUSTRY_ID &&
    role.id === NEOGROUP_HEAD_CLIENT_EXPERIENCE_ROLE_ID
  ) {
    return (
      <NeoGroupClientExperienceDashboard
        onExit={onExit}
        firmName="Neogroup"
      />
    );
  }

  return (
    <RoleDashboardView
      industry={industry}
      role={role}
      theme={SWEDBANK_DASHBOARD_THEME}
      unifiedNavigation={industry.id !== "fastag"}
      onExit={onExit}
    />
  );
}
