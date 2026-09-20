# Marcelo — H1: Selección del recorrido prioritario del registro y sus relaciones

> **Rol:** cierre funcional e integración · **Línea:** B · **Fecha:** 2026-09-19 · **Turno:** noche
> **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA` · **Requisitos del cliente:** [`REQUISITOS-CLIENTE-ALOVIDA.md`](../../../../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)
> **1 hito · 3 subtareas · 13 microtareas**, todas con criterio de aceptación y Definition of Done.

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `PROFILE` | `MANTRA_DEV` |
| `WORKSPACE` | Checkout real de `mantra-core-health-api` y frontends (`mantra-core-health`). Registrá la ruta exacta |
| `TARGET_REF` | `32ae939983f0d665e4ed371362858801134d35cd`. Reconsultá y fijá el actual |
| `AUTHORIZED_BATCH` | Directorio de evidencia. Cero escrituras en `src/` de Mantra |
| `PROCESS_SOURCE` | `METAPROMPT_PARA_ASTRA(1).md` + Requisitos del cliente |

## 1. Antes de escribir una línea — instalación OBLIGATORIA del estándar

Verificá la instalación del estándar antes de iniciar:

```bash
ls .claude/skills | wc -l        # -> 176
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Entrá por `skills-router` y cargá las skills clave para H1:
- `requirements-and-acceptance`
- `vertical-slicing`
- `outcome-first`
- `factual-discovery`
- `context-thrift`
- `scope-discipline`

## 2. Resultado observable

Al cerrar este hito, el equipo puede abrir un solo documento y saber **qué recorrido funcional atacamos primero, por qué ése, qué participantes exige, y con qué localizadores reales se verifica** — con la advertencia explícita de si el frontend corre contra datos demo (`mockBackend`).

**Kill-test:** preguntá si el recorrido elegido se puede verificar hoy contra el backend real o si el frontend compila con `mockBackend` activo. Si nadie lo sabe, no está hecho.

## 3. Alcance

**IN:** localización o ausencia del registro original (Q-04), corte de frontends, configuración de build y flags demo, ordenación M-01..M-19, selección del recorrido, participantes exigidos, exclusión de pasarela de pago manteniendo facturación/deducibles, localizadores reales, tareas de relación por participante, capacidad del equipo y tabla demanda vs capacidad.

**OUT:** implementar cualquier parte del recorrido, ejecutar llamadas reales, decidir la semántica de avisos (es de Ender), armar composición (es de Itzan), escribir adaptadores (es de Justin), inventar reglas o catálogos no definidos por el cliente, recortar requisitos en silencio.

### Ambigüedades registradas

| ID | Ambigüedad | Supuesto tomado | A quién confirmar |
|---|---|---|---|
| Q-04 | El registro funcional original sigue sin identificarse como archivo | Se usa como candidato `REQUISITOS-CLIENTE-ALOVIDA.md` | Quien tenga el original |
| Q-02 / Q-03 | Capacidad neta del equipo sin medir | Se declara DESCONOCIDO si no hay cifra | Coordinación |

---

## 4. Plan de ejecución

### H1 — Seleccionar el recorrido prioritario del registro y sus relaciones
**CA:** Dado tu documento, cuando el equipo arranca, entonces cada persona sabe qué relación le toca preparar y contra qué localizador se va a verificar el recorrido — sin volver a discutir la prioridad y sin que nadie confunda una pantalla de demo con backend funcionando.
**DoD:** Las 13 microtareas en `HECHO` o `BLOCKED`. El documento dice en su primera pantalla si lo que se ve puede venir de datos de demostración. Ninguna regla ni porcentaje completado por criterio propio.
**Estado:** TODO

#### H1.S1 — La fuente funcional y qué tan real es lo que vemos
**CA:** Dado el frontend que se va a usar, cuando alguien pregunta si lo que ve viene del backend real, entonces tu documento responde citando el archivo de entorno **que se compila**, no el que existe.
**DoD:** Las 4 microtareas en `HECHO`, con los fragmentos de `environment.development.ts`, `environment.real-api.ts` y la configuración de build pegados.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Buscar el registro funcional original aprobado y registrar el resultado | Queda escrito qué buscaste, dónde, y si apareció | Patrones de búsqueda y resultados pegados. Registrar límite Q-04 sin asumir auditorías como original | TODO |
| H1.S1.M2 | Fijar el corte real de los dos repositorios de frontend | Los SHA registrados corresponden al HEAD consultado, con fecha y hora | Salida literal de `git rev-parse HEAD` y `git log -1` en cada checkout | TODO |
| H1.S1.M3 | Registrar qué configuración de entorno se compila y qué banderas de demo quedan activas | Está respondido con fragmento del archivo: valor de mockBackend, campaignsDemo, paymentDemo y loyaltyDemo | Fragmentos de `environment.development.ts` y `environment.real-api.ts` pegados con config de build | TODO |
| H1.S1.M4 | Declarar el efecto de M3 sobre cualquier afirmación de recorrido | Está escrita la advertencia normativa sobre validación de backend | Registro explícito: un recorrido verde con mockBackend activo no acredita el backend | TODO |

