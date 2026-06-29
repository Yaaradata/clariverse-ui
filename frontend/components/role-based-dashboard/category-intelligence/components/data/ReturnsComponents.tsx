import React from "react";

import { cssVar, radius } from "../../theme/tokens";

export function CauseCodeBreakdown({
  causes,
}: {
  causes: { code: string; label: string; pct: number }[];
}): React.ReactElement {
  return (
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Return cause breakdown</div>
      {causes.map((c) => (
        <div key={c.code} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span>{c.label}</span>
            <span className="lisn-cat-num" style={{ fontWeight: 600 }}>{c.pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: cssVar("border") }}>
            <div style={{ width: `${c.pct}%`, height: "100%", borderRadius: 3, background: cssVar("accent") }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FixableIntentSplit({
  fixableShare,
  intentShare,
}: {
  fixableShare: number;
  intentShare: number;
}): React.ReactElement {
  return (
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("border")}`, background: cssVar("surface") }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Fixable vs buyer-intent split</div>
      <p style={{ fontSize: 12, color: cssVar("text-muted"), margin: "0 0 12px" }}>
        Trust anchor — excess returns attributed to fixable sizing, not remorse.
      </p>
      <div style={{ display: "flex", height: 24, borderRadius: radius.sm, overflow: "hidden" }}>
        <div style={{ width: `${fixableShare}%`, background: cssVar("accent"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 600 }}>
          Fixable {fixableShare}%
        </div>
        <div style={{ width: `${intentShare}%`, background: cssVar("border-strong"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: cssVar("text-secondary") }}>
          Intent {intentShare}%
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: cssVar("text-secondary") }}>
        Method: fixable-share × excess units × unit contribution → <strong>₹6.0L</strong>
      </div>
    </div>
  );
}

export function CatalogueCorrectionCard(): React.ReactElement {
  return (
    <div style={{ padding: 16, borderRadius: radius.md, border: `1px solid ${cssVar("accent")}`, background: cssVar("accent-soft") }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Catalogue correction (PIM diff)</div>
      <p style={{ fontSize: 13, color: cssVar("text-secondary"), margin: 0, lineHeight: 1.5 }}>
        Chest measurement understated ~2.5 cm on sizing chart · sizes M–XL · drafted remap ready for Catalogue/PIM
      </p>
    </div>
  );
}
