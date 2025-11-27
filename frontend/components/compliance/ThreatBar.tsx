import { Threat, threatData } from '@/lib/compliance/threatData';

interface ThreatBarProps {
  threats?: Threat[];
}

export default function ThreatBar({ threats }: ThreatBarProps) {
  const defaultThreats = threats || threatData;

  return (
    <div className="border-b-4" style={{ backgroundColor: '#B90ABD', borderColor: '#5332FF' }}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center gap-6 overflow-x-auto">
          <span className="text-white font-bold text-sm whitespace-nowrap">🔥 ACTIVE THREATS:</span>
          <div className="flex gap-4">
            {defaultThreats.map((threat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg text-white text-sm whitespace-nowrap">
                {threat.icon} {threat.message} <strong>{threat.highlight}</strong> {threat.context}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

