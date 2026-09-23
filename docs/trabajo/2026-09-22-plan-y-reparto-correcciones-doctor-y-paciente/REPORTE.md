# Reporte — Plan maestro y reparto de las correcciones del doctor y del paciente, noche 2026-09-22

> **AVANCE: 25 / 25 — 100 %.** Las 25 microtareas de **este trabajo** (transcribir, verificar, planificar,
> repartir, medir) en `HECHO`. **Ojo con lo que ese número significa y con lo que no:** mide que el plan y el
> reparto están hechos, **no** que las 19 observaciones estén hechas. Las observaciones están en `TODO`:
> **0 / 319 microtareas de ejecución**. Confundir las dos cifras sería exactamente el resumen optimista que
> la regla 40 prohíbe.

- Fecha: 2026-09-22 · Plan: [PLAN.md](./PLAN.md) · Plan maestro: [PLAN-MAESTRO.md](./PLAN-MAESTRO.md) ·
  Rama: `main` de `AlovidaPromptManager` (sólo `.md`; no se tocó código de producto)
- Peldaño de evidencia alcanzado: **`TESTED`** para el reparto — los dos candados del repo y los dos scripts de
  medición corrieron en verde y su salida está pegada. **No es `VERIFIED`**: nadie ejecutó todavía ninguno de
  los cinco encargos.
- Peldaño de la **verificación contra el código**: **`DISCOVERED`**. Se leyeron archivos en tres cortes
  declarados (`origin/mockup` `b655e844…`, `origin/dev` del front `723ddb40…`, `origin/dev` de la API
  `7a604d4e…`). **No se ejecutó nada** en `mantra-core-health`: ni build, ni tests, ni la maqueta en un navegador.
- Repos de producto: **no se modificaron**. Se corrió `git fetch origin dev mockup` en el frontend y `git fetch
  origin dev` en la API a pedido de Pablo (sólo refs remotos; el working copy sigue en `feat/admin-portal-frontend`).

## Completado

| ID | Qué se logró (observable) | Comando de verificación | Resultado |
|---|---|---|---|
| H1.S1.M1 | Las 19 observaciones transcritas **verbatim** con IDs `D-01…D-10`, `R-01…R-03`, `P-01…P-03`, `N-01…N-03`; los dos bloques sin número del original declarados como tales | `grep -cE '^## (D\|R\|P\|N)-' docs/requisitos/CORRECCIONES-DOCTOR-Y-PACIENTE-2026-09-22.md` | PASS → **19** |
| H1.S1.M2 | Ficha de procedencia con lo que **no** consta declarado como tal | `grep -c '^## Ficha de procedencia'` | PASS → 1 |
| H1.S1.M3 | 20 ambigüedades del documento fuente (`Q-1…Q-20`) con supuesto y dueño | `grep -cE '^\| Q-[0-9]+ \|'` | PASS → **20** |
| H1.S2.M1 | Tres cortes declarados con SHA, fecha y asunto | `git log -1 --format='%H %ad %s' origin/mockup` (×3) | PASS · `evidencia/h1-documento-fuente-y-verificacion.txt` |
| H1.S2.M2 | Las 19 localizadas con archivo y línea | [`VERIFICACION-CONTRA-CODIGO-2026-09-22.md`](../../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-22.md) §2 | PASS — 19 de 19 con localizador |
| H1.S2.M3 | 17 choques y hallazgos transversales (`HALL-E1…E17`) con la regla que manda | mismo documento §4 | PASS |
| H1.S3.M1 | Las 19 asignadas a 5 personas; transversales con dueño del patrón y aplicadores | script de cobertura | PASS → **0 sin dueño** · `evidencia/cobertura.txt` |
| H1.S3.M2 | Reserva de archivos disjunta, cruzada con las del 21/09 | script de intersección | PASS → **0 choques**; 1 ruta cambia de dueño (declarada) · `evidencia/reserva-disjunta.txt` |
| H2.S1.M1 | Plan maestro con un hito por observación, dueño, CA y DoD | `grep -cE '^\| (D\|R\|P\|N)-[0-9]+' PLAN-MAESTRO.md` | PASS → 19 filas del mapa |
| H2.S1.M2 | Dependencias entre carriles: quién publica qué, cuándo, y qué hace el otro mientras tanto | §3 del plan maestro | PASS |
| H2.S1.M3 | Un kill-test por observación | `grep -c 'Kill-test' PLAN-MAESTRO.md` | PASS → 19 |
| H3.S1.M1–M5 | Los cinco prompts de tarea, con las tres capas de la regla 20 | `python tools/check_reparto.py repartos/2026-09-22` | PASS · `OK, 2026-09-22 cumple la estructura obligatoria` (exit 0) |
| H3.S2.M1 | Cinco dailies personales | `ls repartos/2026-09-22/PromptNoche/*/*-Daily-Noche-2026-09-22.md \| wc -l` | PASS → 5 |
| H3.S2.M2 | Daily de equipo con cobertura, dependencias, reservas, ambigüedades, hallazgos y tabla de cierre | `check_reparto.py` sin «FALTA el daily de equipo» | PASS |
| H4.S1.M1 | Candado de estructura | `python tools/check_reparto.py repartos/2026-09-22` | PASS → exit **0** · `evidencia/check-reparto.txt` |
| H4.S1.M2 | Candado de skills citadas | `python tools/check_skills_citadas.py` | PASS → exit **0**, **114** skills citadas, **0 inexistentes** · `evidencia/check-skills.txt` |
| H4.S1.M3 | Cobertura y capas medidas | script | PASS → 19/19; 5/5 con sección 1; **32 hitos · 64 subtareas · 319 microtareas** |
| H4.S1.M4 | Intersección de reservas | script | PASS → 0 choques |
| H4.S2.M1 | Este reporte | `head -3 REPORTE.md` | PASS |
| H4.S2.M2 | Entrada en `ActionLog.md`, arriba | `head -20 ActionLog.md` | PASS |
| H4.S2.M3 | Memoria con la guía de trabajo del doctor (D-04 y D-08) | línea en `MEMORY.md` | PASS |

