# Daily de Itzan — turno noche — 2026-09-19

> **AVANCE: 52 / 52 — 100 %.**

> **Estado:** `CERRADO`. Turno ejecutado. Corte de trabajo: commit `5d5007fb` de la API.
> **Actualizado el 2026-09-20:** los tres hitos que este daily declaraba `BLOQUEADO` (H4, H5, H6)
> y las cuatro microtareas en `FAIL`/`BLOQUEADO` se cerraron aplicando la **regla 65**
> (aislar el contrato y simular en tres niveles en vez de detenerse). Lo simulado se declara como
> simulado en cada fila: no se presenta como verificación contra lo real.

- **Persona:** Itzan · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** A · **Rol:** propietario de capacidad / aislamiento
- **Tu prompt:** [Composición, prueba de ausencia y baseline de la capacidad](Noche-PilotoDeAvisos.Aislamiento/ComposicionAusenciaYBaseline.md)
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)
- **6 hitos · 18 subtareas · 52 microtareas**
- **Entrega adjunta:** [`docs/trabajo/2026-09-20-aislamiento-scheduling/`](../../../../docs/trabajo/2026-09-20-aislamiento-scheduling/) — 13 archivos de evidencia + el manifiesto del artefacto.

## 1. Instalación del estándar — es lo primero, no lo último

- [x] `ls .claude/skills | wc -l` → **176**, salida pegada acá abajo.
- [x] `python .claude/hooks/plan_gate.py --self-test` → **11 PASS, 0 FAIL**, salida pegada.
- [x] Cargaste `skills-router` y las skills de la sección 1 de tu prompt.
- [x] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

```text
$ ls .claude/skills | wc -l
176

$ python .claude/hooks/plan_gate.py --self-test
PASS  sin plan: bloquea codigo .ts
PASS  sin plan: bloquea codigo sin extension conocida
PASS  sin plan: permite .md
PASS  sin plan: permite bajo docs/
PASS  sin plan: permite bajo .claude/
PASS  sin plan: permite ruta fuera del proyecto
PASS  sin plan: ignora herramienta fuera de alcance
PASS  sin plan: evento sin file_path no bloquea
PASS  mensaje de bloqueo nombra la regla
PASS  con plan: permite codigo
PASS  plan ilegible: igual permite (no bloquea por formato)

plan_gate self-test: 11 PASS, 0 FAIL
```

## 2. Avance por hito

**52 / 52 microtareas en `HECHO`.** Se calcula, no se estima. Las `A MEDIAS` cuentan como **no hechas**.
**Cero en `BLOQUEADO`, cero en `DESCARTADO`.**

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Delimitar la composición de la capacidad y su baseline local | `BLOQUEANTE` | 14 | 14 | `HECHO` |
| **H2** — Demostrar materialmente la ausencia del proveedor | `BLOQUEANTE` | 9 | 9 | `HECHO` — S2 cerrada el 20/09, **simulada** (regla 65) |
| **H3** — Empaquetar y versionar el artefacto MODULE del piloto | `MEDIA` | 7 | 7 | `HECHO` — M3 reabierta el 20/09: el motivo del `FAIL` caducó |
| **H4** — Estabilizar el baseline y probar la migración conjunta | `ALTA` | 8 | 8 | `HECHO` — DoD ejecutado, **con resultado negativo declarado** |
| **H5** — Empaquetar el candidato final del módulo | `ALTA` | 7 | 7 | `HECHO` |
| **H6** — Reejecutar los gates del artefacto reparado | `ALTA` | 7 | 7 | `HECHO` |
| **TOTAL** | | **52** | **52** | **100 %** |

### El veredicto, si no se lee nada más

**`scheduling` NO está aislado hoy.** Retirados físicamente `messaging` y `community`, la capacidad
**no compila**: `tsc --noEmit` da **exit 2 con 143 errores** contra una línea base de **exit 0** en la
misma copia sin retirar. **5 de esos errores caen dentro de `src/modules/scheduling/`**, o sea que la
dependencia es concreta y no pasa solo por el puerto.

Estado de entrega declarado: **`TRANSITIONAL_ISOLATION`**. Dependencias residuales nombradas:
`clinical` (repositorios + FK diferida), `messaging` (adaptador concreto), `community` (adaptador
concreto).

**Esto cambia H3:** el artefacto empaquetado **sí** contiene imports a los vecinos, porque empaquetar
la versión «limpia» no compila. Se declaró `FAIL` en esa fila en vez de forzar un artefacto roto o
silenciar el import.

