'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame, Zap, Shield, AlertTriangle, Lock, PauseCircle, MessageSquare, FileText, Search, Clipboard } from 'lucide-react';
import { aiActionSuggestions } from '@/lib/vendor/aiActionSuggestions';

interface AIActionSuggestionWallProps {
  isDarkMode?: boolean;
}

const iconMap = {
  flame: Flame,
  zap: Zap,
  shield: Shield,
  alert: AlertTriangle,
  lock: Lock,
  pause: PauseCircle,
  message: MessageSquare,
  file: FileText,
  search: Search,
  clipboard: Clipboard,
};

export function AIActionSuggestionWall({ isDarkMode = false }: AIActionSuggestionWallProps) {
  return (
    <Card
      className="h-full flex flex-col"
      style={{
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : '#FFFFFF',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <CardHeader className="pb-4 pt-6">
        <CardTitle className="text-lg font-bold mb-1" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
          AI Action Suggestion Wall
        </CardTitle>
        <p className="text-xs" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
          Critical insights and AI-driven recommendations
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div className="relative overflow-hidden h-[665px]">
          <ScrollArea
            className="h-full w-full"
            viewportClassName="scrollbar-thin overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: isDarkMode ? '#3a3a3a #1a1a1a' : '#d1d1d1 #f5f5f5',
            }}
          >
            <div className="space-y-3 pr-2">
              {aiActionSuggestions.map((action) => {
                const IconComponent = iconMap[action.icon];
                return (
                  <div
                    key={action.id}
                    className="rounded-xl p-4 text-sm shadow-inner hover:border-amber-400/40 transition-colors"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(26,26,26,0.45)' : '#f8f9fa',
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#E5E5E5',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: isDarkMode ? '#e5e7eb' : '#4a4a4a',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent
                        className="w-5 h-5 shrink-0"
                        style={{ color: action.color }}
                      />
                      <span className="text-base font-semibold" style={{ color: isDarkMode ? '#FFFFFF' : '#010101' }}>
                        {action.headline}
                      </span>
                    </div>
                    <div
                      className="text-xs uppercase tracking-wide mb-1"
                      style={{ color: action.color }}
                    >
                      {action.topic}
                    </div>
                    <p className="text-xs mb-2" style={{ color: isDarkMode ? '#939394' : '#666666' }}>
                      {action.description}
                    </p>
                    <p className="text-xs" style={{ color: isDarkMode ? '#c084fc' : '#9333ea' }}>
                      {action.action}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
