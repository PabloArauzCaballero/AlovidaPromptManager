# Leo — daily del día del 2026-10-23

> **AVANCE: 0 / 72 — 0,0 %.** Sale de `microtareas HECHO / total`. `A MEDIAS` cuenta como **no hecha**.
> Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Daily de equipo: [`Daily-Dia-2026-10-23.md`](../Daily-Dia-2026-10-23.md)
- Tu lote: [KYC con aprobación humana, la barra superior del paciente, la tabla de permisos y el buzón de encuestas](Correcciones.PacienteIdentidadYNavegacion/KycConAprobacionBarraSuperiorPermisosYBuzon.md)
- Cortes leídos: front `227eb255` · API `6ea11561` · modelo `eceb98f` · móvil `ec88e81` → **los tuyos:** `________` (reconsultados)
- Ramas: `leo/paciente-kyc-y-navegacion-2026-10-23` en cada repo que toques · Peldaño alcanzado (regla 30): `UNKNOWN`

### 0. Tu primera hora es la Ola 0 del equipo

Antes de nada: corte, baseline, tus kill-tests en rojo **contra la API real**, y publicar en §4-bis del
daily de equipo los contratos que **producís** (con el DTO literal) y los que **pedís**. Recién después,
tu primer hito de valor.

### 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que terminar en 0 FAIL>
```

- [ ] Leí `skills-router` y las skills de mi lote, empezando por `data-privacy-phi`.
- [ ] Creé mi `PLAN.md` en cada repo antes del primer `Edit`/`Write` de código.

### 2. Baseline (por repo)

| Repo | Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|---|
| | `corepack yarn lint` | | | |
| | `corepack yarn typecheck` | | | |
| | `corepack yarn test` | | | |
| front | `corepack yarn pw playwright/correcciones-2026-10-23-kill-tests.spec.ts --grep "@leo"` contra `real-api` | | (esperado: todo rojo) | producto |

### 3. Lo que publiqué y lo que pedí (espejo de §4-bis)

| Contrato | Produzco / pido | Publicado (hora, SHA) |
|---|---|---|
| | | |

### 4. Checkpoints del día

```text
AVANCE — <hito> — <fase> — <ID>
- Hecho:      
- Evidencia:  
- Ahora:      
- Bloqueo:    ninguno | <qué y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    
```

### 5. Cierre

| Hito | HECHO / total | Estado | PR | `gh pr view … --json mergeable,mergeStateStatus` |
|---|---|---|---|---|
| | | | | |

- Lo que quedó `A MEDIAS` (qué anda, qué no anda, qué falta exactamente, dónde quedó):
- Lo que quedó `BLOQUEADO` (qué, qué intenté, qué lo destraba, de quién depende; simulación de los tres niveles declarada):
- `REPORTE.md`: ruta en cada repo.
