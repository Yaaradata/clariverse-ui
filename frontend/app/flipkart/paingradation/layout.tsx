'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, XCircle } from 'lucide-react';

export default function PaingradationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const isExecutiveSummaryActive = pathname === '/flipkart/paingradation';
  const isImperfectnessActive = pathname === '/flipkart/paingradation/imperfectness';

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
          onClick={() => router.push('/flipkart/paingradation')}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: isExecutiveSummaryActive ? 'rgb(83, 50, 255)' : 'transparent',
            color: isExecutiveSummaryActive 
              ? 'rgb(255, 255, 255)' 
              : isDarkMode ? 'rgb(214, 217, 216)' : 'rgb(107, 114, 128)'
          }}
        >
          <FileText className="w-4 h-4" />
          Executive Summary
        </button>
        <button
          onClick={() => router.push('/flipkart/paingradation/imperfectness')}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: isImperfectnessActive ? 'rgb(83, 50, 255)' : 'transparent',
            color: isImperfectnessActive 
              ? 'rgb(255, 255, 255)' 
              : isDarkMode ? 'rgb(214, 217, 216)' : 'rgb(107, 114, 128)'
          }}
        >
          <XCircle className="w-4 h-4" />
          Imperfectness
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
