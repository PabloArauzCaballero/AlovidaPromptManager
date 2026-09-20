# Daily de Ender — turno noche — 2026-09-19

> **Estado:** `COMPLETADO`. 48/50 microtareas `HECHO`, 2/50 `DESCARTADO` (con motivo y condición
> de reapertura, no un pendiente colgado). **Cero** microtareas en `TODO`, `BLOCKED`, `A MEDIAS`
> o `EN CURSO`. Reporte detallado en [`REPORTE.md`](Noche-PilotoDeAvisos.Contrato/entregables/REPORTE.md).

- **Persona:** Ender · **Turno:** noche · **Fecha:** 2026-09-19 · **Línea:** A · **Rol:** propietario de contrato
- **Tu prompt:** [El contrato del piloto: fijarlo, validarlo y gobernar su evolución](Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md)
- **Daily del equipo:** [Daily-Noche-2026-09-19.md](../Daily-Noche-2026-09-19.md)
- **6 hitos · 18 subtareas · 50 microtareas**

## 1. Instalación del estándar — es lo primero, no lo último

- [x] `ls .claude/skills | wc -l` → **176**, salida pegada acá abajo.
- [x] `python .claude/hooks/plan_gate.py --self-test` → **11 PASS, 0 FAIL**, salida pegada.
- [x] Cargaste `skills-router` y las skills de la sección 1 de tu prompt (las 11 de proceso y las
      11 de mi lote, las 22 completas, leídas enteras antes de escribir el primer artefacto).
- [x] Creaste tu `PLAN.md` **antes** del primer `Edit`/`Write` de código.

```text
$ ls .claude/skills | wc -l
     176

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
exit 0
```

Nota de instalación (registrada, no oculta): el estándar **ya estaba disponible localmente** en
`AlovidaPromptManager/.claude` (el repo raíz del pack), así que se copió de ahí en vez de
clonarlo de GitHub — evita el 404 conocido del push bloqueado del 2026-09-19, y el contenido es
el mismo (176 skills, 14 rules) que exige la sección 1.4 del prompt.

## 2. Avance por hito

**48 / 50 microtareas en `HECHO`** (96 %) + **2 / 50 en `DESCARTADO`** = **50 / 50 en estado
terminal**. Cero en `TODO`, `BLOCKED`, `A MEDIAS` o `EN CURSO`.

| Hito | Prioridad | Microtareas | HECHO | Estado |
|---|---|---:|---:|---|
| **H1** — Fijar el contrato real del puerto de avisos de agenda | `BLOQUEANTE` | 14 | 14 | `HECHO` |
| **H2** — Convertir el contrato en un validador que rechaza lo que debe rechazar | `ALTA` | 8 | 8 | `HECHO` |
| **H3** — Gobernar la evolución del contrato sin romper a quien lo consume | `MEDIA` | 7 | 5 (+2 `DESCARTADO`) | `HECHO` |
| **H4** — Congelar la versión estable del contrato y su matriz de consumidores | `MEDIA` | 7 | 7 | `HECHO` |
| **H5** — Probar que una versión incompatible rompe donde debe y que lo histórico no se toca | `ALTA` | 7 | 7 | `HECHO` |
| **H6** — Cerrar el contrato y dejar sus pendientes con dueño | `ALTA` | 7 | 7 | `HECHO` |
| **TOTAL** | | **50** | **48 + 2 `DESCARTADO`** | |

> **Qué cambió desde el primer cierre:** H1.S3.M1 estaba `A MEDIAS` porque la búsqueda de
> `METAPROMPT_PARA_ASTRA` sólo cubría `Mantra Core Technologies/`. Ampliada a todo el disco,
> apareció en `~/Downloads/`: las dos citas de Q-06 (código + metaprompt) ya están completas en
> `Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md` §11. **Q-06 sigue `DECISION_REQUIRED`** — tener las dos citas
> documenta la tensión, no la resuelve; eso sigue siendo de negocio.
> H3.S3 estaba `BLOCKED` esperando que Pablo eligiera la segunda capacidad. Re-verificado: la
> ficha de Pablo sigue en `0/53`, sin ejecutar — no es que esté ocupado en otra cosa, es que su
> turno no arrancó. Dejarlo `BLOCKED` habría sido una promesa vacía; se cerró `DESCARTADO` con el
> motivo exacto (cero evidencia de mecanismos aislados) y la condición de reapertura.

