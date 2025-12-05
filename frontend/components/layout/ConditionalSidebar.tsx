"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function ConditionalSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAddonRoute = pathname?.startsWith("/addon");
  const isEcomRoute = pathname?.startsWith("/ecom");
  const isStandalonePage = isAddonRoute || isEcomRoute;

  // Render children only during SSR to avoid hydration mismatch
  // The correct layout will be applied after mounting
  if (!mounted) {
    return <>{children}</>;
  }

  if (isStandalonePage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}

