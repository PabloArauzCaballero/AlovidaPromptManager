# Daily — turno noche — 2026-09-23

> **Estado:** `IN_PROGRESS`. Se escribió **al repartir**, antes del turno.
> Todo «resultado» está en `NOT_RUN` a propósito: **nadie ejecutó nada todavía**.

- **Turno:** noche · **Día del plazo:** 5 · **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
- **Foco del día, según `PLAN_SEIS_DIAS.md`:** Regresión de aislamiento, replay, controles de dobles en producción y empaquetado (A) · candidato compuesto y aceptación del registro (B)
- **Evidencia de salida que el día exige:** Matriz de pasos con evidencia; fallos críticos y decisiones de alcance **explícitas**.
- **Requisitos del cliente:** [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)

> ⚠️ **Fecha asignada por el equipo, no por el paquete.** `PLAN_SEIS_DIAS.md` dice explícitamente
> que **no se asignan fechas nuevas**, pero la estructura del reparto exige una. Se mapeó
> Día 5 → 2026-09-23. **Si el mapeo real es otro, los archivos cambian de carpeta, no de contenido.**
> Ambigüedad `Q-R1`, a confirmar con Pablo.

## 1. Quién tiene qué

| Persona | Lote | Línea | Microtareas | Estado |
|---|---|---|---|---|
| **Pablo** | [Regresión de aislamiento y replay del contraejemplo](Pablo/Dia5-RegresionDeAislamiento.Backend/RegresionYReplay.md) | A | 0/7 | `NOT_RUN` |
| **Ender** | [Probar que una versión incompatible rompe donde debe y que lo histórico no se toca](Ender/Dia5-InmutabilidadDeContratos.Backend/ProbarIncompatibilidadEInmutabilidad.md) | A | 0/7 | `NOT_RUN` |
| **Itzan** | [Empaquetar el candidato final del módulo](Itzan/Dia5-EmpaquetadoFinal.Backend/EmpaquetarElCandidatoDelModulo.md) | A | 0/7 | `NOT_RUN` |
| **Marcelo** | [Ejecutar la aceptación del registro con los participantes reales disponibles](Marcelo/Dia5-AceptacionDelRegistro.Registro/EjecutarLaAceptacionConParticipantesReales.md) | B | 0/8 | `NOT_RUN` |
| **Justin** | [Probar que un doble no puede llegar a producción ni salir a un destinatario real](Justin/Dia5-ControlesDeProduccion.Integracion/ProbarQueUnDobleNoLlegaAProduccion.md) | B | 0/7 | `NOT_RUN` |

**Total del turno: 0 / 36 microtareas.** El avance se reporta `HECHO / total`, **nunca a ojo**.

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
| Pablo | `NOT_RUN` | — | — | [Pablo-Daily-Noche-2026-09-23.md](Pablo/Pablo-Daily-Noche-2026-09-23.md) |
| Ender | `NOT_RUN` | — | — | [Ender-Daily-Noche-2026-09-23.md](Ender/Ender-Daily-Noche-2026-09-23.md) |
| Itzan | `NOT_RUN` | — | — | [Itzan-Daily-Noche-2026-09-23.md](Itzan/Itzan-Daily-Noche-2026-09-23.md) |
| Marcelo | `NOT_RUN` | — | — | [Marcelo-Daily-Noche-2026-09-23.md](Marcelo/Marcelo-Daily-Noche-2026-09-23.md) |
| Justin | `NOT_RUN` | — | — | [Justin-Daily-Noche-2026-09-23.md](Justin/Justin-Daily-Noche-2026-09-23.md) |

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOCKED` disfrazado de `PASS` porque «igual compila».
- Datos de pacientes reales en cualquier salida pegada.
