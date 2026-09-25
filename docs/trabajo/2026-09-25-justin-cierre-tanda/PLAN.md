# Plan — Publicar el cierre de la tanda del 2026-09-25 (Justin)

- Fecha: 2026-09-25 · Rama: `justin/cierre-tanda-2026-09-25` · Repo: `AlovidaPromptManager`
- Base: `origin/main` @ `d8549a2`
- Predecesor: PR #50 de este repo (el daily de esa noche, ya mergeado)

## Resultado observable

Quien mire el seguimiento ve, **por carril**, en qué quedó la tanda después de cerrarla: qué subió,
qué sigue bloqueado y de quién depende, y los cuatro defectos que aparecieron al mirar.

## Kill-test

Abrir `repartos/2026-09-25/PromptNoche/Justin/Justin-Daily-Noche-2026-09-25.md` y buscar el avance
por carril. Si sigue diciendo los números de la noche (33/41, 60/68, 23/31) sin la corrida de
cierre, esto no está hecho.

## Alcance

- **IN:** el daily de Justin de esa noche · `docs/trabajo/2026-09-25-justin-cierre-tanda/` ·
  una entrada en `ActionLog.md`.
- **OUT:** el repo del front. El trabajo real y su evidencia viven en el PR #687 de
  `mdavila-2001/mantra-core-health`; acá se **publica el estado**, no se duplica la evidencia.
- **Ambigüedades registradas:** el propietario pidió el reporte **por carril, no por microtarea**.
  Se respeta: los números por microtarea quedan en el `REPORTE.md` del front, y acá se publica el
  agregado por carril con lo que hay que decidir.

## H1 — Publicar el estado por carril

**CA:** Dado alguien que no vio la sesión, cuando abre el daily, entonces ve los cinco carriles con
su avance nuevo, lo que sigue bloqueado y de quién depende, sin tener que entrar al repo del front.
**DoD:** el daily actualizado, el `REPORTE.md` en disco con el avance en la primera línea, la
entrada en `ActionLog.md`, y el PR demostrado mergeable con `gh`.

| ID | Microtarea | CA | DoD | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Actualizar el avance de los cinco carriles en el daily | Cada carril muestra antes → ahora | El daily lo dice | HECHO |
| H1.S1.M2 | Publicar los cuatro defectos con dueño | Cada uno con quién lo toma | Sección propia | HECHO |
| H1.S1.M3 | `REPORTE.md` con el avance primero | `head -1` lo muestra | `head -1` | HECHO |
| H1.S1.M4 | Entrada en `ActionLog.md`, arriba | Es la primera entrada | `grep -n "^## "` | HECHO |
| H1.S1.M5 | PR contra `main` mergeable | `mergeable: MERGEABLE`, no draft | `gh pr view --json` | HECHO |
