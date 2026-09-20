# Daily — turno noche — 2026-09-20

> **Estado:** `IN_PROGRESS`. Se escribió **al repartir**, antes del turno.
> Todo «resultado» está en `NOT_RUN` a propósito: **nadie ejecutó nada todavía**.

- **Turno:** noche · **Día del plazo:** 2 · **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
- **Foco del día, según `PLAN_SEIS_DIAS.md`:** Laboratorio del piloto y prueba material de ausencia (A) · capacidades priorizadas y compatibilidad temprana (B)
- **Evidencia de salida que el día exige:** Artefacto MODULE del piloto o **una dependencia transicional concreta**. Si falla, se limita la expansión hasta entender el bloqueo.
- **Requisitos del cliente:** [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)

> ⚠️ **Fecha asignada por el equipo, no por el paquete.** `PLAN_SEIS_DIAS.md` dice explícitamente
> que **no se asignan fechas nuevas**, pero la estructura del reparto exige una. Se mapeó
> Día 2 → 2026-09-20. **Si el mapeo real es otro, los archivos cambian de carpeta, no de contenido.**
> Ambigüedad `Q-R1`, a confirmar con Pablo.

## 1. Quién tiene qué

| Persona | Lote | Línea | Microtareas | Estado |
|---|---|---|---|---|
| **Pablo** | [Construir el laboratorio de la capacidad del piloto](Pablo/Dia2-LaboratorioDelPiloto.Backend/ConstruirElHarnessDeLaCapacidad.md) | A | 0/9 | `NOT_RUN` |
| **Ender** | [Convertir el contrato en un validador que rechaza lo que debe rechazar](Ender/Dia2-ValidadorDelContrato.Backend/EspecificarYProbarElOraculo.md) | A | 0/8 | `NOT_RUN` |
| **Itzan** | [Demostrar materialmente la ausencia del proveedor](Itzan/Dia2-PruebaDeAusencia.Backend/DemostrarAusenciaDelProveedor.md) | A | 0/9 | `NOT_RUN` |
| **Marcelo** | [Diseñar los casos de aceptación del recorrido y sus datos](Marcelo/Dia2-CasosDelRecorrido.Registro/DisenarCasosYDatosDelRecorrido.md) | B | 0/8 | `NOT_RUN` |
| **Justin** | [Ejercitar la relación con dobles fijados de ambos extremos](Justin/Dia2-AdaptadorConDobles.Integracion/ProbarLaRelacionConDoblesFijados.md) | B | 0/8 | `NOT_RUN` |

**Total del turno: 0 / 42 microtareas.** El avance se reporta `HECHO / total`, **nunca a ojo**.

## 2. Lo primero, para todos

Antes de la primera microtarea, cada uno instala y carga el estándar (sección 1 de su prompt) y
pega la salida de los dos comandos en su daily. **Un lote que arranca sin eso arranca en `BLOQUEADO`.**

## 3. Reservas de archivos — para que nadie se pise

| Área | Reservada para |
|---|---|
| Puerto `agenda-notice.port.ts` y artefactos de contrato | Ender |
| `scheduling.module.ts`, `orm.config.ts`, composición y baseline | Itzan |
| Adaptador de mensajería y registro de checks | Justin |
| Laboratorio, harness y reparaciones acotadas | Pablo |
| Casos de aceptación y evidencia del recorrido | Marcelo |

**Dos personas escribiendo el mismo archivo es un defecto del reparto, no un accidente.**
Si te toca tocar algo reservado, avisá antes.

## 4. Cierre del turno — completar acá

| Persona | HECHO / total | `BLOCKED` con motivo | Handoff entregado | Su daily |
|---|---|---|---|---|
| Pablo | `NOT_RUN` | — | — | [Pablo-Daily-Noche-2026-09-20.md](Pablo/Pablo-Daily-Noche-2026-09-20.md) |
| Ender | `NOT_RUN` | — | — | [Ender-Daily-Noche-2026-09-20.md](Ender/Ender-Daily-Noche-2026-09-20.md) |
| Itzan | `NOT_RUN` | — | — | [Itzan-Daily-Noche-2026-09-20.md](Itzan/Itzan-Daily-Noche-2026-09-20.md) |
| Marcelo | `NOT_RUN` | — | — | [Marcelo-Daily-Noche-2026-09-20.md](Marcelo/Marcelo-Daily-Noche-2026-09-20.md) |
| Justin | `NOT_RUN` | — | — | [Justin-Daily-Noche-2026-09-20.md](Justin/Justin-Daily-Noche-2026-09-20.md) |

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOCKED` disfrazado de `PASS` porque «igual compila».
- Datos de pacientes reales en cualquier salida pegada.
