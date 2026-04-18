"use client";

type FocusArea = { label: string; score: number };

type Regulation = {
  label: string;
  unit?: string;
  violations: number;
  criticalViolations: number;
  score: number;
  weight: number;
  regulatoryReference: string;
  focusAreas: FocusArea[];
  transcriptSignals: string[];
};

type GranularCompliance = {
  overallScore: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  financialRisk: {
    totalPotentialFines: number;
    expectedLoss: number;
    worstCaseScenario: number;
  };
  byRegulation: Record<string, Regulation>;
};

const GRANULAR_DATA: GranularCompliance = {
  overallScore: 82.4,
  riskLevel: "medium",
  financialRisk: {
    totalPotentialFines: 42_000_000,
    expectedLoss: 8_600_000,
    worstCaseScenario: 120_000_000,
  },
  byRegulation: {
    gdpr: {
      label: "GDPR (Data Protection)",
      unit: "EU",
      violations: 38,
      criticalViolations: 4,
      score: 86.2,
      weight: 0.25,
      regulatoryReference: "Regulation (EU) 2016/679",
      focusAreas: [
        { label: "Lawful basis disclosure", score: 91 },
        { label: "Data subject rights",     score: 84 },
        { label: "Third-party sharing",     score: 78 },
      ],
      transcriptSignals: [
        "share your data",
        "delete my account",
        "subject access request",
      ],
    },
    mifid: {
      label: "MiFID II (Investment Conduct)",
      unit: "EU",
      violations: 21,
      criticalViolations: 2,
      score: 79.4,
      weight: 0.2,
      regulatoryReference: "Directive 2014/65/EU",
      focusAreas: [
        { label: "Suitability assessment", score: 82 },
        { label: "Cost disclosure",        score: 74 },
        { label: "Inducements",            score: 81 },
      ],
      transcriptSignals: [
        "guaranteed returns",
        "no risk",
        "best investment",
      ],
    },
    consumerDuty: {
      label: "FCA Consumer Duty",
      unit: "UK",
      violations: 46,
      criticalViolations: 6,
      score: 72.8,
      weight: 0.25,
      regulatoryReference: "FCA PS22/9",
      focusAreas: [
        { label: "Fair value",           score: 68 },
        { label: "Consumer understanding", score: 77 },
        { label: "Vulnerability handling", score: 75 },
      ],
      transcriptSignals: [
        "hidden fees",
        "don't understand the charges",
        "vulnerable customer",
      ],
    },
    aml: {
      label: "AML / Sanctions",
      unit: "Global",
      violations: 12,
      criticalViolations: 1,
      score: 88.6,
      weight: 0.2,
      regulatoryReference: "6AMLD · OFAC · UN sanctions lists",
      focusAreas: [
        { label: "Source of funds probing", score: 90 },
        { label: "PEP screening",           score: 92 },
        { label: "Structuring patterns",    score: 83 },
      ],
      transcriptSignals: [
        "cash deposit",
        "offshore account",
        "beneficial owner",
      ],
    },
    mortgage: {
      label: "Mortgage Conduct of Business",
      unit: "UK",
      violations: 17,
      criticalViolations: 2,
      score: 81.0,
      weight: 0.1,
      regulatoryReference: "FCA MCOB",
      focusAreas: [
        { label: "Affordability assessment", score: 83 },
        { label: "Arrears handling",         score: 76 },
        { label: "Product disclosure",       score: 84 },
      ],
      transcriptSignals: [
        "can you stretch the term",
        "missed payment",
        "forbearance",
      ],
    },
  },
};

const CURRENCY_SYMBOL = "€";

function colorForScore(score: number) {
  if (score >= 90) return "#4ade80";
  if (score >= 80) return "#facc15";
  if (score >= 70) return "#fb923c";
  return "#f87171";
}

function barClassForScore(score: number) {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-yellow-500";
  if (score >= 70) return "bg-orange-500";
  return "bg-red-500";
}

export function RetailComplianceHealth() {
  const data = GRANULAR_DATA;

  const riskLevelColor =
    data.riskLevel === "critical"
      ? "text-red-400"
      : data.riskLevel === "high"
      ? "text-orange-400"
      : data.riskLevel === "medium"
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-[#2b2b2b] bg-[#0D0D0D] shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
      <div className="flex flex-shrink-0 flex-col space-y-1.5 p-6">
        <div className="flex items-center justify-between">
          <h3
            className="text-2xl font-semibold leading-none tracking-tight text-lg"
            style={{ color: "#fff" }}
          >
            Compliance Health
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {data.overallScore.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">Overall Score</div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Expected Loss: {CURRENCY_SYMBOL}
          {(data.financialRisk.expectedLoss / 1_000_000).toFixed(1)}M | Risk
          Level:{" "}
          <span className={`font-semibold ${riskLevelColor}`}>
            {data.riskLevel.toUpperCase()}
          </span>
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6 pt-0 pr-2">
        <div className="space-y-3">
          {Object.entries(data.byRegulation).map(([key, regulation]) => (
            <div
              key={key}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">
                    {regulation.label}
                  </span>
                  {regulation.unit && (
                    <span className="text-[10px] border border-blue-500/40 text-blue-400 bg-blue-500/10 rounded px-2 py-0.5">
                      {regulation.unit}
                    </span>
                  )}
                  <span
                    className="bg-white/10 text-xs text-white/80 border border-white/10 rounded px-2 py-0.5"
                    title={regulation.regulatoryReference}
                  >
                    {regulation.violations} voice flags
                  </span>
                  {regulation.criticalViolations > 0 && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/50 text-xs rounded px-2 py-0.5">
                      {regulation.criticalViolations} critical
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className="text-lg font-bold"
                    style={{ color: colorForScore(regulation.score) }}
                  >
                    {regulation.score.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    Weight: {(regulation.weight * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${barClassForScore(
                    regulation.score,
                  )}`}
                  style={{ width: `${regulation.score}%` }}
                />
              </div>

              <div className="mt-2 grid grid-cols-1 gap-1">
                {regulation.focusAreas.map(area => (
                  <div
                    key={area.label}
                    className="flex items-center justify-between text-xs text-gray-400 bg-white/5 border border-white/10 rounded px-2 py-1"
                  >
                    <span>{area.label}</span>
                    <span style={{ color: colorForScore(area.score) }}>
                      {area.score}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-2 text-[10px] text-white/40 uppercase tracking-wide">
                Transcript cues: {regulation.transcriptSignals.join(" • ")}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-xs text-gray-400 mb-1">Potential Fines</div>
              <div className="text-sm font-semibold text-red-400">
                {CURRENCY_SYMBOL}
                {(data.financialRisk.totalPotentialFines / 1_000_000).toFixed(0)}M
              </div>
            </div>
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-xs text-gray-400 mb-1">Expected Loss</div>
              <div className="text-sm font-semibold text-orange-400">
                {CURRENCY_SYMBOL}
                {(data.financialRisk.expectedLoss / 1_000_000).toFixed(1)}M
              </div>
            </div>
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-xs text-gray-400 mb-1">Worst Case</div>
              <div className="text-sm font-semibold text-red-400">
                {CURRENCY_SYMBOL}
                {(data.financialRisk.worstCaseScenario / 1_000_000).toFixed(0)}M
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
