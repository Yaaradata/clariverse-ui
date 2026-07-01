// components/layout/AppShell.tsx
// V3 shell — full-width header + screen; hub cards replace sidebar nav.

import React from 'react';
import { Header } from './Header';
import { DrillPanel } from '../common/DrillPanel';
import { useNavigation } from '../../lib/NavigationContext';
import { type ScreenId } from '../../lib/routes';
import { cssVar } from '../../theme/tokens';

import { CXOverviewScreen } from '../screens/CXOverviewScreen';
import { CXCommandScreen } from '../screens/CXCommandScreen';
import { QuickCommerceHealthScreen } from '../screens/QuickCommerceHealthScreen';
import { ComplianceConductScreen } from '../screens/ComplianceConductScreen';
import { CXQualityWedgeScreen } from '../screens/CXQualityWedgeScreen';
import { RevenueBridgeScreen } from '../screens/RevenueBridgeScreen';

import { HubBrandRiskScreen } from '../screens/HubBrandRiskScreen';
import { HubCustomerHappinessScreen } from '../screens/HubCustomerHappinessScreen';
import { HubServiceDeliveryScreen } from '../screens/HubServiceDeliveryScreen';

const SCREEN_COMPONENTS: Record<ScreenId, React.ComponentType> = {
  overview: CXOverviewScreen,
  'hub-customer-happiness': HubCustomerHappinessScreen,
  'hub-service-delivery': HubServiceDeliveryScreen,
  'hub-brand-risk': HubBrandRiskScreen,
  'command-centre': CXCommandScreen,
  'quick-commerce': QuickCommerceHealthScreen,
  compliance: ComplianceConductScreen,
  'cx-quality': CXQualityWedgeScreen,
  'revenue-bridge': RevenueBridgeScreen,
};

export function AppShell(): React.ReactElement {
  const { activeScreen, drill, closeDrill } = useNavigation();

  const ActiveScreen = SCREEN_COMPONENTS[activeScreen];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        background: cssVar('bg'),
        color: cssVar('text-primary'),
        overflow: 'hidden',
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
