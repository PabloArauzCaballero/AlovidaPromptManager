# Plan — Publicar a Justin la medición y la tabla de latencia de Ender

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager`; `mantra-core-health` (sólo lectura: sin commit, push ni PR) · Predecesor: `repartos/2026-09-22/PromptNoche/Ender/Ender-Daily-Noche-2026-09-22.md`.

## Resultado

**Actor:** Justin (mide «elegir médico» con la latencia nueva) y el equipo de turno.
**Dónde:** daily personal de Ender (§3, §4, §7) y daily de equipo (encabezado, «PUBLICADO», tabla de cierre).
**Estado inicial:** el daily de Ender declara `0 / 48` y no tiene los números del «antes» ni la tabla de latencia.
**Acción:** leer el daily de Ender.
**Observable:** encuentra la latencia actual medida, el conteo de agendas, la cadena «elegir médico», la tabla nueva con su motivo y por qué DevTools no ve las peticiones del simulador.
**Fuera:** código de `mantra-core-health`, H3 y H4, estados de microtareas sin demostrar, filas de otros responsables.
**Kill-test:** el daily no contiene `139–323`, `791 / 14 / 14` y la tabla `40 · 80 · 100 · 600 · 120`, o afirma que el cambio de producto está en un ref compartido.

## Alcance

- IN: este PLAN y su REPORTE; el daily de Ender; en el daily de equipo, la línea de avance de Ender, la fila «Tabla de latencia por prefijo» y la fila de cierre de Ender.
- OUT: filas y dailies de otras personas; código de producto; merge del PR (lo decide la revisión).
- Autorización: Ender, 2026-09-23 — rama + commit + push + PR en AlovidaPromptManager, **sólo** para publicar H1.S2 y H2.S1.M5. Ningún Git write en `mantra-core-health`.

## H1 — Publicación trazable

**CA:** Dado el daily de Ender, cuando Justin lo abre, entonces tiene los números del «antes» y la tabla de latencia sin consultar el chat.
**DoD:** `git diff --check` limpio; búsquedas de los números en los dailies; PR abierto.
**Estado:** HECHO

### H1.S1 — Registrar y publicar

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Daily de Ender con §1–§3 del «antes», §4 tabla, §6–§7 estado y publicado | Los números y la tabla están en el daily | `rg -n '139–323\|791 / 14 / 14\|/scheduling/slots. \| 80' …/Ender-Daily-Noche-2026-09-22.md` | HECHO |
| H1.S1.M2 | Daily de equipo: `Ender 14/48`, fila de latencia `PUBLICADO`, fila de cierre | Pablo encuentra el avance desde el daily de equipo | `rg -n 'Ender 14/48\|PUBLICADO' …/Daily-Noche-2026-09-22.md` | HECHO |
| H1.S1.M3 | Publicar un PR de PromptManager | El registro es revisable en GitHub | `gh pr view <n>` | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Leer «publicado» como «en `mockup`» | Justin mide contra un código que no existe en ningún ref | El daily dice explícitamente: local, sin commit en producto |
| Las rutas `evidencia/…` son locales | Nadie más puede abrirlas | Los números que importan están copiados en el daily |
