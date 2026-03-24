'use client';

import type { Pool, PoolReading } from '@/types/poolpro';
import { format } from 'date-fns';

// ============================================================
// CSV export
// ============================================================

const CSV_HEADERS = [
  'Date',
  'Time',
  'Free Chlorine (ppm)',
  'Combined Chlorine (ppm)',
  'pH',
  'Total Alkalinity (ppm)',
  'Calcium Hardness (ppm)',
  'Cyanuric Acid (ppm)',
  'Temperature (°C)',
  'Turbidity',
  'Notes',
];

function escape(val: string | number | undefined | null): string {
  if (val == null) return '';
  const s = String(val);
  // Wrap in quotes if contains comma, newline, or quote
  if (/[,"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function readingsToCSV(pool: Pool, readings: PoolReading[]): string {
  const meta = [
    `Pool,${escape(pool.name)}`,
    `Type,${escape(pool.pool_type ?? '')}`,
    `Volume,${escape(pool.volume_litres ? `${pool.volume_litres} L` : '')}`,
    `Exported,${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
    '',
  ].join('\n');

  const header = CSV_HEADERS.join(',');

  const rows = readings.map((r) => {
    const dt = new Date(r.read_at);
    return [
      format(dt, 'dd/MM/yyyy'),
      format(dt, 'HH:mm'),
      r.free_chlorine ?? '',
      r.combined_chlorine ?? '',
      r.ph ?? '',
      r.alkalinity ?? '',
      r.calcium_hardness ?? '',
      r.cyanuric_acid ?? '',
      r.temperature ?? '',
      r.turbidity ?? '',
      r.notes ?? '',
    ]
      .map(escape)
      .join(',');
  });

  return [meta, header, ...rows].join('\n');
}

export function downloadCSV(pool: Pool, readings: PoolReading[]) {
  const csv = readingsToCSV(pool, readings);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `poolpro-${pool.name.replace(/\s+/g, '-').toLowerCase()}-${format(new Date(), 'yyyyMMdd')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================
// Print / PDF report
// ============================================================

export function openPrintView(pool: Pool, readings: PoolReading[]) {
  const rows = readings.map((r) => {
    const dt = new Date(r.read_at);
    return `
      <tr>
        <td>${format(dt, 'dd/MM/yyyy')}</td>
        <td>${format(dt, 'HH:mm')}</td>
        <td>${r.free_chlorine ?? '–'}</td>
        <td>${r.combined_chlorine ?? '–'}</td>
        <td>${r.ph ?? '–'}</td>
        <td>${r.alkalinity ?? '–'}</td>
        <td>${r.calcium_hardness ?? '–'}</td>
        <td>${r.cyanuric_acid ?? '–'}</td>
        <td>${r.temperature ?? '–'}</td>
        <td>${r.turbidity ?? '–'}</td>
        <td>${r.notes ?? ''}</td>
      </tr>`;
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PoolPro Log — ${pool.name}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 20px; }
    h1 { font-size: 16px; margin-bottom: 4px; }
    .meta { color: #555; margin-bottom: 16px; font-size: 10px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e3a5f; color: #fff; padding: 6px 4px; text-align: left; font-size: 10px; }
    td { padding: 5px 4px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) td { background: #f5f8ff; }
    @media print {
      body { margin: 10mm; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <h1>PoolPro Water Quality Log — ${pool.name}</h1>
  <div class="meta">
    Type: ${pool.pool_type ?? '–'} &nbsp;|&nbsp;
    Volume: ${pool.volume_litres ? `${pool.volume_litres.toLocaleString()} L` : '–'} &nbsp;|&nbsp;
    Printed: ${format(new Date(), 'dd/MM/yyyy HH:mm')}
  </div>
  <button onclick="window.print()" style="margin-bottom:12px;padding:6px 14px;background:#1e3a5f;color:#fff;border:none;cursor:pointer;border-radius:4px;">
    Print / Save as PDF
  </button>
  <table>
    <thead>
      <tr>
        ${CSV_HEADERS.map((h) => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.join('')}
    </tbody>
  </table>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
