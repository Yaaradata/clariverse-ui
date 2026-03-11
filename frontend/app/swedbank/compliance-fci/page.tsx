'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddonPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to compliance page by default
  useEffect(() => {
    if (pathname === '/swedbank/compliance-fci') {
      router.replace('/swedbank/compliance-fci/compliance');
    }
  }, [pathname, router]);

  const isComplianceActive = pathname === '/swedbank/compliance-fci/compliance';
  const isUnitPerformanceActive = pathname === '/swedbank/compliance-fci/unit-performance';
  const isVendorActive = pathname === '/swedbank/compliance-fci/compliance-signals';

  return (
    <div className="min-h-screen bg-white">
      {/* Header with company name using Yaara brand colors */}
      <header className="shadow-lg" style={{ backgroundColor: '#010101' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/swedbank.png" 
              alt="Swedbank Logo" 
              width={70} 
              height={30}
              priority
              unoptimized
            />
            <h1 className="text-xl font-bold text-white">Swedbank</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: '#D6D9D8' }}>
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <Link
              href="/swedbank/compliance-fci/compliance"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isComplianceActive ? '#5332FF' : '#939394',
                borderBottom: isComplianceActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Compliance and Risk
            </Link>
            <Link
              href="/swedbank/compliance-fci/unit-performance"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isUnitPerformanceActive ? '#5332FF' : '#939394',
                borderBottom: isUnitPerformanceActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Unit Performance
            </Link>
            <Link
              href="/swedbank/compliance-fci/compliance-signals"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isVendorActive ? '#5332FF' : '#939394',
                borderBottom: isVendorActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Third Party Compliance Signals
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

