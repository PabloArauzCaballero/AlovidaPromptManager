# Reporte — Cierre de H4.S2 de Ender: «Mis puntos» con el contrato final de Itzan

> **AVANCE DEL CARRIL: 47 / 48 — 97,9 %.** HECHO 47 · A MEDIAS 0 · DESCARTADO 1 (H2.S2.M2, cuenta como no hecha).
> H4 11/11 · H4.S2 4/4. Antes: 44/48 · 3 A MEDIAS (H4.S2.M2–M4).

- Fecha: 2026-09-24 · Plan: [PLAN.md](./PLAN.md) · Rama: `ender/h4s2-mis-puntos-final-2026-09-24`, desde `origin/main` `2a8ebfac`.
- Producto: `mantra-core-health` **PR #655** → `mockup`, commit `9dfd815cc10cb055fed96d9f10e31f7f77291f65`, sobre
  `origin/mockup` `e7437a5e`. **Abierto, sin merge.** Autor y committer `baamoc`, sin trailers.
- Por qué este PR y no #37: #37 ya estaba **MERGED** (squash `2a8ebfac`, 2026-09-25 02:54Z). Su rama no es ancestro de
  `main`, así que publicar encima pedía un merge de `main` o un force push, y ninguno de los dos está autorizado.

## Completado

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H4.S2.M2 | `/my-account/loyalty` → `/my-account?pestana=puntos`, conservando el query (`RedirectFunction` → `UrlTree`; con un `redirectTo` de texto, `@angular/router` 21.2.18 lo pierde). Si una clave choca, gana el destino. «Mis puntos» sigue con `fueraDelMenuPara: [ANY_ROLE]` | recorrido Playwright contra `ng serve` mock | 53/53 |
| H4.S2.M3 | 6 aserciones específicas en `app.routes.spec.ts`, y el test genérico de destinos cubre las secciones redirigidas (sin bajar el piso `> 15`) | `yarn ng test --include …` | 769/770 (el rojo es preexistente, ver abajo) |
| H4.S2.M4 | Daily de Ender y sus tres celdas del daily de equipo: contrato publicado por Itzan, integración validada y fallback reemplazado | `git diff` | sólo entradas de Ender |

### Recorrido integrado (53/53)

- `paciente@alovida.mock`, 1440 claro, 1440 oscuro y 390 claro. `/my-account/loyalty` y `/my-account/loyalty?foo=bar`
  terminan en `/my-account?pestana=puntos` y `…&foo=bar`, con «Mis puntos» seleccionada, la billetera a la vista y
  una sola cabecera (`h1` «Mi perfil»). La billetera no trae cabecera propia y a 390 no hay desborde. El menú del
  paciente no tiene «Mis puntos» (14 renglones). `/my-account/cotizaciones` pinta «Cotizaciones».
- `medica@alovida.mock`: la redirección monta `app-practitioner-profile`, sin not-found ni error, sin billetera y con
  **las mismas pestañas y cabeceras** que su `/my-account` sin redirección. No aparece ninguna pestaña de paciente.
- 0 respuestas 4xx/5xx. Los avisos de CSP en consola aparecen sólo en `/auth`, también en una línea de base sin sesión.

## A medias

Ninguna.

## Pendiente

| Qué | Estado | Qué lo destraba |
|---|---|---|
| Merge de #655 | abierto, `MERGEABLE` | revisión y merge externos (no autorizado en este carril) |
| CI de #655 | **en cola**: el runner no toma trabajos (49 corridas en cola, 0 en curso, la más vieja del 2026-09-24 03:56Z) | que vuelva el runner |
| `shell-layout.spec.ts:259` (íconos del registro vs. nav) | rojo **preexistente**: también falla en `origin/mockup` `e7437a5e` puro | ajeno a este carril |
| `playwright/mis-puntos-quinta-pestana.mjs` (Itzan) | espera 5 pestañas, y después de #654 son 6 | Itzan |
| Tira de pestañas a 390 | no se desplaza hasta la pestaña que llega preseleccionada (`tabs.ts:88-95`) | dueño de la molécula `tabs` |
| Historia de Git con datos personales | `GIT_HISTORY_PII_REMEDIATED = NO` | decisión aparte del dueño o administrador del repositorio |

## Evidencia

```text
$ git -C mantra-core-health diff --check origin/mockup 9dfd815c        → limpio
$ yarn typecheck                                                        → exit 0
$ eslint (4 archivos del delta)                                         → exit 0
$ ng test --include app.routes / core/navigation / shell-layout / my-profile / loyalty / cotizaciones
  Test Files 1 failed | 30 passed (31) · Tests 1 failed | 769 passed (770)
  (el rojo: shell-layout.spec.ts > «los nombres de ícono…»; con el delta quitado sigue 1 failed | 66 passed)
$ recorrido integrado (Playwright, ng serve mock :4321)                 → 53/53
$ escaneo de datos personales (105 personas / 306 candidatos de la planilla; el control positivo detecta 10 matrículas en el fixture)
  delta de #655: 0 · docs/trabajo/2026-09-22-ender-simulador-cabecera en mockup (39 archivos): 0 · core/mock/README.md: 0
```

## No cubierto

- El CI remoto de #655 (en cola).
- La matriz completa de viewports del recorrido: se cubrieron 1440 claro/oscuro y 390. Itzan ya había cubierto la
  pestaña en 1920/1440/1024/768/390 en #606.
