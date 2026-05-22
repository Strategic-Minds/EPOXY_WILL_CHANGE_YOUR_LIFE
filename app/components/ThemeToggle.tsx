'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light' | 'system';

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.themeMode = mode;

  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = prefersDark ? 'dark' : 'light';
    return;
  }

  root.dataset.theme = mode;
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const saved = window.localStorage.getItem('ewl-theme-mode') as ThemeMode | null;
    const initial = saved ?? 'system';
    setMode(initial);
    applyTheme(initial);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      const current = (window.localStorage.getItem('ewl-theme-mode') as ThemeMode | null) ?? 'system';
      if (current === 'system') applyTheme('system');
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  function select(next: ThemeMode) {
    setMode(next);
    window.localStorage.setItem('ewl-theme-mode', next);
    applyTheme(next);
  }

  return (
    <div className="theme-toggle" aria-label="Theme mode selector">
      {(['dark', 'light', 'system'] as ThemeMode[]).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => select(option)}
          className={mode === option ? 'theme-option active' : 'theme-option'}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
