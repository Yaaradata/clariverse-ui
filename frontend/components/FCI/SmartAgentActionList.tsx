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
  // Voice cases - comprehensive call transcripts
  const voiceCases: AgentCase[] = [
    {
      id: `${agentId}-V001`, subject: 'Debit Card Declined - Fraud Alert - Robert Patterson', channel: 'Voice', sentiment: 'Negative', csat: 2, createdAt: 'Nov 28, 2025', status: 'Escalated',
      dominantTopic: 'Card Declined', subtopics: ['Fraud Alert', 'Transaction Block', 'Verification Failure', 'Customer Frustration'],
      aiScores: { takeOwnership: 22, actWithEmpathy: 18, makeItEasy: 20, getItRight: 25 },
      aiSummary: ['Agent did not acknowledge customer urgency about declined card at gas station - should have expressed immediate concern', 'Failed to verify identity quickly causing extended hold time of 2+ minutes - target is under 60 seconds', 'Did not offer immediate card unblock after successful verification - policy allows instant unblock for verified customers', 'Used excessive transfers instead of resolving directly - agent has authority to handle fraud alerts', 'Customer left without resolution and escalated to supervisor - could have been avoided with proper ownership', 'Recommended Training: Fraud Alert Resolution Protocol, Customer Urgency Recognition, Identity Verification Speed'],
      content: { type: 'Voice', transcript: [
        { id: '1', speaker: 'Robert Patterson', timestamp: '0:00', text: 'Hi, my debit card was just declined at the gas station and I have no idea why. I have money in my account!', isAgent: false },
        { id: '2', speaker: 'Agent Michael', timestamp: '0:15', text: 'Hello, thank you for calling. Can I have your account number please?', isAgent: true },
        { id: '3', speaker: 'Robert Patterson', timestamp: '0:22', text: 'Its ending in 4523. Look, I am standing here at the pump with my family waiting. This is embarrassing!', isAgent: false },
        { id: '4', speaker: 'Agent Michael', timestamp: '0:35', text: 'I understand. Let me pull up your account. Please hold for a moment.', isAgent: true },
        { id: '5', speaker: 'Robert Patterson', timestamp: '2:15', text: 'Hello? Are you still there? I have been waiting for almost 2 minutes!', isAgent: false },
        { id: '6', speaker: 'Agent Michael', timestamp: '2:20', text: 'Yes sir, I am here. I see there was a fraud alert triggered. I need to verify some information.', isAgent: true },
        { id: '7', speaker: 'Robert Patterson', timestamp: '2:30', text: 'What fraud? I made a purchase at Target yesterday and now gas today. These are normal purchases!', isAgent: false },
        { id: '8', speaker: 'Agent Michael', timestamp: '2:45', text: 'Our system flagged unusual activity. Can you verify your mothers maiden name and the last 4 of your SSN?', isAgent: true },
        { id: '9', speaker: 'Robert Patterson', timestamp: '3:00', text: 'This is ridiculous. Johnson and 7845. Now can you unblock my card?', isAgent: false },
        { id: '10', speaker: 'Agent Michael', timestamp: '3:15', text: 'I need to transfer you to our fraud department for further verification. Please hold.', isAgent: true },
        { id: '11', speaker: 'Robert Patterson', timestamp: '3:25', text: 'No! I dont have time for this. Let me speak to a supervisor right now!', isAgent: false },
        { id: '12', speaker: 'Agent Michael', timestamp: '3:35', text: 'I understand you are frustrated sir. Let me see what I can do.', isAgent: true },
        { id: '13', speaker: 'Robert Patterson', timestamp: '3:45', text: 'You already verified my identity! Why cant you just unblock my card?', isAgent: false },
        { id: '14', speaker: 'Agent Michael', timestamp: '4:00', text: 'Fraud alerts require additional verification steps. I am following our security protocol.', isAgent: true },
        { id: '15', speaker: 'Robert Patterson', timestamp: '4:12', text: 'Get me a supervisor. Now. I will be filing a complaint about this experience.', isAgent: false }
      ]}
    },
    {
      id: `${agentId}-V002`, subject: 'Wire Transfer Failed - International Payment - Maria Santos', channel: 'Voice', sentiment: 'Negative', csat: 2, createdAt: 'Nov 27, 2025', status: 'Escalated',
      dominantTopic: 'Wire Transfer Issue', subtopics: ['International Transfer', 'Payment Failure', 'Fee Dispute', 'Urgent Transfer'],
      aiScores: { takeOwnership: 25, actWithEmpathy: 20, makeItEasy: 22, getItRight: 28 },
      aiSummary: ['Agent did not explain wire transfer requirements upfront when customer initiated transfer - proactive guidance needed', 'Failed to mention SWIFT code requirement causing transfer failure - critical information omission', 'Customer charged $45 fee despite failed transfer - should have offered immediate refund', 'No follow-up offered for refund process or expedited re-transfer - left customer without clear next steps', 'Did not acknowledge urgency of medical expense situation - empathy gap identified', 'Blamed website instead of taking ownership - deflection behavior detected', 'Recommended Training: International Wire Transfer Requirements, Fee Refund Authority, Empathetic Communication'],
      content: { type: 'Voice', transcript: [
        { id: '1', speaker: 'Maria Santos', timestamp: '0:00', text: 'Hello, I tried to send money to my family in Brazil but the transfer failed. I need help urgently!', isAgent: false },
        { id: '2', speaker: 'Agent Michael', timestamp: '0:12', text: 'Good afternoon. Let me check your recent transfer. Can I have your account number?', isAgent: true },
        { id: '3', speaker: 'Maria Santos', timestamp: '0:20', text: '****2891. I sent $2,000 to my mother for medical expenses. Its been 3 days and nothing arrived!', isAgent: false },
        { id: '4', speaker: 'Agent Michael', timestamp: '0:35', text: 'I see the transfer here. It was returned due to incorrect beneficiary bank details.', isAgent: true },
        { id: '5', speaker: 'Maria Santos', timestamp: '0:45', text: 'What? I put all the information correctly! Why wasnt I told about any problem?', isAgent: false },
        { id: '6', speaker: 'Agent Michael', timestamp: '1:00', text: 'The SWIFT code was missing from the transfer request.', isAgent: true },
        { id: '7', speaker: 'Maria Santos', timestamp: '1:08', text: 'Nobody told me I needed a SWIFT code! And I was charged $45 for this failed transfer!', isAgent: false },
        { id: '8', speaker: 'Agent Michael', timestamp: '1:20', text: 'SWIFT codes are required for international transfers. This information is on our website.', isAgent: true },
        { id: '9', speaker: 'Maria Santos', timestamp: '1:30', text: 'I want my fee refunded and I need this transfer to go through today. My mother needs this money!', isAgent: false },
        { id: '10', speaker: 'Agent Michael', timestamp: '1:45', text: 'For fee disputes, you would need to submit a request form. New transfers take 3-5 business days.', isAgent: true },
        { id: '11', speaker: 'Maria Santos', timestamp: '1:55', text: 'My mother is in the hospital! She cannot wait 5 days! Is there any faster option?', isAgent: false },
        { id: '12', speaker: 'Agent Michael', timestamp: '2:10', text: 'We do have expedited wire service for an additional $25 fee. It arrives in 24 hours.', isAgent: true },
        { id: '13', speaker: 'Maria Santos', timestamp: '2:20', text: 'So you want me to pay another $25 after charging me $45 for a failed transfer? This is robbery!', isAgent: false },
        { id: '14', speaker: 'Agent Michael', timestamp: '2:35', text: 'I understand your frustration. Those are our standard fees for international services.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-V003`, subject: 'Mortgage Payment Issue - Late Fee Dispute - James Wilson', channel: 'Voice', sentiment: 'Negative', csat: 1, createdAt: 'Nov 26, 2025', status: 'Escalated',
      dominantTopic: 'Mortgage Payment', subtopics: ['Late Fee', 'AutoPay Failure', 'Credit Report', 'Escalation Request'],
      aiScores: { takeOwnership: 18, actWithEmpathy: 15, makeItEasy: 20, getItRight: 22 },
      aiSummary: ['Agent showed no empathy for customer whose credit score dropped 80 points - significant financial impact ignored', 'Did not investigate autopay failure cause despite customer having 12-year history - system error likely', 'Refused to waive late fee despite evidence pointing to bank error - policy override available for system issues', 'Could not access checking account to verify balance - should have offered three-way call with checking department', 'Customer threatened to refinance with competitor - retention opportunity missed', 'Blamed customer implicitly by suggesting insufficient funds without evidence - defensive response', 'Did not escalate to supervisor when requested - delayed resolution', 'Recommended Training: Cross-Department Coordination, Credit Report Dispute Process, Customer Retention, Empathy in Financial Hardship'],
      content: { type: 'Voice', transcript: [
        { id: '1', speaker: 'James Wilson', timestamp: '0:00', text: 'I need to speak with someone about my mortgage. You reported me 30 days late but I have autopay!', isAgent: false },
        { id: '2', speaker: 'Agent Michael', timestamp: '0:15', text: 'Let me look at your mortgage account. Account number please?', isAgent: true },
        { id: '3', speaker: 'James Wilson', timestamp: '0:22', text: 'Loan number 78234561. My credit score dropped 80 points because of this! I have been a customer for 12 years!', isAgent: false },
        { id: '4', speaker: 'Agent Michael', timestamp: '0:40', text: 'I see your October payment was received on November 5th, which is past the grace period.', isAgent: true },
        { id: '5', speaker: 'James Wilson', timestamp: '0:50', text: 'But I have autopay! Check your system - something failed on your end!', isAgent: false },
        { id: '6', speaker: 'Agent Michael', timestamp: '1:05', text: 'Autopay shows as active. The payment may have been rejected due to insufficient funds.', isAgent: true },
        { id: '7', speaker: 'James Wilson', timestamp: '1:15', text: 'I had over $15,000 in that account! Check the balance history. This is YOUR system error!', isAgent: false },
        { id: '8', speaker: 'Agent Michael', timestamp: '1:30', text: 'Unfortunately I cannot access your checking account from here. You would need to contact that department.', isAgent: true },
        { id: '9', speaker: 'James Wilson', timestamp: '1:42', text: 'This is absolutely unacceptable. I want this late fee removed and my credit report corrected!', isAgent: false },
        { id: '10', speaker: 'Agent Michael', timestamp: '1:55', text: 'Late fee waivers require supervisor approval. I can submit a request but its not guaranteed.', isAgent: true },
        { id: '11', speaker: 'James Wilson', timestamp: '2:05', text: 'Get me a supervisor now. If this isnt fixed, I am refinancing with another bank!', isAgent: false },
        { id: '12', speaker: 'Agent Michael', timestamp: '2:18', text: 'All supervisors are currently busy. I can have one call you back within 24-48 hours.', isAgent: true },
        { id: '13', speaker: 'James Wilson', timestamp: '2:28', text: 'Are you kidding me? 24-48 hours? My credit is already damaged! I need this resolved TODAY!', isAgent: false },
        { id: '14', speaker: 'Agent Michael', timestamp: '2:42', text: 'I apologize sir, but that is our current wait time for supervisor callbacks.', isAgent: true },
        { id: '15', speaker: 'James Wilson', timestamp: '2:52', text: 'This is the worst customer service I have ever experienced. I will be contacting the CFPB about this.', isAgent: false }
      ]}
    },
    {
      id: `${agentId}-V004`, subject: 'Account Locked - Multiple Login Attempts - Jennifer Adams', channel: 'Voice', sentiment: 'Negative', csat: 2, createdAt: 'Nov 25, 2025', status: 'Pending',
      dominantTopic: 'Account Access', subtopics: ['Account Lock', 'Password Reset', 'Security Verification', 'Mobile Banking'],
      aiScores: { takeOwnership: 30, actWithEmpathy: 25, makeItEasy: 28, getItRight: 32 },
      aiSummary: ['Agent followed security protocol but lacked warmth in delivery - robotic tone detected', 'Verification process took 8+ minutes when target is 3 minutes - efficiency training needed', 'Did not offer temporary access solution such as phone banking for urgent bill payment', 'Customer unable to pay electricity bill due to lock - time-sensitive issue not prioritized', 'Should have offered to process bill payment on customers behalf as alternative', 'Enhanced verification questions were confusing to customer - clearer communication needed', 'Did not apologize for inconvenience caused by security lockout', 'Recommended Training: Efficient Identity Verification, Alternative Access Solutions, Time-Sensitive Request Handling'],
      content: { type: 'Voice', transcript: [
        { id: '1', speaker: 'Jennifer Adams', timestamp: '0:00', text: 'My online banking is locked and I have bills due today! I need access immediately!', isAgent: false },
        { id: '2', speaker: 'Agent Michael', timestamp: '0:12', text: 'I can help with that. For security, I need to verify your identity first.', isAgent: true },
        { id: '3', speaker: 'Jennifer Adams', timestamp: '0:20', text: 'Fine, but please hurry. My electricity bill is due by 5 PM or they will shut off service!', isAgent: false },
        { id: '4', speaker: 'Agent Michael', timestamp: '0:30', text: 'I understand. Can you provide your full name and date of birth?', isAgent: true },
        { id: '5', speaker: 'Jennifer Adams', timestamp: '0:38', text: 'Jennifer Adams, March 15, 1985. Account ending 3421.', isAgent: false },
        { id: '6', speaker: 'Agent Michael', timestamp: '0:50', text: 'Thank you. I also need you to verify the last 4 transactions on your account.', isAgent: true },
        { id: '7', speaker: 'Jennifer Adams', timestamp: '1:00', text: 'What? I dont remember all my transactions! Cant you just ask security questions?', isAgent: false },
        { id: '8', speaker: 'Agent Michael', timestamp: '1:12', text: 'This is our enhanced verification for locked accounts. Let me give you some hints from your statement.', isAgent: true },
        { id: '9', speaker: 'Jennifer Adams', timestamp: '1:25', text: 'Okay fine. What are the hints?', isAgent: false },
        { id: '10', speaker: 'Agent Michael', timestamp: '1:35', text: 'Your most recent transaction was at a grocery store for $127.43. Can you name the store?', isAgent: true },
        { id: '11', speaker: 'Jennifer Adams', timestamp: '1:48', text: 'Probably Whole Foods. I shop there every week.', isAgent: false },
        { id: '12', speaker: 'Agent Michael', timestamp: '2:00', text: 'That is correct. Now I need you to verify two more transactions.', isAgent: true },
        { id: '13', speaker: 'Jennifer Adams', timestamp: '2:10', text: 'How much longer is this going to take? Its already 4:15 PM!', isAgent: false },
        { id: '14', speaker: 'Agent Michael', timestamp: '2:22', text: 'I understand the urgency. The second transaction was a subscription payment for $14.99.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-V005`, subject: 'Credit Card Dispute - Recurring Charge - Thomas Brown', channel: 'Voice', sentiment: 'Negative', csat: 2, createdAt: 'Nov 24, 2025', status: 'Resolved',
      dominantTopic: 'Credit Card Dispute', subtopics: ['Recurring Charge', 'Subscription Cancel', 'Chargeback', 'Merchant Dispute'],
      aiScores: { takeOwnership: 35, actWithEmpathy: 30, makeItEasy: 32, getItRight: 38 },
      aiSummary: ['Agent processed dispute but did not block future charges from same merchant - recurring issue will continue', 'Should have offered card replacement to prevent future unauthorized recurring charges', 'Did not explain 60-day dispute timeline clearly - customer expected full refund', 'Customer lost $200+ due to policy limitation - should have escalated for exception review', 'Did not investigate why charges bypassed fraud detection for 6 months', 'No merchant contact attempted to cancel subscription on customers behalf', 'Should have offered to add merchant to block list', 'Recommended Training: Recurring Charge Dispute Resolution, Card Replacement Protocol, Merchant Block List Procedures'],
      content: { type: 'Voice', transcript: [
        { id: '1', speaker: 'Thomas Brown', timestamp: '0:00', text: 'I have been charged $49.99 every month from some company I never signed up for. This has been going on for 6 months!', isAgent: false },
        { id: '2', speaker: 'Agent Michael', timestamp: '0:15', text: 'I am sorry to hear that. Let me review your account and recent charges.', isAgent: true },
        { id: '3', speaker: 'Thomas Brown', timestamp: '0:25', text: 'The company is called "Premium Plus Services". I have no idea what it is!', isAgent: false },
        { id: '4', speaker: 'Agent Michael', timestamp: '0:38', text: 'I see 6 charges of $49.99 from that merchant. I can dispute up to 60 days of charges.', isAgent: true },
        { id: '5', speaker: 'Thomas Brown', timestamp: '0:50', text: 'Only 60 days? But they took almost $300 from me over 6 months!', isAgent: false },
        { id: '6', speaker: 'Agent Michael', timestamp: '1:02', text: 'Unfortunately, our dispute policy limits claims to 60 days. I can file for the last 2 charges.', isAgent: true },
        { id: '7', speaker: 'Thomas Brown', timestamp: '1:15', text: 'That is only $100 back! What about the other $200 they stole from me?', isAgent: false },
        { id: '8', speaker: 'Agent Michael', timestamp: '1:28', text: 'You may want to contact the merchant directly to request a refund for older charges.', isAgent: true },
        { id: '9', speaker: 'Thomas Brown', timestamp: '1:40', text: 'I tried! Their phone number goes to a recording that says mailbox full. Its a scam company!', isAgent: false },
        { id: '10', speaker: 'Agent Michael', timestamp: '1:55', text: 'I understand. I will file the dispute for the 2 most recent charges. This takes 7-10 business days.', isAgent: true },
        { id: '11', speaker: 'Thomas Brown', timestamp: '2:08', text: 'What about next month? Will they charge me again?', isAgent: false },
        { id: '12', speaker: 'Agent Michael', timestamp: '2:20', text: 'The dispute does not automatically block future charges. You would need to monitor your statement.', isAgent: true },
        { id: '13', speaker: 'Thomas Brown', timestamp: '2:32', text: 'So I have to keep calling every month? This is ridiculous! Can you block them?', isAgent: false },
        { id: '14', speaker: 'Agent Michael', timestamp: '2:45', text: 'We do not have a merchant block feature. You could request a new card number to stop the charges.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-V006`, subject: 'Overdraft Fee Dispute - Direct Deposit Delay - Karen Mitchell', channel: 'Voice', sentiment: 'Negative', csat: 1, createdAt: 'Nov 23, 2025', status: 'Escalated',
      dominantTopic: 'Overdraft Fee', subtopics: ['Direct Deposit', 'Payroll Delay', 'NSF Fee', 'Account Balance'],
      aiScores: { takeOwnership: 20, actWithEmpathy: 18, makeItEasy: 22, getItRight: 25 },
      aiSummary: ['Agent blamed employer for deposit delay without investigating banks processing timeline', 'No empathy shown for customer living paycheck to paycheck - financial stress indicators ignored', 'Refused fee waiver despite 5-year account history with no prior issues - loyalty not recognized', 'Should have explained overdraft protection options to prevent future occurrences', 'Did not compare deposit processing times between banks when customer mentioned coworker', 'Policy of one waiver per 12 months applied rigidly without exception consideration', 'Customer mentioned financial hardship but agent did not offer hardship program information', 'No offer to escalate or seek supervisor exception for loyal customer', 'Recommended Training: Overdraft Fee Discretion, Customer Loyalty Recognition, Financial Hardship Sensitivity, Deposit Processing Explanation'],
      content: { type: 'Voice', transcript: [
        { id: '1', speaker: 'Karen Mitchell', timestamp: '0:00', text: 'I was charged $35 overdraft fee but my paycheck should have been deposited Friday!', isAgent: false },
        { id: '2', speaker: 'Agent Michael', timestamp: '0:12', text: 'Let me check your account. I see the overdraft occurred on Friday evening.', isAgent: true },
        { id: '3', speaker: 'Karen Mitchell', timestamp: '0:22', text: 'My employer sends direct deposit every Friday. Your bank delayed it!', isAgent: false },
        { id: '4', speaker: 'Agent Michael', timestamp: '0:35', text: 'The deposit arrived Monday morning. The timing depends on when your employer initiates it.', isAgent: true },
        { id: '5', speaker: 'Karen Mitchell', timestamp: '0:45', text: 'My coworker uses a different bank and she got paid Friday! This is your fault!', isAgent: false },
        { id: '6', speaker: 'Agent Michael', timestamp: '1:00', text: 'Different banks have different processing times. We process deposits as they arrive.', isAgent: true },
        { id: '7', speaker: 'Karen Mitchell', timestamp: '1:12', text: 'I have been with this bank for 5 years and never had issues. Can you waive this fee?', isAgent: false },
        { id: '8', speaker: 'Agent Michael', timestamp: '1:25', text: 'I see you had a fee waiver in January. Our policy is one waiver per 12 months.', isAgent: true },
        { id: '9', speaker: 'Karen Mitchell', timestamp: '1:38', text: 'That was for something completely different! This is clearly a bank processing issue!', isAgent: false },
        { id: '10', speaker: 'Agent Michael', timestamp: '1:52', text: 'I understand but our system shows the fee was correctly applied based on your account balance.', isAgent: true },
        { id: '11', speaker: 'Karen Mitchell', timestamp: '2:05', text: 'I live paycheck to paycheck. This $35 means I cannot afford groceries this week!', isAgent: false },
        { id: '12', speaker: 'Agent Michael', timestamp: '2:18', text: 'I apologize for the inconvenience but I am not able to waive the fee based on our policy.', isAgent: true },
        { id: '13', speaker: 'Karen Mitchell', timestamp: '2:30', text: 'So you dont care that I cant feed my kids because of your slow processing?', isAgent: false },
        { id: '14', speaker: 'Agent Michael', timestamp: '2:45', text: 'I suggest setting up overdraft protection to prevent this in the future. Would you like information about that?', isAgent: true }
      ]}
    }
  ];

  // Original hardcoded cases for other channels
  const emailCases: AgentCase[] = [
    {
      id: `${agentId}-E001`, subject: 'Dispute on Unauthorized Debit Card Transaction - $847.50 (John Morrison)', channel: 'Email', sentiment: 'Negative', csat: 2, createdAt: 'Dec 15, 2024', status: 'Escalated',
      dominantTopic: 'Transaction Dispute', subtopics: ['Unauthorized Charge', 'Debit Card Fraud', 'Refund Request', 'Account Security'],
      aiScores: { takeOwnership: 28, actWithEmpathy: 22, makeItEasy: 25, getItRight: 32 },
      aiSummary: ['Agent failed to acknowledge customer frustration about unauthorized charge - no empathy statement in response', 'Did not offer provisional credit as per bank policy for fraud claims over $500', 'Should have escalated to fraud department within first response per protocol', 'Missing proper documentation of dispute details - no case number provided', 'Response time was 5+ hours for urgent fraud matter - SLA is 2 hours', 'Did not offer to block card to prevent further fraud', 'Recommended Training: Fraud Claim Processing, Provisional Credit Authority, Urgent Response Protocol'],
      content: { type: 'Email', messages: [
        { id: '1', from: 'john.morrison@email.com', to: 'support@bofa.com', timestamp: 'Dec 15, 2024 9:23 AM', subject: 'URGENT: Unauthorized Transaction on My Account', body: 'I noticed a charge of $847.50 from "ELECTRONICS OUTLET" on my debit card that I did not make. I was at work during this time and have my card with me. This is clearly fraud and I need this resolved immediately. My account number ends in 4523.', isAgent: false, sender: 'John Morrison' },
        { id: '2', from: 'support@bofa.com', to: 'john.morrison@email.com', timestamp: 'Dec 15, 2024 2:45 PM', subject: 'RE: URGENT: Unauthorized Transaction on My Account', body: 'Thank you for contacting Bank of America. I can see the transaction you mentioned. Please fill out our dispute form and mail it to our processing center. This process takes 7-10 business days.', isAgent: true, sender: 'Support Agent - Sarah Bennett' },
        { id: '3', from: 'john.morrison@email.com', to: 'support@bofa.com', timestamp: 'Dec 15, 2024 3:12 PM', subject: 'RE: URGENT: Unauthorized Transaction on My Account', body: 'This is unacceptable! I am a victim of fraud and you want me to wait 10 days? I need my money back NOW. This is my rent money! Can someone actually help me or do I need to close my account?', isAgent: false, sender: 'John Morrison' },
        { id: '4', from: 'support@bofa.com', to: 'john.morrison@email.com', timestamp: 'Dec 15, 2024 4:30 PM', subject: 'RE: URGENT: Unauthorized Transaction on My Account', body: 'I understand. Our policy requires the dispute form. I have attached the form to this email. Please complete and return at your earliest convenience.', isAgent: true, sender: 'Support Agent - Sarah Bennett' },
        { id: '5', from: 'john.morrison@email.com', to: 'support@bofa.com', timestamp: 'Dec 15, 2024 5:00 PM', subject: 'RE: URGENT: Unauthorized Transaction on My Account', body: 'I have been a customer for 8 years and this is how you treat fraud victims? I want to speak with a manager. Also, is my card still active? What if they charge more?', isAgent: false, sender: 'John Morrison' },
        { id: '6', from: 'support@bofa.com', to: 'john.morrison@email.com', timestamp: 'Dec 16, 2024 9:15 AM', subject: 'RE: URGENT: Unauthorized Transaction on My Account', body: 'Good morning Mr. Morrison. I have escalated your case to our fraud department. They will contact you within 48 hours. Your card remains active unless you request otherwise.', isAgent: true, sender: 'Support Agent - Sarah Bennett' }
      ]}
    },
    {
      id: `${agentId}-E002`, subject: 'Monthly Maintenance Fee Waiver Request - Mary Smith', channel: 'Email', sentiment: 'Negative', csat: 3, createdAt: 'Dec 14, 2024', status: 'Resolved',
      dominantTopic: 'Fee Dispute', subtopics: ['Maintenance Fee', 'Preferred Rewards', 'Account Tier', 'Fee Waiver Policy'],
      aiScores: { takeOwnership: 35, actWithEmpathy: 32, makeItEasy: 38, getItRight: 40 },
      aiSummary: ['Agent could have proactively offered fee refund for Preferred Rewards Gold member - policy allows courtesy refund', 'Missed opportunity to explain tier benefits and how to avoid future fees', 'Should have verified combined balance across all accounts to confirm eligibility', 'Response time exceeded 4-hour SLA for premium Preferred Rewards customers', 'Did not apologize for the inconvenience caused', 'Recommended Training: Preferred Rewards Program Benefits, Fee Waiver Authority, Premium Customer SLA'],
      content: { type: 'Email', messages: [
        { id: '1', from: 'mary.smith@email.com', to: 'support@bofa.com', timestamp: 'Dec 14, 2024 10:15 AM', subject: 'Why am I being charged maintenance fee?', body: 'I have been a Preferred Rewards Gold member for 3 years. My account always has over $50,000 combined balance. Why was I charged a $25 monthly maintenance fee this month? Please refund this immediately.', isAgent: false, sender: 'Mary Smith' },
        { id: '2', from: 'support@bofa.com', to: 'mary.smith@email.com', timestamp: 'Dec 14, 2024 3:42 PM', subject: 'RE: Why am I being charged maintenance fee?', body: 'Hello Mary, I reviewed your account. It appears your balance dropped below the minimum threshold briefly on the 3rd of this month. The fee was correctly applied per our terms.', isAgent: true, sender: 'Support Agent - James Morrison' },
        { id: '3', from: 'mary.smith@email.com', to: 'support@bofa.com', timestamp: 'Dec 14, 2024 4:00 PM', subject: 'RE: Why am I being charged maintenance fee?', body: 'That is impossible. I had a large deposit clear on the 2nd. Please check again. My combined balance has never dropped below $50,000 in 3 years. This must be an error.', isAgent: false, sender: 'Mary Smith' },
        { id: '4', from: 'support@bofa.com', to: 'mary.smith@email.com', timestamp: 'Dec 14, 2024 5:30 PM', subject: 'RE: Why am I being charged maintenance fee?', body: 'Upon further review, I see the deposit was held for verification until the 4th. However, as a one-time courtesy for a valued customer, I have refunded the $25 fee to your account.', isAgent: true, sender: 'Support Agent - James Morrison' },
        { id: '5', from: 'mary.smith@email.com', to: 'support@bofa.com', timestamp: 'Dec 14, 2024 5:45 PM', subject: 'RE: Why am I being charged maintenance fee?', body: 'Thank you for the refund. However, I was not informed about any hold on my deposit. How do I avoid this happening again? I need clear communication about holds that affect my account status.', isAgent: false, sender: 'Mary Smith' },
        { id: '6', from: 'support@bofa.com', to: 'mary.smith@email.com', timestamp: 'Dec 15, 2024 10:00 AM', subject: 'RE: Why am I being charged maintenance fee?', body: 'Deposit holds are disclosed in our funds availability policy. You can set up alerts in online banking to monitor your balance. Is there anything else I can assist with?', isAgent: true, sender: 'Support Agent - James Morrison' }
      ]}
    },
    {
      id: `${agentId}-E003`, subject: 'Account Statement Error - Missing Transactions - Linda Garcia', channel: 'Email', sentiment: 'Negative', csat: 2, createdAt: 'Dec 13, 2024', status: 'Pending',
      dominantTopic: 'Statement Issue', subtopics: ['Missing Transactions', 'Account Reconciliation', 'Statement Request', 'Transaction History'],
      aiScores: { takeOwnership: 30, actWithEmpathy: 28, makeItEasy: 25, getItRight: 35 },
      aiSummary: ['Agent did not investigate statement discrepancy thoroughly - dismissed as pending transactions', 'Should have offered to resend corrected statement or provide transaction history report', 'Missing follow-up on transaction investigation - no case opened', 'Customer left without clear resolution timeline', 'Did not ask for receipt copies to verify missing transactions', 'Recommended Training: Statement Reconciliation Process, Transaction Investigation Procedures'],
      content: { type: 'Email', messages: [
        { id: '1', from: 'linda.garcia@email.com', to: 'support@bofa.com', timestamp: 'Dec 13, 2024 11:00 AM', subject: 'Missing Transactions on My November Statement', body: 'I received my November statement and several transactions are missing. I made at least 5 purchases at Target between Nov 15-20 but only 2 appear on my statement. This is affecting my bookkeeping. Account: ***8834', isAgent: false, sender: 'Linda Garcia' },
        { id: '2', from: 'support@bofa.com', to: 'linda.garcia@email.com', timestamp: 'Dec 13, 2024 4:20 PM', subject: 'RE: Missing Transactions on My November Statement', body: 'Thank you for reaching out. Transactions may take 2-3 business days to post. Please check your online banking for pending transactions. If you still see discrepancies, please reply with specific transaction details.', isAgent: true, sender: 'Support Agent' },
        { id: '3', from: 'linda.garcia@email.com', to: 'support@bofa.com', timestamp: 'Dec 13, 2024 5:15 PM', subject: 'RE: Missing Transactions on My November Statement', body: 'These transactions are from over 3 weeks ago, not pending! I have Target receipts showing the exact amounts: $45.67 on Nov 16, $89.23 on Nov 17, and $156.78 on Nov 19. Why would they disappear from my account?', isAgent: false, sender: 'Linda Garcia' },
        { id: '4', from: 'support@bofa.com', to: 'linda.garcia@email.com', timestamp: 'Dec 14, 2024 11:00 AM', subject: 'RE: Missing Transactions on My November Statement', body: 'I apologize for the confusion. I have reviewed your account and see only 2 Target transactions in November. Can you please send copies of the receipts so we can investigate further?', isAgent: true, sender: 'Support Agent' },
        { id: '5', from: 'linda.garcia@email.com', to: 'support@bofa.com', timestamp: 'Dec 14, 2024 2:30 PM', subject: 'RE: Missing Transactions on My November Statement', body: 'Attached are photos of all 5 receipts. You can clearly see my card ending in 8834 was used. If these transactions are missing from my account, where did the money go? This is very concerning.', isAgent: false, sender: 'Linda Garcia' },
        { id: '6', from: 'support@bofa.com', to: 'linda.garcia@email.com', timestamp: 'Dec 15, 2024 9:00 AM', subject: 'RE: Missing Transactions on My November Statement', body: 'Thank you for providing the receipts. I have escalated this to our investigations team. Please allow 5-7 business days for a response. We will contact you with our findings.', isAgent: true, sender: 'Support Agent' }
      ]}
    },
    {
      id: `${agentId}-E004`, subject: 'Savings Account Interest Rate Inquiry - Robert Chen', channel: 'Email', sentiment: 'Neutral', csat: 3, createdAt: 'Dec 12, 2024', status: 'Resolved',
      dominantTopic: 'Interest Rate', subtopics: ['Savings Account', 'Rate Comparison', 'Account Upgrade', 'Competitive Rates'],
      aiScores: { takeOwnership: 42, actWithEmpathy: 38, makeItEasy: 40, getItRight: 45 },
      aiSummary: ['Agent provided accurate rate information but missed upsell opportunity to high-yield savings', 'Could have offered CD options with higher rates', 'Did not mention rate lock or promotional offers available', 'Response was accurate but lacked proactive suggestions to retain customer considering competitor', 'No mention of relationship benefits that could offset lower rate', 'Recommended Training: Product Knowledge - Savings Options, Customer Retention Strategies'],
      content: { type: 'Email', messages: [
        { id: '1', from: 'robert.chen@email.com', to: 'support@bofa.com', timestamp: 'Dec 12, 2024 2:30 PM', subject: 'Current Savings Account Interest Rate', body: 'What is the current interest rate on my savings account? I noticed other banks are offering 4.5% APY and want to compare before considering a switch.', isAgent: false, sender: 'Robert Chen' },
        { id: '2', from: 'support@bofa.com', to: 'robert.chen@email.com', timestamp: 'Dec 12, 2024 5:45 PM', subject: 'RE: Current Savings Account Interest Rate', body: 'Hello Robert, Your current savings account has a 0.01% APY. This is our standard savings rate. Thank you for being a valued customer.', isAgent: true, sender: 'Support Agent' },
        { id: '3', from: 'robert.chen@email.com', to: 'support@bofa.com', timestamp: 'Dec 12, 2024 6:15 PM', subject: 'RE: Current Savings Account Interest Rate', body: 'Only 0.01%? That is 450 times less than what competitors offer! I have $75,000 in savings. Do you have any higher yield options or should I move my money elsewhere?', isAgent: false, sender: 'Robert Chen' },
        { id: '4', from: 'support@bofa.com', to: 'robert.chen@email.com', timestamp: 'Dec 13, 2024 10:30 AM', subject: 'RE: Current Savings Account Interest Rate', body: 'We do offer CDs with rates up to 4.0% APY for 12-month terms. However, funds must remain locked for the full term. Would you like more information about our CD options?', isAgent: true, sender: 'Support Agent' },
        { id: '5', from: 'robert.chen@email.com', to: 'support@bofa.com', timestamp: 'Dec 13, 2024 11:00 AM', subject: 'RE: Current Savings Account Interest Rate', body: 'I need liquidity so CDs wont work. Is there really no competitive savings option? I have been a customer for 10 years and feel like I am being taken for granted.', isAgent: false, sender: 'Robert Chen' },
        { id: '6', from: 'support@bofa.com', to: 'robert.chen@email.com', timestamp: 'Dec 13, 2024 3:00 PM', subject: 'RE: Current Savings Account Interest Rate', body: 'I understand your concerns. Unfortunately, our standard savings rate is set by market conditions. I can connect you with a financial advisor to discuss investment options that may provide better returns. Would you like me to schedule an appointment?', isAgent: true, sender: 'Support Agent' }
      ]}
    },
    {
      id: `${agentId}-E005`, subject: 'Zelle Transfer Limit Increase Request - Amanda Foster', channel: 'Email', sentiment: 'Negative', csat: 2, createdAt: 'Dec 11, 2024', status: 'Escalated',
      dominantTopic: 'Transfer Limits', subtopics: ['Zelle', 'Daily Limit', 'Account Upgrade', 'Urgent Transfer'],
      aiScores: { takeOwnership: 25, actWithEmpathy: 22, makeItEasy: 28, getItRight: 30 },
      aiSummary: ['Agent did not explain limit increase process clearly - customer left confused', 'Missed opportunity to offer temporary limit exception for verified emergency', 'Should have provided alternative transfer methods such as wire or ACH', 'Customer missed time-sensitive contractor payment due to limit', 'Did not escalate despite urgent nature of request', 'No offer to call customer to resolve faster', 'Recommended Training: Zelle Limit Policies, Alternative Payment Methods, Urgent Request Escalation'],
      content: { type: 'Email', messages: [
        { id: '1', from: 'amanda.foster@email.com', to: 'support@bofa.com', timestamp: 'Dec 11, 2024 9:00 AM', subject: 'URGENT - Need Higher Zelle Limit Today', body: 'I need to send $3,000 via Zelle today but my limit is only $2,000. I am paying a contractor for emergency home repairs after a pipe burst. Can you increase my limit immediately?', isAgent: false, sender: 'Amanda Foster' },
        { id: '2', from: 'support@bofa.com', to: 'amanda.foster@email.com', timestamp: 'Dec 11, 2024 2:30 PM', subject: 'RE: URGENT - Need Higher Zelle Limit Today', body: 'Thank you for contacting us. Zelle limits are set based on account history and cannot be changed immediately. You may qualify for higher limits after 6 months of consistent usage.', isAgent: true, sender: 'Support Agent' },
        { id: '3', from: 'amanda.foster@email.com', to: 'support@bofa.com', timestamp: 'Dec 11, 2024 2:45 PM', subject: 'RE: URGENT - Need Higher Zelle Limit Today', body: 'I have had this account for 5 YEARS! This is an emergency - my basement is flooded and the contractor needs payment today or he will leave. Is there any other way to send $3,000 quickly?', isAgent: false, sender: 'Amanda Foster' },
        { id: '4', from: 'support@bofa.com', to: 'amanda.foster@email.com', timestamp: 'Dec 11, 2024 4:00 PM', subject: 'RE: URGENT - Need Higher Zelle Limit Today', body: 'I apologize but Zelle limits are system-controlled. You could send $2,000 today and the remaining $1,000 tomorrow. Alternatively, you can visit a branch for a cashiers check.', isAgent: true, sender: 'Support Agent' },
        { id: '5', from: 'amanda.foster@email.com', to: 'support@bofa.com', timestamp: 'Dec 11, 2024 4:30 PM', subject: 'RE: URGENT - Need Higher Zelle Limit Today', body: 'The contractor does not take checks and I cannot leave my flooded house! By tomorrow it will be too late. The damage is getting worse by the hour. Please escalate this!', isAgent: false, sender: 'Amanda Foster' },
        { id: '6', from: 'support@bofa.com', to: 'amanda.foster@email.com', timestamp: 'Dec 11, 2024 5:15 PM', subject: 'RE: URGENT - Need Higher Zelle Limit Today', body: 'I have noted your feedback. Unfortunately, I cannot override the system limits. You may want to consider using a different payment app like Venmo or PayPal which have different limits. I apologize for any inconvenience.', isAgent: true, sender: 'Support Agent' }
      ]}
    }
  ];

  const chatCases: AgentCase[] = [
    {
      id: `${agentId}-C001`, subject: 'Mobile App Login Issues - David Chen', channel: 'Chat', sentiment: 'Negative', csat: 2, createdAt: 'Dec 15, 2024', status: 'Escalated',
      dominantTopic: 'Account Access', subtopics: ['Mobile App', 'Login Failure', 'Password Reset', 'Two-Factor Authentication'],
      aiScores: { takeOwnership: 25, actWithEmpathy: 20, makeItEasy: 28, getItRight: 30 },
      aiSummary: ['Agent used robotic language instead of empathetic responses - no acknowledgment of frustration', 'Did not offer callback option for extended troubleshooting when chat became complex', 'Should have verified identity through alternative methods such as security questions or email verification', 'Missed opportunity to educate on Erica virtual assistant for faster self-service', 'Branch visit suggestion not practical for traveling customer - alternative solutions not explored', 'No escalation offered when customer expressed frustration', 'Recommended Training: Empathetic Communication, Alternative Verification Methods, International Customer Support'],
      content: { type: 'Chat', messages: [
        { id: '1', sender: 'David Chen', timestamp: '10:23 AM', message: 'Hi, I cannot login to my mobile banking app. It keeps saying "Authentication Failed" even though my password is correct!', isAgent: false },
        { id: '2', sender: 'Bank Agent Sarah', timestamp: '10:24 AM', message: 'Hello David. Please try resetting your password through the forgot password link.', isAgent: true },
        { id: '3', sender: 'David Chen', timestamp: '10:25 AM', message: 'I already tried that 3 times! It sends a code to my old phone number which I dont have anymore.', isAgent: false },
        { id: '4', sender: 'Bank Agent Sarah', timestamp: '10:27 AM', message: 'You will need to visit a branch with ID to update your phone number.', isAgent: true },
        { id: '5', sender: 'David Chen', timestamp: '10:28 AM', message: 'I am traveling abroad! That is not possible. Is there any other way?', isAgent: false },
        { id: '6', sender: 'Bank Agent Sarah', timestamp: '10:30 AM', message: 'Unfortunately that is our only option for phone number changes. Is there anything else I can help with?', isAgent: true },
        { id: '7', sender: 'David Chen', timestamp: '10:31 AM', message: 'You are not helping at all! I cannot access my money in a foreign country. This is an emergency!', isAgent: false },
        { id: '8', sender: 'Bank Agent Sarah', timestamp: '10:33 AM', message: 'I understand this is frustrating. You may be able to use phone banking if you remember your PIN.', isAgent: true },
        { id: '9', sender: 'David Chen', timestamp: '10:34 AM', message: 'What phone banking number? And will it work internationally?', isAgent: false },
        { id: '10', sender: 'Bank Agent Sarah', timestamp: '10:36 AM', message: 'The number is 1-800-432-1000. International calls may have charges. You will need your card and PIN ready.', isAgent: true },
        { id: '11', sender: 'David Chen', timestamp: '10:37 AM', message: 'I just tried calling. It says my account is locked due to too many failed attempts! Now what?', isAgent: false },
        { id: '12', sender: 'Bank Agent Sarah', timestamp: '10:39 AM', message: 'For locked accounts, you will need to verify your identity. Can you provide your SSN and date of birth?', isAgent: true },
        { id: '13', sender: 'David Chen', timestamp: '10:40 AM', message: 'SSN is ***-**-4567, DOB is March 15, 1988. Please unlock my account immediately!', isAgent: false },
        { id: '14', sender: 'Bank Agent Sarah', timestamp: '10:42 AM', message: 'I have verified your identity. However, I cannot unlock mobile banking from here. You will still need to visit a branch.', isAgent: true },
        { id: '15', sender: 'David Chen', timestamp: '10:43 AM', message: 'This is absolutely ridiculous. I want to speak with a supervisor right now!', isAgent: false }
      ]}
    },
    {
      id: `${agentId}-C002`, subject: 'Wire Transfer Issue - Incorrect Fee Information - Angela Rodriguez', channel: 'Chat', sentiment: 'Negative', csat: 2, createdAt: 'Dec 15, 2024', status: 'Escalated',
      dominantTopic: 'Wire Transfer Issue', subtopics: ['Incorrect Fees', 'Hidden Charges', 'Poor Guidance', 'Customer Confusion'],
      aiScores: { takeOwnership: 30, actWithEmpathy: 28, makeItEasy: 32, getItRight: 35 },
      aiSummary: ['Agent provided incomplete fee information causing customer frustration - only mentioned bank fee, not total cost', 'Failed to mention conversion rates and intermediary bank charges upfront - critical omission', 'Should have offered fee comparison with other transfer methods like Zelle or Western Union', 'Customer was overcharged due to agent not explaining all costs clearly - financial impact on customer', 'Blamed customer for not asking about fees - defensive response', 'Did not offer refund or compensation for misinformation', 'Recommended Training: International Wire Transfer Fee Structure, Full Cost Disclosure Requirements, Service Recovery'],
      content: { type: 'Chat', messages: [
        { id: '1', sender: 'Angela Rodriguez', timestamp: '2:15 PM', message: 'Hi there! I want to send a wire transfer to my family in Mexico. What is my daily limit and total fees?', isAgent: false },
        { id: '2', sender: 'Bank Agent Marcus', timestamp: '2:16 PM', message: 'Hello Angela! Your daily wire limit is $50,000 for international transfers. The fee is just $20.', isAgent: true },
        { id: '3', sender: 'Angela Rodriguez', timestamp: '2:17 PM', message: 'Great! That sounds reasonable. I will send $5,000 right now. Thank you!', isAgent: false },
        { id: '4', sender: 'Bank Agent Marcus', timestamp: '2:18 PM', message: 'Happy to help! Let me know if you need assistance with the transfer.', isAgent: true },
        { id: '5', sender: 'Angela Rodriguez', timestamp: '2:45 PM', message: 'Hi, I am back. I sent the $5,000 but my family only received $4,850. Where did $150 go?', isAgent: false },
        { id: '6', sender: 'Bank Agent Marcus', timestamp: '2:47 PM', message: 'Let me check the transfer details. One moment please.', isAgent: true },
        { id: '7', sender: 'Angela Rodriguez', timestamp: '2:50 PM', message: 'Its been 3 minutes. What is going on?', isAgent: false },
        { id: '8', sender: 'Bank Agent Marcus', timestamp: '2:51 PM', message: 'I see the transfer here. The $150 would be the intermediary bank charges and currency conversion fees.', isAgent: true },
        { id: '9', sender: 'Angela Rodriguez', timestamp: '2:52 PM', message: 'What?! You told me the fee was $20! Why didnt you mention these other charges?', isAgent: false },
        { id: '10', sender: 'Bank Agent Marcus', timestamp: '2:54 PM', message: 'The $20 is our bank fee. Intermediary banks and exchange rates are separate. You should have asked about those specifically.', isAgent: true },
        { id: '11', sender: 'Angela Rodriguez', timestamp: '2:55 PM', message: 'How would I know to ask about hidden fees? I asked for TOTAL fees! This is false advertising!', isAgent: false },
        { id: '12', sender: 'Bank Agent Marcus', timestamp: '2:57 PM', message: 'I apologize for the confusion. These fees are disclosed in our wire transfer agreement that you signed.', isAgent: true },
        { id: '13', sender: 'Angela Rodriguez', timestamp: '2:58 PM', message: 'Nobody reads those 50 page documents! I trusted you when you said $20. Can I get a refund of the extra fees?', isAgent: false },
        { id: '14', sender: 'Bank Agent Marcus', timestamp: '3:00 PM', message: 'Unfortunately, intermediary bank fees are outside our control. I can only refund our $20 fee as a one-time courtesy.', isAgent: true },
        { id: '15', sender: 'Angela Rodriguez', timestamp: '3:01 PM', message: 'I want to escalate this. I was misled and I want all my fees back. Get me a supervisor!', isAgent: false }
      ]}
    },
    {
      id: `${agentId}-C003`, subject: 'Credit Card Activation Failed - New Card - Peter Kim', channel: 'Chat', sentiment: 'Negative', csat: 2, createdAt: 'Dec 14, 2024', status: 'Pending',
      dominantTopic: 'Card Activation', subtopics: ['New Card', 'Activation Failure', 'System Error', 'Urgent Purchase'],
      aiScores: { takeOwnership: 28, actWithEmpathy: 25, makeItEasy: 30, getItRight: 32 },
      aiSummary: ['Agent did not troubleshoot activation issue thoroughly - standard troubleshooting skipped', 'Should have offered manual activation over phone immediately', 'Did not escalate system error to technical team for investigation', 'Customer unable to make planned flight booking - time-sensitive issue not prioritized', 'No offer to expedite resolution or provide alternative solution', 'Should have checked for known system outages before suggesting to try again later', 'Recommended Training: Card Activation Troubleshooting, System Outage Protocol, Urgent Request Handling'],
      content: { type: 'Chat', messages: [
        { id: '1', sender: 'Peter Kim', timestamp: '3:45 PM', message: 'I received my new credit card yesterday but I cannot activate it online. It keeps giving me an error.', isAgent: false },
        { id: '2', sender: 'Bank Agent Lisa', timestamp: '3:46 PM', message: 'Hello Peter. Can you describe the error message you are seeing?', isAgent: true },
        { id: '3', sender: 'Peter Kim', timestamp: '3:48 PM', message: 'It says "Unable to process request at this time. Try again later." I have tried 10 times in the last 24 hours!', isAgent: false },
        { id: '4', sender: 'Bank Agent Lisa', timestamp: '3:50 PM', message: 'I apologize for the inconvenience. Our system may be experiencing issues. Please try again in a few hours.', isAgent: true },
        { id: '5', sender: 'Peter Kim', timestamp: '3:52 PM', message: 'A few hours? I need this card to book a flight tonight for a family emergency! Is there any other way to activate it?', isAgent: false },
        { id: '6', sender: 'Bank Agent Lisa', timestamp: '3:54 PM', message: 'You can also call the activation number on the sticker on the card. That may work if online is not available.', isAgent: true },
        { id: '7', sender: 'Peter Kim', timestamp: '3:55 PM', message: 'I already tried that! It just puts me on hold for 30 minutes then disconnects. Can YOU activate it?', isAgent: false },
        { id: '8', sender: 'Bank Agent Lisa', timestamp: '3:57 PM', message: 'Let me check if I can activate it from my system. Can you provide the last 4 digits of the card number?', isAgent: true },
        { id: '9', sender: 'Peter Kim', timestamp: '3:58 PM', message: '7823. Please hurry, the flight price keeps going up!', isAgent: false },
        { id: '10', sender: 'Bank Agent Lisa', timestamp: '4:00 PM', message: 'I see your card here but I am getting the same error on my end. There seems to be a technical issue.', isAgent: true },
        { id: '11', sender: 'Peter Kim', timestamp: '4:01 PM', message: 'So what am I supposed to do? Just wait and miss my flight? This is unacceptable!', isAgent: false },
        { id: '12', sender: 'Bank Agent Lisa', timestamp: '4:03 PM', message: 'I have submitted a ticket to our technical team. They typically respond within 24-48 hours.', isAgent: true },
        { id: '13', sender: 'Peter Kim', timestamp: '4:04 PM', message: '48 HOURS?! My father is in the hospital and I need to fly home tonight! Can you escalate this NOW?', isAgent: false },
        { id: '14', sender: 'Bank Agent Lisa', timestamp: '4:06 PM', message: 'I understand this is urgent. Let me try to reach a supervisor to see if we can expedite the resolution.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-C004`, subject: 'Bill Pay Not Working - Utility Payment - Susan Miller', channel: 'Chat', sentiment: 'Negative', csat: 2, createdAt: 'Dec 13, 2024', status: 'Resolved',
      dominantTopic: 'Bill Pay', subtopics: ['Utility Payment', 'Scheduled Payment', 'Payment Failure', 'Late Fee Concern'],
      aiScores: { takeOwnership: 32, actWithEmpathy: 28, makeItEasy: 35, getItRight: 38 },
      aiSummary: ['Agent resolved issue but took too long to identify root cause - 10+ messages before resolution', 'Should have checked payee details earlier in conversation instead of asking customer to investigate', 'Did not proactively offer to cover late fees incurred due to failed payment', 'Customer had to repeat information multiple times causing frustration', 'No offer to set up payment immediately to prevent further issues', 'Should have explained how to prevent this in the future', 'Recommended Training: Bill Pay Troubleshooting Efficiency, Proactive Problem Resolution, Service Recovery for Late Fees'],
      content: { type: 'Chat', messages: [
        { id: '1', sender: 'Susan Miller', timestamp: '11:00 AM', message: 'My scheduled bill payment to the electric company did not go through. I have a late fee now!', isAgent: false },
        { id: '2', sender: 'Bank Agent Tom', timestamp: '11:02 AM', message: 'I am sorry to hear that. Let me check your bill pay history.', isAgent: true },
        { id: '3', sender: 'Susan Miller', timestamp: '11:03 AM', message: 'I set it up to pay $156.78 on the 1st of every month. It worked for 6 months but failed this time.', isAgent: false },
        { id: '4', sender: 'Bank Agent Tom', timestamp: '11:05 AM', message: 'Can you confirm the name of the payee as it appears in your bill pay?', isAgent: true },
        { id: '5', sender: 'Susan Miller', timestamp: '11:06 AM', message: 'Pacific Gas & Electric. Same as always. Account number 78456123.', isAgent: false },
        { id: '6', sender: 'Bank Agent Tom', timestamp: '11:08 AM', message: 'I see the payment was attempted but returned. It looks like the payee account number may have changed.', isAgent: true },
        { id: '7', sender: 'Susan Miller', timestamp: '11:09 AM', message: 'I did not change anything! The electric company must have updated their system. Why wasnt I notified?', isAgent: false },
        { id: '8', sender: 'Bank Agent Tom', timestamp: '11:11 AM', message: 'Unfortunately we do not receive notifications when billers change their details. You would need to contact PG&E.', isAgent: true },
        { id: '9', sender: 'Susan Miller', timestamp: '11:12 AM', message: 'So now I have a $25 late fee because of this. Can you help me fix the payment and cover the late fee?', isAgent: false },
        { id: '10', sender: 'Bank Agent Tom', timestamp: '11:14 AM', message: 'I can help you update the payee information. For the late fee, you would need to request that from PG&E directly.', isAgent: true },
        { id: '11', sender: 'Susan Miller', timestamp: '11:15 AM', message: 'This is not my fault though! The payment failed because of a system issue. The bank should cover this!', isAgent: false },
        { id: '12', sender: 'Bank Agent Tom', timestamp: '11:17 AM', message: 'I understand your frustration. Let me see if I can request a courtesy credit for you. One moment.', isAgent: true },
        { id: '13', sender: 'Susan Miller', timestamp: '11:20 AM', message: 'Its been 3 minutes. Are you still there?', isAgent: false },
        { id: '14', sender: 'Bank Agent Tom', timestamp: '11:21 AM', message: 'Yes, I have submitted a request for a $25 credit to your account. It should appear within 1-2 business days.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-C005`, subject: 'Debit Card PIN Reset Issue - ATM Access - Mark Johnson', channel: 'Chat', sentiment: 'Negative', csat: 2, createdAt: 'Dec 12, 2024', status: 'Escalated',
      dominantTopic: 'PIN Reset', subtopics: ['ATM Access', 'PIN Forgot', 'Card Security', 'Branch Visit Required'],
      aiScores: { takeOwnership: 22, actWithEmpathy: 20, makeItEasy: 25, getItRight: 28 },
      aiSummary: ['Agent did not offer temporary PIN solution available for urgent situations', 'Failed to check if customer had access to registered email/phone for instant PIN reset', 'Should have offered cardless ATM withdrawal as alternative - feature available at our ATMs', 'Customer stranded without cash access in urgent situation', 'Did not acknowledge customers urgent vendor payment need', '24-hour wait time not explained or alternatives offered', 'Recommended Training: Urgent PIN Reset Options, Cardless ATM Features, Emergency Cash Access Solutions'],
      content: { type: 'Chat', messages: [
        { id: '1', sender: 'Mark Johnson', timestamp: '4:30 PM', message: 'I forgot my debit card PIN and need cash urgently. The ATM is locking me out!', isAgent: false },
        { id: '2', sender: 'Bank Agent Amy', timestamp: '4:31 PM', message: 'I can help you reset your PIN. Can you verify your identity with the last 4 of your SSN?', isAgent: true },
        { id: '3', sender: 'Mark Johnson', timestamp: '4:32 PM', message: '5678. Please hurry, I need to pay a vendor in cash today for materials!', isAgent: false },
        { id: '4', sender: 'Bank Agent Amy', timestamp: '4:34 PM', message: 'Thank you. I can send a PIN reset link to your registered email. The new PIN will take 24 hours to activate.', isAgent: true },
        { id: '5', sender: 'Mark Johnson', timestamp: '4:35 PM', message: '24 hours?! I need cash NOW! The vendor is waiting at the job site. Is there any faster option?', isAgent: false },
        { id: '6', sender: 'Bank Agent Amy', timestamp: '4:37 PM', message: 'Unfortunately, for security reasons, PIN changes require a waiting period. You can visit a branch for a cash advance.', isAgent: true },
        { id: '7', sender: 'Mark Johnson', timestamp: '4:38 PM', message: 'All branches are closed! Its 4:38 PM! This is terrible customer service!', isAgent: false },
        { id: '8', sender: 'Bank Agent Amy', timestamp: '4:40 PM', message: 'I apologize for the inconvenience. Some branches are open until 6 PM. Let me check if any are near you.', isAgent: true },
        { id: '9', sender: 'Mark Johnson', timestamp: '4:41 PM', message: 'I am at a construction site 30 miles from the nearest bank! The vendor will leave in 20 minutes!', isAgent: false },
        { id: '10', sender: 'Bank Agent Amy', timestamp: '4:43 PM', message: 'I understand this is very stressful. Unfortunately, I do not have a way to provide instant cash access remotely.', isAgent: true },
        { id: '11', sender: 'Mark Johnson', timestamp: '4:44 PM', message: 'What about cash back at a store? Can I use my card for that without the PIN?', isAgent: false },
        { id: '12', sender: 'Bank Agent Amy', timestamp: '4:46 PM', message: 'Cash back requires your PIN. You could try using your card as credit at a store for the materials instead of cash.', isAgent: true },
        { id: '13', sender: 'Mark Johnson', timestamp: '4:47 PM', message: 'The vendor only takes cash! I am going to lose this $500 job because of your bank. This is unbelievable!', isAgent: false },
        { id: '14', sender: 'Bank Agent Amy', timestamp: '4:49 PM', message: 'I am truly sorry. I will submit feedback about the PIN reset policy. Is there anything else I can help with today?', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-C006`, subject: 'Foreign Transaction Declined - Travel Notification Issue - Rachel Green', channel: 'Chat', sentiment: 'Negative', csat: 1, createdAt: 'Dec 11, 2024', status: 'Escalated',
      dominantTopic: 'Travel Notification', subtopics: ['Foreign Transaction', 'Card Decline', 'Fraud Prevention', 'Travel Alert'],
      aiScores: { takeOwnership: 18, actWithEmpathy: 15, makeItEasy: 20, getItRight: 22 },
      aiSummary: ['Agent did not verify if travel notification was properly recorded before blaming customer', 'Failed to immediately unblock card for legitimate travel after verifying customer identity', 'Should have offered callback or phone support to expedite resolution while customer was stranded', 'Customer stranded in foreign country restaurant without working card - humiliating situation', 'Blamed customer for country-specific notification instead of acknowledging system limitation', '30 minute wait for update is unacceptable for stranded customer', 'Did not offer alternative payment solution while waiting', 'Recommended Training: International Travel Support, Urgent Card Unblock Authority, Empathy in Stressful Situations'],
      content: { type: 'Chat', messages: [
        { id: '1', sender: 'Rachel Green', timestamp: '6:00 AM', message: 'URGENT! My card is being declined in Paris! I set a travel notification before I left!', isAgent: false },
        { id: '2', sender: 'Bank Agent Chris', timestamp: '6:02 AM', message: 'I apologize for the inconvenience. Let me check your account.', isAgent: true },
        { id: '3', sender: 'Rachel Green', timestamp: '6:03 AM', message: 'I am at a restaurant with my family and cannot pay the bill! This is humiliating! Please fix this NOW!', isAgent: false },
        { id: '4', sender: 'Bank Agent Chris', timestamp: '6:05 AM', message: 'I see you did set a travel notification, but it was only for Germany, not France.', isAgent: true },
        { id: '5', sender: 'Rachel Green', timestamp: '6:06 AM', message: 'I selected "Europe" when I set it up! I saw the option for all of Europe!', isAgent: false },
        { id: '6', sender: 'Bank Agent Chris', timestamp: '6:08 AM', message: 'Travel notifications are country-specific. You must have selected Germany only. I can add France now.', isAgent: true },
        { id: '7', sender: 'Rachel Green', timestamp: '6:09 AM', message: 'I am 100% sure I selected Europe! But fine, add France right now please. The waiter is staring at me!', isAgent: false },
        { id: '8', sender: 'Bank Agent Chris', timestamp: '6:11 AM', message: 'I have added France to your travel notification. However, it may take up to 30 minutes to update in our system.', isAgent: true },
        { id: '9', sender: 'Rachel Green', timestamp: '6:12 AM', message: '30 MINUTES?! I cannot sit here for 30 minutes! Can you call the restaurant and guarantee payment?', isAgent: false },
        { id: '10', sender: 'Bank Agent Chris', timestamp: '6:14 AM', message: 'Unfortunately, we cannot call merchants directly. Do you have another form of payment you can use temporarily?', isAgent: true },
        { id: '11', sender: 'Rachel Green', timestamp: '6:15 AM', message: 'I only brought this card because I was told the travel notification would work! My husband is trying his card now.', isAgent: false },
        { id: '12', sender: 'Bank Agent Chris', timestamp: '6:17 AM', message: 'I am glad you have a backup. Is there anything else I can assist with?', isAgent: true },
        { id: '13', sender: 'Rachel Green', timestamp: '6:18 AM', message: 'His card was declined too! We both set travel notifications! What is wrong with your system?!', isAgent: false },
        { id: '14', sender: 'Bank Agent Chris', timestamp: '6:20 AM', message: 'Let me check his account as well. Can you provide his account details?', isAgent: true },
        { id: '15', sender: 'Rachel Green', timestamp: '6:21 AM', message: 'This is a nightmare! We are going to file a formal complaint. Give me your supervisor!', isAgent: false }
      ]}
    }
  ];

  const ticketCases: AgentCase[] = [
    {
      id: `${agentId}-T001`, subject: 'Recurring ACH Debit Not Processing - Michael Johnson', channel: 'Ticket', sentiment: 'Negative', csat: 2, createdAt: 'Dec 15, 2024', status: 'Pending',
      dominantTopic: 'ACH Processing', subtopics: ['Recurring Payment', 'Utility Bill', 'Payment Schedule', 'Account Linking'],
      aiScores: { takeOwnership: 32, actWithEmpathy: 28, makeItEasy: 30, getItRight: 35 },
      aiSummary: ['Agent did not investigate root cause of ACH failure - simply blamed utility company', 'Should have offered to set up payment from bank side to ensure it works', 'Missing follow-up offer to coordinate with biller directly', 'Customer left without clear resolution timeline or case tracking number', 'No empathy shown for customer incurring late fees', 'Recommended Training: ACH Troubleshooting, Proactive Customer Support, Payment Investigation Procedures'],
      content: { type: 'Ticket', messages: [
        { id: '1', sender: 'Michael Johnson', timestamp: 'Dec 15, 10:00 AM', message: 'My electric bill autopay has not gone through for 2 months. I am getting late fees totaling $50 now. I have had autopay set up for 3 years with no issues until now. Account: ***4523. I need this fixed immediately and want the late fees covered since this is clearly a bank issue.', isAgent: false },
        { id: '2', sender: 'Support Agent - Ticket #78234', timestamp: 'Dec 15, 11:30 AM', message: 'Hello Michael, I reviewed your account. The ACH requests are being returned with code R03 (account number invalid). Please contact your utility provider to verify they have your correct account details on file. This appears to be an issue on their end, not with our bank.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-T002`, subject: 'Credit Card Dispute - Lost Card Replacement - Patricia Williams', channel: 'Ticket', sentiment: 'Negative', csat: 3, createdAt: 'Dec 14, 2024', status: 'Resolved',
      dominantTopic: 'Card Services', subtopics: ['Lost Card', 'Card Replacement', 'Fraud Protection', 'Account Security'],
      aiScores: { takeOwnership: 42, actWithEmpathy: 38, makeItEasy: 44, getItRight: 46 },
      aiSummary: ['Agent properly blocked card and ordered replacement - good security response', 'Could have offered expedited shipping at no cost for loyal customer', 'Should have provided more details on fraud monitoring and temporary card number', 'Did not mention digital wallet as immediate alternative for travel', 'Charged for expedited shipping when waiver was available', 'Recommended Training: Premium Customer Benefits, Digital Card Solutions, Service Recovery Waivers'],
      content: { type: 'Ticket', messages: [
        { id: '1', sender: 'Patricia Williams', timestamp: 'Dec 14, 9:00 AM', message: 'I lost my credit card somewhere between home and the grocery store yesterday. I need it replaced ASAP as I have international travel coming up next week. Please block the card immediately and send a new one. I am a Platinum cardholder for 8 years. Account ending 7834.', isAgent: false },
        { id: '2', sender: 'Support Team', timestamp: 'Dec 14, 10:15 AM', message: 'Hello Patricia, I have immediately blocked your card ending in 7834 to prevent any fraudulent use. A replacement will be mailed to your address within 5-7 business days via standard mail. If you need it faster, we can overnight it for a $29.95 fee. Please let me know how you would like to proceed.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-T003`, subject: 'Safe Deposit Box Access Issue - Estate Matter - William Thompson', channel: 'Ticket', sentiment: 'Negative', csat: 2, createdAt: 'Dec 13, 2024', status: 'Escalated',
      dominantTopic: 'Safe Deposit Box', subtopics: ['Estate Access', 'Legal Documentation', 'Branch Coordination', 'Probate Process'],
      aiScores: { takeOwnership: 25, actWithEmpathy: 22, makeItEasy: 28, getItRight: 30 },
      aiSummary: ['Agent did not show empathy for recently bereaved family member - cold response', 'Failed to explain complete estate access process and timeline clearly', 'Should have offered to coordinate directly with branch to resolve 3-week delay', 'Generic 5-7 day response unacceptable for already delayed case', 'No acknowledgment that customer has been waiting 3 weeks already', 'Recommended Training: Estate Services Protocol, Empathetic Communication for Bereaved, Escalation for Delayed Cases'],
      content: { type: 'Ticket', messages: [
        { id: '1', sender: 'William Thompson', timestamp: 'Dec 13, 9:00 AM', message: 'My father passed away last month and I am the executor of his estate. I need access to his safe deposit box at your Main Street branch. I have already visited the branch 3 times over the past 3 weeks with Letters Testamentary and death certificate. They keep saying they need corporate approval but nobody can tell me the status. This is extremely frustrating during an already difficult time.', isAgent: false },
        { id: '2', sender: 'Support Agent - Ticket #78456', timestamp: 'Dec 13, 11:00 AM', message: 'I am sorry for your loss. For estate matters involving safe deposit boxes, you will need to provide Letters Testamentary and the death certificate to the branch, which you have done. I can escalate this to our estates department for review. Please allow 5-7 business days for a response.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-T004`, subject: 'CD Early Withdrawal Penalty Dispute - Emergency Funds - Nancy Davis', channel: 'Ticket', sentiment: 'Negative', csat: 2, createdAt: 'Dec 12, 2024', status: 'Pending',
      dominantTopic: 'CD Withdrawal', subtopics: ['Early Penalty', 'Emergency Access', 'Hardship Waiver', 'Interest Calculation'],
      aiScores: { takeOwnership: 28, actWithEmpathy: 25, makeItEasy: 30, getItRight: 32 },
      aiSummary: ['Agent did not explore medical hardship waiver options proactively', 'Failed to calculate exact penalty amount for customer planning purposes', 'Should have offered partial withdrawal option to minimize penalty', 'Customer dealing with cancer treatment - medical emergency not prioritized', 'No mention of loan against CD as alternative to early withdrawal', 'Recommended Training: Hardship Waiver Programs, CD Penalty Alternatives, Medical Emergency Protocols'],
      content: { type: 'Ticket', messages: [
        { id: '1', sender: 'Nancy Davis', timestamp: 'Dec 12, 8:30 AM', message: 'I have a $50,000 CD that matures in 8 months but I need to withdraw it now for a medical emergency. I was just diagnosed with cancer and need funds for treatment that insurance does not fully cover. I have been a loyal customer for 15 years. What is the exact penalty and is there any way to waive it given my situation?', isAgent: false },
        { id: '2', sender: 'Support Agent - Ticket #78567', timestamp: 'Dec 12, 10:45 AM', message: 'Hello Nancy, I am sorry to hear about your health situation. The early withdrawal penalty for your CD is 6 months of interest, which would be approximately $1,250 based on your current rate. Unfortunately, early withdrawal penalties cannot be waived per our standard policy. Would you like me to process the withdrawal?', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-T005`, subject: 'Business Account Frozen - Compliance Issue - Tech Solutions LLC', channel: 'Ticket', sentiment: 'Negative', csat: 1, createdAt: 'Dec 11, 2024', status: 'Escalated',
      dominantTopic: 'Account Freeze', subtopics: ['Business Account', 'Compliance Hold', 'Documentation Request', 'Payroll Impact'],
      aiScores: { takeOwnership: 20, actWithEmpathy: 18, makeItEasy: 22, getItRight: 25 },
      aiSummary: ['Agent did not explain specific reason for account freeze - vague compliance reference', 'Failed to provide expedited review for time-critical payroll deadline', 'Should have offered alternative payment methods to process urgent payroll', 'Business unable to pay 50 employees - major impact not acknowledged', '3-5 day timeline unacceptable when payroll is due same day', 'No escalation path offered despite urgency', 'Recommended Training: Business Account Compliance Communication, Urgent Business Issue Escalation, Payroll Emergency Protocols'],
      content: { type: 'Ticket', messages: [
        { id: '1', sender: 'Tech Solutions LLC - Jason Reed', timestamp: 'Dec 11, 7:00 AM', message: 'URGENT: Our business checking account was frozen without any prior notice! We have payroll scheduled for TODAY for 50 employees totaling $175,000. We submitted all required documentation last month during our annual review. This is a 10-year business relationship. Someone needs to fix this immediately or 50 families will not get paid!', isAgent: false },
        { id: '2', sender: 'Support Agent - Ticket #78678', timestamp: 'Dec 11, 9:30 AM', message: 'Your account was placed on hold pending compliance review. Our records indicate we need updated articles of incorporation and a new beneficial ownership form. Please submit these documents and allow 3-5 business days for our compliance team to complete their review.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-T006`, subject: 'Home Equity Line Frozen - Property Reassessment - Robert Martinez', channel: 'Ticket', sentiment: 'Negative', csat: 2, createdAt: 'Dec 10, 2024', status: 'Pending',
      dominantTopic: 'HELOC Freeze', subtopics: ['Property Value', 'Line Reduction', 'Market Conditions', 'Appeal Process'],
      aiScores: { takeOwnership: 30, actWithEmpathy: 25, makeItEasy: 28, getItRight: 32 },
      aiSummary: ['Agent did not explain automated property reassessment process clearly', 'Failed to offer immediate appeal process with customer-provided appraisal', 'Should have provided alternative lending options for ongoing renovation', 'Customer renovation project halted mid-construction with contractors waiting', '2-3 week timeline too long for customer with active construction project', 'No interim credit solution offered', 'Recommended Training: HELOC Policy Changes Communication, Property Reassessment Appeals, Construction Loan Alternatives'],
      content: { type: 'Ticket', messages: [
        { id: '1', sender: 'Robert Martinez', timestamp: 'Dec 10, 10:00 AM', message: 'My HELOC was frozen without any warning! I am in the middle of a $80,000 home renovation and have $35,000 left to draw. Contractors are on site right now waiting for payment. I have a professional appraisal from last month showing my home is worth $650,000 which is MORE than when I got the HELOC. The available credit was there yesterday. What happened and how do I fix this TODAY?', isAgent: false },
        { id: '2', sender: 'Support Agent - Ticket #78789', timestamp: 'Dec 10, 1:00 PM', message: 'Your HELOC was frozen due to an automated property value reassessment triggered by market conditions in your area. This is a standard risk management procedure. You can submit your recent appraisal for review by our underwriting team. The appeal process typically takes 2-3 weeks for evaluation and decision.', isAgent: true }
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
    },
    {
      id: `${agentId}-S003`, subject: 'Viral Complaint - Branch Wait Time (Jessica Moore)', channel: 'Social Media', sentiment: 'Negative', csat: 1, createdAt: 'Dec 13, 2024', status: 'Escalated',
      dominantTopic: 'Branch Service', subtopics: ['Wait Time', 'Staffing Issue', 'Customer Experience', 'Appointment System'],
      aiScores: { takeOwnership: 15, actWithEmpathy: 12, makeItEasy: 18, getItRight: 20 },
      aiSummary: ['Response was defensive instead of apologetic', 'Did not offer compensation or resolution', 'Post gained significant negative engagement (500+ retweets)', 'Missed opportunity for service recovery'],
      content: { type: 'Social Media', messages: [
        { id: '1', sender: '@JessicaMoore_NYC', timestamp: 'Dec 13, 12:00 PM', message: '@BankofAmerica Waited 2 HOURS at your branch just to deposit a check! Only 2 tellers for 30 people in line. Switching to @Chase tomorrow! #BankofAmericaFail', isAgent: false },
        { id: '2', sender: '@BofA_Help', timestamp: 'Dec 13, 4:30 PM', message: 'We apologize for the wait. Our branches can experience high traffic during lunch hours. Consider using our mobile app for deposits.', isAgent: true },
        { id: '3', sender: '@JessicaMoore_NYC', timestamp: 'Dec 13, 5:00 PM', message: 'The check was too large for mobile deposit! Maybe hire more tellers instead of making excuses? 500 people agree with me!', isAgent: false },
        { id: '4', sender: '@BofA_Help', timestamp: 'Dec 13, 6:00 PM', message: 'We appreciate your feedback. Your concerns have been noted and shared with branch management.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-S004`, subject: 'Fraud Victim Complaint - Account Takeover (Kevin Park)', channel: 'Social Media', sentiment: 'Negative', csat: 1, createdAt: 'Dec 12, 2024', status: 'Escalated',
      dominantTopic: 'Fraud Resolution', subtopics: ['Account Takeover', 'Identity Theft', 'Recovery Process', 'Security Failure'],
      aiScores: { takeOwnership: 20, actWithEmpathy: 18, makeItEasy: 22, getItRight: 25 },
      aiSummary: ['Agent did not prioritize fraud victim urgency', 'Public response lacked empathy for identity theft victim', 'Should have provided direct phone line for fraud cases', 'Customer exposed to continued fraud due to delayed response'],
      content: { type: 'Social Media', messages: [
        { id: '1', sender: '@KevinPark_Dev', timestamp: 'Dec 12, 6:00 AM', message: '@BankofAmerica Someone took over my account and transferred $15,000! I have been calling for 3 days and no one helps! URGENT!', isAgent: false },
        { id: '2', sender: '@BofA_Help', timestamp: 'Dec 12, 10:00 AM', message: 'Hi Kevin, we understand this is concerning. Please visit your local branch with ID to file a fraud claim.', isAgent: true },
        { id: '3', sender: '@KevinPark_Dev', timestamp: 'Dec 12, 10:30 AM', message: 'I am out of the country! Can someone actually HELP? The thief is still making transactions!', isAgent: false },
        { id: '4', sender: '@BofA_Help', timestamp: 'Dec 12, 12:00 PM', message: 'You can call our international line at 1-315-555-0000 for urgent matters. Standard investigation takes 10 business days.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-S005`, subject: 'App Outage Complaint - Paycheck Access (Maria Santos)', channel: 'Social Media', sentiment: 'Negative', csat: 2, createdAt: 'Dec 11, 2024', status: 'Resolved',
      dominantTopic: 'App Outage', subtopics: ['Mobile Banking', 'System Down', 'Direct Deposit', 'Weekend Access'],
      aiScores: { takeOwnership: 28, actWithEmpathy: 25, makeItEasy: 30, getItRight: 32 },
      aiSummary: ['Agent acknowledged outage but did not provide ETA', 'Should have offered alternative access methods', 'Did not proactively update customers on resolution', 'Multiple customers affected by same issue'],
      content: { type: 'Social Media', messages: [
        { id: '1', sender: '@MariaSantos_TX', timestamp: 'Dec 11, 8:00 AM', message: '@BankofAmerica Your app has been down for 5 hours! My paycheck deposited but I cant access it. I have bills due!', isAgent: false },
        { id: '2', sender: '@BofA_Help', timestamp: 'Dec 11, 9:30 AM', message: 'We are aware of technical difficulties affecting some customers. Our team is working to restore services.', isAgent: true },
        { id: '3', sender: '@MariaSantos_TX', timestamp: 'Dec 11, 11:00 AM', message: 'STILL DOWN! When will this be fixed? I am not the only one - look at the replies!', isAgent: false },
        { id: '4', sender: '@BofA_Help', timestamp: 'Dec 11, 12:30 PM', message: 'Services have been restored. We apologize for any inconvenience caused. Please try accessing your account now.', isAgent: true }
      ]}
    },
    {
      id: `${agentId}-S006`, subject: 'Mortgage Rate Lock Complaint - Rate Increase (David Lee)', channel: 'Social Media', sentiment: 'Negative', csat: 1, createdAt: 'Dec 10, 2024', status: 'Escalated',
      dominantTopic: 'Mortgage Rate', subtopics: ['Rate Lock', 'Processing Delay', 'Financial Impact', 'Loan Application'],
      aiScores: { takeOwnership: 15, actWithEmpathy: 12, makeItEasy: 18, getItRight: 20 },
      aiSummary: ['Agent blamed customer for rate lock expiration', 'Did not investigate processing delays on bank side', 'Should have offered rate lock extension', 'Customer will pay $50k more over loan term due to rate increase'],
      content: { type: 'Social Media', messages: [
        { id: '1', sender: '@DavidLee_Home', timestamp: 'Dec 10, 7:00 AM', message: '@BankofAmerica My mortgage rate lock expired because YOUR team took 60 days to process my application. Now my rate is 1% higher costing me $50k!', isAgent: false },
        { id: '2', sender: '@BofA_Help', timestamp: 'Dec 10, 11:00 AM', message: 'Rate locks have specific expiration dates that are communicated at time of application. Extensions can be requested but may have fees.', isAgent: true },
        { id: '3', sender: '@DavidLee_Home', timestamp: 'Dec 10, 11:30 AM', message: 'I submitted all documents on day 1! Your underwriter asked the same questions 3 times. This is YOUR fault!', isAgent: false },
        { id: '4', sender: '@BofA_Help', timestamp: 'Dec 10, 2:00 PM', message: 'We would need to review your specific case. Please DM us your application number for escalation.', isAgent: true }
      ]}
    }
  ];

  switch (channel) {
    case 'Email': return emailCases;
    case 'Chat': return chatCases;
    case 'Voice': return voiceCases;
    case 'Ticket': return ticketCases;
    case 'Social Media': return socialCases;
    default: return emailCases;
  }
};

const agentData: AgentPerformance[] = [
  { id: 'AGT001', name: 'Michael Thompson', qualityScore: 62.4, qualityTrend: -8.2, totalCases: 156, channel: 'Voice', fciScore: 34.8, fciTrend: 12.4, resolutionRate: 58.2, avgHandleTime: '12m 45s', customerSatisfaction: 2.8, needsTrainingAt: 'Customer Empathy & Ownership', status: 'In Training', cases: generateCasesForAgent('AGT001', 'Voice') },
  { id: 'AGT002', name: 'Robert Kim', qualityScore: 58.9, qualityTrend: -11.5, totalCases: 189, channel: 'Voice', fciScore: 42.1, fciTrend: 15.8, resolutionRate: 51.3, avgHandleTime: '14m 22s', customerSatisfaction: 2.4, needsTrainingAt: 'Resolution Authority & Alternatives', status: 'In Training', cases: generateCasesForAgent('AGT002', 'Voice') },
  { id: 'AGT003', name: 'Jennifer Walsh', qualityScore: 65.7, qualityTrend: -6.3, totalCases: 234, channel: 'Chat', fciScore: 31.2, fciTrend: 9.7, resolutionRate: 62.8, avgHandleTime: '8m 55s', customerSatisfaction: 3.1, needsTrainingAt: 'Empathetic Communication', status: 'In Training', cases: generateCasesForAgent('AGT003', 'Chat') },
  { id: 'AGT004', name: 'David Martinez', qualityScore: 71.2, qualityTrend: -4.8, totalCases: 312, channel: 'Email', fciScore: 28.5, fciTrend: 7.2, resolutionRate: 68.4, avgHandleTime: '18m 30s', customerSatisfaction: 3.3, needsTrainingAt: 'Fraud Response & Provisional Credit', status: 'In Training', cases: generateCasesForAgent('AGT004', 'Email') },
  { id: 'AGT005', name: 'Amanda Foster', qualityScore: 67.8, qualityTrend: -5.6, totalCases: 178, channel: 'Social Media', fciScore: 29.4, fciTrend: 8.1, resolutionRate: 64.2, avgHandleTime: '6m 48s', customerSatisfaction: 3.0, needsTrainingAt: 'Urgent Request Escalation', status: 'In Training', cases: generateCasesForAgent('AGT005', 'Social Media') },
  { id: 'AGT006', name: 'Kevin O\'Brien', qualityScore: 69.5, qualityTrend: -3.9, totalCases: 267, channel: 'Chat', fciScore: 26.8, fciTrend: 6.4, resolutionRate: 66.9, avgHandleTime: '7m 12s', customerSatisfaction: 3.2, needsTrainingAt: 'Emergency Access Solutions', status: 'In Training', cases: generateCasesForAgent('AGT006', 'Chat') },
  { id: 'AGT007', name: 'Sarah Chen', qualityScore: 72.3, qualityTrend: -2.8, totalCases: 198, channel: 'Ticket', fciScore: 24.6, fciTrend: 5.3, resolutionRate: 70.1, avgHandleTime: '32m 15s', customerSatisfaction: 3.4, needsTrainingAt: 'Hardship & Exception Processing', status: 'In Training', cases: generateCasesForAgent('AGT007', 'Ticket') },
  { id: 'AGT008', name: 'James Rodriguez', qualityScore: 64.1, qualityTrend: -7.4, totalCases: 145, channel: 'Voice', fciScore: 32.7, fciTrend: 10.2, resolutionRate: 59.8, avgHandleTime: '11m 08s', customerSatisfaction: 2.9, needsTrainingAt: 'Fee Authority & Fraud Prevention', status: 'In Training', cases: generateCasesForAgent('AGT008', 'Voice') },
  { id: 'AGT009', name: 'Emily Parker', qualityScore: 70.8, qualityTrend: -3.2, totalCases: 289, channel: 'Email', fciScore: 25.9, fciTrend: 4.8, resolutionRate: 69.2, avgHandleTime: '15m 45s', customerSatisfaction: 3.5, needsTrainingAt: 'Proactive Fee Resolution', status: 'In Training', cases: generateCasesForAgent('AGT009', 'Email') },
  { id: 'AGT010', name: 'Lisa Wang', qualityScore: 73.6, qualityTrend: -2.1, totalCases: 223, channel: 'Chat', fciScore: 23.4, fciTrend: 4.1, resolutionRate: 71.5, avgHandleTime: '6m 32s', customerSatisfaction: 3.6, needsTrainingAt: 'International Travel Support', status: 'In Training', cases: generateCasesForAgent('AGT010', 'Chat') }
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
