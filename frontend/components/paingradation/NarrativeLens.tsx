'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from './useTheme';

interface ComplaintPhrase {
  phrase: string;
  count: number;
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
}

interface NarrativeLensProps {
  phrases: ComplaintPhrase[];
}

export function NarrativeLens({ phrases }: NarrativeLensProps) {
  const isDarkMode = useTheme();
  const topPhrases = phrases.slice(0, 11);

  return (
    <Card className="h-full flex flex-col" style={{ backgroundColor: isDarkMode ? '#0d0d0d' : '#FFFFFF', borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5', borderWidth: '1px', borderStyle: 'solid' }}>
      <CardHeader className="pb-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#b90abd]/10">
            <MessageSquare className="w-5 h-5 text-[#b90abd]" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
            VoC Friction Drivers
            </CardTitle>
            <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
              Issue Statement Extractor - Top 10 complaint phrases
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden pt-0 pb-2 px-4 py-20 pr-2">
        <div className="relative overflow-hidden h-[665px]">
          <ScrollArea
            className="h-full w-full"
            viewportClassName="scrollbar-thin overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5',
            }}
          >
            <div className="space-y-2 pr-2 pb-2">
              {topPhrases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="w-12 h-12 mb-4" style={{ color: isDarkMode ? '#939394' : '#666666' }} />
                  <p className="text-sm mb-2" style={{ color: isDarkMode ? '#939394' : '#666666' }}>No complaint phrases available</p>
                  <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                    Complaint phrases will appear here when data is available
                  </p>
                </div>
              ) : (
                topPhrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg hover:border-[#b90abd]/50 transition-all duration-200 group"
                    style={{
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                      borderColor: isDarkMode ? '#2a2a2a' : '#E5E5E5',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#b90abd]/20 text-[#b90abd] text-xs font-bold shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-relaxed group-hover:text-[#b90abd] transition-colors" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                            "{phrase.phrase}"
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                              {phrase.count.toLocaleString()} occurrences
                            </span>
                            <span className="text-xs text-purple-400 font-medium">
                              {phrase.percentage.toFixed(1)}%
                            </span>
                            {phrase.trend && (
                              <div className="flex items-center gap-1">
                                {phrase.trend === 'up' ? (
                                  <TrendingUp className="w-3 h-3 text-red-400" />
                                ) : phrase.trend === 'down' ? (
                                  <TrendingDown className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Minus className="w-3 h-3 text-gray-400" />
                                )}
                                <span
                                  className={`text-xs ${
                                    phrase.trend === 'up'
                                      ? 'text-red-400'
                                      : phrase.trend === 'down'
                                      ? 'text-green-400'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {phrase.trend === 'up' ? 'Rising' : phrase.trend === 'down' ? 'Declining' : 'Stable'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
