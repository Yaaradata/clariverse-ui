import { PolicyDrift, policyDriftData } from '@/lib/compliance/policyDriftData';

interface PolicyDriftAlertsProps {
  isDarkMode: boolean;
  drifts?: PolicyDrift[];
}

export default function PolicyDriftAlerts({ isDarkMode, drifts }: PolicyDriftAlertsProps) {
  const defaultDrifts = drifts || policyDriftData;

  return (
      <div className="border rounded-lg p-4 shadow-sm" style={{ 
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA'
      }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
        🧠 Policy Drift Alerts
      </h3>
      <div className="space-y-3">
        {defaultDrifts.map((drift, idx) => (
          <div key={idx} className="border-l-4 p-3 rounded" style={{ 
            borderColor: '#B90ABD', 
            backgroundColor: isDarkMode ? '#B90ABD30' : '#B90ABD10' 
          }}>
            <p className="font-bold text-sm mb-1" style={{ color: '#B90ABD' }}>❗ {drift.issue}</p>
            <p className="text-xs mb-2" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>{drift.desc}</p>
            <div className="p-2 rounded text-xs" style={{ 
              backgroundColor: isDarkMode ? '#5332FF40' : '#5332FF20', 
              color: '#5332FF' 
            }}>
              ✨ AI: {drift.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

