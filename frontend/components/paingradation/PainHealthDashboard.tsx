'use client';

import { useState } from 'react';
import { CustomerPainIndex } from './CustomerPainIndex';
import { PainVolume } from './PainVolume';
import { SeverePainIncidents } from './SeverePainIncidents';
import { RepeatContactRate } from './RepeatContactRate';
import { TimeInPain } from './TimeInPain';
import { painHealthData, PainHealthData } from '@/lib/paingradation-lib';
import { useTheme } from './useTheme';

export function PainHealthDashboard() {
  const [data] = useState<PainHealthData>(painHealthData);
  const isDarkMode = useTheme();

  return (
    <div className="space-y-6">
      {/* Hero KPI Cards - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Customer Pain Index - Larger card */}
        <div className="lg:col-span-1">
          <CustomerPainIndex data={data.customerPainIndex} isDarkMode={isDarkMode} />
        </div>

        {/* Pain Volume */}
        <div className="lg:col-span-1">
          <PainVolume data={data.painVolume} isDarkMode={isDarkMode} />
        </div>

        {/* Severe Pain Incidents */}
        <div className="lg:col-span-1">
          <SeverePainIncidents data={data.severePainIncidents} isDarkMode={isDarkMode} />
        </div>

        {/* Repeat Contact Rate */}
        <div className="lg:col-span-1">
          <RepeatContactRate data={data.repeatContactRate} isDarkMode={isDarkMode} />
        </div>

        {/* Time-in-Pain */}
        <div className="lg:col-span-1">
          <TimeInPain data={data.timeInPain} isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}

