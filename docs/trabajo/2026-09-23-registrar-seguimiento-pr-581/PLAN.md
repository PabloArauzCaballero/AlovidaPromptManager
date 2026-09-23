# Plan — Registrar el seguimiento de Cotizaciones

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager`, fuente `mantra-core-health`.
- Resultado observable: el daily de Justin apunta al PR #581 sin alterar el avance fuente de 20/51.
- Kill-test: el registro presenta #581 como cierre adicional o modifica el porcentaje sin microtareas fuente verificadas.

## H1 — Seguimiento sin inflar el avance

**CA:** Dado el daily de Justin, cuando alguien revisa los avances publicados, entonces puede encontrar el PR #581, su evidencia actual y su límite sin confundirlo con un cierre del carril.
**DoD:** búsqueda de `#581` y de `20 / 51`, más reporte con la fuente y el estado del PR.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Verificar el PR fuente y sus pruebas locales | Se identifica #581 como PR abierto contra `mockup` | Consulta GitHub + comandos registrados | HECHO |
| H1.S1.M2 | Publicar el puntero en el daily individual | El daily enlaza #581 y conserva `20 / 51` | `rg "#581|20 / 51"` sobre el daily | HECHO |
| H1.S1.M3 | Registrar evidencia y límites | El reporte no declara CI, merge ni despliegue no observados | `REPORTE.md` completo | HECHO |
