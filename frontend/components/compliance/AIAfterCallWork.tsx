'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, FileCheck, CheckCircle2, 
  AlertCircle, FileText, Zap,
  Eye, Sparkles, Award, X, Phone, User,
  Clock, Calendar, MessageSquare, CreditCard,
  Building, MapPin, Hash, Shield, Edit3,
  Gauge, Timer, Mic, TrendingUp
} from 'lucide-react';

interface FormField {
  label: string;
  value: string;
  confidence: number;
  source: 'ai_extracted' | 'verified' | 'manual_edit';
}

interface RecentACWForm {
  id: string;
  callId: string;
  agentName: string;
  customerName: string;
  callDuration: string;
  formType: string;
  status: 'completed' | 'review_needed' | 'approved';
  filledFields: number;
  totalFields: number;
  confidenceScore: number;
  timestamp: string;
  callSummary?: string;
  fields?: FormField[];
  /** Process insights */
  autoFillAccuracy?: number;
  processingTimeSaved?: number; // minutes
  fieldsFromVoice?: number;
  confidenceLevel?: 'High' | 'Medium' | 'Low';
}

const recentForms: RecentACWForm[] = [
  {
    id: 'ACW-2847',
    callId: 'CALL-9823',
    agentName: 'Sarah Mitchell',
    customerName: 'John D. ****4521',
    callDuration: '8:42',
    formType: 'Account Inquiry',
    status: 'completed',
    filledFields: 24,
    totalFields: 24,
    confidenceScore: 98.5,
    timestamp: '2 min ago',
    autoFillAccuracy: 98.5,
    processingTimeSaved: 2,
    fieldsFromVoice: 22,
    confidenceLevel: 'High',
    callSummary: 'Customer inquired about recent transaction on checking account ending in 4521. Verified identity, explained transaction was a recurring subscription charge. Customer satisfied with explanation.',
    fields: [
      { label: 'Customer Name', value: 'John Davidson', confidence: 99.8, source: 'verified' },
      { label: 'Account Number', value: '****4521', confidence: 100, source: 'verified' },
      { label: 'Call Reason', value: 'Transaction Inquiry', confidence: 98.5, source: 'ai_extracted' },
      { label: 'Transaction Amount', value: '$49.99', confidence: 99.2, source: 'ai_extracted' },
      { label: 'Transaction Date', value: 'Nov 27, 2024', confidence: 99.0, source: 'ai_extracted' },
      { label: 'Merchant Name', value: 'Netflix Inc.', confidence: 97.8, source: 'ai_extracted' },
      { label: 'Resolution', value: 'Explained - No Action Required', confidence: 96.5, source: 'ai_extracted' },
      { label: 'Customer Sentiment', value: 'Satisfied', confidence: 94.2, source: 'ai_extracted' },
    ]
  },
  {
    id: 'ACW-2846',
    callId: 'CALL-9822',
    agentName: 'Emily Chen',
    customerName: 'Maria S. ****7832',
    callDuration: '12:15',
    formType: 'Loan Application',
    status: 'approved',
    filledFields: 42,
    totalFields: 42,
    confidenceScore: 99.2,
    timestamp: '5 min ago',
    autoFillAccuracy: 99.2,
    processingTimeSaved: 5,
    fieldsFromVoice: 40,
    confidenceLevel: 'High',
    callSummary: 'Customer called to initiate personal loan application for home improvement. Collected all required information, verified employment and income. Application submitted for processing.',
    fields: [
      { label: 'Applicant Name', value: 'Maria Santos', confidence: 99.9, source: 'verified' },
      { label: 'SSN (Last 4)', value: '****7832', confidence: 100, source: 'verified' },
      { label: 'Loan Type', value: 'Personal Loan', confidence: 99.5, source: 'ai_extracted' },
      { label: 'Loan Amount', value: '$25,000', confidence: 99.8, source: 'ai_extracted' },
      { label: 'Loan Purpose', value: 'Home Improvement', confidence: 98.7, source: 'ai_extracted' },
      { label: 'Employment Status', value: 'Full-time Employed', confidence: 99.1, source: 'ai_extracted' },
      { label: 'Annual Income', value: '$85,000', confidence: 98.5, source: 'ai_extracted' },
      { label: 'Employer Name', value: 'Tech Solutions Inc.', confidence: 97.2, source: 'ai_extracted' },
    ]
  },
  {
    id: 'ACW-2845',
    callId: 'CALL-9821',
    agentName: 'James Rodriguez',
    customerName: 'Robert K. ****1294',
    callDuration: '6:33',
    formType: 'Card Dispute',
    status: 'review_needed',
    filledFields: 18,
    totalFields: 20,
    confidenceScore: 87.3,
    timestamp: '8 min ago',
    callSummary: 'Customer reported unauthorized transaction on credit card. Disputed charge of $234.50 from unknown merchant. Card blocked and replacement ordered. Dispute case opened.',
    fields: [
      { label: 'Cardholder Name', value: 'Robert Kim', confidence: 99.5, source: 'verified' },
      { label: 'Card Number', value: '****1294', confidence: 100, source: 'verified' },
      { label: 'Dispute Type', value: 'Unauthorized Transaction', confidence: 95.2, source: 'ai_extracted' },
      { label: 'Disputed Amount', value: '$234.50', confidence: 98.8, source: 'ai_extracted' },
      { label: 'Merchant Name', value: 'Unknown - Needs Review', confidence: 72.3, source: 'ai_extracted' },
      { label: 'Transaction Date', value: 'Nov 25, 2024', confidence: 94.5, source: 'ai_extracted' },
      { label: 'Card Action', value: 'Blocked & Replacement Ordered', confidence: 99.0, source: 'ai_extracted' },
      { label: 'Case Priority', value: 'High', confidence: 88.5, source: 'ai_extracted' },
    ]
  },
  {
    id: 'ACW-2844',
    callId: 'CALL-9820',
    agentName: 'Priya Sharma',
    customerName: 'Lisa M. ****6547',
    callDuration: '15:22',
    formType: 'Mortgage Inquiry',
    status: 'completed',
    filledFields: 38,
    totalFields: 38,
    confidenceScore: 99.8,
    timestamp: '12 min ago',
    autoFillAccuracy: 99.8,
    processingTimeSaved: 3,
    fieldsFromVoice: 32,
    confidenceLevel: 'High',
    callSummary: 'Customer inquired about mortgage refinancing options. Discussed current rates, collected property and income details. Scheduled follow-up call with mortgage specialist.',
    fields: [
      { label: 'Customer Name', value: 'Lisa Martinez', confidence: 99.9, source: 'verified' },
      { label: 'Current Mortgage', value: '$320,000 remaining', confidence: 98.5, source: 'ai_extracted' },
      { label: 'Property Address', value: '1234 Oak Street, Austin TX', confidence: 97.8, source: 'ai_extracted' },
      { label: 'Current Rate', value: '6.5% APR', confidence: 99.2, source: 'ai_extracted' },
      { label: 'Inquiry Type', value: 'Refinance', confidence: 99.5, source: 'ai_extracted' },
      { label: 'Property Value', value: '$450,000 (estimated)', confidence: 95.2, source: 'ai_extracted' },
      { label: 'Follow-up Action', value: 'Specialist Call Scheduled', confidence: 99.8, source: 'ai_extracted' },
      { label: 'Preferred Contact', value: 'Phone - Morning', confidence: 96.5, source: 'ai_extracted' },
    ]
  },
  {
    id: 'ACW-2843',
    callId: 'CALL-9819',
    agentName: 'Michael Thompson',
    customerName: 'David W. ****3891',
    callDuration: '9:47',
    formType: 'Wire Transfer',
    status: 'approved',
    filledFields: 28,
    totalFields: 28,
    confidenceScore: 97.1,
    timestamp: '15 min ago',
    autoFillAccuracy: 97.1,
    processingTimeSaved: 2,
    fieldsFromVoice: 26,
    confidenceLevel: 'High',
    callSummary: 'Customer requested domestic wire transfer to family member. Verified identity with security questions, confirmed transfer details. Wire initiated for next business day.',
    fields: [
      { label: 'Sender Name', value: 'David Wilson', confidence: 99.8, source: 'verified' },
      { label: 'Sender Account', value: '****3891', confidence: 100, source: 'verified' },
      { label: 'Transfer Amount', value: '$5,000.00', confidence: 99.5, source: 'ai_extracted' },
      { label: 'Recipient Name', value: 'Jennifer Wilson', confidence: 98.2, source: 'ai_extracted' },
      { label: 'Recipient Bank', value: 'Chase Bank', confidence: 97.5, source: 'ai_extracted' },
      { label: 'Routing Number', value: '****5678', confidence: 99.0, source: 'ai_extracted' },
      { label: 'Transfer Purpose', value: 'Family Support', confidence: 94.8, source: 'ai_extracted' },
      { label: 'Processing Date', value: 'Next Business Day', confidence: 99.5, source: 'ai_extracted' },
    ]
  }
];

