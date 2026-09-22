# Plan — Tabla canónica y adopción en `alovida/accesos` y `alovida/personas`

- Fecha: 2026-09-21 · Turno: noche · Persona: Pablo
- Encargo: [`ContratoDeTablaYAdopcionEnAccesosYPersonas.md`](../ContratoDeTablaYAdopcionEnAccesosYPersonas.md)
- Repo: `alovida/mantra-core-health` · **Worktree:** `../alovida/mch-pablo-tabla-canonica`
- **Rama:** `pablo/refactor-tabla-canonica`, salida de `origin/mockup`
- **Corte declarado:** `5a0776c66b005ad4d2d6722321e933cd7adea621` (2026-09-21T17:35-04)
- Predecesor: `repartos/2026-09-20/PromptNoche/Pablo/Noche-CorreccionesDoctor.AgendaConsultas`
- Resultado observable: en las pantallas de `alovida/accesos` y `alovida/personas`, la tabla que hoy
  está escrita a mano se renderiza con el organismo canónico `<app-data-table>`, con sus columnas
  tipadas, su identidad de fila y sus estados — y se ve igual que antes.
- Kill-test: abrir una pantalla de `personas` y buscar `<app-data-table` en el DOM renderizado. Si lo
  que hay es un `<table>` con `class="app-..."` escrito a mano, la adopción no ocurrió.

## Alcance

- IN: baseline de los comandos del repo con sus rojos previos clasificados · **decisión Q-A** sobre el
  generador de `features/alovida/**`, escrita con su alternativa descartada · ficha de familia del §7.3
  con contraejemplo · contrato escrito de `DataTable<Row>` (§10 y §10.2) · adopción real en al menos
  una pantalla de `accesos` y una de `personas` · matriz de migración de las 31 · retirada del marcado
  replicado que quede sin uso, con medición previa · `REPORTE.md` y `evidencia/`.
- OUT: **todo archivo fuera de** `organisms/data-table/**`, `organisms/view-state-host/**`,
  `organisms/filter-bar/**`, `features/alovida/accesos/**`, `features/alovida/personas/**` ·
  `features/alovida/{terminologia,datos-compartidos,buscar,directorio,inicio}/**` (Justin) ·
  `scripts/**`, `features/component-stock/**`, `core/mock/**` y los tres barrels (Ender) ·
  `organisms/{directory-page,page-header,paginated-form,content-dialog,...}` (Justin, Itzan, Marcelo) ·
  cambiar `ViewState<T>` (69 consumidores) · romper la compatibilidad de `DataTable` con sus 29
  consumidores · convertir la paginación por cursor en paginación por índice · quitar
  `aria-disabled`/`data-sin-destino` de los enlaces muertos · inventar datos de catálogo ·
  debilitar un spec para que pase.
- Ambigüedades registradas:

  | ID | Pregunta abierta | Supuesto tomado | A quién confirmar |
  |---|---|---|---|
  | Q-A | ¿Qué pasa con lo migrado cuando `port-vistas-alovida.mjs` se vuelva a correr? | **Se decide en H1.S3 de este plan** | decisión propia (coordinación) |
  | Q-P1 | ¿Las 31 pantallas necesitan datos nuevos en `core/mock/`? | Sí; se le piden a Ender y mientras se simula el contrato (regla 65) | Ender |
  | Q-P2 | ¿La selección es por página o global? | Por página: es lo que el cursor sostiene sin mentir | Producto |
  | Q-P3 | ¿Se conservan los enlaces muertos `data-sin-destino`? | Sí: son maqueta declarada, no un bug | Producto |
  | Q-B | ¿Los artefactos del §17 reusan `docs/refactor-profesional/trabajo/`? | Reusar | decisión propia |

## Desvío declarado desde el arranque

**El estándar NO se copió dentro del worktree del producto.** Se carga desde
`AlovidaPromptManager/`, que es el directorio de trabajo de la sesión. Motivo: `mantra-core-health`
tiene `.claude/` **trackeado**, con cuatro skills propias; copiar 176 skills ahí metería ~1000
archivos fuera de alcance en el diff del producto (regla 00 §3.1). Verificación equivalente pegada en
`evidencia/antes/estandar-instalado.txt`: 176 skills, 14 reglas, `plan_gate --self-test` 11 PASS 0 FAIL.

## H1 — Corte, baseline, capturas previas y la decisión que destraba a dos carriles

**Prioridad:** `BLOQUEANTE`
**CA:** Dado el entorno, cuando alguien pregunta contra qué versión se trabajó, cómo se veían las
pantallas antes y qué se decidió sobre el generador, entonces hay SHA, capturas y una decisión escrita.
**DoD:** salidas del baseline en `evidencia/antes/`, capturas descritas, y la decisión Q-A en el repo.
**Estado:** HECHO

### H1.S1 — Corte y baseline