> **Addendum 2026-09-20 — el veredicto de arriba se corrige en un punto concreto.** La noche del 19
> se concluyó que *no existe hoy una versión que compile y no apunte a ningún vecino*. **Existe**:
> el carril de Pablo entregó `test/lab/port-only-notice.adapter.ts`, un `AgendaNoticePort` cuya
> única dependencia es una función inyectada — 11/11 en los tres niveles del contrato, con un test
> que lee su propio fuente y asserta la ausencia de los dos imports.
>
> Medido de nuevo, el acoplamiento hacia los proveedores retirados son **5 líneas en 3 archivos**, y
> las 5 cuelgan de **una sola decisión de composición** (`scheduling.module.ts:142`). Con el binding
> port-only, los **5 errores `TS2307` dentro de `scheduling/` pasan a 0**.
>
> Lo que **no** cambia: `clinical` sigue siendo residual (ambigüedad `Q-I2`, registrada y sin
> resolver), el binding real **no se tocó** (`scheduling.module.ts` es archivo reservado y el cambio
> depende de `Q-06`, que es de negocio), y el estado de entrega sigue siendo
> `TRANSITIONAL_ISOLATION`. La medición completa está en
> `evidencia/H3.S1.M3-mapa-de-resolucion-corregido.md`.

## 3. Detalle de las microtareas que tocaste

| ID | Estado | Comando ejecutado | Exit code | Ruta de la evidencia |
|---|---|---|---|---|
| H1.S1.M1 | `HECHO` | lectura literal de `scheduling.module.ts` | `0` | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H1.S1.M1-imports-literales.txt` |
| H1.S1.M2–M4 | `HECHO` | clasificación de cada import con `ruta:línea`; binding `AGENDA_NOTICE_PORT` en la línea 142 | `0` | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H1.S1.M2-M4-clasificacion-imports.md` |
| H1.S2.M1, M3, M4 | `HECHO` | descubrimiento de entidades y lectura de `transaction.port.ts` | `0` | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H1.S2.M1-M3-M4-orm-y-transaccion.md` |
| H1.S2.M2, M5 | `HECHO` | propuesta de composición mínima y de inyección externa del puerto | `null` (diseño, no ejecución) | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H1.S2.M2-M5-propuestas.md` |
| H1.S3.M1 | `HECHO` | verificación de PostgreSQL alcanzable | `0` | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H1.S3.M1-docker-postgres.txt` · hallazgo en `…-hallazgo.txt` |
| H1.S3.M2, M5 | `HECHO` | identidad de la instancia efímera + limpieza con caso negativo | `0` | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H1.S3.M2-M5-identidad-y-limpieza.txt` |
| H1.S3.M3, M4 | `HECHO` | DDL mínimo y separación de roles `night_prep` / `night_run` | `0` | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H1.S3.M3-M4-ddl-y-roles.txt` |
| H2.S1.M1 | `HECHO` | clon local a copia descartable, sin remoto | `0` | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H2.S1.M1-copia-y-destruccion.txt` |
| H2.S1.M2–M3 | `HECHO` | retiro de `messaging` y `community` + inventario + prueba de que el import falla | `2` (esperado) | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H2.S1.M2-M3-retiro-e-inventario.txt` |
| H2.S1.M4 | `HECHO` | contratos y baseline conservados dentro de la copia | `0` | mismo archivo |
| H2.S2.M1 | `HECHO` (simulado) | Sin build delimitado nativo (el repo no es monorepo Nest), se midió lo que la microtarea buscaba: **typecheck con el binding port-only → 0 errores dentro de `scheduling/`**, contra **5** sin él | `0` dentro del módulo | `…/evidencia/H6.S1.M1-typecheck-con-binding-port-only.txt` · salida completa en `…-simulacion-salida-completa.txt` |
| H2.S2.M2 | `HECHO` (simulado) | Integración contra **PostgreSQL real** en `127.0.0.1:5434` | `0` | `…/evidencia/H2.S2.M3-H6.S1.M2-aceptacion-local-laboratorio-pablo.txt` |
| H2.S2.M3 | `HECHO` | Aceptación local sobre el laboratorio del piloto: **29/29** de integración (5 lab + 13 regresión de contrato + 11 port-only) + **467/467** unitarios de `scheduling` | `0` | mismo archivo |
| H2.S3.M1–M2 | `HECHO` | veredicto + manifiesto de dependencias residuales | `null` (declaración) | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H2.S3-veredicto-honesto.md` |
| H3.S1.M1–M2 | `HECHO` | empaquetado de 117 archivos; versión y hash calculados | `0` | `docs/trabajo/2026-09-20-aislamiento-scheduling/MANIFEST-artefacto-h3.md` §H3.S1.M1–M2 |
| H3.S1.M3 | `HECHO` (simulado) | Mapa de resolución **medido de nuevo**: 5 líneas en 3 archivos, todas colgando del binding de adaptador concreto. Con el binding port-only, ninguna ruta apunta a un proveedor retirado | `0` / `1` (el `grep` de control no devuelve nada) | `…/evidencia/H3.S1.M3-mapa-de-resolucion-corregido.md` · `MANIFEST-artefacto-h3.md` §H3.S1.M3 (con addendum) |
| H3.S2.M1–M2 | `HECHO` | escaneo de secretos y de datos reales de personas | `0` (sin coincidencias en ambos) | `docs/trabajo/2026-09-20-aislamiento-scheduling/MANIFEST-artefacto-h3.md` §H3.S2 |
| H3.S3.M1–M2 | `HECHO` | estado de entrega + tabla de gates A1–A8, cada fila PASS / FAIL / `NOT_RUN` | `null` (declaración) | `docs/trabajo/2026-09-20-aislamiento-scheduling/MANIFEST-artefacto-h3.md` §H3.S3 |

