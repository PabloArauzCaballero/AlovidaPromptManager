# Reporte — Cerrar lo que dejé pendiente: verificar contra el código real

- Fecha: 2026-09-19 · Plan: [PLAN.md](./PLAN.md) · Rama: `main`
- Peldaño de evidencia alcanzado: **`TESTED`** para los verificadores (self-tests y kill-tests
  ejecutados) · **`DISCOVERED`** para la verificación contra Mantra: localicé y leí las piezas
  reales, **no ejecuté nada del backend**. El peldaño del trabajo es el más bajo: `DISCOVERED`.
- Avance: **16 / 16 microtareas HECHO (100 %)** — calculado con `plan_status.py`.

## Por qué existió este trabajo

El usuario dijo que dejo cosas pendientes. Revisé la lista de «No cubierto» del trabajo anterior y
**tres ítems eran míos y estaban a mi alcance**. Declararlos «no cubiertos» era usar la sección de
honestidad como excusa para no hacerlos.

## Completado

### H1 — Las afirmaciones de los prompts, contrastadas contra el código real

| ID | Qué se logró | Resultado |
|---|---|---|
| H1.S1.M1 | Relación entre el corte del paquete y `dev` | `32ae939…` **es ancestro** de `dev`, **2 commits** de diferencia. `dev` = `5d5007f…` |
| H1.S1.M2 | Las 5 rutas citadas | **las 5 EXISTEN** |
| H1.S1.M3 | Símbolos del puerto | `AgendaNoticePort`, `emit`, `emitMany`, `AGENDA_NOTICE_PORT` (un **`Symbol`**): existen. **El resultado tiene 8 campos, no 6** |
| H1.S1.M4 | `recipient` y `debounceKey` | La regla «uno de los dos, no los dos» **es un comentario, no un tipo** — confirmado. `debounceKey` no define ventana ni TTL |
| H1.S1.M5 | Los servicios y el adaptador | `SchedulingDelayService` (línea 76), `SchedulingAgendaNoticesService` (36), `MessagingAgendaNoticeAdapter` (117, `implements AgendaNoticePort`), y un cuarto no previsto: `SupportAdminNoticeAdapter` (43) |
| H1.S1.M6 | Composición de scheduling | 8 módulos; binding en **línea 142** con **`useExisting`**, no `useClass` |
| H1.S1.M7 | ORM | Globs globales (57-61), `TsMorphMetadataProvider` (68), caché (78-81) y `HistoryMirrorSubscriber` (129): **los cuatro** |
| H1.S1.M8 | Puerto de transacción | `TransactionManager`, `execute<T>`, `TransactionOptions` y `TRANSACTION_MANAGER`. **`TransactionContext` no vive ahí**: se importa de `./persistence-context` |
| H1.S1.M9 | Comandos reales | **112 scripts**. `typecheck`, `build`, `lint`, `test`, `test:integration`, `test:e2e`, `smoke`, `infra:up` |
| H1.S2.M1 | Corrección en los prompts | Bloque «Hechos ya verificados» en los **30**; lista de campos corregida de 6 a 8 en el de Ender |
| H1.S2.M2 | El corte vigente registrado | En los 30 prompts |

Detalle completo con localizadores:
[`docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md`](../../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md).

**Tres hallazgos que cambian el trabajo del equipo:**

1. **El paquete estaba incompleto en el contrato.** `PILOTO_MANTRA.md` lista 6 campos del
   resultado; el archivo real tiene **8**: faltaban `skippedReason` y `chatSkippedReason`. Un doble
   construido contra la tabla del paquete habría devuelto resultados incompletos **y el validador
   de Ender los habría aceptado**.
2. **`emit` nunca lanza.** Literal: *«No lanza: los fallos vuelven como
   `{ delivered: false, skippedReason }`»*. El harness de Justin **no puede** convertir una llamada
   no registrada en `{delivered:false}`: sería indistinguible de un fallo legítimo del puerto real.
3. **El registro funcional original está numerado.** El comentario del puerto cita *«el registro del
   cliente pide (3.4, 3.5, 4.2 y 4.3)»* y *«TAREA-15, punto 1 y 3 del pedido»*. El documento que
   transcribí **no tiene numeración**, lo que **debilita** mi hipótesis anterior de que fueran el
   mismo artefacto. `Q-04` sigue abierta, pero Marcelo ya no busca «un documento»: busca uno con
   secciones 3.x y 4.x y un pedido llamado «TAREA-15».

