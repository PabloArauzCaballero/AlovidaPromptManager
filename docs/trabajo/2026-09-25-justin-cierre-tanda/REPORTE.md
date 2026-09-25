> **AVANCE: 5 / 5 — 100 %.**

# Reporte — Cierre de la tanda del 2026-09-25 (Justin), publicado por carril

- Fecha: 2026-09-25 · Plan: [PLAN.md](./PLAN.md) · Rama: `justin/cierre-tanda-2026-09-25`
- El trabajo real y toda su evidencia: **[PR #687](https://github.com/mdavila-2001/mantra-core-health/pull/687)**
  del front, `docs/trabajo/2026-09-25-justin-cierre-tanda/`.
- Este reporte publica el **estado por carril**, como pidió el propietario. El desglose por
  microtarea vive en el reporte del front y no se duplica acá.

## Qué se hizo

Los cinco carriles de esa noche estaban mergeados pero cerrados con **todo lo visual en `UNKNOWN` o
`WRITTEN`**: había cuatro agentes en paralelo y la regla 70 prohibía levantar un servidor. Con la
máquina libre, lo que faltaba no era código —el código está en `mockup`— era **mirar**.

**24 de las 29 microtareas que quedaban abiertas están cerradas.**

## Avance por carril

| Carril | Antes | Ahora | Qué queda |
|---|---|---|---|
| **A · Farmacia** — tienda, buscador y receta al carrito | 33 / 41 | **39 / 41** | 1 `EXTERNAL` (CI caído) · **1 defecto abierto**: el carrito |
| **B · Carga masiva** — la pantalla | 60 / 68 | **66 / 68** | 1 `BLOQUEADO` (API real) · 1 parcial (lector de pantalla) |
| **C4 · Reconsulta** | 10 / 12 | **11 / 12** | Espera la segunda pasada crítica |
| **C6 · Historia del paciente** | 6 / 9 | **8 / 9** | 1 `BLOQUEADO`: su spec exige API viva |
| **C8 · Integración** | 7 / 10 | **9 / 10** | Espera la segunda pasada crítica |
| **Total de la tanda** | 116 / 140 | **133 / 140 — 95,0 %** | |

## Cuatro defectos que sólo aparecen mirando

### Los dos que hay que repartir

| # | Qué pasa | De quién es |
|---|---|---|
| 1 | **«Agregar la receta al carrito» no agrega nada.** Botón habilitado, sin diálogo, sin aviso, sin insignia, y el carrito dice **«Tu carrito está vacío»**. Los 46 unitarios siguen verdes porque miran el *store*; el navegador mira la pantalla | **Pablo** — el carrito y la cabecera son de la Ola 0 |
| 2 | **Los sellos de reconsulta suben solos**: `2, 3, 4, 5` en cuatro cargas de «Mis citas» sin que nadie agende. La captura a 375 muestra **dos citas idénticas**. La reconsulta es una *cita real*: si se siembra por lectura, el paciente ve citas que nadie agendó | **Quien tenga `core/mock/`** — no es de estos carriles |

### Los dos ya corregidos en el PR #687

3. **Contraste bajo AA en la pantalla de carga masiva.** `axe` marcaba `color-contrast` *serious*:
   4,27:1. El valor es la **excepción E1** que el sistema acepta para `--text-muted` «sólo
   terciario»; esas notas son la instrucción del paso, así que pasan a `--text-secondary`. **No se
   tocó el token compartido** (96 archivos). `axe` pasó de 1 failed a 1 passed.
4. **El docblock del spec de C8** seguía diciendo «no se ejecutó» después de que lo corrieran 6/6.
   Contradecía al reporte de su propio carril.

## Lo que hay que decidir o repartir

| Qué | Quién |
|---|---|
| El carrito vacío (defecto 1) | **Pablo** |
| El sembrado de reconsultas (defecto 2) | **Quien tenga `core/mock/`** |
| **La segunda pasada crítica de las 26 capturas** — no puede ser propia (regla 35.1.6). Es lo único que separa a C4 y C8 de su última microtarea | **Cualquiera que no haya escrito el cierre** |
| El cableado de `consulta-casilla-reconsulta`: `FollowUpBlock` está escrito y **ninguna plantilla lo monta**. Bloquea 3 casos de C4 | **Quien tome C1**, que no se entregó |
| Ejercer la carga masiva contra la API real: el endpoint **ya existe** en `origin/itzan/carga-masiva-motor-2026-09-25`, sin mergear | **Itzan** |

## Lo que la corrida destapó del estado del repo

Esto no es de Justin, pero nadie lo había medido y afecta a todos:

- **La suite completa está en rojo: 53 fallos de 7 950.** Ninguno es de estos carriles, y está
  demostrado por bisección corriendo el mismo subconjunto en siete cortes: verde hasta `#669`,
  rompe en **#670** (`feature/sintomas-silueta-y-sexo`, 10 fallos) y suma en **#671** (Ola 0 de
  Pablo, 38 fallos). Uno más es el renombre «Evoluciones» → «Notas médicas» de C7, que no actualizó
  `access-tree.spec.ts`. Uno ya fallaba en el corte base y tres son contaminación entre archivos.
