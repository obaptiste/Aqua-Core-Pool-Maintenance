'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { usePoolData } from '@/lib/poolpro/usePoolData';
import { generateAlerts } from '@/lib/poolpro/warnings';
import { PARAMETER_RANGES } from '@/types/poolpro';
import type { PoolReading, Turbidity } from '@/types/poolpro';
import AlertBanner from '@/components/poolpro/AlertBanner';

// ---- Field definitions -----------------------------------------------

interface FieldDef {
  key: keyof PoolReading;
  label: string;
  unit: string;
  step: number;
  min: number;
  max: number;
  placeholder: string;
  colour: string;
}

const NUMERIC_FIELDS: FieldDef[] = [
  {
    key: 'free_chlorine',
    label: 'Free Chlorine',
    unit: 'ppm',
    step: 0.1,
    min: 0,
    max: 20,
    placeholder: '1.5',
    colour: '#4fc3f7',
  },
  {
    key: 'combined_chlorine',
    label: 'Combined Chlorine',
    unit: 'ppm',
    step: 0.1,
    min: 0,
    max: 10,
    placeholder: '0.2',
    colour: '#fb923c',
  },
  {
    key: 'ph',
    label: 'pH',
    unit: '',
    step: 0.1,
    min: 6,
    max: 9,
    placeholder: '7.4',
    colour: '#a78bfa',
  },
  {
    key: 'alkalinity',
    label: 'Total Alkalinity',
    unit: 'ppm',
    step: 1,
    min: 0,
    max: 500,
    placeholder: '100',
    colour: '#34d399',
  },
  {
    key: 'calcium_hardness',
    label: 'Calcium Hardness',
    unit: 'ppm',
    step: 5,
    min: 0,
    max: 1000,
    placeholder: '250',
    colour: '#fbbf24',
  },
  {
    key: 'cyanuric_acid',
    label: 'Cyanuric Acid',
    unit: 'ppm',
    step: 1,
    min: 0,
    max: 200,
    placeholder: '20',
    colour: '#f472b6',
  },
  {
    key: 'temperature',
    label: 'Water Temperature',
    unit: '°C',
    step: 0.5,
    min: 0,
    max: 45,
    placeholder: '26.0',
    colour: '#f87171',
  },
];

const TURBIDITY_OPTIONS: { value: Turbidity; label: string; desc: string }[] = [
  { value: 'clear',           label: 'Clear',        desc: 'Pool bottom fully visible' },
  { value: 'slightly-cloudy', label: 'Slight haze',  desc: 'Bottom visible but not sharp' },
  { value: 'cloudy',          label: 'Cloudy',       desc: 'Bottom barely visible' },
  { value: 'very-cloudy',     label: 'Very cloudy',  desc: 'Bottom not visible — close pool' },
];

const MAINTENANCE_CHECKS = [
  { key: 'skimmerBaskets',        label: 'Skimmer baskets cleared' },
  { key: 'pumpBasket',            label: 'Pump basket checked' },
  { key: 'filterPressure',        label: 'Filter pressure noted' },
  { key: 'backwashRequired',      label: 'Backwash required / completed' },
  { key: 'dosingSystemOk',        label: 'Dosing system operating correctly' },
  { key: 'surroundInspection',    label: 'Pool surround inspected' },
  { key: 'safetyEquipment',       label: 'Safety equipment in place' },
  { key: 'chemicalLevelsChecked', label: 'Chemical stock levels checked' },
];

// ---- Inline range hint ------------------------------------------------

function RangeHint({ fieldKey }: { fieldKey: string }) {
  const r = PARAMETER_RANGES[fieldKey];
  if (!r) return null;
  return (
    <span className="text-[10px] text-[#64748b]">
      Target: {r.idealLabel}
    </span>
  );
}

// ---- Inline validation feedback ---------------------------------------

function FieldStatus({ fieldKey, value }: { fieldKey: string; value: string }) {
  if (!value) return null;
  const num = parseFloat(value);
  if (isNaN(num)) return <span className="text-[10px] text-[#f59e0b]">Invalid number</span>;
  const r = PARAMETER_RANGES[fieldKey];
  if (!r) return null;
  if (num < r.min || num > r.max) {
    return <span className="text-[10px] text-[#f59e0b]">Outside target ({r.idealLabel})</span>;
  }
  return <span className="text-[10px] text-[#22c55e]">In range ✓</span>;
}

// ---- Main page --------------------------------------------------------

