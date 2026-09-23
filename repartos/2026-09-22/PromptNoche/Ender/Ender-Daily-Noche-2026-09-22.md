# Ender — daily de la noche del 2026-09-22

<<<<<<< HEAD
> **AVANCE: 41 / 48 — 85,4 %.** Sale de `microtareas HECHO / total`. `A MEDIAS` cuenta como no hecha:
> el detalle completo (qué anda / qué no anda / qué falta) está en `REPORTE.md` del trabajo.

- Carril: [`Noche-SimuladorYCabecera.MockNavegacion`](Noche-SimuladorYCabecera.MockNavegacion/LatenciaAgendasParaTodosYChatsYTutorialesEnLaCabecera.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `05d83cb8a29463033066ccfbdfc5b4b3f113535d` (reconsultado:
  el declarado en la ficha había quedado viejo, `origin/mockup` ya traía el trabajo de Justin sobre
  cotizaciones del paciente y de Itzan sobre registros)
- Rama: `ender/simulador-cabecera-2026-09-22` · Peldaño alcanzado (regla 30): `TESTED` en todo lo que
  toca código de producto (typecheck + lint + specs dirigidos + regresión del árbol completo en verde);
  `DISCOVERED` en las mediciones que exigían navegador y no se pudieron cerrar (ver REPORTE.md)
- Plan y reporte completos: `docs/trabajo/2026-09-22-ender-simulador-cabecera/` (en este mismo repo de
  producto — el carril es la estructura del plan, este `PLAN.md` la referencia sin duplicarla)
=======
> **AVANCE: 14 / 48 — 29,2 %.** H1 9/9 · H2.S1 5/5 · el resto `TODO` (H3 y H4 sin autorizar todavía). Publicado 2026-09-23.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-SimuladorYCabecera.MockNavegacion`](Noche-SimuladorYCabecera.MockNavegacion/LatenciaAgendasParaTodosYChatsYTutorialesEnLaCabecera.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `8ae7283a2944074d5aecd4f1c634def57ca23083` (tras `git fetch`, 2026-09-23; `mockup` siguió a `05d83cb8` con #580 de Justin, que no toca este carril: no se integró)
- Rama: `ender/simulador-latencia-agendas-cabecera-2026-09-22` (worktree local, **sin commit ni PR**: Git de producto no autorizado) · Peldaño alcanzado (regla 30): `TESTED` en H2.S1 (spec verde, suite sin rojos nuevos) · `RUNS` en H1
>>>>>>> origin/main
- Daily de equipo: [`Daily-Noche-2026-09-22.md`](../Daily-Noche-2026-09-22.md)

## 0. Dos cosas que sólo vos podés romper, y dos números que sólo vos podés dar

- `yarn start` corre `stock:generate` antes de compilar: **si tu rama rompe el arranque, cuatro personas no
  trabajan.** Cada cierre repite `yarn start`.
- `app.routes.ts` es **tuyo y de nadie más** esta noche: Justin e Itzan te piden; vos escribís.
- Los números: **latencia por ruta** (medida y observada) y **profesionales con agenda / total**. Sin ellos
  R-02 y R-03 no tienen «antes».

**Tu carril del 21/09** (`Refactor-CatalogoEInventario`) queda `A MEDIAS` declarado en su propio reporte.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<<<<<<< HEAD
180   ← 176 del estándar + 4 propias del repo (fable-refactor-orchestrator, frontend-production-gate,
        project-design-system, visual-quality-gate), fusionadas sin pisarlas
=======
180        # 176 del estándar + 4 propias del producto (versionadas; no se pisaron)
>>>>>>> origin/main

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

<<<<<<< HEAD
- [x] Leí `skills-router` y las skills de mi lote (síntesis, no las 27 una por una: priorizadas
      `synthetic-test-data-generation`, `frontend-performance`, `root-cause-debugging`,
      `frontend-navigation-ia`, `frontend-accessibility`, `e2e-playwright`).
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código (`docs/trabajo/2026-09-22-ender-simulador-cabecera/PLAN.md`).
=======
- [ ] Leí `skills-router` y las 27 skills de mi lote, empezando por `synthetic-test-data-generation`.
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código (`docs/trabajo/2026-09-22-simulador-latencia-agendas-cabecera/PLAN.md`, local y excluido del Git de producto).

> Instalación: `settings.json` del producto está versionado y no se tocó; los hooks del estándar van en `.claude/settings.local.json`. `AGENTS.md` y `.agents/` no se copiaron porque quedarían sin ignorar.
>>>>>>> origin/main

## 2. Baseline

| Comando | Exit code | Rojos previos | Archivo de evidencia |
|---|---|---|---|
<<<<<<< HEAD
| `yarn lint` | 0 | ninguno | `evidencia/antes/lint.txt` |
| `yarn typecheck` | 0 | ninguno | `evidencia/antes/typecheck.txt` |
| `yarn test --watch=false` | 1 | 2 (`shell-layout.spec.ts`, ya en `origin/mockup` por el merge de Justin de cotizaciones — corregidos, ver §7) + errores de worker `EPIPE` (entorno, no producto) | `evidencia/antes/test.txt` |
| `yarn stock:generate` ×2 + `diff` | 0 / 0 | diff vacío: **sí** | `evidencia/antes/stock-{1,2}.txt`, `stock-diff.txt` |
=======
| `yarn lint` | 1 | 243 × `prefer-on-push-component-change-detection` en 194 archivos (deuda previa; en el carril sólo 3 specs) | `evidencia/antes/lint.txt` |
| `yarn typecheck` | 2 → 0 | 1.ª corrida: falta `env.generated.ts` en un checkout nuevo (`ENVIRONMENT`); 2.ª corrida verde | `evidencia/antes/typecheck.txt`, `typecheck-2.txt` |
| `yarn test --watch=false` | 1 | 3 de 7173: `shell-layout.spec.ts:147` (`TEST_BUG`: la lista cerrada no tiene `/my-account/cotizaciones`, de `b3af9887`) · `shell-layout.spec.ts:449` (`PRODUCT_BUG` candidato: `navigation.subgroups.ts:326` parte el bloque clínico) · `fichas-estandar.spec.ts` (`ENVIRONMENT`: ruta de la API) | `evidencia/antes/test.txt` |
| `yarn stock:generate` ×2 + `diff` | 0 · 0 | diff vacío: **sí** (sha256 `f7380c47…` las dos veces) | `evidencia/antes/stock-generate.txt` |
>>>>>>> origin/main

## 3. Los dos números (H1.S2)

| Medida | Valor | Archivo |
|---|---|---|
<<<<<<< HEAD
| Latencia por prefijo (leída del interceptor) | `/terminology` 40ms fijos · resto 120-299ms al azar | `evidencia/antes/latencia.md` |
| Latencia observada en 10 `GET /scheduling/slots` (mín–máx) | 135,5–319,9 ms (9 de 10; la 1.ª incluye el costo único de carga del router) | idem |
| Profesionales en el directorio / con recurso / con cupos ±14 días | 791 / 14 / 14 | `evidencia/antes/agendas.txt` |
| Peticiones y total de «elegir médico» (de Justin, o propia) | **6 peticiones** medidas en vivo (médica, 2 sedes; contador temporal ya retirado). La Red del navegador no puede verlas: el interceptor nunca emite un request real | `evidencia/h2/elegir-medico-en-vivo.md` |
=======
| Latencia por prefijo (leída del interceptor) | `/terminology*` 40 fijo · subida de documentos 600 fijo · resto `120 + floor(Math.random()·180)` = 120–299 (`mock-backend.interceptor.ts:250-259`) | `evidencia/antes/latencia.md` |
| Latencia observada en 10 `GET /scheduling/slots` (mín–máx) | **139–323 ms**, media 228, desvío 68 · `/scheduling/resources` 172–299 · `/profiles` 142–263 · `/public/search` 140–296 · `/terminology` 46–47 → **NO determinista** | idem |
| Profesionales en el directorio / con recurso / con cupos ±14 días | **791 / 14 / 14** (15 escritos, 763 de la red de aseguradoras, 13 registrados) · **los 13 registrados: 13 / 0 / 0** | `evidencia/antes/agendas.txt` |
| Peticiones y total de «elegir médico» (de Justin, o propia) | **Propia** (la de Justin no llegó con dato): **4–5 peticiones**, 2 saltos en serie por rama, **311–557 ms** | `evidencia/antes/red-flujo-reserva.md` |

> **Cómo se midió, y por qué no con la Red.** En modo mock el interceptor responde **antes** de `next()`
> (`mock-backend.interceptor.ts:48-57`): las llamadas no salen a la red, así que DevTools Network y
> `page.waitForResponse` no las ven. Por eso la medición de Justin quedó sin dato. Se midió dentro de la app con un
> arnés reproducible (`HttpClient` + interceptor real + clientes reales, reloj real; spec `h1-medicion.local.spec.ts`,
> comando y datos crudos en `evidencia/antes/`). No es observación de navegador: no incluye render ni navegación.
> Las rutas `evidencia/…` son locales, bajo `docs/trabajo/2026-09-22-simulador-latencia-agendas-cabecera/` del
> worktree de Ender; los números que importan están copiados acá.
>>>>>>> origin/main

## 4. La tabla de latencia que publicás (H2.S1)

| Prefijo | ms | Motivo |
|---|---|---|
<<<<<<< HEAD
| `/terminology` | 40 | mínimo elegido (Q-E1) — ya se venía usando y es visible como estado de carga |
| `/scheduling/slots` | 40 | ruta caliente de «elegir médico»: hasta 2 llamadas por sede, no multiplicar la espera |
| `/profiles` | 90 | trae más forma (perfiles, catálogos) |
| subida de documentos | 600 | sin cambios — la barra de «subiendo» necesita verse |
| resto | 120 | ni tan rápido que no se note, ni tan lento como llegaba el azar viejo (hasta 299) |
=======
| `/terminology` | 40 | rótulos de catálogo: casi toda pantalla los pide después de su dato principal; es el **mínimo** de la tabla (2,5 cuadros a 60 Hz: el estado de carga llega a pintarse) |
| `/scheduling/slots` | 80 | segundo salto de la disponibilidad (recursos → cupos): se paga en serie |
| `/profiles` | 100 | primer salto de la ficha (perfil → rótulos ∥ foto): se paga en serie |
| subida de documentos | 600 | la barra de subida tiene que verse avanzar (el simulador no emite progreso) |
| resto | 120 | valor por omisión |

Regla: gana la primera fila que coincide con la ruta exacta o con la ruta más un segmento debajo (`/profilesx`
no coincide). **Sin azar**, también bajo E2E: la misma ruta espera siempre lo mismo. Código: `LATENCIA_SIMULADA` y
`latenciaDe` en `mock-backend.interceptor.ts`; `git grep -c 'Math.random'` sobre ese archivo → sin coincidencias.
Spec de tres niveles (tabla / desconocida / subida) + reloj simulado: `mock-backend.spec.ts` 27/27 en dos corridas.

| Medido con el mismo arnés | Antes | Después |
|---|---|---|
| `GET /scheduling/slots` ×10 | 139–323 ms (desvío 68) | 89–103 ms (desvío 4) |
| «elegir médico», 3 corridas × 2 casos | 311–557 ms | 231–247 ms |

Regresión: lint con los mismos 243 errores · typecheck 0 · test 7176/7179, **los mismos 3 rojos** del baseline.
**Todavía no está en ningún ref compartido** (sin commit en producto): Justin puede leer la tabla acá, pero no
medir contra ella hasta que Ender autorice el commit.
>>>>>>> origin/main

## 5. Checkpoints del turno

```text
AVANCE — simulador y cabecera — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 6. Lo que te pidieron y su estado

| Qué | Quién | Estado | Si no llegó el pedido: contrato simulado (regla 65) |
|---|---|---|---|
<<<<<<< HEAD
| Renglón «Cotizaciones» (PATIENT, Mi cuenta) + ruta lazy | Justin | **Ya estaba hecho** — `b3af9887`, verificado contra código, no recreado | no aplica |
| Retirar «Mis puntos» del menú + redirect `/my-account/loyalty` → pestaña | Itzan | **A medias** — renglón retirado y redirect hechos; la pestaña real de Itzan no llegó | redirect a `/my-account`, declarado (regla 65) |
| Filtro por profesional en `GET /scheduling/slots` | Justin | No llegó | fuera de mi alcance (§3 «OUT» de la ficha: «la ficha del médico y sus peticiones son de Justin») |
| Medición del flujo de reserva | Justin (te la da) | No llegó — Justin también quedó bloqueado (timeout de login) | forma del fan-out verificada contra código; N en vivo pendiente para los dos |
=======
| Renglón «Cotizaciones» (PATIENT, Mi cuenta) + ruta lazy | Justin | **Ya en `mockup`, lo escribió Justin** (`b3af9887`, #577): H4.S2.M1 se acredita con esa evidencia al llegar a H4 | renglón hacia ruta declarada con componente vacío |
| Retirar «Mis puntos» del menú + redirect `/my-account/loyalty` → pestaña | Itzan | | redirect a `/my-account`, declarado |
| Filtro por profesional en `GET /scheduling/slots` | Justin | | se decide y se escribe |
| Medición del flujo de reserva | Justin (te la da) | No llegó con dato → **medición propia** (§3) | la medís vos y lo declarás |
>>>>>>> origin/main

## 7. Lo que publicaste

| Qué | Para quién | Ruta + hora |
|---|---|---|
<<<<<<< HEAD
| Tabla de latencia por prefijo | Justin | `Daily-Noche-2026-09-22.md` §4-bis, 2026-09-23 ~17:00 UTC |
| Escenarios de flujo completo en `core/mock/README.md` | los cinco | `src/app/core/mock/README.md`, rama `ender/simulador-cabecera-2026-09-22` |
| Estado de Cotizaciones/Mis puntos (N-02/N-03) | Justin, Itzan | `Daily-Noche-2026-09-22.md` §4-bis |
| Corrección de HALL-M5 (`shell-layout.spec.ts` en rojo) | Justin, Pablo | `Daily-Noche-2026-09-22.md` §4-bis |
=======
| Tabla de latencia por prefijo | Justin | §4 de este daily · PR de PromptManager `ender/publicar-avance-simulador-2026-09-23` · 2026-09-23 |
| Números del «antes» (latencia, agendas, «elegir médico») | Justin | §3 de este daily · mismo PR · 2026-09-23 |
| Escenarios de flujo completo en `core/mock/README.md` | los cinco | |
>>>>>>> origin/main

## 8. Al cerrar

- [x] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (`docs/trabajo/2026-09-22-ender-simulador-cabecera/REPORTE.md`).
- [x] Baseline repetido y comparado: los 2 rojos previos, corregidos con motivo; **con reserva**: `core/` 1541/1541, `shared/` 1439/1439, raíz 48/48; `features/` 4098-4099 de 4101 por corrida, 2-3 timeouts de 5 s en specs ajenos que pasan en aislamiento (ambiente, ver REPORTE H6.S1.M2).
- [x] **`ng serve` arranca limpio** (57,6 s) y `stock:generate` regenera idéntico (×2, diff vacío).
- [x] `Math.random` fuera del interceptor; la latencia es una tabla con motivo.
- [x] `navigation.service.spec.ts` **y** `shell-layout.spec.ts` en verde con la lista nueva y su motivo,
      sin aserciones borradas (85/85).
- [x] Los enlaces nuevos de la cabecera: `aria-label` **y** globo (`appTooltip`), excepción del menú/
      hamburguesa escrita.
- [x] Todo dato sembrado (los 12 registrados con agenda) sintético, determinista (`uuid(semilla)`) y
      declarado — no se sembró ningún nombre nuevo.
- [x] Capturas tomadas, **miradas** y con doble revisión (`evidencia/doble-revision.md`); 12 reales, no la matriz completa — declarado en A MEDIAS del `REPORTE.md`.
- [x] Procesos corriendo: **ninguno**. `ng serve :4203` detenido explícitamente y puerto confirmado
      libre con `netstat`; navegador Playwright cerrado.

## 9. Nota para quien cierre el turno (commit)

No hice ningún `git commit` ni `git push` esta noche: 19 archivos modificados + 4 specs nuevos quedaron
en el árbol de trabajo de la rama `ender/simulador-cabecera-2026-09-22`, sin confirmar. El checkout
tiene un `.git/info/exclude` local (no compartido, no es `.gitignore`) que excluye `.claude/`,
`AGENTS.md`, `.agents/`, `evidencia/`, `PLAN.md` y `REPORTE.md` — probablemente de una sesión anterior.
Justin e Itzan **sí** commitearon sus `PLAN.md`/`REPORTE.md`/`evidencia/` a este mismo repo esta noche
(ver sus commits `docs: …`), así que ese exclude local no refleja la convención real del equipo. Quien
cierre: revisar `git status`, decidir si commitea (con `git add -f` para lo que el exclude local tapa, o
ajustando `.git/info/exclude`), y si corresponde, abrir el PR.
