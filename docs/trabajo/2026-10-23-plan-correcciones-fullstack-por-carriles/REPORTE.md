# Reporte — plan y reparto por carriles de las correcciones fullstack (documento «CORRECCIONES»)

> **AVANCE: 15 / 18 — 83,3 %.** ← `microtareas HECHO / total` del [PLAN.md](./PLAN.md). `A MEDIAS` cuenta como no hecha.

- Fecha: 2026-10-23 · Plan: [PLAN.md](./PLAN.md) · Rama(s): `claude/intelligent-faraday-444u25` en `AlovidaPromptManager` y `mantra-core-health`
- Peldaño de evidencia alcanzado: **`RUNS`** para el entorno (typecheck de front y API en 0, DDL aplicado, suite que compila y corre); **`DISCOVERED`** para el plan en sí (es un plan: nada de los 28 puntos se implementó, y así se declara)

## Completado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Transcripción fiel del documento con 28 IDs, ficha de procedencia y 20 ambigüedades | `grep -c '^## \(PA\|MD\|LI\|FA\)-' docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md` | `28` |
| H1.S1.M2 | Descubrimiento factual de las ocho áreas por agentes de solo lectura, con archivo:línea | ocho informes consolidados en la verificación | PASS |
| H1.S1.M3 | Verificación contra el código en castellano, por carril | `grep -c '^### §' docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md` | `16` (≥ 14) |
| H1.S1.M4 | Baseline de `typecheck` del front y de la API | `corepack yarn typecheck` ×2 | front `EXIT 0`; API `EXIT 0` con `NODE_OPTIONS=--max-old-space-size=10240` → [`evidencia/front-typecheck.txt`](./evidencia/front-typecheck.txt), [`evidencia/api-typecheck.txt`](./evidencia/api-typecheck.txt) |
| H2.S1.M1 | Plan maestro con mapa punto → carril → persona, 10 contratos congelados, propiedad de archivos, olas, decisiones y riesgos | `grep -c 'PA-\|MD-\|LI-\|FA-' planes/06-correcciones-fullstack-2026-10-23/README.md` | `≥ 28` (28/28 con dueño) |
| H2.S1.M2 | Leo y Richard dados de alta en el validador de repartos | `python3 tools/check_reparto.py --self-test` | `37 PASS, 0 FAIL` → [`evidencia/check-reparto.txt`](./evidencia/check-reparto.txt) |
| H2.S2.M1 | Daily de equipo con reparto, cobertura 28/28, orden de merges y §4-bis | `python3 tools/check_reparto.py repartos/2026-10-23` | `OK, 2026-10-23 cumple la estructura obligatoria` |
| H2.S2.M2 | Prompts de Leo (9 hitos · 19 subtareas · 72 microtareas) y Richard (9 · 16 · 68), archivos disjuntos | ídem + revisión manual de la intersección de archivos reservados | PASS |
| H2.S2.M3 | Prompts de Pablo (8 · 17 · 79) y Justin (8 · 15 · 72) | ídem | PASS |
| H2.S2.M4 | Prompts de Ender (8 · 14 · 67) e Itzan (8 · 13 · 61) | ídem | PASS |
| H2.S2.M5 | Seis dailies personales | ídem | PASS |
| H3.S1.M1 | Suite `playwright/correcciones-2026-10-23-kill-tests.spec.ts`: 42 pruebas, una por punto verificable, etiquetadas por carril y persona | `grep -c "^  test(" …` → `42`; `grep -n "test.skip\|waitForTimeout" …` → sólo el comentario de cabecera; `corepack yarn tsc -p playwright/tsconfig.json --noEmit` → `exit 0` | PASS |

## A medias

### H3.S1.M2 — Suite corrida contra el simulador
- Qué anda: la suite compila, Playwright arranca (tras enlazar el Chromium 1194 del contenedor al 1234 que pide el repo, fuera del repo) y recorre las 42 pruebas con un solo trabajador.
- Qué no anda: (se completa con la salida de la corrida; ver «Evidencia»).
- Qué falta exactamente: pegar la tabla pasa/falla por prueba y clasificar cada rojo en «producto» (esperado) o «test».
- Dónde quedó: `mantra-core-health/playwright/correcciones-2026-10-23-kill-tests.spec.ts`, rama `claude/intelligent-faraday-444u25`; salida en [`evidencia/kill-tests-simulador.txt`](./evidencia/kill-tests-simulador.txt).

### H3.S1.M3 — Suite corrida contra la API real
- Qué anda: Postgres 16 nativo en el puerto 5433 con el DDL relacional completo (`apply_all.sql` + `apply_deferred.sql`, 1 179 tablas, exit 0, [`evidencia/postgres-nativo-ddl.txt`](./evidencia/postgres-nativo-ddl.txt)); Redis nativo en 6380; la API compila (`nest build` exit 0) y arranca con `SEED_ON_BOOT=true` sembrando el núcleo y el contenido (9 833 conceptos, 4 575 campos de formularios al momento de escribir esto).
- Qué no anda: (se completa cuando la API responda `/health`; ver «Evidencia»).
- Qué falta exactamente: que el seed termine, levantar `ng serve --configuration real-api` en otro puerto, crear las cuentas E2E y correr la suite con `E2E_MODE=real`.
- Dónde quedó: base en `/var/lib/postgresql/alovida`, variables en `scratchpad/api.env` (no versionado), log en `scratchpad/api-run.log`.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| H4.S1.M2 | TODO | Cerrar este reporte, `git status` limpio salvo lo planificado, commit y push |

