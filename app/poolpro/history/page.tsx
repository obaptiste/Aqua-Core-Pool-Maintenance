'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { usePoolData } from '@/lib/poolpro/usePoolData';
import { parameterStatus } from '@/lib/poolpro/warnings';
import { downloadCSV, openPrintView } from '@/lib/poolpro/export';
import type { PoolReading } from '@/types/poolpro';

// ---- Helpers ----------------------------------------------------------

const STATUS_COLOUR: Record<string, string> = {
  ok:      'text-[#86efac]',
  warning: 'text-[#fcd34d]',
  danger:  'text-[#fca5a5]',
  info:    'text-[#7dd3fc]',
};

function Cell({ fieldKey, value }: { fieldKey: string; value: number | undefined | null }) {
  if (value == null) return <span className="text-[#334155]">—</span>;
  const s = parameterStatus(fieldKey, value);
  return (
    <span className={STATUS_COLOUR[s] ?? 'text-[#e2e8f0]'} style={{ fontFamily: 'var(--font-data, "Space Mono", monospace)' }}>
      {value.toFixed(fieldKey === 'alkalinity' || fieldKey === 'calcium_hardness' || fieldKey === 'cyanuric_acid' ? 0 : 1)}
    </span>
  );
}

function TurbidityCell({ value }: { value: string | undefined }) {
  const MAP: Record<string, string> = {
    'clear':           'text-[#86efac]',
    'slightly-cloudy': 'text-[#7dd3fc]',
    'cloudy':          'text-[#fcd34d]',
    'very-cloudy':     'text-[#fca5a5]',
  };
  if (!value) return <span className="text-[#334155]">—</span>;
  return <span className={MAP[value] ?? 'text-[#94a3b8]'}>{value.replace('-', ' ')}</span>;
}

// ---- Expanded row detail ----------------------------------------------

