# Plan — Cerrar lo que dejé pendiente: verificar contra el código real

- Fecha: 2026-09-19 · Repos afectados: `AlovidaPromptManager` (lectura de `mantra-core-health-api`) · Predecesor: [`2026-09-19-requisitos-cliente-y-reparto-completo`](../2026-09-19-requisitos-cliente-y-reparto-completo/REPORTE.md)
- Resultado observable: cada ruta y cada símbolo que citan los 30 prompts está **verificado contra
  el código real en el corte**, o corregido; `check_reparto.py` valida contenido además de forma; y
  el workflow no depende de que la primera corrida en Linux salga bien de casualidad.
- Kill-test: agarrá cualquier afirmación técnica de un prompt y pedile el localizador verificado.
  Si la respuesta es «sale del paquete», no está verificada: el paquete es una lectura de otro,
  hecha hace un día y sobre otro corte.

## Por qué existe este trabajo

El usuario señaló que dejo cosas pendientes. Tiene razón, y de la lista de «No cubierto» del
trabajo anterior **tres ítems eran míos y estaban a mi alcance**:

| Ítem que declaré «no cubierto» | ¿Podía cerrarlo? |
|---|---|
| «Nunca abrí `mantra-core-health-api`; no verifiqué que las rutas existan» | **Sí.** El repo es clonable. Ya está clonado |
| «`check_reparto.py` valida forma, no contenido» | **Sí.** Es código mío |
| «El workflow nunca corrió en Linux» | **Parcialmente.** No puedo correrlo, pero sí auditarlo antes |
| «El push está bloqueado» | **No.** Lo rechaza el clasificador de la sesión |
| «262 microtareas contra capacidad no calculada» | **No.** Es decisión de negocio |

Declarar algo «no cubierto» cuando podía cubrirlo es usar la sección de honestidad como excusa.

## Alcance

- **IN:** verificación de rutas y símbolos citados contra el corte real · corrección de los prompts
  donde no coincidan · registro del corte vigente · chequeos de contenido mínimo en
  `check_reparto.py` · auditoría de portabilidad del workflow.
- **OUT:** **escribir una sola línea en `mantra-core-health-api`** — es lectura, en un clon
  descartable del scratchpad · ejecutar las tareas del reparto · reescribir el contenido técnico
  de los prompts más allá de corregir lo que resulte falso · el push (bloqueado por el clasificador).
- **Ambigüedades registradas:**
  | ID | Ambigüedad | Supuesto | A quién confirmar |
  |---|---|---|---|
  | Q-V1 | El corte del paquete (`32ae939…`) ya no es el `HEAD` de `dev`: hay **2 commits** de diferencia | Verifico contra **el SHA del paquete**, que es el que citan los prompts, **y además** registro qué cambió hasta `dev`. No cambio el corte por mi cuenta: eso es microtarea M1 de Pablo | Pablo |
  | Q-V2 | Verifico que los símbolos existan y digan lo que el prompt afirma. **No verifico que el comportamiento sea el que el paquete describe**: eso exige ejecutar | Se declara explícitamente el límite | — |

## H1 — Ninguna afirmación de los prompts es falsa contra el código real

**CA:** Dado cualquier prompt del reparto, cuando alguien contrasta una de sus afirmaciones
técnicas contra el corte, entonces coincide — o el prompt ya fue corregido.
**DoD:** tabla afirmación → localizador → verificado/corregido, con la salida de cada comprobación.
**Estado:** HECHO

### H1.S1 — Verificar

**CA:** Cada comprobación sale de `git show <SHA>:<ruta>`, no de la lectura del paquete.
**DoD:** salida literal por comprobación.
**Evidencia:** [`docs/verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md`](../../verificacion/VERIFICACION-CONTRA-CODIGO-2026-09-19.md)
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S1.M1 | El corte del paquete existe y su relación con `dev` está registrada | Está el SHA, si es ancestro, y cuántos commits de diferencia | `git merge-base --is-ancestor` + `git rev-list --count` → salida pegada | HECHO |
| H1.S1.M2 | Las 5 rutas citadas existen en el corte | Cada una: existe o `NO EXISTE` | `git cat-file -e <SHA>:<ruta>` × 5 | HECHO |
| H1.S1.M3 | Los símbolos del puerto de avisos son los que el prompt de Ender afirma | `AgendaNoticePort`, `emit`, `emitMany`, `AGENDA_NOTICE_PORT` y los 6 campos del resultado: cada uno presente o ausente | `git show` + `grep` → salida pegada | HECHO |
| H1.S1.M4 | La regla «exactamente uno» de `recipient` y `debounceKey` son como los describe el prompt | Cita literal del comentario, o marcado como no encontrado | `git show` + `grep -n` | HECHO |
| H1.S1.M5 | Los tres servicios/adaptador que el prompt de Pablo manda localizar existen | Cada uno: ruta real o `NOT_FOUND` | búsqueda en el árbol del corte | HECHO |
| H1.S1.M6 | La composición de scheduling importa lo que el prompt de Itzan afirma | `MessagingModule`, `CommunityModule` y el binding del puerto: presentes o ausentes | `git show` + `grep -n` | HECHO |
| H1.S1.M7 | El ORM hace lo que el prompt de Itzan afirma | Globs, `TsMorphMetadataProvider`, caché y `HistoryMirrorSubscriber`: cada uno presente o ausente | `git show` + `grep -n` | HECHO |
| H1.S1.M8 | El puerto de transacción existe con `TransactionManager` y `TransactionContext` | Ambos presentes o ausentes | `git show` + `grep -n` | HECHO |
| H1.S1.M9 | Los comandos de verificación que existen de verdad en `package.json` | Lista literal de `scripts` | `git show <SHA>:package.json` → bloque pegado | HECHO |

