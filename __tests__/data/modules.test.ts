import { describe, it, expect } from 'vitest';
import { modules } from '@/lib/data/modules';

describe('modules registry data integrity', () => {
  it('exports a non-empty array of modules', () => {
    expect(modules).toBeInstanceOf(Array);
    expect(modules.length).toBeGreaterThan(0);
  });

  it('every module has required fields', () => {
    for (const mod of modules) {
      expect(mod.id).toBeTruthy();
      expect(mod.title).toBeTruthy();
      expect(mod.icon).toBeTruthy();
      expect(mod.description).toBeTruthy();
      expect(mod.features).toBeInstanceOf(Array);
      expect(mod.features.length).toBeGreaterThan(0);
      expect(['ready', 'coming-soon']).toContain(mod.status);
      expect(mod.href).toBeTruthy();
      expect(mod.colorClass).toBeTruthy();
    }
  });

  it('has unique module IDs', () => {
    const ids = modules.map((m) => m.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('ready modules have valid href paths starting with /', () => {
    const readyModules = modules.filter((m) => m.status === 'ready');
    for (const mod of readyModules) {
      expect(mod.href).toMatch(/^\//);
    }
  });

  it('includes core modules: history, maths, wellbeing, pool-maintenance', () => {
    const ids = modules.map((m) => m.id);
    expect(ids).toContain('history');
    expect(ids).toContain('maths');
    expect(ids).toContain('wellbeing');
    expect(ids).toContain('pool-maintenance');
  });
});
