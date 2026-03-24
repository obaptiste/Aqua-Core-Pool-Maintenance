import type { Alert, AlertSeverity, PoolReading } from '@/types/poolpro';
import { PARAMETER_RANGES } from '@/types/poolpro';

// ============================================================
// Core alert generator
// ============================================================

function check(
  key: string,
  value: number | undefined | null,
  reading: PoolReading,
): Alert | null {
  if (value == null || isNaN(value)) return null;

  const range = PARAMETER_RANGES[key];
  if (!range) return null;

  let severity: AlertSeverity = 'ok';
  let message = '';
  let why = range.description;
  let action = '';

  switch (key) {
    case 'free_chlorine': {
      if (value < 0.5) {
        severity = 'danger';
        message = `Free chlorine is critically low (${value} ppm)`;
        action = 'Close the pool immediately. Shock dose with sodium hypochlorite or dichlor. Do not allow bathers until readings return to 1–3 ppm and hold for at least 30 minutes.';
      } else if (value < range.min) {
        severity = 'warning';
        message = `Free chlorine is low (${value} ppm — target 1–3 ppm)`;
        action = 'Add chlorine and retest in 1 hour. Check dosing pump output and day tank level. Consider bather load and temperature.';
      } else if (value > 5) {
        severity = 'danger';
        message = `Free chlorine is very high (${value} ppm)`;
        action = 'Do not allow bathers. Reduce dosing, increase aeration, or allow natural dissipation. Test again in 2 hours.';
      } else if (value > range.max) {
        severity = 'warning';
        message = `Free chlorine is elevated (${value} ppm — target 1–3 ppm)`;
        action = 'Reduce dosing and retest in 1 hour. High bather load expected? Monitor closely.';
      }
      break;
    }
    case 'combined_chlorine': {
      if (value > 1.0) {
        severity = 'danger';
        message = `Combined chlorine is very high (${value} ppm)`;
        action = 'Superchlorinate (breakpoint chlorination) at 10× the combined chlorine level. Ensure good ventilation for indoor pools. Investigate ammonia source (high bather load, inadequate showering).';
      } else if (value > 0.5) {
        severity = 'warning';
        message = `Combined chlorine is elevated (${value} ppm — target < 0.5 ppm)`;
        action = 'Increase free chlorine to break through chloramines. Review pre-swim shower compliance. Check air ventilation (indoor pools).';
      }
      break;
    }
    case 'ph': {
      if (value < 7.0) {
        severity = 'danger';
        message = `pH is dangerously low (${value} — target 7.2–7.6)`;
        action = 'Do not allow bathers. Add sodium carbonate (soda ash) in small increments, retest every 30 min. Check CO₂ dosing system for over-feed.';
      } else if (value < range.min) {
        severity = 'warning';
        message = `pH is low (${value} — target 7.2–7.6)`;
        action = 'Add sodium carbonate (soda ash). Retest in 1 hour. Note: pH will also affect alkalinity — recheck both.';
      } else if (value > 7.8) {
        severity = 'danger';
        message = `pH is high (${value} — target 7.2–7.6)`;
        action = 'Add sodium bisulphate (dry acid) or CO₂ as per your dosing guide. Retest in 30 min. Check CO₂/acid dosing pump.';
      } else if (value > range.max) {
        severity = 'warning';
        message = `pH is slightly high (${value} — target 7.2–7.6)`;
        action = 'Add sodium bisulphate (dry acid) in small increments. Retest in 1 hour.';
      }
      break;
    }
    case 'alkalinity': {
      if (value < 60) {
        severity = 'danger';
        message = `Total alkalinity is critically low (${value} ppm — target 80–120 ppm)`;
        action = 'Add sodium bicarbonate to bring alkalinity up before adjusting pH. Low alkalinity causes rapid pH fluctuation (pH bounce).';
      } else if (value < range.min) {
        severity = 'warning';
        message = `Total alkalinity is low (${value} ppm — target 80–120 ppm)`;
        action = 'Add sodium bicarbonate. Allow 4–6 hours to circulate before retesting. Raise alkalinity before attempting pH adjustment.';
      } else if (value > 150) {
        severity = 'danger';
        message = `Total alkalinity is very high (${value} ppm — target 80–120 ppm)`;
        action = 'Add sodium bisulphate (dry acid) incrementally. High alkalinity causes pH lock and cloudy water. May require partial drain/dilution.';
      } else if (value > range.max) {
        severity = 'warning';
        message = `Total alkalinity is high (${value} ppm — target 80–120 ppm)`;
        action = 'Add small amounts of dry acid to reduce alkalinity. Retest next day.';
      }
      break;
    }
    case 'calcium_hardness': {
      if (value < 150) {
        severity = 'warning';
        message = `Calcium hardness is low (${value} ppm — target 200–400 ppm)`;
        action = 'Add calcium chloride to raise hardness. Low hardness (soft water) causes corrosion of fittings and liner. Add in stages — max 50 ppm per day.';
      } else if (value > 500) {
        severity = 'warning';
        message = `Calcium hardness is high (${value} ppm — target 200–400 ppm)`;
        action = 'Partial drain and refill with fresh water to dilute. Scale build-up can cloud water and clog equipment.';
      }
      break;
    }
    case 'cyanuric_acid': {
      if (value > 80) {
        severity = 'danger';
        message = `Cyanuric acid is very high (${value} ppm)`;
        action = 'Partial drain and refill is the only remedy. High stabiliser dramatically reduces chlorine\'s killing power ("chlorine lock"). Consider stopping stabilised chlorine tablets temporarily.';
      } else if (value > 50) {
        severity = 'warning';
        message = `Cyanuric acid is elevated (${value} ppm — target 10–30 ppm)`;
        action = 'Stop adding stabilised products (trichlor tablets). Allow natural dilution or partial drain if above 80 ppm.';
      }
      break;
    }
    case 'temperature': {
      if (value > 32) {
        severity = 'warning';
        message = `Water temperature is high (${value}°C)`;
        action = 'Increase chlorine dosing — chlorine degrades faster in warm water. Monitor more frequently. Ensure good circulation and filtration.';
      } else if (value < 18) {
        severity = 'info';
        message = `Water temperature is low (${value}°C)`;
        action = 'Cold water slows chlorine demand but can also slow circulation/filtration effectiveness. Ensure heater is functioning correctly if this is an indoor pool.';
      }
      break;
    }
    case 'turbidity': {
      const turbidityValue = reading.turbidity;
      if (turbidityValue === 'cloudy' || turbidityValue === 'very-cloudy') {
        return {
          parameter: 'Turbidity',
          severity: turbidityValue === 'very-cloudy' ? 'danger' : 'warning',
          value: turbidityValue.replace('-', ' '),
          unit: '',
          message: `Water clarity is ${turbidityValue === 'very-cloudy' ? 'very poor' : 'poor'} — "${turbidityValue.replace('-', ' ')}"`,
          why: 'Poor visibility is a safety risk (bather rescue) and indicates contamination, inadequate filtration, or chemical imbalance.',
          action: turbidityValue === 'very-cloudy'
            ? 'Close pool until clarity improves. Shock dose, backwash filter, check coagulant/flocculant. Do not allow bathers until the pool bottom is clearly visible.'
            : 'Check filtration run time and pressure. Consider floc dose. Retest chemistry — low chlorine or high pH often causes cloudiness.',
        };
      }
      break;
    }
  }

  if (severity === 'ok') return null;

  return {
    parameter: PARAMETER_RANGES[key]?.label ?? key,
    severity,
    value,
    unit: range.unit,
    message,
    why,
    action,
  };
}

