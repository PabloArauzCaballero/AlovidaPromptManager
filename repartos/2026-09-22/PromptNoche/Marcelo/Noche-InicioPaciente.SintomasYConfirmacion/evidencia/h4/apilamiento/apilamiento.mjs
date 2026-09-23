/* Apilamiento de `DialogService.confirmarCambios()` sobre un `app-content-dialog` real (H4.S1.M6).
   Uso: node artifacts/apilamiento.mjs <chromium|firefox> <carpeta de salida>
   Es evidencia, no producto: vive en artifacts/ (ignorado por git). */
import { chromium, firefox } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const nombre = process.argv[2] ?? 'chromium';
const salida = process.argv[3] ?? '.';
mkdirSync(salida, { recursive: true });
const tipo = nombre === 'firefox' ? firefox : chromium;
const log = [];
const anotar = (m) => { log.push(m); console.log(m); };

const browser = await tipo.launch();
const version = browser.version();
anotar(`navegador: ${nombre} ${version}`);
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('console', (msg) => { if (msg.type() === 'error') anotar(`consola [error]: ${msg.text().slice(0, 140)}`); });

await page.goto('http://localhost:4200/auth');
await page.getByTestId('login-identifier').fill('medica@alovida.mock');
await page.getByTestId('login-password').fill('maqueta');
await page.getByTestId('login-submit').click();
await page.waitForURL('**/dashboard');
anotar('login medica@ → /dashboard');

// Navegación del lado del cliente: la sesión es en memoria (ADR-0006).
await page.getByRole('link', { name: 'Mi perfil' }).first().click();
await page.waitForURL('**/my-account');
await page.getByRole('tab', { name: 'Trayectoria' }).first().click();
await page.getByTestId('abrir-alta-vinculo').click();
await page.locator('[data-testid="content-dialog"][open]').waitFor();
anotar('content-dialog «Añadir elemento a tu historial» abierto');

const estado = () => page.evaluate(() => {
  const activo = document.activeElement;
  const dialogoDe = (el) => el?.closest('dialog')?.dataset?.testid ?? null;
  return {
    abiertos: [...document.querySelectorAll('dialog[open]')].map((d) => d.dataset.testid ?? d.tagName),
    activo: activo === document.body ? '(body: el foco pasó al chrome del navegador)' : (activo?.getAttribute('data-testid') ?? activo?.tagName ?? null),
    activoDentroDe: dialogoDe(activo),
  };
});

const antes = await estado();
anotar(`antes: abiertos=${JSON.stringify(antes.abiertos)} · foco en «${antes.activo}» dentro de ${antes.activoDentroDe}`);

// Disparar la confirmación desde el componente que ya inyecta DialogService.
await page.evaluate(() => {
  const anfitrion = document.querySelector('app-work-history');
  const componente = window.ng.getComponent(anfitrion);
  window.__respuesta = componente.dialogs.confirmarCambios();
  window.__respuesta.then((v) => { window.__resuelto = v; });
});
await page.locator('[data-testid="dialogo"][open]').waitFor({ state: 'visible' });
// Dos frames pintados antes de fotografiar: en Firefox headless la captura salía
// antes de que la capa superior se dibujara (evidencia de la primera corrida).
const dosFrames = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
await dosFrames();
const durante = await estado();
anotar(`durante: abiertos=${JSON.stringify(durante.abiertos)} · foco en «${durante.activo}» dentro de ${durante.activoDentroDe}`);
const titulo = await page.getByTestId('dialogo-titulo').textContent();
anotar(`título de la confirmación: «${titulo?.trim()}»`);
await page.screenshot({ path: join(salida, `${nombre}-01-apilado.png`) });

// Trampa de foco: tres tabulaciones no salen del diálogo de arriba.
const recorrido = [];
for (let i = 0; i < 4; i++) {
  await page.keyboard.press('Tab');
  const e = await estado();
  recorrido.push(`${e.activo}@${e.activoDentroDe}`);
}
anotar(`Tab ×4 con la confirmación abierta: ${recorrido.join(' → ')}`);
// Lo que hay que demostrar: mientras la confirmación está abierta, el foco NUNCA
// alcanza el modal de abajo (queda inerte). Que al tabular desde el último control
// el foco pase al chrome del navegador (`body`) es el comportamiento nativo de
// `showModal()` y no una fuga hacia la página.
const alcanzoElDeAbajo = recorrido.some((r) => r.endsWith('@content-dialog'));
anotar(`el foco ${alcanzoElDeAbajo ? 'ALCANZÓ' : 'nunca alcanzó'} el modal de abajo mientras la confirmación estaba abierta`);

// Escape cierra la confirmación (false) y el foco vuelve al modal de abajo.
await page.keyboard.press('Escape');
await page.locator('[data-testid="dialogo"]').waitFor({ state: 'detached' });
await dosFrames();
const resuelto = await page.evaluate(() => window.__resuelto);
const despues = await estado();
anotar(`Escape → resolvió ${resuelto} · abiertos=${JSON.stringify(despues.abiertos)} · foco en «${despues.activo}» dentro de ${despues.activoDentroDe}`);
await page.screenshot({ path: join(salida, `${nombre}-02-tras-escape.png`) });

const veredicto =
  durante.abiertos.length === 2 && durante.activoDentroDe === 'dialogo' && !alcanzoElDeAbajo &&
  resuelto === false && despues.abiertos.length === 1 && despues.activoDentroDe === 'content-dialog'
    ? 'PASS' : 'FAIL';
anotar(`VEREDICTO ${nombre}: ${veredicto}`);
writeFileSync(join(salida, `${nombre}.txt`), log.join('\n') + '\n', 'utf8');
await browser.close();
process.exit(veredicto === 'PASS' ? 0 : 1);
