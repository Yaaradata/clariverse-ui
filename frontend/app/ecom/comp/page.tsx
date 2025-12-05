'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

type SubView = 'compliance' | 'fraudulent';

export default function CompPage() {
  const [activeSubView, setActiveSubView] = useState<SubView>('compliance');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    };
    
    checkTheme();
    window.addEventListener('storage', checkTheme);
    
    // Also check the document class
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('storage', checkTheme);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Sub-view tabs - matching exact style with light/dark mode support */}
      <div 
        className="flex items-center gap-1 p-1 rounded-xl w-full"
        style={{ 
          backgroundColor: isDarkMode ? 'rgb(26, 26, 26)' : 'rgb(240, 240, 240)', 
          border: isDarkMode ? '1px solid rgb(42, 42, 42)' : '1px solid rgb(214, 217, 216)' 
        }}
      >
        <button
          onClick={() => setActiveSubView('compliance')}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: activeSubView === 'compliance' ? 'rgb(83, 50, 255)' : 'transparent',
            color: activeSubView === 'compliance' 
              ? 'rgb(255, 255, 255)' 
              : isDarkMode ? 'rgb(214, 217, 216)' : 'rgb(107, 114, 128)'
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
            color: activeSubView === 'fraudulent' 
              ? 'rgb(255, 255, 255)' 
              : isDarkMode ? 'rgb(214, 217, 216)' : 'rgb(107, 114, 128)'
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
          <p style={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }}>
            Compliance and Risk dashboard content will be displayed here.
          </p>
        </div>
      )}

      {activeSubView === 'fraudulent' && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#5332FF' }}>
            Fraudulent
          </h2>
          <p style={{ color: isDarkMode ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)' }}>
            Fraudulent dashboard content will be displayed here.
          </p>
        </div>
      )}
    </div>
  );
}
