'use client';

import { useEffect, useState } from 'react';

const THEMES = [
  { id: 'ocean', label: 'Ocean' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'sunset', label: 'Sunset' },
] as const;

type ThemeId = (typeof THEMES)[number]['id'];

const STORAGE_KEY = 'aquacore-theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeId>('ocean');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const selected: ThemeId = THEMES.some((item) => item.id === stored) ? (stored as ThemeId) : 'ocean';
    setTheme(selected);
    document.documentElement.dataset.theme = selected;
  }, []);

  const applyTheme = (nextTheme: ThemeId) => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <div className="themeDock" role="group" aria-label="Theme selector">
      <span className="themeLabel">Theme</span>
      <div className="themeButtons">
        {THEMES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`themeButton ${theme === item.id ? 'isActive' : ''}`}
            onClick={() => applyTheme(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
