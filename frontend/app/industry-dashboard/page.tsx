"use client";

import Link from "next/link";

import { INDUSTRIES, T } from "@/lib/industry-dashboard/registry";

export default function IndustryDashboardIndexPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 40px" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: T.cyan, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Yaaralabs</div>
      <h1 style={{ fontSize: 38, fontWeight: 800, color: T.text, marginBottom: 8 }}>Fluid Intelligence</h1>
      <p style={{ fontSize: 15, color: T.textMut, marginBottom: 56 }}>Select your industry</p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${INDUSTRIES.length}, 1fr)`, gap: 20, maxWidth: 1000, width: "100%" }}>
        {INDUSTRIES.map((ind) => {
          const Icon = ind.icon;
          return (
            <Link
              key={ind.id}
              href={`/industry-dashboard/${ind.id}`}
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
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
                  background: `${ind.color}15`,
                  border: `1px solid ${ind.color}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Icon size={28} color={ind.color} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 6 }}>{ind.name}</div>
              <div style={{ fontSize: 12, color: T.textMut, lineHeight: 1.5 }}>{ind.desc}</div>
              <div style={{ marginTop: 12, fontSize: 11, color: T.textSec }}>{ind.roles.length} roles</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
