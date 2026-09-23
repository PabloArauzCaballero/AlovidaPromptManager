# Plan — Corregir el avance publicado de Justin

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager`, fuente `mantra-core-health` · Predecesor: `2026-09-23-publicar-avance-justin`.
- Resultado observable: el daily general e individual informan el avance documentado de 20/51, sin confundirlo con los DoD aún pendientes.
- Kill-test: algún daily mantiene `0/51` o presenta 20/51 como cierre completo.

## Alcance

- IN: verificar el plan fuente, corregir los tres punteros de avance y documentar la rectificación.
- OUT: reclasificar microtareas no verificadas, cambiar código de frontend o declarar despliegue.
- Ambigüedad: los planes de continuación se solapan con las 51 microtareas; no se sumarán. La fuente para este porcentaje es el plan inicial `2026-09-23-reserva-y-cotizaciones`.

## H1 — Avance verificable publicado

**CA:** Dado el plan fuente, cuando alguien lee los dailies, entonces ve 20/51 y los límites que impiden declarar cierre total.
**DoD:** búsqueda de `0/51` y `20/51` en los dailies, más reporte de corrección.
**Estado:** HECHO

### H1.S1 — Corrección trazable

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Verificar la fuente del porcentaje | Se identifica el plan que declara 20/51 | `Get-Content .../2026-09-23-reserva-y-cotizaciones/PLAN.md` → `AVANCE: 20 / 51` | HECHO |
| H1.S1.M2 | Corregir daily individual y general | Ninguno afirma 0/51 para Justin | `rg "0 / 51|20 / 51" repartos/2026-09-22/PromptNoche` | HECHO |
| H1.S1.M3 | Publicar reporte de rectificación | El reporte explica fuente y límites | `REPORTE.md` con evidencia literal | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Sumar planes solapados | Inflar el avance | Publicar sólo el 20/51 de la fuente original. |
