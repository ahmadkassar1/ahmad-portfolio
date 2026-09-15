'use client';

import { authored } from '../../content/authored';

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const current = root.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('portfolio-theme', next); } catch { /* Optional preference storage. */ }
  }
  return (
    <button className="theme-toggle" onClick={toggle} aria-label={authored.labels.theme}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 5a7 7 0 0 1 0 14V5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