**Conteo del reparto:** 5 carriles · 32 hitos · 64 subtareas · **319 microtareas** (Pablo 68 · Itzan 93 ·
Justin 51 · Ender 48 · Marcelo 59), todas con criterio de aceptación binario y DoD con comando.

## A medias

Ninguna. Las 25 microtareas del plan de este trabajo cerraron con su DoD ejecutado.

Lo que sí hay que decir, y no es «a medias» de este trabajo sino **su límite declarado**: los cinco encargos
**no fueron ejecutados por nadie todavía**. Que un prompt pase los dos candados demuestra que tiene las piezas
obligatorias; **no** demuestra que sea bueno ni que su DoD sea alcanzable en una noche. Eso lo dirá el turno.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| Las 319 microtareas de los cinco encargos | `TODO` | Que el turno arranque. Nada las bloquea: toda dependencia entre carriles tiene «qué hacer mientras tanto» (regla 65) |
| **Q-16** — precio con procedencia para servicios médicos (arancel en UMA sin conversión), imagenología y análisis | `DECISION_REQUIRED` | Negocio, con fuente. Mientras tanto: «precio no publicado», nunca un número inventado |
| **Q-M1** — el reconocedor de voz del navegador manda audio (síntomas = PHI) al proveedor del navegador | `DECISION_REQUIRED` | Negocio + Pablo. Mientras tanto: se declara en pantalla; ningún otro servicio |
| **Q-13** — cuál es «el panel de abajo» de la pantalla de inicio del paciente | `DECISION_REQUIRED` (doctor) | Marcelo eleva captura anotada; **no se borra sin respuesta** |
| Q-1, Q-3, Q-4, Q-5, Q-6, Q-9, Q-15 — supuestos de diseño tomados con dueño | `ABIERTA` | Doctor / Pablo; ninguna impide arrancar |
| Port de todo esto de `mockup` a `dev`, incluidos los endpoints que la API real no tiene (HALL-E3, E7) | `TODO`, fuera de alcance | Decisión de coordinación posterior al turno |
| Los **39 `iconOnly` sin dueño** y las **26 tablas** que no reciben la disciplina esta noche | `TODO`, declarado | Oleada siguiente; inventariados con dueño propuesto en Pablo H1.S2 y H5 |
| Los carriles del 21/09 de Itzan, Ender y Marcelo (0/N en sus dailies) | `A MEDIAS` (de aquellos trabajos) | Cada uno lo declara en su propio reporte; esta noche manda el pedido del cliente |

