import { cv } from '../../content/cv';
import { authored } from '../../content/authored';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="site-header shell" id="top">
      <a className="wordmark" href="#top" aria-label={`${cv.identity.name} — ${authored.labels.home}`}>
        <span className="brand-dot" aria-hidden="true" />{cv.identity.name}
      </a>
      <nav aria-label={authored.labels.navigation}>
        <a href="#work">{authored.labels.work}</a>
        <a href="#experience">{authored.labels.experience}</a>
        <a href="#contact">{authored.labels.contact}</a>
      </nav>
      <ThemeToggle />
    </header>
  );
}
