"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FASTAG_STATE_MAP_DATA,
  SEVERITY_BAND_COLORS,
  STATE_MAP_BY_CODE,
  type FastagStateMapPoint,
  type StateSeverityBand,
} from "@/lib/fastag-business-performance/state-map-data";
import type { FastagDrillTokens } from "./fastag-drill-ui";

const ACCENT = "#7c3aed";
const BAND_ORDER: StateSeverityBand[] = ["none", "low", "med", "high", "critical"];

type FastagIndiaStateFilterProps = {
  tokens: FastagDrillTokens;
  selectedStateCode: string | null;
  onSelectState: (code: string | null) => void;
  compact?: boolean;
};

export function FastagIndiaStateFilter({
  tokens,
  selectedStateCode,
  onSelectState,
  compact = false,
}: FastagIndiaStateFilterProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<{ destroy: () => void } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [topology, setTopology] = useState<object | null>(null);
  const [highchartsReady, setHighchartsReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const HighchartsRef = useRef<any>(null);
  const onSelectRef = useRef(onSelectState);
  const selectedRef = useRef(selectedStateCode);

  useEffect(() => {
    onSelectRef.current = onSelectState;
  }, [onSelectState]);

  useEffect(() => {
    selectedRef.current = selectedStateCode;
  }, [selectedStateCode]);

  useEffect(() => {
    const init = async () => {
      try {
        const hcMod = await import("highcharts");
        // Highcharts ESM export shape varies between bundlers
        const Highcharts = (hcMod as { default?: unknown }).default ?? hcMod;
        const mapMod = (await import("highcharts/modules/map")).default as unknown as ((H: unknown) => void) | undefined;
        if (typeof mapMod === "function") mapMod(Highcharts);
        HighchartsRef.current = Highcharts;
        setHighchartsReady(true);
      } catch (e) {
        console.error("FastagIndiaStateFilter: Highcharts init failed", e);
      }
    };
    void init();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("https://code.highcharts.com/mapdata/countries/in/in-all.topo.json");
        setTopology(await res.json());
        setMapLoaded(true);
      } catch (e) {
        console.error("FastagIndiaStateFilter: map topology failed", e);
      }
    };
    void load();
  }, []);

  const mapSeriesData = useMemo(
    () =>
      FASTAG_STATE_MAP_DATA.map((s) => ({
        "hc-key": s.code,
        value: s.complaintIndex,
        name: s.name,
        band: s.band,
        color: SEVERITY_BAND_COLORS[s.band].fill,
      })),
    [],
  );

  const renderChart = useCallback(() => {
    if (!chartRef.current || !mapLoaded || !topology || !highchartsReady || !HighchartsRef.current) return;

    const Highcharts = HighchartsRef.current;
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const selected = selectedRef.current;
    const chartData = mapSeriesData.map((item) => {
      const isSelected = item["hc-key"] === selected;
      const band = item.band as StateSeverityBand;
      return {
        ...item,
        color: SEVERITY_BAND_COLORS[band].fill,
        borderColor: isSelected ? ACCENT : SEVERITY_BAND_COLORS[band].border,
        borderWidth: isSelected ? 2.5 : 0.75,
      };
    });

    chartInstance.current = Highcharts.mapChart(chartRef.current, {
      chart: {
        map: topology,
        backgroundColor: "transparent",
        height: compact ? 260 : 300,
        spacing: [4, 4, 4, 4],
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      mapNavigation: { enabled: false },
      tooltip: {
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
        borderRadius: 8,
        style: { color: tokens.text, fontSize: "12px" },
        useHTML: true,
        formatter(this: { point: { name?: string; ["hc-key"]?: string } }) {
          const key = this.point["hc-key"];
          const row: FastagStateMapPoint | undefined = key ? STATE_MAP_BY_CODE[key] : undefined;
          if (!row) {
            return `<b>${this.point.name}</b><br/><span style="color:${tokens.faint}">No FASTag signal</span>`;
          }
          return (
            `<b>${row.name}</b><br/>` +
            `<span style="color:${tokens.faint}">Txn value:</span> ₹${row.txnValueCr.toFixed(2)} Cr<br/>` +
            `<span style="color:${tokens.faint}">Profit:</span> ₹${row.profitCr.toFixed(2)} Cr<br/>` +
            `<span style="color:${tokens.faint}">Loss:</span> ₹${row.lossCr.toFixed(2)} Cr<br/>` +
            `<span style="color:${tokens.faint}">Dormancy:</span> ${row.dormancyPct}%<br/>` +
            `<span style="color:${tokens.faint}">Complaint index:</span> ${row.complaintIndex}<br/>` +
            `<span style="color:${tokens.faint}">RTO:</span> ${row.rtoHub}`
          );
        },
      },
      plotOptions: {
        map: {
          allAreas: true,
          joinBy: "hc-key",
          dataLabels: { enabled: false },
          nullColor: SEVERITY_BAND_COLORS.none.fill,
          borderColor: tokens.border,
          borderWidth: 0.5,
          cursor: "pointer",
          states: {
            hover: {
              brightness: 0.06,
              borderColor: ACCENT,
              borderWidth: 2,
            },
          },
          point: {
            events: {
              click(this: { ["hc-key"]?: string }) {
                const key = this["hc-key"];
                if (!key || !STATE_MAP_BY_CODE[key]) return;
                onSelectRef.current(key);
              },
            },
          },
        },
      },
      series: [
        {
          type: "map",
          data: chartData,
        },
      ],
    });
  }, [compact, highchartsReady, mapLoaded, mapSeriesData, topology, tokens.border, tokens.faint, tokens.surface, tokens.text]);

  useEffect(() => {
    renderChart();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [renderChart, selectedStateCode]);

  const selectedState = selectedStateCode ? STATE_MAP_BY_CODE[selectedStateCode] : null;

  return (
    <div
      style={{
        border: `1px solid ${tokens.border}`,
        borderRadius: 12,
        background: tokens.surface2,
        padding: compact ? 12 : 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: compact ? 320 : 360,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <div style={{ color: tokens.faint, fontSize: 11, lineHeight: 1.45, marginBottom: 6 }}>
            Pick a state on the map (RTO from VRN), or Overall for all-India
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: tokens.text }}>India</div>
          {selectedState ? (
            <div style={{ marginTop: 4, fontSize: 11, color: tokens.dim }}>
              Showing <span style={{ fontWeight: 600, color: tokens.text }}>{selectedState.name}</span>
              {" · "}
              {selectedState.rtoHub}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onSelectState(null)}
          style={{
            flexShrink: 0,
            border: "none",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.6,
            cursor: "pointer",
            color: "#fff",
            background: selectedStateCode ? ACCENT : `${ACCENT}99`,
            boxShadow: selectedStateCode ? `0 0 0 2px ${ACCENT}33` : "none",
          }}
        >
          OVERALL
        </button>
      </div>

      <div ref={chartRef} style={{ width: "100%", minHeight: compact ? 260 : 300 }} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", paddingTop: 4 }}>
        {BAND_ORDER.map((band) => (
          <div key={band} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: SEVERITY_BAND_COLORS[band].fill,
                border: `1px solid ${SEVERITY_BAND_COLORS[band].border}`,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, color: tokens.dim, fontFamily: "var(--font-mono)" }}>
              {SEVERITY_BAND_COLORS[band].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