## Evidencia

```text
$ python tools/check_reparto.py repartos/2026-09-22
check_reparto: OK, 2026-09-22 cumple la estructura obligatoria
exit=0

$ python tools/check_skills_citadas.py
check_skills_citadas: OK, 114 skill(s) distinta(s) citada(s), 0 inexistentes (de 176 en disco)
exit=0

$ cobertura: cada ID citado en al menos un prompt de tarea
  D-01 -> Itzan            D-08 -> Itzan, Marcelo, Pablo     P-02 -> Marcelo
  D-02 -> Itzan            D-09 -> Itzan, Pablo              P-03 -> Marcelo
  D-03 -> Itzan            D-10 -> Itzan                     N-01 -> Ender
  D-04 -> Itzan, Pablo     R-01 -> Ender, Justin             N-02 -> Ender, Justin
  D-05 -> los cinco        R-02 -> Ender, Justin             N-03 -> Ender, Itzan
  D-06 -> Itzan, Pablo     R-03 -> Ender
  D-07 -> Itzan            P-01 -> Marcelo
observaciones sin dueno: 0

$ capas por prompt (hitos / subtareas / microtareas / CA / DoD / Estado) y seccion 1
  Ender    6 / 11 / 48 / 17 / 17 / 17   seccion 1: OK
  Itzan    8 / 18 / 93 / 26 / 26 / 26   seccion 1: OK
  Justin   6 / 10 / 51 / 16 / 16 / 16   seccion 1: OK
  Marcelo  6 / 12 / 59 / 18 / 18 / 18   seccion 1: OK
  Pablo    6 / 13 / 68 / 19 / 19 / 19   seccion 1: OK
TOTAL microtareas repartidas: 319

$ interseccion de reservas de esta noche
  excepcion declarada: Itzan my-profile/** **menos** work-history; Pablo my-profile/work-history/**
RESULTADO: 0 choque(s) entre 5 carriles de esta noche
$ cruce con las reservas del 2026-09-21
  Pablo reserva src/app/features/account/my-profile/work-history/**; el 21/09 era de Itzan
RESULTADO: 1 ruta(s) que cambian de dueno; declarada(s) en el documento fuente

$ git log -1 --format='%H %ad %s' origin/mockup            (alovida/mantra-core-health)
b655e8449abd662d6b24156fd6e2b06aeb120cc1 2026-09-22 18:04:42 -0400 Merge pull request #570 …
$ git log -1 --format='%H %ad %s' origin/dev               (alovida/mantra-core-health)
723ddb409968add40c947b3d2658a89bc1043b16 2026-09-22 18:04:30 -0400 Merge pull request #572 …
$ git log -1 --format='%H %ad %s' origin/dev               (alovida/mantra-core-health-api)
7a604d4edd7afecb4b82ce041a988fd46b762216 2026-09-22 01:47:55 -0400 Merge pull request #451 …

$ git grep -o 'iconOnly' origin/mockup -- 'src/app/**/*.html' | wc -l → 78   (33 archivos; eran 107/34 el 20/09)
$ git grep -l '<app-data-table' … → 30 · '<app-content-dialog' → 29 · '<app-pagination' → 3 · '<app-filter-bar' → 8
$ git grep -n -E "practitioners/me" origin/dev -- 'src/modules/profiles/controllers/*.ts'   (API)
  POST/DELETE credentials · PATCH me · PATCH specialties/:id/primary · affiliations
  → sin PATCH de credenciales ni PATCH/DELETE de especialidades o matrículas (HALL-E3)
```

Índice de `evidencia/`: [`h1-documento-fuente-y-verificacion.txt`](./evidencia/h1-documento-fuente-y-verificacion.txt) ·
[`check-reparto.txt`](./evidencia/check-reparto.txt) · [`check-skills.txt`](./evidencia/check-skills.txt) ·
[`cobertura.txt`](./evidencia/cobertura.txt) · [`reserva-disjunta.txt`](./evidencia/reserva-disjunta.txt).

## No cubierto

Lo que se hizo pero **no se probó**, y los caminos que no se ejercitaron:

