/** H5 - una consulta a la vez (C-11), el visitador (C-13) y los otros servicios (C-12). */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { BASE, entrar } from '../entrar.mjs';

const OUT = 'evidencia/h5/capturas';
mkdirSync(OUT, { recursive: true });
const nav = await chromium.launch();
let fallos = 0;
const check = (ok, txt) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${txt}`); if (!ok) fallos += 1; };

async function nueva() {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const pg = await ctx.newPage();
  pg.on('console', (m) => { if (m.type() === 'error' && !/Content Security Policy/.test(m.text())) console.log('CONSOLA:', m.text().slice(0, 200)); });
  pg.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await entrar(pg);
  return pg;
}

/* ── C-11 · una consulta a la vez ───────────────────────────────────────── */
let pg = await nueva();
await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
await pg.locator('app-day-view').waitFor({ timeout: 30000 });
await pg.waitForTimeout(1800);

const bloques = await pg.locator('.dia__bloque[data-tipo="cita"]').all();
let enCurso = null;
let otra = null;
for (const b of bloques) {
  const t = await b.innerText();
  if (enCurso === null && /En consulta|En curso/.test(t)) enCurso = b;
  else if (otra === null && /Confirmada|Paciente lleg/.test(t)) otra = b;
}
console.log('hay una en curso:', enCurso !== null, '· hay otra atendible:', otra !== null);

if (enCurso === null || otra === null) {
  console.log('SKIP  el dia de hoy no tiene a la vez una consulta en curso y otra atendible');
} else {
  const antes = await otra.innerText();
  await otra.locator('[data-testid="dia-ir-a-atender"]').click();
  await pg.waitForTimeout(1800);
  const dlg = pg.locator('dialog').last();
  const texto = (await dlg.innerText()).split(String.fromCharCode(10)).join(' | ');
  console.log('el aviso dice:', JSON.stringify(texto.slice(0, 260)));
  check(/Ya ten.s una consulta en curso/.test(texto), 'con una en curso, iniciar otra NO la inicia y dice cual esta abierta');
  check(/Ir a la consulta abierta/.test(texto), 'y ofrece SALIR a la que esta abierta, no solo frenar');
  check(pg.url().endsWith('/schedule'), 'no se fue de la pantalla');
  await pg.screenshot({ path: `${OUT}/01-una-consulta-a-la-vez.png`, fullPage: true });
  await pg.keyboard.press('Escape');
  await pg.waitForTimeout(800);
  const despues = await otra.innerText();
  check(antes === despues, 'y la segunda cita NO cambio de estado');
}
await pg.context().close();

/* ── C-13 · la visita de laboratorio ────────────────────────────────────── */
pg = await nueva();
await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
await pg.locator('app-day-view').waitFor({ timeout: 30000 });
await pg.waitForTimeout(1800);
// El simulador siembra las visitas como SOLICITADAS: una solicitud sin aceptar
// no ocupa el rato y no se dibuja (y eso es lo correcto). Para poder mirar la
// tarjeta hay que aceptar una primero, desde su bandeja, que es el camino real.
await pg.goto(`${BASE}/lab-visits`, { waitUntil: 'domcontentloaded' });
await pg.waitForTimeout(2500);
const aceptar = pg.getByRole('button', { name: /Aceptar/i }).first();
if ((await aceptar.count()) > 0) {
  console.log('se acepta una visita pendiente desde /lab-visits');
  await aceptar.click();
  await pg.waitForTimeout(2500);
  const confirmar = pg.locator('dialog').last().getByRole('button', { name: /Aceptar|Confirmar/i }).first();
  if ((await confirmar.count()) > 0) { await confirmar.click(); await pg.waitForTimeout(2000); }
} else {
  console.log('no hay ninguna visita pendiente de aceptar en la bandeja');
}
await pg.screenshot({ path: `${OUT}/02a-bandeja-de-visitas.png`, fullPage: true });
// DENTRO de la SPA y no con `goto`: las colecciones del backend simulado viven
// en memoria, y una recarga completa deshace la aceptacion que se acaba de
// hacer. Se navega por el menu, que es como navega una persona.
await pg.getByRole('link', { name: /Consultas m/i }).first().click();
await pg.locator('app-day-view').waitFor({ timeout: 30000 });
await pg.waitForTimeout(1800);

let saltos = 0;
while ((await pg.locator('.dia__bloque[data-tipo="visita"]').count()) === 0 && saltos < 14) {
  await pg.locator('[data-testid="dia-siguiente"]').click();
  await pg.waitForTimeout(900);
  saltos += 1;
}
const visitas = await pg.locator('.dia__bloque[data-tipo="visita"]').count();
console.log(`visitas de laboratorio encontradas: ${visitas} (tras ${saltos} dias)`);
if (visitas === 0) {
  console.log('SKIP  el simulador no tiene ninguna visita aceptada en los proximos 14 dias');
} else {
  const tarjeta = pg.locator('.dia__bloque[data-tipo="visita"]').first();
  const texto = (await tarjeta.innerText()).split(String.fromCharCode(10)).join(' | ');
  console.log('la tarjeta del visitador dice:', JSON.stringify(texto));
  check(/Visitador/.test(texto), 'la tarjeta lleva la palabra «Visitador», no solo un tono');
  check(!/paciente|expediente|diagn/i.test(texto), 'y ni un dato clinico');
  check((await tarjeta.locator('[data-testid="dia-ir-a-lab-visits"]').count()) === 1, 'la bandeja /lab-visits sigue alcanzable desde la tarjeta');
  await pg.screenshot({ path: `${OUT}/02-visitador.png`, fullPage: true });
  await pg.addStyleTag({ content: 'html { filter: grayscale(1) !important; }' });
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: `${OUT}/03-visitador-escala-de-grises.png`, fullPage: true });
}
await pg.context().close();

/* ── C-12 · los otros servicios ─────────────────────────────────────────── */
pg = await nueva();
await pg.goto(`${BASE}/my-services`, { waitUntil: 'domcontentloaded' });
await pg.locator('[data-testid="my-services-grid"]').waitFor({ timeout: 30000 });
await pg.waitForTimeout(1500);
const programar = pg.locator('[data-testid="my-services-schedule"]').first();
check((await programar.count()) === 1, 'cada servicio ofrece «Programar horario»');
const servicio = (await pg.locator('[data-testid="my-services-item"]').first().locator('h2').innerText()).trim();
console.log('servicio que se programa:', JSON.stringify(servicio));
await programar.click();
await pg.waitForTimeout(2500);
check((await pg.locator('app-schedule-grid').count()) >= 1, 'el modal RECICLA la grilla del horario, no dibuja una nueva');
const motivo = await pg.locator('[data-testid="my-services-schedule-reason"]').innerText();
console.log('el modal anuncia el motivo:', JSON.stringify(motivo.trim()));
check(/Otros servicios/.test(motivo), 'y dice que va a aparecer como «Otros servicios»');
await pg.screenshot({ path: `${OUT}/04-programar-horario.png`, fullPage: true });

// Programar el rato de MAÑANA, para poder mirarlo en la agenda.
const manana = new Date();
manana.setDate(manana.getDate() + 1);
const diaDeLaSemana = String(manana.getDay());
await pg.locator(`[data-testid="my-services-schedule-day"] [role="radio"]`).nth(
  ['1', '2', '3', '4', '5', '6', '0'].indexOf(diaDeLaSemana),
).click();
await pg.locator('[data-testid="my-services-schedule-from"] input, input[data-testid="my-services-schedule-from"]').first().fill('14:00');
await pg.locator('[data-testid="my-services-schedule-to"] input, input[data-testid="my-services-schedule-to"]').first().fill('16:00');
await pg.waitForTimeout(400);
await pg.locator('[data-testid="my-services-schedule-save"]').click();
await pg.waitForTimeout(2500);
check((await pg.locator('app-content-dialog').count()) === 0, 'guardar cierra el modal');
const aviso = await pg.locator('app-toast, [role="status"]').filter({ hasText: /Otros servicios/i }).count();
check(aviso >= 1, 'y avisa que el rato quedo bloqueado como «Otros servicios»');
await pg.screenshot({ path: `${OUT}/05-servicio-programado.png`, fullPage: true });

// Y ahora, el bloqueo EN LA AGENDA CLINICA.
await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
await pg.locator('app-day-view').waitFor({ timeout: 30000 });
await pg.waitForTimeout(1800);
await pg.locator('[data-testid="dia-siguiente"]').click();
await pg.waitForTimeout(2000);
const ocupados = await pg.locator('.dia__bloque[data-tipo="ocupado"]').allInnerTexts();
console.log('ratos ocupados del dia siguiente:', JSON.stringify(ocupados.map((o) => o.split(String.fromCharCode(10)).join(' | '))));
check(ocupados.some((o) => /Otros servicios/.test(o)), 'el rato aparece BLOQUEADO en la agenda clinica, con el motivo «Otros servicios»');
check(ocupados.some((o) => new RegExp(servicio).test(o)), 'y nombra el servicio que lo bloquea');
await pg.screenshot({ path: `${OUT}/06-bloqueo-en-la-agenda.png`, fullPage: true });
await pg.context().close();

console.log(`
=== H5 ${fallos === 0 ? 'PASS' : `FAIL (${fallos})`} ===`);
await nav.close();
process.exit(fallos === 0 ? 0 : 1);
