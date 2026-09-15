import { cv } from '../../content/cv';
import { authored } from '../../content/authored';
import { site } from '@/lib/site';
import { Arrow } from './arrow';
import { CopyEmail } from './copy-email';

export function Contact() {
  return (
    <>
      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="shell">
          <div className="contact-top"><div><p className="eyebrow">{authored.labels.contactEyebrow}</p><h2 id="contact-title">{authored.labels.letsTalk}</h2></div><Arrow /></div>
          <a className="contact-email" href={`mailto:${cv.contact.email}`}>{cv.contact.email}<Arrow /></a>
          <div className="contact-bottom"><CopyEmail /><div className="profile-links">{cv.links.map(link => <a key={link.kind} href={link.url} target="_blank" rel="noopener noreferrer">{authored.labels[link.kind]}<Arrow /></a>)}</div></div>
        </div>
      </section>
      <footer className="site-footer shell">
        <div><p className="footer-name">{cv.identity.name}</p><p>{cv.identity.location}</p></div>
        <div className="cv-download"><a href={site.cvPath} download className="text-link">{authored.labels.downloadCV}<Arrow direction="down" /></a><span>{authored.labels.cvNote} · {authored.labels.cvDate}</span></div>
        <a className="text-link back-top" href="#top">{authored.labels.backTop}<Arrow /></a>
      </footer>
    </>
  );
}
