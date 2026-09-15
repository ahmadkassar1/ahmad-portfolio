import Link from 'next/link';
import { authored } from '../../content/authored';
export default function NotFound() { return <main className="section shell"><h1>{authored.labels.notFound}</h1><Link href="/" className="button button-primary">{authored.labels.returnHome}</Link></main>; }