interface AIAfterCallWorkProps {
  isDarkMode?: boolean;
}

export function AIAfterCallWork({ isDarkMode = false }: AIAfterCallWorkProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedForm, setSelectedForm] = useState<RecentACWForm | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getStatusConfig = (status: RecentACWForm['status']) => {
    switch (status) {
      case 'completed':
        return { color: '#22c55e', bg: '#22c55e20', label: 'Auto-Filled', icon: CheckCircle2 };
      case 'approved':
        return { color: '#5332FF', bg: '#5332FF20', label: 'Approved', icon: Award };
      case 'review_needed':
        return { color: '#f97316', bg: '#f9731620', label: 'Review', icon: AlertCircle };
      default:
        return { color: '#939394', bg: '#93939420', label: 'Unknown', icon: FileText };
    }
  };

  const getSourceConfig = (source: FormField['source']) => {
    switch (source) {
      case 'ai_extracted':
        return { color: '#22c55e', label: 'AI Extracted', icon: Brain };
      case 'verified':
        return { color: '#5332FF', label: 'Verified', icon: Shield };
      case 'manual_edit':
        return { color: '#f97316', label: 'Manual Edit', icon: Edit3 };
      default:
        return { color: '#939394', label: 'Unknown', icon: FileText };
    }
  };

  const getFormTypeIcon = (formType: string) => {
    if (formType.includes('Account')) return User;
    if (formType.includes('Loan') || formType.includes('Mortgage')) return Building;
    if (formType.includes('Card') || formType.includes('Dispute')) return CreditCard;
    if (formType.includes('Wire') || formType.includes('Transfer')) return Hash;
    return FileText;
  };

  return (
    <>
      <div
        className={`rounded-2xl overflow-hidden transition-all duration-500 flex flex-col ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{
          backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`,
          boxShadow: isDarkMode 
            ? '0 4px 24px rgba(0, 0, 0, 0.4)'
            : '0 4px 24px rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Header */}
        <div 
          className="p-5"
          style={{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #0d1a0d 0%, #0d0d0d 100%)'
              : 'linear-gradient(135deg, #F0FFF4 0%, #FFFFFF 100%)',
            borderBottom: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                }}
              >
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 
                  className="text-base font-bold flex items-center gap-2"
                  style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                >
                  AI Auto-Filled Forms
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </h3>
                <p className="text-xs" style={{ color: '#939394' }}>
                  Real-time after-call work automation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '500px' }}>
          <div className="space-y-3">
            {recentForms.map((form, index) => {
              const statusConfig = getStatusConfig(form.status);
              const StatusIcon = statusConfig.icon;
              const isExpanded = selectedForm?.id === form.id;
              return (
                <div
                  key={form.id}
                  className={`rounded-xl transition-all duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#F8F8F8',
                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                  }}
                >
                  <div className="p-3">
                    {/* Form Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-sm font-semibold"
                            style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}
                          >
                            {form.formType}
                          </span>
                          <span 
                            className="text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1"
                            style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-[10px] mt-0.5" style={{ color: '#939394' }}>
                          {form.agentName} • {form.customerName}
                        </p>
                      </div>
                      
                      {/* Confidence Score */}
                      <div 
                        className="flex items-center gap-1 px-2 py-1 rounded-lg"
                        style={{ 
                          backgroundColor: form.confidenceScore >= 95 ? '#22c55e15' : '#f9731615',
                        }}
                      >
                        <Brain className="w-3 h-3" style={{ color: form.confidenceScore >= 95 ? '#22c55e' : '#f97316' }} />
                        <span 
                          className="text-xs font-bold"
                          style={{ color: form.confidenceScore >= 95 ? '#22c55e' : '#f97316' }}
                        >
                          {form.confidenceScore}%
                        </span>
                      </div>
                    </div>

                    {/* Process Insights */}
                    {(form.autoFillAccuracy != null || form.processingTimeSaved != null || form.fieldsFromVoice != null || form.confidenceLevel) && (
                      <div 
                        className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 py-2 rounded-lg px-2"
                        style={{ 
                          backgroundColor: isDarkMode ? 'rgba(83, 50, 255, 0.06)' : 'rgba(83, 50, 255, 0.06)',
                          border: `1px solid ${isDarkMode ? 'rgba(83, 50, 255, 0.2)' : 'rgba(83, 50, 255, 0.15)'}`
                        }}
                      >
                        {form.autoFillAccuracy != null && (
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Gauge className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#5332FF' }} />
                            <div className="min-w-0">
                              <p className="text-[9px] truncate" style={{ color: '#939394' }}>Auto-fill accuracy</p>
                              <p className="text-xs font-bold truncate" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                                {form.autoFillAccuracy}%
                              </p>
                            </div>
                          </div>
                        )}
                        {form.processingTimeSaved != null && (
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Timer className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#5332FF' }} />
                            <div className="min-w-0">
                              <p className="text-[9px] truncate" style={{ color: '#939394' }}>Time saved</p>
                              <p className="text-xs font-bold truncate" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                                {form.processingTimeSaved} min
                              </p>
                            </div>
                          </div>
                        )}
                        {form.fieldsFromVoice != null && (
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Mic className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#5332FF' }} />
                            <div className="min-w-0">
                              <p className="text-[9px] truncate" style={{ color: '#939394' }}>From voice</p>
                              <p className="text-xs font-bold truncate" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                                {form.fieldsFromVoice} fields
                              </p>
                            </div>
                          </div>
                        )}
                        {form.confidenceLevel && (
                          <div className="flex items-center gap-1.5 min-w-0">
                            <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#5332FF' }} />
                            <div className="min-w-0">
                              <p className="text-[9px] truncate" style={{ color: '#939394' }}>Confidence</p>
                              <p 
                                className="text-xs font-bold truncate capitalize"
                                style={{ 
                                  color: form.confidenceLevel === 'High' ? '#22c55e' : form.confidenceLevel === 'Medium' ? '#eab308' : '#ef4444'
                                }}
                              >
                                {form.confidenceLevel}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Form Details */}
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-3">
                        <span style={{ color: '#939394' }}>
                          <FileCheck className="w-3 h-3 inline mr-1" />
                          {form.filledFields}/{form.totalFields} fields
                        </span>
                        <span style={{ color: '#939394' }}>
                          {form.callDuration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#939394' }}>{form.timestamp}</span>
                        <button 
                          onClick={() => setSelectedForm(isExpanded ? null : form)}
                          className="flex items-center gap-1 font-medium hover:opacity-80 transition-opacity"
                          style={{ color: '#5332FF' }}
                        >
                          <Eye className="w-3 h-3" />
                          {isExpanded ? 'Close' : 'View'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded inline detail - appears on the spot */}
                  {isExpanded && form && (
                    <div 
                      className="border-t px-3 py-4 space-y-4"
                      style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}
                    >
                      {/* Process Insights (expanded) */}
                      {(form.autoFillAccuracy != null || form.processingTimeSaved != null || form.fieldsFromVoice != null || form.confidenceLevel) && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Gauge className="w-4 h-4" style={{ color: '#5332FF' }} />
                            <h4 className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                              Process Insights
                            </h4>
                          </div>
                          <div 
                            className="grid grid-cols-2 gap-3 p-3 rounded-lg"
                            style={{ 
                              backgroundColor: isDarkMode ? '#0d0d0d' : '#F5F5F5',
                              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                            }}
                          >
                            {form.autoFillAccuracy != null && (
                              <div>
                                <p className="text-[10px] mb-0.5" style={{ color: '#939394' }}>Auto-fill accuracy</p>
                                <p className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{form.autoFillAccuracy}%</p>
                              </div>
                            )}
                            {form.processingTimeSaved != null && (
                              <div>
                                <p className="text-[10px] mb-0.5" style={{ color: '#939394' }}>Avg. processing time saved</p>
                                <p className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{form.processingTimeSaved} min</p>
                              </div>
                            )}
                            {form.fieldsFromVoice != null && (
                              <div>
                                <p className="text-[10px] mb-0.5" style={{ color: '#939394' }}>Fields extracted from voice</p>
                                <p className="text-sm font-bold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>{form.fieldsFromVoice}</p>
                              </div>
                            )}
                            {form.confidenceLevel && (
                              <div>
                                <p className="text-[10px] mb-0.5" style={{ color: '#939394' }}>Confidence score</p>
                                <p 
                                  className="text-sm font-bold capitalize"
                                  style={{ 
                                    color: form.confidenceLevel === 'High' ? '#22c55e' : form.confidenceLevel === 'Medium' ? '#eab308' : '#ef4444'
                                  }}
                                >
                                  {form.confidenceLevel}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Call Summary */}
                      {form.callSummary && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4" style={{ color: '#5332FF' }} />
                            <h4 className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                              Call Summary
                            </h4>
                          </div>
                          <p 
                            className="text-sm p-3 rounded-lg leading-relaxed"
                            style={{ 
                              backgroundColor: isDarkMode ? '#0d0d0d' : '#F5F5F5',
                              color: isDarkMode ? '#D6D9D8' : '#4a4a4a',
                              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                            }}
                          >
                            {form.callSummary}
                          </p>
                        </div>
                      )}

                      {/* Auto-Filled Fields */}
                      {form.fields && form.fields.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4" style={{ color: '#22c55e' }} />
                            <h4 className="text-sm font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                              Auto-Filled Fields
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#22c55e20', color: '#22c55e' }}>
                              {form.fields.length} fields extracted
                            </span>
                          </div>
                          <div className="space-y-2 max-h-[280px] overflow-y-auto">
                            {form.fields.map((field, idx) => {
                              const sourceConfig = getSourceConfig(field.source);
                              const SourceIcon = sourceConfig.icon;
                              return (
                                <div 
                                  key={idx}
                                  className="p-2.5 rounded-lg flex items-center justify-between"
                                  style={{ 
                                    backgroundColor: isDarkMode ? '#0d0d0d' : '#F5F5F5',
                                    border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                                  }}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[10px]" style={{ color: '#939394' }}>{field.label}</p>
                                    <p className="text-xs font-medium truncate" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                                      {field.value}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <span 
                                      className="text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1"
                                      style={{ backgroundColor: `${sourceConfig.color}20`, color: sourceConfig.color }}
                                    >
                                      <SourceIcon className="w-2.5 h-2.5" />
                                      {sourceConfig.label}
                                    </span>
                                    <span 
                                      className="text-[10px] font-bold"
                                      style={{ color: field.confidence >= 95 ? '#22c55e' : field.confidence >= 85 ? '#eab308' : '#ef4444' }}
                                    >
                                      {field.confidence}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Footer actions */}
                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5' }}>
                        <span className="text-[10px]" style={{ color: '#939394' }}>
                          Processed in 1.2s • {form.timestamp}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium"
                            style={{ 
                              backgroundColor: isDarkMode ? '#1a1a1a' : '#FFFFFF',
                              color: isDarkMode ? '#FFFFFF' : '#010101',
                              border: `1px solid ${isDarkMode ? '#2a2a2a' : '#E5E5E5'}`
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit Form
                          </button>
                          <button 
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium"
                            style={{ backgroundColor: '#5332FF', color: '#FFFFFF' }}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </>
  );
}
