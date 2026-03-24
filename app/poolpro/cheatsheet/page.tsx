'use client';

import { useState } from 'react';
import { PARAMETER_RANGES } from '@/types/poolpro';

// ---- Data ------------------------------------------------------------

const DAILY_ROUTINE = [
  {
    time: 'Before opening',
    checks: [
      'Test free chlorine, combined chlorine, and pH',
      'Check water clarity — pool bottom must be clearly visible',
      'Inspect plant room: pumps, dosing units, filter pressure',
      'Verify emergency equipment in place (lifebuoy, pole, first aid)',
      'Check chemical day-tank levels',
      'Record all readings in log',
    ],
  },
  {
    time: 'During operation',
    checks: [
      'Re-test chlorine and pH every 2 hours (or per local policy)',
      'Monitor filter pressure — backwash if ≥0.5 bar above clean pressure',
      'Observe bather load — increase monitoring at peak times',
      'Remove visible debris from skimmer baskets hourly',
    ],
  },
  {
    time: 'After closing',
    checks: [
      'Final chemistry test and log entry',
      'Check dosing pumps are set correctly for overnight',
      'Clear skimmer baskets and pump basket',
      'Secure all chemical storage areas',
      'Record any incidents, corrective actions, or observations',
    ],
  },
];

const TROUBLESHOOTING = [
  {
    problem: 'Cloudy or hazy water',
    causes: [
      'Low free chlorine or high combined chlorine',
      'pH above 7.8 — reduces chlorine effectiveness',
      'High calcium hardness causing precipitation',
      'Inadequate filtration run time',
      'High bather load without sufficient chlorine demand',
    ],
    actions: [
      'Test all chemistry immediately',
      'Shock dose if combined chlorine > 0.5 ppm',
      'Check and adjust pH to 7.2–7.6',
      'Consider a flocculant/coagulant dose',
      'Extend filter run time or increase pump speed',
      'Do NOT allow bathers if bottom is not clearly visible',
    ],
  },
  {
    problem: 'Strong "chlorine" smell / eye irritation',
    causes: [
      'High combined chlorine (chloramines) — NOT excess free chlorine',
      'Poor ventilation (indoor pools)',
      'High bather load with inadequate pre-swim showering',
    ],
    actions: [
      'Test combined chlorine — target < 0.5 ppm',
      'Superchlorinate to break down chloramines',
      'Improve pre-swim shower enforcement',
      'Check ventilation system (indoor pools)',
      'Increase free chlorine residual to above 3 ppm temporarily',
    ],
  },
  {
    problem: 'pH drifting high (above 7.6)',
    causes: [
      'CO₂ loss through aeration or turbulence',
      'High alkalinity buffering pH upward',
      'CO₂ dosing system fault',
    ],
    actions: [
      'Add sodium bisulphate (dry acid) in small increments',
      'If alkalinity is also high, address alkalinity first',
      'Check CO₂ dosing system calibration',
      'Retest 30 min after each chemical addition',
    ],
  },
  {
    problem: 'pH drifting low (below 7.2)',
    causes: [
      'Over-dosing of acid or CO₂',
      'Low total alkalinity causing pH bounce',
      'High rainfall dilution (outdoor pools)',
    ],
    actions: [
      'Add sodium carbonate (soda ash) incrementally',
      'Check alkalinity — raise if below 80 ppm first',
      'Check CO₂/acid dosing pump output rate',
      'Retest 1 hour after each addition',
    ],
  },
  {
    problem: 'Chlorine not holding / rapid loss',
    causes: [
      'High bather load increasing chlorine demand',
      'Water temperature above 28°C',
      'Cyanuric acid too low (outdoor pool — UV degradation)',
      'Contamination event requiring shock dose',
      'Dosing pump fault or empty day tank',
    ],
    actions: [
      'Check dosing system and day tank level immediately',
      'Increase chlorine dose — test hourly until stable',
      'Test cyanuric acid (outdoor pools) — add stabiliser if < 10 ppm',
      'Review bather load and adjust dosing accordingly',
    ],
  },
  {
    problem: 'Scale or white deposits on tiles/fittings',
    causes: [
      'Calcium hardness above 400 ppm',
      'High pH and alkalinity combination',
      'High temperature with high calcium (spa/hydrotherapy)',
    ],
    actions: [
      'Test calcium hardness — if > 400 ppm, dilute with fresh water',
      'Adjust pH to lower end of range (7.2)',
      'Use scale inhibitor product as per manufacturer guidelines',
      'Increase frequency of tile brushing',
    ],
  },
];

