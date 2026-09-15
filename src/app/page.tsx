import { cv } from '../../content/cv';
import { display } from '../../content/display';
import { site } from '@/lib/site';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { Experience } from '@/components/experience';
import { Background } from '@/components/background';
import { Contact } from '@/components/contact';

export default function Home() {
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: cv.identity.name,
    jobTitle: display.role, email: cv.contact.email, address: cv.identity.location,
    url: site.origin, sameAs: cv.links.map(link => link.url) };
  return <><Header /><main id="main" tabIndex={-1}><Hero /><Projects /><Experience /><Background /></main><Contact />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }} /></>;
}
