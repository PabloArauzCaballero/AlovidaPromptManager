# Plan — Publicar el informe de brechas front↔back y sus 30 prompts

- Fecha: 2026-09-24 · Repo afectado: `PabloArauzCaballero/AlovidaPromptManager` · Predecesor: PR 628 de `mantra-core-health` (mismo paquete, publicado en el repo equivocado)
- Resultado observable: la rama principal del repositorio muestra el paquete completo del informe de brechas dentro de `planes/03-brechas-front-back-2026-09-24/`, con el README, los 30 prompts `BR-01…BR-30`, los anexos A–F y los inventarios. El PR 628 del front queda cerrado apuntando a este PR.
- Kill-test: comparar los hashes SHA-256 del paquete de origen (rama `justin/docs-brechas-front-back-2026-09-24` del front) y del destino. Cualquier archivo faltante, extra o distinto, salvo el README ajustado a propósito en H1.S1.M2, hace fallar la entrega.

## Alcance

- IN:
  - copiar los 45 archivos del paquete a `planes/03-brechas-front-back-2026-09-24/`;
  - ajustar la única ruta del README que apunta al repo del front (§11, regenerar inventarios);
  - registrar el trabajo en `ActionLog.md` y en este `PLAN.md` / `REPORTE.md`;
  - publicar la rama y el PR contra `main`;
  - cerrar el PR 628 del front con un comentario que apunte al nuevo PR.
- OUT:
  - editar el contenido de los hallazgos o de los prompts;
  - las skills, las reglas y los hooks del repositorio;
  - borrar la rama del front (queda como referencia; se puede reabrir el 628).
- Ambigüedades registradas: el pedido original decía «súbelo como PR … a prompts». Se interpretó primero como «en formato de prompts» y se publicó en el front (PR 628). Justin aclaró que el destino era este repositorio. Supuesto tomado: la carpeta es `planes/` con el número siguiente, `03`, igual que el plan médico `02-…`. A confirmar con Justin o Pablo si prefieren `repartos/`.

## H1 — Paquete de brechas disponible en AlovidaPromptManager

**CA:** Dado el paquete del informe de brechas, cuando se consulta la rama del PR en este
repositorio, entonces aparecen los mismos 45 archivos bajo `planes/03-brechas-front-back-2026-09-24/`,
idénticos al origen salvo el bloque del §11 del README, y el PR 628 del front está cerrado con un
enlace a este.

**DoD:**
- manifiestos SHA-256 de origen y destino, con una sola diferencia: `README.md`;
- `python tools/check_skills_citadas.py` en verde;
- el PR consultado con `gh pr view --json mergeable,mergeStateStatus`;
- el PR 628 en estado `CLOSED`.

**Estado:** A MEDIAS — H1.S1 y H1.S2 en HECHO; H1.S3 BLOQUEADO por decisión (ver H1.S3)

### H1.S1 — Copiar y ajustar el paquete

**CA:** el destino conserva nombres, estructura y bytes del origen, y el README no apunta a rutas
del repo del front. **DoD:** diff de manifiestos con sólo el README distinto, y `grep` sin rutas
del front en el README. **Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Copiar el paquete completo | Existen exactamente los mismos 45 archivos | `diff` de manifiestos `sha256sum` → sólo difiere `README.md` después de M2 | HECHO |
| H1.S1.M2 | Ajustar el §11 del README a la ruta de este repo | Ninguna ruta `mantra-core-health/docs/brechas…` en el README | `grep -c "mantra-core-health/docs/brechas" README.md` → 0 | HECHO |

### H1.S2 — Registrar y publicar

**CA:** el trabajo queda registrado y el PR queda abierto y mergeable. **DoD:** salida de `gh` pegada. **Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Entrada en `ActionLog.md` | La entrada del 2026-09-24 está arriba de todo | `head -20 ActionLog.md` la muestra | HECHO |
| H1.S2.M2 | Gate de skills citadas | Ninguna skill citada inexistente | `python tools/check_skills_citadas.py` → exit 0 | HECHO |
| H1.S2.M3 | Publicar la rama y abrir el PR contra `main` | PR abierto, `MERGEABLE` | `gh pr view <n> --json mergeable,mergeStateStatus` y `gh pr checks <n>` | HECHO |

### H1.S3 — Retirar la publicación equivocada

**CA:** nadie encuentra dos versiones vivas del informe. **DoD:** el PR 628 figura `CLOSED` con su comentario. **Estado:** BLOQUEADO

> **Desvío registrado (2026-09-24, durante la ejecución):** cuando se intentó cerrarlo, el PR 628 ya
> estaba **mergeado** en `mockup`: lo mergeó la cuenta `Jsaldias39` a las 21:26:03Z, commit
> `a96ad90c`. Un PR mergeado no se puede cerrar. Retirar `docs/brechas-front-back-2026-09-24/` del
> front es una acción sobre una rama compartida y necesita decisión: **DECISION_REQUIRED**, a
> confirmar con Justin. Opciones:
> - (a) dejar la copia del front como referencia, con el comentario que ya apunta a este PR;
> - (b) un PR contra `mockup` que la retire.
>
> Ya se publicó en el 628 un comentario que apunta a este PR (evidencia 03).

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S3.M1 | Cerrar el PR 628 del front con un comentario que apunte al nuevo PR | 628 en `CLOSED` | `gh pr view 628 -R mdavila-2001/mantra-core-health --json state` → `CLOSED` | BLOQUEADO — DECISION_REQUIRED (ver abajo) |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Omitir archivos del paquete | Paquete incompleto | Comparar manifiestos de hashes, no sólo nombres |
| Publicar datos de personas | Exposición de PII/PHI | El informe cita código y cuentas sintéticas del mock (`@alovida.mock`); búsqueda textual de secretos antes de publicar |
| Pisar trabajo ajeno en el clon local | Pérdida de cambios de otra sesión | Se trabaja en un worktree aparte desde `origin/main`; el clon `AlovidaPromptManager/` (otra rama, con cambios sin commitear) no se toca |
