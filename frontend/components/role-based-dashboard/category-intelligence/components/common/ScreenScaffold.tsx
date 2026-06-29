import React from "react";

import { BackToHub } from "../primitives";
import { cssVar, layout, type } from "../../theme/tokens";

export function ScreenScaffold({
  title,
  subtitle,
  children,
  onBack,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
}): React.ReactElement {
  return (
    <div
      className="lisn-cat-anim-fade"
      style={{
        maxWidth: layout.contentMaxWidth,
        margin: "0 auto",
        padding: "24px 32px 80px",
      }}
    >
      {onBack ? <BackToHub onClick={onBack} /> : null}
      <h1
        style={{
          fontSize: type.scale.h1,
          fontWeight: type.weight.bold,
          color: cssVar("text-primary"),
          margin: onBack ? "16px 0 6px" : "0 0 6px",
        }}
      >
        {title}
      </h1>
      {subtitle ? (
        <p style={{ fontSize: type.scale.body, color: cssVar("text-secondary"), margin: "0 0 20px", lineHeight: 1.5 }}>
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  );
}
