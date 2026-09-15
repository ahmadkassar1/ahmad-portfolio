export const theme = {
  light: {
    background: '#f8f9fc', surface: '#ffffff', ink: '#172033', muted: '#526078',
    line: '#d9dfeb', control: '#708098', accent: '#234fe5', onAccent: '#ffffff',
    tint: '#eaf0ff', tintInk: '#2448b6', focus: '#234fe5', soft: '#f0f3f9',
  },
  dark: {
    background: '#101621', surface: '#182131', ink: '#f1f4fc', muted: '#b1bed3',
    line: '#354258', control: '#8496b4', accent: '#abc0ff', onAccent: '#152443',
    tint: '#233453', tintInk: '#c1d0ff', focus: '#c1d0ff', soft: '#1d293c',
  },
  motion: { reveal: 0.48, hover: 0.22, signature: 0.8, distance: 16,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    responsive: [0.2, 0, 0, 1] as [number, number, number, number] },
  og: { title: 112, role: 36, body: 24, padding: 70, gap: 28, rule: 3 },
};

const sizes = {
  'space-1': '0.25rem', 'space-2': '0.5rem', 'space-3': '0.75rem', 'space-4': '1rem',
  'space-5': '1.25rem', 'space-6': '1.5rem', 'space-8': '2rem', 'space-10': '2.5rem',
  'space-12': '3rem', 'space-16': '4rem', 'space-20': '5rem', 'space-24': '6rem',
  'gutter': 'clamp(1.25rem, 5vw, 5rem)', 'section-space': 'clamp(4rem, 8vw, 7rem)',
  'content-width': '78rem', 'measure': '68ch', 'radius-small': '0.4rem', 'radius': '0.85rem',
  'radius-large': '1.25rem', 'text-xs': '0.6875rem', 'text-small': '0.8125rem',
  'text-body': 'clamp(0.95rem, 0.92rem + 0.15vw, 1.0625rem)',
  'text-intro': 'clamp(1.125rem, 0.9rem + 0.55vw, 1.5rem)',
  'text-title': 'clamp(2rem, 1.2rem + 2.1vw, 3.25rem)',
  'text-project': 'clamp(1.6rem, 1.05rem + 1.3vw, 2.5rem)',
  'text-name': 'clamp(5rem, 3.7rem + 5.6vw, 8.75rem)',
  'text-contact': 'clamp(1.15rem, 0.5rem + 2.8vw, 2.75rem)',
  'text-proof': 'clamp(1.3rem, 1rem + 0.55vw, 1.6rem)',
  'leading-body': '1.7', 'leading-title': '1.12', 'leading-name': '0.99',
  'tracking-tight': '-0.055em', 'tracking-title': '-0.04em', 'tracking-label': '0.12em',
  'weight-normal': '400', 'weight-medium': '500', 'weight-semibold': '600', 'weight-bold': '700',
  'target-size': '2.75rem', 'nav-height': '5.5rem', 'focus-width': '3px', 'focus-offset': '5px',
  'line-width': '1px', 'signature-line': '3px', 'hero-grid': '1.15fr 0.85fr',
  'project-grid': '1.14fr 0.86fr', 'detail-grid': '0.7fr 2fr', 'hero-gap': 'clamp(2rem, 6vw, 6rem)',
  'proof-width': '24rem', 'accent-dot': '0.5rem', 'arrow-size': '1.1rem',
  'signature-width': '100%', 'hover-shift': '-2px', 'contact-icon': '3rem',
};
const printSizes = { 'text-body': '9pt', 'text-small': '8pt', 'text-xs': '7pt', 'text-title': '18pt', 'text-name': '32pt', 'text-project': '13pt', 'text-intro': '11pt', 'section-space': '12pt', 'gutter': '0pt', 'space-16': '16pt', 'space-10': '10pt', 'space-8': '8pt', 'space-6': '6pt', 'space-5': '5pt', 'space-4': '4pt', 'space-3': '3pt', 'space-2': '2pt', 'space-1': '1pt' };
const vars = (values: Record<string, string>, prefix = '') => Object.entries(values)
  .map(([key, value]) => `--${prefix}${key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${value};`).join('');
export const themeCSS = `:root{${vars(theme.light)}${vars(sizes)}
--font-body:var(--font-manrope),Arial,Helvetica,sans-serif;
--font-code:var(--font-plex),"SFMono-Regular",Consolas,"Liberation Mono",monospace;
--duration-hover:${theme.motion.hover}s;--duration-reveal:${theme.motion.reveal}s;
--duration-signature:${theme.motion.signature}s;--reveal-distance:${theme.motion.distance}px;
--ease-directed:cubic-bezier(${theme.motion.ease.join(',')});
--ease-responsive:cubic-bezier(${theme.motion.responsive.join(',')});color-scheme:light;}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){${vars(theme.dark)}color-scheme:dark;}}
:root[data-theme=dark]{${vars(theme.dark)}color-scheme:dark;}
@media print{html:root,html:root[data-theme]{${vars(theme.light)}${vars(printSizes)}color-scheme:light;}}`;
