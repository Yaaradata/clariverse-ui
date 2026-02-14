'use client';

import { useFlipkartChatbot } from '@/context/FlipkartChatbotContext';

/**
 * Floating Action Button: "Generate your day in 2 minutes".
 * Must be rendered inside FlipkartChatbotProvider. Opens the AI Day Generator (CX Simulator) panel.
 * Shown across all Flipkart pages for consistent access.
 */
export function GenerateDayFAB() {
  const { openChatbot } = useFlipkartChatbot();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={openChatbot}
        className="flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-linear-to-r from-[#b90abd] to-[#5332ff] hover:from-[#a009b3] hover:to-[#4a2ae6] text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 group"
        aria-label="Generate your day in 2 minutes"
      >
        <span className="text-lg group-hover:rotate-12 transition-transform duration-300" aria-hidden>
          ✨
        </span>
        <span>Generate your day in 2 minutes</span>
      </button>
    </div>
  );
}
