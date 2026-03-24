// Minimal Supabase Database type stub.
// Replace with the full generated file from `supabase gen types typescript`
// once you have a live Supabase project.

export type Database = {
  public: {
    Tables: {
      pools: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          volume_litres: number | null;
          pool_type: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pools']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['pools']['Insert']>;
      };
      readings: {
        Row: {
          id: string;
          pool_id: string;
          read_at: string;
          free_chlorine: number | null;
          combined_chlorine: number | null;
          ph: number | null;
          alkalinity: number | null;
          calcium_hardness: number | null;
          cyanuric_acid: number | null;
          temperature: number | null;
          turbidity: string | null;
          notes: string | null;
          checks_completed: Record<string, boolean> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['readings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['readings']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
