"use client";

import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { SignalMonitorCard } from "./SignalMonitorCard";
import { SuppressedEndCard } from "./SuppressedEndCard";

type MonitorCard = {
  rank: string;
  title: string;
  severity: any;
  domain: any;
  sources: string;
  cohort: string;
  window: string;
  owner: string;
  metrics: Array<{ label: string; value: string; change?: string }>;
  severityCompact: string;
  confidenceShort: string;
  pnlShort: string;
  joinTags: string[];
  gateChip: any;
  suggestion: string;
  linkTo: string;
  microStrip?: any;
};

type FieldSignalMonitorProps = {
  title: string;
  chip: string;
  subtitle: string;
  suppressedNote: string;
  cards: MonitorCard[];
  suppressedCard: {
    title: string;
    rows: Array<{ label: string; count: number }>;
    footer: string;
  };
};

export function FieldSignalMonitor({
  title,
  chip,
  subtitle,
  suppressedNote,
  cards,
  suppressedCard,
}: FieldSignalMonitorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 256; // 240px + gap
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div id="field-signal-monitor" style={{ scrollMarginTop: 80 }}>
      <SectionHeader
        icon={Activity}
        iconColor="#f59e0b"
        title={title}
        chip={chip}
        chipColor="#fbbf24"
        subtitle={subtitle}
        suppressedNote={suppressedNote}
      />

      <div style={{ position: "relative" }}>
        {/* Left Arrow */}
        {showLeftArrow ? (
          <button
            type="button"
            onClick={() => scroll("left")}
            style={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#0d0d0d",
              border: "1px solid #1f1f1f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <ChevronLeft size={18} color="#ffffff" />
          </button>
        ) : null}

        {/* Right Arrow */}
        {showRightArrow ? (
          <button
            type="button"
            onClick={() => scroll("right")}
            style={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#0d0d0d",
              border: "1px solid #1f1f1f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <ChevronRight size={18} color="#ffffff" />
          </button>
        ) : null}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 16,
            position: "relative",
          }}
        >
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>

          {cards.map((card, idx) => (
            <div key={idx} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
              <SignalMonitorCard {...card} />
            </div>
          ))}

          <div style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
            <SuppressedEndCard {...suppressedCard} />
          </div>
        </div>

        {/* Right fade mask */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 16,
            width: 80,
            background: "linear-gradient(to left, #010101 0%, transparent 100%)",
            pointerEvents: "none",
            opacity: showRightArrow ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        />
      </div>
    </div>
  );
}
