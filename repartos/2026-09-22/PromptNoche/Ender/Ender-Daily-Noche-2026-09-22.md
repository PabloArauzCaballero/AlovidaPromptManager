# Ender — daily de la noche del 2026-09-22

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
180   ← 176 del estándar + 4 propias del repo (fable-refactor-orchestrator, frontend-production-gate,
        project-design-system, visual-quality-gate), fusionadas sin pisarlas

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

- [x] Leí `skills-router` y las skills de mi lote (síntesis, no las 27 una por una: priorizadas
      `synthetic-test-data-generation`, `frontend-performance`, `root-cause-debugging`,
      `frontend-navigation-ia`, `frontend-accessibility`, `e2e-playwright`).
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código (`docs/trabajo/2026-09-22-ender-simulador-cabecera/PLAN.md`).

## 2. Baseline

| Comando | Exit code | Rojos previos | Archivo de evidencia |
|---|---|---|---|
| `yarn lint` | 0 | ninguno | `evidencia/antes/lint.txt` |
| `yarn typecheck` | 0 | ninguno | `evidencia/antes/typecheck.txt` |
| `yarn test --watch=false` | 1 | 2 (`shell-layout.spec.ts`, ya en `origin/mockup` por el merge de Justin de cotizaciones — corregidos, ver §7) + errores de worker `EPIPE` (entorno, no producto) | `evidencia/antes/test.txt` |
| `yarn stock:generate` ×2 + `diff` | 0 / 0 | diff vacío: **sí** | `evidencia/antes/stock-{1,2}.txt`, `stock-diff.txt` |

## 3. Los dos números (H1.S2)

| Medida | Valor | Archivo |
|---|---|---|
| Latencia por prefijo (leída del interceptor) | `/terminology` 40ms fijos · resto 120-299ms al azar | `evidencia/antes/latencia.md` |
| Latencia observada en 10 `GET /scheduling/slots` (mín–máx) | 135,5–319,9 ms (9 de 10; la 1.ª incluye el costo único de carga del router) | idem |
| Profesionales en el directorio / con recurso / con cupos ±14 días | 791 / 14 / 14 | `evidencia/antes/agendas.txt` |
| Peticiones y total de «elegir médico» (de Justin, o propia) | **6 peticiones** medidas en vivo (médica, 2 sedes; contador temporal ya retirado). La Red del navegador no puede verlas: el interceptor nunca emite un request real | `evidencia/h2/elegir-medico-en-vivo.md` |

## 4. La tabla de latencia que publicás (H2.S1)

| Prefijo | ms | Motivo |
|---|---|---|
| `/terminology` | 40 | mínimo elegido (Q-E1) — ya se venía usando y es visible como estado de carga |
| `/scheduling/slots` | 40 | ruta caliente de «elegir médico»: hasta 2 llamadas por sede, no multiplicar la espera |
| `/profiles` | 90 | trae más forma (perfiles, catálogos) |
| subida de documentos | 600 | sin cambios — la barra de «subiendo» necesita verse |
| resto | 120 | ni tan rápido que no se note, ni tan lento como llegaba el azar viejo (hasta 299) |

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
| Renglón «Cotizaciones» (PATIENT, Mi cuenta) + ruta lazy | Justin | **Ya estaba hecho** — `b3af9887`, verificado contra código, no recreado | no aplica |
| Retirar «Mis puntos» del menú + redirect `/my-account/loyalty` → pestaña | Itzan | **A medias** — renglón retirado y redirect hechos; la pestaña real de Itzan no llegó | redirect a `/my-account`, declarado (regla 65) |
| Filtro por profesional en `GET /scheduling/slots` | Justin | No llegó | fuera de mi alcance (§3 «OUT» de la ficha: «la ficha del médico y sus peticiones son de Justin») |
| Medición del flujo de reserva | Justin (te la da) | No llegó — Justin también quedó bloqueado (timeout de login) | forma del fan-out verificada contra código; N en vivo pendiente para los dos |

## 7. Lo que publicaste

| Qué | Para quién | Ruta + hora |
|---|---|---|
| Tabla de latencia por prefijo | Justin | `Daily-Noche-2026-09-22.md` §4-bis, 2026-09-23 ~17:00 UTC |
| Escenarios de flujo completo en `core/mock/README.md` | los cinco | `src/app/core/mock/README.md`, rama `ender/simulador-cabecera-2026-09-22` |
| Estado de Cotizaciones/Mis puntos (N-02/N-03) | Justin, Itzan | `Daily-Noche-2026-09-22.md` §4-bis |
| Corrección de HALL-M5 (`shell-layout.spec.ts` en rojo) | Justin, Pablo | `Daily-Noche-2026-09-22.md` §4-bis |

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
