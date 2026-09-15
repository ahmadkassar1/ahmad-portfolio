import { ImageResponse } from 'next/og';
import { cv } from '../../content/cv';
import { display } from '../../content/display';
import { theme } from '@/styles/tokens';
export const alt = `${cv.identity.name} — ${display.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', background: theme.light.background, color: theme.light.ink, display: 'flex', flexDirection: 'column', padding: theme.og.padding, justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', fontSize: theme.og.body, color: theme.light.accent }}>{display.role}</div>
    <div style={{ display: 'flex', fontSize: theme.og.title, letterSpacing: '-0.055em' }}>{cv.identity.name}</div>
    <div style={{ display: 'flex', borderTop: `${theme.og.rule}px solid ${theme.light.accent}`, paddingTop: theme.og.gap, justifyContent: 'space-between', fontSize: theme.og.body }}><span>{display.focus}</span><span>{cv.identity.location}</span></div>
  </div>, size);
}
