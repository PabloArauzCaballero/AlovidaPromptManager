# Handoffs del lote de contratos y panel (Ender) — 2026-09-21

Los contratos que los otros lotes estaban esperando, publicados **al cerrar cada hito** y no al
final del turno, como pide la sección 7 del encargo.

| Documento | Para | Qué destraba |
|---|---|---|
| `handoff-pablo.md` | Pablo | H2 (motivo «Otros servicios» y horario extra) y H3 (forma de la visita y duración configurable) |
| `handoff-justin.md` | Justin | H4 — la clave de la frecuencia por defecto. **Espera su `ACCEPT` / `REJECT` / `CHANGE_REQUESTED`** |
| `Q-D6-decisiones-de-negocio.md` | Negocio | Las dos decisiones que no son de implementación |

**Lo que hay del otro lado es la maqueta, no la integración.** El lote se implementó sobre
`origin/mockup` en `0b406532`, con la API (`c2c071a4`) leída sólo para citar contratos.

**El código todavía no está entregado.** Esto publica los contratos acordados; el PR del front
va aparte y todavía no se abrió.

## Rectificación del 2026-09-21 — E-05 era incorrecto

Este paquete se publicó con un hallazgo que **no se sostiene**, y queda corregido acá en vez de
borrado.

**Lo que dije:** que la cuadrícula de notas de Marcelo (PR #558) *«no llama a ningún cliente de
datos: no hay dónde guardar una fila estructurada»*, y lo registré como hallazgo abierto para su
lote.

**Lo que es cierto:** la medición —su `free-note-block` no llama a un cliente de datos— sí lo es.
**La conclusión no.**

**Lo que Marcelo demostró**, en su errata a `VERIFICACION-CONTRA-CODIGO-2026-09-20.md` (commit
`9baa980`, ya en `main`):

| Pieza | Dónde vive |
|---|---|
| La persistencia | **`observation-block`**, que ya existía |
| Una fila | **N observaciones con el mismo `encounterId`** — las que lo comparten *son* la fila |
| Las columnas | Los **`codeConceptId`** que esa persona ya tiene medidos. **No necesitan almacenamiento propio** |
| La lectura | **`GET /clinical/patients/:id/summary`** → `observations[]` + `encounters[]` |

Y la consecuencia que me toca de lleno: **no hizo falta ningún doble —la regla 65 no aplicaba— ni
ningún cambio en `core/mock/**`**. El simulador ya persiste observaciones y encuentros. Marcelo lo
verificó en navegador: cargar la fila, recargar la página, reabrir la casilla, sigue ahí.

**Por qué me equivoqué.** Inferí *«el componente no llama»* ⇒ *«no existe persistencia»*. Son dos
cosas distintas: medí un componente y concluí sobre el sistema, sin buscar los candidatos que la
propia verificación del lote ya listaba —`observation-block` era el **candidato 2** de esa lista—.
Es el mismo salto que la errata de Marcelo corrige en su propio documento.

**E-05 queda cerrado como «no era un hallazgo»**, no como resuelto. La entrada vieja sigue en el
daily, tachada y con el enlace a esta rectificación: el error existió y se lee.
