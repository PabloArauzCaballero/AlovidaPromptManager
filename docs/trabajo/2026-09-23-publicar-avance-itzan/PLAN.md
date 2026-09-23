# Plan — Publicar el avance del carril de formularios y perfil

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager` · Predecesor: [`2026-09-21-refactor-formularios-y-perfil`](../2026-09-21-refactor-formularios-y-perfil/REPORTE.md)
- Resultado observable: quien abra el daily de Itzan del 2026-09-21 —o el de equipo— encuentra, sin preguntar, los dos PRs del carril, su merge y el avance con el que se cerró.
- Kill-test: `rg -n '#576|#26' repartos/2026-09-21/PromptNoche/` devuelve **0 coincidencias**. Si devuelve 0, el avance no está publicado por más que el trabajo esté fusionado.

## Alcance

- IN: el daily personal de Itzan y el daily de equipo del 2026-09-21; el plan y el reporte de esta publicación.
- OUT: el `PLAN.md` y el `REPORTE.md` del carril original — ya están fusionados en `main` y no se reescriben. Las tres microtareas `A MEDIAS` del carril siguen `A MEDIAS`: publicar el puntero no las cierra.
- Ambigüedades registradas: ninguna. El formato del puntero se toma del precedente ya fusionado en `main`, `repartos/2026-09-22/PromptNoche/Justin/Justin-Daily-Noche-2026-09-22.md` §8.

## H1 — El avance del carril es visible desde el reparto

**CA:** Dado alguien del equipo que no siguió el carril, cuando abre el daily de Itzan del 2026-09-21, entonces ve los dos PRs con su número, su merge y su fecha, y el avance con el que el carril cerró.
**DoD:** `rg -n '#576|#26' repartos/2026-09-21/PromptNoche/` con al menos una coincidencia por daily · `py -3 tools/check_reparto.py repartos/2026-09-21/` sin hallazgos.
**Estado:** TODO

### H1.S1 — Los punteros, en los dos dailies

**CA:** Los dos dailies del 2026-09-21 nombran los PRs y enlazan al reporte del carril.
**DoD:** las tres microtareas de abajo en `HECHO`.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | El daily personal declara los dos PRs, su merge y su fecha | El daily nombra `#576` y `#26` con enlace, SHA de merge y fecha UTC | `rg -c '#576\|#26' repartos/2026-09-21/PromptNoche/Itzan/Itzan-Daily-Noche-2026-09-21.md` → ≥ 4 | TODO |
| H1.S1.M2 | El daily de equipo apunta al avance de Itzan | La fila de Itzan del cuadro de carriles lleva el PR y el avance | `rg -c '#576' repartos/2026-09-21/PromptNoche/Daily-Noche-2026-09-21.md` → ≥ 1 | TODO |
| H1.S1.M3 | La estructura del reparto sigue en verde | El candado del reparto no encuentra hallazgos nuevos | `py -3 tools/check_reparto.py repartos/2026-09-21/` → sin hallazgos | TODO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El puntero se lee como si cerrara el carril | Alguien da por hechas las tres `A MEDIAS` | El texto dice el avance real —`62 / 68`— y nombra qué quedó sin cerrar |
| Publicar tarde vuelve a pasar en el próximo carril | El equipo se entera con días de atraso | El reporte deja escrito por qué faltó: el daily se escribe antes de que el PR exista, y nada obliga a volver |
