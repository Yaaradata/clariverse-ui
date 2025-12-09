'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EcomPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to comp (Compliance and Risk) page by default
  useEffect(() => {
    if (pathname === '/ecom') {
      router.push('/ecom/comp');
    }
  }, [pathname, router]);

  const isPaingradationActive = pathname === '/ecom/paingradation';
  const isCompActive = pathname === '/ecom/comp';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#010101' }}>
      {/* Header with company name using Yaara brand colors */}
      <header className="shadow-lg" style={{ backgroundColor: '#010101' }}>
        <div className="container mx-auto px-6 py-4">
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
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: '#D6D9D8' }}>
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <Link
              href="/ecom/comp"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isCompActive ? '#5332FF' : '#939394',
                borderBottom: isCompActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Trust & Safety
            </Link>
            <Link
              href="/ecom/paingradation"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isPaingradationActive ? '#5332FF' : '#939394',
                borderBottom: isPaingradationActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Operational Pain Intelligence
            </Link>
          </div>
        </div>
      </div>

      {/* Content message */}
      <div className="container mx-auto p-6">
        <p style={{ color: '#939394' }}>
          Please select a tab above to view the dashboard.
        </p>
      </div>
    </div>
  );
}