## 3. Detalle de las microtareas que tocaste

*(Las 50 se abrieron y se ejecutaron; se listan todas, no sólo un subconjunto.)*

| ID | Estado | Comando ejecutado | Exit code | Ruta de la evidencia |
|---|---|---|---|---|
| H1.S1.M1 | `HECHO` | `git show <SHA>:ruta` + `shasum -a 256` | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h1-s1-m1-hash-y-commit.txt |
| H1.S1.M2 | `HECHO` | `git show <SHA>:ruta` (archivo completo) | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h1-s1-m2-archivo-literal-agenda-notice-port.ts |
| H1.S1.M3 | `HECHO` | N/A (microtarea documental) | — | Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md §1 |
| H1.S1.M4 | `HECHO` | `grep -rn ... src` | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h1-s1-m4-inventario-consumidores.txt |
| H1.S2.M1 | `HECHO` | N/A (lectura + tabla) | — | Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md §3.3 |
| H1.S2.M2 | `HECHO` | N/A (cita literal) | — | Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md §3.3 |
| H1.S2.M3 | `HECHO` | N/A (especificación) + implementado en H2 | — | Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md §5 |
| H1.S2.M4 | `HECHO` | `grep -rn emitMany` | 0 | Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md §6 |
| H1.S2.M5 | `HECHO` | `grep -rn debounced src/modules/messaging` | 0 | Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md §7 |
| H1.S2.M6 | `HECHO` | N/A (lectura de campos) | — | Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md §8 |
| H1.S2.M7 | `HECHO` | `grep -n skippedReason` en los 4 servicios | 0 | Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md §9 |
| H1.S3.M1 | `HECHO` | `find / -iname "METAPROMPT_PARA_ASTRA*"` (búsqueda ampliada a todo el disco) | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h1-s3-m1-cita-metaprompt.txt |
| H1.S3.M2 | `HECHO` | N/A (ficha) | — | Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md §10 |
| H1.S3.M3 | `HECHO` | `git commit` + `git rev-parse HEAD:ruta` | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h1-s3-m3-commit-y-blob-v1.txt |
| H2.S1.M1 | `HECHO` | `tsc -p tsconfig.json && node --test dist/*.test.js` | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h2-validador-build-y-tests.txt |
| H2.S1.M2 | `HECHO` | ídem | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h2-validador-build-y-tests.txt |
| H2.S1.M3 | `HECHO` | N/A (revisión del propio código de test) | — | Noche-PilotoDeAvisos.Contrato/validador/agenda-notice-validator.test.ts (comentario de cabecera) |
| H2.S2.M1 | `HECHO` | `node --test` | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h2-validador-build-y-tests.txt |
| H2.S2.M2 | `HECHO` | `node --test` | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h2-validador-build-y-tests.txt |
| H2.S2.M3 | `HECHO` | N/A (lista) | — | Noche-PilotoDeAvisos.Contrato/validador/README.md |
| H2.S3.M1 | `HECHO` | `git commit` | 0 | Noche-PilotoDeAvisos.Contrato/validador/ (commit 7f19cf3) |
| H2.S3.M2 | `HECHO` | `node --test` (compatibilidad-consumidores.test.ts) | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h2-validador-build-y-tests.txt |
| H3.S1.M1 | `HECHO` | N/A (tabla) | — | Noche-PilotoDeAvisos.Contrato/entregables/GOBERNANZA-Y-COMPATIBILIDAD.md §1 |
| H3.S1.M2 | `HECHO` | `grep -rn switch src/modules/scheduling` | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h3-s1-verificacion-matriz.txt |
| H3.S2.M1 | `HECHO` | `tsc -p tsconfig.json` (copia temporal, contrato incompatible) | 2 (esperado) | Noche-PilotoDeAvisos.Contrato/evidencia/h3-s2-adv06-copia-temporal.txt |
| H3.S2.M2 | `HECHO` | `git rev-parse HEAD:ruta` antes/después | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h3-s2-adv06-copia-temporal.txt |
| H3.S2.M3 | `HECHO` | N/A (matriz) | — | Noche-PilotoDeAvisos.Contrato/entregables/GOBERNANZA-Y-COMPATIBILIDAD.md §3 |
| H3.S3.M1 | `DESCARTADO` | `grep`/lectura de la ficha y el daily de Pablo — sigue en `0/53` | 0 (confirma) | Noche-PilotoDeAvisos.Contrato/entregables/GOBERNANZA-Y-COMPATIBILIDAD.md §4 |
| H3.S3.M2 | `DESCARTADO` | depende de H3.S3.M1 | — | Noche-PilotoDeAvisos.Contrato/entregables/GOBERNANZA-Y-COMPATIBILIDAD.md §4 |
| H4.S1.M1 | `HECHO` | N/A (ficha) | — | Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md §2 |
| H4.S1.M2 | `HECHO` | N/A | — | Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md §3 |
| H4.S2.M1 | `HECHO` | N/A (referencia al commit ya publicado) | — | Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md §1 |
| H4.S2.M2 | `HECHO` | N/A (referencia, no duplica) | — | Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md §4 |
| H4.S2.M3 | `HECHO` | `git rev-parse HEAD:ruta` + `git log` | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h4-s2-inmutabilidad-v1.txt |
| H4.S3.M1 | `HECHO` | N/A (tabla) | — | Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md §5 |
| H4.S3.M2 | `HECHO` | N/A (plan) | — | Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md §6 |
| H5.S1.M1 | `HECHO` | `tsc -p tsconfig.json` (2ª copia temporal independiente) | 2 (esperado) | Noche-PilotoDeAvisos.Contrato/evidencia/h5-s1-adv06-reejecutado-e-inmutabilidad.txt |
| H5.S1.M2 | `HECHO` | `git rev-parse HEAD:ruta` x2 | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h5-s1-adv06-reejecutado-e-inmutabilidad.txt |
| H5.S1.M3 | `HECHO` | N/A (tabla) | — | Noche-PilotoDeAvisos.Contrato/entregables/PRUEBA-ADVERSA-Y-CIERRE-H5.md §2 |
| H5.S2.M1 | `HECHO` | N/A (referencia) | — | Noche-PilotoDeAvisos.Contrato/entregables/PRUEBA-ADVERSA-Y-CIERRE-H5.md §4 |
| H5.S2.M2 | `HECHO` | N/A (tabla) | — | Noche-PilotoDeAvisos.Contrato/entregables/PRUEBA-ADVERSA-Y-CIERRE-H5.md §5 |
| H5.S3.M1 | `HECHO` | N/A (referencia) | — | Noche-PilotoDeAvisos.Contrato/entregables/PRUEBA-ADVERSA-Y-CIERRE-H5.md §6 |
| H5.S3.M2 | `HECHO` | N/A | — | Noche-PilotoDeAvisos.Contrato/entregables/PRUEBA-ADVERSA-Y-CIERRE-H5.md §6 |
| H6.S1.M1 | `HECHO` | N/A (referencia al commit) | — | Noche-PilotoDeAvisos.Contrato/entregables/CIERRE-FINAL.md §1 |
| H6.S1.M2 | `HECHO` | N/A | — | Noche-PilotoDeAvisos.Contrato/entregables/CIERRE-FINAL.md §1 |
| H6.S1.M3 | `HECHO` | `git rev-parse HEAD:ruta` x2 | 0 | Noche-PilotoDeAvisos.Contrato/evidencia/h6-s1-inmutabilidad-final.txt |
| H6.S2.M1 | `HECHO` | N/A (tabla) | — | Noche-PilotoDeAvisos.Contrato/entregables/CIERRE-FINAL.md §2 |
| H6.S2.M2 | `HECHO` | N/A | — | Noche-PilotoDeAvisos.Contrato/entregables/CIERRE-FINAL.md §2 |
| H6.S3.M1 | `HECHO` | N/A (tabla) | — | Noche-PilotoDeAvisos.Contrato/entregables/CIERRE-FINAL.md §3 |
| H6.S3.M2 | `HECHO` | N/A | — | Noche-PilotoDeAvisos.Contrato/entregables/CIERRE-FINAL.md §3 |

