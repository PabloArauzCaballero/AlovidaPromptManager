# Plan — Publicar el avance de Justin: reserva y cotizaciones

- Fecha: 2026-09-23 · Repos afectados: `AlovidaPromptManager`, `mantra-core-health` (solo lectura) · Predecesor: `repartos/2026-09-22/PromptNoche/Justin/Justin-Daily-Noche-2026-09-22.md`.

## Resultado

**Actor:** Pablo y el equipo de turno.
**Dónde:** daily personal y daily de equipo del reparto nocturno.
**Estado inicial:** el frontend contiene merges de Justin, pero el daily aún declara `0 / 51` y no hay puntero a los PRs.
**Acción:** leer el registro del reparto.
**Observable:** identifica qué commits/PRs llegaron a `mockup`, cuál sigue abierto y qué trabajo queda pendiente, sin confundirlo con un despliegue verificado.
**Fuera:** modificar código frontend, fusionar PRs, forzar un despliegue o cambiar el reparto original de 51 microtareas.
**Kill-test:** el daily no contiene los enlaces a #578, #579 y #580, o declara un despliegue que no fue observado.

## Alcance

- IN: crear PLAN/REPORTE de esta publicación; actualizar el daily personal de Justin y el daily del equipo con referencias verificadas a los PRs, evidencia y bloqueos.
- OUT: editar prompts de otros responsables, estados de microtareas no demostradas, código de `mantra-core-health`, o desplegar.
- Ambigüedad: el host del mockup no es accesible por SSH desde este equipo; se declarará como límite de observación y no se inferirá la causa del despliegue desactualizado.

## H1 — Avance trazable en PromptManager

**CA:** Dado el daily de Justin, cuando alguien lo abre, entonces puede distinguir lo fusionado en `mockup`, el PR abierto, la evidencia disponible y los pendientes sin consultar el chat.
**DoD:** `git diff --check` y búsquedas de los tres PRs en los dos dailies.
**Estado:** HECHO

### H1.S1 — Registrar hechos y límites

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Escribir el reporte de publicación con los SHAs/PRs y el estado del mockup | El reporte no presenta la pantalla como desplegada/verificada | `rg -n '#578|#579|#580' REPORTE.md` → 5 coincidencias | HECHO |
| H1.S1.M2 | Actualizar los dos dailies con el avance y los punteros | Pablo puede encontrar el avance desde el daily de equipo | `rg -n '#578|#579|#580' …` → 9 coincidencias | HECHO |
| H1.S1.M3 | Publicar un PR de PromptManager | El registro es revisable desde GitHub | `gh pr view 27` | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El mockup sirva un artefacto anterior | El equipo no ve los merges recientes | Separar merge de despliegue; registrar hora observada y no afirmar publicación |
| Un PR se fusione mientras se publica el reporte | El estado queda obsoleto | Reconsultar los PRs antes del commit y citar el corte temporal |
