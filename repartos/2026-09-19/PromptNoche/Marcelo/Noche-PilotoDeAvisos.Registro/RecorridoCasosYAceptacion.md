# Recorrido del registro: selección, casos y aceptación

> **Rol:** cierre funcional e integración · **Línea:** B · **Fecha:** 2026-09-19 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · **Requisitos del cliente:** [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
> **6 hitos · 18 subtareas · 54 microtareas**, todas con criterio de aceptación y Definition of Done.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `WORKSPACE` | Checkout real de `mantra-core-health-api`. Registrá la ruta exacta. No inventar ruta |
| `TARGET_REF` | `32ae939983f0d665e4ed371362858801134d35cd`. **Reconsultá y fijá el actual**; si cambió, ese es tu corte y lo declarás |
| `AUTHORIZED_BATCH` | Tu directorio de evidencia. **Cero escrituras en `src/` de Mantra** salvo donde un hito lo autorice explícitamente |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis) + los requisitos del cliente |
| `ALLOWED_INFRA` | Lectura del repo, `git`, `yarn`, `node`. PostgreSQL y Docker: **verificar, no asumir** |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

> **Esta sección no es opcional y no es el final del día: es lo primero.** Un prompt ejecutado sin
> el estándar cargado produce trabajo que después hay que rehacer, porque no va a tener plan,
> ni evidencia, ni reporte. **Si no podés completar este paso, estás `BLOQUEADO`: avisalo y no sigas.**

### 1.1 Instalar el estándar en tu checkout

