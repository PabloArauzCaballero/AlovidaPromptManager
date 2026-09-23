// Prueba real del dictado en Firefox (H3.S2.M2 / M7): sin reconocedor de voz,
// el botón «Dictar» NO tiene que existir y el área de texto sí.
// Uso: node artifacts/dictado-firefox.mjs  (con `yarn dev` corriendo en :4200)
// Cuenta sintética del simulador; nada de datos reales.
import { firefox } from 'playwright';

const dir =
  'C:/Users/Usuario/Downloads/Entrypoint-GitHUb/AlovidaPromptManager/repartos/2026-09-22/PromptNoche/Marcelo/Noche-InicioPaciente.SintomasYConfirmacion/evidencia/h3/dictado/';

const browser = await firefox.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, colorScheme: 'light' });
const out = { navegador: browser.version() };
try {
  await page.goto('http://localhost:4200/auth', { waitUntil: 'networkidle' });
  await page.locator('[data-testid="login-identifier"]').fill('paciente@alovida.mock');
  await page.locator('[data-testid="login-password"]').fill('maqueta');
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForURL('**/dashboard', { timeout: 30000 });
  await page.locator('[data-testid="sintomas-escribir"]').waitFor({ state: 'visible', timeout: 30000 });
  out.soporte = await page.evaluate(() => ({
    SpeechRecognition: 'SpeechRecognition' in window,
    webkitSpeechRecognition: 'webkitSpeechRecognition' in window,
    botonDictar: !!document.querySelector('[data-testid="sintomas-dictar"]'),
    bloqueDictado: !!document.querySelector('[data-testid="sintomas-dictado"]'),
    areaDeTexto: !!document.querySelector('[data-testid="sintomas-texto"] textarea'),
    rotulo: document.querySelector('[data-testid="sintomas-escribir"] label')?.textContent?.trim(),
  }));
  await page.evaluate(() => document.querySelector('[data-testid="sintomas-escribir"]')?.scrollIntoView({ block: 'center' }));
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.screenshot({ path: dir + '05-firefox-375-sin-boton.png' });
  out.veredicto =
    !out.soporte.SpeechRecognition && !out.soporte.webkitSpeechRecognition && !out.soporte.botonDictar && out.soporte.areaDeTexto
      ? 'PASS: Firefox sin reconocedor → sin botón; el área de texto sigue'
      : 'REVISAR: ' + JSON.stringify(out.soporte);
} catch (e) {
  out.error = String(e);
} finally {
  await browser.close();
}
console.log(JSON.stringify(out, null, 2));