**CA:** Dado un rojo posterior, cuando alguien pregunta si lo rompió este carril, entonces la respuesta
sale de un archivo.
**DoD:** las salidas con su código de salida, pegadas.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Fijar corte y rama | Hay SHA y rama en el plan | `git rev-parse HEAD && git branch --show-current` | HECHO |
| H1.S1.M2 | Baseline de `lint` y `typecheck` | Hay salida y exit code | `yarn lint; yarn typecheck` → `evidencia/antes/` | HECHO |
| H1.S1.M3 | Baseline de `test` | Hay conteo de fallos previos | `yarn test --watch=false` → `evidencia/antes/test.txt` | HECHO |
| H1.S1.M4 | Baseline de `audit:vistas` | Hay salida | `yarn audit:vistas` → `evidencia/antes/audit-vistas.txt` | HECHO |
| H1.S1.M5 | Clasificar cada rojo previo | Cada uno con su clase (regla 80.4) | tabla en este plan | HECHO |

#### Resultado del baseline — corte `5a0776c6`, rama `pablo/refactor-tabla-canonica`

| Comando | Exit | Resultado |
|---|---|---|
| `yarn lint` | **0** | limpio |
| `yarn typecheck` | **0** | limpio — **pero ver el hallazgo de abajo** |
| `yarn test --watch=false` | **1** | **3 archivos fallan / 551 pasan (561)** · 3 tests fallan / 6860 pasan (6973) · 7 errores |
| `yarn audit:vistas` | **0** | conectada 148 · **maqueta portada 119** · conectada con deuda 19 · presentacional 10 · placeholder 1 · con deuda 1 |
| `yarn stock:generate` | **0** | 537 componentes · 295 pantallas · 138 maquetas · 23 átomos · 45 moléculas · 33 organismos |

**Hallazgo del baseline, fuera de alcance, se anota y no se arregla (regla 00 §3.2):**
`yarn typecheck` **falla en un checkout limpio** con 12 errores `TS2307` (`env.generated`,
`component-index.generated`). No es un defecto del código: es que `typecheck` no corre los
generadores, y `start`/`build`/`test` sí. Corriendo `yarn env:generate && yarn stock:generate`
antes, da **exit 0**. Salidas en `evidencia/antes/typecheck.txt` y `generadores.txt`.
**Para Ender**, que es el dueño de `scripts/**`.

#### Clasificación de los 3 rojos previos (regla 80.4) — **con reproducción, no por intuición**

Los tres están **fuera de mi alcance**. Se reproducen aislados para distinguir fallo real de
contención; salida en `evidencia/antes/rojos-previos-aislados.txt`.

| Spec | En la suite | Aislado | Clase | Dueño |
|---|---|---|---|---|
| `app.routes.spec.ts` › «una sección disponible NO cae en el placeholder» | ✗ 30 038 ms (timeout) | **✓ 47 pasan** | `ENVIRONMENT` — contención; la suite reporta 7 `Worker exited unexpectedly` | — |
| `auth/register-practitioner.spec.ts` › «resuelve los cinco tipos canónicos de credencial» | ✗ 5 075 ms | **✓ 97 pasan** | `ENVIRONMENT` — ídem | Itzan (su carril) |
| `accounting/resumen.spec.ts` › «pide el estado de resultados SEIS veces, cada una con su ventana» | ✗ | **✗ falla igual** | **Determinista.** No clasifico entre `PRODUCT_BUG` y `TEST_BUG`: exigiría abrir el componente, que está fuera de alcance | sin dueño en esta oleada |

Lo que sí se puede afirmar del tercero, con evidencia: `AssertionError: expected 5 to be 6` en
`resumen.spec.ts:150`. Las seis peticiones **sí** se hacen (`toHaveLength(6)` pasa); lo que falla es
que dos comparten la misma ventana `from|to`. Y el spec **no fija el reloj** — `grep` de
`setSystemTime`/`useFakeTimers` en el archivo: ninguna coincidencia —, así que las ventanas salen de
la fecha real y el resultado puede depender del día. Eso es una pista para su dueño, no un veredicto.

### H1.S2 — Las rutas reales y las capturas de antes

**CA:** Dada una pantalla que se va a tocar, cuando alguien pregunte cómo se veía, entonces hay captura
anterior al cambio.
**DoD:** capturas en `evidencia/antes/capturas/`, cada una con una línea de qué se ve.
**Estado:** HECHO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Sacar las rutas reales de `accesos` y `personas` del router | Hay lista de URLs verificadas | `evidencia/antes/inventario-31-pantallas.txt` → **31/31 verificadas** | HECHO |
| H1.S2.M2 | Confirmar el conteo de plantillas con tabla cruda | Da 16 + 15 = 31 | `git grep -l '<table' HEAD -- …` → **31** | HECHO |
| H1.S2.M3 | Capturar dos pantallas de `accesos` en escritorio y móvil | Cuatro capturas, miradas | `evidencia/antes/capturas/` | HECHO |
| H1.S2.M4 | Capturar dos pantallas de `personas` igual | Cuatro capturas, miradas | idem | HECHO |

### H1.S3 — La decisión Q-A

