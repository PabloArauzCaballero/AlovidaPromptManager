# Marcelo — daily de la noche del 2026-09-22

> **AVANCE: 58 / 60 — 96,7 %.** (Se agregó H3.S2.M9 por decisión de Pablo sobre `microphone=(self)`.)
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-InicioPaciente.SintomasYConfirmacion`](Noche-InicioPaciente.SintomasYConfirmacion/SiluetaDelCuerpoVozYModalDeConfirmacion.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `8ae7283a…` (rebaseado en sesión sobre PRs #574-#579)
- Rama: `pablo/inicio-paciente-silueta-voz-y-confirmacion` · Peldaño alcanzado (regla 30): **VERIFIED por área** (ver REPORTE.md)
- Daily de equipo: [`Daily-Noche-2026-09-22.md`](../Daily-Noche-2026-09-22.md)

## 0. H4 primero: dos personas esperan tu confirmación

Pablo e Itzan ponen «¿Confirmás estos cambios?» en cada «Guardar» de sus modales. Si tu
`confirmarCambios()` no está antes de la mitad del turno, los dos simulan con `dialogs.confirm` a
mano. **Y hay una pregunta que nadie probó**: ¿un `confirm` (`showModal`) sobre un `content-dialog`
abierto apila bien y devuelve el foco? Probalo en dos navegadores y publicá el resultado (H4.S1.M6).

Después H2 (la silueta) y H3. **Ni un síntoma ni una especialidad nuevos**: `sintomas.datos.ts` y
`motor.ts` no se tocan esta noche (regla 97.5.4).

**Tu carril del 21/09** (`Refactor-DialogosYAdjuntos`) queda `A MEDIAS` declarado en su propio reporte.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 176>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 14>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [x] Leí `skills-router` y las skills de mi lote (desde `AlovidaPromptManager`, sin copiar `.claude/` al worktree — declarado en `PLAN.md`).
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false` | | | |

## 3. La pregunta que elevás con captura (H1.S2.M3) — Q-13

Los cuatro bloques de la pantalla de inicio del paciente, anotados sobre una captura:
`evidencia/antes/bloques.png`. **Supuesto:** «el panel de abajo» es la grilla de accesos «Ir a lo tuyo».

| Respuesta del doctor / Pablo | Hora | Qué se retira |
|---|---|---|
| Pablo, en sesión: «el panel de abajo» es la grilla «Ir a lo tuyo» (bloque 4) | 2026-09-23 ~00:50 | `nav.mi-salud__accesos` con `accesos()`, `SECCIONES_DEL_PACIENTE`, `AccesoDelPaciente` y su CSS; spec y `alv-054` actualizados sin debilitar (H3.S3, commit en la rama) |

**Sin respuesta, no se borra**: el retiro queda preparado en rama y `A MEDIAS`.

## 4. Lo que publicás

| Qué | Para quién | Hito | Ruta + hora |
|---|---|---|---|
| `confirmarCambios()` / `confirmarDescarte()` + receta en `content-dialog` | Pablo, Itzan | H4.S1 | `molecules/dialog/dialog-service.ts` · publicado en el daily de equipo §4-bis · 2026-09-23 ~01:10 |
| Resultado del apilamiento (Chromium, Firefox) | los cinco | H4.S1.M6 | PASS en Chromium 151 y Firefox 153 · `evidencia/h4/apilamiento/` |
| Borrador de la silueta (captura) para el doctor | Pablo → doctor | H2.S2.M5 | `evidencia/h2/capturas/` (01-09 + `LEEME.md`) · publicado en el daily de equipo §4-bis con tres preguntas para el doctor (Q-11) · 2026-09-23 ~02:40 |
| Navegadores en los que probaste la voz | reporte | H3.S2.M7 | Chrome 153 (MCP): botón, ciclo completo, transcripción real tras abrir `microphone=(self)` · Firefox 153: sin reconocedor → sin botón · `evidencia/h3/dictado/LEEME.md` · 2026-09-23 ~07:15 |

## 5. Checkpoints del turno

```text
AVANCE — inicio del paciente — <fase> — <ID de microtarea>
- Hecho:      <qué quedó, concreto>
- Evidencia:  <comando / ruta / "ninguna todavía">
- Ahora:      <la siguiente acción, una sola>
- Bloqueo:    ninguno | <qué bloquea y de quién depende>
- Estado:     TODO | EN CURSO | HECHO | A MEDIAS | BLOQUEADO | DESCARTADO
- Peldaño:    UNKNOWN | DISCOVERED | WRITTEN | RUNS | TESTED | VERIFIED | REGRESSION_VERIFIED
```

## 6. Lo que pediste y su estado

| Qué | A quién | Estado | Si no llegó: contrato simulado en tres niveles (regla 65) |
|---|---|---|---|
| Respuesta a Q-13 | Doctor / Pablo | **RESUELTA: la grilla «Ir a lo tuyo»** | — |
| Un «Guardar» real para probar la confirmación | Pablo o Itzan | | la probás en la vitrina |

## 7. Al cerrar

- [x] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones.
- [x] Baseline repetido y comparado: 0 rojos míos nuevos (los 2 restantes son ajenos, HALL-M5/M6, ver REPORTE.md).
- [x] **`sintomas.datos.ts` y `motor.ts` con diff vacío** — `git diff --stat` → 0 líneas (H2.S2.M4).
- [x] La silueta se usa sin ratón de punta a punta; se distingue en escala de grises (`evidencia/h2/capturas/08`).
- [x] Nada de lo dictado en consola, logs ni servicios no declarados; aviso en pantalla (`git grep console.` → 0).
- [x] `confirmarCambios` es opt-in: `confirm()` sin cambios, verificado en `dialog.spec.ts`.
- [x] Apilamiento probado en dos navegadores con captura.
- [x] Capturas por viewport y tema, **miradas**, con su línea.
- [x] Sólo `paciente@alovida.mock` (y `medica@alovida.mock` para el apilamiento de H4) en capturas y reporte.
- [x] Procesos corriendo, enumerados y cerrados (ver REPORTE.md; el servidor de desarrollo se bajó antes de cerrar).
