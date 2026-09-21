# Daily de Pablo — turno noche — 2026-09-20

> **AVANCE: 54 / 55 — 98,2 %.** Sale de `microtareas HECHO / 55`, calculado por
> `python .claude/hooks/plan_status.py --path PLAN.md`, no a ojo. `A MEDIAS`
> cuenta como **no hecha**: la única es H6.S2.M2. Ninguna quedó `DESCARTADO`.

- **Turno:** noche · **Fecha:** 2026-09-20 (cerrado el 2026-09-21) · **Persona:** Pablo
- **Encargo:** [Agenda: dos solapas, el cupo manda la hora, y una sola consulta a la vez](Noche-CorreccionesDoctor.AgendaConsultas/SolapasCalendarioSlotsYReglaDeConsulta.md)
- **Correcciones cubiertas:** C-04, C-07, C-08, C-10, C-11, C-12 (UI), C-13 (UI) — y C-06 en mi área
- **Fuente del pedido:** [`CORRECCIONES-DOCTOR-2026-09-20.md`](../../../docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md)
- **Verificación contra el código:** [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](../../../docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md)
- **Archivos reservados:** `src/app/features/agenda/**` · `src/app/features/my-services/**` — no se tocó nada fuera
- **Reporte de cierre:** [entregables/REPORTE.md](Noche-CorreccionesDoctor.AgendaConsultas/entregables/REPORTE.md)
- **Plan con las 55 microtareas:** [entregables/PLAN.md](Noche-CorreccionesDoctor.AgendaConsultas/entregables/PLAN.md)
- **Prueba visual:** [entregables/INDICE-VISUAL.md](Noche-CorreccionesDoctor.AgendaConsultas/entregables/INDICE-VISUAL.md)
- **Evidencia completa:** `Noche-CorreccionesDoctor.AgendaConsultas/evidencia/` (~22 MB, casi todo capturas)

## 1. Lo primero — la instalación del estándar

```text
$ ls .claude/skills | wc -l
180

$ ls .claude/rules/[0-9]*.md | wc -l
14

$ python .claude/hooks/plan_gate.py --self-test
PASS  sin plan: bloquea codigo .ts
PASS  sin plan: bloquea codigo sin extension conocida
PASS  sin plan: permite .md
PASS  sin plan: permite bajo docs/
PASS  sin plan: permite bajo .claude/
PASS  sin plan: permite ruta fuera del proyecto
PASS  sin plan: ignora herramienta fuera de alcance
PASS  sin plan: evento sin file_path no bloquea
PASS  mensaje de bloqueo nombra la regla
PASS  con plan: permite codigo
PASS  plan ilegible: igual permite (no bloquea por formato)

plan_gate self-test: 11 PASS, 0 FAIL
```

**Desvío del encargo:** las skills son **180**, no 176. El catálogo creció desde
que se escribió el reparto. Se declara en vez de forzar el número.

**Detalle de método que le va a pasar al que venga:** `.claude/settings.json` es
un archivo **versionado de `mantra-core-health`**, así que copiar el estándar
encima lo ensucia. Se restauró con `git checkout` y el estándar quedó fuera del
árbol (`.git/info/exclude`).

- [x] Leí `skills-router` y las skills de las dos tablas del encargo.
- [x] Creé el `PLAN.md` **antes** del primer `Edit`/`Write` de código.

## 2. El corte que fijé

```text
$ git fetch origin && git log -1 --format='%H %ad %s' origin/mockup
68dcb562ef3dd74de03f4887c57fd836fb21be13 Sun Sep 20 20:59:15 2026 -0400 docs(deploy): documentar Traefik por IP en vez del dominio sslip.io de Coolify
```

