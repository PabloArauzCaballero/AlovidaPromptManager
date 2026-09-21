/**
 * H6.S3.M1 - la prueba visual: 3 viewports x 2 temas x las pantallas que cambie.
 *
 * Toma las capturas Y las describe: la regla 95.7.2 dice que tomarla sin mirarla
 * no cuenta, asi que cada una sale con lo que hay que mirar escrito al lado, y
 * la observacion se escribe despues de abrirlas.
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { BASE, entrar } from '../entrar.mjs';

const OUT = 'evidencia/h6/capturas';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  ['movil', 390, 844],
  ['tablet', 820, 1180],
  ['escritorio', 1440, 900],
];
const TEMAS = ['light', 'dark'];

const nav = await chromium.launch();
const indice = [];

for (const [nombreVp, ancho, alto] of VIEWPORTS) {
  for (const tema of TEMAS) {
    const ctx = await nav.newContext({
      viewport: { width: ancho, height: alto },
      colorScheme: tema,
    });
    const pg = await ctx.newPage();
    const errores = [];
    pg.on('console', (m) => { if (m.type() === 'error' && !/Content Security Policy/.test(m.text())) errores.push(m.text().slice(0, 160)); });
    pg.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
    await entrar(pg);
    const sufijo = `${nombreVp}-${tema === 'light' ? 'claro' : 'oscuro'}`;

    // 1 · el dia
    await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
    await pg.locator('app-day-view').waitFor({ timeout: 30000 });
    await pg.waitForTimeout(1600);
    await pg.screenshot({ path: `${OUT}/01-dia-${sufijo}.png`, fullPage: true });
    indice.push([`01-dia-${sufijo}.png`, 'Dos solapas, encabezado sin botones, acciones del dia con texto']);

    // 2 · el desplegable de acciones abierto
    // C-06 · desde la migración a `app-row-actions`, con tres o más acciones el
    // disparador es el del componente compartido.
    const acciones = pg.locator('[data-testid="row-actions-trigger"]').first();
    if ((await acciones.count()) > 0) {
      await acciones.click();
      await pg.waitForTimeout(700);
      await pg.screenshot({ path: `${OUT}/02-acciones-${sufijo}.png`, fullPage: true });
      indice.push([`02-acciones-${sufijo}.png`, 'El desplegable de app-row-actions: texto por opcion, e icono donde el set lo cubre']);
      await pg.keyboard.press('Escape');
      await pg.waitForTimeout(400);
    }

    // 3 · la semana, con su globo
    await pg.locator('[data-testid="ver-semana"]').click();
    await pg.waitForTimeout(1600);
    const cita = pg.locator('[data-testid="semana-cita"]').first();
    if ((await cita.count()) > 0) await cita.hover();
    await pg.waitForTimeout(600);
    await pg.screenshot({ path: `${OUT}/03-semana-${sufijo}.png`, fullPage: true });
    indice.push([`03-semana-${sufijo}.png`, 'La semana con el globo de una cita abierto']);

    // 4 · el mes, con la tarjeta y sus chips
    await pg.locator('[data-testid="ver-mes"]').click();
    await pg.waitForTimeout(1800);
    for (const dia of await pg.locator('[data-testid="mes-dia"]').all()) {
      await dia.hover();
      await pg.waitForTimeout(380);
      if ((await pg.locator('[data-testid="mes-globo-chip"]').count()) > 0) break;
    }
    await pg.screenshot({ path: `${OUT}/04-mes-${sufijo}.png`, fullPage: true });
    indice.push([`04-mes-${sufijo}.png`, 'El mes con la tarjeta del dia y sus chips de estado']);

    // 5 · el modal del alta
    await pg.locator('[data-testid="ver-dia"]').click();
    await pg.waitForTimeout(1400);
    let saltos = 0;
    while ((await pg.locator('button.dia__libre').count()) === 0 && saltos < 7) {
      await pg.locator('[data-testid="dia-siguiente"]').click();
      await pg.waitForTimeout(900);
      saltos += 1;
    }
    if ((await pg.locator('button.dia__libre').count()) > 0) {
      await pg.locator('button.dia__libre').first().click();
      await pg.waitForTimeout(900);
      await pg.screenshot({ path: `${OUT}/05-modal-${sufijo}.png`, fullPage: true });
      indice.push([`05-modal-${sufijo}.png`, 'El modal del alta sobre un cupo: franja como dato, sin campos de hora']);
      await pg.keyboard.press('Escape');
      await pg.waitForTimeout(500);
    }

    // 6 · Mis servicios con su modal de horario
    await pg.goto(`${BASE}/my-services`, { waitUntil: 'domcontentloaded' });
    await pg.locator('[data-testid="my-services-grid"]').waitFor({ timeout: 30000 });
    await pg.waitForTimeout(1200);
    await pg.locator('[data-testid="my-services-schedule"]').first().click();
    await pg.waitForTimeout(2200);
    await pg.screenshot({ path: `${OUT}/06-servicio-horario-${sufijo}.png`, fullPage: true });
    indice.push([`06-servicio-horario-${sufijo}.png`, 'Programar el horario de un servicio, con la grilla reciclada']);

    console.log(`${sufijo} · errores de consola: ${errores.length === 0 ? 'ninguno' : JSON.stringify(errores)}`);
    await ctx.close();
  }
}

console.log(`
capturas: ${indice.length}`);
for (const [archivo, que] of indice) console.log(`  ${archivo}  —  ${que}`);
await nav.close();