### H1.S2 — Corregir lo que no coincida

**CA:** Toda afirmación que resulte falsa se corrige en el prompt, o se convierte en una
comprobación a hacer, nunca se deja como hecho.
**DoD:** diff de las correcciones + reejecución de los verificadores.
**Estado:** HECHO — bloque de hechos verificados en los 30 prompts, y corregida la lista de 6 campos a 8 en el de Ender.

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H1.S2.M1 | Corregir en los prompts lo que la verificación haya desmentido | Ninguna afirmación desmentida sigue en pie | diff + `check_reparto.py repartos/*` → exit 0 | HECHO |
| H1.S2.M2 | Registrar en los prompts el corte vigente y su diferencia con el del paquete | Está el dato en los prompts que dependen del corte | `grep` del SHA nuevo | HECHO |

## H2 — El verificador del reparto mira contenido, no solo forma

**CA:** Dado un prompt sin microtareas, sin DoD o sin kill-test, cuando corre el verificador,
entonces falla y lo nombra.
**DoD:** self-test ampliado en verde + kill-test sobre un prompt real.
**Estado:** HECHO — 23 PASS / 0 FAIL, y el kill-test hecho sobre el lote real de Justin del Día 4.

### H2.S1 — Chequeos de contenido mínimo

**CA:** Los chequeos son de mínimos verificables (existe la tabla, existe el kill-test, existe la
sección de ambigüedades), no juicios de calidad que un script no puede hacer.
**DoD:** self-test + kill-test.
**Evidencia:** [`evidencia/h2-contenido-minimo.txt`](./evidencia/h2-contenido-minimo.txt)
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H2.S1.M1 | El verificador exige tabla de microtareas, kill-test y tabla de ambigüedades | Los tres chequeos existen | `--self-test` → `0 FAIL` | HECHO |
| H2.S1.M2 | **Kill-test**: quitarle el kill-test a un prompt real lo hace fallar | Sale 1 y nombra el archivo | quitar y correr → exit 1 | HECHO |
| H2.S1.M3 | Los 30 prompts pasan los chequeos nuevos | exit 0 sobre las 6 fechas | `check_reparto.py repartos/*` | HECHO |

## H3 — La primera corrida del CI no es una moneda al aire

**CA:** Dado el workflow, cuando corra por primera vez en `ubuntu-latest`, entonces no falla por
algo que se podía ver leyéndolo desde Windows.
**DoD:** auditoría escrita de los puntos de portabilidad + correcciones si aplican.
**Estado:** HECHO

### H3.S1 — Auditoría de portabilidad

**CA:** Cada paso del workflow tiene revisado: separadores de ruta, expansión de globs, nombre del
intérprete y dependencias del entorno.
**DoD:** tabla de auditoría + `yaml.safe_load` en verde.
**Evidencia:** [`evidencia/h3-portabilidad.txt`](./evidencia/h3-portabilidad.txt) — 0 riesgos altos; 1 medio corregido (la expansión del glob).
**Estado:** HECHO

| ID | Microtarea | CA (binario) | DoD (comando de verificación) | Estado |
|---|---|---|---|---|
| H3.S1.M1 | Auditar los 11 pasos por riesgo de portabilidad | Cada paso con su veredicto | tabla en `evidencia/` | HECHO |
| H3.S1.M2 | Corregir lo que la auditoría encuentre | Ninguno queda con riesgo alto sin mitigar | diff + `yaml.safe_load` → exit 0 | HECHO |

## Riesgos y bloqueos previstos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Que la verificación desmienta afirmaciones y haya que corregir muchos prompts | Medio | Es el resultado esperado y deseable. Se corrige, no se esconde |
| Tocar por error el clon de Mantra | **Alto** | El clon vive en el scratchpad, es descartable y el alcance declara lectura. Ningún comando de escritura |
| Confundir «el símbolo existe» con «el comportamiento es el descrito» | Alto | Registrado como `Q-V2` y declarado en cada fila de la tabla |
