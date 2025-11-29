'use client';

import { useState, useEffect } from 'react';
import { AgentActionData, getCallTranscriptByAgentId, CallTranscript } from '@/lib/fci-lib/fciAdvancedData';
import { 
  Search, ChevronDown, ChevronLeft, ChevronRight, Phone, Mail, MessageCircle, 
  Ticket, Share2, Filter, X, Clock, Star, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Target, Heart, Zap, ThumbsUp, Calendar, AlertTriangle
} from 'lucide-react';

// ============ TYPE DEFINITIONS ============

interface AgentPerformance {
  id: string;
  name: string;
  qualityScore: number;
  qualityTrend: number;
  totalCases: number;
  channel: 'Email' | 'Chat' | 'Voice' | 'Ticket' | 'Social Media';
  fciScore: number;
  fciTrend: number;
  resolutionRate: number;
  avgHandleTime: string;
  customerSatisfaction: number;
  needsTrainingAt: string;
  status: 'Active' | 'In Training' | 'On Leave';
  cases: AgentCase[];
}

interface AgentCase {
  id: string;
  subject: string;
  channel: 'Email' | 'Chat' | 'Voice' | 'Ticket' | 'Social Media';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  csat: number;
  createdAt: string;
  status: 'Resolved' | 'Escalated' | 'Pending';
  dominantTopic: string;
  subtopics: string[];
  aiScores: {
    takeOwnership: number;
    actWithEmpathy: number;
    makeItEasy: number;
    getItRight: number;
  };
  aiSummary: string[];
  content: CaseContent;
}

interface EmailMessage { id: string; from: string; to: string; timestamp: string; subject: string; body: string; isAgent: boolean; sender: string; }
interface ChatMessage { id: string; sender: string; timestamp: string; message: string; isAgent: boolean; }
interface VoiceTranscript { id: string; speaker: string; timestamp: string; text: string; isAgent: boolean; }

type CaseContent = { type: 'Email'; messages: EmailMessage[]; } | { type: 'Chat'; messages: ChatMessage[]; } | { type: 'Voice'; transcript: VoiceTranscript[]; } | { type: 'Ticket' | 'Social Media'; messages: ChatMessage[]; };

// ============ SAMPLE DATA ============

