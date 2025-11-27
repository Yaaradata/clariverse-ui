import { KPI, kpiData } from '@/lib/compliance/kpiData';

interface RiskScoreBoardProps {
  isDarkMode: boolean;
  kpis?: KPI[];
}

export default function RiskScoreBoard({ isDarkMode, kpis }: RiskScoreBoardProps) {
  const defaultKpis = kpis || kpiData;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
        📈 Risk Compliance Score (RCS) Board
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultKpis.map((kpi, idx) => (
            <div key={idx} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow" style={{ 
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA'
            }}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{kpi.label}</h3>
              <span className={`px-2 py-1 rounded text-xs font-bold text-white`} style={{
                backgroundColor: kpi.status === 'critical' ? '#B90ABD' : 
                               kpi.status === 'high' ? '#5332FF' : '#939394'
              }}>
                {kpi.status.toUpperCase()}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#5332FF' }}>{kpi.value}</div>
            <p className="text-xs" style={{ color: '#939394' }}>{kpi.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

