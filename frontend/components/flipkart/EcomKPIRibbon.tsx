"use client";

import { Card } from "@/components/ui/card";

/**
 * E-commerce KPI ribbon – placeholder with canonical Tailwind classes.
 * Replace or extend with real e-commerce KPIs (orders, NPS, returns, etc.).
 */
export function EcomKPIRibbon() {
  return (
    <Card className="border border-(--border) bg-(--card) shadow-lg transition-all duration-200 hover:bg-(--background) p-6">
      <div className="text-sm text-muted-foreground">E-commerce KPI ribbon</div>
    </Card>
  );
}