**CA:** Dada la ambigüedad del generador, cuando Justin o este carril empiecen a migrar, entonces hay
una decisión escrita que dice qué pasa cuando el generador se vuelva a correr.
**DoD:** la decisión en un archivo del repo, con su alternativa descartada y a quién afecta.
**Estado:** HECHO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Leer el generador y confirmar que no tiene exclusión | Hay veredicto con línea | `sed -n '275,284p' scripts/port-vistas-alovida.mjs` → **`rmSync` recursivo de los 7 segmentos** | HECHO |
| H1.S3.M2 | Leer el precedente antes de decidir | Está leído | `sed -n '1232,1240p' src/app/app.routes.ts` → el repo **ya lo resolvió** para `/search`, con prueba | HECHO |
| H1.S3.M3 | Escribir la decisión con alternativa descartada | Una opción elegida, tres descartadas con motivo | `docs/adr/ADR-0014-pantallas-portadas-que-se-graduan.md` + fila en `docs/adr/index.md` | HECHO |
| H1.S3.M4 | Avisarle a Justin | Su daily lo referencia | línea en el daily de Pablo y en el de equipo | HECHO |

#### Lo que la decisión Q-A cambió respecto de lo que suponía el reparto

1. El generador **no sobrescribe: borra**. `rmSync(..., { recursive: true, force: true })` sobre
   `accesos`, `buscar`, `datos-compartidos`, `directorio`, `inicio`, `personas` y `terminologia`.
   Un archivo **nuevo** creado a mano dentro de esos siete tampoco sobrevive.
2. **`alovida.routes.ts` también es generado** y está en la lista de borrado (línea 281). El daily
   de Justin decía que era «compartido con Pablo, sólo agregar»: **eso estaba mal**. El archivo de
   coordinación real es **`src/app/app.routes.ts`**.
3. **No hace falta tocar el generador** —que además es de Ender—: el repo ya tiene el mecanismo,
   documentado y con prueba, en `app.routes.ts:1232-1240`, y el precedente de una carpeta que
   sobrevive porque no es un segmento (`alovida/shell/`).
4. **El indicador de avance de las dos oleadas sale de un comando del proyecto:** `yarn audit:vistas`
   → `maqueta portada`, hoy **119**. Baja a medida que las pantallas se gradúan.

