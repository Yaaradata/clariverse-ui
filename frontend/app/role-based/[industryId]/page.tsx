"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { CxRetailVersionToggle } from "@/components/role-based-dashboard/CxRetailVersionToggle";
import { useRoleBasedUi } from "@/components/role-based-dashboard/RoleBasedChrome";
import { getIndustryById, roleDisplayName } from "@/lib/role-based-dashboard/registry";

const accent = "#5332FF";

export default function RoleBasedIndustryRolesPage() {
  const { isDarkMode } = useRoleBasedUi();
  const params = useParams();
  const industryId = typeof params.industryId === "string" ? params.industryId : "";
  const industry = getIndustryById(industryId);

  const prefetchFastagRole = industryId === "fastag";

  const pageBg = isDarkMode ? "#010101" : "#F5F5F5";
  const cardBg = isDarkMode ? "#1a1a1a" : "#FAFAFA";
  const border = isDarkMode ? "#2a2a2a" : "#D6D9D8";
  const text = isDarkMode ? "#ffffff" : "#1a1a1a";
  const textSec = isDarkMode ? "#e8e9e9" : "#4b5563";
  const textMut = isDarkMode ? "#b9b9ba" : "#6b7280";

  if (!industry) {
    return (
      <div className="container mx-auto px-6 py-16" style={{ backgroundColor: pageBg, minHeight: "calc(100vh - 140px)" }}>
        <p style={{ color: textSec, marginBottom: 20, fontSize: 16, lineHeight: 1.5 }}>Unknown industry &quot;{industryId}&quot;.</p>
        <Link href="/role-based" style={{ color: accent, marginRight: 16, fontSize: 15 }}>
          All industries
        </Link>
      </div>
    );
  }

  const IndIcon = industry.icon;

  return (
    <div
      className="container mx-auto px-6 py-10"
      style={{ maxWidth: 1000, backgroundColor: pageBg, minHeight: "calc(100vh - 140px)" }}
    >
      <Link
        href="/role-based"
        style={{
          background: "none",
          border: "none",
          color: textMut,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 15,
          marginBottom: 28,
          textDecoration: "none",
          width: "fit-content",
        }}
      >
        <ArrowLeft size={16} /> Back to industries
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IndIcon size={24} color={accent} />
        </div>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: text, margin: 0 }}>{industry.name}</h1>
          <p style={{ fontSize: 15, color: textMut, margin: "4px 0 0" }}>Select your role</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {industry.roles
          .filter((role) => role.id !== "head_cx_retail_v2")
          .map((role) => {
          const Icon = role.icon;
          const cardStyle = {
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 14,
            padding: "20px 22px",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            gap: 16,
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          } as const;

          if (industry.id === "ecommerce" && role.id === "head_cx_retail") {
            return (
              <div key={role.id} style={{ ...cardStyle, cursor: "default" }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: `${accent}14`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={accent} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 4 }}>
                    {roleDisplayName(role)}
                  </div>
                  <div style={{ fontSize: 15, color: textSec, lineHeight: 1.55 }}>{role.sub}</div>
                </div>
                <CxRetailVersionToggle industryId={industry.id} isDarkMode={isDarkMode} />
              </div>
            );
          }

          return (
            <Link
              key={role.id}
              href={`/role-based/${industry.id}/${role.id}`}
              prefetch={prefetchFastagRole}
              onMouseEnter={() => {
                if (prefetchFastagRole) {
                  void import("@/components/role-based-dashboard/FastagIntelligenceDashboard");
                }
              }}
              style={cardStyle}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: `${accent}14`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color={accent} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 4 }}>{roleDisplayName(role)}</div>
                <div style={{ fontSize: 15, color: textSec, lineHeight: 1.55 }}>{role.sub}</div>
              </div>
              <ChevronRight size={18} color={textMut} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
