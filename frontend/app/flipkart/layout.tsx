'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { FlipkartChatbotProvider, useFlipkartChatbot } from '@/context/FlipkartChatbotContext';
import { CXSimulatorChatbot } from '@/components/flipkart/CXSimulatorChatbot';

function FlipkartChannelChatbotPanel() {
  const { isOpen, closeChatbot } = useFlipkartChatbot();
  return <CXSimulatorChatbot isOpen={isOpen} onClose={closeChatbot} />;
}

/** "Generate your day in 2 minutes" button for the paingradation/comp header. Used inside FlipkartChatbotProvider. */
function GenerateDayHeaderButton() {
  const { openChatbot } = useFlipkartChatbot();
  return (
    <button
      type="button"
      onClick={openChatbot}
      className="flex items-center justify-center gap-2 h-[38px] px-5 rounded-lg bg-linear-to-r from-[#b90abd] to-[#5332ff] hover:from-[#a009b3] hover:to-[#4a2ae6] text-white font-medium text-sm shadow-md transition-all duration-200 group"
      aria-label="Generate your day in 2 minutes"
    >
      <span className="text-lg group-hover:rotate-12 transition-transform duration-300" aria-hidden>✨</span>
      <span>Generate your day in 2 minutes</span>
    </button>
  );
}

type TimeFilter = '24h' | '7d' | '30d';

export default function FlipkartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // All Flipkart channel routes (main-page, email, chat, ticket, social, voice) use Sidebar like Standard Chartered
  const isFlipkartChannelRoute =
    pathname?.startsWith("/flipkart/") &&
    pathname !== "/flipkart" &&
    !pathname.startsWith("/flipkart/comp") &&
    !pathname.startsWith("/flipkart/paingradation");

  if (isFlipkartChannelRoute) {
    return (
      <FlipkartChatbotProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 relative">
            {children}
          </main>
        </div>
        <FlipkartChannelChatbotPanel />
      </FlipkartChatbotProvider>
    );
  }
  // Default to dark; optionally respect saved preference on client
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  
  const isPaingradationActive = pathname === '/flipkart/paingradation' || pathname.startsWith('/flipkart/paingradation/');
  const isCompActive = pathname.startsWith('/flipkart/comp');

  const timeFilterOptions: { value: TimeFilter; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  // Apply dark by default on mount; optionally sync from localStorage for returning users
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const preferDark = savedTheme === null ? true : savedTheme === 'dark';
    setIsDarkMode(preferDark);
    document.documentElement.classList.toggle('dark', preferDark);

    const savedTimeFilter = localStorage.getItem('flipkartTimeFilter') as TimeFilter;
    if (savedTimeFilter) setTimeFilter(savedTimeFilter);
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
    <FlipkartChatbotProvider>
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#010101' : '#F5F5F5' }} suppressHydrationWarning>
      {/* Header with company name using Yaara brand colors */}
      <header className="shadow-lg" style={{ backgroundColor: '#010101' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative w-14 h-14 shrink-0">
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
              {/* Generate your day - top of page for paingradation & comp */}
              <GenerateDayHeaderButton />

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

      {/* Tabs + Time filter in one row */}
      <div 
        className="border-b" 
        style={{ 
          borderColor: isDarkMode ? '#939394' : '#D6D9D8',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#FAFAFA'
        }}
        suppressHydrationWarning
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Risk & Trust | Operational Perfectness */}
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
            {/* Right: Last 24 Hours | Last 7 Days | Last 30 Days (parallel to tabs) */}
            {(isPaingradationActive || isCompActive) && (
              <div 
                className="flex items-center rounded-xl p-1"
                style={{ backgroundColor: isDarkMode ? '#0f0f0f' : '#eee', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#ddd'}` }}
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
                        : (isDarkMode ? '#D6D9D8' : '#525252')
                    }}
                  >
                    <Calendar className="w-4 h-4" />
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="w-full relative" data-theme={isDarkMode ? 'dark' : 'light'} suppressHydrationWarning>
        {children}
      </main>
      <FlipkartChannelChatbotPanel />
    </div>
    </FlipkartChatbotProvider>
  );
}

