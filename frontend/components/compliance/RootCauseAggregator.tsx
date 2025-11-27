import { RootCauseCluster, rootCauseData } from '@/lib/Compliance/rootCauseData';

interface RootCauseAggregatorProps {
  isDarkMode: boolean;
  clusters?: RootCauseCluster[];
}

export default function RootCauseAggregator({ isDarkMode, clusters }: RootCauseAggregatorProps) {
  const defaultClusters = clusters || rootCauseData;

  return (
      <div className="border rounded-lg p-4 shadow-sm" style={{ 
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA'
      }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
        🧩 Root-Cause Clusters
      </h3>
      <div className="space-y-3">
        {defaultClusters.map((cluster, idx) => (
            <div key={idx} className="border rounded p-3" style={{ 
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#2a2a2a' : '#FAFAFA'
            }}>
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{cluster.cluster}</h4>
              <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{
                backgroundColor: cluster.severity === 'Critical' ? '#B90ABD' : 
                               cluster.severity === 'High' ? '#5332FF' : '#939394'
              }}>
                {cluster.severity}
              </span>
            </div>
            <div className="flex gap-1 mb-2">
              {cluster.channels.map((ch, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded" style={{ 
                  backgroundColor: isDarkMode ? '#5332FF40' : '#D6D9D8', 
                  color: isDarkMode ? '#FFFFFF' : '#010101' 
                }}>
                  {ch}
                </span>
              ))}
            </div>
            <p className="text-xs mb-2" style={{ color: '#939394' }}>{cluster.summary}</p>
            <p className="text-xs font-semibold" style={{ color: '#5332FF' }}>
              {cluster.affected} affected cases
            </p>
            <button className="mt-2 w-full py-1.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: '#5332FF' }}>
              View AI Action Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

