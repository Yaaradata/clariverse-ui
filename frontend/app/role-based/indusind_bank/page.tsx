import { CreditCard, Headphones, Landmark } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { loadPage } from "@/lib/indusind-v1/load";
import type { Common } from "@/lib/indusind-v1/types";
import {
  INDUSIND_BANK_NAME,
  INDUSIND_PULSE_ROLE_HREF,
  INDUSIND_ROLE_COPY,
  INDUSIND_WATERMARK,
} from "@/lib/role-based-dashboard/indusindBankIndustry";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `LisN · ${INDUSIND_BANK_NAME}`,
  robots: { index: false, follow: false, nocache: true },
};

const ICONS = [Landmark, Headphones, CreditCard];
const accent = "#5332FF";

/**
 * The IndusInd role page. It has its own route so it never loads the shared role registry, the industries list or
 * any other client's demo (DEC-7): no "Back to industries", and every link stays under /role-based/indusind_bank.
 */
export default function IndusIndRolePage() {
  const common = loadPage<Common>("common");
  return (
    <div style={{ backgroundColor: "#010101", minHeight: "100vh", color: "#ffffff" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
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
              flexShrink: 0,
            }}
          >
            <Landmark size={24} color={accent} />
          </div>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>{INDUSIND_BANK_NAME}</h1>
            <p style={{ fontSize: 15, color: "#b9b9ba", margin: "4px 0 0" }}>Select your role</p>
            <p
              data-testid="watermark"
              style={{ fontSize: 12, color: "#f59e0b", margin: "8px 0 0", letterSpacing: "0.02em" }}
            >
              {INDUSIND_WATERMARK}
            </p>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 14,
          }}
        >
          {INDUSIND_ROLE_COPY.map((role, i) => {
            const Icon = ICONS[i] ?? Landmark;
            return (
              <Link
                key={role.id}
                href={INDUSIND_PULSE_ROLE_HREF[role.id]}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 14,
                  padding: "20px 22px",
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
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{role.name}</div>
                  <div style={{ fontSize: 15, color: "#e8e9e9", lineHeight: 1.55 }}>{role.sub}</div>
                </div>
              </Link>
            );
          })}
        </div>
        <footer
          data-testid="footer"
          style={{
            marginTop: 40,
            paddingTop: 14,
            borderTop: "1px solid #2a2a2a",
            fontSize: 12,
            color: "#b9b9ba",
            lineHeight: 1.6,
          }}
        >
          {common.footer}
        </footer>
      </div>
    </div>
  );
}
