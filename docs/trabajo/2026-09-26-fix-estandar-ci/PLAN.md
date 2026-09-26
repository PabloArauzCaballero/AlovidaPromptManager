# Plan — Fix job estandar en PR #53

- Fecha: 2026-09-26 · Repos afectados: AlovidaPromptManager · Predecesor: ninguno
- Resultado observable: el chequeo `tools/check_reparto.py repartos/2026-09-25` termina en OK para la fecha 2026-09-25.
- Kill-test: si `python tools/check_reparto.py repartos/2026-09-25` devuelve `ESTRUCTURA INCOMPLETA`, el trabajo NO está hecho.

## Alcance
- IN: corregir el prompt de reparto que quedó fuera de estándar en `repartos/2026-09-25/PromptNoche/Justin/Noche-DiagnosticoIA.D1-D4/DiagnosticoConIAYGlosarioMasivo.md`; documentar evidencia en este trabajo.
- OUT: cambios de lógica en `tools/check_reparto.py`, cambios en otros repartos, refactors no pedidos.
- Ambigüedades registradas: ninguna.

## H1 — Corregir estructura obligatoria del prompt D1–D4
**CA:** Dado el reparto del 2026-09-25, cuando se corre `check_reparto`, entonces el prompt D1–D4 cumple todas las marcas obligatorias y no reporta faltantes.
**DoD:** `python tools/check_reparto.py repartos/2026-09-25` → salida `check_reparto: OK, 2026-09-25 cumple la estructura obligatoria`.
**Estado:** TODO

### H1.S1 — Actualizar el prompt y validar
**CA:** El archivo D1–D4 contiene instalación obligatoria, kill-test, alcance OUT, capas H/S/M y secciones de ambigüedades y DoD del hito.
**DoD:** comando del hito en verde + diff limitado al archivo objetivo y a documentación de este trabajo.
**Estado:** TODO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Crear carpeta de trabajo y PLAN | Existe `PLAN.md` con alcance/kill-test/DoD | `test -f docs/trabajo/2026-09-26-fix-estandar-ci/PLAN.md` | HECHO |
| H1.S1.M2 | Corregir `DiagnosticoConIAYGlosarioMasivo.md` al formato obligatorio | El archivo contiene todas las marcas exigidas por `check_reparto` | `python tools/check_reparto.py repartos/2026-09-25` | TODO |
| H1.S1.M3 | Emitir reporte de cierre con evidencia | Existe `REPORTE.md` con completado/a medias/pendiente y evidencia literal | `test -f docs/trabajo/2026-09-26-fix-estandar-ci/REPORTE.md` | TODO |

## Riesgos y bloqueos previstos
| Riesgo | Impacto | Mitigación |
|---|---|---|
| Omitir una marca textual exacta requerida por el validador | el CI vuelve a fallar | validar localmente con `tools/check_reparto.py` antes de cerrar |