const DOSING_GUIDE = [
  {
    chemical: 'Sodium hypochlorite (liquid chlorine)',
    purpose: 'Raises free chlorine',
    notes: 'Most common disinfectant. Degrades in heat and UV — store cool and dark. Check concentration (10–14%).',
    safety: 'Corrosive. Wear gloves and eye protection. Never mix with acid.',
  },
  {
    chemical: 'Sodium bisulphate / dry acid',
    purpose: 'Lowers pH',
    notes: 'Adds in small increments — allow full circulation before retesting (30+ min).',
    safety: 'Irritant. Wear PPE. Never mix with chlorine products.',
  },
  {
    chemical: 'Sodium carbonate (soda ash)',
    purpose: 'Raises pH',
    notes: 'Pre-dissolve in a bucket of pool water before adding. Avoid adding at the same time as acid.',
    safety: 'Irritant. Avoid inhaling dust.',
  },
  {
    chemical: 'Sodium bicarbonate',
    purpose: 'Raises total alkalinity',
    notes: 'Less effect on pH than soda ash. Raise alkalinity before adjusting pH.',
    safety: 'Low hazard. Standard PPE applies.',
  },
  {
    chemical: 'Calcium chloride',
    purpose: 'Raises calcium hardness',
    notes: 'Dissolve in water before adding to pool. Add max 50 ppm per day. Exothermic — generates heat.',
    safety: 'Irritant. Handle with care — dissolving generates significant heat.',
  },
  {
    chemical: 'Cyanuric acid (stabiliser)',
    purpose: 'Protects chlorine from UV',
    notes: 'Outdoor pools only. Max 50 ppm. Dissolve fully before adding — can take 24–48 h to register on test.',
    safety: 'Irritant. Wear gloves. Do not exceed recommended levels.',
  },
];

const SAFETY_REMINDERS = [
  'Never mix chemicals together — always add to water, never water to chemical.',
  'Store chemicals separately, in cool dry conditions, away from direct sunlight.',
  'Always wear appropriate PPE when handling pool chemicals (gloves, goggles, apron).',
  'Read each product\'s Safety Data Sheet (SDS/COSHH) before first use.',
  'Maintain a spillage kit near chemical storage areas.',
  'Do not allow bathers if the pool bottom is not clearly visible.',
  'Keep records of all readings, chemical additions, and incidents.',
  'Know the location of the emergency isolation switch and first aid kit.',
  'Faecal/vomit contamination: follow your facility\'s contamination incident procedure immediately.',
  'Chemical exposure: follow SDS first-aid guidance. Call emergency services if required.',
];

const COMPLIANCE_NOTES = [
  'PWTAG (Pool Water Treatment Advisory Group) Code of Practice — target ranges and operating limits.',
  'HSG179 (HSE) — Managing Health and Safety in Swimming Pools.',
  'COSHH assessments required for all chemicals in use.',
  'Daily logs must be maintained and available for inspection.',
  'Dosing probes should be calibrated against test kit results regularly.',
  'Any incident (faecal, chemical exposure, injury) must be recorded per RIDDOR requirements.',
];

// ---- Accordion section -----------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <h2 className="text-white font-semibold text-sm">{title}</h2>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 text-[#64748b] transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
        </svg>
      </button>
      {open && <div className="px-5 pb-5 border-t border-[#1a3a5c] pt-4">{children}</div>}
    </div>
  );
}

// ---- Main page -------------------------------------------------------

