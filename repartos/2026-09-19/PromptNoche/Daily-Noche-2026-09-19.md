# Daily — turno noche — 2026-09-19

> **Estado de este documento:** `IN_PROGRESS`. Se escribió **al repartir**, antes del turno.
> Todo lo que dice "resultado" está en `NOT_RUN` a propósito: **nadie ejecutó nada todavía**.
> Cada persona completa su fila al cerrar su turno, con la salida de su comando, no con una impresión.

- **Turno:** noche · **Día del plazo:** 1 · **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
- **Repositorio objetivo:** `mantra-core-health-api` (y los dos frontends, sólo para Marcelo)
- **Modo de todo el turno:** `DIAGNOSE_DESIGN` — **esta noche nadie escribe en `src/` de Mantra.**
- **Corte:** lo fija Pablo (su M1). Hasta entonces, referencia del paquete `32ae939983f0d665e4ed371362858801134d35cd`.

## 1. Quién tiene qué

| Persona | Lote | Línea | Resultado observable que se le pide | Microtareas | Estado |
|---|---|---|---|---|---|
| **Pablo** | [Fijar corte y mapa de dependencias](Pablo/Dia1-CorteReproducible.Backend/FijarCorteYMapaDeDependencias.md) | A | Qué commit atacamos, qué está instalado de verdad, qué dependencia bloquea el piloto | 0/13 | `NOT_RUN` |
| **Ender** | [Fijar el contrato del puerto de avisos](Ender/Dia1-ContratoDelPiloto.Backend/FijarContratoDelPuertoDeAvisos.md) | A | La definición congelada con hash, y qué garantiza el tipo contra qué es sólo un comentario | 0/14 | `NOT_RUN` |
| **Itzan** | [Delimitar composición y baseline](Itzan/Dia1-ComposicionYBaseline.Backend/DelimitarComposicionYBaseline.md) | A | Qué carga hoy `SchedulingModule`, qué composición mínima se propone, cómo se levanta una base aislada | 0/14 | `NOT_RUN` |
| **Marcelo** | [Recorrido prioritario y relaciones](Marcelo/Dia1-RecorridoPrioritario.Registro/SeleccionarRecorridoPrioritarioYRelaciones.md) | B | Qué recorrido cierra primero, con qué participantes y localizadores | 0/13 | `NOT_RUN` |
| **Justin** | [Adaptador con dobles estrictos](Justin/Dia1-AdaptadorAgendaMensajeria.Integracion/IniciarAdaptadorConDoblesEstrictos.md) | B | Cómo se prueba la relación `agenda → mensajería` y qué NO acredita un doble | 0/13 | `NOT_RUN` |

**Total del turno:** 0 / 67 microtareas. El avance se reporta `HECHO / total`, **nunca como porcentaje a ojo**.

## 2. Dependencias entre lotes — leer antes de empezar

El corte de Pablo es el insumo de los otros cuatro. Nadie espera de brazos cruzados: se arranca contra el
SHA de referencia del paquete y **se marca con qué SHA se trabajó**, para reejecutar lo que haga falta si
el corte resulta otro.

| Quien espera | Espera de | Qué exactamente | Qué hace mientras tanto |
|---|---|---|---|
| Ender, Itzan, Marcelo, Justin | Pablo | El SHA del corte (M1) | Trabajar contra `32ae939…` y declararlo |
| Itzan | Pablo | Imports de `scheduling.module.ts` (M10) y ORM (M11) | **Contrastar, no copiar**: verificar por su cuenta |
| Justin | Ender | Contrato con hash (M14), semántica (M5–M7), errores (M11) | Especificar el doble como `PROVISIONAL` |
| Justin, Itzan | Pablo | Comandos reales (M7) y PostgreSQL/Docker (M8) | Verificar por su cuenta y contrastar |
| Ender | Pablo | La tensión de semántica del aviso (M12) | Preparar la ficha de efectos posteriores |
| Itzan, Justin | Marcelo | El recorrido elegido y sus relaciones (M6, M10) | Avanzar con la operación candidata del paquete |

