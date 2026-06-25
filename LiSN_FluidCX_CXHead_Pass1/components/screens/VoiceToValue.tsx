// components/screens/VoiceToValue.tsx
// Pass 1 stub — the four bridge heroes (BR-GMV, BR-SELLER, BR-REFUND, BR-APPEASE)
// as bridge-ready tiles and the land-and-expand close arrive in Pass 5.
import React from 'react';
import { ScreenScaffold } from '../common/ScreenScaffold';
import { screenById } from '../../lib/routes';

export function VoiceToValue(): React.ReactElement {
  const s = screenById('voice-to-value');
  return <ScreenScaffold icon={s.icon} title={s.label} purpose={s.purpose} />;
}
