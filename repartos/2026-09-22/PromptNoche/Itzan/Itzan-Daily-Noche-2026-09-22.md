# Itzan — daily de la noche del 2026-09-22

> **AVANCE: 89 / 110 — 80,9 %.** HECHO 89 · A MEDIAS 8 · DESCARTADO 2 · TODO 11 (H5.S2.M1 y las diez de H8). El plan pasó de 93 a 110 microtareas: 17 agregadas con la regla 00 §3.3, cada una con su motivo en el `PLAN.md`. Medido el 25/09 con `plan_status.py` sobre el plan de la rama núcleo.
> `A MEDIAS` cuenta como **no hecha**. Prohibido el porcentaje estimado a ojo (regla 50 §5).

> **Antes de seguir, leé [`CERRAR-EL-CARRIL-SIN-FRENOS.md`](CERRAR-EL-CARRIL-SIN-FRENOS.md)**
> (2026-09-24): el 0/93 de arriba no refleja el código real —cinco PRs tuyos ya se fusionaron—;
> tus dos dependencias (ADR-0015 de Pablo, confirmación de Marcelo) ya están en `mockup`, dejá de
> simularlas. Cierra sin frenos: código primero, documentación al final.

- Carril: [`Noche-PerfilMedico.ConfigurarTuPerfil`](Noche-PerfilMedico.ConfigurarTuPerfil/PerfilSinPrincipalSinTrabajoYTablasConModal.md)
- Corte: `origin/mockup` @ `b655e844…` → **el tuyo:** `b7785e36` (movido el 23/09 desde `05d83cb8`: el PR #582 trajo `confirmarCambios`/`confirmarDescarte`, la pieza D-08 que H3/H4 esperaban)
- Ramas y PRs de producto (`mantra-core-health` → `mockup`):
  - `itzan/perfil-medico-configurar-tu-perfil` (H5 y H7): [PR #606](https://github.com/mdavila-2001/mantra-core-health/pull/606), fusionado el 24/09.
  - `itzan/perfil-d05-iconos` (H6, la recaptura de H7 y H5.S2.M6): [PR #613](https://github.com/mdavila-2001/mantra-core-health/pull/613), fusionado el 24/09.
  - `itzan/perfil-medico-nucleo` (H1–H4): [PR #662](https://github.com/mdavila-2001/mantra-core-health/pull/662), abierto el 25/09, `MERGEABLE`, sin fusionar; el CI está en cola, como todas las corridas del repo.
  - El gemelo a `dev` (regla 3 de «Cerrar el carril sin frenos») está sin abrir. Por decisión de Itzan del 25/09, por ahora todo va a `mockup`. Además, `dev` todavía no tiene #606, #613, #625, #627, #644 ni #645, en los que se apoya este trabajo; se le consultó a Justin.
- Plan, reporte y evidencia: `docs/trabajo/2026-09-23-perfil-medico-configurar-tu-perfil/` del repo de producto, que viaja en el #662.
- Peldaño alcanzado (regla 30): por hito, en la tabla del `REPORTE.md`. H1 a H4, `VERIFIED` sin llegar a `REGRESSION_VERIFIED`: la regresión completa sobre el árbol final está pendiente. El del trabajo es `UNKNOWN`, porque H8 está sin empezar.
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
180
# 176 del estándar + 4 que versiona el equipo del front en su `.claude/skills/`

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
plan_gate self-test: 11 PASS, 0 FAIL
```

- [ ] Leí `skills-router` y las 28 skills de mi lote, empezando por `frontend-forms-ux`.
- [x] Creé mi `PLAN.md` antes del primer `Edit`/`Write` de código.

## 2. Baseline

| Comando | Exit code | Rojos previos | Clase (regla 80.4) |
|---|---|---|---|
| `yarn lint` | 1 | 243 errores, todos `@angular-eslint/prefer-on-push-component-change-detection`, en 194 archivos | previos, ninguno de los archivos de este carril salvo 3 specs de H6 · `evidencia/antes/lint.txt` |
| `yarn typecheck` | 0 | 0 (hizo falta `yarn env:generate` antes: el script no genera `env.generated.ts`) | — · `evidencia/antes/typecheck.txt` |
| `yarn test --watch=false` | 1 | `Test Files 7 failed \| 570 passed (577)` · `Tests 155 failed \| 7066 passed (7221)` | Los 7 `ENVIRONMENT`: `fichas-estandar.spec.ts` busca la API como carpeta hermana (L33-35); los otros 6 pasan enteros aislados con la máquina descargada (10/10, 35/35, 64/64, 52/52, 57/57, 95/95) y en la suite completa caen por tope de tiempo o en cascada («Cannot configure the test module…») · `evidencia/antes/test.txt`, `aislado-*.txt`, tabla en `PLAN.md` |

## 3. Lo que ejercitaste ANTES de tocar (H1.S2)

| Pregunta | Respuesta observada | Captura |
|---|---|---|
| ¿«Guardar cambios» del modal se habilita **sin** tocar nada? | **Sí**, en los tres modales (título, especialidad, matrícula): «Editar» abre el modal con «Guardar cambios» primario y habilitado sin haber tocado ningún campo. Para el título hubo que agregar uno pendiente: los verificados no ofrecen «Editar» | `evidencia/antes/capturas/05-editar-titulo-sin-tocar.png`, `05b-…`, `05c-…` |
| ¿Los tres «Retirar» (título, especialidad, matrícula) confirman? | **Sí, los tres**, con diálogo propio («Retirar este título · ¿Retirar «…»? No se puede deshacer desde acá.» · Cancelar / Retirar) | `evidencia/antes/capturas/06-retirar-titulo.png`, `06-retirar-especialidad.png`, `06-retirar-matricula.png` |
| ¿Dónde se ve la insignia «principal» hoy? (ficha / `/directory` / perfil público) | Ficha: **sí** (Datos personales, `Cardiología ✓ PRINCIPAL`) · editor: **sí** (badge «Principal» + «Marcar como principal») · guía, detalle del profesional: **sí** (vista como paciente: la guía es de ese rol) · guía, portada: no lista médicos · perfil público: **no** (chips sin marca) | `evidencia/antes/capturas/07-principal-ficha.png`, `07-principal-directorio-detalle-paciente.png`, `07-principal-perfil-publico.png` |

## 4. Las decisiones que no se toman en silencio

| Qué | Supuesto | Decisión escrita | Elevada a |
|---|---|---|---|
| Q-3: dónde queda el correo de acceso | «Correo de acceso» en Datos personales, sólo lectura | **Cambió el 24/09:** Itzan adoptó el #645. El correo de trabajo se corrige en «Contacto», y D-03 queda para los dos teléfonos del trabajo. El «correo de acceso» de sólo lectura se retiró (H2.S3.M4, `DESCARTADO`): mostraba `email`, que el contrato de lectura documenta como alias del correo de trabajo | Doctor |
| Q-9: adjunto en especialidades sin `file_id` | (a) vincular a título · (b) `fileId` sólo simulado | **(a)**, decidida por Itzan el 23/09: el respaldo es un título verificado, vinculado con `supportingCredentialId` en el alta. Sólo se ofrecen verificados, porque la API rechaza uno pendiente (422) | Pablo + doctor |
| Q-4: «ponerse en blanco» | Vaciar el campo, con anuncio | Se aplicó el supuesto: el mapa vacía la dirección y lo anuncia junto al campo (#606). El 24/09 se sumó que ese vaciado no pone el campo en rojo (H5.S2.M6, #613). La lectura del doctor sigue sin confirmar | Doctor |

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
| ADR-0015 + `app-pagination` con selects + `filter-bar` con acción | Pablo | **Llegó.** Las tres tablas del editor usan `app-filter-bar` con el alta en su hueco, filtro «Estado» y 10 por página (H4.S3) | montás lo que existe, botón alineado con tu CSS, declarado |
| `work-history layout="tabla"` para Trayectoria | Pablo | **Llegó.** «Trayectoria» monta `app-work-history secciones="historial" layout="tabla"`. Cuatro defectos del historial en tabla, anteriores a la rama, quedaron para Pablo con su ruta:línea (decisión de Itzan del 24/09) | montás la línea de tiempo y lo declarás |
| `confirmarCambios()` / `confirmarDescarte()` | Marcelo | **Llegó** con el #582; por eso el corte se movió a `b7785e36`. La usan los modales de títulos, especialidades y matrículas | `dialogs.confirm` con los textos del ADR |
| Retirar renglón «Mis puntos» + redirect `/my-account/loyalty` | Ender | **Pedido el 23/09** (H7.S1.M3): redirigir a `/my-account?pestana=puntos` — la ficha ya lee `?pestana=<clave>` (`puntos`, `contacto`, `facturacion`, `seguros`; clave desconocida → primera pestaña) y retirar el renglón del menú. Va contra su H4.S2.M2; se lo entregó Itzan como documento aparte el 23/09. **Llegó** con el #655 de Ender, ya en `mockup`: `/my-account/loyalty` abre `/my-account?pestana=puntos` (`app.routes.ts:1084`) | Si no llega: la pestaña se prueba por `/my-account?pestana=puntos` directo y `/my-account/loyalty` sigue mostrando la billetera con su cabecera, como hoy |

## 7. Lo que publicaste

| Qué | Para quién | Ruta + hora |
|---|---|---|
| `output` del `ubicacion-picker` al tocar el mapa (nombre exacto): **`puntoElegido`** (`output<Coordenadas>()`, sale en cada toque sobre el plano; «Usar mi ubicación» y quitar no lo emiten) | Pablo (no lo necesita), registro | [PR #606](https://github.com/mdavila-2001/mantra-core-health/pull/606) → `mockup`, 23/09 20:53 |
| `/my-account?pestana=<clave de PESTANA>` abre esa pestaña de la ficha del paciente (`pestanas-del-perfil.ts`, `indiceDePestana`) | Ender (para el redirect de `/my-account/loyalty`) | esta fila, 23/09 |
| D-05 en lo mío (H6): «Editar», el calendario y el mapa con ícono y nombre; y H5.S2.M6: el vaciado del mapa no pone en rojo la dirección | equipo | [PR #613](https://github.com/mdavila-2001/mantra-core-health/pull/613) → `mockup`, fusionado el 24/09 |
| H1 a H4: el perfil sin «principal» ni teléfonos del trabajo, títulos y matrículas en «Credenciales», especialidades en «Datos personales», las tres tablas con modal, filtro y paginación, y lo verificado sin corregir | equipo; revisores Justin y Pablo | [PR #662](https://github.com/mdavila-2001/mantra-core-health/pull/662) → `mockup`, abierto el 25/09 |

## 8. Al cerrar

- [x] `REPORTE.md` con el avance en la **primera línea** y sus tres secciones (una vacía se escribe «ninguna»).
- [ ] Baseline repetido y comparado: ningún rojo **nuevo**. Hecho sobre el árbol anterior de la rama núcleo, sin rojos nuevos. Sobre el árbol final, sólo lint y tipos; la suite, la compilación y los scripts del CI quedan pendientes.
- [x] **`pestanas-del-perfil-medico.spec.ts` en verde sin debilitarlo.** 12/12 sobre el árbol final.
- [x] Si tocaste la insignia: ficha, `/directory` y perfil público comprobados con captura (`h2-insignias-*`).
- [x] Si tocaste `paginated-form`, `date-picker` o `back-link`: sin cambio de comportamiento, con muestra ajena. La botonera del formulario por páginas sale idéntica antes y después en seis pantallas (#613).
- [ ] Modales: campos llenos, guardar por cambios, confirmación, descarte, teclado completo. Todo menos el teclado completo en el navegador (H8.S2.M2).
- [ ] Lo que sólo persiste el simulador, declarado **contra el doble** (HALL-E3). Pendiente con H8.S2.M3.
- [x] Capturas por viewport y tema, **miradas**, con su línea. H2 a H4: 217 capturas en los cinco viewports del repo y los dos temas, con su primera pasada. La segunda pasada llegó hasta la recaptura anterior, sin `RECHAZADA` ni `MAYOR` del cambio abierto; la de la serie final está pendiente.
- [x] Sólo cuentas sintéticas en capturas y reporte.
- [x] Procesos corriendo, enumerados y cerrados. Si no quedó nada, decilo. No quedó ninguno.
