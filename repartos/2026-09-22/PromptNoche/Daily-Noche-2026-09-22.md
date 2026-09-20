# Daily — turno noche — 2026-09-22

> **Estado:** `IN_PROGRESS`. Se escribió **al repartir**, antes del turno.
> Todo «resultado» está en `NOT_RUN` a propósito: **nadie ejecutó nada todavía**.

- **Turno:** noche · **Día del plazo:** 4 · **Paquete fuente:** `BACKEND_AUTONOMO_MANTRA`
- **Foco del día, según `PLAN_SEIS_DIAS.md`:** Corregir dependencias residuales y estabilizar contratos y baseline (A) · recorridos multi-módulo, migración conjunta, idempotencia y concurrencia (B)
- **Evidencia de salida que el día exige:** Evidencias de rollback y recuperación, compatibilidad, y la lista de proveedores externos pendientes.
- **Requisitos del cliente:** [`docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md`](../../../docs/requisitos/REQUISITOS-CLIENTE-ALOVIDA.md)

> ⚠️ **Fecha asignada por el equipo, no por el paquete.** `PLAN_SEIS_DIAS.md` dice explícitamente
> que **no se asignan fechas nuevas**, pero la estructura del reparto exige una. Se mapeó
> Día 4 → 2026-09-22. **Si el mapeo real es otro, los archivos cambian de carpeta, no de contenido.**
> Ambigüedad `Q-R1`, a confirmar con Pablo.

## 1. Quién tiene qué

| Persona | Lote | Línea | Microtareas | Estado |
|---|---|---|---|---|
| **Pablo** | [Corregir las dependencias residuales que liberan más trabajo](Pablo/Dia4-DependenciasResiduales.Backend/CorregirLoQueLibereMasTrabajo.md) | A | 0/8 | `NOT_RUN` |
| **Ender** | [Congelar la versión estable del contrato y su matriz de consumidores](Ender/Dia4-CongelarContratos.Backend/CongelarYPublicarLaVersionEstable.md) | A | 0/7 | `NOT_RUN` |
| **Itzan** | [Estabilizar el baseline y probar la migración conjunta](Itzan/Dia4-BaselineYMigracion.Backend/EstabilizarBaselineYMigracionConjunta.md) | A | 0/8 | `NOT_RUN` |
| **Marcelo** | [Ejercitar el recorrido que cruza varios módulos](Marcelo/Dia4-RecorridoMultiModulo.Registro/EjercitarElRecorridoCompleto.md) | B | 0/8 | `NOT_RUN` |
| **Justin** | [Probar idempotencia, concurrencia y recuperación de la relación](Justin/Dia4-IdempotenciaYConcurrencia.Integracion/ProbarIdempotenciaYConcurrencia.md) | B | 0/8 | `NOT_RUN` |

**Total del turno: 0 / 39 microtareas.** El avance se reporta `HECHO / total`, **nunca a ojo**.

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
| Pablo | `NOT_RUN` | — | — | [Pablo-Daily-Noche-2026-09-22.md](Pablo/Pablo-Daily-Noche-2026-09-22.md) |
| Ender | `NOT_RUN` | — | — | [Ender-Daily-Noche-2026-09-22.md](Ender/Ender-Daily-Noche-2026-09-22.md) |
| Itzan | `NOT_RUN` | — | — | [Itzan-Daily-Noche-2026-09-22.md](Itzan/Itzan-Daily-Noche-2026-09-22.md) |
| Marcelo | `NOT_RUN` | — | — | [Marcelo-Daily-Noche-2026-09-22.md](Marcelo/Marcelo-Daily-Noche-2026-09-22.md) |
| Justin | `NOT_RUN` | — | — | [Justin-Daily-Noche-2026-09-22.md](Justin/Justin-Daily-Noche-2026-09-22.md) |

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOCKED` disfrazado de `PASS` porque «igual compila».
- Datos de pacientes reales en cualquier salida pegada.
