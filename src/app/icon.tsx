import { ImageResponse } from 'next/og';
import { theme } from '@/styles/tokens';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';
export default function Icon() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', background: theme.light.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ background: theme.light.onAccent, width: '25%', height: '25%' }} /></div>, size);
}
