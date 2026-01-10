'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Map, AlertTriangle, TrendingUp, TrendingDown,
  Building2, Phone, Shield, Users,
  ChevronRight, Info
} from 'lucide-react';

interface RiskCategory {
  id: string;
  name: string;
  shortName: string;
}

interface CallCenterUnit {
  id: string;
  name: string;
  location: string;
  agents: number;
  totalCalls: number;
  risks: Record<string, number>; // riskCategoryId -> risk level (0-100)
}

const riskCategories: RiskCategory[] = [
  { id: 'compliance', name: 'Compliance Violations', shortName: 'Compliance' },
  { id: 'fraud', name: 'Fraud Detection', shortName: 'Fraud' },
  { id: 'kyc', name: 'KYC/Identity', shortName: 'KYC' },
  { id: 'script', name: 'Script Adherence', shortName: 'Script' },
  { id: 'disclosure', name: 'Disclosure Failures', shortName: 'Disclosure' },
  { id: 'aml', name: 'AML Alerts', shortName: 'AML' },
  { id: 'sentiment', name: 'Negative Sentiment', shortName: 'Sentiment' },
];

// Standard Chartered locations (for Standard Chartered routes)
const standardCharteredCallCenterUnits: CallCenterUnit[] = [
  // Primary GBS Centers - Asia-Pacific
  {
    id: 'CC-CHE',
    name: 'India (Chennai)',
    location: 'Chennai, Tamil Nadu, India',
    agents: 1300,
    totalCalls: 185000,
    risks: {
      compliance: 72,
      fraud: 35,
      kyc: 58,
      script: 65,
      disclosure: 70,
      aml: 36,
      sentiment: 30
    }
  },
  {
    id: 'CC-BLR',
    name: 'India (Bengaluru)',
    location: 'Bengaluru, Karnataka, India',
    agents: 500,
    totalCalls: 72500,
    risks: {
      compliance: 35,
      fraud: 45,
      kyc: 42,
      script: 30,
      disclosure: 38,
      aml: 75,
      sentiment: 28
    }
  },
  {
    id: 'CC-KUL',
    name: 'Malaysia (Kuala Lumpur)',
    location: 'Kuala Lumpur, Malaysia',
    agents: 500,
    totalCalls: 68900,
    risks: {
      compliance: 32,
      fraud: 75,
      kyc: 68,
      script: 25,
      disclosure: 35,
      aml: 78,
      sentiment: 28
    }
  },
  {
    id: 'CC-SHA',
    name: 'China (Shanghai)',
    location: 'Shanghai, China',
    agents: 230,
    totalCalls: 32560,
    risks: {
      compliance: 28,
      fraud: 22,
      kyc: 30,
      script: 18,
      disclosure: 25,
      aml: 24,
      sentiment: 20
    }
  },
  {
    id: 'CC-MNL',
    name: 'Philippines (Manila)',
    location: 'Manila, Philippines',
    agents: 485,
    totalCalls: 52340,
    risks: {
      compliance: 25,
      fraud: 72,
      kyc: 35,
      script: 28,
      disclosure: 32,
      aml: 38,
      sentiment: 22
    }
  },
  // Major Hubs - Asia-Pacific
  {
    id: 'CC-SIN',
    name: 'Singapore',
    location: 'Singapore',
    agents: 450,
    totalCalls: 62500,
    risks: {
      compliance: 30,
      fraud: 28,
      kyc: 32,
      script: 22,
      disclosure: 28,
      aml: 26,
      sentiment: 24
    }
  },
  {
    id: 'CC-HKG',
    name: 'Hong Kong',
    location: 'Hong Kong',
    agents: 380,
    totalCalls: 52800,
    risks: {
      compliance: 18,
      fraud: 15,
      kyc: 22,
      script: 12,
      disclosure: 20,
      aml: 16,
      sentiment: 14
    }
  },
  // Europe Region
  {
    id: 'CC-LON',
    name: 'United Kingdom (London)',
    location: 'London, United Kingdom',
    agents: 174,
    totalCalls: 24500,
    risks: {
      compliance: 20,
      fraud: 18,
      kyc: 25,
      script: 15,
      disclosure: 22,
      aml: 20,
      sentiment: 16
    }
  },
  {
    id: 'CC-WAW',
    name: 'Poland (Warsaw)',
    location: 'Warsaw, Poland',
    agents: 200,
    totalCalls: 28500,
    risks: {
      compliance: 22,
      fraud: 20,
      kyc: 28,
      script: 18,
      disclosure: 25,
      aml: 22,
      sentiment: 18
    }
  },
  {
    id: 'CC-FRA',
    name: 'Germany (Frankfurt)',
    location: 'Frankfurt, Germany',
    agents: 165,
    totalCalls: 23450,
    risks: {
      compliance: 35,
      fraud: 45,
      kyc: 42,
      script: 30,
      disclosure: 38,
      aml: 75,
      sentiment: 28
    }
  },
  // Americas Region
  {
    id: 'CC-NYC',
    name: 'United States (New York)',
    location: 'New York, NY, USA',
    agents: 245,
    totalCalls: 34560,
    risks: {
      compliance: 32,
      fraud: 75,
      kyc: 68,
      script: 25,
      disclosure: 35,
      aml: 78,
      sentiment: 28
    }
  },
  // Africa Region
  {
    id: 'CC-NAI',
    name: 'Kenya (Nairobi)',
    location: 'Nairobi, Kenya',
    agents: 195,
    totalCalls: 26750,
    risks: {
      compliance: 28,
      fraud: 22,
      kyc: 30,
      script: 18,
      disclosure: 25,
      aml: 24,
      sentiment: 20
    }
  }
];

