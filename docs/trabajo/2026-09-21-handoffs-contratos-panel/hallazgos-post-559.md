# Cinco divergencias que el PR #559 no corrigió

Verificadas contra `origin/mockup` = **`713cfe2d`**, ya con #559 mergeado. Ninguna es una crítica
al PR: son cosas que quedaron, y quedan escritas para que alguien las tome.

**El carril de donde salen no se entrega.** #559 cubre este mismo reparto (54/55) y abrir un PR
paralelo sería duplicar un carril cerrado. Lo único que aporto es esta lista.

---

## D1 · `EXTRA` sigue cerrando horario en vez de abrirlo

```
scheduling.handlers.ts:595   isAvailable: datos.isAvailable ?? false,
```

`isAvailable` se lee del **cuerpo del pedido**, no del tipo. El catálogo ya declara
`blocks: false` para `EXTRA` —igual que `ExceptionTypeDto` en la API—, pero el manejador no lo
mira: **un `EXTRA` sin `isAvailable` cierra los cupos del rato**, que es lo contrario de lo que
el tipo significa.

**Cuesta poco:** `isAvailable: !tipo.blocks`, y deja de depender de que el cliente se acuerde.

## D2 · El `GET` de excepciones esconde el tipo

```
scheduling.handlers.ts:567   .map(({ resourceId: _r, exceptionType: _e, ...b }) => b);
```

`exceptionType` se destructura **para sacarlo** de la respuesta. Quien pinta la agenda recibe
`reasonLabel` —una etiqueta en castellano— y no la clave estable. Distinguir un bloqueo de un
horario extra obliga a comparar textos que cambian con la redacción.

## D3 · `requiresText` exige texto en cuatro tipos; la API en uno

El simulador declara `requiresText: true` en `ABSENCE`, `CONFERENCE`, `ERRAND` y `OTHER`. La API
declara **uno solo**:

```ts
// scheduling-catalog.service.ts:163
const MOTIVO_QUE_EXIGE_TEXTO: ExceptionType = 'OTHER';
// :1245  requiresText: type === MOTIVO_QUE_EXIGE_TEXTO
// :688   la validación al crear usa la misma constante
```

**No es un defecto activo** —#559 no valida `requiresText`, así que nada se rechaza de más— pero
el catálogo viaja al formulario justamente para que sepa cuándo pedir la explicación. Tal como
está, la pantalla va a pedirla en tres motivos donde el backend no la pide.

## D4 · Los rechazos salen con `422`; la API rechaza con `400`

`#559` rechaza con `validation()`, que devuelve **422** (`mock-router.ts:85`). La API valida con
`@IsIn(EXCEPTION_TYPES)` y su `ValidationPipe` global (`main.ts:159`) **no cambia el código**: sale
**400 Bad Request**.

El rechazo es lo importante y eso ya está bien resuelto. Pero el doble usa un código que el
backend no usa, así que el manejo de error que se escriba contra la maqueta no es el que hará
falta contra la API.

## D5 · «Otras atenciones» del panel no puede mostrar nada

El bloque clasifica cada cita por `cita.serviceConceptId` contra `activity-types`, y descarta
`CONSULTATION` y `FOLLOW_UP`:

```ts
// consultas-resumen.ts:122-124
const tipo = datos.actividades.find((a) => a.conceptId === cita.serviceConceptId);
if (tipo === undefined || OTRAS_ATENCIONES_EXCLUIDAS.has(tipo.type)) continue;
```

Pero en la semilla **las tres asignaciones de `serviceConceptId` son `ACT-CONSULTA`**
(`fixtures/agenda.ts:233, 271, 393`) y **no hay una sola reserva de otro tipo**. Toda cita cae en
el `continue`, así que `porTipo` queda vacío y la sección **no renderiza nunca**.

La lógica del panel es correcta; lo que falta es el dato. **C-24 pide exactamente eso** —cirugías
y tomas de muestra separadas de las consultas— y hoy esa parte se ve vacía sin que nada explique
por qué.

**Cuesta poco:** repartir `serviceConceptId` en la semilla con un criterio determinista —la
teleconsulta se deduce del canal, que ya la distingue; procedimientos y exámenes con una cadencia
fija—. Determinista importa: una semilla que cambia entre corridas hace que la cifra del panel no
se pueda verificar dos veces, y verificarla a mano es el kill-test del hito.

---

## Si se toman, el orden que propongo

**D5 y D1 primero**: son los dos que hacen que la pantalla muestre algo falso —una sección
vacía que debería tener datos, y un horario extra que borra cupos—. **D2** después, que destraba
a quien pinte la agenda. **D3 y D4** son alineación de contrato: no rompen nada hoy, pero es lo
que hace que el código escrito contra el doble funcione contra el backend.

Los cinco juntos son un parche chico y con pruebas: tocan `scheduling.handlers.ts` y
`fixtures/agenda.ts`, nada más.
