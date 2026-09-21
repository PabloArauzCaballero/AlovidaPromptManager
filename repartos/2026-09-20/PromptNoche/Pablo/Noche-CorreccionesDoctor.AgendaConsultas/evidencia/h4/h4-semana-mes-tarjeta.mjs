/** H4 - la semana con globo (teclado incluido), el mes con chips, la tarjeta que atiende. */
import { chromium } from '@playwright/test';
import { BASE, entrar } from '../entrar.mjs';

const OUT = 'evidencia/h4/capturas';
const nav = await chromium.launch();
let fallos = 0;
const check = (ok, txt) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${txt}`); if (!ok) fallos += 1; };

async function nueva(reduced = false) {
  const ctx = await nav.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const pg = await ctx.newPage();
  pg.on('console', (m) => { if (m.type() === 'error' && !/Content Security Policy/.test(m.text())) console.log('CONSOLA:', m.text()); });
  pg.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await entrar(pg);
  await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
  await pg.locator('app-day-view').waitFor({ timeout: 30000 });
  await pg.waitForTimeout(1500);
  return pg;
}


/** Tabula hasta parar sobre el primer elemento que cumpla el selector. */
async function tabularHasta(pg, selector, tope = 60) {
  await pg.locator('body').click({ position: { x: 3, y: 3 } });
  for (let i = 0; i < tope; i += 1) {
    await pg.keyboard.press('Tab');
    const llego = await pg.evaluate((sel) => document.activeElement?.matches(sel) ?? false, selector);
    if (llego) return i + 1;
  }
  return -1;
}

/* H4.S1 - la semana */
let pg = await nueva();
await pg.locator('[data-testid="ver-semana"]').click();
await pg.waitForTimeout(1800);
const citas = pg.locator('[data-testid="semana-cita"]');
console.log('citas en la semana:', await citas.count());
check((await citas.count()) > 0, 'la semana lista sus citas');

const globo = pg.locator('.semana__globo').first();
const visible = async () => (await globo.evaluate((g) => getComputedStyle(g).visibility)) === 'visible';
check(!(await visible()), 'el globo esta cerrado hasta que alguien senale la cita');

await citas.first().hover();
await pg.waitForTimeout(500);
check(await visible(), 'con el puntero encima, el globo se abre');
const textoGlobo = (await globo.innerText()).replace(/\n+/g, ' | ');
console.log('el globo dice:', JSON.stringify(textoGlobo));
for (const campo of ['Cu', 'Qu', 'Estado', 'Paciente']) {
  check(textoGlobo.includes(campo), `el globo trae el campo que empieza con "${campo}", igual que el detalle del dia`);
}
await pg.screenshot({ path: `${OUT}/01-semana-globo-puntero.png`, fullPage: true });

await pg.mouse.move(0, 0);
await pg.waitForTimeout(400);
check(!(await visible()), 'al retirar el puntero, el globo se cierra');
// Con `Tab` de verdad y no `.focus()`: `:focus-visible` distingue el foco que
// viene del teclado del que viene de un clic, y eso es exactamente lo que se
// quiere probar. Un `.focus()` programatico no cuenta como teclado para el
// navegador, y medirlo asi daria un falso rojo.
const saltos = await tabularHasta(pg, '[data-testid="semana-cita"]');
console.log('tabulaciones hasta la primera cita de la semana:', saltos);
check(saltos > 0, 'se llega a una cita de la semana SOLO con el teclado');
await pg.waitForTimeout(400);
const globoEnfocado = pg.locator('[data-testid="semana-cita"]:focus + .semana__globo').first();
check(
  (await globoEnfocado.evaluate((g) => getComputedStyle(g).visibility).catch(() => 'hidden')) === 'visible',
  'KILL-TEST - llegando con el TECLADO, el globo tambien se abre',
);
await pg.screenshot({ path: `${OUT}/02-semana-globo-teclado.png`, fullPage: true });
await pg.keyboard.press('Enter');
await pg.waitForTimeout(1500);
console.log('dialogos tras Enter:', await pg.locator('dialog').count(), '· abiertos:', await pg.locator('dialog[open]').count(), '· app-dialog:', await pg.locator('app-dialog').count());
const dlg = pg.locator('dialog').last();
check((await dlg.count()) === 1, 'Enter sobre la cita abre el detalle');
const textoDlg = (await dlg.innerText()).replace(/\n+/g, ' | ');
console.log('el detalle dice:', JSON.stringify(textoDlg.slice(0, 220)));
check(/Detalle de la cita/.test(textoDlg), 'y es el MISMO dialogo de detalle que abre el dia');
await pg.screenshot({ path: `${OUT}/03-semana-detalle.png`, fullPage: true });
await pg.keyboard.press('Escape');
await pg.waitForTimeout(500);
check((await pg.locator('dialog').count()) === 0, 'Escape lo cierra');
await pg.context().close();

/* H4.S1.M3 - con movimiento reducido */
pg = await nueva(true);
await pg.locator('[data-testid="ver-semana"]').click();
await pg.waitForTimeout(1800);
await tabularHasta(pg, '[data-testid="semana-cita"]');
await pg.waitForTimeout(400);
const transicion = await pg.locator('[data-testid="semana-cita"]:focus + .semana__globo').first().evaluate((g) => getComputedStyle(g).transitionDuration);
console.log('duracion de la transicion con prefers-reduced-motion:', transicion);
// Playwright emula la preferencia inyectando `transition-duration: 0.01ms`
// (`1e-05s`), asi que el umbral es «practicamente cero» y no literalmente 0s:
// lo que importa es que no haya animacion perceptible.
const segundos = transicion.split(',').map((t) => parseFloat(t) || 0);
check(Math.max(...segundos) <= 0.001, `con movimiento reducido el globo no anima: aparece y ya (${transicion})`);
check((await pg.locator('[data-testid="semana-cita"]:focus + .semana__globo').first().evaluate((g) => getComputedStyle(g).visibility)) === 'visible', 'y se sigue viendo');
await pg.screenshot({ path: `${OUT}/04-semana-movimiento-reducido.png`, fullPage: true });
await pg.context().close();

/* H4.S2 - el mes con chips */
pg = await nueva();
await pg.locator('[data-testid="ver-mes"]').click();
await pg.waitForTimeout(2000);
let abierto = false;
for (const dia of await pg.locator('[data-testid="mes-dia"]').all()) {
  await dia.hover();
  await pg.waitForTimeout(450);
  if ((await pg.locator('[data-testid="mes-globo-chip"]').count()) > 0) { abierto = true; break; }
}
check(abierto, 'senalar un dia del mes abre la tarjeta con chips de estado');
const chips = await pg.locator('[data-testid="mes-globo-chip"]').allInnerTexts();
console.log('chips del dia:', JSON.stringify(chips.map((c) => c.trim())));
check(chips.length > 0 && chips.every((c) => c.trim().length > 0), 'cada chip dice su estado EN PALABRAS, no solo con color');
check(!chips.some((c) => /Booking/i.test(c)), 'y en castellano: ningun "Booking..." del catalogo');
await pg.screenshot({ path: `${OUT}/05-mes-chips.png`, fullPage: true });
await pg.addStyleTag({ content: 'html { filter: grayscale(1) !important; }' });
await pg.waitForTimeout(300);
await pg.screenshot({ path: `${OUT}/06-mes-chips-escala-de-grises.png`, fullPage: true });
await pg.context().close();

/* H4.S3 - la tarjeta lleva a atender */
pg = await nueva();
const tarjeta = pg.locator('[data-testid="dia-ir-a-atender"]').first();
check((await tarjeta.count()) > 0, 'cada cita del dia tiene su capa de atender');
console.log('nombre accesible de la tarjeta:', JSON.stringify(await tarjeta.getAttribute('aria-label')));
const urlAntes = pg.url();
const verDetalle = pg.locator('[data-testid="dia-detalle"]').first();
if ((await verDetalle.count()) > 0) {
  await verDetalle.click();
  await pg.waitForTimeout(900);
  check(pg.url() === urlAntes, 'tocar "Ver detalle" NO navega: hace lo del boton');
  check((await pg.locator('dialog').count()) === 1, 'y abre el detalle');
  await pg.keyboard.press('Escape');
  await pg.waitForTimeout(500);
} else {
  console.log('SKIP  el dia no tiene "Ver detalle": las acciones de la fila lo reemplazan');
}
// La tarjeta hace lo que la cita ADMITE en su estado, no siempre lo mismo.
// Una ya atendida no vuelve a atenderse: abre su detalle y dice por que.
const bloques = await pg.locator('.dia__bloque[data-tipo="cita"]').all();
let confirmada = null;
let atendida = null;
for (const b of bloques) {
  const t = await b.innerText();
  if (confirmada === null && /Confirmada|Paciente lleg/.test(t)) confirmada = b;
  if (atendida === null && /Atendida/.test(t)) atendida = b;
}
console.log('tarjetas encontradas · atendible:', confirmada !== null, '· ya atendida:', atendida !== null);

if (atendida !== null) {
  await atendida.locator('[data-testid="dia-ir-a-atender"]').click();
  await pg.waitForTimeout(1500);
  const d = pg.locator('dialog').last();
  const td = (await d.innerText()).split(String.fromCharCode(10)).join(' | ');
  console.log('al tocar una cita YA ATENDIDA:', JSON.stringify(td.slice(0, 200)));
  // El titulo separa los dos casos: «ya esta cerrada» para una que paso, y
  // «todavia no se atiende» para una que espera respuesta.
  check(/ya est. cerrada|todav/i.test(td), 'una cita ya atendida no navega: abre su detalle y dice por que');
  check(pg.url().endsWith('/schedule'), 'y no se fue de la pantalla');
  await pg.keyboard.press('Escape');
  await pg.waitForTimeout(600);
}

if (confirmada === null) {
  console.log('SKIP  el dia no tiene ninguna cita atendible: no se puede ejercitar la navegacion');
} else {
  const nombre = (await confirmada.locator('.dia__paciente').innerText()).trim();
  console.log('se toca la tarjeta de:', JSON.stringify(nombre));
  await confirmada.locator('[data-testid="dia-ir-a-atender"]').click();
  await pg.waitForTimeout(2500);

  // C-11 se cruza con C-04 a proposito: si YA hay una consulta en curso, la
  // tarjeta no inicia una segunda — avisa cual esta abierta y ofrece ir a ella.
  // Las dos salidas llevan a atender, que es lo que C-04 pide; cual de las dos
  // aparece depende del dia, asi que se ejercitan las dos.
  const aviso = pg.locator('dialog').last();
  const hayAviso = (await aviso.count()) > 0;
  if (hayAviso) {
    const t = (await aviso.innerText()).split(String.fromCharCode(10)).join(' | ');
    console.log('se cruzo C-11:', JSON.stringify(t.slice(0, 140)));
    check(/Ya ten.s una consulta en curso/.test(t), 'con una en curso, la tarjeta avisa en vez de iniciar una segunda');
    await aviso.getByRole('button', { name: /Ir a la consulta abierta/i }).click();
    await pg.waitForTimeout(4000);
  }

  console.log('URL tras tocar la tarjeta:', pg.url().replace(BASE, ''));
  check(new RegExp('medical-records/.+/consultation').test(pg.url()), 'tocar la tarjeta lleva a la pantalla de atencion');
  const params = new URL(pg.url()).searchParams;
  console.log('parametros que viajaron:', JSON.stringify([...params.entries()]));
  check([...params.keys()].length > 0, 'y el turno y el motivo viajan en la URL');
  await pg.screenshot({ path: `${OUT}/07-tarjeta-lleva-a-atender.png`, fullPage: true });
}
await pg.context().close();

console.log(`
=== H4 ${fallos === 0 ? 'PASS' : `FAIL (${fallos})`} ===`);
await nav.close();
process.exit(fallos === 0 ? 0 : 1);
