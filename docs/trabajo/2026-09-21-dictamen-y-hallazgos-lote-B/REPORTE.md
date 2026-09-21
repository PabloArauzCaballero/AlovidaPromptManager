# Reporte — Dictamen del lote B, y la corrección de lo que la verificación afirmó de más

> **AVANCE: 9 / 9 — 100 %.** Las 9 microtareas de **este trabajo** (exportar y corregir) en `HECHO`.
>
> **Ojo con lo que ese número no dice.** Mide que el análisis está donde tiene que estar. **No** dice
> que las 24 correcciones estén hechas: el dictamen que se exporta acá da **`NO ACEPTADO`**, con 22
> de 24 sin ejercitar. Confundir las dos cifras sería el resumen optimista que la regla 40 prohíbe.

- Fecha: 2026-09-21 · Plan: [PLAN.md](./PLAN.md) · Rama: `marcelo/errata-c14-y-dictamen-lote-b`
- Origen: ejecución del lote `Noche-CorreccionesDoctor.ExpedienteYAceptacion` (línea B),
  entregada en `mantra-core-health` como **[PR #558](https://github.com/mdavila-2001/mantra-core-health/pull/558)**.
- Peldaño de evidencia de **este** trabajo: **`WRITTEN`** — son documentos, no hay nada que ejecutar.
  El peldaño de lo que documentan es otro y está dicho en cada pieza.

---

## 1. Completado

### La verificación del 2026-09-20 afirmaba de más sobre C-14, y ya no

**Lo que decía** (§C-14 y `HALL-D6`): que el motor de formularios tiene cinco tipos de pregunta y
ninguno es tabla, **y que por eso la grilla de C-14 «no tiene dónde guardarse hoy»**, con la salida
de la regla 65 —simular contra un doble y registrar la brecha—.

**Lo primero es cierto y sigue en pie.** Está medido, con archivo y línea, y no se tocó.

**Lo segundo no se sostiene**, y se descubrió al ejecutarlo: el motor de formularios no es el único
contrato disponible. **La respuesta estaba en el candidato 2 de la propia lista del documento** —
`observation-block`, que el texto describe como «lo más parecido a *una fila por sesión* que ya
existe»—. Nadie siguió ese hilo hasta el final.

| Pieza de C-14 | Campo del contrato |
|---|---|
| «seleccionar el nombre del header» | `Observation.codeConceptId` — terminología, con el `app-concept-select` que ese bloque ya usa |
| «una fila por sesión» | `encounterId` — las observaciones que lo comparten **son** la fila |
| «se deben cargar para la siguiente sesiones» | `GET /clinical/patients/:id/summary` |

Una fila es **N observaciones con el mismo `encounterId`**. No con `components[]`, que a primera
vista son exactamente una fila: la escritura los admite pero **la lectura no los devuelve**, y el
simulador los descarta. Y las columnas **no necesitan almacenamiento propio**: son la unión de los
`codeConceptId` que esa persona ya tiene medidos.

**Las dos consecuencias para el reparto, que es lo que importa:**

1. **La regla 65 no aplicaba.** No hizo falta doble, ni pedirle un manejador a Ender: el simulador
   ya persiste observaciones y encuentros (`fixtures/clinica.ts:509-511`).
2. **La restricción de una fila por sesión sí tiene dónde vivir en el contrato real**: es «este
   encuentro ya tiene observaciones», comprobable al leer. El documento decía que no existía
   todavía.

Verificado en navegador: cargar la fila → recargar la página → reabrir la casilla → sigue ahí con su
valor. `8/8` con `--workers=1`.

**Cómo quedó escrito:** una errata fechada **junto a** la afirmación original, y `HALL-D6` tachado
en su fila con qué parte se cae y cuál no. **No se borró nada**: un hallazgo que desaparece en
silencio es indistinguible de uno que nadie revisó.

### `HALL-D7` se confirma, y ahora tiene número

Decía que `care_episodes` no tiene servicio, sala, cama ni diagnóstico de ingreso. **Es exacto**, y
se dimensionó: **10 de 18 campos** de una hoja de admisión no tienen dónde caer, y en el estándar
viven en `Encounter.hospitalization` y `Encounter.location` — **no en el episodio**, que es a donde
el formulario escribe. `care_episodes` es, campo por campo, un `EpisodeOfCare` de FHIR: el
*contenedor* que agrupa encuentros.

O sea: **el formulario de internación no está mal por pedir poco, está apuntado al recurso
equivocado.** La propuesta de modelo está en [`evidencia/matriz-internacion.md`](./evidencia/matriz-internacion.md) §4.

### El dictamen de las 24, donde coordinación mira

[`evidencia/dictamen-aceptacion-24.md`](./evidencia/dictamen-aceptacion-24.md) — 24 filas con
veredicto, evidencia y dueño.

**`NO ACEPTADO`**, y no porque algo esté mal: **ninguna de las 24 está integrada en `mockup`**. El
último commit del corte es de las 20:59 del 20/09 y el pedido es de ese mismo día; los cinco lotes
trabajaron en paralelo. **2 aceptadas** (C-14 `PASS`, C-23 `PASS` parcial) · **22 `NOT_RUN`** con su
motivo · **0 rojos ejercitados**.

### Las otras dos piezas del análisis

- [`evidencia/fuentes-normativas-internacion.md`](./evidencia/fuentes-normativas-internacion.md) —
  responde el `Q-D7`/`Q-D8` del reparto («C-23 dice *según nomra* sin nombrar la norma»): **FHIR R4**
  citado con versión, URL y fecha; y la norma boliviana **identificada** (**RM Nº 0090**, 26/02/2008,
  Ministerio de Salud y Deportes, obligatoria en todo el Sistema Nacional de Salud) con su
  **contenido `UNKNOWN`** — el PDF oficial devolvió **403**.
- [`evidencia/defectos-reportados.md`](./evidencia/defectos-reportados.md) — incluye **un defecto que
  se retiró**: lo reporté clasificando desde un `grep` vacío sin reproducir, y el navegador lo
  desmintió. Queda con su error de método, no borrado.

---

## 2. A medias

### La copia y el original

Los cuatro `.md` de `evidencia/` son **copia** del repo de producto. Lo ejecutable —capturas, salidas
de las corridas, `regresion.txt`— **no se copió**: vive en el PR #558. Si alguien edita una copia y
no la otra, derivan. **Q-E1** lo registra; la convención no está decidida.

### El `UNKNOWN` de la norma sigue abierto

La norma existe y es de cumplimiento obligatorio, pero su lista de campos no se pudo leer. Cierra
con el PDF oficial o con la hoja de papel que el doctor usa hoy. **Dueño: doctor / negocio**, que es
a quien `Q-D8` ya lo asignaba.

---

## 3. Pendiente — dos transversales que no tienen dueño en el lote B

### `app-date-picker` abre el calendario en enero de 2000

**Dueño: Itzan** (`src/app/shared/**`).

`mesPorDefecto()` trata **«campo cerrado al pasado» como «es una fecha de nacimiento»** y abre en
enero de `MAX_DEFAULT_YEAR` = **2000**. Cualquier campo **operativo** que legítimamente no pueda ser
futuro —el inicio de una internación, la fecha de una toma de muestra— cae en esa rama y abre a
**veintiséis años** del día que se busca.

**Cómo se encontró:** poniéndole `[maxDate]="ahora"` al alta de internación. **Cómo se resolvió en
el lote B:** quitándoselo y dejando la validación en el formulario, que es donde el resto del
expediente pone sus precondiciones. **La heurística sigue ahí para el próximo que la pise.**

### `register-practitioner.spec.ts` está en rojo en el corte

**Dueño: quien sea de `src/app/features/auth/`.** Clase: `PRODUCT_BUG` o `TEST_BUG` del corte —no
se determinó cuál, porque no es del lote B arreglarlo.

Se **demostró que es preexistente**, no que «probablemente lo sea»:

```
$ git stash push -u -m "lote-B-temporal"
$ yarn stock:generate
$ npx ng test --include="src/app/features/auth/register-practitioner/register-practitioner.spec.ts" --watch=false

FAIL … > RegisterPractitioner con mockBackend
       > resuelve los cinco tipos canónicos de credencial desde el backend simulado
Error: Test timed out in 5000ms.
Tests  1 failed | 96 passed (97)
```

En la suite completa son **3 de 6 858**. El resto del front está en verde.

---

## 4. Lo que NO se tocó, y por qué

| Qué | Por qué |
|---|---|
| `CORRECCIONES-DOCTOR-2026-09-20.md` | Es la **transcripción literal** de lo que pidió el cliente. Un requisito ambiguo se registra como ambigüedad; **no se corrige** (regla 00 §1.6) |
| El reparto y las asignaciones | Ninguna conclusión de acá cambia quién cubre qué |
| El resto de la verificación | Sólo se tocaron §C-14, `HALL-D6` y `HALL-D7`. Lo demás no se ejecutó, así que no hay nada que confirmar ni desmentir |
| `.claude/` del pack | Ninguna regla ni skill salió mal parada. La que más se usó —la 65— **no aplicaba** a este caso, y eso no es un defecto de la regla: es que el bloqueo no existía |

---

## 5. Handoff

| A quién | Qué |
|---|---|
| **Coordinación** | El dictamen: `NO ACEPTADO`, 22 de 24 sin ejercitar **porque nada está integrado**. Y que `HALL-D6` ya no es un bloqueo |
| **Itzan** | El `date-picker` que abre en enero de 2000 |
| **`features/auth/`** | El rojo preexistente, con los comandos para reproducirlo |
| **Dueño del modelo** | `evidencia/matriz-internacion.md` §4 y el defecto **D-02** |
| **Quien haga la próxima verificación contra código** | La lección de `HALL-D6`: **un candidato descartado sin seguirlo hasta el final no está descartado.** El documento tenía la respuesta en su propia lista |
