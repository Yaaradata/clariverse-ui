// lib/routes.ts
// -----------------------------------------------------------------------------
// The locked 5-screen set for the Head of CX room. This file is metadata only
// (id, labels, icon) so the sidebar and router can import it without pulling in
// screen components — the shell does the id → component mapping. Default landing
// is the CX Command Centre.
//
// Do not add, remove, or rename a screen here without a brief change: this list
// is the source of truth the sidebar and router both read.
// -----------------------------------------------------------------------------

import {
  Radar,
  Bike,
  Store,
  Scale,
  ArrowRightLeft,
  type LucideIcon,
} from 'lucide-react';

export type ScreenId =
  | 'command-centre'
  | 'quick-commerce-ops'
  | 'seller-catalogue'
  | 'compliance-conduct'
  | 'voice-to-value';

export interface ScreenRoute {
  id: ScreenId;
  /** Full label for the sidebar (expanded). */
  label: string;
  /** Terse label for collapsed / tooltip use. */
  shortLabel: string;
  /** One-line purpose, shown on the empty screen scaffold in Pass 1. */
  purpose: string;
  icon: LucideIcon;
}

export const SCREENS: ScreenRoute[] = [
  {
    id: 'command-centre',
    label: 'CX Command Centre',
    shortLabel: 'Command',
    purpose: 'Role in one glance — what is breaking now, distilled.',
    icon: Radar,
  },
  {
    id: 'quick-commerce-ops',
    label: 'Quick-Commerce Operations',
    shortLabel: 'Quick-Comm',
    purpose: 'Dark-stores breaking before the warehouse dashboard shows it.',
    icon: Bike,
  },
  {
    id: 'seller-catalogue',
    label: 'Seller & Catalogue Integrity',
    shortLabel: 'Seller',
    purpose: 'Sellers and SKUs degrading in the text before their metrics move.',
    icon: Store,
  },
  {
    id: 'compliance-conduct',
    label: 'Compliance & Conduct Intelligence',
    shortLabel: 'Compliance',
    purpose: 'Regulatory exposure surfacing in customer voice, routed internally.',
    icon: Scale,
  },
  {
    id: 'voice-to-value',
    label: 'Voice → Value',
    shortLabel: 'Voice → Value',
    purpose: 'Interaction signal today; one read-only feed turns it into rupees.',
    icon: ArrowRightLeft,
  },
];

export const DEFAULT_SCREEN: ScreenId = 'command-centre';

export const screenById = (id: ScreenId): ScreenRoute =>
  SCREENS.find((s) => s.id === id) ?? SCREENS[0];
