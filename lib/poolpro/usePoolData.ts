'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Pool, PoolReading } from '@/types/poolpro';
import {
  deleteReading as localDeleteReading,
  getActivePoolId,
  getPools,
  getReadings,
  savePool,
  saveReading,
  seedDemoDataIfEmpty,
  setActivePoolId,
} from './storage';
import { supabase, isSupabaseConfigured } from './supabase';
import { generateAlerts } from './warnings';
import type { Alert } from '@/types/poolpro';

interface PoolData {
  pools: Pool[];
  activePool: Pool | null;
  readings: PoolReading[];
  latestReading: PoolReading | null;
  alerts: Alert[];
  isLoading: boolean;
  isOnline: boolean;
  switchPool: (id: string) => void;
  addPool: (pool: Omit<Pool, 'id'>) => Promise<Pool>;
  logReading: (reading: Omit<PoolReading, 'id' | 'created_at'>) => Promise<PoolReading>;
  removeReading: (readingId: string) => Promise<void>;
  refresh: () => void;
}

function uuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function usePoolData(): PoolData {
  const [pools, setPools]       = useState<Pool[]>([]);
  const [activePoolId, setActive] = useState<string | null>(null);
  const [readings, setReadings] = useState<PoolReading[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isOnline, setOnline]   = useState(true);

  // Track network status
  useEffect(() => {
    const handleOnline  = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    seedDemoDataIfEmpty();

    let poolList = getPools();
    let activeId = getActivePoolId();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: remotePools } = await supabase.from('pools').select('*');
        if (remotePools) {
          poolList = remotePools as Pool[];
          poolList.forEach((p) => savePool(p));
        }
      } catch {
        // Fall through to local data
      }
    }

    if (!activeId && poolList.length > 0) {
      activeId = poolList[0].id;
      setActivePoolId(activeId);
    }

    setPools(poolList);
    setActive(activeId);

    if (activeId) {
      let readingList = getReadings(activeId);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: remoteReadings } = await supabase
            .from('readings')
            .select('*')
            .eq('pool_id', activeId)
            .order('read_at', { ascending: false })
            .limit(90);
          if (remoteReadings) {
            readingList = remoteReadings as PoolReading[];
            readingList.forEach((r) => saveReading(r));
          }
        } catch {
          // Use local data
        }
      }

      setReadings(readingList);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const switchPool = useCallback((id: string) => {
    setActivePoolId(id);
    setActive(id);
    const localReadings = getReadings(id);
    setReadings(localReadings);
  }, []);

  const addPool = useCallback(async (data: Omit<Pool, 'id'>): Promise<Pool> => {
    const pool: Pool = { ...data, id: uuid() };

    if (isSupabaseConfigured && supabase) {
      const { data: created, error } = await supabase
        .from('pools')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(pool as any)
        .select()
        .single();
      if (!error && created) {
        const result = created as Pool;
        savePool(result);
        setPools(getPools());
        return result;
      }
    }

    savePool(pool);
    setPools(getPools());
    return pool;
  }, []);

  const logReading = useCallback(
    async (data: Omit<PoolReading, 'id' | 'created_at'>): Promise<PoolReading> => {
      const reading: PoolReading = {
        ...data,
        id: uuid(),
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && supabase) {
        const { data: created, error } = await supabase
          .from('readings')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert(reading as any)
          .select()
          .single();
        if (!error && created) {
          const result = created as PoolReading;
          saveReading(result);
          setReadings(getReadings(result.pool_id));
          return result;
        }
      }

      saveReading(reading);
      setReadings(getReadings(reading.pool_id));
      return reading;
    },
    [],
  );

  const removeReading = useCallback(
    async (readingId: string) => {
      if (!activePoolId) return;

      if (isSupabaseConfigured && supabase) {
        await supabase.from('readings').delete().eq('id', readingId);
      }

      localDeleteReading(activePoolId, readingId);
      setReadings(getReadings(activePoolId));
    },
    [activePoolId],
  );

  const activePool = pools.find((p) => p.id === activePoolId) ?? null;
  const latestReading = readings[0] ?? null;
  const alerts = latestReading ? generateAlerts(latestReading) : [];

  return {
    pools,
    activePool,
    readings,
    latestReading,
    alerts,
    isLoading,
    isOnline,
    switchPool,
    addPool,
    logReading,
    removeReading,
    refresh: load,
  };
}
