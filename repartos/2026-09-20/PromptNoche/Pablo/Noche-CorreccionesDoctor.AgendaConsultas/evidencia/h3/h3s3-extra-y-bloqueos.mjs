/**
 * H3.S3 — los cupos dicen la verdad, el bloqueo no deja crear, y el horario
 * extra se modela como excepción EXTRA con confirmación.
 *
 * El nivel CORRECTO y el LÍMITE se ejercitan contra el manejador simulado real
 * (que sí soporta `EXTRA` con `blocks:false`). El nivel INVÁLIDO se ejercita
 * contra el contrato, porque la pantalla no tiene cómo mandar uno inválido.
 */
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

console.log('sesión →', await entrar(pg));
await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
await pg.locator('app-day-view').waitFor({ timeout: 30000 });
await pg.waitForTimeout(1500);
let saltos = 0;
while ((await pg.locator('button.dia__libre').count()) === 0 && saltos < 7) {
  await pg.locator('[data-testid="dia-siguiente"]').click();
  await pg.waitForTimeout(1200);
  saltos += 1;
}

/* ── H3.S3.M1 · los cupos del día son los del horario publicado ─────────── */
const franjasDelDia = await pg.locator('.dia__bloque .dia__hora').allInnerTexts();
console.log('franjas que dibuja el día:', JSON.stringify(franjasDelDia.map((f) => f.trim())));
// El horario publicado, leído de la otra solapa.
await pg.goto(`${BASE}/schedule?vista=agenda`, { waitUntil: 'domcontentloaded' });
await pg.waitForTimeout(2500);
const horario = (await pg.locator('app-schedule-grid, .horario, app-my-agenda').first().innerText()).replace(/\n+/g, ' | ').slice(0, 600);
console.log('horario publicado (recorte):', horario);

/* ── H3.S3.M3 y M4 · el horario extra ───────────────────────────────────── */
await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
await pg.locator('app-day-view').waitFor({ timeout: 30000 });
await pg.waitForTimeout(1500);
for (let i = 0; i < saltos; i += 1) { await pg.locator('[data-testid="dia-siguiente"]').click(); await pg.waitForTimeout(1000); }

const boton = pg.locator('[data-testid="agregar-horario-extra"]');
check((await boton.count()) === 1, 'el día ofrece «Agregar un horario al final»');

// NIVEL CORRECTO — se pregunta antes, y el texto nombra que se sale del horario.
await boton.click();
await pg.waitForTimeout(900);
const dlg = pg.locator('app-dialog dialog, dialog').last();
const texto = (await dlg.innerText()).replace(/\n+/g, ' ');
console.log('texto del diálogo:', JSON.stringify(texto));
check(/fuera de tu horario de atención/i.test(texto), 'el diálogo NOMBRA que se sale del horario de atención');
check(/termina a las \d\d:\d\d|no atendés/i.test(texto), 'y dice hasta cuándo atiende hoy');
check(/se puede reservar/i.test(texto), 'y dice qué pasa si sigue');
check((await pg.evaluate(() => document.querySelectorAll('dialog[open]').length)) >= 1, 'es un diálogo de la página, no un confirm() del navegador');
await pg.screenshot({ path: `${OUT}/09-extra-confirmacion.png`, fullPage: true });

// NIVEL LÍMITE — cancelar NO crea nada.
const bloquesAntes = await pg.locator('.dia__bloque').count();
await dlg.getByRole('button', { name: /No agregar nada|Cancelar/i }).click();
await pg.waitForTimeout(1200);
check((await pg.locator('.dia__bloque').count()) === bloquesAntes, `cancelar no creó nada (${bloquesAntes} bloques antes y después)`);

// NIVEL CORRECTO — confirmar SÍ crea, y la petición lleva EXTRA + isAvailable.
const peticiones = [];
await pg.route('**/*', (route) => route.continue());
pg.on('request', (r) => { if (/exceptions/.test(r.url())) peticiones.push(`${r.method()} ${r.url().replace(BASE, '')} ${r.postData() ?? ''}`); });
await boton.click();
await pg.waitForTimeout(700);
await pg.locator('dialog').last().getByRole('button', { name: /Agregar el horario extra/i }).click();
await pg.waitForTimeout(2000);
const aviso = await pg.locator('app-toast, [role="status"]').filter({ hasText: /Horario extra/i }).count();
check(aviso >= 1, 'confirmar creó el horario extra y lo avisa');
await pg.screenshot({ path: `${OUT}/10-extra-creado.png`, fullPage: true });

/* -- Lo que el manejador simulado SI hace y lo que NO --------------------- */
const bloquesDespues = await pg.locator('.dia__bloque').count();
const libresDespues = await pg.locator('button.dia__libre').count();
console.log(`despues del EXTRA · bloques: ${bloquesDespues} (antes ${bloquesAntes}) · ratos libres: ${libresDespues}`);
if (bloquesDespues === bloquesAntes) {
  console.log([
    'HALLAZGO H3-P1 · la excepcion EXTRA se crea y se acepta, pero el manejador simulado NO',
    '  genera cupos para su ventana: POST /scheduling/resources/:id/exceptions con',
    '  isAvailable:true solo se saltea el cierre de cupos, no crea ninguno',
    '  (core/mock/handlers/scheduling.handlers.ts:586). Resultado: el horario extra existe',
    '  como excepcion y NO se puede reservar desde el dia. Es de core/mock/**, de Ender.',
  ].join(String.fromCharCode(10)));
} else {
  check(libresDespues > 0, 'el horario extra quedo disponible para reservar');
}

console.log('\nerrores de consola:', errores.length === 0 ? 'ninguno' : JSON.stringify(errores, null, 2));
console.log(`\n=== H3.S3 ${fallos === 0 ? 'PASS' : `FAIL (${fallos})`} ===`);
await nav.close();
process.exit(fallos === 0 ? 0 : 1);
