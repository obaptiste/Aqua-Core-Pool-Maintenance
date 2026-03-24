'use client';

import { useState } from 'react';
import type { Alert } from '@/types/poolpro';

interface AlertBannerProps {
  alerts: Alert[];
}

const SEVERITY_STYLES: Record<string, string> = {
  danger:  'bg-[#450a0a] border-[#dc2626] text-[#fca5a5]',
  warning: 'bg-[#451a03] border-[#d97706] text-[#fcd34d]',
  info:    'bg-[#0c2d4a] border-[#0284c7] text-[#7dd3fc]',
};

const SEVERITY_ICON: Record<string, string> = {
  danger:  '⚠',
  warning: '◈',
  info:    'ℹ',
};

export default function AlertBanner({ alerts }: AlertBannerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0a2a1a] border border-[#16a34a] text-[#86efac] text-sm">
        <span className="text-base">✓</span>
        <span>All parameters in range — water quality is good.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => {
        const key = `${alert.parameter}-${i}`;
        const isOpen = expanded === key;
        const styles = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info;

        return (
          <div
            key={key}
            className={`rounded-xl border ${styles} overflow-hidden`}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : key)}
              className="w-full text-left px-4 py-3 flex items-start gap-3"
              aria-expanded={isOpen}
            >
              <span className="mt-0.5 shrink-0 text-base" aria-hidden>
                {SEVERITY_ICON[alert.severity]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{alert.message}</div>
                <div className="text-xs opacity-70 mt-0.5">{alert.parameter} — tap for guidance</div>
              </div>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 space-y-3 border-t border-current/20 pt-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Why it matters</div>
                  <p className="text-sm leading-relaxed">{alert.why}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">What to do</div>
                  <p className="text-sm leading-relaxed font-medium">{alert.action}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
