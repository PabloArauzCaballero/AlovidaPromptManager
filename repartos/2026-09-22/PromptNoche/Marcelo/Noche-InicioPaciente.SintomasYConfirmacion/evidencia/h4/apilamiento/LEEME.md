# Apilamiento de `confirmarCambios()` sobre un `app-content-dialog` real (H4.S1.M6)

Script: `apilamiento.mjs` (copia de `artifacts/apilamiento.mjs` del worktree; `artifacts/` está ignorado por git).
Uso: `node artifacts/apilamiento.mjs <chromium|firefox> <carpeta>` con la maqueta en `:4200`.
Qué hace: login `medica@alovida.mock` → «Mi perfil» → pestaña Trayectoria → «Añadir elemento a tu historial»
(un `content-dialog` real de `app-work-history`, que ya inyecta `DialogService`) → dispara
`ng.getComponent(app-work-history).dialogs.confirmarCambios()` → mide capas y foco → Tab ×4 → `Escape` → mide de nuevo.

| Navegador | abiertos durante | foco durante | Tab ×4 alcanzó el de abajo | Escape → | abiertos después | foco después | Veredicto |
|---|---|---|---|---|---|---|---|
| Chromium 151.0.7922.34 | `content-dialog`, `dialogo` | `dialogo-confirmar` | **no** (alterna Confirmar / Cancelar y el chrome del navegador, que es lo nativo de `showModal`) | `false` | `content-dialog` | `content-dialog-close` | PASS |
| Firefox 153.0 (playwright 1538) | `content-dialog`, `dialogo` | `dialogo-confirmar` | **no** (Firefox deja el foco en Confirmar) | `false` | `content-dialog` | `content-dialog-close` | PASS |

Capturas: `<navegador>-01-apilado.png` (los dos modales) y `<navegador>-02-tras-escape.png` (sólo el de abajo, con el
foco en «Cancelar»). Salidas literales: `chromium.txt`, `firefox.txt`.

**Corrección durante la evidencia (registrada, no escondida):** la primera corrida en Chromium dio `FAIL` por un criterio
mío mal escrito (contaba como «fuga» que Tab pasara al chrome del navegador). Lo que hay que demostrar es que el foco
**nunca alcanza el modal de abajo**, y eso se cumple en los dos. La primera captura de Firefox salió antes de que la capa
superior se pintara; se agregó una espera por condición (diálogo visible + dos `requestAnimationFrame`), no un `sleep`.