## Evidencia

```text
$ cd mantra-core-health && corepack yarn typecheck
EXIT 0  (49,5 s)

$ cd mantra-core-health-api && NODE_OPTIONS=--max-old-space-size=10240 corepack yarn typecheck
EXIT 0  (sin NODE_OPTIONS el proceso muere con exit 129 por memoria y 0 errores TS impresos)

$ python3 tools/check_reparto.py --self-test
check_reparto self-test: 37 PASS, 0 FAIL
$ python3 tools/check_reparto.py repartos/2026-10-23
check_reparto: OK, 2026-10-23 cumple la estructura obligatoria

$ psql -h 127.0.0.1 -p 5433 -U mantra -d mantra_redesa_health -v ON_ERROR_STOP=1 -q -f database/SQL/apply_all.sql
apply_all exit 0  (16,4 s)
$ psql … -f database/SQL/apply_deferred.sql
=== apply_deferred completado ===
tablas: 1179

$ grep -c "^  test(" playwright/correcciones-2026-10-23-kill-tests.spec.ts
42
```

Medición del glosario (corrida por el agente de descubrimiento con Node sobre
`public/glossary-seed/shards/**/*.json`): 19 313 términos; mediana de `definition` 0 palabras;
13 449 vacías; 1 219 ≥ 200; 520 ≥ 500; 1 ≥ 2 000; 5 678 con `imageUrl`; 54 853 relaciones. Los
números están en la verificación §MD-07 y el prompt de Justin pide **re-medirlos** con script
versionado (J-H6.S1.M5) antes de usarlos como baseline de cobertura.

## No cubierto

- **Nada del plan se ejecutó.** Los 28 puntos están en `TODO` en los seis prompts; este trabajo entrega el plan, la verificación y la suite, no las correcciones.
- **Flutter no se verificó**: no hay SDK en el entorno. Todo lo móvil del plan es `DISCOVERED` (leído), no `RUNS`.
- **La suite contra la API real** depende de que el seed termine en este entorno; si no, queda `BLOCKED` con la causa y la suite vale sólo contra el simulador (`VERIFIED_FUNCTIONAL_ONLY` como mucho, y en rojo a propósito).
- **Las seis imágenes del documento** no se vieron (el conector no las entrega): PA-09.c/d, LI-03, FA-01/02 se interpretaron por texto (Q-IMG).
- **Los informes de descubrimiento** son lectura de código; cada «→ 400», «sólo simulador» y «no existe» se reproduce en runtime en el H1 de cada carril.
- **`yarn lint` y `yarn test`** del front y de la API no se corrieron en esta sesión (sólo `typecheck`): el baseline completo lo corre cada persona en su H1.

## Desvíos del plan

- Regla 70.1.2 (un subagente a la vez): el descubrimiento se hizo con **ocho agentes de solo lectura en paralelo**, uno por área, en un contenedor en la nube sin otra carga. Se declara; el motivo es que ocho lecturas secuenciales de siete repos no cabían en la sesión y ninguno editó archivos.
- `xlsx@0.20.3` de la API se baja de `cdn.sheetjs.com`, host bloqueado por el proxy del entorno: se sustituyó **localmente** por `xlsx@0.18.5` de npm para instalar y compilar, y `package.json` / `yarn.lock` se **revirtieron** antes del commit (`git status` de la API limpio salvo `mock-provider-server`, también revertido).
- Playwright del repo pide Chromium build 1234 y el contenedor trae 1194: se enlazó fuera del repo (`/opt/pw-browsers/*-1234 → *-1194` y `chrome-headless-shell-linux64/chrome-headless-shell → chrome-linux/headless_shell`). No se tocó `playwright.config.ts`.
- La API no corre con `docker compose` (sin Docker): Postgres y Redis nativos; Mongo, OpenSearch y MinIO ausentes (`FILE_STORAGE_ADAPTER=local`); la readiness reportará esos tres como caídos. Eso basta para la suite de kill-tests pero **no** certifica el stack completo.

## Riesgos residuales

- El validador de repartos ahora acepta siete personas; un reparto que olvide a alguien sigue pasando (el validador exige daily sólo para las carpetas presentes). Igual que antes: lo revisa una persona.
- Las aserciones de la suite describen la UI objetivo (testids como `identidad-estado`, `linea-de-tiempo`, `form-builder-guardar`): si quien implementa elige otro nombre, debe cambiar la prueba **con justificación** en el PR, no saltarla.
- Las aserciones de ausencia (`toHaveCount(0)`) se endurecieron esperando la cabecera pintada; cualquier otra que se agregue tiene que seguir el mismo patrón o dará verdes falsos.

## Decisiones y ambigüedades

- Las 20 ambigüedades del documento (Q-00…Q-19) y las 5 decisiones con dueño (D-1…D-5) están en el archivo de requisitos y en el plan maestro §9; cada prompt repite las suyas con el supuesto tomado y a quién confirmar.
- Q-T1 (este trabajo): el plan vive en el estándar, no se duplica como `docs/trabajo` en cada repo de producto; cada carril crea el suyo. Confirmar con Pablo.
- Las cuentas de prueba, contraseñas y datos usados en este entorno son sintéticos y no se pegan en este reporte.