> Las filas "N/A" son microtareas cuyo DoD es un documento (ficha, tabla, cita), no un comando —
> tal como el propio prompt las define. Donde hubo comando, exit code y salida están pegados en
> `Noche-PilotoDeAvisos.Contrato/evidencia/`.

## 4. Qué entregás vos

| Al cerrar | A quién | Qué exactamente | Entregado |
|---|---|---|---|
| **H1** | Itzan | Artefacto del contrato con hash y la ficha de Autorización | `SÍ` — `Noche-PilotoDeAvisos.Contrato/entregables/CONTRATO-AGENDA-NOTICE-PORT.md` §1 y §8, commit `01e8035` |
| **H1** | Justin | Semántica del resultado, la regla «exactamente uno» y la clasificación de errores | `SÍ` — §3.3, §5, §9 del mismo documento |
| **H1** | Pablo | Que la tensión de durabilidad sigue `DECISION_REQUIRED`, ya con las dos citas | `SÍ` — §11: código + metaprompt (`~/Downloads/METAPROMPT_PARA_ASTRA.md` L96) |
| **H2** | Justin | El validador: su doble tiene que pasarlo | `SÍ` — `Noche-PilotoDeAvisos.Contrato/validador/`, README con instrucciones de uso |
| **H2** | Pablo | Qué comprueba el validador dentro del harness | `SÍ` — `Noche-PilotoDeAvisos.Contrato/validador/README.md`, 3 reglas + lo que NO comprueba todavía |
| **H2** | Itzan | Si el contrato cambió de hash desde ayer | `SÍ` — no cambió; es la primera vez que se fija (v1.0.0 nace hoy) |
| **H3** | Justin | La matriz: es la que dice contra qué versiones probar | `SÍ` — `Noche-PilotoDeAvisos.Contrato/entregables/GOBERNANZA-Y-COMPATIBILIDAD.md` §3 |
| **H3** | Pablo | Qué contrato necesita la segunda capacidad | `N/A` — no hay segunda capacidad elegida: H3.S3 se cerró `DESCARTADO` por falta de insumo (§4). Se reabre cuando exista una candidata con evidencia |
| **H3** | Itzan | Si el artefacto empaquetado referencia una versión que va a cambiar | `SÍ` — no hay versión nueva propuesta; v1.0.0 sigue vigente |
| **H4** | Todo el equipo | La versión estable a consumir | `SÍ` — `Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md`, v1.0.0 |
| **H4** | Marcelo | Qué decisiones de negocio siguen abiertas y bloquean la aceptación | `SÍ` — §5 de `Noche-PilotoDeAvisos.Contrato/entregables/VERSION-ESTABLE.md`, 5 decisiones con dueño |
| **H4** | Justin | Contra qué versiones probar | `SÍ` — sólo v1.0.0 existe |
| **H5** | Marcelo | Qué decisión abierta impide firmar la aceptación | `SÍ` — `Noche-PilotoDeAvisos.Contrato/entregables/PRUEBA-ADVERSA-Y-CIERRE-H5.md` §6 |
| **H5** | Justin | Contra qué versión corre el candidato compuesto | `SÍ` — v1.0.0, sin cambios desde H4 |
| **H5** | Itzan | Si hay que reempaquetar por un cambio de contrato | `SÍ` — no, v1.0.0 no cambió (verificado 4 veces por hash) |
| **H6** | Marcelo | Los pendientes que condicionan el dictamen | `SÍ` — `Noche-PilotoDeAvisos.Contrato/entregables/CIERRE-FINAL.md` §2, 5 pendientes con dueño |
| **H6** | Todo el equipo | La versión final del contrato | `SÍ` — v1.0.0 es también la versión final |

