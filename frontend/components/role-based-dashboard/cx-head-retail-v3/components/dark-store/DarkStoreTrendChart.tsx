"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useUniqueGradientId } from "../../lib/useUniqueGradientId";
import { cssVar, type } from "../../theme/tokens";

function defaultDayLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `D${i + 1}`);
}

type ChartPoint = {
  label: string;
  v: number;
  isLatest: boolean;
};

function TrendPointer({
  cx,
  cy,
  label,
  color,
  dragging,
  onDragStart,
}: {
  cx: number;
  cy: number;
  label: string;
  color: string;
  dragging: boolean;
  onDragStart: () => void;
}): React.ReactElement {
  return (
    <g
      style={{ cursor: dragging ? "grabbing" : "grab" }}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDragStart();
      }}
    >
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill={color}
        fontSize={9}
        fontWeight={700}
        fontFamily={type.familyNumeric}
        style={{ pointerEvents: "none" }}
      >
        {label}
      </text>
      <circle cx={cx} cy={cy} r={12} fill="transparent" />
      <circle cx={cx} cy={cy} r={4} fill={cssVar("surface")} stroke={color} strokeWidth={2} style={{ pointerEvents: "none" }} />
    </g>
  );
}

export function DarkStoreTrendChart({
  data,
  color,
  labels,
  height = 64,
  onDayIndexChange,
}: {
  data: number[];
  color: string;
  labels?: string[];
  height?: number;
  onDayIndexChange?: (index: number) => void;
}): React.ReactElement {
  const gid = useUniqueGradientId("ds-trend");
  const containerRef = useRef<HTMLDivElement>(null);
  const timeline = labels ?? defaultDayLabels(data.length);
  const lastIndex = data.length - 1;
  const [selectedIndex, setSelectedIndex] = useState(lastIndex);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragging = dragIndex !== null;

  const chartData = useMemo<ChartPoint[]>(
    () =>
      data.map((v, i) => ({
        label: timeline[i] ?? `D${i + 1}`,
        v,
        isLatest: i === lastIndex,
      })),
    [data, timeline, lastIndex],
  );

  const activeIndex = dragging ? dragIndex : selectedIndex;

  useEffect(() => {
    onDayIndexChange?.(activeIndex);
  }, [activeIndex, onDayIndexChange]);

  const indexFromClientX = useCallback(
    (clientX: number): number => {
      const el = containerRef.current;
      if (!el || lastIndex === 0) return 0;
      const rect = el.getBoundingClientRect();
      const pad = 10;
      const innerWidth = Math.max(1, rect.width - pad * 2);
      const x = clientX - rect.left - pad;
      const ratio = Math.max(0, Math.min(1, x / innerWidth));
      return Math.max(0, Math.min(lastIndex, Math.round(ratio * lastIndex)));
    },
    [lastIndex],
  );

  useEffect(() => {
    if (!dragging) return;

    const onMove = (event: MouseEvent) => {
      setDragIndex(indexFromClientX(event.clientX));
    };

    const onUp = (event: MouseEvent) => {
      setSelectedIndex(indexFromClientX(event.clientX));
      setDragIndex(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, indexFromClientX]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        cursor: dragging ? "grabbing" : "default",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 14, right: 6, left: 2, bottom: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.42} />
              <stop offset="55%" stopColor={color} stopOpacity={0.16} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gid})`}
            isAnimationActive={false}
            dot={(props) => {
              const { cx, cy, index, payload } = props;
              if (index !== activeIndex || cx == null || cy == null) return null;
              const point = payload as ChartPoint;
              return (
                <TrendPointer
                  key={`pointer-${index}`}
                  cx={cx}
                  cy={cy}
                  label={point.label}
                  color={color}
                  dragging={dragging}
                  onDragStart={() => setDragIndex(selectedIndex)}
                />
              );
            }}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
