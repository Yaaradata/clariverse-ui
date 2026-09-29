"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackToOverviewHeaderProps = {
  label?: string;
  href: string;
  h1: string;
  subtitle?: string;
};

export function BackToOverviewHeader({
  label = "Back to Overview",
  href,
  h1,
  subtitle,
}: BackToOverviewHeaderProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Link
        href={href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#a78bfa",
          textDecoration: "none",
          marginBottom: 12,
        }}
      >
        <ArrowLeft size={12} />
        {label}
      </Link>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#ffffff",
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        {h1}
      </h1>
      {subtitle ? (
        <div
          style={{
            fontSize: 14,
            color: "#939394",
            marginTop: 4,
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
