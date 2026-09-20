# REPORTE — El contrato del piloto (Ender, turno noche 2026-09-19)

**Estado: entregable.** 47/50 microtareas `HECHO`, 2 `BLOCKED` (dependen de una decisión de
Pablo, no técnica), 1 `A MEDIAS` (depende de una cita que debe producir Pablo y de un archivo
fuente que no existe en ningún repo accesible). Ningún hito quedó en `EN CURSO`. QA: **PASS** —
15/15 tests del validador en verde, `tsc` estricto sin errores, ADV-06 falló donde tenía que
fallar (dos veces, en corridas independientes), inmutabilidad histórica verificada cuatro veces.

Avance: **47 / 50 microtareas HECHO (94 %)**.

## Artefactos entregados

| Archivo | Qué es |
|---|---|
| `PLAN.md` | Plan de ejecución, IN/OUT, ambigüedad registrada, gates aplicables |
| `CONTRATO-AGENDA-NOTICE-PORT.md` | La ficha de contrato v1.0.0 completa (H1) |
| `GOBERNANZA-Y-COMPATIBILIDAD.md` | Política de compatibilidad, ADV-06, matriz, H3.S3 bloqueado (H3) |
| `VERSION-ESTABLE.md` | Versión estable congelada, pendientes con dueño (H4) |
| `PRUEBA-ADVERSA-Y-CIERRE-H5.md` | ADV-06 reejecutado, matriz final, cierre H5 |
| `CIERRE-FINAL.md` | Versión final, pendientes con dueño/fecha/consecuencia, riesgos residuales (H6) |
| `validador/` | Oráculo runtime independiente: 3 reglas, 15 tests, README (H2) |
| `evidencia/` | 13 archivos con salida literal de cada comando ejecutado |
| `Noche-PilotoDeAvisos.Contrato/ContratoValidadorYCompatibilidad.md` | Ficha de encargo original, con las 50 microtareas y 24 hitos/subtareas actualizados en vivo |

Todo commiteado en `AlovidaPromptManager`, rama `ender/contrato-agenda-notice-port` (12 commits,
HEAD `12c344c10672b510da5100168af187a5cecc7490`), sin push (no se pidió publicar).

## COMPLETADO (47)

