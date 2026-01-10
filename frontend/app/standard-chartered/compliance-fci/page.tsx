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
    if (pathname === '/standard-chartered/compliance-fci') {
      router.replace('/standard-chartered/compliance-fci/compliance');
    }
  }, [pathname, router]);

  const isComplianceActive = pathname === '/standard-chartered/compliance-fci/compliance';
  const isFCIActive = pathname === '/standard-chartered/compliance-fci/fci';
  const isVendorActive = pathname === '/standard-chartered/compliance-fci/compliance-signals';

  return (
    <div className="min-h-screen bg-white">
      {/* Header with company name using Yaara brand colors */}
      <header className="shadow-lg" style={{ backgroundColor: '#010101' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/stanchart.png" 
              alt="Standard Chartered Logo" 
              width={70} 
              height={30}
              priority
              unoptimized
            />
            <h1 className="text-xl font-bold text-white">Standard Chartered</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: '#D6D9D8' }}>
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <Link
              href="/standard-chartered/compliance-fci/compliance"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isComplianceActive ? '#5332FF' : '#939394',
                borderBottom: isComplianceActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Compliance and Risk
            </Link>
            <Link
              href="/standard-chartered/compliance-fci/fci"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isFCIActive ? '#5332FF' : '#939394',
                borderBottom: isFCIActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Failed Customer Interaction
            </Link>
            <Link
              href="/standard-chartered/compliance-fci/compliance-signals"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isVendorActive ? '#5332FF' : '#939394',
                borderBottom: isVendorActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Compliance Signals
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

