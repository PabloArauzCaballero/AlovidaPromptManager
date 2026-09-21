/** Helper de sesión de la maqueta. Cuenta sintética declarada: medica@alovida.mock. */
export const BASE = process.env.BASE ?? 'http://localhost:4200';

export async function entrar(pg) {
  await pg.goto(`${BASE}/auth`, { waitUntil: 'commit', timeout: 180000 });
  const destino = /\/(dashboard|auth\/organization)/;
  // El servidor de desarrollo recompila tras cada edición y la primera carga
  // puede llegar a medio construir: se reintenta hasta que la sesión entre.
  for (let i = 0; i < 12 && !destino.test(pg.url()); i += 1) {
    if (i > 0) await pg.goto(`${BASE}/auth`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await pg.getByTestId('login-identifier').waitFor({ timeout: 20000 }).catch(() => {});
    await pg.getByTestId('login-identifier').fill('medica@alovida.mock').catch(() => {});
    await pg.getByTestId('login-password').fill('Alovida123!').catch(() => {});
    await pg.getByTestId('login-submit').click({ timeout: 5000 }).catch(() => {});
    await pg.waitForURL(destino, { timeout: 15000 }).catch(() => {});
  }
  if (pg.url().includes('/auth/organization')) {
    await pg.getByTestId('tenant-opcion').first().click();
    await pg.waitForURL(/\/dashboard/, { timeout: 60000 });
  }
  return pg.url();
}