- **Los 6 `check-*.mjs` en rojo ya fallaban en el corte base** `bf2c3545`.
- **`lint` pasó de 6 a 19 errores** durante la noche, en archivos ajenos a estos carriles.
- **El desborde horizontal a 375 px** que se veía en cuatro pantallas de tres carriles **es del
  armazón**: `div.app-header__derecha` dentro de `header.app-header`. `/dashboard`, que ningún
  carril tocó, no desborda.

`build` y `typecheck` cierran en **exit 0**.

## Completado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Los cinco carriles con su avance nuevo en el daily | lectura del archivo | PASS |
| H1.S1.M2 | Los cuatro defectos publicados con dueño | ídem | PASS |
| H1.S1.M3 | Este reporte, con el avance primero | `head -1 REPORTE.md` | PASS |
| H1.S1.M4 | Entrada nueva arriba en `ActionLog.md` | `grep -n "^## " ActionLog.md \| head -1` | PASS |
| H1.S1.M5 | PR contra `main` | `gh pr view --json mergeable,isDraft` | ver «Entrega» |

## A medias

**Ninguna.**

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| — | — | Ninguna microtarea de **este** trabajo queda pendiente. Lo que sigue abierto es de los carriles, y está en la tabla «Lo que hay que decidir o repartir», cada cosa con su dueño |

## No cubierto

- **Este trabajo no verifica nada del front.** Publica el estado que el PR #687 demuestra. Si ese
  reporte estuviera mal, éste lo reproduce mal.
- **La segunda pasada crítica no se hizo** y no puede hacerla quien escribió el cierre.

## Desvíos del plan

En el repo del front, el `PLAN.md` del cierre **se escribió después de empezar**, lo que incumple
la regla 20. Está declarado en ese reporte en vez de fechar el archivo hacia atrás. Se repite acá
porque una limitación de un reporte anidado tiene que subir a la raíz (regla 40 §7).

## Riesgos residuales

| Riesgo | Impacto | Estado |
|---|---|---|
| El carrito vacío llega a una demo | Alto — es el camino de compra desde la receta | Declarado, con dueño |
| Las citas duplicadas se leen como dato real | Medio — el paciente ve citas que nadie agendó | Declarado, fijado en una prueba |
| La suite en rojo normaliza el rojo | Medio — con 53 fallos ajenos, nadie mira los propios | Clasificado por corte y por PR culpable |

## Decisiones y ambigüedades

| Supuesto tomado | A quién confirmar |
|---|---|
| La Regla 8 de «Mi historia» se mide sobre la rejilla, no sobre la tarjeta: la columna de al lado **no está vacía**, tiene el aside de descarga | Pablo |
| `.carga__nota` es instrucción del paso, no texto terciario, y por eso sale de la excepción E1 | El diseñador |
| No se escribió `pw-guard.mjs` ni se montó la casilla de C1: son carriles de otros | El propietario |

## Entrega

- Front: **[PR #687](https://github.com/mdavila-2001/mantra-core-health/pull/687)** contra `mockup`,
  `mergeable: MERGEABLE`, no draft, 48 archivos.
- Este repo: PR contra `main`, con su salida de `gh` en el propio PR.
