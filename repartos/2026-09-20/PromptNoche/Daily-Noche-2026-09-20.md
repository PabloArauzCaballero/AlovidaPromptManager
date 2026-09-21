# Daily — turno noche — 2026-09-20

> **AVANCE DEL TURNO: 0 / 272 — 0 %.** ← se llena al cerrar, con `microtareas HECHO / total`.
> Pablo 0/55 · Ender 0/55 · Itzan 0/54 · Marcelo 0/54 · Justin 0/54.
> **`A MEDIAS` cuenta como no hecha. `DESCARTADO` no suma: se declara aparte con su motivo.**

> **Estado:** `REPARTIDO` al 2026-09-20. Este documento se escribió **al repartir, antes del turno**;
> las filas de resultado se llenan con lo que cada carril ejecute.

- **Turno:** noche · **Fecha:** 2026-09-20 · **Paquete fuente:** las **24 correcciones del doctor**
- **Fuente del pedido (verbatim, con procedencia):** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md)
- **Verificación contra el código real:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
- **Todo el trabajo está en esta única fecha.** Cada persona tiene **un solo prompt** con sus seis hitos.

## 0. Los tres hechos que ordenan toda la noche

1. **La maqueta que el doctor mira no tiene backend.** La rama `mockup` fija `mockBackend: true` en
   `src/environments/environment.ts`, **sin leer el entorno del proceso a propósito**, para que no
   haya forma de apuntarla a una API real por accidente. Consecuencia: **todo DoD se demuestra contra
   los manejadores simulados de `src/app/core/mock/`**, que son de **Ender**. Eso no exime de
   respetar el contrato real: el simulador es un **doble declarado** (regla 65), y si el contrato real
   no soporta lo que se pide, eso es un hallazgo que se registra, no una licencia para inventarlo.
