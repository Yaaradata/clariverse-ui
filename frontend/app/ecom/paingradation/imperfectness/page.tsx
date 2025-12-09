'use client';

import { ImperfectnessKPICards } from '@/components/paingradation/ImperfectnessKPICards';
import { DominantClusterChart } from '@/components/paingradation/DominantClusterChart';
import { NarrativeLens } from '@/components/paingradation/NarrativeLens';
import { ImperfectOrderDistribution } from '@/components/paingradation/ImperfectOrderDistribution';
import { AIImperfectOrderInsightWall } from '@/components/paingradation/AIImperfectOrderInsightWall';

// Helper function to generate random channel distribution (1-3 channels, not all)
function generateRandomChannels(totalCount: number, seed: number): Array<{ channel: string; count: number; color: string }> {
  const allChannels = [
    { channel: 'Email', color: '#5332ff' },
    { channel: 'Voice', color: '#ef4444' },
    { channel: 'Chat', color: '#10b981' },
    { channel: 'Tickets', color: '#f59e0b' },
    { channel: 'Social Media', color: '#ec4899' },
  ];

  // Use seed for consistent randomness
  const numChannels = 1 + (seed % 3); // 1, 2, or 3 channels
  const shuffled = [...allChannels].sort(() => (seed % 2) - 0.5);
  const selectedChannels = shuffled.slice(0, numChannels);

  // Distribute totalCount across selected channels
  const channelCounts: number[] = [];
  let remaining = totalCount;

  for (let i = 0; i < selectedChannels.length; i++) {
    if (i === selectedChannels.length - 1) {
      channelCounts.push(remaining);
    } else {
      // Random distribution between 30% and 60% of remaining
      const minPercent = 0.3;
      const maxPercent = 0.6;
      const percent = minPercent + ((seed + i) % 100) / 100 * (maxPercent - minPercent);
      const count = Math.max(1, Math.floor(remaining * percent));
      channelCounts.push(count);
      remaining -= count;
    }
  }

  return selectedChannels.map((ch, idx) => ({
    channel: ch.channel,
    count: channelCounts[idx],
    color: ch.color,
  }));
}

