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
    purpose: 'What is breaking right now, and who owns it?',
    icon: Radar,
  },
  {
    id: 'quick-commerce',
    label: 'Quick-Commerce Health',
    shortLabel: 'Quick-Comm',
    purpose: 'Dark-store and perishable signals before ops dashboards move.',
    icon: Bike,
  },
  {
    id: 'compliance',
    label: 'Compliance & Conduct',
    shortLabel: 'Compliance',
    purpose: 'Statutory clocks and conduct exposure from customer voice.',
    icon: Scale,
  },
  {
    id: 'cx-quality',
    label: 'CX Quality & the Wedge',
    shortLabel: 'CX Quality',
    purpose: 'Seller trust, repeat-cause, bot quality, and the suppression watchdog.',
    icon: Target,
  },
  {
    id: 'revenue-bridge',
    label: 'Revenue Bridge',
    shortLabel: 'Bridge',
    purpose: 'Interaction signal today; one read-only feed turns it into rupees.',
    icon: ArrowRightLeft,
  },
];

export const DEFAULT_SCREEN: ScreenId = 'command-centre';

export const screenById = (id: ScreenId): ScreenRoute =>
  SCREENS.find((s) => s.id === id) ?? SCREENS[0];
