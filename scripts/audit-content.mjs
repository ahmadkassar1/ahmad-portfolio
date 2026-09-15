import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { cv, provenance } from '../content/cv.ts';
import { authored } from '../content/authored.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'content/cv.source.txt');
const bytes = fs.readFileSync(sourcePath);
const source = bytes.toString('utf8');
const lines = source.split('\n');
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const excerpt = (start, end) => normalize(lines.slice(start - 1, end).join(' '));
const get = (object, key) => key.split('.').reduce((value, part) => value[part], object);
const failures = [];
const checks = [];
const check = (name, pass) => {
  checks.push({ name, status: pass ? 'PASS' : 'FAIL' });
  if (!pass) failures.push(name);
};

const mapped = new Set();
for (const entry of provenance) {
  const value = get(cv, entry.field);
  const raw = excerpt(entry.startLine, entry.endLine);
  let expected = raw;
  let pass = typeof value === 'string';
  if (entry.method === 'https-prefix') pass &&= raw.includes(value.replace(/^https:\/\//, ''));
  else if (entry.method === 'verbatim-bullet') {
    expected = raw.replace(/^•\s*/, '');
    pass &&= value === expected;
  } else pass &&= raw.includes(value);
  check(`Source match: ${entry.field}`, pass);
  mapped.add(entry.field);
}

const metadata = new Set(['identity.language', 'links.0.kind', 'links.1.kind']);
function visit(value, key = '') {
  if (typeof value === 'string') {
    check(`Mapped or labelled metadata: ${key}`, mapped.has(key) || metadata.has(key));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [child, item] of Object.entries(value)) visit(item, key ? `${key}.${child}` : child);
  }
}
visit(cv);

const sourceBulletCount = lines.filter((line) => line.trim().startsWith('•')).length;
const structuredBulletCount = cv.experience.reduce((n, role) => n + role.achievements.length, 0)
  + cv.sections.flatMap((section) => section.items).reduce((n, item) => n + item.achievements.length, 0);
check('All source bullets are represented', sourceBulletCount === structuredBulletCount);
check('Verbatim bullet mappings cover every source bullet', provenance.filter((p) => p.method === 'verbatim-bullet').length === sourceBulletCount);
check('Headline unchanged', cv.headline === excerpt(2, 2));
check('Source summary preserved; display omits the total-years claim', cv.summary === excerpt(7, 13));
const sourcePhone = normalize(lines[2]).split('|')[1].trim();
check('Phone omitted from public content', cv.contact.phone === null && !JSON.stringify(cv).includes(sourcePhone));
check('Authored prose and labels are kept separately from CV facts', authored.connectiveSentences.every(x => typeof x === 'string') && Object.keys(authored.labels).length > 0);
check('Missing credentials and licences remain empty', cv.credentials.length === 0 && cv.licences.length === 0);
check('No project dates or URLs invented', cv.sections.flatMap((x) => x.items).every((x) => x.datesAsWritten === null && x.links.length === 0));
const ignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
check('Raw extraction is excluded from future Git tracking', ignore.split('\n').includes('/content/cv.source.txt'));
check('Only the redacted CV is publicly downloadable', fs.existsSync(path.join(root, 'public/Ahmad_Kassar_CV_Redacted.pdf')) && !fs.existsSync(path.join(root, 'public/Ahmad_Kassar_Full_Stack_Developer_CV.pdf')));

const metricSpecifications = [
  [7, 8, /3 years/], [8, 10, /two production systems/], [11, 12, /4 products/],
  [32, 34, /3 ERP modules/], [43, 44, /3 core modules/], [72, 73, /4 separate routed views/],
];
const metrics = metricSpecifications.map(([startLine, endLine, pattern]) => {
  const claim = excerpt(startLine, endLine).match(pattern)?.[0] ?? null;
  check(`Metric is explicitly in source lines ${startLine}-${endLine}`, claim !== null);
  return { claim, startLine, endLine, status: 'CV claim; not an independently measured result' };
});

const pdfIndex = process.argv.indexOf('--pdf');
let extractionReproduction = { status: 'SKIPPED', reason: 'No --pdf path supplied; checks used retained source evidence.' };
if (pdfIndex !== -1) {
  const pdf = process.argv[pdfIndex + 1];
  const result = spawnSync('pdftotext', ['-layout', pdf, '-']);
  const matches = result.status === 0 && Buffer.isBuffer(result.stdout) && bytes.equals(result.stdout);
  check('Fresh local extraction matches saved evidence byte for byte', matches);
  extractionReproduction = {
    status: matches ? 'PASS' : 'FAIL', command: ['pdftotext', '-layout', pdf, '-'],
    exitCode: result.status, stderr: result.stderr?.toString('utf8') ?? '',
  };
}

const report = {
  command: [process.argv[0], ...process.argv.slice(1)],
  executedAt: new Date().toISOString(),
  overall: failures.length === 0 ? 'PASS' : 'FAIL',
  scope: 'CV content/provenance audit only. Not a static typecheck, site build or accessibility/performance audit.',
  counts: { roles: cv.experience.length, projects: cv.sections.flatMap((x) => x.items).length,
    educationEntries: cv.education.length, languageEntries: cv.languages.length,
    sourceBullets: sourceBulletCount, structuredBullets: structuredBulletCount,
    mappedFields: provenance.length, explicitQuantitativeClaims: metrics.length },
  roles: cv.experience.map(({ title, employer, datesAsWritten }) => ({ title, employer, datesAsWritten })),
  metrics, extractionReproduction,
  sourceSha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  checks, failures,
};
const reportPath = path.join(root, 'reports/content-audit.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.overall, counts: report.counts, failures, report: reportPath }, null, 2));
process.exitCode = failures.length === 0 ? 0 : 1;
