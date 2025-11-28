'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, TrendingUp, TrendingDown, AlertTriangle, 
  Users, Shield, MapPin, Activity
} from 'lucide-react';

interface RegionData {
  id: string;
  name: string;
  code: string;
  violations: number;
  complianceScore: number;
  agents: number;
  trend: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  coordinates: { x: number; y: number };
}

const regionData: RegionData[] = [
  {
    id: 'americas',
    name: 'Americas',
    code: 'AME',
    violations: 12,
    complianceScore: 87,
    agents: 245,
    trend: -5,
    riskLevel: 'medium',
    coordinates: { x: 22, y: 45 }
  },
  {
    id: 'europe',
    name: 'Europe',
    code: 'EUR',
    violations: 18,
    complianceScore: 82,
    agents: 312,
    trend: 8,
    riskLevel: 'high',
    coordinates: { x: 48, y: 32 }
  },
  {
    id: 'india',
    name: 'India',
    code: 'IND',
    violations: 8,
    complianceScore: 91,
    agents: 428,
    trend: -12,
    riskLevel: 'low',
    coordinates: { x: 65, y: 48 }
  },
  {
    id: 'apac',
    name: 'APAC',
    code: 'APAC',
    violations: 24,
    complianceScore: 76,
    agents: 567,
    trend: 15,
    riskLevel: 'critical',
    coordinates: { x: 78, y: 55 }
  },
  {
    id: 'mea',
    name: 'MEA',
    code: 'MEA',
    violations: 6,
    complianceScore: 89,
    agents: 156,
    trend: -3,
    riskLevel: 'low',
    coordinates: { x: 55, y: 52 }
  }
];

interface RegionalComplianceMapProps {
  isDarkMode?: boolean;
}