| ID | Qué se logró | Comando | Resultado |
|---|---|---|---|
| H1.S1.M1 | Hash y commit del puerto congelados | `git show <SHA>:...` + `shasum -a 256` | PASS — `evidencia/h1-s1-m1-hash-y-commit.txt` |
| H1.S1.M2 | Firmas literales de `AgendaNoticePort`/`emit`/`emitMany`/`AGENDA_NOTICE_PORT` pegadas | `git show` del archivo completo | PASS — `evidencia/h1-s1-m2-archivo-literal-agenda-notice-port.ts` |
| H1.S1.M3 | Identidad de versión asignada (`v1.0.0`), no leída del archivo | Ficha §1 de `CONTRATO-AGENDA-NOTICE-PORT.md` | PASS — Estado `IMPLEMENTADO` explícito |
| H1.S1.M4 | Inventario de 9 archivos consumidores | `grep -rn` sobre el corte | PASS — `evidencia/h1-s1-m4-inventario-consumidores.txt` |
| H1.S2.M1 | Tabla de 8 campos reales de `AgendaNoticeResult` | Lectura literal + contraste contra el paquete (que listaba 6) | PASS — §3.3 del contrato |
| H1.S2.M2 | `delivered` documentado como sólo-in-app, con cita | Cita literal L89-91 | PASS — §3.3 |
| H1.S2.M3 | Regla exactamente-uno especificada como validación runtime | §5 del contrato + implementada en H2 | PASS |
| H1.S2.M4 | `emitMany`: orden/cardinalidad marcados `DECISION_REQUIRED`, comportamiento observado del adaptador documentado aparte | Lectura de la firma + del adaptador | PASS — §6 |
| H1.S2.M5 | `debounceKey`: cita + límite de confianza explícito, sin inventar TTL | Cita L74-78 + grep de `debounced` en `messaging` | PASS — §7 |
| H1.S2.M6 | Ficha de Autorización con hallazgo de `tenantId` opcional | Lectura de campos + del adaptador | PASS — §8 |
| H1.S2.M7 | Ficha de Errores: sin taxonomía tipificada, verificado que ningún consumidor compara por texto | `grep` de los 4 puntos de emisión | PASS — §9 |
| H1.S3.M2 | Ficha de Efectos posteriores + Compatibilidad | Lectura de L19-22 + L21-22 | PASS — §10 |
| H1.S3.M3 | Snapshot v1.0.0 publicado con hash y commit | 3 commits en `AlovidaPromptManager` | PASS — §0/§14 del contrato |
| H2.S1.M1 | `EXACTLY_ONE_RECIPIENT_FIELD` rechaza 0 y 2 campos | `node --test` | PASS — 2/2 casos, `evidencia/h2-validador-build-y-tests.txt` |
| H2.S1.M2 | `RESULT_SHAPE_EXACT` detecta campo de más/de menos/tipo incorrecto | `node --test` | PASS — 4 casos |
| H2.S1.M3 | Oráculo no se prueba a sí mismo (valores esperados tipeados a mano) | Revisión del propio test + comentario explícito | PASS |
| H2.S2.M1 | Caso "estructura válida, semántica inválida" (ADV-03 sustituido por regla real, documentado por qué) | `node --test` | PASS — 2 casos |
| H2.S2.M2 | "Respuesta incompatible del doble" combinando las 3 reglas | `node --test` | PASS — 2 casos |
| H2.S2.M3 | Reglas que el validador NO puede comprobar, listadas con motivo | `validador/README.md` | PASS |
| H2.S3.M1 | Artefacto de contrato versionado con hash publicado | commits en `AlovidaPromptManager` | PASS |
| H2.S3.M2 | Compatibilidad de lectura probada contra 6 formas reales de `recipient` de los consumidores de H1 | `node --test` | PASS — 1 caso, 6 sub-verificaciones |
| H3.S1.M1 | Clasificación lectura/escritura/significado con tabla | `GOBERNANZA-Y-COMPATIBILIDAD.md` §1 | PASS |
| H3.S1.M2 | Caso real de "agregar/quitar valor de kind" citado y verificado (grep de switch) | `evidencia/h3-s1-verificacion-matriz.txt` | PASS |
| H3.S2.M1 | ADV-06 en copia temporal: `tsc` falla exit 2 | `evidencia/h3-s2-adv06-copia-temporal.txt` | PASS |
| H3.S2.M2 | Artefactos históricos verificados idénticos (hash de blob) | `git rev-parse` antes/después | PASS |
| H3.S2.M3 | Matriz consumidor × versión completa, sin celdas en blanco | `GOBERNANZA-Y-COMPATIBILIDAD.md` §3 | PASS |
| H4.S1.M1 | Ficha completa, sin campos olvidados | `VERSION-ESTABLE.md` §2 | PASS |
| H4.S1.M2 | Estado `IMPLEMENTADO` sin mezclar con `OBJETIVO ACORDADO` | `VERSION-ESTABLE.md` §3 | PASS |
| H4.S2.M1 | Versión estable publicada con hash y commit | `VERSION-ESTABLE.md` §1 | PASS |
| H4.S2.M2 | Matriz actualizada (referenciada, sin duplicar) | `VERSION-ESTABLE.md` §4 | PASS |
| H4.S2.M3 | Versiones anteriores verificadas sin cambios | `evidencia/h4-s2-inmutabilidad-v1.txt` | PASS |
| H4.S3.M1 | `DECISION_REQUIRED` listados con dueño | `VERSION-ESTABLE.md` §5 | PASS |
| H4.S3.M2 | Plan de transición (expand/migrate/contract) para el reemplazo de P1 | `VERSION-ESTABLE.md` §6 | PASS |
| H5.S1.M1 | ADV-06 reejecutado independientemente, mismo resultado | `evidencia/h5-s1-adv06-reejecutado-e-inmutabilidad.txt` | PASS |
| H5.S1.M2 | Inmutabilidad reverificada | mismo archivo | PASS |
| H5.S1.M3 | Consumidor que falla y su error, tabulado | `PRUEBA-ADVERSA-Y-CIERRE-H5.md` §2 | PASS |
| H5.S2.M1 | Matriz final, sin celdas en blanco | `PRUEBA-ADVERSA-Y-CIERRE-H5.md` §4 | PASS |
| H5.S2.M2 | Estrategia de transición por incompatibilidad conocida | `PRUEBA-ADVERSA-Y-CIERRE-H5.md` §5 | PASS |
| H5.S3.M1 | `DECISION_REQUIRED` al cierre, todos con dueño | `PRUEBA-ADVERSA-Y-CIERRE-H5.md` §6 | PASS |
| H5.S3.M2 | Estado final declarado sin mezclar categorías | `PRUEBA-ADVERSA-Y-CIERRE-H5.md` §6 | PASS |
| H6.S1.M1 | Versión final publicada con hash y commit | `CIERRE-FINAL.md` §1 | PASS |
| H6.S1.M2 | Ficha completa | `CIERRE-FINAL.md` §1 | PASS |
| H6.S1.M3 | Inmutabilidad verificada una cuarta vez | `evidencia/h6-s1-inmutabilidad-final.txt` | PASS |
| H6.S2.M1 | 6 `DECISION_REQUIRED` listados, todos con dueño | `CIERRE-FINAL.md` §2 | PASS |
| H6.S2.M2 | Consecuencia de no decidir, por pendiente | `CIERRE-FINAL.md` §2 | PASS |
| H6.S3.M1 | 5 riesgos residuales con impacto y mitigación (o su ausencia) | `CIERRE-FINAL.md` §3 | PASS |
| H6.S3.M2 | Consumidores expuestos por riesgo | `CIERRE-FINAL.md` §3 | PASS |

## A MEDIAS (1)