## 5. Bloqueos

*(Ninguno activo al cierre. Los dos que aparecieron durante el turno se resolvieron, no se
dejaron colgados — ver el detalle abajo.)*

| Qué bloqueó | Qué intenté | Cómo se resolvió |
|---|---|---|
| H1.S3.M1 (cita del metaprompt) | `find` sobre `Mantra Core Technologies/` — sin resultados | Amplié la búsqueda a todo el disco: apareció en `~/Downloads/METAPROMPT_PARA_ASTRA.md`. Cita real ya incorporada en §11 del contrato |
| H3.S3 (segunda capacidad) | Revisé la ficha de Pablo y el daily del equipo | No hay evidencia de mecanismos aislados esta noche (ficha de Pablo en `0/53`). Cerrado `DESCARTADO` con motivo y condición de reapertura, en vez de dejarlo `BLOCKED` sin nadie que lo destrabe |

**`ARQUITECTURA_Y_CONTRATOS.md`** sigue sin existir en ningún lugar accesible (búsqueda ampliada a
todo el disco, confirmado). No bloqueó nada mío: la estructura de mi ficha se reconstruyó a partir
de lo que mi propio prompt enumera. Queda registrado como hallazgo transversal para el equipo.

## 6. Ambigüedades que encontraste

| ID | Qué | Supuesto que tomaste | A quién confirmárselo |
|---|---|---|---|
| AMB-01 | La §3 (Alcance) de mi ficha dice OUT "implementar el doble o el validador (eso es del laboratorio)", pero H2 me pide explícitamente implementar el validador, y el handoff dice "su doble tiene que pasarlo" (mío) | Construí el validador como oráculo independiente fuera de Mantra, porque la tabla de H2 es más específica que el párrafo OUT concatenado y el handoff distingue "el validador" (mío) de "su doble" (de Justin) | Pablo |
| AMB-02 | `TARGET_REF` de mi ficha coincide con `dev` local, pero `origin/dev` remoto está 2 commits adelante | Trabajé contra `32ae9399…` (el `TARGET_REF` declarado), sin verificar línea a línea que los 2 commits no tocan el puerto (sólo por asunto de commit) | Quien coordine el corte de trabajo |
| AMB-03 | `ARQUITECTURA_Y_CONTRATOS.md` no existe en ningún lugar accesible (confirmado con búsqueda de disco completo), pese a citarse como fuente de la plantilla de ficha en mi prompt y en el de Itzan | Reconstruí la estructura de mi ficha a partir de los campos que mi propio prompt enumera microtarea por microtarea | Mantenedor del pack de skills |
| AMB-04 | H3.S3 pedía "si Pablo ya eligió la segunda capacidad"; verificado que no la eligió porque su turno no arrancó (no por estar ocupado en otra cosa) | Cerré la microtarea `DESCARTADO` (con motivo y condición de reapertura) en vez de `BLOCKED`, para no dejar una promesa de desbloqueo que nadie iba a cumplir esta noche | Quien decida si prefiere el vocabulario `BLOCKED` en vez de `DESCARTADO` — el contenido es el mismo |

