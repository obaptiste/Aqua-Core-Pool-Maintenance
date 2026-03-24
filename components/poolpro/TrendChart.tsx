'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format } from 'date-fns';
import type { PoolReading } from '@/types/poolpro';
import { PARAMETER_RANGES } from '@/types/poolpro';

interface TrendChartProps {
  readings: PoolReading[];
  /** Which parameter key to chart */
  paramKey: keyof PoolReading;
  /** Colour for the data line */
  colour?: string;
}

interface ChartPoint {
  date: string;
  value: number | undefined;
}

export default function TrendChart({ readings, paramKey, colour = '#4fc3f7' }: TrendChartProps) {
  const range = PARAMETER_RANGES[paramKey as string];

  const data: ChartPoint[] = [...readings]
    .sort((a, b) => a.read_at.localeCompare(b.read_at))
    .slice(-14) // last 14 readings
    .map((r) => ({
      date: format(new Date(r.read_at), 'dd/MM'),
      value: (r[paramKey] as number | undefined) ?? undefined,
    }))
    .filter((p) => p.value != null);

  if (data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-[#64748b] text-sm">
        No data yet
      </div>
    );
  }

  const values = data.map((d) => d.value!).filter(Boolean);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const pad     = (dataMax - dataMin) * 0.3 || 0.5;
  const yMin    = Math.max(0, Math.floor(dataMin - pad));
  const yMax    = Math.ceil(dataMax + pad);

  return (
    <ResponsiveContainer width="100%" height={130}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[yMin, yMax]}
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#0d1f38',
            border: '1px solid #1a3a5c',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(v) => [
            `${Number(v).toFixed(2)} ${range?.unit ?? ''}`,
            range?.label ?? String(paramKey),
          ]}
        />
        {/* Safe range reference lines */}
        {range && (
          <>
            <ReferenceLine y={range.min} stroke="#22c55e" strokeDasharray="4 3" strokeWidth={1} />
            <ReferenceLine y={range.max} stroke="#22c55e" strokeDasharray="4 3" strokeWidth={1} />
          </>
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={colour}
          strokeWidth={2}
          dot={{ fill: colour, r: 3 }}
          activeDot={{ r: 5, fill: colour }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
