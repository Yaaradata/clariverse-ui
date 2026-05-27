"""Generate rbiObligationRegister.ts from rbi_register.json."""

import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "rbi_register.json").read_text(encoding="utf-8"))
fluid = data["Fluid-Alone Register"][3:]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


controls: list[tuple] = []
for row in fluid:
    if len(row) < 9 or not row[1].startswith("OBL-"):
        continue
    theme, obl_id, obl, reg, process, ctl_id, ctl, signal, pct = row[:9]
    adherence = int(pct) if str(pct).isdigit() else "null"
    controls.append(
        (theme, obl_id, obl, reg, process, ctl_id, ctl, signal, adherence),
    )

by_obl: dict[str, list[int]] = defaultdict(list)
meta: dict[str, tuple] = {}
for t in controls:
    if isinstance(t[8], int):
        by_obl[t[1]].append(t[8])
    meta[t[1]] = t

summaries: list[tuple] = []
for obl_id in sorted(by_obl.keys()):
    pcts = by_obl[obl_id]
    m = meta[obl_id]
    summaries.append(
        (m[0], obl_id, m[2], m[4], round(sum(pcts) / len(pcts)), len(pcts)),
    )

CALL_REASONS = [
    ("ECS / charge dispute", "OBL-001", 1842, "Complaint not logged to CMS", 71),
    ("Loan EMI bounce / recovery", "OBL-005", 1264, "Threat or shaming language", 82),
    ("Credit card fee waiver", "OBL-002", 988, "No SR offer in first 90s", 64),
    ("ULIP / bundling on salary a/c", "OBL-018", 742, "Mandatory bundling phrasing", 74),
    ("Fraud / unauthorized txn", "OBL-012", 618, "Low empathy on fraud-victim queue", 66),
    ("Language mismatch routing", "OBL-029", 412, "Regional customer to English agent", 76),
    ("KFS not read on PL sale", "OBL-014", 284, "KFS read-out missing", 67),
    ("Repeat same-issue contact", "OBL-030", 1964, "FCR failure within 14 days", 84),
]

overall_met = round(sum(s[4] for s in summaries) / len(summaries))
risk_score = 68
fluid_alone = len(controls)

lines: list[str] = [
    "/** Generated from RBI_Obligation_Control_Register.xlsx — Fluid-alone controls. */",
    "",
    "export type RegisterControl = {",
    "  theme: string;",
    "  obligationId: string;",
    "  obligation: string;",
    "  regulation: string;",
    "  process: string;",
    "  controlId: string;",
    "  control: string;",
    "  detectionSignal: string;",
    "  adherencePct: number | null;",
    "};",
    "",
    "export type ObligationMetSummary = {",
    "  theme: string;",
    "  obligationId: string;",
    "  obligation: string;",
    "  process: string;",
    "  metPct: number;",
    "  fluidAloneControls: number;",
    "};",
    "",
    "export type CallReasonRow = {",
    "  reason: string;",
    "  obligationId: string;",
    "  volume: number;",
    "  topSignal: string;",
    "  metPct: number;",
    "};",
    "",
    f"export const REGISTER_FLUID_ALONE_COUNT = {fluid_alone};",
    f"export const REGISTER_OVERALL_MET_PCT = {overall_met};",
    f"export const REGISTER_CONDUCT_RISK_SCORE = {risk_score};",
    "",
    "export const FLUID_ALONE_CONTROLS: readonly RegisterControl[] = [",
]
for t in controls:
    lines.extend(
        [
            "  {",
            f'    theme: "{esc(t[0])}",',
            f'    obligationId: "{t[1]}",',
            f'    obligation: "{esc(t[2])}",',
            f'    regulation: "{esc(t[3])}",',
            f'    process: "{esc(t[4])}",',
            f'    controlId: "{t[5]}",',
            f'    control: "{esc(t[6])}",',
            f'    detectionSignal: "{esc(t[7])}",',
            f"    adherencePct: {t[8]},",
            "  },",
        ],
    )
lines.append("];")
lines.append("")
lines.append("export const OBLIGATION_MET_SUMMARIES: readonly ObligationMetSummary[] = [")
for s in summaries:
    lines.extend(
        [
            "  {",
            f'    theme: "{esc(s[0])}",',
            f'    obligationId: "{s[1]}",',
            f'    obligation: "{esc(s[2])}",',
            f'    process: "{esc(s[3])}",',
            f"    metPct: {s[4]},",
            f"    fluidAloneControls: {s[5]},",
            "  },",
        ],
    )
lines.extend(
    [
        "];",
        "",
        "export const OBLIGATION_MET_BY_ID: Record<string, ObligationMetSummary> =",
        "  Object.fromEntries(OBLIGATION_MET_SUMMARIES.map((o) => [o.obligationId, o]));",
        "",
        "export const TOP_CALL_REASONS: readonly CallReasonRow[] = [",
    ],
)
for r in CALL_REASONS:
    lines.extend(
        [
            "  {",
            f'    reason: "{esc(r[0])}",',
            f'    obligationId: "{r[1]}",',
            f"    volume: {r[2]},",
            f'    topSignal: "{esc(r[3])}",',
            f"    metPct: {r[4]},",
            "  },",
        ],
    )
lines.extend(
    [
        "];",
        "",
        "export const VIOLATION_TREND_WEEKLY = [",
        '  { week: "W1", violations: 42, breaches: 34 },',
        '  { week: "W2", violations: 38, breaches: 30 },',
        '  { week: "W3", violations: 51, breaches: 43 },',
        '  { week: "W4", violations: 47, breaches: 39 },',
        '  { week: "W5", violations: 44, breaches: 36 },',
        '  { week: "W6", violations: 39, breaches: 31 },',
        '  { week: "W7", violations: 35, breaches: 28 },',
        "] as const;",
        "",
    ],
)

out = ROOT / "frontend/lib/role-based-dashboard/rbiObligationRegister.ts"
out.write_text("\n".join(lines), encoding="utf-8")
print(f"wrote {out} ({len(lines)} lines)")