// Standard locations (for non-Swedbank, non-Standard Chartered routes)
const standardCallCenterUnits: CallCenterUnit[] = [
  // USA Locations
  {
    id: 'CC-PHX',
    name: 'Phoenix, AZ',
    location: 'Phoenix, AZ (USA)',
    agents: 320,
    totalCalls: 45230,
    risks: {
      compliance: 18,
      fraud: 15,
      kyc: 22,
      script: 12,
      disclosure: 20,
      aml: 16,
      sentiment: 14
    }
  },
  {
    id: 'CC-BFS',
    name: 'Belfast, ME',
    location: 'Belfast, ME (USA)',
    agents: 180,
    totalCalls: 28750,
    risks: {
      compliance: 25,
      fraud: 72,
      kyc: 35,
      script: 28,
      disclosure: 32,
      aml: 38,
      sentiment: 22
    }
  },
  {
    id: 'CC-NWK',
    name: 'Newark, DE',
    location: 'Newark, DE (USA)',
    agents: 245,
    totalCalls: 34560,
    risks: {
      compliance: 32,
      fraud: 75,
      kyc: 68,
      script: 25,
      disclosure: 35,
      aml: 78,
      sentiment: 28
    }
  },
  {
    id: 'CC-JAX',
    name: 'Jacksonville, FL',
    location: 'Jacksonville, FL (USA)',
    agents: 195,
    totalCalls: 23450,
    risks: {
      compliance: 28,
      fraud: 22,
      kyc: 30,
      script: 18,
      disclosure: 25,
      aml: 24,
      sentiment: 20
    }
  },
  {
    id: 'CC-ADD',
    name: 'Addison, TX',
    location: 'Addison, TX (USA)',
    agents: 165,
    totalCalls: 18920,
    risks: {
      compliance: 30,
      fraud: 28,
      kyc: 32,
      script: 22,
      disclosure: 28,
      aml: 26,
      sentiment: 24
    }
  },
  {
    id: 'CC-GSO',
    name: 'Greensboro, NC',
    location: 'Greensboro, NC (USA)',
    agents: 142,
    totalCalls: 15670,
    risks: {
      compliance: 20,
      fraud: 18,
      kyc: 25,
      script: 15,
      disclosure: 22,
      aml: 20,
      sentiment: 16
    }
  },
  // International Locations
  {
    id: 'CC-MNL',
    name: 'Manila (Taguig)',
    location: 'Manila, Philippines',
    agents: 485,
    totalCalls: 52340,
    risks: {
      compliance: 72,
      fraud: 35,
      kyc: 58,
      script: 65,
      disclosure: 70,
      aml: 36,
      sentiment: 30
    }
  },
  {
    id: 'CC-CR',
    name: 'San Jose (Heredia)',
    location: 'San Jose, Costa Rica',
    agents: 228,
    totalCalls: 18920,
    risks: {
      compliance: 22,
      fraud: 20,
      kyc: 28,
      script: 18,
      disclosure: 25,
      aml: 22,
      sentiment: 18
    }
  },
  {
    id: 'CC-CHS',
    name: 'Chester, UK',
    location: 'Chester, United Kingdom',
    agents: 198,
    totalCalls: 13450,
    risks: {
      compliance: 35,
      fraud: 45,
      kyc: 42,
      script: 30,
      disclosure: 38,
      aml: 75,
      sentiment: 28
    }
  }
];

