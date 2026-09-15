import { cv } from '../../content/cv';
import { display } from '../../content/display';
import { authored } from '../../content/authored';
import { site } from '@/lib/site';
import { Arrow } from './arrow';

export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="intro-title">
      <div className="hero-topline">
        <p className="eyebrow accent">{display.role}</p>
        <p className="eyebrow location">{cv.identity.location}</p>
      </div>
      <div className="hero-grid">
        <h1 id="intro-title" aria-label={`${cv.identity.name} — ${display.role}`}>
          {display.nameParts.map((part) => <span key={part} aria-hidden="true">{part}</span>)}
        </h1>
        <div className="hero-intro">
          <p className="focus-line">{display.focus}</p>
          <p className="intro-copy">{display.intro}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={`mailto:${cv.contact.email}`} aria-label={`${authored.labels.emailAction} ${cv.identity.name} at ${cv.contact.email}`}>
              {authored.labels.getInTouch}<Arrow />
            </a>
            <a className="text-link" href="#work">{authored.labels.explore}<Arrow direction="down" /></a>
          </div>
        </div>
      </div>
      <div className={`hero-rule ${site.signatureEnabled ? 'signature' : ''}`} aria-hidden="true"><span /></div>
      <div className="production-strip">
        <p className="production-caption">{display.productionLead}</p>
        <div className="production-systems">
          {display.systems.map((system) => (
            <a href="#experience" className="system" key={system.name}>
              <span className="system-name">{system.name}<Arrow /></span>
              <span className="system-company">{system.employer}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
