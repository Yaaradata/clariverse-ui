'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

type TimeFilter = '24h' | '7d' | '30d';

export default function FlipkartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Initialize theme from localStorage if available, default to dark
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === null ? true : savedTheme === 'dark';
    }
    return true;
  });
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  
  const isPaingradationActive = pathname === '/flipkart/paingradation' || pathname.startsWith('/flipkart/paingradation/');
  const isCompActive = pathname.startsWith('/flipkart/comp');

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
    const savedTimeFilter = localStorage.getItem('flipkartTimeFilter') as TimeFilter;
    if (savedTimeFilter) {
      setTimeFilter(savedTimeFilter);
    }
  }, []);

  // Save theme preference and apply to document when theme changes
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
    localStorage.setItem('flipkartTimeFilter', timeFilter);
    // Dispatch storage event so pages can react
    window.dispatchEvent(new Event('storage'));
  }, [timeFilter]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#010101' : '#F5F5F5' }} suppressHydrationWarning>
      {/* Header with company name using Yaara brand colors */}
      <header className="shadow-lg" style={{ backgroundColor: '#010101' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image 
                  src="/flipkartlogo.png" 
                  alt="Flipkart Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-white ml-2">Flipkart</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Filter - Show on Paingradation and Comp pages */}
              {(isPaingradationActive || isCompActive) && (
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
                suppressHydrationWarning
              >
                <div 
                  className="w-16 h-8 rounded-full transition-colors duration-300 ease-in-out"
                  style={{ 
                    backgroundColor: isDarkMode ? '#5332FF' : '#D6D9D8'
                  }}
                  suppressHydrationWarning
                >
                  <div 
                    className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300 ease-in-out flex items-center justify-center"
                    style={{ 
                      backgroundColor: '#FFFFFF',
                      transform: isDarkMode ? 'translateX(32px)' : 'translateX(0)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    suppressHydrationWarning
                  >
                    <span className="text-sm" suppressHydrationWarning>
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
        suppressHydrationWarning
      >
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <Link
              href="/flipkart/comp"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isCompActive ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#939394'),
                borderBottom: isCompActive ? '3px solid #5332FF' : 'none',
              }}
              suppressHydrationWarning
            >
              Risk & Trust
            </Link>
            <Link
              href="/flipkart/paingradation"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isPaingradationActive ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#939394'),
                borderBottom: isPaingradationActive ? '3px solid #5332FF' : 'none',
              }}
              suppressHydrationWarning
            >
              Operational Perfectness
            </Link>
          </div>
        </div>
      </div>

      <main className="w-full" data-theme={isDarkMode ? 'dark' : 'light'} suppressHydrationWarning>
        {children}
      </main>
    </div>
  );
}

