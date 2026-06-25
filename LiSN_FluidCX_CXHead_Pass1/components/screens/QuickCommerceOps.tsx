// components/screens/QuickCommerceOps.tsx
// Pass 1 stub — DS-OUTBREAK ranked list + geo map, DS-FSSAI radar and the
// BR-GMV bridge-ready tile arrive in Pass 4.
import React from 'react';
import { ScreenScaffold } from '../common/ScreenScaffold';
import { screenById } from '../../lib/routes';

export function QuickCommerceOps(): React.ReactElement {
  const s = screenById('quick-commerce-ops');
  return <ScreenScaffold icon={s.icon} title={s.label} purpose={s.purpose} />;
}
