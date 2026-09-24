# ActionLog

Registro cronológico de qué se avanzó en este repositorio, entrada por sesión/turno. No
reemplaza los dailies (`repartos/<fecha>/<turno>/`) ni los `REPORTE.md` de cada persona — es el
resumen de alto nivel para quien no quiere abrir carpeta por carpeta. Entradas nuevas van
**arriba**, más recientes primero.

---

## 2026-09-24 — Justin · "Terminar el baseline comparable de Directorio y Reserva"

**Ramas:** `justin/cerrar-baseline-comparable-reserva-2026-09-24` (este repo, apilada sobre la del
PR [#36](https://github.com/PabloArauzCaballero/AlovidaPromptManager/pull/36)) y
`justin/baseline-historico-reserva-2026-09-23` en `mantra-core-health`
(PR [#610](https://github.com/mdavila-2001/mantra-core-health/pull/610) → `mockup`).
**Estado: 9/9 microtareas del plan en `HECHO`.** El conteo del carril original **no se toca**:
sigue en 29 / 51.

**Pedido:** terminar lo que había quedado a medias y subirlo como PR. Lo que estaba a medias era la
medición del flujo de reserva, que el daily de equipo del 22/09 tenía en `A MEDIAS` con el motivo
«faltan baseline y recorrido», y que el reporte de gates del 23/09 repetía como pendiente. En disco
había un `PLAN.md` con todo en `TODO`, un spec de Playwright y evidencia, **sin commitear**.

### Qué se avanzó

- **La medición, terminada y auditada** — [PLAN y
  REPORTE](docs/trabajo/2026-09-24-cerrar-baseline-comparable-reserva/REPORTE.md). Dos escenarios,
  **10 muestras por corte cada uno**, entre `b7785e36` y la punta de `mockup` `a43ad2b3`: hasta los
  cupos con cuatro activaciones, mediana **1428 → 1108 ms** (rangos solapados); camino por defecto
  que termina sin horarios, **1460 → 892 ms** (sin solapamiento). **Cero peticiones de negocio
  observables** en los dos cortes: el simulador es un interceptor en memoria.
- **Seis defectos del instrumento heredado**, encontrados auditándolo antes de creerle: el
  cronómetro paraba en «Semana anterior» y no llegaba a medir la carga de los cupos; `estable()`
  espera un `networkidle` que con `ng serve` no llega; el preset `Desktop Chrome` pisaba el viewport
  y los archivos `-1440` guardaban 1280 px; `fullPage` con la barra lateral fija la pintaba encima
  del resto; `page.screenshot()` no congela animaciones; y `animations: 'disabled'` **tampoco
  alcanzó**, así que ahora se espera a que terminen las animaciones finitas y se asevera el estado
  asentado.
- **Tres cosas del daily corregidas:** los «1.468 ms hasta un cupo» **no se reproducen** con
  instrumento declarado; «cuatro toques → una navegación» **ya se cumplía en `b7785e36`**, no es un
  delta de #583; y el corte posterior **no es #583** sino la punta de `mockup`, 8 merges de PR más
  adelante. Nada se adjudica a un PR: entre los dos cortes entró también la tabla de latencia
  determinista de Ender, que toca justo la ruta caliente de elegir médico.
- **Hallazgo de producto:** el camino que un paciente toma por defecto —primera tarjeta de la
  primera especialidad— **no llega a un cupo en ninguno de los dos cortes**, porque los médicos de
  la red de aseguradoras no tienen agenda a propósito. Queda `DECISION_REQUIRED`.
- **Las dos filas del daily actualizadas**, de `A MEDIAS` a `PUBLICADO con límites`, en el daily de
  equipo (§4-bis) y en el de Justin (§7 y §9).

### La doble revisión no fue un trámite

Tres rondas, siempre por un agente distinto del que implementó (regla 35.1.6). La primera **rechazó
4 de 7 pares** de capturas: mostraban **médicos reales** del catálogo que publican las aseguradoras,
con nombre y dirección de consultorio; dos pares estaban fotografiados a mitad de animación; y el
corte «después» no era el que el plan declaraba. También destapó que publicar una corrida suelta
daba **−36 %** donde por medianas era −18 %. La segunda rechazó una captura más, que seguía en vuelo
**pese al flag** de Playwright. Sin esa disciplina, este cierre habría publicado un número que no
existe y datos de personas reales.

### Nada más quedó a medias

Se revisaron los otros repositorios y worktrees: `mantra-core-health-redesa-api`,
`mantra_core_health_mobile` y el resto de los worktrees de Justin no tienen commits sin subir ni
trabajo sin commitear. El worktree `wt-justin-gates-reserva-cotizaciones` sólo tenía un `PLAN.md`
suelto, superado por el PR #36 de este repo.

---

## 2026-09-22 — Pablo, plan maestro y reparto del turno noche 2026-09-22 · "Correcciones del doctor y del paciente"

**Rama:** `main` de este repo · **Estado: reparto cerrado, 25/25 microtareas del trabajo en `HECHO`.**
**Ejecución de lo repartido: 0 / 319.** Nada se corrió todavía en `mantra-core-health`.

**Pedido:** 19 observaciones nuevas del cliente — 10 del perfil del doctor (`D-01…D-10`), 3 del flujo de
reserva (`R-01…R-03`), 3 de la pantalla de inicio del paciente (`P-01…P-03`) y 3 del menú lateral
(`N-01…N-03`) —, transcritas verbatim en
[`docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md`](docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md)
y localizadas con archivo y línea en
[`docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md)
sobre `origin/mockup` @ `b655e8449abd662d6b24156fd6e2b06aeb120cc1` (traído con `git fetch` a pedido, junto con
`origin/dev` del front y de la API).

### Qué quedó repartido

Cinco carriles en [`repartos/2026-09-22/PromptNoche/`](repartos/2026-09-22/PromptNoche/), con un
[plan maestro](docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/PLAN-MAESTRO.md) que fija
orden, dependencias y un kill-test por observación:

| Persona | Carril | Micro |
|---|---|---|
| Pablo | La disciplina de tabla con acciones como **ADR-0015**, `pagination`/`filter-bar`/`data-table`, y «Dónde atiendo» que la cumple | 68 |
| Itzan | Perfil del médico sin «principal», sin datos del trabajo; Trayectoria y Credenciales con modal, adjunto, buscador y paginación; mapa que vacía la dirección; «Mis puntos» como pestaña | 93 |
| Justin | Clic único y carga visible en el directorio; «Cotizaciones» del paciente por precio y cercanía | 51 |
| Ender | Latencia del simulador decidida por ruta; agendas para los 13 médicos registrados; Chats y Tutoriales en la cabecera | 48 |
| Marcelo | Silueta del cuerpo accesible (molde de `department-map`); texto visible y dictado por voz; `confirmarCambios()` para todos | 59 |

### Dos guías de trabajo nuevas del cliente

D-04 («todo formulario que nace de una acción de tabla va en modal») y D-08 (la disciplina completa de tabla
con acciones) se adoptan «a partir de ahora»: quedan como ADR-0015 en el frontend (Pablo H2) y como memoria
de trabajo de este repo.

### Hallazgos que cambian el encargo

- **Sólo `POST`/`DELETE` de credenciales existen en la API real**; editar título/especialidad/matrícula y
  retirar especialidad/matrícula viven sólo en el simulador (el propio `profiles.client.ts:775-786` lo declara).
  Todo eso se cierra `VERIFIED` contra el doble, con la brecha declarada para `dev` (HALL-E3).
- **`DataTable` pagina por cursor por decisión documentada** y D-08 pide números y selects: se resuelve con
  `app-pagination` en cliente para listas locales, sin romper 30 consumidores (HALL-E4).
- **Los 13 médicos registrados no reciben agenda** en los fixtures (`agenda.ts:106`): es la causa probable de
  «no tiene turnos» al elegir médico (HALL-E9).
- **La latencia del simulador es 120–300 ms aleatoria por petición** (`mock-backend.interceptor.ts:251-259`) y
  «elegir médico» dispara varias en serie: R-02 se mide antes de tocar (HALL-E8).
- **No hay precios con procedencia** fuera de farmacias: el arancel médico está en UMA sin conversión. N-02 se
  implementa con «precio no publicado», nunca con un número inventado (HALL-E11, `DECISION_REQUIRED`).
- **39 de los 78 `iconOnly` no tienen dueño esta noche** (eran 107 el 20/09): declarado con denominador.

### Cómo se verificó el reparto, en vez de afirmarlo

```text
python tools/check_reparto.py repartos/2026-09-22   -> exit 0
python tools/check_skills_citadas.py                -> exit 0, 114 skills citadas, 0 inexistentes
script de cobertura                                 -> 19/19 observaciones con dueño, 0 sin dueño
                                                       5/5 prompts con la sección 1 obligatoria
                                                       32 hitos / 64 subtareas / 319 microtareas
script de intersección de reservas                  -> 0 choques entre 5 carriles; 1 ruta cambia de dueño
                                                       respecto del 21/09 (work-history → Pablo), declarada
```

Reporte completo: [`docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/REPORTE.md`](docs/trabajo/2026-09-22-plan-y-reparto-correcciones-doctor-y-paciente/REPORTE.md).

### Nada tocado en los repos de producto

Por diseño: este trabajo reparte, no implementa. `mantra-core-health` y `mantra-core-health-api` se
**leyeron** (con `git fetch` de `dev` y `mockup`) y se citan con archivo y línea; **ninguno tiene commits de
este trabajo**. Ningún subagente ni workflow: regla 70.

---

## 2026-09-21 — Pablo, reparto del turno noche 2026-09-21 · "Refactorización frontend: limpio y declarativo"

**Rama:** `main` de este repo · **Estado: reparto cerrado, 16/16 microtareas del trabajo en `HECHO`.**
**Peldaño: `TESTED`** — los tres gates del reparto corrieron con salida pegada. **No `VERIFIED`:**
nadie ejecutó ninguno de los cinco encargos todavía.

- **Pedido:** [`docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md`](docs/requisitos/REFACTOR-FRONTEND-2026-09-21.md)
  (663 líneas, archivado desde `Downloads/`) · **Verificación:**
  [`docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md`](docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-21.md)
- **Corte:** `alovida/mantra-core-health` @ `origin/mockup` `5a0776c66b005ad4d2d6722321e933cd7adea621`
  — resultó ser **la punta actual**, el mismo SHA que el documento cita como "referencia histórica".
- **Repartido:** 5 carriles · 6 hitos cada uno · **317 microtareas**
  (Ender 61 · Pablo 63 · Justin 68 · Itzan 64 · Marcelo 61). Reservas de archivos **disjuntas: 0 choques**.
- **Gates:** `check_reparto.py` exit 0 · `check_skills_citadas.py` 107 skills citadas, 0 inexistentes.

### Lo que cambió el diseño del reparto

El documento pide "crear" doce familias de organismos: **casi todas ya existen** y varias con adopción
alta (`page-header` 171, `view-state-host` 69, `paginated-form` 52, `data-table` 29, `content-dialog` 26).
Así que el trabajo no es crear, es **adopción + separación smart/dumb + arreglar el catálogo**.

El hallazgo grande: **70 de las 81 tablas escritas a mano viven en `features/alovida/`**, cuyas 161
pantallas son **maqueta generada** por `scripts/port-vistas-alovida.mjs` — sólo 22 importan algo de
`shared/components`. Replican las clases CSS del sistema, y **los atributos (`app-page-header=""`)
no instancian nada**: esos componentes tienen selector de elemento, verificado uno por uno.

### Lo que quedó fuera, con motivo

- **Oleada 2:** 80 de 96 piezas del sistema de diseño, 11 tablas crudas, 6 diálogos crudos, y los
  contenedores de `agenda` (350 KB), `form-builder`, `accounting`, `admin/medical-laboratory`,
  `account/appointments`. Declarada con dueño propuesto en el daily de equipo §4.3.
- **`agenda/**` fuera del carril de Pablo** a propósito: ya lo trabajó el 2026-09-20 y además coordina.
- **Q-A `DECISION_REQUIRED`:** el generador de `alovida` declara "si se vuelve a correr, lo pisa" y no
  tiene exclusión. Afecta a 70 pantallas de dos carriles. Es la microtarea H1.S3 de Pablo.

### Nada tocado en `mantra-core-health`

Por diseño: este trabajo reparte. Todo el conocimiento del corte salió de `git grep`/`git show`/
`git ls-tree` sobre `origin/mockup`. El repo de frontend no tiene commits de este turno.

---

## 2026-09-20 — Pablo, reparto del turno noche 2026-09-20 · "Las 24 correcciones del doctor"

**Rama:** `main` de este repo · **Estado: reparto cerrado, 22/22 microtareas del trabajo en `HECHO`.**
**Las correcciones en sí están en `TODO`: 0 / 272 microtareas de ejecución** — el reparto está hecho,
el trabajo no. Confundir las dos cifras es el resumen optimista que la regla 40 prohíbe.

**Encargo:** repartir las 24 correcciones que el doctor pidió sobre la maqueta
(`https://mockup.173.249.39.237.sslip.io`) entre las cinco personas, con contexto sacado de todos los
repos de `alovida`, sin dejar ninguna corrección sin dueño.

### Qué se produjo

- **Fuente verbatim con procedencia** — [`CORRECCIONES-DOCTOR-2026-09-20.md`](docs/requisitos/CORRECCIONES-DOCTOR-2026-09-20.md):
  las 24 transcritas palabra por palabra con IDs `C-01`…`C-24`, ficha de procedencia (lo que **no**
  consta declarado como tal), 8 ambigüedades registradas, tabla de cobertura y tabla de reservas de
  archivos.
- **Verificación contra el código real** — [`VERIFICACION-CONTRA-CODIGO-2026-09-20.md`](docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-20.md):
  las 24 localizadas con archivo y línea sobre un corte declarado, más 10 hallazgos transversales.
  Peldaño `DISCOVERED`: **nada se ejecutó**.
- **Cinco encargos** en [`repartos/2026-09-20/PromptNoche/`](repartos/2026-09-20/PromptNoche/):
  Pablo (agenda, 55 microtareas) · Justin (receta, 54) · Itzan (perfil y sistema de diseño, 54) ·
  Ender (contratos, catálogos y panel, 55) · Marcelo (expediente y dictamen de las 24, 54).
  **30 hitos, 90 subtareas, 272 microtareas**, cada una con CA binario y DoD con comando.
- **Daily de equipo y los cinco personales**, con dependencias, reservas y ambigüedades.

### Los tres hechos que ordenaron el reparto

- **La maqueta que el doctor mira no tiene backend.** La rama `mockup` fija `mockBackend: true` en
  `src/environments/environment.ts` **sin leer el entorno del proceso a propósito**. Todo DoD de estas
  correcciones se demuestra contra los manejadores simulados de `src/app/core/mock/`, que quedaron
  con un solo dueño (Ender) para que nadie se pise.
- **El corte es `origin/mockup` (`68969782…`, PR #554), no el working copy.** El working copy está en
  otra rama y **tres de las cosas que el doctor describe no existen ahí**: `?vista=table`, la solapa
  «Calendario» y el botón «Mis horarios».
- **Dos correcciones pueden estar ya cumplidas** (C-18 y C-22). No se declararon hechas: los prompts
  mandan ejercitarlas y, si ya están, cerrarlas `DESCARTADO` **con la captura**.

### Dos correcciones que chocan con reglas de la casa, y cómo se resolvió

- **C-20 (posología por defecto)** choca con la regla 97.5.4. El vademécum del proyecto **declara su
  propia licencia**: «dato de desarrollo sin fuente autoritativa… no apto para uso clínico ni
  producción (ver B-13)», con 17 conceptos y **cero** propiedades de frecuencia. Se partió en
  **mecanismo** (Justin) y **catálogo con procedencia declarada** (Ender), siguiendo el precedente
  **B-13** que Marcelo cerró el 02/09. El kill-test del hito pregunta de dónde salió el valor.
- **C-12 («OTROS SERVICIOS»)** choca con una lista cerrada de 7 motivos validada con `@IsIn`. Se
  resolvió con `OTHER` + texto —el uso que el propio DTO documenta— y ampliar el enum quedó como
  decisión de negocio registrada.

### Cómo se verificó el reparto, en vez de afirmarlo

```text
python tools/check_reparto.py repartos/2026-09-20   -> exit 0
python tools/check_skills_citadas.py                -> exit 0, 101 skills citadas, 0 inexistentes
script de cobertura                                 -> 24/24 correcciones con dueño, 0 sin dueño
                                                       5/5 prompts con la sección 1 obligatoria
                                                       30 hitos / 90 subtareas / 272 microtareas
```

Reporte completo: [`docs/trabajo/2026-09-20-reparto-correcciones-doctor/REPORTE.md`](docs/trabajo/2026-09-20-reparto-correcciones-doctor/REPORTE.md).

### Nada tocado en los repos de producto

Por diseño: este trabajo reparte, no implementa. `mantra-core-health`,
`mantra-core-health-api` y `mantra-core-health-model` se **leyeron** para sacar contexto y se citan
con archivo y línea; **ninguno tiene commits de este trabajo**.

---

## 2026-09-20 — Ender, turno noche 2026-09-19 · "El contrato del piloto"

**Rama:** `ender/contrato-agenda-notice-port` · **Commits:** 16 · **Estado: cerrado, 50/50
microtareas en estado terminal** (48 `HECHO` + 2 `DESCARTADO`, cero en `TODO`/`BLOCKED`/`A
MEDIAS`/`EN CURSO`).

**Encargo:** [`ContratoValidadorYCompatibilidad.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md)
— fijar, validar y gobernar la evolución del contrato del puerto `AgendaNoticePort`
(`mantra-core-health-api`, módulo `scheduling`), sin tocar código de Mantra.

### Qué se avanzó

- **Contrato v1.0.0 congelado** — [`CONTRATO-AGENDA-NOTICE-PORT.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md):
  hash y commit del puerto real (`agenda-notice.port.ts`, corte `32ae9399…`), semántica de los 8
  campos reales de `AgendaNoticeResult` (el paquete de origen omitía 2), separación explícita de
  qué garantiza el tipo TypeScript vs. qué es sólo un comentario JSDoc, y varios hallazgos:
  `tenantId` opcional sin enforcement, errores sin taxonomía tipificada, orden de `emitMany` no
  garantizado por la firma.
- **Validador runtime independiente** — [`validador/`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/validador/):
  oráculo en TypeScript/Node (sin dependencias de Mantra) que hace cumplir en runtime la regla
  "exactamente uno" de `recipient` que el tipo no impone, más dos reglas más. 15/15 tests reales
  en verde (`tsc` estricto + `node --test`).
- **Gobernanza y compatibilidad** — [`GOBERNANZA-Y-COMPATIBILIDAD.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/GOBERNANZA-Y-COMPATIBILIDAD.md):
  política de compatibilidad en 3 dimensiones (lectura/escritura/significado), prueba adversa
  ADV-06 ejecutada dos veces en copias temporales descartables (falló exactamente donde debía:
  `tsc` exit 2), inmutabilidad del artefacto histórico verificada 4 veces por hash de blob.
- **Versión estable y cierre final** — [`VERSION-ESTABLE.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md),
  [`PRUEBA-ADVERSA-Y-CIERRE-H5.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/PRUEBA-ADVERSA-Y-CIERRE-H5.md),
  [`CIERRE-FINAL.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/CIERRE-FINAL.md): v1.0.0 promovida a
  estable y final, 5 decisiones de negocio pendientes con dueño y consecuencia, 5 riesgos
  residuales con impacto y consumidores expuestos.
- **Reporte completo** — [`REPORTE.md`](repartos/2026-09-19/PromptNoche/Ender/Noche-PilotoDeAvisos.Contrato/entregables/REPORTE.md).

### Dos hallazgos que salieron de una búsqueda incompleta, corregidos en la misma sesión

- La cita del metaprompt para la tensión Q-06 (durabilidad del aviso) parecía inexistente porque
  la búsqueda inicial sólo cubrió `Mantra Core Technologies/`. Ampliada a todo el disco, apareció
  en `~/Downloads/METAPROMPT_PARA_ASTRA.md` L96. Q-06 sigue `DECISION_REQUIRED` — tener las dos
  citas documenta la tensión, no la resuelve; eso sigue siendo decisión de negocio (Marcelo).
- `ARQUITECTURA_Y_CONTRATOS.md`, citado varias veces por el pack como plantilla de ficha de
  contrato, **no existe en ningún lugar accesible** (confirmado con búsqueda de disco completo).
  Afecta potencialmente a otras fichas del reparto (la de Itzan lo cita 4 veces). Queda como
  hallazgo transversal para quien mantenga el pack.

### Lo que quedó fuera, con motivo

- **Segunda capacidad (H3.S3):** cerrada `DESCARTADO` para este turno, no elegida. La ficha de
  Pablo (`Pablo/Noche-PilotoDeAvisos.Backend/`) sigue en `0/53`, sin ejecutar — no hay evidencia
  de ningún mecanismo del piloto probado en aislamiento sobre la cual elegir una segunda
  capacidad. Se reabre cuando esa evidencia exista.

### Nada tocado en `mantra-core-health-api`

Por diseño del carril: todo el trabajo es lectura del corte `32ae939983f0d665e4ed371362858801134d35cd`
(vía un worktree de sólo lectura, ya removido al cerrar) más documentación y laboratorio
independiente. `mantra-core-health-api` no tiene commits nuevos de este turno.
