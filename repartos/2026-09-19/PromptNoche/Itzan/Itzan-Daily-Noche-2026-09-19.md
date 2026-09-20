# Daily de Itzan — turno noche — 2026-09-19

> **Estado:** `CERRADO`. Turno ejecutado. Corte de trabajo: commit `5d5007fb` de la API.

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

**26 / 52 microtareas en `HECHO`.** Se calcula, no se estima. Las `A MEDIAS` cuentan como **no hechas**.

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Delimitar la composición de la capacidad y su baseline local | `BLOQUEANTE` | 14 | 14 | `HECHO` |
| **H2** — Demostrar materialmente la ausencia del proveedor | `BLOQUEANTE` | 9 | 6 | `A MEDIAS` (1 FAIL declarado, 2 BLOQUEADO) |
| **H3** — Empaquetar y versionar el artefacto MODULE del piloto | `MEDIA` | 7 | 6 | `A MEDIAS` (1 FAIL declarado) |
| **H4** — Estabilizar el baseline y probar la migración conjunta | `ALTA` | 8 | 0 | `BLOQUEADO` |
| **H5** — Empaquetar el candidato final del módulo | `ALTA` | 7 | 0 | `BLOQUEADO` (cascada de H4) |
| **H6** — Reejecutar los gates del artefacto reparado | `ALTA` | 7 | 0 | `BLOQUEADO` (cascada de H4) |
| **TOTAL** | | **52** | **26** | |

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
| H2.S2.M1 | **`FAIL`** | build delimitado por módulo: **no existe de forma nativa**, el repo no es monorepo Nest. Typecheck completo: **exit 2, 143 errores** vs. baseline **exit 0** | `2` | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H2.S2-gates-en-la-copia.txt` |
| H2.S2.M2 | `BLOQUEADO` | — | `null` | depende de M1. Causa en el mismo archivo |
| H2.S2.M3 | `BLOQUEADO` | — | `null` | depende de M2 |
| H2.S3.M1–M2 | `HECHO` | veredicto + manifiesto de dependencias residuales | `null` (declaración) | `docs/trabajo/2026-09-20-aislamiento-scheduling/evidencia/H2.S3-veredicto-honesto.md` |
| H3.S1.M1–M2 | `HECHO` | empaquetado de 117 archivos; versión y hash calculados | `0` | `docs/trabajo/2026-09-20-aislamiento-scheduling/MANIFEST-artefacto-h3.md` §H3.S1.M1–M2 |
| H3.S1.M3 | **`FAIL`** | mapa de resolución: el artefacto **sí** resuelve a los vecinos. Declarado en vez de forzar un paquete roto | `null` | `docs/trabajo/2026-09-20-aislamiento-scheduling/MANIFEST-artefacto-h3.md` §H3.S1.M3 |
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
| **H4** | Pablo | Si la deriva reveló algo que su corrección movió | `NO` — H4 bloqueado |
| **H4** | Justin | El baseline fijado para su relación | `NO` — H4 bloqueado |
| **H4** | Marcelo | Si el recorrido necesita datos que el baseline todavía no tiene | `NO` — H4 bloqueado |
| **H5** | Justin | El candidato a fijar en la relación | `NO` — cascada de H4 |
| **H5** | Marcelo | Qué versión entra en el candidato compuesto | `NO` — cascada de H4 |
| **H5** | Pablo | Si algo del empaquetado reveló una dependencia | `SÍ`, por adelantado — el empaquetado de H3 ya reveló las tres residuales |
| **H6** | Marcelo | La versión final del módulo que entra en el dictamen | `NO` — cascada de H4 |
| **H6** | Justin | El artefacto a fijar en la regresión final | `NO` — cascada de H4 |
| **H6** | Pablo | Si algo se rompió al reempaquetar | `NO` — cascada de H4 |

## 5. Bloqueos

| Qué bloquea | Qué intentaste | Qué lo destraba | De quién depende |
|---|---|---|---|
| **H4** — el baseline de producto completo (1 184 tablas, ~1,46 M filas) | Se verificó que el intérprete y el script existen, y se leyó su camino completo. **No se ejecutó** | Una decisión de infraestructura nueva: una base de producto completa, aislada y con etiqueta propia, más el margen de memoria para sostenerla junto a lo que ya corre | Coordinación / quien decide infraestructura |
| **H2.S2.M1** — no hay build delimitado por módulo | Se buscó la forma nativa de compilar solo la capacidad | El repo no es un monorepo Nest; haría falta declarar esa configuración, que está fuera del alcance de esta tarjeta | Decisión de arquitectura del repo |
| **H2.S2.M2 / M3** | — | Dependen de M1 | — |

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

- [x] Ninguna microtarea quedó en `EN CURSO`: todas en `HECHO`, `BLOCKED`, `A MEDIAS` o `TODO`.
- [x] Ningún `PASS` sin comando y exit code pegados. Donde no hubo ejecución, la columna dice `null` y la causa está escrita.
- [x] Cada hito y cada subtarea que tocaste tienen su **Estado** actualizado, no sólo las microtareas.
- [x] *¿Algún éxito declarado depende de algo que no ejecutaste?* — No. Lo no ejecutado está en `NOT_RUN`, `FAIL` o `BLOQUEADO`, nunca en verde.
- [x] Si editaste después de verificar, **esa área volvió a `WRITTEN`** y la reverificaste.
- [x] Ninguna salida pegada contiene datos reales de pacientes. Escaneo de secretos y de datos de personas sobre el artefacto: **sin coincidencias en ambos** (A7/A8).
- [ ] Tu fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada. — **pendiente de este PR**
