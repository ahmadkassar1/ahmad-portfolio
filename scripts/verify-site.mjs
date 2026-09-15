import fs from 'node:fs';
import path from 'node:path';
import { chromium as playwright, webkit, expect } from '@playwright/test';
import serverChromium from '@sparticuz/chromium';
import AxeBuilder from '@axe-core/playwright';
import { cv } from '../content/cv.ts';

const base = process.argv[2] ?? 'http://localhost:3000';
const out = process.argv[3] ?? 'reports';
fs.mkdirSync(path.join(out, 'screenshots'), { recursive: true });
const shot = (name) => path.join(out, 'screenshots', `${name}.png`);
const executablePath = process.env.CHROME_PATH || await serverChromium.executablePath();
const browser = await playwright.launch({ executablePath, args: serverChromium.args.filter(arg => !['--single-process', '--disable-web-security', '--allow-running-insecure-content', '--disable-site-isolation-trials'].includes(arg)), headless: true });
const report = { command: ['node', 'scripts/verify-site.mjs', ...process.argv.slice(2)], base,
  browser: await browser.version(), executablePath, screenshots: [], viewportChecks: [],
  errors: [], failedRequests: [], assertions: [], axe: {}, webkit: {}, keyboard: [] };
const assert = (name, passed, detail) => report.assertions.push({ name, passed, detail });
const save = async (page, name, fullPage = true) => {
  await page.screenshot({ path: shot(name), fullPage });
  report.screenshots.push({ name, path: shot(name), viewport: page.viewportSize() });
};
const context = await browser.newContext({ colorScheme: 'light', viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
page.on('pageerror', error => report.errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) report.failedRequests.push({ url: response.url(), status: response.status() }); });
const response = await page.goto(base, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
assert('Page is the portfolio, not an authentication screen', response.status() === 200 && await page.locator('h1').getAttribute('aria-label')?.then(x => x?.startsWith(cv.identity.name)), response.status());
assert('Exactly one h1', await page.locator('h1').count() === 1);
assert('English and left-to-right', await page.locator('html').getAttribute('lang') === 'en' && await page.locator('html').getAttribute('dir') === 'ltr');
assert('Noindex metadata', (await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
assert('Noindex response header', (response.headers()['x-robots-tag'] ?? '').includes('noindex'));

for (const width of [360, 768, 834, 1280, 1920, 390, 1440, 320]) {
  await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
  const dimensions = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  report.viewportChecks.push(dimensions);
  assert(`No horizontal overflow at ${width}px`, dimensions.scrollWidth <= dimensions.width);
  if (width !== 320) await save(page, `light-${width}`);
  if ([390, 1440].includes(width)) await save(page, `direction-${width}`, false);
}
await page.setViewportSize({ width: 844, height: 390 });
await save(page, 'landscape-844');
await page.setViewportSize({ width: 1280, height: 900 });
report.axe.light = (await new AxeBuilder({ page }).analyze()).violations;
assert('Light theme has no serious or critical axe issues', !report.axe.light.some(v => ['serious', 'critical'].includes(v.impact)));

await page.goto(base, { waitUntil: 'networkidle' });
await page.keyboard.press('Tab');
assert('Skip link is first keyboard target', await page.locator(':focus').textContent() === 'Skip to content');
await save(page, 'keyboard-focus', false);
await page.keyboard.press('Enter');
assert('Skip link moves focus to main', await page.locator(':focus').getAttribute('id') === 'main');
for (let index = 0; index < 28; index += 1) {
  await page.keyboard.press('Tab');
  report.keyboard.push(await page.evaluate(() => { const el = document.activeElement; return { tag: el.tagName, text: (el.getAttribute('aria-label') || el.textContent).trim().slice(0, 160), href: el.getAttribute('href'), outline: getComputedStyle(el).outlineStyle }; }));
}

const details = page.locator('.project-details').first();
await details.locator('summary').click();
assert('Project disclosure opens', await details.getAttribute('open') !== null);
await details.locator('summary').click();
assert('Project disclosure closes', await details.getAttribute('open') === null);
await page.getByRole('button', { name: 'Copy email', exact: true }).click();
await expect(page.getByRole('status')).toContainText('Email copied');
assert('Copy email confirmation', (await page.getByRole('status').textContent()).includes('Email copied'));
assert('Copy email writes the real address', await page.evaluate(() => navigator.clipboard.readText()) === cv.contact.email);
assert('Email fallback points to the CV email', await page.locator('.contact-email').getAttribute('href') === `mailto:${cv.contact.email}`);
await page.getByRole('button', { name: 'Toggle light and dark theme' }).click();
assert('Theme toggle selects dark', await page.locator('html').getAttribute('data-theme') === 'dark');
await save(page, 'dark-1280');
report.axe.dark = (await new AxeBuilder({ page }).analyze()).violations;
assert('Dark theme has no serious or critical axe issues', !report.axe.dark.some(v => ['serious', 'critical'].includes(v.impact)));
await context.close();

const facts = [...cv.experience.flatMap(r => r.achievements), ...cv.sections.flatMap(s => s.items).flatMap(p => p.achievements)];
const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
const noJs = await noJsContext.newPage();
await noJs.goto(base, { waitUntil: 'networkidle' });
for (const summary of await noJs.locator('.project-details summary').all()) await summary.click();
const noJsText = (await noJs.locator('body').innerText()).replace(/\s+/g, ' ');
assert('Every achievement readable with JavaScript disabled', facts.every(fact => noJsText.includes(fact)), { missing: facts.filter(fact => !noJsText.includes(fact)) });
await save(noJs, 'javascript-disabled');
await noJsContext.close();

const reducedContext = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
const reduced = await reducedContext.newPage();
await reduced.goto(base, { waitUntil: 'networkidle' });
const states = await reduced.locator('.reveal, .signature > span').evaluateAll(elements => elements.map(el => ({ transform: getComputedStyle(el).transform, opacity: getComputedStyle(el).opacity })));
assert('Reduced motion shows final transform and full opacity', states.every(s => s.transform === 'none' && s.opacity === '1'));
await save(reduced, 'reduced-motion');
await reduced.addStyleTag({ content: 'html{font-size:200% !important;}' });
const zoom = await reduced.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
assert('200% text zoom reflows without horizontal overflow', zoom.scrollWidth <= zoom.width, zoom);
await save(reduced, 'text-zoom-200');
await reducedContext.close();

const printContext = await browser.newContext({ colorScheme: 'light' });
const printPage = await printContext.newPage();
await printPage.goto(base, { waitUntil: 'networkidle' });
await printPage.pdf({ path: path.join(out, 'portfolio-print.pdf'), format: 'A4', preferCSSPageSize: true, printBackground: true });
await printContext.close();

try {
  const webkitBrowser = await webkit.launch();
  const webkitContext = await webkitBrowser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' });
  const webkitPage = await webkitContext.newPage();
  await webkitPage.goto(base, { waitUntil: 'networkidle' });
  await save(webkitPage, 'webkit-390');
  report.webkit = { status: 'PASS', note: 'Playwright WebKit substitute; not real iOS Safari.' };
  await webkitBrowser.close();
} catch (error) { report.webkit = { status: 'SKIPPED', reason: error.message }; }

await browser.close();
report.overall = report.assertions.every(item => item.passed) && report.errors.length === 0 ? 'PASS' : 'FAIL';
fs.writeFileSync(path.join(out, 'browser-audit.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ overall: report.overall, assertions: report.assertions, errors: report.errors,
  axe: { light: report.axe.light.map(x => ({ id: x.id, impact: x.impact })), dark: report.axe.dark.map(x => ({ id: x.id, impact: x.impact })) },
  webkit: report.webkit, report: path.join(out, 'browser-audit.json') }, null, 2));
process.exitCode = report.overall === 'PASS' ? 0 : 1;
