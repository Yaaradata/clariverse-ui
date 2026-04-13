"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export type DateRange = {
  start: string;
  end: string;
};

interface UnifiedFiltersBarProps {
  dateFilterPreset: string;
  dateRange: DateRange;
  onPresetChange: (value: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onApply: () => void;
  onOpenAI: () => void;
  /** Compact row for embedded dashboards (e.g. role-based); omits hero title and in-bar AI CTA. */
  variant?: "full" | "embedded";
}

export function UnifiedFiltersBar({
  dateFilterPreset,
  dateRange,
  onPresetChange,
  onDateRangeChange,
  onApply,
  onOpenAI,
  variant = "full",
}: UnifiedFiltersBarProps) {
  const activeFilters = useMemo(() => {
    const items: string[] = [];

    if (dateFilterPreset === "Custom" && dateRange.start && dateRange.end) {
      items.push(`Dates: ${dateRange.start} → ${dateRange.end}`);
    } else {
      items.push(`Preset: ${dateFilterPreset}`);
    }

    return items;
  }, [dateFilterPreset, dateRange]);

  const controlsRow = (
    <div className={`flex flex-wrap items-center gap-2 ${variant === "embedded" ? "justify-start" : "justify-end"}`}>
      {variant === "full" ? null : (
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
          Period
        </span>
      )}
      <span className={`text-xs text-muted-foreground whitespace-nowrap ${variant === "full" ? "" : "hidden sm:inline"}`}>
        Date:
      </span>
      <Select value={dateFilterPreset} onValueChange={onPresetChange}>
        <SelectTrigger className="w-[160px] border border-(--border) bg-(--card) text-(--foreground) text-sm h-[38px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent className="border border-(--border) bg-(--card) text-(--foreground) z-9999 w-[160px] min-w-[160px] max-w-[160px]">
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Current day">Current day</SelectItem>
          <SelectItem value="Current Month">Current Month</SelectItem>
          <SelectItem value="One Week">One Week</SelectItem>
          <SelectItem value="One Month">One Month</SelectItem>
          <SelectItem value="6 Months">6 Months</SelectItem>
          <SelectItem value="Custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      {dateFilterPreset === "Custom" && (
        <>
          <input
            type="date"
            value={dateRange.start}
            onChange={(event) => onDateRangeChange({ ...dateRange, start: event.target.value })}
            className="border border-(--border) bg-(--card) text-(--foreground) text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b90abd] h-[38px]"
          />
          <span className="text-xs text-muted-foreground">→</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(event) => onDateRangeChange({ ...dateRange, end: event.target.value })}
            className="border border-(--border) bg-(--card) text-(--foreground) text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b90abd] h-[38px]"
          />
        </>
      )}

      <Button
        size="sm"
        type="button"
        onClick={onApply}
        className="bg-linear-to-r from-[#b90abd] to-[#5332ff] hover:from-[#a009b3] hover:to-[#4a2ae6] text-white transition-all duration-200 h-[38px]"
      >
        Apply
      </Button>
      {variant === "full" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenAI}
          className="h-[38px] border-[#5332ff]/40 text-foreground"
        >
          ✨ AI day
        </Button>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-4 animate-slide-down">
      {variant === "embedded" ? (
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">{controlsRow}</div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Unified Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              ✨AI-powered insights across Email, Chat, Ticket, Social & Voice
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-end">
              <Button
                onClick={onOpenAI}
                className="bg-linear-to-r from-[#b90abd] to-[#5332ff] hover:from-[#a009b3] hover:to-[#4a2ae6] text-white transition-all duration-200 group h-[38px] px-6"
              >
                <span className="text-lg mr-2 group-hover:rotate-180 transition-transform duration-500 inline-block">✨</span>
                Generate your day in 2 minutes
              </Button>
            </div>
            <div className="flex flex-col gap-3 items-end">{controlsRow}</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="uppercase tracking-wide text-muted-foreground">Active Filters</span>
        {activeFilters.length === 0 && (
          <Badge variant="outline" className="border-(--border) text-muted-foreground">
            None
          </Badge>
        )}
        {activeFilters.map((filter) => (
          <Badge key={filter} variant="secondary" className="border border-(--border) bg-(--card) text-(--foreground)">
            {filter}
          </Badge>
        ))}
      </div>
    </div>
  );
}
