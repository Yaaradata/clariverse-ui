'use client';

import { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

type SubView = 'compliance' | 'fraudulent';

export default function CompPage() {
  const [activeSubView, setActiveSubView] = useState<SubView>('compliance');

  return (
    <div className="container mx-auto p-6">
      {/* Sub-view tabs - matching exact style */}
      <div 
        className="flex items-center gap-1 p-1 rounded-xl w-full"
        style={{ backgroundColor: 'rgb(26, 26, 26)', border: '1px solid rgb(42, 42, 42)' }}
      >
        <button
          onClick={() => setActiveSubView('compliance')}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: activeSubView === 'compliance' ? 'rgb(83, 50, 255)' : 'transparent',
            color: activeSubView === 'compliance' ? 'rgb(255, 255, 255)' : 'rgb(214, 217, 216)'
          }}
        >
          <ShieldCheck className="w-4 h-4" />
          Compliance and Risk
        </button>
        <button
          onClick={() => setActiveSubView('fraudulent')}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: activeSubView === 'fraudulent' ? 'rgb(83, 50, 255)' : 'transparent',
            color: activeSubView === 'fraudulent' ? 'rgb(255, 255, 255)' : 'rgb(214, 217, 216)'
          }}
        >
          <AlertTriangle className="w-4 h-4" />
          Fraudulent
        </button>
      </div>

      {/* Sub-view content */}
      {activeSubView === 'compliance' && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#5332FF' }}>
            Compliance and Risk
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Compliance and Risk dashboard content will be displayed here.
          </p>
        </div>
      )}

      {activeSubView === 'fraudulent' && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#5332FF' }}>
            Fraudulent
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fraudulent dashboard content will be displayed here.
          </p>
        </div>
      )}
    </div>
  );
}