function ReadingDetail({ reading, onDelete }: { reading: PoolReading; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="px-4 pb-4 pt-3 bg-[#081222] border-t border-[#1a3a5c] text-sm space-y-3">
      {/* Full parameter grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {[
          ['Free Cl', 'free_chlorine', 'ppm'],
          ['Comb Cl', 'combined_chlorine', 'ppm'],
          ['pH', 'ph', ''],
          ['Alkalinity', 'alkalinity', 'ppm'],
          ['Ca Hardness', 'calcium_hardness', 'ppm'],
          ['Cyanuric Acid', 'cyanuric_acid', 'ppm'],
          ['Temperature', 'temperature', '°C'],
        ].map(([label, key, unit]) => {
          const val = reading[key as keyof PoolReading] as number | undefined;
          return (
            <div key={key} className="bg-[#0d1f38] rounded-lg px-3 py-2">
              <div className="text-[#64748b]">{label}</div>
              <div className="font-medium">
                <Cell fieldKey={key} value={val} />
                {val != null && unit && <span className="text-[#64748b] ml-1">{unit}</span>}
              </div>
            </div>
          );
        })}
        <div className="bg-[#0d1f38] rounded-lg px-3 py-2">
          <div className="text-[#64748b]">Clarity</div>
          <TurbidityCell value={reading.turbidity} />
        </div>
      </div>

      {reading.notes && (
        <div className="text-[#94a3b8] italic leading-relaxed">
          &ldquo;{reading.notes}&rdquo;
        </div>
      )}

      {/* Maintenance checks */}
      {reading.checks_completed && Object.keys(reading.checks_completed).length > 0 && (
        <div>
          <div className="text-[10px] text-[#64748b] uppercase tracking-widest mb-1.5">Checks completed</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(reading.checks_completed)
              .filter(([, v]) => v)
              .map(([k]) => (
                <span key={k} className="text-[10px] bg-[#14532d] text-[#86efac] border border-[#16a34a] px-2 py-0.5 rounded-full">
                  {k.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Delete */}
      <div className="flex justify-end">
        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-[#fca5a5] text-xs">Delete this reading?</span>
            <button onClick={onDelete} className="text-xs text-[#fca5a5] border border-[#dc2626] px-3 py-1 rounded-lg hover:bg-[#450a0a] transition-colors">
              Yes, delete
            </button>
            <button onClick={() => setConfirming(false)} className="text-xs text-[#64748b] border border-[#1a3a5c] px-3 py-1 rounded-lg hover:border-[#4fc3f7] transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs text-[#64748b] border border-[#1a3a5c] px-3 py-1 rounded-lg hover:text-[#fca5a5] hover:border-[#dc2626] transition-colors"
          >
            Delete reading
          </button>
        )}
      </div>
    </div>
  );
}

// ---- Main page --------------------------------------------------------

export default function HistoryPage() {
  const { activePool, readings, isLoading, removeReading } = usePoolData();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch]     = useState('');

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-[#64748b] text-sm animate-pulse">Loading…</div>;
  }

  const filtered = search.trim()
    ? readings.filter((r) => {
        const q = search.toLowerCase();
        const d = format(new Date(r.read_at), 'dd MMM yyyy').toLowerCase();
        return d.includes(q) || (r.notes ?? '').toLowerCase().includes(q);
      })
    : readings;

  function handleExportCSV() {
    if (!activePool) return;
    downloadCSV(activePool, readings);
  }

  function handlePrint() {
    if (!activePool) return;
    openPrintView(activePool, readings);
  }

  return (
    <div className="px-4 py-5 max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-white text-xl font-bold">Readings History</h1>
          <p className="text-[#64748b] text-sm">
            {activePool?.name} · {readings.length} reading{readings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="text-xs text-[#94a3b8] border border-[#1a3a5c] px-3 py-2 rounded-lg hover:border-[#4fc3f7] transition-colors flex items-center gap-1.5"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a1 1 0 001 1h8a1 1 0 001-1v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H6a1 1 0 00-1 1zm2 0h6v3H7V4zm-1 9H5v2h10v-2h-1v-2H6v2z" clipRule="evenodd"/>
            </svg>
            Print
          </button>
          <button
            onClick={handleExportCSV}
            className="text-xs text-[#4fc3f7] border border-[#1a3a5c] px-3 py-2 rounded-lg hover:border-[#4fc3f7] transition-colors flex items-center gap-1.5"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      {readings.length > 5 && (
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by date or notes…"
          className="
            w-full bg-[#0d1f38] border border-[#1a3a5c] text-[#e2e8f0] text-sm
            rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4fc3f7]
            placeholder-[#334155]
          "
        />
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#64748b] text-sm">
          {search ? 'No readings match your search.' : 'No readings logged yet.'}
        </div>
      ) : (
        <div className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl overflow-hidden">
          {/* Desktop table header */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] px-4 py-2.5 border-b border-[#1a3a5c]">
            {['Date/Time', 'Cl (ppm)', 'pH', 'Alk (ppm)', 'Temp °C', 'Clarity'].map((h) => (
              <div key={h} className="text-[10px] text-[#64748b] uppercase tracking-widest">{h}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#1a3a5c]">
            {filtered.map((r) => {
              const isOpen = expanded === r.id;
              const dt = new Date(r.read_at);

              return (
                <div key={r.id}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-[#0c2d4a] transition-colors"
                    onClick={() => setExpanded(isOpen ? null : r.id)}
                    aria-expanded={isOpen}
                  >
                    {/* Mobile: single-line summary */}
                    <div className="flex items-center justify-between sm:hidden">
                      <div>
                        <div className="text-white text-sm font-medium">
                          {format(dt, 'EEE d MMM')} · {format(dt, 'HH:mm')}
                        </div>
                        <div className="text-xs text-[#64748b] mt-0.5">
                          Cl: <Cell fieldKey="free_chlorine" value={r.free_chlorine} />
                          {' '}· pH: <Cell fieldKey="ph" value={r.ph} />
                          {' '}· Alk: <Cell fieldKey="alkalinity" value={r.alkalinity} />
                        </div>
                      </div>
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-4 h-4 text-[#64748b] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
                      </svg>
                    </div>

                    {/* Desktop: table row */}
                    <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center">
                      <div>
                        <div className="text-white text-sm">{format(dt, 'dd/MM/yyyy')}</div>
                        <div className="text-[#64748b] text-xs">{format(dt, 'HH:mm')}</div>
                      </div>
                      <Cell fieldKey="free_chlorine" value={r.free_chlorine} />
                      <Cell fieldKey="ph" value={r.ph} />
                      <Cell fieldKey="alkalinity" value={r.alkalinity} />
                      <Cell fieldKey="temperature" value={r.temperature} />
                      <TurbidityCell value={r.turbidity} />
                    </div>
                  </button>

                  {isOpen && (
                    <ReadingDetail
                      reading={r}
                      onDelete={async () => {
                        await removeReading(r.id);
                        setExpanded(null);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