El reparto declaraba `689697821a6e6d2c8f702c7508d6728fa9a1869a` (PR #554).
**Avanzó**, así que manda el mío: **`68dcb562`**.

- **Rama:** `pablo/noche-2026-09-20-agenda-consultas`, saliendo de ese corte.
- **Worktree:** `alovida/mch-pablo-noche-agenda` · **Commits:** 6.
- **PR abierto:** [#564](https://github.com/mdavila-2001/mantra-core-health/pull/564).
- **Rebasado al cierre sobre `origin/mockup` = `c038f2ef`**, que trae los
  contratos que publicó Ender durante la noche y el `app-row-actions` que
  publicó Itzan para C-06. **Los cinco kill-tests se volvieron a correr contra
  ese simulador nuevo** y siguen en verde:
  [entregables/CONTRASTE-CON-ENDER.md](Noche-CorreccionesDoctor.AgendaConsultas/entregables/CONTRASTE-CON-ENDER.md).

## 3. Checkpoints — el más reciente arriba

```text
AVANCE — Pablo — cierre — H6.S3.M2
- Hecho:      REPORTE.md y PLAN.md escritos; avance calculado 54/55 por plan_status.py
- Evidencia:  evidencia/h6/h6s3m2-avance-calculado.txt
- Ahora:      publicar la rama y avisar al equipo
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    REGRESSION_VERIFIED

AVANCE — Pablo — H6 — H6.S3.M1
- Hecho:      36 capturas (3 viewports x 2 temas), miradas. Encontraron TRES defectos
              que no vieron ni el typecheck ni las 471 pruebas: el desplegable sin
              clics en todos los viewports, los iconos a tamano natural, y el globo
              de la semana cortado en el telefono. Los tres arreglados y recapturados.
- Evidencia:  evidencia/h6/INDICE-VISUAL.md
- Ahora:      el REPORTE
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    REGRESSION_VERIFIED

AVANCE — Pablo — H6 — H6.S2.M2
- Hecho:      barrido 5/5 PASS; click-sweep 3/4 con 10 clics rotos, TODOS fuera de
              mi alcance y cero en /schedule ni /my-services
- Evidencia:  evidencia/h6/h6s2m2-barrido.txt
- Ahora:      la prueba visual
- Bloqueo:    falta correrlo sobre el corte base para demostrar que ya fallaban;
              la corrida tarda 7,7 min y el turno no dio para dos
- Estado:     A MEDIAS
- Peldaño:    TESTED

AVANCE — Pablo — H6 — H6.S1.M3
- Hecho:      iconOnly de 32 a 6 en mis archivos, con el motivo de cada uno escrito
- Evidencia:  evidencia/h6/h6s1m3-iconoonly-despues.txt
- Ahora:      la regresion
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    VERIFIED

AVANCE — Pablo — H5 — H5.S3.M2
- Hecho:      el rato de un servicio programado aparece BLOQUEADO en la agenda
              clinica como «Otros servicios · Consulta cardiologica», 14:00-16:00
- Evidencia:  evidencia/h5/h5.txt · capturas 05 y 06
- Ahora:      H6
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    VERIFIED

AVANCE — Pablo — H3 — H3.S3.M2
- Hecho:      defecto encontrado ejercitando la reserva: el dia ofrecia «Disponible»
              un cupo ya reservado. Nuevo estado no-disponible, derivado de
              remainingCapacity igual que la tabla de Consultas
- Evidencia:  evidencia/h3/h2s2m3-reserva.txt (4 libres -> 3)
- Ahora:      el horario extra
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    VERIFIED

AVANCE — Pablo — H2 — kill-test del hito
- Hecho:      /schedule?vista=table, cupos, citas y solicitudes abren el calendario,
              sin ninguna tabla, con dos solapas y una sola «Consultas»
- Evidencia:  evidencia/h2/kill-test-h2.txt (exit 0)
- Ahora:      H3
- Bloqueo:    ninguno
- Estado:     HECHO
- Peldaño:    VERIFIED
```

## 4. Cierre del turno

| Hito | Microtareas HECHO / total | Estado del hito | Qué falta exactamente |
|---|---|---|---|
| H1 | 9 / 9 | HECHO | — |
| H2 | 10 / 10 | HECHO | — |
| H3 | 11 / 11 | HECHO | — |
| H4 | 9 / 9 | HECHO | — |
| H5 | 9 / 9 | HECHO | — |
| H6 | 6 / 7 | **A MEDIAS** | H6.S2.M2: el click-sweep no cierra en verde. Barrido 5/5 PASS; click-sweep 3/4, con 10 clics rotos en `/my-account/profile/edit` (6) y `/my-quotations/new` (4) y **cero en `/schedule` ni `/my-services`**. Falta correrlo sobre el corte base `68dcb562` para demostrar que ya fallaban: tarda 7,7 min. Lo que sí está demostrado es que mi rama toca 26 archivos y ninguno participa de esas rutas |
| **Total** | **54 / 55** | | |

- **Peldaño de evidencia alcanzado** (el más bajo de mis áreas): `VERIFIED`.
  Todo lo cerrado llega a `REGRESSION_VERIFIED` salvo **H3.S3.M3** (el horario
  extra), que queda en `VERIFIED` contra un doble declarado porque el manejador
  simulado crea la excepción `EXTRA` pero **no genera cupos** para su ventana.
- **`REPORTE.md`:** `Noche-CorreccionesDoctor.AgendaConsultas/entregables/REPORTE.md`
- **Procesos que quedaron corriendo:** **ninguno.** El `yarn start` del servidor
  de desarrollo se bajó al terminar la verificación en navegador, y el puerto
  4200 quedó libre. Ningún navegador, ningún Playwright, ningún subagente.
  **Nota de método:** con el 4200 levantado, la suite de pruebas muere por
  memoria de esta máquina —«Worker exited unexpectedly», cero tests rojos y
  workers caídos—; hay que correrla con el servidor abajo.

### Gates del cierre, literales

```text
$ yarn typecheck          → exit 0
$ yarn lint               → exit 0
$ npx ng test --include='src/app/features/agenda/**/*.spec.ts' \
              --include='src/app/features/my-services/**/*.spec.ts' --watch=false
 Test Files  17 passed (17)
      Tests  473 passed (473)          (línea de base del turno: 430)

$ E2E_BASE_URL=http://localhost:4200 npx playwright test playwright/mockup-barrido.spec.ts --workers=1
  5 passed (23.5s)

$ python .claude/hooks/plan_status.py --path PLAN.md
TOTAL: 54/55 microtareas HECHO (98.2%)
```

## 5. A quién esperaba y quién me espera

| | Quién | Qué pasó |
|---|---|---|
| **Esperaba a** | Ender (excepción `EXTRA`, motivo del bloqueo, forma de la visita) | **No se esperó a nadie.** El simulado ya soportaba `EXTRA`, así que ese camino se ejercitó contra el manejador real; lo que NO hace —generar cupos— quedó registrado. El 409 de «una consulta a la vez» y la duración de la visita se cerraron contra dobles declarados en sus tres niveles (regla 65) |
| **Esperaba a** | Itzan (componente de acciones de fila) | **No se esperó**, y cuando llegó **se adoptó**. Mientras no estaba publicado se resolvió con `app-menu`, que ya existe y esta pantalla ya usaba; apareció durante la noche (merge `431dbe70`) y C-06 se **migró a `app-row-actions`** en el commit `07fdc7ed`. Dejar la versión propia habría sido una implementación paralela de algo que el sistema resuelve |
| **Me esperan** | Marcelo | `?vista=table`, `citas`, `solicitudes` y `cupos` **ya no muestran tabla**: abren el calendario. Tarjeta → atender es `dia-ir-a-atender` y lleva a `/medical-records/:id/consultation?motivo=…&cita=…`. Ojo con **H1-P5** al armar locators. Y los `data-testid` de las acciones de fila ahora viven **dentro** de un desplegable: hay que abrirlo antes de buscarlos (el patrón está en `agenda.spec.ts`) |
| **Me esperan** | Justin | Iniciar el encuentro **ahora tiene un freno**: con una consulta en curso no arranca otra, y el aviso ofrece ir a la abierta. Tu receta se prueba dentro de la que ya esté abierta |

## 6. Hallazgos y ambigüedades que aparecieron en el camino

| ID | Qué | A quién le pega | Estado |
|---|---|---|---|
| **H1-P3** | Quitar «Cupos» rompía además **mover una cita**: `iniciarReprogramacion()` salta a `vista=cupos` por código. No estaba en el pedido | Yo | **Resuelto**: los ratos libres del día son el destino |
| **H1-P4** | Con dos solapas, `enListas()` queda siempre falso y con él desaparecen los filtros de **ventana**, **canceladas** y **sede** | **Coordinación / doctor** | **ABIERTA** — es función perdida del calendario, no repuesta en este turno |
| **H1-P5** | «Mis horarios» monta un segundo `tablist` anidado: un locator por `aria-selected` no encuentra la solapa activa | Marcelo | Anotado |
| **H2-P1** | `playwright/agenda-pestana-horario.mjs:65` y `agenda-tabla-y-mes.mjs:42` navegan a `?vista=table`: sus capturas ya no muestran la tabla que documentaban | Su dueño (carril 18/09) | Anotado, no tocado |
| **H3-P1** | `POST /resources/:id/exceptions` con `isAvailable:true` crea la excepción y **no genera cupos**: el horario extra existe y no se puede reservar | **Ender** | **PEDIDO** |
| **H5-P1** | `POST /bookings/:id/start` del simulado **no valida nada**: transiciona sea cual sea el estado anterior y haya o no otra consulta en curso | **Ender** | **PEDIDO** |
| **H5-P2** | El contrato del doctor no publica el nombre del visitador ni el de su laboratorio. La tarjeta no puede nombrarlo, y mostrar el uuid está prohibido | **Ender** | **PEDIDO** |
| **H6-P1** | `menu-item` dimensiona el ícono con `[slot='icon'] svg`: el slot va en un **envoltorio**, no en el propio `<svg>`. Puesto mal, el ícono sale a tamaño natural y no lo ve ningún test | Itzan | Anotado (documentar en el componente) |
| **H6-P2** | `app-back-link` sólo ofrece modo `iconOnly` para el encabezado: C-06 lo dejaría sin texto en todas las secciones | Itzan | **PEDIDO** |
| **H6-P3** | El set cerrado de `NavIconName` no cubre las acciones de fila más comunes: faltan ver, aceptar, completar y registrar llegada. Seis de las once acciones de la agenda van con su texto y sin ícono, que es lo que `RowAction.icon` opcional permite | **Itzan** (es su set) | **PEDIDO** |
| **H5-P3** | El handoff de Ender dice que el simulador ya deriva `isAvailable` del tipo y que el campo «se ignora». **En `mockup` HEAD no es así**: lo lee del cuerpo (`scheduling.handlers.ts:624`), y un `EXTRA` sin el campo **cierra** los cupos. Seguir el handoff habría roto el horario extra | **Ender** | **AVISADO** |
| **Q-D6** | «OTROS SERVICIOS» no está en los 7 motivos del contrato | **Negocio** | `DECISION_REQUIRED` — se usa `OTHER` + texto, sin ampliar el enum |
| **Q-P4** | La duración configurable de la visita no existe en ningún contrato | **Ender + negocio** | `DECISION_REQUIRED` — 15 min por omisión desde el dato |

### Los tres defectos que encontró la prueba visual

Y que **no vieron** ni el typecheck, ni el lint, ni las 471 pruebas. Van anotados
como método, no sólo como bugs:

1. El desplegable de acciones **no recibía clics en ningún viewport**: un
   selector de descendientes de `day-view.css` nunca alcanzaba el contenido
   proyectado desde `/schedule` (encapsulación emulada).
2. Los íconos del desplegable salían a tamaño natural (H6-P1).
3. El globo de la semana se cortaba a media palabra en el teléfono.

Los tres están arreglados y vueltos a capturar. **Si esa pasada no se hacía, el
pedido principal del doctor —las acciones con texto— llegaba sin funcionar.**

## 7. Lo que NO se puede escribir acá

Y no se escribió: cada `PASS` de arriba tiene su comando y su salida pegados en
`evidencia/`; el avance sale de `plan_status.py`; lo que quedó a medias dice qué
anda, qué no anda, qué falta y dónde quedó; y las únicas cuentas que aparecen son
`@alovida.mock`, que son sintéticas declaradas.
