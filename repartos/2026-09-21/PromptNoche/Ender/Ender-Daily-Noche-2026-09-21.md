# Ender — daily de la noche del 2026-09-21

> **AVANCE: 0 / 61 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Refactor-CatalogoEInventario.Plataforma`](Refactor-CatalogoEInventario.Plataforma/CatalogoRealScannerYFactoriesTipadas.md)
- Corte: `origin/mockup` @ `5a0776c6…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-21.md`](../Daily-Noche-2026-09-21.md)

## 0. Por qué tu carril va primero

Los otros cuatro tienen que **acreditar sus organismos en tu catálogo**. Si el catálogo monta con
props adivinadas —`columns: []`, `trackBy` inventado, un diálogo vacío— sus pruebas de fidelidad no
valen nada. **H2 y H3 son lo que más importa de tu noche.**

Y hay un riesgo que sólo tenés vos: `package.json` define
`"start": "yarn env:generate && yarn stock:generate && ng serve"`, y lo mismo `"build"`.
**Tu generador es dependencia del arranque de los otros cuatro.** Si lo dejás roto, cuatro personas no
pueden trabajar. Por eso tu H1.S3 exige que el índice regenere idéntico **antes** de que toques la
lógica, y cada cambio cierra con `yarn stock:generate` corrido de nuevo.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 176>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 14>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

⚠️ **Antes de `cp -r`, mirá qué hay:** el repo de producto **ya tiene** su propio `.claude/skills/`
(entre otras, `fable-refactor-orchestrator`). Si ibas a pisar algo, no lo pises: fusioná y dejá acá
constancia de qué quedó de cada lado. Pisar skills del producto es tocar archivos fuera de tu alcance.

- [ ] Leí `skills-router` y las 25 skills de mi lote, empezando por `atomic-design-components`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline — sin esto no podés demostrar que un rojo ya estaba

| Comando | Exit code | Rojos previos | Archivo de evidencia |
|---|---|---|---|
| `yarn lint` | | | `evidencia/antes/lint.txt` |
| `yarn typecheck` | | | `evidencia/antes/typecheck.txt` |
| `yarn test --watch=false` | | | `evidencia/antes/test.txt` |
| `yarn audit:vistas` | | | `evidencia/antes/audit-vistas.txt` |
| `yarn stock:generate` ×2 + `diff` | | diff vacío: sí / no | `evidencia/antes/component-index.generated.ts` |

Conteo del índice por nivel, de la línea de resumen que imprime el propio generador (líneas 384-391):
`________________________________`

## 3. Checkpoints del turno

Uno por apertura y por cierre de microtarea. **Prohibido encadenar más de tres operaciones materiales
sin checkpoint** (regla 50 §2). Formato:

```text
AVANCE — catálogo e inventario — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 4. Lo que te van a pedir esta noche

| Quién | Qué | Cuándo |
|---|---|---|
| Pablo | escenario tipado de `DataTable<Row>` en el catálogo, y fixtures de `accesos`/`personas` en `core/mock/` | temprano |
| Justin | fixtures de terminología y datos compartidos | media noche |
| Itzan | escenario de `paginated-form` con `paginas` y `form` reales | media noche |
| Marcelo | escenarios de `attachment-dialog` y `attachment-uploader`, y fixtures del expediente | media noche |
| Los cuatro | un export nuevo en un barrel — **vos sos el único dueño de los tres** | cuando aparezca |

**Anotá cada pedido acá, con quién y qué:**

| Quién pidió | Qué | Estado | Cuándo se lo entregaste |
|---|---|---|---|
| | | | |

## 5. Lo que vos pediste y no llegó

Si el insumo de otro no llegó y su contrato se puede nombrar, **no cierres `BLOQUEADO`**: simulá el
contrato en tres niveles (correcto, límite, inválido), cerrá contra el doble y **declaralo así**
(regla 65). El `blocker_gate.py` te frena si no.

| Qué falta | De quién | Contrato que simulaste | Los tres niveles | Qué falta verificar contra lo real |
|---|---|---|---|---|
| | | | | |

## 6. Al cerrar

- [ ] `REPORTE.md` escrito, con el avance en la **primera línea** y sus tres secciones
      (`Completado`, `A medias`, `Pendiente`; una vacía se escribe «ninguna»).
- [ ] `yarn stock:generate` corrido dos veces con diff vacío, y **`yarn start` levantando** — porque de
      eso dependen los otros cuatro.
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] Capturas del catálogo por viewport y tema, **miradas**, con una línea cada una.
- [ ] Las 20 preguntas del §19 respondidas con evidencia.
- [ ] Procesos que quedaron corriendo, enumerados y cerrados. **Si no quedó nada, decilo**: el silencio
      no es evidencia de limpieza (regla 70.2.3).
- [ ] La decisión sobre el aislamiento del preview, escrita donde alguien la encuentre —
      **reusando** `docs/adr/` o `docs/refactor-profesional/trabajo/DECISIONES.md`, no en carpeta nueva.
