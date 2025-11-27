'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AddonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const isComplianceActive = pathname === '/addon/compliance';
  const isFCIActive = pathname === '/addon/fci';

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDarkMode ? '#010101' : '#FFFFFF' }}>
      {/* Header with company name using Yaara brand colors */}
      <header className="shadow-lg" style={{ backgroundColor: '#010101' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image 
                src="/logo.png" 
                alt="Yaaralabs Logo" 
                width={50} 
                height={50}
                className="rounded-full"
              />
              <h1 className="text-3xl font-bold text-white">Yaaralabs</h1>
            </div>
            
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
      </header>

      {/* Tabs */}
      <div 
        className="border-b" 
        style={{ 
          borderColor: isDarkMode ? '#939394' : '#D6D9D8',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF'
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <Link
              href="/addon/compliance"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isComplianceActive ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#939394'),
                borderBottom: isComplianceActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Compliance and Risk
            </Link>
            <Link
              href="/addon/fci"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isFCIActive ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#939394'),
                borderBottom: isFCIActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Failed Customer Interaction
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

