# Plan — Cerrar el click-sweep histórico del carril de agenda

- Fecha: 2026-09-21 · Repo: `AlovidaPromptManager` · Predecesor: `repartos/2026-09-20/PromptNoche/Pablo/Noche-CorreccionesDoctor.AgendaConsultas/entregables/REPORTE.md`
- Resultado observable: la única microtarea `A MEDIAS` del carril de Pablo queda cerrada o conserva su estado con evidencia de una corrida sobre el corte base `68dcb562`.
- Kill-test: el click-sweep en el corte base no reproduce los 10 clics rotos de Médica; en ese caso no se puede atribuirlos al baseline ni marcar la microtarea `HECHO`.

## Alcance

- IN: ejecutar el click-sweep histórico sobre `68dcb562`; conservar su salida; actualizar el plan y reporte del carril de Pablo con el resultado comprobado.
- OUT: cambiar la maqueta o el frontend; corregir rutas de perfil o cotizaciones; cambiar el comportamiento del click-sweep.

## H1 — Atribución comprobada de los clics rotos

**CA:** Dado el corte base `68dcb562`, cuando corre el click-sweep con la cuenta Médica, entonces se puede comparar su resultado con los diez fallos reportados por el carril de agenda.

**DoD:** `E2E_BASE_URL=http://localhost:4200 corepack yarn exec playwright test playwright/mockup-click-sweep.spec.ts --workers=1 --reporter=list` ejecutado desde un worktree detenido en `68dcb562`, con salida literal archivada.

**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Correr y registrar el sweep del corte base | La salida identifica que los fallos de perfil y cotizaciones ya existían en `68dcb562` | `evidencia/h1s1m1-click-sweep-base.txt` + comparación explícita | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El servidor del corte base no inicia | No hay comparación válida | Registrar el fallo de infraestructura; no alterar el estado de la microtarea original |
| Los fallos difieren | No se puede cerrar por baseline | Mantener `A MEDIAS` y documentar la discrepancia |
