"use client";

type WatermarkProps = {
  text: string;
};

export function Watermark({ text }: WatermarkProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <pattern
            id="watermark-pattern"
            x="0"
            y="0"
            width="400"
            height="400"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-30)"
          >
            <text
              x="0"
              y="200"
              fill="rgba(255, 255, 255, 0.06)"
              fontSize="16"
              fontWeight="600"
              fontFamily="var(--font, Outfit), system-ui, sans-serif"
            >
              {text}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#watermark-pattern)" />
      </svg>
    </div>
  );
}
