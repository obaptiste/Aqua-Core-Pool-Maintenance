'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/poolpro/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l9-9 9 9M5 11.5V19a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-7.5" />
      </svg>
    ),
  },
  {
    href: '/poolpro/log',
    label: 'Log',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/poolpro/history',
    label: 'History',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: '/poolpro/cheatsheet',
    label: 'Guide',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="
        fixed bottom-0 left-0 right-0 z-40
        border-t border-[#1a3a5c] bg-[#0a1628]/95 backdrop-blur-sm
        flex items-stretch
        md:hidden
      "
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors
              ${active
                ? 'text-[#4fc3f7]'
                : 'text-[#64748b] hover:text-[#94a3b8]'
              }
            `}
            aria-current={active ? 'page' : undefined}
          >
            <span className={active ? 'text-[#4fc3f7]' : 'text-[#64748b]'}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
