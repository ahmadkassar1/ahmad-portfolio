'use client';

import { useState } from 'react';
import { cv } from '../../content/cv';
import { authored } from '../../content/authored';

export function CopyEmail() {
  const [message, setMessage] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(cv.contact.email); setMessage(authored.labels.copied); }
    catch { setMessage(authored.labels.copyFailed); }
  }
  return <div className="copy-email"><button onClick={copy} className="text-link">{authored.labels.copyEmail}</button><span role="status" aria-live="polite">{message}</span></div>;
}
