// components/layout/AppShell.tsx
// Pass 1 — shell only: sidebar, header, active screen scaffold.

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { DrillPanel } from '../common/DrillPanel';
import { useNavigation } from '../../lib/NavigationContext';
import { type ScreenId } from '../../lib/routes';
import { cssVar } from '../../theme/tokens';

import { CXCommandScreen } from '../screens/CXCommandScreen';
import { QuickCommerceHealthScreen } from '../screens/QuickCommerceHealthScreen';
import { ComplianceConductScreen } from '../screens/ComplianceConductScreen';
import { CXQualityWedgeScreen } from '../screens/CXQualityWedgeScreen';
import { RevenueBridgeScreen } from '../screens/RevenueBridgeScreen';

const SCREEN_COMPONENTS: Record<ScreenId, React.ComponentType> = {
  'command-centre': CXCommandScreen,
  'quick-commerce': QuickCommerceHealthScreen,
  compliance: ComplianceConductScreen,
  'cx-quality': CXQualityWedgeScreen,
  'revenue-bridge': RevenueBridgeScreen,
};

export function AppShell(): React.ReactElement {
  const { activeScreen, drill, closeDrill } = useNavigation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const ActiveScreen = SCREEN_COMPONENTS[activeScreen];

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        background: cssVar('bg'),
        color: cssVar('text-primary'),
        overflow: 'hidden',
      }}
    >
      <Sidebar
        expanded={sidebarExpanded}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
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
          <ActiveScreen key={activeScreen} />
        </main>
      </div>

      {drill && (
        <DrillPanel
          itemId={drill.itemId}
          drillSignature={drill.drillSignature}
          onClose={closeDrill}
        />
      )}
    </div>
  );
}
