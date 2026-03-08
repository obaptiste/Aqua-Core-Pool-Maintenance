import type { ModuleCard as ModuleCardType } from '@/types';

interface ModuleCardProps {
  module: ModuleCardType;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <article className="bg-white/90 rounded-2xl border border-white/70 shadow p-5 h-full flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span aria-hidden className="text-3xl">
          {module.icon}
        </span>
        <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
      </div>

      <p className="text-gray-700 text-sm leading-6">{module.description}</p>

      <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
        {module.features.slice(0, 4).map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <a
          href={module.href}
          className="inline-block rounded-full px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          {module.status === 'ready' ? 'Open module' : 'Coming soon'}
        </a>
      </div>
    </article>
  );
}