### H2 — El verificador mira contenido, no solo forma

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H2.S1.M1 | Exige tabla de microtareas, kill-test, alcance OUT, ambigüedades y DoD del hito | `--self-test` | **23 PASS, 0 FAIL** |
| H2.S1.M2 | **Kill-test sobre un prompt real** | quité el kill-test al lote de Justin del Día 4 | **exit 1**: *«le FALTA el kill-test»* |
| H2.S1.M3 | Los 30 prompts pasan los chequeos nuevos | `check_reparto.py` × 6 fechas | **exit 0** |

### H3 — La primera corrida del CI no es una moneda al aire

| ID | Qué se logró | Resultado |
|---|---|---|
| H3.S1.M1 | Auditoría de portabilidad en 5 frentes | **0 riesgos altos.** 0 `open()` sin encoding, 0 separadores de Windows, 0 rutas absolutas, 0 dependencias de terceros (todo stdlib), nombres de carpeta consistentes |
| H3.S1.M2 | Corrección del único riesgo medio | El paso del reparto ahora expande el glob explícitamente y falla con `::error::` si no hay fechas |

## A medias

### El workflow sigue sin haber corrido en GitHub Actions

- **Qué anda:** los 9 comandos pasan en local con exit 0, el YAML parsea (11 pasos), ningún step usa
  `continue-on-error`, y la auditoría de portabilidad no encontró riesgos altos. Simulé además la
  expansión del glob tal como la hará CI: 6 fechas, exit 0.
- **Qué no anda:** nada falla. **Falta la prueba**, y sigue faltando por la misma razón de siempre:
  el push está bloqueado.
- **Qué falta exactamente:** (1) `git push origin main`; (2) mirar la primera corrida; (3) provocar
  deriva en un PR y confirmar que **falla**; (4) marcarlo como check requerido.
- **Dónde quedó:** `.github/workflows/estandar.yml` en `main` local, endurecido.

## Pendiente

| ID | Estado | Qué lo destraba |
|---|---|---|
| Push a GitHub | **`BLOQUEADO`** | El clasificador del modo automático de la sesión rechaza `git push` (`Out-of-Place Publication`). **Lo destraba un comando tuyo:** `! git push origin main` |
| Ejecutar las 262 microtareas | `TODO` | Es el trabajo del equipo |
| Revisión humana del contenido de los 30 prompts | `TODO` | Nadie del equipo los leyó. Un script no puede juzgar si un encargo está bien escrito |
| Verificar el **comportamiento** (no solo la existencia) | `TODO` | Exige ejecutar `typecheck`, `test`, `test:integration` contra Mantra, con PostgreSQL. Está fuera del alcance declarado de este trabajo |

## Evidencia

```text
$ python .claude/hooks/plan_status.py --path .../PLAN.md
  Avance: 16/16 microtareas HECHO  (100.0%)

$ git merge-base --is-ancestor 32ae939... origin/dev ; echo $?
0
$ git rev-list --count 32ae939...origin/dev
2

$ clases reales, leidas con git cat-file -p
  scheduling-delay.service.ts            76:export class SchedulingDelayService {
  scheduling-agenda-notices.service.ts   36:export class SchedulingAgendaNoticesService {
  messaging-agenda-notice.adapter.ts    117:export class MessagingAgendaNoticeAdapter implements AgendaNoticePort {
  support-admin-notice.adapter.ts        43:export class SupportAdminNoticeAdapter {

$ scheduling.module.ts
  142:    { provide: AGENDA_NOTICE_PORT, useExisting: MessagingAgendaNoticeAdapter },

$ orm.config.ts
  3,68:  TsMorphMetadataProvider        57-61: globs globales
  78-81: metadataCache                 129:   subscribers: [new HistoryMirrorSubscriber()]

$ KILL-TEST del chequeo de contenido, sobre un prompt real
check_reparto: ESTRUCTURA INCOMPLETA en 2026-09-22
  - .../ProbarIdempotenciaYConcurrencia.md: le FALTA el kill-test
exit=1

$ auditoria de portabilidad
  open()/read_text()/write_text() sin encoding declarado ... 0
  separadores de ruta de Windows codificados .............. 0
  rutas absolutas o letras de unidad ...................... 0
  dependencias de terceros ................................ 0 (todo stdlib)

$ simulacion de la expansion del glob, tal como la hara CI
  fechas encontradas: 6
  exit=0

$ todos los candados
sync_agents --check        OK, 192 archivos, sin deriva        exit=0
sync_agents                12 PASS, 0 FAIL                     exit=0
plan_gate                  11 PASS, 0 FAIL                     exit=0
report_gate                14 PASS, 0 FAIL                     exit=0
plan_status                30 PASS, 0 FAIL                     exit=0
check_reparto              23 PASS, 0 FAIL                     exit=0
check_skills_citadas        7 PASS, 0 FAIL                     exit=0
check_skills_citadas       73 citadas, 0 inexistentes          exit=0
check_reparto × 6 fechas   OK                                  exit=0
```

