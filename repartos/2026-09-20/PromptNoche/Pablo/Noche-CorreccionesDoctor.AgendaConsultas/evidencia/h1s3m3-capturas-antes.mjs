/** H1.S3.M3 — las 4 solapas y el encabezado, ANTES de tocar nada. */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { BASE, entrar } from './entrar.mjs';

const OUT = 'evidencia/antes/capturas';
mkdirSync(OUT, { recursive: true });

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const pg = await ctx.newPage();
const errores = [];
pg.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
pg.on('pageerror', (e) => errores.push('pageerror: ' + e.message));

console.log('sesión →', await entrar(pg));

const vistas = [
  ['01-calendario', '/schedule'],
  ['02-consultas-tabla', '/schedule?vista=table'],
  ['03-mis-horarios', '/schedule?vista=agenda'],
  ['04-cupos', '/schedule?vista=cupos'],
  ['05-vista-citas', '/schedule?vista=citas'],
  ['06-vista-solicitudes', '/schedule?vista=solicitudes'],
];

for (const [nombre, ruta] of vistas) {
  await pg.goto(`${BASE}${ruta}`, { waitUntil: 'domcontentloaded' });
  await pg.getByRole('tablist').first().waitFor({ timeout: 30000 }).catch(() => {});
  await pg.waitForTimeout(1200);
  const rotulos = await pg.getByRole('tab').allInnerTexts();
  const activa = await pg.getByRole('tab', { selected: true }).innerText().catch(() => '(ninguna)');
  console.log(`${nombre} · ${ruta}\n   solapas: ${JSON.stringify(rotulos)}\n   activa:  ${JSON.stringify(activa)}`);
  await pg.screenshot({ path: `${OUT}/${nombre}.png`, fullPage: true });
}

// El encabezado con sus tres botones de acción.
await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
await pg.waitForTimeout(1200);
const cab = pg.locator('.page-header, app-page-header').first();
await cab.screenshot({ path: `${OUT}/07-encabezado.png` }).catch(async () => {
  await pg.screenshot({ path: `${OUT}/07-encabezado.png`, clip: { x: 0, y: 0, width: 1440, height: 260 } });
});
const acciones = await pg.locator('[page-actions]').allInnerTexts();
console.log('botones page-actions:', JSON.stringify(acciones));

console.log('\nerrores de consola:', errores.length === 0 ? 'ninguno' : JSON.stringify(errores, null, 2));
await nav.close();
