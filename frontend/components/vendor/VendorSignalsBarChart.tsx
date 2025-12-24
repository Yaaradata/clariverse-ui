'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorSignalData } from '@/lib/vendor/vendorSignals';

interface VendorSignalsBarChartProps {
  data: VendorSignalData[];
  isDarkMode?: boolean;
}

// Vendor color palettes - highly distinct colors for better segment differentiation
const VENDOR_COLORS = {
  Omilia: {
    primary: '#3B82F6',  // Sky Blue
    shades: ['#1E3A8A', '#3B82F6', '#06B6D4', '#A5F3FC'],  // Navy → Sky Blue → Cyan → Light Cyan
    gradient: { start: '#3B82F6', end: '#1E3A8A' }
  },
  LexisNexis: {
    primary: '#10B981',  // Emerald
    shades: ['#064E3B', '#10B981', '#34D399', '#6EE7B7'],  // Dark Emerald → Emerald → Light Emerald → Very Light
    gradient: { start: '#10B981', end: '#064E3B' }
  },
  Pindrop: {
    primary: '#F97316',  // Orange
    shades: ['#9A3412', '#EA580C', '#F97316', '#FDBA74'],  // Dark Orange → Orange → Bright Orange → Peach
    gradient: { start: '#F97316', end: '#9A3412' }
  }
};

