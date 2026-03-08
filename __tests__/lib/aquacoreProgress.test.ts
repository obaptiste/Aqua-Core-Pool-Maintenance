import { describe, expect, it } from 'vitest';
import { poolMaintenanceModules } from '@/lib/data/poolMaintenanceModules';
import {
  academyCompletionPercentage,
  createCertificateNumber,
  hasCompletedAcademy,
} from '@/lib/aquacoreProgress';

describe('aquacoreProgress', () => {
  it('calculates completion percentage from quiz results', () => {
    const results = {
      [poolMaintenanceModules[0].id]: true,
      [poolMaintenanceModules[1].id]: true,
      [poolMaintenanceModules[2].id]: true,
    };

    expect(academyCompletionPercentage(poolMaintenanceModules, results)).toBe(25);
  });

  it('detects when all modules are complete', () => {
    const allComplete = Object.fromEntries(poolMaintenanceModules.map((module) => [module.id, true]));

    expect(hasCompletedAcademy(poolMaintenanceModules, allComplete)).toBe(true);
    expect(hasCompletedAcademy(poolMaintenanceModules, { [poolMaintenanceModules[0].id]: true })).toBe(
      false,
    );
  });

  it('builds a stable certificate number', () => {
    const certificate = createCertificateNumber('Alex Morgan', new Date('2026-02-03T09:00:00Z'));
    expect(certificate).toBe('AC-ALEX-MORGAN-20260203');
  });
});
