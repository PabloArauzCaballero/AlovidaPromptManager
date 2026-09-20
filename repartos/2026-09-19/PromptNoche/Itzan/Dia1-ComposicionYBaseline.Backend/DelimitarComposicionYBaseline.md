# Delimitar la composición de la capacidad y su baseline local

> **Rol:** propietario de capacidad / aislamiento · **Línea:** A · **Día del plazo:** 1 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · aplica [PROMPT_MAESTRO_BACKEND_AUTONOMO.md](../../../../../../../Downloads/BACKEND_AUTONOMO_MANTRA/BACKEND_AUTONOMO_MANTRA/PROMPT_MAESTRO_BACKEND_AUTONOMO.md)
> **Tu encargo sale de:** `PILOTO_MANTRA.md` paso 3 · `ARQUITECTURA_Y_CONTRATOS.md` §2, §4 y §5 · `PERFIL_MANTRA_DEV.md` §3 hallazgos 2, 3 y 4

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `DIAGNOSE_DESIGN` — **no modificás el backend esta noche**. La composición se **propone** hoy; se construye cuando el corte y el contrato estén fijados |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Si no lo tenés clonado, clonalo y registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | **El SHA que fija Pablo esta misma noche**. Hasta que lo publique, `32ae939983f0d665e4ed371362858801134d35cd` y marcá con qué SHA trabajaste |
| `AUTHORIZED_BATCH` | Documentos, diagramas y DDL de baseline **en tu directorio de evidencia**. Cero escrituras en `src/` de Mantra |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis). El registro funcional original **no está identificado**: límite a arrastrar |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar disponibilidad, no asumirla** — el resultado de Pablo (su M8) es tu insumo |
| `Escritura permitida` | Solo tu directorio de evidencia. El puerto `agenda-notice.port.ts` es **de Ender**: no lo toques ni lo "arregles" |

## 1. Resultado observable

Al cerrar tu turno, el equipo puede leer un solo documento y saber **qué carga hoy `SchedulingModule` y por
qué**, **qué composición mínima se propone para la capacidad del piloto**, y **cómo se levanta una base de
pruebas aislada e identificable** — sin que nadie tenga que volver a rastrear imports.

**Kill-test (lo más barato que demuestra que NO está hecho):** preguntá a cualquiera si el ORM descubre las
entidades por glob global y qué hace `HistoryMirrorSubscriber` al arrancar la capacidad sola. Si nadie lo
sabe sin abrir `orm.config.ts`, no está hecho.

## 2. Alcance

**IN:** imports reales de la composición de scheduling y su clasificación · ubicación del binding
`AGENDA_NOTICE_PORT` → adaptador · comportamiento real del descubrimiento de entidades y del subscriber ·
lectura del puerto de transacción existente · **propuesta** de composición de capacidad · diseño del baseline
local por ejecución con su identidad, DDL mínimo, roles y limpieza · tabla de propiedad de datos de la capacidad.

**OUT:** editar `scheduling.module.ts`, `orm.config.ts` o cualquier fuente de Mantra · **ejecutar la prueba de
ausencia** (es Día 2, `PLAN_SEIS_DIAS.md`) · decidir la semántica del contrato (es de Ender) · escribir el
adaptador real (es de Justin) · crear una abstracción de transacción nueva · crear workspaces o paquetes nuevos
antes de comprobar que alcanza con puntos de entrada delimitados (`ARQUITECTURA_Y_CONTRATOS.md` §2).

## 3. Plan

### Hito H1 — Está delimitado qué carga la capacidad y sobre qué base se prueba

*Se le puede mostrar a cualquiera: "esto es lo que hoy arrastra el módulo, esta es la composición mínima que
proponemos, y así se levanta una base de pruebas que no se pisa con la de nadie".*

**CA del hito:** Dado tu documento, cuando otra persona intenta levantar la capacidad aislada en otra máquina,
entonces sabe exactamente qué proveedores necesita, qué entidades registrar y qué base crear — y cuando algo
falta, tu documento ya decía que iba a faltar.

