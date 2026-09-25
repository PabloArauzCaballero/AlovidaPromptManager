# C8 — Integración de la noche: mergear, resolver los `TODO C8`, recorrido completo y cierre documental

> **Rol:** integrador · **Responsable:** Justin · **Carril:** C8 · **Fecha:** 2026-09-26 (mañana) · **Depende de:** C1–C7 y C9 con PR abierto (los que no llegaron se integran igual hasta donde estén y se anota)
> **Plan maestro:** [`PLAN-MAESTRO.md`](../../../../../docs/trabajo/2026-09-25-plan-y-reparto-encuentro-clinico/PLAN-MAESTRO.md) — §4.3, §5, §6, §7 C8, §10

## 0. Ficha de asignación

| Campo | Valor |
|---|---|
| `REPO` | `mantra-core-health`; y este repo (`AlovidaPromptManager`) para el daily de equipo y el `ActionLog.md` |
| `TARGET_REF` | `origin/mockup` a la mañana (con lo que cada carril haya pusheado) |
| `RAMA` | `claude/clinica-c8-integracion` |
| `WORKTREE` | `<raíz de tus repos>/wt-clinica-c8` |
| `PUERTO` | `4218` |
| `ARCHIVOS RESERVADOS` | los `// TODO C8` dejados por C1–C7/C9 (subir tipos a los congelados, unificar clientes duplicados, `GET /charts/patients/:id/chart` limpio, montar `encounter-timeline` en `consultation` y `patient-chart`) · `PENDIENTES-BACKEND.md` · `docs/trabajo/2026-09-25-encuentro-clinico/REPORTE-FINAL.md` · `playwright/clinica-c8-recorrido-completo.spec.ts` · `ESTADO-FRONTEND.md` (una entrada) · `docs/index.md` (enlace) · en este repo: la sección «Paquete 3 — Encuentro clínico» de `repartos/2026-09-25/PromptNoche/Daily-Noche-2026-09-25.md` (las de Farmacia y Carga Masiva no se tocan) y `ActionLog.md` |
| `CUENTAS` | `medica@alovida.mock`, `paciente@alovida.mock` |
| `LÍMITE DE RECURSOS` | **sólo vos** corriendo builds y la suite entera; un `yarn start`; Playwright vía `pw-guard` |
| `TUS OTROS CARRILES ESTA NOCHE` | Farmacia: `Noche-Farmacia.TiendaYReceta` · Carga Masiva: `Noche-CargaMasiva.PantallaDragAndDrop`. C8 va a la mañana, después de tus otros dos carriles. Sin cruces de archivos. Tu daily es uno solo (`Justin-Daily-Noche-2026-09-25.md`): este carril va en su sección «Carril C — Encuentro clínico». |

## 1. Estándar y skills

§5.1 del plan. **Skills:** `skills-router` → `outcome-first` → `factual-discovery` → `git-workflow-multirepo` → `pr-mergeable-gate` → `regression-suite-management` → `qa-orchestration` → `e2e-playwright` → `e2e-failure-triage` → `root-cause-debugging` → `integrity-testing` → `visual-proof` → `critical-double-review` → `evidence-and-verification` → `qa-evidence-reporting` → `work-report-md` → `technical-docs-and-adr` → `finish-your-turn`. Del repo: `visual-quality-gate`, `frontend-production-gate`; agentes `visual-reviewer`, `frontend-reviewer`, `regression-auditor` sobre el conjunto.

## 2. Resultado observable y kill-test

`origin/mockup` contiene C0–C7 y C9 sin conflictos; el recorrido completo pasa en un solo Playwright vía `pw-guard`; `PENDIENTES-BACKEND.md` tiene P39–P42; `REPORTE-FINAL.md` existe; el daily de equipo de este repo tiene el avance real (HECHO/total) de los diez carriles y la entrada del `ActionLog.md` está arriba de todo.

**Kill-test:** el recorrido completo (§6) verde con `--workers=1`; si no, C8 no cierra.

## 3. Lo que integrás

1. Por cada PR de C1–C7/C9: rebase sobre `origin/mockup` **en su rama** (si la rama tiene commits que no son de esa sesión, avisar y no forzar), merge en tu rama. Conflictos esperados: 0. Si aparece uno, es un archivo fuera de lista: anotá el carril culpable y resolvé conservando ambos comportamientos.
2. `grep -rn "TODO C8" src` → resolver cada uno: subir `follow-up.types.ts` / `<carril>.types.ts` a los tipos congelados; reemplazar `analysis-order-notes.client` por `ChartNotesClient.listNotes`; hacer que `GET /charts/patients/:id/chart` viva en un solo lugar (función exportada de `clinical.handlers.ts` que `medical-notes.handlers.ts` extiende, o el `chart` que ya lee `notasMedicas`).
3. Montar `app-encounter-timeline` (C6) en la consulta («Lo registrado en este encuentro», bajo la rejilla) y en la pestaña «Encuentros» del expediente (al desplegar).
4. Lo que un carril dejó «A medias» y bloquea el recorrido: completarlo si cabe en 1 h; si no, anotarlo en `REPORTE-FINAL.md` como pendiente con dueño.

