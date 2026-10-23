# Plan — plan y reparto por carriles de las correcciones fullstack (documento «CORRECCIONES»)

- Fecha: 2026-10-23 · Repos afectados: `AlovidaPromptManager` (plan, reparto, validador), `mantra-core-health` (suite Playwright de kill-tests) · Predecesor: `2026-09-25-plan-y-reparto-farmacia-ecommerce`, `planes/05-test-preproduccion-2026-09-26`
- Resultado observable: Pablo abre `planes/06-correcciones-fullstack-2026-10-23/README.md` y encuentra, para cada uno de los 28 puntos del documento del cliente, dónde vive hoy en el código (archivo:línea), qué falta, a qué carril y a qué persona le toca, con hitos → subtareas → microtareas con CA y DoD, y una suite Playwright que **hoy está en rojo** y define cuándo cada punto queda hecho. Leo, Richard, Pablo, Justin, Ender e Itzan abren su prompt en `repartos/2026-10-23/PromptDia/<Nombre>/` y pueden arrancar sin preguntar nada que el plan ya responda.
- Kill-test: `python tools/check_reparto.py repartos/2026-10-23` sale 1, o un desarrollador abre su prompt y no encuentra el archivo exacto que tiene que tocar para su primera microtarea, o la suite `playwright/correcciones-2026-10-23-kill-tests.spec.ts` no existe o no corre.

## Alcance

- IN: transcripción fiel del documento con IDs · verificación contra el código de los siete repos · plan maestro por carriles · un prompt por persona en el formato de la casa · alta de Leo y Richard en `check_reparto.py` con `--self-test` en verde · suite Playwright de kill-tests en el front (una prueba por punto del cliente, escrita para pasar cuando el punto esté hecho) · baseline medido de lo que se pueda medir en este entorno (typecheck, kill-tests contra el simulador y, si el stack arranca, contra la API real) · `REPORTE.md`.
- OUT: implementar cualquiera de los 28 puntos (eso es el trabajo de los carriles) · tocar código de producto fuera de la suite Playwright nueva · modificar `package.json` / `yarn.lock` versionados de la API (la sustitución de `xlsx` es local a este entorno y se revierte antes del commit) · Flutter (no hay SDK en el entorno; se planifica, no se verifica) · desplegar nada.
- Ambigüedades registradas: las 20 de `docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md` (Q-00…Q-19). Para este trabajo en particular: **Q-T1** ¿el plan debe vivir además como `docs/trabajo` en cada repo de producto? — supuesto: **no**; el plan vive en el estándar (como los planes 03, 04 y 05) y cada carril crea su propio `docs/trabajo/<fecha>-<slug>/PLAN.md` en el repo que toca, como exige la regla 20. Confirmar con Pablo.

## H1 — Fuente y hechos

**CA:** Dado el documento de Google y los siete repos, cuando alguien del equipo pregunta «qué pidió el cliente y dónde está eso en el código», entonces hay un archivo de fuente con ID por punto y uno de verificación con archivo:línea por punto, y ninguna afirmación de «no existe» sale de la memoria.
**DoD:** los dos archivos existen, el de requisitos tiene los 28 IDs (`grep -c '^## [A-Z][A-Z]-' …` = 28), el de verificación cubre los tres carriles, y el `README.md` del plan los enlaza.
**Estado:** HECHO

### H1.S1 — Transcripción y verificación

**CA:** Dado un ID del cliente, cuando se lo busca en los dos archivos, entonces aparece en los dos.
**DoD:** `grep` de cada prefijo en los dos archivos.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Transcribir el documento con IDs y ficha de procedencia | 28 IDs `PA-/MD-/LI-/FA-` y tabla de ambigüedades | `grep -c '^## \(PA\|MD\|LI\|FA\)-' docs/requisitos/CORRECCIONES-FULLSTACK-2026-10-23.md` → 28 | HECHO |
| H1.S1.M2 | Descubrimiento factual por área (8 agentes de solo lectura) | Cada área devolvió endpoints, entidades, rutas, specs y brechas con ruta | ocho informes recibidos y consolidados | HECHO |
| H1.S1.M3 | Redactar la verificación en castellano con archivo:línea por carril | Secciones §PA, §MD, §LI/FA presentes | `grep -c '^### §' docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-10-23.md` ≥ 14 | HECHO |
| H1.S1.M4 | Baseline de `typecheck` del front y de la API en este entorno | Código de salida pegado | `corepack yarn typecheck` en los dos repos → `evidencia/` | HECHO |

## H2 — Plan maestro por carriles y prompts por persona