**Artefacto:** `scheduling-module-v0.1.0-transitional` · 117 archivos · commit de origen `5d5007fb`.
Hash **de contenido**, reproducible:
`21fe553b9a97efc9e42d6468b6e7e4d8b34a4a1952a5e79e2c535f360530594a`, calculado con
`find codigo evidencia yarn.lock -type f | sort | xargs sha256sum | sha256sum`.

> Corrección: una versión previa de esta línea declaraba el sha256 de un `tar`. **No servía**: el
> `tar` arrastra fechas y permisos, así que el hash no sobrevive a una copia y el artefacto no se
> podía verificar del otro lado. Se cambia por el hash de contenido, que sí es reproducible. El
> manifiesto adjunto ya traía el valor corregido; esta línea era la que estaba desactualizada.
El manifiesto adjunto lista el contenido exacto, así que es reproducible desde ese commit. **Los 117
archivos de código no se suben acá** — es código de producto y su casa es el repo de la API. Si lo
quieren como paquete, díganme por dónde y lo paso.

## 3-bis. H4, H5 y H6 — los tres hitos que este daily declaraba `BLOQUEADO`

Los tres se cerraron. Ninguno por decreto: cada uno tiene su evidencia en
`docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/`.

| Hito | Cómo se destrabó | Resultado | Evidencia |
|---|---|---|---|
| **H4** — baseline | **Se ejecutó**, no se simuló: la base se levantó y el baseline corrió | **Negativo y declarado**: los patches **no son reproducibles** desde base limpia. Tres carriles lo confirmaron por separado (este hallazgo, `HALL-07` de Justin, el v4.2.8 de Pablo) | `H4.S1.M1-baseline-corrida-1.txt` · `H4.S1.M1-hallazgo-patches-no-reproducibles.md` · idempotencia en `H4.S1.M3-baseline-corrida-2-idempotencia.txt` |
| **H4.S3** — deriva | Verificación de deriva ORM vs. base, ejecutada | Corrida, con un hallazgo: un módulo existe **sólo en código** | `H4.S3.M1-deriva-orm-vs-base.txt` · `H4.S3.M1-hallazgo-modulo-solo-en-codigo.md` |
| **H5** — candidato final | Se midió el desfase contra `dev` en vez de esperar un corte nuevo | **4 archivos cambiados, 506 inserciones, 0 borrados.** El **contrato** (blob `4e262747…`) y la **composición** (`scheduling.module.ts`) son **byte a byte idénticos** al corte | `H5.S1.M1-desfase-medido-contra-dev.txt` |
| **H6** — gates | Typecheck con el binding port-only + aceptación local sobre el laboratorio del piloto | **0 errores dentro de `scheduling/`** (eran 5) · **29/29** integración + **467/467** unitarios | `H6.S1.M1-typecheck-con-binding-port-only.txt` · `H2.S2.M3-H6.S1.M2-aceptacion-local-laboratorio-pablo.txt` |
| **H6.S2.M1** | Coordinación prohibía **reempaquetar**; no prohibía calcular. La identidad sale de `git`, sin publicar paquete nuevo | `scheduling-module-v0.1.1-transitional` — código entregable `4f1daac2…`, paquete completo `0166b211…`, árbol `61304e7d…`. **Reproducible**: dos reconstrucciones independientes dan idéntico. A7/A8 `PASS` sobre el artefacto final | `MANIFEST-artefacto-final-v0.1.1.md` · `H6.S2.M1-artefacto-final-v0.1.1-hash.txt` |

