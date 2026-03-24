'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { usePoolData } from '@/lib/poolpro/usePoolData';
import { parameterStatus } from '@/lib/poolpro/warnings';
import { PARAMETER_RANGES } from '@/types/poolpro';
import AlertBanner from '@/components/poolpro/AlertBanner';
import GaugeCard from '@/components/poolpro/GaugeCard';
import TrendChart from '@/components/poolpro/TrendChart';

const GAUGE_PARAMS = [
  { key: 'free_chlorine',    colour: '#4fc3f7' },
  { key: 'ph',               colour: '#a78bfa' },
  { key: 'alkalinity',       colour: '#34d399' },
  { key: 'combined_chlorine', colour: '#fb923c' },
  { key: 'temperature',      colour: '#f87171' },
  { key: 'calcium_hardness', colour: '#fbbf24' },
];

const TREND_PARAMS = [
  { key: 'free_chlorine',  colour: '#4fc3f7', label: 'Free Chlorine' },
  { key: 'ph',             colour: '#a78bfa', label: 'pH' },
  { key: 'alkalinity',     colour: '#34d399', label: 'Total Alkalinity' },
  { key: 'temperature',    colour: '#f87171', label: 'Temperature' },
];

function TurbidityBadge({ value }: { value: string | undefined }) {
  const MAP: Record<string, { label: string; cls: string }> = {
    'clear':          { label: 'Clear', cls: 'status-ok' },
    'slightly-cloudy': { label: 'Slight haze', cls: 'status-info' },
    'cloudy':         { label: 'Cloudy', cls: 'status-warning' },
    'very-cloudy':    { label: 'Very cloudy', cls: 'status-danger' },
  };
  const cfg = MAP[value ?? ''] ?? { label: value ?? '—', cls: 'status-info' };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export default function DashboardPage() {
  const { activePool, latestReading, readings, alerts, isLoading } = usePoolData();
  const [activeTrend, setActiveTrend] = useState(TREND_PARAMS[0].key);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#64748b] text-sm animate-pulse">Loading pool data…</div>
      </div>
    );
  }

  if (!activePool) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 px-6 text-center">
        <div className="text-4xl">🏊</div>
        <h2 className="text-white text-lg font-semibold">No pool set up yet</h2>
        <p className="text-[#64748b] text-sm">Add a pool to start tracking your water quality.</p>
        <Link
          href="/poolpro/log"
          className="bg-[#4fc3f7] text-[#060e1a] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#38bdf8] transition-colors"
        >
          Get started
        </Link>
      </div>
    );
  }

  const trendParam = TREND_PARAMS.find((p) => p.key === activeTrend)!;

  return (
    <div className="px-4 py-5 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-xl font-bold">{activePool.name}</h1>
          <div className="text-[#64748b] text-sm mt-0.5">
            {activePool.pool_type
              ? `${activePool.pool_type.charAt(0).toUpperCase() + activePool.pool_type.slice(1)} pool`
              : 'Pool'}
            {activePool.volume_litres
              ? ` · ${activePool.volume_litres.toLocaleString()} L`
              : ''}
          </div>
        </div>
        <Link
          href="/poolpro/log"
          className="
            shrink-0 flex items-center gap-1.5 bg-[#4fc3f7] text-[#060e1a]
            px-4 py-2.5 rounded-xl font-semibold text-sm
            hover:bg-[#38bdf8] active:scale-95 transition-all
          "
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Log Reading
        </Link>
      </div>

      {/* Last reading meta */}
      {latestReading ? (
        <div className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-[#64748b] uppercase tracking-widest mb-1">Last reading</div>
            <div className="text-white text-sm font-medium">
              {format(new Date(latestReading.read_at), 'EEE d MMM yyyy · HH:mm')}
            </div>
            <div className="text-[#64748b] text-xs">
              {formatDistanceToNow(new Date(latestReading.read_at), { addSuffix: true })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[10px] text-[#64748b] mb-1">Clarity</div>
              <TurbidityBadge value={latestReading.turbidity} />
            </div>
            {readings.length >= 2 && (
              <div className="text-xs text-[#64748b]">
                {readings.length} readings this period
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#0d1f38] border border-[#1a3a5c] border-dashed rounded-xl px-4 py-4 text-center">
          <p className="text-[#64748b] text-sm">No readings logged yet.</p>
          <Link href="/poolpro/log" className="text-[#4fc3f7] text-sm font-medium mt-1 inline-block">
            Log your first reading →
          </Link>
        </div>
      )}

      {/* Alerts */}
      <section aria-label="Water quality alerts">
        <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-3">Water Quality Status</h2>
        <AlertBanner alerts={alerts} />
      </section>

      {/* Gauges */}
      {latestReading && (
        <section aria-label="Parameter gauges">
          <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-3">Current Parameters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GAUGE_PARAMS.map(({ key, colour }) => {
              const range = PARAMETER_RANGES[key];
              if (!range) return null;
              const value = latestReading[key as keyof typeof latestReading] as number | undefined;
              const status = parameterStatus(key, value);

              // Calculate trend vs previous reading
              let trend: number | undefined;
              if (readings.length >= 2) {
                const prev = readings[1][key as keyof typeof readings[1]] as number | undefined;
                if (value != null && prev != null) trend = value - prev;
              }

              return (
                <GaugeCard
                  key={key}
                  label={range.label}
                  value={value}
                  unit={range.unit}
                  min={range.min}
                  max={range.max}
                  idealLabel={range.idealLabel}
                  status={status}
                  trend={trend}
                  colour={colour}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Trend chart */}
      {readings.length > 1 && (
        <section aria-label="Trend charts">
          <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-3">14-Day Trend</h2>
          <div className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl p-4">
            {/* Tab switcher */}
            <div className="flex flex-wrap gap-2 mb-4">
              {TREND_PARAMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setActiveTrend(p.key)}
                  className={`
                    text-xs px-3 py-1.5 rounded-lg border transition-colors
                    ${activeTrend === p.key
                      ? 'border-[#4fc3f7] bg-[#0c2d4a] text-[#4fc3f7]'
                      : 'border-[#1a3a5c] text-[#64748b] hover:text-[#94a3b8]'
                    }
                  `}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <TrendChart
              readings={readings}
              paramKey={activeTrend as keyof import('@/types/poolpro').PoolReading}
              colour={trendParam.colour}
            />
          </div>
        </section>
      )}

      {/* Notes from latest reading */}
      {latestReading?.notes && (
        <section>
          <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-2">Operator Notes</h2>
          <div className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl px-4 py-3">
            <p className="text-[#94a3b8] text-sm leading-relaxed">{latestReading.notes}</p>
          </div>
        </section>
      )}

      {/* Quick links */}
      <section>
        <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/poolpro/history"
            className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl px-4 py-3 flex items-center gap-3 hover:border-[#4fc3f7]/40 transition-colors"
          >
            <span className="text-xl">📋</span>
            <div>
              <div className="text-white text-sm font-medium">View History</div>
              <div className="text-[#64748b] text-xs">{readings.length} readings</div>
            </div>
          </Link>
          <Link
            href="/poolpro/cheatsheet"
            className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl px-4 py-3 flex items-center gap-3 hover:border-[#4fc3f7]/40 transition-colors"
          >
            <span className="text-xl">📖</span>
            <div>
              <div className="text-white text-sm font-medium">Quick Guide</div>
              <div className="text-[#64748b] text-xs">Ranges &amp; routines</div>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