// ============================================================
// Public API
// ============================================================

export function generateAlerts(reading: PoolReading): Alert[] {
  const alerts: Alert[] = [];

  const numericChecks: Array<keyof PoolReading> = [
    'free_chlorine',
    'combined_chlorine',
    'ph',
    'alkalinity',
    'calcium_hardness',
    'cyanuric_acid',
    'temperature',
  ];

  for (const key of numericChecks) {
    const val = reading[key] as number | undefined | null;
    const alert = check(key, val, reading);
    if (alert) alerts.push(alert);
  }

  // Turbidity is a special string check
  if (reading.turbidity && reading.turbidity !== 'clear') {
    const alert = check('turbidity', 0, reading);
    if (alert) alerts.push(alert);
  }

  // Sort: danger first, then warning, then info
  const order: Record<AlertSeverity, number> = { danger: 0, warning: 1, info: 2, ok: 3 };
  return alerts.sort((a, b) => order[a.severity] - order[b.severity]);
}

export function overallStatus(alerts: Alert[]): AlertSeverity {
  if (alerts.some((a) => a.severity === 'danger'))  return 'danger';
  if (alerts.some((a) => a.severity === 'warning')) return 'warning';
  if (alerts.some((a) => a.severity === 'info'))    return 'info';
  return 'ok';
}

export function parameterStatus(
  key: string,
  value: number | undefined | null,
): AlertSeverity {
  if (value == null || isNaN(value)) return 'info';
  const range = PARAMETER_RANGES[key];
  if (!range) return 'ok';

  // Special cases
  if (key === 'combined_chlorine') {
    if (value > 1.0) return 'danger';
    if (value > 0.5) return 'warning';
    return 'ok';
  }
  if (key === 'cyanuric_acid') {
    if (value > 80)  return 'danger';
    if (value > 50)  return 'warning';
    return 'ok';
  }

  if (value < range.min || value > range.max) {
    // Decide danger vs warning based on distance from limits
    const low  = range.min - value;
    const high = value - range.max;
    const dist = Math.max(low, high);
    const span = range.max - range.min;
    if (dist > span * 0.5) return 'danger';
    return 'warning';
  }
  return 'ok';
}