**CA:** Dado el reparto pedido (Paciente: Leo y Richard · Doctor: Pablo y Justin · Farmacia/imagenología/laboratorio: Ender e Itzan), cuando cada persona abre su prompt, entonces encuentra ficha de asignación, archivos reservados, archivos de otros, kill-test, alcance IN/OUT, ambigüedades, hitos → subtareas → microtareas con CA y DoD, y el orden de dependencias con los otros carriles.
**DoD:** `python tools/check_reparto.py repartos/2026-10-23` → sin problemas; cada prompt cita `skills-router`, la instalación obligatoria y `plan_gate.py --self-test`.
**Estado:** HECHO

### H2.S1 — Plan maestro

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H2.S1.M1 | `planes/06-correcciones-fullstack-2026-10-23/README.md` con mapa punto → carril, contratos congelados entre carriles, olas y riesgos | Cada uno de los 28 IDs aparece en la tabla de reparto | `grep -c 'PA-\|MD-\|LI-\|FA-' README.md` ≥ 28 | HECHO |
| H2.S1.M2 | Dar de alta a Leo y Richard en `tools/check_reparto.py` | `PERSONAS` incluye a los siete | `python tools/check_reparto.py --self-test` → PASS | HECHO |

### H2.S2 — Prompts por persona

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Daily de equipo `repartos/2026-10-23/PromptDia/Daily-Dia-2026-10-23.md` | Tabla de carriles, orden de merges, contratos congelados | existe y lo enlaza el README | HECHO |
| H2.S2.M2 | Carril 1 — prompts de Leo y Richard (lotes disjuntos en archivos) | Archivos reservados sin intersección | `check_reparto.py` PASS + revisión manual de la intersección | HECHO |
| H2.S2.M3 | Carril 2 — prompts de Pablo y Justin | ídem | ídem | HECHO |
| H2.S2.M4 | Carril 3 — prompts de Ender e Itzan | ídem | ídem | HECHO |
| H2.S2.M5 | Daily por persona (seis) | Uno por persona, con su lote | `check_reparto.py` PASS | HECHO |

## H3 — Suite Playwright de kill-tests

**CA:** Dado el front levantado (simulador o API real), cuando se corre `playwright test playwright/correcciones-2026-10-23-kill-tests.spec.ts`, entonces hay una prueba por punto verificable del cliente, cada una falla hoy por el motivo exacto que describe la verificación, y pasará cuando el punto esté hecho sin cambiar la aserción.
**DoD:** la suite corre; la salida con los rojos esperados queda en `evidencia/`; ninguna prueba usa `skip` ni `waitForTimeout`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Escribir la suite con una prueba por punto, etiquetada por carril (`@carril-1`…) | ≥ 20 pruebas, cada una cita su ID | `grep -c "test(" …spec.ts` ≥ 20; `grep -c "test.skip\|waitForTimeout"` = 0 | HECHO |
| H3.S1.M2 | Correrla contra el simulador (`ng serve --configuration development,demo`) | Salida con pasa/falla por prueba | `playwright test … --reporter=list` → `evidencia/kill-tests-simulador.txt` | HECHO |
| H3.S1.M3 | Levantar Postgres y Redis nativos, cargar DDL y seeds, arrancar la API, correrla contra la API real | Salida con pasa/falla por prueba | `evidencia/kill-tests-api-real.txt` o `BLOCKED` con causa | HECHO |

## H4 — Cierre

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H4.S1.M1 | `REPORTE.md` con avance calculado, evidencia, no cubierto, desvíos | Tres secciones obligatorias presentes | `python .claude/hooks/report_gate.py --self-test` PASS; el archivo existe | HECHO |
| H4.S1.M2 | Revertir la sustitución local de `xlsx`; `git status` limpio salvo lo planificado; commit y push a `claude/intelligent-faraday-444u25` en los repos tocados | `git diff --stat` sólo muestra lo planificado | `git status --porcelain` | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Sin Docker: el stack completo (Mongo, OpenSearch, MinIO) no se levanta | Los kill-tests contra la API real pueden quedar `BLOCKED` | Postgres y Redis nativos; `FILE_STORAGE_ADAPTER=local`; si la API no arranca sin Mongo/OpenSearch, se declara `BLOCKED` con la salida y la suite queda medida contra el simulador |
| Las seis capturas del documento no llegaron | Cuatro puntos (PA-09.c/d, LI-03, FA-01/02) se interpretan por texto | Q-IMG; el prompt exige confirmar con captura antes de borrar un bloque |
| `check_reparto.py` no conoce a Leo ni a Richard | El reparto no valida | H2.S1.M2 |
| El proxy bloquea `cdn.sheetjs.com` | La API no instala tal cual | Sustitución local de `xlsx`, declarada, revertida antes del commit |
