'use client';

import { useState, useRef, useEffect, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Send, Bot, User, Sparkles, FileText } from 'lucide-react';
import {
  getChatbotAnswer,
  getFullCXSummary,
  DEFAULT_ECOMMERCE_QUESTIONS,
  SUMMARY_QUESTION,
  SUMMARY_FOLLOW_UPS,
} from '@/lib/flipkart/chatbotEngine';

export interface CXSimulatorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  followUps?: string[];
  /** When set, render as CX report content (sections) instead of chat bubble. */
  summarySections?: { title: string; content: string }[];
}

interface CXSimulatorChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

function renderMarkdown(text: string): (string | ReactElement)[] {
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    const elements: (string | ReactElement)[] = [];
    let lastIndex = 0;
    let elementKey = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const matches = Array.from(line.matchAll(boldRegex));
    matches.forEach((match) => {
      if (match.index !== undefined) {
        if (match.index > lastIndex) {
          elements.push(line.substring(lastIndex, match.index));
        }
        elements.push(
          <strong key={`b-${lineIndex}-${elementKey++}`} className="font-semibold">
            {match[1]}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      }
    });
    if (lastIndex < line.length) {
      elements.push(line.substring(lastIndex));
    }
    return (
      <span key={`line-${lineIndex}`}>
        {elements.length > 0 ? elements : line}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
}

export function CXSimulatorChatbot({ isOpen, onClose }: CXSimulatorChatbotProps) {
  const [messages, setMessages] = useState<CXSimulatorMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const isSummaryRequest = (q: string) => {
    const lower = q.toLowerCase().replace(/\s+/g, ' ');
    return (
      lower.includes('full cx summary') ||
      lower.includes('full summary') ||
      lower.includes('unified dashboard summary') ||
      lower.includes('summary across all channels') ||
      lower === SUMMARY_QUESTION.toLowerCase()
    );
  };

  const handleSend = (text?: string) => {
    const toSend = (text || inputValue).trim();
    if (!toSend) return;

    const userMsg: CXSimulatorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: toSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    if (isSummaryRequest(toSend)) {
      setTimeout(() => {
        const sections = getFullCXSummary();
        const assistantMsg: CXSimulatorMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          summarySections: sections,
          followUps: SUMMARY_FOLLOW_UPS.slice(0, 6),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
      }, 400);
      return;
    }

    setTimeout(() => {
      const { answer, followUps } = getChatbotAnswer(toSend);
      const assistantMsg: CXSimulatorMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        followUps: followUps?.slice(0, 4) ?? [],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 600 + Math.random() * 400);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 pointer-events-auto bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="absolute right-0 top-0 h-[90vh] max-h-[800px] w-full max-w-2xl border-l border-white/10 flex flex-col rounded-l-lg overflow-hidden bg-(--sidebar)"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-app-black/70">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-linear-to-r from-[#b90abd] to-[#5332ff] shadow-lg shadow-[#b90abd]/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Day Generator</h2>
                  <p className="text-xs text-gray-300">Dashboard data • Ask for exact numbers</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {messages.length === 0 && (
              <div className="p-4 border-b border-white/20 bg-app-black/50">
                <p className="text-sm text-gray-300 mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_ECOMMERCE_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(question)}
                      className="px-3 py-1.5 text-xs font-medium bg-[#b90abd] text-white rounded-full hover:bg-[#a009b3] transition-all duration-200 shadow-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === 'assistant' && message.summarySections && message.summarySections.length > 0 ? (
                    <div>
                      <div className="w-full rounded-xl border border-white/15 bg-app-black/60 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#b90abd]" />
                          <span className="text-sm font-semibold text-white">CX Summary Report</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
                          {message.summarySections.map((section, idx) => (
                            <section key={idx}>
                              <h3 className="text-sm font-semibold text-[#b90abd] mb-1.5 uppercase tracking-wide">
                                {section.title}
                              </h3>
                              <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                                {renderMarkdown(section.content)}
                              </div>
                            </section>
                          ))}
                        </div>
                      </div>
                      {message.followUps && message.followUps.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="text-xs text-gray-500 self-center mr-1">Follow-up:</span>
                          {message.followUps.map((follow, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(follow)}
                              className="px-3 py-1.5 text-xs font-medium bg-[#b90abd] text-white rounded-full hover:bg-[#a009b3] transition-all"
                            >
                              {follow}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-r from-[#b90abd] to-[#5332ff] flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-linear-to-r from-[#b90abd] to-[#5332ff] text-white'
                              : 'bg-app-black/50 border border-white/10 text-gray-100'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">
                            {message.role === 'assistant'
                              ? renderMarkdown(message.content)
                              : message.content}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <div className="shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      {message.role === 'assistant' && message.followUps && message.followUps.length > 0 && (
                        <div className="mt-2 ml-11 flex flex-wrap gap-2">
                          <span className="text-xs text-gray-500 self-center mr-1">Follow-up:</span>
                          {message.followUps.map((follow, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(follow)}
                              className="px-2.5 py-1 text-xs font-medium bg-[#b90abd]/15 border border-[#b90abd]/50 text-gray-200 rounded-md hover:bg-[#b90abd]/30 hover:border-[#b90abd] hover:text-white transition-all"
                            >
                              {follow}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-r from-[#b90abd] to-[#5332ff] flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-app-black/50 border border-white/10 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#b90abd] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#b90abd] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#b90abd] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-app-black/50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type here"
                  className="flex-1 px-4 py-2.5 bg-app-black/60 border-2 border-[#b90abd]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#b90abd] focus:ring-2 focus:ring-[#b90abd]/30"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-linear-to-r from-[#b90abd] to-[#5332ff] hover:from-[#a009b3] hover:to-[#4a2ae6] text-white shadow-md shadow-[#b90abd]/40 hover:shadow-[#b90abd]/50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