2. **El corte es `origin/mockup`, no el working copy.** Corte de referencia:
   **`689697821a6e6d2c8f702c7508d6728fa9a1869a`** (PR #554, 2026-09-20T12:32-04). El working copy del
   frontend está en otra rama, y **tres de las cosas que el doctor describe no existen ahí**
   (`?vista=table`, la solapa «Calendario», el botón «Mis horarios»). Cada persona **reconsulta y
   declara** su corte en la primera microtarea.
3. **Dos correcciones pueden estar ya cumplidas** (C-18 y C-22). **No se declaran hechas**: se
   verifican ejercitando la pantalla y, si ya están, cierran `DESCARTADO` **con la captura**. Un
   `HECHO` sin haber ejercitado es exactamente lo que la regla 30 prohíbe.

## 1. Quién tiene qué

| Persona | Encargo | Correcciones | Hitos | Subtareas | Microtareas | Estado |
|---|---|---|---:|---:|---:|---|
| **Pablo** | [Agenda: dos solapas, el cupo manda la hora, y una sola consulta a la vez](Pablo/Noche-CorreccionesDoctor.AgendaConsultas/SolapasCalendarioSlotsYReglaDeConsulta.md) | C-04, C-07, C-08, C-10, C-11, C-12 (UI), C-13 (UI) | 6 | 18 | 55 | `TODO` |
| **Justin** | [La receta: sacarle lo que no va, y que la dosis y la posología digan la verdad](Justin/Noche-CorreccionesDoctor.Receta/RecetaLimpiaMotivoDosisYPosologia.md) | C-15, C-16, C-17, C-18, C-19, C-20 (UI), C-21, C-22 | 6 | 18 | 54 | `TODO` |
| **Itzan** | [El patrón de la casa: botones con texto, insignia de especialidad, y un perfil que se puede editar entero](Itzan/Noche-CorreccionesDoctor.PerfilYDisenio/PatronDeBotonesInsigniaYPerfilEditable.md) | C-01, C-02, C-05, **C-06 (patrón)**, C-09, **C-21 (regla)** | 6 | 18 | 54 | `TODO` |
| **Ender** | [Los contratos que faltan y un panel que diga la verdad](Ender/Noche-CorreccionesDoctor.ContratosYPanel/CatalogosBloqueosPosologiaYPanel.md) | C-03, C-12 (contrato), C-13 (contrato), C-20 (catálogo), C-24 | 6 | 18 | 55 | `TODO` |
| **Marcelo** | [La cuadrícula de notas, la internación según norma, y el dictamen del lote](Marcelo/Noche-CorreccionesDoctor.ExpedienteYAceptacion/CuadriculaDeNotasInternacionNormadaYDictamen.md) | C-14, C-23 + **dictamen de las 24** | 6 | 18 | 54 | `TODO` |
| | | **24 de 24 cubiertas** | **30** | **90** | **272** | |

**Total del turno: 272 microtareas.** El avance se reporta `HECHO / total`, **nunca a ojo**.

> ⚠️ **Esto es más de lo que entra en una noche, y está dicho a propósito.** El alcance se entrega
> completo y ordenado por dependencia. **Lo que no se cierre va `A MEDIAS`**, con qué anda, qué no
> anda y qué falta exactamente. **Recortar alcance es decisión de coordinación, y se registra.**

## 2. Cobertura de las 24 — el kill-test del reparto

Una fila sin persona o sin hito significa que esa corrección **no está repartida**.

| ID | En una línea | Persona | Hito |
|---|---|---|---|
| C-01 | Quitar «Cómo atendés» de la pestaña «Dónde atiendo» | Itzan | H4 |
| C-02 | Quitar los enlaces sueltos; el consultorio como pestaña con su QR | Itzan | H4 |
| C-03 | Globos del panel con el diseño de los de la agenda | Ender | H6 |
| C-04 | Las tarjetas de `/schedule` llevan a iniciar el encuentro | Pablo | H4 |
| C-05 | Editar el perfil muestra todos los campos, en todas las pestañas | Itzan | H5 |
| C-06 | Botón = icono + texto; acciones de tabla en desplegable | **Itzan (patrón)** + los cinco (aplicación) | Itzan H2 · Pablo H6 · Justin H6 · Ender H6 · Marcelo (en sus pantallas) |
| C-07 | Quitar la vista `?vista=table` | Pablo | H2 |
| C-08 | Semana desplegable con hover · mes con chips · «Calendario» → «Consultas» | Pablo | H2 y H4 |
| C-09 | Especialidades como grid de insignias, homogéneo | Itzan | H3 |
| C-10 | Quitar «Cupos» · modal · sin hora · toggles · slots reales · extensión | Pablo | H2 y H3 |
| C-11 | Una consulta a la vez · quitar los botones de arriba a la derecha | Pablo | H2 y H5 |
| C-12 | Horarios de «Mis Servicios» que bloquean con «Otros servicios» | Pablo (UI) + **Ender (contrato)** | Pablo H5 · Ender H2 |
| C-13 | Visita de laboratorio en la misma pestaña, VISITADOR, 15 min configurable | Pablo (UI) + **Ender (contrato)** | Pablo H5 · Ender H3 |
| C-14 | Cuadrícula tipo Excel en el modal de notas, una fila por sesión | Marcelo | H2 y H3 |
| C-15 | No se descarga la receta desde donde se la escribe | Justin | H2 |
| C-16 | Quitar la barra de demostración de la receta | Justin | H2 |
| C-17 | Quitar los favoritos de la receta | Justin | H2 |
| C-18 | Poder escribir una razón además de elegir un diagnóstico | Justin | H3 |
| C-19 | Dosis como texto libre; quitar «Unidad» | Justin | H4 |
| C-20 | Frecuencia por defecto del medicamento (posología) | Justin (UI) + **Ender (catálogo)** | Justin H5 · Ender H4 |
| C-21 | Todo lo que sean opciones, `select` | **Itzan (regla)** + Justin + los cinco | Itzan H6 · Justin H6 |
| C-22 | «¿Para qué es esta receta?» opcional | Justin | H3 |
| C-23 | Rehacer el formulario de internación según norma | Marcelo | H4 y H5 |
| C-24 | Panel: colores, semanal/mensual, mapa de calor, canceladas, otras atenciones | Ender | H5 |

## 3. Lo primero, para todos

Antes de la primera microtarea: instalar el estándar (sección 1 del encargo) y **pegar la salida de
los tres comandos** en el daily personal. Un turno que arranca sin eso arranca en `BLOQUEADO`.

```bash
ls .claude/skills | wc -l            # -> 176
ls .claude/rules/[0-9]*.md | wc -l   # -> 14  (mas el README, que no es una regla)
python .claude/hooks/plan_gate.py --self-test    # -> 11 PASS, 0 FAIL
```

Y los comandos reales de esta rama, que **no** son los de la API:

```bash
yarn install && yarn start            # http://localhost:4200, sin .env, sin proxy, sin base
yarn typecheck                        # tsc app + cypress + playwright
yarn lint
npx ng test --include=<spec> --watch=false
npx ng test --include=src/app/core/mock/mock-backend.spec.ts --watch=false   # el simulador entero
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1
E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-click-sweep.spec.ts --workers=1
```

**Cuentas de la maqueta** (cualquier contraseña no vacía): `medica@alovida.mock`,
`paciente@alovida.mock`, `admin@alovida.mock`, `superadmin@alovida.mock`, `visitador@alovida.mock`.
Son **sintéticas declaradas**: se pueden pegar en el reporte. **Ningún dato real de paciente, nunca**
(regla 90.2).

**Regla 70:** un `yarn start`, un build, un navegador, Playwright con `--workers=1`. Nada en
background que no cierres vos.

## 4. Orden de dependencia — quién espera a quién

| Quien espera | De quién | Qué exactamente | Qué hace mientras tanto |
|---|---|---|---|
| **Los cuatro** | **Itzan (H2)** | El componente de acciones de fila con icono + texto, y la regla escrita | Avanzar el resto de su lote; C-06 queda al final. **Itzan publica temprano, aunque su lote esté a medias** |
| **Pablo (H3.S3)** | **Ender (H2)** | Que la excepción `EXTRA` funcione en el simulador | Dejar la microtarea `BLOQUEADO` con el pedido escrito **y** simular el contrato en sus tres niveles (regla 65) |
| **Pablo (H5.S2, H5.S3)** | **Ender (H2, H3)** | Motivo del bloqueo de servicios · forma de la respuesta de la visita y duración configurable | Ídem |
| **Justin (H5)** | **Ender (H4)** | **La clave de la propiedad de frecuencia por defecto** y su forma | Simular la ficha del concepto en sus tres niveles y seguir |
| **Justin (H2.S1)** | **Marcelo** | El cambio del `output` de descarga en `consultation.html`, que es de Marcelo | Pedirlo por el daily y anotarlo en los dos |
| **Marcelo (H2, H3)** | **Ender (H1.S3)** | Dónde guardar las filas de la cuadrícula | Cerrar contra el doble, declarándolo |
| **Marcelo (H6)** | **Los cuatro** | Su trabajo terminado, para poder ejercitarlo | **Escribir el dictamen igual**, con `NOT_RUN` en lo que no llegó a estar |
| **Coordinación** | Itzan (H4), Marcelo (H4) | Qué pasa con `/administration/my-practice` · cuántos campos de la hoja de admisión no entran hoy | — |

**Si dos personas miden lo mismo y les da distinto, eso es un hallazgo, no un empate a resolver
charlando.** Gana el archivo abierto, y la diferencia se registra.

## 5. Reservas de archivos — para que nadie se pise

Rutas relativas a `mantra-core-health/`, sobre la rama `mockup`.

| Ruta reservada | Para quién |
|---|---|
| `src/app/features/agenda/**` · `src/app/features/my-services/**` | **Pablo** |
| `src/app/features/clinical-record/patient-chart/medication-block/**` · `src/app/core/data-access/prescription-favorites/**` | **Justin** |
| `src/app/features/clinical-record/patient-chart/free-note-block/**` · `.../admission-block/**` · `src/app/features/clinical-record/consultation/**` | **Marcelo** |
| `src/app/shared/**` · `src/app/features/account/my-profile/**` | **Itzan** |
| `src/app/core/mock/**` · `src/app/features/dashboard/**` · `src/app/core/data-access/**` (menos `prescription-favorites/**`) | **Ender** |
| `mantra-core-health-api/**` · `mantra-core-health-model/**` | **NADIE esta noche.** Se leen y se citan; **no se escriben** |

**Dos personas escribiendo el mismo archivo es un defecto del reparto, no un accidente.** Quien
necesite un cambio en la ruta de otro **lo pide por el daily y no lo escribe**. Un cambio acordado se
anota en los dos dailies, con quién lo escribió.

## 6. Ambigüedades abiertas — se arrastran, no se resuelven

| ID | Qué | Quién la cierra | Estado |
|---|---|---|---|
| Q-D1 | Sobre qué rama aplica el pedido (se asumió `origin/mockup`) | Pablo / coordinación | `ABIERTA` — supuesto declarado |
| Q-D2 | Varios puntos mezclan cambio de UI con cambio de regla de negocio | Doctor | `ABIERTA` — se separan en microtareas distintas |
| Q-D3 | **C-06 revierte una decisión de propietario del 2026-09-13 escrita en el código** | Doctor / propietario | `ABIERTA` — gana el pedido nuevo, el desvío se registra |
| Q-D4 | C-18 y C-22 parecen ya cumplidos | Doctor | `ABIERTA` — se verifican ejercitando; si están, `DESCARTADO` con captura |
| Q-D5 | C-24: «los colores no coinciden» sin decir con qué | Doctor | `ABIERTA` |
| Q-D6 | **«OTROS SERVICIOS» no está en la lista cerrada de 7 motivos** del contrato | **Negocio** | `DECISION_REQUIRED` — se usa `OTHER` + texto mientras tanto |
| Q-D6b | **C-20 pide posología «de fábrica» y el vademécum declara no tener fuente autoritativa** | **Negocio (con fuente clínica)** | `DECISION_REQUIRED` — **el mecanismo se implementa; el dato NO se inventa** (regla 97.5.4, precedente B-13) |
| Q-D7 | C-14: las filas anteriores, ¿editables o sólo lectura? | Doctor | `ABIERTA` — se asume sólo lectura |
| Q-D8 | C-21 pide `select` y C-10 pide toggles | Doctor | `ABIERTA` — lista → `select`; alternancia → toggle |
| Q-D9 | **C-23: «según nomra» sin nombrar la norma** | **Doctor / negocio** | `DECISION_REQUIRED` — lo que no se pueda citar va `UNKNOWN` |

**Las tres `DECISION_REQUIRED` son las que más trabajo bloquean.** Ninguna impide arrancar: las tres
tienen supuesto declarado y camino sin romper contrato. Lo que impiden es **cerrar** la parte que
depende de la decisión.

## 7. Hallazgos previos que afectan a todo el equipo (de la verificación contra el código)

| ID | Qué | A quién le pega | Regla que manda |
|---|---|---|---|
| **HALL-D1** | La maqueta no tiene backend: `mockBackend: true` fijo. Todo DoD va contra `core/mock/**` | Los cinco | Regla 65 |
| **HALL-D2** | **El working copy no es la maqueta**: tres cosas que el doctor describe no existen en `dev` | Los cinco | Regla 30 §4 |
| **HALL-D3** | C-06 revierte una decisión de propietario escrita en el código el 2026-09-13 | Itzan + los cuatro | Regla 00 §8 |
| **HALL-D4** | «OTROS SERVICIOS» no está en la lista cerrada de 7 motivos | Pablo, Ender | Regla 00 §1.3, 96.4.1 |
| **HALL-D5** | El vademécum **declara** no tener fuente autoritativa y no publica ninguna frecuencia | Justin, Ender | Regla 97.5.4 + B-13 |
| **HALL-D6** | El motor de formularios tiene 5 tipos de pregunta y **ninguno es tabla**: la grilla de C-14 no tiene dónde guardarse hoy | Marcelo | Regla 65, 96.1 |
| **HALL-D7** | `care_episodes` no tiene servicio, sala, cama ni diagnóstico de ingreso | Marcelo | Regla 97.1, 97.7 |
| **HALL-D8** | No existe endpoint de analítica de consultas; `reporting` es un motor de definiciones (todo `POST`) | Ender | Regla 00 §1.1 |
| **HALL-D9** | El visitador **no puede** ver información clínica; la visita comercial no se mezcla con la agenda clínica | Pablo, Ender | Regla 90.1, 90.2 |
| **HALL-D10** | `pestanas-del-perfil-medico.spec.ts` falla si un campo del alta queda sin pestaña | Itzan | Regla 80.5.4 |

## 8. Cierre del turno — completar acá

| Persona | HECHO / total | Hitos cerrados | `A MEDIAS` | `BLOQUEADO` | Su daily |
|---|---|---|---|---|---|
| Pablo | __ / 55 | __ / 6 | | | [Pablo-Daily-Noche-2026-09-20.md](Pablo/Pablo-Daily-Noche-2026-09-20.md) |
| Justin | __ / 54 | __ / 6 | | | [Justin-Daily-Noche-2026-09-20.md](Justin/Justin-Daily-Noche-2026-09-20.md) |
| Itzan | __ / 54 | __ / 6 | | | [Itzan-Daily-Noche-2026-09-20.md](Itzan/Itzan-Daily-Noche-2026-09-20.md) |
| Ender | __ / 55 | __ / 6 | | | [Ender-Daily-Noche-2026-09-20.md](Ender/Ender-Daily-Noche-2026-09-20.md) |
| Marcelo | __ / 54 | __ / 6 | | | [Marcelo-Daily-Noche-2026-09-20.md](Marcelo/Marcelo-Daily-Noche-2026-09-20.md) |
| **Total** | **__ / 272** | **__ / 30** | | | |

**Dictamen de aceptación del lote (Marcelo, H6):** ____ (ruta) · **Veredicto global:** ____

### Qué NO se puede escribir en este documento

- Un `PASS` sin comando y exit code pegados.
- «Listo», «funciona» o «implementado» sobre algo que no se ejecutó.
- Un porcentaje que no salga de `HECHO / total`.
- Un `BLOCKED` disfrazado de `PASS` porque «igual compila».
- Una corrección marcada cubierta que no tenga su microtarea cerrada con evidencia.
- Datos de pacientes reales en cualquier salida pegada.