// Swedbank locations (based on actual operations)
const swedbankCallCenterUnits: CallCenterUnit[] = [
  {
    id: 'CC-STO',
    name: 'Sweden (Stockholm - Sundbyberg)',
    location: 'Stockholm, Sweden',
    agents: 450,
    totalCalls: 62500,
    risks: {
      compliance: 72,
      fraud: 35,
      kyc: 58,
      script: 65,
      disclosure: 70,
      aml: 36,
      sentiment: 30
    }
  },
  {
    id: 'CC-TAL',
    name: 'Estonia (Tallinn)',
    location: 'Tallinn, Estonia',
    agents: 280,
    totalCalls: 38900,
    risks: {
      compliance: 32,
      fraud: 75,
      kyc: 68,
      script: 25,
      disclosure: 35,
      aml: 78,
      sentiment: 28
    }
  },
  {
    id: 'CC-RIG',
    name: 'Latvia (Riga)',
    location: 'Riga, Latvia',
    agents: 220,
    totalCalls: 31200,
    risks: {
      compliance: 35,
      fraud: 45,
      kyc: 42,
      script: 30,
      disclosure: 38,
      aml: 75,
      sentiment: 28
    }
  },
  {
    id: 'CC-VIL',
    name: 'Lithuania (Vilnius)',
    location: 'Vilnius, Lithuania',
    agents: 400,
    totalCalls: 54800,
    risks: {
      compliance: 25,
      fraud: 72,
      kyc: 35,
      script: 28,
      disclosure: 32,
      aml: 38,
      sentiment: 22
    }
  },
  {
    id: 'CC-OSL',
    name: 'Oslo',
    location: 'Oslo, Norway',
    agents: 120,
    totalCalls: 16800,
    risks: {
      compliance: 30,
      fraud: 28,
      kyc: 32,
      script: 22,
      disclosure: 28,
      aml: 26,
      sentiment: 24
    }
  },
  {
    id: 'CC-HEL',
    name: 'Helsinki',
    location: 'Helsinki, Finland',
    agents: 110,
    totalCalls: 15200,
    risks: {
      compliance: 28,
      fraud: 22,
      kyc: 30,
      script: 18,
      disclosure: 25,
      aml: 24,
      sentiment: 20
    }
  },
  {
    id: 'CC-SHA',
    name: 'Shanghai',
    location: 'Shanghai, China',
    agents: 85,
    totalCalls: 11200,
    risks: {
      compliance: 22,
      fraud: 20,
      kyc: 28,
      script: 18,
      disclosure: 25,
      aml: 22,
      sentiment: 18
    }
  },
  {
    id: 'CC-NYC',
    name: 'New York',
    location: 'New York, USA',
    agents: 95,
    totalCalls: 12800,
    risks: {
      compliance: 20,
      fraud: 18,
      kyc: 25,
      script: 15,
      disclosure: 22,
      aml: 20,
      sentiment: 16
    }
  }
];

