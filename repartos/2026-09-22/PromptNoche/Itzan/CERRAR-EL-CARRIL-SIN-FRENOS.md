# Itzan — cerrar el carril sin frenos

> **Para el agente que corre el carril de Itzan.** Esto manda sobre la forma de trabajar del
> [carril](Noche-PerfilMedico.ConfigurarTuPerfil/PerfilSinPrincipalSinTrabajoYTablasConModal.md)
> y del [daily](Itzan-Daily-Noche-2026-09-22.md). No cambia **qué** hay que hacer, solo **cómo**:
> primero se termina el código y al final se documenta todo junto. Es el mismo formato que ya
> destrabó a Justin en su carril (ver
> [`Justin/CERRAR-EL-CARRIL-SIN-FRENOS.md`](../Justin/CERRAR-EL-CARRIL-SIN-FRENOS.md)) — mismo
> síntoma: trabajo real avanzando, pero el daily y el conteo no lo reflejan y las sesiones se van
> en volver a medir y volver a verificar lo que ya está bien.
>
> **No deroga ninguna regla de `.claude/rules/`.** Recorta lo que esas reglas no piden: PRs de
> papeleo, mediciones repetidas y evidencia visual en cada paso.
>
> Escrito el 2026-09-24 por Pablo.

## Por qué existe este archivo

