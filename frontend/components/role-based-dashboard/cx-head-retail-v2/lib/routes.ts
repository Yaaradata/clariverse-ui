// lib/routes.ts
// Locked 5-screen set — Stage 10 route map (in-memory ids mirror URL paths).
// Default landing: command-centre (What's Breaking /).

import {
  Radar,
  Bike,
  Target,
  Scale,
  ArrowRightLeft,
  type LucideIcon,
} from 'lucide-react';

export type ScreenId =
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
    id: 'command-centre',
    label: "What's Breaking",
    shortLabel: 'Breaking',
    purpose: 'What is breaking right now, and who owns it?',
    icon: Radar,
  },
  {
    id: 'quick-commerce',
    label: 'Dark-Store Signals',
    shortLabel: 'Dark-store',
    purpose: 'Dark-store and perishable signals before ops dashboards move.',
    icon: Bike,
  },
  {
    id: 'compliance',
    label: 'Regulatory Exposure',
    shortLabel: 'Regulatory',
    purpose: 'Statutory clocks and conduct exposure from customer voice.',
    icon: Scale,
  },
  {
    id: 'cx-quality',
    label: 'Trust & Quality',
    shortLabel: 'Quality',
    purpose: 'Seller trust, repeat contacts, bot containment, and suppression watchdog.',
    icon: Target,
  },
  {
    id: 'revenue-bridge',
    label: 'Voice → P&L',
    shortLabel: 'P&L',
    purpose: 'Turn interaction signals into revenue read-through.',
    icon: ArrowRightLeft,
  },
];

export const DEFAULT_SCREEN: ScreenId = 'command-centre';

export const screenById = (id: ScreenId): ScreenRoute =>
  SCREENS.find((s) => s.id === id) ?? SCREENS[0];
