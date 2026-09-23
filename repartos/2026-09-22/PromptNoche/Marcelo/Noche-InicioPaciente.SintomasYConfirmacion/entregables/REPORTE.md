# Reporte — Silueta del cuerpo, voz y modal de confirmación (carril de Marcelo, ejecutado por Pablo)

> **AVANCE: 63 / 64 — 98,4 %.**

- Fecha: 2026-09-22/23 (turno noche) · Plan: [PLAN.md](./PLAN.md) · Rama: `pablo/inicio-paciente-silueta-voz-y-confirmacion`
- Peldaño de evidencia alcanzado: **VERIFIED por área** (ver `evidencia/h6/peldano-por-area.md`); no llega a `REGRESSION_VERIFIED`
  global porque dos hallazgos ajenos (HALL-M5, HALL-M6) quedan en rojo y no se ocultan.
- Corte: `origin/mockup @ b655e8449abd662d6b24156fd6e2b06aeb120cc1` → **rebaseado durante la sesión sobre
  `origin/mockup @ 8ae7283a2944074d5aecd4f1c634def57ca23083`** (PRs #574-#579 de Justin/Itzan/Ender/Marcelo-21/09 ya
  mergeados), a pedido explícito del usuario («traete los cambios»). Cero superposición de archivos entre lo mío y lo
  traído (verificado con `comm -12`, ver `PLAN.md`).

## Completado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1 (9/9) | Worktree, baseline, capturas previas, Q-13 resuelta por Pablo en sesión | `yarn lint/typecheck/test` | PASS, `evidencia/antes/` |
| H4 (9/9) | `confirmarCambios()`/`confirmarDescarte()`, apilamiento del `confirm` sobre `content-dialog` en 2 navegadores | `npx ng test --include=dialog.spec.ts` | 26/26, `evidencia/h4/` |
| H2 (14/14) | Organismo `body-map`, integrado en `symptom-check`, capturas por viewport/tema | `npx ng test --include=body-map.spec.ts` | 13/13, `evidencia/h2/` |
| H3 (16/16) | Panel de texto visible, dictado por voz con `microphone=(self)`, retiro de la grilla «Ir a lo tuyo» | `npx ng test --include=dictado.spec.ts` | 16/16, `evidencia/h3/` |
| H5.S1.M1-M4 (4/5) | Lint/typecheck/test completos y `mock-backend`/`mockup-barrido` tras el rebase | `yarn lint`, `yarn typecheck`, `yarn test`, barridos Playwright | Ver detalle abajo |
| H5.S2 (2/2) | D-05: 0 `iconOnly` en mis 5 grupos de archivos | `git grep -c iconOnly` | 0, `evidencia/h5/d05-conteo.txt` |
| H6.S1 (5/5) | Capturas consolidadas, navegadores probados, peldaño por área, teclado completo del dictado | `Tab` (25 pasos) + `Enter`/`Espacio` en «Dictar» | Verificado en vivo, `evidencia/h6/teclado-dictar.json` |

**Detalle de la regresión completa (H5.S1.M2)**: 577 archivos de spec en 12 lotes secuenciales (la máquina compartida no
soportó la suite entera de una vez — evidencia y clasificación `ENVIRONMENT` completas en `PLAN.md`/`evidencia/h5/`):
**7219 / 7221 tests en verde**. Los 2 rojos son `shell-layout.spec.ts` (HALL-M5), con causa raíz reproducida y demostrada:
el PR de Justin (`b3af9887`, ya mergeado en `origin/mockup` antes de mi rebase) agregó una ruta al menú sin actualizar la
lista exacta que el test afirma. No es mío, no lo causé, no lo corrijo (fuera de mi reserva).

Baseline pre-rebase, sin ninguna otra sesión compitiendo por la máquina: **573/573 archivos, 7150/7150 tests, verde
limpio** (`evidencia/h5/test-2-sin-servidor.txt`) — la evidencia de que mi código, antes de traer cambios ajenos, no
rompía nada.

| H2.S3 (4/4) | Silueta rehecha tras el rechazo de Pablo: cuerpo humano con curvas y proporciones reales | specs body-map + symptom-check | 26/26, commit `f10e3198`, `evidencia/h2/capturas-v2/doble-revision.md` (ACEPTABLE CON RESERVAS) |

## A medias

### H5.S1.M5 — Barrido de clics sobre el simulador (`mockup-click-sweep.spec.ts`)
- **Qué anda**: los roles **Paciente** y **Visitador** pasan limpio en las dos corridas (antes y después del rebase).
  Paciente es el rol que toca directamente mi carril (`/dashboard`, `symptom-check`, `patient-home`).
- **Qué no anda**: el rol **Médica** falla en las dos corridas con ~67-85 botones que no responden al clic en 4 s, en
  rutas completamente ajenas a mi carril (`/messaging`, `/groups`, `/glossary`, `/settings`, `/notification-center`,
  `/administration/pharmacy-*`, `/my-account/edit`, `/my-account/identity`, `/my-account/access-requests`) — 10 de esas
  rutas se repiten en ambas corridas, así que no es ruido de máquina: ya estaba así en `origin/mockup` antes de que mi
  rama lo tocara. El rol Admin falló una sola vez, post-rebase, con un síntoma distinto («Execution context was
  destroyed… navigation»), no reproducido una segunda vez.
