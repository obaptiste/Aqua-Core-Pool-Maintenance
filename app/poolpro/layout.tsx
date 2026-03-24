'use client';

import { usePoolData } from '@/lib/poolpro/usePoolData';
import BottomNav from '@/components/poolpro/BottomNav';
import SideNav from '@/components/poolpro/SideNav';
import PoolSwitcherBar from '@/components/poolpro/PoolSwitcherBar';

export default function PoolProLayout({ children }: { children: React.ReactNode }) {
  const { pools, activePool, alerts, isOnline, switchPool } = usePoolData();
  const alertCount = alerts.length;

  return (
    <div className="poolpro-root flex min-h-dvh">
      {/* Desktop sidebar */}
      <SideNav
        pools={pools}
        activePool={activePool}
        onSwitchPool={switchPool}
        alertCount={alertCount}
        isOnline={isOnline}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <PoolSwitcherBar
          pools={pools}
          activePool={activePool}
          onSwitch={switchPool}
          isOnline={isOnline}
          alertCount={alertCount}
        />

        {/* Page content — bottom padding for mobile nav */}
        <main className="flex-1 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
