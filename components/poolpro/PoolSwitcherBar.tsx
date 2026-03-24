'use client';

import type { Pool } from '@/types/poolpro';

interface PoolSwitcherBarProps {
  pools: Pool[];
  activePool: Pool | null;
  onSwitch: (id: string) => void;
  isOnline: boolean;
  alertCount: number;
}

export default function PoolSwitcherBar({
  pools,
  activePool,
  onSwitch,
  isOnline,
  alertCount,
}: PoolSwitcherBarProps) {
  return (
    <header className="
      sticky top-0 z-30
      bg-[#0a1628]/95 backdrop-blur-sm
      border-b border-[#1a3a5c]
      px-4 py-3
      flex items-center justify-between gap-3
      md:hidden
    ">
      {/* Logo + pool name */}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-[#4fc3f7] font-bold text-base shrink-0"
          style={{ fontFamily: 'var(--font-ui, "Exo 2", sans-serif)' }}
        >
          Pool<span className="text-white">Pro</span>
        </span>
        {pools.length > 1 ? (
          <select
            value={activePool?.id ?? ''}
            onChange={(e) => onSwitch(e.target.value)}
            className="
              bg-transparent border border-[#1a3a5c] text-[#94a3b8] text-sm
              rounded-lg px-2 py-1 focus:outline-none focus:border-[#4fc3f7]
              max-w-[140px] truncate
            "
          >
            {pools.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0d1f38]">
                {p.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-[#94a3b8] text-sm truncate">{activePool?.name}</span>
        )}
      </div>

      {/* Right: alerts + status */}
      <div className="flex items-center gap-3 shrink-0">
        {alertCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-[#fca5a5] bg-[#450a0a] border border-[#dc2626] rounded-full px-2.5 py-1">
            <span>⚠</span>
            <span>{alertCount} alert{alertCount > 1 ? 's' : ''}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`} />
          <span className="hidden xs:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </header>
  );
}
