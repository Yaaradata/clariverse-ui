// components/screens/CXCommandCentre.tsx
// Pass 1 stub — the landing screen. Headline signal, three executive tiles,
// Brief/Pulse strips, the live monitor, the Floating AI Day Generator, the
// suppression/repeat/agent cards and the bridge-ready row land in Passes 2–3.
import React from 'react';
import { ScreenScaffold } from '../common/ScreenScaffold';
import { screenById } from '../../lib/routes';

export function CXCommandCentre(): React.ReactElement {
  const s = screenById('command-centre');
  return <ScreenScaffold icon={s.icon} title={s.label} purpose={s.purpose} />;
}
