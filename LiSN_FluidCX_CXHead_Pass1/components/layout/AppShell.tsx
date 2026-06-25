// components/layout/AppShell.tsx
// -----------------------------------------------------------------------------
// Composes the room: collapsible sidebar, clean header, and the active screen.
// The id → screen-component map lives here (kept out of routes.ts to avoid an
// import cycle). Sidebar collapse state is in-memory only.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useNavigation } from '../../lib/NavigationContext';
import { type ScreenId } from '../../lib/routes';
import { cssVar } from '../../theme/tokens';

import { CXCommandCentre } from '../screens/CXCommandCentre';
import { QuickCommerceOps } from '../screens/QuickCommerceOps';
import { SellerCatalogueIntegrity } from '../screens/SellerCatalogueIntegrity';
import { ComplianceConductIntelligence } from '../screens/ComplianceConductIntelligence';
import { VoiceToValue } from '../screens/VoiceToValue';

const SCREEN_COMPONENTS: Record<ScreenId, React.ComponentType> = {
  'command-centre': CXCommandCentre,
  'quick-commerce-ops': QuickCommerceOps,
  'seller-catalogue': SellerCatalogueIntegrity,
  'compliance-conduct': ComplianceConductIntelligence,
  'voice-to-value': VoiceToValue,
};

export function AppShell(): React.ReactElement {
  const { activeScreen } = useNavigation();
  const [collapsed, setCollapsed] = useState(false);

  const ActiveScreen = SCREEN_COMPONENTS[activeScreen];

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        background: cssVar('bg'),
        color: cssVar('text-primary'),
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <main
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            background: cssVar('bg'),
          }}
        >
          {/* keyed on screen so each room mounts fresh and animates in */}
          <ActiveScreen key={activeScreen} />
        </main>
      </div>
    </div>
  );
}
