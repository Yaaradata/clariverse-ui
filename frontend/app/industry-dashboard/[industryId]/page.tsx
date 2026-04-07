"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { getIndustryById, T } from "@/lib/industry-dashboard/registry";

export default function IndustryRolesPage() {
  const params = useParams();
  const industryId = typeof params.industryId === "string" ? params.industryId : "";
  const industry = getIndustryById(industryId);

  if (!industry) {
    return (
      <div style={{ padding: "60px 40px", maxWidth: 560, margin: "0 auto" }}>
        <p style={{ color: T.textSec, marginBottom: 20 }}>Unknown industry &quot;{industryId}&quot;.</p>
        <Link href="/industry-dashboard" style={{ color: T.cyan }}>
          ← Back to industries
        </Link>
      </div>
    );
  }

  const IndIcon = industry.icon;

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "40px 60px", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
      <Link
        href="/industry-dashboard"
        style={{
          background: "none",
          border: "none",
          color: T.textMut,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          marginBottom: 28,
          textDecoration: "none",
          width: "fit-content",
        }}
      >
        <ArrowLeft size={14} /> Back to industries
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `${industry.color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IndIcon size={24} color={industry.color} />
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: 0 }}>{industry.name}</h1>
          <p style={{ fontSize: 13, color: T.textMut, margin: "4px 0 0" }}>Select your role</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {industry.roles.map((role) => {
          const Icon = role.icon;
          return (
            <Link
              key={role.id}
              href={`/industry-dashboard/${industry.id}/${role.id}`}
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                padding: "20px 22px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                gap: 16,
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: `${industry.color}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color={industry.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 4 }}>{role.name}</div>
                <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5 }}>{role.sub}</div>
              </div>
              <ChevronRight size={16} color={T.textMut} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
