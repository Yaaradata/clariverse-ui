// components/screens/ComplianceConductIntelligence.tsx
// Pass 1 stub — DARK-PATTERN scan, SLA-CLOCK predictor and REFUND-FRICTION radar
// arrive in Pass 4. Routes to internal Legal only.
import React from 'react';
import { ScreenScaffold } from '../common/ScreenScaffold';
import { screenById } from '../../lib/routes';

export function ComplianceConductIntelligence(): React.ReactElement {
  const s = screenById('compliance-conduct');
  return <ScreenScaffold icon={s.icon} title={s.label} purpose={s.purpose} />;
}
