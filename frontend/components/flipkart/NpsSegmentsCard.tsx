"use client";

import { Card } from "@/components/ui/card";

/**
 * NPS segments card – placeholder with canonical Tailwind classes.
 * Replace or extend with real NPS segment breakdown (promoters, passives, detractors).
 */
export function NpsSegmentsCard() {
  return (
    <Card className="border border-(--border) bg-(--card) p-4 shadow-lg transition-all duration-200">
      <div className="text-sm text-muted-foreground">NPS segments</div>
    </Card>
  );
}