El daily de este carril sigue en `AVANCE: 0 / 93 — 0 %` con los campos del corte y la rama en
blanco. Pero **el código sí avanzó**: cinco PRs tuyos se fusionaron desde que arrancó el carril —
[#561](https://github.com/mdavila-2001/mantra-core-health/pull/561),
[#571](https://github.com/mdavila-2001/mantra-core-health/pull/571),
[#576](https://github.com/mdavila-2001/mantra-core-health/pull/576),
[#606](https://github.com/mdavila-2001/mantra-core-health/pull/606) y
[#613](https://github.com/mdavila-2001/mantra-core-health/pull/613), el último el 24/09 a las
15:27 UTC. El daily de 0/93 no es mentira — nadie adjudicó ese trabajo a los IDs del carril
todavía — pero leerlo así hace pensar que no se avanzó nada, y empieza el mismo patrón que tuvo
Justin: releer el carril entero, volver a medir lo que ya se midió, y quedarse esperando a
alguien en vez de seguir. Eso consume sesiones enteras sin sumar una sola microtarea.

## Las dos dependencias del carril ya no hacen falta simularlas

El propio carril dice (línea 6): *"dependés de Pablo (ADR-0015, paginador, historial como tabla)
y de Marcelo (confirmación); no te quedes esperando (regla 65)"*. **Las dos ya están en
`mockup`, de verdad, no simuladas:**

- **ADR-0015** (`app-data-table` con alto máximo, `app-pagination`, hueco de acción en
  `app-filter-bar`) está fusionado desde el
  [`9858520f`](https://github.com/mdavila-2001/mantra-core-health/commit/9858520f) de Pablo
  (22/09). Es el mismo patrón que ya usan `work-history` y, más nuevo, `cotizaciones` del
  carril de Justin: alto máximo + paginación en cliente, sin scroll lateral.
- **La confirmación de Marcelo** es `DialogService.confirmarCambios()` /
  `.confirmarDescarte()`, en `shared/components/molecules/dialog/`. Devuelve
  `Promise<boolean>` (el repo no usa RxJS).

Si tu `PLAN.md` todavía tiene alguna de estas dos como «esperando» o simulada con un doble: **dejá
de simular, andá contra el componente real** y actualizá el plan.

## Paso 0, en 15 minutos y sin PR

Hacé lo mismo que se hizo para Justin: cruzá los cinco PRs de arriba contra los IDs de H1 a H8 de
tu carril y armá la lista exacta de lo que falta. Guardala en tu `PLAN.md` local y empezá por el
primero. **No se hace un PR aparte solo para esto** — la lista va en el `PLAN.md`, y se publica
junto con el resto al cerrar (regla 2 de abajo).

## Las ocho reglas

### 1. Nada te frena: lo que depende de otro se simula y se sigue

Ya no debería hacer falta para Pablo/Marcelo (ver arriba). Si aparece otra dependencia nueva
durante la noche: contrato simulado en tres niveles (regla 65), anotado en una línea del
`PLAN.md`, **y seguís**. No se abre ninguna pregunta al equipo que frene el trabajo — se anota
como ambigüedad y se sigue con el supuesto más conservador.

### 2. Cero PRs de documentación mientras trabajás

**Prohibido** abrir PRs de «publicar avance», «corregir avance», «registrar seguimiento» en este
repo hasta terminar. El daily y los reportes se actualizan **una vez, al final**.

### 3. Los PRs de código van por hito, no por microtarea

Un PR por hito (H2, H3, H4…), siempre a **`mockup` y a `dev`**. Nunca a `master`. Cada PR se deja
mergeable y se demuestra con `gh pr view` y `gh pr checks` (regla 35.2) **antes de fusionarlo** —
no lo fusiones vos mismo sin que alguien lo revise; dejalo `MERGEABLE` y avisá. (Esto es lo que
falló en el carril de Justin: seis PRs se fusionaron antes de que terminara la revisión de
calidad, y quedó fusionado un defecto real — precios inventados atribuidos a instituciones con
nombre real. La corrección tuvo que salir como PR aparte. No repitas esa secuencia: revisión
completa **antes** de fusionar, no después.)

### 4. La evidencia exhaustiva solo al final

Cada microtarea se cierra corriendo su DoD, con la salida literal en `evidencia/` en el momento
— eso es texto y entra en el PR del hito. Las capturas en 3 anchos × 2 temas y la doble revisión
adversarial (regla 35.1) se hacen **una sola vez**, en tu H8 (o el hito de cierre que corresponda),
sobre el código final.

### 5. No vuelvas a medir lo que ya está medido

Si un PR ya fusionado midió algo (rendimiento, cantidad de peticiones, lo que sea), usá esa
medición. Solo se vuelve a medir si tu cambio de esta noche toca ese mismo recorrido.

### 6. Solo tu carril

Nada fuera de tus 93 microtareas y sus archivos reservados. Si ves algo roto fuera de tu alcance,
una línea en «fuera de alcance» y seguís.

### 7. Una sola máquina a la vez

```bash
git ls-remote --heads origin 'itzan/*'      # en mantra-core-health
gh pr list --author @me --state open        # PRs abiertos del carril
```

Si hay una rama `itzan/*` con commits de las últimas dos horas que no es tuya, no arranques dos
sesiones en paralelo sobre el mismo carril.

### 8. Documentar recién al terminar

Cuando tus microtareas estén en `HECHO` o `BLOQUEADO` (con motivo concreto):

1. Evidencia final: capturas 390/768/1440 × claro/oscuro miradas, y la **doble revisión
   adversarial** (regla 35.1) — un agente distinto del que implementó, con la postura de
   rechazar. Si encuentra algo real, se corrige y se repite. No fusiones hasta que apruebe.
2. `REPORTE.md` con el avance en la primera línea, brechas y peldaño por área.
3. **Un solo PR** a este repo que actualice tu daily (0/93 → número final, fila por ID).

## Cómo se ve «terminado»

```text
AVANCE — perfil médico — cierre
- Hecho:      <N>/93 HECHO · <M> BLOQUEADO con motivo
- Evidencia:  PRs de código <#…> (mockup y dev, ya revisados y fusionados) · PR final de docs <#…>
- Bloqueo:    ninguno | <ID: qué lo destraba y de quién depende>
- Estado:     HECHO
- Peldaño:    VERIFIED por área, con doble revisión adversarial aprobada
```

Un `BLOQUEADO` solo vale si ya probaste el contrato simulado y el bloqueo es una decisión de
producto o una acción destructiva sobre algo compartido. «Estaba esperando a Pablo/Marcelo» no
cuenta más: sus dos piezas ya están fusionadas de verdad.
