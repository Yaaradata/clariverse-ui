// lib/routes.ts — V3 screen map: overview hub + five Fluid CX detail screens.

import {
  Home,
  Radar,
  Package,
  Scale,
  Target,
  ArrowRightLeft,
  type LucideIcon,
} from 'lucide-react';

export type ScreenId =
  | 'overview'
  | 'hub-customer-happiness'
  | 'hub-service-delivery'
  | 'hub-brand-risk'
  | 'command-centre'
  | 'quick-commerce'
  | 'compliance'
  | 'cx-quality'
  | 'revenue-bridge';

export interface ScreenRoute {
  id: ScreenId;
  label: string;
  shortLabel: string;
  purpose: string;
  icon: LucideIcon;
}

export const SCREENS: ScreenRoute[] = [
  {
    id: 'overview',
    label: 'CX Command',
    shortLabel: 'Home',
    purpose: 'Shopper journey · dark-store · voice→P&L hub',
    icon: Home,
  },
  {
    id: 'command-centre',
    label: 'Experience Pulse',
    shortLabel: 'Pulse',
    purpose: "What's breaking — who owns the fix?",
    icon: Radar,
  },
  {
    id: 'quick-commerce',
    label: 'Fulfilment Signals',
    shortLabel: 'Fulfil',
    purpose: 'Dark-stores breaking before ops dashboards move.',
    icon: Package,
  },
  {
    id: 'compliance',
    label: 'Policy & Conduct',
    shortLabel: 'Policy',
    purpose: 'Consumer-rights clocks and marketplace conduct exposure from voice.',
    icon: Scale,
  },
  {
    id: 'cx-quality',
    label: 'Trust & Quality',
    shortLabel: 'Trust',
    purpose: 'Seller trust, repeat contacts, bot containment, and suppression watchdog.',
    icon: Target,
  },
  {
    id: 'revenue-bridge',
    label: 'Voice → Revenue',
    shortLabel: 'Revenue',
    purpose: 'Turn interaction signals into cohort-level revenue read-through.',
    icon: ArrowRightLeft,
  },
];

export const DEFAULT_SCREEN: ScreenId = 'overview';

export const screenById = (id: ScreenId): ScreenRoute =>
  SCREENS.find((s) => s.id === id) ?? SCREENS[0];
