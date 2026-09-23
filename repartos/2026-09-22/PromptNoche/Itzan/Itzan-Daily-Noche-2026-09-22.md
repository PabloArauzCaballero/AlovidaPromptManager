# Itzan — daily de la noche del 2026-09-22

> **AVANCE: 0 / 93 — 0 %.** ← actualizá esta línea al cerrar. Sale de `microtareas HECHO / total`.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

- Carril: [`Noche-PerfilMedico.ConfigurarTuPerfil`](Noche-PerfilMedico.ConfigurarTuPerfil/PerfilSinPrincipalSinTrabajoYTablasConModal.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `________________`
- Rama: `________________` · Peldaño alcanzado (regla 30): `________________`
- Daily de equipo: [`Daily-Noche-2026-09-22.md`](../Daily-Noche-2026-09-22.md)

## 0. El orden de tu noche, y por qué

**H2 → H3 → H4 → H5**; H6 y H7 al final. H2 son tres quitas que el doctor va a mirar primero y que no
dependen de nadie. H3 y H4 dependen de Pablo (ADR, paginador, barra) y de Marcelo (confirmación): si no
llegaron, montás lo que hay hoy y **declarás contra qué cerraste** (regla 65). No te quedes esperando.

**Tu carril del 21/09** (`Refactor-FormulariosYPerfil`) no se abandona: queda `A MEDIAS` declarado en su
propio reporte. Esta noche manda el pedido del cliente.

## 1. Instalación del estándar — pegá la salida acá

```text
$ ls .claude/skills | wc -l
<pegá la salida — tiene que dar 176>

$ ls .claude/rules/[0-9]*.md | wc -l
<pegá la salida — tiene que dar 14>

$ python .claude/hooks/plan_gate.py --self-test
<pegá la salida — tiene que dar 11 PASS, 0 FAIL>
```

- [ ] Leí `skills-router` y las 28 skills de mi lote, empezando por `frontend-forms-ux`.
- [ ] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | | | |
| `yarn typecheck` | | | |
| `yarn test --watch=false` | | | |

## 3. Lo que ejercitaste ANTES de tocar (H1.S2)

| Pregunta | Respuesta observada | Captura |
|---|---|---|
| ¿«Guardar cambios» del modal se habilita **sin** tocar nada? | | |
| ¿Los tres «Retirar» (título, especialidad, matrícula) confirman? | | |
| ¿Dónde se ve la insignia «principal» hoy? (ficha / `/directory` / perfil público) | | |

## 4. Las decisiones que no se toman en silencio

| Qué | Supuesto | Decisión escrita | Elevada a |
|---|---|---|---|
| Q-3: dónde queda el correo de acceso | «Correo de acceso» en Datos personales, sólo lectura | | Doctor |
| Q-9: adjunto en especialidades sin `file_id` | (a) vincular a título · (b) `fileId` sólo simulado | | Pablo + doctor |
| Q-4: «ponerse en blanco» | Vaciar el campo, con anuncio | | Doctor |

## 5. Checkpoints del turno

```text
AVANCE — perfil del médico — <fase> — <ID de microtarea>
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
| ADR-0015 + `app-pagination` con selects + `filter-bar` con acción | Pablo | | montás lo que existe, botón alineado con tu CSS, declarado |
| `work-history layout="tabla"` para Trayectoria | Pablo | | montás la línea de tiempo y lo declarás |
| `confirmarCambios()` / `confirmarDescarte()` | Marcelo | | `dialogs.confirm` con los textos del ADR |
| Retirar renglón «Mis puntos» + redirect `/my-account/loyalty` | Ender | | probás la pestaña por URL directa |

## 7. Lo que publicaste

| Qué | Para quién | Ruta + hora |
|---|---|---|
| `output` del `ubicacion-picker` al tocar el mapa (nombre exacto) | Pablo (no lo necesita), registro | |

## 8. Al cerrar

- [ ] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe «ninguna»).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**.
- [ ] **`pestanas-del-perfil-medico.spec.ts` en verde sin debilitarlo.**
- [ ] Si tocaste la insignia: ficha, `/directory` y perfil público comprobados con captura.
- [ ] Si tocaste `paginated-form`, `date-picker` o `back-link`: sin cambio de comportamiento, con muestra ajena.
- [ ] Modales: campos llenos, guardar por cambios, confirmación, descarte, teclado completo.
- [ ] Lo que sólo persiste el simulador, declarado **contra el doble** (HALL-E3).
- [ ] Capturas por viewport y tema, **miradas**, con su línea.
- [ ] Sólo cuentas sintéticas en capturas y reporte.
- [ ] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo.
