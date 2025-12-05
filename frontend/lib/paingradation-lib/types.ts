// Pain Intelligence Types

export interface CustomerPainIndexData {
  score: number; // 0-100
  label: 'Low' | 'Moderate' | 'High' | 'Critical';
  trend: number; // +/- change vs yesterday
  trendDirection: 'up' | 'down' | 'stable';
  components: {
    csat: number;
    negativeSentiment: number;
    repeatContactRate: number;
    escalationRate: number;
    avgDaysToResolve: number;
  };
}

export interface PainVolumeData {
  percentage: number;
  totalCases: number;
  sparklineData: number[];
  breakdown: {
    deliveryPromiseBroken: number;
    refundDelay: number;
    wrongDamagedItem: number;
    returnReplacementFriction: number;
  };
}

export interface SeverePainIncidentsData {
  totalCases: number;
  breakdown: {
    category: string;
    percentage: number;
    count: number;
  }[];
  criteria: string[];
}

export interface RepeatContactRateData {
  percentage: number;
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendlineData: number[];
  ordersAffected: number;
}

export interface TimeInPainData {
  avgDays: number;
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  buckets: {
    label: string;
    count: number;
    percentage: number;
    isHighlighted: boolean;
  }[];
}

export interface PainHealthData {
  customerPainIndex: CustomerPainIndexData;
  painVolume: PainVolumeData;
  severePainIncidents: SeverePainIncidentsData;
  repeatContactRate: RepeatContactRateData;
  timeInPain: TimeInPainData;
  lastUpdated: string;
}