## 4. Microtareas

| ID | Microtarea | CA | DoD |
|---|---|---|---|
| C8.H1.M1 | Merges | Lista de SHAs; conflictos = 0 (o anotados) | `git log --merges` |
| C8.H1.M2 | `TODO C8` resueltos | `grep -rn "TODO C8" src` = 0 | `yarn typecheck` |
| C8.H1.M3 | `encounter-timeline` montado en consulta y expediente | Se ve con datos del recorrido | captura |
| C8.H2.M1 | Gates completos: `lint`, `typecheck`, `build`, `yarn test --watch=false` **entero** con «N passed» (sin otros servidores), todos los `check-*.mjs`, `generate-inventory.mjs --check` | exit 0; rojos previos comparados con `evidencia/antes/` de C0 | salidas en `evidencia/` |
| C8.H2.M2 | Playwright `clinica-c8-recorrido-completo.spec.ts` (§6) | verde | `node scripts/pw-guard.mjs --port 4218 --deadline 40 --spec playwright/clinica-c8-recorrido-completo.spec.ts --serve` |
| C8.H2.M3 | Barridos `mockup-barrido.spec.ts` y `mockup-click-sweep.spec.ts` vía `pw-guard`: sin `[mock] sin manejador` nuevos ni errores de consola nuevos | diff de `MOCKUP_MATRIX.md` contra el corte | artefactos |
| C8.H2.M4 | Revisores sobre el conjunto; `critical-double-review` de las capturas finales | Cero BLOCKER/CRITICAL/HIGH | informe |
| C8.H3.M1 | `PENDIENTES-BACKEND.md`: P39–P42 (tabla de cabecera + sección por pendiente con Modelo / DTO / Servicio / Estado del frontend, desde los `REPORTE.md`) | Cuatro filas y cuatro secciones | `node scripts/check-doc-links.mjs` |
| C8.H3.M2 | `REPORTE-FINAL.md` + sección «Paquete 3 — Encuentro clínico» del daily de equipo (tabla HECHO/total por carril, lo que destrabó a quién, incidentes) + entrada en `ActionLog.md` de este repo | — | — |
| C8.H3.M3 | Commits, `pull --rebase`, `git push origin HEAD:mockup`, PR `--base mockup`; PR `--base dev` **sólo si** el propietario lo pide; push de este repo a `main` | `origin/mockup` = HEAD; `origin/main` con el daily | `git log --oneline -3 origin/mockup` |

## 5. Playwright del recorrido completo

`node scripts/pw-guard.mjs --port 4218 --deadline 40 --spec playwright/clinica-c8-recorrido-completo.spec.ts --serve` (background). Un solo `test.describe.configure({ mode: 'serial' })`:

médica → Mis citas → «Iniciar la consulta» → Nota médica (3 filas) → Orden de análisis Laboratorio «basada en» esa nota → Diagnóstico (presuntivo) → Reconsulta (cupo de mañana) → Diagnóstico → Acciones → Confirmar (motivo + evidencia: la nota; fin en 30 días) → Receta ligada al confirmado → «Ver expediente»: Enfermedades activas lo lista; Notas muestra 3 filas; Diagnósticos muestra Confirmado «por nota»; Encuentros → línea del encuentro completa → Consultas médicas: fila de la reconsulta con sello → logout → paciente → Mis citas: reconsulta con sello → Mi historia: Diagnósticos (activa) y Atenciones → línea del encuentro con nota, orden, diagnóstico, reconsulta y receta → **Mis órdenes: pestaña Laboratorio muestra la orden nueva; el buscador la encuentra; la paginación responde** → `page.reload()` en cada pantalla final → todo sigue.

## 6. Cierre

Checklist §9 del plan. Commits `merge: carriles C1–C7 y C9 en integración`, `fix(integracion): …`, `docs(pendientes): P39–P42`, `docs(reporte): cierre de la noche del 2026-09-25`. Push a `mockup` verificado. En este repo: la sección «Paquete 3 — Encuentro clínico» del daily de equipo completa (sin tocar las de Farmacia y Carga Masiva), `ActionLog.md` con la entrada del cierre (rama, paquete, qué se entregó, qué quedó), `git pull --rebase origin main && git push origin main`.
