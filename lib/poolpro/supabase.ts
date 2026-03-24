import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/poolpro-db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Singleton client — safe to import in both server and client components.
// When env vars are absent (local dev without Supabase), the app falls back
// to the localStorage layer defined in storage.ts.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
