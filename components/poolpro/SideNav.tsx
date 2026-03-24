'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Pool } from '@/types/poolpro';

interface SideNavProps {
  pools: Pool[];
  activePool: Pool | null;
  onSwitchPool: (id: string) => void;
  alertCount: number;
  isOnline: boolean;
}

const NAV_ITEMS = [
  { href: '/poolpro/dashboard', label: 'Dashboard' },
  { href: '/poolpro/log',       label: 'Log Reading' },
  { href: '/poolpro/history',   label: 'History' },
  { href: '/poolpro/cheatsheet', label: 'Quick Guide' },
];

export default function SideNav({
  pools,
  activePool,
  onSwitchPool,
  alertCount,
  isOnline,
}: SideNavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-[#0a1628] border-r border-[#1a3a5c] min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#1a3a5c]">
        <div className="text-[#4fc3f7] font-semibold text-lg tracking-wide" style={{ fontFamily: 'var(--font-ui, "Exo 2", sans-serif)' }}>
          Pool<span className="text-white">Pro</span>
        </div>
        <div className="text-[10px] text-[#64748b] mt-0.5">Water Quality Manager</div>
      </div>

      {/* Pool switcher */}
      {pools.length > 0 && (
        <div className="px-4 py-3 border-b border-[#1a3a5c]">
          <div className="text-[10px] text-[#64748b] uppercase tracking-widest mb-1.5">Active Pool</div>
          <select
            value={activePool?.id ?? ''}
            onChange={(e) => onSwitchPool(e.target.value)}
            className="
              w-full bg-[#0d1f38] border border-[#1a3a5c] text-[#e2e8f0] text-sm
              rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#4fc3f7]
            "
          >
            {pools.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${active
                  ? 'bg-[#0d1f38] text-[#4fc3f7] border border-[#1a3a5c]'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#0d1f38]'
                }
              `}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
              {item.href === '/poolpro/dashboard' && alertCount > 0 && (
                <span className="text-[10px] bg-[#ef4444] text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Online status */}
      <div className="px-5 py-4 border-t border-[#1a3a5c]">
        <div className="flex items-center gap-2 text-xs text-[#64748b]">
          <span
            className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`}
          />
          {isOnline ? 'Online' : 'Offline — data saved locally'}
        </div>
      </div>
    </aside>
  );
}
