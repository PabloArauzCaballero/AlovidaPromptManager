# Marcelo — daily de la noche del 2026-09-22

> **AVANCE: 0 / 59 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-InicioPaciente.SintomasYConfirmacion`](Noche-InicioPaciente.SintomasYConfirmacion/SiluetaDelCuerpoVozYModalDeConfirmacion.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
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

- [ ] Leí `skills-router` y las 28 skills de mi lote, empezando por `frontend-accessibility`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

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
| | | |

**Sin respuesta, no se borra**: el retiro queda preparado en rama y `A MEDIAS`.

## 4. Lo que publicás

| Qué | Para quién | Hito | Ruta + hora |
|---|---|---|---|
| `confirmarCambios()` / `confirmarDescarte()` + receta en `content-dialog` | Pablo, Itzan | H4.S1 | |
| Resultado del apilamiento (Chromium, Firefox) | los cinco | H4.S1.M6 | |
| Borrador de la silueta (captura) para el doctor | Pablo → doctor | H2.S2.M5 | |
| Navegadores en los que probaste la voz | reporte | H3.S2.M7 | |

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
| Respuesta a Q-13 | Doctor / Pablo | | retiro preparado, `A MEDIAS` con captura |
| Un «Guardar» real para probar la confirmación | Pablo o Itzan | | la probás en la vitrina |

## 7. Al cerrar

- [ ] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe «ninguna»).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] **`sintomas.datos.ts` y `motor.ts` con diff vacío**, pegado.
- [ ] La silueta se usa sin ratón de punta a punta; se distingue en escala de grises.
- [ ] Nada de lo dictado en consola, logs ni servicios no declarados; aviso en pantalla.
- [ ] `confirmarCambios` es opt-in: los 26 `confirm` y los 29 `content-dialog` no cambian.
- [ ] Apilamiento probado en dos navegadores con captura.
- [ ] Capturas por viewport y tema, **miradas**, con su línea.
- [ ] Sólo `paciente@alovida.mock` en capturas y reporte.
- [ ] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo.
