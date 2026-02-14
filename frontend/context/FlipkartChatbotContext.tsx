'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type FlipkartChatbotContextValue = {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
};

const FlipkartChatbotContext = createContext<FlipkartChatbotContextValue | null>(null);

export function FlipkartChatbotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openChatbot = useCallback(() => setIsOpen(true), []);
  const closeChatbot = useCallback(() => setIsOpen(false), []);

  return (
    <FlipkartChatbotContext.Provider value={{ isOpen, openChatbot, closeChatbot }}>
      {children}
    </FlipkartChatbotContext.Provider>
  );
}

export function useFlipkartChatbot(): FlipkartChatbotContextValue {
  const ctx = useContext(FlipkartChatbotContext);
  if (!ctx) {
    return {
      isOpen: false,
      openChatbot: () => {},
      closeChatbot: () => {},
    };
  }
  return ctx;
}
