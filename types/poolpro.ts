// ============================================================
// Core domain types for PoolPro
// ============================================================

export type Turbidity = 'clear' | 'slightly-cloudy' | 'cloudy' | 'very-cloudy';

export type PoolType = 'outdoor' | 'indoor' | 'spa' | 'hydrotherapy';

export interface Pool {
  id: string;
  user_id?: string;
  name: string;
  volume_litres?: number;
  pool_type?: PoolType;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PoolReading {
  id: string;
  pool_id: string;
  read_at: string;          // ISO-8601 datetime
  free_chlorine?: number;   // ppm
  combined_chlorine?: number; // ppm
  ph?: number;
  alkalinity?: number;      // ppm
  calcium_hardness?: number; // ppm
  cyanuric_acid?: number;   // ppm (stabiliser)
  temperature?: number;     // °C
  turbidity?: Turbidity;
  notes?: string;
  checks_completed?: MaintenanceChecks;
  created_at?: string;
}

export interface MaintenanceChecks {
  skimmerBaskets?: boolean;
  pumpBasket?: boolean;
  filterPressure?: boolean;
  backwashRequired?: boolean;
  chemicalLevelsChecked?: boolean;
  surroundInspection?: boolean;
  safetyEquipment?: boolean;
  dosingSystemOk?: boolean;
}

// Form values — all optional so partial saves work
export type ReadingFormValues = Omit<PoolReading, 'id' | 'created_at'>;

// ============================================================
// Warning / alert types
// ============================================================

export type AlertSeverity = 'danger' | 'warning' | 'ok' | 'info';

export interface Alert {
  parameter: string;
  severity: AlertSeverity;
  value: number | string;
  unit: string;
  message: string;
  why: string;
  action: string;
}

// ============================================================
// Target ranges — used by both warning logic and cheat sheet
// ============================================================

export interface ParameterRange {
  label: string;
  unit: string;
  min: number;
  max: number;
  /** Soft warning thresholds (less critical than hard limits) */
  softMin?: number;
  softMax?: number;
  idealLabel: string;
  description: string;
}

export const PARAMETER_RANGES: Record<string, ParameterRange> = {
  free_chlorine: {
    label: 'Free Chlorine',
    unit: 'ppm',
    min: 1.0,
    max: 3.0,
    softMin: 1.5,
    softMax: 2.5,
    idealLabel: '1.5 – 2.5 ppm',
    description: 'Sanitises the water and destroys pathogens. Too low is unsafe; too high causes irritation.',
  },
  combined_chlorine: {
    label: 'Combined Chlorine',
    unit: 'ppm',
    min: 0,
    max: 0.5,
    idealLabel: '< 0.5 ppm',
    description: 'Chloramines formed when free chlorine reacts with ammonia/sweat. Above 0.5 ppm causes that "chlorine smell" and eye irritation.',
  },
  ph: {
    label: 'pH',
    unit: '',
    min: 7.2,
    max: 7.6,
    softMin: 7.3,
    softMax: 7.5,
    idealLabel: '7.3 – 7.5',
    description: 'Controls chlorine effectiveness and bather comfort. Outside this range, chlorine loses potency rapidly.',
  },
  alkalinity: {
    label: 'Total Alkalinity',
    unit: 'ppm',
    min: 80,
    max: 120,
    softMin: 90,
    softMax: 110,
    idealLabel: '90 – 110 ppm',
    description: 'Buffers pH so it stays stable. Low alkalinity leads to pH "bounce"; high alkalinity makes pH hard to adjust.',
  },
  calcium_hardness: {
    label: 'Calcium Hardness',
    unit: 'ppm',
    min: 200,
    max: 400,
    idealLabel: '200 – 400 ppm',
    description: 'Prevents corrosion (too soft) or scale/cloudy water (too hard). Spas: aim for 150–250 ppm.',
  },
  cyanuric_acid: {
    label: 'Cyanuric Acid',
    unit: 'ppm',
    min: 0,
    max: 50,
    softMax: 30,
    idealLabel: '10 – 30 ppm',
    description: 'Stabiliser that protects chlorine from UV degradation in outdoor pools. Too high reduces chlorine efficacy. Do NOT use in indoor pools.',
  },
  temperature: {
    label: 'Water Temperature',
    unit: '°C',
    min: 17,
    max: 30,
    softMin: 24,
    softMax: 28,
    idealLabel: '24 – 28 °C',
    description: 'Higher temperatures accelerate chlorine consumption and bacterial growth — increase chlorine dosing accordingly.',
  },
};

// ============================================================
// Dosing calculator types
// ============================================================

export interface DosingResult {
  chemical: string;
  amount: number;
  unit: 'g' | 'kg' | 'ml' | 'L';
  instruction: string;
}