export function VendorSignalsBarChart({ data, isDarkMode = false }: VendorSignalsBarChartProps) {
  // Transform data: One data point per KPI, containing all vendor sub-signals
  const chartData: Record<string, any>[] = [];
  
  // Sort KPIs by total
  const sortedKpis = [...data].sort((a, b) => {
    const totalA = a.segments.reduce((sum, seg) => sum + seg.value, 0);
    const totalB = b.segments.reduce((sum, seg) => sum + seg.value, 0);
    return totalB - totalA;
  });
  
  sortedKpis.forEach((signalData) => {
    const dataPoint: Record<string, any> = {
      name: signalData.kpiTitle,
      kpiTitle: signalData.kpiTitle,
      kpiId: signalData.kpiId,
    };
    
    const vendorOrder = ['Omilia', 'LexisNexis', 'Pindrop'] as const;
    
    // Add all vendor sub-signals to this data point
    vendorOrder.forEach((vendor) => {
      const segment = signalData.segments.find(s => s.vendor === vendor);
      if (!segment || segment.value === 0) return;
      
      // Store vendor details for tooltip
      dataPoint[`${vendor}_details`] = segment.details;
      dataPoint[`${vendor}_total`] = segment.value;
      
      // Add each sub-signal with vendor prefix for unique keys
      segment.details.forEach((detail, detailIndex) => {
        const key = `${vendor.toLowerCase()}_${detailIndex}`;
        dataPoint[key] = detail.value;
        dataPoint[`${key}_label`] = detail.label;
        dataPoint[`${key}_color`] = detail.color;
      });
    });
    
    chartData.push(dataPoint);
  });
  
  // Collect all signal keys per vendor
  const vendorSignalKeys: Record<string, string[]> = {
    'Omilia': [],
    'LexisNexis': [],
    'Pindrop': []
  };
  
  chartData.forEach(dataPoint => {
    (['Omilia', 'LexisNexis', 'Pindrop'] as const).forEach(vendor => {
      const vendorLower = vendor.toLowerCase();
      Object.keys(dataPoint).forEach(key => {
        if (key.startsWith(`${vendorLower}_`) && 
            !key.includes('_label') && 
            !key.includes('_color') && 
            !key.includes('_details') &&
            !key.includes('_total') &&
            !vendorSignalKeys[vendor].includes(key)) {
          vendorSignalKeys[vendor].push(key);
        }
      });
    });
  });
  
  // Sort signal keys to maintain consistent order
  Object.keys(vendorSignalKeys).forEach(vendor => {
    vendorSignalKeys[vendor].sort();
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const tooltipData = payload[0].payload;
    const kpiTitle = tooltipData.kpiTitle || label;
    
    const vendors = [
      { name: 'Omilia', key: 'Omilia', color: VENDOR_COLORS.Omilia.primary },
      { name: 'LexisNexis', key: 'LexisNexis', color: VENDOR_COLORS.LexisNexis.primary },
      { name: 'Pindrop', key: 'Pindrop', color: VENDOR_COLORS.Pindrop.primary }
    ];
    
    return (
      <div
        className="p-4 rounded-xl border backdrop-blur-sm"
        style={{
          backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          borderColor: isDarkMode ? 'rgba(185, 10, 189, 0.4)' : 'rgba(0, 0, 0, 0.1)',
          minWidth: '300px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
      >
        <p 
          className="text-sm font-bold mb-4 pb-2 border-b"
          style={{ 
            color: isDarkMode ? '#f9fafb' : '#1a1a1a',
            borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }}
        >
          {kpiTitle}
        </p>
        
        {vendors.map((vendor, vendorIdx) => {
          const details = tooltipData[`${vendor.key}_details`] || [];
          const vendorTotal = tooltipData[`${vendor.key}_total`] || 0;
          
          if (!details.length && vendorTotal === 0) return null;
          
          return (
            <div 
              key={vendor.name} 
              className={vendorIdx > 0 ? 'mt-3 pt-3 border-t' : ''}
              style={{ 
                borderTopColor: vendorIdx > 0 ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)') : 'transparent'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: vendor.color }}
                />
                <span 
                  className="text-sm font-semibold"
                  style={{ color: isDarkMode ? '#f9fafb' : '#1a1a1a' }}
                >
                  {vendor.name}
                </span>
                <span 
                  className="text-sm font-bold ml-auto"
                  style={{ color: vendor.color }}
                >
                  {vendorTotal}
                </span>
              </div>
              
              {details.length > 0 && (
                <div className="space-y-1 ml-5">
                  {details.map((detail: any, detailIdx: number) => (
                    <div 
                      key={detailIdx} 
                      className="flex items-center justify-between text-xs"
                    >
                      <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                        {detail.label}
                      </span>
                      <span 
                        className="font-semibold"
                        style={{ color: vendor.color }}
                      >
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Custom bar shape with rounded top and visible segment borders
  const CustomStackedBar = (props: any) => {
    const { x, y, width, height, fill, payload, dataKey } = props;
    
    if (!payload || height <= 0 || width <= 0) return null;
    
    const vendorMatch = (dataKey as string).match(/^(omilia|lexisnexis|pindrop)_/);
    if (!vendorMatch) {
      return <rect x={x} y={y} width={width} height={height} fill={fill} />;
    }
    
    const vendorLower = vendorMatch[1];
    
    const signalKeys = Object.keys(payload)
      .filter(k => k.startsWith(`${vendorLower}_`) && 
             !k.includes('_label') && 
             !k.includes('_color') && 
             !k.includes('_details') &&
             !k.includes('_total'))
      .sort();
    
    const currentIndex = signalKeys.indexOf(dataKey as string);
    const isTop = currentIndex === signalKeys.length - 1;
    const radius = isTop ? 6 : 0;
    
    // Stroke color for segment separation
    const strokeColor = isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)';
    const strokeWidth = 2;
    
    if (isTop && radius > 0) {
      return (
        <g>
          <path
            d={`
              M ${x},${y + height}
              L ${x},${y + radius}
              Q ${x},${y} ${x + radius},${y}
              L ${x + width - radius},${y}
              Q ${x + width},${y} ${x + width},${y + radius}
              L ${x + width},${y + height}
              Z
            `}
            fill={fill}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </g>
      );
    }
    
    return (
      <g>
        <rect 
          x={x} 
          y={y} 
          width={width} 
          height={height} 
          fill={fill}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </g>
    );
  };

  return (
    <Card 
      className="shadow-lg w-full flex flex-col"
      style={{
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : '#FFFFFF',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                Compliance Signals
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
        {/* Bar Chart */}
        <div style={{ height: '400px', width: '100%', overflow: 'hidden', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              barCategoryGap="20%"
              barGap={6}
            >
            <defs>
              {/* Omilia gradients - stronger opacity for better visibility */}
              {VENDOR_COLORS.Omilia.shades.map((color, idx) => (
                <linearGradient key={`omilia-grad-${idx}`} id={`omilia-gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.85} />
                </linearGradient>
              ))}
              {/* LexisNexis gradients - stronger opacity for better visibility */}
              {VENDOR_COLORS.LexisNexis.shades.map((color, idx) => (
                <linearGradient key={`lexisnexis-grad-${idx}`} id={`lexisnexis-gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.85} />
                </linearGradient>
              ))}
              {/* Pindrop gradients - stronger opacity for better visibility */}
              {VENDOR_COLORS.Pindrop.shades.map((color, idx) => (
                <linearGradient key={`pindrop-grad-${idx}`} id={`pindrop-gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.85} />
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} 
              vertical={false}
            />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              height={70}
              tick={{ 
                fill: isDarkMode ? '#9ca3af' : '#6b7280', 
                fontSize: 11
              }}
              interval={0}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ 
                fill: isDarkMode ? '#9ca3af' : '#6b7280', 
                fontSize: 12
              }}
              domain={[0, 160]}
              ticks={[0, 80, 160]}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                fill: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ 
                color: '#9ca3af', 
                paddingTop: '20px',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span 
                  className="text-sm font-medium ml-1 mr-4"
                  style={{ color: isDarkMode ? '#e5e7eb' : '#374151' }}
                >
                  {value}
                </span>
              )}
            />
            
            {/* Render stacked bars for each vendor */}
            {(['Omilia', 'LexisNexis', 'Pindrop'] as const).map(vendor => {
              const vendorLower = vendor.toLowerCase();
              const signalKeys = vendorSignalKeys[vendor] || [];
              const colors = VENDOR_COLORS[vendor].shades;
              
              return signalKeys.map((signalKey, index) => {
                const fillColor = colors[index % colors.length];
                const gradientId = `${vendorLower}-gradient-${index % colors.length}`;
                
                return (
                  <Bar
                    key={`${vendorLower}_${signalKey}`}
                    dataKey={signalKey}
                    name={index === 0 ? vendor : undefined} // Only show name for first segment in legend
                    stackId={vendorLower}
                    fill={`url(#${gradientId})`}
                    barSize={50}
                    shape={(props: any) => <CustomStackedBar {...props} />}
                    isAnimationActive={true}
                    animationDuration={600}
                    animationEasing="ease-out"
                    legendType={index === 0 ? 'circle' : 'none'}
                  />
                );
              });
            })}
          </BarChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