#### H1.S2 — La selección, y por qué ésa
**CA:** Dado el catálogo de escenarios, cuando se elige el recorrido prioritario, entonces el criterio estaba escrito antes, los descartados están nombrados, y cada paso del elegido tiene ruta verificada o NOT_FOUND.
**DoD:** Las 5 microtareas en `HECHO`. Escrito que los IDs M-* son auxiliares del paquete y no reemplazan los pasos del documento original.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Ordenar los escenarios del catálogo por recorridos exigidos y dependencias | Cada escenario tiene posición y motivo; criterio de orden escrito antes | Tabla ordenada sobre el catálogo M-01…M-19 de PERFIL_MANTRA_DEV.md §5 | TODO |
| H1.S2.M2 | Elegir el recorrido prioritario candidato | Hay exactamente uno elegido, con criterio aplicado y descartados nombrados | Decisión escrita con su razón. Si falta dato, registrar DECISION_REQUIRED | TODO |
| H1.S2.M3 | Enumerar los participantes exigidos por el recorrido elegido | Lista completa: capacidades, módulos, proveedores externos y datos | Lista con localizadores. Si falta proveedor externo, registrar como aceptación externa pendiente | TODO |
| H1.S2.M4 | Determinar qué capacidad concreta queda fuera por exclusión del cobro | Especificado qué capacidad queda excluida y qué queda dentro | Cobro/pasarela fuera; facturas, NIT, copagos, deducibles, comisiones, delivery, puntos dentro | TODO |
| H1.S2.M5 | Localizadores reales del recorrido en ambos repos | Cada paso tiene ruta verificada o NOT_FOUND con patrón | Salidas de búsqueda pegadas con rutas reales | TODO |

#### H1.S3 — Relaciones, y qué cabe de verdad en el plazo
**CA:** Dado el recorrido elegido, cuando se lo descompone en relaciones, entonces cada una es una tarea separada que declara qué puede empezar con dobles y qué espera a participantes reales.
**DoD:** Las 4 microtareas en `HECHO`. TEAM_CAPACITY calculado o declarado DESCONOCIDO.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Enumerar las relaciones que el recorrido exige, una por tarea de integración | Cada relación nombra sus dos participantes y su dirección | Lista de tareas de relación (ej. agenda → mensajería, avisos → chat) | TODO |
| H1.S3.M2 | Declarar qué puede empezar con dobles y qué espera a participantes reales | Cada relación tiene las dos columnas respondidas | Tabla. Dobles clasificados como ADAPTER_VERIFIED_WITH_DOUBLES, nunca integración final | TODO |
| H1.S3.M3 | Registrar capacidad del equipo en horas netas | Número asentado o declarado DESCONOCIDO | Registro explícito sin inventar cifras | TODO |
| H1.S3.M4 | Tabla de demanda contra capacidad con alternativas e impacto | Cada lote tiene rango e incertidumbres listadas | Tabla entregada. Si no cabe, mostrar alternativas para coordinación sin recortar en silencio | TODO |

---

## 5. Definition of Done del hito

- [ ] Las 13 microtareas están en `HECHO` o `BLOCKED`.
- [ ] No hay `PASS` sin comando y salida literal.
- [ ] El documento advierte si el frontend corre con `mockBackend`.
- [ ] Entregables transferidos a Justin, Itzan, Ender y Pablo.

## 6. Handoff al cerrar H1

- **A Justin:** Las relaciones identificadas para definir qué adaptador arranca primero.
- **A Itzan:** Si el recorrido exige escritura atómica entre capacidades.
- **A Ender:** Qué garantía funcional le exige el recorrido al aviso.
- **A Pablo:** Estado del registro original y balance demanda contra capacidad.