export default function CheatSheetPage() {
  const [activeTab, setActiveTab] = useState<'ranges' | 'routine' | 'troubleshoot' | 'chemicals' | 'safety'>('ranges');

  const TABS = [
    { id: 'ranges',       label: 'Target Ranges' },
    { id: 'routine',      label: 'Daily Routine' },
    { id: 'troubleshoot', label: 'Troubleshoot' },
    { id: 'chemicals',    label: 'Chemicals' },
    { id: 'safety',       label: 'Safety' },
  ] as const;

  return (
    <div className="px-4 py-5 max-w-3xl mx-auto space-y-5">

      <div>
        <h1 className="text-white text-xl font-bold">Quick Reference Guide</h1>
        <p className="text-[#64748b] text-sm mt-0.5">Water chemistry targets, routines &amp; troubleshooting</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              shrink-0 text-xs px-3.5 py-2 rounded-lg border transition-colors whitespace-nowrap
              ${activeTab === tab.id
                ? 'border-[#4fc3f7] bg-[#0c2d4a] text-[#4fc3f7] font-medium'
                : 'border-[#1a3a5c] text-[#64748b] hover:text-[#94a3b8]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- Target Ranges ---- */}
      {activeTab === 'ranges' && (
        <div className="space-y-3">
          <p className="text-[#64748b] text-xs">
            UK PWTAG Code of Practice targets. Always check your site-specific operating limits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(PARAMETER_RANGES).map(([key, range]) => (
              <div
                key={key}
                className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm">{range.label}</span>
                  <span className="text-[#4fc3f7] font-data text-sm" style={{ fontFamily: 'var(--font-data, "Space Mono", monospace)' }}>
                    {range.idealLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#64748b]">
                  <span>Hard limits:</span>
                  <span
                    className="font-data"
                    style={{ fontFamily: 'var(--font-data, "Space Mono", monospace)' }}
                  >
                    {range.min}–{range.max} {range.unit}
                  </span>
                </div>
                <p className="text-[#94a3b8] text-xs leading-relaxed">{range.description}</p>
              </div>
            ))}
          </div>

          {/* Quick reference table */}
          <div className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl overflow-hidden mt-4">
            <div className="px-4 py-3 border-b border-[#1a3a5c]">
              <h3 className="text-white text-sm font-semibold">At-a-glance reference</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a3a5c]">
                  <th className="text-left px-4 py-2.5 text-[10px] text-[#64748b] uppercase tracking-widest font-normal">Parameter</th>
                  <th className="text-left px-4 py-2.5 text-[10px] text-[#64748b] uppercase tracking-widest font-normal">Ideal</th>
                  <th className="text-left px-4 py-2.5 text-[10px] text-[#64748b] uppercase tracking-widest font-normal hidden sm:table-cell">Hard limits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a3a5c]">
                {Object.entries(PARAMETER_RANGES).map(([key, range]) => (
                  <tr key={key}>
                    <td className="px-4 py-2.5 text-[#94a3b8]">{range.label}</td>
                    <td className="px-4 py-2.5 text-[#4fc3f7] font-data text-xs" style={{ fontFamily: 'var(--font-data, "Space Mono", monospace)' }}>
                      {range.idealLabel}
                    </td>
                    <td className="px-4 py-2.5 text-[#64748b] text-xs hidden sm:table-cell font-data" style={{ fontFamily: 'var(--font-data, "Space Mono", monospace)' }}>
                      {range.min}–{range.max} {range.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---- Daily Routine ---- */}
      {activeTab === 'routine' && (
        <div className="space-y-3">
          {DAILY_ROUTINE.map((period) => (
            <Section key={period.time} title={period.time}>
              <ul className="space-y-2">
                {period.checks.map((check) => (
                  <li key={check} className="flex items-start gap-2.5 text-sm text-[#94a3b8]">
                    <span className="shrink-0 text-[#4fc3f7] mt-0.5">›</span>
                    {check}
                  </li>
                ))}
              </ul>
            </Section>
          ))}

          {/* Weekly/monthly summary */}
          <div className="bg-[#0a1628] border border-[#1a3a5c] border-dashed rounded-xl px-4 py-4 space-y-3">
            <h3 className="text-white text-sm font-semibold">Weekly &amp; monthly</h3>
            <div className="text-xs text-[#94a3b8] space-y-1.5">
              <div><span className="text-[#4fc3f7] font-medium">Weekly:</span> Trend review of pressure, turnover, dosing demand. Calibrate probes against test kit. Backwash record audit.</div>
              <div><span className="text-[#a78bfa] font-medium">Monthly:</span> Mini-audit against PWTAG/HSG179 controls. Emergency drill rehearsal. Corrective action closure review.</div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Troubleshoot ---- */}
      {activeTab === 'troubleshoot' && (
        <div className="space-y-3">
          {TROUBLESHOOTING.map((item) => (
            <Section key={item.problem} title={item.problem}>
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] text-[#f59e0b] uppercase tracking-widest mb-2">Likely causes</div>
                  <ul className="space-y-1.5">
                    {item.causes.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                        <span className="shrink-0 text-[#f59e0b] mt-0.5">·</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] text-[#22c55e] uppercase tracking-widest mb-2">What to do</div>
                  <ul className="space-y-1.5">
                    {item.actions.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                        <span className="shrink-0 text-[#22c55e] mt-0.5">›</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>
          ))}
        </div>
      )}

      {/* ---- Chemicals ---- */}
      {activeTab === 'chemicals' && (
        <div className="space-y-3">
          <p className="text-[#64748b] text-xs">
            Common pool chemicals. Always read the SDS and site COSHH assessment before use.
          </p>
          {DOSING_GUIDE.map((chem) => (
            <div
              key={chem.chemical}
              className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <h3 className="text-white text-sm font-semibold">{chem.chemical}</h3>
                <span className="text-[10px] bg-[#0c2d4a] border border-[#0284c7] text-[#7dd3fc] px-2.5 py-0.5 rounded-full shrink-0">
                  {chem.purpose}
                </span>
              </div>
              <p className="text-[#94a3b8] text-xs leading-relaxed">{chem.notes}</p>
              <div className="flex items-start gap-2 text-xs text-[#fca5a5] bg-[#450a0a] border border-[#dc2626]/50 rounded-lg px-3 py-2">
                <span className="shrink-0">⚠</span>
                <span>{chem.safety}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Safety ---- */}
      {activeTab === 'safety' && (
        <div className="space-y-3">
          <div className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl p-4 space-y-3">
            <h2 className="text-white font-semibold text-sm">Safety Reminders</h2>
            <ul className="space-y-2.5">
              {SAFETY_REMINDERS.map((reminder) => (
                <li key={reminder} className="flex items-start gap-2.5 text-sm text-[#94a3b8]">
                  <span className="shrink-0 text-[#ef4444] mt-0.5">⚠</span>
                  {reminder}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0d1f38] border border-[#1a3a5c] rounded-xl p-4 space-y-3">
            <h2 className="text-white font-semibold text-sm">Compliance References (UK)</h2>
            <ul className="space-y-2.5">
              {COMPLIANCE_NOTES.map((note) => (
                <li key={note} className="flex items-start gap-2.5 text-xs text-[#94a3b8]">
                  <span className="shrink-0 text-[#4fc3f7] mt-0.5">›</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency quick-ref card */}
          <div className="bg-[#450a0a] border border-[#dc2626] rounded-xl p-4 space-y-3">
            <h2 className="text-[#fca5a5] font-bold text-sm">Emergency Actions</h2>
            <div className="space-y-2 text-sm text-[#fca5a5]">
              <div><span className="font-bold">Faecal/vomit contamination:</span> Clear pool, apply contamination incident treatment protocol, notify duty manager, do not reopen until remediation complete.</div>
              <div><span className="font-bold">Chemical splash/exposure:</span> Follow SDS first-aid guidance. Call 999 if required. Irrigate affected area with water for minimum 15 minutes.</div>
              <div><span className="font-bold">Major leak/pump failure:</span> Isolate relevant line, protect electrical equipment, escalate engineering response immediately.</div>
              <div><span className="font-bold">Suspected electrical hazard:</span> Stop work, keep area clear, lock off supply until competent person confirms safety.</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