interface CallCenterRiskHeatMapProps {
  isDarkMode?: boolean;
}

export function CallCenterRiskHeatMap({ isDarkMode = false }: CallCenterRiskHeatMapProps) {
  const pathname = usePathname();
  const isSwedbankRoute = pathname?.startsWith('/swedbank');
  const isStandardCharteredRoute = pathname?.startsWith('/standard-chartered');
  const callCenterUnits = isSwedbankRoute 
    ? swedbankCallCenterUnits 
    : isStandardCharteredRoute 
    ? standardCharteredCallCenterUnits 
    : standardCallCenterUnits;
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ unit: string; category: string } | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<CallCenterUnit | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 70) return { bg: '#ef4444', text: '#FFFFFF', label: 'Critical' };
    if (riskLevel >= 50) return { bg: '#f97316', text: '#FFFFFF', label: 'High' };
    if (riskLevel >= 30) return { bg: '#eab308', text: '#000000', label: 'Medium' };
    return { bg: '#22c55e', text: '#FFFFFF', label: 'Low' };
  };

  const getOverallRisk = (unit: CallCenterUnit) => {
    const values = Object.values(unit.risks);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  // Sort units by overall risk (highest first)
  const sortedUnits = [...callCenterUnits].sort((a, b) => getOverallRisk(b) - getOverallRisk(a));

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
        border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
        boxShadow: isDarkMode 
          ? '0 4px 24px rgba(0, 0, 0, 0.4)'
          : '0 4px 24px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Header */}
      <div 
        className="p-5"
        style={{ 
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1a0d0d 0%, #0d0d0d 100%)'
            : 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%)',
          borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-xl"
              style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 
                className="text-base font-bold"
                style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
              >
                Contact Centre Units Risk Map
              </h3>
              <p className="text-xs" style={{ color: '#939394' }}>
                Risk distribution across {callCenterUnits.length} contact centre units
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22c55e' }} />
              <span className="text-[10px]" style={{ color: '#939394' }}>Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#eab308' }} />
              <span className="text-[10px]" style={{ color: '#939394' }}>Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }} />
              <span className="text-[10px]" style={{ color: '#939394' }}>High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }} />
              <span className="text-[10px]" style={{ color: '#939394' }}>Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heat Map Grid */}
      <div className="p-5">
        <div 
          className="overflow-auto rounded-lg"
          style={{ 
            maxHeight: '400px',
            scrollbarWidth: 'thin',
            scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5'
          }}
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-20">
              <tr style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF' }}>
                <th 
                  className="text-left p-2 text-xs font-semibold sticky left-0 z-30"
                  style={{ 
                    color: isDarkMode ? '#FFFFFF' : '#010101',
                    backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
                    minWidth: '160px'
                  }}
                >
                  Contact Centre Unit
                </th>
              {riskCategories.map((category) => (
                <th 
                  key={category.id}
                  className="p-2 text-center text-[10px] font-medium"
                  style={{ color: '#939394', minWidth: '80px' }}
                >
                  {category.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedUnits.map((unit, unitIndex) => {
              return (
                <tr 
                  key={unit.id}
                  className={`transition-all duration-300 cursor-pointer ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${unitIndex * 50}ms`,
                  }}
                  onClick={() => setSelectedUnit(selectedUnit?.id === unit.id ? null : unit)}
                >
                  <td 
                    className="p-2 sticky left-0 z-10"
                    style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF' }}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" style={{ color: '#5332FF' }} />
                      <div>
                        <p 
                          className="text-sm font-medium"
                          style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                        >
                          {unit.name}
                        </p>
                        <p className="text-[10px]" style={{ color: '#939394' }}>
                          {unit.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  {riskCategories.map((category) => {
                    const riskLevel = unit.risks[category.id];
                    const colorConfig = getRiskColor(riskLevel);
                    const isHovered = hoveredCell?.unit === unit.id && hoveredCell?.category === category.id;
                    
                    return (
                      <td 
                        key={category.id}
                        className="p-1.5"
                        onMouseEnter={() => setHoveredCell({ unit: unit.id, category: category.id })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div 
                          className="relative rounded-lg p-2 text-center transition-all duration-200"
                          style={{ 
                            backgroundColor: colorConfig.bg,
                            color: colorConfig.text,
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: isHovered ? `0 4px 12px ${colorConfig.bg}60` : 'none',
                            zIndex: isHovered ? 20 : 1
                          }}
                        >
                          <span className="text-sm font-bold">{riskLevel}</span>
                          {isHovered && (
                            <div 
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] whitespace-nowrap z-30"
                              style={{ 
                                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                                color: isDarkMode ? '#FFFFFF' : '#010101',
                                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                              }}
                            >
                              {category.name}: {colorConfig.label}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>

      {/* Selected Unit Details */}
      {selectedUnit && (
        <div 
          className="p-5 border-t"
          style={{ 
            borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
            backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF' }}
              >
                <Building2 className="w-5 h-5" style={{ color: '#5332FF' }} />
              </div>
              <div>
                <h4 
                  className="text-sm font-bold"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                >
                  {selectedUnit.name}
                </h4>
                <p className="text-xs" style={{ color: '#939394' }}>
                  {selectedUnit.location} • {selectedUnit.id}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedUnit(null)}
              className="text-xs font-medium hover:opacity-80"
              style={{ color: '#939394' }}
            >
              Close ×
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div 
              className="p-3 rounded-xl text-center"
              style={{ 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
              }}
            >
              <Users className="w-4 h-4 mx-auto mb-1" style={{ color: '#5332FF' }} />
              <p className="text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                {selectedUnit.agents}
              </p>
              <p className="text-[10px]" style={{ color: '#939394' }}>Active Agents</p>
            </div>
            <div 
              className="p-3 rounded-xl text-center"
              style={{ 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
              }}
            >
              <Phone className="w-4 h-4 mx-auto mb-1" style={{ color: '#22c55e' }} />
              <p className="text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                {selectedUnit.totalCalls.toLocaleString()}
              </p>
              <p className="text-[10px]" style={{ color: '#939394' }}>Total Calls</p>
            </div>
            <div 
              className="p-3 rounded-xl text-center"
              style={{ 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
              }}
            >
              <Shield className="w-4 h-4 mx-auto mb-1" style={{ color: '#f97316' }} />
              <p className="text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                {getOverallRisk(selectedUnit)}%
              </p>
              <p className="text-[10px]" style={{ color: '#939394' }}>Risk Score</p>
            </div>
            <div 
              className="p-3 rounded-xl text-center"
              style={{ 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
              }}
            >
              <AlertTriangle className="w-4 h-4 mx-auto mb-1" style={{ color: '#ef4444' }} />
              <p className="text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                {Object.values(selectedUnit.risks).filter(r => r >= 50).length}
              </p>
              <p className="text-[10px]" style={{ color: '#939394' }}>High Risk Areas</p>
            </div>
          </div>

          {/* Top Risk Areas */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              Top Risk Areas
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedUnit.risks)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 4)
                .map(([categoryId, riskLevel]) => {
                  const category = riskCategories.find(c => c.id === categoryId);
                  const colorConfig = getRiskColor(riskLevel);
                  return (
                    <div 
                      key={categoryId}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{ 
                        backgroundColor: `${colorConfig.bg}20`,
                        border: `1px solid ${colorConfig.bg}40`
                      }}
                    >
                      <span className="text-xs font-medium" style={{ color: colorConfig.bg }}>
                        {category?.name}
                      </span>
                      <span 
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: colorConfig.bg, color: colorConfig.text }}
                      >
                        {riskLevel}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div 
        className="px-5 py-3 border-t flex items-center justify-between"
        style={{ 
          borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
          backgroundColor: isDarkMode ? '#0a0a0a' : '#FAFAFA'
        }}
      >
        <button 
          className="text-xs font-medium hover:opacity-80 flex items-center gap-1"
          style={{ color: '#5332FF' }}
        >
          View Detailed Report
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

