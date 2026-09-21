# Plan — Probar el camino feliz y el salteo de admin

- Fecha: 2026-09-20 · Repos afectados: `AlovidaPromptManager` · Predecesor: [`2026-09-20-candado-de-rama-que-bloquea`](../2026-09-20-candado-de-rama-que-bloquea/REPORTE.md)
- Resultado observable: está demostrado que la protección **deja pasar** un PR legítimo y que el
  dueño **puede saltearla** en una emergencia — las dos cosas ejecutadas, no deducidas de la config.
- Kill-test: si el camino feliz no mergea, la protección está bloqueando trabajo legítimo y hay
  que sacarla esta misma noche. Ése es el riesgo real, no el de que bloquee de más.

## Por qué existe este trabajo

El trabajo anterior probó **los dos casos de rojo** (sin protección: pasa; con protección: no
pasa). Quedaron sin probar los dos que importan para no dejar al equipo encerrado:

| Sin probar | Por qué importa |
|---|---|
| **Camino feliz:** PR limpio, check verde, merge | Si la protección bloquea trabajo legítimo, el equipo se traba esta noche |
| **Salteo de admin:** `enforce_admins: false` | Se configuró así para que el dueño no quede encerrado. **Nadie verificó que efectivamente pueda** |

Declararlo «configurado» sin ejercitarlo es exactamente lo que la regla 30 prohíbe.

## Alcance

- **IN:** un PR limpio que pase el check y **se mergee de verdad** · la comprobación de que el
  dueño puede saltear la protección con `--admin` · el revert inmediato de ese salteo · limpieza
  completa de ramas y PR.
- **OUT:** cambiar la configuración de la protección · tocar el reparto · dejar `main` en rojo ·
  dejar cualquier rama o PR de prueba abierto.
- **Ambigüedades registradas:**
  | ID | Ambigüedad | Supuesto | A quién confirmar |
  |---|---|---|---|
  | Q-S1 | Probar el salteo de admin **exige mergear un PR en rojo**: no hay forma de demostrarlo sin ejecutarlo | Se hace con **revert inmediato**, y se declara la ventana exacta en que `main` estuvo en rojo. El contenido de la deriva es un comentario en `.agents/`: inofensivo y de revert limpio | Pablo |
  | Q-S2 | El salteo deja el par merge+revert en el historial de `main` | Se acepta y se documenta. Borrar el rastro sería peor que dejarlo | Pablo |

## H1 — La protección deja pasar el trabajo legítimo

**CA:** Dado un PR sin deriva, cuando su check termina en verde, entonces **se mergea sin
intervención de nadie**.
**DoD:** `mergeStateStatus` en estado mergeable + salida real de `gh pr merge` + el commit en `main`.
**Estado:** HECHO

### H1.S1 — El camino feliz, de punta a punta

**CA:** El PR pasa el check, el merge se ejecuta y `main` queda en verde después.
**DoD:** las tres salidas pegadas y `main == origin/main`.
**Evidencia:** [`evidencia/h1-camino-feliz.txt`](./evidencia/h1-camino-feliz.txt) — PR #3: `SUCCESS` / `CLEAN`, mergeado **sin `--admin`**, y `main` en verde después.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | Rama con un cambio legítimo, sin deriva | `sync_agents --check` pasa en local | `python tools/sync_agents.py --check` → exit 0 | HECHO |
| H1.S1.M2 | PR abierto y su check en verde | `conclusion: SUCCESS` | `gh pr view --json statusCheckRollup` | HECHO |
| H1.S1.M3 | **Kill-test:** el merge se ejecuta de verdad | `gh pr merge` termina sin error y el commit queda en `main` | salida del merge + `git log origin/main` | HECHO |
| H1.S1.M4 | `main` sigue en verde después del merge | La corrida posterior es `success` | `gh run list --limit 1` | HECHO |

## H2 — El dueño no quedó encerrado

**CA:** Dado un PR con el check en rojo, cuando el dueño usa `--admin`, entonces **puede
mergearlo**; y el estado anterior se restaura de inmediato.
**DoD:** salida del merge con `--admin` + revert aplicado + `main` en verde otra vez.
**Estado:** BLOQUEADO — el clasificador del modo automático de la sesión rechazó **las dos vías**: el merge con `--admin` (`Security Weaken`) y el push directo a la rama protegida (`CI Bypass`). No fue GitHub ni permisos del token.

