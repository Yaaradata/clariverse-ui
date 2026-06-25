// lib/routes.ts
// Locked 5-screen set — Stage 10 route map (in-memory ids mirror URL paths).
// Default landing: command-centre (CX Command /).

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
    label: 'CX Command',
    shortLabel: 'Command',
    purpose: 'Breaking now · owners',
    icon: Radar,
  },
  {
    id: 'quick-commerce',
    label: 'Quick-Commerce',
    shortLabel: 'Q-Comm',
    purpose: 'Dark-store signals',
    icon: Bike,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    shortLabel: 'Compliance',
    purpose: 'Statutory clocks',
    icon: Scale,
  },
  {
    id: 'cx-quality',
    label: 'CX Quality',
    shortLabel: 'Quality',
    purpose: 'Trust · FCR · bot',
    icon: Target,
  },
  {
    id: 'revenue-bridge',
    label: 'Revenue Bridge',
    shortLabel: 'Bridge',
    purpose: 'Voice → rupees',
    icon: ArrowRightLeft,
  },
];

export const DEFAULT_SCREEN: ScreenId = 'command-centre';

export const screenById = (id: ScreenId): ScreenRoute =>
  SCREENS.find((s) => s.id === id) ?? SCREENS[0];
