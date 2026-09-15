import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { cv } from '../../content/cv';
import { display } from '../../content/display';
import { authored } from '../../content/authored';
import { site } from '@/lib/site';
import { themeCSS } from '@/styles/tokens';
import { MotionProvider } from '@/components/reveal';
import './globals.css';

const sans = localFont({ src: '../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', variable: '--font-manrope', display: 'swap', fallback: ['Arial', 'Helvetica', 'sans-serif'], adjustFontFallback: 'Arial' });
const mono = localFont({ src: '../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2', variable: '--font-plex', display: 'swap', preload: false, fallback: ['Consolas', 'monospace'] });

export const metadata: Metadata = {
  metadataBase: new URL(site.origin), title: `${cv.identity.name} — ${display.role}`,
  description: `${display.focus}. ${display.intro}`,
  robots: { index: site.indexed, follow: site.indexed }, alternates: { canonical: '/' },
  openGraph: { title: `${cv.identity.name} — ${display.role}`, description: display.intro, url: site.origin, type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: `${cv.identity.name} — ${display.role}`, description: display.intro },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

const themeInit = `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang={cv.identity.language} dir="ltr" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
    <head><style>{themeCSS}</style><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
    <body><a className="skip-link" href="#main">{authored.labels.skip}</a><MotionProvider>{children}</MotionProvider></body>
  </html>;
}