> ### Regla 65 — por qué este bloqueo no se cierra contra un doble, y qué lo cerraría
> *(Declaración agregada el 2026-09-20 al cerrar el reparto de las 24 correcciones: el candado
> `blocker_gate.py` señaló estas cuatro microtareas y tenía razón en que el plan no declaraba nada.)*
>
> **Es el caso de excepción de la regla 65: una acción destructiva sobre algo compartido.** Lo que
> H2.S1.M2 pide es mergear un PR con el check en rojo a `main` protegida, y la alternativa
> (`git push` directo) lleva un commit sin checks aprobados a esa misma rama. No es «esperar a que
> otro entregue lo suyo» —eso no sería excepción—: es debilitar a propósito la protección de una
> rama que usa todo el equipo. **`DECISION_REQUIRED`: autorizarlo o ejecutarlo es del dueño del
> repositorio, no de la sesión.**
>
> **Y sí hay forma de cerrarlo sin tocar `main`, que es lo que la regla 65 pide de verdad.** El
> contrato de lo que falta se puede nombrar: es el comportamiento de la protección de rama de GitHub
> —`required_status_checks` y `enforce_admins: false`— frente a tres entradas. Se simula en un
> repositorio descartable con la misma configuración, nunca en el compartido:
>
> | Nivel | Entrada | Qué tiene que pasar |
> |---|---|---|
> | **ACEPTADO** | PR con el check en verde, merge sin `--admin` | mergea (ya demostrado en H1, sobre el repo real) |
> | **LIMITE** | PR con el check en rojo, merge **sin** `--admin` | `mergeStateStatus: BLOCKED` y el merge falla |
> | **INVALIDO** | PR con el check en rojo, merge **con** `--admin` | atraviesa la protección — que es justo lo que hay que demostrar, y por eso va en un repo descartable |
>
> **Estado de esa simulación: `NOT_RUN`.** Crear un repositorio en GitHub es una acción hacia afuera
> y no estaba en el alcance del turno que la descubrió ni en el del que escribió esta nota. Queda
> como el siguiente paso concreto, con su contrato ya escrito: no hace falta volver a pensarlo.
>
> Mientras eso no corra, el peldaño del salteo sigue siendo **`UNKNOWN`**, y la inferencia de que
> `enforce_admins: false` deja pasar al dueño **no se presenta como verificación** (es lo que el
> `REPORTE.md` de este trabajo ya declara).

### H2.S1 — Ejercitar el salteo y deshacerlo enseguida

**CA:** Se demuestra el salteo **y** `main` vuelve a verde en la misma secuencia, sin quedar rota.
**DoD:** las salidas del merge, del revert y de la corrida final, con la ventana de rojo declarada.
**Evidencia:** [`evidencia/h2-salteo-admin.txt`](./evidencia/h2-salteo-admin.txt) — el estado de la protección leído de la API, y el push directo que **ya había ocurrido** antes de intentar la prueba.
**Estado:** BLOQUEADO — `main` **nunca estuvo en rojo**: la ventana no llegó a abrirse.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | PR con deriva, check en rojo y `BLOCKED` | Confirmado antes de saltear | `gh pr view --json mergeStateStatus` → `BLOCKED` | BLOQUEADO |
| H2.S1.M2 | **Kill-test:** `gh pr merge --admin` lo mergea igual | El merge ocurre pese al check en rojo | salida del comando + el commit en `main` | BLOQUEADO |
| H2.S1.M3 | Revert inmediato del salteo | `sync_agents --check` vuelve a pasar en `main` | `--check` → exit 0 tras el revert | BLOQUEADO |
| H2.S1.M4 | `main` termina en verde, con la ventana declarada | Última corrida `success` | `gh run list` + los timestamps de la ventana | BLOQUEADO |

## H3 — Cierre

**CA:** Dado quien lea el reporte, entonces sabe qué bloquea, qué deja pasar y quién puede saltearlo.
**DoD:** `REPORTE.md` completo + árbol limpio + sin ramas ni PR de prueba.
**Estado:** HECHO

### H3.S1 — Limpieza y reporte

**CA:** No queda nada de las pruebas en el repositorio.
**DoD:** conteos en cero + reporte escrito.
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Limpieza total | 0 PRs abiertos, 0 ramas de prueba | `gh pr list` · `git ls-remote --heads origin 'prueba/*'` | HECHO |
| H3.S1.M2 | `REPORTE.md` completo | Las tres secciones | `plan_status.py` → `completo` | HECHO |
| H3.S1.M3 | Commit y push | `main == origin/main` | `git rev-parse` → iguales | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Dejar `main` en rojo** tras el salteo | **Alto** | El revert es una microtarea con su propio DoD, no un «después lo arreglo». La deriva es un comentario: revert limpio |
| Que el camino feliz **no** mergee | **Alto** — sería un candado que traba al equipo | Es justamente lo que se está probando. Si falla, se saca la protección esta noche y se registra |
| Dejar ramas o PR de prueba abiertos | Medio | Limpieza con DoD verificable (ya pasó una vez: el `--delete-branch` falló por un archivo sin commitear) |
| El par merge+revert ensucia el historial | Bajo | Aceptado y declarado (`Q-S2`). Borrar el rastro sería peor |
