'use client';

/**
 * Offline-first localStorage layer.
 *
 * When Supabase is unreachable or not configured, this module acts as the
 * primary data store. Readings pending a sync are flagged with `_pending: true`
 * and can be flushed to Supabase when connectivity is restored.
 *
 * Key layout:
 *   poolpro:pools           → Pool[]
 *   poolpro:readings:{poolId} → PoolReading[]
 *   poolpro:active_pool     → pool id (string)
 */

import type { Pool, PoolReading } from '@/types/poolpro';

const PREFIX = 'poolpro';

function key(segment: string) {
  return `${PREFIX}:${segment}`;
}

function read<T>(k: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(k: string, value: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(k, JSON.stringify(value));
}

// ============================================================
// Pools
// ============================================================

export function getPools(): Pool[] {
  return read<Pool[]>(key('pools'), []);
}

export function savePool(pool: Pool): Pool[] {
  const existing = getPools();
  const idx = existing.findIndex((p) => p.id === pool.id);
  const updated =
    idx >= 0
      ? existing.map((p) => (p.id === pool.id ? pool : p))
      : [...existing, pool];
  write(key('pools'), updated);
  return updated;
}

export function deletePool(id: string): Pool[] {
  const updated = getPools().filter((p) => p.id !== id);
  write(key('pools'), updated);
  return updated;
}

export function getActivePoolId(): string | null {
  return read<string | null>(key('active_pool'), null);
}

export function setActivePoolId(id: string) {
  write(key('active_pool'), id);
}

// ============================================================
// Readings
// ============================================================

export function getReadings(poolId: string): PoolReading[] {
  return read<PoolReading[]>(key(`readings:${poolId}`), []);
}

export function saveReading(reading: PoolReading): PoolReading[] {
  const existing = getReadings(reading.pool_id);
  const idx = existing.findIndex((r) => r.id === reading.id);
  const updated =
    idx >= 0
      ? existing.map((r) => (r.id === reading.id ? reading : r))
      : [reading, ...existing];
  // Keep newest-first
  updated.sort((a, b) => b.read_at.localeCompare(a.read_at));
  write(key(`readings:${reading.pool_id}`), updated);
  return updated;
}

export function deleteReading(poolId: string, readingId: string): PoolReading[] {
  const updated = getReadings(poolId).filter((r) => r.id !== readingId);
  write(key(`readings:${poolId}`), updated);
  return updated;
}

export function getLatestReading(poolId: string): PoolReading | null {
  const readings = getReadings(poolId);
  return readings[0] ?? null;
}

// ============================================================
// Pending sync queue
// ============================================================

interface PendingItem {
  type: 'reading' | 'pool';
  action: 'upsert' | 'delete';
  data: unknown;
  timestamp: string;
}

export function enqueuePending(item: PendingItem) {
  const queue = read<PendingItem[]>(key('pending'), []);
  write(key('pending'), [...queue, item]);
}

export function getPendingQueue(): PendingItem[] {
  return read<PendingItem[]>(key('pending'), []);
}

export function clearPendingQueue() {
  write(key('pending'), []);
}

// ============================================================
// Seeding helpers (for first-run demo data)
// ============================================================

export function seedDemoDataIfEmpty() {
  const pools = getPools();
  if (pools.length > 0) return;

  const demoPool: Pool = {
    id: 'demo-pool-1',
    name: 'Main Pool',
    volume_litres: 500000,
    pool_type: 'indoor',
    location: 'Leisure Centre, Block A',
  };

  savePool(demoPool);
  setActivePoolId(demoPool.id);

  const now = new Date();
  const readings: PoolReading[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    return {
      id: `demo-reading-${i}`,
      pool_id: demoPool.id,
      read_at: d.toISOString(),
      free_chlorine: 1.5 + Math.random() * 1.2,
      combined_chlorine: 0.1 + Math.random() * 0.2,
      ph: 7.3 + Math.random() * 0.3,
      alkalinity: 90 + Math.round(Math.random() * 20),
      calcium_hardness: 250 + Math.round(Math.random() * 50),
      cyanuric_acid: 20 + Math.round(Math.random() * 10),
      temperature: 26 + Math.random() * 2,
      turbidity: 'clear',
      notes: i === 0 ? 'Morning check — all good.' : '',
    };
  });

  readings.forEach((r) => saveReading(r));
}
