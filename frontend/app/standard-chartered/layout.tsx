"use client";

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default function StandardCharteredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isComplianceFCIRoute = pathname?.startsWith("/standard-chartered/compliance-fci");
  
  // Compliance FCI routes have their own layout, so don't wrap with sidebar
  if (isComplianceFCIRoute) {
    return <>{children}</>;
  }
  
  // All other standard-chartered routes use the sidebar
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
}
