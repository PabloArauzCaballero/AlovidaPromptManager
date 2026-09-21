/**
 * H2.S2.M3 — el camino nuevo de reservar, recorrido entero.
 *
 * La solapa «Cupos» se retiró: reservar es ahora tocar un rato libre del día.
 * Lo que se mira no es un 200: es que el cupo DEJE de estar libre y que la
 * cita aparezca en el día, con el paciente y en la franja del cupo.
 */
import { chromium } from '@playwright/test';
import { BASE, entrar } from '../entrar.mjs';

const OUT = 'evidencia/h3/capturas';
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
const pg = await ctx.newPage();
const errores = [];
const peticiones = [];
pg.on('console', (m) => { if (m.type() === 'error' && !/Content Security Policy/.test(m.text())) errores.push(m.text()); });
pg.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
pg.on('request', (r) => { if (/\/scheduling\//.test(r.url()) && r.method() !== 'GET') peticiones.push(`${r.method()} ${r.url().replace(BASE, '')} ${r.postData() ?? ''}`); });
let fallos = 0;
const check = (ok, txt) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${txt}`); if (!ok) fallos += 1; };

console.log('sesión →', await entrar(pg));
await pg.goto(`${BASE}/schedule`, { waitUntil: 'domcontentloaded' });
await pg.locator('app-day-view').waitFor({ timeout: 30000 });
await pg.waitForTimeout(1200);
let saltos = 0;
while ((await pg.locator('button.dia__libre').count()) === 0 && saltos < 7) {
  await pg.locator('[data-testid="dia-siguiente"]').click();
  await pg.waitForTimeout(1200);
  saltos += 1;
}

const libresAntes = await pg.locator('button.dia__libre').count();
const citasAntes = await pg.locator('.dia__bloque').filter({ hasText: 'Confirmada' }).count();
const franjaTocada = (await pg.locator('.dia__bloque', { has: pg.locator('button.dia__libre') }).first().locator('.dia__hora').innerText()).trim();
console.log(`ANTES · ratos libres: ${libresAntes} · citas confirmadas: ${citasAntes} · franja que se va a reservar: ${franjaTocada}`);
await pg.screenshot({ path: `${OUT}/06-reserva-antes.png`, fullPage: true });

await pg.locator('button.dia__libre').first().click();
await pg.waitForTimeout(800);
const franjaDelModal = (await pg.locator('[data-testid="tarjeta-franja-del-cupo"] .tarjeta__franja-valor').innerText()).trim();
check(franjaDelModal === franjaTocada, `el modal abre con la franja del cupo tocado (${franjaDelModal} = ${franjaTocada})`);

await pg.locator('app-reference-combobox input').first().fill('a');
await pg.waitForTimeout(1500);
const paciente = (await pg.locator('[role="option"]').first().innerText()).trim().split('\n')[0];
await pg.locator('[role="option"]').first().click();
await pg.locator('app-input input').last().fill('Control de presión');
await pg.waitForTimeout(400);
await pg.locator('[data-testid="tarjeta-guardar"]').click();
await pg.waitForTimeout(2500);

check((await pg.locator('dialog[data-testid="content-dialog"]').count()) === 0, 'el modal se cerró al guardar');
const libresDespues = await pg.locator('button.dia__libre').count();
const nueva = pg.locator('.dia__bloque').filter({ hasText: paciente.split(' ')[0] });
console.log(`DESPUÉS · ratos libres: ${libresDespues} · petición: ${peticiones.join(' | ')}`);
check(libresDespues === libresAntes - 1, `el cupo DEJÓ de estar libre (${libresAntes} → ${libresDespues})`);
check((await nueva.count()) >= 1, `la cita de «${paciente}» aparece en el día`);
const textoNueva = (await nueva.first().innerText()).replace(/\n+/g, ' · ');
console.log('la tarjeta nueva dice:', JSON.stringify(textoNueva));
check(textoNueva.includes(franjaTocada.split('–')[0]), 'y quedó en la franja del cupo, no en otra');
await pg.screenshot({ path: `${OUT}/07-reserva-despues.png`, fullPage: true });

// La persistencia NO se mira acá, y el motivo se declara en vez de omitirse:
// las colecciones del backend simulado viven en memoria (`core/mock/`, de
// Ender; sólo las que declaran `persistirEn` sobreviven, y `scheduling` no lo
// hace). Recargar la página reinicia los datos, así que una comprobación de
// recarga mediría el simulador, no este cambio. Lo que sí se mira es la
// relectura del dia contra el servidor simulado, que es lo que hay.
await pg.locator('[data-testid="dia-siguiente"]').click();
await pg.waitForTimeout(1300);
await pg.locator('[data-testid="dia-anterior"]').click();
await pg.waitForTimeout(1800);
check(
  (await pg.locator('.dia__bloque').filter({ hasText: paciente.split(' ')[0] }).count()) >= 1,
  'y sigue ahi despues de salir del dia y volver (relectura contra el servidor)',
);
await pg.screenshot({ path: `${OUT}/08-reserva-tras-releer.png`, fullPage: true });

console.log('\nerrores de consola:', errores.length === 0 ? 'ninguno' : JSON.stringify(errores, null, 2));
console.log(`\n=== H2.S2.M3 ${fallos === 0 ? 'PASS' : `FAIL (${fallos})`} ===`);
await nav.close();
process.exit(fallos === 0 ? 0 : 1);
