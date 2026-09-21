/** Kill-test de H2 (C-07, C-08, C-11) contra la maqueta viva. */
import { chromium } from '@playwright/test';
import { BASE, entrar } from '../entrar.mjs';

const OUT = 'evidencia/h2/capturas';
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const pg = await ctx.newPage();
const errores = [];
pg.on('console', (m) => { if (m.type() === 'error' && !/Content Security Policy/.test(m.text())) errores.push(m.text()); });
pg.on('pageerror', (e) => errores.push('pageerror: ' + e.message));

console.log('sesión →', await entrar(pg));
let fallos = 0;
const check = (ok, txt) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${txt}`); if (!ok) fallos += 1; };

for (const [nombre, ruta] of [
  ['01-schedule', '/schedule'],
  ['02-vista-table', '/schedule?vista=table'],
  ['03-vista-cupos', '/schedule?vista=cupos'],
  ['04-vista-citas', '/schedule?vista=citas'],
  ['05-vista-solicitudes', '/schedule?vista=solicitudes'],
  ['06-vista-agenda', '/schedule?vista=agenda'],
]) {
  await pg.goto(`${BASE}${ruta}`, { waitUntil: 'domcontentloaded' });
  await pg.getByRole('tablist').first().waitFor({ timeout: 30000 });
  await pg.waitForTimeout(1500);
  const rotulos = (await pg.locator('app-tabs > * [role="tab"], app-tabs [role="tablist"]').first().innerText()).split('\n').map((t) => t.trim()).filter(Boolean);
  const hayTabla = await pg.locator('app-data-table').count();
  const hayDia = await pg.locator('app-day-view').count();
  console.log(`\n${ruta}\n   solapas: ${JSON.stringify(rotulos)}\n   app-data-table: ${hayTabla} · app-day-view: ${hayDia} · url: ${pg.url().replace(BASE, '')}`);
  await pg.screenshot({ path: `${OUT}/${nombre}.png`, fullPage: true });
  if (ruta !== '/schedule?vista=agenda') {
    check(hayTabla === 0, `${ruta} no muestra ninguna tabla`);
    check(hayDia === 1, `${ruta} muestra el día del calendario`);
  }
  const soloDos = rotulos.filter((r) => r.startsWith('Consultas') || r.startsWith('Mis horarios'));
  check(soloDos.length === rotulos.length && rotulos.length === 2, `${ruta}: exactamente 2 solapas → ${JSON.stringify(rotulos)}`);
  check(rotulos.filter((r) => r.replace(/\s*\(\d+\)$/, '') === 'Consultas').length === 1, `${ruta}: una sola «Consultas»`);
}

// El encabezado, sin los tres botones
await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
await pg.waitForTimeout(1500);
check((await pg.locator('[data-testid="agenda-ingreso-mostrador"]').count()) === 0, 'encabezado sin «Ingreso Mostrador»');
check((await pg.locator('[data-testid="agenda-avisar-demora"]').count()) === 0, 'encabezado sin «Avisar demora»');
check((await pg.locator('app-page-header a[href="/lab-visits"]').count()) === 0, 'encabezado sin «Visitas de laboratorio»');
check((await pg.locator('[data-testid="dia-ingreso-mostrador"]').count()) === 1, '«Ingreso Mostrador» vive ahora en el encabezado del día');
check((await pg.locator('[data-testid="dia-avisar-demora"]').count()) === 1, '«Avisar demora» vive ahora en el encabezado del día');
await pg.locator('.dia__acciones-barra').first().screenshot({ path: `${OUT}/07-acciones-del-dia.png` }).catch(() => {});
await pg.locator('app-page-header').first().screenshot({ path: `${OUT}/08-encabezado-limpio.png` });

console.log('\nerrores de consola (descontando los 2 de CSP del baseline):', errores.length === 0 ? 'ninguno' : JSON.stringify(errores, null, 2));
console.log(`\n=== ${fallos === 0 ? 'KILL-TEST H2: PASS' : `KILL-TEST H2: FAIL (${fallos})`} ===`);
await nav.close();
process.exit(fallos === 0 ? 0 : 1);
