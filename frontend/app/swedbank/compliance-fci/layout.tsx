'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

type TimeFilter = '24h' | '7d' | '30d';

export default function AddonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Initialize theme from localStorage if available, default to dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === null ? true : savedTheme === 'dark';
    }
    return true;
  });
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  
  const isComplianceActive = pathname === '/swedbank/compliance-fci/compliance' || pathname === '/swedbank/compliance-fci';
  const isUnitPerformanceActive = pathname === '/swedbank/compliance-fci/unit-performance';
  const isVendorActive = pathname === '/swedbank/compliance-fci/compliance-signals';

  const timeFilterOptions: { value: TimeFilter; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  // Load theme preference from localStorage and apply immediately
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode if no theme is saved, otherwise use saved preference
    const initialDarkMode = savedTheme === null ? true : savedTheme === 'dark';
    setIsDarkMode(initialDarkMode);
    
    // Apply theme immediately to prevent flash
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Load time filter preference
    const savedTimeFilter = localStorage.getItem('complianceTimeFilter') as TimeFilter;
    if (savedTimeFilter) {
      setTimeFilter(savedTimeFilter);
    }
  }, []);

  // Save theme preference and apply to document
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save time filter preference
  useEffect(() => {
    localStorage.setItem('complianceTimeFilter', timeFilter);
    // Dispatch storage event so compliance page can react
    window.dispatchEvent(new Event('storage'));
  }, [timeFilter]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#010101' : '#F5F5F5' }}>
      {/* Header with company name using Yaara brand colors */}
      <header className="shadow-lg" style={{ backgroundColor: '#010101' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image 
                src="/swedbank.png" 
                alt="Swedbank Logo" 
                width={50} 
                height={20}
                priority
                unoptimized
              />
              <h1 className="text-3xl font-bold text-white">Swedbank</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Filter - Show on all compliance-fci tabs */}
              {(isComplianceActive || isUnitPerformanceActive || isVendorActive) && (
                <div 
                  className="flex items-center rounded-xl p-1"
                  style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                >
                  {timeFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTimeFilterChange(option.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        timeFilter === option.value ? 'shadow-sm' : ''
                      }`}
                      style={{
                        backgroundColor: timeFilter === option.value 
                          ? '#5332FF' 
                          : 'transparent',
                        color: timeFilter === option.value 
                          ? '#FFFFFF' 
                          : '#D6D9D8'
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Theme Toggle Switch */}
              <button
                onClick={toggleTheme}
                className="relative inline-flex items-center cursor-pointer"
                aria-label="Toggle theme"
              >
                <div 
                  className="w-16 h-8 rounded-full transition-colors duration-300 ease-in-out"
                  style={{ 
                    backgroundColor: isDarkMode ? '#5332FF' : '#D6D9D8'
                  }}
                >
                  <div 
                    className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300 ease-in-out flex items-center justify-center"
                    style={{ 
                      backgroundColor: '#FFFFFF',
                      transform: isDarkMode ? 'translateX(32px)' : 'translateX(0)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <span className="text-sm">
                      {isDarkMode ? '🌙' : '☀️'}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div 
        className="border-b" 
        style={{ 
          borderColor: isDarkMode ? '#939394' : '#D6D9D8',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA'
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <Link
              href="/swedbank/compliance-fci/compliance"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isComplianceActive ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#939394'),
                borderBottom: isComplianceActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Compliance and Risk
            </Link>
            <Link
              href="/swedbank/compliance-fci/unit-performance"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isUnitPerformanceActive ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#939394'),
                borderBottom: isUnitPerformanceActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Unit Performance
            </Link>
            <Link
              href="/swedbank/compliance-fci/compliance-signals"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isVendorActive ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#939394'),
                borderBottom: isVendorActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Third Party Compliance Signals
            </Link>
          </div>
        </div>
      </div>

      <main className="w-full" data-theme={isDarkMode ? 'dark' : 'light'}>
        {children}
      </main>
    </div>
  );
}

