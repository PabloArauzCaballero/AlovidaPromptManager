# Plan — Corregir la publicación de Ender (tabla de latencia y avance)

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager`; `mantra-core-health` sólo lectura · Predecesor: PR #32 (MERGED).

## Resultado

**Actor:** Justin (mide «elegir médico» contra la latencia vigente) y el equipo de turno.
**Dónde:** daily de Ender y entradas de Ender en el daily de equipo.
**Estado inicial:** #32 publicó `/scheduling/slots` 80 y `/profiles` 100, de una variante local que no quedó; el daily de Ender tiene 8 bloques de conflicto sin resolver (entraron con #34) y dos avances distintos (41/48 y 14/48).
**Observable:** el daily de Ender dice 30/48, la tabla vigente 40/40/90/600/120 (la del código en `mockup`), el contrato C de H3 y que Justin ya puede medir en `mockup`.
**Fuera:** filas y totales de otras personas; los 2 bloques de conflicto del daily de equipo, que mezclan valores de otras personas; código de producto.
**Kill-test:** el daily de Ender conserva un marcador de conflicto, o sigue publicando 80/100 como tabla vigente.

## H1 — Corrección trazable

**CA:** Dado el daily de Ender, cuando Justin lo abre, entonces encuentra la tabla vigente, el avance real y la diferencia entre la medición histórica y el contrato actual.
**DoD:** 0 marcadores en el daily de Ender; `check_reparto` y `check_skills_citadas` en verde; PR abierto.
**Estado:** HECHO

### H1.S1 — Corregir y publicar

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Resolver los 8 bloques del daily de Ender con 30/48, 40/40/90/600/120 y el contrato C | Sin marcadores; sin 80/100 como tabla vigente | `grep -c '^<<<<<<<' …/Ender-Daily-Noche-2026-09-22.md` → 0 | HECHO |
| H1.S1.M2 | Entradas de Ender en el daily de equipo (avance, tabla, renglones, cierre) sin tocar las de otros | Sólo cambian valores de Ender | `git diff` | HECHO |
| H1.S1.M3 | PR a `main` | Revisable en GitHub | `gh pr view` | HECHO |
