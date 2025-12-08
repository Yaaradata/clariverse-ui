'use client';

import { ImperfectnessKPICards } from '@/components/paingradation/ImperfectnessKPICards';
import { DominantClusterChart } from '@/components/paingradation/DominantClusterChart';

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

  // Mock cluster data - Replace with actual API data
  const clusterData = [
    {
      clusterLabel: 'Payment Failures',
      totalCount: 40,
      channels: [
        { channel: 'Email', count: 18, color: '#5332ff' },
        { channel: 'Phone', count: 12, color: '#ef4444' },
        { channel: 'Chat', count: 10, color: '#10b981' },
      ],
      issues: [
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
        {
          pincode: '600001',
          address: '258, Mount Road, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12352',
          issueType: 'Card Declined',
        },
      ],
    },
    {
      clusterLabel: 'Delivery Delays',
      totalCount: 38,
      channels: [
        { channel: 'Phone', count: 15, color: '#ef4444' },
        { channel: 'Email', count: 12, color: '#5332ff' },
        { channel: 'Chat', count: 8, color: '#10b981' },
        { channel: 'App', count: 3, color: '#8b5cf6' },
      ],
      issues: [
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
          pincode: '411004',
          address: '369, Koregaon Park, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12356',
          issueType: 'Late Delivery',
        },
        {
          pincode: '380009',
          address: '741, Satellite, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12357',
          issueType: 'Delivery Not Attempted',
        },
      ],
    },
    {
      clusterLabel: 'Product Quality Issues',
      totalCount: 28,
      channels: [
        { channel: 'Email', count: 12, color: '#5332ff' },
        { channel: 'Social Media', count: 8, color: '#f59e0b' },
        { channel: 'Chat', count: 5, color: '#10b981' },
        { channel: 'Phone', count: 3, color: '#ef4444' },
      ],
      issues: [
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
          pincode: '411014',
          address: '654, Baner, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12361',
          issueType: 'Damaged Product',
        },
        {
          pincode: '380015',
          address: '987, Prahlad Nagar, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12362',
          issueType: 'Wrong Product',
        },
        {
          pincode: '600017',
          address: '147, T Nagar, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12363',
          issueType: 'Defective Item',
        },
        {
          pincode: '302001',
          address: '258, C Scheme, Jaipur',
          city: 'Jaipur',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12364',
          issueType: 'Damaged Product',
        },
      ],
    },
    {
      clusterLabel: 'Refund Processing',
      totalCount: 16,
      channels: [
        { channel: 'Email', count: 8, color: '#5332ff' },
        { channel: 'Phone', count: 5, color: '#ef4444' },
        { channel: 'Chat', count: 3, color: '#10b981' },
      ],
      issues: [
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
          pincode: '411033',
          address: '159, Hinjewadi, Pune',
          city: 'Pune',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12368',
          issueType: 'Refund Not Processed',
        },
        {
          pincode: '380013',
          address: '753, Maninagar, Ahmedabad',
          city: 'Ahmedabad',
          cityTier: 'tier2' as const,
          orderId: 'ORD-12369',
          issueType: 'Refund Delayed',
        },
        {
          pincode: '600042',
          address: '456, Adyar, Chennai',
          city: 'Chennai',
          cityTier: 'tier1' as const,
          orderId: 'ORD-12370',
          issueType: 'Refund Not Processed',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen w-full px-6 py-8 bg-[#0a0a0a]">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-white">Imperfectness</h2>
        <p className="text-gray-400">Monitor imperfect orders and business impact</p>
      </div>

      <ImperfectnessKPICards data={kpiData} />

      <div className="mt-8">
        <DominantClusterChart data={clusterData} />
      </div>
    </div>
  );
}
