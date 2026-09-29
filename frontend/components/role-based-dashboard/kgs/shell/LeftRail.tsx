"use client";

import {
  Activity,
  ArrowLeft,
  Cpu,
  Handshake,
  Lock,
  SlidersHorizontal,
  Split,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type LeftRailProps = {
  onExit?: () => void;
  onOpenDemoMenu: () => void;
};

export function LeftRail({ onExit, onOpenDemoMenu }: LeftRailProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hover, setHover] = useState(false);

  const navItems = [
    { id: "overview", label: "Activity", icon: Activity, path: "/" },
    { id: "installed-base", label: "Installed base", icon: Cpu, path: "/installed-base" },
    { id: "channel", label: "Channel", icon: Handshake, path: "/channel" },
    { id: "separation", label: "Separation", icon: Split, path: "/separation" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/" || pathname.startsWith("/signals");
    return pathname.startsWith(path);
  };

  return (
    <aside
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: hover ? 220 : 68,
        minWidth: hover ? 220 : 68,
        transition: "width 0.22s ease, min-width 0.22s ease",
        borderRight: "1px solid #1f1f1f",
        background: "#151515",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 5,
      }}
    >
      {/* LiSN monogram */}
      <div
        style={{
          padding: hover ? "18px 16px" : "14px 10px",
          borderBottom: "1px solid #1f1f1f",
          textAlign: hover ? "left" : "center",
        }}
      >
        {hover ? (
          <>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#a78bfa", letterSpacing: 2.5, textTransform: "uppercase" }}>
              LiSN
            </div>
            <div style={{ fontSize: 13, color: "#939394", marginTop: 2 }}>Fluid Intelligence</div>
          </>
        ) : (
          <div
            style={{
              width: 36,
              height: 36,
              margin: "0 auto",
              borderRadius: 10,
              background: "#5332ff20",
              border: "1px solid #5332ff40",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
              color: "#a78bfa",
              fontFamily: "var(--font, Outfit), system-ui, sans-serif",
            }}
            title="LiSN"
          >
            Li
          </div>
        )}
      </div>

      {/* Nav items */}
      <div style={{ padding: hover ? "10px 8px" : "8px 6px", flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => router.push(item.path)}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                background: active ? "#5332ff20" : "transparent",
                color: active ? "#ffffff" : "#939394",
                borderRadius: 8,
                padding: hover ? "8px 10px" : "10px 8px",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: hover ? 8 : 0,
                cursor: "pointer",
                borderLeft: active ? "3px solid #a78bfa" : "3px solid transparent",
                justifyContent: hover ? "flex-start" : "center",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: active ? "#5332ff20" : "#93939420",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={11} color={active ? "#a78bfa" : "#939394"} />
              </div>
              {hover ? <span style={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>{item.label}</span> : null}
            </button>
          );
        })}

        {/* Divider */}
        <div style={{ height: 1, background: "#1f1f1f", margin: "8px 0" }} />

        {/* Governed watch anchor */}
        <button
          type="button"
          onClick={() => {
            if (pathname !== "/") {
              router.push("/#governed-watch");
            } else {
              document.getElementById("governed-watch")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          style={{
            width: "100%",
            textAlign: "left",
            border: "none",
            background: "transparent",
            color: "#939394",
            borderRadius: 8,
            padding: hover ? "8px 10px" : "10px 8px",
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            gap: hover ? 8 : 0,
            cursor: "pointer",
            justifyContent: hover ? "flex-start" : "center",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#93939420",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Lock size={11} color="#939394" />
          </div>
          {hover ? <span style={{ fontSize: 13, fontWeight: 500 }}>Governed watch</span> : null}
        </button>
      </div>

      {/* Bottom controls */}
      <div style={{ padding: hover ? "10px 12px" : "10px 8px", borderTop: "1px solid #1f1f1f" }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            width: "100%",
            border: "1px solid #1f1f1f",
            borderRadius: 8,
            background: "#151515",
            color: "#939394",
            padding: hover ? "8px 14px" : "10px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: hover ? 6 : 0,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          <ArrowLeft size={12} />
          {hover ? "Back" : null}
        </button>

        <button
          type="button"
          onClick={onOpenDemoMenu}
          style={{
            width: "100%",
            border: "1px solid #1f1f1f",
            borderRadius: 8,
            background: "#151515",
            color: "#939394",
            padding: hover ? "8px 14px" : "10px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: hover ? 6 : 0,
            cursor: "pointer",
          }}
        >
          <SlidersHorizontal size={12} />
          {hover ? "Demo" : null}
        </button>
      </div>
    </aside>
  );
}
