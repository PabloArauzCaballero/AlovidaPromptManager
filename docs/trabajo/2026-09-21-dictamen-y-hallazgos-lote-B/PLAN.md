# Plan — Exportar el dictamen del lote B y corregir lo que la verificación afirmó de más

- **Fecha:** 2026-09-21 · **Repo:** `AlovidaPromptManager`, rama `marcelo/errata-c14-y-dictamen-lote-b`
- **Predecesor:** la ejecución del lote `Noche-CorreccionesDoctor.ExpedienteYAceptacion` (línea B),
  entregada en `mantra-core-health` como **PR #558**.
- **Resultado observable:** quien lea `VERIFICACION-CONTRA-CODIGO-2026-09-20.md` mañana **no**
  concluye que la grilla de C-14 no tiene dónde guardarse, y coordinación encuentra el dictamen de
  las 24 donde mira, no enterrado en la carpeta de evidencia de un PR de producto.
- **Kill-test:** buscar `HALL-D6` en el documento de verificación. Si sigue diciendo «no tiene dónde
  guardarse» sin corrección, esto no está hecho. Y buscar el dictamen desde `docs/trabajo/`: si hay
  que entrar al repo del frontend para leerlo, tampoco.

## Por qué existe este trabajo

El análisis del lote B quedó **entero en el repo de producto** (`mantra-core-health/docs/trabajo/
2026-09-20-notas-cuadricula-e-internacion/`), que es donde la regla 20 lo pide. Pero tres piezas de
ese análisis **no son de producto, son de coordinación**, y ahí no las lee nadie:

1. Una afirmación de la verificación del 2026-09-20 **quedó desmentida al ejecutarla**.
2. El **dictamen de las 24** habla del trabajo de los cinco, no del mío.
3. Dos **hallazgos transversales** que no tienen dueño en mi lote.

## Alcance

- **IN:** la errata en `docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md` (§C-14, filas
  `HALL-D6` y `HALL-D7`) · una entrada propia en `docs/trabajo/` con el dictamen, la matriz, las
  fuentes normativas y los defectos · los dos transversales.
- **OUT:** reescribir el resto de la verificación · tocar `CORRECCIONES-DOCTOR-2026-09-20.md`, que es
  la transcripción literal del cliente y **no se corrige** · cambiar el reparto o las asignaciones ·
  tocar `.claude/` del pack · dictaminar correcciones ajenas que nadie ejecutó todavía.

## H1 — Que la verificación deje de afirmar de más

**CA:** Dado el documento de verificación, cuando alguien lee lo que dice de C-14, entonces
encuentra la corrección fechada junto a la afirmación original, **con lo que sí era cierto
intacto**.
**DoD:** las 3 microtareas en `HECHO`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Errata en §C-14, sin borrar la medición correcta | El bloque de los 5 tipos sigue en pie y la conclusión está corregida | `grep -c "Errata del 2026-09-21" docs/verificacion/…` → 1 | HECHO |
| H1.S1.M2 | `HALL-D6` marcado como corregido, con qué parte se cae | La fila dice qué era cierto y qué no | `grep "HALL-D6" docs/verificacion/…` | HECHO |
| H1.S1.M3 | `HALL-D7` confirmado y **dimensionado** | Dice 10 de 18 campos y dónde viven en el estándar | `grep "HALL-D7" docs/verificacion/…` | HECHO |

## H2 — Que el dictamen esté donde coordinación mira

**CA:** Dado `docs/trabajo/`, cuando coordinación busca el estado de las 24, entonces lo encuentra
sin entrar al repo del frontend.
**DoD:** las 4 microtareas en `HECHO`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H2.S1.M1 | El dictamen de las 24, con sus 24 filas | Está el archivo y tiene 24 filas | `evidencia/dictamen-aceptacion-24.md` | HECHO |
| H2.S1.M2 | La matriz de internación (18 campos × fuente × soporte) | Está el archivo | `evidencia/matriz-internacion.md` | HECHO |
| H2.S1.M3 | Las fuentes normativas con procedencia y sus `UNKNOWN` | Está el archivo | `evidencia/fuentes-normativas-internacion.md` | HECHO |
| H2.S1.M4 | Los defectos, incluido el que se retiró | Está el archivo, con D-01 retirado y su motivo | `evidencia/defectos-reportados.md` | HECHO |

## H3 — Que los transversales tengan dueño

**CA:** Dado el reporte, cuando el dueño de `shared/` o de `features/auth/` lo lee, sabe qué le toca
y cómo reproducirlo.
**DoD:** las 2 microtareas en `HECHO`.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H3.S1.M1 | El `date-picker` que abre en enero de 2000, con su causa | Está el nombre del método y la condición que lo dispara | §3 del `REPORTE.md` | HECHO |
| H3.S1.M2 | El rojo preexistente de `features/auth/`, demostrado | Están los comandos que lo prueban sobre el corte limpio | §3 del `REPORTE.md` | HECHO |

## Ambigüedades registradas

| ID | Ambigüedad | Quién resuelve | Supuesto |
|---|---|---|---|
| Q-E1 | ¿La evidencia de coordinación se copia acá o se enlaza al repo de producto? | Coordinación | **Se copia** lo que es análisis (4 `.md`) y se **enlaza** lo que es ejecutable (capturas, corridas, PR). La copia dice dónde está el original |
| Q-E2 | ¿`HALL-D6` se corrige en su fila o se abre uno nuevo? | Coordinación | **En su fila, tachada y fechada.** Un hallazgo que desaparece en silencio es indistinguible de uno que nadie revisó |