---

#### Subtarea S1.1 — Qué carga hoy la composición (hechos, no impresiones)

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Verificar por tu cuenta los imports de `src/modules/scheduling/scheduling.module.ts` en el corte | La lista es literal del archivo en el SHA declarado, no la del paquete ni la que te pasaron | Bloque de imports pegado. El mapa de Pablo (su M10) es tu punto de partida: **contrastalo, no lo copies**. Si difiere, gana el archivo y la diferencia se registra |
| M2 | Clasificar cada import: dependencia de tipos, de arranque, de persistencia o sólo de composición | Cada import tiene exactamente una clasificación y un motivo | Tabla completa. **Toda la clasificación es `HYPOTHESIS` hasta la prueba de ausencia del Día 2**: marcarla así es parte del DoD, no un detalle |
| M3 | Localizar dónde se vincula `AGENDA_NOTICE_PORT` con el adaptador de mensajería | Hay archivo y línea reales, verificados abriendo el archivo | Fragmento pegado con localizador. **No des por buena una ruta que no abriste** |
| M4 | Registrar qué repositorios privados o clínicos necesitan las escrituras de la capacidad candidata | Está la lista, y para cada uno si es propio, de referencia o privado de otra capacidad | Tabla de propiedad de datos de `ARQUITECTURA_Y_CONTRATOS.md` §4. Si las escrituras requieren repositorios privados clínicos, el paquete manda **evaluar otra subcapacidad o exponer operaciones públicas** — registrá la opción, no la ejecutes. Y **no muevas el problema a un paquete llamado `base`** (§3 del piloto, textual) |

#### Subtarea S1.2 — ORM, arranque y transacción: lo que un cambio de imports NO resuelve

> `PERFIL_MANTRA_DEV.md` §3.3 es explícito: *un cambio de imports por sí solo no delimita el arranque*.
> Esta subtarea existe porque ahí es donde el aislamiento se suele caer.

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M5 | Registrar qué hace `src/orm/config/orm.config.ts`: globs de descubrimiento, `TsMorphMetadataProvider`, caché de metadata y `HistoryMirrorSubscriber` | Los cuatro puntos están respondidos con fragmento literal, no con un resumen | Fragmentos pegados. **Los conteos escritos en comentarios del código no se adoptan como inventario medido** |
| M6 | Proponer la configuración explícita de entidades mínimas para el entorno local | Está la lista de entidades y, para cada una, por qué la capacidad la necesita | Lista + justificación. Si el subscriber o la metadata todavía arrastran fuentes privadas de otro proveedor, el estado es `TRANSITIONAL_ISOLATION`, no "listo". **Prohibido desactivar controles para que arranque** |
| M7 | Revalidar la API que vas a usar contra la versión **instalada** de MikroORM, no contra la documentación más nueva | Está citada la página consultada y la versión que documenta, contra la versión que el lockfile fija (`7.1.7` core, adaptador Nest `7.0.2`) | Cita + nota de diferencia. El paquete advierte que la página consultada mostraba **7.2**: si escribís configuración con API de 7.2 sobre un 7.1.7 instalado, inventaste |
| M8 | Leer `src/persistence/ports/transaction.port.ts` y su implementación | Está registrado si `TransactionManager.execute` y `TransactionContext` existen, y si la propagación está **verificada o no** | Fragmentos pegados. **Sin ejecución, la propagación es `NOT_RUN`, no "funciona"**. No supongas que `fork`, decoradores anidados o transacciones separadas se unen (`ARQUITECTURA_Y_CONTRATOS.md` §5). Si no comparten garantía, `TRANSITIONAL_ISOLATION` antes de fragmentar nada |
| M9 | Propuesta de composición de capacidad que reciba `AGENDA_NOTICE_PORT` **desde afuera** | El documento lista qué proveedores entran (repositorios propios, auth, auditoría, infra base) y qué queda fuera | Documento de composición. Debe decir explícitamente que **`overrideProvider` sobre `AppModule` no es prueba de aislamiento** y por qué (el grafo pudo cargar proveedores privados antes del reemplazo), y que un contexto standalone sin HTTP **no prueba guards ni pipes de una ruta HTTP** |

