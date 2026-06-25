"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { AIDayGeneratorChat } from "@/components/unified/AIDayGeneratorChat";

/** Floating AI only — period control lives in the dashboard header (`RoleBasedComplianceTimePills`). */
export function RoleBasedUnifiedChrome({
  starterQuestions,
  chatSubtitle,
  generateResponse,
}: {
  starterQuestions?: string[];
  chatSubtitle?: string;
  generateResponse?: (userMessage: string) => Promise<string>;
} = {}) {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      {!aiOpen && (
        <button
          type="button"
          onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-[#b90abd] to-[#5332ff] text-white shadow-lg transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5332ff]"
          aria-label="Open AI Analyst chat"
        >
          <Bot className="h-7 w-7" />
        </button>
      )}

      <AIDayGeneratorChat
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        starterQuestions={starterQuestions}
        chatSubtitle={chatSubtitle}
        generateResponse={generateResponse}
      />
    </>
  );
}
