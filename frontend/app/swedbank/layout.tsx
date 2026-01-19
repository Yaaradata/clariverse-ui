"use client";

import Sidebar from '@/components/layout/Sidebar';
import { usePathname } from 'next/navigation';

export default function SwedbankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't show sidebar for compliance-fci routes (they have their own layout)
  const isComplianceFCIRoute = pathname?.startsWith("/swedbank/compliance-fci");
  
  if (isComplianceFCIRoute) {
    return <>{children}</>;
  }
   
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
}