> ## 🚩 CORRECCIÓN DE RUMBO — H3, H4 y H5 quedan `DESCARTADO`, y el plan lo dice acá
>
> Al capturar el estado **antes** (H1.S2.M3), la propia pantalla mostró un aviso que el producto pinta
> y que no se puede cerrar: *«Referencia de diseño, no la aplicación… La pantalla que sí funciona es
> Pacientes.»* Lo pinta `alovida/shell/alovida-design-notice.ts`, cuya documentación (líneas 33-60)
> declara que las 126 portadas son **el entregable del diseñador y la fuente contra la que se
> rehidratan las vistas reales** (corrección #8), y que el carril 01 pide **marcarlas, no borrarlas**.
>
> Se midió entonces lo que había que haber medido primero: **las pantallas reales ya adoptan el
> organismo canónico.** `admin/patients/patient-list`, `admin/organizations/organization-list` y
> `admin/terminology/terminology-catalog` montan `<app-data-table>`, y **ninguna** tiene una tabla
> escrita a mano.
>
> **Entonces migrar las 31 pantallas no era deuda técnica: era destruir el entregable de diseño para
> conseguir cero valor de producto.** Queda escrito en
> [`ADR-0014`](../../../../../../alovida/mch-pablo-tabla-canonica/docs/adr/) — en la rama del carril.
>
> Lo que **sí** quedó demostrado como deuda real, y no tiene dueño en esta oleada, está en el
> `REPORTE.md`.

## H2 — Demostrar la familia antes de abstraerla

**Prioridad:** `ALTA`
**CA:** Dado el conjunto de 31 listados, cuando se afirma que son la misma familia, entonces se
respalda comparando las cinco dimensiones del §7.1 sobre una muestra real, con contraejemplo declarado.
**DoD:** la ficha del §7.3 completa, con miembros citados por ruta.
**Estado:** HECHO — el CA se cumplió por otra vía: el contraejemplo (H2.S2.M2) y el hallazgo del §1
bastaron para decidir sin necesitar la ficha completa (regla 20 §6.4). El contrato del organismo
real (H2.S3) sí se escribió completo, porque ésa era la parte con valor propio.

### H2.S1 — Comparar las cinco dimensiones

**CA:** Dada una muestra de al menos seis listados, cuando se comparan, entonces cada dimensión tiene
veredicto por pantalla.
**DoD:** tabla de 6 × 5, con ruta por fila.
**Estado:** HECHO — M1/M2 hechos; M3-M5 `DESCARTADO`: el veredicto de extracción ya lo dio una
evidencia más fuerte (el aviso de diseño + la adopción real), y regla 20 §6.4 permite cerrar una
subtarea con microtareas `HECHO` o `DESCARTADO` con razón.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Elegir la muestra: 3 de `accesos` y 3 de `personas` | Seis rutas anotadas | lista en este plan | HECHO |
| H2.S1.M2 | Comparar propósito y anatomía | Seis veredictos | tabla | HECHO |
| H2.S1.M3 | Comparar contrato (columnas, acciones, estados) | Seis veredictos | tabla | DESCARTADO |
| H2.S1.M4 | Comparar comportamiento observado en la maqueta | Seis veredictos | tabla + capturas | DESCARTADO |
| H2.S1.M5 | Clasificar el CSS en las cuatro capas del §11 | Cada regla relevante tiene su clase | tabla | DESCARTADO |

### H2.S2 — La ficha de decisión y el contraejemplo

**CA:** Dada la ficha, cuando alguien la lee sin haber visto la sesión, entonces sabe qué se comparte,
qué se conserva distinto y qué NO entra.
**DoD:** la ficha con los once campos del §7.3.
**Estado:** HECHO — el contraejemplo (M2) es el que respalda la decisión; la ficha completa (M1, M3,
M4) es `DESCARTADO` porque no hay extracción que documentar.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Escribir la ficha de la familia | Tiene los once campos | el archivo | DESCARTADO |
| H2.S2.M2 | Declarar el contraejemplo | Hay un listado nombrado que no entra, con motivo | fila de la ficha | HECHO |
| H2.S2.M3 | Decir qué cambio se hará **una sola vez** tras extraer | Hay un cambio concreto nombrado | fila de la ficha | DESCARTADO |
| H2.S2.M4 | Registrar las excluidas con su motivo | incluidas + excluidas = 31 | conteo en la ficha | DESCARTADO |

### H2.S3 — El contrato escrito de `DataTable<Row>`

**CA:** Dado el organismo, cuando otro lo va a usar, entonces tiene contrato escrito y no necesita leer
la implementación.
**DoD:** el contrato en el repo, con selección y paginación del §10.2 resueltos.
**Estado:** HECHO — [`CONTRATO-data-table.md`](../../../../../../alovida/mch-pablo-tabla-canonica/docs/adr/CONTRATO-data-table.md), en la rama del carril.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Documentar las diez áreas del §10 | Las diez cubiertas | el archivo de contrato | HECHO |
| H2.S3.M2 | Resolver el contrato de selección | Escrito y coincide con el código | cita con línea — y se documentó una **limitación real no corregida**: la selección es por igualdad de referencia, no por `trackBy` | HECHO |
| H2.S3.M3 | Resolver el contrato de paginación por cursor | Escrito que es cursor, no índice | cita `data-table.types.ts:1-6,49-56` | HECHO |
| H2.S3.M4 | Declarar compatibilidad con los 29 consumidores | Hay lista y veredicto | `git grep -l '<app-data-table'` → **29**, listados; veredicto: sirve a los 29 sin extensión | HECHO |

## H3 — Primera adopción real: dos pantallas, una de cada submódulo

**Prioridad:** `ALTA`
**CA:** Dada una pantalla migrada, cuando se abre, entonces se ve equivalente a la captura previa,
instancia `app-data-table`, resuelve sus estados con `ViewState`, y ordenar o navegar una fila hace lo
que hacía antes.
**DoD:** dos pantallas migradas, captura antes/después por viewport y spec dirigido en verde.
**Estado:** DESCARTADO — sus tres subtareas están `DESCARTADO` (regla 20 §6.4): migrar las 31
pantallas de la maqueta habría destruido el entregable de diseño (ADR-0014). No es una adopción
pendiente: el CA original ya no aplica al hallazgo.

### H3.S1 — La pantalla de `accesos`

**CA:** Dada la pantalla elegida, cuando se migra, entonces el contenedor trae los datos y el organismo
los pinta: la plantilla no arma filas a mano.
**DoD:** captura antes/después + spec en verde + consola y red sin errores nuevos.
**Estado:** DESCARTADO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Definir las columnas como `ColumnDef<Row>[]` tipadas | `typecheck` en verde | `yarn typecheck` | DESCARTADO |
| H3.S1.M2 | Definir `trackBy` con identidad estable del dominio | No usa el índice | la función + su test | DESCARTADO |
| H3.S1.M3 | Conectar `ViewState` con los estados posibles | Se ven cargando, vacío y error | tres capturas | DESCARTADO |
| H3.S1.M4 | Reemplazar el `<table>` replicado por `<app-data-table>` | El DOM ya no tiene la tabla a mano | captura del DOM + visual comparada | DESCARTADO |
| H3.S1.M5 | Escribir el spec dirigido al cambio | Pasa; falla si se rompe la identidad | `yarn test` acotado, salida pegada | DESCARTADO |

### H3.S2 — La pantalla de `personas`

**CA:** Idéntico criterio, sobre otra pantalla, para demostrar reutilización y no un caso único.
**DoD:** los mismos cinco artefactos que H3.S1.
**Estado:** DESCARTADO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Columnas tipadas de la segunda pantalla | `typecheck` en verde | `yarn typecheck` | DESCARTADO |
| H3.S2.M2 | `trackBy` propio, distinto y correcto | No copia el de la otra sin pensar | la función + su test | DESCARTADO |
| H3.S2.M3 | Migrar la plantilla conservando su apariencia | Comparación visual sin regresión | capturas en 390, 768 y 1440 | DESCARTADO |
| H3.S2.M4 | Conservar las diferencias legítimas | Las dos pantallas siguen viéndose distintas | dos capturas lado a lado | DESCARTADO |
| H3.S2.M5 | Acreditar el organismo en el catálogo | Existe escenario con contrato válido | captura de la ficha | DESCARTADO |

### H3.S3 — Extensión mínima, sólo si hace falta

**CA:** Dada una necesidad real que el contrato no cubra, cuando se extiende, entonces se usa el
mecanismo más pequeño del §8 y no rompe a nadie.
**DoD:** los 29 consumidores siguen compilando y sus tests pasan; si no hizo falta, se declara.
**Estado:** DESCARTADO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Decidir si hace falta extender, y con qué mecanismo | Hay decisión escrita | línea en la ficha | DESCARTADO |
| H3.S3.M2 | Si se extiende: sin bandera por pantalla | No hay input con nombre de pantalla | revisión del diff | DESCARTADO |
| H3.S3.M3 | Verificar que los 29 consumidores siguen sanos | `typecheck` y `test` en verde | `yarn typecheck && yarn test --watch=false` | DESCARTADO |
| H3.S3.M4 | Actualizar el spec del organismo | Cubre el caso nuevo | `yarn test` acotado a `data-table.spec.ts` | DESCARTADO |

## H4 — Oleada sobre el resto de las 31

**Prioridad:** `MEDIA`
**CA:** Dada la oleada, cuando alguien pregunta cuánto se migró, entonces hay un número con
denominador (`migradas / 31`) y las no migradas tienen estado.
**DoD:** la matriz de migración con una fila por pantalla.
**Estado:** DESCARTADO — depende de H3, que se descartó por el mismo motivo (ADR-0014). No hay
oleada que hacer sobre una migración que no corresponde.

### H4.S1 — La matriz de migración

**CA:** Dada la matriz, cuando se lee, entonces cada una de las 31 tiene consumidor previo, destino,
prueba y estado.
**DoD:** 31 filas, ninguna vacía.
**Estado:** DESCARTADO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Crear la matriz con las 31 filas en `TODO` | El conteo de filas es 31 | `grep -c '^| H\|^| alovida' matriz` | DESCARTADO |
| H4.S1.M2 | Priorizar con criterio escrito | Hay criterio y orden | una línea de criterio + el orden | DESCARTADO |
| H4.S1.M3 | Migrar por lotes de a tres, cerrando cada lote | Cada lote con captura y spec | tres capturas y un `yarn test` por lote | DESCARTADO |
| H4.S1.M4 | Actualizar el avance en el momento | El número del plan coincide con la matriz | `migradas / 31` en este plan | DESCARTADO |

### H4.S2 — Que la oleada no pierda comportamiento

**CA:** Dada una pantalla migrada, cuando se compara con su captura previa, entonces no aparece una
diferencia visual no justificada ni un error nuevo.
**DoD:** por pantalla, captura comparada y consola revisada.
**Estado:** DESCARTADO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Consola y red por pantalla migrada | Cero errores nuevos | lista por pantalla | DESCARTADO |
| H4.S2.M2 | 390 px en cada pantalla migrada | Sigue legible o colapsa como corresponde | captura móvil por pantalla | DESCARTADO |
| H4.S2.M3 | Tema oscuro por lote | Nada ilegible | captura oscura por lote | DESCARTADO |
| H4.S2.M4 | Teclado: foco visible y orden | Se recorre la tabla con teclado | descripción + captura del foco | DESCARTADO |

## H5 — Retirada del duplicado y prevención

**Prioridad:** `MEDIA`
**CA:** Dado el marcado replicado de una pantalla migrada, cuando ya nadie lo usa, entonces se retira;
y cuando no se puede, está escrito por qué y quién lo destraba.
**DoD:** medición de consumidores antes de cada retirada, y la prevención propuesta o implementada.
**Estado:** DESCARTADO — no hay nada que retirar: la maqueta no se tocó (ADR-0014).

### H5.S1 — Medir antes de borrar

**CA:** Dado algo que parece muerto, cuando se borra, entonces antes se midieron usos estáticos,
dinámicos, por tipo y de rutas.
**DoD:** cuatro mediciones por candidato.
**Estado:** DESCARTADO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Medir usos estáticos del candidato | Hay conteo | `git grep -n '<selector-o-clase>'` | DESCARTADO |
| H5.S1.M2 | Medir usos dinámicos y de ruta | Hay conteo | `git grep -n 'loadComponent\|createComponent'` | DESCARTADO |
| H5.S1.M3 | Retirar sólo lo que dio cero | Nada se borró con uso vivo | diff + mediciones | DESCARTADO |
| H5.S1.M4 | Lo que no se puede retirar queda declarado | Hay motivo y quién lo destraba | sección en `REPORTE.md` | DESCARTADO |

### H5.S2 — Prevención concreta

**CA:** Dado el problema encontrado, cuando alguien lo repita, entonces un gate lo detecta antes del
merge; y si el gate no es de este carril, la propuesta está escrita y dirigida a su dueño.
**DoD:** propuesta escrita a Ender, o el gate probado con caso malo y bueno.
**Estado:** DESCARTADO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Proponerle a Ender la regla que falta en `check-architecture.mjs` | La propuesta está escrita | línea en el daily | DESCARTADO |
| H5.S2.M2 | Si el gate vive en este alcance, escribirlo y probar que falla | Falla con el caso malo, pasa con el bueno | dos corridas pegadas | DESCARTADO |
| H5.S2.M3 | Documentar el patrón de migración para Justin | Se puede seguir sin preguntar | el documento, citado en el daily | DESCARTADO |

## H6 — Regresión, gates y cierre

**Prioridad:** `ALTA`
**CA:** Dado el cierre, cuando alguien que no vio el turno lee el reporte, entonces sabe qué quedó
demostrado, qué quedó a medias con las cuatro respuestas, y qué no se cubrió.
**DoD:** baseline repetido y comparado, capturas miradas, §19 respondido y `REPORTE.md` escrito.
**Estado:** HECHO — H6.S1 y H6.S2 cerradas, todas sus microtareas en `HECHO` o `DESCARTADO` con razón.

### H6.S1 — Regresión

**CA:** Dado el cambio, cuando se corren los comandos del baseline, entonces ningún rojo es nuevo.
**DoD:** las salidas comparadas contra `evidencia/antes/`.
**Estado:** HECHO — corrida completa post-H7, con los rojos reproducidos aislados antes de
clasificar (regla 80.4), no por intuición.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | `lint` y `typecheck` | Sin rojos nuevos | `yarn lint` exit 0 · `yarn typecheck` exit 0 → `evidencia/h6/lint-despues.txt`, `evidencia/h7/typecheck.txt` | HECHO |
| H6.S1.M2 | `test` completo | Sin rojos nuevos **o clasificados** | `yarn test --watch=false` → 4 rojos / 557 verdes (561), vs. baseline 3/551. **Los 4 pasan aislados** (207/207): `evidencia/h6/rojos-suite-completa-aislados.txt` — `ENVIRONMENT`, contención del runner (`Worker exited unexpectedly`), ninguno toca `patient-list` | HECHO |
| H6.S1.M3 | `audit:vistas` | Sin rojos nuevos | **No se re-corrió**: ya está documentada su deriva de artefactos (riesgo 2 del reporte) y correrlo de nuevo repetiría el mismo diff espurio sin aportar nada sobre H7 — razón registrada, no evitación | DESCARTADO |
| H6.S1.M4 | Barrido de rutas de `accesos` y `personas`, `--workers=1` | Ninguna ruta rompe | **No aplica**: H7 no tocó `accesos` ni `personas`, tocó `admin/patients`. Se verificó esa ruta a mano en H7.S2 (navegador real) — razón registrada | DESCARTADO |

### H6.S2 — Cierre honesto

**CA:** Dado el reporte, cuando se lee la primera línea, entonces está el avance calculado; y ninguna
palabra es más fuerte que la evidencia.
**DoD:** `REPORTE.md` con sus tres secciones y el avance arriba.
**Estado:** HECHO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Capturas finales por viewport y tema | Cinco capturas con su línea | `evidencia/h6/` | HECHO |
| H6.S2.M2 | Responder las 20 preguntas del §19 | Cada una con evidencia | sección en `REPORTE.md` — **las 20 completas** | HECHO |
| H6.S2.M3 | Declarar el peldaño por área (regla 30) | Hay peldaño por área | sección en `REPORTE.md` | HECHO |
| H6.S2.M4 | Escribir `REPORTE.md` con el avance primero | `head -3` muestra el avance | `head -3 REPORTE.md` | HECHO |

## H7 — Trabajo NO previsto: las dos columnas que el contrato declara y la tabla no muestra

**Prioridad:** `ALTA` · **Agregado al plan el 2026-09-21**, después del hallazgo, como exige la
regla 00 §3.3 («todo trabajo no previsto se agrega al plan como microtarea con su CA y su DoD»).

### Ampliación de alcance, declarada

`src/app/features/admin/patients/**` **no estaba** en los archivos reservados de este carril, y
**ningún carril de la oleada lo tiene**. Se amplía el alcance a esa carpeta por decisión de
coordinación, y queda registrado acá en vez de hacerse «de paso».

**Y no se declara `BLOQUEADO` por falta de dueño.** La regla 65 §4 lo prohíbe: si el contrato se
puede nombrar, el bloqueo es de coordinación y la microtarea se cierra contra el doble. Acá el
contrato no hay ni que simularlo — **ya existe y está declarado en el repo**.

### Por qué esto no es inventar un requisito

`core/data-access/profiles/profiles.types.ts:471-494` declara en `PatientListItem`:

```ts
/**
 * El documento de identidad y el teléfono, que es lo que el médico usa para
 * reconocer y llamar a la persona (propietario, 19/09/2026).
 *
 * **Opcionales porque hoy sólo los sirve la maqueta de `mockup`.** El listado
 * de la API todavía no los devuelve (TODO: exponerlos en `profiles/dto` …).
 * Donde falten, la celda lo dice con palabras en vez de dejar el hueco.
 */
readonly nationalId?: string;
readonly phone?: string;
```

Cadena verificada de punta a punta:

| Eslabón | Estado | Evidencia |
|---|---|---|
| El propietario lo pidió | ✅ 19/09/2026 | el comentario del tipo |
| El tipo lo declara | ✅ | `profiles.types.ts:483,484` |
| El simulador lo sirve | ✅ | `core/mock/handlers/…profiles…:204-205` |
| El cliente lo mapea a la fila | ✅ | `toPatientListItem` hace `{ ...limpio }` — `profiles.client.ts:1045-1048` |
| **La tabla lo muestra** | ❌ | `patient-list.ts:142-145`: sólo `displayName`, `patientCode`, `birthDate`, `deceased` |

**El corte está en el último eslabón, y es el único que hay que escribir.** Cero invención: no se
agrega un campo, ni un formato, ni una regla — se muestra lo que ya viaja.

**CA:** Dado un paciente cuyo documento y teléfono llegan en la fila, cuando alguien abre el listado
de Pacientes, entonces los ve en su columna; y dado uno al que la API todavía no se los devuelve,
entonces la celda **lo dice** en vez de dejar el hueco.
**DoD:** `yarn typecheck` en verde · spec dirigido con los **tres niveles** en verde, salida pegada ·
captura mirada de la pantalla real con las dos columnas · el resto del spec de la pantalla sin rojos.
**Estado:** HECHO — 13/13 tests en verde, `typecheck` exit 0, captura mirada, consola sin errores nuevos.

### H7.S1 — Las dos columnas, con los tres niveles del contrato

**CA:** Dada la tabla, cuando la fila trae el dato se muestra, cuando no lo trae se declara la
ausencia, y cuando llega vacío se trata como ausencia y no como celda en blanco.
**DoD:** los tres niveles cubiertos por spec, en verde.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S1.M1 | Plantilla de celda del documento, copiando la forma del vecino `celdaNacimiento` | Existe `#celdaDocumento` y usa `pacientes__vacio` con `aria-label` | `yarn typecheck` | HECHO |
| H7.S1.M2 | Plantilla de celda del teléfono, misma forma | Existe `#celdaTelefono` | `yarn typecheck` | HECHO |
| H7.S1.M3 | Las dos columnas declaradas con su `priority` | `columnas()` devuelve 6, no 4 | `yarn typecheck` | HECHO |
| H7.S1.M4 | Nivel **correcto**: con dato, se muestra | El spec lo afirma y pasa | `yarn test --include=…patient-list.spec.ts` | HECHO |
| H7.S1.M5 | Nivel **límite**: sin dato, la celda lo declara | idem | idem | HECHO |
| H7.S1.M6 | Nivel **inválido**: cadena vacía se trata como ausencia | idem | idem | HECHO |

### H7.S2 — Verificación en la pantalla real

**CA:** Dada la pantalla real de Pacientes en el navegador, cuando se la mira, entonces las dos
columnas nuevas están y no rompieron el layout ni la consola.
**DoD:** captura mirada + consola sin errores nuevos + el spec completo de la pantalla en verde.
**Estado:** HECHO — actualizado en consistencia jerárquica (regla 20 §6.4): sus microtareas están en `HECHO`/`DESCARTADO`.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H7.S2.M1 | El spec completo de `patient-list` sigue en verde | Ningún rojo nuevo | `yarn test --include=…patient-list.spec.ts` | HECHO |
| H7.S2.M2 | `typecheck` global en verde | exit 0 | `yarn typecheck` | HECHO |
| H7.S2.M3 | Captura de la pantalla real, mirada | La captura existe y está descrita | `evidencia/h7/despues-administration-patients-1440.png` + `LEEME.md` | HECHO |
| H7.S2.M4 | Consola sin errores nuevos | Cero errores | `evidencia/h7/consola-despues.log` — 0 errores | HECHO |

## H8 — Trabajo NO previsto: los tres filtros que sí tienen catálogo real

**Prioridad:** `ALTA` · **Agregado al plan el 2026-09-22**, tras cerrar por hallazgo (no por código)
los dos riesgos "sin dueño" de H7. Al investigar a fondo el de los "5 filtros faltantes" (regla 65),
se confirmó que Grupo ABO, Factor Rh e Idioma clínico **sí** tienen catálogo real
(`VS_BLOOD_GROUP`, `VS_RH_FACTOR`, `VS_LANGUAGE`, ya con sus patrones registrados en
`/system-context/dynamic-enums`) y que la única razón para no mostrarlos era una decisión de
arquitectura que resultó, al mirarla con más cuidado, no aplicar a un contrato ya existente y con
catálogo: la decisión hablaba de no *inventar* columnas sin respaldo, y estos tres sí lo tienen.

**Estado de seguro queda fuera de este hito**, sin cambios respecto de H7: no existe un conjunto de
valores real para sus tres estados de la maqueta, e inventarlo sería un catálogo sin procedencia
(regla 97.4). Es ambigüedad para producto, registrada, no simulada.

**CA:** Dado un paciente con grupo ABO, factor Rh o idioma clínico registrados, cuando alguien abre
o filtra el listado de Pacientes, entonces puede filtrar por esos tres catálogos y ve la etiqueta
legible en su columna — nunca el uuid; y dado uno sin el dato, la celda lo declara.
**DoD:** `yarn typecheck` y `yarn lint` en verde · spec dirigido con los filtros probados en verde ·
verificación en pantalla real con captura mirada · consola sin errores nuevos.
**Estado:** HECHO — verificado en pantalla real: filtro "A" aplicado, URL con la clave real del
contrato, 11 filas devueltas y las 11 con "A" en su columna. 16/16 tests del spec dirigido, 12/12
archivos y 221/221 tests del radio de impacto real, `typecheck` y `lint` en verde, 0 errores de
consola. La regresión de la suite completa quedó `ENVIRONMENT` por agotamiento de recursos de la
máquina compartida — ver H8.S3.

### H8.S1 — Contrato, simulador y filtro

**CA:** Dado el filtro elegido, cuando se pide la página, entonces el parámetro viaja con la misma
clave que declara `PatientSearchQuery`, y el simulador lo aplica sobre datos sintéticos coherentes
con el resto del generador.
**DoD:** los tres filtros declarados, mapeados y filtrando en el simulador.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S1.M1 | Los tres campos declarados en `PatientSearchQuery` y `PatientListItem` | `typecheck` en verde | `yarn typecheck` | HECHO |
| H8.S1.M2 | `ProfilesClient.searchPatients` envía los tres parámetros | idem | idem | HECHO |
| H8.S1.M3 | El generador sintético asigna ABO/Rh/idioma con la misma convención que el resto del archivo (`f.helpers.arrayElement`, sin inventar catálogo) | Usa `GRUPO_ABO`/`RH`/`IDIOMA` ya existentes | revisión del diff de `personas.ts` | HECHO |
| H8.S1.M4 | El manejador de `/profiles/patients` filtra por los tres | Filtro real, no decorativo | revisión del diff de `profiles.handlers.ts` | HECHO |
| H8.S1.M5 | `fichaDe` deja de devolver `null` fijo para ABO/Rh/idioma | Usa el mismo dato que la fila | revisión del diff — hallazgo corregido de paso, mismo objeto | HECHO |

### H8.S2 — UI: filtro visible y columnas con etiqueta

**CA:** Dada la pantalla, cuando se elige un filtro, entonces la URL cambia y la tabla se recarga
filtrada; y cuando una fila tiene el dato, la columna muestra la etiqueta del catálogo.
**DoD:** `app-filter-bar` reemplazando la búsqueda manual, tres columnas nuevas, spec en verde.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S2.M1 | `app-filter-bar` en vez de `app-search-field`, con los tres `FilterDef` | La URL sigue usando `q` para texto libre | revisión del HTML | HECHO |
| H8.S2.M2 | Los tres catálogos se cargan una vez, con `forkJoin` y `catchError` a `[]` | Un catálogo caído no rompe la pantalla | revisión del constructor | HECHO |
| H8.S2.M3 | Tres columnas nuevas con su celda, mostrando la etiqueta, nunca el uuid | Coherente con `celdaDocumento`/`celdaTelefono` | revisión del HTML | HECHO |
| H8.S2.M4 | Spec dirigido: filtro correcto, sin dato, y el parámetro viajando a la consulta | 16/16 en verde | `yarn test --include=…patient-list.spec.ts` | HECHO |
| H8.S2.M5 | El comentario de cabecera de la clase se actualiza, sin dejar la decisión anterior contradicha en silencio | Explica el giro y por qué "Estado de seguro" sigue fuera | revisión de `patient-list.ts:56-90` | HECHO |

### H8.S3 — Verificación en pantalla real

**CA:** Dada la pantalla real, cuando se abre con un paciente que tiene los tres datos, entonces se
ven las tres columnas pobladas y los tres filtros funcionan; consola sin errores nuevos.
**DoD:** captura mirada + consola limpia + `typecheck`/`lint` en verde.
**Estado:** HECHO — la suite completa (561 archivos) crasheó 3 veces por agotamiento de recursos
de la máquina compartida (`ENVIRONMENT`, regla 80.4, evidencia de las 3 corridas pegada; no se
reintentó una cuarta vez). Se corrió en su lugar la regresión sobre el radio de impacto real del
cambio — 12 archivos, 221 tests — en verde.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H8.S3.M1 | `typecheck` global en verde tras la UI | exit 0 | `yarn typecheck` | HECHO |
| H8.S3.M2 | `lint` en verde | exit 0 | `yarn lint` | HECHO |
| H8.S3.M3 | Captura de la pantalla real con un filtro aplicado, mirada | La captura existe y está descrita | `evidencia/h8/h8-filtro-aplicado.png` — filtro «A» aplicado, 11 filas, todas con A, verificado | HECHO |
| H8.S3.M4 | Consola sin errores nuevos | Cero errores | `evidencia/h8/console-*.log` — 0 errores en las dos capturas | HECHO |
| H8.S3.M5 | Regresión del radio de impacto real del cambio | Sin rojos | `evidencia/h8/regresion-acotada.txt` — **12/12 archivos, 221/221 tests, exit 0** | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El generador pisa lo migrado (Q-A) | Alto: hasta 31 pantallas | H1.S3 la decide **antes** de la primera migración |
| Faltan fixtures en `core/mock/` y son de Ender | Medio | Regla 65: simular el contrato en tres niveles y declararlo |
| Romper alguno de los 29 consumidores de `DataTable` | Alto | `typecheck` y `test` en cada cierre de microtarea |
| El alcance (31 pantallas) excede el turno | Alto si se lee como compromiso | Dos migradas y demostradas es el objetivo; el resto queda `A MEDIAS` con las cuatro respuestas |