export function RegionalComplianceMap({ isDarkMode = false }: RegionalComplianceMapProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  const getRiskConfig = (level: RegionData['riskLevel']) => {
    switch (level) {
      case 'critical':
        return { color: '#ef4444', bg: '#ef444420', glow: 'rgba(239, 68, 68, 0.4)' };
      case 'high':
        return { color: '#f97316', bg: '#f9731620', glow: 'rgba(249, 115, 22, 0.4)' };
      case 'medium':
        return { color: '#eab308', bg: '#eab30820', glow: 'rgba(234, 179, 8, 0.4)' };
      case 'low':
        return { color: '#22c55e', bg: '#22c55e20', glow: 'rgba(34, 197, 94, 0.4)' };
      default:
        return { color: '#939394', bg: '#93939420', glow: 'rgba(147, 147, 148, 0.4)' };
    }
  };

  const totalViolations = regionData.reduce((sum, r) => sum + r.violations, 0);
  const totalAgents = regionData.reduce((sum, r) => sum + r.agents, 0);
  const avgCompliance = Math.round(regionData.reduce((sum, r) => sum + r.complianceScore, 0) / regionData.length);

  // Generate hexagon grid points for world map
  const generateHexGrid = () => {
    const hexagons = [];
    const hexSize = 12;
    const rows = 25;
    const cols = 50;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexSize * 1.5;
        const y = row * hexSize * 1.732 + (col % 2 ? hexSize * 0.866 : 0);
        
        // Create rough world map shape
        const isLand = isWorldMapPoint(col / cols * 100, row / rows * 100);
        
        if (isLand) {
          // Determine region color based on position
          const regionColor = getRegionColor(col / cols * 100, row / rows * 100);
          hexagons.push({ x, y, color: regionColor, opacity: 0.3 + Math.random() * 0.4 });
        }
      }
    }
    return hexagons;
  };

  // Simplified world map boundaries
  const isWorldMapPoint = (x: number, y: number): boolean => {
    // North America
    if (x >= 5 && x <= 30 && y >= 15 && y <= 55) {
      if (y < 30 && x > 25) return false;
      if (y > 50 && x < 15) return false;
      return true;
    }
    // South America
    if (x >= 20 && x <= 35 && y >= 55 && y <= 95) {
      if (x > 30 && y > 80) return false;
      return true;
    }
    // Europe
    if (x >= 40 && x <= 60 && y >= 15 && y <= 45) {
      return true;
    }
    // Africa
    if (x >= 42 && x <= 62 && y >= 40 && y <= 85) {
      if (x > 58 && y > 70) return false;
      return true;
    }
    // Asia
    if (x >= 55 && x <= 95 && y >= 15 && y <= 65) {
      if (x > 85 && y < 30) return false;
      return true;
    }
    // India
    if (x >= 60 && x <= 75 && y >= 40 && y <= 65) {
      return true;
    }
    // Australia
    if (x >= 75 && x <= 95 && y >= 70 && y <= 90) {
      return true;
    }
    return false;
  };

  const getRegionColor = (x: number, y: number): string => {
    // Americas
    if (x < 40) return '#8b5cf6';
    // Europe
    if (x >= 40 && x <= 60 && y < 50) return '#3b82f6';
    // MEA/Africa
    if (x >= 42 && x <= 62 && y >= 40) return '#06b6d4';
    // India
    if (x >= 60 && x <= 75 && y >= 40 && y <= 65) return '#22c55e';
    // APAC
    if (x > 60) return '#f43f5e';
    return '#6366f1';
  };

  const hexagons = generateHexGrid();

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Header */}
      <div 
        className="p-6 border-b"
        style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-xl"
              style={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
            >
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 
                className="text-lg font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                Regional Compliance Overview
              </h3>
              <p className="text-xs" style={{ color: '#939394' }}>
                Global compliance status across all operating regions
              </p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p 
                className="text-2xl font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                {totalAgents.toLocaleString()}
              </p>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>
                Total Agents
              </p>
            </div>
            <div className="text-center">
              <p 
                className="text-2xl font-bold"
                style={{ color: '#ef4444' }}
              >
                {totalViolations}
              </p>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>
                Violations
              </p>
            </div>
            <div className="text-center">
              <p 
                className="text-2xl font-bold"
                style={{ color: avgCompliance >= 85 ? '#22c55e' : avgCompliance >= 75 ? '#eab308' : '#ef4444' }}
              >
                {avgCompliance}%
              </p>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>
                Avg Score
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex">
        {/* Left Stats Panel */}
        <div 
          className="w-64 p-5 border-r flex-shrink-0"
          style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
        >
          <h4 
            className="text-sm font-semibold mb-4"
            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
          >
            Regional Statistics
          </h4>
          
          <div className="space-y-3">
            {regionData.map((region) => {
              const riskConfig = getRiskConfig(region.riskLevel);
              const isHovered = hoveredRegion === region.id;
              const isSelected = selectedRegion?.id === region.id;
              
              return (
                <div
                  key={region.id}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    isHovered || isSelected ? 'scale-[1.02]' : ''
                  }`}
                  style={{ 
                    backgroundColor: isSelected 
                      ? riskConfig.bg 
                      : (isDarkMode ? '#1a1a1a' : '#F5F5F5'),
                    border: `1px solid ${isSelected ? riskConfig.color : 'transparent'}`,
                    boxShadow: isSelected ? `0 4px 20px ${riskConfig.glow}` : 'none'
                  }}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => setSelectedRegion(isSelected ? null : region)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: riskConfig.color }}
                      />
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                      >
                        {region.name}
                      </span>
                    </div>
                    <span 
                      className="text-xs font-bold"
                      style={{ color: riskConfig.color }}
                    >
                      {region.complianceScore}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs" style={{ color: '#939394' }}>
                    <span>{region.violations} violations</span>
                    <span 
                      className="flex items-center gap-1"
                      style={{ color: region.trend > 0 ? '#ef4444' : '#22c55e' }}
                    >
                      {region.trend > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(region.trend)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
            <p className="text-[10px] uppercase tracking-wide mb-3" style={{ color: '#939394' }}>
              Risk Levels
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { level: 'critical', label: 'Critical' },
                { level: 'high', label: 'High' },
                { level: 'medium', label: 'Medium' },
                { level: 'low', label: 'Low' }
              ].map((item) => {
                const config = getRiskConfig(item.level as RegionData['riskLevel']);
                return (
                  <div key={item.level} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-[10px]" style={{ color: '#939394' }}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative p-6" style={{ minHeight: '400px' }}>
          {/* Hexagonal World Map */}
          <svg 
            viewBox="0 0 900 450" 
            className="w-full h-full"
            style={{ minHeight: '380px' }}
          >
            {/* Background gradient */}
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={isDarkMode ? '#1a1a2e' : '#f0f4ff'} />
                <stop offset="100%" stopColor={isDarkMode ? '#0d0d0d' : '#ffffff'} />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#mapGlow)" />

            {/* Hexagon Grid */}
            {hexagons.map((hex, i) => (
              <polygon
                key={i}
                points={`${hex.x},${hex.y-6} ${hex.x+5.2},${hex.y-3} ${hex.x+5.2},${hex.y+3} ${hex.x},${hex.y+6} ${hex.x-5.2},${hex.y+3} ${hex.x-5.2},${hex.y-3}`}
                fill={hex.color}
                opacity={hex.opacity}
                className="transition-opacity duration-300"
              />
            ))}

            {/* Connection Lines */}
            {regionData.map((region, i) => {
              const nextRegion = regionData[(i + 1) % regionData.length];
              return (
                <line
                  key={`line-${region.id}`}
                  x1={region.coordinates.x * 9}
                  y1={region.coordinates.y * 4.5}
                  x2={nextRegion.coordinates.x * 9}
                  y2={nextRegion.coordinates.y * 4.5}
                  stroke={isDarkMode ? '#2a2a2a' : '#E5E5E5'}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.5"
                />
              );
            })}

            {/* Region Markers */}
            {regionData.map((region) => {
              const riskConfig = getRiskConfig(region.riskLevel);
              const isHovered = hoveredRegion === region.id;
              const isSelected = selectedRegion?.id === region.id;
              const x = region.coordinates.x * 9;
              const y = region.coordinates.y * 4.5;

              return (
                <g 
                  key={region.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => setSelectedRegion(isSelected ? null : region)}
                >
                  {/* Pulse animation for selected/hovered */}
                  {(isHovered || isSelected) && (
                    <>
                      <circle
                        cx={x}
                        cy={y}
                        r="30"
                        fill={riskConfig.color}
                        opacity="0.1"
                        className="animate-ping"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="20"
                        fill={riskConfig.color}
                        opacity="0.2"
                      />
                    </>
                  )}

                  {/* Marker Background */}
                  <rect
                    x={x - 50}
                    y={y - 30}
                    width="100"
                    height="60"
                    rx="12"
                    fill={isDarkMode ? '#1a1a1a' : '#FFFFFF'}
                    stroke={isSelected ? riskConfig.color : (isDarkMode ? '#2a2a2a' : '#E5E5E5')}
                    strokeWidth={isSelected ? 2 : 1}
                    filter={isSelected ? 'url(#glow)' : undefined}
                    className="transition-all duration-200"
                    style={{ 
                      transform: isHovered || isSelected ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: `${x}px ${y}px`
                    }}
                  />

                  {/* Icon Circle */}
                  <circle
                    cx={x - 30}
                    cy={y}
                    r="14"
                    fill={riskConfig.bg}
                  />
                  <circle
                    cx={x - 30}
                    cy={y}
                    r="6"
                    fill={riskConfig.color}
                  />

                  {/* Region Name */}
                  <text
                    x={x + 5}
                    y={y - 8}
                    fontSize="10"
                    fontWeight="600"
                    fill={isDarkMode ? '#FFFFFF' : '#010101'}
                    textAnchor="middle"
                  >
                    {region.name}
                  </text>

                  {/* Compliance Score */}
                  <text
                    x={x + 5}
                    y={y + 8}
                    fontSize="14"
                    fontWeight="700"
                    fill={riskConfig.color}
                    textAnchor="middle"
                  >
                    {region.complianceScore}%
                  </text>

                  {/* Violations Count */}
                  <text
                    x={x + 5}
                    y={y + 22}
                    fontSize="9"
                    fill="#939394"
                    textAnchor="middle"
                  >
                    {region.violations} violations
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Selected Region Detail */}
          {selectedRegion && (
            <div 
              className="absolute bottom-6 right-6 p-4 rounded-xl animate-in slide-in-from-right-4 duration-300"
              style={{ 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                minWidth: '220px'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: getRiskConfig(selectedRegion.riskLevel).bg }}
                >
                  <MapPin 
                    className="w-4 h-4" 
                    style={{ color: getRiskConfig(selectedRegion.riskLevel).color }} 
                  />
                </div>
                <div>
                  <h4 
                    className="text-sm font-bold"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                  >
                    {selectedRegion.name}
                  </h4>
                  <p className="text-[10px]" style={{ color: '#939394' }}>
                    {selectedRegion.code} Region
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="p-2 rounded-lg text-center"
                  style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#F5F5F5' }}
                >
                  <p 
                    className="text-lg font-bold"
                    style={{ color: getRiskConfig(selectedRegion.riskLevel).color }}
                  >
                    {selectedRegion.complianceScore}%
                  </p>
                  <p className="text-[9px] uppercase" style={{ color: '#939394' }}>Score</p>
                </div>
                <div 
                  className="p-2 rounded-lg text-center"
                  style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#F5F5F5' }}
                >
                  <p 
                    className="text-lg font-bold"
                    style={{ color: '#ef4444' }}
                  >
                    {selectedRegion.violations}
                  </p>
                  <p className="text-[9px] uppercase" style={{ color: '#939394' }}>Violations</p>
                </div>
                <div 
                  className="p-2 rounded-lg text-center"
                  style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#F5F5F5' }}
                >
                  <p 
                    className="text-lg font-bold"
                    style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                  >
                    {selectedRegion.agents}
                  </p>
                  <p className="text-[9px] uppercase" style={{ color: '#939394' }}>Agents</p>
                </div>
                <div 
                  className="p-2 rounded-lg text-center"
                  style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#F5F5F5' }}
                >
                  <p 
                    className="text-lg font-bold flex items-center justify-center gap-1"
                    style={{ color: selectedRegion.trend > 0 ? '#ef4444' : '#22c55e' }}
                  >
                    {selectedRegion.trend > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(selectedRegion.trend)}%
                  </p>
                  <p className="text-[9px] uppercase" style={{ color: '#939394' }}>Trend</p>
                </div>
              </div>

              <button 
                className="w-full mt-3 py-2 rounded-lg text-xs font-medium transition-colors"
                style={{ 
                  backgroundColor: '#5332FF',
                  color: '#FFFFFF'
                }}
              >
                View Regional Details →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div 
        className="px-6 py-4 border-t flex items-center justify-between"
        style={{ 
          borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
          backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA'
        }}
      >
        <div className="flex items-center gap-8">
          {regionData.map((region) => {
            const riskConfig = getRiskConfig(region.riskLevel);
            return (
              <div key={region.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: riskConfig.color }}
                />
                <span className="text-xs font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  {region.name}
                </span>
                <span className="text-xs" style={{ color: '#939394' }}>
                  {region.agents} agents
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: '#22c55e' }} />
          <span className="text-xs" style={{ color: '#939394' }}>
            Real-time monitoring active
          </span>
        </div>
      </div>
    </div>
  );
}

