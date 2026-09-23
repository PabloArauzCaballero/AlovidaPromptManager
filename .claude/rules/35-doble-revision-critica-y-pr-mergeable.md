# 35 — Doble revisión ultra crítica y PR siempre mergeable

Dos obligaciones de **entrega** que no admiten excepción por tamaño, urgencia, obviedad ni pedido
de saltearlas. Viven entre la escalera de evidencia (regla 30) y el reporte (regla 40) porque
son el último filtro antes de que el trabajo salga de manos de quien lo hizo.

> ## ⛔ EXTREMADAMENTE OBLIGATORIO
>
> 1. **Toda captura de Playwright se revisa DOS veces**, la segunda de forma adversarial y ultra
>    crítica, con veredicto escrito. Una sola pasada no verifica nada visual.
> 2. **Todo PR que se deja queda MERGEABLE, demostrado con la salida de `gh`.** Un PR con
>    conflictos, checks en rojo o en draft no es una entrega: es trabajo `A MEDIAS`.
>
> Saltear cualquiera de las dos es falsear el estado del trabajo (regla 00 §6), no un atajo.

## 35.1 Doble revisión de capturas

1. **Primera pasada** — verificación: abrir cada captura como imagen, recorrer `visual-proof` §5
   y contrastar contra el criterio de aceptación literal. Una línea por captura.
2. **Segunda pasada** — adversarial: se hace **después** de cerrar la primera, sobre las capturas
   finales, con la postura de quien tiene que **rechazar** la entrega. Se responden por escrito las
   diez preguntas de `critical-double-review` §3 y cada hallazgo lleva severidad
   (`BLOQUEANTE` / `MAYOR` / `MENOR`).
3. **Nota por pantalla**: `RECHAZADA` · `ACEPTABLE CON RESERVAS` · `APROBADA`. Ante la duda, la
   más baja. Una pantalla `RECHAZADA` no se entrega ni se reporta como `HECHO`.
4. **Toda corrección exige re-captura y las dos pasadas otra vez** sobre la re-captura.
5. La evidencia es `evidencia/doble-revision.md`, enlazada desde el `REPORTE.md`. Sin ella, el
   peldaño visual máximo es `VERIFIED_FUNCTIONAL_ONLY` (regla 30).
6. Prohibido delegar la segunda pasada al mismo agente que implementó (regla 70.4.8).

Skill: `critical-double-review`.

## 35.2 PR mergeable

1. **Antes de entregar un PR** —al abrirlo, al pushear un cambio y al cerrar el turno— se
   consulta su estado real:

   ```bash
   gh pr view <n> --json number,url,isDraft,mergeable,mergeStateStatus,reviewDecision,baseRefName,headRefName
   gh pr checks <n> --watch --fail-fast
   ```

2. **Condición de entrega**, todas a la vez:
   - `mergeable` = `MERGEABLE` (no `CONFLICTING`; `UNKNOWN` se re-consulta, nunca se asume).
   - `mergeStateStatus` = `CLEAN` o `HAS_HOOKS`. `BEHIND` → actualizar la rama y volver a
     verificar. `DIRTY` → resolver conflictos. `UNSTABLE` → corregir el check que falla.
     `DRAFT` → no es entrega.
   - `BLOCKED` solo se acepta si **lo único** que falta es la aprobación humana requerida; se
     declara textual en el reporte con a quién se le pidió la review.
   - Checks en verde: ninguno en `fail`. Un check que falla por causa externa se clasifica
     (regla 80.4) con evidencia; no se ignora.
3. **La salida literal de ambos comandos** va a `evidencia/` y su resumen al `REPORTE.md`.
4. Si el PR no cumple la condición y no se pudo destrabar en el turno, la microtarea que lo
   entrega queda `A MEDIAS` con qué falla (`mergeStateStatus`, check, conflicto) y qué falta.
5. Prohibido destrabar un PR con privilegios de admin, deshabilitando checks, forzando el push
   sobre trabajo ajeno o debilitando tests (regla 00 §4, regla 80.5).
6. Tras mergear la base u otro PR, **el estado se vuelve a consultar**: un PR mergeable ayer puede
   tener conflictos hoy.

Skill: `pr-mergeable-gate`. Forma del PR: `github-pull-requests`.

## 35.3 Racionalizaciones prohibidas

| Racionalización | Respuesta obligatoria |
|---|---|
| "Ya miré las capturas una vez." | Una pasada es la que confirma lo que querías ver. Falta la adversarial. |
| "Es un cambio visual chico." | Los defectos chicos son justamente los que la primera pasada normaliza. |
| "El PR está abierto, que lo mergee otro." | Abierto no es mergeable. Consultá `gh` y pegá la salida. |
| "El conflicto lo resuelve quien mergee." | El conflicto es de tu rama; resolverlo es parte de la entrega. |
| "El check que falla no es mío." | Clasificalo con evidencia (regla 80.4); si no se puede, `A MEDIAS`. |
| "GitHub dice UNKNOWN, seguro está bien." | `UNKNOWN` no es `MERGEABLE`. Se re-consulta. |

## 35.4 Relación con otras reglas

Esta regla sube el piso de la regla 10 (fase 6 y fase 9), de la regla 30 (peldaño visual) y de la
regla 95.7. El `REPORTE.md` (regla 40) no puede declarar `COMPLETADO` una entrega visual sin la
doble revisión, ni una entrega por PR sin el estado mergeable pegado.
