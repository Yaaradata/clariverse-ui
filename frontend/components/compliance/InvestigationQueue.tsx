import { InvestigationCase, investigationData } from '@/lib/Compliance/investigationData';

interface InvestigationQueueProps {
  isDarkMode: boolean;
  cases?: InvestigationCase[];
}

export default function InvestigationQueue({ isDarkMode, cases }: InvestigationQueueProps) {
  const defaultCases = cases || investigationData;

  return (
      <div className="border rounded-lg p-4 shadow-sm" style={{ 
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA'
      }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
        🔍 Investigation Queue
      </h3>
      <div className="space-y-2">
        {defaultCases.map((item, idx) => (
            <div key={idx} className="border rounded p-3 hover:shadow-md transition-shadow" style={{ 
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#2a2a2a' : '#FAFAFA'
            }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{item.caseId}</span>
              <span className="text-xs px-2 py-1 rounded text-white font-semibold" style={{
                backgroundColor: item.severity === 'Critical' ? '#B90ABD' : '#5332FF'
              }}>
                {item.severity}
              </span>
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>{item.riskType}</p>
            <div className="flex gap-1 mb-2">
              {item.channels.map((ch, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ 
                  backgroundColor: isDarkMode ? '#5332FF40' : '#D6D9D8', 
                  color: isDarkMode ? '#FFFFFF' : '#010101' 
                }}>
                  {ch}
                </span>
              ))}
            </div>
            <p className="text-xs mb-2" style={{ color: '#939394' }}>Sentiment: {item.sentiment}</p>
            <div className="p-2 rounded text-xs mb-2" style={{ 
              backgroundColor: isDarkMode ? '#5332FF40' : '#5332FF20', 
              color: isDarkMode ? '#FFFFFF' : '#010101' 
            }}>
              🔧 AI: {item.action}
            </div>
            <button className="w-full py-1.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: '#5332FF' }}>
              Start Audit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

