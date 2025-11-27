'use client';

import { AIAction } from '@/lib/fci-lib/fciData';
import { Settings, Users, Bell, TrendingDown, Clock, Target } from 'lucide-react';

interface AIActionCenterProps {
  actions: AIAction[];
  isDarkMode?: boolean;
}

export function AIActionCenter({ actions, isDarkMode = false }: AIActionCenterProps) {
  const getActionIcon = (type: string) => {
    if (type === 'Process Fix') return Settings;
    if (type === 'Agent Skills Enhancement') return Users;
    return Bell;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'High') return '#B90ABD';
    if (priority === 'Medium') return '#5332FF';
    return '#939394';
  };

  const groupedActions = {
    'Process Fixes': actions.filter(a => a.type === 'Process Fix'),
    'Agent Skills Enhancements': actions.filter(a => a.type === 'Agent Skills Enhancement'),
    'Proactive Alerts': actions.filter(a => a.type === 'Proactive Alert')
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-sm"
      style={{
        borderColor: isDarkMode ? '#939394' : '#D6D9D8',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
      }}
    >
      <h3
        className="text-lg font-bold mb-4"
        style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
      >
        🟦 What To Do Next (AI Action Center)
      </h3>

      <div className="space-y-6">
        {/* Process Fixes */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5" style={{ color: '#5332FF' }} />
            <h4 className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              1️⃣ Process Fixes
            </h4>
          </div>
          <div className="space-y-3">
            {groupedActions['Process Fixes'].map((action) => {
              const Icon = getActionIcon(action.type);
              return (
                <div
                  key={action.id}
                  className="border rounded-lg p-3 hover:shadow-md transition-all"
                  style={{
                    borderColor: isDarkMode ? '#939394' : '#D6D9D8',
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <Icon className="w-4 h-4 mt-1" style={{ color: '#5332FF' }} />
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          {action.title}
                        </h5>
                        <p className="text-xs mb-2" style={{ color: '#939394' }}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: getPriorityColor(action.priority) }}
                    >
                      {action.priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" style={{ color: '#10b981' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          {action.estimatedFCIReduction}%
                        </strong>{' '}
                        FCI reduction
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" style={{ color: '#5332FF' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          +{action.impactOnTrustScore}
                        </strong>{' '}
                        trust score
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" style={{ color: '#939394' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        {action.timeToImplement}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Skills Enhancements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5" style={{ color: '#5332FF' }} />
            <h4 className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              2️⃣ Agent Skills Enhancements
            </h4>
          </div>
          <div className="space-y-3">
            {groupedActions['Agent Skills Enhancements'].map((action) => {
              const Icon = getActionIcon(action.type);
              return (
                <div
                  key={action.id}
                  className="border rounded-lg p-3 hover:shadow-md transition-all"
                  style={{
                    borderColor: isDarkMode ? '#939394' : '#D6D9D8',
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <Icon className="w-4 h-4 mt-1" style={{ color: '#5332FF' }} />
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          {action.title}
                        </h5>
                        <p className="text-xs mb-2" style={{ color: '#939394' }}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: getPriorityColor(action.priority) }}
                    >
                      {action.priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" style={{ color: '#10b981' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          {action.estimatedFCIReduction}%
                        </strong>{' '}
                        FCI reduction
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" style={{ color: '#5332FF' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          +{action.impactOnTrustScore}
                        </strong>{' '}
                        trust score
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" style={{ color: '#939394' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        {action.timeToImplement}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proactive Alerts */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5" style={{ color: '#5332FF' }} />
            <h4 className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              3️⃣ Proactive Alerts
            </h4>
          </div>
          <div className="space-y-3">
            {groupedActions['Proactive Alerts'].map((action) => {
              const Icon = getActionIcon(action.type);
              return (
                <div
                  key={action.id}
                  className="border rounded-lg p-3 hover:shadow-md transition-all"
                  style={{
                    borderColor: isDarkMode ? '#939394' : '#D6D9D8',
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <Icon className="w-4 h-4 mt-1" style={{ color: '#5332FF' }} />
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          {action.title}
                        </h5>
                        <p className="text-xs mb-2" style={{ color: '#939394' }}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-1 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: getPriorityColor(action.priority) }}
                    >
                      {action.priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" style={{ color: '#10b981' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          {action.estimatedFCIReduction}%
                        </strong>{' '}
                        FCI reduction
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" style={{ color: '#5332FF' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        <strong style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                          +{action.impactOnTrustScore}
                        </strong>{' '}
                        trust score
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" style={{ color: '#939394' }} />
                      <span className="text-xs" style={{ color: '#939394' }}>
                        {action.timeToImplement}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="text-xs mt-4 italic" style={{ color: '#939394' }}>
        👉 Executive takeaway: Clear actions that drive immediate business results.
      </p>
    </div>
  );
}