#### Subtarea S1.3 — Baseline que no se pisa con el de nadie

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M10 | Verificar que hay un PostgreSQL alcanzable y si Docker responde | Está el resultado real con el error exacto si no hay | Salida pegada. Si no hay, el estado es `BLOCKED` con motivo — **nunca `PASS`**, y **nunca sustituido por SQLite** para afirmar equivalencia de bloqueos o RLS (`ARQUITECTURA_Y_CONTRATOS.md` §4.2) |
| M11 | Diseñar la identidad de la base de pruebas **por ejecución** | Cada corrida tiene una base identificable, y está escrito cómo se identifica | Esquema de nombres + comprobación. Un esquema alternativo sirve **sólo** si no hay nombres cualificados, extensiones ni triggers que escapen del aislamiento: verificalo o declaralo no verificado |
| M12 | Definir el DDL versionado mínimo: tablas propias, de referencia y de auditoría de la capacidad | Está la lista con sus restricciones y políticas pertinentes al caso | DDL en tu directorio de evidencia. Los registros de referencia de un proveedor ausente son **baseline contractual**, no implementación del proveedor |
| M13 | Separar rol de preparación y rol de runtime | Están los dos roles y qué privilegios tiene cada uno | Definición escrita. El rol de runtime **no** puede tener privilegios que evadan la política que se va a probar: si los tiene, la prueba no prueba nada |
| M14 | Definir la limpieza con comprobación de identidad y destino | La rutina de limpieza rechaza una base que no sea la del run | Especificación + el caso negativo que la rechaza. **La limpieza no debe poder aceptar una base compartida por un nombre arbitrario** (§4.6). Este es el control que evita borrar la base de un compañero |

## 4. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20 de septiembre de 2026** y hoy es **19 de septiembre de 2026** | Quien encargó el paquete | Nada técnico; afecta a qué "Día 1" significa |
| Q-06 | Obligatoriedad y durabilidad del aviso (la tensión que levantó Pablo y registra Ender) | Decisión de negocio | Si el aviso es obligatorio, tu composición necesita intención duradera; si es opcional, no. **No elijas vos** |
| Q-08 | Qué operación concreta se aísla: la demora del profesional o la emisión de recordatorio | Quien definió el alcance del piloto | El conjunto de repositorios y entidades mínimas. El paquete dice elegirla **después de leer servicios, repositorios y tests**; si esta noche no alcanza, entregá las dos opciones con su costo |
| Q-09 | Si el descubrimiento por glob y el subscriber pueden delimitarse sin tocar código compartido | Se resuelve con la prueba de ausencia del Día 2, no por lectura | El grado de aislamiento alcanzable. Hasta entonces: `HYPOTHESIS` |

## 5. Definition of Done del hito

- [ ] Las 14 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Toda clasificación de dependencias está marcada `HYPOTHESIS` hasta la prueba de ausencia.
- [ ] Ninguna propuesta de composición se presenta como aislamiento demostrado: eso se demuestra el Día 2, ejecutando.
- [ ] Ningún control se desactivó para que algo arranque, y no hay ningún paquete nuevo llamado `base`, `common` o `shared` creado para esconder una dependencia.
- [ ] Avance reportado como `microtareas HECHO / 14`, no como porcentaje a ojo.

## 6. Handoff

Al cerrar, avisá por el daily a:
- **Pablo** → si tu lectura de los imports difiere de la suya (M1), y el resultado de PostgreSQL/Docker (M10).
- **Ender** → qué necesita transportar el contrato para que tu composición valide tenant y actor (su M10).
- **Justin** → qué proveedores entran en la composición de capacidad (M9): es lo que su adaptador va a tener enfrente.
- **Marcelo** → si el recorrido que elige exige una unidad transaccional que cruza capacidades, tu M8 dice si eso hoy está garantizado o no.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
