'use client';

import { useState, useRef, useEffect, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIDayGeneratorChatProps {
  isOpen: boolean;
  onClose: () => void;
  starterQuestions?: string[];
  chatSubtitle?: string;
  generateResponse?: (userMessage: string) => Promise<string>;
}

const DEFAULT_QUESTIONS = [
  "Which of my high-value customers are at risk of churning this week?",
  "Why is Fee Dispute SLA at 64% — what's causing the delay?",
  "What are my HNI customers calling about most today?",
  "Which intents are spiking this week and what's driving them?",
  "How is our brand sentiment trending across channels?",
  "What pain points are putting high-value customer retention at risk?",
  "Where are we losing our process promise this week?",
  "What are customers saying about us on Trustpilot and App Store?"
];

export function AIDayGeneratorChat({
  isOpen,
  onClose,
  starterQuestions = DEFAULT_QUESTIONS,
  chatSubtitle = "Unified insights across Email, Chat, Ticket, Social & Voice",
  generateResponse,
}: AIDayGeneratorChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    if (generateResponse) {
      return generateResponse(userMessage);
    }

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const lowerMessage = userMessage.toLowerCase();

    // Q1 — HNI / high-value churn risk
    if (lowerMessage.includes('churn') || lowerMessage.includes('high-value customers are at risk') || lowerMessage.includes('churning')) {
      return `**High-Value Customers at Churn Risk This Week**\n\n` +
        `🔴 **3 HNI customers flagged at 72–89% churn probability** (combined deposits: £1.2M)\n\n` +
        `**Customer Breakdown**:\n` +
        `• **HNI-001** — Churn probability 89% · Trigger: 3 failed EMI transactions + fee dispute unresolved for 14 days\n` +
        `• **HNI-002** — Churn probability 81% · Trigger: Mortgage servicing complaint escalated twice, no resolution\n` +
        `• **HNI-003** — Churn probability 72% · Trigger: Competitor rate mentioned twice in last call; HELOC rate query unresolved\n\n` +
        `**What's driving their unhappiness**:\n` +
        `• EMI processing failures — not communicated proactively\n` +
        `• Fee confusion — new policy not explained at onboarding\n` +
        `• Long wait on mortgage servicing queries (avg 2.1 days vs same-day expectation for HNI)\n\n` +
        `**Recommended Action**:\n` +
        `1. Relationship Manager outreach to all 3 within 24 hours\n` +
        `2. Waive fee for HNI-001 as goodwill gesture\n` +
        `3. Escalate HNI-002 mortgage query to senior servicing team today\n` +
        `4. Provide HNI-003 a personalised HELOC rate comparison briefing`;
    }

    // Q2 — Fee Dispute SLA 64%
    if (lowerMessage.includes('fee dispute') || lowerMessage.includes('sla at 64') || lowerMessage.includes('causing the delay')) {
      return `**Fee Dispute SLA at 64% — Root Cause Analysis**\n\n` +
        `⚠️ **Current performance**: 64% SLA hit rate vs 90% target · Avg resolution time: 3.2 days vs 1-day target\n\n` +
        `**Why it's at 64% — 3 confirmed root causes**:\n\n` +
        `🔴 **1. KYC API Latency (Primary cause — 51% of delays)**\n` +
        `• KYC API running at 3× normal latency since Tuesday\n` +
        `• Every fee dispute requires identity re-verification — this step is now taking 4.2 hours instead of 20 minutes\n` +
        `• 580 applications and disputes currently stuck in this bottleneck\n\n` +
        `🟠 **2. Manual Evidence Collection Step (31% of delays)**\n` +
        `• Disputes routed to BPO team take 2.4× longer at evidence-gathering stage\n` +
        `• BPO team is not following the updated dispute framework — training gap confirmed\n\n` +
        `🟡 **3. Missing Escalation Routing (18% of delays)**\n` +
        `• 3 disputes have been sitting unactioned for >4 hours with no owner assigned\n` +
        `• Escalation routing rule not triggering correctly after the system update last Friday\n\n` +
        `**Immediate Actions**:\n` +
        `1. Engineering: prioritise KYC API fix — estimated resolution 6–8 hours\n` +
        `2. Temporarily bypass KYC re-verification for existing verified customers on disputes <£500\n` +
        `3. Pull back BPO fee dispute queue to in-house team until training is complete`;
    }

    // Q3 — HNI customers calling about most
    if (lowerMessage.includes('hni') || lowerMessage.includes('calling about most') || lowerMessage.includes('high-value') && lowerMessage.includes('calling')) {
      return `**What HNI & High-Value Customers Are Calling About Today**\n\n` +
        `📞 **Total HV calls this week: 312** (High-Value: >£100K portfolio)\n\n` +
        `**Top Intents — High-Value Segment**:\n` +
        `• 🏠 Mortgage Servicing — **31%** (97 calls) · SLA hit rate: 72% · Avg wait: 2.1 days\n` +
        `• 💸 Fee Confusion — **24%** (75 calls) · SLA hit rate: 64% · Avg wait: 3.2 days ← **Worst**\n` +
        `• 🏡 HELOC Rate Query — **15%** (47 calls) · SLA hit rate: 88% · Mainly rate comparisons\n` +
        `• 🚪 Account Closure — **12%** (37 calls) · SLA hit rate: 81% · Competitor mentions rising\n` +
        `• 📋 Onboarding Delays — **18%** (56 calls) · KYC bottleneck — 580 apps stuck\n\n` +
        `**What's changed vs last week**:\n` +
        `• Mortgage Servicing calls up +18% — rate reset notifications sent last Tuesday triggered a wave\n` +
        `• Fee Confusion up +31% — new fee policy communicated poorly at point of change\n` +
        `• HELOC Rate Query up +24% — competitor dropped rates, customers comparing\n` +
        `• Account Closure up +9% — likely linked to fee dissatisfaction\n\n` +
        `**Key insight**: 68% of HNI unhappy calls trace back to 2 fixable issues — fee policy communication and KYC API speed.`;
    }

    // Q4 — Intents spiking
    if (lowerMessage.includes('spike') || lowerMessage.includes('spiking') || lowerMessage.includes('intents are')) {
      return `**Intent Spikes This Week — Retail Banking**\n\n` +
        `📈 **3 intents showing significant volume growth**:\n\n` +
        `🔴 **Fee Dispute — +31% spike**\n` +
        `• Volume: 75 open disputes (up from 57 last week)\n` +
        `• Root cause: New fee policy introduced 10 days ago with no proactive customer communication\n` +
        `• Sentiment on these calls: 0.31 (very negative) — customers feel blindsided\n` +
        `• SLA hit rate: 64% — this is your most urgent problem\n\n` +
        `🟠 **HELOC Rate Query — +24% spike**\n` +
        `• Volume: 47 calls this week (up from 38)\n` +
        `• Root cause: Competitor bank dropped HELOC rate by 0.4% — customers calling to renegotiate\n` +
        `• Risk: 12 of these callers mentioned switching — 3 already classified as churn risk\n` +
        `• Action: Equip agents with competitive rate response script today\n\n` +
        `🟡 **Mortgage Servicing — +18% spike**\n` +
        `• Volume: 97 calls this week (up from 82)\n` +
        `• Root cause: Rate reset notifications sent last Tuesday — customers confused about new EMI amounts\n` +
        `• 31% of HNI calls are on this intent — your highest-value customers are frustrated\n` +
        `• Action: Proactive outreach to all customers who received rate reset notices\n\n` +
        `**Positive signal**: Card Replacement stable at 91% SLA — no spike, well handled.`;
    }

    // Q5 — Brand sentiment across channels
    if (lowerMessage.includes('brand sentiment') || lowerMessage.includes('sentiment trending') || lowerMessage.includes('brand') && lowerMessage.includes('channel')) {
      return `**Brand Sentiment Across Channels — This Week**\n\n` +
        `📊 **Overall brand sentiment: 0.58** (Target: 0.65 · Below threshold for 2nd consecutive week)\n\n` +
        `**Channel Breakdown**:\n` +
        `• 📱 App Store — **0.71** ✅ Best channel · Budgeting tool praised, instant rate alerts getting 4-star reviews\n` +
        `• 📞 Voice — **0.64** 🟡 Just below target · Transfer loops still frustrating HV customers\n` +
        `• 💬 Chat — **0.62** 🟡 Moderate · 62% containment rate, bot handoff still rough\n` +
        `• 📧 Email — **0.56** 🟠 Below target · 143 emails unresolved >48h pulling score down\n` +
        `• 📲 Social / X — **0.41** 🔴 Worst channel · Fee complaint backlash, 4 posts trending\n\n` +
        `**What's being said**:\n` +
        `• Trustpilot: Dropped from 3.8 → 3.2 this week. Top complaint: "Hidden fees — no warning"\n` +
        `• App Store: Customers praising new budgeting feature. 2 feature requests surfaced: mortgage calculator & HELOC rate alert\n` +
        `• Social/X: 4 posts trending on "fee increase" — not yet viral but growing at 1.8× baseline\n\n` +
        `**Key insight**: Social/X sentiment is low but banking customers rarely escalate socially unless severely frustrated. Fee communication is the single biggest brand risk right now.`;
    }

    // Q6 — Pain points and retention risk
    if (lowerMessage.includes('pain point') || lowerMessage.includes('retention at risk') || lowerMessage.includes('putting high-value')) {
      return `**Pain Points Putting High-Value Customer Retention at Risk**\n\n` +
        `🎯 **Customer Happiness Score: 72** — 32% of HV customers currently unhappy\n\n` +
        `**Top Pain Points Driving Retention Risk**:\n\n` +
        `🔴 **1. EMI Processing Failures — 31% of HV unhappy calls**\n` +
        `• Customers not notified when EMI fails — they find out from overdraft charges\n` +
        `• Average time to resolve: 4.1 hours\n` +
        `• Business impact: Each unresolved EMI failure has 3.2× higher churn signal than an average complaint\n\n` +
        `🔴 **2. Fee Confusion — 24% of HV unhappy calls**\n` +
        `• New fee policy introduced without adequate communication\n` +
        `• Customers feel deceived — sentiment score on fee calls: 0.31 (very negative)\n` +
        `• 4 posts on Social/X trending — reputational risk building\n\n` +
        `🟠 **3. KYC Onboarding Delays — 580 applications stuck**\n` +
        `• New HV customers experiencing 4.2-hour delays at verification step\n` +
        `• First impression damage — churn probability highest in first 90 days\n\n` +
        `🟠 **4. Mortgage Servicing Response Time — 2.1 days avg**\n` +
        `• HNI expectation: same-day response. Current: 2.1 days\n` +
        `• 97 HV customers waiting — 3 already flagged as churn risk\n\n` +
        `**If nothing changes**: Based on current churn probability signals, estimated £1.2M in deposits at risk within 30 days.`;
    }

    // Q7 — Process promise / SLA
    if (lowerMessage.includes('process promise') || lowerMessage.includes('losing') || lowerMessage.includes('where are we')) {
      return `**Where We Are Losing Our Process Promise This Week**\n\n` +
        `📉 **Overall Service Fulfilment Score: 68** · SLA compliance trending ▼ 6% week-on-week\n\n` +
        `**SLA Performance by Intent**:\n` +
        `• ✅ Card Replacement — **91%** SLA hit · Avg: 0.3 days · On promise\n` +
        `• ✅ Account Closure — **81%** SLA hit · Avg: 1.5 days · Acceptable\n` +
        `• 🟠 Mortgage Servicing — **72%** SLA hit · Avg: 2.1 days · Slipping\n` +
        `• 🔴 Fee Dispute — **64%** SLA hit · Avg: 3.2 days vs 1-day target · **Biggest breach**\n\n` +
        `**Where the promise breaks — ranked by impact**:\n\n` +
        `1. 🔴 **KYC API bottleneck** — 4.2hr delay per case · 580 customers impacted · Blocking both Fee Dispute and Mortgage Servicing resolution\n` +
        `2. 🟠 **BPO evidence collection** — 2.4× slower than in-house · 75 fee disputes stuck here\n` +
        `3. 🟠 **Escalation routing failure** — 3 disputes unactioned >4h · Routing rule broken since Friday update\n` +
        `4. 🟡 **Mortgage query backlog** — 97 calls, agents lack rate-lookup tool access after system update\n\n` +
        `**What good looks like**: Card Replacement at 91% — automated fulfilment, no human bottleneck. This is the model to replicate.`;
    }

    // Q8 — Trustpilot and App Store
    if (lowerMessage.includes('trustpilot') || lowerMessage.includes('app store') || lowerMessage.includes('customers saying about us')) {
      return `**What Customers Are Saying — Trustpilot & App Store**\n\n` +
        `**Trustpilot** · Score: **3.2 / 5** (↓ from 3.8 last month)\n\n` +
        `🔴 **Negative reviews (dominant theme — fee complaints)**:\n` +
        `• "Charged fees I didn't know about. No warning. No explanation." — 4 similar reviews this week\n` +
        `• "Tried to dispute a fee, waited 3 days, still no resolution. Switching banks."\n` +
        `• "Mortgage rate reset notification was confusing — had to call 3 times to understand my new EMI"\n\n` +
        `🟢 **Positive reviews**:\n` +
        `• "New app update is great — budgeting tool actually useful for the first time"\n` +
        `• "Card replacement was done overnight — very impressed"\n` +
        `• 12 new 4-5 star reviews this week on app experience\n\n` +
        `**App Store** · Sentiment: **0.71** ✅ Best performing channel\n\n` +
        `🟢 **What customers love**:\n` +
        `• Budgeting tool: "Finally a bank app that shows me where I'm overspending"\n` +
        `• Instant HELOC rate alerts requested by multiple users — feature opportunity\n` +
        `• Card freeze / unfreeze UX praised\n\n` +
        `🟡 **Feature requests surfaced this week**:\n` +
        `• Mortgage EMI calculator — 18 requests\n` +
        `• Real-time HELOC rate comparison — 11 requests\n\n` +
        `**Key insight**: Your app is your strongest brand asset right now. Fee communication is destroying Trustpilot. Fix the communication, not the fees.`;
    }

    // Default retail banking response
    return `**Retail Banking Dashboard — Head of Retail Banking**\n\n` +
      `📊 **Your dashboard at a glance**:\n` +
      `• Customer Happiness Score: **72** · HV happy: 68% · LV happy: 81%\n` +
      `• Brand & Reputation: **64** · Overall sentiment: 0.58 (below 0.65 target)\n` +
      `• Service Fulfilment: **68** · SLA trending ▼ 6% this week\n\n` +
      `**Top 3 things that need your attention today**:\n` +
      `1. 🔴 3 HNI customers at churn risk (£1.2M deposits) — RM outreach needed today\n` +
      `2. 🔴 Fee Dispute SLA at 64% — KYC API fix required urgently\n` +
      `3. 🟠 Fee policy communication gap — driving Trustpilot drop and Social/X backlash\n\n` +
      `**Ask me about**:\n` +
      `• Which high-value customers are at churn risk\n` +
      `• Why Fee Dispute SLA is at 64%\n` +
      `• What intents are spiking and why\n` +
      `• How brand sentiment is trending across channels\n` +
      `• Where we are losing our process promise`;
  };

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Generate AI response
    const aiResponse = await generateAIResponse(messageText);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      const elements: (string | ReactElement)[] = [];
      let lastIndex = 0;
      let elementKey = 0;

      // Process bold text (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const matches = Array.from(line.matchAll(boldRegex));
      
      matches.forEach((match) => {
        if (match.index !== undefined) {
          // Add text before the match
          if (match.index > lastIndex) {
            elements.push(line.substring(lastIndex, match.index));
          }
          // Add bold text
          elements.push(
            <strong key={`bold-${lineIndex}-${elementKey++}`} className="font-semibold">
              {match[1]}
            </strong>
          );
          lastIndex = match.index + match[0].length;
        }
      });
      
      // Add remaining text
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
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-50 bottom-6 right-6 flex flex-col" style={{ width: 420 }}>
          {/* Chat Popup */}
          <motion.div
            className="w-full h-[600px] border border-white/10 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            style={{ backgroundColor: 'var(--sidebar)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-app-black/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#b90abd] to-[#5332ff]">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Analyst</h2>
                  <p className="text-xs text-gray-400">{chatSubtitle}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Default Questions */}
            {messages.length === 0 && (
              <div className="p-4 border-b border-white/10 bg-app-black/30">
                <p className="text-sm text-gray-400 mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {starterQuestions.map((question, index) => {
                    const colors = [
                      { base: "#06b6d4", bg: "rgba(6,182,212,0.10)", border: "rgba(6,182,212,0.30)", hover: "rgba(6,182,212,0.20)" },
                      { base: "#60a5fa", bg: "rgba(96,165,250,0.10)", border: "rgba(96,165,250,0.30)", hover: "rgba(96,165,250,0.20)" },
                      { base: "#2dd4bf", bg: "rgba(45,212,191,0.10)", border: "rgba(45,212,191,0.30)", hover: "rgba(45,212,191,0.20)" },
                      { base: "#818cf8", bg: "rgba(129,140,248,0.10)", border: "rgba(129,140,248,0.30)", hover: "rgba(129,140,248,0.20)" },
                    ];
                    const c = colors[index % colors.length];
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuestionClick(question)}
                        style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.base }}
                        className="px-3 py-1.5 text-xs rounded-full transition-all duration-200"
                        onMouseEnter={e => (e.currentTarget.style.background = c.hover)}
                        onMouseLeave={e => (e.currentTarget.style.background = c.bg)}
                      >
                        {question}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#b90abd] to-[#5332ff] flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-[#b90abd] to-[#5332ff] text-white'
                        : 'bg-app-black/50 border border-white/10 text-gray-100'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{renderMarkdown(message.content)}</div>
                    <div className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#b90abd] to-[#5332ff] flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-app-black/50 border border-white/10 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#b90abd] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#b90abd] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#b90abd] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-app-black/50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your unified dashboard..."
                  className="flex-1 px-4 py-2 bg-app-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-[#b90abd] to-[#5332ff] hover:from-[#a009b3] hover:to-[#4a2ae6] text-white"
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

