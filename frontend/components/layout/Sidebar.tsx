"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3, Mail, MessageCircle, Ticket, Share2, Mic, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if we're on a swedbank, standard-chartered, HDFC, or Flipkart unified route
  const isSwedbankRoute = pathname?.startsWith("/swedbank") ?? false;
  const isStandardCharteredRoute = pathname?.startsWith("/standard-chartered") ?? false;
  const isHdfcRoute = pathname?.startsWith("/hdfc") ?? false;
  const isFlipkartRoute =
    pathname?.startsWith("/flipkart/") &&
    pathname !== "/flipkart" &&
    !pathname.startsWith("/flipkart/comp") &&
    !pathname.startsWith("/flipkart/paingradation");
  const basePath = isSwedbankRoute
    ? "/swedbank"
    : isStandardCharteredRoute
      ? "/standard-chartered"
      : isHdfcRoute
        ? "/hdfc"
        : isFlipkartRoute
          ? "/flipkart"
          : "";

  // Set branding based on route
  const logoPath = isSwedbankRoute
    ? "/swedbank.png"
    : isHdfcRoute
      ? "/hdfc.png"
      : isFlipkartRoute
        ? "/flipkartlogo.png"
        : "/stanchart.png";
  const logoAlt = isSwedbankRoute
    ? "Swedbank Logo"
    : isHdfcRoute
      ? "HDFC Logo"
      : isFlipkartRoute
        ? "Flipkart Logo"
        : "Standard Chartered Logo";
  const brandName = isSwedbankRoute
    ? "Swedbank"
    : isHdfcRoute
      ? "HDFC"
      : isFlipkartRoute
        ? "Flipkart"
        : "Standard Chartered";

  // For Flipkart, nav hrefs use basePath directly; for others subHref === basePath (kept for any legacy refs)
  const subHref = basePath;

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      href: basePath ? (basePath === "/flipkart" ? "/flipkart/main-page" : `${basePath}/`) : "",
      hasSubItems: false,
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      href: basePath ? (basePath === "/flipkart" ? "/flipkart/email" : `${basePath}/email`) : "",
      hasSubItems: false,
    },
    {
      id: "chat",
      label: "Chat",
      icon: MessageCircle,
      href: basePath ? (basePath === "/flipkart" ? "/flipkart/chat" : `${basePath}/chat`) : "",
      hasSubItems: false,
    },
    {
      id: "ticket",
      label: "Ticket",
      icon: Ticket,
      href: basePath ? (basePath === "/flipkart" ? "/flipkart/ticket" : `${basePath}/ticket`) : "",
      hasSubItems: false,
    },
    {
      id: "social",
      label: "Social Media",
      icon: Share2,
      href: basePath ? (basePath === "/flipkart" ? "/flipkart/social" : `${basePath}/social`) : "",
      hasSubItems: false,
    },
    {
      id: "voice",
      label: "Voice Transcript",
      icon: Mic,
      href: basePath ? (basePath === "/flipkart" ? "/flipkart/voice" : `${basePath}/voice`) : "",
      hasSubItems: false,
    },
    // {
    //   id: "topic-analysis",
    //   label: "Topic Analysis",
    //   icon: TrendingUp,
    //   href: "/topic-analysis",
    //   hasSubItems: false,
    // },
  ];

  // Flipkart: hide Chat and Ticket in the sidebar
  const sidebarItems =
    basePath === "/flipkart"
      ? navigationItems.filter((item) => item.id !== "chat" && item.id !== "ticket")
      : navigationItems;

  return (
    <div 
      className={`h-screen sticky top-0 border-r border-border transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-72' : 'w-16'
      } flex flex-col overflow-y-auto`}
      style={{ backgroundColor: 'var(--sidebar)' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Section */}
      <div className={`mb-8 animate-fade-in ${isExpanded ? 'p-6 pb-4' : 'p-3 pb-4'}`}>
        <div className="flex items-center space-x-3 mb-3">
          <div className={`${isSwedbankRoute || isHdfcRoute || isFlipkartRoute ? 'w-14 h-14' : 'w-10 h-10'} rounded-lg flex items-center justify-center overflow-hidden`} suppressHydrationWarning>
            <Image 
              src={logoPath}
              alt={logoAlt}
              width={isSwedbankRoute || isHdfcRoute || isFlipkartRoute ? 56 : 40} 
              height={isSwedbankRoute || isHdfcRoute || isFlipkartRoute ? 56 : 40}
              className="object-contain"
              priority
              unoptimized
              suppressHydrationWarning
            />
          </div>
          {isExpanded && (
            <div className="animate-fade-in" suppressHydrationWarning>
              <h1 className="text-2xl font-bold text-white">{brandName}</h1>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sidebar-nav space-y-2 ${isExpanded ? 'px-6' : 'px-3'}`}>
        {sidebarItems.map((item, index) => {
          // Normalize paths for comparison (handle trailing slashes)
          const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';
          const current = normalizePath(pathname || '');
          const itemPath = normalizePath(item.href);
          // Dashboard: active only on exact base path. Others: active on exact match or any sub-route (e.g. /email/ops)
          const isActive = item.id === 'dashboard'
            ? current === itemPath || current === basePath
            : current === itemPath || (current.startsWith(itemPath + '/'));
          
          return (
            <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <Link href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full h-9 border transition-all duration-200 ${
                    isExpanded 
                      ? 'justify-start gap-2 px-2' 
                      : 'justify-center p-0'
                  } ${
                    isActive
                      ? 'btn-gradient-primary border-white/20 hover:border-white/30'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground border-transparent hover:border-white/20'
                  }`}
                  title={!isExpanded ? item.label : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {isExpanded && (
                    <span className="animate-fade-in truncate min-w-0">{item.label}</span>
                  )}
                </Button>
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
