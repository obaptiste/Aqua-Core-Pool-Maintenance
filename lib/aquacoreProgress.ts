import { PoolMaintenanceModule } from '@/lib/data/poolMaintenanceModules';

export type QuizResultMap = Record<string, boolean>;

export function academyCompletionPercentage(
  modules: PoolMaintenanceModule[],
  results: QuizResultMap,
): number {
  if (modules.length === 0) return 0;

  const completed = modules.filter((module) => results[module.id]).length;
  return Math.round((completed / modules.length) * 100);
}

export function hasCompletedAcademy(modules: PoolMaintenanceModule[], results: QuizResultMap): boolean {
  return modules.every((module) => results[module.id]);
}

export function createCertificateNumber(name: string, issuedAt: Date): string {
  const compactName = name.trim().toUpperCase().replace(/\s+/g, '-').slice(0, 18);
  const dateToken = `${issuedAt.getFullYear()}${String(issuedAt.getMonth() + 1).padStart(2, '0')}${String(issuedAt.getDate()).padStart(2, '0')}`;
  return `AC-${compactName || 'LEARNER'}-${dateToken}`;
}
