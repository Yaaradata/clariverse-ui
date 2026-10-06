import { ArrowLeft, CreditCard, Headphones, Landmark } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { loadPage } from "@/lib/indusind-v1/load";
import type { Common } from "@/lib/indusind-v1/types";
import {
  INDUSIND_BANK_NAME,
  INDUSIND_EARLIER_CARDS_COPY,
  INDUSIND_EARLIER_CARDS_HREF,
  INDUSIND_PULSE_ROLE_HREF,
  INDUSIND_PULSE_V2_COPY,
  INDUSIND_PULSE_V2_HREF,
  INDUSIND_PULSE_V2_VERSION,
  INDUSIND_PULSE_VERSION,
  INDUSIND_ROLE_COPY,
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
    <div
      style={{
        backgroundColor: "#010101",
        minHeight: "100vh",
        color: "#ffffff",
      }}
    >
      <div
        style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 16px 24px" }}
      >
        {/* Back to the industries list (reviewer, 5 Oct; IV-65): the one link that leaves the IndusInd pages. */}
        <Link
          href="/role-based"
          prefetch={false}
          data-testid="back-to-industries"
          style={{
            color: "#b9b9ba",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 32,
          }}
        >
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
            <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>
              {INDUSIND_BANK_NAME}
            </h1>
            <p style={{ fontSize: 15, color: "#b9b9ba", margin: "4px 0 0" }}>
              Select your role
            </p>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: 14,
          }}
        >
          {[
            // The customer-pulse roles carry the V1 tag, pulse V2 (the HDFC pulse V2 clone) the V2 tag; the earlier Head of
            // Cards demo is listed beside them.
            ...INDUSIND_ROLE_COPY.map((role, i) => ({
              ...role,
              href: INDUSIND_PULSE_ROLE_HREF[role.id],
              Icon: ICONS[i] ?? Landmark,
              version: INDUSIND_PULSE_VERSION as string | null,
            })),
            {
              ...INDUSIND_PULSE_V2_COPY,
              href: INDUSIND_PULSE_V2_HREF,
              Icon: Landmark,
              version: INDUSIND_PULSE_V2_VERSION as string | null,
            },
            {
              ...INDUSIND_EARLIER_CARDS_COPY,
              href: INDUSIND_EARLIER_CARDS_HREF,
              Icon: CreditCard,
              version: null,
            },
          ].map(({ Icon, ...role }) => {
            return (
              <Link
                key={role.id}
                href={role.href}
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
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      marginBottom: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {role.name}
                    {role.version ? (
                      <span
                        data-testid="version-tag"
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.04em",
                          padding: "2px 7px",
                          borderRadius: 6,
                          color: accent,
                          background: `${accent}1f`,
                          border: `1px solid ${accent}40`,
                        }}
                      >
                        {role.version}
                      </span>
                    ) : null}
                  </div>
                  <div
                    style={{ fontSize: 15, color: "#e8e9e9", lineHeight: 1.55 }}
                  >
                    {role.sub}
                  </div>
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
