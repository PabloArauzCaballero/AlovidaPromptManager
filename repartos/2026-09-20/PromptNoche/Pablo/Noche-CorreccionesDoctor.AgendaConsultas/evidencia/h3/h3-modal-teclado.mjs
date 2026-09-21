/** H3.S1 — el modal: rol, nombre, foco inicial, trampa, Escape y devolución. */
import { chromium } from '@playwright/test';
import { BASE, entrar } from '../entrar.mjs';

const OUT = 'evidencia/h3/capturas';
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const pg = await ctx.newPage();
const errores = [];
pg.on('console', (m) => { if (m.type() === 'error' && !/Content Security Policy/.test(m.text())) errores.push(m.text()); });
pg.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
let fallos = 0;
const check = (ok, txt) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${txt}`); if (!ok) fallos += 1; };
const activo = () => pg.evaluate(() => {
  const a = document.activeElement;
  return a === null ? 'null' : `${a.tagName.toLowerCase()}${a.getAttribute('data-testid') ? '[' + a.getAttribute('data-testid') + ']' : ''}:${(a.textContent ?? '').trim().slice(0, 28)}`;
});

console.log('sesión →', await entrar(pg));
await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
await pg.locator('app-day-view').waitFor({ timeout: 30000 });
await pg.waitForTimeout(1500);

// Buscar un día con ratos libres: hoy puede estar lleno, y el camino del cupo
// —que es el que C-10 cambia— sólo existe donde hay un hueco.
let saltos = 0;
while ((await pg.locator('button.dia__libre').count()) === 0 && saltos < 7) {
  await pg.locator('[data-testid="dia-siguiente"]').click();
  await pg.waitForTimeout(1200);
  saltos += 1;
}
console.log(`día mirado: ${saltos} saltos desde hoy · ratos libres: ${await pg.locator('button.dia__libre').count()}`);

// H3.S1.M2 · el formulario NO está al pie antes de tocar nada
check((await pg.locator('app-tarjeta-del-dia').count()) === 0, 'antes de tocar: no hay tarjeta en la página');
await pg.screenshot({ path: `${OUT}/01-dia-sin-tarjeta.png`, fullPage: true });

// Tocar un rato libre con el TECLADO, no con el puntero: así se puede
// comprobar a dónde vuelve el foco al cerrar.
const libre = pg.locator('button.dia__libre').first();
const hayLibre = (await libre.count()) > 0;
console.log('ratos libres en el día:', await pg.locator('button.dia__libre').count());
if (!hayLibre) {
  console.log('SKIP  el día de hoy no tiene ratos libres: se prueba con el «+» del encabezado');
}
const disparador = hayLibre ? libre : pg.locator('[data-testid="dia-agregar"]');
await disparador.focus();
const antesDelFoco = await activo();
console.log('foco antes de abrir:', antesDelFoco);
await pg.keyboard.press('Enter');
await pg.waitForTimeout(900);

// 1 · es un diálogo modal, con rol y nombre
const dlg = pg.locator('dialog[data-testid="content-dialog"]');
check((await dlg.count()) === 1, 'se abrió UN diálogo');
check(await dlg.evaluate((d) => d.hasAttribute('open')), 'el <dialog> está abierto');
const nombre = await pg.locator('[data-testid="content-dialog-title"]').innerText();
console.log('nombre accesible del diálogo:', JSON.stringify(nombre));
check(nombre.trim().length > 0, 'el diálogo tiene nombre');
check(await dlg.evaluate((d) => d.matches(':modal')), 'es MODAL (:modal), no un panel al pie');

// 2 · el foco inicial cae adentro
const dentro = await pg.evaluate(() => document.querySelector('dialog[data-testid="content-dialog"]')?.contains(document.activeElement) ?? false);
check(dentro, `el foco inicial está DENTRO del modal (${await activo()})`);
await pg.screenshot({ path: `${OUT}/02-modal-abierto.png`, fullPage: true });

// 3 · franja del cupo o campos de hora, según de dónde venga
const franja = await pg.locator('[data-testid="tarjeta-franja-del-cupo"]').count();
const campos = await pg.locator('.tarjeta__rango').count();
console.log(`franja del cupo: ${franja} · campos de hora: ${campos}`);
if (hayLibre) {
  check(franja === 1 && campos === 0, 'viniendo de un cupo: la franja es dato y no hay campos de hora');
} else {
  check(franja === 0 && campos === 1, 'viniendo del «+» (sin cupo): los campos de hora siguen');
}

// 4 · la trampa de foco: tabular muchas veces nunca sale del modal
// Lo que se mide es que el foco nunca alcance un elemento DE LA PÁGINA que esté
// fuera del modal. Que al dar la vuelta pase por `body` es el ciclo normal del
// `<dialog>` nativo —el foco sale un turno a la interfaz del navegador— y no es
// una fuga: en ese instante no hay nada de la página enfocado, y la prueba de
// que la trampa aguanta es que el turno siguiente vuelve al primer control del
// modal y nunca a un control de atrás.
let escapo = null;
const recorrido = [];
for (let i = 0; i < 18; i += 1) {
  await pg.keyboard.press('Tab');
  const donde = await pg.evaluate(() => {
    const dlg = document.querySelector('dialog[data-testid="content-dialog"]');
    const a = document.activeElement;
    if (a === null) return 'ninguno';
    if (dlg !== null && dlg.contains(a)) return 'dentro';
    return a === document.body || a === document.documentElement ? 'ninguno' : 'FUERA';
  });
  recorrido.push(`${i + 1}:${donde}`);
  if (donde === 'FUERA') escapo = recorrido.at(-1) + ' ' + (await activo());
}
console.log('recorrido de teclado: ' + recorrido.join(' · '));
check(
  escapo === null,
  escapo === null
    ? '18 tabulaciones y ningún control de la página fuera del modal recibió el foco'
    : `el foco se escapó del modal en ${escapo}`,
);
await pg.screenshot({ path: `${OUT}/03-foco-atrapado.png`, fullPage: true });

// 5 · Escape cierra (vacío: no hay nada que perder) y devuelve el foco
await pg.keyboard.press('Escape');
await pg.waitForTimeout(700);
check((await pg.locator('dialog[data-testid="content-dialog"]').count()) === 0, 'Escape cerró el modal');
const despues = await activo();
console.log('foco después de cerrar:', despues);
check(despues === antesDelFoco, `el foco volvió al disparador (${despues})`);

// 6 · H3.S1.M4 · con el modal abierto no se puede abrir un segundo
await disparador.focus();
await pg.keyboard.press('Enter');
await pg.waitForTimeout(700);
check((await pg.locator('dialog[data-testid="content-dialog"]').count()) === 1, 'reabre, y sólo uno');
const segundoClicLlego = await pg.locator('button.dia__libre').nth(1).click({ timeout: 2500, trial: true }).then(() => true).catch(() => false);
check(!segundoClicLlego, 'con el modal abierto, otro rato del día NO es alcanzable (el fondo quedó inerte)');
check((await pg.locator('dialog[data-testid="content-dialog"]').count()) === 1, 'sigue habiendo un solo diálogo');
await pg.keyboard.press('Escape');

console.log('\nerrores de consola:', errores.length === 0 ? 'ninguno' : JSON.stringify(errores, null, 2));
console.log(`\n=== H3.S1 ${fallos === 0 ? 'PASS' : `FAIL (${fallos})`} ===`);
await nav.close();
process.exit(fallos === 0 ? 0 : 1);