- **Qué falta exactamente**: que el equipo (o Pablo como coordinador) triage HALL-M6 — no es mi módulo, y arreglar
  botones de mensajería, grupos, glosario, ajustes, farmacia y administración de accesos excede el alcance de esta noche.
- **Dónde quedó**: `evidencia/h5/mockup-click-sweep-tras-rebase.txt` (lista completa), `PLAN.md` → HALL-M6, publicado en
  `Daily-Noche-2026-09-22.md` §4-bis.

## Pendiente

Ninguna.

## Evidencia

Índice completo en `evidencia/{antes,h1,h2,h3,h4,h5,h6}/`. Comandos y salidas literales relevantes:

```text
$ yarn lint   (post-rebase)
243 problems (antes: 244; diff exacto: comm -23/-13 → 0 nuevos, 1 resuelto ajeno)

$ yarn typecheck   (post-rebase)
exit=0

$ git grep -c iconOnly -- src/app/features/symptom-check src/app/features/dashboard/patient-home \
    src/app/shared/components/organisms/body-map src/app/shared/components/organisms/content-dialog \
    src/app/shared/components/molecules/dialog
(sin salida → 0)

$ npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false
Test Files  1 passed (1)
     Tests  21 passed (21)

$ E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1
5 passed (37.4s)
```

## No cubierto

- Transcripción de una frase dictada a propósito («me duele la cabeza») que se reconozca como síntoma: la única
  transcripción real observada fue audio ambiente captado sin querer (excluido de la evidencia por regla 90.2); el
  mecanismo de agregar-al-texto-sin-pisar está probado contra el doble.
- Captura visual tomada exactamente en el commit final de cierre (se referencian las de H2/H3, sin código cambiado
  desde entonces en esos archivos).
- `alv-054-panel-accesses.spec.ts` no se corrió contra la maqueta (da de alta pacientes por API real, fuera del
  alcance de un simulador sin backend); su verificación de que la grilla no reaparece queda cubierta por
  `patient-home.spec.ts` 11/11 y por la captura mirada de la pantalla completa.
- Los roles Médica y Admin del barrido de clics (HALL-M6), fuera de mi alcance.
- Estados «sin resultado» y «sin red» del dictado en navegador real (sólo contra el doble en `dictado.spec.ts`).

## Desvíos del plan

1. **Rebase a mitad de sesión**: el usuario pidió explícitamente traer los cambios ya mergeados de Justin/Itzan/Ender
   (`origin/mockup` había avanzado de `b655e844` a `8ae7283a`). Se verificó cero superposición de archivos antes de
   rebasear, y se repitió toda la regresión (lint/typecheck/test/simulador/barridos) contra el nuevo tope.
2. **`vitest.config.ts` no se tocó**; se usó `--runner-config` apuntando a un archivo temporal en `artifacts/`
   (gitignorado) para acotar los workers del test runner ante el OOM de la máquina compartida — nunca se editó el
   archivo versionado.
3. **`Permissions-Policy` de `security-headers.ts`**: `microphone=()` → `microphone=(self)` (H3.S2.M9), decisión
   explícita de Pablo en sesión tras HALL-M4, con su spec actualizado como requisito nuevo (no debilitado). No estaba
   en el plan original; se agregó como microtarea con su CA y DoD, siguiendo la regla 20.6.6.
4. **`elegida` → `value`** en `body-map.ts` (coherencia con el molde `department-map.ts`), declarado desde el plan
   inicial.
5. **H6.S1.M2 en dos pasadas**: el primer cierre lo dejó `A MEDIAS` (faltaba ejercitar `Tab`+`Enter`/`Espacio` en vivo
   sobre «Dictar»). Con memoria libre de nuevo (2,2 GB tras liberar procesos ajenos), se levantó el servidor una vez
   más, se hizo la prueba (`evidencia/h6/teclado-dictar.json`) y se cerró sin cambiar código.

## Riesgos residuales y deuda

- HALL-M6 (Médica/Admin rotos en ~10 rutas ajenas) sigue sin dueño; si nadie lo triage, cualquier carril futuro que
  toque esas pantallas hereda el mismo rojo.
- HALL-M5 (`shell-layout.spec.ts`) bloquea a quien corra la suite completa hasta que Justin (o quien tenga ese
  archivo esta noche) actualice la lista de rutas.
- El botón «Dictar» no tiene una prueba de teclado en vivo (riesgo bajo: semántica nativa de `<button>`).
- La máquina de desarrollo estuvo crítica en memoria (0,9-2 GB libres) por al menos 3 sesiones concurrentes; cualquier
  verificación nueva en lo inmediato debería confirmar memoria libre antes de correr algo pesado.

## Decisiones y ambigüedades

Todas registradas en `PLAN.md` con su supuesto y a quién confirmárselo: Q-11 (silueta neutra, convive con pastillas,
tres preguntas para el doctor publicadas en el daily de equipo, sin responder todavía), Q-12 (tipeado + dictado),
Q-13 (**resuelta** por Pablo: la grilla «Ir a lo tuyo»), Q-M1/Q-M2/Q-M3 (privacidad del dictado, idioma, deselección),
y la decisión explícita de Pablo sobre `microphone=(self)` (H3.S2.M9).
