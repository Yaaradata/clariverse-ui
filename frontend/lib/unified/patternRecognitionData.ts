export interface EntityBubble {
  id: string;
  name: string;
  frequency: number; // Determines bubble size
  severity: number; // 0-10, determines bubble color and position
  trend: "rising" | "stable" | "declining";
  trendPercentage?: number;
  channels: {
    email: boolean;
    voice: boolean;
    chat: boolean;
    social: boolean;
    ticket: boolean;
  };
  x?: number; // Calculated position
  y?: number; // Calculated position
  relatedEntities?: string[]; // For clustering
}

export interface EntityBubbleData {
  entities: EntityBubble[];
  aiInsight: string;
  aiRecommendedAction: string;
}

export function getEntityBubbleData(): EntityBubbleData {
  const entities: EntityBubble[] = [
    {
      id: "kyc",
      name: "KYC",
      frequency: 850,
      severity: 8.5,
      trend: "rising",
      trendPercentage: 27,
      channels: { email: true, voice: true, chat: true, social: false, ticket: true },
      relatedEntities: ["loans", "transfers"],
    },
    {
      id: "cards",
      name: "Cards",
      frequency: 720,
      severity: 7.8,
      trend: "rising",
      trendPercentage: 18,
      channels: { email: true, voice: true, chat: true, social: true, ticket: true },
      relatedEntities: ["fraud", "mobile-app"],
    },
    {
      id: "fraud",
      name: "Fraud",
      frequency: 680,
      severity: 9.2,
      trend: "rising",
      trendPercentage: 32,
      channels: { email: true, voice: true, chat: true, social: true, ticket: true },
      relatedEntities: ["cards", "mobile-app"],
    },
    {
      id: "transfers",
      name: "Transfers",
      frequency: 540,
      severity: 6.5,
      trend: "stable",
      channels: { email: true, voice: true, chat: false, social: false, ticket: true },
      relatedEntities: ["kyc", "loans"],
    },
    {
      id: "loans",
      name: "Loans",
      frequency: 480,
      severity: 7.2,
      trend: "rising",
      trendPercentage: 15,
      channels: { email: true, voice: true, chat: false, social: false, ticket: true },
      relatedEntities: ["kyc", "transfers"],
    },
    {
      id: "mobile-app",
      name: "Mobile App",
      frequency: 620,
      severity: 6.8,
      trend: "rising",
      trendPercentage: 22,
      channels: { email: true, voice: false, chat: true, social: true, ticket: false },
      relatedEntities: ["cards", "fraud"],
    },
    {
      id: "branch-services",
      name: "Branch Services",
      frequency: 320,
      severity: 4.5,
      trend: "declining",
      channels: { email: false, voice: true, chat: false, social: false, ticket: true },
    },
  ];

  // Calculate positions using force-directed layout
  // High severity entities toward center, low severity outward
  // Related entities cluster closer
  const centerX = 400;
  const centerY = 300;
  const maxRadius = 200;

  entities.forEach((entity, index) => {
    // Base position on severity (high severity = closer to center)
    const severityFactor = entity.severity / 10; // 0-1
    const distanceFromCenter = maxRadius * (1 - severityFactor * 0.6); // High severity closer
    
    // Angle based on index with some variation
    const baseAngle = (index / entities.length) * Math.PI * 2;
    const angle = baseAngle + (Math.random() - 0.5) * 0.5; // Add some randomness
    
    entity.x = centerX + Math.cos(angle) * distanceFromCenter;
    entity.y = centerY + Math.sin(angle) * distanceFromCenter;
  });

  return {
    entities,
    aiInsight: "KYC verification issues and Card operations are dominating this week, driven mainly by repeated document delays and card decline escalations.",
    aiRecommendedAction: "Enable proactive KYC status notifications and re-route high-severity card queries to experienced agents.",
  };
}
