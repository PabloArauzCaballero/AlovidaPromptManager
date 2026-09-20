# Seleccionar el recorrido prioritario del registro y sus relaciones

> **Rol:** cierre funcional e integración · **Línea:** B · **Día del plazo:** 1 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · aplica [PROMPT_MAESTRO_BACKEND_AUTONOMO.md](../../../../../../../Downloads/BACKEND_AUTONOMO_MANTRA/BACKEND_AUTONOMO_MANTRA/PROMPT_MAESTRO_BACKEND_AUTONOMO.md)
> **Tu encargo sale de:** `PLAN_SEIS_DIAS.md` (Día 1, columna "Cierre funcional e integración") · `PERFIL_MANTRA_DEV.md` §4, §5 y §3 hallazgo 6 · `GATES_Y_PRUEBAS_ADVERSAS.md` gate C1

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `MODE` | `DIAGNOSE_DESIGN` — **no modificás backend ni frontend**. Tu entrega es la selección justificada y sus localizadores |
| `WORKSPACE` | Checkouts reales de `mantra-core-health-api` y `mantra-core-health`. Si no los tenés clonados, clonalos y registrá las rutas exactas. No inventar ruta |
| `TARGET_REF` | Backend: el SHA que fija Pablo esta noche. Frontend consumidor: `5420eda8dbfd2f7ad1473e1265bf92af62d16eb8` (`dev`). Maqueta: `d0c44e0df041a45c644c1639cf706dc997c1d128` (`mockup`). **Reconsultá y fijá el SHA actual de cada uno**; si cambió, ese es tu corte |
| `AUTHORIZED_BATCH` | Documentos en tu directorio de evidencia. Cero escrituras en `src/` de ninguno de los dos repos |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` (síntesis). **El registro funcional original no está identificado** — eso es hallazgo tuyo a registrar y, si podés, a localizar; no a suplir con otro documento |
| `ALLOWED_INFRA` | Lectura de ambos repos, `git`. No necesitás levantar nada para esta tarea |
| `Escritura permitida` | Solo tu directorio de evidencia. Contrato del puerto: de Ender. Composición: de Itzan |

## 1. Resultado observable

Al cerrar tu turno, el equipo puede abrir un solo documento y saber **qué recorrido funcional atacamos
primero, por qué ése, qué participantes exige, y con qué localizadores reales se verifica** — más la
advertencia explícita de si el frontend que se va a usar está corriendo contra datos de demostración.

**Kill-test (lo más barato que demuestra que NO está hecho):** preguntá si el recorrido elegido se puede
verificar hoy contra el backend real o si el frontend compila con `mockBackend` activo. Si nadie lo sabe,
no está hecho — y si alguien contesta sin haber abierto el archivo de entorno que **se compila**, está adivinando.

## 2. Alcance

**IN:** localización (o registro de ausencia) del registro funcional original · corte de los dos frontends ·
qué configuración de entorno se compila realmente y qué banderas de demo quedan activas · orden de los
escenarios por dependencias · recorrido prioritario elegido con criterio escrito · participantes exigidos ·
qué capacidad concreta queda fuera por la exclusión del cobro · relaciones que el recorrido exige, una por
tarea de integración · demanda contra capacidad, con lo desconocido declarado desconocido.

**OUT:** implementar cualquier parte del recorrido · ejecutar Playwright o llamadas reales · decidir la
semántica del contrato de avisos (es de Ender) · armar composición ni baseline (es de Itzan) · escribir el
adaptador (es de Justin) · **inventar reglas, porcentajes, fórmulas o catálogos** que el registro no define ·
recortar requisitos en silencio para que entren en el plazo.

## 3. Plan

### Hito H1 — Hay un recorrido prioritario elegido con criterio, con sus participantes y sus relaciones

*Se le puede mostrar a cualquiera: "éste es el recorrido que cierra primero, éstos son los participantes que
exige, éstas son las relaciones a preparar, y ésta es la razón por la que va antes que los otros".*

**CA del hito:** Dado tu documento, cuando el equipo arranca el Día 2, entonces cada persona sabe qué
relación le toca preparar y contra qué localizador se va a verificar el recorrido — sin volver a discutir la
prioridad y sin que nadie confunda una pantalla de demo con backend funcionando.

---

#### Subtarea S1.1 — La fuente funcional y qué tan real es lo que vemos

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M1 | Buscar el registro funcional original aprobado y registrar el resultado | Queda escrito qué buscaste, dónde, y si apareció | Patrones de búsqueda y resultados pegados. **No encontrarlo no demuestra que no exista**: se registra como límite de acceso (Q-04) y se nombra a quién pedírselo. Y **no se adopta una auditoría o matriz derivada como sustituto del original** |
| M2 | Fijar el corte real de los dos repositorios de frontend | Los SHA registrados corresponden al `HEAD` consultado, con fecha y hora | Salida literal de `git rev-parse HEAD` y `git log -1` en cada checkout. Si el SHA cambió respecto del paquete, ése es tu corte y lo declarás |
| M3 | Registrar **qué configuración de entorno se compila** y qué banderas de demo quedan activas | Está respondido, con fragmento del archivo: valor de `mockBackend`, `campaignsDemo`, `paymentDemo` y `loyaltyDemo`, y **cuál archivo gana en el build que se usa** | Fragmentos de `src/environments/environment.development.ts` y `environment.real-api.ts` pegados, más la configuración de build que selecciona uno u otro. El paquete observó `mockBackend: true` en `environment.development.ts` **en las dos ramas**, y `real-api.ts` forzando tres banderas a `false` heredando el resto: verificá qué se compila, no qué archivo existe |
| M4 | Declarar el efecto de M3 sobre cualquier afirmación de recorrido | Está escrita la frase que el equipo va a tener que respetar toda la semana | Registro explícito: **un recorrido verde con `mockBackend` activo no acredita el backend**. Tampoco se afirma lo contrario: el paquete no verificó que todos los endpoints estén simulados en cualquier configuración. Lo que no comprobaste, no lo afirmás |

#### Subtarea S1.2 — La selección, y por qué ésa

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M5 | Ordenar los escenarios del catálogo por recorridos exigidos y por dependencias que desbloquean más trabajo | Cada escenario tiene posición y motivo; el criterio de orden está escrito antes de la lista | Tabla ordenada sobre el catálogo `M-01`…`M-19` de `PERFIL_MANTRA_DEV.md` §5. **Los IDs `M-*` son auxiliares del paquete: no son IDs oficiales ni reemplazan pasos del documento original** — decilo en el documento |
| M6 | Elegir el recorrido prioritario candidato | Hay exactamente uno elegido, con el criterio aplicado y los descartados nombrados | Decisión escrita con su razón. Si la elección depende de algo que no sabés, el estado es `DECISION_REQUIRED` con las dos opciones y su costo — **no elijas por conveniencia** |
| M7 | Enumerar los participantes exigidos por el recorrido elegido | Está la lista completa: capacidades, módulos, proveedores externos y datos de referencia | Lista con localizadores. Gate C1 exige **todos** los participantes exigidos: si uno es un proveedor externo no disponible, se registra como aceptación externa pendiente, no como recorrido aprobado |
| M8 | Determinar qué capacidad concreta queda fuera por la exclusión del cobro | Está dicho qué capacidad se excluye y qué queda **dentro** | Registro explícito. Excluido: pasarela y procesamiento del cobro. **Incluidos**: facturas, NIT, razón social, copagos, deducibles, comisiones, delivery, puntos, QR de canje, inventario, reportes y promociones. **No elimines `payments` u otras dependencias por su nombre**: determiná la capacidad, no la carpeta |
| M9 | Localizadores reales del recorrido en ambos repos | Cada paso del recorrido tiene ruta verificada, o `NOT_FOUND` con el patrón buscado | Salidas de búsqueda pegadas con las rutas. **No des por buena una ruta que no abriste** |

#### Subtarea S1.3 — Relaciones, y qué cabe de verdad en el plazo

| # | Microtarea | Criterio de aceptación | Definition of Done |
|---|---|---|---|
| M10 | Enumerar las relaciones que el recorrido exige, una por tarea de integración | Cada relación nombra sus dos participantes y su dirección | Lista de tareas de relación. El paquete manda crear tarea separada por relación (p. ej. `agenda → mensajería`, y `avisos → chat` si el alcance lo exige) |
| M11 | Para cada relación, declarar qué puede empezar con dobles y qué espera a los participantes reales | Cada relación tiene las dos columnas respondidas | Tabla. *Cada relación puede preparar su adaptador con dobles; su gate real espera sólo a sus participantes.* Un adaptador con dobles es `ADAPTER_VERIFIED_WITH_DOUBLES`, **nunca** integración verificada |
| M12 | Registrar capacidad del equipo en horas netas | Está el número, o está declarado `DESCONOCIDO` con qué falta para calcularlo | Registro. `TEAM_CAPACITY` y el día actual **no están verificados** (Q-02, Q-03): **un desconocido se conserva desconocido**. Inventar un número acá es lo que después se convierte en un compromiso incumplido |
| M13 | Tabla de demanda contra capacidad, con alternativas y su impacto | Cada lote tiene rango de estimación e incertidumbres listadas; si no cabe, hay alternativas con impacto | Tabla entregada. Si no cabe: **se muestran alternativas para decisión; no se recortan requisitos en silencio ni se presenta un piloto como todo Mantra** |

## 4. Ambigüedades registradas — **no las resuelvas, anotalas**

| ID | Ambigüedad | Quién puede resolverla | Qué bloquea |
|---|---|---|---|
| Q-01 | El paquete se fecha el **20 de septiembre de 2026** y hoy es **19 de septiembre de 2026** | Quien encargó el paquete | Nada técnico; afecta a qué "Día 1" significa |
| Q-02 | `CURRENT_DAY` del plazo original no está verificado | Coordinación | El plan de seis días asume Día 1..6 sin fechas nuevas |
| Q-03 | `TEAM_CAPACITY` en horas netas no está calculado | Coordinación | Tu M12 y M13. Es el insumo del compromiso de alcance |
| Q-04 | El registro funcional original no está identificado; sólo hay la síntesis del metaprompt | Quien tenga el documento aprobado | La aceptación documental integral (C1). La selección técnica **puede continuar** |
| Q-10 | Cláusulas, pólizas, fórmulas, unidades y porcentajes del registro no están todos definidos | Quien apruebe las decisiones de negocio | Sólo los casos que dependan de ellos, que quedan `DECISION_REQUIRED`. **No los completes a ojo**: un porcentaje inventado se propaga a facturación |
| Q-11 | Qué configuración de frontend se usará en la aceptación | Coordinación | Si es la que tiene banderas de demo activas, el recorrido no acredita backend (tu M4) |

## 5. Definition of Done del hito

- [ ] Las 13 microtareas están en `HECHO` o en `BLOCKED` con motivo y salida del error.
- [ ] Todo estado de verificación es `PASS`/`FAIL`/`NOT_RUN`/`BLOCKED`. **No hay un solo `PASS` sin comando y exit code pegados.**
- [ ] Ningún escenario del catálogo se presenta como transcripción del registro original: son requisitos recogidos por el metaprompt.
- [ ] Ninguna regla, monto, porcentaje ni catálogo fue completado por criterio propio. Lo que falta, falta y está nombrado.
- [ ] El documento dice, en su primera pantalla, si lo que se ve en el frontend puede estar viniendo de datos de demostración.
- [ ] Avance reportado como `microtareas HECHO / 13`, no como porcentaje a ojo.

## 6. Handoff

Al cerrar, avisá por el daily a:
- **Justin** → las relaciones de M10 y M11: de ahí sale qué adaptador arranca primero.
- **Itzan** → si el recorrido exige una escritura atómica que cruza capacidades (su M8 dice si esa garantía existe hoy).
- **Ender** → si el recorrido toca avisos, qué garantía funcional le exige al aviso: es insumo de su ficha de efectos posteriores.
- **Pablo** → el estado del registro funcional original (M1) y la tabla de demanda contra capacidad (M13), que es decisión de coordinación.

Si un bloqueo se confirma, **no itere sobre él**: registrá la causa y pasá a la siguiente microtarea independiente.