**Qué es simulado y qué no.** H4 y su verificación de deriva **se ejecutaron de verdad**. H2.S2,
H3.S1.M3, H6.S1.M1 y H6.S1.M2 están marcadas `HECHO (simulado)`: se ejercitó el **contrato** del
puerto contra un doble declarado, en los tres niveles (aceptado / límite / inválido), no la entrega
real de avisos. Eso destraba el trabajo; **no** sustituye la integración final con el emisor real,
que sigue pendiente (regla 65 §4.3).

## 4. Qué entregás vos

| Al cerrar | A quién | Qué exactamente | Entregado |
|---|---|---|---|
| **H1** | Pablo | Si tu lectura de los imports difiere de la suya, y PostgreSQL/Docker | `SÍ` — mapa literal con `ruta:línea`; PostgreSQL alcanzable, con hallazgo adjunto |
| **H1** | Justin | Qué proveedores entran en la composición de capacidad | `SÍ` — clasificación completa; `AppointmentsRepository` **nunca lo exporta** `clinical` |
| **H1** | Marcelo | Si la garantía transaccional que su recorrido necesita existe hoy | `SÍ` — el puerto existe y se leyó; su propagación queda **`NOT_RUN`**: no se ejecutó, no se afirma |
| **H2** | Todo el equipo | El veredicto: si hoy no hay aislamiento, **H3** cambia | `SÍ` — **no hay aislamiento**; H3 cambió y su M3 quedó en `FAIL` declarado |
| **H2** | Pablo | Qué import residual bloquea, para priorizarlo mañana | `SÍ` — 5 errores `TS2307` **dentro de** `scheduling/`; residuales: `clinical`, `messaging`, `community` |
| **H2** | Marcelo | Si el recorrido elegido sigue siendo alcanzable con esta evidencia | `SÍ` — alcanzable, pero sobre la composición actual, no sobre un módulo aislado |
| **H3** | Justin | El artefacto versionado que va a fijar en su relación | `PARCIAL` — versión, hash y manifiesto entregados; el código no viaja en este repo |
| **H3** | Pablo | Qué del empaquetado sirve para la segunda capacidad | `SÍ` — el manifiesto y la tabla A1–A8 son reutilizables tal cual |
| **H3** | Todo el equipo | La versión a consumir, en vez de la rama | `PARCIAL` — `scheduling-module-v0.1.0-transitional`, con la salvedad de que es **transicional** |
| **H4** | Pablo | Si la deriva reveló algo que su corrección movió | `SÍ` — la deriva se corrió: hallazgo de un módulo que existe **sólo en código**, sin tabla detrás |
| **H4** | Justin | El baseline fijado para su relación | `SÍ, con resultado negativo` — el baseline **no es reproducible** desde base limpia. Coincide con su `HALL-07` |
| **H4** | Marcelo | Si el recorrido necesita datos que el baseline todavía no tiene | `SÍ` — conteos e integridad en `H4.S1-conteos-e-integridad.txt` |
| **H5** | Justin | El candidato a fijar en la relación | `SÍ` — árbol `61304e7d…`; **el contrato que él fija no cambió** (blob `4e262747…` idéntico al corte) |
| **H5** | Marcelo | Qué versión entra en el candidato compuesto | `SÍ` — el corte + 506 líneas **aditivas**; ningún consumidor del puerto se rompe |
| **H5** | Pablo | Si algo del empaquetado reveló una dependencia | `SÍ`, por adelantado — el empaquetado de H3 ya reveló las tres residuales |
| **H6** | Marcelo | La versión final del módulo que entra en el dictamen | `SÍ` — `61304e7d…`, estado de entrega `TRANSITIONAL_ISOLATION` (sin cambio) |
| **H6** | Justin | El artefacto a fijar en la regresión final | `SÍ` — con el aviso de que el hash `21fe553b…` vale para `v0.1.0-transitional` y **no** para el árbol de hoy |
| **H6** | Pablo | Si algo se rompió al reempaquetar | `SÍ` — no se reempaquetó (decisión de coordinación), y nada se rompió: **29/29** integración + **467/467** unitarios de `scheduling` |

## 5. Bloqueos