const generateCasesForAgent = (agentId: string, channel: string): AgentCase[] => {
  // For Voice channel, try to get real call transcript data
  if (channel === 'Voice') {
    const callTranscript = getCallTranscriptByAgentId(agentId);
    if (callTranscript) {
      // Convert call transcript to voice case format
      const voiceCase: AgentCase = {
        id: callTranscript.callId,
        subject: `${callTranscript.topic} - ${callTranscript.customerName}`,
        channel: 'Voice' as const,
        sentiment: callTranscript.sentiment === 'positive' ? 'Positive' : callTranscript.sentiment === 'negative' ? 'Negative' : 'Neutral',
        csat: callTranscript.sentiment === 'positive' ? 4.5 : callTranscript.sentiment === 'negative' ? 2.0 : 3.0,
        createdAt: new Date(callTranscript.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: callTranscript.resolution === 'resolved' ? 'Resolved' : callTranscript.resolution === 'escalated' ? 'Escalated' : 'Pending',
        dominantTopic: callTranscript.topic,
        subtopics: [callTranscript.topic.split(' - ')[1] || callTranscript.topic],
        aiScores: {
          takeOwnership: Math.round((callTranscript.resolution === 'resolved' ? 75 : 40)),
          actWithEmpathy: Math.round((callTranscript.sentiment === 'positive' ? 80 : 35)),
          makeItEasy: Math.round((callTranscript.fciScore < 30 ? 75 : 45)),
          getItRight: Math.round((callTranscript.qualityScore > 70 ? 75 : 50))
        },
        aiSummary: callTranscript.fciScore > 35 ? [
          `FCI Score: ${callTranscript.fciScore}% - Quality needs improvement`,
          `Duration: ${callTranscript.duration} | Resolution: ${callTranscript.resolution}`,
          `Sentiment: ${callTranscript.sentiment}`
        ] : [
          `Excellent call - FCI Score: ${callTranscript.fciScore}%`,
          `Duration: ${callTranscript.duration} | Resolved successfully`,
          `Customer satisfied with resolution`
        ],
        content: {
          type: 'Voice' as const,
          transcript: callTranscript.messages.map((msg, idx) => ({
            id: msg.id,
            speaker: msg.name,
            timestamp: msg.timestamp || `${Math.floor(idx * 3)}:${String((idx * 3) % 60).padStart(2, '0')}`,
            text: msg.message,
            isAgent: msg.speaker === 'agent'
          }))
        }
      };
      return [voiceCase];
    }
  }

  // Original hardcoded cases for other channels
  const emailCases: AgentCase[] = [
    {
      id: `${agentId}-E001`, subject: 'Dispute on Unauthorized Debit Card Transaction - $847.50 (John Morrison)', channel: 'Email', sentiment: 'Negative', csat: 2, createdAt: 'Dec 15, 2024', status: 'Escalated',
      dominantTopic: 'Transaction Dispute', subtopics: ['Unauthorized Charge', 'Debit Card Fraud', 'Refund Request', 'Account Security'],
      aiScores: { takeOwnership: 28, actWithEmpathy: 22, makeItEasy: 25, getItRight: 32 },
      aiSummary: ['Agent failed to acknowledge customer frustration about unauthorized charge', 'Did not offer provisional credit as per bank policy for fraud claims', 'Should have escalated to fraud department within first response', 'Missing proper documentation of dispute details'],
      content: { type: 'Email', messages: [
        { id: '1', from: 'john.morrison@email.com', to: 'support@bofa.com', timestamp: 'Dec 15, 2024 9:23 AM', subject: 'URGENT: Unauthorized Transaction on My Account', body: 'I noticed a charge of $847.50 from "ELECTRONICS OUTLET" on my debit card that I did not make. I was at work during this time and have my card with me. This is clearly fraud and I need this resolved immediately. My account number ends in 4523.', isAgent: false, sender: 'John Morrison' },
        { id: '2', from: 'support@bofa.com', to: 'john.morrison@email.com', timestamp: 'Dec 15, 2024 2:45 PM', subject: 'RE: URGENT: Unauthorized Transaction on My Account', body: 'Thank you for contacting Bank of America. I can see the transaction you mentioned. Please fill out our dispute form and mail it to our processing center. This process takes 7-10 business days.', isAgent: true, sender: 'Support Agent - Sarah Bennett' },
        { id: '3', from: 'john.morrison@email.com', to: 'support@bofa.com', timestamp: 'Dec 15, 2024 3:12 PM', subject: 'RE: URGENT: Unauthorized Transaction on My Account', body: 'This is unacceptable! I am a victim of fraud and you want me to wait 10 days? I need my money back NOW. This is my rent money! Can someone actually help me or do I need to close my account?', isAgent: false, sender: 'John Morrison' },
        { id: '4', from: 'support@bofa.com', to: 'john.morrison@email.com', timestamp: 'Dec 15, 2024 4:30 PM', subject: 'RE: URGENT: Unauthorized Transaction on My Account', body: 'I understand. Our policy requires the dispute form. I have attached the form to this email. Please complete and return at your earliest convenience.', isAgent: true, sender: 'Support Agent - Sarah Bennett' }
      ]}
    },
    {
      id: `${agentId}-E002`, subject: 'Monthly Maintenance Fee Waiver Request - Mary Smith', channel: 'Email', sentiment: 'Negative', csat: 3, createdAt: 'Dec 14, 2024', status: 'Resolved',
      dominantTopic: 'Fee Dispute', subtopics: ['Maintenance Fee', 'Preferred Rewards', 'Account Tier', 'Fee Waiver Policy'],
      aiScores: { takeOwnership: 35, actWithEmpathy: 32, makeItEasy: 38, getItRight: 40 },
      aiSummary: ['Agent could have proactively offered fee refund for Preferred Rewards member', 'Missed opportunity to explain tier benefits clearly', 'Should have verified account balance to confirm eligibility', 'Response time exceeded 4-hour SLA for premium customers'],
      content: { type: 'Email', messages: [
        { id: '1', from: 'mary.smith@email.com', to: 'support@bofa.com', timestamp: 'Dec 14, 2024 10:15 AM', subject: 'Why am I being charged maintenance fee?', body: 'I have been a Preferred Rewards Gold member for 3 years. My account always has over $50,000 combined balance. Why was I charged a $25 monthly maintenance fee this month? Please refund this immediately.', isAgent: false, sender: 'Mary Smith' },
        { id: '2', from: 'support@bofa.com', to: 'mary.smith@email.com', timestamp: 'Dec 14, 2024 3:42 PM', subject: 'RE: Why am I being charged maintenance fee?', body: 'Hello Mary, I reviewed your account. It appears your balance dropped below the minimum threshold briefly on the 3rd of this month. The fee was correctly applied per our terms.', isAgent: true, sender: 'Support Agent - James Morrison' }
      ]}
    }
  ];

  const chatCases: AgentCase[] = [
    {
      id: `${agentId}-C001`, subject: 'Mobile App Login Issues - David Chen', channel: 'Chat', sentiment: 'Negative', csat: 2, createdAt: 'Dec 15, 2024', status: 'Escalated',
      dominantTopic: 'Account Access', subtopics: ['Mobile App', 'Login Failure', 'Password Reset', 'Two-Factor Authentication'],
      aiScores: { takeOwnership: 25, actWithEmpathy: 20, makeItEasy: 28, getItRight: 30 },
      aiSummary: ['Agent used robotic language instead of empathetic responses', 'Did not offer callback option for extended troubleshooting', 'Should have verified identity through alternative methods', 'Missed opportunity to educate on Erica virtual assistant'],
      content: { type: 'Chat', messages: [
        { id: '1', sender: 'David Chen', timestamp: '10:23 AM', message: 'Hi, I cannot login to my mobile banking app. It keeps saying "Authentication Failed" even though my password is correct!', isAgent: false },
        { id: '2', sender: 'Bank Agent Sarah', timestamp: '10:24 AM', message: 'Hello David. Please try resetting your password through the forgot password link.', isAgent: true },
        { id: '3', sender: 'David Chen', timestamp: '10:25 AM', message: 'I already tried that 3 times! It sends a code to my old phone number which I dont have anymore.', isAgent: false },
        { id: '4', sender: 'Bank Agent Sarah', timestamp: '10:27 AM', message: 'You will need to visit a branch with ID to update your phone number.', isAgent: true },
        { id: '5', sender: 'David Chen', timestamp: '10:28 AM', message: 'I am traveling abroad! That is not possible. Is there any other way?', isAgent: false },
        { id: '6', sender: 'Bank Agent Sarah', timestamp: '10:30 AM', message: 'Unfortunately that is our only option for phone number changes. Is there anything else I can help with?', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-C002`, subject: 'Wire Transfer Issue - Incorrect Fee Information - Angela Rodriguez', channel: 'Chat', sentiment: 'Negative', csat: 2, createdAt: 'Dec 15, 2024', status: 'Escalated',
      dominantTopic: 'Wire Transfer Issue', subtopics: ['Incorrect Fees', 'Hidden Charges', 'Poor Guidance', 'Customer Confusion'],
      aiScores: { takeOwnership: 30, actWithEmpathy: 28, makeItEasy: 32, getItRight: 35 },
      aiSummary: ['Agent provided incomplete fee information causing customer frustration', 'Failed to mention conversion rates and intermediary bank charges upfront', 'Should have offered fee comparison with other transfer methods', 'Customer was overcharged due to agent not explaining all costs clearly'],
      content: { type: 'Chat', messages: [
        { id: '1', sender: 'Angela Rodriguez', timestamp: '2:15 PM', message: 'Hi there! I want to send a wire transfer to my family in Mexico. What is my daily limit and total fees?', isAgent: false },
        { id: '2', sender: 'Bank Agent Marcus', timestamp: '2:16 PM', message: 'Hello Angela! Your daily wire limit is $50,000 for international transfers. The fee is just $20.', isAgent: true },
        { id: '3', sender: 'Angela Rodriguez', timestamp: '2:18 PM', message: 'I sent $5,000 but my family only received $4,850. Where did $150 go?', isAgent: false },
        { id: '4', sender: 'Bank Agent Marcus', timestamp: '2:19 PM', message: 'That would be the intermediary bank charges and currency conversion fees. You should have asked about those.', isAgent: true },
        { id: '5', sender: 'Angela Rodriguez', timestamp: '2:22 PM', message: 'You told me the fee was $20! This is false advertising. I want to escalate this!', isAgent: false }
      ]}
    }
  ];

  const ticketCases: AgentCase[] = [
    {
      id: `${agentId}-T001`, subject: 'Recurring ACH Debit Not Processing - Michael Johnson', channel: 'Ticket', sentiment: 'Negative', csat: 2, createdAt: 'Dec 15, 2024', status: 'Pending',
      dominantTopic: 'ACH Processing', subtopics: ['Recurring Payment', 'Utility Bill', 'Payment Schedule', 'Account Linking'],
      aiScores: { takeOwnership: 32, actWithEmpathy: 28, makeItEasy: 30, getItRight: 35 },
      aiSummary: ['Agent did not investigate root cause of ACH failure', 'Should have offered to set up payment from bank side', 'Missing follow-up with biller to confirm payment details', 'Customer left without clear resolution timeline'],
      content: { type: 'Ticket', messages: [
        { id: '1', sender: 'Michael Johnson', timestamp: 'Dec 15, 10:00 AM', message: 'My electric bill autopay has not gone through for 2 months. I am getting late fees. Account: ***4523', isAgent: false },
        { id: '2', sender: 'Support Agent - Ticket #78234', timestamp: 'Dec 15, 11:30 AM', message: 'Hello Michael, I reviewed your account. The ACH requests are being returned. Please contact your utility provider to verify account details.', isAgent: true },
        { id: '3', sender: 'Michael Johnson', timestamp: 'Dec 15, 1:45 PM', message: 'I already contacted them. They say everything looks correct on their end. Please help me resolve this!', isAgent: false },
        { id: '4', sender: 'Support Agent - Ticket #78234', timestamp: 'Dec 15, 3:00 PM', message: 'We can try setting up the payment manually. I can help you process a one-time payment and set up new ACH authorization.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-T002`, subject: 'Credit Card Dispute - Lost Card Replacement - Patricia Williams', channel: 'Ticket', sentiment: 'Negative', csat: 3, createdAt: 'Dec 14, 2024', status: 'Resolved',
      dominantTopic: 'Card Services', subtopics: ['Lost Card', 'Card Replacement', 'Fraud Protection', 'Account Security'],
      aiScores: { takeOwnership: 42, actWithEmpathy: 38, makeItEasy: 44, getItRight: 46 },
      aiSummary: ['Agent properly blocked card and ordered replacement', 'Could have offered expedited shipping at no cost', 'Should have provided more details on fraud monitoring', 'Follow-up communication was adequate but could be warmer'],
      content: { type: 'Ticket', messages: [
        { id: '1', sender: 'Patricia Williams', timestamp: 'Dec 14, 9:00 AM', message: 'I lost my credit card somewhere between home and the grocery store. I need it replaced ASAP.', isAgent: false },
        { id: '2', sender: 'Support Team', timestamp: 'Dec 14, 10:15 AM', message: 'Hello Patricia, I have immediately blocked your card to prevent fraudulent use. A replacement will be mailed to your address within 5-7 business days.', isAgent: true },
        { id: '3', sender: 'Patricia Williams', timestamp: 'Dec 14, 11:30 AM', message: 'Can you expedite it? I have travel coming up next week.', isAgent: false },
        { id: '4', sender: 'Support Team', timestamp: 'Dec 14, 1:00 PM', message: 'Yes, I can ship it overnight for $29.95. Should I process that for you?', isAgent: true }
      ]}
    }
  ];

  const socialCases: AgentCase[] = [
    {
      id: `${agentId}-S001`, subject: 'Public Complaint - ATM Ate Card (Robert Thompson)', channel: 'Social Media', sentiment: 'Negative', csat: 2, createdAt: 'Dec 15, 2024', status: 'Resolved',
      dominantTopic: 'ATM Services', subtopics: ['Card Retention', 'ATM Malfunction', 'Card Replacement', 'Account Access'],
      aiScores: { takeOwnership: 24, actWithEmpathy: 20, makeItEasy: 22, getItRight: 28 },
      aiSummary: ['Response on public platform lacked urgency', 'Should have moved conversation to DM immediately', 'Did not offer expedited card replacement', 'Missing apology for ATM malfunction'],
      content: { type: 'Social Media', messages: [
        { id: '1', sender: '@RThompson_22', timestamp: 'Dec 15, 8:45 AM', message: '@BankofAmerica Your ATM on Main St just ate my debit card! Now I have no way to access my money. This is unacceptable! #worstbank', isAgent: false },
        { id: '2', sender: '@BofA_Help', timestamp: 'Dec 15, 10:30 AM', message: 'Hi @RThompson_22, we apologize for the inconvenience. Please DM us your account details and we will assist you right away.', isAgent: true },
        { id: '3', sender: '@RThompson_22', timestamp: 'Dec 15, 11:00 AM', message: 'Finally! Check your DMs', isAgent: false }
      ]}
    },
    {
      id: `${agentId}-S002`, subject: 'Negative Feedback - Poor Service Recovery (Linda Foster)', channel: 'Social Media', sentiment: 'Negative', csat: 2, createdAt: 'Dec 14, 2024', status: 'Escalated',
      dominantTopic: 'Service Failure', subtopics: ['Poor Response', 'Unresolved Issue', 'Public Complaint', 'Brand Damage'],
      aiScores: { takeOwnership: 18, actWithEmpathy: 16, makeItEasy: 20, getItRight: 22 },
      aiSummary: ['Agent response on public platform was dismissive and unhelpful', 'Took 8 hours to respond to urgent public complaint', 'Did not offer concrete resolution or compensation', 'Customer escalated to better business bureau after this interaction'],
      content: { type: 'Social Media', messages: [
        { id: '1', sender: '@LFoster_Travel', timestamp: 'Dec 14, 7:30 AM', message: '@BankofAmerica My wire transfer failed AGAIN! You charged me $20 but my money never arrived. This is the 3rd time! #worstbank', isAgent: false },
        { id: '2', sender: '@BofA_Help', timestamp: 'Dec 14, 3:45 PM', message: '@LFoster_Travel Please DM us your account details. These matters take time to investigate.', isAgent: true },
        { id: '3', sender: '@LFoster_Travel', timestamp: 'Dec 14, 5:00 PM', message: '@BofA_Help 8 hours for a response?! My family is waiting for money! You should prioritize customers on social media!', isAgent: false },
        { id: '4', sender: '@BofA_Help', timestamp: 'Dec 14, 6:15 PM', message: '@LFoster_Travel We follow standard procedures. A resolution can take 5-7 business days.', isAgent: true }
      ]}
    }
  ];

  switch (channel) {
    case 'Email': return emailCases;
    case 'Chat': return chatCases;
    case 'Voice': return []; // Voice cases are generated dynamically at top of function
    case 'Ticket': return ticketCases;
    case 'Social Media': return socialCases;
    default: return emailCases;
  }
};

const agentData: AgentPerformance[] = [
  { id: 'AGT001', name: 'Michael Thompson', qualityScore: 62.4, qualityTrend: -8.2, totalCases: 156, channel: 'Voice', fciScore: 34.8, fciTrend: 12.4, resolutionRate: 58.2, avgHandleTime: '12m 45s', customerSatisfaction: 2.8, needsTrainingAt: 'Escalation Handling', status: 'In Training', cases: generateCasesForAgent('AGT001', 'Voice') },
  { id: 'AGT002', name: 'Robert Kim', qualityScore: 58.9, qualityTrend: -11.5, totalCases: 189, channel: 'Voice', fciScore: 42.1, fciTrend: 15.8, resolutionRate: 51.3, avgHandleTime: '14m 22s', customerSatisfaction: 2.4, needsTrainingAt: 'Product Knowledge', status: 'In Training', cases: generateCasesForAgent('AGT002', 'Voice') },
  { id: 'AGT003', name: 'Jennifer Walsh', qualityScore: 65.7, qualityTrend: -6.3, totalCases: 234, channel: 'Chat', fciScore: 31.2, fciTrend: 9.7, resolutionRate: 62.8, avgHandleTime: '8m 55s', customerSatisfaction: 3.1, needsTrainingAt: 'Empathy & Tone', status: 'In Training', cases: generateCasesForAgent('AGT003', 'Chat') },
  { id: 'AGT004', name: 'David Martinez', qualityScore: 71.2, qualityTrend: -4.8, totalCases: 312, channel: 'Email', fciScore: 28.5, fciTrend: 7.2, resolutionRate: 68.4, avgHandleTime: '18m 30s', customerSatisfaction: 3.3, needsTrainingAt: 'Response Accuracy', status: 'In Training', cases: generateCasesForAgent('AGT004', 'Email') },
  { id: 'AGT005', name: 'Amanda Foster', qualityScore: 67.8, qualityTrend: -5.6, totalCases: 178, channel: 'Social Media', fciScore: 29.4, fciTrend: 8.1, resolutionRate: 64.2, avgHandleTime: '6m 48s', customerSatisfaction: 3.0, needsTrainingAt: 'Brand Voice', status: 'In Training', cases: generateCasesForAgent('AGT005', 'Social Media') },
  { id: 'AGT006', name: 'Kevin O\'Brien', qualityScore: 69.5, qualityTrend: -3.9, totalCases: 267, channel: 'Chat', fciScore: 26.8, fciTrend: 6.4, resolutionRate: 66.9, avgHandleTime: '7m 12s', customerSatisfaction: 3.2, needsTrainingAt: 'First Contact Resolution', status: 'In Training', cases: generateCasesForAgent('AGT006', 'Chat') },
  { id: 'AGT007', name: 'Sarah Chen', qualityScore: 72.3, qualityTrend: -2.8, totalCases: 198, channel: 'Ticket', fciScore: 24.6, fciTrend: 5.3, resolutionRate: 70.1, avgHandleTime: '32m 15s', customerSatisfaction: 3.4, needsTrainingAt: 'SLA Compliance', status: 'In Training', cases: generateCasesForAgent('AGT007', 'Ticket') },
  { id: 'AGT008', name: 'James Rodriguez', qualityScore: 64.1, qualityTrend: -7.4, totalCases: 145, channel: 'Voice', fciScore: 32.7, fciTrend: 10.2, resolutionRate: 59.8, avgHandleTime: '11m 08s', customerSatisfaction: 2.9, needsTrainingAt: 'Dispute Resolution', status: 'In Training', cases: generateCasesForAgent('AGT008', 'Voice') },
  { id: 'AGT009', name: 'Emily Parker', qualityScore: 70.8, qualityTrend: -3.2, totalCases: 289, channel: 'Email', fciScore: 25.9, fciTrend: 4.8, resolutionRate: 69.2, avgHandleTime: '15m 45s', customerSatisfaction: 3.5, needsTrainingAt: 'Fee Waiver Policies', status: 'In Training', cases: generateCasesForAgent('AGT009', 'Email') },
  { id: 'AGT010', name: 'Lisa Wang', qualityScore: 73.6, qualityTrend: -2.1, totalCases: 223, channel: 'Chat', fciScore: 23.4, fciTrend: 4.1, resolutionRate: 71.5, avgHandleTime: '6m 32s', customerSatisfaction: 3.6, needsTrainingAt: 'Account Security', status: 'In Training', cases: generateCasesForAgent('AGT010', 'Chat') }
];

// ============ HELPER FUNCTIONS ============

const CHANNELS = ['All', 'Email', 'Chat', 'Voice', 'Ticket', 'Social Media'] as const;

const getChannelIcon = (channel: string) => {
  switch (channel) { case 'Email': return Mail; case 'Chat': return MessageCircle; case 'Voice': return Phone; case 'Ticket': return Ticket; case 'Social Media': return Share2; default: return MessageCircle; }
};

const getChannelColor = (channel: string) => {
  switch (channel) { case 'Email': return '#eab308'; case 'Chat': return '#f97316'; case 'Voice': return '#ef4444'; case 'Ticket': return '#22c55e'; case 'Social Media': return '#06b6d4'; default: return '#939394'; }
};

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) { case 'Positive': return '#22c55e'; case 'Neutral': return '#eab308'; case 'Negative': return '#ef4444'; default: return '#939394'; }
};

const getScoreColor = (score: number, isReverse = false) => {
  if (isReverse) { if (score <= 10) return '#22c55e'; if (score <= 18) return '#f97316'; return '#ef4444'; }
  if (score >= 90) return '#22c55e'; if (score >= 80) return '#eab308'; if (score >= 70) return '#f97316'; return '#ef4444';
};

const getAIScoreColor = (score: number) => { if (score >= 70) return '#22c55e'; if (score >= 50) return '#eab308'; return '#ef4444'; };

// ============ COMPONENT ============

interface SmartAgentActionListProps { data: AgentActionData; isDarkMode?: boolean; }

export function SmartAgentActionList({ data, isDarkMode = false }: SmartAgentActionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentPerformance | null>(null);
  const [selectedCase, setSelectedCase] = useState<AgentCase | null>(null);

  const filteredAgents = agentData.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || agent.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = selectedChannel === 'All' || agent.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  const closeModal = () => { setSelectedAgent(null); setSelectedCase(null); };
  const handleBackToAgent = () => { setSelectedCase(null); };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedAgent) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedAgent]);

  return (
    <>
      {/* MAIN AGENT LIST VIEW */}
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>Agents Requiring Training</h3>
            <p className="text-xs mt-1" style={{ color: '#939394' }}>Agents with high FCI scores and low quality metrics flagged for coaching</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
            <span>{filteredAgents.length} agents need attention</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
            <Search className="w-4 h-4" style={{ color: '#939394' }} />
            <input type="text" placeholder="Search agents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }} />
          </div>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`, color: isDarkMode ? '#FFFFFF' : '#010101' }}>
              <Filter className="w-4 h-4" style={{ color: '#5332FF' }} />
              <span>{selectedChannel}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} style={{ color: '#939394' }} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-xl py-2 z-50 shadow-lg" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                {CHANNELS.map((channel) => {
                  const ChannelIcon = channel === 'All' ? Filter : getChannelIcon(channel);
                  return (
                    <button key={channel} onClick={() => { setSelectedChannel(channel); setIsDropdownOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm" style={{ backgroundColor: selectedChannel === channel ? (isDarkMode ? '#5332FF20' : '#5332FF10') : 'transparent', color: selectedChannel === channel ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#4a4a4a') }}>
                      <ChannelIcon className="w-4 h-4" style={{ color: channel === 'All' ? '#5332FF' : getChannelColor(channel) }} />
                      {channel}
        </button>
                  );
                })}
              </div>
            )}
          </div>
      </div>

        <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
              <tr style={{ borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                <th className="text-left p-4 font-semibold text-xs uppercase" style={{ color: '#939394' }}>Agent</th>
                <th className="text-center p-4 font-semibold text-xs uppercase" style={{ color: '#939394' }}>Quality Score</th>
                <th className="text-center p-4 font-semibold text-xs uppercase" style={{ color: '#939394' }}>Total Cases</th>
                <th className="text-center p-4 font-semibold text-xs uppercase" style={{ color: '#939394' }}>Channel</th>
                <th className="text-center p-4 font-semibold text-xs uppercase" style={{ color: '#939394' }}>FCI Score</th>
                <th className="text-center p-4 font-semibold text-xs uppercase" style={{ color: '#939394' }}>CSAT</th>
                <th className="text-center p-4 font-semibold text-xs uppercase" style={{ color: '#939394' }}>Needs Training At</th>
            </tr>
          </thead>
          <tbody>
              {filteredAgents.map((agent) => {
                const ChannelIcon = getChannelIcon(agent.channel);
                return (
                  <tr key={agent.id} className="cursor-pointer transition-colors" style={{ borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }} onClick={() => setSelectedAgent(agent)} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#F5F5F5'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#5332FF' }}>{agent.name.split(' ').map(n => n[0]).join('')}</div>
                        <div className="min-w-0"><p className="font-medium truncate" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{agent.name}</p><p className="text-xs truncate" style={{ color: '#939394' }}>{agent.id}</p></div>
                  </div>
                </td>
                    <td className="p-4 text-center"><span className="font-bold" style={{ color: getScoreColor(agent.qualityScore) }}>{agent.qualityScore}%</span></td>
                    <td className="p-4 text-center"><span className="font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{agent.totalCases}</span></td>
                    <td className="p-4 text-center"><div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap" style={{ backgroundColor: `${getChannelColor(agent.channel)}20`, color: getChannelColor(agent.channel) }}><ChannelIcon className="w-3 h-3 flex-shrink-0" />{agent.channel}</div></td>
                    <td className="p-4 text-center"><span className="font-bold" style={{ color: getScoreColor(agent.fciScore, true) }}>{agent.fciScore}%</span></td>
                    <td className="p-4 text-center"><div className="flex items-center justify-center gap-1"><span className="font-medium" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{agent.customerSatisfaction}</span><span className="text-xs" style={{ color: '#939394' }}>/5</span></div></td>
                    <td className="p-4"><span className="px-2.5 py-1 rounded text-xs font-medium inline-block" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>{agent.needsTrainingAt}</span></td>
              </tr>
                );
              })}
          </tbody>
        </table>
      </div>

        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
          <p className="text-xs" style={{ color: '#939394' }}>Showing {filteredAgents.length} of {agentData.length} agents</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`, color: '#939394' }}>Previous</button>
            <div className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: '#5332FF', color: '#FFFFFF' }}>1</div>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`, color: '#939394' }}>Next</button>
          </div>
        </div>
      </div>

      {/* MODAL POPUP */}
      {selectedAgent && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-50 animate-in fade-in duration-300" style={{ backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }} onClick={closeModal} />

          {/* Modal */}
          <div className="fixed z-50 rounded-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 flex flex-col" style={{ top: '1rem', left: '1rem', right: '1rem', bottom: '1rem', backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`, boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.6)' }}>
            
            {/* Modal Header */}
            <div className="p-6 border-b shrink-0" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5', background: isDarkMode ? 'linear-gradient(135deg, #ef444410 0%, transparent 100%)' : 'linear-gradient(135deg, #ef444408 0%, transparent 100%)' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {selectedCase && (
                    <button onClick={handleBackToAgent} className="p-2 rounded-xl transition-all hover:scale-105" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                      <ChevronLeft className="w-5 h-5" style={{ color: '#939394' }} />
                    </button>
                  )}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#F0F0F0', color: isDarkMode ? '#FFFFFF' : '#010101' }}>{selectedAgent.name.split(' ').map(n => n[0]).join('')}</div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: '#ef4444', borderColor: isDarkMode ? '#0d0d0d' : '#FFFFFF' }}><AlertTriangle className="w-3 h-3 text-white" /></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{selectedAgent.name}</h2>
                      <span className="text-xs px-2 py-1 rounded-full font-medium uppercase" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>High Risk</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm" style={{ color: '#939394' }}>
                      <span>{selectedAgent.id}</span>
                      <span>{selectedAgent.channel}</span>
                      <span>{selectedAgent.needsTrainingAt}</span>
                    </div>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 rounded-xl transition-all hover:scale-105" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                  <X className="w-5 h-5" style={{ color: '#939394' }} />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-5">
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}>
                  <p className="text-2xl font-bold" style={{ color: getScoreColor(selectedAgent.qualityScore) }}>{selectedAgent.qualityScore}%</p>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>Quality Score</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}>
                  <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>{selectedAgent.fciScore}%</p>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>FCI Score</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5' }}>
                  <p className="text-2xl font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{selectedAgent.totalCases}</p>
                  <p className="text-[10px] uppercase tracking-wide" style={{ color: '#939394' }}>Total Cases</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedCase ? (
                /* CASE DETAIL VIEW */
                <div className="grid grid-cols-3 gap-4 h-full">
                  {/* Left - Content */}
                  <div className="rounded-xl p-4 overflow-y-auto" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                      {(() => { const Icon = getChannelIcon(selectedCase.channel); return <Icon className="w-4 h-4" style={{ color: getChannelColor(selectedCase.channel) }} />; })()}
                      {selectedCase.channel === 'Voice' ? 'Call Transcript' : selectedCase.channel === 'Email' ? 'Email Thread' : 'Conversation'}
                    </h4>
                    <div className="space-y-3">
                      {selectedCase.content.type === 'Email' && selectedCase.content.messages.map((msg) => (
                        <div key={msg.id} className="p-3 rounded-lg" style={{ backgroundColor: msg.isAgent ? (isDarkMode ? '#5332FF15' : '#5332FF10') : (isDarkMode ? '#0d0d0d' : '#FFFFFF'), borderLeft: `3px solid ${msg.isAgent ? '#5332FF' : '#939394'}` }}>
                          <div className="flex items-center justify-between mb-2"><span className="text-xs font-medium" style={{ color: msg.isAgent ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#4a4a4a') }}>{msg.sender}</span><span className="text-xs" style={{ color: '#939394' }}>{msg.timestamp}</span></div>
                          <p className="text-xs font-medium mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{msg.subject}</p>
                          <p className="text-xs leading-relaxed" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{msg.body}</p>
                        </div>
                      ))}
                      {(selectedCase.content.type === 'Chat' || selectedCase.content.type === 'Ticket' || selectedCase.content.type === 'Social Media') && selectedCase.content.messages.map((msg) => (
                        <div key={msg.id} className={`p-3 rounded-lg ${msg.isAgent ? 'ml-4' : 'mr-4'}`} style={{ backgroundColor: msg.isAgent ? (isDarkMode ? '#5332FF15' : '#5332FF10') : (isDarkMode ? '#0d0d0d' : '#FFFFFF'), border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                          <div className="flex items-center justify-between mb-1"><span className="text-xs font-medium" style={{ color: msg.isAgent ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#4a4a4a') }}>{msg.sender}</span><span className="text-xs" style={{ color: '#939394' }}>{msg.timestamp}</span></div>
                          <p className="text-xs leading-relaxed" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{msg.message}</p>
                        </div>
                      ))}
                      {selectedCase.content.type === 'Voice' && selectedCase.content.transcript.map((item) => (
                        <div key={item.id} className={`p-3 rounded-lg ${item.isAgent ? 'ml-4' : 'mr-4'}`} style={{ backgroundColor: item.isAgent ? (isDarkMode ? '#5332FF15' : '#5332FF10') : (isDarkMode ? '#0d0d0d' : '#FFFFFF'), border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                          <div className="flex items-center justify-between mb-1"><span className="text-xs font-medium" style={{ color: item.isAgent ? '#5332FF' : (isDarkMode ? '#D6D9D8' : '#4a4a4a') }}>{item.speaker}</span><span className="text-xs font-mono" style={{ color: '#939394' }}>{item.timestamp}</span></div>
                          <p className="text-xs leading-relaxed" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>"{item.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Middle - Topics & Scores */}
                  <div className="flex flex-col gap-4 overflow-y-auto">
                    <div className="rounded-xl p-4" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}><Target className="w-4 h-4" style={{ color: '#5332FF' }} />Dominant Topic</h4>
                      <div className="px-3 py-2 rounded-lg mb-3" style={{ backgroundColor: '#5332FF20', border: '1px solid #5332FF' }}><p className="text-sm font-bold" style={{ color: '#5332FF' }}>{selectedCase.dominantTopic}</p></div>
                      <p className="text-xs font-medium mb-2" style={{ color: '#939394' }}>Subtopics</p>
                      <div className="flex flex-wrap gap-2">{selectedCase.subtopics.map((topic, idx) => (<span key={idx} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5', color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{topic}</span>))}</div>
                    </div>
                    <div className="rounded-xl p-4 flex-1" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                      <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}><Zap className="w-4 h-4" style={{ color: '#f97316' }} />AI Score Breakdown</h4>
                      <div className="space-y-4">
                        {[{ label: 'Take Ownership', score: selectedCase.aiScores.takeOwnership, icon: ThumbsUp, color: '#3b82f6' }, { label: 'Act with Empathy', score: selectedCase.aiScores.actWithEmpathy, icon: Heart, color: '#ec4899' }, { label: 'Make it Easy', score: selectedCase.aiScores.makeItEasy, icon: Zap, color: '#f97316' }, { label: 'Get it Right', score: selectedCase.aiScores.getItRight, icon: CheckCircle, color: '#22c55e' }].map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-1"><span className="text-xs font-medium flex items-center gap-2" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}><item.icon className="w-3 h-3" style={{ color: item.color }} />{item.label}</span><span className="text-sm font-bold" style={{ color: getAIScoreColor(item.score) }}>{item.score}</span></div>
                            <div className="h-2 rounded-full" style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}><div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: getAIScoreColor(item.score) }} /></div>
                          </div>
                        ))}
                      </div>
                </div>
        </div>

                  {/* Right - AI Summary */}
                  <div className="rounded-xl p-4 overflow-y-auto" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F5F5F5', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}><AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />AI Coaching Summary</h4>
                    <div className="space-y-3">
                      {selectedCase.aiSummary.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-lg flex items-start gap-3" style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>{idx + 1}</span>
                          <p className="text-xs leading-relaxed" style={{ color: isDarkMode ? '#D6D9D8' : '#4a4a4a' }}>{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#5332FF15', border: '1px solid #5332FF' }}>
                      <p className="text-xs font-medium mb-1" style={{ color: '#5332FF' }}>Recommended Training</p>
                      <p className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{selectedAgent.needsTrainingAt}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* CASES LIST VIEW */
                <div className="grid gap-3">
                  {selectedAgent.cases.map((caseItem) => {
                    const ChannelIcon = getChannelIcon(caseItem.channel);
                    return (
                      <div key={caseItem.id} onClick={() => setSelectedCase(caseItem)} className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]" style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF', border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}` }}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2"><ChannelIcon className="w-4 h-4" style={{ color: getChannelColor(caseItem.channel) }} /><span className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{caseItem.subject}</span></div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs" style={{ color: '#939394' }}><Calendar className="w-3 h-3 inline mr-1" />{caseItem.createdAt}</span>
                              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${getSentimentColor(caseItem.sentiment)}20`, color: getSentimentColor(caseItem.sentiment) }}>{caseItem.sentiment}</span>
                              <span className="text-xs flex items-center gap-1" style={{ color: '#939394' }}><Star className="w-3 h-3" style={{ color: '#eab308' }} />CSAT: {caseItem.csat}/5</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5" style={{ color: '#939394' }} />
                        </div>
                      </div>
                    );
                  })}
        </div>
      )}
    </div>
          </div>
        </>
      )}
    </>
  );
}
