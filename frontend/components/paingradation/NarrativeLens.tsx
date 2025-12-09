'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
  const topPhrases = phrases.slice(0, 11);

  return (
    <Card className="bg-[#0d0d0d] border border-[#2a2a2a] h-full flex flex-col">
      <CardHeader className="pb-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#b90abd]/10">
            <MessageSquare className="w-5 h-5 text-[#b90abd]" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-white mb-1">
            VoC Friction Drivers
            </CardTitle>
            <p className="text-xs text-gray-400">
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
              scrollbarColor: '#3a3a3a #1a1a1a',
            }}
          >
            <div className="space-y-2 pr-2 pb-2">
              {topPhrases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-600 mb-4" />
                  <p className="text-sm text-gray-400 mb-2">No complaint phrases available</p>
                  <p className="text-xs text-gray-500">
                    Complaint phrases will appear here when data is available
                  </p>
                </div>
              ) : (
                topPhrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#b90abd]/50 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#b90abd]/20 text-[#b90abd] text-xs font-bold shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white leading-relaxed group-hover:text-[#b90abd] transition-colors">
                            "{phrase.phrase}"
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-400">
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