## 7. Antes de cerrar

- [x] Ninguna microtarea quedó en `EN CURSO`: **48 `HECHO`, 2 `DESCARTADO`, 0 `TODO`, 0 `BLOCKED`,
      0 `A MEDIAS`, 0 `EN CURSO`.**
- [x] Ningún `PASS` sin comando y exit code pegados (ver §3 y `Noche-PilotoDeAvisos.Contrato/evidencia/`).
- [x] Cada hito y cada subtarea que tocaste tienen su **Estado** actualizado, no sólo las
      microtareas — las 24 líneas de `**Estado:**` de la ficha de encargo se actualizaron en vivo,
      dos veces (cierre inicial y esta segunda pasada).
- [x] *¿Algún éxito declarado depende de algo que no ejecutaste?* No: los dos casos límite del
      primer cierre se resolvieron ejecutando lo que faltaba (una búsqueda más amplia) o
      cerrándose explícitamente por falta de insumo (`DESCARTADO`, no `HECHO` disfrazado).
- [x] Si editaste después de verificar, esa área volvió a `WRITTEN` y la reverificaste: la matriz
      de H3 se corrigió tras un primer commit con líneas de `.delivered` mal citadas, y se
      re-verificó con grep real antes de volver a commitear.
- [x] Ninguna salida pegada contiene datos reales de pacientes — todo el trabajo fue sobre código
      fuente, tipos y hashes.
- [x] Tu fila del [daily del equipo](../Daily-Noche-2026-09-19.md) está actualizada.

## 8. Seguimiento posterior al cierre — no reabre nada

**El turno está cerrado.** Esta sección sólo deja el puntero a un hallazgo puntual verificado después,
sobre el **adaptador real** de Mantra, que quedó **fuera** del carril entregado por la frontera que el
propio contrato declara (§5: el validador corre en el laboratorio, no dentro del adaptador).

| Hallazgo | Clasificación | Dónde | Decide |
|---|---|---|---|
| Con `recipient` vacío, `emit` devuelve `skippedReason: 'El destinatario no tiene cuenta de portal'`, aunque no se indicó ningún destinatario; y con **los dos** campos presentes se elige `userId` **en silencio**, sin señalar la violación de `EXACTLY_ONE_RECIPIENT_FIELD` | **`PRODUCTION_ADAPTER_GAP`** | [`docs/trabajo/2026-09-20-hallazgo-adapter-gap-recipient/`](../../../../docs/trabajo/2026-09-20-hallazgo-adapter-gap-recipient/REPORTE.md) | **Pablo** y **Justin** |

**No propone solución, no reabre H2 y no cambia ninguna microtarea de este daily.**
