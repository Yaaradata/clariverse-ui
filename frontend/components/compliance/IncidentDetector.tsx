import { Incident, incidentData } from '@/lib/Compliance/incidentData';

interface IncidentDetectorProps {
  isDarkMode: boolean;
  incidents?: Incident[];
}

export default function IncidentDetector({ isDarkMode, incidents }: IncidentDetectorProps) {
  const defaultIncidents = incidents || incidentData;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
        ✨ AI Compliance Incident Detector
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {defaultIncidents.map((incident, idx) => (
            <div key={idx} className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-all" style={{ 
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA'
            }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{incident.title}</h3>
            <div className="mb-3">
              <p className="text-xs font-semibold mb-1" style={{ color: '#939394' }}>Detected Data:</p>
              <ul className="text-xs space-y-1">
                {incident.data.map((item, i) => (
                  <li key={i} style={{ color: '#939394' }}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: isDarkMode ? '#5332FF40' : '#5332FF20' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#5332FF' }}>🤖 AI Action:</p>
              <p className="text-xs" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{incident.action}</p>
            </div>
            <button className="w-full py-2 rounded font-semibold text-xs text-white transition-opacity hover:opacity-90" style={{
              backgroundColor: incident.severity === 'critical' ? '#B90ABD' : 
                             incident.severity === 'high' ? '#5332FF' : '#939394'
            }}>
              Take Action
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

