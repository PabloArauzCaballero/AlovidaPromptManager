/** H3.S2.M2 y M3 — la modalidad es alternancia, no radios, y se elige con flechas. */
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
await pg.waitForTimeout(1200);
let saltos = 0;
while ((await pg.locator('button.dia__libre').count()) === 0 && saltos < 7) {
  await pg.locator('[data-testid="dia-siguiente"]').click();
  await pg.waitForTimeout(1200);
  saltos += 1;
}
await pg.locator('button.dia__libre').first().click();
await pg.waitForTimeout(800);

// Elegir un paciente: la modalidad sólo existe si hay alguien a quien atender.
const combo = pg.locator('app-reference-combobox input').first();
await combo.fill('a');
await pg.waitForTimeout(1500);
const opciones = pg.locator('[role="option"]');
console.log('opciones de paciente:', await opciones.count());
await opciones.first().click();
await pg.waitForTimeout(600);

const grupo = pg.locator('[data-testid="tarjeta-modalidad"] [role="radiogroup"], [data-testid="tarjeta-modalidad"][role="radiogroup"]').first();
check((await grupo.count()) === 1, 'la modalidad se dibuja como un control segmentado');
check((await pg.locator('dialog input[type="radio"]').count()) === 0, 'cero radios nativos en el formulario');
check((await grupo.getAttribute('aria-label')) === '¿Cómo lo atendés?', 'el grupo se anuncia con su pregunta');

const marcada = async () => (await pg.locator('[role="radio"][aria-checked="true"]').first().innerText()).trim();
console.log('opción marcada al aparecer:', JSON.stringify(await marcada()));
check((await marcada()) === 'En el consultorio', 'arranca en presencial, que es lo que pasa casi siempre');
await pg.screenshot({ path: `${OUT}/04-modalidad-toggle.png`, fullPage: true });

// M3 · con teclado: un solo tabulador entra al grupo y las flechas eligen.
await pg.locator('[role="radio"][aria-checked="true"]').first().focus();
await pg.keyboard.press('ArrowRight');
await pg.waitForTimeout(400);
console.log('tras ArrowRight:', JSON.stringify(await marcada()));
check((await marcada()) === 'Por videollamada', 'la flecha derecha cambia la opción');
await pg.keyboard.press('ArrowLeft');
await pg.waitForTimeout(400);
check((await marcada()) === 'En el consultorio', 'la flecha izquierda vuelve');
// El estado se anuncia: `aria-checked` en el control, no sólo color.
const anunciados = await pg.locator('[role="radio"]').evaluateAll((els) =>
  els.map((e) => `${e.textContent?.trim()}=${e.getAttribute('aria-checked')}`),
);
console.log('estado anunciado:', JSON.stringify(anunciados));
check(anunciados.filter((a) => a.endsWith('=true')).length === 1, 'exactamente una opción anunciada como elegida');
await pg.screenshot({ path: `${OUT}/05-modalidad-teclado.png`, fullPage: true });

console.log('\nerrores de consola:', errores.length === 0 ? 'ninguno' : JSON.stringify(errores, null, 2));
console.log(`\n=== H3.S2 ${fallos === 0 ? 'PASS' : `FAIL (${fallos})`} ===`);
await nav.close();
process.exit(fallos === 0 ? 0 : 1);
