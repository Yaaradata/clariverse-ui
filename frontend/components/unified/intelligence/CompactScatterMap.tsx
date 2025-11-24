"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  Filler,
  Title,
  ChartData,
  ChartOptions,
  BubbleDataPoint,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
import { ChannelKey } from "@/lib/unified/adapters";
import { PressureScatterDatum } from "./PressureScatterMap";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Filler, Title);

const CHANNEL_COLORS: Record<ChannelKey, string> = {
  email: "#3B82F6",
  chat: "#22C55E",
  ticket: "#A855F7",
  social: "#F97316",
  voice: "#F43F5E",
};

const CHANNEL_SHADOWS: Record<ChannelKey, string> = {
  email: "rgba(59,130,246,0.55)",
  chat: "rgba(34,197,94,0.55)",
  ticket: "rgba(168,85,247,0.55)",
  social: "rgba(249,115,22,0.55)",
  voice: "rgba(244,63,94,0.55)",
};

interface CompactScatterMapProps {
  data: PressureScatterDatum[];
  height?: number;
}

type BubbleInput = BubbleDataPoint & {
  meta: PressureScatterDatum;
};

function calcRadius(backlogPercent: number, volume?: number) {
  // Use volume if available, otherwise use backlog
  const baseValue = volume ? Math.log10(volume) * 8 : Math.sqrt(backlogPercent / 100) * 30;
  return Math.min(Math.max(baseValue, 6), 28);
}

export function CompactScatterMap({ data, height = 260 }: CompactScatterMapProps) {
  const processed = useMemo(() => {
    return data.map<BubbleInput>((item) => ({
      x: item.sentiment,
      y: item.urgency,
      r: calcRadius(item.backlogPercent, (item as any).volume),
      meta: item,
    }));
  }, [data]);

  const chartData = useMemo<ChartData<"bubble", BubbleInput[]>>(() => {
    return {
      datasets: [
        {
          label: "Intent Pressure",
          data: processed,
          backgroundColor: processed.map((point) => CHANNEL_COLORS[point.meta.dominantChannel] + "CC"),
          borderColor: processed.map((point) => CHANNEL_COLORS[point.meta.dominantChannel]),
          borderWidth: processed.map((point) => 1.5),
          hoverBackgroundColor: processed.map((point) => CHANNEL_COLORS[point.meta.dominantChannel]),
          hoverBorderColor: processed.map((point) => CHANNEL_COLORS[point.meta.dominantChannel]),
        },
      ],
    };
  }, [processed]);

  const options = useMemo<ChartOptions<"bubble">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 1,
          max: 5,
          ticks: {
            color: "#9ca3af",
            stepSize: 1,
            callback: (value) => Number(value).toFixed(0),
            autoSkip: false,
            font: { size: 10 },
          },
          title: {
            display: true,
            text: "Sentiment (Happy → Frustrated)",
            color: "#d1d5db",
            font: { size: 11 },
          },
          grid: {
            color: "rgba(148,163,184,0.2)",
            lineWidth: 1,
          },
        },
        y: {
          min: 0,
          max: 1,
          title: {
            display: true,
            text: "Urgency Index",
            color: "#d1d5db",
            font: { size: 11 },
          },
          ticks: {
            color: "#9ca3af",
            callback: (value) => `${Math.round(Number(value) * 100)}%`,
            font: { size: 10 },
            stepSize: 0.1,
          },
          grid: {
            color: "rgba(148,163,184,0.2)",
            lineWidth: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "nearest",
          intersect: false,
          backgroundColor: "rgba(15,23,42,0.9)",
          borderColor: "rgba(148,163,184,0.25)",
          borderWidth: 1,
          titleColor: "#f9fafb",
          bodyColor: "#e5e7eb",
          padding: 12,
          callbacks: {
            title: (items) => {
              const datum = items[0]?.raw as BubbleInput | undefined;
              return datum?.meta.displayName ?? "";
            },
            label: (context) => {
              const datum = context.raw as BubbleInput;
              const { meta } = datum;
              return [
                `Sentiment: ${meta.sentiment.toFixed(1)}`,
                `Urgency: ${(meta.urgency * 100).toFixed(0)}%`,
                `Backlog: ${meta.backlogPercent.toFixed(0)}%`,
                `Pressure: ${meta.pressureScore.toFixed(1)}`,
                `Channel: ${meta.dominantChannel}`,
              ];
            },
          },
        },
      },
      elements: {
        point: {
          radius: (ctx) => {
            const datum = ctx.raw as BubbleInput;
            return datum?.r ?? 0;
          },
          hoverRadius: (ctx) => {
            const datum = ctx.raw as BubbleInput;
            const base = datum?.r ?? 0;
            return base * 1.2;
          },
        },
      },
    };
  }, []);

  const glowPlugin = useMemo(
    () => ({
      id: "pressureGlow",
      beforeDatasetsDraw(chart: ChartJS) {
        const { ctx } = chart;
        chart.getDatasetMeta(0).data.forEach((element, index) => {
          const datum = processed[index];
          if (!datum) return;
          const glow = Math.min(Math.max(datum.meta.pressureScore / 10, 0), 1);
          ctx.save();
          ctx.shadowColor = CHANNEL_SHADOWS[datum.meta.dominantChannel];
          ctx.shadowBlur = 12 + glow * 20;
          ctx.globalCompositeOperation = "screen";
          if (typeof (element as any)?.draw === "function") {
            (element as any).draw(ctx);
          }
          ctx.restore();
        });
      },
    }),
    [processed],
  );

  return (
    <div style={{ height: `${height}px`, width: "100%" }}>
      <Bubble data={chartData} options={options} plugins={[glowPlugin]} updateMode="resize" />
    </div>
  );
}

