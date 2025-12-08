'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

interface MapDataPoint {
  'hc-key': string;
  value: number;
  name: string;
  lat?: number;
  lon?: number;
}

interface PincodeData {
  pincode: string;
  placeName: string;
  city: string;
  disruptions: number;
  coordinates: { lat: number; lon: number };
}

interface StateDisruptionData {
  code: string;
  name: string;
  disruptions: number;
}

interface HighchartsIndiaMapProps {
  data: MapDataPoint[];
  onStateClick: (stateCode: string, stateName: string) => void;
  selectedState: string | null;
  drillDownLevel: 'state' | 'pincode';
  selectedStateData: StateDisruptionData | null;
  pincodeData: PincodeData[];
}

export default function HighchartsIndiaMapComponent({ 
  data, 
  onStateClick,
  selectedState,
  drillDownLevel,
  selectedStateData,
  pincodeData
}: HighchartsIndiaMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [topology, setTopology] = useState<any>(null);
  const [highchartsReady, setHighchartsReady] = useState(false);
  const HighchartsRef = useRef<any>(null);

  // Initialize Highcharts on client side only
  useEffect(() => {
    const initHighcharts = async () => {
      try {
        // Dynamic imports to avoid SSR issues
        const Highcharts = (await import('highcharts')).default;
        const HighchartsMapModule = (await import('highcharts/modules/map')).default as unknown as ((H: typeof Highcharts) => void) | undefined;
        
        // Initialize map module
        if (typeof HighchartsMapModule === 'function') {
          HighchartsMapModule(Highcharts);
        }
        
        HighchartsRef.current = Highcharts;
        setHighchartsReady(true);
      } catch (error) {
        console.error('Failed to initialize Highcharts:', error);
      }
    };

    initHighcharts();
  }, []);

  // Load India map topology
  useEffect(() => {
    const loadMap = async () => {
      try {
        const response = await fetch(
          'https://code.highcharts.com/mapdata/countries/in/in-all.topo.json'
        );
        const topoData = await response.json();
        setTopology(topoData);
        setMapLoaded(true);
      } catch (error) {
        console.error('Failed to load India map:', error);
      }
    };
    loadMap();
  }, []);

  // Use refs to store latest values to avoid dependency array issues
  const dataRef = useRef(data);
  const pincodeDataRef = useRef(pincodeData);
  const selectedStateDataRef = useRef(selectedStateData);
  const drillDownLevelRef = useRef(drillDownLevel);
  const selectedStateRef = useRef(selectedState);
  const onStateClickRef = useRef(onStateClick);

  // Update refs when values change
  useEffect(() => {
    dataRef.current = data;
  }, [data]);
  
  useEffect(() => {
    pincodeDataRef.current = pincodeData;
  }, [pincodeData]);
  
  useEffect(() => {
    selectedStateDataRef.current = selectedStateData;
  }, [selectedStateData]);
  
  useEffect(() => {
    drillDownLevelRef.current = drillDownLevel;
  }, [drillDownLevel]);
  
  useEffect(() => {
    selectedStateRef.current = selectedState;
  }, [selectedState]);
  
  useEffect(() => {
    onStateClickRef.current = onStateClick;
  }, [onStateClick]);

  // Create stable dependency values - include data hash for filter changes
  const dataHash = useMemo(() => {
    if (data.length === 0) return 'empty';
    // Create hash from first, middle, and last items plus total count
    const first = data[0];
    const middle = data[Math.floor(data.length / 2)];
    const last = data[data.length - 1];
    return `${first?.['hc-key']}-${first?.value}-${middle?.['hc-key']}-${middle?.value}-${last?.['hc-key']}-${last?.value}-${data.length}`;
  }, [data]);
  
  const pincodeDataKey = useMemo(() => pincodeData.length > 0 ? `${pincodeData[0]?.pincode}-${pincodeData.length}` : 'empty', [pincodeData.length]);
  const selectedStateKey = useMemo(() => selectedState || 'none', [selectedState]);
  const drillDownKey = useMemo(() => drillDownLevel, [drillDownLevel]);
  const selectedStateDataKey = useMemo(() => selectedStateData?.code || 'none', [selectedStateData?.code]);

  // Create/update chart
  useEffect(() => {
    if (!chartRef.current || !mapLoaded || !topology || !highchartsReady || !HighchartsRef.current) return;

    const Highcharts = HighchartsRef.current;
    const currentData = dataRef.current;
    const currentPincodeData = pincodeDataRef.current;
    const currentSelectedStateData = selectedStateDataRef.current;
    const currentDrillDownLevel = drillDownLevelRef.current;
    const currentSelectedState = selectedStateRef.current;
    const currentOnStateClick = onStateClickRef.current;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    if (currentDrillDownLevel === 'pincode' && currentSelectedStateData && currentPincodeData.length > 0) {
      // Pincode drill-down view - show markers on map
      const options: any = {
        chart: {
          map: topology,
          backgroundColor: '#f8fafc',
          style: {
            fontFamily: 'inherit',
          },
          height: 480,
        },
        title: {
          text: `<b>${currentSelectedStateData.name}</b> - Pincode Breakdown`,
          useHTML: true,
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#1e293b',
          },
        },
        credits: {
          enabled: false,
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            align: 'left',
            verticalAlign: 'top',
            x: 10,
            y: 10,
            theme: {
              fill: '#ffffff',
              'stroke-width': 1,
              stroke: '#e2e8f0',
              r: 4,
              states: {
                hover: {
                  fill: '#f1f5f9',
                },
                select: {
                  fill: '#e2e8f0',
                },
              },
            },
          },
          buttons: {
            zoomIn: {
              text: '+',
            },
            zoomOut: {
              text: '−',
            },
          },
        },
        legend: {
          enabled: false,
        },
        colorAxis: {
          min: 0,
          max: Math.max(...currentPincodeData.map(p => p.disruptions), 1),
          stops: [
            [0, '#e0f2fe'],
            [0.25, '#7dd3fc'],
            [0.5, '#38bdf8'],
            [0.75, '#0284c7'],
            [1, '#0c4a6e'],
          ],
          labels: {
            enabled: false,
          },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          borderColor: '#334155',
          borderRadius: 8,
          shadow: true,
          style: {
            color: '#ffffff',
            fontSize: '12px',
          },
          formatter: function (this: any): string {
            const point = this.point;
            return `<b style="font-size: 13px;">${point.name}</b><br/>` +
                   `<span style="color: #94a3b8;">Pincode:</span> <b style="color: #38bdf8;">${point.pincode || ''}</b><br/>` +
                   `<span style="color: #94a3b8;">Disruptions:</span> <b style="color: #38bdf8;">${point.value?.toLocaleString() || 0}</b>`;
          },
          useHTML: true,
        },
        plotOptions: {
          map: {
            allAreas: true,
            joinBy: 'hc-key',
            dataLabels: {
              enabled: false,
            },
            states: {
              hover: {
                brightness: 0.1,
                borderColor: '#0284c7',
                borderWidth: 2,
              },
            },
            borderColor: '#ffffff',
            borderWidth: 1,
            nullColor: '#e2e8f0',
            cursor: 'pointer',
          },
          mappoint: {
            tooltip: {
              pointFormat: '<b>{point.name}</b><br/>Pincode: {point.pincode}<br/>Disruptions: {point.value}',
            },
            dataLabels: {
              enabled: true,
              format: '{point.pincode}',
              style: {
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#1e293b',
                textOutline: '1px contrast',
              },
            },
            marker: {
              radius: 6,
              fillColor: '#0284c7',
              lineColor: '#ffffff',
              lineWidth: 2,
            },
          },
        },
        series: [
          {
            type: 'map',
            name: currentSelectedStateData.name,
            data: [{
              'hc-key': currentSelectedStateData.code,
              value: currentSelectedStateData.disruptions,
              name: currentSelectedStateData.name,
            }],
            joinBy: 'hc-key',
            states: {
              hover: {
                brightness: 0.1,
                borderColor: '#0284c7',
                borderWidth: 2,
              },
            },
            borderColor: '#ffffff',
            borderWidth: 1,
            nullColor: '#e2e8f0',
          },
          {
            type: 'mappoint',
            name: 'Pincodes',
            data: currentPincodeData.map(p => ({
              name: p.placeName,
              pincode: p.pincode,
              lat: p.coordinates.lat,
              lon: p.coordinates.lon,
              value: p.disruptions,
            })),
            colorAxis: {
              min: 0,
              max: Math.max(...currentPincodeData.map(p => p.disruptions), 1),
              stops: [
                [0, '#e0f2fe'],
                [0.25, '#7dd3fc'],
                [0.5, '#38bdf8'],
                [0.75, '#0284c7'],
                [1, '#0c4a6e'],
              ],
            },
            marker: {
              radius: function (this: any) {
                const maxDisruptions = Math.max(...currentPincodeData.map(p => p.disruptions), 1);
                return 4 + (this.value / maxDisruptions) * 8;
              },
              fillColor: function (this: any) {
                const maxDisruptions = Math.max(...currentPincodeData.map(p => p.disruptions), 1);
                const intensity = this.value / maxDisruptions;
                if (intensity < 0.2) return '#e0f2fe';
                if (intensity < 0.4) return '#7dd3fc';
                if (intensity < 0.6) return '#38bdf8';
                if (intensity < 0.8) return '#0284c7';
                return '#0c4a6e';
              },
              lineColor: '#ffffff',
              lineWidth: 2,
            },
          },
        ],
      };

      chartInstance.current = Highcharts.mapChart(chartRef.current, options);
    } else {
      // State-level view with tier/category-based coloring
      const chartData = currentData.map((item: any) => ({
        'hc-key': item['hc-key'],
        value: item.value || 0,
        name: item.name,
        selected: item['hc-key'] === currentSelectedState,
        color: item.color || '#e2e8f0', // Use custom color from map data
        tiers: item.tiers || [],
        categories: item.categories || [],
        dominantTier: item.dominantTier || null,
        dominantCategory: item.dominantCategory || null,
        colorType: item.colorType || 'tier',
        disruptionCount: item.disruptionCount || item.value || 0,
      }));

      const options: any = {
        chart: {
          map: topology,
          backgroundColor: '#f8fafc',
          style: {
            fontFamily: 'inherit',
          },
          height: 480,
        },
        title: {
          text: undefined,
        },
        credits: {
          enabled: false,
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            align: 'left',
            verticalAlign: 'top',
            x: 10,
            y: 10,
            theme: {
              fill: '#ffffff',
              'stroke-width': 1,
              stroke: '#e2e8f0',
              r: 4,
              states: {
                hover: {
                  fill: '#f1f5f9',
                },
                select: {
                  fill: '#e2e8f0',
                },
              },
            },
          },
          buttons: {
            zoomIn: {
              text: '+',
            },
            zoomOut: {
              text: '−',
            },
          },
        },
        legend: {
          enabled: true,
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          padding: 10,
          itemStyle: {
            fontSize: '11px',
            color: '#1e293b',
            fontWeight: '500',
          },
          symbolHeight: 12,
          symbolWidth: 12,
          symbolRadius: 6,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderRadius: 6,
          shadow: false,
        },
        colorAxis: {
          enabled: false, // Disable default color axis, use custom colors
        },
        tooltip: {
          backgroundColor: '#1e293b',
          borderColor: '#334155',
          borderRadius: 8,
          shadow: true,
          style: {
            color: '#ffffff',
            fontSize: '12px',
          },
          formatter: function (this: any): string {
            const point = this.point as any;
            const tierLabels: Record<string, string> = {
              'tier1': 'Tier 1',
              'tier2': 'Tier 2',
              'tier3': 'Tier 3',
            };
            const categoryLabels: Record<string, string> = {
              'weather': 'Weather & Environment',
              'infrastructure': 'Infrastructure & Traffic',
              'socioPolitical': 'Socio-Political & Security',
              'operational': 'Operational & Human',
            };
            const categoryColors: Record<string, string> = {
              'weather': '#3b82f6',
              'infrastructure': '#f97316',
              'socioPolitical': '#ef4444',
              'operational': '#22c55e',
            };
            
            let tooltip = `<b style="font-size: 13px;">${point.name}</b><br/>`;
            tooltip += `<span style="color: #94a3b8;">Statics:</span> <b style="color: #38bdf8;">${(point.disruptionCount || point.value || 0).toLocaleString()}</b><br/>`;
            
            if (point.tiers && point.tiers.length > 0) {
              const tierList = point.tiers.map((t: string) => tierLabels[t] || t).join(', ');
              tooltip += `<span style="color: #94a3b8;">Tiers:</span> <b style="color: #ffffff;">${tierList}</b><br/>`;
              
              if (point.dominantTier) {
                const dominantTierLabel = tierLabels[point.dominantTier] || point.dominantTier;
                tooltip += `<span style="color: #94a3b8;">Dominant Tier:</span> <b style="color: ${point.color || '#38bdf8'};">${dominantTierLabel}</b><br/>`;
              }
            }
            
            if (point.categories && point.categories.length > 0) {
              const categoryList = point.categories.map((c: string) => {
                const color = categoryColors[c] || '#38bdf8';
                const label = categoryLabels[c] || c;
                return `<span style="color: ${color};">●</span> ${label}`;
              }).join(', ');
              tooltip += `<span style="color: #94a3b8;">Categories:</span> <span style="color: #ffffff;">${categoryList}</span><br/>`;
              
              if (point.dominantCategory && point.colorType === 'category') {
                const dominantCategoryLabel = categoryLabels[point.dominantCategory] || point.dominantCategory;
                const dominantCategoryColor = categoryColors[point.dominantCategory] || '#38bdf8';
                tooltip += `<span style="color: #94a3b8;">Dominant Category:</span> <b style="color: ${dominantCategoryColor};">${dominantCategoryLabel}</b>`;
              }
            } else if (!point.tiers || point.tiers.length === 0) {
              tooltip += `<span style="color: #94a3b8; font-style: italic;">No matching locations</span>`;
            }
            
            return tooltip;
          },
          useHTML: true,
        },
        plotOptions: {
          map: {
            allAreas: true,
            joinBy: 'hc-key',
            dataLabels: {
              enabled: false,
            },
            states: {
              hover: {
                brightness: 0.05,
                borderColor: function (this: any) {
                  return this.point.color || '#0284c7';
                },
                borderWidth: 2,
              },
              select: {
                brightness: 0.1,
                borderColor: function (this: any) {
                  return this.point.color || '#0284c7';
                },
                borderWidth: 2,
              },
            },
            borderColor: '#ffffff',
            borderWidth: 1,
            nullColor: '#e2e8f0',
            cursor: 'pointer',
            point: {
              events: {
                click: function (this: any) {
                  const point = this;
                  currentOnStateClick(point['hc-key'], point.name);
                },
              },
            },
            colorByPoint: true, // Use individual point colors
          },
        },
        series: [{
          type: 'map',
          name: 'Disruptions',
          data: chartData.map((d: any) => ({
            ...d,
            color: d.color || '#e2e8f0', // Set color on each point
          })),
          allowPointSelect: true,
        }],
      };

      chartInstance.current = Highcharts.mapChart(chartRef.current, options);
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [mapLoaded, topology, highchartsReady, dataHash, selectedStateKey, drillDownKey, selectedStateDataKey, pincodeDataKey]);

  // Update selected state
  useEffect(() => {
    if (!chartInstance.current || drillDownLevelRef.current === 'pincode') return;
    
    const series = chartInstance.current.series[0];
    if (series && series.points) {
      const currentSelectedState = selectedStateRef.current;
      series.points.forEach((point: any) => {
        if (point['hc-key'] === currentSelectedState) {
          point.select(true, false);
        } else {
          point.select(false, false);
        }
      });
    }
  }, [selectedStateKey, drillDownKey]);

  return (
    <div className="w-full h-full relative">
      {(!mapLoaded || !highchartsReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-sm text-slate-500">Loading map...</span>
          </div>
        </div>
      )}
      <div 
        ref={chartRef} 
        className="w-full h-full"
        style={{ minHeight: '480px' }}
      />
    </div>
  );
}