**Regla del turno:** si dos personas miden lo mismo y les da distinto, eso es un **hallazgo**, no un empate
a resolver charlando. Gana el archivo abierto, y la diferencia se registra.

## 3. Reservas de archivos — para que nadie se pise

| Archivo o área | Reservado para | Nadie más lo toca |
|---|---|---|
| `src/modules/scheduling/ports/agenda-notice.port.ts` | Ender (lectura) | ✔ |
| `src/modules/scheduling/scheduling.module.ts`, `src/orm/config/orm.config.ts` | Itzan (lectura) | ✔ |
| Adaptador de mensajería | Justin (lectura) | ✔ |
| Cualquier archivo de `src/` de Mantra | **Nadie. Escritura prohibida este turno** | ✔ |

## 4. Ambigüedades abiertas del turno — se arrastran, no se resuelven

| ID | Ambigüedad | Quién la puede cerrar | Estado |
|---|---|---|---|
| Q-01 | El paquete se fecha el 20-09-2026 y hoy es 19-09-2026 | Quien encargó el paquete | `ABIERTA` |
| Q-02 | `CURRENT_DAY` del plazo original no verificado | Coordinación | `ABIERTA` |
| Q-03 | `TEAM_CAPACITY` en horas netas sin calcular | Coordinación | `ABIERTA` |
| Q-04 | El registro funcional original no está identificado | Quien tenga el documento aprobado | `ABIERTA` |
| Q-05 | El puerto no declara versión de contrato | El equipo | `ABIERTA` |
| Q-06 | Obligatoriedad y durabilidad del aviso (comentario del puerto vs metaprompt) | **Decisión de negocio** | `DECISION_REQUIRED` |
| Q-07 | Cuándo corresponde el canal de chat | Alcance del piloto | `ABIERTA` |
| Q-08 | Qué operación concreta se aísla | Alcance del piloto | `ABIERTA` |
| Q-11 | Qué configuración de frontend se usará en la aceptación | Coordinación | `ABIERTA` |
| Q-12 / Q-13 | Idempotencia y política de reintentos sin definir | Negocio, vía contrato | `DECISION_REQUIRED` |

**Q-06 es la que más trabajo bloquea.** Si alguien puede decidirla mañana, el Día 2 vale bastante más.

## 5. Cierre del turno — completar acá

Cada quien pega su línea al terminar. **Una fila sin comando y exit code no es un cierre**, es una opinión.

| Persona | HECHO / total | `BLOCKED` con motivo | Handoff entregado | Enlace a su daily |
|---|---|---|---|---|
| Pablo | `NOT_RUN` | — | — | [Pablo-Daily-Noche-2026-09-19.md](Pablo/Pablo-Daily-Noche-2026-09-19.md) |
| Ender | `NOT_RUN` | — | — | [Ender-Daily-Noche-2026-09-19.md](Ender/Ender-Daily-Noche-2026-09-19.md) |
| Itzan | `NOT_RUN` | — | — | [Itzan-Daily-Noche-2026-09-19.md](Itzan/Itzan-Daily-Noche-2026-09-19.md) |
| Marcelo | `NOT_RUN` | — | — | [Marcelo-Daily-Noche-2026-09-19.md](Marcelo/Marcelo-Daily-Noche-2026-09-19.md) |
| Justin | `NOT_RUN` | — | — | [Justin-Daily-Noche-2026-09-19.md](Justin/Justin-Daily-Noche-2026-09-19.md) |

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- La palabra "listo", "funciona" o "implementado" sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOCKED` disfrazado de `PASS` porque "igual compila".
- Datos de pacientes reales en cualquier salida pegada. Si la salida los tenía: **se enmascara y se aclara que se enmascaró**.
