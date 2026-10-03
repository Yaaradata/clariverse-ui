"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  const isAddonRoute =
    pathname?.startsWith("/compliance-fci") ||
    pathname?.startsWith("/standard-chartered/compliance-fci") ||
    pathname?.startsWith("/hdfc/compliance-fci");
  const isSwedbankRoute = pathname?.startsWith("/swedbank");
  const isFlipkartRoute = pathname?.startsWith("/flipkart");
  const isStandardCharteredRoute = pathname?.startsWith("/standard-chartered");
  const isHdfcRoute = pathname?.startsWith("/hdfc");
  const isRootPage = pathname === "/";
  const isRoleBasedRoute =
    pathname === "/role-based" || pathname?.startsWith("/role-based/");
  /** Legacy / mistaken URL uses underscore; same full-width treatment as hyphenated route. */
  const isRoleBasedUnderscoreRoute =
    pathname === "/role_based" || pathname?.startsWith("/role_based/");
  const isStandalonePage =
    isAddonRoute ||
    isSwedbankRoute ||
    isFlipkartRoute ||
    isStandardCharteredRoute ||
    isHdfcRoute ||
    isRootPage ||
    isRoleBasedRoute ||
    isRoleBasedUnderscoreRoute;

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
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
