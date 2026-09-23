# Reporte — Publicar a Justin la medición y la tabla de latencia de Ender

- Fecha: 2026-09-23 · Plan: [PLAN.md](./PLAN.md) · Rama: `ender/publicar-avance-simulador-2026-09-23` (desde `origin/main` `c37bdaa`).
- Peldaño de evidencia alcanzado: `WRITTEN` en PromptManager. Los números vienen de corridas locales en el worktree de Ender (`RUNS`/`TESTED`); no hay observación de navegador de la latencia ni código de producto en un ref compartido.
- Avance: **3 / 3 — 100 %**. PR: [#32](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/32) (OPEN, CI «Espejo sin deriva y candados en verde» pass; el merge lo decide la revisión).

## Completado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Daily de Ender con «antes» (§1–§3), tabla nueva (§4) y publicado (§7) | `grep -c -E "139–323\|791 / 14 / 14\|/scheduling/slots. \| 80" …/Ender-Daily-Noche-2026-09-22.md` | 4 |
| H1.S1.M2 | Daily de equipo: `Ender 14/48`, fila de latencia `PUBLICADO`, fila de cierre | `grep -n -E "Ender 14/48\|PUBLICADO" …/Daily-Noche-2026-09-22.md` | líneas 5 y 153 (y la de cierre) |
| H1.S1.M3 | PR de PromptManager abierto para revisión | `gh pr view 32` | `OPEN` · `MERGEABLE` · CI pass |

## A medias

Ninguna en esta publicación. El carril de Ender sigue `A MEDIAS` (14/48): H2.S2, H3, H4, H5 y H6 sin empezar.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| Commit/PR del cambio de latencia en `mantra-core-health` | NO AUTORIZADO | Autorización de Ender para el Git de producto |
| H3.S1 (agendas para los 13 registrados) | TODO | Autorización para iniciar; decisiones D-1 y D-2 ya tomadas |

## Evidencia

```text
$ git -C mantra-core-health fetch origin && git rev-parse origin/mockup   (corte usado)
8ae7283a2944074d5aecd4f1c634def57ca23083

$ yarn test --include=src/app/core/mock/mock-backend.spec.ts --watch=false   (dos corridas)
Tests  27 passed (27) · exit=0

$ git grep -c 'Math.random' -- src/app/core/mock/mock-backend.interceptor.ts
(sin coincidencias, exit=1)

$ yarn test --watch=false   (después de H2.S1)
Tests  3 failed | 7176 passed (7179) · los mismos 3 rojos del baseline
```

## No cubierto

- La latencia no se midió en navegador: el simulador no sale a la red (`mock-backend.interceptor.ts:48-57`); la medición es de arnés.
- `yarn start:dev` no se volvió a arrancar después del cambio (queda para H6).

## Desvíos del plan

Ninguno.

## Riesgos residuales

- Justin puede leer la tabla, pero no medir contra ella hasta que el cambio esté en un ref compartido.

## Decisiones y ambigüedades

- `SCOPE_AMENDMENT_H2_SPEC = AUTHORIZED_BY_ENDER` (2026-09-23): `src/app/core/mock/mock-backend.spec.ts` entra al scope del carril.
- Autoría: identidad configurada `baamoc`, sin trailers, como la última publicación de Ender en este repo (#25) y los precedentes #27/#28.
