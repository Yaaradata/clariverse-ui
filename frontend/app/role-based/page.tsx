"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useRoleBasedUi } from "@/components/role-based-dashboard/RoleBasedChrome";
import { INDUSTRIES } from "@/lib/role-based-dashboard/registry";

const accent = "#5332FF";

/** Stable snapshot — same array reference for SSR and client. */
const INDUSTRY_CARDS = INDUSTRIES.map((ind) => ({
  id: ind.id,
  name: ind.name,
  desc: ind.desc,
  roleCount: ind.roles.length,
  Icon: ind.icon,
}));

export default function RoleBasedIndexPage() {
  const { isDarkMode } = useRoleBasedUi();
  // Defer interactive paint until after hydration so a stale RSC/static
  // payload cannot disagree with a freshly loaded registry module.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const pageBg = isDarkMode ? "#010101" : "#F5F5F5";
  const cardBg = isDarkMode ? "#1a1a1a" : "#FAFAFA";
  const border = isDarkMode ? "#2a2a2a" : "#D6D9D8";
  const text = isDarkMode ? "#ffffff" : "#1a1a1a";
  const textMut = isDarkMode ? "#b9b9ba" : "#6b7280";

  return (
    <div
      className="container mx-auto px-6 py-12"
      style={{ backgroundColor: pageBg, minHeight: "calc(100vh - 140px)" }}
    >
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: accent,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Role-based views
        </div>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: text,
            marginBottom: 8,
          }}
        >
          Industry dashboards
        </h1>
        <p style={{ fontSize: 17, color: textMut, lineHeight: 1.55 }}>
          Select an industry, then a role — same flows as Fluid Intelligence,
          Swedbank styling.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(INDUSTRY_CARDS.length, 4)}, 1fr)`,
          gap: 20,
          maxWidth: 1100,
          margin: "0 auto",
          minHeight: ready ? undefined : 280,
        }}
      >
        {ready
          ? INDUSTRY_CARDS.map((ind) => {
              const Icon = ind.Icon;
              return (
                <Link
                  key={ind.id}
                  href={`/role-based/${ind.id}`}
                  style={{
                    background: cardBg,
                    border: `1px solid ${border}`,
                    borderRadius: 16,
                    padding: "32px 24px",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: `${accent}18`,
                      border: `1px solid ${accent}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={28} color={accent} />
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: text,
                      marginBottom: 6,
                    }}
                  >
                    {ind.name}
                  </div>
                  <div
                    style={{ fontSize: 15, color: textMut, lineHeight: 1.55 }}
                  >
                    {ind.desc}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 13, color: textMut }}>
                    {ind.roleCount} {ind.roleCount === 1 ? "role" : "roles"}
                  </div>
                </Link>
              );
            })
          : null}
      </div>
    </div>
  );
}