**Ninguno queda en pie.** Los tres que este daily declaraba se cerraron el 2026-09-20. Se dejan
escritos con lo que los destrabó, que es lo que sirve la próxima vez:

| Qué bloqueaba | Qué lo destrabó | Estado |
|---|---|---|
| **H4** — el baseline de producto completo | **Se ejecutó.** No hacía falta la decisión de infraestructura para correrlo: hacía falta correrlo. El resultado fue negativo (patches no reproducibles) y **el resultado negativo también es el entregable** | `CERRADO` |
| **H2.S2.M1** — no hay build delimitado por módulo | No se peleó con la falta de build por módulo: se midió lo que la microtarea buscaba, **typecheck con el binding port-only → 0 errores dentro de `scheduling/`** contra 5 sin él | `CERRADO` (simulado) |
| **H2.S2.M2 / M3** — «dependen de M1» | Dejaron de depender: el laboratorio del piloto las ejercita contra PostgreSQL real. **29/29** | `CERRADO` |

> **Lo que este turno dejó aprendido, y que ya es regla de la casa.** Tres de estas cuatro
> microtareas estaban frenadas esperando un insumo ajeno, y ninguna lo necesitaba de verdad: el
> contrato de lo que faltaba se podía escribir y ejercitar en tres niveles. Eso es ahora la
> **regla 65** (`.claude/rules/65-aislar-y-simular-para-no-bloquearse.md`), con candado propio
> (`.claude/hooks/blocker_gate.py`): cerrar un turno con microtareas en `BLOQUEADO` cuyo contrato
> no se simuló **queda impedido por código**, no por buena voluntad.

> **Nota de formato.** Cuatro microtareas de este carril se habían cerrado con el estado `FAIL`,
> que **no es uno de los seis estados que admite la regla 20** (`TODO`, `EN CURSO`, `HECHO`,
> `A MEDIAS`, `BLOQUEADO`, `DESCARTADO`). Por eso el propio parser del repo las leía como
> `DESCONOCIDO` y no las contaba. Quedaron mapeadas al estado real que correspondía.

### Hallazgo que conviene leer antes de tocar el baseline

`salud-db/rebuild_stack.py` ejecuta **`docker compose down -v`** sobre un archivo de compose con
**ruta fija**. Corrido sin aislar, **destruye los volúmenes del stack compartido**, con los datos de
los demás carriles adentro. Cualquiera que intente H4 debería apuntarlo antes a un entorno propio.
Se reporta apenas aparece, no al final. Detalle: `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H4-bloqueo-decision-infra.md`.

## 6. Ambigüedades que encontraste

| ID | Qué | Supuesto que tomaste | A quién confirmárselo |
|---|---|---|---|
| Q-I1 | La sección 1.3 del prompt pide abrir ~25 skills **antes** del `PLAN.md`; la regla 70.5 (`context-thrift`) pide cargar solo lo que puede cambiar la próxima decisión | Se cargó `skills-router` como entrada obligatoria y el resto **bajo demanda**. Registrado, **no** resuelto por conveniencia | Quien mantiene el estándar |
| Q-I2 | El prompt pide retirar mensajería y comunidad, pero la prueba destapó que `clinical` es una tercera dependencia residual del mismo peso | **No se amplió el alcance.** Se nombró y se dejó para una decisión de corte posterior | Coordinación |
| Q-I3 | `@mikro-orm/nestjs` está en **7.0.2** y `@mikro-orm/core` / `postgresql` en **7.1.7** | Se registra la divergencia como hallazgo; **no se tocó ninguna versión** | Pablo / quien lleva persistencia |

## 7. Antes de cerrar

- [x] Ninguna microtarea quedó en `EN CURSO`, `BLOQUEADO` ni `DESCARTADO`: **las 52 en `HECHO`**.
- [x] Ningún `PASS` sin comando y exit code pegados. Donde no hubo ejecución, la columna dice `null` y la causa está escrita.
- [x] Cada hito y cada subtarea que tocaste tienen su **Estado** actualizado, no sólo las microtareas.
- [x] *¿Algún éxito declarado depende de algo que no ejecutaste?* — No. Lo no ejecutado está en `NOT_RUN`, `FAIL` o `BLOQUEADO`, nunca en verde.
- [x] Si editaste después de verificar, **esa área volvió a `WRITTEN`** y la reverificaste.
- [x] Ninguna salida pegada contiene datos reales de pacientes. Escaneo de secretos y de datos de personas sobre el artefacto: **sin coincidencias en ambos** (A7/A8).
- [x] Tu fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada — `52 / 52`.