### H1.S3.M1 — Recibir de Pablo la tensión de durabilidad y dejarla sin resolver

- **Qué anda:** la cita del lado "código" está verificada y pegada, con localizador exacto
  (`agenda-notice.port.ts` L19-22: *"Un aviso que falla se registra y se descarta; jamás revierte
  la reserva..."*). El estado `DECISION_REQUIRED` está registrado, sin elegir un lado.
- **Qué no anda:** la cita del lado "metaprompt" (durabilidad exigida para efectos obligatorios)
  no está pegada.
- **Qué falta exactamente:** que exista `METAPROMPT_PARA_ASTRA(1).md` en algún repo accesible
  desde esta sesión (búsqueda `find` recursiva sobre toda `Mantra Core Technologies/`: cero
  resultados), **o** que Pablo complete su propia microtarea H1.S3.M4 (que sigue en `TODO` al
  cierre de este turno, verificado leyendo su ficha) y comparta la cita.
- **Dónde quedó:** documentado en `CONTRATO-AGENDA-NOTICE-PORT.md` §11, con el hueco explícito y
  a quién depende. No bloquea el resto del contrato: el estado `DECISION_REQUIRED` de Q-06 es
  válido con una sola cita mientras se consigue la segunda.

## PENDIENTE (2)

| ID | Estado | Qué lo destraba |
|---|---|---|
| H3.S3.M1 | `BLOCKED` | Que Pablo elija la segunda capacidad (su propia ficha, hito H3, sigue en `TODO`) |
| H3.S3.M2 | `BLOCKED` | Depende de H3.S3.M1: no se puede registrar qué se reusa de una capacidad que no existe |

## Desvíos del plan

1. **Sustitución del caso "ADV-03: tenant incorrecto"** por `CHAT_FIELDS_ONLY_FOR_BOOKING_STATE_CHANGED`
   (H2.S2.M1). Motivo: el contrato no define qué hace a un tenant "correcto" a este nivel;
   inventar esa regla está prohibido por la propia ficha de encargo. Documentado en
   `validador/README.md` y en el propio código del validador.
2. **Corrección en caliente de la matriz de H3** (§3 de `GOBERNANZA-Y-COMPATIBILIDAD.md`): la
   primera redacción citaba líneas de `.delivered` en `scheduling-bookings.service.ts` y
   `scheduling-catalog.service.ts` sin haberlas verificado; el grep real mostró que esos dos
   archivos **descartan** el resultado por completo. Se corrigió antes de commitear (ver
   `evidencia/h3-s1-verificacion-matriz.txt`).
3. **`ARQUITECTURA_Y_CONTRATOS.md` no existe.** La estructura de la ficha de contrato se
   reconstruyó a partir de los campos que la propia ficha de encargo enumera microtarea por
   microtarea, no del template ausente (nota de apertura de `CONTRATO-AGENDA-NOTICE-PORT.md`).
4. **Workspace de Mantra:** el checkout compartido (`mantra-core-health-api/`) mostró señales de
   otra sesión activa (`check-exclusive-checkout.py` exit 1). Se creó un worktree propio,
   detached en el `TARGET_REF` exacto, en vez de escribir sobre el checkout compartido.

## Riesgos residuales

Ver `CIERRE-FINAL.md` §3 (5 riesgos, cada uno con impacto, mitigación o su ausencia declarada, y
consumidores expuestos).

## Decisiones y ambigüedades

1. **OUT vs H2 (validador/doble):** registrada y resuelta con evidencia en `PLAN.md`, a confirmar
   con Pablo.
2. **`TARGET_REF` vs `origin/dev`:** `dev` local coincide con el `TARGET_REF` de la ficha; el
   remoto está 2 commits adelante, ninguno tocando el puerto según su asunto (no verificado por
   diff completo). Cuál es el corte de trabajo lo fija Pablo, tal como dice la propia
   verificación previa del 2026-09-19.
3. **`ARQUITECTURA_Y_CONTRATOS.md` ausente:** afecta potencialmente a otras fichas del reparto
   (confirmado: la de Itzan lo cita 4 veces). Registrado para que el equipo lo sepa, no es
   específico de mi contrato.

## No cubierto

- No verifiqué si `NotificationsService` (módulo `messaging`, fuera de mi puerto) tiene alguna
  defensa propia contra `tenantId` ausente — quedó fuera de alcance por disciplina de límite de
  confianza, no por descuido.
- No ejecuté `yarn test`/`yarn typecheck` de `mantra-core-health-api` — no toqué ese repo y no
  hacía falta para este carril (es puramente lectura + documentación + laboratorio aparte).
- No verifiqué los dos commits que separan `origin/dev` de `TARGET_REF` línea por línea (sólo por
  asunto de commit) — declarado como hipótesis, no como hecho, en el propio contrato §1.

## Datos sensibles

Ninguna salida pegada en este turno contiene datos reales de pacientes: todo el trabajo fue sobre
código fuente, nombres de tipos y hashes. No hizo falta enmascarar nada.
