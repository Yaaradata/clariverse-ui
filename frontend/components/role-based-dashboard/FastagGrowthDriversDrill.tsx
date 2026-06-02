"use client";

import { useMemo, useState } from "react";
import { getGrowthDriversForPeriod } from "@/lib/fastag-growth-drivers/period-data";
import { fmtCount, ragPillTone } from "@/lib/fastag-growth-drivers/format";
import {
  FastagDrillCanvas,
  FastagDrillInsight,
  FastagDrillSection,
  FastagTableScroll,
  useFastagDrillTokens,
} from "./fastag-drill-ui";
import {
  FirstUsePanel,
  GrowthBlockerChart,
  OnboardingFunnelChart,
  RechargeExperiencePanel,
  RetentionPanel,
} from "./FastagGrowthDriversCharts";
import { useFastagPeriod } from "./FastagPeriodContext";

function toneColor(level: string) {
  const tone = ragPillTone(level);
  if (tone === "bad") return "rgba(255,59,70,.22)";
  if (tone === "warn") return "rgba(255,176,32,.22)";
  return "rgba(45,212,167,.22)";
}

const DENSE = true;

export function FastagGrowthDriversDrill() {
  const token = useFastagDrillTokens();
  const { period } = useFastagPeriod();
  const gd = useMemo(() => getGrowthDriversForPeriod(period), [period]);
  const {
    onboardingFunnel,
    rechargeSuccessTrend,
    rechargeMethods,
    autoRechargeFunnel,
    rechargeFailurePareto,
    firstTollSuccessTrend,
    firstUseFailures,
    firstUseJourney,
    retentionCohorts,
    repeatRechargeTrend,
    repeatTxnTrend,
    usageComposition,
    growthBlockerPareto,
    issueMatrix,
  } = gd;
  const [cohortHover, setCohortHover] = useState<{ r: number; c: number } | null>(null);
  const journeyBars = useMemo(() => {
    const start = firstUseJourney[0].count;
    return firstUseJourney.map((s) => ({ ...s, conversion: (s.count / start) * 100 }));
  }, [firstUseJourney]);

  return (
    <FastagDrillCanvas tokens={token} compact={DENSE}>
      <div className="fastag-bp-two-screen">
        <div className="fastag-bp-screen-row">
          <FastagDrillSection
            compact={DENSE}
            index="01"
            title="Onboarding Service Funnel"
            question="Is growth driven by a smooth onboarding experience?"
            tokens={token}
          >
            <OnboardingFunnelChart stages={onboardingFunnel} tokens={token} compact={DENSE} />
          </FastagDrillSection>

          <FastagDrillSection
            compact={DENSE}
            index="02"
            title="Recharge Experience Drivers"
            question="How much is growth driven by recharge convenience?"
            tokens={token}
          >
            <RechargeExperiencePanel
              successTrend={rechargeSuccessTrend}
              methods={rechargeMethods}
              autoFunnel={autoRechargeFunnel}
              failurePareto={rechargeFailurePareto}
              tokens={token}
              compact={DENSE}
            />
          </FastagDrillSection>
        </div>

        <div className="fastag-bp-screen-row">
          <FastagDrillSection
            compact={DENSE}
            index="03"
            title="First-Use and Tag Usability"
            question="Can customers use the tag right after activation?"
            tokens={token}
          >
            <FirstUsePanel
              successTrend={firstTollSuccessTrend}
              failures={firstUseFailures}
              journey={journeyBars}
              tokens={token}
              compact={DENSE}
            />
          </FastagDrillSection>

          <FastagDrillSection
            compact={DENSE}
            index="04"
            title="Repeat Usage and Retention"
            question="Is growth sustainable through service quality?"
            tokens={token}
          >
            <RetentionPanel
              cohorts={retentionCohorts}
              repeatRecharge={repeatRechargeTrend}
              repeatTxn={repeatTxnTrend}
              usage={usageComposition}
              tokens={token}
              compact={DENSE}
              cohortHover={cohortHover}
              onCohortHover={setCohortHover}
            />
          </FastagDrillSection>
        </div>

        <div className="fastag-bp-screen-row">
          <div className="fastag-bp-span-2">
            <FastagDrillSection
              compact={DENSE}
              index="05"
              title="Service Issue to Growth Impact"
              question="Which issues slow growth most — fix order by unlock"
              tokens={token}
            >
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)", gap: 10, alignItems: "start" }}>
                <GrowthBlockerChart pareto={growthBlockerPareto} tokens={token} compact={DENSE} />
                <div
                  style={{
                    border: `1px solid ${token.border}`,
                    borderRadius: 8,
                    background: token.surface,
                    padding: "8px 10px",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: token.faint,
                      fontFamily: "var(--font-mono)",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Issue impact matrix
                  </div>
                  <FastagTableScroll>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          {["Issue", "Customers", "Activations", "Repeat", "Growth", "Severity", "Owner"].map((h) => (
                            <th
                              key={h}
                              style={{
                                textAlign: h === "Issue" || h === "Owner" ? "left" : "right",
                                color: token.faint,
                                fontFamily: "var(--font-mono)",
                                fontSize: 9,
                                paddingBottom: 6,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {issueMatrix.map((x) => (
                          <tr key={x.issue}>
                            <td style={{ padding: "6px 8px 6px 0", fontSize: 11, minWidth: 120 }}>{x.issue}</td>
                            <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 10 }}>{fmtCount(x.customers)}</td>
                            <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 10 }}>{fmtCount(x.activations)}</td>
                            <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 10 }}>{fmtCount(x.repeat)}</td>
                            <td style={{ textAlign: "right" }}>
                              <span style={{ borderRadius: 999, padding: "2px 6px", background: toneColor(x.growth), fontSize: 9 }}>{x.growth}</span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <span style={{ borderRadius: 999, padding: "2px 6px", background: toneColor(x.severity), fontSize: 9 }}>{x.severity}</span>
                            </td>
                            <td style={{ textAlign: "left", paddingLeft: 8, fontSize: 10, color: token.dim }}>{x.owner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </FastagTableScroll>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                {issueMatrix.slice(0, 3).map((x) => (
                  <div
                    key={x.issue}
                    style={{
                      border: `1px solid ${token.border}`,
                      borderRadius: 8,
                      padding: "8px 10px",
                      background: token.surface2,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{x.issue}</span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: x.severity === "Critical" ? "rgba(255,59,70,.2)" : "rgba(255,176,32,.2)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {x.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: token.dim, marginTop: 4, fontFamily: "var(--font-mono)" }}>
                      {fmtCount(x.repeat)} repeat at risk · {x.owner}
                    </div>
                  </div>
                ))}
              </div>
            </FastagDrillSection>
          </div>
        </div>
      </div>

      <FastagDrillInsight
        compact={DENSE}
        tokens={token}
        text="Largest breaks at first recharge and repeat usage. Recharge gateway timeouts and low-balance alerts dominate growth blockers — sequence fixes by unlock, not ticket volume."
      />
    </FastagDrillCanvas>
  );
}