1. **Los cinco encargos no se ejecutaron.** Nadie corrió una sola de las 319 microtareas. Los candados
   verifican que las piezas obligatorias están, **no** que el contenido sea bueno: el docstring de
   `check_reparto.py` lo dice.
2. **No se abrió la maqueta desplegada.** Todo lo que este trabajo dice sobre «lo que el doctor ve» es
   inferencia de `origin/mockup`, no observación de `https://mockup.173.249.39.237.sslip.io`. Ahí se cierran
   Q-4, Q-7, Q-13 y la mitad de D-08 («¿Guardar se habilita por cambios o por validez?»).
3. **No se ejecutó nada en los repos de producto**: ni `yarn typecheck`, ni `lint`, ni tests, ni el barrido.
   Los comandos que los prompts exigen salen del `README` del simulador y del `package.json`, leídos.
4. **No se midió R-02** (peticiones y tiempos del flujo de reserva) ni se contó cuántos de los profesionales
   del directorio tienen cupos: son las primeras microtareas de Justin y de Ender.
5. **No se contó cuántos de los 78 `iconOnly` son excepciones legítimas** del ADR-0012: se contaron apariciones.
6. **No se leyó `docs/progress/BLOCKERS.md`** del corte, que el cliente cita para el hueco de la API.
7. **El script de cruce con el 21/09 no detecta rutas escritas sin barra** en aquel daily (p. ej. `pagination`
   suelto de Justin): el cambio de dueño de `molecules/pagination` se declaró a mano en el documento fuente,
   no lo encontró el script.
8. **Los números de línea pueden haberse movido**: son del corte `b655e844…`, y `origin/mockup` se movió dos
   veces hoy. Cada prompt manda reconsultar y declarar el corte propio en su primera microtarea.
9. **No se verificó que el `git clone` del estándar funcione** desde otra máquina.

## Desvíos del plan

| Qué se ejecutó distinto | Por qué |
|---|---|
| El plan preveía «≥ 5 hitos y ≥ 40 microtareas» por prompt; Ender quedó en 48 y Justin en 51, Itzan en 93 | Se escribió lo que cada carril exige, no un número redondo. Itzan es el más largo porque nueve observaciones caen en su territorio; está dicho en su prompt que es más de una noche |
| Los encabezados de los cinco prompts se escribieron con conteos estimados y **se corrigieron con los medidos** (`grep -cE`) antes de cerrar: Itzan decía 19 subtareas y son 18; Ender decía 54 microtareas y son 48; Justin 56 → 51; Marcelo 58 → 59 | Un denominador falso hace que el `AVANCE: x / N` mienta. Precedente: el reparto del 21/09 tuvo el mismo desvío |
| D-09 se partió entre Itzan (formación) y Pablo (historial laboral como tabla) **después** de escribir la primera versión de la tabla de cobertura | Al armar el plan maestro apareció que el historial vive en `work-history`, que esta noche es de Pablo: dos personas en el mismo archivo era un defecto de reparto. Se corrigió la cobertura y la reserva en el documento fuente |
| `features/auth/register-*/**` se agregó explícitamente a la reserva de Itzan (la primera versión sólo reservaba dos bloques de `register-patient.html`) | D-01 toca el select de «Especialidad principal» en `register-practitioner` y D-06 toca las seis altas; sin la reserva completa, cuatro de ellas quedaban sin dueño |
| `work-history/**` pasa de Itzan (21/09) a Pablo (22/09) | «Dónde atiendo» es donde el doctor pide aplicar la disciplina de tabla, y Pablo es el dueño del patrón; dos personas sobre el mismo componente en la misma noche era peor. Está declarado en los dos prompts y en el daily |
| Se corrió `git fetch` en la API (`origin/dev` → `7a604d4e…`) además de en el frontend | El pedido nombraba sólo el frontend; la API se trajo para citar el contrato real de hoy (HALL-E3, E7) y no el de ayer. Sólo refs remotos |
| Ninguna búsqueda se delegó a un subagente ni se usó un workflow, aunque la sesión tenía «ultracode» activo | Regla 70.1.2 y 70.2.2: sin autorización del `CLAUDE.md` del proyecto el límite es 1 subagente en primer plano, y un workflow corre en background. La precisión que estos prompts necesitan (archivo y línea) se pierde en el resumen de un agente. Se hizo con búsquedas dirigidas sobre `origin/mockup` |

