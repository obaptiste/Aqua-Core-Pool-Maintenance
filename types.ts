export interface ModuleCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  status: 'ready' | 'coming-soon';
  href: string;
  colorClass: string;
}
