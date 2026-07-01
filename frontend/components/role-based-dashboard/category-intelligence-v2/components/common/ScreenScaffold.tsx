import React from "react";

import { ScreenBackBar } from "./ScreenBackBar";
import { cssVar, layout, space, type } from "../../theme/tokens";
import { PAGE_SECTION_GAP } from "./detailLayout";

export function ScreenScaffold({
  title,
  subtitle,
  children,
  onBack,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
}): React.ReactElement {
  return (
    <div
      className="lisn-anim-fade"
      style={{
        maxWidth: layout.contentMaxWidth,
        margin: "0 auto",
        padding: "24px 32px 48px",
        display: "flex",
        flexDirection: "column",
        gap: PAGE_SECTION_GAP,
      }}
    >
      {title ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: space["4"],
            width: "100%",
          }}
        >
          <div style={{ borderLeft: `3px solid ${cssVar("accent")}`, paddingLeft: 14, maxWidth: 920, minWidth: 0, flex: 1 }}>
            <h2
              style={{
                margin: 0,
                fontSize: type.scale.display,
                fontWeight: type.weight.bold,
                color: cssVar("text-primary"),
                lineHeight: 1.12,
                letterSpacing: -0.55,
              }}
            >
              {title}
            </h2>
            {subtitle ? (
              <p
                style={{
                  margin: `${space["2"]} 0 0`,
                  fontSize: type.scale.small,
                  color: cssVar("text-secondary"),
                  lineHeight: 1.5,
                  maxWidth: 720,
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          {onBack ? <ScreenBackBar onBack={onBack} /> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
