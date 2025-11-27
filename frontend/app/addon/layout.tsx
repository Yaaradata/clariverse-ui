'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AddonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isComplianceActive = pathname === '/addon/compliance';
  const isFCIActive = pathname === '/addon/fci';

  return (
    <div className="min-h-screen bg-white">
      {/* Header with company name using Yaara brand colors */}
      <header className="shadow-lg" style={{ backgroundColor: '#010101' }}>
        <div className="container mx-auto px-6 py-4">
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
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: '#D6D9D8' }}>
        <div className="container mx-auto px-6">
          <div className="flex gap-8">
            <Link
              href="/addon/compliance"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isComplianceActive ? '#5332FF' : '#939394',
                borderBottom: isComplianceActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Compliance and Risk
            </Link>
            <Link
              href="/addon/fci"
              className="py-4 px-2 font-semibold transition-all relative"
              style={{
                color: isFCIActive ? '#5332FF' : '#939394',
                borderBottom: isFCIActive ? '3px solid #5332FF' : 'none',
              }}
            >
              Failed Customer Interaction
            </Link>
          </div>
        </div>
      </div>

      <main className="w-full">
        {children}
      </main>
    </div>
  );
}