export default function ImperfectnessPage() {
  // Mock data - Replace with actual API data
  const kpiData = {
    imperfectOrderCount: 127,
    imperfectOrderPercentage: 18.5,
    totalOrders: 685,
    businessImpactAmount: 2450000,
    businessImpactTopic: 'Payment Failures',
    maxImperfectOrdersRegion: 'Mumbai',
    maxImperfectOrdersCount: 42,
  };

  // Mock complaint phrases data - Replace with actual API data
  const complaintPhrases = [
    {
      phrase: 'I received the wrong item completely different from what I ordered',
      count: 245,
      percentage: 18.5,
      trend: 'up' as const,
    },
    {
      phrase: 'The package was damaged when it arrived and items inside were broken',
      count: 198,
      percentage: 15.0,
      trend: 'up' as const,
    },
    {
      phrase: 'Order was delivered 3 days late without any prior notification',
      count: 187,
      percentage: 14.1,
      trend: 'stable' as const,
    },
    {
      phrase: 'Payment was deducted but order shows as cancelled in the system',
      count: 165,
      percentage: 12.5,
      trend: 'up' as const,
    },
    {
      phrase: 'Refund amount has not been credited to my account even after 7 days',
      count: 142,
      percentage: 10.7,
      trend: 'down' as const,
    },
    {
      phrase: 'Product quality is very poor and does not match the description at all',
      count: 128,
      percentage: 9.7,
      trend: 'up' as const,
    },
    {
      phrase: 'Some items from my order were missing and I only received partial delivery',
      count: 115,
      percentage: 8.7,
      trend: 'stable' as const,
    },
    {
      phrase: 'Delivery person marked as delivered but I never received the package',
      count: 98,
      percentage: 7.4,
      trend: 'up' as const,
    },
    {
      phrase: 'The size I ordered does not fit and the color is completely different',
      count: 87,
      percentage: 6.6,
      trend: 'stable' as const,
    },
    {
      phrase: 'Replacement process is very unclear and customer service is not helping',
      count: 76,
      percentage: 5.7,
      trend: 'down' as const,
    },
  ];

  // Mock cluster data - Replace with actual API data
  const clusterData: Array<{
    clusterLabel: string;
    mainTopic: string;
    totalCount: number;
    channels: Array<{ channel: string; count: number; color: string }>;
    issues: Array<{
      pincode: string;
      address: string;
      city: string;
      cityTier: 'tier1' | 'tier2' | 'tier3' | 'northeast' | 'islands';
      orderId?: string;
      issueType?: string;
    }>;
  }> = [
    {
      clusterLabel: 'Order auto-cancelled but payment captured',
      mainTopic: 'Payment & Order Status Mismatch',
      totalCount: 25,
      channels: generateRandomChannels(25, 1),
      issues: [
        // Tier 1 Cities
        {
          pincode: '400001',
          address: '123, Marine Drive, Colaba',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12345',
          issueType: 'Payment Gateway Error',
        },
        {
          pincode: '400052',
          address: '456, Bandra West, Bandra',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12346',
          issueType: 'Card Declined',
        },
        {
          pincode: '400053',
          address: '789, Andheri West, Andheri',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12347',
          issueType: 'Payment Timeout',
        },
        {
          pincode: '560001',
          address: '321, MG Road, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12348',
          issueType: 'Payment Gateway Error',
        },
        {
          pincode: '110001',
          address: '654, Connaught Place, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12349',
          issueType: 'Card Declined',
        },
        {
          pincode: '600001',
          address: '258, Mount Road, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12352',
          issueType: 'Card Declined',
        },
        // Tier 2 Cities
        {
          pincode: '411001',
          address: '987, FC Road, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12350',
          issueType: 'Payment Timeout',
        },
        {
          pincode: '380001',
          address: '147, CG Road, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12351',
          issueType: 'Payment Gateway Error',
        },
        // Tier 3 Cities
        {
          pincode: '302001',
          address: '258, C Scheme, Jaipur',
          city: 'Jaipur',
          cityTier: 'tier3' as const,
          orderId: 'ORD-12365',
          issueType: 'Payment Gateway Error',
        },
        {
          pincode: '500001',
          address: '147, Abids, Hyderabad',
          city: 'Hyderabad',
          cityTier: 'tier3' as const,
          orderId: 'ORD-12366',
          issueType: 'Card Declined',
        },
        // Northeast & Hill States
        {
          pincode: '793001',
          address: '123, Police Bazaar, Shillong',
          city: 'Shillong',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12380',
          issueType: 'Payment Gateway Error',
        },
        {
          pincode: '737101',
          address: '456, MG Marg, Gangtok',
          city: 'Gangtok',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12381',
          issueType: 'Card Declined',
        },
        {
          pincode: '795001',
          address: '321, Thangal Bazaar, Imphal',
          city: 'Imphal',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12382',
          issueType: 'Payment Timeout',
        },
        {
          pincode: '791001',
          address: '654, Zero Point, Itanagar',
          city: 'Itanagar',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12383',
          issueType: 'Payment Gateway Error',
        },
        {
          pincode: '796001',
          address: '852, Zarkawt, Aizawl',
          city: 'Aizawl',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12384',
          issueType: 'Card Declined',
        },
        // Islands & Remote Areas
        {
          pincode: '744101',
          address: '789, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12385',
          issueType: 'Payment Timeout',
        },
        {
          pincode: '682551',
          address: '147, Lakshadweep, Kavaratti',
          city: 'Kavaratti',
          cityTier: 'islands' as const,
          orderId: 'ORD-12386',
          issueType: 'Payment Gateway Error',
        },
        {
          pincode: '744102',
          address: '258, Haddo, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12387',
          issueType: 'Card Declined',
        },
        {
          pincode: '682001',
          address: '369, Willingdon Island, Kochi',
          city: 'Kochi',
          cityTier: 'islands' as const,
          orderId: 'ORD-12388',
          issueType: 'Payment Timeout',
        },
      ],
    },
    {
      clusterLabel: 'Wrong item delivered',
      mainTopic: 'Fulfilment Accuracy Issues',
      totalCount: 22,
      channels: generateRandomChannels(22, 2),
      issues: [
        {
          pincode: '400001',
          address: '123, Marine Drive, Colaba',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12420',
          issueType: 'Wrong item delivered',
        },
        {
          pincode: '560001',
          address: '321, MG Road, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12421',
          issueType: 'Wrong item delivered',
        },
        {
          pincode: '110001',
          address: '654, Connaught Place, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12422',
          issueType: 'Wrong item delivered',
        },
        {
          pincode: '411001',
          address: '987, FC Road, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12423',
          issueType: 'Wrong item delivered',
        },
        {
          pincode: '793001',
          address: '123, Police Bazaar, Shillong',
          city: 'Shillong',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12424',
          issueType: 'Wrong item delivered',
        },
        {
          pincode: '744101',
          address: '789, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12425',
          issueType: 'Wrong item delivered',
        },
      ],
    },
    {
      clusterLabel: 'Missing item from order',
      mainTopic: 'Fulfilment Accuracy Issues',
      totalCount: 18,
      channels: generateRandomChannels(18, 3),
      issues: [
        {
          pincode: '400052',
          address: '456, Bandra West, Bandra',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12426',
          issueType: 'Missing item from order',
        },
        {
          pincode: '600001',
          address: '258, Mount Road, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12427',
          issueType: 'Missing item from order',
        },
        {
          pincode: '380001',
          address: '147, CG Road, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12428',
          issueType: 'Missing item from order',
        },
        {
          pincode: '737101',
          address: '456, MG Marg, Gangtok',
          city: 'Gangtok',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12429',
          issueType: 'Missing item from order',
        },
        {
          pincode: '682551',
          address: '147, Lakshadweep, Kavaratti',
          city: 'Kavaratti',
          cityTier: 'islands' as const,
          orderId: 'ORD-12430',
          issueType: 'Missing item from order',
        },
      ],
    },
    {
      clusterLabel: 'Incorrect quantity',
      mainTopic: 'Fulfilment Accuracy Issues',
      totalCount: 15,
      channels: generateRandomChannels(15, 4),
      issues: [
        {
          pincode: '400053',
          address: '789, Andheri West, Andheri',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12450',
          issueType: 'Incorrect quantity',
        },
        {
          pincode: '560001',
          address: '321, MG Road, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12451',
          issueType: 'Incorrect quantity',
        },
        {
          pincode: '110001',
          address: '654, Connaught Place, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12452',
          issueType: 'Incorrect quantity',
        },
        {
          pincode: '411001',
          address: '987, FC Road, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12453',
          issueType: 'Incorrect quantity',
        },
        {
          pincode: '795001',
          address: '321, Thangal Bazaar, Imphal',
          city: 'Imphal',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12454',
          issueType: 'Incorrect quantity',
        },
        {
          pincode: '744101',
          address: '789, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12455',
          issueType: 'Incorrect quantity',
        },
      ],
    },
    {
      clusterLabel: 'Partial delivery without prior communication',
      mainTopic: 'Fulfilment Accuracy Issues',
      totalCount: 12,
      channels: generateRandomChannels(12, 5),
      issues: [
        {
          pincode: '600001',
          address: '258, Mount Road, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12456',
          issueType: 'Partial delivery without prior communication',
        },
        {
          pincode: '380001',
          address: '147, CG Road, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12457',
          issueType: 'Partial delivery without prior communication',
        },
        {
          pincode: '796001',
          address: '654, Zarkawt, Aizawl',
          city: 'Aizawl',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12458',
          issueType: 'Partial delivery without prior communication',
        },
        {
          pincode: '682551',
          address: '147, Lakshadweep, Kavaratti',
          city: 'Kavaratti',
          cityTier: 'islands' as const,
          orderId: 'ORD-12459',
          issueType: 'Partial delivery without prior communication',
        },
      ],
    },
    {
      clusterLabel: 'Replacement delivered but incorrect',
      mainTopic: 'Fulfilment Accuracy Issues',
      totalCount: 10,
      channels: generateRandomChannels(10, 6),
      issues: [
        {
          pincode: '400001',
          address: '123, Marine Drive, Colaba',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12460',
          issueType: 'Replacement delivered but incorrect',
        },
        {
          pincode: '560025',
          address: '753, Indiranagar, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12461',
          issueType: 'Replacement delivered but incorrect',
        },
        {
          pincode: '797001',
          address: '369, Kohima Town, Kohima',
          city: 'Kohima',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12462',
          issueType: 'Replacement delivered but incorrect',
        },
        {
          pincode: '744102',
          address: '852, Haddo, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12463',
          issueType: 'Replacement delivered but incorrect',
        },
      ],
    },
    {
      clusterLabel: 'Delivered late vs promised time',
      mainTopic: 'Delivery Experience Complaints',
      totalCount: 20,
      channels: generateRandomChannels(20, 7),
      issues: [
        // Tier 1 Cities
        {
          pincode: '400070',
          address: '159, Powai, Mumbai',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12353',
          issueType: 'Late Delivery',
        },
        {
          pincode: '560025',
          address: '753, Indiranagar, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12354',
          issueType: 'Delivery Not Attempted',
        },
        {
          pincode: '110092',
          address: '852, Dwarka, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12355',
          issueType: 'Wrong Address',
        },
        {
          pincode: '600017',
          address: '147, T Nagar, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12356',
          issueType: 'Late Delivery',
        },
        // Tier 2 Cities
        {
          pincode: '411004',
          address: '369, Koregaon Park, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12357',
          issueType: 'Late Delivery',
        },
        {
          pincode: '380009',
          address: '741, Satellite, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12358',
          issueType: 'Delivery Not Attempted',
        },
        // Tier 3 Cities
        {
          pincode: '302004',
          address: '258, Malviya Nagar, Jaipur',
          city: 'Jaipur',
          cityTier: 'tier3' as const,
          orderId: 'ORD-12359',
          issueType: 'Wrong Address',
        },
        {
          pincode: '500032',
          address: '147, Banjara Hills, Hyderabad',
          city: 'Hyderabad',
          cityTier: 'tier3' as const,
          orderId: 'ORD-12360',
          issueType: 'Late Delivery',
        },
        // Northeast & Hill States
        {
          pincode: '795001',
          address: '321, Thangal Bazaar, Imphal',
          city: 'Imphal',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12389',
          issueType: 'Late Delivery',
        },
        {
          pincode: '796001',
          address: '654, Zarkawt, Aizawl',
          city: 'Aizawl',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12390',
          issueType: 'Wrong Address',
        },
        {
          pincode: '797001',
          address: '852, Kohima Town, Kohima',
          city: 'Kohima',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12391',
          issueType: 'Delivery Not Attempted',
        },
        {
          pincode: '790001',
          address: '147, Naharlagun, Arunachal Pradesh',
          city: 'Naharlagun',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12392',
          issueType: 'Late Delivery',
        },
        {
          pincode: '798001',
          address: '258, Dimapur, Nagaland',
          city: 'Dimapur',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12393',
          issueType: 'Wrong Address',
        },
        // Islands & Remote Areas
        {
          pincode: '682001',
          address: '147, Willingdon Island, Kochi',
          city: 'Kochi',
          cityTier: 'islands' as const,
          orderId: 'ORD-12394',
          issueType: 'Late Delivery',
        },
        {
          pincode: '744101',
          address: '369, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12395',
          issueType: 'Delivery Not Attempted',
        },
        {
          pincode: '682551',
          address: '741, Lakshadweep, Kavaratti',
          city: 'Kavaratti',
          cityTier: 'islands' as const,
          orderId: 'ORD-12396',
          issueType: 'Wrong Address',
        },
        {
          pincode: '744102',
          address: '852, Haddo, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12397',
          issueType: 'Late Delivery',
        },
      ],
    },
    {
      clusterLabel: 'Customer says "not delivered" but platform shows "delivered"',
      mainTopic: 'Delivery Experience Complaints',
      totalCount: 15,
      channels: generateRandomChannels(15, 8),
      issues: [
        {
          pincode: '400070',
          address: '159, Powai, Mumbai',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12431',
          issueType: 'Not delivered',
        },
        {
          pincode: '560025',
          address: '753, Indiranagar, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12432',
          issueType: 'Not delivered',
        },
        {
          pincode: '795001',
          address: '321, Thangal Bazaar, Imphal',
          city: 'Imphal',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12433',
          issueType: 'Not delivered',
        },
        {
          pincode: '744102',
          address: '852, Haddo, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12434',
          issueType: 'Not delivered',
        },
      ],
    },
    {
      clusterLabel: 'Rider did not follow instructions',
      mainTopic: 'Delivery Experience Complaints',
      totalCount: 8,
      channels: generateRandomChannels(8, 9),
      issues: [
        {
          pincode: '400070',
          address: '159, Powai, Mumbai',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12464',
          issueType: 'Rider did not follow instructions',
        },
        {
          pincode: '110092',
          address: '852, Dwarka, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12465',
          issueType: 'Rider did not follow instructions',
        },
        {
          pincode: '791001',
          address: '852, Zero Point, Itanagar',
          city: 'Itanagar',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12466',
          issueType: 'Rider did not follow instructions',
        },
        {
          pincode: '682001',
          address: '147, Willingdon Island, Kochi',
          city: 'Kochi',
          cityTier: 'islands' as const,
          orderId: 'ORD-12467',
          issueType: 'Rider did not follow instructions',
        },
      ],
    },
    {
      clusterLabel: 'Delivery attempt confusion',
      mainTopic: 'Delivery Experience Complaints',
      totalCount: 7,
      channels: generateRandomChannels(7, 10),
      issues: [
        {
          pincode: '560025',
          address: '753, Indiranagar, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12468',
          issueType: 'Delivery attempt confusion',
        },
        {
          pincode: '411004',
          address: '369, Koregaon Park, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12469',
          issueType: 'Delivery attempt confusion',
        },
        {
          pincode: '737101',
          address: '456, MG Marg, Gangtok',
          city: 'Gangtok',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12470',
          issueType: 'Delivery attempt confusion',
        },
        {
          pincode: '744101',
          address: '789, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12471',
          issueType: 'Delivery attempt confusion',
        },
      ],
    },
    {
      clusterLabel: 'Damaged item',
      mainTopic: 'Product Condition Complaints',
      totalCount: 18,
      channels: generateRandomChannels(18, 11),
      issues: [
        // Tier 1 Cities
        {
          pincode: '400028',
          address: '456, Worli, Mumbai',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12358',
          issueType: 'Damaged Product',
        },
        {
          pincode: '560004',
          address: '789, Malleswaram, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12359',
          issueType: 'Wrong Product',
        },
        {
          pincode: '110017',
          address: '321, Vasant Kunj, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12360',
          issueType: 'Defective Item',
        },
        {
          pincode: '600017',
          address: '147, T Nagar, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12361',
          issueType: 'Defective Item',
        },
        // Tier 2 Cities
        {
          pincode: '411014',
          address: '654, Baner, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12362',
          issueType: 'Damaged Product',
        },
        {
          pincode: '380015',
          address: '987, Prahlad Nagar, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12363',
          issueType: 'Wrong Product',
        },
        // Tier 3 Cities
        {
          pincode: '302001',
          address: '258, C Scheme, Jaipur',
          city: 'Jaipur',
          cityTier: 'tier3' as const,
          orderId: 'ORD-12364',
          issueType: 'Damaged Product',
        },
        {
          pincode: '500001',
          address: '147, Abids, Hyderabad',
          city: 'Hyderabad',
          cityTier: 'tier3' as const,
          orderId: 'ORD-12365',
          issueType: 'Wrong Product',
        },
        // Northeast & Hill States
        {
          pincode: '791001',
          address: '852, Zero Point, Itanagar',
          city: 'Itanagar',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12398',
          issueType: 'Damaged Product',
        },
        {
          pincode: '797001',
          address: '369, Kohima Town, Kohima',
          city: 'Kohima',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12399',
          issueType: 'Wrong Product',
        },
        {
          pincode: '793001',
          address: '147, Police Bazaar, Shillong',
          city: 'Shillong',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12400',
          issueType: 'Defective Item',
        },
        {
          pincode: '737101',
          address: '258, MG Marg, Gangtok',
          city: 'Gangtok',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12401',
          issueType: 'Damaged Product',
        },
        {
          pincode: '796001',
          address: '741, Zarkawt, Aizawl',
          city: 'Aizawl',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12402',
          issueType: 'Wrong Product',
        },
        // Islands & Remote Areas
        {
          pincode: '682551',
          address: '741, Lakshadweep, Kavaratti',
          city: 'Kavaratti',
          cityTier: 'islands' as const,
          orderId: 'ORD-12403',
          issueType: 'Defective Item',
        },
        {
          pincode: '744101',
          address: '852, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12404',
          issueType: 'Damaged Product',
        },
        {
          pincode: '682001',
          address: '369, Willingdon Island, Kochi',
          city: 'Kochi',
          cityTier: 'islands' as const,
          orderId: 'ORD-12405',
          issueType: 'Wrong Product',
        },
        {
          pincode: '744102',
          address: '147, Haddo, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12406',
          issueType: 'Defective Item',
        },
      ],
    },
    {
      clusterLabel: 'Defective item',
      mainTopic: 'Product Condition Complaints',
      totalCount: 12,
      channels: generateRandomChannels(12, 12),
      issues: [
        {
          pincode: '110017',
          address: '321, Vasant Kunj, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12435',
          issueType: 'Defective item',
        },
        {
          pincode: '411014',
          address: '654, Baner, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12436',
          issueType: 'Defective item',
        },
        {
          pincode: '791001',
          address: '852, Zero Point, Itanagar',
          city: 'Itanagar',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12437',
          issueType: 'Defective item',
        },
        {
          pincode: '682001',
          address: '369, Willingdon Island, Kochi',
          city: 'Kochi',
          cityTier: 'islands' as const,
          orderId: 'ORD-12438',
          issueType: 'Defective item',
        },
      ],
    },
    {
      clusterLabel: 'Tampered package',
      mainTopic: 'Product Condition Complaints',
      totalCount: 9,
      channels: generateRandomChannels(9, 13),
      issues: [
        {
          pincode: '400028',
          address: '456, Worli, Mumbai',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12472',
          issueType: 'Tampered package',
        },
        {
          pincode: '560004',
          address: '789, Malleswaram, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12473',
          issueType: 'Tampered package',
        },
        {
          pincode: '380015',
          address: '987, Prahlad Nagar, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12474',
          issueType: 'Tampered package',
        },
        {
          pincode: '793001',
          address: '123, Police Bazaar, Shillong',
          city: 'Shillong',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12475',
          issueType: 'Tampered package',
        },
        {
          pincode: '682551',
          address: '741, Lakshadweep, Kavaratti',
          city: 'Kavaratti',
          cityTier: 'islands' as const,
          orderId: 'ORD-12476',
          issueType: 'Tampered package',
        },
      ],
    },
    {
      clusterLabel: 'Expired / spoiled product',
      mainTopic: 'Product Condition Complaints',
      totalCount: 8,
      channels: generateRandomChannels(8, 14),
      issues: [
        {
          pincode: '110017',
          address: '321, Vasant Kunj, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12477',
          issueType: 'Expired / spoiled product',
        },
        {
          pincode: '600017',
          address: '147, T Nagar, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12478',
          issueType: 'Expired / spoiled product',
        },
        {
          pincode: '411014',
          address: '654, Baner, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12479',
          issueType: 'Expired / spoiled product',
        },
        {
          pincode: '796001',
          address: '654, Zarkawt, Aizawl',
          city: 'Aizawl',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12480',
          issueType: 'Expired / spoiled product',
        },
        {
          pincode: '744102',
          address: '852, Haddo, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12481',
          issueType: 'Expired / spoiled product',
        },
      ],
    },
    {
      clusterLabel: 'Leaking / broken packaging',
      mainTopic: 'Product Condition Complaints',
      totalCount: 7,
      channels: generateRandomChannels(7, 15),
      issues: [
        {
          pincode: '400052',
          address: '456, Bandra West, Bandra',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12482',
          issueType: 'Leaking / broken packaging',
        },
        {
          pincode: '560001',
          address: '321, MG Road, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12483',
          issueType: 'Leaking / broken packaging',
        },
        {
          pincode: '791001',
          address: '852, Zero Point, Itanagar',
          city: 'Itanagar',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12484',
          issueType: 'Leaking / broken packaging',
        },
        {
          pincode: '682001',
          address: '369, Willingdon Island, Kochi',
          city: 'Kochi',
          cityTier: 'islands' as const,
          orderId: 'ORD-12485',
          issueType: 'Leaking / broken packaging',
        },
      ],
    },
    {
      clusterLabel: 'Duplicate charges reported',
      mainTopic: 'Payment & Order Status Mismatch',
      totalCount: 10,
      channels: generateRandomChannels(10, 16),
      issues: [
        {
          pincode: '400088',
          address: '369, Borivali, Mumbai',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12439',
          issueType: 'Duplicate charges',
        },
        {
          pincode: '560078',
          address: '741, Whitefield, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12440',
          issueType: 'Duplicate charges',
        },
        {
          pincode: '790001',
          address: '753, Naharlagun, Arunachal Pradesh',
          city: 'Naharlagun',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12441',
          issueType: 'Duplicate charges',
        },
        {
          pincode: '744101',
          address: '741, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12442',
          issueType: 'Duplicate charges',
        },
      ],
    },
    {
      clusterLabel: 'Replacement process unclear',
      mainTopic: 'Payment & Order Status Mismatch',
      totalCount: 11,
      channels: generateRandomChannels(11, 17),
      issues: [
        {
          pincode: '400088',
          address: '369, Borivali, Mumbai',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12486',
          issueType: 'Replacement process unclear',
        },
        {
          pincode: '560078',
          address: '741, Whitefield, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12487',
          issueType: 'Replacement process unclear',
        },
        {
          pincode: '110085',
          address: '852, Rohini, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12488',
          issueType: 'Replacement process unclear',
        },
        {
          pincode: '411033',
          address: '159, Hinjewadi, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12489',
          issueType: 'Replacement process unclear',
        },
        {
          pincode: '790001',
          address: '753, Naharlagun, Arunachal Pradesh',
          city: 'Naharlagun',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12490',
          issueType: 'Replacement process unclear',
        },
        {
          pincode: '744101',
          address: '741, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12491',
          issueType: 'Replacement process unclear',
        },
      ],
    },
    {
      clusterLabel: 'Refund not reflecting after imperfect order',
      mainTopic: 'Payment & Order Status Mismatch',
      totalCount: 15,
      channels: generateRandomChannels(15, 18),
      issues: [
        // Tier 1 Cities
        {
          pincode: '400088',
          address: '369, Borivali, Mumbai',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12365',
          issueType: 'Refund Delayed',
        },
        {
          pincode: '560078',
          address: '741, Whitefield, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12366',
          issueType: 'Refund Not Processed',
        },
        {
          pincode: '110085',
          address: '852, Rohini, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12367',
          issueType: 'Refund Delayed',
        },
        {
          pincode: '600042',
          address: '456, Adyar, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12368',
          issueType: 'Refund Not Processed',
        },
        // Tier 2 Cities
        {
          pincode: '411033',
          address: '159, Hinjewadi, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12369',
          issueType: 'Refund Not Processed',
        },
        {
          pincode: '380013',
          address: '753, Maninagar, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12370',
          issueType: 'Refund Delayed',
        },
        // Tier 3 Cities
        {
          pincode: '302015',
          address: '147, Vaishali Nagar, Jaipur',
          city: 'Jaipur',
          cityTier: 'tier3' as const,
          orderId: 'ORD-12371',
          issueType: 'Refund Not Processed',
        },
        {
          pincode: '500004',
          address: '258, Secunderabad, Hyderabad',
          city: 'Hyderabad',
          cityTier: 'tier3' as const,
          orderId: 'ORD-12372',
          issueType: 'Refund Delayed',
        },
        // Northeast & Hill States
        {
          pincode: '790001',
          address: '753, Naharlagun, Arunachal Pradesh',
          city: 'Naharlagun',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12407',
          issueType: 'Refund Delayed',
        },
        {
          pincode: '798001',
          address: '852, Dimapur, Nagaland',
          city: 'Dimapur',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12408',
          issueType: 'Refund Not Processed',
        },
        {
          pincode: '795001',
          address: '147, Thangal Bazaar, Imphal',
          city: 'Imphal',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12409',
          issueType: 'Refund Delayed',
        },
        {
          pincode: '791001',
          address: '258, Zero Point, Itanagar',
          city: 'Itanagar',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12410',
          issueType: 'Refund Not Processed',
        },
        {
          pincode: '793001',
          address: '369, Police Bazaar, Shillong',
          city: 'Shillong',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12411',
          issueType: 'Refund Delayed',
        },
        // Islands & Remote Areas
        {
          pincode: '744102',
          address: '159, Haddo, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12412',
          issueType: 'Refund Delayed',
        },
        {
          pincode: '682002',
          address: '258, Mattancherry, Kochi',
          city: 'Kochi',
          cityTier: 'islands' as const,
          orderId: 'ORD-12413',
          issueType: 'Refund Not Processed',
        },
        {
          pincode: '744101',
          address: '741, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12414',
          issueType: 'Refund Delayed',
        },
        {
          pincode: '682551',
          address: '852, Lakshadweep, Kavaratti',
          city: 'Kavaratti',
          cityTier: 'islands' as const,
          orderId: 'ORD-12415',
          issueType: 'Refund Not Processed',
        },
        {
          pincode: '682001',
          address: '147, Willingdon Island, Kochi',
          city: 'Kochi',
          cityTier: 'islands' as const,
          orderId: 'ORD-12416',
          issueType: 'Refund Delayed',
        },
      ],
    },
    {
      clusterLabel: 'Size/fit issues',
      mainTopic: 'Quality & Expectation Mismatch',
      totalCount: 10,
      channels: generateRandomChannels(10, 19),
      issues: [
        {
          pincode: '400001',
          address: '123, Marine Drive, Colaba',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12492',
          issueType: 'Size/fit issues',
        },
        {
          pincode: '560001',
          address: '321, MG Road, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12493',
          issueType: 'Size/fit issues',
        },
        {
          pincode: '110001',
          address: '654, Connaught Place, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12494',
          issueType: 'Size/fit issues',
        },
        {
          pincode: '380001',
          address: '147, CG Road, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12495',
          issueType: 'Size/fit issues',
        },
        {
          pincode: '797001',
          address: '369, Kohima Town, Kohima',
          city: 'Kohima',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12496',
          issueType: 'Size/fit issues',
        },
        {
          pincode: '682551',
          address: '741, Lakshadweep, Kavaratti',
          city: 'Kavaratti',
          cityTier: 'islands' as const,
          orderId: 'ORD-12497',
          issueType: 'Size/fit issues',
        },
      ],
    },
    {
      clusterLabel: 'Colour/shade mismatch',
      mainTopic: 'Quality & Expectation Mismatch',
      totalCount: 9,
      channels: generateRandomChannels(9, 20),
      issues: [
        {
          pincode: '400052',
          address: '456, Bandra West, Bandra',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12498',
          issueType: 'Colour/shade mismatch',
        },
        {
          pincode: '600001',
          address: '258, Mount Road, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12499',
          issueType: 'Colour/shade mismatch',
        },
        {
          pincode: '411001',
          address: '987, FC Road, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12500',
          issueType: 'Colour/shade mismatch',
        },
        {
          pincode: '737101',
          address: '456, MG Marg, Gangtok',
          city: 'Gangtok',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12501',
          issueType: 'Colour/shade mismatch',
        },
        {
          pincode: '744101',
          address: '789, Phoenix Bay, Port Blair',
          city: 'Port Blair',
          cityTier: 'islands' as const,
          orderId: 'ORD-12502',
          issueType: 'Colour/shade mismatch',
        },
      ],
    },
    {
      clusterLabel: 'Freshness complaints',
      mainTopic: 'Quality & Expectation Mismatch',
      totalCount: 8,
      channels: generateRandomChannels(8, 21),
      issues: [
        {
          pincode: '400053',
          address: '789, Andheri West, Andheri',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12503',
          issueType: 'Freshness complaints',
        },
        {
          pincode: '560025',
          address: '753, Indiranagar, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12504',
          issueType: 'Freshness complaints',
        },
        {
          pincode: '110092',
          address: '852, Dwarka, New Delhi',
          city: 'Delhi',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12505',
          issueType: 'Freshness complaints',
        },
        {
          pincode: '380009',
          address: '741, Satellite, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12506',
          issueType: 'Freshness complaints',
        },
        {
          pincode: '795001',
          address: '321, Thangal Bazaar, Imphal',
          city: 'Imphal',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12507',
          issueType: 'Freshness complaints',
        },
        {
          pincode: '682001',
          address: '147, Willingdon Island, Kochi',
          city: 'Kochi',
          cityTier: 'islands' as const,
          orderId: 'ORD-12508',
          issueType: 'Freshness complaints',
        },
      ],
    },
    {
      clusterLabel: 'Product not matching description',
      mainTopic: 'Quality & Expectation Mismatch',
      totalCount: 14,
      channels: generateRandomChannels(14, 22),
      issues: [
        {
          pincode: '400028',
          address: '456, Worli, Mumbai',
          city: 'Mumbai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12443',
          issueType: 'Product not matching description',
        },
        {
          pincode: '560004',
          address: '789, Malleswaram, Bangalore',
          city: 'Bangalore',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12444',
          issueType: 'Product not matching description',
        },
        {
          pincode: '380015',
          address: '987, Prahlad Nagar, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12445',
          issueType: 'Product not matching description',
        },
        {
          pincode: '797001',
          address: '369, Kohima Town, Kohima',
          city: 'Kohima',
          cityTier: 'northeast' as const,
          orderId: 'ORD-12446',
          issueType: 'Product not matching description',
        },
        {
          pincode: '682551',
          address: '741, Lakshadweep, Kavaratti',
          city: 'Kavaratti',
          cityTier: 'islands' as const,
          orderId: 'ORD-12447',
          issueType: 'Product not matching description',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen w-full px-6 py-8 bg-[#0a0a0a]">

      <ImperfectnessKPICards data={kpiData} />

      {/* Three Column Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Imperfect Order Distribution */}
        <div className="lg:col-span-1" style={{ minHeight: '600px' }}>
          <ImperfectOrderDistribution data={clusterData} />
        </div>

        {/* Column 2: Narrative Lens */}
        <div className="lg:col-span-1" style={{ minHeight: '600px' }}>
          <NarrativeLens phrases={complaintPhrases} />
        </div>

        {/* Column 3: AI Imperfect Order Insight Wall */}
        <div className="lg:col-span-1" style={{ minHeight: '600px' }}>
          <AIImperfectOrderInsightWall />
        </div>
      </div>

      <div className="mt-8">
        <DominantClusterChart data={clusterData} />
      </div>
    </div>
  );
}