```bash
# 1. Clonar el estandar al lado del repo de producto
git clone https://github.com/PabloArauzCaballero/AlovidaPromptManager.git ../AlovidaPromptManager

# 2. Copiarlo DENTRO de tu checkout de trabajo (Claude Code solo carga desde ./.claude/)
cp -r ../AlovidaPromptManager/.claude   ./
cp    ../AlovidaPromptManager/AGENTS.md ./
cp -r ../AlovidaPromptManager/.agents   ./   # solo si tu herramienta no lee .claude/

# 3. Verificar que quedo instalado (pega esta salida en tu daily)
ls .claude/skills | wc -l        # -> 176
ls .claude/rules/*.md | wc -l    # -> 14
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

**Si el `git clone` falla con 404:** el estándar todavía **no está publicado en GitHub** (el push
quedó bloqueado el 2026-09-19). Pedíselo a Pablo por copia directa y registralo como límite de
acceso. **Un 404 no demuestra que el repositorio no exista.**

**No commitees `.claude/` dentro del repo de producto sin acordarlo con el equipo.** Instalarlo en
tu checkout es tuyo; agregarlo al repo compartido es una decisión de todos.

### 1.2 Qué te instala eso

Dos candados que **bloquean de verdad** mientras trabajes con Claude Code:

| Candado | Qué impide |
|---|---|
| `plan_gate.py` | Escribir código sin `PLAN.md` en disco. Nunca bloquea `.md` ni nada bajo `docs/`, así que siempre podés crear el plan primero |
| `report_gate.py` | Cerrar la sesión con trabajo activo y sin `REPORTE.md`, o con un reporte al que le falta alguna de las tres secciones |

**En cualquier otra herramienta (Cursor, Codex, Copilot, Continue, Windsurf, Cline) los candados NO
corren.** El plan y el reporte siguen siendo igual de obligatorios; lo único que cambia es que nadie
te va a frenar. Ahí la disciplina la ponés vos y la controla quien revisa el PR.

### 1.3 Skills que tenés que CARGAR para este lote

Son **33**: 11 del proceso, que carga todo el equipo, y 22 propias de
*Recorrido del registro: selección, casos y aceptación*. Cargar = abrirlas y leerlas antes de empezar, no tenerlas en disco.

**Del proceso — obligatorias para todos:**

| Skill | Para qué |
|---|---|
| `skills-router` | la entrada al catalogo: mapea la situacion concreta a la skill que toca |
| `factual-discovery` | confirmar el sistema real antes de planificar |
| `milestone-planning` | descomponer en hitos, subtareas y microtareas con CA y DoD |
| `anti-hallucination-guard` | localizar lo existente antes de crear; no inventar APIs de terceros |
| `evidence-and-verification` | que podes afirmar con que evidencia |
| `scope-discipline` | no tocar nada fuera del alcance declarado |
| `rationalization-guard` | las excusas tipicas para saltear una verificacion, y su contramedida |
| `context-thrift` | leer por rangos y busqueda, no archivos enteros |
| `progress-reporting` | checkpoints visibles en cada apertura y cierre de microtarea |
| `finish-your-turn` | como se cierra un turno sin dejar nada colgado |
| `work-report-md` | como se redacta el reporte de cierre |

**De tu lote:**

| Skill | Para qué |
|---|---|
| `requirements-and-acceptance` | como se escribe un criterio de aceptacion observable |
| `vertical-slicing` | cortar por recorrido, no por capa |
| `outcome-first` | definir el resultado observable antes de abrir un archivo |
| `qa-strategy` | que se prueba en cada nivel |
| `uat-acceptance-signoff` | que exige un dictamen de aceptacion |
| `data-privacy-phi` | gate obligatorio en todo lo que toque datos de personas |
| `regulatory-compliance-mapping` | que obligaciones caen sobre los recorridos elegidos |
| `test-case-design-techniques` | partición, valores límite, tablas de decisión |
| `synthetic-test-data-generation` | datos realistas sin datos reales |
| `edge-case-data-catalog` | los bordes que no se te ocurren solos |
| `authz-access-control` | deny by default, por rol y por propiedad |
| `multi-tenancy` | toda consulta filtra por organización |
| `accounting-double-entry` | dinero en enteros, nunca float |
| `insurance-workflows` | copagos, deducibles y aprobación parcial |
| `state-machines-workflows` | transiciones legales y precondición en la escritura |
| `concurrency-and-locking` | atomicidad del proceso que cruza capacidades |
| `clinical-records` | qué exige un registro clínico que no se puede improvisar |
| `audit-trail-history` | toda lectura de dato clínico deja rastro |
| `qa-evidence-reporting` | el reporte de evidencia de la campaña |
| `progress-reporting` | el rojo se reporta apenas aparece |
| `exploratory-testing` | lo que los casos escritos no encuentran |
| `work-report-md` | las tres secciones obligatorias |

Entrá siempre por `skills-router`: **no leas el catálogo entero, no sirve.** El router mapea la
situación concreta ("voy a tocar un endpoint", "voy a diseñar una pantalla") a la skill que
corresponde, y fija la precedencia cuando dos se pisan.

### 1.4 DoD de esta sección — se verifica como cualquier otra

- [ ] `ls .claude/skills | wc -l` devolvió **176**, y la salida está pegada en tu daily.
- [ ] `python .claude/hooks/plan_gate.py --self-test` devolvió **11 PASS, 0 FAIL**, salida pegada.
- [ ] Leíste `skills-router` y las 33 skills de las dos tablas.
- [ ] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

**Sin estas cuatro casillas, tu lote arranca en `BLOQUEADO`, no en `EN CURSO`.**

> ### ✅ Hechos ya verificados contra el corte — no los repitas
>
> Las afirmaciones técnicas de este prompt salían del paquete, que es **la lectura de otra persona**.
> El 2026-09-19 se contrastaron contra el repositorio real, leyendo el corte
> `32ae939983f0d665e4ed371362858801134d35cd`. El detalle con localizadores está en
> [`VERIFICACION-CONTRA-CODIGO-2026-09-19.md`](../../../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md).
>
> **Ya confirmado, no hace falta que lo rehagas:**
>
> - **Pista fuerte para tu microtarea del registro original.** El comentario de
>   `agenda-notice.port.ts` cita: *«Los cuatro avisos que **el registro del cliente** pide
>   (**3.4, 3.5, 4.2 y 4.3**)»*, y más abajo *«**TAREA-15, punto 1 y 3 del pedido**»*.
>   **El registro original tiene secciones numeradas.**
> - El documento transcrito en [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
>   **no tiene numeración**. Eso **debilita** la hipótesis de que sean el mismo artefacto: se
>   solapan en contenido, pero probablemente no son el mismo documento. **`Q-04` sigue abierta**, y
>   ahora buscás algo concreto: un documento con secciones 3.x y 4.x y un pedido «TAREA-15».
> - Segunda pista: el script `ddl:sources` corre
>   `python ../mantra-core-health-model/salud-db/check_ddl_sources.py`. El backend espera el
>   **modelo canónico como checkout hermano**. El paquete lo reportó 404: eso es un **límite de
>   acceso**, no una inexistencia.
> - `package.json` tiene **112 scripts**, entre ellos `test:e2e` y `smoke`.
>
> **El corte se movió:** `32ae939…` **es ancestro** del `HEAD` de `dev`, con **2 commits** de
> diferencia (`dev` = `5d5007f…`, 2026-09-19T21:33). Cuál de los dos es el corte de trabajo lo
> fija Pablo, no esta verificación.
>
> ⚠️ **Lo que esa verificación NO hizo: ejecutar.** No se corrió build, ni tests, ni arranque.
> **Que un símbolo exista no prueba que haga lo que su comentario promete.** Todo lo que sea
> comportamiento sigue siendo tuyo.
>
> 🔧 **Y una trampa de método, porque te va a pasar:** buscar con `git grep <SHA>` sobre un clon
> parcial (`--filter=blob:none`) en una ruta larga de Windows devolvió **`NOT_FOUND` para tres
> clases que sí existen**. El error real era `fatal: ... Filename too long`, y un `2>/dev/null` se
> lo comía. Usá `git cat-file -p <SHA>:<ruta>` y `git ls-tree -r --name-only <SHA>`.
> **Si tu búsqueda no encuentra algo, verificá primero que tu búsqueda funcione.**

## 2. Resultado observable

Al cerrar el turno, estos son los seis resultados que alguien tiene que poder **ver**, en este orden de dependencia:

| Hito | Prioridad | Qué queda demostrado |
|---|---|---|
| **H1** | `BLOQUEANTE` | Al cerrar tu turno, el equipo puede abrir un solo documento y saber **qué recorrido funcional atacamos primero, por qué ése, qué participantes exige, y con qué localizadores reales se verifica** — más la advertencia explícita de si el frontend que se va a usar está corriendo contra datos de demostración. |
| **H2** | `ALTA` | El recorrido elegido tiene sus casos de aceptación escritos en dado/cuando/entonces, con datos sintéticos definidos y el oráculo de cada uno identificado. |
| **H3** | `ALTA` | El recorrido tiene demostrado que un actor de otra organización no puede leer ni escribir, que las transiciones de estado ilegales se rechazan, y que el dinero no se calcula con números flotantes ni mezcla monedas. |
| **H4** | `MEDIA` | El recorrido que cruza varios módulos se ejercitó de punta a punta, y está declarado exactamente qué participante real faltó en cada paso. |
| **H5** | `ALTA` | Existe una matriz de pasos del recorrido con su evidencia, que dice para cada uno si se ejercitó con participantes reales, con dobles, o no se ejercitó — y los fallos críticos están arriba, no al final. |
| **H6** | `ALTA` | Hay un dictamen que dice, sin eufemismos, qué quedó aprobado con evidencia, qué quedó pendiente, y qué depende de un tercero que no estuvo disponible. |

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** El alcance se entrega completo y ordenado por dependencia: se cierra lo que se pueda, y **lo que no se cierra queda `A MEDIAS` con qué anda, qué no anda y qué falta exactamente** (regla 20). Recortar alcance es una decisión de coordinación, no tuya, y se registra.

**Kill-test del turno completo:** preguntá si el recorrido elegido se puede verificar hoy contra el backend real o si el frontend compila con `mockBackend` activo. Si nadie lo sabe, no está hecho — y si alguien contesta sin haber abierto el archivo de entorno que **se compila**, está adivinando.

## 3. Alcance

**IN:** localización (o registro de ausencia) del registro funcional original · corte de los dos frontends · qué configuración de entorno se compila realmente y qué banderas de demo quedan activas · orden de los escenarios por dependencias · recorrido prioritario elegido con criterio escrito · participantes exigidos · qué capacidad concreta queda fuera por la exclusión del cobro · relaciones que el recorrido exige, una por tarea de integración · demanda contra capacidad, con lo desconocido declarado desconocido · casos en dado/cuando/entonces del recorrido elegido · datos sintéticos con ownership coherente · oráculo por caso, con su fuente en el documento del cliente · casos negativos · qué queda `DECISION_REQUIRED` por falta de regla · matriz de autorización negativa del recorrido · transiciones legales e ilegales · dinero en enteros de la menor unidad, moneda y redondeo · deducibles y copagos según el documento del cliente · PHI fuera de logs y URLs · ejecución del recorrido multi-módulo · unidad transaccional donde el proceso la exija · lista de proveedores externos pendientes · qué pasos corrieron con dobles · correspondencia con el documento del cliente · matriz de pasos con evidencia · ejecución con los participantes reales disponibles · fallos críticos declarados primero · decisiones de alcance explícitas · correspondencia final con el documento del cliente · dictamen con aprobado / pendiente / bloqueado · evidencia por recorrido exigido · límites externos declarados · consolidación de todo lo «no cubierto» de los reportes anidados · riesgos residuales.

**OUT:** implementar cualquier parte del recorrido · ejecutar Playwright o llamadas reales · decidir la semántica del contrato de avisos (es de Ender) · armar composición ni baseline (es de Itzan) · escribir el adaptador (es de Justin) · **inventar reglas, porcentajes, fórmulas o catálogos** que el registro no define · recortar requisitos en silencio para que entren en el plazo · implementar nada · ejecutar los casos · **inventar una regla, un porcentaje, una fórmula o un catálogo** que el documento del cliente no define · usar datos reales de personas · implementar los controles que falten (se reportan) · **definir un porcentaje, una fórmula o una regla de cobertura** que el cliente no definió · usar datos reales · declarar el recorrido aprobado si falta un participante · declarar aceptación del producto · sustituir integración externa por fixtures y no decirlo · **rellenar reglas desconocidas** · presentar el piloto como todo Mantra · firmar aceptación del producto si falta un participante exigido · **sustituir integración externa por fixtures** · presentar un resumen optimista con algo en rojo · recortar requisitos en silencio para que cierre · firmar `PRODUCT_ACCEPTANCE_VERIFIED` sin C completo para el alcance exigido · **enterrar una limitación en un reporte anidado** · resumen optimista con algo en rojo · porcentaje estimado a ojo.

## 4. Plan — hitos, subtareas y microtareas

Los seis estados permitidos son exactamente: `TODO`, `EN CURSO`, `HECHO`, `A MEDIAS`, `BLOQUEADO` y `DESCARTADO`. **`A MEDIAS` es legítimo; disfrazarlo de `HECHO` no.** Una microtarea cuyo DoD no se ejecutó nunca es `HECHO`, aunque el código esté escrito.

### H1 — Seleccionar el recorrido prioritario del registro y sus relaciones

**Prioridad:** `BLOQUEANTE`

**CA:** Dado tu documento, cuando el equipo arranca, entonces cada persona sabe qué relación le toca preparar y contra qué localizador se va a verificar el recorrido — sin volver a discutir la prioridad y sin que nadie confunda una pantalla de demo con backend funcionando.

**DoD:** Las 13 microtareas en `HECHO` o `BLOCKED`. El documento dice en su primera pantalla si lo que se ve puede venir de datos de demostración. Ninguna regla ni porcentaje completado por criterio propio.

**Kill-test del hito:** preguntá si el recorrido elegido se puede verificar hoy contra el backend real o si el frontend compila con `mockBackend` activo. Si nadie lo sabe, no está hecho — y si alguien contesta sin haber abierto el archivo de entorno que **se compila**, está adivinando.

**Estado:** TODO

#### H1.S1 — La fuente funcional y qué tan real es lo que vemos

**CA:** Dado el frontend que se va a usar, cuando alguien pregunta si lo que ve viene del backend real, entonces tu documento responde citando el archivo de entorno **que se compila**, no el que existe.

**DoD:** Las 4 microtareas en `HECHO`, con los fragmentos de `environment.development.ts`, `environment.real-api.ts` y la configuración de build pegados. **No encontrar el registro original no demuestra que no exista**: se registra como límite de acceso.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Buscar el registro funcional original aprobado y registrar el resultado | Queda escrito qué buscaste, dónde, y si apareció | Patrones de búsqueda y resultados pegados. **No encontrarlo no demuestra que no exista**: se registra como límite de acceso (Q-04) y se nombra a quién pedírselo. Y **no se adopta una auditoría o matriz derivada como sustituto del original** | TODO |
| H1.S1.M2 | Fijar el corte real de los dos repositorios de frontend | Los SHA registrados corresponden al `HEAD` consultado, con fecha y hora | Salida literal de `git rev-parse HEAD` y `git log -1` en cada checkout. Si el SHA cambió respecto del paquete, ése es tu corte y lo declarás | TODO |
| H1.S1.M3 | Registrar **qué configuración de entorno se compila** y qué banderas de demo quedan activas | Está respondido, con fragmento del archivo: valor de `mockBackend`, `campaignsDemo`, `paymentDemo` y `loyaltyDemo`, y **cuál archivo gana en el build que se usa** | Fragmentos de `src/environments/environment.development.ts` y `environment.real-api.ts` pegados, más la configuración de build que selecciona uno u otro. El paquete observó `mockBackend: true` en `environment.development.ts` **en las dos ramas**, y `real-api.ts` forzando tres banderas a `false` heredando el resto: verificá qué se compila, no qué archivo existe | TODO |
| H1.S1.M4 | Declarar el efecto de M3 sobre cualquier afirmación de recorrido | Está escrita la frase que el equipo va a tener que respetar toda la semana | Registro explícito: **un recorrido verde con `mockBackend` activo no acredita el backend**. Tampoco se afirma lo contrario: el paquete no verificó que todos los endpoints estén simulados en cualquier configuración. Lo que no comprobaste, no lo afirmás | TODO |

#### H1.S2 — La selección, y por qué ésa

**CA:** Dado el catálogo de escenarios, cuando se elige el recorrido prioritario, entonces el criterio estaba escrito antes, los descartados están nombrados, y cada paso del elegido tiene ruta verificada o `NOT_FOUND`.

**DoD:** Las 5 microtareas en `HECHO`. Escrito que los IDs `M-*` son auxiliares del paquete y **no** reemplazan los pasos del documento original.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Ordenar los escenarios del catálogo por recorridos exigidos y por dependencias que desbloquean más trabajo | Cada escenario tiene posición y motivo; el criterio de orden está escrito antes de la lista | Tabla ordenada sobre el catálogo `M-01`…`M-19` de `PERFIL_MANTRA_DEV.md` §5. **Los IDs `M-*` son auxiliares del paquete: no son IDs oficiales ni reemplazan pasos del documento original** — decilo en el documento | TODO |
| H1.S2.M2 | Elegir el recorrido prioritario candidato | Hay exactamente uno elegido, con el criterio aplicado y los descartados nombrados | Decisión escrita con su razón. Si la elección depende de algo que no sabés, el estado es `DECISION_REQUIRED` con las dos opciones y su costo — **no elijas por conveniencia** | TODO |
| H1.S2.M3 | Enumerar los participantes exigidos por el recorrido elegido | Está la lista completa: capacidades, módulos, proveedores externos y datos de referencia | Lista con localizadores. Gate C1 exige **todos** los participantes exigidos: si uno es un proveedor externo no disponible, se registra como aceptación externa pendiente, no como recorrido aprobado | TODO |
| H1.S2.M4 | Determinar qué capacidad concreta queda fuera por la exclusión del cobro | Está dicho qué capacidad se excluye y qué queda **dentro** | Registro explícito. Excluido: pasarela y procesamiento del cobro. **Incluidos**: facturas, NIT, razón social, copagos, deducibles, comisiones, delivery, puntos, QR de canje, inventario, reportes y promociones. **No elimines `payments` u otras dependencias por su nombre**: determiná la capacidad, no la carpeta | TODO |
| H1.S2.M5 | Localizadores reales del recorrido en ambos repos | Cada paso del recorrido tiene ruta verificada, o `NOT_FOUND` con el patrón buscado | Salidas de búsqueda pegadas con las rutas. **No des por buena una ruta que no abriste** | TODO |

#### H1.S3 — Relaciones, y qué cabe de verdad en el plazo

**CA:** Dado el recorrido elegido, cuando se lo descompone en relaciones, entonces cada una es una tarea separada que declara qué puede empezar con dobles y qué espera a participantes reales.

**DoD:** Las 4 microtareas en `HECHO`. `TEAM_CAPACITY` calculado o declarado `DESCONOCIDO`: **un desconocido se conserva desconocido**, y si no cabe se muestran alternativas en vez de recortar en silencio.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Enumerar las relaciones que el recorrido exige, una por tarea de integración | Cada relación nombra sus dos participantes y su dirección | Lista de tareas de relación. El paquete manda crear tarea separada por relación (p. ej. `agenda → mensajería`, y `avisos → chat` si el alcance lo exige) | TODO |
| H1.S3.M2 | Para cada relación, declarar qué puede empezar con dobles y qué espera a los participantes reales | Cada relación tiene las dos columnas respondidas | Tabla. *Cada relación puede preparar su adaptador con dobles; su gate real espera sólo a sus participantes.* Un adaptador con dobles es `ADAPTER_VERIFIED_WITH_DOUBLES`, **nunca** integración verificada | TODO |
| H1.S3.M3 | Registrar capacidad del equipo en horas netas | Está el número, o está declarado `DESCONOCIDO` con qué falta para calcularlo | Registro. `TEAM_CAPACITY` y el día actual **no están verificados** (Q-02, Q-03): **un desconocido se conserva desconocido**. Inventar un número acá es lo que después se convierte en un compromiso incumplido | TODO |
| H1.S3.M4 | Tabla de demanda contra capacidad, con alternativas y su impacto | Cada lote tiene rango de estimación e incertidumbres listadas; si no cabe, hay alternativas con impacto | Tabla entregada. Si no cabe: **se muestran alternativas para decisión; no se recortan requisitos en silencio ni se presenta un piloto como todo Mantra** | TODO |

### H2 — Diseñar los casos de aceptación del recorrido y sus datos

**Prioridad:** `ALTA`

**CA:** Dado cada caso de aceptación, cuando se pregunta de dónde sale su resultado esperado, entonces la respuesta es una fuente externa al sistema — nunca «lo que hace el sistema».

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún caso usa el sistema como oráculo de sí mismo. Ningún dato de prueba es real.

**Kill-test del hito:** Tomá un caso y preguntá de dónde sale el resultado esperado. Si la respuesta es «de lo que hace el sistema», no es un caso de aceptación: es una foto del bug.

**Estado:** TODO

#### H2.S1 — Los casos

**CA:** Dado el recorrido, cuando se escriben sus casos, entonces están en dado/cuando/entonces, incluyen los negativos, y cada uno cita la sección del documento del cliente de la que sale.

**DoD:** Las 3 microtareas en `HECHO`. Un recorrido sin casos negativos no está diseñado. **Si la fuente del esperado es el propio sistema, el caso no vale.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | Escribir los casos del camino feliz en dado/cuando/entonces | Cada uno es observable y no menciona implementación | Casos escritos. Cada uno cita la sección del documento del cliente de la que sale | TODO |
| H2.S1.M2 | Escribir los casos negativos | Están los de autorización, los de dato inválido y los de estado incorrecto | Casos escritos. Un recorrido sin casos negativos no está diseñado | TODO |
| H2.S1.M3 | Identificar el oráculo de cada caso | Cada uno dice de dónde sale el esperado | Tabla caso → fuente del esperado. Si la fuente es el propio sistema, el caso **no vale** | TODO |

#### H2.S2 — Los datos

**CA:** Dados los datos de prueba, cuando se los define, entonces son sintéticos, con ownership coherente, y todo catálogo oficial que el recorrido necesite tiene fuente, fecha y licencia o está marcado como sintético.

**DoD:** Las 3 microtareas en `HECHO`. Regla 97.6: **prohibido usar datos reales de personas como datos de prueba**.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S2.M1 | Definir los datos sintéticos con relaciones y ownership coherentes | Ningún dato real de persona | Definición. Regla 97.6: **prohibido usar datos reales como datos de prueba** | TODO |
| H2.S2.M2 | Declarar la procedencia de todo catálogo que el recorrido necesite | Cada catálogo: fuente, fecha y licencia, o marcado como sintético | Tabla. Compañías de seguro, seguros públicos y ocupaciones del SEGIP son **catálogos oficiales**: exigen procedencia (regla 97.4) | TODO |
| H2.S2.M3 | Registrar qué datos NO se pueden generar por falta de regla | Lista con quién define cada uno | Lista. **No completes un porcentaje ni una fórmula a ojo** | TODO |

#### H2.S3 — Lo que no cierra

**CA:** Dado el documento del cliente, cuando se contrasta contra el recorrido elegido, entonces cada paso tiene su párrafo o está marcado como agregado, y los ítems no cubiertos están listados.

**DoD:** Las 2 microtareas en `HECHO`. Es el insumo de la conversación de alcance: evita que el piloto se lea como todo Mantra.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S3.M1 | Contrastar el recorrido elegido contra `REQUISITOS-CLIENTE-ALOVIDA.md` | Cada paso del recorrido tiene su párrafo en el documento del cliente, o está marcado como agregado | Tabla de correspondencia | TODO |
| H2.S3.M2 | Registrar los ítems del cliente que el recorrido NO cubre | Está la lista | Lista. Es el insumo de la conversación de alcance, y evita que se lea el piloto como todo Mantra | TODO |

### H3 — Probar permisos, estados y dinero del recorrido

**Prioridad:** `ALTA`

**CA:** Dado un actor de otra organización, cuando intenta leer o escribir un recurso del recorrido, entonces es rechazado y **no persiste ningún efecto**; y ningún monto del recorrido se calcula con números flotantes.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún control dado por bueno sin ejercitarlo. Ningún dato personal en logs, URLs ni en esta evidencia.

**Kill-test del hito:** Cambiá el identificador de la URL por el de otro paciente. Si devuelve datos, todo lo demás del recorrido es irrelevante.

**Estado:** TODO

#### H3.S1 — Permisos

**CA:** Dado un identificador de otro paciente en la URL, cuando se lo consulta, entonces no devuelve datos; y en escritura, una consulta posterior demuestra que no se escribió nada.

**DoD:** Las 3 microtareas en `HECHO`, con el código de respuesta y la consulta posterior pegados. Las celdas sin ejercitar de la matriz se marcan `NOT_RUN`, no se asumen.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | ADV-04: actor o recurso de otra organización intenta leer | Rechazado, y **no** persiste ningún efecto | Salida pegada con el código de respuesta. Regla 90.1.3: cambiar un id en la URL no puede devolver datos de otro | TODO |
| H3.S1.M2 | ADV-04 en escritura | Rechazado, sin escritura ni aviso indebido | Salida + consulta posterior que demuestra que no se escribió | TODO |
| H3.S1.M3 | Matriz rol × recurso × acción del recorrido | Cada celda tiene resultado esperado y observado | Matriz. Las celdas sin ejercitar se marcan `NOT_RUN`, no se asumen | TODO |

#### H3.S2 — Estados

**CA:** Dada una transición de estado ilegal, cuando se la intenta, entonces la rechaza el **backend**, no la UI ocultando un botón.

**DoD:** Las 2 microtareas en `HECHO`, con la salida pegada y la tabla de transiciones legales con su fuente.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S2.M1 | Listar las transiciones legales del recorrido | Está el diagrama o la tabla | Tabla, con su fuente en el documento del cliente | TODO |
| H3.S2.M2 | Intentar una transición ilegal | Rechazada en el **backend**, no solo oculta en la UI | Salida pegada. Ocultar un botón no protege nada | TODO |

#### H3.S3 — Dinero

**CA:** Dado el camino del dinero, cuando se lo inspecciona, entonces no hay flotantes, la moneda y el redondeo están declarados, y todo porcentaje sin definir figura como `DECISION_REQUIRED`.

**DoD:** Las 3 microtareas en `HECHO`. **Un porcentaje inventado acá termina en una factura real.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S3.M1 | Verificar que los montos se manejan en enteros de la menor unidad | No hay flotantes en el camino del dinero | Evidencia del tipo de dato. Regla: **nunca `float` para dinero** | TODO |
| H3.S3.M2 | Verificar moneda, precisión y redondeo | Están declarados y son consistentes | Evidencia. *No sumar monedas distintas ni cambiar etiqueta a Bs sin definición* | TODO |
| H3.S3.M3 | Registrar qué porcentaje, deducible o copago **no está definido** | Lista con quién lo define | Lista `DECISION_REQUIRED`. **Un porcentaje inventado termina en una factura real** | TODO |

### H4 — Ejercitar el recorrido que cruza varios módulos

**Prioridad:** `MEDIA`

**CA:** Dado el recorrido que cruza varios módulos, cuando se lo ejercita, entonces cada paso declara si su participante fue **real o doble**; y un fallo antes del commit compartido no deja éxito parcial visible desde una conexión independiente.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ninguna regla desconocida rellenada. Ningún dato de persona en logs, URLs ni evidencia.

**Kill-test del hito:** Preguntá si el recorrido pasa. Si nadie puede nombrar qué participante era un doble, el resultado no significa nada.

**Estado:** TODO

#### H4.S1 — El recorrido de punta a punta

**CA:** Dado el recorrido completo, cuando corre, entonces cada paso tiene resultado y marca de real/doble, y ADV-08 demuestra que no queda éxito parcial confirmado.

**DoD:** Las 3 microtareas en `HECHO`, con las consultas hechas desde una **conexión independiente** pegadas. Sin la marca real/doble, el resultado es inútil.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S1.M1 | Ejecutar el recorrido completo con los participantes disponibles | Corre, o se detiene en un paso identificado | Salida pegada paso por paso | TODO |
| H4.S1.M2 | Declarar, por paso, si el participante fue real o doble | Cada paso tiene su marca | Tabla paso × participante × real/doble. **Sin esto el resultado es inútil** | TODO |
| H4.S1.M3 | ADV-08: fallar tras la escritura de un participante y antes del commit compartido | Una consulta independiente **no** encuentra éxito parcial ni auditoría de éxito confirmada | Consultas pegadas desde conexión independiente | TODO |

#### H4.S2 — Lo que el recorrido exige y no está

**CA:** Dado lo que el recorrido exige y no está, cuando se cierra, entonces hay lista de proveedores externos pendientes y de pasos `NOT_RUN` con motivo.

**DoD:** Las 3 microtareas en `HECHO`, con la correspondencia contra el documento del cliente actualizada.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S2.M1 | Lista de proveedores externos pendientes | Cada uno con qué acredita y qué falta | Lista. Es evidencia de salida exigida por **H4** | TODO |
| H4.S2.M2 | Registrar los pasos que quedaron `NOT_RUN` y por qué | Cada uno con motivo | Lista | TODO |
| H4.S2.M3 | Contrastar el recorrido ejecutado contra `REQUISITOS-CLIENTE-ALOVIDA.md` | Cada paso tiene su párrafo, o está marcado como no cubierto | Tabla de correspondencia actualizada | TODO |

#### H4.S3 — Rastro

**CA:** Dada una lectura de datos clínicos, cuando ocurre, entonces deja rastro auditable, y ese rastro no contiene el contenido clínico.

**DoD:** Las 2 microtareas en `HECHO`, con la consulta pegada. Regla 90.2.7: **incluidas las lecturas**.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H4.S3.M1 | Verificar que las lecturas de datos clínicos dejan rastro auditable | El rastro existe y no contiene el contenido clínico | Consulta pegada. Regla 90.2.7: **incluidas las lecturas** | TODO |
| H4.S3.M2 | Verificar que no hay datos de personas en logs ni URLs del recorrido | Ninguno | Evidencia de la revisión. Si una salida los tenía: enmascarada **y aclarado** | TODO |

### H5 — Ejecutar la aceptación del registro con los participantes reales disponibles

**Prioridad:** `ALTA`

**CA:** Dada la matriz de aceptación, cuando alguien la lee, entonces sabe para cada paso si se ejercitó con participantes reales, con dobles o no se ejercitó — y los fallos críticos están en la primera línea, no al final.

**DoD:** Las 8 microtareas en `HECHO` o `BLOCKED`. Ningún paso sin declarar real/doble. Ninguna decisión de alcance sin dueño.

**Kill-test del hito:** Leé la primera línea del reporte de aceptación. Si hay algo en rojo y la primera línea no lo dice, el reporte está maquillado.

**Estado:** TODO

#### H5.S1 — La ejecución

**CA:** Dados los pasos del recorrido exigido, cuando se ejecutan, entonces cada uno tiene resultado, evidencia y marca de participante; y si hay rojo, el reporte abre con eso.

**DoD:** Las 3 microtareas en `HECHO`. Gate C2: **sin dobles ocultos**. *Prohibido el resumen optimista cuando hay algo en rojo.*

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S1.M1 | Ejecutar todos los pasos del recorrido exigido | Cada uno con resultado | Matriz paso × resultado × evidencia | TODO |
| H5.S1.M2 | Marcar por paso si el participante fue real, doble o ausente | Los tres estados, ninguno implícito | Columna obligatoria de la matriz (gate C2: **sin dobles ocultos**) | TODO |
| H5.S1.M3 | Registrar los fallos críticos y ponerlos primero | El reporte abre con lo que está en rojo | Reporte. *Prohibido el resumen optimista cuando hay algo en rojo* | TODO |

#### H5.S2 — El alcance, explícito

**CA:** Dado lo que no se ejecutó, cuando se cierra, entonces está listado con motivo, y toda decisión de alcance tomada tiene nombre de quién la tomó.

**DoD:** Las 3 microtareas en `HECHO`. *Un cambio de alcance requiere decisión explícita, no un reporte que disimula pendientes.*

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S2.M1 | Listar los recorridos exigidos que NO se ejecutaron | Cada uno con motivo | Lista | TODO |
| H5.S2.M2 | Registrar las decisiones de alcance tomadas y quién las tomó | Cada una con nombre | Tabla. *Un cambio de alcance requiere decisión explícita, no un reporte que disimula pendientes* | TODO |
| H5.S2.M3 | Actualizar la correspondencia con `REQUISITOS-CLIENTE-ALOVIDA.md` | Cada ítem del cliente: cubierto, parcial o no cubierto | Tabla actualizada | TODO |

#### H5.S3 — El dictamen preliminar

**CA:** Dado el estado del producto, cuando se lo declara, entonces es el que la evidencia sostiene, y cada proveedor externo no verificado figura como aceptación externa pendiente.

**DoD:** Las 2 microtareas en `HECHO`.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H5.S3.M1 | Declarar el estado de entrega del producto | `PRODUCT_ACCEPTANCE_VERIFIED` solo si C está completo para el alcance exigido; si no, el estado real | Estado + evidencia | TODO |
| H5.S3.M2 | Declarar los límites externos | Cada proveedor externo no verificado queda como **aceptación externa pendiente** | Lista | TODO |

### H6 — Emitir el dictamen de aceptación con sus límites externos

**Prioridad:** `ALTA`

**CA:** Dado el dictamen, cuando lo lee alguien que no vio la semana, entonces sabe qué puede usar, qué no, y de quién depende lo que falta.

**DoD:** Las 9 microtareas en `HECHO` o `BLOCKED`. Ningún ítem aprobado sin salida literal. Ningún ítem a medias sin las cuatro respuestas. El porcentaje sale de la fórmula.

**Kill-test del hito:** Dale el dictamen a alguien que no vio la semana. Si después de leerlo no sabe qué puede usar y qué no, el dictamen no sirve.

**Estado:** TODO

#### H6.S1 — El dictamen

**CA:** Dado el trabajo de la semana, cuando se escribe el dictamen, entonces lo aprobado lleva comando y salida, lo a medias lleva las cuatro respuestas, y lo pendiente dice qué lo destraba.

**DoD:** Las 3 microtareas en `HECHO`. **Si no podés pegar la salida, no va en aprobado.** «Casi listo» está prohibido.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S1.M1 | Escribir qué quedó aprobado, con su evidencia | Cada ítem con comando y salida | Tabla. **Si no podés pegar la salida, no va en aprobado** | TODO |
| H6.S1.M2 | Escribir qué quedó a medias, con las cuatro respuestas | Qué anda, qué no anda, qué falta exactamente, dónde quedó | Ítems completos. «Casi listo» está prohibido | TODO |
| H6.S1.M3 | Escribir qué quedó pendiente o bloqueado | Cada uno con qué lo destraba y de quién depende | Tabla | TODO |

#### H6.S2 — Los límites

**CA:** Dado cualquier reporte anidado, cuando se consolida, entonces su sección «No cubierto» aparece **arriba**, en el dictamen.

**DoD:** Las 3 microtareas en `HECHO`. Regla 40.7: **prohibido que una limitación quede enterrada en un reporte anidado**.

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S2.M1 | Declarar cada proveedor externo no verificado | Cada uno como aceptación externa pendiente | Lista | TODO |
| H6.S2.M2 | Consolidar el «No cubierto» de todos los reportes anidados | Nada queda enterrado abajo | Sección consolidada. Regla 40.7: **lo que quedó sin cubrir en QA queda sin cubrir en el trabajo, y tiene que aparecer arriba** | TODO |
| H6.S2.M3 | Declarar el estado de entrega del producto | El que la evidencia sostiene | Estado | TODO |

#### H6.S3 — Honestidad del cierre

**CA:** Dado el cierre, cuando se informa el avance, entonces sale de `HECHO / total`, los fallos críticos abren el documento, y los riesgos residuales están listados con su impacto.

**DoD:** Las 3 microtareas en `HECHO`. **Ningún porcentaje a ojo.**

**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H6.S3.M1 | Calcular el avance como `HECHO / total` | El número sale de la fórmula | Cálculo pegado. **Ningún porcentaje a ojo** | TODO |
| H6.S3.M2 | Poner los fallos críticos en la primera línea | Si hay rojo, abre el documento | Documento | TODO |
| H6.S3.M3 | Listar los riesgos residuales con su impacto | Cada uno | Tabla | TODO |

## 5. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20-09-2026** y hoy es **19-09-2026** | Quien encargó el paquete | Nada técnico; afecta a qué «Día 1» significa |
| Q-C1 | **Seis bloques de trabajo en una noche no entran.** Está entregado completo y ordenado por dependencia | Coordinación | El alcance real del turno. **No recortes en silencio**: lo que no cierres va `A MEDIAS` |
| Q-04 | El registro funcional original sigue sin identificarse como archivo | Quien tenga el aprobado | La aceptación documental. **Hay un candidato**: `docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`, que coincide en los 19 escenarios. Contrastalo, no lo des por cerrado |
| Q-10 | Cláusulas, fórmulas, unidades y porcentajes sin definir | Negocio | Los casos que dependan de ellos quedan `DECISION_REQUIRED` |
| Q-R4 | Las marcas COMPLETO/INCOMPLETO/FALTA del cliente no están verificadas | Quien hizo el relevamiento | No las uses como estado del sistema |
| Q-17 | Qué se considera «aprobación parcial» exactamente en cada canal | Negocio / aseguradora | Los casos M-08, M-09 y M-10 del catálogo |
| Q-21 | Qué proveedor externo se puede probar dentro del plazo y cuál no | Coordinación | El alcance de la aceptación de **H5** |
| Q-R5 | Los 8 módulos del cliente contra el plazo | Coordinación | Qué significa «aceptado» acá |

## 6. Definition of Done del turno

- [ ] Las **54 microtareas** están en `HECHO` o en `BLOCKED` con motivo y salida del error, o en `A MEDIAS` con qué anda, qué no anda y qué falta exactamente.
- [ ] **Ninguna microtarea quedó en `EN CURSO`** al cerrar.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Cada hito y cada subtarea tienen su Estado actualizado, no sólo las microtareas.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún escenario del catálogo se presenta como transcripción del registro original: son requisitos recogidos por el metaprompt.
- [ ] Ninguna regla, monto, porcentaje ni catálogo fue completado por criterio propio. Lo que falta, falta y está nombrado.
- [ ] El documento dice, en su primera pantalla, si lo que se ve en el frontend puede estar viniendo de datos de demostración.
- [ ] Ningún caso usa el sistema como oráculo de sí mismo.
- [ ] Ningún dato de prueba es real.
- [ ] Ninguna regla de negocio fue completada por criterio propio.
- [ ] Ninguna afirmación excede lo que ejecutaste. *¿Algún éxito declarado depende de algo que no ejecutaste?*
- [ ] Ningún control de autorización se dio por bueno sin ejercitarlo.
- [ ] Ningún monto se verificó con flotantes.
- [ ] Ningún dato personal apareció en un log, una URL o una captura de esta evidencia.
- [ ] Cada paso declara si su participante fue real o doble.
- [ ] Ninguna regla desconocida se rellenó.
- [ ] Ningún dato de persona en logs, URLs ni en esta evidencia.
- [ ] Ningún paso sin declarar si su participante fue real o doble.
- [ ] Los fallos críticos están en la primera línea del reporte.
- [ ] Ninguna decisión de alcance quedó sin dueño.
- [ ] Ningún dato de persona en la evidencia.
- [ ] Ningún ítem aprobado sin salida literal pegada.
- [ ] Ningún ítem a medias sin las cuatro respuestas.
- [ ] Ninguna limitación quedó solo en un reporte anidado.
- [ ] El porcentaje sale de la fórmula.
- [ ] Ningún dato de persona en el dictamen.
- [ ] Avance reportado como `microtareas HECHO / 54`, **no** como porcentaje a ojo.
- [ ] Ningún dato real de paciente en ninguna salida pegada. Si lo tenía: enmascarado **y aclarado que se enmascaró**.

## 7. Handoff

Avisá por el daily **al cerrar cada hito**, no al final del turno:

| Al cerrar | A quién | Qué exactamente |
|---|---|---|
| **H1** | Justin | Las relaciones: de ahí sale qué adaptador arranca primero |
| **H1** | Itzan | Si el recorrido exige una escritura atómica que cruza capacidades |
| **H1** | Ender | Qué garantía funcional le exige el recorrido al aviso |
| **H1** | Pablo | El estado del registro funcional original y la demanda contra capacidad |
| **H2** | Justin | Los casos negativos de autorización: van a su matriz |
| **H2** | Ender | Qué reglas del recorrido el contrato todavía no expresa |
| **H2** | Pablo | Qué datos necesita el laboratorio para estos casos |
| **H3** | Justin | Los negativos de autorización que hay que llevar a la relación |
| **H3** | Ender | Qué transición o regla de dinero el contrato no expresa |
| **H3** | Pablo | Los controles faltantes, para priorizarlos |
| **H4** | Justin | Los pasos que fallaron por la relación |
| **H4** | Ender | Qué decisión abierta bloquea qué paso |
| **H4** | Pablo | La lista de proveedores externos pendientes: es decisión de alcance |
| **H5** | Todo el equipo | La matriz de aceptación y los rojos |
| **H5** | Pablo | Las decisiones de alcance que exigen coordinación |
| **H5** | Justin | Qué pasos hay que reejecutar mañana |
| **H6** | Todo el equipo | El dictamen |
| **H6** | Pablo | Las decisiones de alcance que quedan para quien coordine |
| **H6** | Quien encargó el paquete | Los pendientes que solo puede cerrar negocio |

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente. Un bloqueo se reporta **apenas aparece**, no al final.