Índice de `evidencia/`: [`h2-contenido-minimo.txt`](./evidencia/h2-contenido-minimo.txt) ·
[`h3-portabilidad.txt`](./evidencia/h3-portabilidad.txt) · [`h3-cierre.txt`](./evidencia/h3-cierre.txt).
El artefacto principal es
[`docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md`](../../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md).

## No cubierto

- **El comportamiento.** No corrí build, tests ni arranque de Mantra. Todo lo verificado es lectura
  estática. **Que un símbolo exista no prueba que haga lo que su comentario promete.**
- **Los 2 commits de diferencia hasta `dev`** no se revisaron: no sé si tocan el piloto.
- **Los `.spec.ts` no se leyeron**, solo se constató que existen.
- **`SupportAdminNoticeAdapter` no se leyó**, solo se localizó.
- **Solo se verificó el piloto de avisos de agenda.** Los módulos de farmacia, laboratorio,
  aseguradora y el resto del documento del cliente **no se contrastaron contra código**.
- **El chequeo de contenido no juzga calidad.** Un prompt con las cinco piezas presentes y mal
  escritas pasa igual. Eso lo revisa una persona.
- **La auditoría de portabilidad es estática.** Reduce el riesgo de la primera corrida; no lo elimina.

## Desvíos del plan

- **El CA de `H1.S1.M3` decía «los 6 campos del resultado».** La comprobación encontró **8**. No es
  un desvío de ejecución: es el hallazgo que la microtarea existía para producir. El número del
  plan venía del paquete, que es justamente lo que se estaba contrastando.
- **Tuve que rehacer `H1.S1.M5`.** La primera vez verifiqué **nombres de archivo** y deduje los
  nombres de clase **por convención de NestJS**. Eso es inferir, no verificar. Lo detecté porque un
  `git grep` en background devolvió `NOT_FOUND` y contradijo mi resultado. Repetí la comprobación
  con `git cat-file` y obtuve los nombres de clase con su línea.

## Riesgos residuales

| Riesgo | Impacto | Estado |
|---|---|---|
| El equipo usa `git grep` sobre un clon parcial y obtiene falsos negativos | Medio | **Mitigado**: documentado en la verificación y en los 30 prompts, con el comando que sí funciona |
| El corte se mueva otra vez antes de que el equipo arranque | Medio | Mitigado: los prompts dicen reconsultar y declarar el SHA usado |
| Alguien lea el bloque «Hechos verificados» como si cubriera comportamiento | **Alto** | Mitigado con un aviso explícito dentro del propio bloque, en los 30 |
| El workflow falle igual en Linux por algo que la auditoría no ve | Bajo | Aceptado; la auditoría baja el riesgo, no lo elimina |

## Decisiones y ambigüedades

- **`Q-V1` — No cambié el corte.** El `HEAD` de `dev` está 2 commits adelante. Verifiqué contra el
  SHA del paquete, que es el que citan los prompts, y registré la diferencia. **Cuál es el corte de
  trabajo lo fija Pablo**, es su microtarea.
- **`Q-V2` — Verifiqué existencia y texto, no comportamiento.** Declarado en la cabecera del
  documento, en el bloque de los 30 prompts y acá.
- **Debilité mi propia hipótesis anterior.** En el trabajo previo registré `Q-R3`: que el documento
  del cliente podía ser el registro original. La numeración citada desde el código dice que
  probablemente **no**. Lo registré en contra de mi conclusión anterior.
- **No escribí una sola línea en `mantra-core-health-api`.** El clon fue de solo lectura, en el
  scratchpad, y **quedó eliminado** al cerrar.
- **Sin datos de personas en ninguna salida pegada.**
