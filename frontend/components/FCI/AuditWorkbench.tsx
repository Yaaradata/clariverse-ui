'use client';

import { useState } from 'react';
import { AuditWorkbenchData } from '@/lib/fci-lib/fciAdvancedData';
import { CheckCircle, XCircle, AlertCircle, BookOpen, MessageSquare } from 'lucide-react';

interface AuditWorkbenchProps {
  data: AuditWorkbenchData;
  isDarkMode?: boolean;
}

export function AuditWorkbench({ data, isDarkMode = false }: AuditWorkbenchProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const getStatusIcon = (status: 'pass' | 'fail' | 'risk') => {
    if (status === 'pass') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'fail') return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'risk') => {
    if (status === 'pass') return '#10b981';
    if (status === 'fail') return '#ef4444';
    return '#f59e0b';
  };

  const getHighlightColor = (highlight: 'success' | 'failure' | 'risk' | null) => {
    if (highlight === 'success') return isDarkMode ? '#10b98130' : '#10b98120';
    if (highlight === 'failure') return isDarkMode ? '#ef444430' : '#ef444420';
    if (highlight === 'risk') return isDarkMode ? '#f59e0b30' : '#f59e0b20';
    return 'transparent';
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h3
        className="text-lg font-bold mb-4"
        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
      >
        Component G: Three-Pane "Audit Workbench"
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pane 1: The Evidence Layer - Smart-Highlighted Transcript */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            Pane 1: The Evidence Layer (Smart-Highlighted Transcript)
          </h4>
          <div
            className="border rounded-lg p-3 h-96 overflow-y-auto"
            style={{
              borderColor: isDarkMode ? '#939394' : '#D6D9D8',
              backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
            }}
          >
            {data.transcript.map((line, idx) => (
              <div
                key={idx}
                className="mb-3 p-2 rounded transition-all"
                style={{
                  backgroundColor: hoveredLine === idx ? getHighlightColor(line.highlight) : 'transparent',
                  borderLeft: line.highlight ? `4px solid ${line.highlight === 'success' ? '#10b981' : line.highlight === 'failure' ? '#ef4444' : '#f59e0b'}` : 'none',
                  paddingLeft: line.highlight ? '8px' : '12px'
                }}
                onMouseEnter={() => setHoveredLine(idx)}
                onMouseLeave={() => setHoveredLine(null)}
              >
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-xs font-semibold" style={{ color: '#939394' }}>
                    {line.timestamp}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: line.speaker === 'Agent' ? '#5332FF20' : '#B90ABD20',
                      color: line.speaker === 'Agent' ? '#5332FF' : '#B90ABD'
                    }}
                  >
                    {line.speaker}
                  </span>
                </div>
                <p className="text-sm" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                  {line.text}
                </p>
                {line.tooltip && hoveredLine === idx && (
                  <div
                    className="mt-2 p-2 rounded text-xs"
                    style={{
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                      border: `1px solid ${isDarkMode ? '#939394' : '#D6D9D8'}`
                    }}
                  >
                    {line.tooltip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pane 2: The FCI Diagnosis Layer */}
        <div>
          <h4 className="text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            Pane 2: The FCI Diagnosis Layer (7-Point Failure Detector)
          </h4>
          <div className="space-y-2">
            {[
              { key: 'nonResolution', label: 'Non-Resolution', desc: '🔴 Fail if no closing phrase or negative sentiment' },
              { key: 'tat', label: 'TAT', desc: '🔴 Fail if avg response > 2 mins' },
              { key: 'repeatContact', label: 'Repeat Contact', desc: '🟡 Risk if customer says "I called yesterday"' },
              { key: 'incorrectInformation', label: 'Incorrect Information', desc: '🔴 Fail if phrases like "Let me guess" detected' },
              { key: 'escalation', label: 'Escalation', desc: '🟢 Pass if words like "Supervisor" absent' },
              { key: 'sla', label: 'SLA', desc: '🔴 Fail if Total Duration > Target Limit' },
              { key: 'failedFromCustomer', label: 'Failed from Customer', desc: '🔴 Fail if keywords "Frustrated/Angry" found' }
            ].map((item) => {
              const status = data.diagnosis[item.key as keyof typeof data.diagnosis];
              return (
                <div
                  key={item.key}
                  className="border rounded-lg p-3"
                  style={{
                    borderColor: getStatusColor(status),
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#F9FAFB'
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {item.label}
                    </span>
                    {getStatusIcon(status)}
                  </div>
                  <p className="text-xs" style={{ color: '#939394' }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pane 3: The Coaching & Action Layer */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
          Pane 3: The Coaching & Action Layer (Next Best Action Recommender)
        </h4>
        <div
          className="border rounded-lg p-4"
          style={{
            borderColor: '#5332FF',
            backgroundColor: isDarkMode ? '#5332FF20' : '#5332FF10'
          }}
        >
          <h5 className="text-sm font-bold mb-2" style={{ color: '#5332FF' }}>
            {data.nextBestAction.headline}
          </h5>
          <p className="text-xs mb-3" style={{ color: isDarkMode ? '#D6D9D8' : '#010101' }}>
            <strong>Context:</strong> {data.nextBestAction.context}
          </p>
          <div
            className="mb-3 p-3 rounded-lg"
            style={{
              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#939394' : '#D6D9D8'}`
            }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#5332FF' }}>
              Quick Fix Script:
            </p>
            <p className="text-xs" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              {data.nextBestAction.quickFixScript}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: '#5332FF' }} />
            <button
              className="px-4 py-2 rounded text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#5332FF' }}
            >
              Assign '{data.nextBestAction.trainingLink}'
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

