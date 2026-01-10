'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function CompLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const isComplianceActive = pathname === '/flipkart/comp';
  const isFraudulentActive = pathname === '/flipkart/comp/fraudulent';

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
        <Link
          href="/flipkart/comp"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: isComplianceActive ? 'rgb(83, 50, 255)' : 'transparent',
            color: isComplianceActive 
              ? 'rgb(255, 255, 255)' 
              : isDarkMode ? 'rgb(214, 217, 216)' : 'rgb(107, 114, 128)'
          }}
        >
          <ShieldCheck className="w-4 h-4" />
          Compliance and Risk
        </Link>
        <Link
          href="/flipkart/comp/fraudulent"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            backgroundColor: isFraudulentActive ? 'rgb(83, 50, 255)' : 'transparent',
            color: isFraudulentActive 
              ? 'rgb(255, 255, 255)' 
              : isDarkMode ? 'rgb(214, 217, 216)' : 'rgb(107, 114, 128)'
          }}
        >
          <AlertTriangle className="w-4 h-4" />
          Fraudulent
        </Link>
      </div>

      {/* Content */}
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
