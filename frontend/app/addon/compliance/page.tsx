'use client';

import { useState, useEffect } from 'react';

export default function CompliancePage() {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode from parent
  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    
    // Listen for storage changes
    window.addEventListener('storage', checkTheme);
    
    // Poll for changes (since we're in same window)
    const interval = setInterval(checkTheme, 100);
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      clearInterval(interval);
    };
  }, []);

  // Sample data for heatmap
  const riskTypes = [
    'KYC failure',
    'Dispute resolution failure',
    'Fraud patterns',
    'Security breach',
    'Data leakage',
    'RBI timeline breach',
    'NPCI/UPI mandate non-compliance',
    'Misleading/incorrect communication'
  ];

  const channels = ['Email', 'Chat', 'Voice', 'Ticket', 'Social'];
  
  // Risk scores (0-100) for heatmap - sample data
  const riskScores: { [key: string]: number[] } = {
    'KYC failure': [45, 67, 23, 89, 34],
    'Dispute resolution failure': [78, 56, 90, 45, 67],
    'Fraud patterns': [90, 88, 95, 67, 45],
    'Security breach': [34, 56, 78, 23, 12],
    'Data leakage': [56, 78, 45, 67, 89],
    'RBI timeline breach': [89, 67, 78, 90, 45],
    'NPCI/UPI mandate non-compliance': [67, 89, 45, 78, 56],
    'Misleading/incorrect communication': [45, 67, 56, 78, 89]
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#B90ABD'; // Critical - Magenta
    if (score >= 60) return '#5332FF'; // High - Blue
    if (score >= 40) return '#939394'; // Medium - Gray
    return '#D6D9D8'; // Low - Light Gray
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#010101' : '#FFFFFF' }}>
      {/* ZONE 1 — 🔥 Compliance Threat Bar */}
      <div className="border-b-4" style={{ backgroundColor: '#B90ABD', borderColor: '#5332FF' }}>
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-6 overflow-x-auto">
            <span className="text-white font-bold text-sm whitespace-nowrap">🔥 ACTIVE THREATS:</span>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg text-white text-sm whitespace-nowrap">
                ⚠️ KYC resubmission failures spiking in Email → <strong>390 pending</strong> (RBI KYC norms breach risk)
              </div>
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg text-white text-sm whitespace-nowrap">
                🚨 UPI Autopay disputes rising in Chat → <strong>67% unresolved</strong> (NPCI mandate risk)
              </div>
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg text-white text-sm whitespace-nowrap">
                ❗ FRAUD escalation loop in Voice → <strong>repeated OTP attempts</strong> (possible account takeover)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* ZONE 7 — 📈 Risk Compliance Score Board (Top KPIs) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            📈 Risk Compliance Score (RCS) Board
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Regulatory Risk Score', value: '72/100', status: 'high', desc: 'Weighted RCA across channels' },
              { label: 'KYC Compliance Rate', value: '85%', status: 'medium', desc: 'Cases processed per RBI rules' },
              { label: 'Dispute Closure Compliance', value: '67%', status: 'high', desc: 'Within NPCI/RBI limits' },
              { label: 'Fraud Escalation Count', value: '143', status: 'critical', desc: 'Suspicious auth patterns' },
              { label: 'Data Leakage Attempts', value: '28', status: 'medium', desc: 'Insecure data transmission' },
              { label: 'Channel Misalignment Index', value: '3.8', status: 'medium', desc: 'Response inconsistency' }
            ].map((kpi, idx) => (
              <div key={idx} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow" style={{ 
                borderColor: isDarkMode ? '#939394' : '#D6D9D8',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
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

        {/* ZONE 2 — ✨ AI Compliance Incident Detector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            ✨ AI Compliance Incident Detector
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              {
                title: '1️⃣ Suspicious Authentication Pattern',
                data: ['Multiple login failures', 'MFA retries', 'Repeated OTP requests', 'Channel switching (Email → Chat → Voice)'],
                action: 'Escalate this customer to Fraud Watch; pattern resembles credential-stuffing.',
                severity: 'critical'
              },
              {
                title: '2️⃣ Regulatory Closure Breach',
                data: ['RBI-mandated case closed too early', 'Resolution violated 48hr timeline', 'Case reopening required'],
                action: 'Re-open case; resolution violated mandatory RBI closure timeline (48 hrs).',
                severity: 'high'
              },
              {
                title: '3️⃣ Data Leakage Risk',
                data: ['PAN shared in Email', 'Aadhaar mentioned in Chat', 'Account number in Social media'],
                action: 'Block agent from sharing account-sensitive info; enforce secure-channel deflection.',
                severity: 'critical'
              },
              {
                title: '4️⃣ Misaligned Compliance Response',
                data: ['Same query, different answers', 'Cross-channel inconsistency', 'Policy drift detected'],
                action: 'Standardize response using compliance template #C-M3 immediately.',
                severity: 'medium'
              },
              {
                title: '5️⃣ Escalation Fraud Indicator',
                data: ['Multiple failed Chat attempts', 'Voice escalation after failures', 'Social engineering suspected'],
                action: 'Trigger enhanced KYC challenge for this session.',
                severity: 'high'
              }
            ].map((incident, idx) => (
              <div key={idx} className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-all" style={{ 
                borderColor: isDarkMode ? '#939394' : '#D6D9D8',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
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

        {/* Main Layout: 3 Columns */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* COLUMN 1: SIGNALS & DETECTION */}
          <div className="space-y-6">
            
            {/* ZONE 6 — 🧠 Governance & Policy Drift Analyzer */}
            <div className="border rounded-lg p-4 shadow-sm" style={{ 
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                🧠 Policy Drift Alerts
              </h3>
              <div className="space-y-3">
                {[
                  {
                    issue: 'Policy Drift Identified',
                    desc: 'Chat agents quoting 30 days for dispute closure; RBI-mandated period is 45 days.',
                    recommendation: 'Force-update canned responses and freeze incorrect templates.'
                  },
                  {
                    issue: 'KYC Checklist Inconsistency',
                    desc: 'Email says DL allowed, Chat says PASSPORT only.',
                    recommendation: 'Standardize KYC document requirements across all channels immediately.'
                  },
                  {
                    issue: 'Incorrect Loan Closure Fee',
                    desc: 'Voice agents providing wrong fee structure vs. documented policy.',
                    recommendation: 'Retrain agents and update knowledge base with correct fee schedule.'
                  }
                ].map((drift, idx) => (
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

          </div>

          {/* COLUMN 2: AI ACTIONS */}
          <div className="space-y-6">
            
            {/* ZONE 4 — 🧩 AI Root-Cause Aggregator */}
            <div className="border rounded-lg p-4 shadow-sm" style={{ 
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                🧩 Root-Cause Clusters
              </h3>
              <div className="space-y-3">
                {[
                  {
                    cluster: 'Inconsistent KYC document ask',
                    channels: ['Email', 'Chat'],
                    affected: 87,
                    severity: 'High',
                    summary: 'Email allows DL, Chat requires PASSPORT only - causing customer confusion and resubmissions.'
                  },
                  {
                    cluster: 'Conflicting dispute timelines',
                    channels: ['Chat', 'Voice', 'Ticket'],
                    affected: 134,
                    severity: 'Critical',
                    summary: 'Agents providing different RBI timeline interpretations (30d vs 45d vs 60d).'
                  },
                  {
                    cluster: 'UPI mandate failures',
                    channels: ['Email', 'Chat', 'Social'],
                    affected: 298,
                    severity: 'High',
                    summary: 'NPCI autopay mandate handling differs across channels causing compliance gaps.'
                  },
                  {
                    cluster: 'Re-authentication loops',
                    channels: ['Chat', 'Voice'],
                    affected: 56,
                    severity: 'Medium',
                    summary: 'Multiple auth challenges escalating to security risk scenarios.'
                  }
                ].map((cluster, idx) => (
                  <div key={idx} className="border rounded p-3" style={{ 
                    borderColor: isDarkMode ? '#939394' : '#D6D9D8',
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF'
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

            {/* ZONE 5 — 🔍 Compliance Investigation Queue */}
            <div className="border rounded-lg p-4 shadow-sm" style={{ 
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                🔍 Investigation Queue
              </h3>
              <div className="space-y-2">
                {[
                  {
                    caseId: 'C-83921',
                    riskType: 'KYC Document Mismatch',
                    channels: ['Ticket', 'Email'],
                    severity: 'High',
                    sentiment: 'Frustrated',
                    action: 'Re-extract OCR from docs → mismatch detected → assign to verification officer.'
                  },
                  {
                    caseId: 'C-84562',
                    riskType: 'Fraud/Multiple OTP',
                    channels: ['Chat', 'Voice'],
                    severity: 'Critical',
                    sentiment: 'Neutral',
                    action: 'Enhanced KYC challenge required; possible credential compromise.'
                  },
                  {
                    caseId: 'C-84890',
                    riskType: 'UPI Dispute Breach',
                    channels: ['Email', 'Ticket'],
                    severity: 'High',
                    sentiment: 'Angry',
                    action: 'Escalate to Nodal Officer; NPCI timeline exceeded.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="border rounded p-3 hover:shadow-md transition-shadow" style={{ 
                    borderColor: isDarkMode ? '#939394' : '#D6D9D8',
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF'
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

          </div>

          {/* COLUMN 3: HEATMAPS & SUMMARY */}
          <div className="space-y-6">
            
            {/* ZONE 3 — 🛰️ Cross-Channel Risk Heatmap */}
            <div className="border rounded-lg p-4 shadow-sm" style={{ 
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
            }}>
              <h3 className="text-lg font-bold mb-4" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                🛰️ Risk Heatmap
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left p-2 font-semibold" style={{ color: '#939394' }}>Risk Type</th>
                      {channels.map((ch, i) => (
                        <th key={i} className="p-2 font-semibold text-center" style={{ color: '#939394' }}>{ch}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {riskTypes.map((risk, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: isDarkMode ? '#939394' : '#D6D9D8' }}>
                        <td className="p-2 text-xs font-medium" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>{risk}</td>
                        {riskScores[risk].map((score, j) => (
                          <td key={j} className="p-2">
                            <div 
                              className="w-full h-8 rounded flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: getRiskColor(score) }}
                              onClick={() => setSelectedRisk(`${risk} - ${channels[j]}: ${score}`)}
                            >
                              {score}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <span style={{ color: '#939394' }}>Risk Score:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D6D9D8' }}></div>
                    <span style={{ color: '#939394' }}>Low (0-40)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#939394' }}></div>
                    <span style={{ color: '#939394' }}>Medium (40-60)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#5332FF' }}></div>
                    <span style={{ color: '#939394' }}>High (60-80)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B90ABD' }}></div>
                    <span style={{ color: '#939394' }}>Critical (80-100)</span>
                  </div>
                </div>
                {selectedRisk && (
                  <div className="mt-3 p-2 rounded" style={{ backgroundColor: isDarkMode ? '#5332FF40' : '#5332FF20' }}>
                    <p className="text-xs font-semibold" style={{ color: '#5332FF' }}>Selected: {selectedRisk}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