export default function LogReadingPage() {
  const router = useRouter();
  const { activePool, logReading, isLoading } = usePoolData();

  const now = new Date();
  const [date, setDate]   = useState(format(now, 'yyyy-MM-dd'));
  const [time, setTime]   = useState(format(now, 'HH:mm'));
  const [values, setValues] = useState<Record<string, string>>({});
  const [turbidity, setTurbidity] = useState<Turbidity>('clear');
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [notes, setNotes]   = useState('');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  function setField(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCheck(key: string) {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Build a partial reading from current form values for preview/alert check
  function buildReading(): Omit<PoolReading, 'id' | 'created_at'> {
    const read_at = new Date(`${date}T${time}`).toISOString();
    const partial: Partial<PoolReading> = {
      pool_id: activePool?.id ?? '',
      read_at,
      turbidity,
      notes,
      checks_completed: checks,
    };
    for (const field of NUMERIC_FIELDS) {
      const raw = values[field.key as string];
      if (raw !== undefined && raw !== '') {
        (partial as Record<string, unknown>)[field.key as string] = parseFloat(raw);
      }
    }
    return partial as Omit<PoolReading, 'id' | 'created_at'>;
  }

  const previewReading = buildReading();
  const liveAlerts = generateAlerts({ ...previewReading, id: '__preview__' } as PoolReading);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activePool) return;
    setSaving(true);
    setError('');

    try {
      await logReading(buildReading());
      setSaved(true);
      setTimeout(() => router.push('/poolpro/dashboard'), 1200);
    } catch (err) {
      setError('Failed to save reading. Your data is stored locally.');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-[#64748b] text-sm animate-pulse">Loading…</div>;
  }

  if (!activePool) {
    return (
      <div className="flex items-center justify-center h-64 px-6 text-center">
        <p className="text-[#64748b] text-sm">No pool selected. Go back to the dashboard to set one up.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">Log Reading</h1>
          <p className="text-[#64748b] text-sm">{activePool.name}</p>
        </div>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="text-xs text-[#4fc3f7] border border-[#1a3a5c] px-3 py-1.5 rounded-lg hover:border-[#4fc3f7] transition-colors"
        >
          {preview ? 'Hide preview' : 'Live preview'}
        </button>
      </div>

      {/* Live alert preview */}
      {preview && liveAlerts.length > 0 && (
        <div>
          <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-2">
            Preview — {liveAlerts.length} alert{liveAlerts.length > 1 ? 's' : ''} based on current values
          </h2>
          <AlertBanner alerts={liveAlerts} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Date / Time */}
        <section>
          <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-3">Date &amp; Time</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm text-[#94a3b8]" htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="
                  w-full bg-[#0d1f38] border border-[#1a3a5c] text-[#e2e8f0] text-sm
                  rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4fc3f7]
                  [color-scheme:dark]
                "
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-[#94a3b8]" htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="
                  w-full bg-[#0d1f38] border border-[#1a3a5c] text-[#e2e8f0] text-sm
                  rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#4fc3f7]
                  [color-scheme:dark]
                "
              />
            </div>
          </div>
        </section>

        {/* Chemical readings */}
        <section>
          <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-3">Chemical Readings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NUMERIC_FIELDS.map((field) => {
              const val = values[field.key as string] ?? '';
              return (
                <div
                  key={field.key as string}
                  className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl p-3 space-y-2 focus-within:border-[#4fc3f7]/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={field.key as string}
                      className="text-sm font-medium"
                      style={{ color: field.colour }}
                    >
                      {field.label}
                    </label>
                    <RangeHint fieldKey={field.key as string} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id={field.key as string}
                      type="number"
                      inputMode="decimal"
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      value={val}
                      onChange={(e) => setField(field.key as string, e.target.value)}
                      placeholder={field.placeholder}
                      className="
                        flex-1 bg-transparent border-b border-[#1a3a5c] text-white
                        font-data text-xl py-1 focus:outline-none focus:border-[#4fc3f7]
                        placeholder-[#1a3a5c]
                      "
                      style={{ fontFamily: 'var(--font-data, "Space Mono", monospace)' }}
                    />
                    {field.unit && (
                      <span className="text-[#64748b] text-sm shrink-0">{field.unit}</span>
                    )}
                  </div>
                  <FieldStatus fieldKey={field.key as string} value={val} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Turbidity */}
        <section>
          <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-3">Water Clarity</h2>
          <div className="grid grid-cols-2 gap-2">
            {TURBIDITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTurbidity(opt.value)}
                className={`
                  text-left px-3 py-2.5 rounded-xl border transition-colors
                  ${turbidity === opt.value
                    ? 'border-[#4fc3f7] bg-[#0c2d4a] text-white'
                    : 'border-[#1a3a5c] bg-[#0d1f38] text-[#94a3b8] hover:border-[#2a5a8c]'
                  }
                `}
              >
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Maintenance checks */}
        <section>
          <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-3">Maintenance Checks</h2>
          <div className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl divide-y divide-[#1a3a5c]">
            {MAINTENANCE_CHECKS.map((check) => (
              <label
                key={check.key}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#0c2d4a] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checks[check.key] ?? false}
                  onChange={() => toggleCheck(check.key)}
                  className="w-4 h-4 rounded border-[#1a3a5c] accent-[#4fc3f7] shrink-0"
                />
                <span className="text-sm text-[#94a3b8]">{check.label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section>
          <h2 className="text-xs text-[#64748b] uppercase tracking-widest mb-3">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any observations, corrective actions taken, unusual conditions…"
            rows={3}
            className="
              w-full bg-[#0d1f38] border border-[#1a3a5c] text-[#e2e8f0] text-sm
              rounded-xl px-4 py-3 focus:outline-none focus:border-[#4fc3f7]
              placeholder-[#334155] resize-none
            "
          />
        </section>

        {/* Error message */}
        {error && (
          <div className="text-sm text-[#fca5a5] bg-[#450a0a] border border-[#dc2626] rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={saving || saved}
          className={`
            w-full py-3.5 rounded-xl font-semibold text-sm transition-all
            ${saved
              ? 'bg-[#22c55e] text-white'
              : saving
                ? 'bg-[#0288d1] text-white opacity-70 cursor-not-allowed'
                : 'bg-[#4fc3f7] text-[#060e1a] hover:bg-[#38bdf8] active:scale-[0.99]'
            }
          `}
        >
          {saved ? '✓ Reading saved — redirecting…' : saving ? 'Saving…' : 'Save Reading'}
        </button>

      </form>
    </div>
  );
}
