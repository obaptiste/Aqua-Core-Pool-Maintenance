'use client';

import type { AlertSeverity } from '@/types/poolpro';

interface GaugeCardProps {
  label: string;
  value: number | undefined | null;
  unit: string;
  min: number;
  max: number;
  idealLabel: string;
  status: AlertSeverity;
  /** Optional: show a small trend indicator (+/-) */
  trend?: number;
  /** Unused directly in the gauge but accepted to keep dashboard clean */
  colour?: string;
}

const STATUS_COLOURS: Record<AlertSeverity, { arc: string; text: string; badge: string }> = {
  ok:      { arc: '#22c55e', text: '#86efac', badge: 'status-ok' },
  warning: { arc: '#f59e0b', text: '#fcd34d', badge: 'status-warning' },
  danger:  { arc: '#ef4444', text: '#fca5a5', badge: 'status-danger' },
  info:    { arc: '#4fc3f7', text: '#7dd3fc', badge: 'status-info' },
};

// SVG arc gauge — half-circle variant
// Radius 40, circumference of the 180° arc ≈ 125.66
const R = 40;
const ARC_LENGTH = Math.PI * R; // ~125.66

function calcOffset(value: number, min: number, max: number): number {
  const clamped = Math.min(Math.max(value, min), max);
  const pct = (clamped - min) / (max - min);
  return ARC_LENGTH * (1 - pct);
}

export default function GaugeCard({
  label,
  value,
  unit,
  min,
  max,
  idealLabel,
  status,
  trend,
}: GaugeCardProps) {
  const colours = STATUS_COLOURS[status] ?? STATUS_COLOURS.ok;
  const hasValue = value != null && !isNaN(value);
  const offset = hasValue ? calcOffset(value!, min, max) : ARC_LENGTH;

  return (
    <div className="
      bg-[#0d1f38] border border-[#1a3a5c] rounded-xl p-4
      flex flex-col items-center gap-2
      animate-fade-in hover:border-[#4fc3f7]/40 transition-colors
    ">
      {/* Label */}
      <div className="text-[11px] text-[#64748b] uppercase tracking-wider text-center">
        {label}
      </div>

      {/* SVG half-circle gauge */}
      <div className="relative w-24 h-14 overflow-hidden">
        <svg
          viewBox="0 0 100 50"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          {/* Track */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#1a3a5c"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Arc fill */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={colours.arc}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>

        {/* Centre value */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-0.5">
          <span
            className="font-data text-xl font-bold leading-none"
            style={{ color: colours.text, fontFamily: 'var(--font-data, "Space Mono", monospace)' }}
          >
            {hasValue ? value!.toFixed(value! < 10 ? 1 : 0) : '—'}
          </span>
          {unit && (
            <span className="text-[9px] text-[#64748b]">{unit}</span>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div className={`text-[10px] px-2.5 py-0.5 rounded-full ${colours.badge}`}>
        {status === 'ok' ? 'In range' : status.charAt(0).toUpperCase() + status.slice(1)}
      </div>

      {/* Ideal range */}
      <div className="text-[10px] text-[#64748b] text-center">
        Target: {idealLabel}
      </div>

      {/* Trend indicator */}
      {trend != null && trend !== 0 && (
        <div className={`text-[10px] ${trend > 0 ? 'text-[#f59e0b]' : 'text-[#4fc3f7]'}`}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(2)} vs yesterday
        </div>
      )}
    </div>
  );
}