## Riesgos residuales

| Riesgo | Impacto | Qué lo contiene hoy |
|---|---|---|
| **`origin/mockup` se mueve y los localizadores envejecen** (ya se movió dos veces hoy) | Cinco personas buscando líneas corridas | Cada prompt manda reconsultar y declarar el corte propio en H1.S1.M1 |
| **Pablo y Marcelo son cuello de botella** (ADR-0015, paginador, barra; confirmación) | Itzan simula a ciegas | Marcados `BLOQUEANTE` con «publicá temprano»; Itzan tiene instrucción explícita de montar lo que existe y declarar (regla 65) |
| **Itzan tiene 93 microtareas y un carril del 21/09 abierto** | Cierres falsos para llegar | Su prompt fija el orden (H2 → H3 → H4 → H5) y dice que H6/H7 van al final; el daily de equipo declara que lo del 21/09 queda `A MEDIAS` |
| **D-08 tienta a romper el contrato por cursor de `DataTable`** (30 consumidores) | Regresión masiva | HALL-E4 y Q-5: paginación en cliente para listas locales; todo cambio del organismo es opt-in con muestra ajena |
| **N-02 tienta a inventar precios** | Dato falso en una pantalla llamada «Cotizaciones» (regla 97.4.1) | HALL-E11 y Q-16 en el prompt de Justin, con un DoD que `grep`ea precios literales → 0 |
| **P-02 manda síntomas (PHI) al proveedor del navegador** | Fuga de datos de salud no acordada (regla 90.2.4) | Q-M1 `DECISION_REQUIRED`; el prompt exige el aviso en pantalla y `console.*` → 0 |
| **P-03 tienta a borrar «el panel de abajo» sin confirmar cuál es** | Quitar lo que no era | Q-13: captura anotada primero; sin respuesta, `A MEDIAS`, no `HECHO` |
| **Un `confirm` sobre un `content-dialog` puede no apilar bien** | Foco perdido en cada «Guardar» de la casa | Marcelo H4.S1.M6 lo prueba en dos navegadores; Pablo e Itzan tienen instrucción de probarlo en su primer modal |
| **39 `iconOnly` y 26 tablas sin dueño esta noche** | El pedido decía «transversalmente» y «siempre» | Declarado con denominador (HALL-E16, plan maestro §7-8), no disimulado |

## Decisiones y ambigüedades

**Decisiones tomadas en este trabajo, con su motivo:**

1. **El corte del reparto es `origin/mockup`**, confirmado por Pablo en la sesión (Q-T1); `origin/dev` se
   trajo para citar contratos y declarar el gap (303 commits de `mockup` que `dev` no tiene).
2. **Plan maestro + reparto a las cinco personas**, confirmado por Pablo (Q-T2). El plan maestro no duplica
   microtareas: las referencia por `H*.S*` en cada prompt (regla 20 §6.2).
3. **Turno noche**, confirmado por Pablo (Q-T3); hora local al repartir: 18:14; al cerrar: 22:58.
4. **Las dos guías del doctor («a partir de ahora», «siempre») se convierten en ADR-0015** en el repo del
   frontend (Pablo H2) y en una memoria de trabajo de este repo, y esta noche se aplican donde el doctor lo
   pidió; el resto queda inventariado (Q-18).
5. **`core/mock/**` se reparte por archivo** (el 20/09 era entero de Ender) porque cada corrección necesita
   su manejador y Ender tiene su propio carril; la tabla de reservas lo fija.
6. **No se escribe API esta noche** (`isPrimary`, `practiceStatus`, `file_id` en especialidades, `PATCH` de
   credenciales): todo choque con el contrato real se declara como brecha y se cierra contra el doble.

**Ambigüedades que se arrastran:** las 20 `Q-1…Q-20` del documento fuente, más las de cada lote (`Q-P*`,
`Q-I*`, `Q-J*`, `Q-E*`, `Q-M*`). Las tres que son **decisión de negocio o del cliente** y bloquean cierre, no
arranque: **Q-16** (precios con procedencia), **Q-M1** (voz y PHI), **Q-13** (cuál bloque se retira).
**Ninguna se resolvió por conveniencia, y ninguna impide arrancar.**
